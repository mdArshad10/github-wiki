
import { TaskController } from "@/services/task/controllers/task.controller";
import { TaskRepository } from "@/services/task/repositories/task.repository";
import { TaskService } from "@/services/task/services/task.service";

/**
 * Dependency Injection Container for the Task module.
 * This container initializes and manages the dependencies for the Task module,
 * including repositories, services, and controllers.
 */
class Container {
    static init() {
        // Initialize repositories
        const repositories = {
            taskRepository: new TaskRepository(),
        };

        // Initialize services with their respective repositories
        const services = {
            taskService: new TaskService(repositories.taskRepository),
        };

        // Initialize controllers with their respective services
        const controller = {
            taskController: new TaskController(services.taskService),
        };

        return {
            repositories,
            services,
            controller,
        };
    }
}

const initialized = Container.init();
const { taskController } = initialized.controller;

export { Container };
export { taskController };
export default initialized;
