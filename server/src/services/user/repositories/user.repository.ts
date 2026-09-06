import { UserProfile, type IUserProfile } from "@/shared/models/user.model";

export type CreateUserProfileInput = Pick<
	IUserProfile,
	"authUserId" | "githubUsername" | "email" | "installationId"
> &
	Partial<Pick<IUserProfile, "avatarUrl" | "indexedRepos">>;

export type UpdateUserProfileInput = Partial<
	Pick<IUserProfile, "githubUsername" | "email" | "installationId">
> & {
	avatarUrl?: string | null;
};

export interface UserRepositoryContract {
	findAll(): Promise<IUserProfile[]>;
	findById(id: string): Promise<IUserProfile | null>;
	findByAuthUserId(authUserId: string): Promise<IUserProfile | null>;
	create(input: CreateUserProfileInput): Promise<IUserProfile>;
	updateById(
		id: string,
		input: UpdateUserProfileInput,
	): Promise<IUserProfile | null>;
	deleteById(id: string): Promise<IUserProfile | null>;
}

export class UserRepository implements UserRepositoryContract {
	async findAll(): Promise<IUserProfile[]> {
		return UserProfile.find().sort({ createdAt: -1 }).exec();
	}

	async findById(id: string): Promise<IUserProfile | null> {
		return UserProfile.findById(id).exec();
	}

	async findByAuthUserId(authUserId: string): Promise<IUserProfile | null> {
		return UserProfile.findOne({ authUserId }).exec();
	}

	async create(input: CreateUserProfileInput): Promise<IUserProfile> {
		return UserProfile.create(input);
	}

	async updateById(
		id: string,
		input: UpdateUserProfileInput,
	): Promise<IUserProfile | null> {
		return UserProfile.findByIdAndUpdate(id, input, {
			new: true,
			runValidators: true,
		}).exec();
	}

	async deleteById(id: string): Promise<IUserProfile | null> {
		return UserProfile.findByIdAndDelete(id).exec();
	}
}
