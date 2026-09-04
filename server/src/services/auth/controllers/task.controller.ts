import asyncHandler from "@/shared/middlewares/async-handler";
import AppError from "@/shared/utils/app-error";
import { createTaskSchema, updateTaskSchema } from "@/services/task/validation/task.validation";
import { TaskService } from "@/services/task/services/task.service";
import { ApiResponse } from "@/shared/utils/api-response";

const getTaskId = (value: string | string[] | undefined): string => {
    if (typeof value !== "string" || value.length === 0) {
        throw new AppError("Task id is required", 400);
    }

    return value;
};

export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    readonly getTasks = asyncHandler(async (_req, res) => {
        const tasks = await this.taskService.getTasks();
        res.status(200).json(ApiResponse.success(tasks,200,"get all tasks"));
    });

    readonly getTaskById = asyncHandler(async (req, res) => {
        const task = await this.taskService.getTaskById(getTaskId(req.params.id));
        res.status(200).json(ApiResponse.success(task,200,"get particular task"));
    });

    readonly createTask = asyncHandler(async (req, res) => {
        const input = createTaskSchema.parse(req.body);
        const task = await this.taskService.createTask(input);
        res.status(201).json(ApiResponse.success(task,200,"create a task"));
    });

    readonly updateTask = asyncHandler(async (req, res) => {
        const input = updateTaskSchema.parse(req.body);
        const task = await this.taskService.updateTask(getTaskId(req.params.id), input);
        res.status(200).json(ApiResponse.success(task,200,"update the Task"));
    });

    readonly deleteTask = asyncHandler(async (req, res) => {
        const task = await this.taskService.deleteTask(getTaskId(req.params.id));
        res.status(200).json(ApiResponse.success(task,200,"task deleted successfully"));
    });
}
