import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
// eslint-disable-next-line test/no-import-node-test -- Native browser CI runner.
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { strFromU8, unzipSync } from "fflate";
import puppeteer from "puppeteer";
import { preview } from "vite";
import {
	confirmProjectImport,
	downloadProjectZip
} from "./ide-workspace-controls.mjs";

const root = fileURLToPath(new URL("../front-end/", import.meta.url));
const fixtures = await Promise.all(
	[
		"assembly-opening-contracts.json",
		"assembly-calculator-contracts.json",
		"assembly-array-contracts.json",
		"assembly-string-contracts.json",
		"assembly-helper-contracts.json",
		"assembly-parser-contracts.json",
		"assembly-reverse-contracts.json",
		"assembly-stack-contracts.json",
		"assembly-compiler-contracts.json",
		"assembly-debug-contracts.json",
		"assembly-performance-contracts.json",
		"assembly-hardening-contracts.json",
		"assembly-records-contracts.json",
		"assembly-arithmetic-contracts.json"
	].map(async name =>
		JSON.parse(
			await readFile(
				new URL(`./fixtures/${name}`, import.meta.url),
				"utf8"
			)
		)
	)
);
fixtures.push(
	...JSON.parse(
		await readFile(
			new URL(
				"./fixtures/assembly-setup-contracts.json",
				import.meta.url
			),
			"utf8"
		)
	)
);
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-syscall-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-register-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-logic-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-machine-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-control-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-stack-optional-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-abi-optional-contracts.json", import.meta.url), "utf8")));
fixtures.push(...JSON.parse(await readFile(new URL("./fixtures/assembly-memory-layout-optional-contracts.json", import.meta.url), "utf8")));
const hardening = fixtures.find(
	row =>
		row.pack
		=== "ASM-25-unit-12-security-and-reliability-visibility-supplemental-2"
);
fixtures.push({
	...hardening,
	pack: "ASM-26-unit-12-security-and-reliability-visibility-supplemental-3",
	sourcePack: hardening.pack
});
let fixture = fixtures[0];
const workflowDefinitions = {

    "ASM-15-unit-7-memory-addressing-and-data-structures-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Pointer Table Lookup and Record Fields",
        "lesson": "assembly-unit-7-memory-addressing-and-data-structures-assembly-unit-7-memory-addressing-and-data-structures-supplemental-addressing-mode-transfer-practice",
        "moduleId": "assembly-unit-7-memory-addressing-and-data-structures",
        "memoryLayoutMode": "table",
        "starterToken": "POINTER_LOOKUP",
        "referenceToken": "separate reference passes"
    },
    "ASM-16-unit-7-memory-addressing-and-data-structures-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Bounded Overlap Copy Direction",
        "lesson": "assembly-unit-7-memory-addressing-and-data-structures-assembly-unit-7-memory-addressing-and-data-structures-supplemental-addressing-mode-extension-practice",
        "moduleId": "assembly-unit-7-memory-addressing-and-data-structures",
        "memoryLayoutMode": "overlap",
        "starterToken": "COPY_DIRECTION",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-13-unit-6-calling-conventions-and-abi-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Six Integer Argument Registers",
        "lesson": "assembly-unit-6-calling-conventions-and-abi-assembly-unit-6-calling-conventions-and-abi-supplemental-calling-convention-transfer-practice",
        "moduleId": "assembly-unit-6-calling-conventions-and-abi",
        "abiOptionalMode": "registers",
        "starterToken": "ARGUMENT_REGISTER",
        "referenceToken": "separate reference passes"
    },
    "ASM-14-unit-6-calling-conventions-and-abi-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Seventh Integer Argument and Stack Location",
        "lesson": "assembly-unit-6-calling-conventions-and-abi-assembly-unit-6-calling-conventions-and-abi-supplemental-calling-convention-extension-practice",
        "moduleId": "assembly-unit-6-calling-conventions-and-abi",
        "abiOptionalMode": "stack",
        "starterToken": "STACK_ARGUMENT",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-11-unit-5-the-stack-and-function-calls-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "LIFO Value Order and Stack Restoration",
        "lesson": "assembly-unit-5-the-stack-and-function-calls-assembly-unit-5-the-stack-and-function-calls-supplemental-stack-frame-transfer-practice",
        "moduleId": "assembly-unit-5-the-stack-and-function-calls",
        "stackOptionalMode": "lifo",
        "starterToken": "LIFO_POP",
        "referenceToken": "separate reference passes"
    },
    "ASM-12-unit-5-the-stack-and-function-calls-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Caller-Owned Locals Across a Nested Call",
        "lesson": "assembly-unit-5-the-stack-and-function-calls-assembly-unit-5-the-stack-and-function-calls-supplemental-stack-frame-extension-practice",
        "moduleId": "assembly-unit-5-the-stack-and-function-calls",
        "stackOptionalMode": "frame",
        "starterToken": "LOCAL_RELOAD",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-09-unit-4-branching-and-loops-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Switch Dispatch and Fall-Through Investigation",
        "lesson": "assembly-unit-4-branching-and-loops-assembly-unit-4-branching-and-loops-supplemental-branch-trace-transfer-practice",
        "moduleId": "assembly-unit-4-branching-and-loops",
        "controlMode": "dispatch",
        "starterToken": "DISPATCH_JOIN",
        "referenceToken": "separate reference passes"
    },
    "ASM-10-unit-4-branching-and-loops-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Loop Exit Boundary and Invariant Investigation",
        "lesson": "assembly-unit-4-branching-and-loops-assembly-unit-4-branching-and-loops-supplemental-branch-trace-extension-practice",
        "moduleId": "assembly-unit-4-branching-and-loops",
        "controlMode": "loop",
        "starterToken": "LOOP_EXIT",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-03-unit-1-machine-model-and-toolchain-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Byte Order and Memory Access Width Investigation",
        "lesson": "assembly-unit-1-machine-model-and-toolchain-assembly-unit-1-machine-model-and-toolchain-supplemental-toolchain-trace-transfer-practice",
        "moduleId": "assembly-unit-1-machine-model-and-toolchain",
        "machineMode": "memory",
        "starterToken": "MEMORY_SPAN",
        "referenceToken": "separate reference passes"
    },
    "ASM-04-unit-1-machine-model-and-toolchain-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Effective Address Calculation Investigation",
        "lesson": "assembly-unit-1-machine-model-and-toolchain-assembly-unit-1-machine-model-and-toolchain-supplemental-toolchain-trace-extension-practice",
        "moduleId": "assembly-unit-1-machine-model-and-toolchain",
        "machineMode": "lea",
        "starterToken": "ADDRESS_SCALE",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-07-unit-3-arithmetic-and-logic-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Signed and Unsigned Comparison Investigation",
        "lesson": "assembly-unit-3-arithmetic-and-logic-assembly-unit-3-arithmetic-and-logic-supplemental-flag-logic-transfer-practice",
        "moduleId": "assembly-unit-3-arithmetic-and-logic",
        "logicMode": "compare",
        "starterToken": "COMPARE_SIGNED",
        "referenceToken": "separate reference passes"
    },
    "ASM-08-unit-3-arithmetic-and-logic-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Variable Shift Count Investigation",
        "lesson": "assembly-unit-3-arithmetic-and-logic-assembly-unit-3-arithmetic-and-logic-supplemental-flag-logic-extension-practice",
        "moduleId": "assembly-unit-3-arithmetic-and-logic",
        "logicMode": "shift",
        "starterToken": "SHIFT_SIGNED",
        "referenceToken": "separate reference passes"
    }
,

    "ASM-05-unit-2-registers-and-data-movement-supplemental-2": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Partial-Register Write Investigation",
        "lesson": "assembly-unit-2-registers-and-data-movement-assembly-unit-2-registers-and-data-movement-supplemental-register-flow-transfer-practice",
        "moduleId": "assembly-unit-2-registers-and-data-movement",
        "registerMode": "partial",
        "starterToken": "WIDTH_SEED",
        "referenceToken": "separate reference passes"
    },
    "ASM-06-unit-2-registers-and-data-movement-supplemental-3": {
        "primary": "routine.S",
        "taskFile": "routine.S",
        "title": "Signed and Unsigned Widening Investigation",
        "lesson": "assembly-unit-2-registers-and-data-movement-assembly-unit-2-registers-and-data-movement-supplemental-register-flow-extension-practice",
        "moduleId": "assembly-unit-2-registers-and-data-movement",
        "registerMode": "extension",
        "starterToken": "SIGN_BYTE",
        "referenceToken": "separate reference passes"
    }
,

	"ASM-17-unit-8-system-calls-and-runtime-interaction-supplemental-2": {
		primary: "routine.S",
		taskFile: "routine.S",
		title: "Core Project: Linux Syscalls and Partial Writes",
		lesson: "assembly-unit-8-system-calls-and-runtime-interaction-assembly-unit-8-system-calls-and-runtime-interaction-curriculum-system-calls-and-runtime-interaction-core-concepts",
		moduleId: "assembly-unit-8-system-calls-and-runtime-interaction",
		syscallMode: "write",
		starterToken: "SYSCALL_WRITE",
		referenceToken: "separate reference passes"
	},
	"ASM-18-unit-8-system-calls-and-runtime-interaction-supplemental-3": {
		primary: "routine.S",
		taskFile: "routine.S",
		title: "Project: File Creation Across Two ABIs",
		lesson: "assembly-unit-8-system-calls-and-runtime-interaction-assembly-unit-8-system-calls-and-runtime-interaction-supplemental-system-call-extension-practice",
		moduleId: "assembly-unit-8-system-calls-and-runtime-interaction",
		syscallMode: "openat",
		starterToken: "SYSCALL_ARG4",
		referenceToken: "separate reference passes"
	},
	"ASM-01-asm0-setup-and-tooling-supplemental-2": {
		primary: "routine.S",
		taskFile: "routine.S",
		title: "Symbol Binding Transfer Investigation",
		lesson: "assembly-asm0-setup-and-tooling-assembly-asm0-setup-and-tooling-supplemental-assembly-setup-transfer-practice",
		moduleId: "assembly-asm0-setup-and-tooling",
		setupMode: "symbols",
		starterToken: "link failure",
		referenceToken: "answer=42"
	},
	"ASM-02-asm0-setup-and-tooling-supplemental-3": {
		primary: "routine.S",
		taskFile: "CMakeLists.txt",
		title: "Assembly Preprocessing Extension Investigation",
		lesson: "assembly-asm0-setup-and-tooling-assembly-asm0-setup-and-tooling-supplemental-assembly-setup-extension-practice",
		moduleId: "assembly-asm0-setup-and-tooling",
		setupMode: "preprocess",
		starterToken: "link failure",
		referenceToken: "answer=41"
	},
	"ASM-06-unit-3-arithmetic-and-logic": {
		primary: "routine.S",
		title: "Core Project: Arithmetic and Logic",
		lesson: "assembly-unit-3-arithmetic-and-logic-assembly-unit-3-arithmetic-and-logic-curriculum-core-project-arithmetic-and-logic",
		referenceToken: "591,123",
		starterToken: "ARITH_MUL"
	},
	"ASM-05-unit-1-machine-model-and-toolchain": {
		primary: "routine.S",
		title: "Core Project: Machine Model and Toolchain",
		lesson: "assembly-unit-1-machine-model-and-toolchain-assembly-unit-1-machine-model-and-toolchain-curriculum-core-project-machine-model-and-toolchain",
		referenceToken: "196,609",
		starterToken: "RECORD_DECODE"
	},
	"ASM-04-asm0-setup-and-tooling": {
		primary: "routine.S",
		title: "Build and Trace a Linux x86-64 Function",
		lesson: "assembly-asm0-setup-and-tooling-assembly-asm0-setup-and-tooling-curriculum-core-project-assembly",
		referenceToken: "total=100"
	},
	"ASM1-Integer-Calculator": {
		primary: "calculator.S",
		title: "Integer Calculator in Assembly",
		lesson: "assembly-unit-2-registers-and-data-movement-assembly-unit-2-registers-and-data-movement-curriculum-project-integer-calculator-in-assembly",
		referenceToken: "12,589"
	},
	"ASM2-Array-Sum-and-Search": {
		primary: "array_routines.S",
		title: "Array Sum and Search Routines",
		lesson: "assembly-unit-4-branching-and-loops-assembly-unit-4-branching-and-loops-curriculum-project-array-sum-and-search-routines",
		referenceToken: "11,280"
	},
	"ASM3-String-Length-and-Copy": {
		primary: "string_routines.S",
		title: "String Length and Copy Routines",
		lesson: "assembly-unit-7-memory-addressing-and-data-structures-assembly-unit-7-memory-addressing-and-data-structures-curriculum-project-string-length-and-copy-routines",
		referenceToken: "35,900"
	},
	"ASM4-Call-C-Helper-from-Assembly": {
		primary: "scale_and_clamp.S",
		title: "Call a C Helper from Assembly",
		lesson: "assembly-unit-6-calling-conventions-and-abi-assembly-unit-6-calling-conventions-and-abi-curriculum-project-call-a-c-helper-from-assembly",
		referenceToken: "11,280"
	},
	"ASM5-Tiny-Command-Line-Parser": {
		primary: "parser.S",
		title: "Tiny Command-Line Parser",
		lesson: "assembly-unit-8-system-calls-and-runtime-interaction-assembly-unit-8-system-calls-and-runtime-interaction-curriculum-project-tiny-command-line-parser",
		referenceToken: "9,157"
	},
	"ASM6-Reverse-Engineering-Toy-Program": {
		primary: "reconstructed.c",
		title: "Reverse-Engineer a Toy Program Back into Pseudocode",
		lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-curriculum-project-reverse-engineer-a-toy-program-back-into-pseudocode",
		referenceToken: "10,033"
	},
	"ASM-07-unit-5-the-stack-and-function-calls": {
		primary: "routine.S",
		title: "Core Project: The Stack and Function Calls",
		lesson: "assembly-unit-5-the-stack-and-function-calls-assembly-unit-5-the-stack-and-function-calls-curriculum-core-project-the-stack-and-function-calls",
		referenceToken: "10,012"
	},
	"ASM-08-unit-9-reading-compiler-output": {
		primary: "model.c",
		taskFile: "analysis.md",
		title: "Core Project: Reading Compiler Output",
		lesson: "assembly-unit-9-reading-compiler-output-assembly-unit-9-reading-compiler-output-curriculum-core-project-reading-compiler-output",
		referenceToken: "10,013",
		starterToken: "analysis.md"
	},
	"ASM-09-unit-10-debugging-at-instruction-level": {
		primary: "routine.S",
		taskFile: "analysis.md",
		title: "Core Project: Debugging at Instruction Level",
		lesson: "assembly-unit-10-debugging-at-instruction-level-assembly-unit-10-debugging-at-instruction-level-curriculum-core-project-debugging-at-instruction-level",
		referenceToken: "10,019",
		starterToken: "exits 1"
	},
	"ASM-10-unit-11-performance-and-code-shape": {
		primary: "loops.S",
		taskFile: "analysis.md",
		title: "Core Project: Performance and Code Shape",
		lesson: "assembly-unit-11-performance-and-code-shape-assembly-unit-11-performance-and-code-shape-curriculum-core-project-performance-and-code-shape",
		referenceToken: "10,026",
		starterToken: "analysis.md"
	},
	"ASM-25-unit-12-security-and-reliability-visibility-supplemental-2": {
		primary: "analysis.md",
		taskFile: "analysis.md",
		title: "Binary Hardening Evidence Lab",
		lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-transfer-practice",
		referenceToken: "10,079",
		starterToken: "analysis.md"
	},
	"ASM-26-unit-12-security-and-reliability-visibility-supplemental-3": {
		primary: "trace.md",
		taskFile: "trace.md",
		title: "Runtime Hardening Trace Companion",
		lesson: "assembly-unit-12-security-and-reliability-visibility-assembly-unit-12-security-and-reliability-visibility-supplemental-reliability-visibility-extension-practice",
		referenceToken: "10,079",
		starterToken: "trace.md"
	}
};

assert.equal(
	fixtures.length,
	33,
	"All twenty-one verified assignment workspaces require browser coverage"
);
assert.deepEqual(
	fixtures.map(row => row.pack).sort(),
	Object.keys(workflowDefinitions).sort(),
	"Browser fixtures must cover every workflow definition"
);
const expectedProfiles = fixtures.length * 2 * 2 * 2;
// Include startup, course actions and cleanup as the complete matrix grows.
const workflowTimeoutMs = 60_000 + expectedProfiles * 2_500;

const storageKey = "classes-python-ide-projects:anonymous";
const legacy = {
	_id: "earlier-assembly",
	title: "Earlier attempt",
	mode: "python",
	files: [{ name: "main.py", content: "# preserved work\n" }],
	activeFileName: "main.py",
	courseID: "assembly",
	courseProjectKey: "assembly:opening:starter",
	createdAt: "2026-10-01T12:00:00.000Z",
	updatedAt: "2026-10-01T12:00:00.000Z"
};

async function verifyHardeningCourseButton(
	page,
	origin,
	definition,
	fixture,
	storageKey,
	sourceRequests,
	setCatalog
) {
	const moduleId
		= definition.moduleId
			?? "assembly-unit-12-security-and-reliability-visibility";
	const sourceUrl = `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/starter`;
	setCatalog(true);
	await page.goto(`${origin}/courses#${moduleId}`, {
		waitUntil: "domcontentloaded"
	});
	await page.waitForSelector(".lesson-view-toggle button");
	let href;
	for (const position of [1, 2, 3]) {
		await page
			.locator(`.lesson-view-toggle button:nth-child(${position})`)
			.click();
		await page.waitForSelector(
			`.lesson-view-toggle button:nth-child(${position})[aria-pressed='true']`
		);
		if (!(await page.$(`#${definition.lesson}`))) continue;
		href = await page.$eval(
			`#${definition.lesson}`,
			(card, expected) =>
				[...card.querySelectorAll("a")]
					.find((link) => {
						const url = new URL(link.href);
						return (
							url.pathname === "/ide"
							&& url.searchParams.get("starterUrl") === expected
						);
					})
					?.getAttribute("href"),
			sourceUrl
		);
		if (href) break;
	}
	assert.ok(
		href,
		"The actual optional lesson must provide its confirmed IDE action"
	);
	const params = new URL(href, origin).searchParams;
	const itemId = definition.lesson.slice(moduleId.length + 1);
	const key = `assembly:${itemId}:starter:native-assembly`;
	assert.equal(params.get("projectKey"), key);
	assert.equal(params.get("mode"), "assembly");
	assert.equal(sourceRequests(), 0, "The course page must not fetch source");
	setCatalog(false);
	await page.locator(`a[href=${JSON.stringify(href)}]`).click();
	await page.waitForSelector("[data-testid='ide-route-import-confirm']");
	assert.equal(
		sourceRequests(),
		0,
		"Opening the action must still require consent"
	);
	await confirmProjectImport(page);
	await page.waitForFunction(
		(storage, projectKey) =>
			JSON.parse(localStorage.getItem(storage) ?? "[]").some(
				p => p.courseProjectKey === projectKey
			),
		{},
		storageKey,
		key
	);
	const saved = await page.evaluate(
		(storage, projectKey) =>
			JSON.parse(localStorage.getItem(storage)).find(
				p => p.courseProjectKey === projectKey
			),
		storageKey,
		key
	);
	assert.equal(saved.activeFileName, `starter/${definition.primary}`);
	const expectedCount = (definition.memoryLayoutMode || definition.abiOptionalMode || definition.stackOptionalMode || definition.controlMode || definition.machineMode || definition.logicMode || definition.registerMode) ? 9 : definition.syscallMode ? 8 : definition.setupMode ? 7 : 10;
	assert.equal(saved.files.length, expectedCount);
	assert.equal(sourceRequests(), expectedCount);
	return {
		pack: fixture.pack,
		itemId,
		key,
		activeFile: saved.activeFileName,
		actualCourseAction: true,
		consentBeforeFetch: true,
		importedFiles: expectedCount
	};
}

test(
	"Assembly consent, exact role imports, saved edits, native exports and lesson return",
	{ timeout: workflowTimeoutMs },
	async () => {
		let server, browser, context, page;
		const captures
			= process.env.COURSE_IMPORT_SCREENSHOT_DIR ?? "output/playwright";
		const exports
			= process.env.ASSEMBLY_BROWSER_EXPORT_PROOF_DIR
				?? "output/assembly-exports";
		const proof = [];
		const courseButtons = [];
		await mkdir(captures, { recursive: true });
		await mkdir(exports, { recursive: true });
		try {
			server = await preview({
				root,
				preview: { host: "127.0.0.1", port: 0, strictPort: true }
			});
			const origin = server.resolvedUrls.local[0].replace(/\/$/, "");
			const executablePath = [
				process.env.PUPPETEER_EXECUTABLE_PATH,
				puppeteer.executablePath(),
				"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
				"/usr/bin/google-chrome",
				"/usr/bin/chromium"
			].find(path => path && existsSync(path));
			assert.ok(
				executablePath,
				"An existing Chrome installation is required"
			);
			browser = await puppeteer.launch({
				executablePath,
				headless: true,
				args: ["--no-sandbox"]
			});
			context = await browser.createBrowserContext();
			page = await context.newPage();
			await page.evaluateOnNewDocument(
				(key, existing) => {
					if (localStorage.getItem(key) === null)
						localStorage.setItem(key, JSON.stringify([existing]));
					const click = HTMLAnchorElement.prototype.click;
					HTMLAnchorElement.prototype.click = function () {
						if (
							this.download.endsWith(".zip")
							&& this.href.startsWith("blob:")
						) {
							return;
						}
						return click.call(this);
					};
					const create = URL.createObjectURL;
					URL.createObjectURL = (blob) => {
						if (blob.type === "application/zip")
							window.__assemblyArchive = blob;
						return create(blob);
					};
				},
				storageKey,
				legacy
			);
			await page.setRequestInterception(true);
			let requests = [];
			let catalog = false;
			page.on("request", (request) => {
				const url = new URL(request.url());
				if (url.hostname === "raw.githubusercontent.com") {
					requests.push(url.pathname);
					const prefix = `/instruction-material/Assembly/${fixture.revision}/`;
					const file = url.pathname.startsWith(prefix)
						? fixture.files[url.pathname.slice(prefix.length)]
						: null;
					void request.respond({
						status: file ? 200 : 404,
						contentType: "text/plain",
						headers: { "access-control-allow-origin": "*" },
						body: file?.content ?? "Unknown source"
					});
				}
				else if (
					url.origin !== origin
					|| url.pathname.startsWith("/api/")
				) {
					let body = {};
					if (catalog && url.pathname === "/api/accounts/me")
						body = { userID: "assembly-learner" };
					if (catalog && url.pathname === "/api/users/loggedin") {
						body = {
							currentUser: {
								_id: "assembly-learner",
								name: "Learner fixture",
								email: "learner@example.invalid",
								age: 14,
								state: "GA",
								courseAccess: ["assembly"],
								courseProgress: []
							}
						};
					}
					void request.respond({
						status: 200,
						contentType: "application/json",
						body: JSON.stringify(body)
					});
				}
				else {
					void request.continue();
				}
			});
			for (const current of fixtures) {
				fixture = current;
				const sourcePack = fixture.sourcePack ?? fixture.pack;
				const definition = workflowDefinitions[fixture.pack];
				const {
					primary,
					referenceToken,
					starterToken = "exits 78",
					taskFile
				} = definition;
				for (const width of [1280, 360]) {
					for (const theme of ["light", "dark"]) {
						for (const role of ["starter", "solution"]) {
							if (
								width === 1280
								&& theme === "light"
								&& role === "starter"
								&& (definition.memoryLayoutMode || definition.abiOptionalMode || definition.stackOptionalMode || definition.controlMode || definition.machineMode || definition.logicMode || definition.registerMode || definition.setupMode || definition.syscallMode
									|| (fixture.pack.startsWith("ASM-2")
										&& ["analysis.md", "trace.md"].includes(
											primary
										)))
							) {
								requests = [];
								courseButtons.push(
									await verifyHardeningCourseButton(
										page,
										origin,
										definition,
										fixture,
										storageKey,
										() => requests.length,
										value => (catalog = value)
									)
								);
							}
							const expectedFiles = Object.keys(
								fixture.files
							).filter(
								path =>
									path.startsWith(`${sourcePack}/${role}/`)
									|| path === `${sourcePack}/README.md`
							);
							await page.setViewport({ width, height: 900 });
							await page.emulateMediaFeatures([
								{ name: "prefers-color-scheme", value: theme }
							]);
							const key = `assembly:${fixture.pack}-${width}-${theme}:${role === "starter" ? "starter" : "reference"}:native-assembly`;
							const lesson = definition.lesson;
							const params = new URLSearchParams({
								course: "assembly",
								mode: "assembly",
								projectKey: key,
								lesson,
								starterUrl: `https://github.com/instruction-material/Assembly/tree/${fixture.revision}/${fixture.pack}/${role}`,
								starterTitle: definition.title
							});
							requests = [];
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							assert.equal(
								requests.length,
								0,
								"Source requires confirmation"
							);
							await page.keyboard.press("Escape");
							assert.equal(
								requests.length,
								0,
								"Cancelling must not fetch source"
							);
							await page.goto(`${origin}/ide?${params}`, {
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"[data-testid='ide-route-import-confirm']"
							);
							await confirmProjectImport(page);
							await page.waitForFunction(
								(s, k) =>
									JSON.parse(
										localStorage.getItem(s) ?? "[]"
									).some(p => p.courseProjectKey === k),
								{},
								storageKey,
								key
							);
							const projects = await page.evaluate(
								s => JSON.parse(localStorage.getItem(s)),
								storageKey
							);
							assert.deepEqual(
								projects.find(p => p._id === legacy._id),
								legacy
							);
							const saved = projects.find(
								p => p.courseProjectKey === key
							);
							assert.equal(saved.mode, "assembly");
							assert.equal(
								saved.activeFileName,
								`${role}/${primary}`
							);
							assert.deepEqual(
								saved.files
									.map(file => `${sourcePack}/${file.name}`)
									.sort(),
								expectedFiles.sort()
							);
							assert.equal(requests.length, expectedFiles.length);
							assert.ok(
								requests.every(
									path =>
										!path.includes(
											role === "starter"
												? "/solution/"
												: "/starter/"
										)
								)
							);
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							await page.waitForSelector(".cm-content", {
								visible: true
							});
							assert.equal(
								await page.$(
									".mobile-view-picker button[data-view='canvas']"
								),
								null
							);
							await page.waitForSelector(
								"button.run-control:not([disabled])"
							);
							assert.equal(
								await page.$eval("button.run-control", b =>
									b.textContent.trim()),
								"Build instructions"
							);
							await page.click("button.run-control");
							await page.waitForFunction(() =>
								[
									...document.querySelectorAll(".output-line")
								].some(line =>
									line.textContent.includes(
										"ctest --test-dir build"
									)
								)
							);
							assert.ok(
								await page.$eval(
									".result-panel",
									(
										p,
										{ role, referenceToken, starterToken }
									) =>
										p.textContent.includes(
											"Linux x86-64"
										)
										&& p.textContent.includes(
											role === "starter"
												? starterToken
												: referenceToken
										),
									{ role, referenceToken, starterToken }
								)
							);
							assert.equal(
								await page.$(
									"iframe[title='Isolated Python output']"
								),
								null
							);
							await downloadProjectZip(page);
							const base64 = await page.evaluate(async () =>
								btoa(
									Array.from(
										new Uint8Array(
											await window.__assemblyArchive.arrayBuffer()
										),
										byte => String.fromCharCode(byte)
									).join("")
								)
							);
							const entries = unzipSync(
								Buffer.from(base64, "base64")
							);
							assert.equal(
								Object.keys(entries).length,
								expectedFiles.length
							);
							for (const file of saved.files) {
								const source
									= fixture.files[`${sourcePack}/${file.name}`];
								const path = Object.keys(entries).find(path =>
									path.endsWith(`/${file.name}`)
								);
								assert.equal(file.content, source.content);
								assert.equal(
									strFromU8(entries[path]),
									source.content
								);
								assert.equal(
									createHash("sha256")
										.update(entries[path])
										.digest("hex"),
									source.sha256
								);
							}
							if (width === 1280 && theme === "light") {
								await writeFile(
									join(
										exports,
										`${fixture.pack}-${role}.zip`
									),
									Buffer.from(base64, "base64")
								);
							}
							if (width < 900) {
								await page
									.locator(
										".mobile-view-picker button[data-view='code']"
									)
									.click();
							}
							const name = `${role}/${taskFile ?? primary}`;
							if (taskFile) {
								await page.select(
									"select[aria-label='Active project file']",
									name
								);
								await page.waitForFunction(
									name =>
										document.querySelector(
											"select[aria-label='Active project file']"
										)?.value === name,
									{},
									name
								);
							}
							const original = saved.files.find(
								file => file.name === name
							).content;
							const edit
								= definition.memoryLayoutMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.memoryLayoutMode === "table"
                                            ? original.replace("    movzx r9d, WORD PTR [r8 + 8]\n", "    movzx r9d, BYTE PTR [r8 + 8]\n")
                                            : original.replace("    ja lab_backward\n", "    jmp lab_forward\n")
                                    : definition.abiOptionalMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.abiOptionalMode === "registers"
                                            ? original.replace("    imul r10, r9, 13\n", "    imul r10, r8, 13\n")
                                            : original.replace("    imul r11, r11, 17\n", "    imul r11, r11, 19\n")
                                    : definition.stackOptionalMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.stackOptionalMode === "lifo"
                                            ? original.replace("    push rdi # save initial first\n", "    push rsi # wrong first saved value\n")
                                            : original.replace("    mov r9, QWORD PTR [rsp + 8] # saved incoming\n", "    mov r9, QWORD PTR [rsp + 0] # wrong incoming slot\n")
                                    : definition.controlMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.controlMode === "dispatch"
                                            ? original.replace("    jmp lab_join # selected-case exit\n", "    jmp lab_case0 # wrong selected-case exit\n")
                                            : original.replace("    add rax, rsi\n", "    sub rax, rsi\n")
                                    : definition.machineMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.machineMode === "memory"
                                            ? original.replace("    mov rax, QWORD PTR [rsp + 0]\n", "    mov rax, QWORD PTR [rsp + 0]\n    bswap rax\n")
                                            : original.replace("    lea rax, [rdi + rsi*8 - 7]\n", "    lea rax, [rdi + rsi*4 - 7]\n")
                                    : definition.logicMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.logicMode === "compare"
                                            ? original.replace("    mov eax, 0\n.globl lab_stage2", "    xor eax, eax\n.globl lab_stage2")
                                            : original.replace("    mov rcx, rsi\n.globl lab_stage0", "    mov ecx, esi\n    and ecx, 31\n.globl lab_stage0")
                                    : definition.registerMode
                                    ? role === "starter"
                                        ? fixture.files[`${fixture.pack}/solution/routine.S`].content
                                        : definition.registerMode === "partial"
                                            ? original.replace("    mov eax, esi\n", "    mov ax, si\n")
                                            : original.replace("    movzx eax, si\n", "    movsx rax, si\n")
                                    : definition.syscallMode
									? role === "starter"
										? fixture.files[`${fixture.pack}/solution/routine.S`].content
										: definition.syscallMode === "write"
											? original.replace("mov eax, 1\n", "mov eax, 0\n")
											: original.replace("mov r10, rcx\n", "xor r10d, r10d\n")
									: definition.setupMode === "symbols"
										? original.replace(
												role === "starter"
													? "# TODO: export lab_answer to the separately compiled C caller"
													: ".globl lab_answer",
												role === "starter"
													? ".globl lab_answer"
													: "# saved local-symbol regression"
											)
										: definition.setupMode === "preprocess"
											? original.replace(
													role === "starter"
														? "set(LAB_ASM_LANGUAGE \"assembler\""
														: "set(LAB_ASM_LANGUAGE \"assembler-with-cpp\"",
													role === "starter"
														? "set(LAB_ASM_LANGUAGE \"assembler-with-cpp\""
														: "set(LAB_ASM_LANGUAGE \"assembler\""
												)
											: `${original}${taskFile ? "\nSaved worksheet observation: record the actual compiler and trace.\n" : "\n/* Saved Assembly attempt. */\n"}`;
							assert.notEqual(edit, original);
							await page.click(".cm-content");
							const modifier = await page.evaluate(() =>
								/Mac/.test(navigator.platform)
									? "Meta"
									: "Control"
							);
							await page.keyboard.down(modifier);
							await page.keyboard.press("a");
							await page.keyboard.up(modifier);
							await page.keyboard.sendCharacter(edit);
							await page.keyboard.down(modifier);
							await page.keyboard.press("s");
							await page.keyboard.up(modifier);
							await page.waitForFunction(
								(s, k, n, c) =>
									JSON.parse(localStorage.getItem(s))
										.find(p => p.courseProjectKey === k)
										?.files
										.some(
											f => f.name === n && f.content === c
										),
								{},
								storageKey,
								key,
								name,
								edit
							);
							await page.reload({
								waitUntil: "domcontentloaded"
							});
							await page.waitForSelector(
								"button.run-control:not([disabled])"
							);
							const reloaded = await page.evaluate(
								(s, k) =>
									JSON.parse(localStorage.getItem(s)).find(
										p => p.courseProjectKey === k
									),
								storageKey,
								key
							);
							assert.deepEqual(
								reloaded.files,
								saved.files.map(file =>
									file.name === name
										? { ...file, content: edit }
										: file
								)
							);
							assert.equal(
								requests.length,
								expectedFiles.length,
								"Reload reuses saved work without fetching source"
							);
							await downloadProjectZip(page);
							const edited = await page.evaluate(async () =>
								btoa(
									Array.from(
										new Uint8Array(
											await window.__assemblyArchive.arrayBuffer()
										),
										byte => String.fromCharCode(byte)
									).join("")
								)
							);
							const editedEntries = unzipSync(
								Buffer.from(edited, "base64")
							);
							for (const file of reloaded.files) {
								assert.equal(
									strFromU8(
										editedEntries[
											Object.keys(editedEntries).find(
												path =>
													path.endsWith(
														`/${file.name}`
													)
											)
										]
									),
									file.content
								);
							}
							if (definition.memoryLayoutMode || definition.abiOptionalMode || definition.stackOptionalMode || definition.controlMode || definition.machineMode || definition.logicMode || definition.registerMode || definition.setupMode || definition.syscallMode) {
								await writeFile(
									join(
										exports,
										`${fixture.pack}-${role}-edited-${width}-${theme}.zip`
									),
									Buffer.from(edited, "base64")
								);
							}
							const returnHref = await page.$$eval("a", links =>
								links
									.find(
										link =>
											link.textContent.trim()
											=== "Return to lesson"
									)
									?.getAttribute("href"));
							assert.equal(returnHref, `/courses#${lesson}`);
							assert.ok(
								await page.evaluate(
									() =>
										document.documentElement.scrollWidth
										<= innerWidth + 1
								)
							);
							const capture = `course-import-assembly-${fixture.pack}-${role}-${width}-${theme}.png`;
							await page.screenshot({
								path: join(captures, capture),
								fullPage: true
							});
							proof.push({
								pack: fixture.pack,
								sourcePack,
								initialFile: saved.activeFileName,
								role,
								width,
								theme,
								files: saved.files.map(f => ({
									name: f.name,
									sha256: createHash("sha256")
										.update(f.content)
										.digest("hex")
								})),
								confirmedBeforeFetch: true,
								savedEditReloaded: true,
								editedExportExact: true,
								legacyPreserved: true,
								returnHref,
								capture
							});
						}
					}
				}
				console.log(JSON.stringify({
					event: "assembly-pack-complete",
					pack: fixture.pack,
					completedProfiles: proof.length,
					expectedProfiles
				}));
			}
			assert.equal(courseButtons.length, 20);
			await writeFile(
				join(captures, "assembly-course-buttons-proof.json"),
				JSON.stringify(courseButtons, null, 2)
			);
			assert.equal(
				proof.length,
				expectedProfiles,
				"Every pack, role, width and theme must complete"
			);
			await writeFile(
				join(captures, "assembly-workflow-proof.json"),
				`${JSON.stringify(proof, null, 2)}\n`
			);
		}
		catch (error) {
			await writeFile(
				join(captures, "assembly-workflow-partial.json"),
				JSON.stringify(proof, null, 2)
			);
			if (page) {
				const geometry = await page.evaluate(() => ({
					url: location.href,
					viewport: innerWidth,
					documentWidth: document.documentElement.scrollWidth,
					overflow: [...document.querySelectorAll("body *")]
						.map((node) => {
							const box = node.getBoundingClientRect();
							const style = getComputedStyle(node);
							return {
								tag: node.tagName,
								className: (
									node.getAttribute("class") ?? ""
								).slice(0, 140),
								right: box.right,
								width: box.width,
								minWidth: style.minWidth,
								overflowX: style.overflowX
							};
						})
						.filter(
							node =>
								node.width > 0 && node.right > innerWidth + 1
						)
						.slice(0, 20)
				}));
				console.log(
					JSON.stringify({
						event: "assembly-browser-failure-geometry",
						...geometry
					})
				);
				await writeFile(
					join(captures, "assembly-failure-geometry.json"),
					JSON.stringify(geometry, null, 2)
				);
			}
			if (page) {
				await page.screenshot({
					path: join(captures, "assembly-failure.png"),
					fullPage: true
				});
				await writeFile(
					join(captures, "assembly-failure.json"),
					JSON.stringify(
						await page.evaluate(
							s => ({
								url: location.href,
								body: (document.body.textContent ?? "").slice(
									-7000
								),
								storage: localStorage.getItem(s)
							}),
							storageKey
						),
						null,
						2
					)
				);
			}
			throw error;
		}
		finally {
			await page?.close();
			await context?.close();
			await browser?.close();
			await server?.httpServer?.close();
		}
	}
);
