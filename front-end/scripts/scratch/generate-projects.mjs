import { Buffer } from "node:buffer";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { strToU8, zipSync } from "fflate";

export const lessons = JSON.parse(
	await readFile(new URL("./projects.json", import.meta.url), "utf8")
);
const number = value => [1, [4, String(value)]];
const text = value => [1, [10, String(value)]];
function block(opcode, inputs = {}, fields = {}, substacks = {}) {
	return {
		opcode,
		inputs,
		fields,
		substacks
	};
}
const flag = () => block("event_whenflagclicked");
const click = () => block("event_whenthisspriteclicked");
function key(value) {
	return block("event_whenkeypressed", {}, { KEY_OPTION: [value, null] });
}
const x = value => block("motion_changexby", { DX: number(value) });
const y = value => block("motion_changeyby", { DY: number(value) });
const go = (a, b) => block("motion_gotoxy", { X: number(a), Y: number(b) });
function glide(a, b) {
	return block("motion_glidesecstoxy", {
		SECS: number(1),
		X: number(a),
		Y: number(b)
	});
}
const turn = value => block("motion_turnright", { DEGREES: number(value) });
const wait = value => block("control_wait", { DURATION: number(value) });
function say(message) {
	return block("looks_sayforsecs", {
		MESSAGE: text(message),
		SECS: number(2)
	});
}
function repeat(count, blocks) {
	return block(
		"control_repeat",
		{ TIMES: number(count) },
		{},
		{ SUBSTACK: blocks }
	);
}
function forever(blocks) {
	return block("control_forever", {}, {}, { SUBSTACK: blocks });
}
function color() {
	return block(
		"looks_changeeffectby",
		{ CHANGE: number(25) },
		{ EFFECT: ["COLOR", null] }
	);
}
function score() {
	return block(
		"data_changevariableby",
		{ VALUE: number(1) },
		{ VARIABLE: ["Score", "score"] }
	);
}
function resetScore() {
	return block(
		"data_setvariableto",
		{ VALUE: number(0) },
		{ VARIABLE: ["Score", "score"] }
	);
}
function random() {
	return block("motion_goto", {
		TO: {
			reporter: block("motion_goto_menu", {}, { TO: ["_random_", null] }),
			shadow: true
		}
	});
}
function touching(name) {
	return {
		reporter: block("sensing_touchingobject", {
			TOUCHINGOBJECTMENU: {
				reporter: block(
					"sensing_touchingobjectmenu",
					{},
					{ TOUCHINGOBJECTMENU: [name, null] }
				),
				shadow: true
			}
		})
	};
}
function ifBlock(condition, blocks) {
	return block(
		"control_if",
		{ CONDITION: condition },
		{},
		{ SUBSTACK: blocks }
	);
}

export function createProject(id, solution = false) {
	const lesson =
		id === "blank"
			? {
					name: "Independent Mini-Game",
					normal: "Plan your own player, goal and controls; write your own scripts.",
					hard: "Extend your own working game.",
					check: "Test movement, your rule, an ending and restarting."
				}
			: lessons.find(item => item.id === id);
	if (!lesson) throw new Error("Unknown Scratch lesson");
	const assets = {};
	let nextId = 0;
	function costume(name, body, width = 80, height = 80) {
		const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
		const assetId = createHash("md5").update(svg).digest("hex");
		assets[`${assetId}.svg`] = strToU8(svg);
		return {
			name,
			bitmapResolution: 1,
			dataFormat: "svg",
			assetId,
			md5ext: `${assetId}.svg`,
			rotationCenterX: width / 2,
			rotationCenterY: height / 2
		};
	}
	const robot = fill =>
		`<rect x="10" y="10" width="60" height="60" rx="12" fill="${fill}" stroke="#172b4d" stroke-width="3"/><circle cx="28" cy="32" r="5" fill="white"/><circle cx="52" cy="32" r="5" fill="white"/><path d="M25 53h30" stroke="white" stroke-width="5"/>`;
	function target(
		name,
		isStage = false,
		a = 0,
		b = 0,
		costumes = [costume("Robot", robot("#237ec2"))]
	) {
		return {
			isStage,
			name,
			variables: {},
			lists: {},
			broadcasts: {},
			blocks: {},
			comments: {},
			currentCostume: 0,
			costumes,
			sounds: [],
			volume: 100,
			layerOrder: 1,
			...(isStage
				? {
						tempo: 60,
						videoTransparency: 50,
						videoState: "off",
						textToSpeechLanguage: null
					}
				: {
						visible: true,
						x: a,
						y: b,
						size: 70,
						direction: 90,
						draggable: false,
						rotationStyle: "all around"
					})
		};
	}
	const stage = target("Stage", true, 0, 0, [
		costume(
			"Day",
			'<path fill="#e4f4ff" d="M0 0h480v360H0z"/><path fill="#d0e6ca" d="M0 285h480v75H0z"/>',
			480,
			360
		)
	]);
	const player = target("Player");
	const targets = [stage, player];
	function stack(t, specs, parent = null, top = true) {
		let first = null;
		let previous = null;
		for (const spec of specs) {
			const id = `b${++nextId}`;
			const position = Object.values(t.blocks).filter(
				v => v.topLevel
			).length;
			const entry = {
				opcode: spec.opcode,
				next: null,
				parent: previous || parent,
				inputs: {},
				fields: spec.fields,
				shadow: false,
				topLevel: top && !previous,
				...(top && !previous
					? {
							x: 40 + (position % 3) * 300,
							y: 50 + Math.floor(position / 3) * 260
						}
					: {})
			};
			t.blocks[id] = entry;
			if (previous) t.blocks[previous].next = id;
			if (!first) first = id;
			for (const [name, value] of Object.entries(spec.inputs)) {
				if (value.reporter) {
					const child = stack(t, [value.reporter], id, false);
					t.blocks[child].shadow = Boolean(value.shadow);
					entry.inputs[name] = [value.shadow ? 1 : 2, child];
				} else {
					entry.inputs[name] = value;
				}
			}
			for (const [name, list] of Object.entries(spec.substacks)) {
				if (list.length)
					entry.inputs[name] = [2, stack(t, list, id, false)];
			}
			previous = id;
		}
		return first;
	}
	function note(t, message) {
		t.comments[`c${++nextId}`] = {
			blockId: null,
			x: 40,
			y: 620,
			width: 330,
			height: 160,
			minimized: false,
			text: message
		};
	}
	function second(name = "Orange", a = 120, b = 0) {
		const s = target(name, false, a, b, [costume(name, robot("#e79930"))]);
		targets.push(s);
		player.x = -120;
		return s;
	}
	function arrows(all = false) {
		stack(player, [key("left arrow"), x(-10)]);
		stack(player, [key("right arrow"), x(10)]);
		if (all) {
			stack(player, [key("up arrow"), y(10)]);
			stack(player, [key("down arrow"), y(-10)]);
		}
	}
	if (id === "two-arrows" || id === "third-direction") {
		arrows();
		if (solution && id === "third-direction")
			stack(player, [key("up arrow"), y(10)]);
	}
	if (id === "click-reactions") {
		stack(player, [click(), color()]);
		const s = second();
		if (solution) stack(s, [click(), color()]);
	}
	if (id === "dress-up") {
		player.size = 140;
		const pieces = [
			[
				"Hat",
				-175,
				100,
				0,
				70,
				'<path d="M8 58h64v12H8zM22 18h36v40H22z" fill="#784bb4"/>'
			],
			[
				"Badge",
				170,
				50,
				0,
				0,
				'<path d="M40 8l10 21 23 3-17 16 4 23-20-11-20 11 4-23L7 32l23-3z" fill="#efbb28" stroke="#704b0a"/>'
			],
			[
				"Boots",
				170,
				-110,
				0,
				-65,
				'<path d="M10 12h22v42h9v20H6V54h4zM48 12h22v42h8v20H43V54h5z" fill="#b64c51"/>'
			]
		];
		for (const [name, a, b, c, d, shape] of pieces) {
			const s = target(name, false, a, b, [costume(name, shape)]);
			targets.push(s);
			if (name === "Hat" || solution) {
				stack(s, [flag(), go(a, b)]);
				stack(s, [
					click(),
					block(
						"looks_gotofrontback",
						{},
						{ FRONT_BACK: ["front", null] }
					),
					glide(c, d)
				]);
			} else {
				note(
					s,
					`${name}: complete the reset and click scripts using Hat as your example. Drag the sprite before reading its coordinates.`
				);
			}
		}
	}
	if (id === "animate-word") {
		targets.splice(1);
		stage.costumes.push(
			costume(
				"Night",
				'<path fill="#162547" d="M0 0h480v360H0z"/>',
				480,
				360
			)
		);
		stack(stage, [
			flag(),
			block("looks_switchbackdropto", { BACKDROP: text("Day") })
		]);
		// Original short PCM chime; package the sound so offline imports remain self-contained.
		const rate = 22050;
		const samples = 3308;
		const wav = Buffer.alloc(44 + samples * 2);
		wav.write("RIFF");
		wav.writeUInt32LE(wav.length - 8, 4);
		wav.write("WAVEfmt ", 8);
		wav.writeUInt32LE(16, 16);
		wav.writeUInt16LE(1, 20);
		wav.writeUInt16LE(1, 22);
		wav.writeUInt32LE(rate, 24);
		wav.writeUInt32LE(rate * 2, 28);
		wav.writeUInt16LE(2, 32);
		wav.writeUInt16LE(16, 34);
		wav.write("data", 36);
		wav.writeUInt32LE(samples * 2, 40);
		for (let n = 0; n < samples; n++) {
			wav.writeInt16LE(
				Math.round(
					6000 *
						Math.sin((2 * Math.PI * 440 * n) / rate) *
						Math.sin((Math.PI * n) / samples)
				),
				44 + n * 2
			);
		}
		const soundId = createHash("md5").update(wav).digest("hex");
		assets[`${soundId}.wav`] = wav;
		for (const [i, letter] of [..."CODE"].entries()) {
			const s = target(letter, false, -135 + i * 90, 0, [
				costume(
					letter,
					`<text x="8" y="64" font-family="sans-serif" font-size="64" font-weight="bold" fill="${["#237ec2", "#ab4e8a", "#dc7628", "#278770"][i]}">${letter}</text>`
				)
			]);
			targets.push(s);
			stack(s, [
				flag(),
				go(s.x, s.y),
				block("motion_pointindirection", { DIRECTION: number(90) }),
				block("looks_setsizeto", { SIZE: number(70) }),
				block("looks_cleargraphiceffects"),
				block("looks_say", { MESSAGE: text("") })
			]);
			if (i === 0)
				stack(s, [click(), turn(30), color(), wait(0.3), turn(-30)]);
			if (i === 1 && solution)
				stack(s, [click(), say("This is my letter!")]);
			if (i === 2) {
				s.sounds.push({
					name: "Chime",
					assetId: soundId,
					dataFormat: "wav",
					md5ext: `${soundId}.wav`,
					rate,
					sampleCount: samples
				});
				stack(s, [
					click(),
					block("sound_playuntildone", { SOUND_MENU: text("Chime") }),
					say("Hello!")
				]);
			}
			if (i === 3) {
				stack(s, [
					click(),
					block("looks_changesizeby", { CHANGE: number(10) }),
					block("looks_nextbackdrop")
				]);
			}
		}
	}
	if (id === "scene-switch") {
		stage.costumes.push(
			costume(
				"Night",
				'<path fill="#162547" d="M0 0h480v360H0z"/><circle cx="400" cy="60" r="30" fill="#ffe8a0"/><path fill="#2d4254" d="M0 285h480v75H0z"/>',
				480,
				360
			)
		);
		stack(stage, [key("space"), block("looks_nextbackdrop")]);
		if (solution) {
			stack(stage, [
				flag(),
				block("looks_switchbackdropto", {
					BACKDROP: {
						reporter: block(
							"looks_backdrops",
							{},
							{ BACKDROP: ["Day", null] }
						),
						shadow: true
					}
				})
			]);
		}
	}
	if (id === "conversation") {
		const s = second();
		stage.broadcasts.reply = "reply";
		stack(player, [
			flag(),
			say("Hello! I am ready to build."),
			block("event_broadcast", {
				BROADCAST_INPUT: [1, [11, "reply", "reply"]]
			})
		]);
		if (solution) {
			stack(s, [
				block(
					"event_whenbroadcastreceived",
					{},
					{ BROADCAST_OPTION: ["reply", "reply"] }
				),
				say("Me too! What shall we make?")
			]);
		}
	}
	if (id === "dance-loop") {
		const s = second();
		stack(player, [flag(), repeat(12, [turn(30), wait(0.15)])]);
		if (solution) stack(s, [flag(), repeat(12, [turn(-30), wait(0.15)])]);
	}
	if (id === "patrol") {
		stack(player, [
			flag(),
			go(0, 0),
			forever([
				block("motion_movesteps", { STEPS: number(5) }),
				block("motion_ifonedgebounce"),
				...(solution ? [wait(0.04)] : [])
			])
		]);
	}
	if (id === "maze-reset") {
		arrows(true);
		player.x = -180;
		player.y = -120;
		player.size = 30;
		const wall = target("Wall", false, 0, -75, [
			costume(
				"Wall",
				'<rect x="0" y="0" width="20" height="210" fill="#784bb4"/>',
				20,
				210
			)
		]);
		wall.size = 100;
		targets.push(wall);
		targets.push(
			target("Goal", false, 180, -120, [
				costume(
					"Goal",
					'<circle cx="40" cy="40" r="25" fill="#efbb28"/>'
				)
			])
		);
		stack(player, [
			flag(),
			forever([ifBlock(touching("Wall"), [go(-180, -120)]), wait(0.03)])
		]);
		if (solution) stack(player, [flag(), go(-180, -120)]);
	}
	if (id === "click-score") {
		stage.variables.score = ["Score", 0];
		const s = second();
		stack(stage, [flag(), resetScore()]);
		stack(player, [click(), score()]);
		if (solution) stack(s, [click(), score()]);
	}
	if (id === "collect-game") {
		stage.variables.score = ["Score", 0];
		arrows(true);
		stack(player, [flag(), go(-120, 0), resetScore()]);
		const s = second("Token", 130, 50);
		stack(s, [
			flag(),
			forever([
				ifBlock(touching("Player"), [
					...(solution ? [score()] : []),
					random()
				]),
				wait(0.04)
			])
		]);
	}
	if (["falling-catch", "catch-levels", "projectile-state"].includes(id)) {
		const set = (name, value) =>
			block(
				"data_setvariableto",
				{ VALUE: number(value) },
				{ VARIABLE: [name, name] }
			);
		const read = name => ({
			reporter: block("data_variable", {}, { VARIABLE: [name, name] })
		});
		const compare = (opcode, left, right) => ({
			reporter: block(opcode, { OPERAND1: left, OPERAND2: right })
		});
		const equals = (name, value) =>
			compare("operator_equals", read(name), number(value));
		const pressed = name => ({
			reporter: block("sensing_keypressed", {
				KEY_OPTION: {
					reporter: block(
						"sensing_keyoptions",
						{},
						{ KEY_OPTION: [name, null] }
					),
					shadow: true
				}
			})
		});
		const not = input => ({
			reporter: block("operator_not", { OPERAND: input })
		});
		const ready = () =>
			block(
				"event_whenbroadcastreceived",
				{},
				{ BROADCAST_OPTION: ["Round ready", "round-ready"] }
			);
		const changeScore = amount =>
			block(
				"data_changevariableby",
				{ VALUE: number(amount) },
				{ VARIABLE: ["Score", "score"] }
			);
		const ifElse = (condition, yes, no) =>
			block(
				"control_if_else",
				{ CONDITION: condition },
				{},
				{ SUBSTACK: yes, SUBSTACK2: no }
			);
		stage.broadcasts["round-ready"] = "Round ready";
		player.x = -120;
		player.y = -130;
		player.size = 50;
		player.rotationStyle = "left-right";
		stack(player, [
			ready(),
			go(-120, -130),
			forever([
				ifBlock(pressed("left arrow"), [x(-5)]),
				ifBlock(pressed("right arrow"), [x(5)]),
				ifBlock(
					compare(
						"operator_lt",
						{ reporter: block("motion_xposition") },
						number(-200)
					),
					[block("motion_setx", { X: number(-200) })]
				),
				ifBlock(
					compare(
						"operator_gt",
						{ reporter: block("motion_xposition") },
						number(200)
					),
					[block("motion_setx", { X: number(200) })]
				),
				wait(0.03)
			])
		]);
		if (id === "projectile-state") {
			stage.variables.isFired = ["isFired", 0];
			stack(stage, [
				flag(),
				set("isFired", 0),
				block("event_broadcast", {
					BROADCAST_INPUT: [1, [11, "Round ready", "round-ready"]]
				})
			]);
			const projectile = target("Projectile", false, -120, -130, [
				costume(
					"Projectile",
					'<circle cx="8" cy="8" r="7" fill="#ea8648" stroke="#733b18"/>',
					16,
					16
				)
			]);
			projectile.size = 100;
			projectile.visible = false;
			targets.push(projectile);
			const follow = () =>
				block("motion_goto", {
					TO: {
						reporter: block(
							"motion_goto_menu",
							{},
							{ TO: ["Player", null] }
						),
						shadow: true
					}
				});
			stack(projectile, [
				ready(),
				block("looks_hide"),
				block("control_wait_until", {
					CONDITION: not(pressed("space"))
				}),
				forever([
					ifBlock(equals("isFired", 0), [
						follow(),
						ifBlock(pressed("space"), [
							block("motion_pointindirection", {
								DIRECTION: number(90)
							}),
							block("looks_show"),
							set("isFired", 1)
						])
					]),
					ifBlock(
						solution
							? equals("isFired", 1)
							: compare("operator_equals", number(0), number(1)),
						[
							block("motion_movesteps", { STEPS: number(8) }),
							ifBlock(touching("_edge_"), [
								block("looks_hide"),
								set("isFired", 0),
								block("control_wait_until", {
									CONDITION: not(pressed("space"))
								})
							])
						]
					),
					wait(0.03)
				])
			]);
			note(
				projectile,
				solution
					? "Ready (0) follows Player while hidden. Flying (1) moves the same visible projectile until an edge. Release Space before the next shot."
					: "NORMAL: in the flying branch, replace the left 0 in <0 = 1> with the oval isFired reporter. The comparison makes the Boolean hexagon. Until then the visible projectile waits in state 1; the flag restores ready/hidden."
			);
		} else {
			const levels = id === "catch-levels";
			stage.variables.score = ["Score", 0];
			if (levels) {
				stage.variables.Level = ["Level", 1];
				stage.variables.FallSpeed = ["FallSpeed", 3];
			}
			stack(stage, [
				flag(),
				resetScore(),
				...(levels ? [set("Level", 1), set("FallSpeed", 3)] : []),
				block("event_broadcast", {
					BROADCAST_INPUT: [1, [11, "Round ready", "round-ready"]]
				})
			]);
			const ground = target("Ground", false, 0, -165, [
				costume(
					"Ground",
					'<rect width="480" height="18" fill="#8b6340"/>',
					480,
					18
				)
			]);
			ground.size = 100;
			targets.push(ground);
			const token = target("Token", false, 120, 145, [
				costume(
					"Token",
					'<circle cx="12" cy="12" r="10" fill="#db4a6b" stroke="#7e2342" stroke-width="2"/>',
					24,
					24
				)
			]);
			token.size = 80;
			targets.push(token);
			const respawn = () =>
				block("motion_gotoxy", {
					X: {
						reporter: block("operator_random", {
							FROM: number(-200),
							TO: number(200)
						})
					},
					Y: number(145)
				});
			const fall = levels
				? block("motion_changeyby", {
						DY: {
							reporter: block("operator_subtract", {
								NUM1: number(0),
								NUM2: read("FallSpeed")
							})
						}
					})
				: y(-3);
			stack(token, [
				ready(),
				respawn(),
				forever([
					fall,
					ifElse(
						touching("Player"),
						[changeScore(1), respawn()],
						[
							ifBlock(touching("Ground"), [
								...(solution || levels
									? [changeScore(-1)]
									: []),
								respawn()
							])
						]
					),
					wait(0.03)
				])
			]);
			if (levels) {
				const condition = (level, threshold) => ({
					reporter: block("operator_and", {
						OPERAND1: equals("Level", level),
						OPERAND2: compare(
							"operator_gt",
							{
								reporter: block(
									"data_variable",
									{},
									{ VARIABLE: ["Score", "score"] }
								)
							},
							number(threshold - 1)
						)
					})
				});
				stack(stage, [
					ready(),
					forever([
						ifBlock(
							condition(1, 3),
							solution
								? [set("Level", 2), set("FallSpeed", 5)]
								: []
						),
						ifBlock(
							condition(2, 6),
							solution
								? [set("Level", 3), set("FallSpeed", 7)]
								: []
						),
						wait(0.03)
					])
				]);
				note(
					stage,
					solution
						? "Level only advances: Score >= 3 moves 1 -> 2 at speed 5; Score >= 6 moves 2 -> 3 at speed 7. A miss cannot demote the level. The flag resets all three shared values before Round ready."
						: "NORMAL: fill both empty Stage conditions. In the first, set Level to 2 and FallSpeed to 5; in the second, set Level to 3 and FallSpeed to 7. Score remains integer-valued. Leave the working catcher and score rules intact."
				);
			} else {
				note(
					token,
					solution
						? "One drop has one outcome: catch +1 has priority, otherwise Ground -1, then respawn at y 145 with random x. The main loop continues falling."
						: "NORMAL: the catch +1 is a working example. In the Ground branch, add change Score by -1 before the existing respawn. An untouched miss respawns without losing a point. Keep falling outside both conditions."
				);
			}
		}
	}

	note(
		targets[1],
		`${lesson.name}\n${solution ? "TEACHER REFERENCE: one possible Normal completion." : `NORMAL: ${lesson.normal}`}\nHARD: ${lesson.hard}\nCHECK: ${lesson.check}`
	);
	targets.forEach((item, index) => {
		item.layerOrder = index;
	});
	const project = {
		targets,
		monitors: stage.variables.score
			? [
					{
						id: "score",
						mode: "default",
						opcode: "data_variable",
						params: { VARIABLE: "Score" },
						spriteName: null,
						value: 0,
						width: 0,
						height: 0,
						x: 5,
						y: 5,
						visible: true,
						sliderMin: 0,
						sliderMax: 100,
						isDiscrete: true
					}
				]
			: [],
		extensions: [],
		meta: {
			semver: "3.0.0",
			vm: "15.1.1",
			agent: "Classes classroom project generator"
		}
	};
	for (const [name, initial] of [
		["isFired", 0],
		["Level", 1],
		["FallSpeed", 3]
	]) {
		if (!stage.variables[name]) continue;
		project.monitors.push({
			id: name,
			mode: "default",
			opcode: "data_variable",
			params: { VARIABLE: name },
			spriteName: null,
			value: initial,
			width: 0,
			height: 0,
			x: 5,
			y: 5 + project.monitors.length * 30,
			visible: true,
			sliderMin: 0,
			sliderMax: 100,
			isDiscrete: true
		});
	}

	const archive = zipSync(
		{ "project.json": strToU8(JSON.stringify(project)), ...assets },
		{ level: 6, mtime: new Date(2026, 0, 1) }
	);
	return { project, archive };
}

export async function generateProjects(output, teachers) {
	await mkdir(output, { recursive: true });
	if (teachers) await mkdir(teachers, { recursive: true });
	await writeFile(
		path.join(output, "blank.sb3"),
		createProject("blank").archive
	);
	for (const lesson of lessons) {
		await writeFile(
			path.join(output, `${lesson.id}.sb3`),
			createProject(lesson.id).archive
		);
		if (teachers) {
			await writeFile(
				path.join(teachers, `${lesson.id}-solution.sb3`),
				createProject(lesson.id, true).archive
			);
		}
	}
	await writeFile(
		path.join(output, "catalog.json"),
		`${JSON.stringify(lessons, null, 2)}\n`
	);
}
if (
	process.argv[1] &&
	path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
	const output =
		process.argv[2] ||
		fileURLToPath(
			new URL("../../public/scratch-projects/", import.meta.url)
		);
	await generateProjects(output, process.argv[3]);
	console.log(`Created ${lessons.length} Scratch starters in ${output}`);
}
