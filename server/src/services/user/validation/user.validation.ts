import { z } from "zod";

export const updateUserSchema = z
	.object({
		githubUsername: z.string().trim().min(1).max(100).optional(),
		email: z.string().trim().email().optional(),
		avatarUrl: z.string().trim().url().nullable().optional(),
		installationId: z.number().int().positive().optional(),
	})
	.strict()
	.refine((user) => Object.keys(user).length > 0, {
		message: "At least one user field is required",
	});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
