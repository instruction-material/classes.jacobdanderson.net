import type { Types } from "mongoose";

export type PythonProjectMode = "c" | "cpp" | "data" | "java" | "karel" | "pgzero" | "python" | "turtle";
export type PythonProjectFileEncoding = "text" | "base64";
export type PythonProjectOwnerRole = "admin" | "courseCodeLearner" | "tutor" | "user";

export interface PythonProjectFile {
	name: string;
	content: string;
	encoding?: PythonProjectFileEncoding;
}

export interface IPythonProject {
	_id: Types.ObjectId;
	user: Types.ObjectId;
	ownerRole?: PythonProjectOwnerRole;
	title: string;
	mode: PythonProjectMode;
	files: PythonProjectFile[];
	activeFileName: string;
	courseID?: string;
	courseProjectKey?: string;
	courseProjectTitle?: string;
	starterLabel?: string;
	starterUrl?: string;
	shared?: boolean;
	shareID?: string;
	shareCreatedAt?: Date;
	sharedSourceID?: string;
	createdAt: Date;
	updatedAt: Date;
}
