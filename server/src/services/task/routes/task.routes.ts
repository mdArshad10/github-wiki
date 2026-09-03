import { Router } from "express";
import asyncHandler from "@/shared/middlewares/async-handler";
import dependencies from "@/services/task/dependencies/task.dependencies";

const router = Router()

const { controller } = dependencies;
const taskController = controller.taskController

router.get("/", asyncHandler((req,res,next)=>taskController.getTasks(req,res,next)));
router.get("/:id", asyncHandler((req,res,next)=>taskController.getTaskById(req,res,next)));
router.post("/", asyncHandler((req,res,next)=>taskController.createTask(req,res,next)));
router.patch("/:id", asyncHandler((req,res,next)=>taskController.updateTask(req,res,next)));
router.delete("/:id", asyncHandler((req,res,next)=>taskController.deleteTask(req,res,next)));

export default router;
