# Dependency Injection

## Purpose

Dependencies must be created outside the business logic and injected into services.

Do not instantiate repositories, services, or external clients directly inside controllers.

## Dependency Flow

The preferred dependency flow is:

Dependencies
  ↓
Router 
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Database

## Example

A document feature may have:

features/documents/

├── controllers/
│   └── document-controller.ts
├── services/
│   └── document-service.ts
├── repositories/
│   └── document-repository.ts
├── routes/
│   └── document-routes.ts
├── dependencies/
│   └── document-dependencies.ts
└── types/

## Service

The service should receive its dependencies through its constructor.

Example:

class DocumentService {
  constructor(
    private readonly documentRepository: DocumentRepository
  ) {}

  async createDocument(...) {
    // business logic
  }
}

## Controller

The controller receives the service.

Example:

class DocumentController {
  constructor(
    private readonly documentService: DocumentService
  ) {}

  async create(req, res, next) {
    const result = await this.documentService.createDocument(...);

    // response handling
  }
}

## Dependency Definition

Dependencies should be created in the feature's dependency module.

Example:

class Container {
    static init() {
        // Initialize repositories
        const repositories = {
            documentRepository: new DocumentRepository(),
        };

        // Initialize services with their respective repositories
        const services = {
            documentService: new DocumentService(repositories.documentRepository),
        };

        // Initialize controllers with their respective services
        const controller = {
            documentController: new DocumentController(services.documentService),
        };

        return {
            repositories,
            services,
            controller,
        };
    }
}

const initialized = Container.init();
const { documentController } = initialized.controller;

export { Container };
export { documentController };
export default initialized;

## Router

The router should use the already-created controller.

Example:

const router = Router()

const { controller } = dependencies;
const documentController = controller.documentController

router.get("/", asyncHandler((req,res,next)=>documentController.create(req,res,next)));

Do not create dependencies inside the router unless this is the established project pattern.

## Rules

- Do not create repositories inside services.
- Do not create services inside controllers.
- Do not create database clients inside repositories if a shared client is already available.
- Keep dependency construction separate from business logic.
- Prefer constructor injection.
- Reuse existing dependencies when available.