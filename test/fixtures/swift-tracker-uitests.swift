import CoreGraphics
import XCTest

final class TrackerUITests: XCTestCase {
    @MainActor
    private func button(_ label: String, in app: XCUIApplication) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label == %@", label)).firstMatch
    }
    @MainActor
    private func reveal(_ element: XCUIElement, in app: XCUIApplication) {
        let list = app.collectionViews.firstMatch
        for attempt in 0..<20 {
            let present = element.exists
            if present && element.isHittable { return }
            let viewport = list.frame
            let target = present ? element.frame : .zero
            let direction: CGFloat = present && !target.isEmpty
                ? (target.midY < viewport.midY ? 1 : -1)
                : (attempt < 10 ? -1 : 1)
            let distance = max(12, min(200, viewport.height * 0.35))
            let start = list.coordinate(withNormalizedOffset: CGVector(dx: 0.5, dy: 0.5))
            start.press(forDuration: 0.05, thenDragTo: start.withOffset(CGVector(dx: 0, dy: direction * distance)))
        }
        XCTAssertTrue(element.isHittable)
    }

    @MainActor
    private func replace(_ field: XCUIElement, with value: String, in app: XCUIApplication) {
        field.tap()
        let isCleared = {
            let text = field.value as? String ?? ""
            return text.isEmpty || text == field.placeholderValue
        }
        // Native selection may cover one word rather than the whole title.
        for _ in 0..<8 {
            if isCleared() { break }
            let before = field.value as? String ?? ""
            field.tap(withNumberOfTaps: 3, numberOfTouches: 1)
            field.typeText(String(repeating: XCUIKeyboardKey.delete.rawValue,
                                  count: max(1, before.count)))
            if !isCleared() {
                XCTAssertLessThan((field.value as? String ?? "").count, before.count,
                                  "Native deletion must make progress")
            }
        }
        XCTAssertTrue(isCleared(), "The existing edit text must be cleared through the native editor")
        if !value.isEmpty {
            field.typeText(value)
            XCTAssertEqual(field.value as? String, value)
        }
    }

    @MainActor
    func testTrackerWorkflow() throws {
        continueAfterFailure = false
        let reference = ROLE
        let persistence = SWIFT_DATA
        let longText = LONG_TEXT
        let app = XCUIApplication()
        app.launch()
        if OPEN_FAILURE {
            verifyUnavailableStorage(in: app)
            return
        }
        if READ_ONLY {
            verifyReadOnlyStorage(in: app, reference: reference)
            return
        }
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        if persistence { XCTAssertTrue(app.staticTexts["No items"].exists) }
        let addButton = button("Add", in: app)
        let field = app.textFields["New tracker item"]
        XCTAssertTrue(field.isHittable)
        XCTAssertFalse(addButton.isEnabled)
        let title = longText
            ? "LONG_TITLE_BEGIN " + String(repeating: "Readable tracker titles wrap across lines. ", count: 3) + "LONG_TITLE_END"
            : "Native tracker observation"
        field.tap()
        field.typeText("  " + title + "  ")
        XCTAssertTrue(addButton.isEnabled)
        addButton.tap()
        let toggle = button("Mark " + title + " complete", in: app)
        reveal(toggle, in: app)
        toggle.tap()
        XCTAssertTrue(button("Mark " + title + " incomplete", in: app).exists)
        var savedTitle = title
        if reference {
            let edit = button("Edit " + title, in: app)
            reveal(edit, in: app)
            edit.tap()
            XCTAssertTrue(app.navigationBars["Edit item"].waitForExistence(timeout: 5))
            let editor = app.textFields["Item title"]
            XCTAssertEqual(editor.value as? String, title)
            replace(editor, with: "", in: app)
            XCTAssertFalse(button("Save", in: app).isEnabled)
            savedTitle = title + " revised"
            editor.typeText(savedTitle)
            XCTAssertTrue(button("Save", in: app).isEnabled)
            button("Save", in: app).tap()
            XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 5))
            XCTAssertTrue(button("Mark " + savedTitle + " incomplete", in: app).exists)
            let updated = button("Edit " + savedTitle, in: app)
            reveal(updated, in: app)
            updated.tap()
            XCTAssertTrue(app.navigationBars["Edit item"].waitForExistence(timeout: 5))
            replace(app.textFields["Item title"], with: "Discard this draft", in: app)
            XCTAssertTrue(button("Cancel", in: app).isHittable)
            button("Cancel", in: app).tap()
            XCTAssertTrue(button("Edit " + savedTitle, in: app).waitForExistence(timeout: 5))
            XCTAssertFalse(button("Edit Discard this draft", in: app).exists)
            if persistence {
                app.terminate()
                app.launch()
                XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
                XCTAssertTrue(button("Edit " + savedTitle, in: app).waitForExistence(timeout: 5))
                XCTAssertTrue(button("Mark " + savedTitle + " incomplete", in: app).exists)
            }
        } else {
            XCTAssertFalse(button("Edit " + title, in: app).exists)
        }
        let list = XCTAttachment(screenshot: app.screenshot())
        list.name = longText ? "Tracker long title at largest text" : "Tracker saved state"
        list.lifetime = .keepAlways
        add(list)
        if reference {
            let row = button("Edit " + savedTitle, in: app)
            reveal(row, in: app)
            row.swipeLeft()
            let delete = button("Delete", in: app)
            if delete.waitForExistence(timeout: 2) { delete.tap() }
            XCTAssertFalse(button("Edit " + savedTitle, in: app).exists)
            if persistence { XCTAssertTrue(app.staticTexts["No items"].waitForExistence(timeout: 5)) }
        }
        app.terminate()
        app.launch()
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        XCTAssertFalse(button("Mark " + savedTitle + " incomplete", in: app).exists)
        XCTAssertFalse(button("Edit " + savedTitle, in: app).exists)
        if persistence { XCTAssertTrue(app.staticTexts["No items"].waitForExistence(timeout: 5)) }
        let fresh = XCTAttachment(screenshot: app.screenshot())
        fresh.name = "Tracker after controlled relaunch"
        fresh.lifetime = .keepAlways
        add(fresh)
    }
}
