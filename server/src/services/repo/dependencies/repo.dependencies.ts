

import { RepoRepository } from "../repositories/repo.repository";
import { RepoService } from "../services/repo.service";
import { RepoController } from "../controllers/repo.controller";

/**
 * Dependency Injection Container for the Task module.
 * This container initializes and manages the dependencies for the Task module,
 * including repositories, services, and controllers.
 */
class Container {
    static init() {
        // Initialize repositories
        const repositories = {
            repoRepository: new RepoRepository(),
        };

        // Initialize services with their respective repositories
        const services = {
            repoService: new RepoService(repositories.repoRepository),
        };

        // Initialize controllers with their respective services
        const controller = {
            repoController: new RepoController(services.repoService),
        };

        return {
            repositories,
            services,
            controller,
        };
    }
}

const initialized = Container.init();
const { repoController } = initialized.controller;

export { Container };
export { repoController };
export default initialized;
