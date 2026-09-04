// backend/models/UserProfile.ts
import { Schema, model, Document } from "mongoose";

interface IIndexedRepo {
  repoId: number;          // GitHub's numeric repo id
  fullName: string;        // e.g. "octocat/hello-world"
  defaultBranch: string;
  wikiEnabled: boolean;
  status: "pending" | "indexing" | "indexed" | "failed";
  vectorNamespace: string; // namespace/collection name in your vector DB
  lastIndexedAt?: Date;
}

export interface IUserProfile extends Document {
  authUserId: string;      // Better Auth's user.id — the link between the two systems
  githubUsername: string;
  email: string;
  avatarUrl?: string;
  indexedRepos: IIndexedRepo[];
  createdAt: Date;
  updatedAt: Date;
}

const IndexedRepoSchema = new Schema<IIndexedRepo>(
  {
    repoId: { type: Number, required: true },
    fullName: { type: String, required: true },
    defaultBranch: { type: String, default: "main" },
    wikiEnabled: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "indexing", "indexed", "failed"],
      default: "pending",
    },
    vectorNamespace: { type: String, required: true },
    lastIndexedAt: { type: Date },
  },
  { _id: false }
);

const UserProfileSchema = new Schema<IUserProfile>(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    githubUsername: { type: String, required: true },
    email: { type: String, required: true },
    avatarUrl: { type: String },
    indexedRepos: { type: [IndexedRepoSchema], default: [] },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

export const UserProfile = model<IUserProfile>("UserProfile", UserProfileSchema);