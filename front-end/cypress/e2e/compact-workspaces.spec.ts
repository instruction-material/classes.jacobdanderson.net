/// <reference types="cypress" />

context("Compact content-first workspaces", () => {
	beforeEach(() => {
		cy.intercept("GET", "**/api/**", { body: {} });
		cy.intercept("GET", "**/api/accounts/me", {
			body: { adminID: "synthetic-admin" }
		});
		cy.intercept("GET", "**/api/admins/loggedin", {
			body: {
				currentAdmin: {
					_id: "synthetic-admin",
					name: "Synthetic admin",
					email: "admin@example.invalid",
					editAdmins: false,
					saveEdit: "Edit"
				}
			}
		});
		cy.intercept("GET", "**/api/users/all*", {
			body: [
				{
					_id: "synthetic-student",
					name: "Ada Student",
					email: "student@example.invalid",
					courseAccess: ["python-level-1"],
					tutors: [],
					courseProgress: []
				},
				{
					_id: "synthetic-other",
					name: "Grace Student",
					email: "other@example.invalid",
					courseAccess: ["scratch-level-1"],
					tutors: [],
					courseProgress: []
				}
			]
		});
		cy.intercept("GET", "**/api/tutors", { body: [] });
		cy.intercept("GET", "**/api/course-access/codes", {
			body: { codes: [] }
		});
		cy.intercept("GET", "**/api/admin-mail/session-notes/identities", {
			body: { students: [] }
		});
		cy.intercept("GET", "**/api/admin-mail/session-notes/sending-status", {
			body: { sendingPaused: false }
		}).as("sendingStatus");
		cy.intercept("GET", "**/api/admin-mail/recipients", { body: [] });
		cy.intercept("POST", "**/api/**", { statusCode: 403, body: {} });
		cy.viewport(1440, 900);
	});
	it("opens session notes by default, with only the three working admin sections", () => {
		cy.visit("/admin");
		cy.location("pathname").should("match", /^\/admin\/mdmail\/?$/);
		cy.get(".admin-shell__nav a").then(links =>
			expect(
				[...links].map(link => link.textContent?.trim())
			).to.deep.equal(["Session notes", "People", "IDE reports"])
		);
		cy.get(".site-nav").should("not.contain.text", "Join class");
		cy.contains("Session-note evidence review").should("not.exist");
		cy.contains("Session-note review status unavailable").should(
			"not.exist"
		);
	});
	it("shows one selected student with account settings closed", () => {
		cy.visit("/admin/people");
		cy.get(".learner-selector select")
			.should("be.visible")
			.select("synthetic-student");
		cy.get(".learner-content")
			.should("have.length", 1)
			.within(() => {
				cy.contains("a", "Python Level 1").should("be.visible");
				cy.get(
					".person-advanced > .workspace-disclosure__trigger"
				).should("have.attr", "aria-expanded", "false");
			});
		cy.get(".learner-selector select").select("synthetic-other");
		cy.get(".learner-content").within(() => {
			cy.contains("a", "Scratch Level 1").should("be.visible");
			cy.contains("a", "Python Level 1").should("not.exist");
		});
		cy.get(".person-details").should("not.exist");
		cy.get(".tutor-management > .workspace-disclosure__trigger").should(
			"have.attr",
			"aria-expanded",
			"false"
		);
		cy.contains("Roster spreadsheet").should("not.exist");
		cy.contains("Course workspace").should("not.exist");
		cy.screenshot("people-compact", { capture: "viewport" });
	});
	it("sends a complete unlinked note directly while every write is intercepted", () => {
		const studentId = "a".repeat(24);
		const noteId = "c".repeat(24);
		cy.intercept("GET", "**/api/admin-mail/session-notes/identities", {
			body: {
				students: [
					{
						studentId,
						name: "Synthetic Student",
						recipientName: "Synthetic Student"
					}
				]
			}
		});
		cy.intercept("GET", "**/api/admin-mail/recipients", {
			body: {
				recipients: [
					{
						name: "Synthetic Student",
						emails: ["student@example.invalid"]
					}
				]
			}
		});
		cy.intercept("GET", `**/api/users/${studentId}/schedule`, {
			body: { scheduledSessions: [] }
		});
		cy.intercept("GET", `**/api/users/${studentId}/session-notes/recent`, {
			body: {
				sessionNotes: [
					{
						_id: "b".repeat(24),
						studentId,
						scheduledSessionId: null,
						studentName: "Synthetic Student",
						primaryEmail: "student@example.invalid",
						ccEmails: [],
						subject: "Synthetic saved note",
						sessionDate: "2026-10-01T12:00:00Z",
						markdown: "Synthetic saved history body",
						createdAt: "2026-10-01T18:00:00Z",
						updatedAt: "2026-10-01T18:00:00Z"
					}
				]
			}
		}).as("recentNotes");
		cy.intercept("POST", `**/api/users/${studentId}/session-notes`, {
			body: { sessionNote: { _id: noteId } }
		}).as("saveNote");
		cy.intercept("POST", "**/api/admin-mail/send", {
			body: {
				ok: true,
				operationId: "synthetic-operation",
				evidenceStatus: "smtp_accepted",
				archivalStatus: "archived"
			}
		}).as("sendNote");
		cy.visit("/admin/mdmail");
		cy.wait("@sendingStatus")
			.its("response.body.sendingPaused")
			.should("eq", false);
		cy.get("#recipient-select").select(studentId);
		cy.wait("@recentNotes").its("response.statusCode").should("eq", 200);
		cy.get(".history-note").should("have.length", 1);
		cy.contains(
			".history-note__body",
			"Synthetic saved history body"
		).should("be.visible");
		cy.get("#subject-date-input")
			.invoke("val", "2026-09-30")
			.trigger("input", { force: true });
		cy.get("#markdown-input").type("Synthetic note body");
		cy.get("#markdown-input").should("have.value", "Synthetic note body");
		cy.get('[data-testid="preview-toggle"]').click();
		cy.get("#markdown-input").should("not.be.visible");
		cy.get('[data-testid="live-preview-body"]')
			.should("be.visible")
			.and("contain.text", "Synthetic note body");
		cy.get('[data-testid="live-preview-body"]').should(
			"not.contain.text",
			"Verify homework"
		);
		cy.screenshot("session-note-preview", { capture: "viewport" });
		cy.get('[data-testid="compose-toggle"]').click();
		cy.get('[data-testid="live-preview"]').should("not.exist");
		cy.get("#markdown-input")
			.should("be.visible")
			.and("have.value", "Synthetic note body");
		cy.screenshot("session-note-compose", { capture: "viewport" });
		cy.get(
			"#note-student, #note-session, #note-unlinked, #saved-note"
		).should("not.exist");
		cy.contains("Message type").should("not.exist");
		cy.get(".send-btn")
			.should("have.text", "Send")
			.should("not.be.disabled")
			.click();
		cy.wait("@saveNote")
			.its("request.body")
			.should("include", { studentId, unlinked: true });
		cy.wait("@sendNote").its("request.body").should("include", {
			studentId,
			noteId,
			unlinked: true,
			subject: "Session Notes (09/30)"
		});
		cy.get("@saveNote")
			.its("request.body.markdown")
			.should("eq", "Synthetic note body");
		cy.get("@sendNote")
			.its("request.body")
			.should("not.have.property", "reviewWarnings");
		cy.contains(
			"Submitted successfully; Sent copy saved. Recipient delivery is not tracked."
		).should("be.visible");
		cy.get('[data-testid="live-preview"]').should("not.exist");
	});
	it("uses compact stacked course and learner selectors, and puts search beside them", () => {
		cy.visit("/courses");
		cy.get("#learner-select")
			.should("be.visible")
			.find("option:checked")
			.should(option => expect(option.text().trim()).to.equal("All"));
		cy.get("#course-select").should("be.visible");
		cy.get("#course-search").should("be.visible");
		cy.contains("button", "Start course").should("not.exist");
		cy.get(".course-toolbar-disclosure").should("not.exist");
		cy.get("#learner-select").select("synthetic-student");
		cy.get("#learner-select option:checked").should(option =>
			expect(option.text().trim()).to.equal("Ada")
		);
		cy.screenshot("course-compact", { capture: "viewport" });
	});
	it("keeps project backup and rename out of the main IDE toolbar", () => {
		cy.visit("/ide");
		cy.get(".code-ide-workspace", { timeout: 15_000 }).should(
			"have.class",
			"is-sidebar-collapsed"
		);
		cy.window().then(win =>
			expect(win.document.documentElement.scrollWidth).to.be.at.most(
				win.innerWidth + 2
			)
		);
		cy.get(".workspace-heading__title")
			.find('select[aria-label="Editor environment"]')
			.should("be.visible");
		cy.get(".editor-toolbar")
			.contains("button", "Run")
			.should("be.visible");
		cy.get(".editor-toolbar")
			.contains("button", "Save")
			.should("be.visible");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel")
			.find('[aria-label="Download project ZIP"]')
			.should("be.visible");
		cy.get("#code-ide-project-title").should("be.visible");
		cy.get('button[aria-label="IDE settings"]').click();
		cy.get("#code-ide-settings-panel").should("not.exist");
		cy.get('[aria-label="Expand project sidebar"]').click();
		cy.window().then(win =>
			expect(win.document.documentElement.scrollWidth).to.be.at.most(
				win.innerWidth + 2
			)
		);
		cy.get(".code-ide-sidebar")
			.should("be.visible")
			.then(sidebar =>
				expect(sidebar[0].getBoundingClientRect().width).to.be.lessThan(
					240
				)
			);
		cy.screenshot("ide-compact", { capture: "viewport" });
	});
	for (const width of [320, 390, 768]) {
		it(`keeps IDE controls touch-accessible within a ${width}px screen`, () => {
			cy.viewport(width, 800);
			cy.visit("/ide");
			cy.get(".code-ide-workspace", { timeout: 15_000 }).should(
				"be.visible"
			);
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
	for (const viewport of [
		[1440, 900],
		[390, 844],
		[844, 390]
	]) {
		it(`fits the graph in the ${viewport.join("×")} viewport without page overflow`, () => {
			cy.viewport(viewport[0], viewport[1]);
			cy.visit("/graph-sketcher");
			cy.get(".graph-sketcher-page").should(page => {
				expect((page[0] as HTMLElement).style.height).to.match(
					/^\d+(?:\.\d+)?px$/
				);
			});
			cy.get(".graph-canvas").should("be.visible");
			cy.window().then(win => {
				expect(win.document.documentElement.scrollHeight).to.be.at.most(
					win.innerHeight + 2
				);
				expect(win.document.documentElement.scrollWidth).to.be.at.most(
					win.innerWidth + 2
				);
				const tools = win.document
					.querySelector(".graph-tools")!
					.getBoundingClientRect();
				const canvas = win.document
					.querySelector(".graph-canvas-panel")!
					.getBoundingClientRect();
				expect(tools.right).to.be.at.most(canvas.left + 2);
				expect(tools.left).to.be.at.most(16);
				expect(Math.abs(tools.top - canvas.top)).to.be.at.most(2);
			});
			cy.get('[aria-label="Graph settings"]').click();
			cy.get('[aria-label="Close graph settings"]')
				.should("be.visible")
				.click();
			cy.get(".graph-canvas-shell").trigger("wheel", {
				deltaY: 100,
				clientX: 200,
				clientY: 200
			});
			cy.window().its("scrollY").should("equal", 0);
			cy.contains("Expand graph").should("not.exist");
			cy.contains("Saved on this device").should("not.exist");
			cy.screenshot(`graph-${viewport.join("-")}`, {
				capture: "viewport"
			});
		});
	}
});
