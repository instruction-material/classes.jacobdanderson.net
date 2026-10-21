import type { Model } from "mongoose";
import type { IPythonProject } from "../../types/entities/IPythonProject.js";
import mongoose, { Schema } from "mongoose";

const pythonProjectFileSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		content: { type: String, default: "" },
		encoding: {
			type: String,
			enum: ["text", "base64"],
			default: "text"
		}
	},
	{ _id: false }
);

const pythonProjectSchema: Schema<IPythonProject> = new Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true
		},
		ownerRole: {
			type: String,
			enum: ["admin", "courseCodeLearner", "tutor", "user"],
			default: "user",
			index: true
		},
		title: { type: String, required: true, trim: true, maxlength: 120 },
		mode: {
			type: String,
			enum: ["assembly", "c", "cpp", "data", "java", "karel", "linux", "pgzero", "python", "rust", "turtle", "web"],
			default: "python",
			required: true
		},
		files: {
			type: [pythonProjectFileSchema],
			default: []
		},
		activeFileName: { type: String, required: true, trim: true },
		courseID: { type: String, trim: true, maxlength: 120 },
		courseProjectKey: { type: String, trim: true, maxlength: 240 },
		courseProjectTitle: { type: String, trim: true, maxlength: 160 },
		starterLabel: { type: String, trim: true, maxlength: 80 },
		starterUrl: { type: String, trim: true, maxlength: 500 },
		shared: { type: Boolean, default: false, index: true },
		shareID: {
			type: String,
			trim: true,
			maxlength: 80,
			unique: true,
			sparse: true
		},
		shareCreatedAt: { type: Date },
		sharedSourceID: { type: String, trim: true, maxlength: 80 }
	},
	{ timestamps: true }
);

pythonProjectSchema.index({ user: 1, ownerRole: 1, updatedAt: -1 });
pythonProjectSchema.index(
	{ user: 1, courseProjectKey: 1 },
	{ sparse: true }
);
pythonProjectSchema.index({ shared: 1, shareID: 1 });

export const PythonProject: Model<IPythonProject> = mongoose.model<IPythonProject>(
	"PythonProject",
	pythonProjectSchema
);
