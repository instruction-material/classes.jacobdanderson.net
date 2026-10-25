import CoreGraphics
import XCTest

final class WelcomeProfileUITests: XCTestCase {
    @MainActor
    private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
        for attempt in 0..<20 {
            if element.exists && element.isHittable { return }
            let list = app.collectionViews.firstMatch
            let scroll = list.exists ? list : app.scrollViews.firstMatch
            XCTAssertTrue(scroll.exists)
            let target = element.exists ? element.frame : .zero
            let down = !target.isEmpty ? target.midY < scroll.frame.midY : attempt >= 10
            let start = scroll.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5))
            let distance = max(12, min(200, scroll.frame.height * 0.35))
            start.press(forDuration: 0.05, thenDragTo: start.withOffset(
                CGVector(dx: 0, dy: down ? distance : -distance)))
        }
        XCTAssertTrue(element.isHittable, app.debugDescription)
    }

    @MainActor
    private func retain(_ name: String, in app: XCUIApplication) {
        let image = XCTAttachment(screenshot: app.screenshot())
        image.name = name
        image.lifetime = .keepAlways
        add(image)
    }

    @MainActor
    func testProfileNavigationAndState() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        let reference = ROLE
        let longNote = LONG_NOTE_VARIANT
        XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 15))
        let heading = app.staticTexts["Welcome to Swift App Development"].firstMatch
        XCTAssertTrue(heading.waitForExistence(timeout: 5))
        XCTAssertTrue(heading.isHittable, "The Welcome heading must be visible at launch")
        retain("Welcome header at launch", in: app)
        if reference { reveal(app.staticTexts["Design"].firstMatch, in: app) }
        retain("Welcome readable content", in: app)
        var editedNote = ""
        if reference {
            let note = app.textFields.firstMatch
            reveal(note, in: app)
            note.tap()
            let addition = longNote
                ? " LONG_NOTE_BEGIN " + String(repeating: "A saved observation stays readable after navigation. ", count: 4) + "LONG_NOTE_END"
                : " UI verification"
            note.typeText(addition)
            editedNote = note.value as? String ?? ""
            XCTAssertTrue(editedNote.contains(addition))
            retain("Editing profile note", in: app)
            let done = app.buttons["Done"].firstMatch
            XCTAssertTrue(done.waitForExistence(timeout: 5))
            XCTAssertTrue(done.isHittable)
            done.tap()
            XCTAssertFalse(app.keyboards.firstMatch.exists)
        }
        let destination = app.buttons[reference ? "Open Detailed Profile" : "Open Profile Detail"]
        reveal(destination, in: app)
        destination.tap()
        XCTAssertTrue(app.navigationBars["Kai Rivera"].waitForExistence(timeout: 5))
        for interest in ["Photography", "Running", "Design"] {
            reveal(app.staticTexts[interest].firstMatch, in: app)
        }
        retain("Readable profile details", in: app)
        app.navigationBars.buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 5))
        if reference {
            let note = app.textFields.firstMatch
            reveal(note, in: app)
            XCTAssertEqual(note.value as? String, editedNote)
            retain("Retained profile note", in: app)
            app.terminate()
            app.launch()
            XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 15))
            let fresh = app.textFields.firstMatch
            reveal(fresh, in: app)
            XCTAssertEqual(fresh.value as? String,
                           "Remember to keep layouts readable on small screens.")
        }
    }
}
