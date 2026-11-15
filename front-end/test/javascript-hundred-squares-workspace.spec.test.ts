import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { strFromU8, unzipSync } from "fflate";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, expect, it, vi } from "vitest";
import {
	javascriptCourseProjectKey,
	javascriptCourseResource
} from "@/modules/javascriptCourseResources";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects,
	createPythonIdeProject,
	loadLocalPythonProjects,
	loadPythonIdeStarterFilesFromGitHub,
	pythonIdeModeForCourseResource,
	saveLocalPythonProjects
} from "@/modules/pythonIde";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";

const fixture = JSON.parse(
	readFileSync(
		resolve("../test/fixtures/javascript-hundred-squares-sources.json"),
		"utf8"
	)
);
const prefix = "/course-assets/javascript-level-2/";
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
afterEach(async () => {
	vi.unstubAllGlobals();
	await clearLocalPythonProjects();
	document.body.replaceChildren();
});

for (const resource of fixture.resources) {
	it(
		"imports complete local 100 Squares " +
			resource.role +
			" and preserves edited work through reopening and ZIP export",
		async () => {
			vi.stubGlobal("crypto", webcrypto);
			const requests: string[] = [];
			vi.stubGlobal(
				"fetch",
				vi.fn(async (url: string, options: RequestInit) => {
					expect(url.startsWith(prefix)).toBe(true);
					expect(options).toMatchObject({
						credentials: "omit",
						redirect: "error"
					});
					requests.push(url);
					return new Response(
						readFileSync(
							resolve(
								"public/course-assets/javascript-level-2",
								url.slice(prefix.length)
							)
						)
					);
				})
			);
			expect(
				pythonIdeModeForCourseResource(
					fixture.courseId,
					resource.urls[0]
				)
			).toBe("web");
			expect(requests).toHaveLength(0);
			const files = await loadPythonIdeStarterFilesFromGitHub(
				resource.urls[0],
				"web"
			);
			expect(files).toHaveLength(9);
			for (const file of files) {
				const expected = resource.files.find(
					(f: { name: string }) => f.name === file.name
				);
				expect(file.content).toBe(
					fixture.files[resource.role][file.name]
				);
				expect(sha(file.content)).toBe(expected.sha256);
			}
			const key = javascriptCourseProjectKey(
				fixture.courseId,
				fixture.itemId,
				resource.role,
				resource.urls[0]
			);
			for (const alias of resource.urls)
				expect(
					javascriptCourseProjectKey(
						fixture.courseId,
						fixture.itemId,
						resource.role,
						alias
					)
				).toBe(key);
			const earlier = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key + ":earlier",
				files: [
					{
						name: "index.html",
						content: "Earlier square planning",
						encoding: "text"
					}
				]
			});
			const project = createPythonIdeProject("web", {
				courseID: fixture.courseId,
				courseProjectKey: key,
				starterUrl: resource.urls[0],
				files
			});
			project.files.find(file => file.name === "README.md")!.content +=
				"\nObserved all 100 square coordinates and color channels.\n";
			await saveLocalPythonProjects([earlier, project]);
			const saved = await loadLocalPythonProjects();
			expect(saved.find(row => row._id === earlier._id)).toEqual(earlier);
			const reopened = saved.find(row => row._id === project._id)!;
			expect(reopened).toEqual(project);
			const archive = unzipSync(await createProjectArchive(reopened));
			expect(Object.keys(archive)).toHaveLength(9);
			for (const file of reopened.files) {
				const name = Object.keys(archive).find(n =>
					n.endsWith("/" + file.name)
				)!;
				expect(strFromU8(archive[name])).toBe(file.content);
			}
		}
	);
}

for (const role of ["learner", "instructor"] as const) {
	it(
		"preserves the Drawing in JavaScript identity and project roles for " +
			role,
		async () => {
			setActivePinia(createPinia());
			if (role === "instructor")
				useAppStore().setCurrentTutor({
					_id: "squares-tutor",
					name: "Tutor",
					email: "tutor@example.invalid",
					age: 30,
					state: "GA",
					usersOfTutorLength: 0,
					coursePermissions: [fixture.courseId],
					editTutors: false,
					saveEdit: "Save"
				});
			const course = (await useCoursesStore().loadCourseById(
				fixture.courseId
			))!;
			const module = course.modules.find(m => m.id === fixture.moduleId)!;
			expect(module).toBeDefined();
			const item = module.curriculum.find(i => i.id === fixture.itemId)!;
			expect(item.title).toBe("Drawing in JavaScript");
			for (const token of [
				"100 Squares",
				"1000-by-1000",
				"nested loops",
				"1 through 255",
				"725, 725",
				"README.md"
			])
				expect(item.content).toContain(token);
			expect(item.projectLink).toBe(fixture.resources[0].urls[0]);
			expect(item.solutionLink).toBe(
				role === "instructor" ? fixture.resources[1].urls[0] : undefined
			);
			expect(javascriptCourseResource(item.projectLink!)?.project).toBe(
				"hundred-squares"
			);
			expect(
				pythonIdeModeForCourseResource(
					"javascript-level-1-javascript-superstar",
					item.projectLink!
				)
			).toBeNull();
		}
	);
}
type DrawingNode = {
	tag: string;
	attrs: Record<string, string | number>;
	children: DrawingNode[];
};
type DrawingApi = {
	append: (tag: string) => DrawingApi;
	attr: (key: string, value: string | number) => DrawingApi;
};
function runDrawing(source: string, random: () => number) {
	const root: DrawingNode = { tag: "root", attrs: {}, children: [] };
	function wrap(node: DrawingNode): DrawingApi {
		const api: DrawingApi = {
			append(tag) {
				const child = { tag, attrs: {}, children: [] };
				node.children.push(child);
				return wrap(child);
			},
			attr(key, value) {
				node.attrs[key] = value;
				return api;
			}
		};
		return api;
	}
	const math = Object.create(Math);
	math.random = random;
	runInNewContext(
		source,
		{
			Math: math,
			d3: {
				select: (selector: string) => {
					expect(selector).toBe("#drawing");
					return wrap(root);
				}
			}
		},
		{ timeout: 1000 }
	);
	return root;
}
function checkGeometry(root: DrawingNode) {
	expect(root.children).toHaveLength(1);
	const svg = root.children[0];
	expect(svg.tag).toBe("svg");
	expect(svg.attrs).toMatchObject({
		width: 1000,
		height: 1000,
		viewBox: "0 0 1000 1000",
		role: "img"
	});
	expect(svg.children).toHaveLength(100);
	const x = new Set<number>(),
		y = new Set<number>(),
		pairs = new Set<string>();
	for (const cell of svg.children) {
		expect(cell.tag).toBe("rect");
		expect(cell.attrs).toMatchObject({ width: 50, height: 50 });
		x.add(Number(cell.attrs.x));
		y.add(Number(cell.attrs.y));
		pairs.add(cell.attrs.x + ":" + cell.attrs.y);
		const color = String(cell.attrs.fill).match(
			/^rgb\((\d+),(\d+),(\d+)\)$/
		);
		expect(color).not.toBeNull();
		for (const channel of color!.slice(1).map(Number)) {
			expect(channel).toBeGreaterThanOrEqual(1);
			expect(channel).toBeLessThanOrEqual(255);
		}
	}
	expect([...x].sort((a, b) => a - b)).toEqual(fixture.coordinateValues);
	expect([...y].sort((a, b) => a - b)).toEqual(fixture.coordinateValues);
	expect(pairs.size).toBe(100);
	return svg.children;
}
for (const row of fixture.randomBoundaryCases) {
	it(
		"draws every grid position with valid complete RGB at " + row.name,
		() => {
			const cells = checkGeometry(
				runDrawing(
					fixture.files.reference["script.js"],
					() => row.value
				)
			);
			expect(
				cells.every(
					c =>
						c.attrs.fill ===
						"rgb(" +
							Array(3).fill(row.expectedChannel).join(",") +
							")"
				)
			).toBe(true);
		}
	);
}
it("changes random colors while preserving the full original grid", () => {
	const draw = (initial: number) => {
		let state = initial;
		return runDrawing(fixture.files.reference["script.js"], () => {
			state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
			return state / 4294967296;
		});
	};
	const first = checkGeometry(draw(1)),
		second = checkGeometry(draw(2));
	expect(
		first.map(c => [c.attrs.x, c.attrs.y, c.attrs.width, c.attrs.height])
	).toEqual(
		second.map(c => [c.attrs.x, c.attrs.y, c.attrs.width, c.attrs.height])
	);
	expect(first.map(c => c.attrs.fill)).not.toEqual(
		second.map(c => c.attrs.fill)
	);
});
it("retains the unfinished starter and complete local setup/notices", () => {
	expect(
		runDrawing(fixture.files.starter["script.js"], () => 0.5).children
	).toEqual([]);
	expect(fixture.files.starter["script.js"]).toContain(
		"// Enter your code below this line"
	);
	for (const role of ["starter", "reference"]) {
		expect(fixture.files[role]["index.html"]).not.toMatch(
			/(?:src|href)=["']https?:/
		);
		expect(fixture.files[role]["vendor/d3.min.js"].slice(0, 100)).toContain(
			"v7.9.0"
		);
		expect(fixture.files[role]["LICENSE-original.txt"]).toContain(
			"MIT License"
		);
		expect(fixture.files[role]["README.md"]).toContain("one square");
	}
});
it("rejects restoring the observed incomplete RGB string and a missing grid column", () => {
	const original = fixture.files.reference["script.js"];
	const rgb = original.replaceAll(
		"rgb(${r},${g},${b})",
		"rgb(${r},${g},${b}"
	);
	expect(rgb).not.toBe(original);
	expect(() => checkGeometry(runDrawing(rgb, () => 0.5))).toThrow();
	const missing = original.replace("column < 10", "column < 9");
	expect(missing).not.toBe(original);
	expect(runDrawing(missing, () => 0.5).children[0].children).toHaveLength(
		90
	);
});
