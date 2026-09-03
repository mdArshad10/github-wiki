import type { ConnectOptions } from "mongoose";

export const connectionOptions: ConnectOptions = {
    serverSelectionTimeoutMS: 5_000,
    connectTimeoutMS: 10_000,
    socketTimeoutMS: 45_000,
};
