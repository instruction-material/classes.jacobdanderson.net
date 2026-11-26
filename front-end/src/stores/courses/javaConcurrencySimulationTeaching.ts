import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaConcurrencySimulationProjects,
	javaConcurrencySimulationURL,
	javaSimulationExtensionID
} from "@/modules/javaSearchResources";

const [runner, simulation] = javaConcurrencySimulationProjects;

function reading(title: string, content: string): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "reading",
		preserveAssignment: true,
		preserveInstructions: true
	};
}

function project(
	entry: (typeof javaConcurrencySimulationProjects)[number],
	title: string,
	content: string,
	id: string = entry.id
): RawCourseModuleItem {
	return {
		id,
		title,
		content,
		contentKind: "assignment",
		ideImport: true,
		preserveAssignment: true,
		preserveInstructions: true,
		projectLink: javaConcurrencySimulationURL(entry.pack, "starter"),
		solutionLink: javaConcurrencySimulationURL(entry.pack, "solution")
	};
}

const compile = `Open the starter in the site IDE and confirm the import. Save and extract the ZIP with the src directory intact. From the folder containing sources.txt, run javac --release 21 -Xlint:all -Werror -d out @sources.txt. Run java -cp out checks.ContractTests for the checks and java -cp out runner.Main for the example.`;

export function buildJavaConcurrencySimulationModule(): RawCourseModule {
	return {
		title: "AJ22 Concurrency, Services, and Capstone Architecture",
		curriculum: [
			reading(
				"Executors, Tasks, and Shared-State Discipline",
				`Keep at most one batch of jobs outstanding. A fixed-size executor limits workers. The submission loop can also limit pending jobs by waiting for the current batch before submitting the next. Give each worker a snapshot of its input and collect its return value through a Future.

Two jobs may finish in either order. If the collector reads the futures in submission order, each report row has a stable position. Trace an earlier job that finishes after a later one. Mark which data belongs to each worker, and which data only the collector updates.`
			),
			reading(
				"Capstone Architecture and Java-Specific Readiness",
				`The library simulation receives a script and emits a report. A parser turns a line like request Ada oak into a typed event. The circulation service owns loan and waiting state. The runner decides the order in which events are applied, and the output interface delivers each result to a console, a file or a test list.

With one copy of oak, a request from Ada creates a loan. Bea waits until Ada returns it, and the return hands the copy to Bea. Trace available stock, loans and the waiting list after each event. Changing the report destination leaves these transitions the same.`
			),
			project(
				runner,
				"AJ22 Project 1: Concurrent Task Runner",
				`Implement Runner.run. Use one to eight workers, submit a batch no larger than the worker count, and collect its futures in input order. Each worker returns one result with the job ID, value or error, and elapsed time. Keep worker inputs immutable. Propagate interruption of the collecting thread and shut the executor down when the run is done.

The sample prints oak 5, cedar Negative value and elm 0. The checks force a later job to advance before an earlier one and verify report order. Explain why elapsed time is recorded but left out of the stable sample output.

${compile}`
			),
			project(
				simulation,
				"AJ22 Project 2: Event-Driven Simulation Capstone",
				`Implement Circulation.apply for a fictional library. The script starts with stock title count, followed by request, return or cancel events in verb member title format. A request with an available copy creates a loan. Otherwise it joins the end of the waiting list. Reject duplicate requests. A return transfers the copy to the first waiting member, or makes it available when nobody is waiting. Cancel removes the named member from the waiting list.

Trace the bundled requests.txt. Ada borrows oak, Bea and Cy wait, Ada's return hands the copy to Bea, Cy cancels, and Bea returns the copy. Test a duplicate request and a return for a member without a loan. Write an architecture note showing what the parser, service and runner each own.

${compile}

To save a report, use java -cp out runner.Main requests.txt report.txt with a new report filename in the extracted folder.`
			)
		],
		supplementalProjects: [
			project(
				simulation,
				"AJ22 Project 3: Capstone Extension Review",
				`Reopen the saved simulation after its core checks pass. Run java -cp out checks.ContractTests extension to reproduce an issue with the list returned by waiting. A caller can change internal state through that list. Return an independent immutable snapshot and verify that earlier snapshots keep their values after later events.

Hold a snapshot while the next borrower receives a returned copy. Compare that snapshot with a new one after the handoff. Repeat the core checks and the extension checks. Explain which class owns the list, which method had exposed it, and which new test verifies the boundary. Compare the before and after behavior without changing the event's output contract.`,
				javaSimulationExtensionID
			)
		]
	};
}
