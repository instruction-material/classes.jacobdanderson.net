import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";
// This check also runs outside the application test runner.
// eslint-disable-next-line test/no-import-node-test
import test from "node:test";

const require = createRequire(import.meta.url);
const root = join(import.meta.dirname, "..");
const micromatchRequire = createRequire(
	require.resolve("micromatch/package.json")
);
const packages = [
	{ load: require, version: "4.0.7-classes.1", folder: "picomatch-v4" },
	{
		load: micromatchRequire,
		version: "2.3.2-classes.1",
		folder: "picomatch-v2"
	}
];
const rejected = {
	name: "SyntaxError",
	message: /Repeated extglob contains an unbounded wildcard/
};

for (const { load, version, folder } of packages) {
	const pm = load("picomatch");
	test(
		`installed picomatch ${
			version
		} exactly matches its reviewable source`,
		() => {
			const info = load("picomatch/package.json");
			assert.equal(info.name, "@classes/picomatch");
			assert.equal(info.version, version);
			for (const name of [
				"package.json",
				"LICENSE",
				"README.md",
				"index.js",
				"lib/parse.js",
				"lib/picomatch.js",
				"lib/scan.js",
				"lib/constants.js",
				"lib/utils.js"
			]) {
				assert.deepEqual(
					readFileSync(load.resolve(`picomatch/${name}`)),
					readFileSync(join(root, "vendor", folder, name)),
					name
				);
			}
		}
	);
	test(
		`picomatch ${
			version
		} rejects repeated wildcards at every pattern entry`,
		() => {
			for (const pattern of [
				"+(*)",
				"*(*)",
				"+(*a)",
				"*(*a)",
				"+(*?a)",
				"+(a*|b)",
				"prefix+(*a)suffix",
				"**/+(*a).ts",
				"+(@(*a))",
				"+(!(*a))",
				"+([ab]*a)",
				"+(a\u0000*a)"
			]) {
				for (const options of [
					{},
					{ fastpaths: false },
					{ capture: true },
					{ dot: true, windows: true },
					{ bash: true },
					{ maxExtglobRecursion: false },
					{ maxExtglobRecursion: Infinity }
				]) {
					for (const call of [
						() => pm(pattern, options),
						() => pm.makeRe(pattern, options),
						() => pm.parse(pattern, options),
						() =>
							pm.isMatch(`${"a".repeat(60)}!`, pattern, options),
						() => load("picomatch/lib/parse")(pattern, options)
					])
						assert.throws(call, rejected, pattern);
				}
			}
		}
	);
	test(
		`picomatch ${version} retains ordinary repeat and build behavior`,
		() => {
			for (const [pattern, value, expected] of [
				["+(ab|cd)", "abcdab", true],
				["+(ab|cd)", "abef", false],
				["*([a-z])", "abc", true],
				["+(a?)", "abab", true],
				["+(\\*a)", "*a*a", true],
				["+([*]a)", "*a*a", true],
				["+(\"*a\")", "*a*a", true],
				["src/**/*.{vue,ts}", "src/pages/index.vue", true],
				["src/**/*.{vue,ts}", "src/pages/index.css", false],
				["**/!(*.test).ts", "src/course.ts", true],
				["**/!(*.test).ts", "src/course.test.ts", false],
				[
					"**/@(pages|components)/**/*.vue",
					"src/pages/course.vue",
					true
				],
				["*.js", ".hidden.js", false]
			])
				assert.equal(pm.isMatch(value, pattern), expected, pattern);
			assert.equal(pm.isMatch(".hidden.js", "*.js", { dot: true }), true);
			for (const options of [{ noextglob: true }, { noext: true }]) {
				assert.doesNotThrow(() =>
					pm.makeRe("+(*a)", options).test(`${"a".repeat(60)}!`)
				);
			}
		}
	);
}

test("micromatch and fast-glob retain build patterns and reject the trigger", () => {
	const mm = require("micromatch");
	assert.throws(() => mm([`${"a".repeat(60)}!`], "+(*a)"), rejected);
	assert.deepEqual(
		mm(["src/a.vue", "src/b.ts", "src/c.css"], "src/*.{vue,ts}"),
		["src/a.vue", "src/b.ts"]
	);
	assert.deepEqual(
		require("fast-glob")
			.generateTasks(["src/{pages,components}/**/*.{vue,ts}"])
			.flatMap(row => row.positive)
			.sort(),
		[
			"src/components/**/*.ts",
			"src/components/**/*.vue",
			"src/pages/**/*.ts",
			"src/pages/**/*.vue"
		]
	);
});
