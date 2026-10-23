import type { PythonIdeFile } from "@/modules/pythonIde";

export function swiftBuildInstructions(files: PythonIdeFile[]) {
	const source = files.filter(file => /\.swift$/i.test(file.name));
	if (!source.length)
		return ["Add Swift source before building the iOS app."];
	return [
		"Save and download the ZIP, extract it, then create an iOS App project in Xcode using SwiftUI.",
		"Replace the generated app entry point and ContentView with the selected project's Swift files. Add every remaining Swift file to the same target and keep one @main app entry point.",
		"Select an installed iOS simulator. Record the Xcode version, Swift language mode and deployment target, then build and run.",
		"Follow README.md for the project behavior and verification checks. Keep the exported source and the Xcode project together."
	];
}
