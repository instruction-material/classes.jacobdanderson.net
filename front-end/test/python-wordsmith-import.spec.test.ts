import { createHash, webcrypto } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { strFromU8, unzipSync } from "fflate";
import { afterEach, expect, it, vi } from "vitest";
import { listGitHubProjectFiles, listPreviewFiles, loadGitHubProjectFile, loadPreviewFile, resetCodePreviewCaches } from "@/modules/codePreview";
import { createProjectArchive } from "@/modules/projectArchive";
import {
	clearLocalPythonProjects, createPythonIdeProject, loadLocalPythonProjectsAsync,
	loadPythonIdeStarterFilesFromGitHub, saveLocalPythonProjects
} from "@/modules/pythonIde";
const dictionary = gunzipSync(readFileSync(resolve("../test/fixtures/wordsmith-valid-words.txt.gz"))).toString("utf8");
const source = 'words = open("valid_words.txt").read().splitlines()\nprint(len(words))\n';
const folder = "PS13-Wordsmith/solution";
const sourceURL = "https://github.com/instruction-material/Python-Level-2/tree/main/" + folder;
afterEach(async () => {
	vi.unstubAllGlobals();
	resetCodePreviewCaches();
	await clearLocalPythonProjects();
});
it("imports the complete original613KBWordsmith asset after a deliberately smaller preview and preserves saved ZIP bytes", async () => {
	vi.stubGlobal("crypto", webcrypto);
	const files: Record<string, string> = { "main.py": source, "valid_words.txt": dictionary };
	const requests: string[] = [];
	const fetcher = vi.fn(async (url: string | URL | Request) => {
		const requestURL = String(url);
		requests.push(requestURL);
		if (new URL(requestURL).hostname === "api.github.com") {
			return new Response(JSON.stringify(Object.entries(files).map(([name,content]) => ({
				name, path: folder+"/"+name, type:"file", size: new TextEncoder().encode(content).byteLength,
				html_url: "https://github.com/instruction-material/Python-Level-2/blob/main/"+folder+"/"+name,
				download_url: "https://raw.githubusercontent.com/instruction-material/Python-Level-2/main/"+folder+"/"+name
			}))));
		}
		const name = requestURL.split("/").at(-1)!;
		if (!Object.hasOwn(files,name)) throw new Error("Unexpected source request");
		return new Response(files[name]);
	});
	vi.stubGlobal("fetch", fetcher);
	expect(new TextEncoder().encode(dictionary).byteLength).toBe(613188);
	expect(createHash("sha256").update(dictionary).digest("hex")).toBe("d4e5064c60c1a9ff68fe77d12d32b1ebc3bec50a7ce2bd077adb6dae900bb36f");
	expect((await listPreviewFiles(sourceURL)).map(f=>f.path)).toEqual([folder+"/main.py"]);
	const imported = await loadPythonIdeStarterFilesFromGitHub(sourceURL, "python");
	expect(Object.fromEntries(imported.map(f=>[f.name,f.content]))).toEqual(files);
	expect(requests.filter(r=>new URL(r).hostname==="api.github.com")).toHaveLength(2);
	const project = createPythonIdeProject("python",{courseID:"python-level-2",files:imported});
	project.files.find(f=>f.name==="main.py")!.content += 'print("saved Wordsmith source")\n';
	saveLocalPythonProjects([project]);
	const reopened = (await loadLocalPythonProjectsAsync()).find(p=>p._id===project._id)!;
	expect(reopened.files.find(f=>f.name==="valid_words.txt")?.content).toBe(dictionary);
	const archive = unzipSync(await createProjectArchive(reopened));
	expect(Object.keys(archive)).toHaveLength(2);
	for(const file of reopened.files) {
		const name = Object.keys(archive).find(n=>n.endsWith("/"+file.name)||n===file.name)!;
		expect(strFromU8(archive[name])).toBe(file.content);
	}
});

it("keeps the120KBpreview ceiling while supporting a bounded1MBcomplete import", async () => {
	const [file] = await listGitHubProjectFiles("https://github.com/example/course/blob/main/words.txt");
	const fetcher = vi.fn(async () => new Response(dictionary));
	await expect(loadPreviewFile({...file!,size:613188},fetcher)).rejects.toThrow("too large");
	expect(fetcher).not.toHaveBeenCalled();
	const complete = await loadGitHubProjectFile({...file!,size:613188},fetcher);
	expect(complete.content).toBe(dictionary);
	expect(complete.truncated).toBe(false);
});
it("rejects a folder whose declared complete imports exceed4MB", async () => {
	const listing = Array.from({length:5},(_,i)=>({
		type:"file",name:"words"+i+".txt",path:"starter/words"+i+".txt",size:900000,
		html_url:"https://github.com/example/course/blob/main/starter/words"+i+".txt",download_url:null
	}));
	await expect(listGitHubProjectFiles("https://github.com/example/course/tree/main/starter",async()=>new Response(JSON.stringify(listing)))).rejects.toThrow("import byte limit");
});
it("cancels an oversized import stream when the server supplies no length", async () => {
	const [file] = await listGitHubProjectFiles("https://github.com/example/course/blob/main/words.txt");
	let cancelled = false, pulls = 0;
	const body = new ReadableStream<Uint8Array>({
		pull(controller) { pulls++; controller.enqueue(new Uint8Array(600000).fill(97)); },
		cancel() { cancelled = true; }
	});
	await expect(loadGitHubProjectFile(file!,async()=>new Response(body))).rejects.toThrow("too large");
	expect(cancelled).toBe(true);
	expect(pulls).toBeLessThanOrEqual(3);
});
it("checks actual aggregate bytes even when folder metadata understates file sizes", async () => {
	vi.stubGlobal("fetch",vi.fn(async(url:string)=>{
		if(new URL(url).hostname==="api.github.com") return new Response(JSON.stringify(
			["main.py",...Array.from({length:5},(_,i)=>"words"+i+".txt")].map(name=>({
				type:"file",name,path:"starter/"+name,size:1,
				html_url:"https://github.com/example/course/blob/main/starter/"+name,
				download_url:"https://raw.githubusercontent.com/example/course/main/starter/"+name
			}))
		));
		return new Response(url.endsWith("main.py")?'print("ready")\n':"a".repeat(900000));
	}));
	await expect(loadPythonIdeStarterFilesFromGitHub("https://github.com/example/course/tree/main/starter")).rejects.toThrow("complete IDE import limits");
	expect(await loadLocalPythonProjectsAsync()).toEqual([]);
});
