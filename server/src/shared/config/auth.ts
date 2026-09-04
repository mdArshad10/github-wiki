import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { env } from "@/shared/config/env";
import { UserProfile } from "@/shared/models/user.model";

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
	},
	trustedOrigins: ["http://localhost:5173"],
	databaseHooks: {
		user: {
			create: {
				after: async (user) => {
					await UserProfile.create({
						authUserId: user.id,
						githubUsername: user.name, // Better Auth maps GitHub's "login" here by default
						email: user.email,
						avatarUrl: user.image,
					});
				},
			},
		},
	},
});
