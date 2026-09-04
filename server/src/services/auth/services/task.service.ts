import { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import type { TaskDocument } from "@/shared/models/task.model";
import {
    type CreateTaskInput,
    type UpdateTaskInput,
} from "../validation/task.validation";
import { TaskRepository, type TaskRepositoryContract } from "@/services/task/repositories/task.repository";

export class TaskService {
    constructor(
        private readonly taskRepository: TaskRepositoryContract = new TaskRepository(),
    ) {}

    async getTasks(): Promise<TaskDocument[]> {
        return this.taskRepository.findAll();
    }

    async getTaskById(id: string): Promise<TaskDocument> {
        this.validateId(id);

        const task = await this.taskRepository.findById(id);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    }

    async createTask(input: CreateTaskInput): Promise<TaskDocument> {
        return this.taskRepository.create(input);
    }

    async updateTask(id: string, input: UpdateTaskInput): Promise<TaskDocument> {
        this.validateId(id);

        const task = await this.taskRepository.updateById(id, input);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    }

    async deleteTask(id: string): Promise<TaskDocument> {
        this.validateId(id);

        const task = await this.taskRepository.deleteById(id);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    }

    private validateId(id: string): void {
        if (!Types.ObjectId.isValid(id)) {
            throw new AppError("Invalid task id", 400);
        }
    }
}
