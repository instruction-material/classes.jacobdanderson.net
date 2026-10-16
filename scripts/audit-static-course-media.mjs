#!/usr/bin/env node

import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const auditSource = String.raw`
import {
	existsSync,
	readFileSync,
	readdirSync,
	statSync
} from "node:fs";
import {
	extname,
	join,
	relative
} from "node:path";
import {
	courseCatalog,
	loadRawCourse
} from "../src/stores/courses/index";
import {
	KNOWN_PENDING_STATIC_MEDIA_FILENAMES,
	canonicalStaticMediaUrl,
	hasPendingStaticMediaNotice,
	staticMediaFilename,
	staticMediaUrlsFromText
} from "../src/stores/courses/staticMedia";
import { fetchStaticMediaWithRetry } from "../../scripts/static-media-fetch.mjs";

const knownPending = new Set(KNOWN_PENDING_STATIC_MEDIA_FILENAMES);
const urls = new Map();
const scanRoots = [
	"back-end/.env.EXAMPLE",
	"back-end/src",
	"front-end/public",
	"front-end/src",
	"package.json"
];
const ignoredPathParts = new Set([
	"__snapshots__",
	"coverage",
	"dist",
	"node_modules",
	"playwright-report",
	"test-results"
]);
const textFileExtensions = new Set([
	".css",
	".env",
	".example",
	".html",
	".js",
	".json",
	".md",
	".mjs",
	".ts",
	".tsx",
	".vue"
]);
const staticAssetPathPattern =
	/\.(?:avif|csv|gif|jpe?g|json|md|mov|mp4|pdf|png|svg|webm|zip)(?:[?#].*)?$/i;
function add(url, reference) {
	if (!url) return;
	const canonicalUrl = canonicalStaticMediaUrl(url);
	if (!canonicalUrl) return;
	const references = urls.get(canonicalUrl) ?? [];
	references.push({
		...reference,
		...(canonicalUrl !== url ? { originalUrl: url } : {})
	});
	urls.set(canonicalUrl, references);
}

function isScannableStaticAssetUrl(url) {
	try {
		return staticAssetPathPattern.test(new URL(url).pathname);
	} catch {
		return false;
	}
}

function shouldSkipPath(path) {
	return path
		.split("/")
		.some(part => ignoredPathParts.has(part)) ||
		/\.(?:spec|test)\.[cm]?[jt]sx?$/.test(path);
}

function isTextFile(path) {
	return textFileExtensions.has(extname(path).toLowerCase());
}

function scanFile(path) {
	if (!isTextFile(path) || shouldSkipPath(path)) return;

	const content = readFileSync(path, "utf8");
	const sourcePath = relative(process.cwd(), path);

	for (const url of staticMediaUrlsFromText(content)) {
		if (!isScannableStaticAssetUrl(url)) continue;

		const line = content.slice(0, content.indexOf(url)).split("\n").length;
		add(url, {
			content,
			key: "source-file",
			source: sourcePath + ":" + line
		});
	}
}

function scanPath(path) {
	if (!existsSync(path) || shouldSkipPath(path)) return;

	const stats = statSync(path);
	if (stats.isDirectory()) {
		for (const entry of readdirSync(path)) {
			scanPath(join(path, entry));
		}
		return;
	}

	if (stats.isFile()) scanFile(path);
}

for (const entry of courseCatalog) {
	const course = await loadRawCourse(entry.id);
	if (!course) continue;

	for (const module of course.modules) {
		const items = [
			...module.curriculum,
			...module.supplementalProjects
		];

		for (const item of items) {
			const source = [entry.id, module.title, item.title].join(" / ");
			add(item.mediaLink, {
				content: item.content,
				key: "mediaLink",
				source
			});
			add(item.datasetLink, {
				content: item.content,
				key: "datasetLink",
				source
			});
			add(item.projectLink, {
				content: item.content,
				key: "projectLink",
				source
			});
			add(item.solutionLink, {
				content: item.content,
				key: "solutionLink",
				source
			});
			for (const url of staticMediaUrlsFromText(item.content)) {
				add(url, {
					content: item.content,
					key: "content",
					source
				});
			}
		}
	}
}

for (const root of scanRoots) {
	scanPath(join(process.cwd(), root));
}

const available = [];
const knownPendingNotChecked = [];
const missing = [];

for (const [url, references] of [...urls].sort(([left], [right]) =>
	left.localeCompare(right)
)) {
	const filename = staticMediaFilename(url);
	const sourceIssues = references.flatMap(reference => {
		if (hasPendingStaticMediaNotice(reference.content, filename)) {
			return [];
		}

		return [
			{
				key: reference.key,
				source: reference.source
			}
		];
	});
	const baseRow = {
		filename,
		isKnownPending: knownPending.has(filename),
		sourceCount: new Set(references.map(reference => reference.source))
			.size,
		sources: [...new Set(references.map(reference => reference.source))],
		url,
		...(sourceIssues.length ? { sourceIssues } : {})
	};

	if (baseRow.isKnownPending && sourceIssues.length === 0) {
		knownPendingNotChecked.push(baseRow);
		continue;
	}

	const { error, ok, status } = await fetchStaticMediaWithRetry(url);

	const row = {
		...baseRow,
		status,
		...(error ? { error } : {})
	};

	if (ok) available.push(row);
	else missing.push(row);
}

function isNetworkIndeterminate(row) {
	return row.status === 0 && Boolean(row.error);
}

const networkIndeterminate = missing.filter(isNetworkIndeterminate);
const confirmedMissing = missing.filter(row => !isNetworkIndeterminate(row));
const knownPendingMissing = confirmedMissing.filter(
	row => row.isKnownPending && !row.sourceIssues?.length
);
const unknownMissing = confirmedMissing.filter(row => !row.isKnownPending);
const unnotedPending = confirmedMissing.filter(
	row => row.isKnownPending && row.sourceIssues?.length
);
const networkIndeterminateUnknown = networkIndeterminate.filter(row => !row.isKnownPending);
const networkIndeterminateKnownPending = networkIndeterminate.filter(
	row => row.isKnownPending
);

function summarizeRows(rows) {
	const maxLoggedRows = 50;

	return {
		count: rows.length,
		rows: rows.slice(0, maxLoggedRows),
		truncatedCount: Math.max(0, rows.length - maxLoggedRows)
	};
}

console.log(
	JSON.stringify(
		{
			availableCount: available.length,
			checkedCount: available.length + missing.length,
			confirmedMissingCount: confirmedMissing.length,
			knownPendingMissing: summarizeRows(knownPendingMissing),
			knownPendingNotChecked: summarizeRows(knownPendingNotChecked),
			missingCount: missing.length,
			networkIndeterminate: summarizeRows(networkIndeterminate),
			networkIndeterminateCount: networkIndeterminate.length,
			referencedCount: urls.size,
			networkIndeterminateKnownPending: summarizeRows(networkIndeterminateKnownPending),
			networkIndeterminateUnknown: summarizeRows(networkIndeterminateUnknown),
			unnotedPending,
			unknownMissing
		},
		null,
		2
	)
);

if (unknownMissing.length > 0 || unnotedPending.length > 0) {
	process.exitCode = 1;
}
`;

const tempDir = await mkdtemp(
	join(process.cwd(), "front-end", ".static-media-audit-")
);
const auditFile = join(tempDir, "audit.ts");

try {
	await writeFile(auditFile, auditSource);
	const child = spawn(
		process.execPath,
		[
			"--import",
			"tsx",
			"--import",
			fileURLToPath(
				new URL("./course-raw-text-loader.mjs", import.meta.url)
			),
			auditFile
		],
		{
			stdio: "inherit",
			env: {
				...process.env,
				TSX_TSCONFIG_PATH: fileURLToPath(
					new URL("../front-end/tsconfig.json", import.meta.url)
				)
			}
		}
	);

	const exitCode = await new Promise((resolve, reject) => {
		child.once("error", reject);
		child.once("exit", code => resolve(code ?? 1));
	});

	process.exitCode = exitCode;
} finally {
	await rm(tempDir, { force: true, recursive: true });
}
