import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";
import { bootcampPrograms } from "./bootcamp-programs.mjs";
import { applyOriginalProgramCorrection } from "./program-corrections.mjs";

const root = new URL("./originals/", import.meta.url);
const catalog = JSON.parse(
	await readFile(new URL("catalog.json", root), "utf8")
);
const provenance = JSON.parse(
	await readFile(new URL("provenance.json", root), "utf8")
);
const integrity = JSON.parse(
	await readFile(new URL("asset-integrity.json", root), "utf8")
);
const compatibility = JSON.parse(
	await readFile(new URL("compatibility.json", root), "utf8")
);
const assets = new Map();
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
export const originalScratchProjects = catalog.projects;

export function originalAttributionId(id) {
	return `classes-original-source-${id}`;
}

async function originalAsset(name) {
	if (!/^[a-f0-9]{32}\.(?:svg|png|wav)$/.test(name) || !integrity[name])
		throw new Error(`Unknown original Scratch asset: ${name}`);
	if (!assets.has(name)) {
		assets.set(
			name,
			readFile(new URL(`assets/${name}`, root)).then(bytes => {
				if (
					bytes.length !== integrity[name].bytes ||
					sha256(bytes) !== integrity[name].sha256 ||
					createHash("md5").update(bytes).digest("hex") !==
						name.split(".")[0]
				) {
					throw new Error(
						`Original Scratch asset identity mismatch: ${name}`
					);
				}
				return bytes;
			})
		);
	}
	return assets.get(name);
}

/** Retain the complete upstream source beside narrowly corrected display assets. */
export async function createOriginalProject(id, bootcampReference = false) {
	const original = originalScratchProjects.find(project => project.id === id);
	if (!original || !/^[1-9]\d{0,11}$/.test(id))
		throw new Error("Unknown original Scratch project");
	const raw = await readFile(new URL(`projects/${id}.json`, root));
	if (sha256(raw) !== original.sourceSHA256)
		throw new Error(`Original Scratch source identity mismatch: ${id}`);
	const project = JSON.parse(raw.toString("utf8"));
	const programCorrection = applyOriginalProgramCorrection(project, original);
	const stage = project.targets.find(target => target.isStage);
	if (!stage || project.targets.filter(target => target.isStage).length !== 1)
		throw new Error(`Invalid original Scratch stage: ${id}`);
	const commentId = originalAttributionId(id);
	if (
		project.targets.some(
			target => target.comments?.[commentId] || target.blocks?.[commentId]
		)
	) {
		throw new Error(
			`Original attribution identifier already exists: ${id}`
		);
	}
	const files = {
		"project.json": new Uint8Array(),
		"SOURCE/original.json": raw
	};
	const compatibilityChanges = new Map();
	for (const target of project.targets) {
		for (const asset of [...target.costumes, ...target.sounds]) {
			const name = asset.md5ext || `${asset.assetId}.${asset.dataFormat}`;
			files[name] ??= await originalAsset(name);
		}
		for (const costume of target.costumes) {
			const name =
				costume.md5ext || `${costume.assetId}.${costume.dataFormat}`;
			const correction = compatibility.changes[name];
			if (!correction) continue;
			if (!/^[a-f0-9]{32}\.svg$/.test(correction.file))
				throw new Error("Invalid Scratch compatibility asset name");
			const bytes = await readFile(
				new URL(`compatibility-assets/${correction.file}`, root)
			);
			if (
				sha256(files[name]) !== correction.sourceSHA256 ||
				bytes.length !== correction.bytes ||
				sha256(bytes) !== correction.sha256 ||
				createHash("md5").update(bytes).digest("hex") !==
					correction.file.split(".")[0]
			) {
				throw new Error(
					`Scratch compatibility asset identity mismatch: ${name}`
				);
			}
			files[correction.file] = bytes;
			costume.assetId = correction.file.split(".")[0];
			costume.md5ext = correction.file;
			compatibilityChanges.set(name, { original: name, ...correction });
		}
	}
	if (bootcampReference) bootcampPrograms[id](project);
	const credit = [
		`${original.name} by ${original.author}`,
		`Source: ${original.url}`,
		`License: ${catalog.license} (${catalog.licenseURL})`,
		provenance[id].credits
			? `Original credits: ${provenance[id].credits}`
			: "",
		compatibilityChanges.size
			? "Changes: attribution comment and SVG compatibility corrections. The course’s supplied archive retains the unchanged original definition and media."
			: "Changes: attribution comment added.",
		bootcampReference
			? "Bootcamp instructor remix: completed scripts added by Classes with Jacob."
			: "",
		programCorrection
			? `Program correction: ${programCorrection.summary}`
			: ""
	]
		.filter(Boolean)
		.join("\n");
	stage.comments ??= {};
	stage.comments[commentId] = {
		blockId: null,
		x: 0,
		y: 0,
		width: 320,
		height: 200,
		minimized: true,
		text: credit
	};
	files["project.json"] = strToU8(JSON.stringify(project));
	files["SOURCE.txt"] = strToU8(
		`${credit}\n\nOriginal instructions:\n${provenance[id].instructions}\n`
	);
	if (compatibilityChanges.size) {
		files["SOURCE/compatibility.json"] = strToU8(
			JSON.stringify([...compatibilityChanges.values()], null, 2)
		);
	}
	if (programCorrection) {
		files["SOURCE/program-correction.json"] = strToU8(
			JSON.stringify(programCorrection, null, 2)
		);
	}
	const archive = zipSync(files, { level: 6, mtime: new Date(2026, 0, 1) });
	if (archive.length > 20 * 1024 * 1024) {
		throw new Error(
			`Original Scratch project exceeds the editor limit: ${id}`
		);
	}
	return { original, project, archive };
}

export async function generateOriginalProjects(
	output = fileURLToPath(
		new URL("../../public/scratch-originals/", import.meta.url)
	)
) {
	await mkdir(output, { recursive: true });
	const inventory = [];
	for (const original of originalScratchProjects) {
		for (const reference of bootcampPrograms[original.id]
			? [false, true]
			: [false]) {
			const id = reference ? original.id + "-reference" : original.id;
			const { archive } = await createOriginalProject(
				original.id,
				reference
			);
			const destination = path.join(output, `${id}.sb3`);
			const digest = sha256(archive);
			let current;
			try {
				current = sha256(await readFile(destination));
			} catch {
				/* First generation. */
			}
			if (current !== digest) await writeFile(destination, archive);
			inventory.push({
				id,
				sourceSHA256: original.sourceSHA256,
				sha256: digest,
				bytes: archive.length
			});
		}
	}
	await writeFile(
		path.join(output, "catalog.json"),
		`${JSON.stringify(inventory, null, 2)}\n`
	);
}
