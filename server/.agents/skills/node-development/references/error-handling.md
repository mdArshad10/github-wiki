# Error Handling

## Standard Error

The project uses:

src/shared/utils/app-error.ts

Use `AppError` for expected application errors.

## Example

import { AppError } from "@/utils/app-error";

throw new AppError(
  "Document not found",
  404
);

## Service Layer

Services should throw application errors when a business rule fails.

Example:

const document = await repository.findById(id);

if (!document) {
  throw new AppError(
    "Document not found",
    404
  );
}

## Controller

Controllers should not manually format application errors.

Avoid:

try {
  ...
} catch (error) {
  return res.status(404).json(...);
}

The centralized error middleware handles errors.

## Global Error Handler

Application errors are handled by:

src/shared/middlewares/error-middleware.ts

Expected errors should be passed to the centralized error handler.

## Rules

- Use `AppError` for expected application errors.
- Do not create feature-specific error classes unless required.
- Do not duplicate error formatting.
- Do not put unnecessary try/catch blocks in controllers.
- Do not return Express responses from services.
- Unexpected errors should be handled by the global error handler.