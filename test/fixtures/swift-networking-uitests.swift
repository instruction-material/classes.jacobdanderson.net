import XCTest

final class NetworkingUITests: XCTestCase {
    @MainActor
    private func row(_ title: String, in app: XCUIApplication) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label CONTAINS %@", title)).firstMatch
    }

    @MainActor
    func testReferenceFlow() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        let reference = ROLE
        let longData = LONG_DATA
        XCTAssertTrue(app.navigationBars["Reference"].waitForExistence(timeout: 15))
        let firstTitle = longData ? "LONG_TITLE_BEGIN" : "Sketch a readable screen"
        XCTAssertTrue(row(firstTitle, in: app).waitForExistence(timeout: 10))
        XCTAssertTrue(app.buttons["Refresh"].exists)
        app.buttons["Refresh"].tap()
        XCTAssertTrue(row(firstTitle, in: app).waitForExistence(timeout: 10))
        if reference {
            XCTAssertTrue(app.buttons["Sample data"].exists)
            XCTAssertTrue(app.buttons["Live data"].exists)
            let search = app.searchFields.firstMatch
            for _ in 0..<4 {
                if search.isHittable { break }
                app.swipeDown()
            }
            XCTAssertTrue(search.isHittable)
            search.tap()
            search.typeText("  hTtP  ")
            XCTAssertTrue(row("Check an HTTP response", in: app).waitForExistence(timeout: 5))
            XCTAssertFalse(row("Keep state predictable", in: app).exists)
            let clearSearch = search.buttons["Clear text"]
            XCTAssertTrue(clearSearch.waitForExistence(timeout: 5))
            XCTAssertTrue(clearSearch.isHittable)
            clearSearch.tap()
            XCTAssertTrue(row(firstTitle, in: app).waitForExistence(timeout: 5))
            search.typeText("zz-no-reference-match-zz")
            XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label BEGINSWITH %@", "No Results")).firstMatch.waitForExistence(timeout: 5))
            XCTAssertFalse(row("Check an HTTP response", in: app).exists)
            XCTAssertTrue(clearSearch.waitForExistence(timeout: 5))
            XCTAssertTrue(clearSearch.isHittable)
            clearSearch.tap()
            XCTAssertTrue(row(firstTitle, in: app).waitForExistence(timeout: 5))
            let dismissSearch = app.buttons.matching(
                NSPredicate(format: "label == %@ OR label == %@", "Cancel", "close")
            ).firstMatch
            XCTAssertTrue(dismissSearch.waitForExistence(timeout: 5))
            XCTAssertTrue(dismissSearch.isHittable)
            dismissSearch.tap()
            XCTAssertTrue(row(firstTitle, in: app).waitForExistence(timeout: 5))
            let second = row("Check an HTTP response", in: app)
            for _ in 0..<24 {
                if second.exists && second.isHittable { break }
                app.swipeUp()
            }
            XCTAssertTrue(second.isHittable)
            let first = row(firstTitle, in: app)
            for _ in 0..<24 {
                if first.exists && first.isHittable { break }
                app.swipeDown()
            }
            XCTAssertTrue(first.isHittable)
        }
        let list = XCTAttachment(screenshot: app.screenshot())
        list.name = longData ? "Long titles at largest text" : "Reference list"
        list.lifetime = .keepAlways
        add(list)
        row(firstTitle, in: app).tap()
        XCTAssertTrue(app.navigationBars["Detail"].waitForExistence(timeout: 5))
        if longData {
            XCTAssertTrue(app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "LONG_BODY_END")).firstMatch.exists)
            for _ in 0..<24 {
                if reference && app.staticTexts["Entry #1"].isHittable { break }
                app.scrollViews.firstMatch.swipeUp()
            }
            if reference { XCTAssertTrue(app.staticTexts["Entry #1"].isHittable) }
        } else {
            XCTAssertTrue(app.staticTexts["Group related information and keep one clear title."].exists)
        }
        let detail = XCTAttachment(screenshot: app.screenshot())
        detail.name = longData ? "Long body end at largest text" : "Entry detail"
        detail.lifetime = .keepAlways
        add(detail)
        app.navigationBars["Detail"].buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Reference"].waitForExistence(timeout: 5))
        XCTAssertTrue(row(firstTitle, in: app).exists)
    }
}
