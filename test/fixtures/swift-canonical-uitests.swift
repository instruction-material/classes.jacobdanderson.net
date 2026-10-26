import CoreGraphics
import XCTest

private func courseScrollMovement(viewport: CGRect, target: CGRect, attempt: Int) -> CGFloat {
    if target.isEmpty { return attempt < 12 ? -150 : 150 }
    let spareHeight = viewport.height - target.height
    if spareHeight >= 0 && spareHeight < 120 && !viewport.contains(target) {
        // Center tall content instead of jumping past its narrow readable interval.
        return max(-180, min(180, viewport.midY - target.midY))
    }
    if target.maxY > viewport.maxY {
        return -min(180, max(120, target.maxY - viewport.maxY + 8))
    }
    if target.minY < viewport.minY {
        return min(180, max(120, viewport.minY - target.minY + 8))
    }
    return attempt < 12 ? -120 : 120
}

private func courseScrollStart(viewport: CGRect, target: CGRect, movement: CGFloat) -> CGPoint {
    let visible = viewport.insetBy(dx: 16, dy: 24).intersection(target)
    if !visible.isNull && visible.width >= 32 && visible.height >= 32 {
        return CGPoint(x: visible.midX, y: visible.midY)
    }
    let inset = min(80, viewport.height / 4)
    return CGPoint(
        x: viewport.midX,
        y: movement < 0 ? viewport.maxY - inset : viewport.minY + inset)
}

final class CanonicalCourseUITests: XCTestCase {
    @MainActor
    private func selectTab(_ title: String, in app: XCUIApplication,
                           displaying content: XCUIElement? = nil) {
        let tab = app.tabBars.buttons[title]
        XCTAssertTrue(tab.waitForExistence(timeout: 5))
        XCTAssertTrue(tab.isHittable)
        // Keep contact longer than the 50 ms tap in the captured failure.
        tab.press(forDuration: 0.15)
        let destination = content ?? app.navigationBars[title]
        XCTAssertTrue(destination.waitForExistence(timeout: 5))
        XCTAssertTrue(tab.isSelected)
    }

    @MainActor
    private func button(_ title: String, in app: XCUIApplication) -> XCUIElement {
        app.buttons.matching(NSPredicate(format: "label CONTAINS %@", title)).firstMatch
    }

    @MainActor
    private func reveal(_ element: XCUIElement, in app: XCUIApplication, fully: Bool = false) {
        for attempt in 0..<24 {
            let bounds = app.frame
            let navigation = app.navigationBars.firstMatch
            let top = navigation.exists ? max(bounds.minY, navigation.frame.maxY) : bounds.minY
            let tabs = app.tabBars.buttons.allElementsBoundByIndex.map { $0.frame }
            let bottom = tabs.filter { !$0.isEmpty && $0.minY > top }.map { $0.minY }.min() ?? bounds.maxY
            let viewport = CGRect(x: bounds.minX, y: top, width: bounds.width, height: max(1, bottom - top))
            let target = element.exists ? element.frame : .zero
            if element.exists && element.isHittable && (!fully || viewport.contains(target)) { return }

            let movement = courseScrollMovement(viewport: viewport, target: target, attempt: attempt)
            // Start within visible content, clear of edge controls and the map.
            let origin = courseScrollStart(viewport: viewport, target: target, movement: movement)
            let start = app.coordinate(withNormalizedOffset: .zero).withOffset(
                CGVector(dx: origin.x - bounds.minX, dy: origin.y - bounds.minY))
            start.press(
                forDuration: 0.05,
                thenDragTo: start.withOffset(CGVector(dx: 0, dy: movement)),
                withVelocity: .slow,
                thenHoldForDuration: 0.4)
        }
        retain("Unreachable course content", in: app)
        XCTFail("The requested content is not reachable: \(element.debugDescription)")
    }

    @MainActor
    private func retain(_ name: String, in app: XCUIApplication) {
        let attachment = XCTAttachment(screenshot: app.screenshot())
        attachment.name = name
        attachment.lifetime = .keepAlways
        add(attachment)
    }

    @MainActor
    private func revealFully(_ element: XCUIElement, in app: XCUIApplication) {
        reveal(element, in: app, fully: true)
    }

    @MainActor
    private func gallery(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Gallery"].waitForExistence(timeout: 15))
        let photo = app.segmentedControls.buttons["Photo"]
        XCTAssertTrue(photo.isHittable)
        photo.tap()
        XCTAssertTrue(button("Sunset Poster", in: app).waitForExistence(timeout: 5))
        XCTAssertFalse(button("Studio Desk", in: app).exists)
        let workspace = app.segmentedControls.buttons["Workspace"]
        XCTAssertTrue(workspace.isHittable)
        workspace.tap()
        let desk = button("Studio Desk", in: app)
        reveal(desk, in: app)
        XCTAssertFalse(button("Sunset Poster", in: app).exists)
        let cardTitle = app.staticTexts["Studio Desk"].firstMatch
        revealFully(cardTitle, in: app)
        retain("Complete Gallery card title", in: app)
        retain("Filtered gallery", in: app)
        desk.tap()
        XCTAssertTrue(app.navigationBars["Studio Desk"].waitForExistence(timeout: 5))
        let detail = reference
            ? "This entry works well for discussing composition and app branding."
            : "A clean desk setup for editing and sketching."
        revealFully(app.staticTexts[detail], in: app)
        retain("Complete Gallery description", in: app)
        if reference {
            let favorite = button("Add Favorite", in: app)
            revealFully(favorite, in: app)
            retain("Complete Gallery favorite action", in: app)
            favorite.tap()
            XCTAssertTrue(button("Remove Favorite", in: app).waitForExistence(timeout: 5))
        }
        retain("Gallery detail and favorite", in: app)
        app.navigationBars.buttons.firstMatch.tap()
        XCTAssertTrue(app.navigationBars["Gallery"].waitForExistence(timeout: 5))
        if reference { XCTAssertTrue(app.staticTexts["1 favorites"].exists) }
        XCTAssertTrue(app.segmentedControls.buttons["Workspace"].isSelected)
        app.segmentedControls.buttons["All"].tap()
        reveal(button("Sunset Poster", in: app), in: app)
    }

    @MainActor
    private func hobby(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        selectTab("Schedule", in: app)
        XCTAssertTrue(app.navigationBars["Schedule"].waitForExistence(timeout: 5))
        reveal(app.staticTexts["Tuesday"], in: app)
        let empty = reference ? "No Favorites Yet" : "Favorites Coming Soon"
        selectTab("Favorites", in: app, displaying: app.staticTexts[empty])
        XCTAssertTrue(app.staticTexts[empty].waitForExistence(timeout: 5))
        retain("Hobby empty favorites", in: app)
        selectTab("Home", in: app)
        if !reference { return }
        let activity = button("Photo Walk", in: app)
        reveal(activity, in: app)
        activity.tap()
        XCTAssertTrue(app.navigationBars["Photo Walk"].waitForExistence(timeout: 5))
        revealFully(app.staticTexts["Scout a neighborhood and collect strong compositions."], in: app)
        retain("Complete Hobby summary", in: app)
        revealFully(app.staticTexts["Scheduled for Tuesday"], in: app)
        retain("Complete Hobby schedule", in: app)
        let save = button("Save Favorite", in: app)
        revealFully(save, in: app)
        retain("Complete Hobby save action", in: app)
        save.tap()
        let remove = button("Remove Favorite", in: app)
        XCTAssertTrue(remove.waitForExistence(timeout: 5))
        revealFully(remove, in: app)
        retain("Complete Hobby remove action", in: app)
        retain("Hobby saved detail", in: app)
        app.navigationBars.buttons.firstMatch.tap()
        selectTab("Favorites", in: app, displaying: app.staticTexts["Photo Walk"])
        XCTAssertTrue(app.staticTexts["Photo Walk"].waitForExistence(timeout: 5))
        retain("Hobby shared favorite state", in: app)
        app.terminate()
        app.launch()
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        selectTab("Favorites", in: app, displaying: app.staticTexts[empty])
        XCTAssertTrue(app.staticTexts[empty].waitForExistence(timeout: 5))
    }

    @MainActor
    private func map(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Places"].waitForExistence(timeout: 15))
        let cafe = app.buttons.matching(
            NSPredicate(format: "label CONTAINS %@", "Neighborhood Cafe")).firstMatch
        revealFully(cafe, in: app)
        cafe.tap()
        let detail = reference
            ? "Sketchbook break: draw one detail from the surroundings."
            : "No visit notes yet."
        revealFully(app.staticTexts[detail], in: app)
        retain("Selected local place", in: app)
        if reference {
            let harbor = app.buttons.matching(
                NSPredicate(format: "label CONTAINS %@", "Harbor Overlook")).firstMatch
            revealFully(harbor, in: app)
            harbor.tap()
            revealFully(app.staticTexts["Photo plan: compare the light before and after sunset."], in: app)
            XCTAssertFalse(app.staticTexts[detail].exists)
            retain("Changed selected place", in: app)
        }
    }

    @MainActor
    private func capstone(in app: XCUIApplication, reference: Bool) {
        XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
        if reference {
            let task = app.switches["Prepare TestFlight build"]
            reveal(task, in: app)
            XCTAssertEqual(task.value as? String, "0")
            task.coordinate(withNormalizedOffset: CGVector(dx: 0.9, dy: 0.5)).tap()
            let checked = NSPredicate(format: "value == %@", "1")
            expectation(for: checked, evaluatedWith: task)
            waitForExpectations(timeout: 5)
            XCTAssertEqual(task.value as? String, "1")
        } else {
            revealFully(app.staticTexts["Prepare TestFlight build"], in: app)
        }
        retain("Capstone checklist", in: app)
        selectTab("Explore", in: app)
        XCTAssertTrue(app.navigationBars["Explore"].waitForExistence(timeout: 5))
        let explore = reference ? "Dashboard summary" : "Explore Screen Placeholder"
        reveal(app.staticTexts[explore], in: app)
        selectTab("Settings", in: app)
        XCTAssertTrue(app.navigationBars["Settings"].waitForExistence(timeout: 5))
        let metadata = reference
            ? app.staticTexts.matching(NSPredicate(format: "label CONTAINS %@", "Internal TestFlight")).firstMatch
            : app.staticTexts["Settings Placeholder"]
        revealFully(metadata, in: app)
        retain("Capstone informational metadata", in: app)
        selectTab("Home", in: app)
        if reference {
            let task = app.switches["Prepare TestFlight build"]
            reveal(task, in: app)
            XCTAssertEqual(task.value as? String, "1")
            app.terminate()
            app.launch()
            XCTAssertTrue(app.navigationBars["Home"].waitForExistence(timeout: 15))
            reveal(app.switches["Prepare TestFlight build"], in: app)
            XCTAssertEqual(app.switches["Prepare TestFlight build"].value as? String, "0")
        }
    }

    @MainActor
    func testCourseWorkflow() throws {
        continueAfterFailure = false
        let app = XCUIApplication()
        app.launch()
        let reference = ROLE
        switch COURSE {
        case 0: gallery(in: app, reference: reference)
        case 1: hobby(in: app, reference: reference)
        case 2: map(in: app, reference: reference)
        case 3: capstone(in: app, reference: reference)
        default: XCTFail("Unknown pinned Swift course")
        }
    }
}
