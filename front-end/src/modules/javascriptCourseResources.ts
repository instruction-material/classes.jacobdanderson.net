import type { PythonIdeFile } from "@/modules/pythonIde";
import { javascriptAdvancedConditionalsResources } from "@/modules/javascriptAdvancedConditionalsResources";
import { javascriptAnimationResources } from "@/modules/javascriptAnimationResources";
import { javascriptBasicLayoutResources } from "@/modules/javascriptBasicLayoutResources";
import { javascriptCombiningResources } from "@/modules/javascriptCombiningResources";
import { javascriptConditionalsResources } from "@/modules/javascriptConditionalsResources";
import { javascriptDrawingResources } from "@/modules/javascriptDrawingResources";
import { javascriptFirstModuleResources } from "@/modules/javascriptFirstModuleResources";
import { javascriptHtmlCssResources } from "@/modules/javascriptHtmlCssResources";
import { javascriptLoopsResources } from "@/modules/javascriptLoopsResources";
import { javascriptMoreHtmlCssResources } from "@/modules/javascriptMoreHtmlCssResources";
import { javascriptNestedLoopsResources } from "@/modules/javascriptNestedLoopsResources";
import { javascriptOperatorsResources } from "@/modules/javascriptOperatorsResources";

const courseId = "javascript-level-1-javascript-superstar";
const base = "/course-assets/javascript-level-1/";
interface CourseRole {
	project: string;
	title: string;
	version: number;
	role: "starter" | "reference";
	urls: readonly string[];
	files: readonly {
		name: string;
		path: string;
		byteLength: number;
		sha256: string;
	}[];
}

const roles: readonly CourseRole[] = [
	...javascriptFirstModuleResources,
	...javascriptOperatorsResources,
	...javascriptLoopsResources,
	...javascriptCombiningResources,
	...javascriptConditionalsResources,
	...javascriptAdvancedConditionalsResources,
	...javascriptDrawingResources,
	...javascriptNestedLoopsResources,
	...javascriptHtmlCssResources,
	...javascriptAnimationResources,
	...javascriptMoreHtmlCssResources,
	...javascriptBasicLayoutResources
];

export function javascriptCourseResource(value: string) {
	if (value.startsWith("/course-assets/javascript-level-1/")) {
		const selected = roles.find(role => role.urls.includes(value));
		return selected ? { ...selected, courseId } : null;
	}
	let url: URL;
	try {
		url = new URL(value);
	} catch {
		return null;
	}
	if (!url.href.startsWith("https://codepen.io/")) return null;
	const canonical = url.origin + url.pathname.replace(/\/$/, "");
	const selected = roles.find(role => role.urls.includes(canonical));
	return selected
		? {
				...selected,
				courseId
			}
		: null;
}

export function javascriptCourseProjectKey(
	selectedCourse: string,
	itemId: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = javascriptCourseResource(url);
	if (
		!selected ||
		selected.courseId !== selectedCourse ||
		selected.role !== role
	) {
		throw new Error("This source does not match the selected course role.");
	}
	return `${selectedCourse}:${itemId}:${role}:${selected.project}:v${selected.version}`;
}

async function readBytes(response: Response, byteLength: number) {
	if (!response.ok || !response.body)
		throw new Error("A required project file could not be loaded.");
	const bytes = new Uint8Array(byteLength);
	const reader = response.body.getReader();
	let offset = 0;
	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (offset + value.length > byteLength)
				throw new Error("A required project file is too large.");
			bytes.set(value, offset);
			offset += value.length;
		}
	} finally {
		await reader.cancel().catch(() => {});
		reader.releaseLock();
	}
	if (offset !== byteLength)
		throw new Error("The project download is incomplete.");
	return bytes.buffer;
}

export async function loadJavaScriptCourseFiles(
	url: string
): Promise<PythonIdeFile[] | null> {
	const selected = javascriptCourseResource(url);
	if (!selected) return null;
	if (!globalThis.crypto?.subtle)
		throw new Error("Open this page over HTTPS to import the project.");
	const files: PythonIdeFile[] = [];
	for (const file of selected.files) {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 15000);
		try {
			const response = await fetch(base + file.path, {
				credentials: "omit",
				redirect: "error",
				signal: controller.signal
			});
			const bytes = await readBytes(response, file.byteLength);
			const digest = new Uint8Array(
				await crypto.subtle.digest("SHA-256", bytes)
			);
			let sha256 = "";
			for (const byte of digest)
				sha256 += byte.toString(16).padStart(2, "0");
			if (sha256 !== file.sha256) {
				throw new Error(
					"A required project file does not match the selected version."
				);
			}
			files.push({
				name: file.name,
				content: new TextDecoder("utf-8", { fatal: true }).decode(
					bytes
				),
				encoding: "text"
			});
		} finally {
			clearTimeout(timeout);
		}
	}
	return files;
}
