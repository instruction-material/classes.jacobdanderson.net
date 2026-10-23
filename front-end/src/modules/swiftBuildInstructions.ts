import type { PythonIdeFile } from "@/modules/pythonIde";

export function swiftBuildInstructions(files: PythonIdeFile[]) {
	const hasNetworkingContracts = files.some(
		file => file.name === "tests/ReferenceContracts.swift"
	);
	const source = files.filter(
		file =>
			/\.swift$/i.test(file.name) &&
			file.name !== "tests/ReferenceContracts.swift"
	);
	if (!source.length)
		return ["Add Swift source before building the iOS app."];
	return [
		"Save and download the ZIP, extract it, then create an iOS App project in Xcode using SwiftUI.",
		hasNetworkingContracts
			? "Replace the generated app entry point and ContentView. Add only the four Swift files from the selected starter or solution folder to the app target and keep one @main app entry point."
			: "Replace the generated app entry point and ContentView with the selected project's Swift files. Add every remaining Swift file to the same target and keep one @main app entry point.",
		...(hasNetworkingContracts
			? [
					"Keep tests/ReferenceContracts.swift outside the app target; it has a separate command-line entry point. Run python3 verify-networking.py from the extracted folder to check the selected role's client and store."
				]
			: []),
		"Select an installed iOS simulator. Record the Xcode version, Swift language mode and deployment target, then build and run.",
		"Follow README.md for the project behavior and verification checks. Keep the exported source and the Xcode project together."
	];
}
