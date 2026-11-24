// Build editable SB3 stacks. Each nested input has a parent in the same sprite.
const block = (opcode, inputs = {}, fields = {}) => ({
	opcode,
	inputs,
	fields
});
const menu = (opcode, field, value) => ({
	...block(opcode, {}, { [field]: [value, null] }),
	shadow: true
});
const flag = () => block("event_whenflagclicked");
const forever = (...body) => block("control_forever", { SUBSTACK: body });
const when = (condition, ...body) =>
	block("control_if", { CONDITION: condition, SUBSTACK: body });
const until = condition =>
	block("control_wait_until", { CONDITION: condition });
const go = where =>
	block("motion_goto", { TO: menu("motion_goto_menu", "TO", where) });
const xy = (x, y) => block("motion_gotoxy", { X: x, Y: y });
const mouseDown = () => block("sensing_mousedown");
const touching = name =>
	block("sensing_touchingobject", {
		TOUCHINGOBJECTMENU: menu(
			"sensing_touchingobjectmenu",
			"TOUCHINGOBJECTMENU",
			name
		)
	});
const compare = (op, a, b) =>
	block("operator_" + op, { OPERAND1: a, OPERAND2: b });
const stop = () => block("control_stop", {}, { STOP_OPTION: ["all", null] });

function scripts(target) {
	let serial = 0;
	function chain(nodes, parent) {
		let first;
		for (const node of nodes) {
			const id = `bootcamp-${target.name}-${++serial}`;
			const item = {
				...node,
				inputs: {},
				shadow: !!node.shadow,
				topLevel: false,
				parent,
				next: null
			};
			target.blocks[id] = item;
			if (first) target.blocks[parent].next = id;
			first ??= id;
			for (const [name, value] of Object.entries(node.inputs)) {
				if (typeof value === "number")
					item.inputs[name] = [1, [4, String(value)]];
				else if (typeof value === "string")
					item.inputs[name] = [1, [10, value]];
				else if (value.broadcast)
					item.inputs[name] = [1, [11, ...value.broadcast]];
				else if (value.variable)
					item.inputs[name] = [3, [12, ...value.variable], [10, ""]];
				else if (Array.isArray(value))
					item.inputs[name] = [2, chain(value, id)];
				else {
					const child = chain([value], id);
					const boolean = [
						"operator_equals",
						"operator_not",
						"sensing_mousedown",
						"sensing_touchingobject"
					].includes(value.opcode);
					item.inputs[name] = value.shadow
						? [1, child]
						: boolean
							? [2, child]
							: [3, child, [4, "0"]];
				}
			}
			parent = id;
		}
		return first;
	}
	const add = (x, y, ...nodes) =>
		Object.assign(target.blocks[chain(nodes, null)], {
			topLevel: true,
			x,
			y
		});
	add.after = (parent, ...nodes) => {
		const next = target.blocks[parent].next;
		const head = chain(nodes, parent);
		target.blocks[parent].next = head;
		let tail = head;
		while (target.blocks[tail].next) tail = target.blocks[tail].next;
		target.blocks[tail].next = next;
		if (next) target.blocks[next].parent = tail;
	};
	return add;
}

function variable(stage, name, existingName = name) {
	const id =
		Object.keys(stage.variables).find(
			id => stage.variables[id][0] === existingName
		) ?? "bootcamp-" + name;
	stage.variables[id] = [name, 0];
	const field = [name, id];
	return {
		value: { variable: field },
		set: value =>
			block("data_setvariableto", { VALUE: value }, { VARIABLE: field })
	};
}

function entries(target, opcode) {
	return Object.entries(target.blocks).filter(([, b]) => b.opcode === opcode);
}

// A full second elapses before the displayed time changes. For a respawn
// loop the actor appears at its new position before waiting there.
function swapLoopPair(target, firstOpcode, secondOpcode) {
	const blocks = target.blocks;
	const [firstId, first] = entries(target, firstOpcode).find(
		([, b]) => blocks[b.next]?.opcode === secondOpcode
	);
	const loop = blocks[first.parent];
	const secondId = first.next;
	loop.inputs.SUBSTACK[1] = secondId;
	blocks[secondId].parent = first.parent;
	blocks[secondId].next = firstId;
	first.parent = secondId;
	first.next = null;
}

function mouse(project) {
	const target = project.targets[1];
	const add = scripts(target);
	const faceRight = () => block("motion_pointindirection", { DIRECTION: 90 });
	const [[clear]] = entries(target, "pen_clear");
	add.after(clear, block("pen_penUp"), xy(0, 0), faceRight());
	// Keep all five published polygons. A centered start keeps the full
	// figure inside the stage and avoids drawing a line between designs.
	for (const [id, goto] of entries(target, "motion_goto")) {
		delete target.blocks[goto.inputs.TO[1]];
		goto.opcode = "motion_gotoxy";
		goto.inputs = { X: [1, [4, "0"]], Y: [1, [4, "0"]] };
		add.after(id, faceRight());
	}
	for (const [id] of entries(target, "control_repeat"))
		add.after(id, block("pen_penUp"));
}

function hungryShark(project) {
	const [stage, shark, ...prey] = project.targets;
	const score = variable(stage, "Score", "Shark");
	const playing = variable(stage, "Playing");
	const message = "Start round";
	const broadcastId = "bootcamp-start";
	stage.broadcasts[broadcastId] = message;
	project.monitors.find(m => m.params.VARIABLE === "Shark").params.VARIABLE =
		"Score";
	scripts(stage)(
		20,
		20,
		flag(),
		playing.set(1),
		score.set(0),
		block("event_broadcast", {
			BROADCAST_INPUT: { broadcast: [message, broadcastId] }
		})
	);
	for (const target of [shark, ...prey]) {
		for (const [, b] of entries(target, "event_whenflagclicked"))
			Object.assign(
				b,
				block(
					"event_whenbroadcastreceived",
					{},
					{ BROADCAST_OPTION: [message, broadcastId] }
				)
			);
		for (const b of Object.values(target.blocks)) {
			if (b.fields.VARIABLE?.[1] === score.value.variable[1])
				b.fields.VARIABLE[0] = "Score";
		}
		const add = scripts(target);
		for (const [id, loop] of entries(target, "control_forever")) {
			// Use the existing loop body, with an explicit game-state condition.
			const body = loop.inputs.SUBSTACK;
			loop.opcode = "control_repeat_until";
			const condition = id + "-finished";
			target.blocks[condition] = {
				opcode: "operator_equals",
				inputs: {
					OPERAND1: [3, [12, ...playing.value.variable], [10, ""]],
					OPERAND2: [1, [10, "0"]]
				},
				fields: {},
				parent: id,
				next: null,
				topLevel: false,
				shadow: false
			};
			loop.inputs = { CONDITION: [2, condition], SUBSTACK: body };
		}
		if (target === shark) {
			// Follow the pointer even during a bite and while waiting for release.
			const [[moveId, move]] = entries(target, "motion_goto");
			target.blocks[move.parent].next = move.next;
			target.blocks[move.next].parent = move.parent;
			delete target.blocks[move.inputs.TO[1]];
			delete target.blocks[moveId];
			add(450, 20, flag(), forever(go("_mouse_")));
			const [[soundId, bite]] = entries(target, "sound_playuntildone");
			bite.opcode = "sound_play";
			add.after(
				soundId,
				until(block("operator_not", { OPERAND: mouseDown() }))
			);
			continue;
		}
		const [[deltaId, b]] = entries(target, "data_changevariableby");
		const ordinary = Number(b.inputs.VALUE[1][1]) > 0;
		add.after(
			deltaId,
			...(ordinary
				? [
						when(
							compare("equals", score.value, 5),
							playing.set(0),
							stop()
						)
					]
				: []),
			until(block("operator_not", { OPERAND: touching("Shark 2") }))
		);
		const [moveHat] = entries(target, "event_whenbroadcastreceived").find(
			([, hat]) => {
				let next = target.blocks[hat.next];
				if (next.opcode === "control_wait")
					next = target.blocks[next.next];
				return (
					target.blocks[next.inputs.SUBSTACK[1]].opcode ===
					"control_wait"
				);
			}
		);
		add.after(moveHat, go("_random_"));
	}
}

function princessGame(project) {
	const [, dragon, princess] = project.targets;
	const [[resetLife]] = entries(princess, "data_setvariableto").filter(
		([, b]) => b.fields.VARIABLE[0] === "Lives"
	);
	const add = scripts(princess);
	add.after(resetLife, xy(0, -126));
	const [[flagId]] = entries(dragon, "event_whenflagclicked");
	scripts(dragon).after(
		flagId,
		xy(block("operator_random", { FROM: -200, TO: 200 }), 165)
	);
	// Check contact with Princess along the entire fall before a miss respawns Dragon.
	const [[, low]] = entries(dragon, "operator_lt");
	low.inputs.OPERAND2 = [1, [10, "-165"]];
	swapLoopPair(princess, "data_changevariableby", "control_wait");
	const [[tickId, tick]] = entries(princess, "data_changevariableby");
	add.after(
		tickId,
		when(compare("equals", { variable: tick.fields.VARIABLE }, 0), stop())
	);
}

function spiderSmash(project) {
	const [, hammer, spider] = project.targets;
	swapLoopPair(hammer, "data_changevariableby", "control_wait");
	swapLoopPair(spider, "control_wait", "motion_goto");
	// A repeat yields once between the last decrement and the final stop.
	// Reject a smash in that frame as soon as the clock displays zero.
	const blocks = spider.blocks;
	const [guardId, guard] = entries(spider, "control_if").find(
		([, b]) => blocks[b.inputs.CONDITION[1]].opcode === "sensing_mousedown"
	);
	const mouse = guard.inputs.CONDITION[1];
	const combined = "bootcamp-timed-smash",
		positive = "bootcamp-time-positive";
	const timeId = Object.keys(project.targets[0].variables).find(
		id => project.targets[0].variables[id][0] === "Time"
	);
	guard.inputs.CONDITION = [2, combined];
	blocks[mouse].parent = combined;
	blocks[combined] = {
		opcode: "operator_and",
		inputs: { OPERAND1: [2, mouse], OPERAND2: [2, positive] },
		fields: {},
		parent: guardId,
		next: null,
		shadow: false,
		topLevel: false
	};
	blocks[positive] = {
		opcode: "operator_gt",
		inputs: {
			OPERAND1: [3, [12, "Time", timeId], [10, ""]],
			OPERAND2: [1, [10, "0"]]
		},
		fields: {},
		parent: combined,
		next: null,
		shadow: false,
		topLevel: false
	};
}

function ball(project) {
	const blocks = project.targets[1].blocks;
	const [clickId, click] = Object.entries(blocks).find(
		([, b]) => b.opcode === "event_whenthisspriteclicked"
	);
	const [colorId, color] = Object.entries(blocks).find(
		([, b]) => b.topLevel && b.opcode === "looks_changeeffectby"
	);
	color.next = click.next;
	blocks[color.next].parent = colorId;
	color.parent = clickId;
	click.next = colorId;
	color.topLevel = false;
	delete color.x;
	delete color.y;
}

function crabGame(project) {
	const [stage, crab, puffs] = project.targets;
	const message = "Caught puff";
	const broadcastId = "bootcamp-caught";
	stage.broadcasts[broadcastId] = message;
	const [id, score] = Object.entries(crab.blocks).find(
		([, b]) => b.opcode === "data_changevariableby"
	);
	const next = score.next;
	score.next = "bootcamp-notify";
	crab.blocks[next].parent = score.next;
	crab.blocks[score.next] = {
		opcode: "event_broadcast",
		parent: id,
		next,
		inputs: { BROADCAST_INPUT: [1, [11, message, broadcastId]] },
		fields: {},
		topLevel: false,
		shadow: false
	};
	scripts(puffs)(
		340,
		20,
		block(
			"event_whenbroadcastreceived",
			{},
			{ BROADCAST_OPTION: [message, broadcastId] }
		),
		xy(block("operator_random", { FROM: -200, TO: 200 }), 165)
	);
}

const key = value =>
	block("event_whenkeypressed", {}, { KEY_OPTION: [value, null] });
const wait = seconds => block("control_wait", { DURATION: seconds });
const repeat = (count, ...body) =>
	block("control_repeat", { TIMES: count, SUBSTACK: body });
const faceRight = () => block("motion_pointindirection", { DIRECTION: 90 });

function showMonitor(project, id, opcode, params, spriteName = null) {
	project.monitors.push({
		id,
		mode: "default",
		opcode,
		params,
		spriteName,
		value: 0,
		width: 0,
		height: 0,
		x: 5,
		y: 5 + 28 * project.monitors.length,
		visible: true,
		sliderMin: 0,
		sliderMax: 100,
		isDiscrete: true
	});
}

function visibleCounter(project, name) {
	const counter = variable(project.targets[0], name);
	const field = counter.value.variable;
	showMonitor(project, field[1], "data_variable", { VARIABLE: name });
	return {
		...counter,
		change: amount =>
			block(
				"data_changevariableby",
				{ VALUE: amount },
				{ VARIABLE: field }
			)
	};
}

function beetleCoordinates(project) {
	const beetle = project.targets[1];
	const add = scripts(beetle);
	project.extensions.push("pen");
	add(20, 20, flag(), block("pen_penUp"), xy(0, 0), faceRight());
	add(260, 20, key("right arrow"), block("motion_changexby", { DX: 10 }));
	add(480, 20, key("up arrow"), block("motion_changeyby", { DY: 10 }));
	for (const axis of ["xposition", "yposition"])
		showMonitor(
			project,
			beetle.name + "_" + axis,
			"motion_" + axis,
			{},
			beetle.name
		);
}

function mousePolygons(project) {
	const add = scripts(project.targets[1]);
	project.extensions.push("pen");
	add(
		20,
		20,
		flag(),
		block("pen_clear"),
		block("pen_penUp"),
		xy(0, 0),
		faceRight()
	);
	for (const [button, sides, angle] of [
		["1", 4, 90],
		["2", 3, 120]
	]) {
		add(
			button === "1" ? 260 : 500,
			20,
			key(button),
			block("pen_penDown"),
			repeat(
				sides,
				block("motion_movesteps", { STEPS: 40 }),
				block("motion_turnright", { DEGREES: angle })
			),
			block("pen_penUp")
		);
	}
}

function elephantFlashes(project) {
	const add = scripts(project.targets[1]);
	add(
		20,
		20,
		flag(),
		block("looks_show"),
		block("looks_cleargraphiceffects")
	);
	add(
		260,
		20,
		key("5"),
		repeat(
			3,
			block("looks_hide"),
			wait(0.5),
			block("looks_show"),
			wait(0.5)
		),
		block("looks_say", { MESSAGE: "Done" })
	);
}

function threeSecondButton(project) {
	const button = project.targets[1];
	const add = scripts(button);
	const clicks = visibleCounter(project, "Clicks");
	const playing = visibleCounter(project, "Playing");
	const [[startId]] = entries(button, "event_whenflagclicked");
	add.after(startId, clicks.set(0), playing.set(0));
	const [goId] = entries(button, "looks_sayforsecs").find(
		([, b]) => b.next === null
	);
	add.after(goId, playing.set(1), wait(3), playing.set(0));
	const [[clickId]] = entries(button, "event_whenthisspriteclicked");
	add.after(
		clickId,
		when(compare("equals", playing.value, 1), clicks.change(1))
	);
}

function zebraDistance(project) {
	const add = scripts(project.targets[1]);
	const steps = visibleCounter(project, "Steps");
	const distance = visibleCounter(project, "Distance");
	add(20, 20, flag(), steps.set(0), distance.set(0), xy(0, 0));
	for (const [button, dx] of [
		["right arrow", 10],
		["left arrow", -10]
	]) {
		add(
			dx > 0 ? 260 : 500,
			20,
			key(button),
			block("motion_changexby", { DX: dx }),
			steps.change(1),
			distance.change(10)
		);
	}
}

export const bootcampPrograms = {
	592008620: beetleCoordinates,
	601699148: mousePolygons,
	592014695: elephantFlashes,
	592019210: threeSecondButton,
	327635693: zebraDistance,
	287922077: ball,
	299094220: spiderSmash,
	327610727: crabGame,
	601696898: mouse,
	592123430: hungryShark,
	593357343: princessGame
};
