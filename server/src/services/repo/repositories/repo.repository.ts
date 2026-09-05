import {RepoModel,type RepoDocument} from '@/shared/models/repos.model'
import type { CreateTaskInput, UpdateTaskInput } from "@/services/task/validation/task.validation";

export interface RepoRepositoryContract {
    findAll(): Promise<RepoDocument[]>;
    findById(id: string): Promise<RepoDocument | null>;
    create(input: CreateTaskInput): Promise<RepoDocument>;
    updateById(id: string, input: UpdateTaskInput): Promise<RepoDocument | null>;
    deleteById(id: string): Promise<RepoDocument | null>;
}

export class RepoRepository implements RepoRepositoryContract {
    async findAll(): Promise<RepoDocument[]> {
        return RepoModel.find().sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<RepoDocument | null> {
        return RepoModel.findById(id).exec();
    }

    async create(input: CreateTaskInput): Promise<RepoDocument> {
        return RepoModel.create(input);
    }

    async updateById(
        id: string,
        input: UpdateTaskInput,
    ): Promise<RepoDocument | null> {
        return RepoModel.findByIdAndUpdate(id, input, {
            new: true,
            runValidators: true,
        }).exec();
    }

    async deleteById(id: string): Promise<RepoDocument | null> {
        return RepoModel.findByIdAndDelete(id).exec();
    }
}
