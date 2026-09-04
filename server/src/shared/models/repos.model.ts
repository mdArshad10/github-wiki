import { model, Schema, Types, type HydratedDocument } from "mongoose";

export enum IndexingStatus {
    NotIndexed = "not_indexed",
    Indexing = "indexing",
    Ready = "ready",
    Failed = "failed",
}

export interface IndexingProgress {
    filesProcessed: number;
    totalFiles: number;
}

export interface IRepo {
    userId: Types.ObjectId;
    githubRepoId: number;
    fullName: string;
    defaultBranch: string;
    private: boolean;
    language: string | null;
    stars: number;
    indexingStatus: IndexingStatus;
    indexingProgress: IndexingProgress;
    lastIndexedCommitSha: string | null;
    lastIndexedAt: Date | null;
    isOutdated: boolean;
    webhookId: string | null;
    isActive: boolean;
    deactivatedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

const repoSchema = new Schema<IRepo>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "user",
            required: [true, "userId is required"],
        },
        githubRepoId: {
            type: Number,
            required: [true, "GitHub repository id is required"],
        },
        fullName: {
            type: String,
            required: [true, "Repository full name is required"],
            trim: true,
        },
        defaultBranch: {
            type: String,
            required: [true, "Default branch is required"],
            trim: true,
        },
        private: {
            type: Boolean,
            default: false,
        },
        language: {
            type: String,
            default: null,
        },
        stars: {
            type: Number,
            default: 0,
        },
        indexingStatus: {
            type: String,
            enum: Object.values(IndexingStatus),
            default: IndexingStatus.NotIndexed,
            required: [true, "Indexing status is required"],
        },
        indexingProgress: {
            filesProcessed: { type: Number, default: 0 },
            totalFiles: { type: Number, default: 0 },
        },
        lastIndexedCommitSha: {
            type: String,
            default: null,
        },
        lastIndexedAt: {
            type: Date,
            default: null,
        },
        isOutdated: {
            type: Boolean,
            default: false,
        },
        webhookId: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        deactivatedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

repoSchema.index({ userId: 1, githubRepoId: 1 }, { unique: true });
repoSchema.index({ userId: 1, isActive: 1 });

export type RepoDocument = HydratedDocument<IRepo>;
export const RepoModel = model<IRepo>("Repo", repoSchema);
