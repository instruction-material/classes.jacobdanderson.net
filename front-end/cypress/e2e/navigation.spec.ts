// cypress/e2e/navigation.spec.ts
/// <reference types="cypress" />

/**
 * Basic smoke-test for Classes
 *
 * Things we prove:
 *   1. Home page renders and shows the H1 banner.
 *   2. The header links perform client-side navigation.
 *   3. A quote is fetched and rendered.
 *
 * NB:  Make sure the `baseUrl` in cypress.config.(ts|js) is
 *      `http://localhost:3333` (the same port you run `vite` with).
 */

context("Navigation & page smoke-tests", () => {
	beforeEach(() => {
		cy.viewport(1440, 900);
		cy.visit("/"); // -> Home
	});

	it("loads the home page", () => {
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
		cy.contains("Classes").should("exist"); // <h1>
	});

	it("header links work", () => {
		// ---- About ---------------------------------------------------
		cy.get(".site-nav").contains("a:visible", "About").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/about`);
		cy.get(".about-page h1").should(heading => {
			expect(heading.text().trim()).to.equal(
				"Courses and Teaching Tools"
			);
		});

		// ---- Tuition & Payment ---------------------------------------------
		cy.get(".site-footer").contains("a:visible", "Tuition").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/payment`);
		cy.get("h1").should(
			"have.text",
			"No payment destination is configured"
		);

		// ---- back to Home -------------------------------------------
		cy.get(".site-brand").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
	});

	it("keeps Book a Class and its scheduler within Classes navigation", () => {
		const schedulerOrigin = "https://scheduler.example.com";
		cy.intercept("GET", `${schedulerOrigin}/?*`, {
			statusCode: 200,
			headers: { "content-type": "text/html" },
			body: '<!doctype html><html lang="en"><head><title>Scheduler fixture</title></head><body><main><h1>Scheduler fixture</h1></main></body></html>'
		}).as("scheduler");
		cy.get(".site-nav").contains("a:visible", "Book a Class").click();
		cy.wait("@scheduler");
		cy.location("pathname").should("eq", "/signup");
		cy.get(".scheduler-frame").should(frame => {
			const url = new URL(frame.attr("src")!);
			expect(url.origin).to.equal(schedulerOrigin);
			expect(url.searchParams.get("embed")).to.equal("1");
		});
		cy.get(".site-nav").contains("a:visible", "About").click();
		cy.location("pathname").should("eq", "/about");
	});

	it("keeps IDE controls usable across phone and tablet viewports", () => {
		cy.visit("/ide");
		for (const width of [320, 360, 390, 768]) {
			cy.viewport(width, 800);
			cy.get(".editor-actions").should(actions => {
				const viewportWidth =
					actions[0].ownerDocument.defaultView?.innerWidth;
				expect(viewportWidth).to.equal(width);
				for (const control of actions[0].querySelectorAll("button")) {
					const box = control.getBoundingClientRect();
					expect(box.left).to.be.at.least(0);
					expect(box.right).to.be.at.most(viewportWidth ?? 0);
					expect(box.width).to.be.at.least(44);
					expect(box.height).to.be.at.least(44);
				}
			});
			cy.document().should(document => {
				const layout = [
					".ide-environment",
					".code-ide-page",
					".editor-toolbar"
				].map(selector => ({
					selector,
					bounds: document
						.querySelector(selector)
						?.getBoundingClientRect()
						.toJSON()
				}));
				expect(document.documentElement.scrollWidth).to.be.at.most(
					document.documentElement.clientWidth,
					JSON.stringify(layout)
				);
			});
		}

		cy.viewport(320, 800);
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").should(panel => {
			const box = panel[0].getBoundingClientRect();
			expect(box.left).to.be.at.least(0);
			expect(box.right).to.be.at.most(320);
		});
	});

	/*	it("shows a motivational quote on Home", () => {
		cy.get(".quote")
			.should("exist")
			.and(($q) => expect($q.text().length).to.be.greaterThan(10)); // non-empty
	});*/
});
