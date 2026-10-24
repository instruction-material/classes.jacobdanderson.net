import type { PythonIdeFile } from "@/modules/pythonIde";

export function swiftBuildInstructions(files: PythonIdeFile[]) {
	const contracts = [
		{
			file: "tests/ReferenceContracts.swift",
			verifier: "verify-networking.py",
			boundary: "client and store"
		},
		{
			file: "tests/TrackerContracts.swift",
			verifier: "verify-tracker.py",
			boundary: "in-memory tracker store"
		},
		{
			file: "tests/PersistenceContracts.swift",
			verifier: "verify-persistence.py",
			boundary:
				"persistent model, Swift Testing cases and fresh-process storage"
		}
	].find(contract => files.some(file => file.name === contract.file));
	const source = files.filter(
		file =>
			/\.swift$/i.test(file.name) &&
			file.name !== "Package.swift" &&
			!file.name.startsWith("tests/")
	);
	if (!source.length)
		return ["Add Swift source before building the iOS app."];
	return [
		"Save and download the ZIP, extract it, then create an iOS App project in Xcode using SwiftUI.",
		contracts
			? "Replace the generated app entry point and ContentView. Add only the four Swift files from the selected starter or solution folder to the app target and keep one @main app entry point."
			: "Replace the generated app entry point and ContentView with the selected project's Swift files. Add every remaining Swift file to the same target and keep one @main app entry point.",
		...(contracts
			? [
					`Keep ${contracts.file} outside the app target; it has a separate command-line entry point. Run python3 ${contracts.verifier} from the extracted folder to check the selected role's ${contracts.boundary}.`,
					...(contracts.verifier === "verify-persistence.py"
						? [
								"Keep Package.swift and tests/PersistenceTests.swift outside the app target. Run swift test from the extracted folder for the supplied Swift Testing target. The reference persists locally; the starter uses memory until its assigned storage switch is completed."
							]
						: [])
				]
			: []),
		"Select an installed iOS simulator. Record the Xcode version, Swift language mode and deployment target, then build and run.",
		"Follow README.md for the project behavior and verification checks. Keep the exported source and the Xcode project together."
	];
}
