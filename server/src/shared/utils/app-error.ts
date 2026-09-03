/** Additional, application-specific information attached to an error. */
export type AppErrorDetails = unknown;

/** Error that is safe to pass through the application's error middleware. */
class AppError extends Error {
    public readonly statusCode: number;
    public readonly errors: AppErrorDetails;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        errors: AppErrorDetails = null,
    ) {
        super(message);

        this.name = "AppError";
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = true;

        // Restore the correct prototype when targeting older JavaScript runtimes.
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace?.(this, new.target);
    }
}

export default AppError;
