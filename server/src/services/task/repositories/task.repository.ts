import { TaskModel, type TaskDocument } from "@/shared/models/task.model";
import type { CreateTaskInput, UpdateTaskInput } from "@/services/task/validation/task.validation";

export interface TaskRepositoryContract {
    findAll(): Promise<TaskDocument[]>;
    findById(id: string): Promise<TaskDocument | null>;
    create(input: CreateTaskInput): Promise<TaskDocument>;
    updateById(id: string, input: UpdateTaskInput): Promise<TaskDocument | null>;
    deleteById(id: string): Promise<TaskDocument | null>;
}

export class TaskRepository implements TaskRepositoryContract {
    async findAll(): Promise<TaskDocument[]> {
        return TaskModel.find().sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<TaskDocument | null> {
        return TaskModel.findById(id).exec();
    }

    async create(input: CreateTaskInput): Promise<TaskDocument> {
        return TaskModel.create(input);
    }

    async updateById(
        id: string,
        input: UpdateTaskInput,
    ): Promise<TaskDocument | null> {
        return TaskModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<TaskDocument | null> {
        return TaskModel.findByIdAndDelete(id).exec();
    }
}
