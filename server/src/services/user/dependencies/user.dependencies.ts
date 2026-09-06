import { UserController } from "@/services/user/controllers/user.controller";
import { UserRepository } from "@/services/user/repositories/user.repository";
import { UserService } from "@/services/user/services/user.service";

class Container {
	static init() {
		const repositories = {
			userRepository: new UserRepository(),
		};

		const services = {
			userService: new UserService(repositories.userRepository),
		};

		const controller = {
			userController: new UserController(services.userService),
		};

		return {
			repositories,
			services,
			controller,
		};
	}
}

const initialized = Container.init();
const { userController } = initialized.controller;

export { Container, userController };
export default initialized;
