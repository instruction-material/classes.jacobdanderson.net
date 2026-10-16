import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import { fileURLToPath } from "node:url";

// CLI course readers consume the same exact UTF-8 text as Vite's ?raw imports.
registerHooks({
	load(url, context, nextLoad) {
		if (url.startsWith("file:") && new URL(url).searchParams.has("raw")) {
			const text = readFileSync(fileURLToPath(url), "utf8");
			return {
				format: "module",
				source: `export default ${JSON.stringify(text)};`,
				shortCircuit: true
			};
		}
		return nextLoad(url, context);
	}
});
