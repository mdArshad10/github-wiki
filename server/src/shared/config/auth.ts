import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "@/shared/config/env";

const client = new MongoClient(env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
});
