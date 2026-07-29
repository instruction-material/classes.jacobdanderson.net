import type { Model } from "mongoose";
import type { IExternalIdentity } from "../../types/entities/IExternalIdentity.js";
import mongoose, { Schema } from "mongoose";
import { externalIdentityProviders } from "../../types/entities/IExternalIdentity.js";

const externalIdentitySchema = new Schema<IExternalIdentity>(
	{
		accountID: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true
		},
		accountRole: {
			type: String,
			enum: ["admin", "tutor", "user"],
			required: true,
			index: true
		},
		emailAtLink: {
			type: String,
			lowercase: true,
			trim: true,
			maxlength: 320,
			select: false,
			default: undefined
		},
		lastLoginAt: {
			type: Date,
			required: true,
			default: Date.now
		},
		provider: {
			type: String,
			enum: externalIdentityProviders,
			required: true
		},
		subject: {
			type: String,
			required: true,
			trim: true,
			maxlength: 255,
			select: false
		}
	},
	{ timestamps: true }
);

externalIdentitySchema.index(
	{ provider: 1, subject: 1 },
	{ unique: true }
);
externalIdentitySchema.index(
	{ provider: 1, accountRole: 1, accountID: 1 },
	{ unique: true }
);

export const ExternalIdentity: Model<IExternalIdentity>
	= mongoose.models.ExternalIdentity
		|| mongoose.model<IExternalIdentity>(
			"ExternalIdentity",
			externalIdentitySchema
		);
