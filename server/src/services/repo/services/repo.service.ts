import { Types } from "mongoose";
import AppError from "@/shared/utils/app-error";
import {
	type CreateTaskInput,
	type UpdateTaskInput,
} from "../validation/task.validation";
import {
	RepoRepository,
	type RepoRepositoryContract,
} from "../repositories/repo.repository";
import {
	IndexingStatus,
	type IRepo,
	type RepoDocument,
} from "@/shared/models/repos.model";
import type { auth } from "@/shared/config/auth";
import { Octokit } from "octokit";
import {
	UserRepository,
	type UserRepositoryContract,
} from "../repositories/user.repository";

export class RepoService {
	constructor(
		private readonly repoRepository: RepoRepositoryContract = new RepoRepository(),
		private readonly authRepo: typeof auth,
		private readonly userRepository: UserRepositoryContract = new UserRepository(),
	) {}

	async getAllRepos(): Promise<RepoDocument[]> {
		return this.repoRepository.findAll();
	}

	async createAllRepo(
		authUserId: string,
		accountId: string,
	): Promise<RepoDocument[]> {
		const userProfile = await this.userRepository.findByAuthUserId(authUserId);
		if (!userProfile) {
			throw new AppError("User profile not found", 404);
		}

		const { accessToken } = await this.authRepo.api.getAccessToken({
			body: {
				accountId,
				userId: authUserId,
			},
		});

		if (!accessToken) {
			throw new AppError("GitHub access token is unavailable", 401);
		}

		const allFetchRepoData = await this.fetchAllRepo(accessToken);
		const allInsertRepo: IRepo[] = allFetchRepoData.map((data) => ({
			userId: new Types.ObjectId(userProfile._id.toString()),
			githubRepoId: data.id,
			fullName: data.full_name,
			defaultBranch: data.default_branch ?? "main",
			private: data.private,
			language: data.language ?? null,
			stars: data.stargazers_count,
			indexingStatus: IndexingStatus.NotIndexed,
			indexingProgress: {
				filesProcessed: 0,
				totalFiles: 0,
			},
			lastIndexedCommitSha: null,
			lastIndexedAt: null,
			isOutdated: false,
			webhookId: null,
			isActive: true,
			deactivatedAt: null,
		}));

		return this.repoRepository.bulkInsert(allInsertRepo);
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

	private async fetchAllRepo(accessToken: string) {
		const octokit = new Octokit({
			auth: accessToken,
		});

		return octokit.paginate(octokit.rest.repos.listForAuthenticatedUser, {
			visibility: "all",
			per_page: 100,
		});
	}
}
