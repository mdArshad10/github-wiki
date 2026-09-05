import { RepoRepository } from "../repositories/repo.repository";
import { RepoService } from "../services/repo.service";
import { RepoController } from "../controllers/repo.controller";
import { auth } from "@/shared/config/auth";
import { UserRepository } from "../repositories/user.repository";

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
			userRepository: new UserRepository(),
		};

		// Initialize services with their respective repositories
		const services = {
			repoService: new RepoService(
				repositories.repoRepository,
				auth,
				repositories.userRepository,
			),
		};

		// Initialize controllers with their respective services
		const controller = {
			repoController: new RepoController(services.repoService,auth),
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
