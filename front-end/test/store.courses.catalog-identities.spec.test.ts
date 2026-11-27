import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createPinia, setActivePinia } from "pinia";
import { expect, it } from "vitest";
import { useAppStore } from "@/stores/app";
import { useCoursesStore } from "@/stores/courses";
import { courseCatalog } from "@/stores/courses/index";
import elementaryAdditions from "../../test/fixtures/early-elementary-a-restored-identities.json";
import elementaryBAdditions from "../../test/fixtures/early-elementary-b-restored-identities.json";
import restoredCppReadings from "../../test/fixtures/design-patterns-in-cpp-restored-reading-identities.json";
import restoredJava3Readings from "../../test/fixtures/java-level-3-restored-reading-identities.json";
import restoredEntrepreneurshipProjects from "../../test/fixtures/entrepreneurship-restored-core-identities.json";
import restoredGrammarProjects from "../../test/fixtures/grammar-mechanics-restored-identities.json";
import joyOfReadingAdditions from "../../test/fixtures/joy-of-reading-restored-identities.json";
import lateElementaryAAdditions from "../../test/fixtures/late-elementary-a-restored-identities.json";
import lateElementaryBAdditions from "../../test/fixtures/late-elementary-b-restored-identities.json";
import restoredLiteratureProjects from "../../test/fixtures/middle-school-literature-restored-identities.json";
import restoredWritingProjects from "../../test/fixtures/middle-school-writing-restored-identities.json";
import pictureBookAdditions from "../../test/fixtures/picture-book-restored-identities.json";
import restoredSpeakingProjects from "../../test/fixtures/public-speaking-restored-identities.json";
import restoredJavaScriptLocalReadings from "../../test/fixtures/javascript-local-persistence-reading-identities.json";
import restoredPythonRecaps from "../../test/fixtures/python-level-1-restored-recap-identities.json";
import restoredMachineLearningPresentation from "../../test/fixtures/machine-learning-restored-presentation-identity.json";

import restoredSmartMoneyProjects from "../../test/fixtures/smart-money-restored-identities.json";
import restoredMoneyMindedProjects from "../../test/fixtures/money-minded-restored-identities.json";

const baseline = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/catalog-published-identities.json"
		),
		"utf8"
	)
) as Record<string, { items: number; sha256: string }>;

const publishedAPModuleOrder = JSON.parse(
	readFileSync(
		resolve(
			process.cwd(),
			"../test/fixtures/ap-csa-published-module-order.json"
		),
		"utf8"
	)
) as { moduleIds: string[] };

const scratchCapstoneModule = "scratch-level-1-gs13-master-project";
const scratchTypingId =
	"scratch-level-1-gs13-master-project-curriculum-optional-extra-practice-typing-games";
const pythonListsReading = {
	moduleId: "python-level-1-grs12-lists",
	id: "python-level-1-grs12-lists-curriculum-lists-order-indexes-and-membership",
	section: "core"
};

// Keep the published baseline immutable; account for a deliberate addition
// separately so changes to any original assignment still fail the digest.
const addedIdentities: Record<
	string,
	{ moduleId: string; id: string; section: string }[]
> = {
	"machine-learning": restoredMachineLearningPresentation,
	"design-patterns-in-cpp": restoredCppReadings,
	"java-level-3": restoredJava3Readings,
	"early-elementary-a-math": elementaryAdditions,
	"early-elementary-b-math": elementaryBAdditions,
	"late-elementary-a-math": lateElementaryAAdditions,
	"late-elementary-b-math": lateElementaryBAdditions,
	"early-elementary-a-reading": joyOfReadingAdditions,
	"early-elementary-b-picture-book": pictureBookAdditions,
	"smart-money-personal-finance": restoredSmartMoneyProjects,
	"money-minded-investing": restoredMoneyMindedProjects,
	"entrepreneurship-101": restoredEntrepreneurshipProjects,
	"middle-school-c-grammar": restoredGrammarProjects,
	"javascript-level-2-javascript-master": restoredJavaScriptLocalReadings,
	"middle-school-a-literature": restoredLiteratureProjects,
	"introduction-to-public-speaking": restoredSpeakingProjects,
	...restoredWritingProjects,
	"python-level-1": [
		...restoredPythonRecaps["python-level-1"],
		pythonListsReading
	],
	"python-level-1-classroom": [
		...restoredPythonRecaps["python-level-1-classroom"],
		pythonListsReading
	],
	"scratch-level-1": [
		{
			moduleId: scratchCapstoneModule,
			id: "scratch-level-1-gs13-master-project-curriculum-build-and-test-your-game",
			section: "core"
		}
	],
	"scratch-level-1-classroom": [
		{
			moduleId: "scratch-classroom-6",
			id: "educational-quiz",
			section: "optional"
		}
	]
};

it("preserves published assignment identities across the complete catalog", async () => {
	const output = process.env.COURSE_CATALOG_PROOF_DIR;
	if (output) mkdirSync(output, { recursive: true });
	const results: { id: string; items: number; learnerSafe: boolean }[] = [];
	for (const [id, identities] of Object.entries(baseline)) {
		expect(
			courseCatalog.some(course => course.id === id),
			id
		).toBe(true);
		setActivePinia(createPinia());
		const app = useAppStore();
		app.setCurrentTutor({
			_id: "catalog-tutor",
			name: "Tutor",
			email: "tutor@example.invalid",
			age: 30,
			state: "GA",
			usersOfTutorLength: 0,
			coursePermissions: [id],
			editTutors: false,
			saveEdit: "Save"
		});
		const staff = (await useCoursesStore().loadCourseById(id))!;
		expect(staff, id).not.toBeNull();
		const actual = staff.modules.flatMap(module =>
			(
				[
					["core", module.curriculum],
					["optional", module.supplementalProjects]
				] as const
			).flatMap(([section, items]) =>
				items.map(item => ({
					moduleId: module.id,
					id: item.id,
					section
				}))
			)
		);
		const additions = addedIdentities[id] ?? [];
		const isAddition = (item: (typeof actual)[number]) =>
			additions.some(
				added =>
					added.moduleId === item.moduleId &&
					added.id === item.id &&
					added.section === item.section
			);
		for (const added of additions) {
			expect(
				actual.filter(
					item =>
						item.moduleId === added.moduleId &&
						item.id === added.id &&
						item.section === added.section
				),
				id
			).toHaveLength(1);
		}
		const tier = id === "usaco-silver" || id === "usaco-gold" ? id.slice(6) : "";
		const bankId = `${id}-optional-${tier}-problem-bank`;
		const consolidatedBankCards = tier
			? [
					`${bankId}-supplemental-core-project-optional-${tier}-problem-bank`,
					`${bankId}-supplemental-problem-bank-full-${tier}-repo`
				]
			: [];
		expect(actual.length, id).toBe(
			identities.items + additions.length - consolidatedBankCards.length
		);
		const originalIdentities = actual.filter(item => !isAddition(item));

		if (consolidatedBankCards.length) {
			const guide = staff.modules
				.find(module => module.id === bankId)
				?.curriculum.find(
					item => item.id === `${bankId}-curriculum-problem-bank-scope-guide`
				);
			expect(guide?.contentKind, id).toBe("reading");
			expect(guide?.aliases, id).toEqual(
				expect.arrayContaining(consolidatedBankCards)
			);
			expect(actual.some(item => consolidatedBankCards.includes(item.id))).toBe(
				false
			);
			const firstPractice = originalIdentities.findIndex(
				item => item.moduleId === bankId && item.section === "optional"
			);
			expect(firstPractice, id).toBeGreaterThanOrEqual(0);
			// Both older aliases follow the four bank overview entries.
			originalIdentities.splice(
				firstPractice + 4,
				0,
				...consolidatedBankCards.map(id => ({
					moduleId: bankId,
					id,
					section: "optional"
				}))
			);
		}

		// Typing moved from the last core slot to the first optional slot.
		// Verify its current placement and normalize that one historical field.
		if (id === "scratch-level-1") {
			const typing = originalIdentities.filter(
				item =>
					item.moduleId === scratchCapstoneModule &&
					item.id === scratchTypingId
			);
			expect(typing).toHaveLength(1);
			expect(typing[0].section).toBe("optional");
			const firstOptional = originalIdentities.find(
				item =>
					item.moduleId === scratchCapstoneModule &&
					item.section === "optional"
			);
			expect(firstOptional?.id).toBe(scratchTypingId);
			typing[0].section = "core";
		}

		// Check-Ins 1 and 2 keep their published exercise IDs when practice
		// moves to the first optional slot. Check the new placement before
		// restoring the two historical section fields for the digest.
		if (id === "python-level-1" || id === "python-level-1-classroom") {
			for (const number of [1, 2]) {
				const moduleId = `python-level-1-check-in-${number}`;
				const practiceId = `${moduleId}-curriculum-check-in-${number}-additional-practice-project`;
				const firstOptional = originalIdentities.find(
					item => item.moduleId === moduleId && item.section === "optional"
				);
				expect(firstOptional?.id, id).toBe(practiceId);
				firstOptional!.section = "core";
			}
		}

		// AP's authored progression replaces the stale display order. Reconstruct
		// only its published module order to verify every original identity and
		// section; the AP flow regression separately checks the corrected order.
		const publishedIdentities =
			id === "ap-computer-science-a"
				? publishedAPModuleOrder.moduleIds.flatMap(moduleId =>
						originalIdentities.filter(
							item => item.moduleId === moduleId
						)
					)
				: originalIdentities;
		expect(publishedIdentities.length, id).toBe(identities.items);
		expect(
			createHash("sha256")
				.update(JSON.stringify(publishedIdentities))
				.digest("hex"),
			id
		).toBe(identities.sha256);
		app.setCurrentTutor(null);
		app.setCurrentUser({
			_id: "catalog-learner",
			name: "Learner",
			email: "learner@example.invalid",
			age: 14,
			state: "GA",
			courseAccess: [id],
			editUsers: false,
			saveEdit: "Save"
		});
		const learner = (await useCoursesStore().loadCourseById(id))!;
		expect(learner, id).not.toBeNull();
		const learnerItems = learner.modules.flatMap(module => [
			...module.curriculum,
			...module.supplementalProjects
		]);
		expect(
			learnerItems.every(item => !item.solutionLink),
			id
		).toBe(true);
		results.push({ id, items: actual.length, learnerSafe: true });
		if (output) {
			writeFileSync(
				resolve(output, `${id}.json`),
				`${JSON.stringify({ id, staff, learner }, null, 2)}\n`
			);
		}
	}
	expect(results).toHaveLength(77);
	if (output) {
		writeFileSync(
			resolve(output, "catalog-proof.json"),
			`${JSON.stringify(
				{
					courses: results,
					scope: "Actual normalized staff and learner catalog; published assignment identities and hidden learner reference fields. Content completeness, source accuracy and runtime behavior require separate checks."
				},
				null,
				2
			)}\n`
		);
	}
}, 180000);
