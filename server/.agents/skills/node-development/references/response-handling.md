z# Response Handling

## Purpose

All API responses should use the project's shared response utility.

Do not manually create inconsistent response formats in controllers.

## Standard Response Utility

The project provides:

src/shared/utils/apiResponse.ts

Use the existing utility for successful API responses.

## Success Response

Example:

import { ApiResponse } from "@/shared/utils/apiResponse";

return res.status(200).json(ApiResponse.success(
  result,
  200,
  "Document created successfully"
));

## Controller Rule

Controllers should not manually construct the response format.

Avoid:

res.status(200).json({
  success: true,
  data: result
});

Instead use:

return res.status(200).json(ApiResponse.success(
  result,
  200,
  "Document created successfully"
));

## Status Codes

Use the appropriate HTTP status code through the response utility.

- 200: successful retrieval/update
- 201: resource created
- 204: successful operation with no response body
- 400: invalid request
- 401: unauthenticated
- 403: unauthorized
- 404: resource not found
- 500: unexpected server error

## Rules

- Reuse the existing response utility.
- Do not create another response helper.
- Keep response formatting out of services.
- Services should return data/results, not Express responses.
- Controllers are responsible for HTTP responses.