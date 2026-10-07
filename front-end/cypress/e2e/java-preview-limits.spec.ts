function visitJavaProject(code: string) {
	cy.visit("/ide", {
		onBeforeLoad(window) {
			const date = new Date().toISOString();
			window.localStorage.setItem(
				"classes-python-ide-projects:anonymous",
				JSON.stringify([
					{
						_id: "local-java-limits",
						title: "Java limits",
						mode: "java",
						activeFileName: "Main.java",
						createdAt: date,
						updatedAt: date,
						files: [
							{
								name: "Main.java",
								content: `public class Main { public static void main(String[] args) { ${code} } }`
							}
						]
					}
				])
			);
		}
	});
	cy.get('[aria-label="Expand project sidebar"]').click();
	cy.get(".project-button.is-active span").should("have.text", "Java limits");
	cy.get("button.run-control").should("be.enabled").and("have.text", "Run");
}

describe("Java preview resource boundary", () => {
	it("contains malicious nested work and allows a subsequent normal starter", () => {
		visitJavaProject(
			"for(int a=0;a<500;a++){for(int b=0;b<500;b++){for(int c=0;c<500;c++){;}}}"
		);
		cy.get("button.run-control").click();
		cy.get(".output-panel", { timeout: 10000 }).should(
			"contain.text",
			"total execution limit"
		);
		cy.get("button.run-control").should("have.text", "Run");
		cy.get('[data-testid="ide-new-project"]').click();
		cy.get("#ide-starter-picker .starter-filters select")
			.eq(0)
			.select("all");
		cy.get("#ide-starter-picker .starter-filters select")
			.eq(1)
			.select("Demos");
		cy.contains(
			"#ide-starter-picker .starter-results button",
			"Demo Java"
		).click();
		cy.get("button.run-control").click();
		cy.get(".output-panel", { timeout: 10000 }).should(
			"contain.text",
			"Hello, Java!"
		);
	});
	it("keeps Stop responsive while a worker has not returned", () => {
		visitJavaProject('System.out.println("ready");');
		cy.window().then(window => {
			const WorkerClass = window.Worker;
			const terminated = Cypress.sinon.spy();
			cy.wrap(terminated).as("terminateJava");
			cy.stub(window, "Worker").callsFake(
				(url: string | URL, options: WorkerOptions) => {
					const worker = new WorkerClass(url, options);
					const terminate = worker.terminate.bind(worker);
					worker.terminate = () => {
						terminated();
						terminate();
					};
					worker.postMessage = () => {};
					return worker;
				}
			);
		});
		cy.get("button.run-control").then(button => {
			button[0]!.click();
		});
		cy.get("button.run-control").should("have.text", "Stop").click();
		cy.get("[data-testid='ide-run-status']").should("have.text", "Stopped");
		cy.get("@terminateJava").should("have.been.calledOnce");
		cy.get("button.run-control").should("have.text", "Run");
	});
});
