// Course prose formats filenames; imported README fixtures retain upstream bytes.
export function readingWithoutFilenameFormatting(reading: string) {
	return reading.replace(/`([\w./-]+\.(?:md|py|rs))`/g, "$1");
}
