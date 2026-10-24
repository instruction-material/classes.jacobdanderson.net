"""Create ordinary Xcode app/UI-test targets from actual selected-role browser ZIPs."""
import argparse
import hashlib
import json
import re
from pathlib import Path, PurePosixPath
import zipfile


def generate(browser: Path, root: Path, *, kind="welcome", source_files=None,
             shared_files=("README.md",), ui_template=None, bundle_suffix=None):
    assert kind in ("welcome", "networking", "tracker", "swiftdata")
    assert kind == "welcome" or ui_template is not None
    assert bundle_suffix is None or re.fullmatch(r"[a-z][a-z0-9-]*", bundle_suffix)
    source_files = source_files or ("ContentView.swift", "WelcomeProfileApp.swift")
    prefix = {"welcome": "Welcome", "networking": "Networking", "tracker": "Tracker", "swiftdata": "SwiftDataTracker"}[kind]
    B = browser.resolve()
    proof = json.loads((B / f"swift-swift-{kind}-course-proof.json").read_text())
    assert len(proof["profiles"]) == 4
    assert not root.exists()
    root.mkdir(parents=True)
    objects = {}


    def oid(name):
        return hashlib.sha256(name.encode()).hexdigest()[:24].upper()


    def obj(identifier, isa, **data):
        key = oid(identifier)
        objects[key] = {"isa": isa, **data}
        return key


    def serialize(value, level=0):
        if isinstance(value, dict):
            return "{\n" + "".join(
                "  " * (level + 1) + json.dumps(k) + " = " + serialize(v, level + 1) + ";\n"
                for k, v in value.items()
            ) + "  " * level + "}"
        if isinstance(value, list):
            return "(" + ", ".join(serialize(x, level + 1) for x in value) + ")"
        if isinstance(value, int):
            return str(value)
        return json.dumps(value)


    def configs(prefix, settings):
        return obj(
            prefix + "Configs", "XCConfigurationList",
            buildConfigurations=[
                obj(prefix + name, "XCBuildConfiguration", name=name, buildSettings=settings)
                for name in ["Debug", "Release"]
            ],
            defaultConfigurationIsVisible=0, defaultConfigurationName="Debug"
        )


    project = root / (prefix + "Export.xcodeproj")
    (project / "xcshareddata/xcschemes").mkdir(parents=True)
    products, sources, targets, profiles = [], [], [], []
    attrs = {}
    for role in ["starter", "solution"]:
        profile = next(row for row in proof["profiles"] if row["role"] == role and row["width"] == 390)
        archive = B / profile["editedArchive"]
        assert hashlib.sha256(archive.read_bytes()).hexdigest() == profile["editedArchiveSha256"]
        role_dir = root / role
        role_dir.mkdir()
        assert archive.stat().st_size < 8 * 1024 * 1024
        expected = {f"{role}/{name}" for name in source_files} | set(shared_files)
        assert {file["name"] for file in profile["editedFiles"]} == expected
        with zipfile.ZipFile(archive) as z:
            assert len(z.infolist()) == len(expected)
            for entry in z.infolist():
                path = PurePosixPath(entry.filename)
                assert not path.is_absolute() and ".." not in path.parts and "\\" not in entry.filename
                assert entry.file_size < 2 * 1024 * 1024
            for file in profile["editedFiles"]:
                matches = [key for key in z.namelist() if key.endswith("/" + file["name"])]
                assert len(matches) == 1
                raw = z.read(matches[0])
                assert hashlib.sha256(raw).hexdigest() == file["sha256"]
                path = role_dir / file["name"]
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_bytes(raw)
        app_name = prefix + role.title()
        test_name = app_name + "UITests"
        source_ids = []
        for path in sorted(role_dir / role / name for name in source_files):
            ref = obj(role + path.name, "PBXFileReference", lastKnownFileType="sourcecode.swift",
                      path=str(path.relative_to(root)), sourceTree="<group>")
            sources.append(ref)
            source_ids.append(obj(role + path.name + "Build", "PBXBuildFile", fileRef=ref))
        product = obj(role + "Product", "PBXFileReference", explicitFileType="wrapper.application",
                      path=app_name + ".app", sourceTree="BUILT_PRODUCTS_DIR")
        products.append(product)
        app_id, test_id = oid(role + "Target"), oid(role + "TestTarget")
        bundle_id = f"org.example.classes.swift{kind}." + role
        if bundle_suffix:
            bundle_id += "." + bundle_suffix
        app_config = {
            "PRODUCT_NAME": app_name,
            "PRODUCT_BUNDLE_IDENTIFIER": bundle_id,
            "GENERATE_INFOPLIST_FILE": "YES",
            "INFOPLIST_KEY_UIApplicationSceneManifest_Generation": "YES",
            "INFOPLIST_KEY_UILaunchScreen_Generation": "YES",
            "CODE_SIGNING_ALLOWED": "NO"
        }
        obj(role + "Target", "PBXNativeTarget", name=app_name, productName=app_name,
            productType="com.apple.product-type.application", productReference=product,
            buildConfigurationList=configs(role + "App", app_config),
            buildPhases=[
                obj(role + "AppSources", "PBXSourcesBuildPhase", buildActionMask=2147483647,
                    files=source_ids, runOnlyForDeploymentPostprocessing=0),
                obj(role + "AppFrameworks", "PBXFrameworksBuildPhase", buildActionMask=2147483647,
                    files=[], runOnlyForDeploymentPostprocessing=0)
            ], buildRules=[], dependencies=[])
        code = r'''import XCTest

    final class WelcomeProfileUITests: XCTestCase {
        @MainActor
        private func noteEditor(in app: XCUIApplication) -> XCUIElement {
            for _ in 0..<6 {
                let field = app.textFields.firstMatch
                let area = app.textViews.firstMatch
                if field.isHittable { return field }
                if area.isHittable { return area }
                app.scrollViews.firstMatch.swipeUp()
            }
            XCTFail("The note editor must be reachable by scrolling")
            return app.textFields.firstMatch
        }

        @MainActor
        func testProfileNavigationAndState() throws {
            continueAfterFailure = false
            let app = XCUIApplication()
            app.launch()
            XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 15))
            let welcome = XCTAttachment(screenshot: app.screenshot())
            welcome.name = "Welcome screen"
            welcome.lifetime = .keepAlways
            add(welcome)
            let reference = ROLE
            if reference {
                let note = noteEditor(in: app)
                XCTAssertTrue(note.isHittable)
                note.tap()
                note.typeText(" UI verification")
                XCTAssertTrue((note.value as? String)?.contains("UI verification") == true)
                let editing = XCTAttachment(screenshot: app.screenshot())
                editing.name = "Editing note"
                editing.lifetime = .keepAlways
                add(editing)
                if app.keyboards.firstMatch.exists {
                    let done = app.buttons["Done"]
                    XCTAssertTrue(done.waitForExistence(timeout: 5))
                    done.tap()
                }
            }
            let destination = app.buttons[reference ? "Open Detailed Profile" : "Open Profile Detail"]
            for _ in 0..<6 { if destination.isHittable { break }; app.scrollViews.firstMatch.swipeUp() }
            XCTAssertTrue(destination.isHittable)
            destination.tap()
            XCTAssertTrue(app.navigationBars["Kai Rivera"].waitForExistence(timeout: 5))
            XCTAssertTrue(app.staticTexts["Photography"].exists)
            XCTAssertTrue(app.staticTexts["Running"].exists)
            let screen = XCTAttachment(screenshot: app.screenshot())
            screen.lifetime = .keepAlways
            add(screen)
            app.navigationBars.buttons.firstMatch.tap()
            XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 5))
            if reference {
                let retained = noteEditor(in: app)
                XCTAssertTrue((retained.value as? String)?.contains("UI verification") == true)
                app.terminate()
                app.launch()
                XCTAssertTrue(app.navigationBars["Welcome"].waitForExistence(timeout: 15))
                let fresh = noteEditor(in: app)
                XCTAssertEqual(fresh.value as? String,
                               "Remember to keep layouts readable on small screens.")
            }
        }
    }
    '''.replace("ROLE", "true" if role == "solution" else "false")
        if ui_template is not None:
            code = ui_template.replace("ROLE", "true" if role == "solution" else "false")
        test_file = role_dir / ("WelcomeProfileUITests.swift" if kind == "welcome" else prefix + "UITests.swift")
        test_file.write_text(code)
        test_ref = obj(role + "TestSource", "PBXFileReference", lastKnownFileType="sourcecode.swift",
                       path=str(test_file.relative_to(root)), sourceTree="<group>")
        sources.append(test_ref)
        test_product = obj(role + "TestProduct", "PBXFileReference", explicitFileType="wrapper.cfbundle",
                           path=test_name + ".xctest", sourceTree="BUILT_PRODUCTS_DIR")
        products.append(test_product)
        proxy = obj(role + "Proxy", "PBXContainerItemProxy", containerPortal=oid("Project"),
                    proxyType=1, remoteGlobalIDString=app_id, remoteInfo=app_name)
        dependency = obj(role + "Dependency", "PBXTargetDependency", target=app_id, targetProxy=proxy)
        test_config = {
            "PRODUCT_NAME": test_name,
            "PRODUCT_BUNDLE_IDENTIFIER": bundle_id + ".uitests",
            "GENERATE_INFOPLIST_FILE": "YES", "TEST_TARGET_NAME": app_name, "CODE_SIGNING_ALLOWED": "NO"
        }
        obj(role + "TestTarget", "PBXNativeTarget", name=test_name, productName=test_name,
            productType="com.apple.product-type.bundle.ui-testing", productReference=test_product,
            buildConfigurationList=configs(role + "Test", test_config),
            buildPhases=[obj(role + "TestSources", "PBXSourcesBuildPhase", buildActionMask=2147483647,
                             files=[obj(role + "TestBuild", "PBXBuildFile", fileRef=test_ref)],
                             runOnlyForDeploymentPostprocessing=0)],
            buildRules=[], dependencies=[dependency])
        targets.extend([app_id, test_id])
        attrs[test_id] = {"TestTargetID": app_id}
        app_ref = f'<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{app_id}" BuildableName="{app_name}.app" BlueprintName="{app_name}" ReferencedContainer="container:{project.name}"/>'
        test_ref_xml = f'<BuildableReference BuildableIdentifier="primary" BlueprintIdentifier="{test_id}" BuildableName="{test_name}.xctest" BlueprintName="{test_name}" ReferencedContainer="container:{project.name}"/>'
        scheme = f'''<?xml version="1.0" encoding="UTF-8"?>
    <Scheme LastUpgradeVersion="2600" version="1.3">
    <BuildAction parallelizeBuildables="NO" buildImplicitDependencies="YES"><BuildActionEntries>
    <BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">{app_ref}</BuildActionEntry>
    <BuildActionEntry buildForTesting="YES" buildForRunning="NO" buildForProfiling="NO" buildForArchiving="NO" buildForAnalyzing="YES">{test_ref_xml}</BuildActionEntry>
    </BuildActionEntries></BuildAction>
    <TestAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" shouldUseLaunchSchemeArgsEnv="YES"><Testables><TestableReference skipped="NO">{test_ref_xml}</TestableReference></Testables></TestAction>
    <LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.IDEFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="NO"><BuildableProductRunnable runnableDebuggingMode="0">{app_ref}</BuildableProductRunnable></LaunchAction>
    </Scheme>
    '''
        (project / "xcshareddata/xcschemes" / f"{app_name}.xcscheme").write_text(scheme)
        profiles.append({"role": role, "archive": str(archive), "archiveSha256": profile["editedArchiveSha256"],
                         "files": profile["editedFiles"], "scheme": app_name,
                         "bundleIdentifier": bundle_id})
    group = obj("MainGroup", "PBXGroup", children=sources + [
        obj("Products", "PBXGroup", children=products, name="Products", sourceTree="<group>")
    ], sourceTree="<group>")
    settings = {
        "SDKROOT": "iphoneos", "IPHONEOS_DEPLOYMENT_TARGET": "17.0", "SWIFT_VERSION": "6.0",
        "SWIFT_OPTIMIZATION_LEVEL": "-Onone", "CLANG_ENABLE_MODULES": "YES",
        "TARGETED_DEVICE_FAMILY": "1,2", "SUPPORTED_PLATFORMS": "iphoneos iphonesimulator",
        "ENABLE_USER_SCRIPT_SANDBOXING": "YES"
    }
    project_id = obj(
        "Project", "PBXProject", attributes={"LastUpgradeCheck": "2600", "TargetAttributes": attrs},
        buildConfigurationList=configs("Project", settings), compatibilityVersion="Xcode 14.0",
        developmentRegion="en", knownRegions=["en", "Base"], mainGroup=group,
        productRefGroup=oid("Products"), projectDirPath="", projectRoot="", targets=targets
    )
    (project / "project.pbxproj").write_text("// !$*UTF8*$!\n" + serialize({
        "archiveVersion": 1, "classes": {}, "objectVersion": 56, "objects": objects, "rootObject": project_id
    }) + "\n")
    result = {"project": str(project), "profiles": profiles, "nativeExecutionVerified": False}
    (root / "inputs.json").write_text(json.dumps(result, indent=2) + "\n")
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--browser", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(generate(args.browser, args.output.resolve())))
