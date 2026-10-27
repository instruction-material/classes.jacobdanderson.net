import { expect, it } from "vitest";
import { readingWithoutFilenameFormatting } from "./course-reading-format";

it("allows filename code spans while preserving the complete reading", () => {
	expect(
		readingWithoutFilenameFormatting(
			"Save `notes.md` and run `main.py`.\nInspect `examples/probe.rs`."
		)
	).toBe("Save notes.md and run main.py.\nInspect examples/probe.rs.");
});

it("preserves commands, links, wording and meaningful filenames", () => {
	const text =
		"Run `cargo test --offline`. Read [notes.md](https://example.invalid/notes.md).";
	expect(readingWithoutFilenameFormatting(text)).toBe(text);
	expect(readingWithoutFilenameFormatting("Save `other.md`.")).not.toBe(
		readingWithoutFilenameFormatting("Save `notes.md`.")
	);
	expect(readingWithoutFilenameFormatting("Delete `notes.md`.")).not.toBe(
		readingWithoutFilenameFormatting("Save `notes.md`.")
	);
});
