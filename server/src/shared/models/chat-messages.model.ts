import { model, Schema, Types, type HydratedDocument } from "mongoose";

export enum ChatMessageRole {
    User = "user",
    Assistant = "assistant",
}

export interface ICitation {
    filePath: string;
    startLine: number;
    endLine: number;
}

export interface IChatMessage {
    sessionId: Types.ObjectId;
    role: ChatMessageRole;
    content: string;
    citations: ICitation[];
    createdAt?: Date;
    updatedAt?: Date;
}

const citationSchema = new Schema<ICitation>(
    {
        filePath: { type: String, required: true },
        startLine: { type: Number, required: true },
        endLine: { type: Number, required: true },
    },
    { _id: false },
);

const chatMessageSchema = new Schema<IChatMessage>(
    {
        sessionId: {
            type: Schema.Types.ObjectId,
            ref: "ChatSession",
            required: [true, "sessionId is required"],
        },
        role: {
            type: String,
            enum: Object.values(ChatMessageRole),
            required: [true, "Message role is required"],
        },
        content: {
            type: String,
            required: [true, "Message content is required"],
        },
        citations: {
            type: [citationSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export type ChatMessageDocument = HydratedDocument<IChatMessage>;
export const ChatMessageModel = model<IChatMessage>(
    "ChatMessage",
    chatMessageSchema,
);
