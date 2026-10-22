import type { RawCourse, RawCourseModuleItem } from "./types";
import liveChat from "../../assets/course-guides/web-live-chat.md?raw";
import reading from "../../assets/course-guides/web-notification-state.md?raw";
import {
	webChatRoot,
	webNotificationRoot
} from "../../modules/webProjectResources";

const id = "web-development-foundations-wdf4-stage-3-front-end-applications";

export function applyWebNotificationWorkflow(
	course: RawCourse,
	courseId: string
) {
	if (courseId !== "web-development-foundations") return;
	const module = course.modules.find(
		row => row.title === "WDF4 Stage 3: Front-End Applications"
	);
	if (!module) return;
	if (
		module.curriculum.length !== 2 ||
		module.supplementalProjects.length !== 3
	) {
		throw new Error("Unexpected notification module activities");
	}
	module.id = id;
	module.title = "WDF4 Notification Views and Asynchronous State";
	const [concepts, project] = module.curriculum;
	const [chat, choice, challenge] = module.supplementalProjects;
	const update = (
		item: RawCourseModuleItem,
		suffix: string,
		title: string,
		content: string,
		path?: "core" | "choice" | "challenge"
	) => {
		item.id = `${id}-${suffix}`;
		item.title = title;
		item.content = content;
		item.preserveInstructions = true;
		item.learningPath = path;
		if (item.projectLink) {
			item.projectLink = `${webNotificationRoot}/starter`;
			item.ideImport = true;
			if (path === "core")
				item.solutionLink = `${webNotificationRoot}/solution`;
			else delete item.solutionLink;
		}
	};
	update(
		concepts,
		"curriculum-front-end-applications-core-concepts",
		"Notification Views and Asynchronous State",
		reading.trim()
	);
	update(
		project,
		"curriculum-core-project-front-end-applications",
		"Core Project: Load, Filter, and Recover Notifications",
		"Implement normalizeEvent and applyEvents in the supplied starter, preserving their pure-function contracts. Predict and then verify the six fixture cases, duplicate and late-event handling, ten-entry history and 100-ID window. Run the supplied completion checks against the starter. Verify All/Messages/Status routes without refetching; loading, empty, error, disconnect, reconnect and reset; literal text rendering; retained focus and guarded unavailable actions; and an older response arriving after Reset. Inspect keyboard and pointer operation, 390/1280-pixel layouts and 200% zoom. Save, reopen and export every source, JSON and server file, then run the extracted project with Node.js 24. Record executed results separately from predictions. This required project uses local HTTP fixtures before the later live-server exercise.",
		"core"
	);
	chat.id = `${id}-supplemental-project-real-time-chat-or-notification-app`;
	chat.title = "Choice: Trace Live Chat after WDF5";
	chat.content = liveChat.trim();
	chat.preserveInstructions = true;
	chat.projectLink = `${webChatRoot}/starter`;
	chat.solutionLink = `${webChatRoot}/solution`;
	chat.ideImport = true;
	chat.learningPath = "choice";
	update(
		choice,
		"supplemental-front-end-apps-transfer-practice",
		"Choice: One More Notification View",
		"Continue the same saved notification project. Add a view for records whose text contains one chosen fictional workshop topic. Extend the navigation link, selectedView route and visibleEntries filter together. Verify direct fragment entry, switching away/back, an empty filtered view, current-link semantics and unchanged history/counts without another data request. Preserve the six baseline fixture cases. The supplied reference covers the core views, not this extra filter.\n\n**Checkpoints:** Keep the direct-fragment result, empty-view status, active-link state, unchanged request count and retained records when returning to a core view.",
		"choice"
	);
	update(
		challenge,
		"supplemental-front-end-apps-extension-practice",
		"Challenge: A Fixture at the Contract Boundaries",
		"Continue the notification project. Add boundary.json with exact-limit, one-over-limit and delayed records, keeping the baseline six files unchanged. Add boundary.json to the files set in serve.mjs and a Data set option with value boundary. Predict accepted IDs, rejection/duplicate counts and retained history before loading it. Compare reducer and browser results, then export/reopen the added file and retest from the extracted folder. Keep the documented event, batch, history and ID-window limits. The core reference does not contain this extra fixture.\n\n**Checkpoints:** Preserve the predictions, accepted IDs, actual counters and matching extracted-folder response for the added data set.",
		"challenge"
	);
}
