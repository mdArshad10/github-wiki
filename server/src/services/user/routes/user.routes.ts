import { Router } from "express";

import { authMiddleware } from "@/shared/middlewares/auth-middleware";
import dependencies from "@/services/user/dependencies/user.dependencies";

const router = Router();
const { userController } = dependencies.controller;

router.post("/logout", authMiddleware, userController.logout);
router.get("/me", authMiddleware, userController.me);
router.patch("/update", authMiddleware, userController.update);

export default router;
