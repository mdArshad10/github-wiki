import { model, Schema, type HydratedDocument } from "mongoose";

export interface ITask {
    title: string;
    description?: string;
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, "Task title is required"],
            trim: true,
            maxlength: [120, "Task title cannot exceed 120 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Task description cannot exceed 2000 characters"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

export type TaskDocument = HydratedDocument<ITask>;
export const TaskModel = model<ITask>("Task", taskSchema);
