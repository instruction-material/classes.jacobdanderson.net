// src/models/schemas/User.ts

import type { Model } from "mongoose";
import type { IUser } from "../../types/entities/IUser.ts";
import mongoose, { Schema } from "mongoose";
import { emailVerificationPlugin } from "../plugins/emailVerification.js";
import { passwordPlugin } from "../plugins/password.js";

/**
 * Create Mongoose Schema for User
 */
const userSchema: Schema<IUser> = new Schema(
	{
		tutors: {
			type: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Tutor"
				}
			],
			default: []
		},
		noteWorkflowDeleting: { type: Boolean, select: false },
		noteWorkflowWriters: { type: [{ _id: false, id: String, at: Date }], default: undefined, select: false },
		noteWorkflowWriterDispositions: { type: [{ _id: false, at: Date, actorId: String, writerId: String, keyHash: String, payloadHash: String, evidenceRef: String }], default: undefined, select: false },
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
		age: { type: String },
		state: { type: String },
		recipientName: { type: String, trim: true, default: undefined },
		recipientNameKey: {
			type: String,
			lowercase: true,
			trim: true,
			default: undefined,
			select: false
		},
		password: { type: String, required: true },
		courseAccess: {
			type: [String],
			default: []
		},
		courseStatus: {
			type: Schema.Types.Mixed,
			default: {}
		},
		courseProgress: {
			type: [
				{
					_id: false,
					courseId: { type: String, required: true, trim: true },
					completedModuleIds: {
						type: [String],
						default: []
					},
					completedItemIds: {
						type: [String],
						default: []
					},
					updatedAt: { type: Date, default: undefined },
					updatedBy: {
						type: mongoose.Schema.Types.ObjectId,
						default: undefined
					},
					updatedByRole: {
						type: String,
						enum: ["admin", "tutor"],
						default: undefined
					}
				}
			],
			default: []
		},
		editUsers: { type: Boolean, default: false, required: true }, // Added required: true
		saveEdit: { type: String, default: "Edit", required: true }, // Added required: true
		sessionVersion: { type: Number, default: 0, required: true, min: 0 },
		role: { type: String, default: "user" }
	},
	{ timestamps: true }
);

userSchema.index({ recipientNameKey: 1 }, { unique: true, sparse: true });

/**
 * Create and handle password hashing, comparison, and removal from JSON responses
 */
userSchema.plugin(passwordPlugin);
userSchema.plugin(emailVerificationPlugin);

/**
 * Create and export Tutor model
 */
export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
