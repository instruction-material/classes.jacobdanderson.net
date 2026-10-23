import type { PythonIdeFile } from "@/modules/pythonIde";

const PYTHON_EXTENSION_RE = /\.py$/i;
const FROM_IMPORT_MODULE_RE =
	/^from\s+([A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*)\s+import\b/;
const PYTHON_IDENTIFIER_RE = /^[A-Z_]\w*$/i;
const PYTHON_IMPORT_KEYWORD = "import";
const PYTHON_MODULE_PREFIX_RE = /^[A-Z_]\w*/i;
const PYTHON_TRIPLE_QUOTE_DELIMITERS = ['"""', "'''"] as const;
const IMPORT_STATEMENT_CHUNK_LENGTH = 4096;
type PythonStringDelimiter = "'" | '"' | "'''" | '"""';

function isPythonFileName(value: string) {
	return PYTHON_EXTENSION_RE.test(value);
}

function importedTopLevelModulesFromLine(line: string) {
	const trimmed = line.trim();
	const fromMatch = trimmed.match(FROM_IMPORT_MODULE_RE);
	if (fromMatch) {
		return [fromMatch[1].split(".")[0]].filter(moduleName =>
			PYTHON_IDENTIFIER_RE.test(moduleName)
		);
	}

	if (!trimmed.startsWith(PYTHON_IMPORT_KEYWORD)) return [];
	const importWhitespace = trimmed.charAt(PYTHON_IMPORT_KEYWORD.length);
	if (importWhitespace !== " " && importWhitespace !== "\t") return [];

	return trimmed
		.slice(PYTHON_IMPORT_KEYWORD.length)
		.split(",")
		.map(specifier => {
			const trimmedSpecifier = specifier.trimStart();
			const moduleName = trimmedSpecifier.match(
				PYTHON_MODULE_PREFIX_RE
			)?.[0];
			if (!moduleName) return undefined;
			const nextCharacter = trimmedSpecifier[moduleName.length];
			return !nextCharacter ||
				nextCharacter === "." ||
				/\s/.test(nextCharacter)
				? moduleName
				: undefined;
		})
		.filter((moduleName): moduleName is string => Boolean(moduleName));
}

export function pythonIdeImportedTopLevelModules(files: PythonIdeFile[]) {
	const modules = new Set<string>();
	for (const file of files) {
		if (!isPythonFileName(file.name)) continue;
		let delimiter: PythonStringDelimiter | null = null;
		let statementChunk = "";
		const statementChunks: string[] = [];
		const finishStatement = () => {
			const statement = statementChunks.length
				? statementChunks.join("") + statementChunk
				: statementChunk;
			for (const moduleName of importedTopLevelModulesFromLine(statement))
				modules.add(moduleName);
			statementChunk = "";
			statementChunks.length = 0;
		};
		const append = (character: string) => {
			statementChunk += character;
			if (statementChunk.length === IMPORT_STATEMENT_CHUNK_LENGTH) {
				statementChunks.push(statementChunk);
				statementChunk = "";
			}
		};

		for (let index = 0; index < file.content.length; index++) {
			const character = file.content[index];
			const nextCharacter = file.content[index + 1];
			const newline = character === "\n" || character === "\r";
			if (delimiter) {
				if (character === "\\") {
					index +=
						nextCharacter === "\r" &&
						file.content[index + 2] === "\n"
							? 2
							: 1;
					continue;
				}
				if (file.content.startsWith(delimiter, index)) {
					index += delimiter.length - 1;
					delimiter = null;
					continue;
				}
				if (newline) {
					finishStatement();
					if (character === "\r" && nextCharacter === "\n") index++;
				}
				continue;
			}
			if (character === "#") {
				while (
					index < file.content.length &&
					file.content[index] !== "\n" &&
					file.content[index] !== "\r"
				) {
					index++;
				}
				if (
					file.content[index] === "\r" &&
					file.content[index + 1] === "\n"
				) {
					index++;
				}
				finishStatement();
				continue;
			}
			if (character === "'" || character === '"') {
				const triple = PYTHON_TRIPLE_QUOTE_DELIMITERS.find(value =>
					file.content.startsWith(value, index)
				);
				delimiter = triple ?? character;
				index += delimiter.length - 1;
				append(" ");
				continue;
			}
			if (
				character === "\\" &&
				(nextCharacter === "\n" || nextCharacter === "\r")
			) {
				index +=
					nextCharacter === "\r" && file.content[index + 2] === "\n"
						? 2
						: 1;
				append(" ");
				continue;
			}
			if (character === ";" || character === ":" || newline) {
				finishStatement();
				if (character === "\r" && nextCharacter === "\n") index++;
				continue;
			}
			append(character);
		}
		finishStatement();
	}
	return modules;
}
