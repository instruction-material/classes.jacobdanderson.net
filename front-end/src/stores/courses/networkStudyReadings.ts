import type { RawCourse } from "./types";
import { courseAssetViewerUrl } from "@/modules/courseAssetPreview";
import { networkVerifiedPacks } from "@/modules/networkProjectResources";
import application from "../../assets/course-guides/network-application-responses.md?raw";
import capture from "../../assets/course-guides/network-http-capture.md?raw";
import reachability from "../../assets/course-guides/network-reachability.md?raw";
import resolution from "../../assets/course-guides/network-resolution-comparison.md?raw";
import transport from "../../assets/course-guides/network-transport.md?raw";
import { mapMarkdownProse } from "./markdownProse";
import readingData from "./networkStudyReadingsData.json";

const guides = { application, capture, reachability, resolution, transport };
interface StudyReading {
	content: string;
	assignment?: boolean;
	pack?: string;
	guide?: keyof typeof guides;
}
const entries = readingData as Record<string, StudyReading>;
const referenceModules = new Set([
	"Standards Map",
	"Course Roadmap",
	"Project Practice Guide",
	"Network Systems: Systems and Security Lab Safety Policy",
	"Network Systems: Defensive Lab Contract",
	"Network Systems: Toolchain and Version Assumptions"
]);

function unwrapStudyParagraphs(prose: string) {
	return prose
		.split("\n\n")
		.map(block => {
			const structured = block
				.split("\n")
				.some(line =>
					/^\s*(?:#{1,6}\s|[-*+]\s|\d+[.)]\s|>|\|)/.test(line)
				);
			return structured ? block : block.replace(/(?<! {2})\n/g, " ");
		})
		.join("\n\n");
}

export function applyNetworkStudyReadings(course: RawCourse) {
	let replaced = 0;
	for (const module of course.modules) {
		for (const item of [
			...module.curriculum,
			...module.supplementalProjects
		]) {
			const entry = entries[item.title];
			if (!item.projectLink && !entry?.assignment) {
				item.contentKind = "reading";
				item.content = mapMarkdownProse(
					item.content,
					unwrapStudyParagraphs
				);
				if (
					module.title ===
					"Optional Network Expansion and Integration Studio Archive"
				) {
					item.content = item.content.split("\n\n**Studio:**")[0];
				}
			}
			if (!entry) continue;
			const guide = entry.guide
				? `\n\n## Complete source guide\n\n${guides[entry.guide]
						.replace(/instructor/gi, "guided review")
						.replace(
							/for\s+the\s+learner\s+attempt/g,
							"for the independent attempt"
						)
						.replace(
							"addresses and server local/peer addresses should agree",
							"addresses and server local/peer addresses are expected to agree"
						)
						.replace(
							"Predict which facts should change",
							"Predict which facts change"
						)
						.replace(
							"Flow membership should follow",
							"Flow membership follows"
						)
						.replace("should retain", "retains")}`
				: "";
			item.content = (entry.content + guide).replace(
				/\]\((\/course-assets\/[^)]+\.md(?:#[^)]*)?)\)/g,
				(_, path: string) => `](${courseAssetViewerUrl(path)})`
			);
			item.contentKind = entry.assignment ? "assignment" : "reading";
			item.preserveInstructions = true;
			item.preserveAssignment = true;
			if (referenceModules.has(module.title))
				item.learningPath = "choice";
			if (entry.pack) {
				const definition = networkVerifiedPacks.find(
					pack => pack.pack === entry.pack
				);
				if (!definition) {
					throw new Error(
						`Missing Network practice source: ${entry.pack}`
					);
				}
				const base = `https://github.com/instruction-material/Network-Systems/tree/${
					definition.revision
				}/${definition.pack}`;
				item.projectLink = `${base}/starter`;
				item.solutionLink = `${base}/solution`;
				item.ideImport = true;
			}
			replaced++;
		}
	}
	if (replaced !== 49) throw new Error("Expected 49 Network study readings.");
}
