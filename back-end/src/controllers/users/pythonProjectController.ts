import type { RequestHandler } from "express";
import type { QueryFilter } from "mongoose";
import type {
	IPythonProject,
	PythonProjectFile,
	PythonProjectMode,
	PythonProjectOwnerRole
} from "../../types/entities/IPythonProject.js";
import type {
	IPythonProjectReview,
	PythonProjectReviewRole
} from "../../types/entities/IPythonProjectReview.js";
import { randomBytes } from "node:crypto";
import { env } from "node:process";
import { Types } from "mongoose";
import { z } from "zod";
import { PythonProject } from "../../models/schemas/PythonProject.js";
import { PythonProjectReview } from "../../models/schemas/PythonProjectReview.js";
import { User } from "../../models/schemas/User.js";

const SAFE_FILE_SEGMENT_RE = /^\w[\w.-]*$/;
const ROOT_TEXT_FILE_RE = /^(?:makefile|\w[\w.-]*\.(?:csv|eps|in|java|json|md|out|ps|py|tsv|txt))$/i;
const IMAGE_FILE_RE = /^images\/\w[\w.-]*\.(?:gif|jpe?g|png|svg|webp)$/i;
const AUDIO_FILE_RE = /^(?:music|sounds)\/\w[\w.-]*\.(?:mp3|ogg|wav)$/i;
const PYTHON_FILE_NAME_RE = /\.py$/i;
const JAVA_FILE_NAME_RE = /\.java$/i;
const CPP_FILE_NAME_RE = /\.(?:cc|cpp|cxx)$/i;
const CPP_TEXT_FILE_NAME_RE = /\.(?:cc|cpp|cxx|h|hpp)$/i;
const ASSET_DIRECTORY_NAMES = new Set(["images", "music", "sounds"]);
const RUNTIME_RESERVED_FILE_NAMES = new Set([
	"_classes_artifacts.py",
	"_classes_keras.py",
	"_classes_pgzero.py",
	"keras.py",
	"pgzero.py",
	"pgzrun.py",
	"pygame.py",
	"pysynth.py",
	"streamlit.py",
	"tensorflow.py",
	"turtle.py",
	"zrect.py"
]);
const RUNTIME_RESERVED_ROOTS = new Set([
	"_classes_artifacts",
	"_classes_keras",
	"_classes_pgzero",
	"keras",
	"pgzero",
	"pgzrun",
	"pygame",
	"pysynth",
	"streamlit",
	"tensorflow",
	"turtle",
	"zrect"
]);
const MAX_PROJECT_FILES = 40;
const MAX_FILE_LENGTH = 3_000_000;
const MAX_PROJECT_LENGTH = 12_000_000;
const PROJECT_LIST_PAGE_SIZE = 25;
const MAX_PROJECT_LIST_PAGE_SIZE = 25;
const MAX_PROJECT_LIST_OFFSET = 100_000;
const configuredProjectLimit = Number(
	env.CODE_IDE_PROJECTS_PER_ACCOUNT_MAX || 200
);
const MAX_SAVED_PROJECTS_PER_ACCOUNT = Math.max(
	1,
	Math.min(
		Number.isFinite(configuredProjectLimit) ? configuredProjectLimit : 200,
		1_000
	)
);
const SHARE_ID_RE = /^[\w-]{20,80}$/;
const DEFAULT_PROJECT_FILE: PythonProjectFile = {
	name: "main.py",
	content: ""
};

function isRuntimeReservedProjectPath(value: string) {
	const normalized = value.trim().replaceAll("\\", "/");
	if (!normalized) return false;
	if (RUNTIME_RESERVED_FILE_NAMES.has(normalized.toLowerCase())) return true;

	const root = normalized.split("/")[0] ?? "";
	if (RUNTIME_RESERVED_FILE_NAMES.has(root.toLowerCase())) return true;
	return PYTHON_FILE_NAME_RE.test(normalized) && RUNTIME_RESERVED_ROOTS.has(root);
}

function isSafeProjectFileName(value: string) {
	if (!value || value.length > 80) return false;
	if (value.startsWith("/") || value.includes("\\") || value.includes("//")) return false;

	const segments = value.split("/");
	if (
		segments.some(segment => !segment || segment === "." || segment === ".." || !SAFE_FILE_SEGMENT_RE.test(segment))
	) {
		return false;
	}

	if (isRuntimeReservedProjectPath(value)) return false;

	if (PYTHON_FILE_NAME_RE.test(value) || JAVA_FILE_NAME_RE.test(value) || CPP_TEXT_FILE_NAME_RE.test(value)) {
		const rootDirectory = segments[0]?.toLowerCase();
		return !rootDirectory || !ASSET_DIRECTORY_NAMES.has(rootDirectory);
	}

	if (segments.length === 1) return ROOT_TEXT_FILE_RE.test(value);
	if (segments.length !== 2) return false;
	return IMAGE_FILE_RE.test(value) || AUDIO_FILE_RE.test(value);
}

const projectModeSchema = z.enum(["cpp", "data", "java", "karel", "pgzero", "python", "turtle"]);
const projectFileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1)
		.max(80)
		.refine(
			isSafeProjectFileName,
			"Use a safe code file, root data/text file, or images/, sounds/, or music/ asset file that does not use a runtime-reserved module name"
		),
	content: z.string().max(MAX_FILE_LENGTH),
	encoding: z.enum(["text", "base64"]).optional()
});
const projectFilesSchema = z
	.array(projectFileSchema)
	.min(1)
	.max(MAX_PROJECT_FILES)
	.refine(
		files => files.reduce((total, file) => total + file.name.length + file.content.length, 0) <= MAX_PROJECT_LENGTH,
		`Project files must be ${MAX_PROJECT_LENGTH} characters or less in total`
	);

const projectPayloadSchema = z.object({
	title: z.string().trim().min(1).max(120).optional(),
	mode: projectModeSchema.optional(),
	files: projectFilesSchema.optional(),
	activeFileName: z.string().trim().min(1).max(80).optional(),
	courseID: z.string().trim().min(1).max(120).optional(),
	courseProjectKey: z.string().trim().min(1).max(240).optional(),
	courseProjectTitle: z.string().trim().min(1).max(160).optional(),
	starterLabel: z.string().trim().min(1).max(80).optional(),
	starterUrl: z.string().trim().url().max(500).optional(),
	sharedSourceID: z.string().trim().regex(SHARE_ID_RE).optional()
});
const projectSharePayloadSchema = z.object({
	shared: z.boolean()
});
const projectReviewPayloadSchema = z.object({
	files: projectFilesSchema.optional(),
	activeFileName: z.string().trim().min(1).max(80).optional(),
	visibleToStudent: z.boolean().optional(),
	note: z.string().trim().max(20000).optional(),
	refreshFromSource: z.boolean().optional()
});

function serializePythonProject(project: IPythonProject) {
	const files = safeSerializedProjectFiles(project);
	return {
		_id: project._id.toString(),
		title: project.title,
		mode: project.mode,
		files,
		activeFileName: normalizeActiveFileName(project.activeFileName, files),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl,
		shared: project.shared ?? false,
		shareID: project.shared ? project.shareID : undefined,
		shareCreatedAt: project.shared ? project.shareCreatedAt : undefined,
		sharedSourceID: project.sharedSourceID,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	};
}

function serializePythonProjectMetadata(project: IPythonProject) {
	return {
		_id: project._id.toString(),
		title: project.title,
		mode: project.mode,
		activeFileName: project.activeFileName,
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl,
		shared: project.shared ?? false,
		shareID: project.shared ? project.shareID : undefined,
		shareCreatedAt: project.shared ? project.shareCreatedAt : undefined,
		sharedSourceID: project.sharedSourceID,
		createdAt: project.createdAt,
		updatedAt: project.updatedAt
	};
}

function serializeSharedPythonProject(project: IPythonProject) {
	const files = safeSerializedProjectFiles(project);
	return {
		title: project.title,
		mode: project.mode,
		files,
		activeFileName: normalizeActiveFileName(project.activeFileName, files),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		starterLabel: project.starterLabel,
		starterUrl: project.starterUrl
	};
}

function serializePythonProjectReview(review: IPythonProjectReview) {
	const files = safeSerializedProjectFiles(review);
	return {
		_id: review._id.toString(),
		sourceProject: review.sourceProject.toString(),
		title: review.title,
		mode: review.mode,
		files,
		activeFileName: normalizeActiveFileName(review.activeFileName, files),
		courseID: review.courseID,
		courseProjectKey: review.courseProjectKey,
		courseProjectTitle: review.courseProjectTitle,
		reviewerRole: review.reviewerRole,
		reviewerName: review.reviewerName,
		lastEditedByRole: review.lastEditedByRole,
		lastEditedByName: review.lastEditedByName,
		visibleToStudent: review.visibleToStudent,
		note: review.note ?? "",
		sourceUpdatedAt: review.sourceUpdatedAt,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt
	};
}

function serializePythonProjectReviewMetadata(review: IPythonProjectReview) {
	return {
		_id: review._id.toString(),
		sourceProject: review.sourceProject.toString(),
		title: review.title,
		mode: review.mode,
		activeFileName: review.activeFileName,
		courseID: review.courseID,
		courseProjectKey: review.courseProjectKey,
		courseProjectTitle: review.courseProjectTitle,
		reviewerRole: review.reviewerRole,
		reviewerName: review.reviewerName,
		lastEditedByRole: review.lastEditedByRole,
		lastEditedByName: review.lastEditedByName,
		visibleToStudent: review.visibleToStudent,
		note: review.note ?? "",
		sourceUpdatedAt: review.sourceUpdatedAt,
		createdAt: review.createdAt,
		updatedAt: review.updatedAt
	};
}

function defaultProjectFileForMode(mode: PythonProjectMode): PythonProjectFile {
	if (mode === "cpp") return { name: "main.cpp", content: "" };
	if (mode === "java") {
		return {
			name: "Main.java",
			content: ""
		};
	}

	if (mode === "karel") {
		return {
			name: "MyProgram.java",
			content: ""
		};
	}

	return DEFAULT_PROJECT_FILE;
}

function requiredCodeFileMessage(mode: PythonProjectMode) {
	if (mode === "cpp") return "Project must include at least one C++ source file";
	if (mode === "java" || mode === "karel") {
		return "Project must include at least one Java file";
	}

	return "Project must include at least one Python file";
}

function projectFilesMatchMode(files: PythonProjectFile[], mode: PythonProjectMode) {
	const codeFileRe = mode === "cpp" ? CPP_FILE_NAME_RE : mode === "java" || mode === "karel" ? JAVA_FILE_NAME_RE : PYTHON_FILE_NAME_RE;
	return files.some(file => codeFileRe.test(file.name) && (mode !== "cpp" || file.encoding !== "base64"));
}

function rejectProjectFilesForMode(
	res: Parameters<RequestHandler>[1],
	files: PythonProjectFile[],
	mode: PythonProjectMode,
	message: "Invalid project payload" | "Invalid review payload"
) {
	if (projectFilesMatchMode(files, mode)) return false;

	res.status(400).json({
		message,
		issues: [
			{
				code: "custom",
				message: requiredCodeFileMessage(mode),
				path: ["files"]
			}
		]
	});
	return true;
}

function normalizeProjectFiles(files: PythonProjectFile[] | undefined, mode: PythonProjectMode = "python") {
	const defaultFile = defaultProjectFileForMode(mode);
	const sourceFiles = files?.length ? files : [defaultFile];
	const seen = new Set<string>();
	const cleanFiles: PythonProjectFile[] = [];

	for (const file of sourceFiles) {
		const name = file.name.trim();
		if (seen.has(name)) continue;
		seen.add(name);
		cleanFiles.push({
			name,
			content: file.content,
			encoding: file.encoding ?? "text"
		});
	}

	return cleanFiles.length ? cleanFiles : [defaultFile];
}

function safeSerializedProjectFiles(project: Pick<IPythonProject, "files" | "mode">) {
	const files: PythonProjectFile[] = [];
	const seen = new Set<string>();
	let totalLength = 0;

	for (const file of project.files ?? []) {
		if (files.length >= MAX_PROJECT_FILES) break;

		const parsed = projectFileSchema.safeParse(file);
		if (!parsed.success) continue;

		const name = parsed.data.name.trim();
		if (seen.has(name)) continue;

		const nextLength = totalLength + name.length + parsed.data.content.length;
		if (nextLength > MAX_PROJECT_LENGTH) break;

		seen.add(name);
		totalLength = nextLength;
		files.push({
			name,
			content: parsed.data.content,
			encoding: parsed.data.encoding ?? "text"
		});
	}

	if (!projectFilesMatchMode(files, project.mode)) {
		return normalizeProjectFiles(undefined, project.mode);
	}

	return normalizeProjectFiles(files, project.mode);
}

function normalizeActiveFileName(activeFileName: string | undefined, files: PythonProjectFile[]) {
	const fileNames = new Set(files.map(file => file.name));
	if (activeFileName && fileNames.has(activeFileName)) return activeFileName;
	return files[0]?.name ?? DEFAULT_PROJECT_FILE.name;
}

function createPythonProjectShareID() {
	return randomBytes(18).toString("base64url");
}

function getProjectIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramProjectID = req.params.projectID;
	const projectID = Array.isArray(paramProjectID) ? paramProjectID[0] : paramProjectID;

	if (typeof projectID !== "string" || !Types.ObjectId.isValid(projectID)) {
		res.status(400).json({ message: "Invalid project ID" });
		return null;
	}

	return projectID;
}

function getUserIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramUserID = req.params.userID;
	const userID = Array.isArray(paramUserID) ? paramUserID[0] : paramUserID;

	if (typeof userID !== "string" || !Types.ObjectId.isValid(userID)) {
		res.status(400).json({ message: "Invalid user ID" });
		return null;
	}

	return userID;
}

function getShareIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramShareID = req.params.shareID;
	const shareID = Array.isArray(paramShareID) ? paramShareID[0] : paramShareID;

	if (typeof shareID !== "string" || !SHARE_ID_RE.test(shareID)) {
		res.status(400).json({ message: "Invalid share link" });
		return null;
	}

	return shareID;
}

function getReviewIDParam(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const paramReviewID = req.params.reviewID;
	const reviewID = Array.isArray(paramReviewID) ? paramReviewID[0] : paramReviewID;

	if (typeof reviewID !== "string" || !Types.ObjectId.isValid(reviewID)) {
		res.status(400).json({ message: "Invalid review ID" });
		return null;
	}

	return reviewID;
}

function getListPagination(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
) {
	const parseInteger = (
		value: unknown,
		fallback: number,
		maximum: number
	) => {
		if (value === undefined) return fallback;
		if (
			typeof value !== "string"
			|| !/^(?:0|[1-9]\d*)$/u.test(value)
		) {
			return null;
		}
		const parsed = Number(value);
		return Number.isSafeInteger(parsed) && parsed <= maximum
			? parsed
			: null;
	};
	const offset = parseInteger(
		req.query.offset,
		0,
		MAX_PROJECT_LIST_OFFSET
	);
	const limit = parseInteger(
		req.query.limit,
		PROJECT_LIST_PAGE_SIZE,
		MAX_PROJECT_LIST_PAGE_SIZE
	);
	if (offset === null || limit === null || limit < 1) {
		res.status(400).json({
			message: `Project list pagination requires an offset from 0 through ${MAX_PROJECT_LIST_OFFSET} and a limit from 1 through ${MAX_PROJECT_LIST_PAGE_SIZE}`
		});
		return null;
	}
	return { limit, offset };
}

function paginatedResult<T>(
	items: T[],
	{ limit, offset }: { limit: number; offset: number }
) {
	const hasNextPage = items.length > limit;
	return {
		items: items.slice(0, limit),
		nextOffset: hasNextPage ? offset + limit : null
	};
}

function documentID(value: unknown) {
	if (value && typeof value === "object" && "_id" in value) {
		const id = (value as { _id?: unknown })._id;
		return id?.toString() ?? "";
	}

	return value?.toString() ?? "";
}

function currentProjectOwner(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	if (req.currentAdmin) {
		return {
			id: req.currentAdmin._id,
			role: "admin" as const
		};
	}

	if (req.currentTutor) {
		return {
			id: req.currentTutor._id,
			role: "tutor" as const
		};
	}

	if (req.currentUser) {
		return {
			id: req.currentUser._id,
			role: "user" as const
		};
	}

	if (req.currentCourseCodeLearner) {
		return {
			courseID: req.currentCourseCodeLearner.courseID,
			id: req.currentCourseCodeLearner._id,
			role: "courseCodeLearner" as const
		};
	}

	res.status(403).json({ message: "Signed-in account required" });
	return null;
}

function ownerRoleClause(
	role: PythonProjectOwnerRole
): QueryFilter<IPythonProject> {
	if (role === "user") {
		return {
			$or: [{ ownerRole: "user" }, { ownerRole: { $exists: false } }]
		};
	}

	return { ownerRole: role };
}

function projectOwnerQuery(
	owner: { id: Types.ObjectId; role: PythonProjectOwnerRole }
): QueryFilter<IPythonProject> {
	return {
		user: owner.id,
		...ownerRoleClause(owner.role)
	};
}

function studentProjectOwnerQuery(
	userID: Types.ObjectId
): QueryFilter<IPythonProject> {
	return {
		user: userID,
		...ownerRoleClause("user")
	};
}

function tutorOwnsUser(user: { tutors?: unknown[] } | null, tutorID: string) {
	return user?.tutors?.some(tutor => documentID(tutor) === tutorID) ?? false;
}

function actingReviewer(req: Parameters<RequestHandler>[0]):
	| {
		id: Types.ObjectId;
		name: string;
		role: PythonProjectReviewRole;
	}
	| null {
	if (req.currentAdmin) {
		return {
			id: req.currentAdmin._id,
			name: req.currentAdmin.name,
			role: "admin"
		};
	}

	if (req.currentTutor) {
		return {
			id: req.currentTutor._id,
			name: req.currentTutor.name,
			role: "tutor"
		};
	}

	return null;
}

async function findManagedPythonProjectUser(
	req: Parameters<RequestHandler>[0],
	res: Parameters<RequestHandler>[1]
) {
	const userID = getUserIDParam(req, res);
	if (!userID) return null;

	const user = await User.findById(userID).populate("tutors", "_id");
	if (!user) {
		res.sendStatus(404);
		return null;
	}

	if (req.currentAdmin) return user;

	const actingTutor = req.currentTutor;
	if (!actingTutor) {
		res.status(403).json({ message: "Tutor or admin session required" });
		return null;
	}

	if (!tutorOwnsUser(user, actingTutor._id.toString())) {
		res.status(403).json({ message: "You can only review code for your own students" });
		return null;
	}

	return user;
}

async function findOwnedProject(req: Parameters<RequestHandler>[0], res: Parameters<RequestHandler>[1]) {
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return null;

	const owner = currentProjectOwner(req, res);
	if (!owner) return null;

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		...projectOwnerQuery(owner)
	});

	if (!project) {
		res.sendStatus(404);
		return null;
	}

	return project;
}

export const listPythonProjects: RequestHandler = async (req, res) => {
	const owner = currentProjectOwner(req, res);
	if (!owner) return;
	const pagination = getListPagination(req, res);
	if (!pagination) return;

	const projects = await PythonProject.find(projectOwnerQuery(owner))
		.select("-files")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.offset)
		.limit(pagination.limit + 1);
	const page = paginatedResult(projects, pagination);

	res.json({
		nextOffset: page.nextOffset,
		projects: page.items.map(serializePythonProjectMetadata)
	});
};

export const listVisiblePythonProjectReviews: RequestHandler = async (req, res) => {
	const userID = req.currentUser?._id;
	if (!userID) return res.json({ nextOffset: null, reviews: [] });
	const pagination = getListPagination(req, res);
	if (!pagination) return;

	const reviews = await PythonProjectReview.find({
		user: userID,
		visibleToStudent: true
	})
		.select("-files")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.offset)
		.limit(pagination.limit + 1);
	const page = paginatedResult(reviews, pagination);

	res.json({
		nextOffset: page.nextOffset,
		reviews: page.items.map(serializePythonProjectReviewMetadata)
	});
};

export const listManagedPythonProjects: RequestHandler = async (req, res) => {
	const user = await findManagedPythonProjectUser(req, res);
	if (!user) return;
	const pagination = getListPagination(req, res);
	if (!pagination) return;

	const projects = await PythonProject.find(studentProjectOwnerQuery(user._id))
		.select("-files")
		.sort({ updatedAt: -1, _id: -1 })
		.skip(pagination.offset)
		.limit(pagination.limit + 1);
	const page = paginatedResult(projects, pagination);
	const projectIDs = page.items.map(project => project._id);
	const reviews = projectIDs.length
		? await PythonProjectReview.find({
				sourceProject: { $in: projectIDs },
				user: user._id
			}).select("-files")
		: [];
	const reviewsByProject = new Map(
		reviews.map(review => [
			review.sourceProject.toString(),
			serializePythonProjectReviewMetadata(review)
		])
	);

	res.json({
		nextOffset: page.nextOffset,
		projects: page.items.map(project => ({
			project: serializePythonProjectMetadata(project),
			review: reviewsByProject.get(project._id.toString()) ?? null
		}))
	});
};

export const getPythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;
	res.json({ project: serializePythonProject(project) });
};

export const getVisiblePythonProjectReview: RequestHandler = async (req, res) => {
	const userID = req.currentUser?._id;
	if (!userID) return res.sendStatus(404);
	const reviewID = getReviewIDParam(req, res);
	if (!reviewID) return;

	const review = await PythonProjectReview.findOne({
		_id: new Types.ObjectId(reviewID),
		user: userID,
		visibleToStudent: true
	});
	if (!review) return res.sendStatus(404);
	res.json({ review: serializePythonProjectReview(review) });
};

export const getManagedPythonProject: RequestHandler = async (req, res) => {
	const user = await findManagedPythonProjectUser(req, res);
	if (!user) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;

	const projectObjectID = new Types.ObjectId(projectID);
	const [project, review] = await Promise.all([
		PythonProject.findOne({
			_id: projectObjectID,
			...studentProjectOwnerQuery(user._id)
		}),
		PythonProjectReview.findOne({
			sourceProject: projectObjectID,
			user: user._id
		})
	]);
	if (!project) return res.sendStatus(404);
	res.json({
		project: serializePythonProject(project),
		review: review ? serializePythonProjectReview(review) : null
	});
};

export const createPythonProject: RequestHandler = async (req, res) => {
	const owner = currentProjectOwner(req, res);
	if (!owner) return;
	const projectCount = await PythonProject.countDocuments(
		projectOwnerQuery(owner)
	).exec();
	if (projectCount >= MAX_SAVED_PROJECTS_PER_ACCOUNT) {
		return res.status(409).json({
			message: `This account has reached its ${MAX_SAVED_PROJECTS_PER_ACCOUNT}-project storage limit`
		});
	}

	const parsed = projectPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const mode = parsed.data.mode ?? "python";
	const files = normalizeProjectFiles(parsed.data.files, mode);
	if (rejectProjectFilesForMode(res, files, mode, "Invalid project payload")) return;
	const activeFileName = normalizeActiveFileName(parsed.data.activeFileName, files);
	const project = await PythonProject.create({
		user: owner.id,
		ownerRole: owner.role,
		title: parsed.data.title ?? "Untitled Code Project",
		mode,
		files,
		activeFileName,
		courseID: owner.role === "courseCodeLearner"
			? owner.courseID
			: parsed.data.courseID,
		courseProjectKey: parsed.data.courseProjectKey,
		courseProjectTitle: parsed.data.courseProjectTitle,
		starterLabel: parsed.data.starterLabel,
		starterUrl: parsed.data.starterUrl,
		sharedSourceID: parsed.data.sharedSourceID
	});

	res.status(201).json({ project: serializePythonProject(project) });
};

export const createPythonProjectReview: RequestHandler = async (req, res) => {
	const user = await findManagedPythonProjectUser(req, res);
	if (!user) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;
	const reviewer = actingReviewer(req);
	if (!reviewer) return res.status(403).json({ message: "Tutor or admin session required" });

	const project = await PythonProject.findOne({
		_id: new Types.ObjectId(projectID),
		...studentProjectOwnerQuery(user._id)
	});
	if (!project) return res.sendStatus(404);

	const existingReview = await PythonProjectReview.findOne({
		user: user._id,
		sourceProject: project._id
	});
	if (existingReview) {
		return res.json({
			project: serializePythonProject(project),
			review: serializePythonProjectReview(existingReview)
		});
	}

	const files = safeSerializedProjectFiles(project);
	const review = await PythonProjectReview.create({
		user: user._id,
		sourceProject: project._id,
		title: project.title,
		mode: project.mode,
		files,
		activeFileName: normalizeActiveFileName(project.activeFileName, files),
		courseID: project.courseID,
		courseProjectKey: project.courseProjectKey,
		courseProjectTitle: project.courseProjectTitle,
		reviewer: reviewer.id,
		reviewerRole: reviewer.role,
		reviewerName: reviewer.name,
		lastEditedBy: reviewer.id,
		lastEditedByRole: reviewer.role,
		lastEditedByName: reviewer.name,
		visibleToStudent: false,
		note: "",
		sourceUpdatedAt: project.updatedAt
	});

	res.status(201).json({
		project: serializePythonProject(project),
		review: serializePythonProjectReview(review)
	});
};

export const updatePythonProject: RequestHandler = async (req, res) => {
	const owner = currentProjectOwner(req, res);
	if (!owner) return;
	const project = await findOwnedProject(req, res);
	if (!project) return;

	const parsed = projectPayloadSchema.partial().safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid project payload", issues: parsed.error.issues });
	}

	const nextMode = parsed.data.mode ?? project.mode;
	const nextFiles = parsed.data.files ? normalizeProjectFiles(parsed.data.files, nextMode) : safeSerializedProjectFiles(project);
	if (rejectProjectFilesForMode(res, nextFiles, nextMode, "Invalid project payload")) return;
	const nextActiveFileName = normalizeActiveFileName(parsed.data.activeFileName ?? project.activeFileName, nextFiles);

	if (parsed.data.title) project.title = parsed.data.title;
	if (parsed.data.mode) project.mode = parsed.data.mode as PythonProjectMode;
	if (parsed.data.files) project.files = nextFiles;
	if (owner.role === "courseCodeLearner") {
		project.courseID = owner.courseID;
	}
	else if (parsed.data.courseID) {
		project.courseID = parsed.data.courseID;
	}
	if (parsed.data.courseProjectKey) project.courseProjectKey = parsed.data.courseProjectKey;
	if (parsed.data.courseProjectTitle) project.courseProjectTitle = parsed.data.courseProjectTitle;
	if (parsed.data.starterLabel) project.starterLabel = parsed.data.starterLabel;
	if (parsed.data.starterUrl) project.starterUrl = parsed.data.starterUrl;
	if (parsed.data.sharedSourceID) project.sharedSourceID = parsed.data.sharedSourceID;
	project.ownerRole ??= "user";
	if (parsed.data.files || parsed.data.activeFileName) project.activeFileName = nextActiveFileName;

	await project.save();
	res.json({ project: serializePythonProject(project) });
};

export const updatePythonProjectShare: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;

	const parsed = projectSharePayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid share payload", issues: parsed.error.issues });
	}

	const wasShared = project.shared === true;
	project.shared = parsed.data.shared;
	project.ownerRole ??= "user";
	if (project.shared) {
		if (!wasShared || !project.shareID) {
			project.shareID = createPythonProjectShareID();
			project.shareCreatedAt = new Date();
		}
	}
	else if (!project.shared) {
		project.shareID = undefined;
		project.shareCreatedAt = undefined;
	}

	await project.save();
	res.json({ project: serializePythonProject(project) });
};

export const getSharedPythonProject: RequestHandler = async (req, res) => {
	const shareID = getShareIDParam(req, res);
	if (!shareID) return;

	const project = await PythonProject.findOne({
		shareID,
		shared: true
	});

	if (!project) return res.sendStatus(404);
	res.json({ project: serializeSharedPythonProject(project) });
};

export const updatePythonProjectReview: RequestHandler = async (req, res) => {
	const user = await findManagedPythonProjectUser(req, res);
	if (!user) return;
	const projectID = getProjectIDParam(req, res);
	if (!projectID) return;
	const reviewID = getReviewIDParam(req, res);
	if (!reviewID) return;
	const reviewer = actingReviewer(req);
	if (!reviewer) return res.status(403).json({ message: "Tutor or admin session required" });

	const parsed = projectReviewPayloadSchema.safeParse(req.body ?? {});
	if (!parsed.success) {
		return res.status(400).json({ message: "Invalid review payload", issues: parsed.error.issues });
	}

	const [project, review] = await Promise.all([
		PythonProject.findOne({
			_id: new Types.ObjectId(projectID),
			...studentProjectOwnerQuery(user._id)
		}),
		PythonProjectReview.findOne({
			_id: new Types.ObjectId(reviewID),
			user: user._id,
			sourceProject: new Types.ObjectId(projectID)
		})
	]);
	if (!project || !review) return res.sendStatus(404);

	const refreshFromSource = parsed.data.refreshFromSource === true;
	const nextMode = refreshFromSource ? project.mode : review.mode;
	const nextFiles = refreshFromSource
		? safeSerializedProjectFiles(project)
		: parsed.data.files
			? normalizeProjectFiles(parsed.data.files, review.mode)
			: safeSerializedProjectFiles(review);
	if (rejectProjectFilesForMode(res, nextFiles, nextMode, "Invalid review payload")) return;
	const nextActiveFileName = normalizeActiveFileName(
		refreshFromSource ? project.activeFileName : parsed.data.activeFileName ?? review.activeFileName,
		nextFiles
	);

	if (refreshFromSource || parsed.data.files) review.files = nextFiles;
	if (refreshFromSource) {
		review.title = project.title;
		review.mode = project.mode;
		review.courseID = project.courseID;
		review.courseProjectKey = project.courseProjectKey;
		review.courseProjectTitle = project.courseProjectTitle;
		review.sourceUpdatedAt = project.updatedAt;
	}
	if (parsed.data.visibleToStudent !== undefined) review.visibleToStudent = parsed.data.visibleToStudent;
	if (parsed.data.note !== undefined) review.note = parsed.data.note;
	if (refreshFromSource || parsed.data.files || parsed.data.activeFileName) review.activeFileName = nextActiveFileName;
	review.lastEditedBy = reviewer.id;
	review.lastEditedByRole = reviewer.role;
	review.lastEditedByName = reviewer.name;

	await review.save();
	res.json({
		project: serializePythonProject(project),
		review: serializePythonProjectReview(review)
	});
};

export const deletePythonProject: RequestHandler = async (req, res) => {
	const project = await findOwnedProject(req, res);
	if (!project) return;

	await Promise.all([
		project.deleteOne(),
		PythonProjectReview.deleteMany({ sourceProject: project._id })
	]);
	res.sendStatus(204);
};
