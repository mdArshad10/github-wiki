import { z } from "zod";

export const createTaskSchema = z
    .object({
        title: z.string().trim().min(1, "Task title is required").max(120),
        description: z.string().trim().max(2000).optional(),
        completed: z.boolean().default(false),
    })
    .strict();

export const updateTaskSchema = z
    .object({
        title: z.string().trim().min(1, "Task title cannot be empty").max(120).optional(),
        description: z.string().trim().max(2000).optional(),
        completed: z.boolean().optional(),
    })
    .strict()
    .refine((task) => Object.keys(task).length > 0, {
        message: "At least one task field is required",
    });

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
