import fs from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";
import util from "node:util";
import crypto from "node:crypto";
import path from "node:path";
const [folder, output] = process.argv.slice(2);
const definitions = {
	"variables-and-input": [
		["mango 2 true", "mango x 3", "number"],
		null,
		["23", "5", "m 5"]
	],
	"operators-and-randomness": [["14", "18", "2", "3 4", "-2 -1"], ["6"]],
	"for-loops": [
		["1", "2", "3", "4", "finished"],
		["4", "3", "2", "1"]
	],
	"while-loops": [["10", "5", "2", "stop: 1"], ["raep"]],
	"accumulators-and-functions": [
		["1 1", "2 3", "3 6", "4 10", "sum: 10"],
		["10 1 0"],
		["120 1 1"]
	],
	"character-codes": [
		["99", "d", "65 48"],
		["n", "5"]
	],
	conditionals: [
		["middle"],
		["true false true", "pear PEAR", "Hello River!"]
	],
	"advanced-conditionals": [
		["false", "true", "true"],
		["false", "0", "7", "untitled"],
		["buzz"],
		["wait"]
	]
};
const runs = [],
	blocksByName = {};
function execute(label, source, expected, response) {
	const actual = [];
	const context = {
		console: {
			log(...values) {
				actual.push(util.format(...values));
			}
		},
		prompt() {
			assert.notEqual(response, undefined);
			return response;
		}
	};
	vm.runInNewContext(source, context, { timeout: 1000, filename: label });
	assert.deepEqual(actual, expected, label);
	runs.push({ label, actual, matched: true });
}
const fence = String.fromCharCode(96).repeat(3);
const re = new RegExp(fence + "javascript\\n([\\s\\S]*?)\\n" + fence, "g");
const files = {};
for (const [name, expected] of Object.entries(definitions)) {
	const file = path.join(folder, name + ".md"),
		bytes = fs.readFileSync(file);
	files[name + ".md"] = crypto
		.createHash("sha256")
		.update(bytes)
		.digest("hex");
	const blocks = [...bytes.toString().matchAll(re)].map(match => match[1]);
	blocksByName[name] = blocks;
	assert.equal(blocks.length, expected.length, name);
	for (let i = 0; i < blocks.length; i++) {
		if (expected[i] === null) {
			for (const response of ["tea", "", null]) {
				execute(
					name + ":" + i + ":" + JSON.stringify(response),
					blocks[i],
					[util.format(response)],
					response
				);
			}
		} else execute(name + ":" + i, blocks[i], expected[i]);
	}
}
function vary(name, index, oldValue, newValue, expected, suffix) {
	const original = blocksByName[name][index];
	assert.equal(
		original.split(oldValue).length,
		2,
		"unique alteration " + suffix
	);
	execute(
		name + ":variation:" + suffix,
		original.replace(oldValue, newValue),
		expected
	);
}
vary(
	"for-loops",
	0,
	"number <= 4",
	"number < 4",
	["1", "2", "3", "finished"],
	"exclusive-bound"
);
vary("while-loops", 0, "amount = 10", "amount = 1", ["stop: 1"], "zero-body");
vary("while-loops", 1, 'word = "pear"', 'word = "x"', ["x"], "one-letter");
vary("while-loops", 1, 'word = "pear"', 'word = ""', [""], "empty-string");
vary(
	"accumulators-and-functions",
	0,
	"total += number",
	"total += number * number",
	["1 1", "2 5", "3 14", "4 30", "sum: 30"],
	"squares"
);
vary(
	"accumulators-and-functions",
	1,
	"sumTo(4), sumTo(1), sumTo(0)",
	"sumTo(100)",
	["5050"],
	"sum100"
);
for (const [r, expected] of [
	["0", ["5"]],
	["0.999", ["7"]]
])
	vary(
		"operators-and-randomness",
		1,
		"r = 0.6",
		"r = " + r,
		expected,
		"endpoint-" + r
	);
for (const [r, expected] of [
	["0", ["a", "0"]],
	["0.999", ["z", "9"]]
])
	vary(
		"character-codes",
		1,
		"r = 0.5",
		"r = " + r,
		expected,
		"endpoint-" + r
	);
for (const [score, label] of [
	[90, "high"],
	[89, "middle"],
	[80, "middle"],
	[79, "review"]
])
	vary(
		"conditionals",
		0,
		"score = 82",
		"score = " + score,
		[label],
		"score-" + score
	);
for (const [animal, result] of [
	["Bee", "unknown"],
	["cat", "meow"]
])
	vary(
		"advanced-conditionals",
		2,
		'animal = "bee"',
		"animal = " + JSON.stringify(animal),
		[result],
		"animal-" + animal
	);
vary(
	"advanced-conditionals",
	3,
	"hasTicket = true",
	"hasTicket = false",
	["get a ticket"],
	"no-ticket"
);
vary(
	"advanced-conditionals",
	3,
	"gatesOpen = false",
	"gatesOpen = true",
	["enter"],
	"open-gates"
);
const fencedPrograms = Object.values(blocksByName).reduce(
	(sum, blocks) => sum + blocks.length,
	0
);
assert.equal(fencedPrograms, 20);
assert.equal(runs.length, 40);
const proof = {
	at: new Date().toISOString(),
	acceptedWithinNativeExampleScope: true,
	readingFiles: 8,
	fencedPrograms,
	nativeExecutions: runs.length,
	files,
	runs,
	browserPromptExecutedNatively: false,
	promptReturnValuesStubbed: ["tea", "", null],
	appIntegrationProvenByThisCheck: false,
	fullCourseAccepted: false
};
fs.writeFileSync(output, JSON.stringify(proof, null, 2) + "\n");
console.log(
	JSON.stringify({
		acceptedWithinNativeExampleScope: true,
		readingFiles: 8,
		fencedPrograms,
		nativeExecutions: runs.length
	})
);
