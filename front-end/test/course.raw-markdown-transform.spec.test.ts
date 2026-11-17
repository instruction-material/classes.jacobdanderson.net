import type { SourceCodeTransformer } from "unocss";
import MagicString from "magic-string";
import { describe, expect, it } from "vitest";
import { transformerVariantGroup } from "unocss";
import config from "../uno.config";

const guarded = config.transformers!.find(
	transformer => transformer.name === "@unocss/transformer-variant-group"
)!;

async function transform(
	source: string,
	id: string,
	transformer: SourceCodeTransformer
) {
	if (transformer.idFilter && !transformer.idFilter(id)) return source;
	if (transformer.codeFilter && !transformer.codeFilter(source, id))
		return source;
	const value = new MagicString(source);
	await transformer.transform(value, id, {} as never);
	return value.toString();
}

describe("raw course source and UnoCSS class transformations", () => {
	it("preserves literal vectors in raw lesson imports while the original transformer reproduces the defect", async () => {
		const source = 'export default "S:(4,2,0) and H:(0,1,5)"';
		expect(
			await transform(
				source,
				"/courses/example.md?raw",
				transformerVariantGroup()
			)
		).not.toBe(source);
		for (const query of ["raw", "import&raw", "raw&used", "raw="]) {
			expect(
				await transform(source, "/courses/example.md?" + query, guarded)
			).toBe(source);
		}
	});

	it("continues expanding real grouped variant and utility classes", async () => {
		const source =
			'<div class="hover:(font-bold underline) font-(light mono)" />';
		expect(await transform(source, "/src/Example.vue", guarded)).toBe(
			'<div class="hover:font-bold hover:underline font-light font-mono" />'
		);
	});
});
