import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModuleItem
} from "./types";
import models from "../../assets/course-guides/web-notes-models.md?raw";
import project from "../../assets/course-guides/web-notes-project.md?raw";
import recovery from "../../assets/course-guides/web-notes-recovery.md?raw";
import storage from "../../assets/course-guides/web-notes-storage.md?raw";
import { webNotesRoot } from "../../modules/webProjectResources";

export function applyWebNotesWorkflow(course: RawCourse, courseId: string) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF6 Stage 5: Databases and Data Models"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 2 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error("Unexpected notes module activities");
	}
	const id =
		"web-development-foundations-wdf6-stage-5-databases-and-data-models";
	module.id = id;
	const reading = module.curriculum[0];
	reading.id = `${id}-curriculum-databases-and-data-models-core-concepts`;
	reading.content = [models, storage, recovery, project]
		.map(part => part.trim())
		.join("\n\n---\n\n");
	reading.preserveInstructions = true;
	delete reading.projectLink;
	delete reading.solutionLink;
	delete reading.ideImport;
	module.curriculum[1].id = `${id}-curriculum-core-project-databases-and-data-models`;
	for (const [index, suffix] of [
		"project-blog-or-notes-app-with-mongodb",
		"database-models-transfer-practice",
		"database-models-extension-practice"
	].entries())
		module.supplementalProjects[index].id = `${id}-supplemental-${suffix}`;
	const update = (
		item: RawCourseModuleItem,
		title: string,
		content: string,
		path: CourseItemLearningPath
	) => {
		item.title = title;
		item.content = content;
		item.learningPath = path;
		item.preserveInstructions = true;
		item.projectLink = `${webNotesRoot}/starter`;
		item.ideImport = true;
		if (path === "core") item.solutionLink = `${webNotesRoot}/solution`;
		else delete item.solutionLink;
	};
	update(
		module.curriculum[1],
		"Core Project: Notes, Identity, and Recovery",
		"Complete validateNoteInput in src/models/note.js and replaceMemoryNote in src/store.js using the exact contracts and algorithms in the reading and imported README. Predict the starter's 501 response, then verify create, read, full replacement and delete through the actual local API. Preserve IDs and creation times, distinguish invalid fields from duplicate-title conflicts, and retain exact tag values through browser edits. Export a snapshot, restore it to a separate memory process and compare complete records by ID before changing only the restored target. Demonstrate the memory restart/reset distinction and the unavailable-adapter response. The isolated local MongoDB path is optional; if used, verify persistence across an API restart without changing the public contract. Save, reopen and export the edited source, then run that export in its matching maintained checkout. Compare the core reference after an independent attempt.\n\n**Checkpoints:** Retain both completed functions, request/result table, stable-ID evidence, original and restored snapshots, and saved-export commands/results.",
		"core"
	);
	update(
		module.supplementalProjects[0],
		"Choice: Build a CRUD Lifecycle Probe",
		"Continue the completed notes workspace. Add lifecycle-probe.mjs using Node.js 24 fetch, node:crypto randomUUID and node:assert/strict. Use only the owned loopback URL from the service's ready event. Create a uniquely titled fictional note, retain its returned ID, read it, replace its body and tags while preserving identity, find it by exact title, confirm it in a snapshot, delete it, then confirm a second read returns 404. Include a tag containing a comma or quote and compare the exact array. Check both status and parsed body; a resolved fetch is not a passed case. Bound each request with AbortSignal.timeout(2000), exit unsuccessfully after a failed assertion and attempt deletion of the known created ID in finally. Print case labels and the created ID for cleanup, without note content. Run the exported probe against a fresh memory service; optionally compare the same public checks with an isolated MongoDB service. Stop the owned service to demonstrate failure, then restart and show recovery. The core reference does not include this added probe.\n\n**Checkpoints:** Retain the script, successful run, failed run, exit codes and cleanup result.",
		"choice"
	);
	update(
		module.supplementalProjects[1],
		"Choice: Compare Two Snapshots",
		"Continue the notes workspace. Add compare-snapshots.mjs that reads two JSON files, validates both with validateSnapshot from src/models/note.js and compares records by ID. Report separate added, removed and changed ID arrays, sorted by ID. For matching IDs, compare title, body, tags and both timestamps. Object-property order and record order must not create differences; tag element order remains meaningful. Use an untouched saved snapshot as the first file and an exported snapshot from an independently modified restore target as the second. Include cases for an unchanged record, one changed field, addition, deletion, reordered records and an invalid snapshot. A validation error must produce a nonzero exit without rewriting either input. Use node compare-snapshots.mjs before.json after.json from the matching role directory, then save and export the added program and fictional fixtures. The core reference does not include this comparison tool.\n\n**Checkpoints:** Retain the two source snapshots, expected and observed ID groups, permutation check and invalid-input result.",
		"choice"
	);
	update(
		module.supplementalProjects[2],
		"Challenge: Convert a Versioned Snapshot",
		[
			"Add convert-snapshot.mjs to the saved workspace. The supplied fictional version-0 exercise format below has exactly schemaVersion and records. Each record has exactly key, heading, text, labels, createdMs and changedMs. Convert key to id, heading to title, text to body, labels to tags, and integer epoch milliseconds to canonical UTC ISO timestamps. Keep IDs and every text/tag value unchanged. Validate the complete version-1 output with validateSnapshot before writing a new output file. Refuse an existing output path, keep the original input untouched, and exit unsuccessfully for invalid input rather than skipping records. This format is an exercise fixture, not an automatic migration supported by the service.",
			'```json\n{\n  "schemaVersion": 0,\n  "records": [{\n    "key": "00000000-0000-4000-8000-000000000001",\n    "heading": "Fictional observation",\n    "text": "A retained fictional value.",\n    "labels": ["moon, sky", "example"],\n    "createdMs": 1767225600000,\n    "changedMs": 1767312000000\n  }]\n}\n```',
			"The exact expected conversion is:",
			'```json\n{\n  "schemaVersion": 1,\n  "notes": [{\n    "id": "00000000-0000-4000-8000-000000000001",\n    "title": "Fictional observation",\n    "body": "A retained fictional value.",\n    "tags": ["moon, sky", "example"],\n    "createdAt": "2026-01-01T00:00:00.000Z",\n    "updatedAt": "2026-01-02T00:00:00.000Z"\n  }]\n}\n```',
			"Run node convert-snapshot.mjs legacy.json converted.json in the matching role directory. Reject an unknown version, unknown fields, missing fields, non-integer or invalid dates, a change time before creation, duplicate IDs/titles and records that fail the current contract. Test more than one record and preserve all identities. Restore the converted file into a separate memory process using the README's NOTES_SEED_FILE route, fetch its snapshot and compare complete records. Verify that the original file and original service remain unchanged. The core reference does not include this converter.",
			"**Checkpoints:** Retain the converter, original and converted files, expected output, rejection cases, no-overwrite check and separate-target restore evidence."
		].join("\n\n"),
		"challenge"
	);
}
