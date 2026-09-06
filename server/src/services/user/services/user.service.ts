import AppError from "@/shared/utils/app-error";
import type { IUserProfile } from "@/shared/models/user.model";
import {
	UserRepository,
	type UserRepositoryContract,
} from "@/services/user/repositories/user.repository";
import type { UpdateUserInput } from "@/services/user/validation/user.validation";

export class UserService {
	constructor(
		private readonly userRepository: UserRepositoryContract =
			new UserRepository(),
	) {}

	async getMe(authUserId: string): Promise<IUserProfile> {
		const user = await this.userRepository.findByAuthUserId(authUserId);

		if (!user) {
			throw new AppError("User profile not found", 404);
		}

		return user;
	}

	async updateMe(
		authUserId: string,
		input: UpdateUserInput,
	): Promise<IUserProfile> {
		const currentUser = await this.getMe(authUserId);
		const updatedUser = await this.userRepository.updateById(
			currentUser._id.toString(),
			input,
		);

		if (!updatedUser) {
			throw new AppError("User profile not found", 404);
		}

		return updatedUser;
	}
}
