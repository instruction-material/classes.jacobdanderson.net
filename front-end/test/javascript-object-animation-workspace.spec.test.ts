import { webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import { javascriptCourseProjectKey } from "@/modules/javascriptCourseResources";
import { javascriptObjectAnimationResources } from "@/modules/javascriptObjectAnimationResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";

afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
});

for (const resource of javascriptObjectAnimationResources) {
	it(`reopens and exports the ${resource.project} ${resource.role} with its original identity`, async () => {
		vi.stubGlobal("crypto", webcrypto);
		vi.stubGlobal("fetch", async (url: string) => {
			expect(url).toMatch(
				/^\/course-assets\/javascript-level-2\/object-animation-v1\//u
			);
			return new Response(readFileSync(resolve("public", url.slice(1))));
		});
		const [url] = resource.urls;
		const course = resource.courseId;
		const itemId =
			course +
			"-jsm6-objects-and-properties-curriculum-" +
			(resource.project === "animation-demo"
				? "animations-in-the-canvas"
				: "jsm6-project-3-inflate-and-deflate");
		const key = javascriptCourseProjectKey(
			course,
			itemId,
			resource.role,
			url
		);
		for (const alias of resource.urls) {
			expect(
				javascriptCourseProjectKey(course, itemId, resource.role, alias)
			).toBe(key);
			expect(pythonIdeModeForCourseResource(course, alias)).toBe("web");
		}
		const files = await loadPythonIdeStarterFilesFromGitHub(url, "web");
		const model = files.find(file => file.name === "model.js");
		if (model) {
			const trace = runInNewContext(
				model.content +
					"\nlet state = initialState(); Array.from({length: 1002}, () => {const shown = state; state = nextFrame(state); return shown;});"
			);
			if (resource.project === "animation-demo") {
				expect([
					trace[0].x,
					trace[499].x,
					trace[500].x,
					trace[501].x,
					trace[1000].x
				]).toEqual([0, 499, 500, 499, 0]);
			} else if (resource.role === "reference") {
				expect(trace[1].radius).toBe(25);
				expect(
					trace
						.slice(36, 39)
						.map((s: { radius: number; color: string }) => [
							s.radius,
							s.color
						])
				).toEqual([
					[200, "green"],
					[205, "green"],
					[200, "red"]
				]);
				expect(
					trace
						.slice(76, 79)
						.map((s: { radius: number; color: string }) => [
							s.radius,
							s.color
						])
				).toEqual([
					[10, "red"],
					[5, "red"],
					[10, "green"]
				]);
			}
		} else {
			expect(resource.project).toBe("inflate-and-deflate");
			expect(resource.role).toBe("starter");
			expect(
				files.find(file => file.name === "script.js")?.content
			).toContain("Enter your code");
			expect(
				files.find(file => file.name === "index.html")?.content
			).not.toContain("<canvas");
		}
		const project = createPythonIdeProject("web", {
			courseID: course,
			courseProjectKey: key,
			starterUrl: url,
			files
		});
		project.files.find(file => file.name === "script.js")!.content +=
			"\n// Saved frame trace\n";
		await saveLocalPythonProjects([project]);
		const [reopened] = await loadLocalPythonProjects();
		expect(reopened).toEqual(project);
		const zip = unzipSync(await createProjectArchive(reopened));
		expect(Object.keys(zip)).toHaveLength(resource.files.length);
		for (const file of reopened.files) {
			const entry = Object.keys(zip).find(name =>
				name.endsWith("/" + file.name)
			)!;
			expect(strFromU8(zip[entry])).toBe(file.content);
		}
	});
}
