@MainActor
private struct ReadOnlyTrackerFixture: View {
    @State private var container: ModelContainer?
    @State private var storageError = ""

    var body: some View {
        Group {
            if let container {
                ContentView().modelContainer(container)
            } else if storageError.isEmpty {
                ProgressView("Opening isolated read-only fixture")
            } else {
                Text("Fixture setup failed: " + storageError)
            }
        }
        .task {
            guard container == nil else { return }
            do {
                let support = try FileManager.default.url(for: .applicationSupportDirectory,
                    in: .userDomainMask, appropriateFor: nil, create: true)
                let folder = support.appendingPathComponent("ReadOnlyTrackerFixture", isDirectory: true)
                try FileManager.default.createDirectory(at: folder, withIntermediateDirectories: true)
                let url = folder.appendingPathComponent("fixture.store")
                if !FileManager.default.fileExists(atPath: url.path) {
                    let writable = try TrackerPersistence.makeContainer(url: url)
                    let item = TrackerRecord(title: "Saved tracker fixture")
                    item.completed = true
                    writable.mainContext.insert(item)
                    try writable.mainContext.save()
                }
                container = try TrackerPersistence.makeContainer(url: url, allowsSave: false)
            } catch { storageError = error.localizedDescription }
        }
    }
}
