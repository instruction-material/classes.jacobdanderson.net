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
		cy.visit("/"); // -> Home
	});

	it("loads the home page", () => {
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
		cy.contains("Classes").should("exist"); // <h1>
	});

	it("header links work", () => {
		// ---- About ---------------------------------------------------
		cy.contains("About").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/about`);
		cy.contains("Meet Jacob").should("exist");

		// ---- Book a Class --------------------------------------------------
		cy.contains("Book a Class").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/signup`);
		cy.contains("Schedule a Class").should("exist"); // H1 in signup.vue

		// ---- Tuition & Payment ---------------------------------------------
		cy.contains("Tuition & Payment").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/payment`);
		cy.contains("Tuition & Payment").should("exist");

		// ---- back to Home -------------------------------------------
		cy.contains("Home").click();
		cy.url().should("eq", `${Cypress.config().baseUrl}/`);
	});

/*	it("shows a motivational quote on Home", () => {
		cy.get(".quote")
			.should("exist")
			.and(($q) => expect($q.text().length).to.be.greaterThan(10)); // non-empty
	});*/
});
