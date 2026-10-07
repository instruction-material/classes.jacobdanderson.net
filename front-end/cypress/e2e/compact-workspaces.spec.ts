/// <reference types="cypress" />

context("Compact content-first workspaces", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/api/**", { body: {} });
		cy.intercept("GET", "**/api/accounts/me", { body: { adminID: "synthetic-admin" } });
		cy.intercept("GET", "**/api/admins/loggedin", { body: { currentAdmin: {
			_id: "synthetic-admin", name: "Synthetic admin", email: "admin@example.invalid",
			editAdmins: false, saveEdit: "Edit"
		} } });
		cy.intercept("GET", "**/api/users/all", { body: [{ _id: "synthetic-student", name: "Ada Student", email: "student@example.invalid", courseAccess: ["python-level-1"], tutors: [], courseProgress: [] }] });
		cy.intercept("GET", "**/api/tutors", { body: [] });
		cy.intercept("GET", "**/api/admin-mail/session-notes/identities", { body: { students: [] } });
		cy.intercept("GET", "**/api/admin-mail/recipients", { body: [] });
		cy.intercept("POST", "**/api/**", { statusCode: 403, body: {} });
		cy.viewport(1440, 900);
	});
	it("opens session notes by default, with only the three working admin sections", () => {
		cy.visit("/admin");
		cy.location("pathname").should("match", /^\/admin\/mdmail\/?$/);
		cy.get(".admin-shell__nav a").then(links => expect([...links].map(link => link.textContent?.trim())).to.deep.equal(["Session notes", "People", "IDE reports"]));
		cy.get(".site-nav").should("not.contain.text", "Join class");
		cy.contains("Session-note evidence review").should("not.exist");
		cy.contains("Session-note review status unavailable").should("not.exist");
	});
	it("keeps people as compact rows with settings closed until selected", () => {
		cy.visit("/admin/people");
		cy.get(".person-details summary").contains("Ada Student").should("be.visible").click();
		cy.get(".person-tools").should("be.visible");
		cy.get(".person-advanced").first().should("not.have.attr", "open");
		cy.contains("Roster spreadsheet").should("not.exist");
		cy.contains("Course workspace").should("not.exist");
		cy.screenshot("people-compact", { capture: "viewport" });
	});
	it("sends a complete unlinked note directly while every write is intercepted", () => {
		const studentId = "a".repeat(24);
		const noteId = "c".repeat(24);
		cy.intercept("GET", "**/api/admin-mail/session-notes/identities", { body: { students: [{ studentId, name: "Synthetic Student", recipientName: "Synthetic Student" }] } });
		cy.intercept("GET", "**/api/admin-mail/recipients", { body: { recipients: [{ name: "Synthetic Student", emails: ["student@example.invalid"] }] } });
		cy.intercept("GET", "**/api/users/" + studentId + "/schedule", { body: { scheduledSessions: [] } });
		cy.intercept("GET", "**/api/users/" + studentId + "/session-notes", { body: { sessionNotes: [] } });
		cy.intercept("POST", "**/api/users/" + studentId + "/session-notes", { body: { sessionNote: { _id: noteId } } }).as("saveNote");
		cy.intercept("POST", "**/api/admin-mail/send", { body: { ok: true, operationId: "synthetic-operation", evidenceStatus: "smtp_accepted" } }).as("sendNote");
		cy.visit("/admin/mdmail");
		cy.get("#recipient-select").select("Synthetic Student");
		cy.get("#subject-date-input").invoke("val", "2026-09-30").trigger("input", { force: true });
		cy.get("#markdown-input").type("Synthetic note body");
		cy.get("#note-student").select(studentId);
		cy.get("#markdown-input").should("have.value", "Synthetic note body");
		cy.get("#note-unlinked").check();
		cy.get(".send-btn").should("have.text", "Send").should("not.be.disabled").click();
		cy.wait("@saveNote").its("request.body").should("include", { studentId, unlinked: true });
		cy.wait("@sendNote").its("request.body").should("include", { studentId, noteId, unlinked: true, subject: "Session Notes (09/30)" });
		cy.contains("Primary recipient accepted by SMTP").should("be.visible");
		cy.get('[data-testid="live-preview"]').should("not.exist");
	});
	it("uses compact stacked course and learner selectors, and puts search beside them", () => {
		cy.visit("/courses");
		cy.get("#learner-select").should("be.visible").find("option:checked").should(option => expect(option.text().trim()).to.equal("All"));
		cy.get("#course-select").should("be.visible");
		cy.get("#course-search").should("be.visible");
		cy.contains("button", "Start course").should("not.exist");
		cy.get(".course-toolbar-disclosure").should("not.exist");
		cy.get("#learner-select").select("synthetic-student");
		cy.get("#learner-select option:checked").should(option => expect(option.text().trim()).to.equal("Ada"));
		cy.screenshot("course-compact", { capture: "viewport" });
	});
	it("keeps project backup and rename out of the main IDE toolbar", () => {
		cy.visit("/ide");
		cy.get(".code-ide-workspace").should("have.class", "is-sidebar-collapsed");
		cy.window().then(win => expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2));
		cy.get(".workspace-heading__title").find('select[aria-label="Editor environment"]').should("be.visible");
		cy.get(".editor-toolbar").contains("button", "Run").should("be.visible");
		cy.get(".editor-toolbar").contains("button", "Save").should("be.visible");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").find('[aria-label="Download project ZIP"]').should("be.visible");
		cy.get("#code-ide-project-title").should("be.visible");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").should("not.exist");
		cy.get('[aria-label="Expand project sidebar"]').click();
		cy.window().then(win => expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2));
		cy.get(".code-ide-sidebar").should("be.visible").then(sidebar => expect(sidebar[0].getBoundingClientRect().width).to.be.lessThan(240));
		cy.screenshot("ide-compact", { capture: "viewport" });
	});
	for (const width of [320, 390, 768]) {
		it("keeps IDE controls touch-accessible within a " + width + "px screen", () => {
			cy.viewport(width, 800);
			cy.visit("/ide");
			cy.get(".code-ide-workspace").should("be.visible");
			cy.get(".editor-actions").should(actions => {
				for (const button of actions[0].querySelectorAll("button")) {
					const box = button.getBoundingClientRect();
					expect(box.left).to.be.at.least(0);
					expect(box.right).to.be.at.most(width);
					expect(box.width).to.be.at.least(44);
					expect(box.height).to.be.at.least(44);
				}
			});
		});
	}
	for (const viewport of [[1440, 900], [390, 844], [844, 390]]) {
		it("fits the graph in the " + viewport.join("×") + " viewport without page overflow", () => {
			cy.viewport(viewport[0], viewport[1]);
			cy.visit("/graph-sketcher");
			cy.get(".graph-canvas").should("be.visible");
			cy.window().then(win => {
				expect(win.document.documentElement.scrollHeight).to.be.at.most(win.innerHeight + 2);
				expect(win.document.documentElement.scrollWidth).to.be.at.most(win.innerWidth + 2);
				const tools = win.document.querySelector(".graph-tools")!.getBoundingClientRect();
				const canvas = win.document.querySelector(".graph-canvas-panel")!.getBoundingClientRect();
				expect(tools.bottom).to.be.at.most(canvas.top + 2);
			});
			cy.get('[aria-label="Graph settings"]').click();
			cy.get('[aria-label="Close graph settings"]').should("be.visible").click();
			cy.get(".graph-canvas-shell").trigger("wheel", { deltaY: 100, clientX: 200, clientY: 200 });
			cy.window().its("scrollY").should("equal", 0);
			cy.contains("Expand graph").should("not.exist");
			cy.contains("Saved on this device").should("not.exist");
			cy.screenshot("graph-" + viewport.join("-"), { capture: "viewport" });
		});
	}
});
