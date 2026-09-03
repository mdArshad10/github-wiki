import mongoose from "mongoose";
import { env } from "@/shared/config/env";
import { connectionOptions } from "@/shared/constants";


class Database {
    private static instance: Database | null = null;
    private connection: typeof mongoose | null = null;
    private connectionPromise: Promise<typeof mongoose> | null = null;

    private constructor(
        private readonly mongooseInstance: typeof mongoose,
        private readonly connectionString: string,
    ) {}

    public static getInstance(
        mongooseInstance: typeof mongoose = mongoose,
        connectionString: string = env.MONGODB_URI,
    ): Database {
        if (!Database.instance) {
            Database.instance = new Database(mongooseInstance, connectionString);
        }

        return Database.instance;
    }

    public connectionMethod(): Promise<typeof mongoose> {
        if (this.mongooseInstance.connection.readyState === 1) {
            return Promise.resolve(this.connection ?? this.mongooseInstance);
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        const connectionPromise = this.mongooseInstance
            .connect(this.connectionString, connectionOptions)
            .then((connection) => {
                this.connection = connection;
                console.log("MongoDB connected");
                return connection;
            })
            .catch((error: unknown) => {
                this.connectionPromise = null;
                throw error;
            });

        this.connectionPromise = connectionPromise;
        return connectionPromise;
    }

    public async ping(): Promise<{
        connected: boolean;
        state: "disconnected" | "connected" | "connecting" | "disconnecting";
    }> {
        const states: Record<
            number,
            "disconnected" | "connected" | "connecting" | "disconnecting"
        > = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };
        const state = states[this.mongooseInstance.connection.readyState] ?? "disconnected";

        if (state !== "connected" || !this.mongooseInstance.connection.db) {
            return { connected: false, state };
        }

        try {
            await this.mongooseInstance.connection.db.admin().ping();
            return { connected: true, state };
        } catch {
            return { connected: false, state: "disconnected" };
        }
    }

    public async closeConnection(): Promise<void> {
        this.connectionPromise = null;

        if (this.mongooseInstance.connection.readyState !== 0) {
            await this.mongooseInstance.disconnect();
            console.log("MongoDB connection closed");
        }

        this.connection = null;
    }
}

export const database = Database.getInstance();

// Backwards-compatible helpers for the existing server bootstrap.
export const connectDatabase = (): Promise<typeof mongoose> => {
    return database.connectionMethod();
};

export const pingDatabase = () => database.ping();

export const closeDatabase = (): Promise<void> => {
    return database.closeConnection();
};

export { Database };
