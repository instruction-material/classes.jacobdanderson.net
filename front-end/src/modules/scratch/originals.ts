import catalog from "../../../scripts/scratch/originals/catalog.json";
import corrections from "../../../scripts/scratch/originals/program-corrections.json";
import { bootcampReferenceSourceId } from "./bootcamp";
import { scratchProjectLimit } from "./frame";

export interface ScratchOriginalProject {
	id: string;
	name: string;
	author: string;
	url: string;
	sourceSHA256: string;
	providedCode: boolean;
	extensions: string[];
	bindings: Array<{ courseId: string; role: string }>;
}

export function scratchOriginalCorrection(project: ScratchOriginalProject) {
	if (project.id.endsWith("-reference"))
		return "Instructor remix by Classes with Jacob.";
	return corrections.find(
		record =>
			record.id === project.id &&
			record.sourceSHA256 === project.sourceSHA256
	)?.displaySummary;
}

// These three assignments require the same program behavior in Level 1 and Bootcamp.
const sharedLevel1References = new Set([
	"287922077-reference",
	"299094220-reference",
	"327610727-reference"
]);

export function hasRevisedLevel1Reference(url: string, courseId?: string) {
	if (courseId !== "scratch-level-1") return false;
	const match =
		/^https:\/\/scratch\.mit\.edu\/projects\/([1-9]\d{0,11})(?:\/embed|\/?)$/.exec(
			url
		);
	return !!match && sharedLevel1References.has(`${match[1]}-reference`);
}

export function scratchOriginalProject(
	id: unknown,
	courseId: unknown,
	role: unknown = "project"
): ScratchOriginalProject | undefined {
	if (
		typeof id === "string" &&
		role === "reference" &&
		(courseId === "scratch-level-1-bootcamp" ||
			(courseId === "scratch-level-1" && sharedLevel1References.has(id)))
	) {
		const sourceId = bootcampReferenceSourceId(id);
		const source = catalog.projects.find(
			project => project.id === sourceId
		);
		if (source) return { ...source, id };
	}
	if (
		typeof id !== "string" ||
		!/^[1-9]\d{0,11}$/.test(id) ||
		typeof courseId !== "string" ||
		(role !== "project" && role !== "reference")
	) {
		return undefined;
	}
	return catalog.projects.find(
		project =>
			project.id === id &&
			project.bindings.some(
				binding =>
					binding.courseId === courseId &&
					(role === "reference"
						? binding.role === "reference"
						: binding.role === "project" ||
							binding.role === "capstone-direction")
			)
	);
}

export function scratchOriginalResource(
	url: string,
	courseId: string,
	role: "project" | "reference" = "project"
) {
	const match =
		/^https:\/\/scratch\.mit\.edu\/projects\/([1-9]\d{0,11})\/?$/.exec(url);
	if (!match) return undefined;
	const id = match[1];
	const remix = `${id}-reference`;
	if (
		courseId === "scratch-level-1" &&
		role === "reference" &&
		sharedLevel1References.has(remix)
	) {
		return scratchOriginalProject(remix, courseId, role);
	}
	return scratchOriginalProject(id, courseId, role);
}

export function scratchOriginalArchiveUrl(project: ScratchOriginalProject) {
	if (
		!catalog.projects.some(
			item =>
				(item.id === project.id ||
					item.id === bootcampReferenceSourceId(project.id)) &&
				item.sourceSHA256 === project.sourceSHA256
		)
	) {
		throw new Error("Unknown original Scratch project");
	}
	return `/scratch-originals/${project.id}.sb3`;
}

/** Bind the imported archive to the reviewed source and this release's exact bytes. */
export async function fetchScratchOriginalArchive(
	project: ScratchOriginalProject,
	signal?: AbortSignal
) {
	const url = scratchOriginalArchiveUrl(project);
	const options = {
		credentials: "omit" as const,
		cache: "no-store" as const,
		signal
	};
	const indexResponse = await fetch(
		"/scratch-originals/catalog.json",
		options
	);
	if (!indexResponse.ok)
		throw new Error("Missing original Scratch inventory");
	const index: unknown = await indexResponse.json();
	const entry = Array.isArray(index)
		? (index.find(value => value?.id === project.id) as
				Record<string, unknown> | undefined)
		: undefined;
	if (
		!entry ||
		entry.sourceSHA256 !== project.sourceSHA256 ||
		typeof entry.sha256 !== "string" ||
		!/^[a-f0-9]{64}$/.test(entry.sha256) ||
		typeof entry.bytes !== "number" ||
		!Number.isInteger(entry.bytes) ||
		entry.bytes < 1 ||
		entry.bytes > scratchProjectLimit
	) {
		throw new Error("Original Scratch inventory identity mismatch");
	}
	const response = await fetch(url, options);
	if (!response.ok) throw new Error("Missing original Scratch archive");
	const bytes = await response.arrayBuffer();
	if (bytes.byteLength !== entry.bytes)
		throw new Error("Original Scratch archive size mismatch");
	const digest = await crypto.subtle.digest("SHA-256", bytes);
	const actual = [...new Uint8Array(digest)]
		.map(byte => byte.toString(16).padStart(2, "0"))
		.join("");
	if (actual !== entry.sha256)
		throw new Error("Original Scratch archive identity mismatch");
	return bytes;
}

export const scratchOriginalLicense = {
	name: catalog.license,
	url: catalog.licenseURL
};
