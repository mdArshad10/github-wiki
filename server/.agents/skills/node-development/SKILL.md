---
name: node-development
description: it help to create the folder structure for a feature in node enviroment.
---

# Node.js Development Skill

## Architecture

Use feature-based architecture.

Example:

services/
  users/
  auth/
  documents/

Each feature should contain:

- controllers
- services
- repositories
- routes
- dependencies
- validation
- types

## Rules

- TypeScript only
- Follow SOLID principles
- Business logic belongs in services
- Database access belongs in repositories
- Controllers should remain thin
- Validate external input with Zod
- Never access the database directly from controllers
- Use dependency injection where appropriate
- add the all types used in services

## Controllers

Controllers should:

- receive request
- validate input
- call service
- return response

Controllers must not contain business logic.

## Services

Services contain business logic.

## Repositories

Repositories are responsible for database access.

## Validation

Use Zod for request validation.


## Error handling

Use centralized error handling.

Do not put try/catch in every controller unless
the error requires local handling.

## Testing

Every business-critical service must have unit tests.

## Naming

- files: kebab-case
- classes: PascalCase
- functions: camelCase

## References

Read the relevant reference files when implementing:

- dependency wiring
- API responses
- error handling
- testing
- feature architecture