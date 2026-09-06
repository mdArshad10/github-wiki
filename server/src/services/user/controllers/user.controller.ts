import { fromNodeHeaders } from "better-auth/node";

import asyncHandler from "@/shared/middlewares/async-handler";
import { auth } from "@/shared/config/auth";
import { ApiResponse } from "@/shared/utils/api-response";
import { updateUserSchema } from "@/services/user/validation/user.validation";
import type { UserService } from "@/services/user/services/user.service";

export class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly authService: typeof auth = auth,
	) {}

	readonly logout = asyncHandler(async (req, res) => {
		await this.authService.api.signOut({
			headers: fromNodeHeaders(req.headers),
		});

		res
			.status(200)
			.json(ApiResponse.success(null, 200, "Logged out successfully"));
	});

	readonly me = asyncHandler(async (req, res) => {
		const user = await this.userService.getMe(req.user.id);

		res.status(200).json(ApiResponse.success(user, 200, "User profile fetched"));
	});

	readonly update = asyncHandler(async (req, res) => {
		const input = updateUserSchema.parse(req.body);
		const user = await this.userService.updateMe(req.user.id, input);

		res.status(200).json(ApiResponse.success(user, 200, "User profile updated"));
	});
}
