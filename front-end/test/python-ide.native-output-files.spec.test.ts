import { describe, expect, it } from "vitest";
import {
	listGitHubProjectFiles,
	loadGitHubProjectFile
} from "@/modules/codePreview";
import {
	getPythonIdeDefaultFileContent,
	getPythonIdeFileKindLabel,
	normalizeImportedPythonIdeFileName
} from "@/modules/pythonIde";

describe("native answer files", () => {
	it("imports all five Balanced Photo reference files with the answer as text", async () => {
		const folder = "UG23-Balanced-Photo/solution";
		const files = await listGitHubProjectFiles(
			`https://github.com/instruction-material/USACO-Gold/tree/main/${folder}`,
			async () =>
				new Response(
					JSON.stringify(
						[
							"Main.java",
							"README.md",
							"sample.in",
							"bphoto.in",
							"bphoto.out"
						].map(name => ({
							type: "file",
							name,
							path: `${folder}/${name}`,
							size: 2,
							download_url: null
						}))
					),
					{ status: 200 }
				)
		);
		expect(files.map(file => file.path).sort()).toEqual(
			["Main.java", "README.md", "sample.in", "bphoto.in", "bphoto.out"]
				.map(name => `${folder}/${name}`)
				.sort()
		);
		const answer = files.find(file => file.path.endsWith("/bphoto.out"))!;
		const imported = await loadGitHubProjectFile(
			answer,
			async () => new Response("3\n")
		);
		expect(imported.content).toBe("3\n");
		expect(imported.truncated).toBe(false);
		expect(normalizeImportedPythonIdeFileName("solution/bphoto.out")).toBe(
			"bphoto.out"
		);
		expect(getPythonIdeFileKindLabel("bphoto.out")).toBe("Text");
		expect(getPythonIdeDefaultFileContent("bphoto.out")).toBe("");
	});

	it("continues to reject binary executable content with an out suffix", async () => {
		const [file] = await listGitHubProjectFiles(
			"https://github.com/example/course/blob/main/a.out"
		);
		expect(file).toBeDefined();
		await expect(
			loadGitHubProjectFile(
				file!,
				async () => new Response("\u007fELF\u0000")
			)
		).rejects.toThrow("binary");
	});
});
