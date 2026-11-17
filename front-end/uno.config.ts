import process from "node:process";
import { createLocalFontProcessor } from "@unocss/preset-web-fonts/local";
import {
	defineConfig,
	presetAttributify,
	presetIcons,
	presetTypography,
	presetWebFonts,
	presetWind3,
	transformerDirectives,
	transformerVariantGroup
} from "unocss";

const isVitest = process.env.VITEST === "true";

// Raw imports are lesson text and program data, not class declarations.
const variantGroups = transformerVariantGroup();
const literalSafeVariantGroups = {
	...variantGroups,
	codeFilter(code: string, id: string) {
		const query = id.split("?", 2)[1] ?? "";
		if (new URLSearchParams(query).has("raw")) return false;
		return variantGroups.codeFilter?.(code, id) ?? true;
	}
};

export default defineConfig({
	shortcuts: [
		[
			"btn",
			"px-4 py-1 rounded inline-block bg-teal-700 text-white cursor-pointer !outline-none hover:bg-teal-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50"
		],
		[
			"icon-btn",
			"inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600"
		]
	],
	presets: [
		presetWind3(),
		presetAttributify(),
		presetIcons({
			scale: 1.2
		}),
		presetTypography(),
		...(isVitest
			? []
			: [
					presetWebFonts({
						fonts: {
							sans: "DM Sans",
							serif: "DM Serif Display",
							mono: "DM Mono"
						},
						processors: createLocalFontProcessor()
					})
				])
	],
	transformers: [transformerDirectives(), literalSafeVariantGroups],
	safelist: "prose prose-sm m-auto text-left".split(" ")
});
