const PROJECT_TITLE_RE = /\b(?:project|capstone)\b/i;
const EXPLICIT_PRACTICE_TITLE_RE = /\b(?:additional practice|supplemental)\b/i;

export function isCoreProjectTitle(title: string) {
	return (
		PROJECT_TITLE_RE.test(title) && !EXPLICIT_PRACTICE_TITLE_RE.test(title)
	);
}
