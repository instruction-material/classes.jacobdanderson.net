private extension TrackerUITests {
    @MainActor
    func verifyUnavailableStorage(in app: XCUIApplication) {
        XCTAssertTrue(app.staticTexts["Tracker unavailable"].waitForExistence(timeout: 15))
        XCTAssertFalse(app.staticTexts["No items"].exists)
        let retry = button("Retry", in: app)
        XCTAssertTrue(retry.isHittable)
        retry.tap()
        XCTAssertTrue(app.staticTexts["Tracker unavailable"].waitForExistence(timeout: 5))
        XCTAssertFalse(app.textFields["New tracker item"].exists)
        let screen = XCTAttachment(screenshot: app.screenshot())
        screen.name = "Unavailable storage remains an error after Retry"
        screen.lifetime = .keepAlways
        add(screen)
        app.terminate()
        app.launch()
        XCTAssertTrue(app.staticTexts["Tracker unavailable"].waitForExistence(timeout: 15))
    }

    @MainActor
    func verifyReadOnlyStorage(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        let saved = "Saved tracker fixture"
        let field = app.textFields["New tracker item"]
        field.tap()
        field.typeText("Unsaved tracker draft")
        button("Add", in: app).tap()
        let failure = app.alerts["Changes not saved"]
        XCTAssertTrue(failure.waitForExistence(timeout: 5))
        XCTAssertTrue(failure.staticTexts["This store is read-only. Changes were not saved."].exists)
        failure.buttons["OK"].tap()
        XCTAssertEqual(field.value as? String, "Unsaved tracker draft")
        XCTAssertFalse(button("Mark Unsaved tracker draft complete", in: app).exists)
        if reference {
            let edit = button("Edit " + saved, in: app)
            reveal(edit, in: app)
            edit.tap()
            XCTAssertTrue(app.navigationBars["Edit item"].waitForExistence(timeout: 5))
            replace(app.textFields["Item title"], with: "Unsaved edited title", in: app)
            button("Save", in: app).tap()
            XCTAssertTrue(failure.waitForExistence(timeout: 5))
            failure.buttons["OK"].tap()
            XCTAssertTrue(app.navigationBars["Edit item"].exists)
            XCTAssertEqual(app.textFields["Item title"].value as? String, "Unsaved edited title")
            let draft = XCTAttachment(screenshot: app.screenshot())
            draft.name = "Failed save retains the edit draft"
            draft.lifetime = .keepAlways
            add(draft)
            button("Cancel", in: app).tap()
            XCTAssertTrue(button("Edit " + saved, in: app).waitForExistence(timeout: 5))
        }
        let toggle = button("Mark " + saved + " incomplete", in: app)
        reveal(toggle, in: app)
        toggle.tap()
        XCTAssertTrue(failure.waitForExistence(timeout: 5))
        failure.buttons["OK"].tap()
        XCTAssertTrue(button("Mark " + saved + " incomplete", in: app).exists)
        if reference {
            button("Edit " + saved, in: app).swipeLeft()
            let delete = button("Delete", in: app)
            if delete.waitForExistence(timeout: 2) { delete.tap() }
            XCTAssertTrue(failure.waitForExistence(timeout: 5))
            failure.buttons["OK"].tap()
            XCTAssertTrue(button("Edit " + saved, in: app).waitForExistence(timeout: 5))
        }
        let retained = XCTAttachment(screenshot: app.screenshot())
        retained.name = "Rejected changes retain the saved record"
        retained.lifetime = .keepAlways
        add(retained)
        app.terminate()
        app.launch()
        XCTAssertTrue(app.navigationBars["Tracker"].waitForExistence(timeout: 15))
        XCTAssertTrue(button("Mark " + saved + " incomplete", in: app).waitForExistence(timeout: 5))
        XCTAssertFalse(button("Mark Unsaved tracker draft complete", in: app).exists)
    }
}
