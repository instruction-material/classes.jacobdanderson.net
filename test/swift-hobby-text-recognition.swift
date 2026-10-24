import Foundation
import Vision

var rows: [[String: Any]] = []
for path in CommandLine.arguments.dropFirst() {
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US"]
    request.usesLanguageCorrection = false
    try VNImageRequestHandler(url: URL(fileURLWithPath: path), options: [:]).perform([request])
    let text = (request.results ?? []).compactMap { result -> [String: Any]? in
        guard let item = result.topCandidates(1).first else { return nil }
        return ["text": item.string, "confidence": item.confidence,
                "x": result.boundingBox.minX, "y": result.boundingBox.minY,
                "width": result.boundingBox.width, "height": result.boundingBox.height]
    }
    rows.append(["path": path, "observations": text])
}
let data = try JSONSerialization.data(withJSONObject: rows, options: [.prettyPrinted, .sortedKeys])
FileHandle.standardOutput.write(data)

