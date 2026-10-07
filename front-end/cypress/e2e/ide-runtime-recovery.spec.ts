/// <reference types="cypress" />

interface SeedProjectOptions {
	code: string;
	id: string;
	title: string;
}

function seedPgZeroProject(window: Window, options: SeedProjectOptions) {
	const timestamp = new Date().toISOString();
	window.localStorage.setItem(
		"classes-python-ide-projects:anonymous",
		JSON.stringify([
			{
				_id: options.id,
				activeFileName: "main.py",
				createdAt: timestamp,
				files: [{ content: options.code, name: "main.py" }],
				mode: "pgzero",
				shared: false,
				title: options.title,
				updatedAt: timestamp
			}
		])
	);
}

function visitSeededPgZeroProject(options: SeedProjectOptions) {
	cy.visit("/ide", {
		onBeforeLoad(window) {
			seedPgZeroProject(window, options);
		}
	});
	cy.get('[aria-label="Expand project sidebar"]').click();
	cy.get(".project-button.is-active span").should("have.text", options.title);
	cy.get("button.run-control").should("be.enabled").and("have.text", "Run");
}

function waitForRuntimeStatus(status: string) {
	cy.get("[data-testid='ide-run-status']", { timeout: 120_000 }).should(
		"have.text",
		status
	);
}

function runtimeCanvas() {
	return cy
		.get<HTMLIFrameElement>('iframe[title="Isolated Python output"]')
		.should("have.attr", "sandbox", "allow-scripts")
		.then(() =>
			cy.get<HTMLIFrameElement>('iframe[title="Isolated Python output"]')
		)
		.its("0.contentDocument.body")
		.should("not.be.empty")
		.then(body =>
			cy.wrap(body).find<HTMLCanvasElement>("canvas.turtle-canvas")
		);
}

const minimalGameCode = `import pgzrun

WIDTH = 320
HEIGHT = 200

def draw():
    screen.fill("navy")

pgzrun.go()
`;

const pointerGameCode = `import pgzrun

WIDTH = 320
HEIGHT = 200
background_color = "black"

def draw():
    screen.fill(background_color)

def on_mouse_down(pos, button):
    global background_color
    background_color = "red"

def on_mouse_up(pos, button):
    global background_color
    background_color = "lime"

pgzrun.go()
`;

context("IDE runtime recovery", () => {
	it("retries course assets on the next explicit game run", () => {
		let allowManifest = false;
		let blockedManifestRequests = 0;
		let manifestRequests = 0;
		let requestsAfterFailure = 0;

		for (const manifestPath of [
			"/ide/assets/manifest.json",
			"/python-ide/assets/manifest.json"
		]) {
			cy.intercept("GET", manifestPath, request => {
				manifestRequests += 1;
				if (!allowManifest) {
					blockedManifestRequests += 1;
					request.reply({
						body: {},
						statusCode: 503,
						headers: { "access-control-allow-origin": "*" }
					});
					return;
				}
				request.reply({
					headers: {
						"access-control-allow-origin": "*",
						"cross-origin-resource-policy": "cross-origin"
					},
					body: {
						assets: [
							{
								height: 1,
								mimeType: "image/png",
								name: "images/runtime-check.png",
								url: "/ide/assets/images/runtime-check.png",
								width: 1
							}
						]
					},
					statusCode: 200
				});
			});
		}

		visitSeededPgZeroProject({
			code: minimalGameCode,
			id: "local-runtime-asset-retry",
			title: "Asset Retry Check"
		});

		cy.get("button.run-control").click();
		waitForRuntimeStatus("Game running");
		cy.then(() => {
			expect(blockedManifestRequests).to.be.at.least(2);
			requestsAfterFailure = manifestRequests;
			allowManifest = true;
		});
		cy.get("button.run-control").click();
		cy.get("button.run-control").should("have.text", "Run").click();
		waitForRuntimeStatus("Game running");
		cy.get(".output-panel").should(
			"contain.text",
			"Loaded 1 shared PyGame Zero assets."
		);
		cy.get(".output-line--stderr").should("not.exist");
		cy.then(() => {
			expect(manifestRequests).to.be.greaterThan(requestsAfterFailure);
		});
	});

	it("delivers a mouse release after the pointer leaves the game canvas", () => {
		visitSeededPgZeroProject({
			code: pointerGameCode,
			id: "local-runtime-pointer-release",
			title: "Pointer Release Check"
		});

		cy.get("button.run-control").click();
		waitForRuntimeStatus("Game running");
		runtimeCanvas().trigger("mousedown", {
			eventConstructor: "MouseEvent",
			button: 0,
			buttons: 1,
			clientX: 80,
			clientY: 80
		});
		runtimeCanvas().should(canvas => {
			const pixel = canvas[0]
				.getContext("2d")!
				.getImageData(10, 10, 1, 1).data;
			expect(Array.from(pixel)).to.deep.equal([255, 0, 0, 255]);
		});
		cy.window().trigger("mouseup", {
			eventConstructor: "MouseEvent",
			button: 0,
			buttons: 0,
			clientX: 80,
			clientY: 80
		});
		runtimeCanvas().should(canvas => {
			const pixel = canvas[0]
				.getContext("2d")!
				.getImageData(10, 10, 1, 1).data;
			expect(Array.from(pixel)).to.deep.equal([0, 255, 0, 255]);
		});
	});
});
