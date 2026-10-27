import type { RawCourseModuleItem } from "./types";

export const gitCourseGuideLink =
	"\n\n**Optional Git walkthrough:** [Git and GitHub for Course Projects](/course-assets/references/git-course-workflow.md) explains the correct learner/reference folder, ZIP versus clone, a reviewed local checkpoint and sharing. Keep the saved learner attempt separate from complete reference material.";

export function classroomReferenceItem(
	kind: "events" | "melody" | "records"
): RawCourseModuleItem {
	const references = {
		events: {
			id: "pgzero-events-reference",
			title: "Events and Safe Placement Reference",
			template: "event-reference",
			mode: "pgzero",
			asset: "pgzero-events-and-placement.md",
			content:
				"**Concept path:** This optional asset-free example demonstrates named input callbacks, a left-click guard, persistent score, delayed feedback and cancelling old callbacks on reset. The separate tile helper uses a finite grid and rejects an impossible layout.\n\n**Practice path:** Confirm a separate reference import. Press Enter, compare left/right/outside clicks, wait for feedback and reset before its callback. Read the linked guide before transferring one idea to the saved learner game. Keep Golf and Number Count attempts separate.\n\n**Verification:** One valid click changes the score once; redraws do not. Reset restores the ready screen. Tile placement respects actual dimensions and reports overcrowding."
		},
		melody: {
			id: "pysynth-song-reference",
			title: "Browser PySynth Song Reference",
			template: "melody-reference",
			mode: "python",
			asset: "pysynth-song.md",
			content:
				"**Concept path:** This optional example supplies a complete list of note/duration pairs with octaves, a rest and a final high note. At 120 bpm with pause=0 it generates a two-second WAV. The browser supplies the demonstrated API.\n\n**Practice path:** Confirm a separate reference import and run `main.py` in Python mode. Play and download the generated PySynth: course_melody.wav result. Predict one duration change, make it, and compare the whole sequence. Read the linked guide for note spellings, denominators and downloads.\n\n**Verification:** Hear the initial C, rest, G and final high C in order. Keep the learner Song Generator separate and validate its input rather than relying on fallback values."
		},
		records: {
			id: "java-record-reference",
			title: "Optional Java Record Reference",
			template: "record-reference",
			mode: "java",
			asset: "java-records.md",
			content:
				"**Concept path:** After classes and collections, compare compact-constructor validation, component accessors, separate instances and a shared mutable list. Records remain optional Java enrichment, separate from required AP CSA class-design work.\n\n**Practice path:** Confirm a separate editable reference import, save and export the ZIP, then compile Main.java with a native JDK 17 or newer using the linked guide. The site Java preview does not provide a full JDK or record compilation.\n\n**Verification:** Predict and compare both score lines, the copied and shared tag lists, and rejection of a negative score. Preserve the earlier class attempt."
		}
	};
	const reference = references[kind];
	const params = new URLSearchParams({
		mode: reference.mode,
		template: reference.template,
		projectKey: `course-reference:${reference.id}:v1`,
		starterTitle: reference.title,
		starterLabel: "Optional worked reference"
	});
	return {
		id: reference.id,
		title: reference.title,
		learningPath: "choice",
		content: reference.content,
		projectLink: `/ide?${params.toString()}`,
		datasetLink: `/course-assets/references/${reference.asset}`
	};
}

export const talentShowControllerGuide = [
	"**Concept path:** This optional trace supports Talent Show without changing its eight published instructions. Separate the question controller from each talent's behavior.",
	"**Practice path:** Reset position, direction and pen state once on the green flag; use pen up before moving to a starting position. Ask the first question before repeat until answer = stop. Inside the loop, use sibling if checks for speak, song, spin, draw and corners, finish each iteration with another ask and wait block. Nesting song inside if answer = speak makes song unreachable. Handle an unknown answer separately, excluding stop.",
	"**Verification:** Try speak, song, spin, draw, corners, an unknown answer and stop. Each finite behavior returns to the next question. Drawing raises the pen when finished, and restarting restores the scene.",
	"**Optional extension:** Once broadcasts are understood, an independent forever spin receiver can run beside the controller. Use broadcast for that receiver; broadcast and wait would wait forever. A finite receiver can use broadcast and wait when the controller needs completion. Once stop all is introduced, an explicit stop choice can end every script. Keep these extensions separate from the first working finite-spin version."
].join("\n\n");

export const mergeSortFrameGuide = [
	"**Concept path:** Distinguish merge's returned list, split's printed trace with None return, and merge_sort's returned new list. Printing a value does not return it to a caller.",
	"**Practice path:** Trace [7, 2, 6, 1, 5, 3, 4]. With midpoint len(values) // 2 the first children have lengths 3 and 4. Test the base case before making recursive calls. Record one call's input, two child results and merged return. For [2, 1], the children return [2] and [1], then merge returns [1, 2]. For merge([1, 4], [2, 3, 5]), the comparisons produce 1, 2, 3, 4, then the remaining right tail supplies 5.",
	"**Verification:** Check empty inputs, a one-sided merge, unequal lengths and duplicates against an independently written expected list. Preserve inputs and stable tie order. A printed sorted list followed by a None result reveals a missing return.",
	"**Optional native debugger:** In a configured Python debugger, Step Into enters the called function, Step Over completes that call in the current frame, and Step Out returns to its caller. Inspect one selected frame's local variables and call stack at a time. The website IDE supports this printed-trace route; it does not promise native debugger controls."
].join("\n\n");
