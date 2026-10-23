import type { PythonIdeFile } from "@/modules/pythonIde";

export const swiftStarterCode = `import SwiftUI

struct ContentView: View {
    var body: some View {
        Text("Hello, SwiftUI!")
            .padding()
    }
}
`;

export const swiftWorkspaceReadme = `# SwiftUI workspace

Create an iOS App project in Xcode using SwiftUI. Replace its generated app
entry point and ContentView with SwiftWorkspaceApp.swift and ContentView.swift
from this ZIP. Keep one @main app entry point in the target.

Select an installed iOS simulator, build and run. The screen shows Hello, SwiftUI!.
Record the Xcode version, Swift language mode and iOS deployment target.

For an imported course project, follow its README and use all Swift files from
the selected starter or solution role in the same iOS target.
`;

export function swiftStarterFiles(): PythonIdeFile[] {
	return [
		{ name: "ContentView.swift", content: swiftStarterCode },
		{
			name: "SwiftWorkspaceApp.swift",
			content: `import SwiftUI

@main
struct SwiftWorkspaceApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}
`
		},
		{ name: "README.md", content: swiftWorkspaceReadme }
	];
}
