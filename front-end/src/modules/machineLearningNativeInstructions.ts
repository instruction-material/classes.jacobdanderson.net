import type { PythonIdeFile } from "./pythonIde";
import { parseGitHubResource } from "./codePreview";

const datasets: Record<string, string | null> = {
	"customer-neighbors": "customers.csv",
	"car-neighbors": "cars.csv",
	"iris-naive-bayes": "iris.csv",
	"email-naive-bayes": "fictional-emails.csv",
	"linear-regression": null,
	"polynomial-regression": null,
	"country-year-regression": "life_expectancy.csv"
};

export function machineLearningNativeResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.mode !== "tree" ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "ai-level-2"
	) {
		return null;
	}
	const parts = resource.path.split("/");
	if (
		parts.length === 3 &&
		parts[0] === "ML-Library-Workspaces" &&
		Object.hasOwn(datasets, parts[1]!) &&
		(parts[2] === "starter" || parts[2] === "solution")
	) {
		return {
			kind: "library" as const,
			project: parts[1]!,
			role: parts[2],
			dataset: datasets[parts[1]!] ?? null
		};
	}
	return null;
}

export function machineLearningLibraryProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	url: string
) {
	const base = `${courseId}:${itemId}:${role}`;
	const resource = machineLearningNativeResource(url);
	return courseId === "machine-learning" && resource
		? `${base}:ml-library-${resource.project}-v1`
		: base;
}

export function machineLearningNativeRunInstructions(
	files: PythonIdeFile[],
	url: string
) {
	const selected = machineLearningNativeResource(url);
	if (!selected) return null;
	const required = [
		"main.py",
		"README.md",
		"requirements.txt",
		"exercise.py",
		...(selected.dataset ? [selected.dataset] : [])
	];
	if (
		!required.every(name =>
			files.some(file => file.name === name && file.encoding !== "base64")
		)
	) {
		return [
			"A required project file is missing. Restore the complete selected source before running locally."
		];
	}
	return [
		"Download and extract the ZIP. Run these commands from the extracted project folder in a macOS/Linux terminal with Python 3.14:",
		"python3.14 -m venv .venv",
		".venv/bin/python -m pip install --require-hashes -r requirements.txt",
		"MPLBACKEND=Agg .venv/bin/python main.py",
		"On Windows, create the environment with py -3.14 -m venv .venv and use .venv\\Scripts\\python.exe for pip and main.py.",
		selected.role === "starter"
			? "Complete the named fitting function in exercise.py; the unfinished starter stops there. Keep the supplied evaluation workflow and data together."
			: "The reference fitting function is in exercise.py.",
		"Read README.md for the expected reports, figures and interpretation checks. Keep those local outputs with the saved source."
	];
}
