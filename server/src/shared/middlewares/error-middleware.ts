import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import AppError from "@/shared/utils/app-error";

type MongooseDuplicateKeyError = Error & {
    code: 11000;
    keyPattern?: Record<string, unknown>;
    keyValue?: Record<string, unknown>;
};

type MongooseValidationError = Error & {
    name: "ValidationError";
    errors?: Record<string, unknown>;
};

type MongooseCastError = Error & {
    name: "CastError";
    path?: string;
    value?: unknown;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

const isMongooseDuplicateKeyError = (
    error: unknown,
): error is MongooseDuplicateKeyError => {
    return isRecord(error) && error.code === 11000;
};

const isMongooseValidationError = (
    error: unknown,
): error is MongooseValidationError => {
    return isRecord(error) && error.name === "ValidationError";
};

const isMongooseCastError = (error: unknown): error is MongooseCastError => {
    return isRecord(error) && error.name === "CastError";
};

const getValidationMessages = (error: MongooseValidationError): string[] => {
    if (!error.errors || !isRecord(error.errors)) {
        return [];
    }

    return Object.entries(error.errors).map(([field, detail]) => {
        if (isRecord(detail) && typeof detail.message === "string") {
            return `${field}: ${detail.message}`;
        }

        return `${field}: Invalid value`;
    });
};

/** Express error middleware for application and database errors. */
export const errorMiddleware: ErrorRequestHandler = (err: unknown, req, res, next) => {
    if (res.headersSent) {
        next(err);
        return;
    }

    let statusCode = 500;
    let message = "Internal server error";
    let errors: unknown = null;

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    } else if (isMongooseDuplicateKeyError(err)) {
        const fields = Object.keys(err.keyValue ?? err.keyPattern ?? {});

        statusCode = 409;
        message = fields.length > 0
            ? `A record with the same value already exists for: ${fields.join(", ")}.`
            : "A record with the same value already exists.";
    } else if (isMongooseValidationError(err)) {
        statusCode = 400;
        message = "Mongoose validation failed";
        errors = getValidationMessages(err);
    } else if (isMongooseCastError(err)) {
        statusCode = 400;
        message = `Invalid value for ${err.path ?? "field"}`;
        errors = err.value;
    } else if (err instanceof ZodError) {
        statusCode = 400;
        message = "Request validation failed";
        errors = err.issues.map((issue) => ({
            field: issue.path.join(".") || "request",
            message: issue.message,
        }));
    } else if (process.env.NODE_ENV !== "production" && err instanceof Error) {
        message = err.message;
    }

    if (!(err instanceof AppError) && statusCode === 500) {
        console.error(err);
    }

    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
