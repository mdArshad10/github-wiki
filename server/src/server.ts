import type{ Express } from "express";
import { env } from "@/shared/config/env";
import { app } from "@/app";
import { closeDatabase, connectDatabase } from "@/shared/config/database";
import { createServer } from "node:http";


/**
 * Initialize database connections and start the server
 */
async function initializeConnection() {
    try {
        console.info("Initializing database connections...");

        await connectDatabase();

        console.info("All connections established successfully");
    } catch (error) {
        console.error("Failed to initialize connections:", error);
        throw error;
    }
}

/**
 * Initialize database connections closed when server is gracefully shutdown
 */
async function initializeConnectionClose() {
    try {
        console.info("Initializing database connections...");

        await closeDatabase();

        console.info("All connections established successfully");
    } catch (error) {
        console.error("Failed to initialize connections:", error);
        throw error;
    }
}

const main = async (app:Express)=>{
    try {
        const server = createServer(app); 
        await initializeConnection();
        

        server.listen(env.PORT, () => {
            console.info(`Server started on port ${env.PORT}`);
            console.info(`Environment: ${env.NODE_ENV}`);
            console.info(`API available at: http://localhost:${env.PORT}`);
        });


        const gracefulShutdown = async (signal:string) => {
            console.info(`${signal} received, shutting down gracefully...`);

            server.close(async () => {
                console.info("HTTP server closed");

                try {
                    await initializeConnectionClose()
                    console.info('All connections closed, exiting process');
                    process.exit(0);
                } catch (error) {
                    console.error('Error during shutdown:', error);
                    process.exit(1);
                }
            })

            setTimeout(() => {
                console.error("Forced shutdown")
                process.exit(1);
            }, 10000);

        }

        process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
        process.on("SIGINT", () => gracefulShutdown("SIGINT"));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('unhandledRejection');
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

void main(app).catch((error: unknown) => {
    console.error("Unable to start the server", error);
    process.exitCode = 1;
});
