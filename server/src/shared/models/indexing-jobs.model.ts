// | Field | Type | Notes |
// |---|---|---|
// | `_id` | ObjectId | |
// | `repoId` | ObjectId | ref → `repos` |
// | `status` | Enum | `running` \| `succeeded` \| `failed` |
// | `triggeredBy` | Enum | `manual` \| `manual_reindex` |
// | `error` | String \| null | |
// | `startedAt` / `completedAt` | Date | |