import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "@/shared/config/env";

const client = new MongoClient(env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
    },
      // tell the backend which frontend origins are allowed to make auth requests
    trustedOrigins: env.ORIGIN.split(","),
  },
});
