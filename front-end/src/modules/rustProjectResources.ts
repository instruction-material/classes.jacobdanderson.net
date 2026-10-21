import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const rustCargoRevision = "54e4b74c556375f5f57c8fd52d23878aedca255f";
export const rustCargoPack = "RUST-00-cargo-tooling-evidence";
export const rustCargoModuleId =
	"rust-systems-security-rss0-tooling-cargo-and-why-rust-exists";
export const rustCargoItemIds = {
	core: `${rustCargoModuleId}-curriculum-core-project-tooling-cargo-and-why-rust-exists`,
	workflow: `${rustCargoModuleId}-supplemental-project-first-cargo-audit-cli`,
	choice: `${rustCargoModuleId}-supplemental-tooling-cargo-and-why-rust-exists-transfer-practice`,
	challenge: `${rustCargoModuleId}-supplemental-tooling-cargo-and-why-rust-exists-extension-practice`
} as const;
export const rustCargoRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/moved-value.rs",
	"diagnostics/fixed-value.rs"
] as const;

export const rustOwnershipRevision = "337017b99d7b64a1bfd32a0cf6295e9e310f6293";
export const rustOwnershipPack = "RUST-01-ownership-evidence";
export const rustOwnershipModuleId =
	"rust-systems-security-rss1-ownership-moves-and-memory-responsibility";
export const rustOwnershipItemIds = {
	core: `${rustOwnershipModuleId}-curriculum-core-project-ownership-moves-and-memory-responsibility`,
	workflow: `${rustOwnershipModuleId}-supplemental-project-ownership-and-move-tracer`,
	choice: `${rustOwnershipModuleId}-supplemental-ownership-moves-and-memory-responsibility-transfer-practice`,
	challenge: `${rustOwnershipModuleId}-supplemental-ownership-moves-and-memory-responsibility-extension-practice`
} as const;
export const rustOwnershipRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/use-after-move.rs",
	"diagnostics/returned-owner.rs",
	"diagnostics/use-after-drop.rs",
	"diagnostics/last-use-before-drop.rs",
	"diagnostics/copy-owned.rs",
	"diagnostics/clone-owned.rs"
] as const;
export const rustBorrowingRevision = "660b39f70a2c24d5f702b64e5ce12d10db03f9b8";
export const rustBorrowingPack = "RUST-02-borrowing-evidence";
export const rustBorrowingModuleId =
	"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes";
export const rustBorrowingItemIds = {
	core: "rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-curriculum-core-project-borrowing-aliasing-and-lifetimes",
	workflow:
		"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-project-borrowing-and-aliasing-lab",
	choice: "rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-borrowing-aliasing-and-lifetimes-transfer-practice",
	challenge:
		"rust-systems-security-rss2-borrowing-aliasing-and-lifetimes-supplemental-borrowing-aliasing-and-lifetimes-extension-practice"
} as const;
export const rustBorrowingRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/main.rs",
	"diagnostics/escaped-local.rs",
	"diagnostics/last-use-before-mutation.rs",
	"diagnostics/missing-lifetime.rs",
	"diagnostics/owned-result.rs",
	"diagnostics/related-lifetimes.rs",
	"diagnostics/shared-and-mutable.rs",
	"diagnostics/split-borrows.rs",
	"diagnostics/two-mutable.rs"
] as const;

export const rustTypedErrorsRevision =
	"1c436c353bd8664ea92c4abd8cfb71d95a26c75a";
export const rustTypedErrorsPack = "RUST-03-typed-errors-evidence";
export const rustTypedErrorsModuleId =
	"rust-systems-security-rss3-option-result-and-typed-error-paths";
export const rustTypedErrorsItemIds = {
	core: "rust-systems-security-rss3-option-result-and-typed-error-paths-curriculum-core-project-option-result-and-typed-error-paths",
	workflow:
		"rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-project-option-and-result-audit-tool",
	choice: "rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-option-result-and-typed-error-paths-transfer-practice",
	challenge:
		"rust-systems-security-rss3-option-result-and-typed-error-paths-supplemental-option-result-and-typed-error-paths-extension-practice"
} as const;
export const rustTypedErrorsRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"diagnostics/exhaustive-match.rs",
	"diagnostics/missing-match.rs",
	"diagnostics/option-question-mark.rs",
	"diagnostics/option-to-result.rs",
	"diagnostics/sentinel-result.rs",
	"diagnostics/typed-result.rs"
] as const;

export const rustLabelSlicesRevision =
	"308f040261f9cc676ad6a2892ab7f7eea11a2498";
export const rustLabelSlicesPack = "RUST-04-label-slices-evidence";
export const rustLabelSlicesModuleId =
	"rust-systems-security-rss4-strings-slices-collections-and-bounds-safety";
export const rustLabelSlicesItemIds = {
	core: "rust-systems-security-rss4-strings-slices-collections-and-bounds-safety-curriculum-core-project-strings-slices-collections-and-bounds-safety",
	workflow:
		"rust-systems-security-rss4-strings-slices-collections-and-bounds-safety-supplemental-project-slice-and-bounds-workbench",
	choice: "rust-systems-security-rss4-strings-slices-collections-and-bounds-safety-supplemental-strings-slices-collections-and-bounds-safety-transfer-practice",
	challenge:
		"rust-systems-security-rss4-strings-slices-collections-and-bounds-safety-supplemental-strings-slices-collections-and-bounds-safety-extension-practice"
} as const;
export const rustLabelSlicesRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"diagnostics/byte-out-of-bounds.rs",
	"diagnostics/checked-byte.rs",
	"diagnostics/checked-range.rs",
	"diagnostics/checked-string.rs",
	"diagnostics/non-boundary-slice.rs",
	"diagnostics/reversed-range.rs",
	"diagnostics/scalar-index.rs",
	"diagnostics/string-index.rs"
] as const;

export const rustStateModelsRevision =
	"5989153b360e62f0a5b96026b88d2f40ae3b0ebd";
export const rustStateModelsPack = "RUST-05-state-models-evidence";
export const rustStateModelsModuleId =
	"rust-systems-security-rss5-structs-enums-and-safer-state-models";
export const rustStateModelsItemIds = {
	core: "rust-systems-security-rss5-structs-enums-and-safer-state-models-curriculum-core-project-structs-enums-and-safer-state-models",
	workflow:
		"rust-systems-security-rss5-structs-enums-and-safer-state-models-supplemental-project-state-machine-refactor",
	choice: "rust-systems-security-rss5-structs-enums-and-safer-state-models-supplemental-structs-enums-and-safer-state-models-transfer-practice",
	challenge:
		"rust-systems-security-rss5-structs-enums-and-safer-state-models-supplemental-structs-enums-and-safer-state-models-extension-practice"
} as const;
export const rustStateModelsRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"diagnostics/exhaustive.rs",
	"diagnostics/non-exhaustive.rs",
	"diagnostics/raw-flags.rs"
] as const;

export const rustTraitPipelineRevision =
	"e9c39209a9ada0de34c767273b1d0b38dd068d05";
export const rustTraitPipelinePack = "RUST-06-trait-pipeline-evidence";
export const rustTraitPipelineModuleId =
	"rust-systems-security-rss6-traits-iterators-and-api-contracts";
export const rustTraitPipelineItemIds = {
	core: "rust-systems-security-rss6-traits-iterators-and-api-contracts-curriculum-core-project-traits-iterators-and-api-contracts",
	workflow:
		"rust-systems-security-rss6-traits-iterators-and-api-contracts-supplemental-project-trait-based-validation-pipeline",
	choice: "rust-systems-security-rss6-traits-iterators-and-api-contracts-supplemental-traits-iterators-and-api-contracts-transfer-practice",
	challenge:
		"rust-systems-security-rss6-traits-iterators-and-api-contracts-supplemental-traits-iterators-and-api-contracts-extension-practice"
} as const;
export const rustTraitPipelineRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"diagnostics/alternate-source.rs",
	"diagnostics/missing-method.rs",
	"diagnostics/mutate-live-iterator.rs",
	"diagnostics/mutation-after-last-use.rs",
	"diagnostics/report-after-owner-drop.rs"
] as const;

export const rustBoundedCliRevision =
	"f3669ea2687fe3ca471c285d7334cf63aa1305ef";
export const rustBoundedCliPack = "RUST-07-bounded-cli-evidence";
export const rustBoundedCliModuleId =
	"rust-systems-security-rss7-files-parsers-and-secure-cli-design";
export const rustBoundedCliItemIds = {
	core: "rust-systems-security-rss7-files-parsers-and-secure-cli-design-curriculum-core-project-files-parsers-and-secure-cli-design",
	workflow:
		"rust-systems-security-rss7-files-parsers-and-secure-cli-design-supplemental-project-secure-cli-audit-tool",
	choice: "rust-systems-security-rss7-files-parsers-and-secure-cli-design-supplemental-files-parsers-and-secure-cli-design-transfer-practice",
	challenge:
		"rust-systems-security-rss7-files-parsers-and-secure-cli-design-supplemental-files-parsers-and-secure-cli-design-extension-practice"
} as const;
export const rustBoundedCliRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"fixtures/valid.txt",
	"fixtures/empty.txt",
	"fixtures/malformed.txt",
	"fixtures/cap.txt",
	"fixtures/over.txt"
] as const;

export const rustConcurrencyRevision =
	"cdfcc58e80fc9a206c11673cfbf26f1fac95f1ea";

export const rustConcurrencyPack = "RUST-08-concurrency-evidence";

export const rustConcurrencyModuleId =
	"rust-systems-security-rss8-concurrency-and-race-reduction";

export const rustConcurrencyItemIds = {
	core: "rust-systems-security-rss8-concurrency-and-race-reduction-curriculum-core-project-concurrency-and-race-reduction",
	workflow:
		"rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-project-threads-and-channels-monitor",
	choice: "rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-concurrency-and-race-reduction-transfer-practice",
	challenge:
		"rust-systems-security-rss8-concurrency-and-race-reduction-supplemental-concurrency-and-race-reduction-extension-practice"
} as const;

export const rustConcurrencyRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"src/ledger.rs",
	"diagnostics/rc-not-send.rs",
	"diagnostics/arc-owned.rs",
	"diagnostics/cell-not-sync.rs",
	"diagnostics/scoped-shared.rs"
] as const;

export const rustBoundaryReviewRevision =
	"7a3aa814462d839deebf4010c0e56ab4643baecf";

export const rustBoundaryReviewPack = "RUST-09-boundary-review-evidence";

export const rustBoundaryReviewModuleId =
	"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries";

export const rustBoundaryReviewItemIds = {
	core: "rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-curriculum-core-project-unsafe-ffi-and-trusted-boundaries",
	workflow:
		"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-project-unsafe-and-ffi-boundary-review",
	choice: "rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-unsafe-ffi-and-trusted-boundaries-transfer-practice",
	challenge:
		"rust-systems-security-rss9-unsafe-ffi-and-trusted-boundaries-supplemental-unsafe-ffi-and-trusted-boundaries-extension-practice"
} as const;

export const rustBoundaryReviewRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"src/bridge.rs",
	"diagnostics/unsafe-call.rs",
	"diagnostics/explicit-call.rs",
	"diagnostics/unsafe-body.rs",
	"diagnostics/explicit-body.rs",
	"diagnostics/miri-dangling.rs"
] as const;

export const rustRecordHardeningRevision =
	"36aa7be22888f3e73a208dee949962c586833257";

export const rustRecordHardeningPack = "RUST-10-record-hardening-capstone";

export const rustRecordHardeningModuleId =
	"rust-systems-security-rss10-capstone-harden-a-legacy-tool";

export const rustRecordHardeningItemIds = {
	core: "rust-systems-security-rss10-capstone-harden-a-legacy-tool-curriculum-core-project-harden-a-legacy-tool",
	workflow:
		"rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-project-harden-a-legacy-tool",
	choice: "rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-capstone-harden-a-legacy-tool-transfer-practice",
	challenge:
		"rust-systems-security-rss10-capstone-harden-a-legacy-tool-supplemental-capstone-harden-a-legacy-tool-extension-practice"
} as const;

export const rustRecordHardeningRoleFiles = [
	"observations.md",
	"Cargo.toml",
	"Cargo.lock",
	"src/lib.rs",
	"src/main.rs",
	"src/fixtures.rs"
] as const;

const rustLessons = [
	{
		kind: "cargo",
		revision: rustCargoRevision,
		pack: rustCargoPack,
		roleFiles: rustCargoRoleFiles,
		itemIds: rustCargoItemIds
	},
	{
		kind: "ownership",
		revision: rustOwnershipRevision,
		pack: rustOwnershipPack,
		roleFiles: rustOwnershipRoleFiles,
		itemIds: rustOwnershipItemIds
	},
	{
		kind: "borrowing",
		revision: rustBorrowingRevision,
		pack: rustBorrowingPack,
		roleFiles: rustBorrowingRoleFiles,
		itemIds: rustBorrowingItemIds
	},
	{
		kind: "typed-errors",
		revision: rustTypedErrorsRevision,
		pack: rustTypedErrorsPack,
		roleFiles: rustTypedErrorsRoleFiles,
		itemIds: rustTypedErrorsItemIds
	},
	{
		kind: "label-slices",
		revision: rustLabelSlicesRevision,
		pack: rustLabelSlicesPack,
		roleFiles: rustLabelSlicesRoleFiles,
		itemIds: rustLabelSlicesItemIds
	},
	{
		kind: "state-models",
		revision: rustStateModelsRevision,
		pack: rustStateModelsPack,
		roleFiles: rustStateModelsRoleFiles,
		itemIds: rustStateModelsItemIds
	},
	{
		kind: "trait-pipeline",
		revision: rustTraitPipelineRevision,
		pack: rustTraitPipelinePack,
		roleFiles: rustTraitPipelineRoleFiles,
		itemIds: rustTraitPipelineItemIds
	},
	{
		kind: "bounded-cli",
		revision: rustBoundedCliRevision,
		pack: rustBoundedCliPack,
		roleFiles: rustBoundedCliRoleFiles,
		itemIds: rustBoundedCliItemIds
	},
	{
		kind: "concurrency",
		revision: rustConcurrencyRevision,
		pack: rustConcurrencyPack,
		roleFiles: rustConcurrencyRoleFiles,
		itemIds: rustConcurrencyItemIds
	},
	{
		kind: "boundary-review",
		revision: rustBoundaryReviewRevision,
		pack: rustBoundaryReviewPack,
		roleFiles: rustBoundaryReviewRoleFiles,
		itemIds: rustBoundaryReviewItemIds
	},
	{
		kind: "record-hardening",
		revision: rustRecordHardeningRevision,
		pack: rustRecordHardeningPack,
		roleFiles: rustRecordHardeningRoleFiles,
		itemIds: rustRecordHardeningItemIds
	}
] as const;

export function rustCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "low-level-security"
	) {
		return null;
	}
	const [pack, role, ...rest] = resource.path.split("/");
	const definition = rustLessons.find(
		lesson => lesson.pack === pack && lesson.revision === resource.ref
	);
	if (
		!definition ||
		rest.length ||
		(role !== "starter" && role !== "solution")
	) {
		return null;
	}
	return { resource, pack, role, definition };
}

export function rustCourseProjectKey(
	courseId: string,
	itemId: string,
	role: "starter" | "reference",
	url: string
) {
	const selected =
		courseId === "rust-systems-security" && rustCourseResource(url);
	const knownItems: readonly string[] = selected
		? Object.values(selected.definition.itemIds)
		: [];
	const savedItem =
		selected && knownItems.includes(itemId)
			? selected.definition.itemIds.core
			: itemId;
	const base = `${courseId}:${savedItem}:${role}`;
	return selected ? `${base}:native-rust` : base;
}

export function rustImportFiles(url: string) {
	const selected = rustCourseResource(url);
	if (!selected) return null;
	const { resource, role, pack, definition } = selected;
	return [
		...definition.roleFiles.map(name => `${role}/${name}`),
		"README.md"
	].map(name => {
		const path = `${pack}/${name}`;
		return {
			name,
			file: {
				path,
				htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
				rawUrl: githubRawUrl(resource, path),
				label: name,
				size: null
			}
		};
	});
}
