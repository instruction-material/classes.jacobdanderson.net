import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModuleItem
} from "./types";
import foundations from "../../assets/course-guides/web-deployment-foundations.md?raw";
import operations from "../../assets/course-guides/web-deployment-operations.md?raw";
import project from "../../assets/course-guides/web-deployment-project.md?raw";
import { webDeploymentRoot } from "../../modules/webProjectResources";

export function applyWebDeploymentWorkflow(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF7 Stage 6: Hosting and Deployment"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 2 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error("Unexpected deployment module activities");
	}
	const id =
		"web-development-foundations-wdf7-stage-6-hosting-and-deployment";
	module.id = id;
	const reading = module.curriculum[0];
	reading.id = `${id}-curriculum-hosting-and-deployment-core-concepts`;
	reading.content = [foundations, project, operations]
		.map(part => part.trim())
		.join("\n\n---\n\n");
	reading.preserveInstructions = true;
	delete reading.projectLink;
	delete reading.solutionLink;
	delete reading.ideImport;
	module.curriculum[1].id = `${id}-curriculum-core-project-hosting-and-deployment`;
	for (const [index, suffix] of [
		"project-ship-a-front-end-and-back-end-separately",
		"hosting-deployment-transfer-practice",
		"hosting-deployment-extension-practice"
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
		item.projectLink = `${webDeploymentRoot}/starter`;
		item.ideImport = true;
		if (path === "core")
			item.solutionLink = `${webDeploymentRoot}/solution`;
		else delete item.solutionLink;
	};
	update(
		module.curriculum[1],
		"Core Project: Retain and Restore a Release",
		"Complete digestBytes and assertInventory in release-model.mjs using the byte and inventory contracts in the reading. Start the independent front-end and API processes and record their actual origins. Build retained release A, then build B with the deliberately wrong public API path. Show that B passes integrity verification but fails browser acceptance while the API stays healthy. Restore A into a new target without rebuilding from the broken source, serve that target on the same front-end port, and show recovery without restarting the API. Compare the retained and restored bytes, reject a changed artifact copy, and keep A unchanged. Save, reopen and export the edited selected-role source, then run it in the matching complete maintained checkout. Compare the core reference after an independent attempt.\n\n**Checkpoints:** Retain the two completed functions, process/configuration map, command outcomes, A and restored inventories, B failure evidence, unchanged API process evidence and successful saved-export run.",
		"core"
	);
	update(
		module.supplementalProjects[0],
		"Choice: Build a Deployment Probe",
		"Continue the completed deployment workspace. Add deployment-probe.mjs using Node.js 24 fetch and node:assert/strict. Accept the owned front-end and API loopback URLs as arguments and reject another host. Check the static index and env.js MIME/status, GET /api/status and the exact selected-role message, and the response's Access-Control-Allow-Origin for the actual page origin. Use a native Origin header for that comparison. Include an unknown front-end route returning 404 and a wrong method returning 405 with Allow: GET, HEAD. Bound every request with AbortSignal.timeout(2000); check both status and parsed body where applicable, print case labels without private data, and exit unsuccessfully after a failed assertion. Native fetch does not enforce browser CORS: separately retain a real browser result. Run the exported probe against A, against an unavailable owned API and after restart. The core reference does not include this added probe.\n\n**Checkpoints:** Retain the added program, expected and observed cases, failed and successful exit codes, and separate browser acceptance.",
		"choice"
	);
	update(
		module.supplementalProjects[1],
		"Choice: Compare Release Manifests",
		"Continue the saved deployment workspace. Add compare-releases.mjs that accepts two manifest paths, reads their JSON and validates each with validateManifest from the selected role's release-model.mjs. Build a Map by filename and print a sorted changed-files array containing name, beforeBytes, afterBytes, beforeSHA256 and afterSHA256 for each differing record. The fixed role file list is the same in both manifests; an added or missing filename is invalid rather than an accepted change. Compare A with B, then compare A with restored A. Reordering manifest records must not create a difference, and invalid JSON, unknown schema, wrong role or duplicate filenames must exit unsuccessfully. Never rewrite either input. This report compares claimed inventories; run the supplied release.mjs verify against each actual artifact separately before trusting those claims. A changed digest identifies different bytes, not whether the new behavior is correct. The core reference does not include this report.\n\n**Checkpoints:** Retain the program, both untouched manifests, expected changed filename, no-change restore result, reordered-input case and invalid-input results.",
		"choice"
	);
	update(
		module.supplementalProjects[2],
		"Challenge: Automate Verified Recovery Staging",
		"Add stage-recovery.mjs to automate preparation of a separate recovery target. Accept retained artifact and new destination arguments. Use promisify from node:util with execFile from node:child_process to invoke process.execPath and the selected role's release.mjs, passing arguments as an array. Bound each call with timeout: 5000, maxBuffer: 65536 and killSignal: SIGKILL. Verify the retained source, call restore with the new destination, then independently verify that destination. Parse successful stdout as JSON; require ok: true and equal manifestSHA256 values. Compare original and restored manifest bytes with readFile, and print one recovery receipt containing the source, destination, digest and passed stages only after every check succeeds. A failed command must exit unsuccessfully and must not claim a completed recovery. Do not overwrite or delete an existing target, switch a running server or restart the API in this staging program.\n\nExercise an untouched A, a corrupted disposable copy and an existing destination. A corrupt source must fail before a destination is created; an existing destination remains unchanged. A failed copy may leave a new incomplete candidate, so report that path and inspect it before retrying with a new target. Preserve the original artifact and working source. Finally serve a successfully staged target manually and retain real browser and unchanged-API evidence. Automated staging, live switching and browser acceptance are separate outcomes. The core reference does not include this added orchestration program.\n\n**Checkpoints:** Retain the exported program, successful receipt, negative cases, before/after input digests, destination no-overwrite proof and final browser recovery.",
		"challenge"
	);
}
