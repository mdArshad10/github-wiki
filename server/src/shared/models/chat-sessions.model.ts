import { model, Schema, Types, type HydratedDocument } from "mongoose";

export interface IChatSession {
    repoId: Types.ObjectId;
    userId: Types.ObjectId;
    title: string;
    pinned: boolean;
    isActive: boolean;
    lastMessageAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const chatSessionSchema = new Schema<IChatSession>(
    {
        repoId: {
            type: Schema.Types.ObjectId,
            ref: "Repo",
            required: [true, "repoId is required"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: [true, "userId is required"],
        },
        title: {
            type: String,
            required: [true, "Chat session title is required"],
            trim: true,
        },
        pinned: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastMessageAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

chatSessionSchema.index({
    repoId: 1,
    isActive: 1,
    pinned: -1,
    lastMessageAt: -1,
});

export type ChatSessionDocument = HydratedDocument<IChatSession>;
export const ChatSessionModel = model<IChatSession>(
    "ChatSession",
    chatSessionSchema,
);
