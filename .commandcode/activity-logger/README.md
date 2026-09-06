# Activity Logger — Step-by-Step Implementation Guide

Goal: record activity events into Redis (hot-path writes), flush them to
MongoDB in bulk on an interval, and show them on the frontend via polling.
"Live" here means at most `flush interval + poll interval` of lag.

- Redis list is the buffer (`activity:buffer`).
- A `setInterval` worker drains the buffer and runs `insertMany` into Mongo.
- Frontend polls `GET /api/v1/activities` every 15s.
- No SSE, no WebSocket, no pub/sub, no Inngest.

Follow the steps in order. Code blocks are meant to be copied and adapted.

---

## Step 0 — Verify prerequisites

Make sure these are available:

```bash
cd /home/arshad/project/github-wiki/server
docker compose up -d redis
docker compose ps
```

Redis must be running on `127.0.0.1:6379` (matches your `docker-compose.yml`).

---

## Step 1 — Add the ioredis dependency

File: `server/package.json`

Add `"ioredis": "^6.0.0"` inside the `dependencies` object:

```json
"ioredis": "^6.0.0",
```

Then install:

```bash
cd server
bun install
```

> Note: `ioredis` is already in your `package.json` and installed, so this step
> is usually already done.

---

## Step 2 — Add environment variables

File: `server/src/shared/config/env.ts`

Add these fields inside the `envSchema` object (after `ORIGIN` is fine):

```ts
REDIS_URL: z.string().trim().min(1, "REDIS_URL is required"),
ACTIVITY_BUFFER_KEY: z.string().trim().min(1).default("activity:buffer"),
ACTIVITY_BUFFER_TTL_SECONDS: z.coerce.number().int().min(60).default(3600),
ACTIVITY_FLUSH_INTERVAL_MS: z.coerce.number().int().min(1000).default(30000),
ACTIVITY_MAX_BATCH: z.coerce.number().int().min(1).default(500),
```

`REDIS_URL` is the ioredis connection string, e.g.
`redis://127.0.0.1:6379` (or `rediss://...` for TLS, and optionally with a
password: `redis://:password@host:port`).

`ACTIVITY_BUFFER_TTL_SECONDS` is the safety net for the buffer list: if the
flush worker dies and the list is never drained, Redis expires the key after
this many seconds instead of holding events forever.

Add `REDIS_URL` to your `.env` file:

```dotenv
REDIS_URL=redis://127.0.0.1:6379
```

---

## Step 3 — Create the Redis client

New file: `server/src/shared/config/redis.ts`

This mirrors the singleton pattern in `database.ts` but uses **ioredis** with
retries and timeouts. `lazyConnect: true` means the connection is only opened
when `connect()` is called explicitly — this makes startup predictable and
lets us report connection failures cleanly.

```ts
import Redis from "ioredis";
import { env } from "@/shared/config/env";

let client: Redis | null = null;
let connectionPromise: Promise<Redis> | null = null;

export function getRedisClient(): Promise<Redis> {
  if (client && client.status === "ready") {
    return Promise.resolve(client);
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  client = new Redis(env.REDIS_URL, {
    lazyConnect: true,
    connectTimeout: 10_000,
    commandTimeout: 5_000,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      // Cap retries; return null to stop reconnecting after 10 attempts.
      if (times > 10) {
        return null;
      }
      return Math.min(times * 500, 5_000);
    },
  });

  client.on("connect", () => {
    console.log("Redis connecting");
  });

  client.on("ready", () => {
    console.log("Redis connected");
  });

  client.on("error", (error) => {
    console.error("Redis client error:", error);
  });

  connectionPromise = client
    .connect()
    .then(() => client as Redis)
    .catch((error) => {
      connectionPromise = null;
      client = null;
      throw error;
    });

  return connectionPromise;
}

export async function closeRedisClient(): Promise<void> {
  connectionPromise = null;

  if (client) {
    await client.quit().catch(() => client?.disconnect());
    console.log("Redis connection closed");
  }

  client = null;
}
```

Notes on the ioredis options used above:

- `retryStrategy` — controls reconnection delay after a connection loss.
  Return a number to retry after that many ms, or `null` to give up.
- `connectTimeout` — how long to wait for the initial connection before
  failing (default 10s).
- `commandTimeout` — how long a command may run before throwing
  `Command timed out` (default 5s).
- `maxRetriesPerRequest` — how many reconnect attempts a queued command may
  survive before failing (default 3).
- `lazyConnect` — connect only when `connect()` is called.

---

## Step 4 — Create the Activity model

New file: `server/src/shared/models/activity.model.ts`

Follow the style of `repos.model.ts` (timestamps, `versionKey: false`).

```ts
import { model, Schema, Types, type HydratedDocument } from "mongoose";

export enum ActivityTone {
  Green = "green",
  Cyan = "cyan",
  Amber = "amber",
  Red = "red",
  Muted = "muted",
}

export interface IActivity {
  userId: Types.ObjectId;
  repoId: Types.ObjectId | null;
  repository: string;
  action: string;
  detail: string | null;
  tone: ActivityTone;
  createdAt?: Date;
  updatedAt?: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "userId is required"],
      index: true,
    },
    repoId: {
      type: Schema.Types.ObjectId,
      ref: "repo",
      default: null,
    },
    repository: {
      type: String,
      required: [true, "repository is required"],
      trim: true,
    },
    action: {
      type: String,
      required: [true, "action is required"],
      trim: true,
    },
    detail: {
      type: String,
      default: null,
      trim: true,
    },
    tone: {
      type: String,
      enum: Object.values(ActivityTone),
      default: ActivityTone.Muted,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

activitySchema.index({ userId: 1, createdAt: -1 });

export type ActivityDocument = HydratedDocument<IActivity>;
export const ActivityModel = model<IActivity>("Activity", activitySchema);
```

---

## Step 5 — Create the activity feature folder

Create these folders to mirror your existing `user`/`repo` feature structure:

```bash
mkdir -p server/src/services/activity/{controllers,dependencies,repositories,routes,services,validation}
```

The final structure should be:

```text
server/src/services/activity/
├── controllers/
│   └── activity.controller.ts
├── dependencies/
│   └── activity.dependencies.ts
├── repositories/
│   └── activity.repository.ts
├── routes/
│   └── activity.routes.ts
├── services/
│   └── activity.service.ts
└── validation/
    └── activity.validation.ts
```

---

## Step 6 — Validation

New file: `server/src/services/activity/validation/activity.validation.ts`

```ts
import { z } from "zod";

export const recordActivitySchema = z
  .object({
    repository: z.string().trim().min(1, "repository is required"),
    action: z.string().trim().min(1, "action is required"),
    detail: z.string().trim().optional().nullable(),
    tone: z.enum(["green", "cyan", "amber", "red", "muted"]).optional(),
    repoId: z.string().trim().optional().nullable(),
  })
  .strict();

export const listActivityQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type RecordActivityInput = z.infer<typeof recordActivitySchema>;
export type ListActivityQuery = z.infer<typeof listActivityQuerySchema>;
```

---

## Step 7 — Repository

New file: `server/src/services/activity/repositories/activity.repository.ts`

```ts
import {
  ActivityModel,
  type ActivityDocument,
  type IActivity,
} from "@/shared/models/activity.model";

export interface ActivityRepositoryContract {
  findRecent(userId: string, limit: number): Promise<ActivityDocument[]>;
  bulkInsert(docs: IActivity[]): Promise<ActivityDocument[]>;
}

export class ActivityRepository implements ActivityRepositoryContract {
  async findRecent(userId: string, limit: number): Promise<ActivityDocument[]> {
    return ActivityModel.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async bulkInsert(docs: IActivity[]): Promise<ActivityDocument[]> {
    if (docs.length === 0) return [];
    return ActivityModel.insertMany(docs);
  }
}
```

---

## Step 8 — Service

New file: `server/src/services/activity/services/activity.service.ts`

This is the core of the feature: `recordActivity` writes to Redis only, and
`flushBuffer` drains Redis into Mongo in bulk.

```ts
import { Types } from "mongoose";
import type Redis from "ioredis";
import { env } from "@/shared/config/env";
import { ActivityTone, type IActivity } from "@/shared/models/activity.model";
import {
  ActivityRepository,
  type ActivityRepositoryContract,
} from "@/services/activity/repositories/activity.repository";
import type { RecordActivityInput } from "@/services/activity/validation/activity.validation";

const DRAIN_SCRIPT = `
local items = redis.call('LRANGE', KEYS[1], 0, ARGV[1] - 1)
if #items > 0 then
  redis.call('LTRIM', KEYS[1], #items, -1)
end
return items
`;

export class ActivityService {
  constructor(
    private readonly activityRepository: ActivityRepositoryContract = new ActivityRepository(),
    private readonly redisClientPromise: Promise<Redis>,
  ) {}

  async recordActivity(input: RecordActivityInput): Promise<void> {
    const redis = await this.redisClientPromise;

    const activity: IActivity = {
      userId: new Types.ObjectId(input.userId),
      repoId: input.repoId ? new Types.ObjectId(input.repoId) : null,
      repository: input.repository,
      action: input.action,
      detail: input.detail ?? null,
      tone: (input.tone as ActivityTone) ?? ActivityTone.Muted,
    };

    const bufferKey = env.ACTIVITY_BUFFER_KEY;
    const serialized = JSON.stringify(activity);

    // Push the event and refresh the TTL in one round trip so a dead worker
    // can never leave an unbounded, never-expiring buffer behind.
    await redis
      .multi()
      .rpush(bufferKey, serialized)
      .expire(bufferKey, env.ACTIVITY_BUFFER_TTL_SECONDS)
      .exec();
  }

  async getRecentActivity(
    userId: string,
    limit: number,
  ): Promise<IActivity[]> {
    return this.activityRepository.findRecent(userId, limit);
  }

  async flushBuffer(): Promise<number> {
    const redis = await this.redisClientPromise;
    const raw = (await redis.eval(
      DRAIN_SCRIPT,
      1,
      env.ACTIVITY_BUFFER_KEY,
      env.ACTIVITY_MAX_BATCH,
    )) as string[];

    if (!raw || raw.length === 0) {
      return 0;
    }

    const docs = raw
      .map((item) => JSON.parse(item) as IActivity)
      .filter((item) => item.userId && item.repository && item.action);

    await this.activityRepository.bulkInsert(docs);
    return docs.length;
  }
}
```

Important: update `RecordActivityInput` in `validation/activity.validation.ts`
to include `userId` as well. The cleanest way is to add an internal type that
extends the public input:

```ts
export type RecordActivityInput = z.infer<typeof recordActivitySchema> & {
  userId: string;
};
```

This keeps `userId` out of the HTTP body (the controller injects it from
`req.user.id`) while still making the service fully typed.

The ioredis `multi()` + `rpush` + `expire` call is atomic: both commands run
back-to-back on the server. The `expire` refreshes the TTL on every push, so
as long as events keep flowing the buffer stays alive; if events stop and the
flush worker fails, Redis cleans up the key after
`ACTIVITY_BUFFER_TTL_SECONDS`.

---

## Step 9 — Controller

New file: `server/src/services/activity/controllers/activity.controller.ts`

```ts
import asyncHandler from "@/shared/middlewares/async-handler";
import { ApiResponse } from "@/shared/utils/api-response";
import type { ActivityService } from "@/services/activity/services/activity.service";
import { listActivityQuerySchema } from "@/services/activity/validation/activity.validation";

export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  readonly getRecent = asyncHandler(async (req, res) => {
    const { limit } = listActivityQuerySchema.parse(req.query);
    const activities = await this.activityService.getRecentActivity(
      req.user.id,
      limit,
    );

    res
      .status(200)
      .json(ApiResponse.success(activities, 200, "get recent activities"));
  });
}
```

---

## Step 10 — Routes

New file: `server/src/services/activity/routes/activity.routes.ts`

```ts
import { Router } from "express";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";
import dependencies from "@/services/activity/dependencies/activity.dependencies";

const router = Router();
const { activityController } = dependencies.controller;

router.get("/", authMiddleware, activityController.getRecent);

export default router;
```

---

## Step 11 — Dependency container

New file: `server/src/services/activity/dependencies/activity.dependencies.ts`

```ts
import { getRedisClient } from "@/shared/config/redis";
import { ActivityController } from "@/services/activity/controllers/activity.controller";
import { ActivityRepository } from "@/services/activity/repositories/activity.repository";
import { ActivityService } from "@/services/activity/services/activity.service";

class Container {
  static init() {
    const repositories = {
      activityRepository: new ActivityRepository(),
    };

    const services = {
      activityService: new ActivityService(
        repositories.activityRepository,
        getRedisClient(),
      ),
    };

    const controller = {
      activityController: new ActivityController(services.activityService),
    };

    return {
      repositories,
      services,
      controller,
    };
  }
}

const initialized = Container.init();
const { activityController } = initialized.controller;

export { Container, activityController };
export default initialized;
```

---

## Step 12 — Register the route

File: `server/src/app.ts`

Add the import near the other routers:

```ts
import activityRouter from "@/services/activity/routes/activity.routes";
```

Add the mount near the other `app.use("/api/v1/...")` lines:

```ts
app.use("/api/v1/activities", activityRouter);
```

---

## Step 13 — Start and stop the flush worker

File: `server/src/server.ts`

Add these imports at the top:

```ts
import { getRedisClient, closeRedisClient } from "@/shared/config/redis";
import activityDependencies from "@/services/activity/dependencies/activity.dependencies";
import { env } from "@/shared/config/env";
```

Add helper functions for the worker:

```ts
let activityFlushInterval: ReturnType<typeof setInterval> | null = null;

async function startActivityFlushWorker() {
  await getRedisClient();
  const { activityService } = activityDependencies.services;

  activityFlushInterval = setInterval(() => {
    activityService.flushBuffer().catch((error) => {
      console.error("Failed to flush activity buffer:", error);
    });
  }, env.ACTIVITY_FLUSH_INTERVAL_MS);
}

async function stopActivityFlushWorker() {
  if (activityFlushInterval) {
    clearInterval(activityFlushInterval);
    activityFlushInterval = null;
  }

  const { activityService } = activityDependencies.services;
  await activityService.flushBuffer().catch((error) => {
    console.error("Failed to flush activity buffer on shutdown:", error);
  });

  await closeRedisClient();
}
```

Call `startActivityFlushWorker()` after `await connectDatabase();` in `main`,
before `server.listen(...)`:

```ts
await initializeConnection();
await startActivityFlushWorker();
```

And call `stopActivityFlushWorker()` inside `gracefulShutdown`, before
`initializeConnectionClose()`:

```ts
server.close(async () => {
  console.info("HTTP server closed");

  try {
    await stopActivityFlushWorker();
    await initializeConnectionClose();
    ...
```

---

## Step 14 — First integration point

File: `server/src/services/repo/services/repo.service.ts`

Add an import:

```ts
import activityDependencies from "@/services/activity/dependencies/activity.dependencies";
```

At the end of `createAllRepo`, after `bulkInsert` succeeds, record one event:

```ts
const inserted = await this.repoRepository.bulkInsert(allInsertRepo);

const { activityService } = activityDependencies.services;
await activityService.recordActivity({
  userId: userProfile.authUserId,
  repository: String(allInsertRepo.length > 0 ? "workspace" : "workspace"),
  action: "repository synced",
  detail: `${allInsertRepo.length} repositories fetched`,
  tone: "cyan",
});

return inserted;
```

Adapt `repository` and `detail` to whatever makes sense. The key thing is that
this proves the full path end-to-end.

---

## Step 15 — Frontend API layer

New file: `frontend/src/features/dashboard/api/activityApi.ts`

```ts
import { apiClient } from "@/lib/api-client"

export type ActivityTone = "green" | "cyan" | "amber" | "red" | "muted"

export type Activity = {
  _id: string
  userId: string
  repoId: string | null
  repository: string
  action: string
  detail: string | null
  tone: ActivityTone
  createdAt: string
}

type ApiResponse<T> = {
  success: boolean
  data: T
  message: string
  statusCode: number
  timestamp: string
}

function getResponseData<T>(response: ApiResponse<T>) {
  if (!response.success) {
    throw new Error(response.message)
  }

  return response.data
}

export const activityApi = {
  async list() {
    const response =
      await apiClient.get<ApiResponse<Activity[]>>("/activities")

    return getResponseData(response.data)
  },
}
```

New file: `frontend/src/features/dashboard/api/activity.key.ts`

```ts
export const activityKeys = {
  all: ["activity"] as const,
  lists: () => [...activityKeys.all, "list"] as const,
  list: () => [...activityKeys.lists()] as const,
}
```

New file: `frontend/src/features/dashboard/api/activity.query.ts`

```ts
import { useQuery } from "@tanstack/react-query"
import { activityKeys } from "./activity.key"
import { activityApi } from "./activityApi"

export const useActivityQuery = () =>
  useQuery({
    queryKey: activityKeys.list(),
    queryFn: activityApi.list,
    refetchInterval: 15000,
  })
```

---

## Step 16 — Wire real data into the Activity page

File: `frontend/src/features/dashboard/pages/activity-page.tsx`

Replace the static `activityEvents` array and the hardcoded rows with data from
`useActivityQuery()`.

High-level changes:

1. Import the query:

```ts
import { useActivityQuery } from "@/features/dashboard/api/activity.query"
```

2. Add a time formatter:

```ts
function formatTime(value: string | undefined) {
  if (!value) return "--:--:--"
  return new Date(value).toLocaleTimeString("en-GB", { hour12: false })
}
```

3. Replace the `map` over `activityEvents` with:

```tsx
const { data: activities, isLoading } = useActivityQuery()

// inside the list:
{(activities ?? []).map((activity) => (
  <div
    key={activity._id}
    className="grid min-h-13.5 grid-cols-[72px_10px_minmax(0,1fr)] items-center gap-3 border-b border-(--terminal-rule-soft) last:border-b-0"
  >
    <span className="font-mono text-[9px] leading-none text-(--terminal-faint)">
      {formatTime(activity.createdAt)}
    </span>
    <span
      className={`h-1.5 w-1.5 rounded-full bg-[var(--terminal-${activity.tone})]`}
    />
    <p className="m-0 font-mono text-[10px] leading-[1.4] text-(--terminal-muted)">
      <strong className="font-medium text-(--terminal-text)">
        {activity.repository}
      </strong>{" "}
      {activity.action}{" "}
      {activity.detail && (
        <em className="text-(--terminal-faint) not-italic">
          {activity.detail}
        </em>
      )}
    </p>
  </div>
))}
```

4. Optionally show a loading state when `isLoading` is true.

Keep the three stat cards unchanged for now — they aren't driven by the log
yet.

---

## Step 17 — Verify

```bash
cd server
bun run dev
```

Then confirm:

1. Logs show both `MongoDB connected` and `Redis connected`.
2. Trigger `GET /api/v1/repos/fetch-repos` while authenticated — this records
   one activity event into Redis.
3. Within the flush interval (default 30s), the event appears in Mongo and via
   `GET /api/v1/activities`.
4. Open the dashboard Activity page — the list updates within ~15s + flush
   interval (well under 1 minute).
5. Restart the server and confirm Redis closes cleanly on shutdown (no errors).
