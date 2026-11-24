import { createHash, webcrypto } from "node:crypto";
import { afterEach, expect, it, vi } from "vitest";
import {
	fetchScratchOriginalArchive,
	scratchOriginalProject,
	scratchOriginalResource
} from "@/modules/scratch/originals";
import { scratchLevel1Course } from "@/stores/courses/scratch-level-1";
import { scratchLevel2Course } from "@/stores/courses/scratch-level-2";
import { scratchLevel1BootcampCourse } from "@/stores/courses/source-library-courses";

afterEach(() => vi.unstubAllGlobals());

it("matches every configured original project and instructor reference without exchanging their roles", () => {
	let projects = 0;
	let references = 0;
	const ids = new Set<string>();
	const bootcampPracticeIds: string[] = [];
	for (const [courseId, source] of [
		["scratch-level-1", scratchLevel1Course],
		["scratch-level-2", scratchLevel2Course],
		["scratch-level-1-bootcamp", scratchLevel1BootcampCourse]
	] as const) {
		for (const module of source.modules) {
			for (const item of [
				...module.curriculum,
				...module.supplementalProjects
			]) {
				for (const [field, role] of [
					["projectLink", "project"],
					["solutionLink", "reference"]
				] as const) {
					const url = item[field];
					if (!url?.startsWith("https://scratch.mit.edu/projects/"))
						continue;
					const original = scratchOriginalResource(
						url,
						courseId,
						role
					);
					expect(
						original,
						`${courseId}: ${item.title} ${role}`
					).toBeDefined();
					expect(original!.url.replace(/\/$/, "")).toBe(
						url.replace(/\/$/, "")
					);
					ids.add(original!.id);
					if (
						courseId === "scratch-level-1-bootcamp" &&
						role === "project" &&
						/^(?:Practice Map|Extension Review):/.test(item.title)
					) {
						bootcampPracticeIds.push(original!.id);
					}
					if (role === "project") projects += 1;
					else references += 1;
				}
			}
		}
	}
	expect(bootcampPracticeIds).toEqual([
		"592006491",
		"592008620",
		"601699148",
		"592014695",
		"592019210",
		"327635693"
	]);
	expect(projects).toBe(107);
	expect(references).toBe(97);
	expect(ids.size).toBe(162);
	for (const id of ["299272518", "608768681", "608770708"])
		expect(
			scratchOriginalProject(id, "scratch-level-1-bootcamp", "project")
		).toBeDefined();
});

it("rejects foreign origins, unknown projects, missing course context and exchanged roles", () => {
	for (const url of [
		"https://scratch.mit.edu.evil.test/projects/287707460/",
		"http://scratch.mit.edu/projects/287707460/",
		"https://scratch.mit.edu/projects/287707460/?source=other",
		"https://scratch.mit.edu/projects/287707460/#editor",
		"https://scratch.mit.edu/projects/999999999999/"
	])
		expect(scratchOriginalResource(url, "scratch-level-1")).toBeUndefined();
	expect(scratchOriginalProject("287707460", undefined)).toBeUndefined();
	expect(
		scratchOriginalProject("287707460", "scratch-level-1-classroom")
	).toBeUndefined();
	expect(
		scratchOriginalProject("287707460", "scratch-level-1", "reference")
	).toBeUndefined();
	expect(
		scratchOriginalProject("284408078", "scratch-level-1", "project")
	).toBeUndefined();
});

it("imports only the release archive matching the reviewed original and its checksum", async () => {
	vi.stubGlobal("crypto", webcrypto);
	const project = scratchOriginalProject("287707460", "scratch-level-1")!;
	const bytes = new TextEncoder().encode("checked archive").buffer;
	const sha256 = createHash("sha256")
		.update(new Uint8Array(bytes))
		.digest("hex");
	const fetcher = vi
		.fn()
		.mockResolvedValueOnce({
			ok: true,
			json: async () => [
				{
					id: project.id,
					sourceSHA256: project.sourceSHA256,
					bytes: bytes.byteLength,
					sha256
				}
			]
		})
		.mockResolvedValueOnce({ ok: true, arrayBuffer: async () => bytes });
	vi.stubGlobal("fetch", fetcher);
	expect(await fetchScratchOriginalArchive(project)).toBe(bytes);
	expect(fetcher.mock.calls.map(call => call[0])).toEqual([
		"/scratch-originals/catalog.json",
		"/scratch-originals/287707460.sb3"
	]);
	for (const call of fetcher.mock.calls)
		expect(call[1]).toMatchObject({
			credentials: "omit",
			cache: "no-store"
		});
});

it.each(["source", "checksum", "size", "oversize"])(
	"rejects a mismatched original %s",
	async failure => {
		vi.stubGlobal("crypto", webcrypto);
		const project = scratchOriginalProject("287707460", "scratch-level-1")!;
		const bytes = new Uint8Array([1, 2, 3]).buffer;
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValueOnce({
					ok: true,
					json: async () => [
						{
							id: project.id,
							sourceSHA256:
								failure === "source"
									? "wrong"
									: project.sourceSHA256,
							sha256: "0".repeat(64),
							bytes:
								failure === "oversize"
									? 30 * 1024 * 1024
									: failure === "size"
										? 4
										: 3
						}
					]
				})
				.mockResolvedValueOnce({
					ok: true,
					arrayBuffer: async () => bytes
				})
		);
		await expect(fetchScratchOriginalArchive(project)).rejects.toThrow(
			/identity mismatch|size mismatch/
		);
	}
);
