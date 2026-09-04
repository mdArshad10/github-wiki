import "dotenv/config";
import { z } from "zod";

/**
 * Keep every environment variable used by the application in this schema.
 * Variables without a default are required and will fail fast at startup.
 */
const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: z.coerce
        .number()
        .int("PORT must be a whole number")
        .min(1, "PORT must be between 1 and 65535")
        .max(65535, "PORT must be between 1 and 65535"),
    MONGODB_URI: z.string().trim().min(1, "MONGODB_URI is required"),
    GITHUB_CLIENT_SECRET:z.string().trim().min(1,"GITHUB_CLIENT_SECRET is required"),
    GITHUB_CLIENT_ID:z.string().trim().min(1,"GITHUB_CLIENT_ID is required"),
    BETTER_AUTH_SECRET:z.string().trim().min(1,"BETTER_AUTH_SECRET is required"),
    BETTER_AUTH_URL:z.string().trim().min(1,"BETTER_AUTH_URL is required"),
    INNGEST_DEV: z.coerce
        .number()
        .int("INNGEST_DEV must be a whole number")
        .default(1),
    MEM0_API_KEY:z.string().trim().min(1, "MEM0_API_KEY is required"),
    OPENAI_API_KEY:z.string().trim().min(1, "OPENAI_API_KEY is required"),
    ORIGIN:z.string().trim().min(1,'ORIGIN is required')
});


const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error("\n❌ Invalid environment variables:\n");

    for (const issue of parsedEnv.error.issues) {
        const variable = issue.path.join(".") || "environment";
        const message = process.env[variable] === undefined
            ? "is required"
            : issue.message;

        console.error(`  ${variable}: ${message}`);
    }

    console.error(
        "\nAdd the missing values to your environment (or your .env file) and try again.\n",
    );
    process.exit(1);
}

// console.log('==== get all data inside the parsedEnv ====')
// console.log(parsedEnv.data)

export const env = parsedEnv.data;


export type Env = typeof env;
