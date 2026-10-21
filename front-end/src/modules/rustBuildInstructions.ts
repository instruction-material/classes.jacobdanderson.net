import type { PythonIdeFile } from "@/modules/pythonIde";
import { rustCourseResource } from "./rustProjectResources";

export function rustBuildInstructions(
	files: PythonIdeFile[],
	starterUrl?: string
) {
	const selected = rustCourseResource(starterUrl ?? "");
	if (selected) {
		if (
			!selected.definition.roleFiles.every(name =>
				files.some(
					file =>
						file.name === `${selected.role}/${name}` &&
						file.encoding !== "base64"
				)
			)
		) {
			return [
				"The Rust lesson is incomplete. Reopen its complete selected-role source before building."
			];
		}
		if (selected.definition.kind === "concurrency") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline -- --help",
				"cargo run --locked --offline -- --case valid",
				"cargo run --locked --offline -- --case cap",
				"cargo run --locked --offline -- --case fail",
				"cargo run --locked --offline -- --case cancel",
				"Replace the sequential run with two owned partitions, a capacity-two channel and joined handles. Complete CORE, WORKFLOW, CHOICE, CHALLENGE and LIMITS in observations.md; read ../README.md.",
				"Compile diagnostics/rc-not-send.rs and diagnostics/cell-not-sync.rs separately with rustc --edition=2024; both intentionally refuse with E0277. The arc-owned and scoped-shared alternatives print 7 when compiled and run.",
				"Record both streams and statuses. Usage is 64 and semantic failure is 65. The two-second receive deadline does not bound join or every execution; an injected worker error does not model every panic or host spawn failure.",
				"cargo clean",
				"cargo test --locked --offline",
				"cargo build --locked --offline"
			];
		}
		if (selected.definition.kind === "boundary-review") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline -- --help",
				"cargo run --locked --offline -- --case valid",
				"cargo run --locked --offline -- --case cap",
				"cargo run --locked --offline -- --case over",
				"Audit raw_sum and the private checked bridge in src/bridge.rs. Complete the unsafe ledger and CORE, WORKFLOW, CHOICE, CHALLENGE and LIMITS in observations.md; read ../README.md.",
				"Compile diagnostics/unsafe-call.rs and diagnostics/unsafe-body.rs separately with rustc --edition=2024; both intentionally refuse with E0133. The explicit-call and explicit-body alternatives print 7.",
				"Read the recorded Miri evidence in ../README.md. diagnostics/miri-dangling.rs is an interpreter-only rejected example; do not execute it natively. A separate optional interpreter experiment follows the reading, not the normal Cargo run.",
				"Usage is 64 and over-limit input is 65. The C-ABI stand-in is implemented in Rust; runtime protocol checks and a finite Miri trace do not certify foreign library memory contracts.",
				"cargo clean",
				"cargo test --locked --offline",
				"cargo build --locked --offline"
			];
		}
		if (selected.definition.kind === "record-hardening") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline -- --help",
				"cargo run --locked --offline -- --case cat",
				"cargo run --locked --offline -- --case unicode",
				"cargo run --locked --offline -- --case combined",
				"Refactor parse_record into typed refusals while preserving the original valid grammar and owned output. Complete the threat model, failure ledger, claim table, reproduction and residual-risk sections in observations.md; read ../README.md.",
				"The combined fixture returns 65 with empty stdout and error=unclassified for the starter or error=trailing-data for the reference. Run expected nonzero cases separately when the shell stops on error.",
				"The reference observations.md contains a completed packet bound to its recorded source/run. The current path uses native fixed-corpus evidence; optional mutations retain explicit case, byte, time and cleanup bounds.",
				"cargo clean",
				"cargo test --locked --offline",
				"cargo build --locked --offline"
			];
		}
		if (selected.definition.kind === "bounded-cli") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline -- --help",
				"cargo run --locked --offline -- --file valid.txt",
				"cargo run --locked --offline -- --file empty.txt",
				"cargo run --locked --offline -- --file malformed.txt",
				"cargo run --locked --offline -- --file cap.txt",
				"cargo run --locked --offline -- --file over.txt",
				"Refactor the monolithic process function into pure stages. Keep acquire and its Read::take(65) boundary, the 64-byte input and eight-row limits, exact diagnostics and no partial report. Complete CORE, WORKFLOW, CHOICE, CHALLENGE and LIMITS in observations.md; read ../README.md.",
				"cargo build --locked --offline",
				"Run the built bounded_cli_lab executable from another working directory with --file valid.txt; it uses the same supplied package fixtures.",
				"Record stdout, stderr and status separately. Success is 0; usage is 64; input/record errors are 65; missing or non-regular entries give status 66; other I/O failure is 74. No failure prints a report or private input text.",
				"cargo clean",
				"cargo test --locked --offline",
				"cargo build --locked --offline",
				"The byte limit does not impose a time limit on an arbitrary Read source. Static fixture metadata followed by open is not race-free filesystem confinement."
			];
		}
		if (selected.definition.kind === "trait-pipeline") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- --audit alpha=7 bad omega=17",
				"cargo run --locked --offline -- --all alpha=7 bad omega=17",
				"Refactor the concrete eager copying baseline into generic RowSource consumers with borrowed labels. Use try_fold for first-error work; all_records retains every Result in source order. Complete CORE, WORKFLOW, CHOICE, CHALLENGE and LIMITS in observations.md and read ../README.md for the exact contracts.",
				"cargo build --locked --offline",
				"rustc --edition=2024 diagnostics/missing-method.rs --extern trait_pipeline_lab=target/debug/libtrait_pipeline_lab.rlib -L dependency=target/debug/deps -o missing-method",
				"rustc --edition=2024 diagnostics/mutate-live-iterator.rs --extern trait_pipeline_lab=target/debug/libtrait_pipeline_lab.rlib -L dependency=target/debug/deps -o mutate-live-iterator",
				"rustc --edition=2024 diagnostics/alternate-source.rs --extern trait_pipeline_lab=target/debug/libtrait_pipeline_lab.rlib -L dependency=target/debug/deps -o alternate-source",
				"rustc --edition=2024 diagnostics/report-after-owner-drop.rs --extern trait_pipeline_lab=target/debug/libtrait_pipeline_lab.rlib -L dependency=target/debug/deps -o report-after-owner-drop",
				"rustc --edition=2024 diagnostics/mutation-after-last-use.rs --extern trait_pipeline_lab=target/debug/libtrait_pipeline_lab.rlib -L dependency=target/debug/deps -o mutation-after-last-use",
				"The missing method refuses with E0046 and live-iterator mutation with E0502 in both roles. The alternate source receives E0308 only against the concrete starter; the reference prints count=2 total=12. The owner-drop example prints alpha in the owned starter and refuses with E0505 in the borrowed reference. The scoped repair prints rows=2 in both. Run each executable only when its compilation succeeds.",
				"Record stdout, stderr, status and pulls separately. The eager starter pulls all rows before a failing audit; the lazy reference stops at the first invalid row. --all preserves every row outcome. Success is 0, usage is 64 and any row error is 65. Compiler rejection has no runtime result."
			];
		}
		if (selected.definition.kind === "state-models") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- review:Bea reset review:Alex publish",
				"cargo run --locked --offline -- --from 1 0 Alex publish",
				"Refactor the starter's public flags into a private State enum, preserve from_legacy and snapshot boundaries, and implement the 32-scalar Reviewer policy. Complete CORE, WORKFLOW, CHOICE, CHALLENGE and LIMITS in observations.md; read ../README.md for the transition and error contracts.",
				"cargo build --locked --offline",
				"rustc --edition=2024 diagnostics/non-exhaustive.rs --extern state_model_lab=target/debug/libstate_model_lab.rlib -L dependency=target/debug/deps -o non-exhaustive",
				"rustc --edition=2024 diagnostics/exhaustive.rs --extern state_model_lab=target/debug/libstate_model_lab.rlib -L dependency=target/debug/deps -o exhaustive",
				"./exhaustive",
				"rustc --edition=2024 diagnostics/raw-flags.rs --extern state_model_lab=target/debug/libstate_model_lab.rlib -L dependency=target/debug/deps -o raw-flags",
				"The omitted Published match intentionally refuses with E0004 in both roles. The raw-flags example compiles only against the starter and prints error=invalid-legacy-state; the reference rejects its fields with E0560. Run ./raw-flags only if compilation succeeded.",
				"Record stdout, stderr and status separately. Success returns 0, malformed syntax returns 64 before any events, and semantic failure returns 65 with possible earlier successful transitions. Errors preserve the current Session; the event batch is not transactional."
			];
		}
		if (selected.definition.kind === "label-slices") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- --sanitize 'packet-42!'",
				"cargo run --locked --offline -- --window 'a\uD83E\uDD80bc' 1 5",
				"cargo run --locked --offline -- --bytes 'a\uD83E\uDD80bc' 2 3",
				"cargo run --locked --offline -- --chars 'a\uD83E\uDD80bc' 1 2",
				"The unfinished starter retains the identity filter; the target keeps ASCII letters, digits and dashes. Refactor str_window and byte_window into checked borrowed views while preserving Reversed, OutOfBounds and NotCharBoundary.",
				"Read ../README.md and complete CORE, LABEL CASES, PREDICT, CHECKS and LIMITS in observations.md. Continue WINDOWS, CHOICE or CHALLENGE in the same saved project.",
				"The separate diagnostics distinguish E0277 from a deliberate panic with status 101. Follow the guide's rustc commands and compare checked alternatives; Cargo tests do not run those standalone programs.",
				"Record stdout, stderr and exit status separately. String byte ranges require UTF-8 character boundaries; scalar positions are not grapheme counts. Only the CLI selects an exit status."
			];
		}
		if (selected.definition.kind === "typed-errors") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- --record 'A:65536'",
				"cargo run --locked --offline -- --scan '' 'A:0'",
				"Refactor the numeric baseline into Record, ParseError and Result. MissingSeparator and ValueOutOfRange have different caller actions. Result<Option<Record>, RowError> separates absence, valid zero and an indexed failure.",
				"Read ../README.md and complete CORE, ERROR TABLE, PREDICT, CHECKS and LIMITS in observations.md. Continue ABSENCE, CHOICE or CHALLENGE in the same saved project.",
				"The standalone diagnostics intentionally refuse with E0004, E0277 and E0308. Follow the guide's separate rustc commands and compare each working fix.",
				"Only the CLI chooses an exit status. Record stdout, stderr and status separately; the library returns values without terminating a process."
			];
		}
		if (selected.definition.kind === "borrowing") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- 'name=ÉA;role=ß' empty",
				"Refactor the owned baseline into RecordView with borrowed fields. Preserve the schema, ASCII-only normalization, byte-length selection, disjoint slices and deliberate owned result.",
				"Read ../README.md and complete CORE, BORROW MAP, PREDICT, CHECKS and LIMITS in observations.md. Continue MUTATION, CHOICE or CHALLENGE in the same saved project.",
				"The separate diagnostics intentionally refuse with E0502, E0499, E0515 and E0106. Follow the guide's rustc commands and compare all four paired fixes.",
				"Lifetime annotations relate valid references; they do not extend an owner. Run native checks after source edits."
			];
		}
		if (selected.definition.kind === "ownership") {
			return [
				"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
				`cd ${selected.role}`,
				"rustc -Vv",
				"cargo -V",
				"cargo fmt --all --check",
				"rustfmt --edition 2024 --check diagnostics/*.rs",
				"cargo clippy --locked --offline --all-targets -- -D warnings",
				"cargo test --locked --offline",
				"cargo run --locked --offline",
				"cargo run --locked --offline -- alpha empty",
				"Trace the String, Vec and Packet moves, cloned snapshot and borrowed label in src/main.rs. The updated vector gains 9; the snapshot stays unchanged.",
				"Record the ScopeTag sequence: inner-second, inner-first, explicit, after-explicit-drop, outer. These markers do not measure allocator activity or timing.",
				"Read ../README.md and complete OWNER LEDGER, PREDICT, CHECKS and LIMITS in observations.md. Continue with SCOPE, CHOICE or CHALLENGE in the same saved project.",
				"The two use-after examples intentionally refuse compilation with E0382; copy-owned refuses with E0204. Follow the guide's separate rustc commands and compare each paired working example.",
				"The browser edits and saves source. Build and diagnostic checks run in the native Rust environment."
			];
		}
		return [
			"Download and extract the ZIP. Use Rust 1.97.1 with Cargo, rustfmt and Clippy; the package declares edition 2024.",
			`cd ${selected.role}`,
			"rustc -Vv",
			"cargo -V",
			"cargo fmt --all --check",
			"cargo clippy --locked --offline --all-targets -- -D warnings",
			"cargo test --locked --offline",
			"cargo run --locked --offline",
			"cargo run --locked --offline -- 'A B_c/9'",
			"The default stdout is packet-42 and a newline; the changed input gives ABc9. Record actual stderr and exit statuses separately.",
			"Read ../README.md and complete observations.md for the selected activity. Keep Cargo.lock and both diagnostic examples with the source.",
			"The moved-value diagnostic is expected to fail compilation with E0382; the corrected example prints packet-42 twice. Follow the guide's separate rustc commands.",
			"The browser edits and saves source. Build and diagnostic checks run in the native Rust environment."
		];
	}
	const manifests = files.filter(file =>
		/(?:^|\/)Cargo\.toml$/.test(file.name)
	);
	if (manifests.length !== 1 || manifests[0]?.encoding === "base64") {
		return [
			"Extract the ZIP and follow the project's build guide. A Cargo project needs one selected Cargo.toml; a standalone Rust source needs its own rustc command."
		];
	}
	const folder = manifests[0].name.split("/").slice(0, -1).join("/");
	return [
		"Download and extract the ZIP. Use a native Rust toolchain with edition 2024 support.",
		...(folder ? [`cd '${folder.replaceAll("'", "'\"'\"'")}'`] : []),
		"rustc -Vv",
		"cargo -V",
		"cargo fmt --all --check",
		"cargo clippy --locked --offline --all-targets -- -D warnings",
		"cargo test --locked --offline",
		"cargo run --locked --offline",
		"Follow README.md for the program's inputs and expected output."
	];
}
