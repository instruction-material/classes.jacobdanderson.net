export type CourseItemLearningPath = "core" | "choice" | "challenge";

export interface RawCourseModuleItem {
	id?: string;
	aliases?: string[];
	/** Retain a maintenance record with its original progress identity. */
	internal?: boolean;
	title: string;
	content: string;
	/** Explicit content classification takes precedence over title heuristics. */
	contentKind?: "reading" | "assignment";
	/** Preserve structured reading and executable command blocks verbatim. */
	preserveInstructions?: boolean;
	/** Keep a separately assigned task out of merged support text. */
	preserveAssignment?: boolean;
	learningPath?: CourseItemLearningPath;
	projectLink?: string;
	/** Offer a confirmed IDE import for this project resource, including worked lessons. */
	ideImport?: boolean;
	solutionLink?: string;
	datasetLink?: string;
	mediaLink?: string;
	/** Retain the original media reference when a local asset replaces it. */
	sourceMedia?: {
		original: string;
		replacement: string;
	};
}

export interface RawCourseModule {
	id?: string;
	aliases?: string[];
	/** Retain maintenance records without offering them as course material. */
	internal?: boolean;
	kind?: "module" | "transition" | "appendix";
	title: string;
	estimatedTime?: string;
	keyBlocks?: string[];
	curriculum: RawCourseModuleItem[];
	supplementalProjects: RawCourseModuleItem[];
}

export interface CourseDevelopmentMetadata {
	priority: "urgent" | "soon" | "later";
	standards: string[];
	sourcePolicy: string;
	assessmentCadence: string[];
	toolchain: string[];
	safetyPolicy: string[];
	courseBoundaries: string[];
	capstoneExpectations: string[];
	recommendedNextWork: string[];
}

export interface RawCourse {
	name: string;
	modules: RawCourseModule[];
	developmentMetadata?: CourseDevelopmentMetadata;
}

export interface CourseSummary {
	id: string;
	name: string;
}

export interface CourseModuleItem extends RawCourseModuleItem {
	id: string;
	aliases?: string[];
	playableSolutionEmbedUrl?: string;
}

export interface CourseModule {
	id: string;
	aliases?: string[];
	internal?: boolean;
	kind?: "module" | "transition" | "appendix";
	title: string;
	estimatedTime?: string;
	keyBlocks?: string[];
	curriculum: CourseModuleItem[];
	supplementalProjects: CourseModuleItem[];
}

export interface CourseDefinition extends CourseSummary {
	modules: CourseModule[];
	developmentMetadata?: CourseDevelopmentMetadata;
}
