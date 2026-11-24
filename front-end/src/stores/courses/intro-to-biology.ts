import type { RawCourse, RawCourseModuleItem } from "./types";
import { introBiologyLessons } from "./introBiologyLessons";
import { staticMediaUrl } from "./staticMedia";

const BIOLOGY_REFERENCES = {
	hhmiMembraneTransport:
		"https://www.biointeractive.org/classroom-resources/simulating-membrane-transport",
	hhmiSystems:
		"https://www.biointeractive.org/sites/default/files/media/file/2024-10/IntroSystems-Educator-act.pdf",
	ngssLifeScience:
		"https://www.nextgenscience.org/dci-arrangement/hs-ls1-molecules-organisms-structures-and-processes",
	niddkDigestion:
		"https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works",
	niddkKidneys:
		"https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work",
	openStaxBiology: "https://openstax.org/details/books/biology-2e",
	openStaxEnergy:
		"https://openstax.org/books/biology-2e/pages/6-1-energy-and-metabolism",
	openStaxMacromolecules:
		"https://openstax.org/books/biology-2e/pages/3-1-synthesis-of-biological-macromolecules"
} as const;

const BIOLOGY_MATERIALS = {
	answerKey: "/course-assets/biology/intro-biology-rubrics-answer-key.md",
	pack: "/course-assets/biology/intro-biology-materials-pack.md"
} as const;

function biologyMaterial(section: string) {
	return `${BIOLOGY_MATERIALS.pack}#${section}`;
}

function biologyAnswerKey(section: string) {
	return `${BIOLOGY_MATERIALS.answerKey}#${section}`;
}

const bodySystemsAlternative =
	"**Accessible media alternative:** The Body Systems Scenario Cards supply text-described organs, interactions, and arrow meanings.";

function biologyVisual(
	originalFilename: string,
	filename: string,
	alt: string,
	alternative: string
) {
	const replacement = `/course-assets/biology/${filename}`;
	return {
		content: `![${alt}](${replacement})\n\n${alternative}`,
		sourceMedia: { original: staticMediaUrl(originalFilename), replacement }
	};
}

function concept({
	evidence,
	focus,
	investigation,
	model
}: {
	evidence: string;
	focus: string;
	investigation: string;
	model: string;
}) {
	return [
		`**Investigation:** ${investigation}`,
		`**Model:** ${model}`,
		`**Evidence target:** ${evidence}`,
		`**Review check:** ${focus}`
	].join("\n\n");
}

function project({
	artifact,
	evidence,
	investigation,
	review
}: {
	artifact: string;
	evidence: string;
	investigation: string;
	review: string;
}) {
	return [
		`**Investigation:** ${investigation}`,
		`**Artifact:** ${artifact}`,
		`**Evidence target:** ${evidence}`,
		`**Review check:** ${review}`
	].join("\n\n");
}

const introToBiologySourceCourse: RawCourse = {
	name: "Intro to Biology",
	modules: [
		{
			title: "BIO1 Human Body Systems",
			curriculum: [
				{
					title: "Equipment-Free Biology Workflow",
					content: concept({
						investigation:
							"No beakers, kits, dissections, food handling, or required household experiments are needed. The course works through diagrams, shared reference images, short readings, provided scenarios, notebook sketches, comparison tables, and claim-evidence-reasoning responses.",
						model: "A biology notebook stores vocabulary, labeled sketches, evidence notes, open questions, and model revisions. The same notebook also tracks a digestive-system travel journal that grows across the course.",
						evidence:
							"Every activity separates observation from inference. A labeled diagram, a table, a scenario response, or a short CER paragraph counts as evidence when it names what was observed and why it supports the claim.",
						focus: "Explain the difference between a body part, an organ, an organ system, and a body process."
					})
				},
				{
					title: "Body Systems Reference A",
					...biologyVisual(
						"biomod1pro1im1.jpg",
						"body-systems.svg",
						"Ten body systems paired with a representative structure and its function, including lungs for gas exchange and blood vessels for transport.",
						bodySystemsAlternative
					)
				},
				{
					title: "Body Systems Reference B",
					...biologyVisual(
						"biomod1pro1im2.jpg",
						"walking-in-warmth.svg",
						"Walking in warmth: oxygen moves from lungs through blood to muscle, nerves signal sweat glands, and evaporating sweat transfers heat from skin to the surroundings.",
						bodySystemsAlternative
					)
				},
				{
					title: "Scenario-Based System Interactions",
					content: concept({
						investigation:
							"Three scenario prompts anchor this module: exercising on a hot day, a food-allergy reaction, and calcium intake from milk or another calcium source.",
						model: "Each scenario is a cause-and-effect chain. The event changes internal conditions, body systems detect or respond to the change, and organs coordinate a response that helps maintain stability.",
						evidence:
							"Highlight the systems involved, add arrows for information or material flow, and write one sentence explaining how the response helps the body.",
						focus: "Separate direct evidence in the scenario from a reasonable biological inference."
					})
				},
				{
					title: "Travel Journal Framework",
					content: concept({
						investigation:
							"The course-long travel journal follows one meal through digestion, absorption, energy conversion, regulation, elimination, and excretion.",
						model: "The journal is a narrative model. It records where the meal components move, how molecules change form, which organs participate, and which processes are still uncertain.",
						evidence:
							"Each entry contains one labeled location, one biological process, one vocabulary term, and one question or revision note.",
						focus: "Connect a journal entry to the body-system map rather than treating it as a separate writing task."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Human Body Systems Map",
					content: project({
						investigation:
							"Create a human-body map with one representative organ from each major system named in the module.",
						artifact:
							"A labeled diagram, slide, or notebook page with organs, system names, and one short function note per system.",
						evidence:
							"At least ten system labels are present, and at least three arrows show how systems work together.",
						review: "Explain why the map is a model instead of a complete copy of the body."
					})
				},
				{
					title: "Project: Scenario Response Map",
					content: project({
						investigation:
							"Choose one system-interaction scenario and annotate the body map with the organs and systems involved.",
						artifact:
							"A marked-up system map plus a short claim-evidence-reasoning paragraph.",
						evidence:
							"The response names the trigger, the responding systems, and the evidence that supports the pathway.",
						review: "Identify one assumption in the explanation and one piece of evidence that would make the model stronger."
					})
				},
				{
					title: "Project: Travel Journal Launch",
					content: project({
						investigation:
							"Select one realistic meal or snack to follow through the digestive and excretory-system journey.",
						artifact:
							"A first journal entry that describes the meal, predicts where it will travel, and names at least two molecule or nutrient types to track.",
						evidence:
							"The entry includes an initial diagram or flow chart that can be revised in later modules.",
						review: "Mark which parts of the entry are observations, predictions, and open questions."
					})
				}
			]
		},
		{
			title: "BIO2 Nutrients and Macromolecules",
			curriculum: [
				{
					title: "Macromolecule Evidence",
					content: concept({
						investigation:
							"Food can be interpreted by the major biological molecules it provides: carbohydrates, lipids, proteins, vitamins, minerals, and water.",
						model: "Carbohydrates often provide quick energy, lipids store energy and build membranes, proteins supply amino acids for structures and chemical work, and vitamins and minerals support many processes without acting as the main energy source.",
						evidence:
							"Classify meal ingredients by nutrient group, then explain which evidence points to each classification.",
						focus: "Distinguish a food name from the molecules and nutrients contained inside that food."
					})
				},
				{
					title: "Mission Dossier Graph",
					...biologyVisual(
						"biomod2pro1im1.png",
						"dinner-mystery.svg",
						"Fictional relative changes in simple sugar, amino acid and fatty acid, respectively: A (16, 2, 1), B (1, 14, 2), C (2, 1, 15), D (6, 7, 5).",
						"**Accessible media alternative:** The Nutrient and Macromolecule Evidence Table supplies all twelve values and the matching rule in text."
					)
				},
				{
					title: "Nutrient Recipe Book",
					content: concept({
						investigation:
							"A recipe can be analyzed as a nutrient model. Ingredients are grouped by the main nutrients they contribute, not by whether the food seems healthy in everyday language.",
						model: "Each recipe page links ingredients to carbohydrate, protein, fat, vitamin, and mineral categories. The model can also show when one ingredient contributes more than one category.",
						evidence:
							"Use ingredient labels, common nutrition knowledge, or provided notes to justify each category.",
						focus: "Identify one missing nutrient group and revise the recipe or explanation to account for it."
					})
				},
				{
					title: "Travel Journal Meal Profile",
					content: concept({
						investigation:
							"The selected meal becomes the main object tracked through digestion. This entry records what the meal contains before the body changes it.",
						model: "The journal profile is an initial inventory: ingredients, nutrient groups, predicted molecules, and expected destinations. It stays revisable because later modules may change an early prediction about where a nutrient travels or how the body uses it.",
						evidence:
							"Name at least three meal components and classify each by nutrient group with a short evidence note. Include one uncertainty note when an ingredient has more than one possible nutrient role.",
						focus: "Predict which components are likely to provide energy, structure, or regulatory support, then mark which prediction will need digestive-system evidence later."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Dinner Mystery",
					content: project({
						investigation:
							"Use nutrient clues to match fictional guests with dishes from the dinner-mystery prompt.",
						artifact:
							"A table with one row per guest, one predicted dish, the strongest clue, and one rejected alternative.",
						evidence:
							"Each match references carbohydrates, fatty acids, or amino acids as the deciding evidence.",
						review: "Explain which match has the strongest evidence and which match remains most uncertain."
					})
				},
				{
					title: "Project: Nutrient Recipe Book",
					content: project({
						investigation:
							"Design two or three meals that include multiple nutrient categories.",
						artifact:
							"Recipe cards with ingredients, nutrient labels, and one explanation of how the meal supports the body.",
						evidence:
							"Each recipe includes carbohydrates, proteins, fats, vitamins, and minerals or explains a missing category clearly.",
						review: "Revise one recipe after noticing a weak or unsupported nutrient claim."
					})
				},
				{
					title: "Project: Meal Journal Entry",
					content: project({
						investigation:
							"Write the first full travel-journal entry for the selected meal.",
						artifact:
							"A paragraph, slide, or diagram naming the meal's components and predicted nutrient groups.",
						evidence:
							"The entry includes at least one evidence note for each major nutrient claim.",
						review: "Mark one prediction that will be checked again after studying digestion and absorption."
					})
				}
			]
		},
		{
			title: "BIO3 Digestive Process",
			curriculum: [
				{
					title: "Digestive System Organs",
					content: concept({
						investigation:
							"The digestive system includes the mouth, pharynx, esophagus, stomach, small intestine, large intestine, liver, and pancreas.",
						model: "A complete digestive-system model shows both path organs, where food physically travels, and accessory organs, which release materials that support digestion.",
						evidence:
							"Label each organ, place it in sequence, and name its role in ingestion, digestion, absorption, or elimination.",
						focus: "Distinguish the tube-like path from organs that support the path without food passing through them."
					})
				},
				{
					title: "Ingestion Pathway",
					content: concept({
						investigation:
							"Ingestion begins when food enters the mouth and moves through the pharynx and esophagus toward the stomach.",
						model: "The pathway can be modeled as a storyboard. Each frame shows the food location, the physical movement, and any chemical or mechanical change.",
						evidence:
							"Add arrows for movement, labels for organs, and notes for chewing, swallowing, and peristalsis.",
						focus: "Explain why movement through the digestive tract is active and coordinated rather than simple falling."
					})
				},
				{
					title: "Food Processing Stages",
					content: concept({
						investigation:
							"Food processing can be organized as ingestion, digestion, absorption, and elimination.",
						model: "Each stage answers a different question: how food enters, how large molecules are broken down, how useful material enters the body, and how unused material leaves.",
						evidence:
							"Match each stage to the organs where it mainly occurs and add one example of a material being changed or moved.",
						focus: "Connect the stage names to biological actions rather than memorizing a list."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Digestive Anatomy Gallery",
					content: project({
						investigation:
							"Create an art-gallery style collection of major digestive organs.",
						artifact:
							"A labeled set of organ sketches or slides plus a combined digestive-system map.",
						evidence:
							"Each organ has a name, an approximate position, and a short function note.",
						review: "Explain how the individual organ cards combine into one system-level model."
					})
				},
				{
					title: "Project: Ingestion Storyboard",
					content: project({
						investigation:
							"Model food traveling through the mouth, pharynx, and esophagus.",
						artifact:
							"A three-page storyboard or flow diagram with arrows, labels, and process notes.",
						evidence:
							"The storyboard identifies what moves, what muscles or structures help, and what changes before the stomach.",
						review: "Find one place where the drawing could imply the wrong direction or process, then revise it."
					})
				},
				{
					title: "Project: Digestive Travel Entry",
					content: project({
						investigation:
							"Add a journal entry focused on the ingestion stage of the selected meal.",
						artifact:
							"A narrative or diagram that follows the meal through the first digestive organs.",
						evidence:
							"The entry names at least three organs and one physical process.",
						review: "Connect the journal entry back to the digestive-system organ map."
					})
				}
			]
		},
		{
			title: "BIO4 Digestion and Absorption",
			curriculum: [
				{
					title: "Digestion Versus Absorption",
					content: concept({
						investigation:
							"Digestion breaks food into smaller molecules; absorption moves useful molecules into the body.",
						model: "A timeline of the digestive tract can show where carbohydrates, proteins, fats, vitamins, minerals, and water are broken down or absorbed.",
						evidence:
							"Use separate color tracks for nutrient groups and mark where each group changes or enters the bloodstream or lymphatic system.",
						focus: "Explain why breaking food apart is not the same as absorbing it."
					})
				},
				{
					title: "Absorption Timeline",
					content: concept({
						investigation:
							"Different nutrients have different processing paths and do not all enter the body in exactly the same way.",
						model: "A multi-track timeline makes the digestive tract visible as a sequence of locations and transformations.",
						evidence:
							"Place digestion and absorption events along the mouth, stomach, small intestine, and large intestine.",
						focus: "Identify the small intestine as a major absorption site and explain what kind of evidence supports that role."
					})
				},
				{
					title: "Salad Clue Case",
					content: concept({
						investigation:
							"The case describes a salad ingredient carrying a fictional poison that shuts down digestion only after reaching a specific location.",
						model: "A clue-based biological argument uses the digestive sequence to rule out impossible locations and identify likely ingredients.",
						evidence:
							"Use the clue that the mouth, throat, and esophagus are unaffected, then compare lettuce, tomatoes, chicken, and olive oil by nutrient category.",
						focus: "Write a report that separates the clue, the digestive reasoning, and the final recommendation."
					})
				},
				{
					title: "Digestive Model Case Study",
					content: concept({
						investigation:
							"This online version treats the digestion model as a diagram, video still, or written case study unless safe materials are deliberately chosen outside the core assignment.",
						model: "The model compares mouth, stomach, and intestine roles through mechanical breakdown, chemical environment, and filtering or absorption.",
						evidence:
							"Annotate what each part of the model represents and name one important limitation of the model.",
						focus: "Explain why a model can be useful even when it does not copy the real digestive system perfectly."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Nutrient Absorption Timeline",
					content: project({
						investigation:
							"Build a digestive-tract timeline with separate tracks for major nutrient groups.",
						artifact:
							"A diagram or slide with organs, nutrient tracks, arrows, and short process labels.",
						evidence:
							"Each nutrient track includes at least one digestion note and one absorption or destination note.",
						review: "Use the timeline to explain where one meal component changes most."
					})
				},
				{
					title: "Project: Salad Clue Report",
					content: project({
						investigation:
							"Solve the fictional salad poison case using digestive sequence evidence.",
						artifact:
							"A short report with claim, evidence, reasoning, and one rejected alternative.",
						evidence:
							"The report cites the clue and explains why the unaffected organs matter.",
						review: "Identify whether the conclusion is certain or only best-supported by the available information."
					})
				},
				{
					title: "Project: Model Strengths and Limits",
					content: project({
						investigation:
							"Analyze a digestion model as a representation rather than a perfect replica.",
						artifact:
							"A two-column chart naming what the model explains well and what it hides or distorts.",
						evidence:
							"The chart references at least three digestive structures or processes.",
						review: "Connect one model limitation to a possible wrong conclusion."
					})
				}
			]
		},
		{
			title: "BIO5 Energy Use and Storage",
			curriculum: [
				{
					title: "Food to Cellular Energy",
					content: concept({
						investigation:
							"Food molecules can be converted into usable cellular energy after digestion and absorption.",
						model: "A cell-as-factory diagram shows inputs, processing steps, useful energy, and waste products. The model can connect glucose, oxygen, carbon dioxide, water, and ATP without turning the course into advanced biochemistry.",
						evidence:
							"Label the starting materials, the cellular location or process, and the products leaving the model.",
						focus: "Explain why food energy is transformed rather than simply appearing as usable energy."
					})
				},
				{
					title: "Energy Budget",
					content: concept({
						investigation:
							"A meal supplies energy that the body allocates across movement, temperature control, repair, growth, organ function, and storage.",
						model: "An energy budget is an estimate, not an exact medical calculation. It organizes where energy might go over a chosen time window.",
						evidence:
							"Assign portions of a meal's estimated energy to several body uses and explain the assumptions behind the allocation.",
						focus: "Separate the arithmetic in the budget from the biological claim being made."
					})
				},
				{
					title: "Energy Storage",
					content: concept({
						investigation:
							"Energy not used immediately can be stored in biological forms such as glycogen and fat.",
						model: "Storage is part of regulation. The body balances current energy demand, available nutrients, and future needs through connected organ systems.",
						evidence:
							"Trace one meal component from digestion to immediate use or storage.",
						focus: "Explain why stored energy can be useful and why unlimited storage would create problems."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Cell Factory Diagram",
					content: project({
						investigation:
							"Create a cell-factory model for converting absorbed nutrients into usable energy.",
						artifact:
							"A labeled diagram with inputs, process arrows, ATP or usable-energy output, and waste products.",
						evidence:
							"The diagram identifies glucose or another nutrient, oxygen, carbon dioxide, water, and energy transfer.",
						review: "Name one simplification in the factory model and one reason it remains useful."
					})
				},
				{
					title: "Project: Three-Hour Energy Budget",
					content: project({
						investigation:
							"Estimate how energy from the selected meal might be used across a three-hour period.",
						artifact:
							"A budget table or pie chart with activity categories, approximate energy allocation, and notes.",
						evidence:
							"The estimate is tied to at least four body functions or activities.",
						review: "Mark which values are measured, estimated, or assumed."
					})
				},
				{
					title: "Project: Energy Journal Entry",
					content: project({
						investigation:
							"Add a travel-journal entry focused on how the meal provides energy and storage material.",
						artifact:
							"A paragraph or diagram tracing at least two meal components into energy use or storage.",
						evidence:
							"The entry names the nutrient group and the likely body use for each tracked component.",
						review: "Revise an earlier prediction from the meal profile if the energy model changes it."
					})
				}
			]
		},
		{
			title: "BIO6 Regulation of Digestion",
			curriculum: [
				{
					title: "Regulation Organs",
					content: concept({
						investigation:
							"The stomach, pancreas, and liver support digestion and energy regulation through chemicals, storage, release, and feedback.",
						model: "A flowchart can show signals, organ responses, and changes in digestive activity or energy storage. Strong flowcharts separate the signal, the responding organ, the material released or stored, and the body condition that changes afterward.",
						evidence:
							"Add labeled arrows showing what each organ releases, stores, or changes. Use separate arrows for material movement, such as nutrients or bile, and information flow, such as chemical signals.",
						focus: "Explain why regulation requires feedback rather than a one-way process, and identify one place where the model would need more evidence to choose the exact signal."
					})
				},
				{
					title: "System Interaction Evidence",
					content: concept({
						investigation:
							"Digestive regulation connects with the endocrine, nervous, immune, circulatory, and excretory systems.",
						model: "A system-interaction map represents signals and material movement between systems. The map makes the direction of each connection visible so a hormone signal, blood transport pathway, nerve signal, immune response, or waste-removal pathway is not treated as the same kind of interaction.",
						evidence:
							"Use a short abstract, summary, or provided scenario to identify a digestive-system interaction with another body system. Record the quoted or paraphrased evidence beside the inferred biological meaning.",
						focus: "Quote or paraphrase the evidence before explaining the biological connection, then label whether the connection is directly stated or inferred from the scenario."
					})
				},
				{
					title: "Research Abstract Practice",
					content: concept({
						investigation:
							"Scientific abstracts are dense summaries. They can still be mined for the question, system involved, measured factor, and conclusion.",
						model: "An abstract annotation separates purpose, method, result, and limitation.",
						evidence:
							"Highlight or list phrases connected to digestion, energy storage, regulation, or body-system interaction.",
						focus: "Distinguish what the abstract directly reports from what the course model infers."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Regulation Flowchart",
					content: project({
						investigation:
							"Build a flowchart showing how digestive activity or energy storage is regulated.",
						artifact:
							"A labeled flowchart using the stomach, pancreas, liver, and at least one other body system.",
						evidence:
							"Arrows show signals or materials, and each node includes a short function label.",
						review: "Find one feedback loop or one missing signal that would improve the model."
					})
				},
				{
					title: "Project: Abstract Interaction Notes",
					content: project({
						investigation:
							"Read a short biology abstract or summary and extract digestive-system interactions.",
						artifact:
							"A bullet list or table naming the interaction, evidence phrase, and interpretation.",
						evidence:
							"At least three notes connect digestive regulation to another system.",
						review: "Label one note as direct evidence and one note as an inference."
					})
				},
				{
					title: "Project: Regulation Journal Entry",
					content: project({
						investigation:
							"Add a journal entry about one way another body system influences the selected meal's digestion or energy use.",
						artifact:
							"A paragraph, diagram, or flowchart connecting the meal to regulation.",
						evidence:
							"The entry names one regulating organ and one interacting body system.",
						review: "Connect the entry to the regulation flowchart rather than leaving it as an isolated description."
					})
				}
			]
		},
		{
			title: "BIO7 Elimination and Excretion",
			curriculum: [
				{
					title: "Elimination Versus Excretion",
					content: concept({
						investigation:
							"Elimination removes undigested or unabsorbed material from the digestive tract, while excretion removes metabolic wastes from the body.",
						model: "A comparison chart keeps digestive waste and metabolic waste separate. The large intestine, rectum, and anus are central to elimination; kidneys, bladder, lungs, liver, and skin connect to excretion.",
						evidence:
							"Classify example materials as eliminated, excreted, both connected, or not enough information.",
						focus: "Explain why feces and urine are not the same biological category of waste."
					})
				},
				{
					title: "Excretory Organ Cards",
					content: concept({
						investigation:
							"Major excretory structures include kidneys, bladder, liver, lungs, skin, and the materials they help remove or process.",
						model: "Trading cards turn organ structure and function into a compact reference model.",
						evidence:
							"Each card names the organ, the waste or material involved, and the body's reason for removing or processing it.",
						focus: "Connect each organ card to a material rather than only naming the organ."
					})
				},
				{
					title: "Alien Biology Comparison",
					content: concept({
						investigation:
							"A comparison scenario describes an alien with missing digestive structures but similar excretory organs.",
						model: "A Venn diagram compares how two organisms handle undigested material and metabolic waste.",
						evidence:
							"Classify similarities and differences using digestive and excretory vocabulary.",
						focus: "Explain how removing a digestive structure changes elimination without automatically changing every excretory process."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Waste-System Trading Cards",
					content: project({
						investigation:
							"Create trading cards for kidneys, bladder, liver, lungs, skin, and excreted material.",
						artifact:
							"Cards with image or symbol, function, waste material, and a short biological explanation.",
						evidence:
							"Each card names what the organ processes or removes.",
						review: "Sort the cards into digestive, excretory, or both-connected categories."
					})
				},
				{
					title: "Project: Alien Venn Diagram",
					content: project({
						investigation:
							"Compare a human and the scenario alien that lacks part of the digestive tract.",
						artifact:
							"A Venn diagram plus a short explanation of elimination and excretion differences.",
						evidence:
							"The comparison uses at least four vocabulary terms from the module.",
						review: "Name one claim the scenario supports and one claim that remains unknown."
					})
				},
				{
					title: "Project: Final Waste Journal Entry",
					content: project({
						investigation:
							"Complete the final travel-journal entry for the selected meal.",
						artifact:
							"A journal entry distinguishing which parts of the meal may be eliminated and which byproducts may be excreted.",
						evidence:
							"The entry names at least one digestive waste pathway and one metabolic waste pathway.",
						review: "Connect the final entry to earlier nutrient, energy, and regulation entries."
					})
				}
			]
		},
		{
			title: "BIO8 Digestive Odyssey Capstone",
			curriculum: [
				{
					title: "Capstone Evidence Portfolio",
					content: concept({
						investigation:
							"The final project synthesizes the digestive and excretory-system journey from the travel journal.",
						model: "The portfolio is a multi-stage system model: meal components enter, break down, absorb, convert to energy or storage, interact with regulation, and leave as eliminated or excreted material.",
						evidence:
							"Collect the meal profile, organ map, absorption timeline, energy model, regulation flowchart, and waste comparison.",
						focus: "Identify which artifact gives the strongest evidence for each stage of the biological journey."
					})
				},
				{
					title: "Capstone Representation Choices",
					content: concept({
						investigation:
							"The final product can be a slide exhibit, illustrated story, annotated map, comic, poster, or recorded explanation represented through notes and visuals.",
						model: "Different representations reveal different information. A map shows location, a timeline shows order, a flowchart shows regulation, and a story can connect cause and effect.",
						evidence:
							"Choose a representation and name what it shows well and what it may hide.",
						focus: "Make the final representation traceable back to notebook evidence rather than only decorative."
					})
				},
				{
					title: "Course Synthesis",
					content: concept({
						investigation:
							"The course connects organ systems, macromolecules, digestion, absorption, energy, regulation, elimination, and excretion.",
						model: "Biology explanations combine structure, function, evidence, and scale. A single meal can be traced from visible food to molecules, organs, cells, and body systems, and the final explanation shows how those scales connect instead of listing them separately.",
						evidence:
							"Use at least three earlier artifacts to support the final explanation. Good evidence might include the nutrient inventory, digestive organ map, absorption timeline, energy budget, regulation flowchart, or waste comparison.",
						focus: "Name one concept that became clearer after connecting multiple modules, then identify one model limitation that still matters after the capstone."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Digestive Odyssey Exhibit",
					content: project({
						investigation:
							"Create a final product that represents the selected meal's journey through digestion, energy use, regulation, and waste handling.",
						artifact:
							"A slide deck, poster, illustrated story, comic, annotated map, or notebook exhibit with labeled stages.",
						evidence:
							"The exhibit includes meal description, digestion and absorption observations, energy conversion, at least two system interactions, and elimination or excretion explanation.",
						review: "Trace one meal component across the whole exhibit from starting food to final destination."
					})
				},
				{
					title: "Project: Biology CER Presentation",
					content: project({
						investigation:
							"Turn one part of the capstone into a claim-evidence-reasoning explanation.",
						artifact:
							"A short presentation or written CER paragraph connected to one diagram or table.",
						evidence:
							"The claim references a body process, evidence comes from the journal or model, and reasoning explains the biological connection.",
						review: "Separate claim, evidence, and reasoning so the argument can be checked."
					})
				},
				{
					title: "Project: Final Systems Reflection",
					content: project({
						investigation:
							"Reflect on how the digestive and excretory systems connect with the rest of the body.",
						artifact:
							"A comparison or reflection page naming the most important system interaction and the strongest model from the course.",
						evidence:
							"The reflection cites at least two earlier artifacts.",
						review: "Name one model limitation that remains after the final project."
					})
				}
			]
		}
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS life science practices",
			"Structure and function",
			"Systems and system models",
			"Energy and matter",
			"Claim-evidence-reasoning"
		],
		sourcePolicy:
			"Adapted from the BIO1-BIO8 sequence with neutral wording, equipment-free activities, and original course diagrams based on the supplied cases.",
		assessmentCadence: [
			"One diagram or model per module",
			"One short CER or evidence explanation per module",
			"Course-long travel journal evidence portfolio"
		],
		toolchain: [
			"Shared screen",
			"Notebook or digital document",
			"Diagrams",
			"Provided case scenarios"
		],
		safetyPolicy: [
			"No required food handling",
			"No required household experiments",
			"No biological specimens",
			"No medical advice or diagnosis"
		],
		courseBoundaries: [
			"Introductory body systems and digestion focus",
			"No dissection or wet lab requirement",
			"No personalized nutrition or health guidance"
		],
		capstoneExpectations: [
			"Digestive-system journey model",
			"Evidence portfolio",
			"Claim-evidence-reasoning explanation",
			"Model limitation reflection"
		],
		recommendedNextWork: [
			"Add vetted open biology reference links by module",
			"Cross-link Intro to Environmental Science where ecosystems, energy flow, and evidence modeling continue the biology sequence"
		]
	}
};

interface IntroBiologyFlow {
	answerSection: string;
	boundaryCheck: string;
	estimatedTime: string;
	evidenceGate: string;
	flowNote: string;
	keyBlocks: string[];
	materialSection: string;
	referenceLink: string;
}

const INTRO_BIOLOGY_FLOW: Record<string, IntroBiologyFlow> = {
	"BIO1 Human Body Systems": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"system boundary",
			"organization across scales",
			"structure and function",
			"matter and information flow",
			"homeostasis",
			"model limitation"
		],
		flowNote:
			"Establish biological evidence habits and map how cells, tissues, organs, and systems coordinate one function without treating a diagram as a complete or universal body.",
		evidenceGate:
			"Name the system boundary, distinguish matter flow from information flow, and support every interaction arrow with the supplied scenario or an authoritative source.",
		boundaryCheck:
			"Human examples illustrate system organization but do not define every organism, predict an individual's body, or support medical conclusions.",
		referenceLink: BIOLOGY_REFERENCES.ngssLifeScience,
		materialSection: "body-systems-scenario-cards",
		answerSection: "body-systems-scenario-key"
	},
	"BIO2 Nutrients and Macromolecules": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"carbohydrate",
			"lipid",
			"protein",
			"monomer and polymer",
			"evidence from labels or tables",
			"health-claim boundary"
		],
		flowNote:
			"Translate food descriptions into molecule-level evidence, compare macromolecule roles without moral labels, and preserve uncertainty when a food contains several nutrient categories.",
		evidenceGate:
			"Use the supplied molecule or label evidence for each classification, identify at least one multi-category ingredient, and reject any claim based only on a food name or appearance.",
		boundaryCheck:
			"Nutrient models explain biological materials and processes; they do not rank foods as good or bad, prescribe a diet, or infer personal health.",
		referenceLink: BIOLOGY_REFERENCES.openStaxMacromolecules,
		materialSection: "nutrient-and-macromolecule-evidence-table",
		answerSection: "nutrient-evidence-key"
	},
	"BIO3 Digestive Process": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"gastrointestinal path",
			"accessory organ",
			"mechanical digestion",
			"chemical digestion",
			"enzyme",
			"matter conservation"
		],
		flowNote:
			"Trace material through the gastrointestinal tract, connect tissues and secretions to mechanical and chemical processing, and use enzymes as bounded molecular models.",
		evidenceGate:
			"Keep location, movement, secretion, molecule change, and evidence in separate storyboard fields so transport is not confused with digestion.",
		boundaryCheck:
			"An enzyme model explains specificity and condition dependence without claiming that enzymes consciously choose substrates, are used up like reactants, or make matter disappear.",
		referenceLink: BIOLOGY_REFERENCES.niddkDigestion,
		materialSection: "digestive-pathway-and-enzyme-cards",
		answerSection: "digestive-process-key"
	},
	"BIO4 Digestion and Absorption": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"digestion versus absorption",
			"epithelial boundary",
			"diffusion",
			"facilitated diffusion",
			"active transport",
			"blood and lymph routes"
		],
		flowNote:
			"Move from broken-down molecules to membrane crossing, distinguish passive and active transport, and trace absorbed materials into blood or lymph without treating food as entering cells intact.",
		evidenceGate:
			"For each route, identify the molecule model, membrane or tissue boundary, gradient direction, transport evidence, destination, and one omitted mechanism.",
		boundaryCheck:
			"Net diffusion does not mean particles stop moving, active transport is not movement caused by effort or intention, and a villus diagram is not a literal photograph of absorption.",
		referenceLink: BIOLOGY_REFERENCES.hhmiMembraneTransport,
		materialSection: "absorption-and-membrane-transport-cases",
		answerSection: "absorption-and-transport-key"
	},
	"BIO5 Energy Use and Storage": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"cellular respiration",
			"matter accounting",
			"energy transfer",
			"ATP coupling",
			"biosynthesis and storage",
			"heat"
		],
		flowNote:
			"Trace absorbed carbon-containing molecules into cellular reactions, distinguish matter from energy, and model ATP as a repeatedly produced coupling molecule rather than stored energy itself.",
		evidenceGate:
			"Track carbon atoms, oxygen, carbon dioxide, ATP-related transfer, and heat in separate ledger columns, then identify which values are supplied, inferred, or outside the model.",
		boundaryCheck:
			"The overall respiration equation is an accounting model rather than one reaction step, energy is transferred rather than created, and fictional data replaces personal calorie estimates.",
		referenceLink: BIOLOGY_REFERENCES.openStaxEnergy,
		materialSection: "cellular-energy-ledger",
		answerSection: "cellular-energy-key"
	},
	"BIO6 Regulation of Digestion": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"stimulus",
			"signal",
			"target response",
			"negative feedback",
			"dynamic homeostasis",
			"association versus causation"
		],
		flowNote:
			"Model regulation as dynamic feedback, separate signals from transported materials, and read abstracts or microbiome claims without extending group-level evidence to individual health.",
		evidenceGate:
			"A regulation claim names the changing condition, evidence for detection or signaling, responding tissue, outcome, and whether the loop reduces the original deviation.",
		boundaryCheck:
			"Homeostasis is not a perfectly fixed state, one graph does not reveal every signal, and an association in a study does not prove causation or diagnose an individual.",
		referenceLink: BIOLOGY_REFERENCES.niddkDigestion,
		materialSection: "feedback-and-regulation-cases",
		answerSection: "regulation-key"
	},
	"BIO7 Elimination and Excretion": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"elimination",
			"metabolic waste",
			"filtration",
			"reabsorption",
			"osmoregulation",
			"matter pathway"
		],
		flowNote:
			"Separate material left in the digestive tract from metabolic wastes carried through the body, then connect lungs, liver, kidneys, skin, and urinary structures through explicit pathways.",
		evidenceGate:
			"Classify a material only after naming where it was produced, whether it entered internal circulation, which organ processed or removed it, and which boundary it crossed.",
		boundaryCheck:
			"Feces and urine are not interchangeable, kidneys selectively filter and reabsorb rather than simply cleaning food, and fictional cases cannot assess organ health.",
		referenceLink: BIOLOGY_REFERENCES.niddkKidneys,
		materialSection: "elimination-and-excretion-sort",
		answerSection: "elimination-and-excretion-key"
	},
	"BIO8 Digestive Odyssey Capstone": {
		estimatedTime: "8–10 sessions · 60–120 minutes each",
		keyBlocks: [
			"narrow system question",
			"traceable source log",
			"cross-scale pathway",
			"matter-energy-information distinction",
			"changed-condition prediction",
			"revision and defense"
		],
		flowNote:
			"Defend one cross-scale Digestive Odyssey model with traceable evidence, accessible representations, a changed-condition prediction, and an explicit statement of what this human-biology case cannot establish.",
		evidenceGate:
			"The final packet connects a meal component across molecule, cell or tissue, organ, and system scales while preserving the source and limitation for every major claim.",
		boundaryCheck:
			"This capstone demonstrates introductory human-biology systems reasoning, not medical expertise or full survey mastery of genetics, evolution, ecology, and biological diversity.",
		referenceLink: BIOLOGY_REFERENCES.hhmiSystems,
		materialSection: "digestive-odyssey-capstone-packet",
		answerSection: "capstone-defense-rubric"
	}
};

const INTRO_BIOLOGY_ADDITIONS: Record<string, RawCourseModuleItem[]> = {
	"BIO1 Human Body Systems": [
		{
			title: "Biology Scope, Scale, and Evidence Contract",
			content: [
				"**Scope boundary:** Digestive Odyssey is an introductory human-biology case study. It develops evidence, structure-function, systems, homeostasis, matter-and-energy, and cross-scale modeling through one sustained meal journey. It does not pretend that digestion alone is a complete survey of cell division, genetics, evolution, ecology, or biological diversity.",
				"**Scale contract:** Explanations label molecule, organelle, cell, tissue, organ, organ system, organism, and environment levels when they appear. A function at one scale is not copied automatically to another: a stomach is not a large cell, and a molecule does not have the goals or experiences of the organism.",
				"**Evidence contract:** Observation, supplied datum, source statement, model-based inference, and claim remain visibly distinct. Each system model names its boundary, inputs, outputs, interactions, changed-condition prediction, and one feature left outside the boundary.",
				"**Next-path map:** Genetics and evolution explain inherited variation across generations; ecology extends systems reasoning to populations and ecosystems; cell biology adds organelles, division, and molecular information. Those topics are identified as next courses rather than implied mastery here."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.ngssLifeScience,
			learningPath: "core"
		},
		{
			title: "Homeostasis, Variation, and Accessible Models Gate",
			content: [
				"**Homeostasis:** A regulated system changes continuously while keeping selected conditions within workable ranges. The model identifies a variable, evidence of change, a sensing or signaling process, a response, and the effect on the original deviation; homeostasis is not a claim that every value stays constant.",
				"**Variation:** Human diagrams and reference ranges are models, not universal templates. Age, body size, genetics, environment, health, and measurement conditions can alter observed values. Course cases remain fictional and never request comparisons of private body data or inferences about whether a person is normal.",
				"**Accessible representation:** Color is never the only label for an organ, pathway, arrow type, or condition. Diagrams include names, shapes, line styles, reading order, and text descriptions; any image-dependent task has an equivalent supplied scenario or table.",
				"**Mastery check:** Revise one body-system map so it includes a boundary, two interaction types, a feedback-related prediction, a text equivalent, and one variation or uncertainty note."
			].join("\n\n"),
			datasetLink: biologyMaterial("body-systems-scenario-cards"),
			solutionLink: biologyAnswerKey("body-systems-scenario-key"),
			learningPath: "core"
		}
	],
	"BIO2 Nutrients and Macromolecules": [
		{
			title: "Molecule-to-Nutrient Evidence Gate",
			content: [
				"**Classification rule:** A food is a mixture of materials, not one macromolecule. Carbohydrates, lipids, proteins, and nucleic acids are molecule categories; vitamins, minerals, and water are biologically important but are not all polymers or energy sources. Classifications follow supplied composition evidence rather than appearance or everyday reputation.",
				"**Structure-function bridge:** Polymers can be broken into smaller units and smaller units can be used in new molecules, but a food label does not reveal every molecular structure or metabolic destination. Proteins do more than build muscle, lipids do more than store energy, and carbohydrates do more than provide an immediate burst.",
				"**Uncertainty routine:** For every meal claim, record the ingredient, evidence source, molecule or nutrient category, plausible biological role, and one reason the role is not guaranteed. Multi-category ingredients remain multi-category rather than forced into one box.",
				"**Mastery check:** Classify five supplied ingredients, defend each with evidence, reject one moralized food label, and revise one overconfident claim into a bounded biological statement."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.openStaxMacromolecules,
			solutionLink: biologyAnswerKey("nutrient-evidence-key"),
			learningPath: "core"
		},
		{
			title: "Nutrition Evidence and Personal-Health Boundary",
			content: [
				"**Evidence boundary:** Recipe cards, fictional labels, and molecule tables support classification and pathway models. They do not establish an ideal diet, diagnose deficiency, predict weight change, or show how one individual will respond.",
				"**Language boundary:** Use composition-rich, low in the supplied table, associated in this dataset, or supports this model instead of healthy, unhealthy, clean, bad, guilt-free, or optimal. A biological explanation addresses molecules and evidence without assigning moral value to food or bodies.",
				"**Privacy and access:** No learner records meals, allergies, medical conditions, body measurements, cultural practices, or household purchases unless voluntarily choosing a fictionalized example that can be replaced immediately. The supplied ingredient table is always sufficient.",
				"**Mastery check:** Audit one recipe or Dinner Mystery explanation for unsupported certainty, personal-health inference, and single-nutrient labeling, then rewrite it using only the evidence actually available."
			].join("\n\n"),
			datasetLink: biologyMaterial(
				"nutrient-and-macromolecule-evidence-table"
			),
			solutionLink: biologyAnswerKey("nutrient-evidence-key"),
			learningPath: "core"
		}
	],
	"BIO3 Digestive Process": [
		{
			title: "Cells, Tissues, Organs, and Enzymes Bridge",
			content: [
				"**Cross-scale model:** Food moves through an organ system, but digestion depends on tissue movement, secretory cells, molecular interactions, and enzymes. A complete pathway can zoom from organ location to tissue boundary to molecule change without treating one picture as all three scales.",
				"**Enzyme model:** Enzymes are biological catalysts whose shape and chemical environment influence which reactions proceed efficiently. Substrate specificity, pH, temperature, concentration, and saturation can affect a supplied activity graph; the introductory model does not imply that enzymes think, choose, or disappear after one reaction.",
				"**Matter rule:** Mechanical digestion changes size and mixing. Chemical digestion rearranges bonds and produces smaller molecular units. Neither process destroys matter, and visible disappearance is not enough evidence that a molecule has been absorbed or used by a cell.",
				"**Mastery check:** Annotate one digestive frame with organ, tissue action, enzyme or secretion, substrate, product model, evidence, and a statement of what remains unchanged."
			].join("\n\n"),
			datasetLink: biologyMaterial("digestive-pathway-and-enzyme-cards"),
			solutionLink: biologyAnswerKey("digestive-process-key"),
			learningPath: "core"
		},
		{
			title: "Mechanical and Chemical Digestion Misconception Gate",
			content: [
				"**Path invariant:** Food follows the gastrointestinal tract; it does not pass through the liver, pancreas, or gallbladder. Accessory organs contribute materials or processing support through ducts, blood, and signaling pathways.",
				"**Process distinctions:** Chewing, mixing, and peristalsis are mechanical or transport actions. Acid changes conditions; enzymes catalyze reactions; bile supports lipid processing but is not itself an enzyme. Absorption is a later boundary-crossing process rather than another word for digestion.",
				"**Evidence check:** A location label alone does not establish what reaction occurs, and a reaction name alone does not establish where it occurs. Pair each claim with a supplied pathway card or authoritative reference and identify the scale represented.",
				"**Mastery check:** Correct four claims: food falls down the esophagus, the stomach digests everything, bile is an enzyme, and digested matter has entered the body. Explain the evidence used for every correction."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.niddkDigestion,
			solutionLink: biologyAnswerKey("digestive-process-key"),
			learningPath: "core"
		}
	],
	"BIO4 Digestion and Absorption": [
		{
			title: "Membrane Transport and Absorption Gate",
			content: [
				"**Boundary model:** Absorption crosses an epithelial and cellular boundary after suitable molecules are available. The explanation identifies what crosses, which side is the digestive lumen, which side connects to internal transport, and whether the simplified route enters blood or lymph.",
				"**Transport distinctions:** Simple diffusion and facilitated diffusion move down an applicable gradient without direct ATP coupling; facilitated diffusion uses a membrane protein. Active transport uses coupled cellular energy to move a substance against its gradient or maintain a distribution. Osmosis concerns water across a selectively permeable membrane.",
				"**Model limits:** Net movement does not mean one-way particle motion, equilibrium does not mean particles stop, and active transport is not defined by speed or by a cell trying harder. Surface-area models support relative absorption claims only when other conditions are held comparable.",
				"**Mastery check:** Solve the four supplied cases, draw concentration and route labels, classify the transport evidence, and state one feature the membrane model omits."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.hhmiMembraneTransport,
			solutionLink: biologyAnswerKey("absorption-and-transport-key"),
			learningPath: "core"
		},
		{
			title: "Digestion-to-Transport Evidence Chain",
			content: [
				"**Evidence chain:** Start with a supplied macromolecule, name the digestive process that produces smaller units, identify the intestinal boundary, classify the transport mechanism only when gradient or coupling evidence is available, and trace the first internal route.",
				"**Route distinction:** Many simple sugars and amino acids enter blood pathways, while many absorbed lipid products enter lymphatic pathways before joining circulation. This is an introductory route model, not a claim that every molecule follows one identical path.",
				"**Surface-area reasoning:** Folds, villi, and microvilli increase available exchange area, but a larger drawing does not itself prove a faster rate. A defensible comparison names the area evidence and holds molecule, gradient, membrane property, and time conditions consistent.",
				"**Mastery check:** Build one trace with five linked claims and reject one unsupported leap, such as digested food goes straight to every cell or more villi always guarantees more absorption."
			].join("\n\n"),
			datasetLink: biologyMaterial(
				"absorption-and-membrane-transport-cases"
			),
			solutionLink: biologyAnswerKey("absorption-and-transport-key"),
			learningPath: "core"
		}
	],
	"BIO5 Energy Use and Storage": [
		{
			title: "Cellular Respiration, ATP, and Matter-Energy Gate",
			content: [
				"**Matter account:** The overall aerobic cellular-respiration model tracks carbon-containing molecules and oxygen into carbon dioxide and water. Atoms are rearranged rather than converted into energy, and the single equation compresses many reactions and cellular locations.",
				"**Energy account:** Chemical reactions transfer energy among molecular systems. Some transfer supports ATP production and cellular work, while some energy disperses as heat. Energy is not created, stored as a substance inside ATP, or interchangeable with carbon atoms.",
				"**ATP boundary:** ATP is continuously produced and used in coupled cellular processes. It is a short-term transfer mechanism rather than a permanent battery, a synonym for glucose, or the only molecule involved in metabolism.",
				"**Mastery check:** Complete the supplied ledger, label matter and energy separately, account for carbon and oxygen, identify two simplifications, and explain why a personal calorie budget is not required evidence."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.openStaxEnergy,
			solutionLink: biologyAnswerKey("cellular-energy-key"),
			learningPath: "core"
		},
		{
			title: "Food Carbon, Photosynthesis, and Storage Boundary",
			content: [
				"**Source connection:** Much of the chemical energy and carbon in food webs traces to producers that build sugars through photosynthesis. Human cells do not photosynthesize; they transform absorbed molecules through respiration, biosynthesis, storage, and other metabolic pathways.",
				"**Storage distinctions:** Glycogen and lipids are different molecule stores with different tissues, capacities, and pathways. A cell-factory model can show destination choices without implying that every meal component is immediately burned, turned into fat, or routed by one universal schedule.",
				"**Estimate boundary:** A fictional energy ledger can compare pathways, but no three-hour classroom model has enough information to predict an individual's exact energy expenditure or storage. Values remain explicitly supplied, estimated, or assumed.",
				"**Mastery check:** Trace one carbon atom through a producer-to-food-to-cell story, then branch the cell destination into respiration and biosynthesis while preserving uncertainty."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.ngssLifeScience,
			solutionLink: biologyAnswerKey("cellular-energy-key"),
			learningPath: "core"
		}
	],
	"BIO6 Regulation of Digestion": [
		{
			title: "Negative Feedback and Signal-Material Distinction",
			content: [
				"**Feedback structure:** A defensible negative-feedback loop names a changing condition, evidence that the condition is detected or communicated, a signal, a target response, and an outcome that reduces the initial deviation. It also states the system boundary and time scale.",
				"**Arrow semantics:** Information arrows represent neural or chemical signals; material arrows represent nutrients, digestive secretions, gases, water, or wastes; energy-transfer annotations answer a third question. Using one unlabeled arrow type hides the mechanism.",
				"**Homeostasis boundary:** Regulation maintains dynamic ranges through interacting processes. It does not mean the body is motionless, every person has one ideal number, or any single organ controls the entire system independently.",
				"**Mastery check:** Build the supplied post-meal model, label each arrow type, identify one unmeasured step, and predict what the graph would show if the modeled response were weaker or delayed."
			].join("\n\n"),
			datasetLink: biologyMaterial("feedback-and-regulation-cases"),
			solutionLink: biologyAnswerKey("regulation-key"),
			learningPath: "core"
		},
		{
			title: "Abstract, Microbiome, and Causal-Claim Gate",
			content: [
				"**Reading routine:** Extract the population or model system, comparison, measured variable, result, uncertainty, and stated limitation before interpreting an abstract. A dense technical term is not evidence by itself.",
				"**Causal boundary:** Association, correlation, temporal order, and mechanism are different claims. A microbiome pattern associated with one outcome does not prove that one organism caused the outcome, represent the whole microbial community, or predict an individual.",
				"**Transfer boundary:** Group averages and controlled model systems can support a course mechanism, but they do not authorize diagnosis, treatment, supplement advice, or dietary recommendations. Personal symptoms and health history are outside every assignment.",
				"**Mastery check:** Annotate the supplied abstract case, write the strongest claim the evidence supports, reject one causal overreach, and name one study design or measurement that would strengthen the inference."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.niddkDigestion,
			solutionLink: biologyAnswerKey("regulation-key"),
			learningPath: "core"
		}
	],
	"BIO7 Elimination and Excretion": [
		{
			title: "Elimination, Excretion, and Conservation Gate",
			content: [
				"**Path distinction:** Elimination removes material that remains in or is added to the digestive tract. Excretion removes products of metabolism or excess substances from internal fluids. A material's everyday label as waste is not enough; its origin and route decide the biological category.",
				"**Organ-system model:** Lungs remove carbon dioxide and water vapor, kidneys filter blood and selectively reabsorb or secrete substances, skin participates in water and salt loss, and the liver transforms or processes many molecules. No single organ simply removes all toxins.",
				"**Matter account:** Carbon, nitrogen, water, salts, and undigested material follow different pathways. Heat leaving the body is energy transfer rather than matter excretion, while a nutrient entering blood is absorption rather than waste removal.",
				"**Mastery check:** Complete the supplied sort, draw one internal-to-external pathway, identify one reabsorbed material, and revise any response that equates feces with urine."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.niddkKidneys,
			solutionLink: biologyAnswerKey("elimination-and-excretion-key"),
			learningPath: "core"
		},
		{
			title: "Kidney Filtration and Osmoregulation Boundary",
			content: [
				"**Filtration model:** Blood enters kidney vessels; small materials and fluid can enter a nephron filtrate model; useful water and solutes can be reabsorbed; additional substances can be secreted; the remaining fluid becomes urine. This sequence is more accurate than saying kidneys strain out every bad substance.",
				"**Balance model:** Osmoregulation concerns water and dissolved-substance balance across body fluids and membranes. A classroom diagram can explain direction and selective processing without calculating an individual's kidney function or hydration needs.",
				"**Evidence boundary:** Supplied organ diagrams and NIDDK descriptions support structure-function claims. They do not support claims about disease, treatment, urine appearance, or whether a particular person is healthy.",
				"**Mastery check:** Label filtration, reabsorption, secretion, urine flow, and blood flow on a simplified nephron pathway, then name two structures or regulatory details left outside the model."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.niddkKidneys,
			solutionLink: biologyAnswerKey("elimination-and-excretion-key"),
			learningPath: "core"
		}
	],
	"BIO8 Digestive Odyssey Capstone": [
		{
			title: "Capstone Source, Traceability, and Uncertainty Contract",
			content: [
				"**Source log:** Record organization or author, title, date when available, direct link, evidence type, exact claim supported, and one limitation. Prefer authoritative public-health, standards, textbook, or research-education sources over unattributed summaries.",
				"**Traceability:** Every pathway arrow connects to a cited source, supplied case, or earlier artifact. Every graph names axes and units when present; every image has a text description; every molecule, tissue, organ, and system claim identifies its scale.",
				"**Uncertainty:** Separate measurement uncertainty, missing mechanism, model simplification, biological variation, and course-scope boundary. State what result would weaken the explanation and what evidence would be needed before making a stronger claim.",
				"**Integrity and privacy:** Paraphrase sources, preserve citations through revision, use fictional meal evidence, and exclude personal diet, symptoms, diagnoses, body measurements, and medical recommendations."
			].join("\n\n"),
			datasetLink: biologyMaterial("digestive-odyssey-capstone-packet"),
			solutionLink: biologyAnswerKey("capstone-defense-rubric"),
			learningPath: "core"
		},
		{
			title: "Capstone Revision, Defense, and Next-Path Map",
			content: [
				"**Required packet:** Submit the narrow question, initial model, source log, molecule-to-cell-to-system trace, digestive or transport mechanism, cellular-use model, regulation loop, waste distinction, changed-condition prediction, final model, and limitation statement.",
				"**Revision record:** Preserve one before-and-after section showing how feedback changed a biological mechanism, scale connection, evidence source, arrow meaning, uncertainty statement, or system boundary. A wording-only edit does not demonstrate model revision.",
				"**Defense:** Identify direct evidence, inference, alternative explanation, omitted variable, representation strength, representation weakness, and the result that would change the claim. Defend why the model is useful without claiming that it is complete.",
				"**Next-path map:** Connect unresolved questions to cell biology, genetics, evolution, ecology, microbiology, or environmental science. The map makes the course boundary visible and turns gaps into intentional next learning rather than hidden omissions."
			].join("\n\n"),
			datasetLink: BIOLOGY_REFERENCES.hhmiSystems,
			solutionLink: biologyAnswerKey("capstone-defense-rubric"),
			learningPath: "core"
		}
	]
};

function introBiologyProjectPath(title: string) {
	return /model strengths|abstract|CER|final systems|alien/i.test(title)
		? ("challenge" as const)
		: ("choice" as const);
}

const INTRO_BIOLOGY_BACKGROUND: Record<string, string> = {
	BIO1: "https://openstax.org/books/biology-2e/pages/33-1-animal-form-and-function",
	BIO2: BIOLOGY_REFERENCES.openStaxMacromolecules,
	BIO3: BIOLOGY_REFERENCES.niddkDigestion,
	BIO4: "https://openstax.org/books/biology-2e/pages/5-2-passive-transport",
	BIO5: BIOLOGY_REFERENCES.openStaxEnergy,
	BIO6: "https://openstax.org/books/biology-2e/pages/37-3-regulation-of-body-processes",
	BIO7: BIOLOGY_REFERENCES.niddkKidneys,
	BIO8: BIOLOGY_REFERENCES.ngssLifeScience
};

export const introToBiologyCourse: RawCourse = {
	...introToBiologySourceCourse,
	modules: introToBiologySourceCourse.modules.map(module => {
		const flow = INTRO_BIOLOGY_FLOW[module.title];
		const lesson = introBiologyLessons[module.title];
		const originals = [
			...module.curriculum,
			...INTRO_BIOLOGY_ADDITIONS[module.title]
		];
		if (
			!lesson ||
			lesson.tasks.length !== originals.length - 1 ||
			lesson.optional.length !== module.supplementalProjects.length
		) {
			throw new Error(
				`Missing Intro to Biology teaching: ${module.title}`
			);
		}
		const inputs = biologyMaterial(flow.materialSection);
		const answers = biologyAnswerKey(flow.answerSection);
		const resources = `\n\n[Case inputs](/course-resource?asset=${encodeURIComponent(
			inputs
		)})\n\n[Project self-check](/course-resource?asset=${encodeURIComponent(
			answers
		)})`;
		return {
			...module,
			estimatedTime: flow.estimatedTime,
			keyBlocks: flow.keyBlocks,
			curriculum: originals.map((item, index) => ({
				...item,
				content: [
					index === 0
						? `${lesson.reading}\n\n[Mechanism reference](${
								INTRO_BIOLOGY_BACKGROUND[
									module.title.split(" ")[0]
								]
							})`
						: lesson.tasks[index - 1],
					item.sourceMedia ? item.content : "",
					resources
				]
					.filter(Boolean)
					.join("\n\n"),
				contentKind:
					index === 0
						? ("reading" as const)
						: ("assignment" as const),
				preserveInstructions: true,
				preserveAssignment: true,
				datasetLink: inputs,
				solutionLink: answers,
				learningPath: "core" as const
			})),
			supplementalProjects: module.supplementalProjects.map(
				(item, index) => ({
					...item,
					content: lesson.optional[index] + resources,
					contentKind: "assignment" as const,
					preserveInstructions: true,
					preserveAssignment: true,
					datasetLink: inputs,
					solutionLink: answers,
					learningPath: introBiologyProjectPath(item.title)
				})
			)
		};
	}),
	developmentMetadata: {
		...introToBiologySourceCourse.developmentMetadata!,
		standards: [
			"NGSS HS-LS1 structures and processes",
			"Structure and function across biological scales",
			"Systems, system boundaries, and homeostasis",
			"Matter, energy, and information flow",
			"Developing and revising models",
			"Claim-evidence-reasoning with uncertainty"
		],
		sourcePolicy:
			"Preserves the BIO1-BIO8 Digestive Odyssey sequence while adding authoritative NGSS, NIDDK and OpenStax references; eight worked readings and complete supplied fictional cases; original diagrams based on the supplied worksheets with accessible media alternatives; and explicit medical, nutrition, privacy, and course-scope boundaries.",
		assessmentCadence: [
			"One model with a named boundary, scale, evidence source, and limitation per module",
			"One curated media, supplied-data, or authoritative-reference evidence check per module",
			"One misconception correction or changed-condition prediction per module",
			"Course-long travel journal with preserved revisions",
			"Capstone CER and model defense using the common rubric"
		],
		toolchain: [
			"Notebook or digital document",
			"Supplied biology materials pack and answer-key rubric",
			"Accessible diagrams and text alternatives",
			"Authoritative public biology references",
			"Optional public models with noninteractive supplied alternatives"
		],
		safetyPolicy: [
			"No required food handling, tasting, body measurement, or household experiment",
			"No biological specimens, dissection, or wet-lab requirement",
			"No personal diet, symptoms, diagnoses, medical history, or body data",
			"No medical, nutrition, supplement, or treatment advice",
			"Fictional cases and supplied evidence remain sufficient for every assessment"
		],
		courseBoundaries: [
			"Introductory human-body systems and digestion case study rather than a complete biology survey",
			"Conceptual cell, enzyme, membrane, metabolism, feedback, and excretion models without laboratory certification",
			"No personalized nutrition, health assessment, diagnosis, or treatment guidance",
			"Genetics, evolution, ecology, microbiology, and biodiversity are named next paths rather than implied mastery"
		],
		capstoneExpectations: [
			"Cross-scale Digestive Odyssey system model",
			"Traceable source and evidence portfolio",
			"Matter-energy-information distinction",
			"Changed-condition prediction and alternative explanation",
			"Accessible representation with model limitation",
			"Before-and-after revision and oral or written defense"
		],
		recommendedNextWork: [
			"Add anonymized exemplar responses at multiple proficiency levels using the CER/model-rubric without introducing personal health data.",
			"Cross-link genetics, evolution, cell biology, and Intro to Environmental Science pathways when those catalog transitions have dedicated readiness maps."
		]
	}
};
