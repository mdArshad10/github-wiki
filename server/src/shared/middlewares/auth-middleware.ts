import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";

import { auth } from "@/shared/config/auth";
import AppError from "@/shared/utils/app-error";

export const authMiddleware = async (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session) {
			next(new AppError("Unauthorized", 401));
			return;
		}

		req.session = session.session;
		req.user = session.user;
		next();
	} catch (error) {
		next(error);
	}
};
