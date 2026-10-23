import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Completion } from "@codemirror/autocomplete";
import type { StateCommand, Transaction } from "@codemirror/state";
import {
	defaultKeymap,
	indentLess,
	indentMore,
	toggleComment
} from "@codemirror/commands";
import { python } from "@codemirror/lang-python";
import { getIndentUnit } from "@codemirror/language";
import { EditorSelection, EditorState } from "@codemirror/state";
import { describe, expect, it, vi } from "vitest";
import type { PythonIdeMode } from "../src/modules/pythonIde";
import {
	canSkipExistingClosingToken,
	codeEditorTabBinding,
	insertEditorIndent,
	createPythonCodeMirrorExtensions,
	isPythonBracketPairIgnoredAt,
	javaIdeCompletionsForMode,
	javaSyntaxDiagnostics,
	pythonIdeCompletionSource,
	pythonIdeCompletionsForMode,
	pythonNewlineIndentText,
	pythonRuntimeDiagnosticForLine,
	pythonSyntaxDiagnostics
} from "../src/modules/pythonCodeMirror";

function sourceFile(path: string) {
	return readFileSync(resolve(__dirname, path), "utf8");
}

it("suggests Pygame surfaces and their drawing methods in game projects", () => {
	expect(autocompleteLabelsForDoc("pgzero", "pygame.Su")).toContain(
		"Surface"
	);
	expect(autocompleteLabelsForDoc("pgzero", "pygame.draw.re")).toContain(
		"rect"
	);
	expect(
		autocompleteLabelsForDoc(
			"pgzero",
			"card = pygame.Surface((40, 20))\ncard.fi"
		)
	).toContain("fill");
	expect(
		autocompleteLabelsForDoc(
			"pgzero",
			"card = pygame.Surface((40, 20))\ncard.bl"
		)
	).toContain("blit");
	expect(
		pythonIdeCompletionsForMode("pgzero", "pygame").map(
			option => option.label
		)
	).not.toContain("display");
});

function completionMatchBefore(doc: string, pos: number, expression: RegExp) {
	const prefix = doc.slice(0, pos);
	const match = prefix.match(expression);
	if (!match?.[0]) return null;
	return {
		from: pos - match[0].length,
		text: match[0],
		to: pos
	};
}

function runStateCommand(state: EditorState, command: StateCommand) {
	let nextState = state;
	const result = command({
		dispatch(transaction: Transaction) {
			nextState = transaction.state;
		},
		state
	});
	return { result, state: nextState };
}

interface TestCompletionContext {
	explicit: boolean;
	pos: number;
	state: EditorState;
	matchBefore: (expression: RegExp) => {
		from: number;
		text: string;
		to: number;
	} | null;
}

interface TestCompletionResult {
	options?: Completion[];
	validFor?: RegExp;
}

type TestCompletionSource = (
	context: TestCompletionContext
) => TestCompletionResult | null;

function autocompleteLabelsForDoc(mode: PythonIdeMode, doc: string) {
	return autocompleteLabelsForDocAt(mode, doc, doc.length);
}

function autocompleteLabelsForMarkedDoc(
	mode: PythonIdeMode,
	markedDoc: string
) {
	const pos = markedDoc.indexOf("|");
	expect(pos).toBeGreaterThanOrEqual(0);
	expect(markedDoc.indexOf("|", pos + 1)).toBe(-1);
	const doc = `${markedDoc.slice(0, pos)}${markedDoc.slice(pos + 1)}`;
	return autocompleteLabelsForDocAt(mode, doc, pos);
}

function autocompleteLabelsForDocAt(
	mode: PythonIdeMode,
	doc: string,
	pos: number
) {
	return autocompleteResultsForDocAt(mode, doc, pos).flatMap(
		result => result.options?.map(option => option.label) ?? []
	);
}

function autocompleteResultsForDocAt(
	mode: PythonIdeMode,
	doc: string,
	pos: number
) {
	const state = EditorState.create({
		doc,
		extensions: createPythonCodeMirrorExtensions({
			mode,
			onChange: vi.fn(),
			onCursorCountChange: vi.fn()
		})
	});
	const sources = state.languageDataAt<TestCompletionSource>(
		"autocomplete",
		pos
	);

	return sources.flatMap(source => {
		const result = source({
			explicit: true,
			matchBefore: expression =>
				completionMatchBefore(doc, pos, expression),
			pos,
			state
		});
		return result ? [result] : [];
	});
}

describe("python IDE CodeMirror editor", () => {
	it("does not eager-import IDE feature modules through the app plugin loader", () => {
		const mainSource = sourceFile("../src/main.ts");

		expect(mainSource).toContain('import: "install"');
		expect(mainSource).toContain("./modules/admin-guard.ts");
		expect(mainSource).toContain("./modules/i18n.ts");
		expect(mainSource).toContain("./modules/nprogress.ts");
		expect(mainSource).toContain("./modules/pinia.ts");
		expect(mainSource).not.toContain('"./modules/*.ts"');
		expect(mainSource).not.toContain("./modules/pythonCodeMirror.ts");
		expect(mainSource).not.toContain("./modules/pythonIdeRuntime.ts");
	});

	it("keeps the route page as a lightweight async workspace wrapper", () => {
		const routeSource = sourceFile("../src/pages/ide.vue");
		const legacyRouteSource = sourceFile("../src/pages/python-ide.vue");
		const blueJLegacyRouteSource = sourceFile("../src/pages/bluej.vue");
		const workspaceSource = sourceFile(
			"../src/components/CodeIdeWorkspace.vue"
		);

		expect(routeSource).toContain("defineAsyncComponent");
		expect(routeSource).toContain(
			'() => import("@/components/AccountCodeIdeWorkspace.vue")'
		);
		expect(routeSource).not.toContain("new EditorView");
		expect(routeSource).not.toContain("loadPythonIdeRuntime");
		expect(legacyRouteSource).not.toContain("defineAsyncComponent");
		expect(legacyRouteSource).not.toContain("AccountCodeIdeWorkspace.vue");
		expect(legacyRouteSource).toContain('path: "/ide"');
		expect(legacyRouteSource).not.toContain("<CodeIdeWorkspace />");
		expect(legacyRouteSource).not.toContain("new EditorView");
		expect(legacyRouteSource).not.toContain("loadPythonIdeRuntime");
		expect(blueJLegacyRouteSource).not.toContain("defineAsyncComponent");
		expect(blueJLegacyRouteSource).toContain('path: "/ide"');
		expect(blueJLegacyRouteSource).toContain(
			'mode: route.query.mode ?? "bluej"'
		);
		expect(blueJLegacyRouteSource).not.toContain("<CodeIdeWorkspace />");
		expect(workspaceSource).not.toContain('route.path === "/bluej"');
		expect(workspaceSource).toContain(
			'<WorkspaceHeader title="Code workspace">'
		);
		expect(workspaceSource).toContain("WorkspaceHeader");
	});

	it("does not force CodeMirror through a fragile manual editor chunk", () => {
		const viteSource = sourceFile("../vite.config.mts");

		expect(viteSource).not.toContain('name: "python-ide-editor"');
		expect(viteSource).not.toContain(
			"test: /src\\/modules\\/pythonCodeMirror\\.ts$/"
		);
		expect(viteSource).toContain('name: "python-ide-runtime"');
	});

	it("does not import the heavy Pyodide runtime before running code", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");
		const runtimeSource = sourceFile("../src/modules/pythonIdeRuntime.ts");
		const hintSource = sourceFile(
			"../src/modules/pythonIdeRuntimeHints.ts"
		);

		expect(pageSource).toContain("import { primePythonRuntimeConnection }");
		expect(pageSource).toContain("primePythonRuntimeConnection();");
		expect(pageSource).not.toContain("warmPythonRuntimeResources();");
		expect(pageSource).not.toContain(
			"loadPythonRuntimeModule().then(module => module.warmPythonRuntime())"
		);
		expect(pageSource).toContain(
			"if (!pythonRuntimeModulePromise) return;"
		);
		expect(pageSource).toContain("releaseLoadedPythonRuntimeCallbacks();");
		expect(runtimeSource).toContain("warmPythonRuntimeResources();");
		expect(hintSource).toContain(
			"export function primePythonRuntimeConnection"
		);
		expect(hintSource).toContain(
			"export function warmPythonRuntimeResources"
		);
		expect(hintSource).toContain("const PYTHON_RUNTIME_CONNECTION_HINTS");
		expect(hintSource).toContain("const PYTHON_RUNTIME_RESOURCE_HINTS");
		expect(hintSource).toContain(
			"https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/"
		);
	});

	it("mounts CodeMirror instead of the old textarea highlight overlay", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(pageSource).toContain("createPythonCodeMirrorExtensions");
		expect(pageSource).toContain("new EditorView");
		expect(pageSource).toContain("codeEditorHostRef");
		expect(pageSource).toContain('class="code-editor-host"');
		expect(pageSource).not.toContain("highlightPythonCodeAsHtml");
		expect(pageSource).not.toContain("code-editor-highlight");
		expect(pageSource).not.toContain("handleCodeEditorKeyDown");
	});

	it("preserves CodeMirror state, cursor, scroll, and history per IDE file", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");
		const resetStart = pageSource.indexOf("async function resetCodeEditor");
		const resetSource = pageSource.slice(
			resetStart,
			pageSource.indexOf("function syncCodeEditorContent", resetStart)
		);

		expect(pageSource).toContain(
			"const codeEditorViewStates = new Map<string, CodeEditorViewState>();"
		);
		expect(pageSource).toContain(
			"const codeEditorStateSnapshots = new Map<string, CodeEditorState>();"
		);
		expect(pageSource).toContain("let activeCodeEditorViewStateKey");
		expect(pageSource).toContain("function saveCodeEditorViewState");
		expect(pageSource).toContain("codeEditorStateSnapshots.set(");
		expect(pageSource).toContain("function migrateCodeEditorViewStates");
		expect(pageSource).toContain("function restoreCodeEditorViewState");
		expect(pageSource).toContain("function restoreCodeEditorScroll");
		expect(pageSource).toContain("function deleteCodeEditorStateForFile");
		expect(pageSource).toContain(
			"function deleteCodeEditorStateForProject"
		);
		expect(pageSource).toContain("codeEditorView.scrollDOM.scrollTop");
		expect(pageSource).toContain(
			"view.scrollDOM.scrollTop = state.scrollTop"
		);
		expect(pageSource).toContain("clampCodeEditorPosition");
		expect(pageSource).toContain(
			"codeEditorViewStates.set(nextKey, state);"
		);
		expect(pageSource).toContain("activeCodeEditorViewStateKey = nextKey;");
		expect(pageSource).toContain('import("@codemirror/state")');
		expect(pageSource).toContain(
			"savedState?.doc.toString() === activeFileContent.value"
		);
		expect(pageSource).toContain("state: restoredState");
		expect(pageSource).toContain("restoreCodeEditorScroll(");
		expect(resetSource).toContain("saveCodeEditorViewState();");
		expect(resetSource).toContain("codeEditorView?.destroy();");
		expect(resetSource).toContain(
			"const viewStateKey = codeEditorViewStateKey();"
		);
		expect(resetSource).toContain("restoreCodeEditorViewState(");
	});

	it("enables Python parsing and typical IDE editing behavior", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(editorSource).toContain("pythonEditorBaseSetup");
		expect(editorSource).toContain("lineNumbers()");
		expect(editorSource).toContain("history()");
		expect(editorSource).toContain(
			"activateOnTyping: recommendationsEnabled"
		);
		expect(editorSource).toContain("snippetCompletion");
		expect(editorSource).toContain("highlightSelectionMatches()");
		expect(editorSource).not.toContain('from "codemirror"');
		expect(editorSource).toContain("python()");
		expect(editorSource).toContain("indentWithTab");
		expect(editorSource).toContain("indentUnit.of(pythonIndentText)");
		expect(editorSource).toContain("lineWrappingEnabled?: boolean;");
		expect(editorSource).toContain(
			"lineWrappingEnabled ? EditorView.lineWrapping : []"
		);
		expect(editorSource).toContain(
			"codeMirrorInsertNewlineAndIndent(view)"
		);
		expect(editorSource).toContain("insertPythonNewlineWithFallbackIndent");
		expect(editorSource).toContain("EditorState.allowMultipleSelections");
		expect(editorSource).toContain(".cm-panel.cm-search");
		expect(editorSource).toContain(".cm-foldPlaceholder");
		expect(editorSource).toContain("insertPythonNewlineAndIndent");
		expect(editorSource).toContain("wrapSelection");
		expect(editorSource).toContain("closingTokenSkipKeymap");
		expect(editorSource).toContain("pythonEditorActionKeymap");
		expect(editorSource).toContain("Mod-s");
		expect(editorSource).toContain("Mod-Enter");
		expect(editorSource).toContain("canSkipExistingClosingToken");
		expect(editorSource).toContain("syntaxHighlighting");
		expect(editorSource).toContain("BracketPairColorPlugin");
		expect(editorSource).toContain("cm-bracket-pair-1");
		expect(editorSource).toContain("pythonLanguage.data.of");
		expect(editorSource).toContain("pythonIdeCompletionSource");
		expect(editorSource).toContain("pythonSyntaxDiagnostics");
		expect(editorSource).toContain("linter(view =>");
		expect(editorSource).toContain("lintGutter({ hoverTime: 220 })");
		expect(pageSource).toContain(
			'mode: selectedProject.value?.mode ?? "python"'
		);
	});

	it("enables Java parsing, comments, completions, and multiline indentation", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");
		const referenceSource = sourceFile(
			"../../docs/java-ide-editor-references.md"
		);
		const doc = "public class Main {\nint x = 1;\nint y = 2;\n}\n";
		const extensions = createPythonCodeMirrorExtensions({
			mode: "java",
			onChange: vi.fn(),
			onCursorCountChange: vi.fn()
		});
		const selectedBodyLines = EditorState.create({
			doc,
			extensions,
			selection: EditorSelection.range(
				doc.indexOf("int x"),
				doc.indexOf("}\n")
			)
		});

		expect(editorSource).toContain('from "@codemirror/lang-java"');
		expect(editorSource).toContain("java()");
		expect(editorSource).toContain("javaLanguage.data.of");
		expect(editorSource).toContain("javaIdeCompletionSource(mode)");
		expect(editorSource).toContain("javaEditorDiagnosticsSetup");
		expect(editorSource).toContain("javaSyntaxDiagnostics");
		expect(editorSource).not.toContain("override: isPythonMode");
		expect(referenceSource).toContain(
			"https://code.haverbeke.berlin/codemirror/lang-java"
		);
		expect(referenceSource).toContain(
			"https://codemirror.net/docs/ref/#lang-java.java"
		);
		expect(referenceSource).not.toContain(
			"https://github.com/codemirror/lang-java"
		);
		expect(referenceSource).toContain("java.util.Random");

		const javaLabels = javaIdeCompletionsForMode("java").map(
			option => option.label
		);
		expect(javaLabels).toEqual(
			expect.arrayContaining([
				"class",
				"main",
				"class_main",
				"array",
				"array_values",
				"array2d",
				"array2d_values",
				"arraylist",
				"random_generator",
				"hashset",
				"priority_queue",
				"hashmap",
				"treemap",
				"array_to_string",
				"array_deep_to_string",
				"foreach",
				"fori",
				"method",
				"constructor",
				"getter",
				"setter",
				"to_string",
				"comparable_class",
				"comparator",
				"lambda_expression",
				"predicate",
				"optional_value",
				"stream_pipeline",
				"grouping_by",
				"interface_type",
				"record_type",
				"enum_type",
				"switch_statement",
				"switch_expression",
				"throw_exception",
				"try_catch",
				"try_with_resources",
				"file_scanner",
				"file_writer",
				"sout",
				"Arrays",
				"Collections",
				"List",
				"Set",
				"Random",
				"HashSet",
				"TreeSet",
				"Queue",
				"PriorityQueue",
				"HashMap",
				"TreeMap",
				"Map",
				"Map.Entry",
				"Stream",
				"Collectors",
				"Predicate",
				"Function",
				"Consumer",
				"Supplier",
				"Comparable",
				"Comparator",
				"Override",
				"record",
				"File",
				"FileReader",
				"FileWriter",
				"BufferedReader",
				"PrintWriter",
				"Optional",
				"Exception",
				"RuntimeException",
				"IllegalArgumentException",
				"IOException",
				"FileNotFoundException",
				"import java.util.ArrayList",
				"import java.util.Arrays",
				"import java.util.Collections",
				"import java.util.List",
				"import java.util.Set",
				"import java.util.Random",
				"import java.util.HashSet",
				"import java.util.TreeSet",
				"import java.util.Queue",
				"import java.util.PriorityQueue",
				"import java.util.HashMap",
				"import java.util.TreeMap",
				"import java.util.Map",
				"import java.util.Optional",
				"import java.util.Comparator",
				"import java.util.stream.Stream",
				"import java.util.stream.Collectors",
				"import java.util.function.Predicate",
				"import java.util.function.Function",
				"import java.util.function.Consumer",
				"import java.util.function.Supplier",
				"import java.awt.Color",
				"import java.io.BufferedReader",
				"import java.io.File",
				"import java.io.FileReader",
				"import java.io.FileWriter",
				"import java.io.IOException",
				"import java.io.FileNotFoundException",
				"import java.io.PrintWriter",
				"System.out.println"
			])
		);
		expect(editorSource).toContain("switch_statement");
		expect(editorSource).toContain("switch_expression");
		expect(editorSource).toContain("throw_exception");
		expect(editorSource).toContain("throw new IllegalArgumentException");
		expect(editorSource).toContain("lambda_expression");
		expect(editorSource).toContain("optional_value");
		expect(editorSource).toContain("Optional.ofNullable");
		expect(editorSource).toContain("stream_pipeline");
		expect(editorSource).toContain("Collectors.groupingBy");
		expect(editorSource).toContain("try_with_resources");
		expect(editorSource).toContain("file_scanner");
		expect(editorSource).toContain("file_writer");
		expect(editorSource).toContain(
			'new File("${snippetField("file")}.txt")'
		);
		expect(editorSource).toContain(
			'new FileWriter("${snippetField("file")}.txt")'
		);
		expect(javaLabels).not.toEqual(
			expect.arrayContaining([
				"import kareltherobot.UrRobot",
				"import kareltherobot.World",
				"import kareltherobot.Directions"
			])
		);
		const karelLabels = javaIdeCompletionsForMode("karel").map(
			option => option.label
		);
		expect(karelLabels).toEqual(
			expect.arrayContaining([
				"import java.awt.Color",
				"import kareltherobot.UrRobot",
				"import kareltherobot.World",
				"import kareltherobot.Directions"
			])
		);
		expect(
			javaIdeCompletionsForMode("java", "System.out").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining(["print", "println", "printf", "format"])
		);
		expect(
			javaIdeCompletionsForMode("java", "String").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["format"]));
		expect(
			javaIdeCompletionsForMode("java", "Arrays").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"toString",
				"deepToString",
				"sort",
				"copyOf"
			])
		);
		expect(
			javaIdeCompletionsForMode("java", "Collections").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"sort",
				"reverse",
				"shuffle",
				"min",
				"max",
				"frequency",
				"reverseOrder"
			])
		);
		expect(
			javaIdeCompletionsForMode("java", "Comparator").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"comparing",
				"comparingInt",
				"comparingDouble",
				"naturalOrder",
				"reverseOrder"
			])
		);
		expect(
			javaIdeCompletionsForMode("java", "names").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"length",
				"charAt",
				"substring",
				"equals",
				"equalsIgnoreCase",
				"compareTo",
				"indexOf",
				"toLowerCase",
				"toUpperCase",
				"trim",
				"next",
				"nextLine",
				"nextInt",
				"nextDouble",
				"nextBoolean",
				"hasNext",
				"hasNextLine",
				"hasNextInt",
				"hasNextDouble",
				"hasNextBoolean",
				"add",
				"offer",
				"poll",
				"peek",
				"element",
				"get",
				"set",
				"put",
				"putIfAbsent",
				"remove",
				"contains",
				"containsAll",
				"containsKey",
				"addAll",
				"removeAll",
				"retainAll",
				"keySet",
				"values",
				"entrySet",
				"getOrDefault",
				"getKey",
				"getValue",
				"clear",
				"iterator",
				"toArray",
				"size",
				"isEmpty",
				"hashCode",
				"toString"
			])
		);
		for (const receiver of ["constructor", "toString", "__proto__"]) {
			expect(
				javaIdeCompletionsForMode("java", receiver),
				receiver
			).toEqual(expect.any(Array));
		}

		const commented = runStateCommand(selectedBodyLines, toggleComment);
		expect(commented.result).toBe(true);
		expect(commented.state.doc.toString()).toBe(
			"public class Main {\n// int x = 1;\n// int y = 2;\n}\n"
		);

		const indented = runStateCommand(selectedBodyLines, indentMore);
		expect(indented.result).toBe(true);
		expect(indented.state.doc.toString()).toBe(
			"public class Main {\n    int x = 1;\n    int y = 2;\n}\n"
		);
		const dedented = runStateCommand(indented.state, indentLess);
		expect(dedented.result).toBe(true);
		expect(dedented.state.doc.toString()).toBe(doc);
	});

	it("wires the CodeMirror comment shortcut for Java selections", () => {
		const commentShortcut = defaultKeymap.find(
			binding => binding.key === "Mod-/"
		);
		expect(commentShortcut?.run).toBe(toggleComment);

		const doc = "public class Main {\nint x = 1;\nint y = 2;\n}\n";
		const selectedBodyLines = EditorState.create({
			doc,
			extensions: createPythonCodeMirrorExtensions({ mode: "java" }),
			selection: EditorSelection.create([
				EditorSelection.range(doc.indexOf("int x"), doc.indexOf("}\n"))
			])
		});

		const commented = runStateCommand(
			selectedBodyLines,
			commentShortcut?.run as StateCommand
		);
		expect(commented.result).toBe(true);
		expect(commented.state.doc.toString()).toBe(
			"public class Main {\n// int x = 1;\n// int y = 2;\n}\n"
		);
	});

	it.each(["python", "turtle", "pgzero", "java", "karel"] as const)(
		"inserts Tab at the caret in %s instead of shifting its line",
		mode => {
			const doc = "first line\n    second line";
			for (const cursor of [0, 3, doc.length]) {
				const state = EditorState.create({
					doc,
					extensions: createPythonCodeMirrorExtensions({ mode }),
					selection: { anchor: cursor }
				});
				const result = runStateCommand(state, codeEditorTabBinding.run);
				expect(result.result).toBe(true);
				expect(result.state.doc.toString()).toBe(
					doc.slice(0, cursor) + "    " + doc.slice(cursor)
				);
				expect(result.state.selection.main.head).toBe(cursor + 4);
			}
		}
	);

	it("indents the line when only part of its text is highlighted", () => {
		const state = EditorState.create({
			doc: "print(value)",
			extensions: createPythonCodeMirrorExtensions({ mode: "python" }),
			selection: { anchor: 6, head: 11 }
		});
		expect(
			runStateCommand(
				state,
				codeEditorTabBinding.run
			).state.doc.toString()
		).toBe("    print(value)");
	});

	it("wires Tab and Shift+Tab indentation for Java selections", () => {
		expect(codeEditorTabBinding.key).toBe("Tab");
		expect(codeEditorTabBinding.run).toBe(insertEditorIndent);
		expect(codeEditorTabBinding.shift).toBe(indentLess);

		const doc = "public class Main {\nint x = 1;\nint y = 2;\n}\n";
		const selectedBodyLines = EditorState.create({
			doc,
			extensions: createPythonCodeMirrorExtensions({ mode: "java" }),
			selection: EditorSelection.create([
				EditorSelection.range(doc.indexOf("int x"), doc.indexOf("}\n"))
			])
		});

		const indented = runStateCommand(
			selectedBodyLines,
			codeEditorTabBinding.run as StateCommand
		);
		expect(indented.result).toBe(true);
		expect(indented.state.doc.toString()).toBe(
			"public class Main {\n    int x = 1;\n    int y = 2;\n}\n"
		);

		const dedented = runStateCommand(
			indented.state,
			codeEditorTabBinding.shift as StateCommand
		);
		expect(dedented.result).toBe(true);
		expect(dedented.state.doc.toString()).toBe(doc);
	});

	it("offers Java and Karel member completions immediately after a dot", () => {
		expect(autocompleteLabelsForDoc("java", "System.out.")).toEqual(
			expect.arrayContaining(["print", "println", "printf", "format"])
		);
		expect(
			autocompleteLabelsForDoc("java", "java.lang.System.out.")
		).toEqual(
			expect.arrayContaining(["print", "println", "printf", "format"])
		);
		expect(autocompleteLabelsForDoc("java", "String.")).toEqual(
			expect.arrayContaining(["format"])
		);
		expect(autocompleteLabelsForDoc("java", "java.lang.String.")).toEqual(
			expect.arrayContaining(["format"])
		);
		expect(autocompleteLabelsForDoc("java", "Math.")).toEqual(
			expect.arrayContaining(["PI", "E", "random", "sqrt"])
		);
		expect(autocompleteLabelsForDoc("java", "java.lang.Math.")).toEqual(
			expect.arrayContaining(["PI", "E", "random", "sqrt"])
		);
		expect(autocompleteLabelsForDoc("java", "random.")).toEqual(
			expect.arrayContaining([
				"nextInt",
				"nextDouble",
				"nextBoolean",
				"nextLong",
				"setSeed"
			])
		);
		const declaredRandomDoc = [
			"import java.util.Random;",
			"public class Main {",
			"    public static void main(String[] args) {",
			"        Random generator = new Random();",
			"        generator.|",
			"    }",
			"}"
		].join("\n");
		expect(
			autocompleteLabelsForMarkedDoc("java", declaredRandomDoc)
		).toEqual(
			expect.arrayContaining([
				"nextInt",
				"nextDouble",
				"nextBoolean",
				"nextLong",
				"setSeed"
			])
		);
		const declaredScannerDoc = [
			"import java.util.Scanner;",
			"public class Main {",
			"    public static void main(String[] args) {",
			"        Scanner input = new Scanner(System.in);",
			"        input.|",
			"    }",
			"}"
		].join("\n");
		const declaredScannerLabels = autocompleteLabelsForMarkedDoc(
			"java",
			declaredScannerDoc
		);
		expect(declaredScannerLabels).toEqual(
			expect.arrayContaining([
				"next",
				"nextLine",
				"nextInt",
				"nextDouble",
				"nextBoolean",
				"hasNext",
				"hasNextLine",
				"hasNextInt",
				"hasNextDouble",
				"hasNextBoolean"
			])
		);
		expect(declaredScannerLabels).not.toEqual(
			expect.arrayContaining(["charAt", "put", "keySet"])
		);
		const declaredStringLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"public class Main {",
				"    public static void main(String[] args) {",
				'        String name = "Ada";',
				"        name.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredStringLabels).toEqual(
			expect.arrayContaining(["charAt", "substring", "trim"])
		);
		expect(declaredStringLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "put", "keySet"])
		);

		const declaredArrayLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"public class Main {",
				"    public static void main(String[] args) {",
				"        int[] scores = {1, 2, 3};",
				"        scores.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredArrayLabels).toEqual(
			expect.arrayContaining(["length", "clone"])
		);
		expect(declaredArrayLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "put", "keySet"])
		);

		const declaredListLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.ArrayList;",
				"public class Main {",
				"    public static void main(String[] args) {",
				"        ArrayList<String> names = new ArrayList<>();",
				"        names.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredListLabels).toEqual(
			expect.arrayContaining([
				"add",
				"get",
				"set",
				"stream",
				"size",
				"isEmpty"
			])
		);
		expect(declaredListLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "put", "keySet"])
		);

		const declaredSetLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.HashSet;",
				"public class Main {",
				"    public static void main(String[] args) {",
				"        HashSet<String> seen = new HashSet<>();",
				"        seen.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredSetLabels).toEqual(
			expect.arrayContaining([
				"add",
				"contains",
				"stream",
				"size",
				"isEmpty"
			])
		);
		expect(declaredSetLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "get", "put", "keySet"])
		);

		const declaredQueueLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.PriorityQueue;",
				"public class Main {",
				"    public static void main(String[] args) {",
				"        PriorityQueue<String> tasks = new PriorityQueue<>();",
				"        tasks.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredQueueLabels).toEqual(
			expect.arrayContaining(["offer", "poll", "peek", "stream", "size"])
		);
		expect(declaredQueueLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "get", "put", "keySet"])
		);

		const declaredMapLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.HashMap;",
				"public class Main {",
				"    public static void main(String[] args) {",
				"        HashMap<String, Integer> counts = new HashMap<>();",
				"        counts.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredMapLabels).toEqual(
			expect.arrayContaining([
				"put",
				"getOrDefault",
				"containsKey",
				"keySet",
				"entrySet"
			])
		);
		expect(declaredMapLabels).not.toEqual(
			expect.arrayContaining(["charAt", "nextInt", "poll"])
		);

		const declaredMapEntryLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.Map;",
				"public class Main {",
				"    public static void main(String[] args) {",
				"        Map.Entry<String, Integer> entry = null;",
				"        entry.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredMapEntryLabels).toEqual(
			expect.arrayContaining(["getKey", "getValue"])
		);
		expect(declaredMapEntryLabels).not.toEqual(
			expect.arrayContaining(["charAt", "nextInt", "put"])
		);

		const declaredOptionalLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.Optional;",
				"public class Main {",
				"    public static void main(String[] args) {",
				'        Optional<String> name = Optional.ofNullable("Ada");',
				"        name.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredOptionalLabels).toEqual(
			expect.arrayContaining([
				"isPresent",
				"isEmpty",
				"orElse",
				"orElseGet",
				"map",
				"filter",
				"ifPresent"
			])
		);
		expect(declaredOptionalLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "put", "keySet"])
		);

		const declaredStreamLabels = autocompleteLabelsForMarkedDoc(
			"java",
			[
				"import java.util.stream.Stream;",
				"public class Main {",
				"    public static void main(String[] args) {",
				'        Stream<String> names = Stream.of("Ada", "Grace");',
				"        names.|",
				"    }",
				"}"
			].join("\n")
		);
		expect(declaredStreamLabels).toEqual(
			expect.arrayContaining([
				"filter",
				"map",
				"sorted",
				"collect",
				"toList",
				"forEach",
				"count"
			])
		);
		expect(declaredStreamLabels).not.toEqual(
			expect.arrayContaining(["nextInt", "put", "keySet"])
		);
		expect(autocompleteLabelsForDoc("java", "names.")).toEqual(
			expect.arrayContaining([
				"equals",
				"compareTo",
				"indexOf",
				"toLowerCase",
				"nextLine",
				"nextInt",
				"hasNextInt",
				"get",
				"set",
				"offer",
				"poll",
				"peek",
				"put",
				"containsKey",
				"keySet",
				"values",
				"entrySet",
				"getKey",
				"getValue",
				"toArray",
				"stream",
				"isPresent",
				"orElse",
				"filter",
				"map",
				"sorted",
				"collect",
				"size",
				"isEmpty"
			])
		);
		expect(autocompleteLabelsForDoc("java", "Arrays.")).toEqual(
			expect.arrayContaining([
				"toString",
				"deepToString",
				"sort",
				"copyOf"
			])
		);
		expect(autocompleteLabelsForDoc("java", "java.util.Arrays.")).toEqual(
			expect.arrayContaining([
				"toString",
				"deepToString",
				"sort",
				"copyOf"
			])
		);
		expect(autocompleteLabelsForDoc("java", "Collections.")).toEqual(
			expect.arrayContaining(["sort", "reverse", "shuffle", "max"])
		);
		expect(
			autocompleteLabelsForDoc("java", "java.util.Collections.")
		).toEqual(
			expect.arrayContaining(["sort", "reverse", "shuffle", "max"])
		);
		expect(autocompleteLabelsForDoc("java", "Comparator.")).toEqual(
			expect.arrayContaining([
				"comparing",
				"comparingInt",
				"reverseOrder"
			])
		);
		expect(
			autocompleteLabelsForDoc("java", "java.util.Comparator.")
		).toEqual(
			expect.arrayContaining([
				"comparing",
				"comparingInt",
				"reverseOrder"
			])
		);
		expect(autocompleteLabelsForDoc("java", "Optional.")).toEqual(
			expect.arrayContaining(["of", "ofNullable", "empty"])
		);
		expect(autocompleteLabelsForDoc("java", "java.util.Optional.")).toEqual(
			expect.arrayContaining(["of", "ofNullable", "empty"])
		);
		expect(autocompleteLabelsForDoc("java", "Stream.")).toEqual(
			expect.arrayContaining(["of", "empty", "generate", "iterate"])
		);
		expect(
			autocompleteLabelsForDoc("java", "java.util.stream.Stream.")
		).toEqual(
			expect.arrayContaining(["of", "empty", "generate", "iterate"])
		);
		expect(autocompleteLabelsForDoc("java", "Collectors.")).toEqual(
			expect.arrayContaining(["toList", "toSet", "joining", "groupingBy"])
		);
		expect(
			autocompleteLabelsForDoc("java", "java.util.stream.Collectors.")
		).toEqual(
			expect.arrayContaining(["toList", "toSet", "joining", "groupingBy"])
		);
		expect(autocompleteLabelsForDoc("karel", "World.")).toEqual(
			expect.arrayContaining(["readWorld"])
		);
		expect(
			autocompleteLabelsForDoc("karel", "kareltherobot.World.")
		).toEqual(expect.arrayContaining(["readWorld"]));
		expect(autocompleteLabelsForDoc("karel", "Directions.")).toEqual(
			expect.arrayContaining(["North", "East", "South", "West"])
		);
		expect(
			autocompleteLabelsForDoc("karel", "kareltherobot.Directions.")
		).toEqual(expect.arrayContaining(["North", "East", "South", "West"]));
		expect(autocompleteLabelsForDoc("karel", "Directions.")).not.toEqual(
			expect.arrayContaining(["move", "turnLeft"])
		);
		expect(autocompleteLabelsForDoc("karel", "Color.")).toEqual(
			expect.arrayContaining([
				"RED",
				"BLUE",
				"GREEN",
				"red",
				"purple",
				"random()"
			])
		);
		expect(autocompleteLabelsForDoc("karel", "java.awt.Color.")).toEqual(
			expect.arrayContaining([
				"RED",
				"BLUE",
				"GREEN",
				"red",
				"purple",
				"random()"
			])
		);
		expect(autocompleteLabelsForDoc("karel", "sam.")).toEqual(
			expect.arrayContaining([
				"move",
				"turnLeft",
				"turnRight",
				"turnAround",
				"putBeeper",
				"pickBeeper",
				"putBall",
				"takeBall",
				"paint",
				"paintCorner"
			])
		);
		expect(autocompleteLabelsForDoc("karel", "paint")).toEqual(
			expect.arrayContaining(["paint", "paintCorner"])
		);
		expect(autocompleteLabelsForDoc("karel", "corner")).toEqual(
			expect.arrayContaining(["cornerColorIs", "cornerColorIsNot"])
		);
		expect(autocompleteLabelsForDoc("karel", "color")).toEqual(
			expect.arrayContaining(["colorIs", "colorIsNot"])
		);
		expect(autocompleteLabelsForDoc("karel", 'paintCorner("')).toEqual(
			expect.arrayContaining(["red", "blue", "purple", "random()"])
		);
		expect(autocompleteLabelsForDoc("karel", 'sam.paintCorner("g')).toEqual(
			expect.arrayContaining(["green", "light gray"])
		);
		expect(autocompleteLabelsForDoc("karel", 'cornerColorIs("')).toEqual(
			expect.arrayContaining(["red", "dark gray"])
		);
		expect(
			autocompleteLabelsForDoc("karel", 'cornerColorIsNot("p')
		).toEqual(expect.arrayContaining(["purple", "pink"]));
		expect(autocompleteLabelsForDoc("karel", "front")).toEqual(
			expect.arrayContaining(["frontIsClear", "frontIsBlocked"])
		);
		expect(autocompleteLabelsForDoc("karel", "balls")).toEqual(
			expect.arrayContaining(["ballsPresent", "noBallsPresent"])
		);
		expect(autocompleteLabelsForDoc("karel", "facing")).toEqual(
			expect.arrayContaining(["facingEast", "notFacingWest"])
		);
	});

	it("replaces the full Java import statement when completing typed imports", () => {
		const doc = "import java.util.Pri";
		const [result] = autocompleteResultsForDocAt("java", doc, doc.length);

		expect(result?.from).toBe(0);
		expect(result?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"import java.util.PriorityQueue",
				"import java.util.HashSet",
				"import java.util.Comparator"
			])
		);
		expect(result?.options?.map(option => option.label)).not.toEqual(
			expect.arrayContaining(["import java.io.File"])
		);

		const randomDoc = "import java.util.Ran";
		const [randomResult] = autocompleteResultsForDocAt(
			"java",
			randomDoc,
			randomDoc.length
		);
		expect(randomResult?.from).toBe(0);
		expect(randomResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["import java.util.Random"])
		);

		const optionalDoc = "import java.util.Opt";
		const [optionalResult] = autocompleteResultsForDocAt(
			"java",
			optionalDoc,
			optionalDoc.length
		);
		expect(optionalResult?.from).toBe(0);
		expect(optionalResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["import java.util.Optional"])
		);

		const streamDoc = "import java.util.stream.Col";
		const [streamResult] = autocompleteResultsForDocAt(
			"java",
			streamDoc,
			streamDoc.length
		);
		expect(streamResult?.from).toBe(0);
		expect(streamResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"import java.util.stream.Collectors",
				"import java.util.stream.Stream"
			])
		);
		expect(streamResult?.options?.map(option => option.label)).not.toEqual(
			expect.arrayContaining(["import java.util.Comparator"])
		);

		const functionDoc = "import java.util.function.Pred";
		const [functionResult] = autocompleteResultsForDocAt(
			"java",
			functionDoc,
			functionDoc.length
		);
		expect(functionResult?.from).toBe(0);
		expect(functionResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"import java.util.function.Predicate",
				"import java.util.function.Function"
			])
		);

		const ioDoc = "import java.io.FileW";
		const [ioResult] = autocompleteResultsForDocAt(
			"java",
			ioDoc,
			ioDoc.length
		);
		expect(ioResult?.from).toBe(0);
		expect(ioResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"import java.io.BufferedReader",
				"import java.io.File",
				"import java.io.FileReader",
				"import java.io.FileWriter",
				"import java.io.IOException",
				"import java.io.FileNotFoundException",
				"import java.io.PrintWriter"
			])
		);

		const colorDoc = "import java.awt.Col";
		const [colorResult] = autocompleteResultsForDocAt(
			"karel",
			colorDoc,
			colorDoc.length
		);
		expect(colorResult?.from).toBe(0);
		expect(colorResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["import java.awt.Color"])
		);

		const karelImportDoc = "import kareltherobot.Wo";
		const [karelImportResult] = autocompleteResultsForDocAt(
			"karel",
			karelImportDoc,
			karelImportDoc.length
		);
		expect(karelImportResult?.from).toBe(0);
		expect(karelImportResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"import kareltherobot.UrRobot",
				"import kareltherobot.World",
				"import kareltherobot.Directions"
			])
		);
		expect(
			karelImportResult?.options?.map(option => option.label)
		).not.toEqual(expect.arrayContaining(["import java.awt.Color"]));
		expect(
			autocompleteResultsForDocAt(
				"java",
				karelImportDoc,
				karelImportDoc.length
			)
		).toEqual([]);
	});

	it("keeps Java completions active for digit-bearing snippets and receiver names", () => {
		const [arrayResult] = autocompleteResultsForDocAt(
			"java",
			"array2",
			"array2".length
		);
		expect(arrayResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["array2d", "array2d_values"])
		);
		expect(arrayResult?.validFor?.test("array2")).toBe(true);
		expect(arrayResult?.validFor?.test("array2d_values")).toBe(true);

		const [javaMemberResult] = autocompleteResultsForDocAt(
			"java",
			"names2.",
			"names2.".length
		);
		expect(javaMemberResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["charAt", "nextInt", "get", "put"])
		);
		expect(javaMemberResult?.validFor?.test("next2")).toBe(true);

		const [karelMemberResult] = autocompleteResultsForDocAt(
			"karel",
			"robot2.",
			"robot2.".length
		);
		expect(karelMemberResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["move", "turnLeft", "putBeeper"])
		);
		expect(karelMemberResult?.validFor?.test("turn2")).toBe(true);

		const karelStringDoc = [
			"public class MyProgram extends SuperKarel {",
			"public void run() {",
			'String message = "hi";',
			"message.",
			"}",
			"}"
		].join(" ");
		const karelStringPosition = karelStringDoc.indexOf("message.") + 8;
		const [karelStringResult] = autocompleteResultsForDocAt(
			"karel",
			karelStringDoc,
			karelStringPosition
		);
		expect(karelStringResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["length", "charAt", "substring"])
		);
		expect(
			karelStringResult?.options?.map(option => option.label)
		).not.toEqual(
			expect.arrayContaining(["move", "turnLeft", "putBeeper"])
		);

		const karelRandomDoc = [
			"public class MyProgram extends SuperKarel {",
			"public void run() {",
			"Random rng = new Random();",
			"rng.",
			"}",
			"}"
		].join(" ");
		const karelRandomPosition = karelRandomDoc.indexOf("rng.") + 4;
		const [karelRandomResult] = autocompleteResultsForDocAt(
			"karel",
			karelRandomDoc,
			karelRandomPosition
		);
		expect(karelRandomResult?.options?.map(option => option.label)).toEqual(
			expect.arrayContaining(["nextInt", "nextDouble", "setSeed"])
		);
	});

	it("suppresses Java and Karel recommendations inside comments and strings", () => {
		expect(
			autocompleteLabelsForMarkedDoc(
				"java",
				"public class Main { void run() { // System.out.| } }"
			)
		).toEqual([]);
		expect(
			autocompleteLabelsForMarkedDoc(
				"java",
				"public class Main { void run() { /* Math.| */ } }"
			)
		).toEqual([]);
		expect(
			autocompleteLabelsForMarkedDoc(
				"java",
				'public class Main { void run() { String text = "System.out.|"; } }'
			)
		).toEqual([]);
		expect(
			autocompleteLabelsForMarkedDoc(
				"karel",
				"public class MyProgram extends SuperKarel { public void run() { // sam.| } }"
			)
		).toEqual([]);
	});

	it("adds Karel Java snippets and ignores Java comment/string brackets", () => {
		const karelLabels = javaIdeCompletionsForMode("karel").map(
			option => option.label
		);
		const doc = [
			"public class Main {",
			"    // comment [ignored]",
			'    String label = "[";',
			"    int[] values = {1, 2};",
			"}"
		].join("\n");
		const state = EditorState.create({
			doc,
			extensions: createPythonCodeMirrorExtensions({
				mode: "karel",
				onChange: vi.fn(),
				onCursorCountChange: vi.fn()
			})
		});

		expect(karelLabels).toEqual(
			expect.arrayContaining([
				"UrRobot",
				"World",
				"SuperKarel",
				"karel_setup",
				"codehs_run",
				"codehs_turnRight",
				"while_front_clear",
				"if_front_clear",
				"if_balls_present",
				"robot_method",
				"turnRight",
				"putBall",
				"takeBall",
				"paint",
				"colorIs",
				"colorIsNot"
			])
		);
		expect(isPythonBracketPairIgnoredAt(state, doc.indexOf("["))).toBe(
			true
		);
		expect(
			isPythonBracketPairIgnoredAt(state, doc.indexOf('"["') + 1)
		).toBe(true);
		expect(
			isPythonBracketPairIgnoredAt(state, doc.indexOf("values") + 3)
		).toBe(false);
	});

	it("keeps bracket-pair colors from changing editor text metrics", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");

		expect(editorSource).toContain("cm-bracket-pair-1");
		expect(editorSource).toContain("syntax-bracket-pair-6");
		expect(editorSource).not.toContain(
			'tag: tags.bracket, color: "var(--syntax-bracket)", fontWeight'
		);
		expect(editorSource).not.toContain(
			'tag: tags.angleBracket,\n\t\tcolor: "var(--syntax-bracket)",\n\t\tfontWeight'
		);
		expect(editorSource).not.toContain(
			'".cm-bracket-pair": {\n\t\t\tfontWeight'
		);
	});

	it("configures CodeMirror's native indentation unit to four spaces", () => {
		const state = EditorState.create({
			doc: "if ready:",
			extensions: createPythonCodeMirrorExtensions({
				onChange: vi.fn(),
				onCursorCountChange: vi.fn()
			})
		});

		expect(getIndentUnit(state)).toBe(4);
		expect(state.tabSize).toBe(4);
	});

	it("surfaces the built-in editor shortcuts in the IDE chrome", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(pageSource).toContain('class="editor-shortcuts"');
		expect(pageSource).toContain("Cmd/Ctrl+F opens search.");
		expect(pageSource).toMatch(
			/Cmd\/Ctrl\+Enter or F5\s+runs or stops\s+the project\./
		);
		expect(pageSource).toContain("Cmd/Ctrl+S saves the project.");
		expect(pageSource).toMatch(
			/Cmd\/Ctrl\+\/\s+toggles comments for the\s+line or selection\./
		);
		expect(pageSource).toContain("Ctrl+Space opens completions");
		expect(pageSource).toContain("main_guard");
		expect(pageSource).toContain("turtle_screen");
		expect(pageSource).toContain("decision_tree");
		expect(pageSource).toContain("Tab indents; Shift+Tab dedents.");
		expect(pageSource).toMatch(
			/Alt\/Option-drag creates a\s+rectangular selection\./
		);
		expect(pageSource).toContain("Quotes and brackets wrap highlighted");
	});

	it("keeps IDE toolbar controls on a shared visual baseline", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(pageSource).toContain(
			"grid-template-columns: minmax(15rem, 1fr) auto;"
		);
		expect(pageSource).toMatch(
			/\.editor-toolbar\s*{[\s\S]*align-items: end;/
		);
		expect(pageSource).toMatch(
			/\.project-title-field\s*{[\s\S]*min-width: 0;[\s\S]*display: grid;[\s\S]*gap: 0\.5rem;/
		);
		expect(pageSource).toMatch(
			/\.project-title-label\s*{[\s\S]*font-size: 0\.75rem;[\s\S]*text-transform: uppercase;[\s\S]*line-height: 1;/
		);
		expect(pageSource).toMatch(
			/\.project-title-input\s*{[\s\S]*min-width: 0;/
		);
		expect(pageSource).toMatch(
			/\.editor-actions\s*{[\s\S]*grid-column: 2;[\s\S]*align-self: end;[\s\S]*height: var\(--code-ide-toolbar-control-size\);/
		);
		expect(pageSource).toMatch(/\.ide-settings\s*{[\s\S]*height: 100%;/);
		expect(pageSource).toContain("box-sizing: border-box;");
		expect(pageSource).toContain(".editor-actions > .site-button");
		expect(pageSource).not.toContain("display: contents;");
		expect(pageSource).toContain(".project-title-input:focus-visible");
		expect(pageSource).not.toContain(
			".editor-toolbar > label:focus-within"
		);
	});

	it("keeps the IDE splitter as a single discreet separator", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");
		const splitterSource =
			pageSource.match(
				/class="ide-splitter"[\s\S]*?@pointerdown="startIdeSplitResize"[\s\S]*?\/>/
			)?.[0] ?? "";

		expect(splitterSource).toContain('role="separator"');
		expect(splitterSource).not.toContain("FontAwesomeIcon");
		expect(pageSource).not.toContain("faGripLinesVertical");
		expect(pageSource).toMatch(
			/\.ide-grid\s*{[\s\S]*--code-ide-splitter-width: 0\.55rem;/
		);
		expect(pageSource).toMatch(
			/\.ide-splitter\s*{[\s\S]*border: 0;[\s\S]*background: transparent;/
		);
		expect(pageSource).toMatch(
			/\.ide-splitter::before\s*{[\s\S]*width: 2px;[\s\S]*height: 100%;/
		);
		expect(pageSource).not.toContain(".ide-splitter svg");
		expect(pageSource).toMatch(
			/\.ide-grid\.is-resizing \.ide-splitter\s*{[\s\S]*box-shadow: none;/
		);
	});

	it("keeps IDE settings copy readable and spacious instead of all-caps", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");

		expect(pageSource).toMatch(
			/\.ide-settings-panel\s*{[\s\S]*position: absolute;[\s\S]*z-index: 18;[\s\S]*top: calc\(100% \+ 0\.6rem\);[\s\S]*right: 0;[\s\S]*width: min\(26rem, calc\(100vw - 2rem\)\);[\s\S]*max-height: min\(36rem, calc\(100vh - 8rem\)\);[\s\S]*display: grid;[\s\S]*gap: 0\.45rem;[\s\S]*padding: 0\.8rem;[\s\S]*background: #fff;[\s\S]*font-family: var\(--font-sans\);[\s\S]*font-size: 0\.84rem;[\s\S]*line-height: 1\.42;[\s\S]*font-variant: normal;[\s\S]*font-weight: 400;[\s\S]*text-align: left;[\s\S]*text-transform: none;[\s\S]*letter-spacing: normal;[\s\S]*overflow-wrap: normal;[\s\S]*word-break: normal;/
		);
		expect(pageSource).toMatch(
			/\.editor-actions\s*{\s*position: relative;/
		);
		const narrowScreenStyles =
			pageSource
				.split("@media (max-width: 820px) {")[1]
				?.split("@media")[0] ?? "";
		expect(narrowScreenStyles).toMatch(
			/\.ide-settings\s*{\s*position: static;\s*}/
		);
		expect(narrowScreenStyles).toMatch(
			/\.ide-settings-panel\s*{\s*right: auto;\s*left: 0;\s*width: min\(26rem, 100%\);\s*}/
		);
		expect(pageSource).toContain(
			'ref="ideSettingsRef" class="ide-settings"'
		);
		expect(pageSource).toContain(
			"const ideSettingsRef = ref<HTMLDivElement | null>(null);"
		);
		expect(pageSource).toContain(
			"function handleIdeSettingsOutsidePointerDown"
		);
		expect(pageSource).toContain(
			'@click="showIdeSettings = !showIdeSettings"'
		);
		expect(pageSource).toContain(
			'document.addEventListener(\n\t\t"pointerdown",\n\t\thandleIdeSettingsOutsidePointerDown\n\t);'
		);
		expect(pageSource).toContain(
			'document.removeEventListener(\n\t\t"pointerdown",\n\t\thandleIdeSettingsOutsidePointerDown\n\t);'
		);
		expect(pageSource).toContain("Autosave");
		expect(pageSource).toContain("Suggestions");
		expect(pageSource).toContain("Line wrap");
		expect(pageSource).toContain("Save locally and sync when possible.");
		expect(pageSource).toContain("Show code suggestions while typing.");
		expect(pageSource).toContain("Wrap long lines in the editor.");
		expect(pageSource).not.toContain("Autosave Projects");
		expect(pageSource).not.toContain("Recommendations as You Type");
		expect(pageSource).not.toContain("Wrap Editor Text");
		expect(pageSource).not.toContain("Save edits locally right away");
		expect(pageSource).not.toContain(
			"Turn this off to use Ctrl+Space only"
		);
		expect(pageSource).toContain(".editor-toolbar > span");
		expect(pageSource).not.toContain(
			".editor-toolbar span,\n.stdin-panel span"
		);
		expect(pageSource).toContain(
			"html.dark .ide-settings-panel {\n\tbackground: #08111f;"
		);
		expect(pageSource).toMatch(
			/\.ide-settings-panel,\s*\.ide-settings-panel :where\(\*\)\s*{[\s\S]*color: inherit;[\s\S]*font-family: var\(--font-sans\);[\s\S]*font-variant: normal;[\s\S]*letter-spacing: normal !important;[\s\S]*text-transform: none !important;[\s\S]*overflow-wrap: normal;[\s\S]*word-break: normal;/
		);
		expect(pageSource).toMatch(
			/\.ide-settings-panel :is\(label, span, small, button\),\s*\.ide-settings-panel \.ide-setting-copy,\s*\.ide-settings-panel \.ide-setting-title,\s*\.ide-settings-panel \.ide-setting-description\s*{[\s\S]*font-variant: normal;[\s\S]*letter-spacing: normal !important;[\s\S]*text-transform: none !important;/
		);
		expect(pageSource).toMatch(
			/\.ide-setting-toggle\s*{[\s\S]*grid-template-columns: 1rem minmax\(0, 1fr\);[\s\S]*column-gap: 0\.65rem;[\s\S]*row-gap: 0\.16rem;[\s\S]*align-items: start;[\s\S]*padding: 0\.62rem 0\.7rem;[\s\S]*font-size: 0\.84rem;[\s\S]*font-weight: 400;/
		);
		expect(pageSource).toMatch(
			/\.ide-setting-toggle \+ \.ide-setting-toggle\s*{[\s\S]*margin-top: 0\.15rem;[\s\S]*border-top: 1px solid var\(--color-border\);/
		);
		expect(pageSource).toMatch(
			/\.ide-setting-toggle input\[type="checkbox"\]\s*{[\s\S]*width: 1rem;[\s\S]*height: 1rem;[\s\S]*transform: none;/
		);
		expect(pageSource).toMatch(
			/\.ide-settings-panel \.ide-setting-title\s*{[\s\S]*font-size: 0\.86rem;[\s\S]*font-weight: 550;[\s\S]*letter-spacing: normal !important;[\s\S]*line-height: 1\.28;[\s\S]*font-variant: normal;[\s\S]*text-transform: none !important;/
		);
		expect(pageSource).toMatch(
			/\.ide-settings-panel \.ide-setting-description\s*{[\s\S]*font-size: 0\.76rem;[\s\S]*font-weight: 400;[\s\S]*letter-spacing: normal !important;[\s\S]*line-height: 1\.36;[\s\S]*font-variant: normal;[\s\S]*text-transform: none !important;/
		);
	});

	it("offers course-runtime completions by immutable project mode", () => {
		const pageSource = sourceFile("../src/components/CodeIdeWorkspace.vue");
		const toolbarSource =
			pageSource.match(
				/class="editor-toolbar"[\s\S]*?<div class="ide-grid">/
			)?.[0] ?? "";
		const pickerSource = sourceFile(
			"../src/components/IdeStarterPicker.vue"
		);
		expect(toolbarSource).not.toContain("<select");
		expect(toolbarSource).not.toContain("selectedProject.mode");
		expect(pageSource).toContain("<IdeStarterPicker");
		expect(pageSource).toContain(
			"createProjectFromMenu($event.mode, $event.template)"
		);
		for (const mode of [
			"python",
			"data",
			"turtle",
			"pgzero",
			"java",
			"karel"
		]) {
			expect(pickerSource).toContain(`value="${mode}"`);
		}

		expect(pageSource).not.toContain(
			"selectedProject.value.mode = newWorkspacePresetID.value"
		);

		expect(
			pythonIdeCompletionsForMode("pgzero").map(option => option.label)
		).toEqual(
			expect.arrayContaining([
				"Actor",
				"Animation",
				"HEIGHT",
				"WIDTH",
				"animate",
				"keys",
				"keyboard",
				"on_key_up",
				"on_mouse_move",
				"pgzrun",
				"screen",
				"tone"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "screen.draw").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"circle",
				"filled_circle",
				"filled_rect",
				"line",
				"text"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "player").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"anchor",
				"angle_to",
				"bottomright",
				"clipline",
				"collideobjects",
				"colliderect",
				"distance_to",
				"draw",
				"pos",
				"topleft"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "rect").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"clamp",
				"clip",
				"clipline",
				"collidelist",
				"collideobjects",
				"fit",
				"normalize",
				"scale_by",
				"unionall"
			])
		);
		expect(
			pythonIdeCompletionsForMode("turtle", "screen").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["bgcolor", "onkey", "ontimer"]));
		expect(
			pythonIdeCompletionsForMode("turtle", "t").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"hideturtle",
				"isvisible",
				"shape",
				"showturtle"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "clock").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"schedule",
				"schedule_interval",
				"schedule_unique",
				"unschedule"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "keys").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"B",
				"F12",
				"K_1",
				"KP_ENTER",
				"LEFT",
				"LSHIFT",
				"SPACE",
				"UP",
				"Z"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "keymods").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["ALT", "CTRL", "SHIFT"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "mouse").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["LEFT", "WHEEL_DOWN", "WHEEL_UP"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "screen").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["bounds", "fill"]));
		expect(
			pythonIdeCompletionsForMode("pgzero", "music").map(
				option => option.label
			)
		).toEqual(
			expect.arrayContaining([
				"fadeout",
				"get_volume",
				"is_playing",
				"pause",
				"play",
				"play_once",
				"queue",
				"set_volume",
				"stop",
				"unpause"
			])
		);
		expect(
			pythonIdeCompletionsForMode("pgzero", "tone").map(
				option => option.label
			)
		).toEqual(expect.arrayContaining(["create", "play"]));
		expect(
			pythonIdeCompletionsForMode("data").map(option => option.label)
		).toEqual(
			expect.arrayContaining([
				"DecisionTreeClassifier",
				"pd",
				"plt",
				"st"
			])
		);
	});

	it("offers CodeMirror snippets for course-specific Python patterns", () => {
		const pythonCompletions = pythonIdeCompletionsForMode("python");
		const pgzeroCompletions = pythonIdeCompletionsForMode("pgzero");
		const turtleCompletions = pythonIdeCompletionsForMode("turtle");
		const dataCompletions = pythonIdeCompletionsForMode("data");
		const findSnippet = (label: string, completions = pythonCompletions) =>
			completions.find(
				option => option.label === label && option.type === "snippet"
			);

		expect(pythonCompletions.map(option => option.label)).toEqual(
			expect.arrayContaining(["main_guard"])
		);
		expect(findSnippet("main_guard")).toMatchObject({
			detail: "main function guard",
			section: "Snippets"
		});
		expect(typeof findSnippet("main_guard")?.apply).toBe("function");
		expect(findSnippet("if")).toBeUndefined();
		expect(findSnippet("for")).toBeUndefined();
		expect(findSnippet("draw", pgzeroCompletions)).toMatchObject({
			detail: "PyGame Zero draw callback"
		});
		expect(
			pgzeroCompletions.filter(option => option.label === "draw")
		).toHaveLength(1);
		expect(
			pgzeroCompletions.filter(option => option.label === "update")
		).toHaveLength(1);
		expect(turtleCompletions.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"onkey_handler",
				"ontimer_loop",
				"turtle_screen"
			])
		);
		expect(dataCompletions.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"data_setup",
				"decision_tree",
				"read_csv_df",
				"scatter_plot"
			])
		);
	});

	it("completes member names after a runtime receiver dot", () => {
		const doc = "screen.dr";
		const state = EditorState.create({ doc });
		const result = pythonIdeCompletionSource("pgzero")({
			explicit: false,
			pos: doc.length,
			state,
			matchBefore: expression =>
				completionMatchBefore(doc, doc.length, expression)
		});

		expect(result).not.toBeNull();
		expect(result?.from).toBe("screen.".length);
		expect(result?.options.map(option => option.label)).toEqual(
			expect.arrayContaining(["draw"])
		);
	});

	it("offers PyGame Zero asset completions for project and course assets", async () => {
		const assetCompletions = {
			images: ["student", "space-ship"],
			music: ["theme"],
			sounds: ["eep"]
		};
		const imageMemberLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"images",
			assetCompletions
		).map(option => option.label);
		const actorDoc = 'player = Actor("space';
		const actorState = EditorState.create({ doc: actorDoc });
		const actorCompletionSource = pythonIdeCompletionSource(
			"pgzero",
			() => assetCompletions
		);
		const actorResult = await actorCompletionSource({
			explicit: false,
			pos: actorDoc.length,
			state: actorState,
			matchBefore: expression =>
				completionMatchBefore(actorDoc, actorDoc.length, expression)
		});
		const musicDoc = 'music.play("th';
		const musicState = EditorState.create({ doc: musicDoc });
		const musicCompletionSource = pythonIdeCompletionSource(
			"pgzero",
			() => assetCompletions
		);
		const musicResult = await musicCompletionSource({
			explicit: false,
			pos: musicDoc.length,
			state: musicState,
			matchBefore: expression =>
				completionMatchBefore(musicDoc, musicDoc.length, expression)
		});
		const playOnceDoc = 'music.play_once("th';
		const playOnceResult = await musicCompletionSource({
			explicit: false,
			pos: playOnceDoc.length,
			state: EditorState.create({ doc: playOnceDoc }),
			matchBefore: expression =>
				completionMatchBefore(
					playOnceDoc,
					playOnceDoc.length,
					expression
				)
		});
		const queueDoc = 'music.queue("th';
		const queueResult = await musicCompletionSource({
			explicit: false,
			pos: queueDoc.length,
			state: EditorState.create({ doc: queueDoc }),
			matchBefore: expression =>
				completionMatchBefore(queueDoc, queueDoc.length, expression)
		});
		const imageSurfaceLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"images.student",
			assetCompletions
		).map(option => option.label);
		const soundMemberLabels = pythonIdeCompletionsForMode(
			"pgzero",
			"sounds.eep",
			assetCompletions
		).map(option => option.label);

		expect(imageMemberLabels).toContain("student");
		expect(imageMemberLabels).not.toContain("space-ship");
		expect(actorResult?.from).toBe('player = Actor("'.length);
		expect(actorResult?.options.map(option => option.label)).toEqual(
			expect.arrayContaining(["space-ship", "student"])
		);
		expect(musicResult?.from).toBe('music.play("'.length);
		expect(musicResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(playOnceResult?.from).toBe('music.play_once("'.length);
		expect(playOnceResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(queueResult?.from).toBe('music.queue("'.length);
		expect(queueResult?.options.map(option => option.label)).toContain(
			"theme"
		);
		expect(imageSurfaceLabels).toEqual(
			expect.arrayContaining([
				"get_height",
				"get_rect",
				"get_size",
				"get_width"
			])
		);
		expect(soundMemberLabels).toEqual(
			expect.arrayContaining(["get_length", "play", "stop"])
		);
	});

	it("loads asset completions lazily for PyGame asset contexts", async () => {
		const assetCompletions = vi.fn(async () => ({
			images: ["alien"],
			sounds: ["eep"]
		}));
		const memberDoc = "screen.dr";
		const memberResult = pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: memberDoc.length,
			state: EditorState.create({ doc: memberDoc }),
			matchBefore: expression =>
				completionMatchBefore(memberDoc, memberDoc.length, expression)
		});

		expect(memberResult?.options.map(option => option.label)).toContain(
			"draw"
		);
		expect(assetCompletions).not.toHaveBeenCalled();

		const actorDoc = 'ship = Actor("al';
		const actorResult = await pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: actorDoc.length,
			state: EditorState.create({ doc: actorDoc }),
			matchBefore: expression =>
				completionMatchBefore(actorDoc, actorDoc.length, expression)
		});

		expect(assetCompletions).toHaveBeenCalledTimes(1);
		expect(actorResult?.options.map(option => option.label)).toContain(
			"alien"
		);

		const imageDoc = "images.al";
		const imageResult = await pythonIdeCompletionSource(
			"pgzero",
			assetCompletions
		)({
			explicit: false,
			pos: imageDoc.length,
			state: EditorState.create({ doc: imageDoc }),
			matchBefore: expression =>
				completionMatchBefore(imageDoc, imageDoc.length, expression)
		});

		expect(assetCompletions).toHaveBeenCalledTimes(2);
		expect(imageResult?.options.map(option => option.label)).toContain(
			"alien"
		);
	});

	it("offers original Turtle shape completions inside shape calls", () => {
		const doc = 't.shape("cl';
		const state = EditorState.create({ doc });
		const result = pythonIdeCompletionSource("turtle")({
			explicit: false,
			pos: doc.length,
			state,
			matchBefore: expression =>
				completionMatchBefore(doc, doc.length, expression)
		});

		expect(result?.from).toBe('t.shape("'.length);
		expect(result?.options.map(option => option.label)).toEqual(
			expect.arrayContaining([
				"arrow",
				"blank",
				"circle",
				"classic",
				"fancy",
				"square",
				"triangle",
				"turtle"
			])
		);
	});

	it("offers Trinket Turtle color completions inside background and object color calls", () => {
		const cases = [
			{
				doc: 'screen.bgcolor("light s',
				from: 'screen.bgcolor("'.length,
				labels: ["light sky blue", "light slate gray"]
			},
			{
				doc: 't.color("rebecca p',
				from: 't.color("'.length,
				labels: ["rebecca purple"]
			},
			{
				doc: 't.color("red", "deep s',
				from: 't.color("red", "'.length,
				labels: ["deep sky blue"]
			},
			{
				doc: 't.fillcolor("medium s',
				from: 't.fillcolor("'.length,
				labels: [
					"medium sea green",
					"medium slate blue",
					"medium spring green"
				]
			},
			{
				doc: 't.dot(24, "dark o',
				from: 't.dot(24, "'.length,
				labels: ["dark olive green", "dark orange"]
			},
			{
				doc: 't.dot(abs(24), "dark o',
				from: 't.dot(abs(24), "'.length,
				labels: ["dark olive green", "dark orange"]
			}
		];

		for (const { doc, from, labels } of cases) {
			const state = EditorState.create({ doc });
			const result = pythonIdeCompletionSource("turtle")({
				explicit: false,
				pos: doc.length,
				state,
				matchBefore: expression =>
					completionMatchBefore(doc, doc.length, expression)
			});

			expect(result?.from).toBe(from);
			expect(result?.options.map(option => option.label)).toEqual(
				expect.arrayContaining(labels)
			);
			expect(result?.validFor.test(doc.slice(from))).toBe(true);
		}
	});

	it("bounds completion work on adversarially long editor lines", () => {
		const longPrefix = '"x",'.repeat(4000);
		const turtleDoc = `${longPrefix}t.color("red", "`;
		const turtleState = EditorState.create({ doc: turtleDoc });
		expect(
			pythonIdeCompletionSource("turtle")({
				explicit: true,
				pos: turtleDoc.length,
				state: turtleState,
				matchBefore: expression =>
					completionMatchBefore(
						turtleDoc,
						turtleDoc.length,
						expression
					)
			})
		).toBeNull();
		expect(
			autocompleteLabelsForDoc("karel", `${longPrefix}paintCorner("`)
		).not.toContain("purple");
		expect(
			autocompleteLabelsForDoc("java", `${longPrefix}names.`)
		).not.toContain("put");
	});

	it("keeps Java type-aware completions in large projects", () => {
		const doc = [
			"ArrayList<String> names = new ArrayList<>();",
			"//" + "a".repeat(9000),
			"names."
		].join("\n");
		const labels = autocompleteLabelsForDoc("java", doc);
		expect(labels).toContain("add");
		expect(labels).not.toContain("put");
	});

	it("handles near-limit adversarial Java declarations without backtracking", () => {
		const doc = `Foo ${" ".repeat(3000)}<${" ".repeat(10)}\nitem.`;
		const labels = autocompleteLabelsForDoc("java", doc);
		expect(labels).toContain("equals");
	});

	it("bounds custom bracket-pair colorization to the visible editor range", () => {
		const editorSource = sourceFile("../src/modules/pythonCodeMirror.ts");

		expect(editorSource).toContain("view.visibleRanges");
		expect(editorSource).toContain("bracketPairContextScanLimit");
		expect(editorSource).toContain(
			"state.doc.sliceString(scanStart, visibleEnd)"
		);
		expect(editorSource).toContain(
			"state.doc.sliceString(visibleEnd, scanEnd)"
		);
	});

	it("ignores Python string and comment brackets in custom pair coloring", () => {
		const doc = [
			'message = "not (code)"',
			"# ignore [comment brackets]",
			"items = [value]"
		].join("\n");
		const state = EditorState.create({
			doc,
			extensions: [python()]
		});

		expect(isPythonBracketPairIgnoredAt(state, doc.indexOf("("))).toBe(
			true
		);
		expect(isPythonBracketPairIgnoredAt(state, doc.indexOf(")"))).toBe(
			true
		);
		expect(isPythonBracketPairIgnoredAt(state, doc.indexOf("["))).toBe(
			true
		);
		expect(isPythonBracketPairIgnoredAt(state, doc.lastIndexOf("["))).toBe(
			false
		);
		expect(isPythonBracketPairIgnoredAt(state, doc.lastIndexOf("]"))).toBe(
			false
		);
	});

	it("skips existing auto-inserted closing tokens instead of duplicating them", () => {
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "print()",
					selection: { anchor: "print(".length }
				}),
				")"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "items[0]",
					selection: { anchor: "items[0".length }
				}),
				"]"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "data = {name}",
					selection: { anchor: "data = {name".length }
				}),
				"}"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: '"hello"',
					selection: { anchor: '"hello'.length }
				}),
				'"'
			)
		).toBe(true);
	});

	it("only skips closers when every cursor is directly before the matching token", () => {
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "print(",
					selection: { anchor: "print(".length }
				}),
				")"
			)
		).toBe(false);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "name",
					selection: { anchor: 0, head: 4 }
				}),
				'"'
			)
		).toBe(false);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "() ()",
					extensions: [EditorState.allowMultipleSelections.of(true)],
					selection: EditorSelection.create([
						EditorSelection.cursor(1),
						EditorSelection.cursor(4)
					])
				}),
				")"
			)
		).toBe(true);
		expect(
			canSkipExistingClosingToken(
				EditorState.create({
					doc: "() []",
					extensions: [EditorState.allowMultipleSelections.of(true)],
					selection: EditorSelection.create([
						EditorSelection.cursor(1),
						EditorSelection.cursor(4)
					])
				}),
				")"
			)
		).toBe(false);
	});

	it("indents one extra Python level after a colon", () => {
		const state = EditorState.create({
			doc: [
				"if ready:",
				"    for item in items:",
				"        print(item)"
			].join("\n")
		});

		expect(pythonNewlineIndentText(state, "if ready:".length)).toBe(
			"\n    "
		);
		expect(
			pythonNewlineIndentText(
				state,
				"if ready:\n    for item in items:".length
			)
		).toBe("\n        ");
		expect(
			pythonNewlineIndentText(
				state,
				"if ready:\n    for item in items:\n        print(item)".length
			)
		).toBe("\n        ");
	});

	it("surfaces parser-backed Python syntax diagnostics before run", () => {
		const validState = EditorState.create({
			doc: ["def move():", "    return 1"].join("\n"),
			extensions: [python()]
		});
		const invalidState = EditorState.create({
			doc: ["def move()", "    return 1"].join("\n"),
			extensions: [python()]
		});

		expect(pythonSyntaxDiagnostics(validState)).toEqual([]);
		const diagnostics = pythonSyntaxDiagnostics(invalidState);

		expect(diagnostics.length).toBeGreaterThan(0);
		expect(diagnostics[0]).toMatchObject({
			severity: "error",
			message:
				"Python syntax error. Check this line before running the project."
		});
		expect(diagnostics[0]?.to).toBeGreaterThanOrEqual(
			diagnostics[0]?.from ?? 0
		);
	});

	it("surfaces parser-backed Java syntax diagnostics before run", () => {
		const validState = EditorState.create({
			doc: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("ok");\n    }\n}\n',
			extensions: createPythonCodeMirrorExtensions({
				mode: "java",
				onChange: vi.fn(),
				onCursorCountChange: vi.fn()
			})
		});
		const invalidState = EditorState.create({
			doc: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("missing brace");\n    \n',
			extensions: createPythonCodeMirrorExtensions({
				mode: "java",
				onChange: vi.fn(),
				onCursorCountChange: vi.fn()
			})
		});

		expect(javaSyntaxDiagnostics(validState)).toEqual([]);
		const diagnostics = javaSyntaxDiagnostics(invalidState);

		expect(diagnostics.length).toBeGreaterThan(0);
		expect(diagnostics[0]).toMatchObject({
			severity: "error",
			message:
				"Java syntax error. Check this line before running the project."
		});
		expect(diagnostics[0]?.to).toBeGreaterThanOrEqual(
			diagnostics[0]?.from ?? 0
		);
	});

	it("does not parse project notes as Java source", () => {
		const options = {
			mode: "java" as const,
			onChange: vi.fn(),
			onCursorCountChange: vi.fn()
		};
		const note = EditorState.create({
			doc: "Project notes: this is not Java source.",
			extensions: createPythonCodeMirrorExtensions({
				...options,
				fileName: "README.md"
			})
		});
		const source = EditorState.create({
			doc: "class Main {}",
			extensions: createPythonCodeMirrorExtensions({
				...options,
				fileName: "Main.java"
			})
		});

		expect(note.languageDataAt("autocomplete", 0)).toEqual([]);
		expect(source.languageDataAt("autocomplete", 0)).not.toEqual([]);
	});

	it("maps runtime traceback lines to editor diagnostics", () => {
		const state = EditorState.create({
			doc: ["total = 1", "print(total / 0)", "print('done')"].join("\n"),
			extensions: [python()]
		});

		const diagnostic = pythonRuntimeDiagnosticForLine(
			state,
			2,
			"ZeroDivisionError: division by zero"
		);

		expect(diagnostic).toMatchObject({
			from: state.doc.line(2).from,
			to: state.doc.line(2).to,
			severity: "error",
			source: "Python runtime",
			message: "ZeroDivisionError: division by zero"
		});
		expect(
			pythonRuntimeDiagnosticForLine(state, 0, "Invalid line")
		).toBeNull();
		const emptyState = EditorState.create({ doc: "" });
		const emptyDiagnostic = pythonRuntimeDiagnosticForLine(
			emptyState,
			1,
			"Empty file"
		);
		expect(emptyDiagnostic).toMatchObject({ from: 0, to: 0 });
		if (emptyDiagnostic) {
			expect(() =>
				emptyState.update({
					selection: {
						anchor: emptyDiagnostic.from,
						head: emptyDiagnostic.to
					}
				})
			).not.toThrow();
		}
	});
});
