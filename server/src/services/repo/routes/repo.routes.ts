import { Router } from "express";
import asyncHandler from "@/shared/middlewares/async-handler";
import dependencies from "@/services/repo/dependencies/repo.dependencies";
import { authMiddleware } from "@/shared/middlewares/auth-middleware";

const router = Router()

const { controller } = dependencies;
const repoController = controller.repoController

router.get("/",authMiddleware, repoController.getRepos);
router.get("/fetch-repos",authMiddleware, repoController.fetchAllRepos);

export default router;
