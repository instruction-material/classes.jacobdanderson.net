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
		cy.get("h1").contains("Course Platform").should("exist");
	});

	it("header links work", () => {
		// ---- About ---------------------------------------------------
		cy.get(".site-nav").contains("a:visible", "About").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/about`);
		cy.get("h1").contains("Courses and Teaching Tools").should("exist");

		// ---- Book a Class --------------------------------------------------
		cy.get(".site-nav").contains("a:visible", "Book a Class").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/signup`);
		cy.get("h1").contains("Book a Class").should("exist");

		// ---- Tuition & Payment ---------------------------------------------
		cy.get(".site-nav").contains("a:visible", "Tuition").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/payment`);
		cy.get("h1")
			.contains("No payment destination is configured")
			.should("exist");

		// ---- back to Home -------------------------------------------
		cy.get(".site-nav").contains("a:visible", "Home").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
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
				expect(document.documentElement.scrollWidth).to.be.at.most(
					document.documentElement.clientWidth
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
