import { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import type { TaskDocument } from "@/shared/models/task.model";
import {
    type CreateTaskInput,
    type UpdateTaskInput,
} from "../validation/task.validation";
import { RepoRepository, type RepoRepositoryContract } from "../repositories/repo.repository";
import type { RepoDocument } from "@/shared/models/repos.model";


export class RepoService {
    constructor(
        private readonly repoRepository: RepoRepositoryContract = new RepoRepository(),
    ) {}

    async getAllRepos(): Promise<RepoDocument[]> {
        return this.repoRepository.findAll();
    }

    async getTaskById(id: string): Promise<RepoDocument> {
        this.validateId(id);

        const task = await this.repoRepository.findById(id);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    }

    async createTask(input: CreateTaskInput): Promise<RepoDocument> {
        return this.repoRepository.create(input);
    }

    async updateTask(id: string, input: UpdateTaskInput): Promise<RepoDocument> {
        this.validateId(id);

        const task = await this.repoRepository.updateById(id, input);
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        return task;
    }

    async deleteTask(id: string): Promise<RepoDocument> {
        this.validateId(id);

        const task = await this.repoRepository.deleteById(id);
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
