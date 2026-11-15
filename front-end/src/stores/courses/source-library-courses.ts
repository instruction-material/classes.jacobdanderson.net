import type {
	CourseItemLearningPath,
	RawCourse,
	RawCourseModule,
	RawCourseModuleItem
} from "./types";
import { correctedJuniScratchInstructions } from "./juniScratchInstructionCorrections";
import { scratchBootcampTask } from "./scratchBootcampTasks";
import { pendingStaticMediaNotice, staticMediaUrl } from "./staticMedia";
import { buildSupportSectionGuidance } from "./supportSectionGuidance";

interface SourceLibraryCourseSpec {
	area: string;
	focus: string;
	name: string;
	modules: string[];
	moduleMetadata?: Record<string, SourceLibraryModuleMetadata>;
	splitSourceActivityAnchors?: boolean;
	sourceActivityAnchors?: Record<string, SourceActivityAnchor[]>;
	staticAssets?: string[];
}

interface SourceActivityAnchor {
	aliases?: string[];
	id?: string;
	learningPath?: CourseItemLearningPath;
	preserveAssignment?: boolean;
	preserveInstructions?: boolean;
	projectLink?: string;
	title: string;
	prompt: string;
	evidence: string[];
}

interface SourceLibraryModuleMetadata {
	conceptLearningPath?: CourseItemLearningPath;
	estimatedTime: string;
	flowNote: string;
	keyBlocks: string[];
}

const middleSchoolBWritingSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"MSB1 Arguments & Evidence": [
		{
			title: "Steph Curry Argument Parts Model",
			prompt: "Use the supplied fictional basketball records to separate a debatable claim, supporting reasons, and evidence. A Steph Curry comparison can use separately verified statistics with a named source and date. Then create argument records for the supplied cell phones at school, TikTok dances as art, and best pet cases, identifying the criterion and assumptions.",
			evidence: [
				"A debatable claim that can be reasonably opposed.",
				"Two reasons connected to the claim with because or by.",
				"Evidence that supports the reasons instead of repeating the claim."
			]
		}
	],
	"MSB2 Counterclaims": [
		{
			title: "Hypothetical Hannah Counterclaim Lab",
			prompt: "Practice counterclaims by pairing each claim with an opposing but still reasonable argument. Use conditional verbs and contrast transitions such as still or however so the opposing perspective is clearly marked.",
			evidence: [
				"One original claim with reasoning and evidence.",
				"One counterclaim with its own reasoning and evidence.",
				"Conditional or contrast language that signals the counterclaim without abandoning the original position."
			]
		}
	],
	"MSB3 Integrating Evidence": [
		{
			title: "Colon and Comma Quote Integration",
			prompt: "Integrate textual evidence in two ways: a complete sentence followed by a colon, and a short introductory phrase followed by a comma. Use the dog-versus-cat example as the model for punctuation and sentence flow.",
			evidence: [
				"One quote introduced by a complete sentence and colon.",
				"One quote introduced by a short phrase and comma.",
				"A note explaining why the punctuation matches the introductory wording."
			]
		}
	],
	"MSB4 Analyzing Evidence": [
		{
			title: "Car Ride Evidence Analysis Paragraph",
			prompt: "Use the supplied original Car Ride practice passage, or another identified passage, to build an analytical paragraph: make a debatable inference about Kazim's mood, select textual evidence, integrate it, then explain how and why it supports the claim. Keep the interpretation within the chosen text.",
			evidence: [
				"A claim about Kazim's mood or attitude.",
				"Integrated textual evidence from the passage.",
				"Analysis that connects the evidence to the claim rather than ending at the quote."
			]
		},
		{
			title: "Arguing for the Opposition",
			prompt: "Write from the opposing side of an argument by selecting evidence that could support a different interpretation. Make the alternative position credible before evaluating it.",
			evidence: [
				"An opposing claim that is debatable and plausible.",
				"Evidence chosen specifically for that opposing claim.",
				"Analysis explaining how the evidence supports the opposition."
			]
		}
	],
	"MSB5 Concluding Statements & Transitional Devices": [
		{
			title: "Conclusion and Transition Revision Pass",
			prompt: "Revise an argumentative paragraph by adding a concluding statement that restates the argument in fresh language and extends it with a related idea. Then add transitional devices that clarify addition, contrast, cause, example, or conclusion relationships.",
			evidence: [
				"A revised conclusion that is not a copy of the topic sentence.",
				"Transitions placed where relationships between ideas need to be clear.",
				"A short explanation of how each transition changes the paragraph's flow."
			]
		}
	],
	"MSB6 Color Coding & Revision": [
		{
			title: "Color-Coded Argument Revision",
			prompt: "Use color-coding to mark claim, reasoning, counterclaim, evidence, analysis, transitions, and conclusion in an argumentative paragraph. Revise any section that is missing, repetitive, unsupported, or out of order.",
			evidence: [
				"A color-coded paragraph or labeled outline.",
				"At least one revision based on the color pattern.",
				"A note naming which argument part improved and why."
			]
		},
		{
			title: "Opposition Paragraph Revision",
			prompt: "Apply the same color-coding and revision process to an opposition paragraph. The paragraph needs a credible opposing claim, support, and analysis rather than a weak straw-person version.",
			evidence: [
				"A labeled opposition paragraph.",
				"Evidence and analysis that make the opposition plausible.",
				"One revision that improves clarity or balance."
			]
		}
	],
	"MSB Check-In #1": [
		{
			title: "Analytical Writing Check-In Record",
			prompt: "Create an analytical writing record that demonstrates claim, reasoning, evidence integration, evidence analysis, counterclaim, transitions, conclusion, and revision. Keep the evidence record separate from self-assessment notes.",
			evidence: [
				"A complete argumentative paragraph or paragraph plan.",
				"Textual evidence integrated with correct punctuation.",
				"Revision evidence showing claim, support, analysis, and conclusion improvements."
			]
		}
	],
	"MSB7 Character Development": [
		{
			title: "Character Objective Bank",
			prompt: "Use the supplied original character model to identify an objective and its supporting actions. Harry Potter, Wonder Woman, Spider-Man, or a favorite character can provide another comparison when a specific story version and its evidence are available. Then create an original objective bank for a new character.",
			evidence: [
				"Objective statements written as what each character wants most.",
				"Reasoning that connects background details to the objective.",
				"An original objective bank with several possible story-driving goals."
			]
		},
		{
			title: "Nemo Objective-to-Qualities Flowchart",
			prompt: "Use the supplied text-only character chain to connect objective, choices, thoughts, actions, speech, and character qualities. A specified Nemo story can provide an additional comparison. Apply the same chain to an original character without relying on an unavailable chart.",
			evidence: [
				"A flowchart from objective to choices, actions, speech, and qualities.",
				"At least one explanation of how a choice follows from the objective.",
				"Character qualities that are supported by the flowchart rather than assigned randomly."
			]
		}
	],
	"MSB8 Character Portraits": [
		{
			title: "Character Portrait Iceberg",
			prompt: "Build a character portrait using the iceberg model: the visible story shows only a small part of the character, while the full portrait records objective, backstory, motivations, habits, contradictions, and details below the surface.",
			evidence: [
				"A detailed character portrait with objective, backstory, choices, and speech patterns.",
				"A note distinguishing portrait details from details that belong directly in the story.",
				"One scene-ready detail that shows the character instead of explaining every background fact."
			]
		}
	],
	"MSB9 Generating Conflict & Structuring Plot": [
		{
			title: "Objective-to-Conflict Generator",
			prompt: "Start with a protagonist and objective, then create a major conflict that blocks the objective. Use a favorite book, movie, or show as a model before applying the same method to an original story.",
			evidence: [
				"A protagonist, objective, obstacle, and conflict statement.",
				"An explanation of how the obstacle blocks the objective.",
				"A comparison between the model story and the original story plan."
			]
		},
		{
			title: "Plot Curve Event Map",
			prompt: "Use the supplied stage table as a text-only plot model, or draw blank axes for story sequence and tension. Organize beginning, middle, and end events: introduce protagonist and objective, develop conflict, then resolve it through a consequential choice.",
			evidence: [
				"Three or more plot events placed on a beginning-middle-end structure.",
				"One dramatic-tension note naming where investment is highest and why.",
				"A plot map for an original story or a familiar movie."
			]
		}
	],
	"MSB10 Manipulating Point of View": [
		{
			title: "Jonah and Caleb Point-of-View Rewrite",
			prompt: "Review first person, second person, third person objective, third person limited, and third person omniscient narration using the Jonah and Caleb examples. Then revise a scene to change reader access, sympathy, suspense, or humor.",
			evidence: [
				"Correct point-of-view labels with pronoun or narrator-access evidence.",
				"A rewritten scene from a different point of view.",
				"A note explaining how the changed point of view changes the reading experience."
			]
		}
	],
	"MSB11 Writing an Original Short Story": [
		{
			title: "Final Story Revision",
			prompt: "Revise the final short story so it includes a three-dimensional protagonist, plausible conflict, logical plot, clear point of view, theme development, figurative language, and showing rather than direct explanation.",
			evidence: [
				"A complete short story draft.",
				"Revision notes for protagonist, conflict, plot, point of view, theme, and figurative language.",
				"At least one before-and-after revision showing added depth or clearer craft choices."
			]
		}
	],
	"MSB Check-In #2": [
		{
			title: "Fiction Writing Check-In Record",
			prompt: "Create a fiction-writing record that demonstrates character objective, character portrait, conflict, plot structure, point of view, final story craft, theme, figurative language, and showing rather than direct explanation.",
			evidence: [
				"An original scene or story excerpt.",
				"Planning evidence for objective, portrait, conflict, plot, and point of view.",
				"Revision evidence for theme, figurative language, and showing."
			]
		}
	],
	"MSB12 Master Project": [
		{
			title: "Master Project Path and Evidence Plan",
			prompt: "Choose the analytical-writing or fiction-writing presentation path, identify the prior course artifacts that will supply evidence, and plan the audience, structure, visual or text support, rehearsal, and revision check.",
			evidence: [
				"Selected presentation path and audience.",
				"Artifact and evidence list drawn from the argument or fiction sequence.",
				"Presentation outline plus one rehearsal and revision checkpoint."
			]
		},
		{
			title: "Analytical Writing Presentation",
			prompt: "Create a presentation arguing why a chosen athlete, musician, restaurant, pet, food, or similar category choice is the best option. The presentation includes claim, reasoning, evidence, counterclaim, conclusion, and speaker notes.",
			evidence: [
				"A claim with reasoning and supporting evidence.",
				"A counterclaim with reasoning and supporting evidence.",
				"Presentation notes that move from topic introduction to claim, counterclaim, and conclusion."
			],
			learningPath: "choice"
		},
		{
			title: "Fiction Writing Presentation",
			prompt: "Create a short fiction-writing lesson using the final story as evidence. The lesson defines fiction writing, explains why it matters, presents three core concepts, gives examples from the story, and ends with five practical writing tips.",
			evidence: [
				"A lesson outline with three fiction-writing concepts.",
				"Examples from the final story connected to each concept.",
				"Five writing tips and a closing reflection on the strongest part of the final story."
			],
			learningPath: "choice"
		}
	]
};

const middleSchoolBWritingRetakeSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"MSB Retake Entry Diagnostic": [
		{
			title: "Argument and Fiction Entry Diagnostic",
			prompt: "Complete one short argument sample and one short fiction sample without reviewing the course first. Label the evidence for claim, support, analysis, character objective, conflict, point of view, and revision so the retake plan can target only missing skills.",
			evidence: [
				"Argument sample with claim, evidence, analysis, and a brief counterclaim.",
				"Fiction sample with character objective, conflict, point of view, and one scene-level craft choice.",
				"Skill map marking each target as ready, review, or rebuild with a cited reason."
			]
		}
	],
	...Object.fromEntries(
		Object.entries(middleSchoolBWritingSourceAnchors).map(
			([module, anchors]) => [
				module,
				anchors.map(anchor => ({
					...anchor,
					learningPath: "choice" as const,
					prompt: `Retake focus: revisit this skill with a fresh passage, draft, or presentation example before repeating the original source pattern. ${anchor.prompt}`,
					evidence: [
						...anchor.evidence,
						"A comparison note naming the skill that improved from the first course pass."
					]
				}))
			]
		)
	),
	"MSB Retake Exit Evidence": [
		{
			title: "Before-and-After Retake Evidence Record",
			prompt: "Compare the entry diagnostic with revised argument and fiction evidence from the targeted modules. Identify what changed, cite the revision that demonstrates each recovered skill, and name any skill that still needs practice.",
			evidence: [
				"Entry-to-exit comparison for every skill originally marked review or rebuild.",
				"Before-and-after excerpts with annotations explaining the improvement.",
				"Exit decision marking each target ready or naming a specific next practice step."
			]
		}
	]
};

const grammarMechanicsSourceAnchors: Record<string, SourceActivityAnchor[]> = {
	"MSC1 Nouns, Pronouns & Adjectives": [
		{
			title: "Snow Day Parts-of-Speech Sort",
			prompt: "Use the supplied original Snow Day paragraph to identify nouns, pronouns, and adjectives. The sort separates words by job, not by where they appear in the sentence.",
			evidence: [
				"Five nouns, five pronouns, and five adjectives from the passage.",
				"A one-sentence definition of each part of speech.",
				"One original sentence labeled for noun, pronoun, and adjective use."
			]
		},
		{
			title: "Pronoun Agreement Repair",
			prompt: "Use the supplied sentence set to map each pronoun to its intended referent, then repair unclear references or unintended shifts in number or person. Preserve valid singular they and use its appropriate verb form.",
			evidence: [
				"An antecedent-pronoun map for each sentence.",
				"Corrections for number shifts and person shifts.",
				"A note explaining why the corrected pronoun now agrees."
			]
		}
	],
	"MSC2 Verbs, Adverbs & Verbals": [
		{
			title: "Verb and Adverb Action Sort",
			prompt: "Identify action words and modifier words, then explain how each adverb changes the verb's meaning. The record distinguishes the action itself from details such as how, when, where, or to what degree the action happens.",
			evidence: [
				"A list of verbs from sample sentences.",
				"A matching list of adverbs and the verbs they modify.",
				"One revised sentence where changing the adverb changes the meaning."
			]
		},
		{
			title: "Gerund, Participle, and Infinitive Identification",
			prompt: "Classify the supplied verbals by checking their sentence jobs. In these examples, gerunds act as nouns, participles as adjectives, and to-infinitives use to plus a base verb.",
			evidence: [
				"At least three labeled verbals.",
				"The sentence job for each verbal.",
				"One original sentence using each verbal type."
			]
		}
	],
	"MSC3 Prepositions & Interjections": [
		{
			title: "Preposition Phrase and Interjection Sort",
			prompt: "Identify prepositions, the objects of prepositions, complete prepositional phrases, and interjections. The sort separates words that show relationships from words that express sudden feeling.",
			evidence: [
				"Three prepositional phrases with the preposition and object labeled.",
				"Two interjections with punctuation that fits the strength of feeling.",
				"One original sentence combining a prepositional phrase and an interjection."
			]
		}
	],
	"MSC4 Coordinating & Subordinating Conjunctions": [
		{
			title: "FANBOYS and Subordination Contrast",
			prompt: "Use FANBOYS to join equal ideas, then use subordinating conjunctions to make one idea dependent on another. The contrast shows the difference between coordination and dependency.",
			evidence: [
				"One compound sentence joined with a coordinating conjunction.",
				"One complex sentence using a subordinating conjunction.",
				"A note explaining which idea is independent and which idea depends on another."
			]
		},
		{
			title: "Conjunction and Comma Practice",
			prompt: "Revise sentences that use conjunctions and commas together. The finished examples show when a comma is needed before a coordinating conjunction and when a dependent clause needs a comma after it.",
			evidence: [
				"Two corrected coordinating-conjunction examples.",
				"Two corrected subordinating-conjunction examples.",
				"Rule labels explaining the comma choice."
			]
		}
	],
	"MSC Check-In #1": [
		{
			title: "Parts-of-Speech Concept Review",
			prompt: "Create a concept review for nouns, pronouns, adjectives, verbs, adverbs, verbals, prepositions, interjections, coordinating conjunctions, and subordinating conjunctions. Each definition is paired with an original example.",
			evidence: [
				"A definition and example for each reviewed term.",
				"At least one corrected sentence involving pronoun agreement.",
				"At least one sentence that uses a conjunction and comma correctly."
			]
		},
		{
			title: "Parts-of-Speech Application Passage",
			prompt: "Apply the parts-of-speech review to a short passage by labeling targeted words and revising any sentence-level issue that appears.",
			evidence: [
				"Labeled examples from a passage.",
				"One revision that improves agreement, clarity, or sentence joining.",
				"A short explanation of the rule used for the revision."
			]
		}
	],
	"MSC5 Capitalization": [
		{
			title: "Capitalization Repair Pass",
			prompt: "Repair capitalization for proper nouns, titles and headings, sentence starts, and the pronoun I. The revision separates rules for names and titles from rules for sentence boundaries.",
			evidence: [
				"Corrections for proper nouns and the pronoun I.",
				"Corrections for titles, headings, and sentence starts.",
				"Rule labels that explain each capitalization change."
			]
		}
	],
	"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks": [
		{
			title: "End-Mark and Quotation Repair",
			prompt: "Choose periods, question marks, exclamation points, and quotation marks using the supplied sentence and dialogue set. Place question and exclamation marks according to whether they apply to the quotation or the surrounding sentence.",
			evidence: [
				"Three sentences with corrected end marks.",
				"Two dialogue examples with quotation marks and punctuation placed correctly.",
				"A note explaining how sentence purpose controlled the punctuation."
			]
		}
	],
	"MSC7 Phrases & Clauses I": [
		{
			title: "Phrase vs. Clause Independence Test",
			prompt: "Separate phrases from clauses by checking for a subject-verb pair and then testing whether the words can stand alone as a complete idea.",
			evidence: [
				"Three phrases labeled as missing a subject, verb, or complete thought.",
				"Three clauses labeled as independent or dependent.",
				"One dependent clause revised into a complete sentence."
			]
		},
		{
			title: "Dependent Clause Practice",
			prompt: "Use dependent clauses to add context without creating sentence fragments. Each example connects the dependent clause to an independent clause that can stand alone.",
			evidence: [
				"Two dependent clauses attached to independent clauses.",
				"One fragment repair.",
				"A comma decision explained for a dependent clause at the beginning or end."
			]
		}
	],
	"MSC8 Commas": [
		{
			title: "Comma Rule Diagnosis",
			prompt: "Diagnose comma use by naming the rule before adding punctuation. Practice commas in lists, introductory elements, direct address, interrupters, and joined clauses.",
			evidence: [
				"Five corrected sentences with rule labels.",
				"One sentence where a comma was removed because no rule supported it.",
				"A comparison between a pause in speech and a grammar-based comma."
			]
		},
		{
			title: "More Practice with Commas",
			prompt: "Use a mixed set of comma sentences to decide whether the sentence needs no comma, one comma, or a pair of commas.",
			evidence: [
				"A mixed correction set with rule labels.",
				"One sentence using a pair of commas around extra information.",
				"One explanation distinguishing necessary information from extra information."
			],
			learningPath: "choice"
		}
	],
	"MSC9 Semicolons": [
		{
			title: "Semicolon Independent-Clause Join",
			prompt: "Use semicolons to join closely related independent clauses. Each side of the semicolon must be able to stand alone as a complete sentence.",
			evidence: [
				"Two semicolon joins between independent clauses.",
				"One correction where a semicolon was replaced because one side was not independent.",
				"A note explaining the relationship between the two joined clauses."
			]
		}
	],
	"MSC10 Colons": [
		{
			title: "Colon List, Explanation, and Quotation Starter",
			prompt: "Use colons after a complete sentence to introduce a list, explanation, or quoted material. The words before the colon must prepare the reader for what follows.",
			evidence: [
				"One colon introducing a list.",
				"One colon introducing an explanation or example.",
				"One correction where a colon was removed because the starter was incomplete."
			]
		}
	],
	"MSC11 Common Punctuation Errors": [
		{
			title: "Comma Splice and Run-On Repair",
			prompt: "Find comma splices and run-on sentences, then repair them with a period, semicolon, coordinating conjunction, or subordinating conjunction.",
			evidence: [
				"Two comma-splice repairs.",
				"Two run-on repairs.",
				"A note explaining why the chosen repair creates a complete sentence boundary."
			]
		},
		{
			title: "Coordinate vs. Cumulative Adjective Test",
			prompt: "Decide whether adjectives are coordinate or cumulative by testing whether and can fit between them and whether their order can change without changing the meaning.",
			evidence: [
				"Two coordinate-adjective examples with commas.",
				"Two cumulative-adjective examples without commas.",
				"One and-test or order-test explanation."
			]
		},
		{
			title: "Common Errors Passage Edit",
			prompt: "Edit a passage for comma splices, run-ons, adjective punctuation, capitalization after colons, and missing punctuation. The edit log names each error category rather than only marking the final answer.",
			evidence: [
				"A corrected passage.",
				"An error log grouped by rule.",
				"One revision that improves clarity beyond basic punctuation."
			]
		}
	],
	"MSC12 Pauses & Breaks": [
		{
			title: "Dashes, Parentheses, and Ellipses Meaning Check",
			prompt: "Compare dashes, parentheses, and ellipses as different kinds of interruptions or omissions. The choice depends on emphasis, side information, or trailing/incomplete thought.",
			evidence: [
				"One sentence using dashes for emphasis or interruption.",
				"One sentence using parentheses for side information.",
				"One sentence using an ellipsis for omission or trailing thought, with a note explaining the effect."
			]
		}
	],
	"MSC Check-In #2": [
		{
			title: "Punctuation Concept Review",
			prompt: "Review capitalization, end marks, quotation marks, phrases, clauses, commas, semicolons, colons, common punctuation errors, dashes, parentheses, and ellipses.",
			evidence: [
				"A definition or rule summary for each punctuation category.",
				"At least one corrected sentence for each major punctuation mark.",
				"One explanation of how punctuation changes meaning or sentence structure."
			]
		},
		{
			title: "Punctuation Application Passage",
			prompt: "Apply punctuation rules to a passage by correcting errors and labeling the reason for each change.",
			evidence: [
				"A corrected passage.",
				"Rule labels for capitalization, commas, semicolons, colons, quotation marks, or pause punctuation.",
				"One reflection naming the error type that was hardest to identify."
			]
		}
	],
	"MSC13 Subjects & Predicates": [
		{
			title: "Subject-Predicate Core Map",
			prompt: "Find the subject and predicate by identifying who or what the sentence is about and what that subject does or is. The core map removes extra phrases before labeling the sentence backbone.",
			evidence: [
				"Three complete subjects and complete predicates.",
				"Three simple subjects and simple predicates.",
				"One sentence with extra phrases removed to reveal the core."
			]
		}
	],
	"MSC14 Direct & Indirect Objects": [
		{
			title: "Direct and Indirect Object Sentence Diagram",
			prompt: "Diagram sentences by finding the verb, direct object, and indirect object. The direct object receives the action; the indirect object receives or benefits from the direct object.",
			evidence: [
				"Three sentences labeled for verb and direct object.",
				"Two sentences labeled for indirect object.",
				"One explanation using the questions what, whom, or to/for whom."
			]
		},
		{
			title: "Subjects, Predicates, and Objects Practice",
			prompt: "Combine subject-predicate work with object identification so each sentence has a clear structure map.",
			evidence: [
				"A structure map for three sentences.",
				"Labels for subject, predicate, direct object, and indirect object when present.",
				"One corrected incomplete sentence."
			]
		}
	],
	"MSC15 Phrases & Clauses II": [
		{
			title: "Phrase-and-Clause Sentence Expansion",
			prompt: "Expand sentences with phrases and clauses while keeping the sentence complete and punctuated correctly. The expansion adds detail without losing the main subject-predicate structure.",
			evidence: [
				"One sentence expanded with a phrase.",
				"One sentence expanded with a dependent clause.",
				"One revision note explaining how the added detail changes the sentence."
			]
		}
	],
	"MSC16 Sentence Types": [
		{
			title: "Sentence Type Identification and Rewrite",
			prompt: "Identify simple, compound, complex, and compound-complex sentences, then rewrite a basic idea in more than one sentence type.",
			evidence: [
				"Four labeled sentences, one for each sentence type.",
				"One idea rewritten as simple, compound, complex, and compound-complex.",
				"Clause labels showing why each sentence type is correct."
			]
		},
		{
			title: "More Practice with Sentence Types",
			prompt: "Use a mixed sentence set to classify sentence types, repair fragments or run-ons, and revise a paragraph so the sentence pattern varies on purpose instead of repeating the same structure.",
			evidence: [
				"A mixed classification set with clause labels.",
				"One repaired fragment or run-on sentence.",
				"A short paragraph revision that uses at least two different sentence types."
			],
			learningPath: "choice"
		}
	],
	"MSC Check-In #3": [
		{
			title: "Sentence Structure Concept Review",
			prompt: "Review subjects, predicates, direct objects, indirect objects, phrases, clauses, and sentence types as connected sentence-structure tools.",
			evidence: [
				"A definition and example for each structure term.",
				"One complete sentence map.",
				"One sentence rewritten into a different sentence type."
			]
		},
		{
			title: "Sentence Structure Application Passage",
			prompt: "Apply sentence-structure tools to a short passage by identifying sentence parts and revising at least one sentence for structure variety.",
			evidence: [
				"Sentence-part labels for the passage.",
				"One revised sentence that changes type or structure.",
				"An explanation of how the revision affects clarity, rhythm, or emphasis."
			]
		}
	],
	"MSC17 Master Project": [
		{
			title: "Grammar Master Project Path and Evidence Plan",
			prompt: "Choose the grammar-lesson or mechanics-portfolio path, select the three or more course concepts that need to be demonstrated, and plan the examples, practice or annotations, audience, and revision check.",
			evidence: [
				"Selected project path, audience, and grammar concepts.",
				"Artifact outline connecting every selected concept to an example and explanation.",
				"Completion checklist with one feedback or self-review checkpoint."
			]
		},
		{
			title: "Grammar and Mechanics Presentation",
			prompt: "Create a short grammar lesson using three selected concepts from the course. Each concept includes a definition, an example with visuals or labels, a 3-5 question practice exercise, and speaker notes.",
			evidence: [
				"Three selected concepts with definitions and examples.",
				"Practice questions with an answer key.",
				"Presentation notes that explain the rules in a logical sequence."
			],
			learningPath: "choice"
		},
		{
			title: "Personal Narrative Mechanics Portfolio",
			prompt: "Write or revise a personal, adapted, or fictional narrative that demonstrates grammar and mechanics control. The portfolio highlights capitalization, punctuation, sentence boundaries, sentence variety, and selected parts-of-speech choices.",
			evidence: [
				"A complete personal, adapted, or fictional narrative draft or revision.",
				"An annotation record naming grammar and mechanics choices.",
				"Before-and-after revisions for at least three sentence-level improvements."
			],
			learningPath: "choice"
		}
	]
};

const novelWritingSourceAnchors: Record<string, SourceActivityAnchor[]> = {
	"NW1 Course Overview & Goal Setting": [
		{
			title: "Novel Scope and Word-Count Plan",
			prompt: "Choose a novel-writing scope before drafting begins: a short story, a novella-length project, a longer novel excerpt, or a complete long-form draft. Convert the choice into a target word count, a weekly writing rhythm, and a completion definition. The plan also names the story idea, genre, likely audience, and the kind of ending that would make the project feel complete rather than simply stopped.",
			evidence: [
				"Selected project scope with a target word count and a reason the scope matches the available writing time.",
				"One-paragraph story premise that names the central character, central desire, likely obstacle, and possible ending direction.",
				"Drafting plan that divides the total word count into checkpoints and explains how progress will be measured across the course."
			]
		}
	],
	"NW2 Developing a Protagonist and an Antagonist": [
		{
			title: "Protagonist, Antagonist, and Objective Portraits",
			prompt: "Build character portraits for the protagonist and antagonist using character objective, motivation, strength, flaw, fear, and conflict pressure. A protagonist is not only the main character; the protagonist wants something badly enough to take action. An antagonist is not always a villain; the antagonist blocks, challenges, or complicates the protagonist's objective. The portraits explain why the two forces collide and what each character risks losing.",
			evidence: [
				"Profile for the protagonist naming objective, motivation, strength, flaw, fear, and first visible action.",
				"Profile for the antagonist naming objective, motivation, pressure on the protagonist, and at least one sympathetic or understandable trait.",
				"Conflict statement showing why both objectives cannot be fully satisfied at the same time."
			]
		}
	],
	"NW3 Novel Drafting: Introducing Your Characters": [
		{
			title: "Opening Scene Character Introduction",
			prompt: "Draft the opening section of the novel so the reader meets the main character through action, voice, and choice rather than a list of facts. The first pages establish what normal life looks like, what the protagonist cares about, and what tension is already present. The draft can introduce the antagonist directly, hint at the antagonist's influence, or show the problem that will eventually connect both characters.",
			evidence: [
				"Opening-scene draft or excerpt that introduces the protagonist in a concrete situation.",
				"Annotation identifying one action, one line of thought or dialogue, and one detail that reveals character.",
				"Revision note naming where the opening feels active and where it relies too much on summary."
			]
		}
	],
	"NW4 Generating Conflict": [
		{
			title: "Conflict Ladder",
			prompt: "Create a conflict ladder that starts with the protagonist's objective and then adds increasingly serious obstacles. Include at least one external obstacle, one interpersonal obstacle, and one internal obstacle. The ladder makes clear how conflict grows because of character choices, not random inconvenience. Each rung changes the protagonist's options, raises the cost of continuing, or reveals a weakness that makes the next scene harder.",
			evidence: [
				"Protagonist objective written as a clear want with a reason it matters.",
				"Three-to-five conflict rungs showing external, interpersonal, and internal complications.",
				"Short explanation of how one conflict rung causes or intensifies the next one."
			]
		}
	],
	"NW5 Novel Drafting: Setting the Scene": [
		{
			title: "Scene Placement and Atmosphere Draft",
			prompt: "Draft a scene that places the reader in a specific location before major action happens. Setting includes more than a named place; it includes time, sensory detail, mood, available objects, social rules, and limits on what characters can do. The scene uses setting to shape character behavior, create pressure, or reveal a contrast between what the protagonist wants and what the environment allows.",
			evidence: [
				"Scene draft with a clear physical location, time context, and at least three sensory details.",
				"Annotation explaining how one setting detail affects action, mood, or character decision-making.",
				"Revision note identifying one generic location detail that was replaced with a more specific detail."
			]
		}
	],
	"NW6 Structuring Plot": [
		{
			title: "Narrative Arc Map",
			prompt: "Map the novel on a narrative arc using exposition, rising action, conflict at greatest tension, falling action, and resolution. The arc is a planning tool, not a rigid formula. It helps reveal whether the story has enough escalation before the turning point and whether the ending answers the central conflict. The map can be revised as the draft changes, but each section needs a specific story event rather than a vague label.",
			evidence: [
				"Completed narrative arc with at least one concrete event in each section.",
				"Explanation of the event that creates the highest tension and why it changes the protagonist's path.",
				"Revision note naming one missing bridge between two plot points or one event that needs stronger cause and effect."
			]
		}
	],
	"NW7 Character Development": [
		{
			title: "Character Change and Rising Action Check",
			prompt: "Track how the protagonist changes across the rising action. Character development can appear through decisions, reactions under pressure, relationship changes, mistakes, and new self-knowledge. Choose two scenes already drafted or planned, then compare what the protagonist believes, fears, or attempts in each one. The comparison helps determine whether the character is growing, resisting growth, or becoming more complicated.",
			evidence: [
				"Before-and-after character snapshot using two drafted or planned scenes.",
				"Evidence from each scene showing a decision, reaction, or relationship shift.",
				"Revision target for one scene where the protagonist's change needs to become more visible through action or dialogue."
			]
		}
	],
	"NW8 Narration": [
		{
			title: "Point-of-View Consistency Audit",
			prompt: "Choose the story's point of view and audit a draft excerpt for consistency. First person, third-person limited, third-person omniscient, and other narration choices control what the reader can know, how close the reader feels to the character, and what information can stay hidden. The audit marks sentences that reveal thoughts, judgments, or information unavailable to the chosen narrator and revises them to match the intended point of view.",
			evidence: [
				"Selected point of view with a reason it fits the story's tension and character access.",
				"Annotated excerpt marking narration that fits and narration that breaks the chosen viewpoint.",
				"Revised passage that keeps knowledge, tone, and distance consistent."
			]
		}
	],
	"Check-In #1": [
		{
			title: "Midpoint Self-Assessment and Revision Plan",
			prompt: "Select a meaningful excerpt from the draft and evaluate it against the course skills covered so far: goal clarity, protagonist and antagonist design, character introduction, conflict generation, plot structure, character development, and narration. The response identifies one strength that is already working and one revision target that would improve the next draft. The revision plan is specific enough to change sentences, scene structure, or character choices.",
			evidence: [
				"Selected excerpt with a note explaining why it represents important current work.",
				"Self-assessment naming one strong skill and one developing skill from the first half of the course.",
				"Revision plan with concrete changes to character, conflict, plot, or narration and a short explanation of why those changes matter."
			]
		},
		{
			title: "Revised Excerpt Reflection",
			prompt: "Revise the selected excerpt using the midpoint plan, then compare the original and revised versions. The reflection explains what changed, what stayed the same, and how the revision affects the reader's understanding of character, conflict, or point of view. This turns revision into visible decision-making instead of simple proofreading.",
			evidence: [
				"Original excerpt and revised excerpt, or clearly labeled before-and-after sections.",
				"Three revision choices labeled by purpose, such as clarity, tension, character, pacing, or narration.",
				"Reflection explaining which revision had the greatest effect and what still needs another pass."
			]
		}
	],
	"NW9 Describing Setting": [
		{
			title: "Sensory Setting Expansion",
			prompt: "Choose a setting from the novel and expand it with sensory language connected to story purpose. Sight, sound, smell, touch, temperature, movement, and spatial detail can all help, but the strongest setting description does more than decorate the scene. It supports mood, reveals character attention, creates danger or comfort, and gives the reader information needed for the action.",
			evidence: [
				"Original setting paragraph or scene notes plus an expanded version.",
				"At least four sensory details, with each detail connected to mood, character, or plot usefulness.",
				"Revision note identifying one detail that was cut because it was vivid but not useful to the scene."
			]
		}
	],
	"NW10 Writing Dialogue": [
		{
			title: "Dialogue Formatting and Subtext Pass",
			prompt: "Write or revise a dialogue scene so each speaker has clear formatting, purposeful speech, and at least one layer of subtext. Dialogue can reveal information, create conflict, show relationships, and hide what a character is truly thinking. The pass checks paragraph breaks, quotation marks, speaker tags, action beats, and whether each line changes the scene in some way.",
			evidence: [
				"Dialogue excerpt with correct paragraphing, quotation marks, and speaker clarity.",
				"Annotation for one line that reveals direct information and one line that suggests subtext.",
				"Revision note replacing at least one filler line with speech or action that changes tension, relationship, or plot direction."
			]
		}
	],
	"NW11 Novel Drafting: Conflict": [
		{
			title: "Highest-Tension Conflict Draft",
			prompt: "Draft or revise the section where the central conflict reaches its strongest pressure. The scene needs a clear objective, a serious obstacle, and a consequence that cannot be ignored afterward. The protagonist may succeed, fail, compromise, or discover a new problem, but the outcome changes the path toward the ending. This section tests whether the conflict has grown from earlier character choices and plot events.",
			evidence: [
				"Conflict-scene draft or detailed scene plan with objective, obstacle, choice, and consequence labeled.",
				"Connection note explaining which earlier scene or decision made this conflict possible.",
				"Revision target for increasing stakes, clarifying the protagonist's choice, or strengthening the consequence."
			]
		}
	],
	"NW12 Novel Drafting: Falling Action & Resolution": [
		{
			title: "Ending Cause-and-Effect Chain",
			prompt: "Plan or draft the falling action and resolution as a cause-and-effect chain rather than a quick wrap-up. Falling action shows the consequences of the main conflict, and resolution shows what has changed by the end. The ending can be happy, sad, mixed, or open, but it needs to answer the central question created by the protagonist's objective and reveal what the journey cost or taught the character.",
			evidence: [
				"Cause-and-effect chain from the main conflict outcome to the final scene.",
				"Ending draft or outline that identifies what changed externally and internally.",
				"Revision note checking whether the ending answers the original objective, character arc, and main conflict."
			]
		}
	],
	"NW13 Final Revision Portfolio": [
		{
			title: "Final Revision Portfolio",
			prompt: "Build a final revision portfolio from a selected excerpt or completed draft section. The portfolio evaluates setting, dialogue, conflict, falling action, resolution, and earlier craft skills. It names the strongest current feature of the novel, identifies the highest-priority next revision, and explains how the draft has changed from the first course plan to the current version.",
			evidence: [
				"Selected excerpt or draft section with notes tied to setting, dialogue, conflict, and resolution.",
				"Self-assessment naming one polished craft strength and one high-impact revision priority.",
				"Revision summary explaining how the novel changed across planning, drafting, midpoint revision, and final revision."
			]
		},
		{
			title: "Publication Readiness Reflection",
			prompt: "Review the novel as a reader-facing project. The reflection checks whether the title, opening, character arc, conflict, ending, and formatting are ready for a private portfolio, guided review, or optional sharing. The publication readiness check does not mean the draft is perfect or that it must be posted publicly; it means the writer can explain what the story is, what revision work has already happened, and what the next realistic editing pass would address.",
			evidence: [
				"Reader-facing summary of the novel's premise, protagonist, conflict, and ending direction.",
				"Checklist covering title, opening clarity, character arc, conflict resolution, dialogue formatting, and remaining copyedits.",
				"Next-pass editing plan separating big-picture revision from sentence-level proofreading."
			]
		}
	]
};

function compactTopic(title: string) {
	return title
		.replace(/^[A-Z]{2,}\s*\d+[A-Z]?\s*/i, "")
		.replace(/^[A-Z]{2,}\d+[A-Z]?\s*/i, "")
		.replace(/^JoR\s+/i, "")
		.replace(/^WYB\s+/i, "")
		.replace(/^MS[A-C]\s+/i, "")
		.replace(/^NW\d+\s+/i, "")
		.replace(/^MYP\d+\s+/i, "")
		.replace(/^Check-in\s+#?(\d+)/i, "Check-In $1")
		.replace(/^Module Project:\s*/i, "")
		.replace(/\s+\(with [^)]+\)/gi, "")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function topicKeywords(topic: string) {
	const stopWords = new Set([
		"a",
		"an",
		"and",
		"for",
		"in",
		"my",
		"of",
		"on",
		"part",
		"the",
		"to",
		"with",
		"your"
	]);
	const words = topic
		.replace(/[#:&/(),]/g, " ")
		.split(/\s+/)
		.map(word => word.trim())
		.filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

	return [...new Set(words)].slice(0, 5);
}

function domainFrame(spec: SourceLibraryCourseSpec) {
	const domain = `${spec.area} ${spec.focus}`.toLowerCase();

	if (
		/math|addition|subtraction|fraction|decimal|geometry|algebra|calculus|number|measurement|coordinate/.test(
			domain
		)
	) {
		return {
			artifact:
				"worked math record with diagrams, equations, labels, and a reasonableness check",
			checks: [
				"Each number has a label or unit when context matters.",
				"The representation matches the operation or relationship being used.",
				"The final answer is checked with estimation, substitution, inverse operation, or a second representation."
			],
			process:
				"Translate the situation into a diagram, equation, table, or model before calculating. Keep intermediate steps visible so an arithmetic mistake can be found without restarting the whole problem.",
			transfer:
				"Change one number, unit, shape, graph feature, or condition and compare which parts of the solution method stay the same."
		};
	}

	if (
		/speaking|presentation|speech|toast|storyteller|radio|comedy/.test(
			domain
		)
	) {
		return {
			artifact:
				"speech outline with purpose, audience, structure, rehearsal notes, and delivery evidence",
			checks: [
				"The opening states the topic and gives the listener a reason to keep listening.",
				"Main points are ordered intentionally and supported by concrete details.",
				"Delivery notes address pacing, eye contact, gestures, vocal clarity, and revision after rehearsal."
			],
			process:
				"Separate message design from delivery practice. First define the audience, central point, and evidence. Then rehearse with a small number of specific delivery goals instead of trying to improve everything at once.",
			transfer:
				"Change the audience, time limit, tone, or speaking purpose and revise the outline so the same idea still lands clearly."
		};
	}

	if (
		/reading|literary|literature|figurative|analysis|grammar|writing|novel|story|book|narrative/.test(
			domain
		)
	) {
		return {
			artifact:
				"reading or writing record with claim, evidence, draft choices, revision notes, and final reflection",
			checks: [
				"Claims point to a specific sentence, passage detail, grammar rule, or draft choice.",
				"Explanations connect evidence to meaning instead of only quoting or naming a rule.",
				"Revision changes are visible and tied to clarity, structure, voice, audience, or mechanics."
			],
			process:
				"Start with the text or draft evidence, then explain the choice being made. For writing work, preserve at least one revision note so the final version shows how the idea improved.",
			transfer:
				"Apply the same reading, grammar, or writing move to a new passage, sentence, audience, scene, or draft section."
		};
	}

	if (
		/finance|invest|entrepreneur|business|credit|bank|portfolio|stock|income|spending/.test(
			domain
		)
	) {
		return {
			artifact:
				"decision record with assumptions, calculations, tradeoffs, risk notes, and a recommendation",
			checks: [
				"Financial assumptions are named before the calculation or decision.",
				"Benefits, costs, risks, and time horizon are compared rather than listed separately.",
				"The recommendation explains what evidence would change the decision."
			],
			process:
				"Treat each scenario as a decision under constraints. Identify the goal, the available options, the numbers or evidence, and the tradeoff before choosing a recommendation.",
			transfer:
				"Change the budget, customer, risk level, time horizon, or market condition and compare how the recommendation changes."
		};
	}

	if (
		/usaco|competitive|programming|scratch|visual programming|simulation/.test(
			domain
		)
	) {
		return {
			artifact:
				"problem-solving record with inputs, state, algorithm, test cases, and debugging notes",
			checks: [
				"The input or event model is written before coding or constructing the solution.",
				"The solution handles a normal case, a smallest case, and a case that stresses the key rule.",
				"Debugging notes identify the state change, loop, condition, or representation that controls the result."
			],
			process:
				"Name the data or event flow first. Then build the smallest working version, test it, and add only one rule or behavior at a time.",
			transfer:
				"Change a constraint, board state, input size, sprite behavior, or edge case and explain whether the same algorithm or event structure still works."
		};
	}

	return {
		artifact:
			"learning record with vocabulary, example, evidence, revision, and reflection",
		checks: [
			"The main terms are defined with examples and non-examples.",
			"The response includes evidence rather than only a final answer.",
			"The final note explains what changed, what stayed stable, and what still needs verification."
		],
		process:
			"Break the task into setup, evidence, result, and explanation. Keep each part visible so the reasoning can be checked without relying on hidden context.",
		transfer:
			"Change one condition and compare the new result to the original result."
	};
}

function conceptContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const keywords = topicKeywords(topic);
	const frame = domainFrame(spec);

	return `
**Concept path:** ${topic} is the central focus for this part of ${spec.name}. It connects to ${spec.focus}. The module record is a ${frame.artifact}, not just a completed answer.

Core topics in this module:

1. **Vocabulary and model**  
   Define the important terms in plain language, connect them to a simple example, and include one non-example so the boundary of the idea is clear.${keywords.length ? ` Key terms to watch include ${keywords.join(", ")}.` : ""}

2. **Worked example**  
   Break a typical problem, passage, speech outline, business case, or number scenario into smaller pieces. The record includes the known information, the decision point, and the evidence that supports the answer.

3. **Transfer task**  
   Change one detail from the worked example. The comparison makes the transferable rule visible instead of treating the first example as a script to copy.

4. **Evidence check**
   ${frame.process}

**Evidence checklist:**

${frame.checks.map(check => `- ${check}`).join("\n")}
	`.trim();
}

function practiceContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const planning = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "planning"
	});

	return [
		`**Goal:** Create a short ${spec.name} practice record for ${topic} with one typical case and one changed case.`,
		`**Setup:** Name the goal, the starting information, and the form of evidence needed. The expected product is a ${frame.artifact}.`,
		[
			"**Process:**",
			"1. Record the givens, constraints, audience, source text, numbers, or starting state.",
			"2. Build the first solution or draft with visible intermediate reasoning.",
			"3. Run a second case with one changed detail and compare the result.",
			"4. Write a short explanation of which rule, model, or evidence controlled the final answer."
		].join("\n"),
		[
			"**Completion evidence:**",
			...frame.checks.map(check => `- ${check}`)
		].join("\n"),
		planning
	].join("\n\n");
}

function extensionContent(spec: SourceLibraryCourseSpec, moduleTitle: string) {
	const topic = compactTopic(moduleTitle);
	const frame = domainFrame(spec);
	const verification = buildSupportSectionGuidance({
		courseFamily: spec.name,
		moduleTitle: topic,
		section: "verification"
	});

	return [
		`**Goal:** Extend ${topic} in ${spec.name} by changing one constraint, audience, number set, passage detail, scenario, or design choice.`,
		`**Transfer move:** ${frame.transfer}`,
		[
			"**Extension choices:**",
			"1. Add a more difficult input, passage detail, model constraint, or audience requirement.",
			"2. Compare two solution methods, drafts, explanations, or recommendations and name the better fit for the goal.",
			"3. Turn the final answer into a short presentation, annotated example, table, diagram, or revision note.",
			"4. Add one reflection explaining what evidence would make the result more reliable."
		].join("\n"),
		"The extension keeps the original idea recognizable while testing whether the method still works under a new condition. The response includes the changed condition, the expected effect, the actual result, and one revision that would make the explanation or product stronger.",
		verification
	].join("\n\n");
}

function createSourceActivityAnchorItems(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
) {
	const anchors = spec.sourceActivityAnchors?.[moduleTitle];
	if (!anchors?.length) return [];

	const topic = compactTopic(moduleTitle);
	if (spec.splitSourceActivityAnchors) {
		return anchors
			.filter(anchor => (anchor.learningPath ?? "core") === "core")
			.map(anchor => ({
				...(anchor.id ? { id: anchor.id } : {}),
				...(anchor.aliases?.length ? { aliases: anchor.aliases } : {}),
				...(anchor.preserveInstructions
					? { preserveInstructions: true }
					: {}),
				...(anchor.preserveAssignment
					? {
							preserveAssignment: true,
							contentKind: "assignment" as const
						}
					: {}),
				title: anchor.title,
				content: [
					`**${anchor.preserveAssignment ? "Goal" : "Project goal"}:** ${anchor.prompt}`,
					"**Completion evidence:**",
					...anchor.evidence.map(item => `- ${item}`)
				].join("\n"),
				learningPath: "core" as const,
				...(anchor.projectLink
					? { projectLink: anchor.projectLink }
					: {})
			}));
	}

	return [
		{
			title: `Source Activity Anchors: ${topic}`,
			content: [
				"The original source course used the concrete activity anchors below. This neutral version keeps the scenario structure, decision practice, and evidence requirements while removing platform-specific submission steps.",
				...anchors.map((anchor, index) =>
					[
						`${index + 1}. **${anchor.title}**`,
						anchor.prompt,
						"Evidence record:",
						...anchor.evidence.map(item => `- ${item}`)
					].join("\n")
				)
			].join("\n\n")
		}
	];
}

function createSourceActivityPracticeItems(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
) {
	if (!spec.splitSourceActivityAnchors) return [];

	return (spec.sourceActivityAnchors?.[moduleTitle] ?? [])
		.filter(anchor => (anchor.learningPath ?? "core") !== "core")
		.map(anchor => ({
			...(anchor.id ? { id: anchor.id } : {}),
			...(anchor.aliases?.length ? { aliases: anchor.aliases } : {}),
			title: anchor.title,
			content: [
				`**Project goal:** ${anchor.prompt}`,
				"**Completion evidence:**",
				...anchor.evidence.map(item => `- ${item}`)
			].join("\n"),
			learningPath: anchor.learningPath ?? ("choice" as const),
			...(anchor.projectLink ? { projectLink: anchor.projectLink } : {})
		}));
}

function createSourceLibraryModule(
	spec: SourceLibraryCourseSpec,
	moduleTitle: string
): RawCourseModule {
	const topic = compactTopic(moduleTitle);
	const metadata = spec.moduleMetadata?.[moduleTitle];
	const splitAnchors = Boolean(spec.splitSourceActivityAnchors);

	return {
		title: moduleTitle,
		...(metadata?.estimatedTime
			? { estimatedTime: metadata.estimatedTime }
			: {}),
		...(metadata?.keyBlocks?.length
			? { keyBlocks: [...metadata.keyBlocks] }
			: {}),
		curriculum: [
			{
				title: `Concepts: ${topic}`,
				content: [
					conceptContent(spec, moduleTitle),
					metadata?.flowNote
						? `**Course flow:** ${metadata.flowNote}`
						: ""
				]
					.filter(Boolean)
					.join("\n\n"),
				...(splitAnchors
					? {
							learningPath:
								metadata?.conceptLearningPath ??
								("core" as const)
						}
					: {})
			},
			...createSourceActivityAnchorItems(spec, moduleTitle)
		],
		supplementalProjects: [
			...createSourceActivityPracticeItems(spec, moduleTitle),
			{
				title: `Practice Map: ${topic}`,
				content: practiceContent(spec, moduleTitle),
				...(splitAnchors ? { learningPath: "choice" as const } : {})
			},
			{
				title: `Extension Review: ${topic}`,
				content: extensionContent(spec, moduleTitle),
				...(splitAnchors ? { learningPath: "challenge" as const } : {})
			}
		]
	};
}

function createStaticAssetAppendix(
	courseName: string,
	staticAssets: string[] | undefined
) {
	if (!staticAssets?.length) return [];

	const uniqueAssets = [...new Set(staticAssets)].sort((left, right) =>
		left.localeCompare(right)
	);

	return [
		{
			kind: "appendix" as const,
			title: "Pending Static Assets",
			curriculum: [
				{
					title: "Pending Static Assets",
					content: [
						`${courseName} lists pending static assets below. Each entry keeps a stable static media URL so the matching file can be added without changing course links.`,
						...uniqueAssets.map(
							filename =>
								`- ${staticMediaUrl(filename)}\n\n${pendingStaticMediaNotice(filename)}`
						)
					].join("\n\n")
				}
			],
			supplementalProjects: []
		}
	];
}

function createSourceLibraryCourse(spec: SourceLibraryCourseSpec): RawCourse {
	return {
		name: spec.name,
		modules: [
			...spec.modules.map(moduleTitle =>
				createSourceLibraryModule(spec, moduleTitle)
			),
			...createStaticAssetAppendix(spec.name, spec.staticAssets)
		]
	};
}

const investingCourses = {
	smartMoney: createSourceLibraryCourse({
		name: "Smart Money: Introduction to Personal Finance",
		area: "personal finance",
		focus: "income growth, spending plans, banking, credit, purchasing decisions, investing basics, and long-term financial tradeoffs",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"PF1 Building Wealth Through Personal Finance": {
				estimatedTime: "3–4 sessions · 40–50 minutes each",
				keyBlocks: [
					"fictional graduate profile",
					"financial goals",
					"baseline budget",
					"assumptions",
					"progress checkpoints"
				],
				flowNote:
					"Create one fictional Graduate Profile and use it throughout the course. Establish goals, assumptions, and a first-month budget before exploring optional spending or research cases. All work is educational simulation; personal balances, credentials, and real account access are never required."
			},
			"PF2 How to Grow My Income": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"income sources",
					"reliability",
					"skills and time",
					"startup cost",
					"unexpected events"
				],
				flowNote:
					"Compare realistic income paths by time, skill, cost, reliability, and risk, then update the same profile with one selected path and a wild-card event. Salary negotiation remains an optional role-play."
			},
			"PF3 How to Manage My Spending": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"gross and net income",
					"needs and wants",
					"budget rule",
					"cash flow",
					"tradeoffs"
				],
				flowNote:
					"Convert gross income to estimated take-home pay, classify expenses without treating wants as moral failures, and revise the profile into a balanced monthly plan. A text table and the supplied calculations can replace an external calculator."
			},
			"PF4 How to Build Credit: Making Your Small Purchases Count": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"APR",
					"minimum payment",
					"fees",
					"credit utilization",
					"total borrowing cost"
				],
				flowNote:
					"Use hypothetical offers to connect APR, fees, balances, payment behavior, and total cost. Verify current terms and credit rules from authoritative sources; no real credit application, account, or identifying information is required."
			},
			"PF5 How to Make Smart Purchase Decisions": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"total cost of ownership",
					"replacement frequency",
					"quality and convenience",
					"opportunity cost",
					"budget fit"
				],
				flowNote:
					"Compare purchase options over time, include non-price tradeoffs, and return the recommendation to the profile budget. The vehicle case is an optional extension for financing and recurring-cost modeling."
			},
			"PF6 How To Find Your Perfect Bank": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"checking",
					"savings",
					"APY and fees",
					"access and minimums",
					"deposit protection"
				],
				flowNote:
					"Compare fictional or publicly documented account terms, record the date checked, and select accounts for the profile based on purpose, access, fees, APY, minimums, and applicable protections. Opening a real account is not part of the course."
			},
			"PF7 How to Plan for and Invest in Your Future": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"time horizon",
					"compound growth",
					"risk assumptions",
					"retirement accounts",
					"hypothetical allocation"
				],
				flowNote:
					"Model future needs with conservative and aggressive assumptions, then create a hypothetical savings allocation. Recheck contribution limits, eligibility, tax treatment, and employer-match rules against current authoritative sources before using any result outside the fictional profile."
			},
			"PF8 Making Your Money Count": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"personal values",
					"evidence quality",
					"marketing claims",
					"tradeoffs",
					"budget impact"
				],
				flowNote:
					"Evaluate values-aligned claims with source evidence, uncertainty, and possible unintended effects, then make one budget decision for the profile. Creating a cause-aligned campaign or business is optional."
			},
			"PF9 Smart Money Master Project": {
				estimatedTime: "3–4 sessions · 40–50 minutes each",
				keyBlocks: [
					"financial journey",
					"final cash flow",
					"debt and savings",
					"stress test",
					"next-year recommendation"
				],
				flowNote:
					"Reconcile the fictional profile across income, spending, banking, credit, purchases, future planning, and values. Finish with a one-year stress test and evidence-based next move. A private portfolio is complete; no public sharing or real financial action is required."
			}
		},
		sourceActivityAnchors: {
			"PF1 Building Wealth Through Personal Finance": [
				{
					title: "Spend Like Bill Gates Constraint Ladder",
					prompt: "Use the spending simulator at [neal.fun/spend](https://neal.fun/spend/) as a changing-constraint case study. Compare an unlimited receipt, a responsible-use receipt, and a $500,000 plan spread across 60 years.",
					evidence: [
						"List of purchases that stayed, changed, or disappeared as the constraint became stricter.",
						"Five to seven personal values or future commitments that affect the revised spending plan.",
						"One explanation of how long-term goals change a short-term purchase decision."
					],
					learningPath: "choice"
				},
				{
					title: "Graduate Profile and First-Month Budget",
					prompt: "Build a fictional post-graduation profile with fixed starting assumptions: $10,000 in savings, an old scooter, and $30,000 in student debt. Choose a city, starting salary, housing cost, and first-month expense plan.",
					evidence: [
						"Profile table with income, debt, savings, location, and housing assumptions.",
						"First-month Budget Planner and Expense Tracker with income, necessities, wants, debt payments, and remaining cash.",
						"Revision note explaining which profile assumption changed after the first budget pass."
					]
				},
				{
					title: "Wealth-Building Research and Financial Perspectives",
					prompt: "Use a public profile, the supplied fictional profile, or an optional interview with a trusted adult to compare financial habits. Do not request or record private account balances, credentials, debt details, or other sensitive financial information. Compare income sources, assets, lifestyle choices, weekly or monthly money routines, and long-term goals only at the level the source voluntarily makes available.",
					evidence: [
						"Research or interview notes with source names, dates, and the specific financial behaviors observed.",
						"Comparison table separating income, assets, spending habits, saving habits, and risk tolerance.",
						"Reflection connecting at least one outside perspective to the Graduate Profile decisions."
					],
					learningPath: "choice"
				}
			],
			"PF2 How to Grow My Income": [
				{
					title: "Income Streams Comparison",
					prompt: "Compare different ways to make money, including salary growth, content revenue, part-time work, freelancing, entrepreneurship, and investing. Focus on time requirements, startup costs, skill requirements, reliability, and risk.",
					evidence: [
						"Pros and cons table for two income options beyond the main job.",
						"Skill and time estimate for each option, including one hidden cost or limitation.",
						"Decision note naming which option fits the profile and which option is too risky or impractical."
					]
				},
				{
					title: "Salary Negotiation Case",
					prompt: "Create a mock salary-increase request from the employee and employer perspectives. The case includes three to five reasons the raise could make sense and two risks or objections from the employer side.",
					evidence: [
						"Raise request with value created, evidence of performance, and proposed new salary or raise range.",
						"Employer objection list with calm responses tied to business value.",
						"Updated income tracker showing the effect of a successful, partial, or unsuccessful negotiation."
					],
					learningPath: "choice"
				},
				{
					title: "Wild Card Ledger",
					prompt: "Track unexpected income or expense events as flat, per-month, or multi-month changes. Each event modifies the same financial profile rather than creating a separate disconnected example.",
					evidence: [
						"Ledger row with event name, amount, duration, affected month, and category.",
						"Before-and-after monthly cash comparison.",
						"Short note explaining whether the event changes the long-term recommendation."
					]
				}
			],
			"PF3 How to Manage My Spending": [
				{
					title: "Spending Style and Needs-versus-Wants Budget",
					prompt: "Use a spending-style quiz, the Bean Game, or a fictional spending scenario to separate needs, wants, savings, and debt. Translate the result into a 50/30/20 or custom budget rule.",
					evidence: [
						"Needs-versus-wants criteria written as questions that can be reused for future purchases.",
						"Budget allocation with necessities, wants, savings, and debt categories.",
						"One tradeoff case where the budget blocks a purchase that still seems desirable."
					]
				},
				{
					title: "Profile Budget Revision",
					prompt: "Use a salary estimate, income-tax calculator, and budget calculator to revise the Graduate Profile. Include yearly and monthly views so the budget can be checked at both scales.",
					evidence: [
						"Gross income, estimated taxes, net income, and monthly take-home pay.",
						"Five necessities, five wants, and three debts with yearly or monthly cost estimates.",
						"Revised expense tracker with leftover monthly cash and one possible savings decision."
					]
				}
			],
			"PF4 How to Build Credit: Making Your Small Purchases Count": [
				{
					title: "Debt Growth and Credit Card Simulation",
					prompt: "Use a debt-growth game, credit-card simulator, or calculator to connect borrowing choices with APR, repayment time, credit limit, fees, and total paid over time.",
					evidence: [
						"Definition set for credit card, APR, introductory APR, minimum payment, credit limit, and unpaid balance.",
						"Comparison of two borrowing scenarios with different interest rates or repayment behavior.",
						"Debt-management rule that would reduce risk in the Graduate Profile."
					]
				},
				{
					title: "Credit Card Selection Case",
					prompt: "Compare fictional card offers such as cash rewards, travel rewards, low APR, and high-reward/high-fee cards. Match card features to the profile holder's spending habits and debt risk.",
					evidence: [
						"Card comparison table with APR, fees, rewards, credit limit, and hidden risk.",
						"Chosen card or cards with a reason tied to the profile rather than the largest reward headline.",
						"Rejected-card note explaining who the card might fit better."
					]
				},
				{
					title: "Car Loan and Housing What-If",
					prompt: "Use loan and housing calculators to test how credit score, interest rate, down payment, rent, and purchase price change monthly obligations.",
					evidence: [
						"Two loan outcomes with the same principal and different rates or credit assumptions.",
						"Buy-versus-rent note that separates lifestyle preference from financial feasibility.",
						"Profile update showing whether the monthly payment fits the existing budget."
					],
					learningPath: "choice"
				}
			],
			"PF5 How to Make Smart Purchase Decisions": [
				{
					title: "Long-Run Purchase Value",
					prompt: "Compare short-term cheap purchases with longer-lasting alternatives. Examples include toothbrushes, home drinks versus daily takeout, reusable dishware, groceries, furniture, and vehicle choices.",
					evidence: [
						"Cost-over-time comparison with purchase price, replacement frequency, and total cost.",
						"Quality or convenience factor that cannot be captured by price alone.",
						"Recommendation explaining when the cheaper option is actually more expensive."
					]
				},
				{
					title: "Vehicle Purchase Decision",
					prompt: "Research a new or used four-wheeled vehicle, estimate financing terms, add insurance and maintenance, and decide whether the purchase belongs in the profile budget.",
					evidence: [
						"Vehicle comparison with purchase price, down payment, loan term, monthly payment, and total interest.",
						"Recurring-cost estimate for insurance, maintenance, fuel or charging, and registration.",
						"Expense-tracker update showing the effect of fixed and variable vehicle costs."
					],
					learningPath: "choice"
				}
			],
			"PF6 How To Find Your Perfect Bank": [
				{
					title: "Checking-versus-Savings Allocation",
					prompt: "Use a $5,000 prize scenario to decide how much belongs in checking, savings, or another account. Compare access, safety, interest, fees, minimum balances, and purpose.",
					evidence: [
						"Account allocation table matching common expenses to checking or savings.",
						"One-year interest estimate for the savings portion using a compound-interest calculator.",
						"Bank comparison with fees, interest rate, minimum balance, access, and account purpose."
					]
				},
				{
					title: "Savings Account Offer Case",
					prompt: "Compare fictional bank and credit-union offers with opening bonuses, minimum balances, monthly fees, interest rates, and loan eligibility. Choose one or more accounts for the Graduate Profile.",
					evidence: [
						"Offer table with immediate bonus, interest rate, minimum balance, fees, and restrictions.",
						"Cash-flow check showing whether the profile can maintain the required minimum balance.",
						"Recommendation naming the account choice and the evidence that would change the choice."
					]
				}
			],
			"PF7 How to Plan for and Invest in Your Future": [
				{
					title: "Retirement Savings Calculator",
					prompt: "Estimate an ideal retirement age, monthly living costs, health costs, discretionary spending, and savings rate. Compare conservative and aggressive assumptions with an investment calculator.",
					evidence: [
						"Monthly necessity, discretionary, and health-cost estimates for the target retirement location.",
						"Calculator outputs for required savings and monthly contribution.",
						"Comparison of conservative and aggressive assumptions with the risk tradeoff named clearly."
					]
				},
				{
					title: "Investment Account Allocation",
					prompt: "Compare retirement account types such as Roth IRA and 401k using current authoritative information, then create a hypothetical allocation between retirement accounts, self-directed investments, and bank savings. Record the source date and treat contribution limits, tax treatment, eligibility, and employer-match rules as changeable facts that must be rechecked.",
					evidence: [
						"Allocation table with account type, monthly contribution, tax treatment, access constraints, and risk level.",
						"One explanation of why early access, taxes, employer match, or risk changes the recommendation.",
						"Retirement-plan diagram or written summary tied back to the Graduate Profile."
					]
				}
			],
			"PF8 Making Your Money Count": [
				{
					title: "Ethical Spending and Investing",
					prompt: "Research companies, charities, products, or funds connected to environmental or social goals. Separate marketing claims from evidence such as product materials, labor practices, charity ratings, and measurable impact.",
					evidence: [
						"Cause list with direct donation, spending-choice, investment, and non-financial support options.",
						"Evidence comparison of two or more companies, charities, or products.",
						"Budget update showing how much money, time, or attention the cause receives."
					]
				},
				{
					title: "Cause-Aligned Business or Awareness Project",
					prompt: "Design a product, service, post, proposal, or awareness campaign that supports a cause while accounting for production costs, waste, community effect, and revenue or donation assumptions.",
					evidence: [
						"Mission statement with the cause, audience, and concrete action.",
						"Budget or operations note naming expected costs, benefits, and possible unintended harm.",
						"Revision note explaining how the idea becomes more financially realistic or socially responsible."
					],
					learningPath: "choice"
				}
			],
			"PF9 Smart Money Master Project": [
				{
					title: "Financial Journey Portfolio",
					prompt: "Create a final portfolio that traces the Graduate Profile from the initial goals through income, spending, debt, credit, banking, purchases, retirement planning, and values-based money choices.",
					evidence: [
						"Timeline of major decisions, including income changes, budget changes, wild cards, debts, and savings milestones.",
						"Final balance sheet with savings, debt, monthly cash flow, retirement plan, and chosen accounts.",
						"Reflection naming the best decision, weakest decision, and one profile assumption that would change with better evidence."
					]
				},
				{
					title: "Next-Year Outlook",
					prompt: "Project the profile one year forward using the current budget, remaining debt, expected savings, recurring wild cards, and retirement contribution plan.",
					evidence: [
						"Projected monthly or annual table with income, required expenses, discretionary spending, savings, and debt.",
						"Risk note for one or more emergency, job change, market change, or unexpected expense cases.",
						"Final recommendation for the next financial move and the evidence that supports it."
					]
				}
			]
		},
		modules: [
			"PF1 Building Wealth Through Personal Finance",
			"PF2 How to Grow My Income",
			"PF3 How to Manage My Spending",
			"PF4 How to Build Credit: Making Your Small Purchases Count",
			"PF5 How to Make Smart Purchase Decisions",
			"PF6 How To Find Your Perfect Bank",
			"PF7 How to Plan for and Invest in Your Future",
			"PF8 Making Your Money Count",
			"PF9 Smart Money Master Project"
		]
	}),
	moneyMinded: createSourceLibraryCourse({
		name: "Money-Minded: Investing in the Stock Market",
		area: "investing",
		focus: "stock selection, compounding returns, risk, bonds, ETFs, diversification, company analysis, ethical investing, shorting, and cryptocurrency context",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"INV 1 Picking My First Stock": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"public companies",
					"stock ownership",
					"paper portfolio",
					"baseline hypothesis",
					"source date"
				],
				flowNote:
					"Open one imaginary $100,000 paper portfolio and treat its first stock as a baseline hypothesis, not a recommendation. Record the source, observation date, rationale, uncertainty, and evidence that would later change the choice; no real account, money, or transaction is used."
			},
			"INV 2 Strategically Choosing My Stocks": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"market timing",
					"index benchmark",
					"bull and bear labels",
					"data window",
					"strategy revision"
				],
				flowNote:
					"Compare timing with holding and benchmark the paper portfolio against dated index data. If an external activity is unavailable, use an instructor-supplied price table. Describe the selected window instead of predicting the next market move."
			},
			"INV 3 Understanding Compounding Returns": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"compound growth",
					"inflation",
					"real purchasing power",
					"Rule of 72",
					"assumption limits"
				],
				flowNote:
					"Model several hypothetical rates in a text table or calculator, distinguish nominal dollars from purchasing power, and label every rate as an assumption rather than a promised return."
			},
			"INV 4 Assessing My Portfolio's Risk": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"risk and reward",
					"volatility",
					"risk tolerance",
					"risk-free comparison",
					"portfolio revision"
				],
				flowNote:
					"Use the dice ledger to separate uncertainty, volatility, and tolerance, then revise the paper portfolio. A Sharpe Ratio calculation is a challenge path using dated return and risk-free-rate assumptions."
			},
			"INV 5 Investing in Bonds and ETFs": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"bonds",
					"ETFs",
					"index funds",
					"liquidity",
					"asset allocation"
				],
				flowNote:
					"Compare investment types by risk, return potential, liquidity, fees, and diversification role, then add a hypothetical ETF and bond-fund allocation. The external Build Your Stax activity is optional and can be replaced with a supplied comparison table."
			},
			"INV 6 Diversifying My Stock Portfolio": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"stock categories",
					"industry exposure",
					"concentration risk",
					"historical cycle",
					"diversification revision"
				],
				flowNote:
					"Audit the paper portfolio for repeated industry or category exposure and revise it for genuine diversification. Sector-rotation analysis is a challenge using a dated historical period or snapshot, not a forecast."
			},
			"INV 7 Assessing a Company's Success": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"revenue and expenses",
					"net income",
					"P/E ratio",
					"valuation uncertainty",
					"source comparison"
				],
				flowNote:
					"Read matched reporting periods, compare company performance with valuation, and test an undervaluation thesis against contrary evidence. Private-company ranking is optional and uses only supplied or public information without account creation."
			},
			"INV 8 Holding Companies Socially Responsible": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"environmental criteria",
					"social criteria",
					"governance criteria",
					"rating methodology",
					"values tradeoffs"
				],
				flowNote:
					"Compare dated evidence from more than one source, note where ESG methods disagree, and revise the simulated portfolio without treating one score as a complete statement of company impact."
			},
			"INV 9 Shorting Stocks": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"borrow and sell",
					"buy to cover",
					"short squeeze",
					"unlimited-loss risk",
					"paper-only analysis"
				],
				flowNote:
					"Explain the mechanism and asymmetric loss risk through a historical case. Creating a hypothetical short plan is a challenge path only; no real borrowing, trade, or recommendation is part of the course."
			},
			"INV 10 Understanding the Value of Cryptocurrency": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"cryptocurrency",
					"market capitalization",
					"volatility",
					"historical return",
					"portfolio limits"
				],
				flowNote:
					"Study cryptocurrency as a volatile asset and technology context, record dates for all price evidence, and compare benefits with loss, access, custody, and speculation risks. Wallet setup, coin purchase, and real-money use are not required."
			},
			"INV 11 Money-Minded Master Project": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"portfolio allocation",
					"diversification",
					"evidence and uncertainty",
					"monitoring rule",
					"strategy reflection"
				],
				flowNote:
					"Turn the paper portfolio into an analytical strategy brief with dated evidence, limitations, risk controls, and conditions for revision. A private brief or instructor presentation completes the course; brokerage funding, public promotion, and real transactions are not required."
			}
		},
		sourceActivityAnchors: {
			"INV 1 Picking My First Stock": [
				{
					title: "Public Company and Stock Market Tour",
					prompt: "Use [Investopedia](https://www.investopedia.com/) to inspect Apple (AAPL), then compare Apple with another familiar company. Separate what makes a company popular from what makes it publicly traded, investable, and risky.",
					evidence: [
						"Definitions for stock market, public company, stock, investor benefit, and investor risk.",
						"Apple (AAPL) observation notes naming business strength, popularity, and one possible weakness.",
						"Pros-and-cons comparison of public markets from the company perspective and investor perspective."
					]
				},
				{
					title: "First Simulated Portfolio Entry",
					prompt: "Create a simulated portfolio plan using an imaginary $100,000 starting balance. Choose a first stock, explain the purchase rationale, then identify two additional companies to research next.",
					evidence: [
						"First stock selection with ticker, estimated share count, allocation, and purchase rationale.",
						"Expectation note naming what would count as a successful result and what evidence would cause a sell or hold decision.",
						"Watchlist of three to five companies with one reason each company is worth researching."
					]
				}
			],
			"INV 2 Strategically Choosing My Stocks": [
				{
					title: "Time-the-Market Comparison",
					prompt: "Use the Quartz time-the-market activity at [data.qz.com/2015/time-the-market](https://data.qz.com/2015/time-the-market/) to compare one buy-and-sell attempt with a hold-through-the-period strategy.",
					evidence: [
						"Two outcomes: active timing result and hold-only result.",
						"Explanation of beat the market, index, bull market, bear market, crash, and long-term trend.",
						"Strategy note explaining why short-term timing is difficult even when long-term market trends are visible."
					]
				},
				{
					title: "Index and Portfolio Strategy Check",
					prompt: "Compare the S&P 500, Dow Jones, and Nasdaq over a clearly dated one-year window, then describe whether that historical or current snapshot looks more bullish or bearish without treating the label as a prediction. Use the comparison to refine a simulated stock list.",
					evidence: [
						"Index comparison with S&P 500, Dow Jones, and Nasdaq notes, source links, observation date, and data window.",
						"Trade plan for three to five stocks with share counts, estimated cost, and portfolio percentage.",
						"Reflection comparing individual stock performance with an index such as S&P 500, DJI, or QQQ."
					]
				}
			],
			"INV 3 Understanding Compounding Returns": [
				{
					title: "Compounding and Inflation Scenarios",
					prompt: "Compare a $100 birthday gift kept in a piggy bank, placed in savings at a hypothetical 2%, and invested under a hypothetical 10% average-return assumption. Extend the comparison to 1, 5, and 10 years, then model 2% inflation as a scenario rather than a forecast or guarantee.",
					evidence: [
						"Table comparing piggy bank, savings, and investing outcomes after 1, 5, and 10 years.",
						"Inflation-adjusted note explaining buying power rather than only nominal dollars.",
						"Comparison of early investing and late investing using the age 25 versus age 35 scenarios from the source course."
					]
				},
				{
					title: "Rule of 72 Portfolio Projection",
					prompt: "For each simulated stock, estimate one-year return with `(current value - value one year ago) / value one year ago * 100`, then use the Rule of 72 to estimate doubling time.",
					evidence: [
						"One-year return calculation for at least two stocks.",
						"Rule of 72 doubling-time estimate for each calculated return.",
						"Portfolio revision note explaining whether a 10% average return seems realistic for the chosen stocks."
					]
				}
			],
			"INV 4 Assessing My Portfolio's Risk": [
				{
					title: "Dice Risk Ledger",
					prompt: "Model risk with a five-round dice game that starts at $20, costs $1 per round, and changes reward or loss based on how many guesses are allowed.",
					evidence: [
						"Five-round ledger with guesses allowed, result, money won or lost, and ending balance.",
						"Risk-reward explanation using the source table: 6 guesses has low reward and low loss, while 1 guess has high reward and high loss.",
						"Pressure and strategy note connecting the game to portfolio risk tolerance."
					]
				},
				{
					title: "Sharpe Ratio Portfolio Review",
					prompt: "Calculate a portfolio risk review using stock returns, a dated risk-free-rate assumption, and the Sharpe Ratio. Treat the ratio as one backward-looking tool, not a complete investing decision or prediction.",
					evidence: [
						"List of stock percentage returns used in the Sharpe Ratio review.",
						"Definition of investment portfolio, risk-free investment, return, volatility, and Sharpe Ratio.",
						"Portfolio adjustment note explaining how the risk analysis changes or confirms the strategy."
					],
					learningPath: "challenge"
				}
			],
			"INV 5 Investing in Bonds and ETFs": [
				{
					title: "Build Your Stax Diversification Review",
					prompt: "Use [Build Your Stax](https://buildyourstax.com/) as a diversification case study. Compare stocks with CDs, mutual funds, index funds, ETFs, and bond-like investments.",
					evidence: [
						"Investment-type comparison naming risk, return potential, liquidity, and diversification role.",
						"Explanation of how diversification changes total portfolio risk.",
						"Game result reflection identifying one decision that reduced risk and one decision that limited returns."
					],
					learningPath: "choice"
				},
				{
					title: "ETF and Bond Fund Allocation",
					prompt: "Allocate part of the imaginary $100,000 portfolio to ETFs and bond funds. Consider index ETFs such as SPY, QQQ, and DIA, thematic ETFs such as BOTZ, and one to three bond funds.",
					evidence: [
						"Allocation percentage for ETFs and bond funds with a reason tied to portfolio risk.",
						"ETF table with ticker, category, expected role, and short-term or long-term purpose.",
						"Bond fund table with ticker or fund name, expected role, and return expectation."
					]
				}
			],
			"INV 6 Diversifying My Stock Portfolio": [
				{
					title: "Stock Category and Sector Rotation Map",
					prompt: "Classify stocks as cyclical, defensive, growth, blue-chip, or IPO, then connect those categories to sector rotation during one selected historical period or a dated current snapshot. Describe uncertainty rather than presenting the cycle stage as settled or predictive.",
					evidence: [
						"Definitions and examples for cyclical, defensive, growth, blue-chip, and IPO stocks.",
						"Sector rotation map explaining which categories may perform better in different economic conditions.",
						"Dated cycle note explaining which stock categories appeared aligned with the selected market environment and what evidence could contradict that reading."
					],
					learningPath: "challenge"
				},
				{
					title: "Category-Based Portfolio Diversification",
					prompt: "Choose stocks from multiple categories and industries, then compare their historical performance with the role they serve in the simulated portfolio.",
					evidence: [
						"At least two researched stock options in each chosen category.",
						"Purchase or watchlist table naming ticker, category, industry, reason for selection, and risk.",
						"Diversification explanation that goes beyond owning several similar stocks."
					]
				}
			],
			"INV 7 Assessing a Company's Success": [
				{
					title: "Financial Statement and P/E Ratio Review",
					prompt: "Use dated Tesla public financial statements as a model for reading revenue, expenses, net income, and P/E ratio. Compare Tesla with GM using the same reporting periods to separate company performance from market valuation and record every source date.",
					evidence: [
						"Definitions for revenue, expenses, net income, income statement, and P/E ratio.",
						"Tesla trend notes for revenue and net income over multiple reporting periods.",
						"Tesla-versus-GM comparison explaining why a higher valuation may or may not be justified."
					]
				},
				{
					title: "Undervalued Stock Candidate Review",
					prompt: "Find one or two stocks that may be undervalued, review their income statements, calculate or look up their P/E ratios, and decide whether they belong in the simulated portfolio.",
					evidence: [
						"Candidate table with ticker, industry, revenue trend, net income trend, and P/E ratio.",
						"Undervalued thesis explaining the evidence and the uncertainty.",
						"Portfolio change note naming any additions, removals, or holds caused by the analysis."
					]
				},
				{
					title: "Private Company Ranking Case",
					prompt: "Use an instructor-supplied snapshot or publicly accessible information from [Republic.co](https://republic.co/) as a private-company research case. Rank three startup opportunities using differentiation, team, business/product evaluation, mission and impact, and one additional criterion. Do not create an account, submit identifying information, or invest money.",
					evidence: [
						"Top-three ranking with evidence for differentiation, team, product value, and mission or impact.",
						"Additional criteria list informed by startup failure patterns such as market need, business model, competition, or execution risk.",
						"Final recommendation explaining why the top-ranked company is stronger than the runner-up."
					],
					learningPath: "choice"
				}
			],
			"INV 8 Holding Companies Socially Responsible": [
				{
					title: "ESG Criteria and Reliability Review",
					prompt: "Study environmental, social, and governance criteria, then compare dated ESG score evidence for companies such as Alphabet, Disney, and PepsiCo. Record the rating provider and methodology because providers can score the same company differently.",
					evidence: [
						"Definitions for environmental, social, governance, ESG score, and socially responsible investing.",
						"Priority list naming two or three criteria that matter most for an investing decision.",
						"Reliability note explaining why ESG scores are useful but incomplete."
					]
				},
				{
					title: "Values-Aligned Portfolio Update",
					prompt: "Research companies whose practices align with priorities such as environmental responsibility, worker treatment, or community impact. Examples from the source include PLUG, FCEL, CRM, and ABNB.",
					evidence: [
						"Research notes for two or three companies with cited evidence of positive or negative practices.",
						"Estimated ESG or values-alignment score with a clear reason.",
						"Portfolio update explaining which shares are added, kept, or replaced because of the values screen."
					]
				}
			],
			"INV 9 Shorting Stocks": [
				{
					title: "Short Selling and Short Squeeze Case",
					prompt: "Use the Jordans resale analogy to explain short selling, then analyze a short squeeze case such as GameStop. Separate potential profit from unlimited-loss risk.",
					evidence: [
						"Short-selling explanation with borrow, sell, price drop, buy back, and return steps.",
						"Loss scenario showing what happens when the price rises instead of falls.",
						"Short squeeze summary naming the mechanism, recent example, and risk lesson."
					]
				},
				{
					title: "Overvalued Company Short Plan",
					prompt: "For a paper-only simulation, find one to three companies that may be overvalued, use dated financial metrics or a research source such as Chartmill, and create a hypothetical short-position plan with a risk cap and exit rule. This is an analysis exercise, not a recommendation or real trade.",
					evidence: [
						"Candidate table with overvaluation evidence and uncertainty.",
						"Short-position plan naming share count, entry rationale, risk cap, and buy-to-cover exit condition.",
						"Portfolio risk note explaining why each candidate is or is not appropriate for shorting."
					],
					learningPath: "challenge"
				}
			],
			"INV 10 Understanding the Value of Cryptocurrency": [
				{
					title: "Cryptocurrency Value Comparison",
					prompt: "Define cryptocurrency, compare how fiat money and cryptocurrencies gain value, and inspect popular coins through a price list such as Coinbase's public price directory.",
					evidence: [
						"Definition of cryptocurrency, blockchain-based transfer, fiat currency, and market capitalization.",
						"Comparison of Bitcoin, Ethereum, and Dogecoin by purpose, market capitalization, and coin issuance.",
						"Advantages-and-disadvantages list covering volatility, access, decentralization, speculation, and practical use."
					]
				},
				{
					title: "Bitcoin Historical Return Case",
					prompt: "Use a Bitcoin historical price chart such as [Coindesk's Bitcoin price page](https://www.coindesk.com/price/bitcoin) to compare buying near the 2018 peak, after the 2018 crash, and near the original low-price period.",
					evidence: [
						"Price comparison for a 2018 peak purchase, a post-crash purchase, and a 2010-style early-price scenario.",
						"Percentage gain or loss calculation for at least one scenario.",
						"Investment thesis explaining whether cryptocurrency fits the portfolio and what risk evidence limits the conclusion."
					],
					learningPath: "choice"
				}
			],
			"INV 11 Money-Minded Master Project": [
				{
					title: "Investment Strategy Pitch",
					prompt: "Create a final analytical brief for the simulated $100,000 portfolio. Explain the allocation, diversification, evidence, uncertainty, and how the strategy handles risk, growth, ethics, and any optional cryptocurrency exposure. The brief does not request brokerage funding or recommend real transactions.",
					evidence: [
						"Portfolio allocation with stocks, ETFs, bond funds, possible cryptocurrency, and cash or reserve assumptions.",
						"Growth projection with expected return, time horizon, risk level, and evidence that could change the plan.",
						"Monitoring plan naming review cadence, rebalancing rule, source checks, and conditions that would change the simulated allocation."
					]
				},
				{
					title: "Private Company Re-Evaluation",
					prompt: "If the optional private-company case was completed, return to its instructor-supplied or publicly accessible evidence and decide whether the original top-three choices still hold up. Otherwise, apply the same criteria audit to three public-company or fictional startup cases. No account creation or investment is required.",
					evidence: [
						"Updated top-three ranking with old and new company comparisons.",
						"Criteria audit explaining which research criteria changed after completing the course.",
						"Final decision note explaining whether the original ranking is confirmed or revised."
					],
					learningPath: "choice"
				}
			]
		},
		modules: [
			"INV 1 Picking My First Stock",
			"INV 2 Strategically Choosing My Stocks",
			"INV 3 Understanding Compounding Returns",
			"INV 4 Assessing My Portfolio's Risk",
			"INV 5 Investing in Bonds and ETFs",
			"INV 6 Diversifying My Stock Portfolio",
			"INV 7 Assessing a Company's Success",
			"INV 8 Holding Companies Socially Responsible",
			"INV 9 Shorting Stocks",
			"INV 10 Understanding the Value of Cryptocurrency",
			"INV 11 Money-Minded Master Project"
		]
	}),
	entrepreneurship: createSourceLibraryCourse({
		name: "Be Your Own Boss: Entrepreneurship 101",
		area: "entrepreneurship",
		focus: "design thinking, problem discovery, customer definition, iteration, competitors, feasibility, marketing, social impact, and pitch development",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"ENT1 Design Thinking Methodology": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"venture portfolio",
					"Lean Canvas preview",
					"assumptions",
					"design thinking",
					"evidence questions"
				],
				flowNote:
					"Open one venture portfolio, preview the final canvas, and mark every untested claim as an assumption. The wallet sprint is an optional warm-up; the venture itself can be fictional, team-based, or personal."
			},
			"ENT2 Learning What It Takes To Be An Entrepreneur": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"founder strengths",
					"values",
					"empathy evidence",
					"consent",
					"problem seed"
				],
				flowNote:
					"Choose a fictional, team, or personal founder profile, then gather only consented, non-identifying observation evidence. Use that evidence to identify one problem seed; a public About page and personal disclosure are not required."
			},
			"ENT3 Solving Problems Through Entrepreneurship": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"problem statement",
					"initial solution",
					"low-fidelity prototype",
					"brand identity",
					"feedback questions"
				],
				flowNote:
					"Turn the selected problem into a direct solution, build the smallest safe low-fidelity prototype, and prepare an original text mark or sketch plus privacy-respecting feedback questions. No purchases, advanced fabrication, or public website are required."
			},
			"ENT4 Identifying the Ideal Customer": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"customer segment",
					"aggregate persona",
					"needs and blockers",
					"survey validity",
					"privacy"
				],
				flowNote:
					"Build a fictional or aggregate persona from ranges and patterns, then test assumptions with anonymous, opt-in, supplied, or simulated responses. The external coffee-shop game is an optional case with a text-table fallback."
			},
			"ENT5 Iterating On Your Idea": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"feedback sample",
					"evidence limits",
					"conflicting responses",
					"iteration decision",
					"before / after prototype"
				],
				flowNote:
					"Separate observations from interpretations, record sample limits, choose revisions tied to evidence, and preserve a before-and-after prototype plus the riskiest remaining assumption."
			},
			"ENT6 Conducting Competitor Analysis": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"competitor set",
					"comparison dimensions",
					"positioning matrix",
					"dated sources",
					"differentiation"
				],
				flowNote:
					"Compare a focused competitor set using dated public evidence, map the venture on two meaningful dimensions, and revise one product choice. Direct outreach is optional, opt-in, and never requires impersonation or bulk messaging."
			},
			"ENT7 Testing Financial Feasibility": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"pricing model",
					"unit cost",
					"revenue",
					"profit margin",
					"sensitivity cases"
				],
				flowNote:
					"Estimate price and unit economics, then model low, base, and high customer cases instead of presenting one forecast as certain. Keep assumptions visible and revise the venture when costs or demand make the first plan infeasible."
			},
			"ENT8 Building and Testing Marketing Strategies": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"value proposition",
					"customer benefit",
					"channel fit",
					"message consistency",
					"mock campaign"
				],
				flowNote:
					"Condense evidence into one value proposition and choose channels that fit the persona, then create private campaign mockups. Public posts, ad spending, data collection, and real sales are not required."
			},
			"ENT9 Focusing on Social Impact": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"impact risk",
					"alternative practice",
					"cost tradeoff",
					"claim evidence",
					"unintended harm"
				],
				flowNote:
					"Audit materials, labor, packaging, energy, distribution, and community effects, then revise the feasibility model. Keep claims sourced and bounded; a cause-aligned campaign is an optional private mockup."
			},
			"ENT10 Be Your Own Boss Master Project": {
				estimatedTime: "3–4 sessions · 40–50 minutes each",
				keyBlocks: [
					"Lean Canvas",
					"evidence portfolio",
					"feasibility",
					"pitch",
					"revision"
				],
				flowNote:
					"Reconcile the venture canvas with customer, prototype, competitor, financial, marketing, and impact evidence, then revise a concise pitch after opt-in feedback or a structured self-review. A private portfolio and low-fidelity prototype are complete; launch, public posting, incorporation, and real sales are not required."
			}
		},
		sourceActivityAnchors: {
			"ENT1 Design Thinking Methodology": [
				{
					title: "Business Canvas Preview",
					prompt: "Start the course by previewing the final business canvas. Use a Lean Canvas-style structure to connect the problem, solution, key metrics, value proposition, unfair advantage, channels, target customers, cost structure, and revenue streams.",
					evidence: [
						"Draft canvas with each major box labeled, even when some boxes still contain open questions.",
						"Two feedback questions for an entrepreneur, business owner, or other knowledgeable reviewer.",
						"Revision note explaining which business assumption needs the most evidence."
					]
				},
				{
					title: "Ideal Wallet Design Sprint",
					prompt: "Run a short design-thinking sprint around a wallet or small everyday object. Use an opt-in interview, a supplied fictional user, or a self-test; do not collect names, contact details, payment information, or sensitive contents. Write a point-of-view statement, sketch three possible solutions, gather feedback, and revise the strongest design.",
					evidence: [
						"Interview notes naming what the user stores, worries about, or wants easier access to.",
						"Point-of-view statement in the form: user needs a way to ___ because or but ___.",
						"Three concept sketches plus a final iteration note based on feedback."
					],
					learningPath: "choice"
				}
			],
			"ENT2 Learning What It Takes To Be An Entrepreneur": [
				{
					title: "Entrepreneur Strengths and Values Sketch",
					prompt: "Create a fictional, team, or personal founder profile that names three to five strengths and two to four values. Personal disclosure is optional. Connect each strength or value to how a future customer, teammate, or investor might judge the business.",
					evidence: [
						"Founder sketch or profile with strengths, values, and one concrete behavior for each value.",
						"Example of a real entrepreneur or company whose choices either reinforced or weakened trust.",
						"Reflection explaining why values can become harder to protect as a company grows."
					]
				},
				{
					title: "Brand Foundation Website Page",
					prompt: "Create a private mockup of an About or brand-foundation page for the developing business. Include fictional, team, or voluntarily shared founder values, a brief origin story, and the motivation behind the company before the product is fully defined.",
					evidence: [
						"About-page draft with founder strengths, values, and business motivation.",
						"Customer-facing sentence explaining why those values matter to the buyer.",
						"Revision note naming which claim sounds generic and how to make it more specific."
					],
					learningPath: "choice"
				},
				{
					title: "Empathy Observation Persona",
					prompt: "With consent, observe a non-sensitive routine, use a pet or self-observation, or work from a supplied fictional routine. Record pain points, frustrations, habits, and needs without names or identifying details, then translate the evidence into a simple persona that can guide later problem selection.",
					evidence: [
						"Observation notes organized into story, pain points, frustrations, habits, and needs.",
						"Persona summary with one specific problem worth solving.",
						"Evidence note separating observed behavior from assumptions about motivation."
					]
				}
			],
			"ENT3 Solving Problems Through Entrepreneurship": [
				{
					title: "Problem Statement and Initial Solution",
					prompt: "Convert empathy notes into a concrete problem statement, then propose an initial product, service, or brand solution. Compare the statement to examples such as Duolingo, Airbnb, or Uber to check clarity.",
					evidence: [
						"Problem statement that names a target user, pain point, and reason the problem matters.",
						"Initial solution statement that directly answers the problem rather than listing features only.",
						"Search or market-interest notes, such as common questions people ask about the problem."
					]
				},
				{
					title: "Product or Service Prototype",
					prompt: "Build a first prototype. A product idea can use a labeled sketch or simple 3D model; a service idea can use a customer flowchart from first request through delivery and follow-up.",
					evidence: [
						"Prototype artifact with labels explaining the important parts of the product or service.",
						"Customer journey or use case showing how the prototype solves the selected problem.",
						"Website or one-page description that explains the prototype in customer-facing language."
					]
				},
				{
					title: "Name, Logo, Tagline, and Feedback Survey",
					prompt: "Give the company a recognizable identity and prepare privacy-respecting feedback collection. Create an original name, low-fidelity logo sketch or text mark, and tagline, then write survey questions that gather prototype reactions without names, contact details, account information, or sensitive personal data.",
					evidence: [
						"Brand identity draft with name, logo concept, tagline, and reason each choice fits the customer.",
						"Survey with open-ended questions about usefulness, price, concerns, and likelihood of use.",
						"Feedback plan naming three to five possible respondents and what each can evaluate."
					]
				}
			],
			"ENT4 Identifying the Ideal Customer": [
				{
					title: "Coffee Shop Customer Needs Simulation",
					prompt: "Use the coffee shop simulation at [coolmathgames.com/0-coffee-shop](https://www.coolmathgames.com/0-coffee-shop) as a customer-needs case study. Track how price, recipe, weather, and customer comments affect sales.",
					evidence: [
						"Daily notes recording price, recipe choices, sales, and customer feedback patterns.",
						"Observation explaining how one customer complaint led to a changed business decision.",
						"Conclusion about why a product that is technically good can still fail if the buyer rejects price or fit."
					],
					learningPath: "choice"
				},
				{
					title: "Ideal Customer Persona Profile",
					prompt: "Define one fictional or aggregate ideal customer with age range, income range, education or background, broad location, needs, values, blockers, habits, and motivators. Use ranges and non-identifying patterns rather than naming real people. The persona must be specific enough to guide product and marketing decisions without becoming a personal record.",
					evidence: [
						"Customer persona with demographic details, needs, motivators, blockers, and buying habits.",
						"Two to five fictional example profiles or aggregate customer patterns that fit the persona.",
						"Reasoning note explaining which persona detail changes the business plan the most."
					]
				},
				{
					title: "Customer Feedback Survey Draft",
					prompt: "Write five to ten open-ended survey questions for potential customers or a supplied fictional response set. Include questions about willingness to pay, frequency of use, concerns, and desired changes without forcing yes-or-no answers or requesting identifying or sensitive information.",
					evidence: [
						"Survey draft with open-ended wording and no leading answer choices.",
						"Question map showing which product assumption each question tests.",
						"Revision note improving one biased or vague question."
					]
				}
			],
			"ENT5 Iterating On Your Idea": [
				{
					title: "Feedback Interpretation and Iteration Plan",
					prompt: "Review opt-in, anonymous, supplied, or clearly simulated prototype and persona-survey feedback. Record the response count and limitations, separate improvements, keepers, conflicting responses, and surprising results, then choose which feedback will drive the next prototype version.",
					evidence: [
						"Feedback table grouped by improvement, keep, conflict, and surprise.",
						"Iteration plan with specific changes and the customer evidence behind each change.",
						"Decision note explaining how conflicting feedback was resolved."
					]
				},
				{
					title: "Revised Prototype Evidence Summary",
					prompt: "Revise the prototype using the iteration plan. Summarize what changed, what evidence caused the change, and which unresolved concern still needs testing.",
					evidence: [
						"Before-and-after prototype comparison.",
						"Change log connecting each revision to survey or interview evidence.",
						"Next-test question focused on the riskiest remaining assumption."
					]
				}
			],
			"ENT6 Conducting Competitor Analysis": [
				{
					title: "Competitor Positioning Matrix",
					prompt: "Research similar companies and place them on a two-axis positioning matrix such as price versus quality. Use the map to identify the company niche and possible differentiation strategy.",
					evidence: [
						"Competitor list with two chosen comparison dimensions and notes for each company.",
						"Positioning matrix showing where the new company fits relative to competitors.",
						"Differentiation note naming whether the strategy resembles disruptive, new-market, integrative, or sustaining innovation."
					]
				},
				{
					title: "Competitor Question Research",
					prompt: "Write questions for competitor research, then collect answers from dated public websites, product pages, reviews, or clearly opt-in outreach when appropriate. Do not impersonate customers, scrape restricted data, or send unsolicited bulk messages.",
					evidence: [
						"Question list about problem solved, target customer, product difference, functionality, and motivation to buy.",
						"Research notes with source links or dates.",
						"Prototype update based on one competitor strength and one competitor weakness."
					]
				}
			],
			"ENT7 Testing Financial Feasibility": [
				{
					title: "Price and Competitor Comparison",
					prompt: "Choose a tentative price using customer feedback and competitor prices. Separate one-time purchases from recurring-fee models and explain why the selected model fits the product or service.",
					evidence: [
						"Pricing table with customer willingness-to-pay evidence and competitor prices.",
						"Decision note explaining one-time versus recurring pricing.",
						"Advertisement sketch or landing-page copy that displays the chosen price clearly."
					]
				},
				{
					title: "Production Cost and Profit Margin Forecast",
					prompt: "Estimate the cost of production or service delivery, then calculate revenue, costs, profit, and profit margin for low, base, and high first-year cases. Include the original scenario with 1,000 customers as one explicit assumption rather than a guaranteed outcome.",
					evidence: [
						"Materials, tools, labor, software, or operating-cost list with estimated prices.",
						"Profit-margin calculation and industry comparison note.",
						"Low, base, and high first-year forecasts with revenue, total cost, profit, margin, and customer-count assumptions at the final chosen price."
					]
				}
			],
			"ENT8 Building and Testing Marketing Strategies": [
				{
					title: "One-Sentence Value Proposition",
					prompt: "Synthesize product experience, customer needs, competitor differences, and benefits into one clear value proposition. The statement must name what makes the offer useful and distinct.",
					evidence: [
						"Notes on customer feeling, features, benefits, persona needs, motivators, blockers, and competitor gaps.",
						"One-sentence value proposition placed where a customer would see it first.",
						"Revision note cutting vague or duplicate wording from the proposition."
					]
				},
				{
					title: "Channels and Launch Campaign Sketch",
					prompt: "Choose sales and promotion channels based on the ideal customer's habits. Review consistent marketing from known companies, then create private mock launch posts or website sections for the company. Public posting, ad purchases, and real sales are not required.",
					evidence: [
						"Channel decision explaining online, in-store, website, social, marketplace, or retailer choices.",
						"Marketing reference notes from at least three companies with clear brand consistency.",
						"Launch campaign draft with offer, audience, call to action, and visual or written style notes."
					]
				}
			],
			"ENT9 Focusing on Social Impact": [
				{
					title: "Impact Risk and Alternative Materials Review",
					prompt: "Identify possible environmental or community harms from production, labor, packaging, maintenance, or distribution. Research alternatives that reduce harm and update the cost assumptions accordingly.",
					evidence: [
						"Impact-risk list tied to specific materials, labor conditions, packaging, energy, or supply-chain choices.",
						"Alternative-practice research with costs, benefits, and tradeoffs.",
						"Updated price or cost calculation showing how the impact choice changes feasibility."
					]
				},
				{
					title: "Cause-Aligned Website Page and Campaign",
					prompt: "Create a private mock cause-aligned page or campaign that explains the company's social or environmental commitment with concrete, sourced, and bounded evidence instead of vague claims.",
					evidence: [
						"Cause page draft with the chosen cause, business practice, and measurable evidence.",
						"Promotional post or campaign outline focused on awareness and customer trust.",
						"Credibility check naming which claim needs a source, number, or clearer boundary."
					],
					learningPath: "choice"
				}
			],
			"ENT10 Be Your Own Boss Master Project": [
				{
					title: "Lean Business Canvas Portfolio",
					prompt: "Finalize the business canvas by connecting work from the full course: problem, solution, metrics, value proposition, unfair advantage, channels, customers, costs, and revenue streams.",
					evidence: [
						"Completed canvas or slide deck with all major business-model sections.",
						"Supporting artifacts from customer research, prototype iteration, competitor analysis, pricing, marketing, and impact work.",
						"Final website or landing-page cleanup checklist."
					]
				},
				{
					title: "Entrepreneur Feedback and Pitch Revision",
					prompt: "Present the business plan privately to an opt-in entrepreneur, business owner, peer, reviewer, or structured self-review checklist. Gather feedback on clarity, feasibility, differentiation, and presentation, then revise the pitch. Public posting or outreach is not required.",
					evidence: [
						"Feedback notes answering what works, what does not work, what is unclear, and what can improve.",
						"Revision log showing what changed after feedback.",
						"Final pitch outline with problem, customer, solution, proof, business model, and ask or next step."
					]
				}
			]
		},
		modules: [
			"ENT1 Design Thinking Methodology",
			"ENT2 Learning What It Takes To Be An Entrepreneur",
			"ENT3 Solving Problems Through Entrepreneurship",
			"ENT4 Identifying the Ideal Customer",
			"ENT5 Iterating On Your Idea",
			"ENT6 Conducting Competitor Analysis",
			"ENT7 Testing Financial Feasibility",
			"ENT8 Building and Testing Marketing Strategies",
			"ENT9 Focusing on Social Impact",
			"ENT10 Be Your Own Boss Master Project"
		]
	})
} as const;

const englishCourses = {
	joyOfReading: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering the Joy of Reading",
		area: "reading",
		focus: "characters, plot, literature comprehension, informational texts, figurative language, and short reading responses",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"JoR1 Characters": {
				estimatedTime: "3 sessions · 30–40 minutes each",
				keyBlocks: [
					"character detail",
					"action",
					"trait",
					"text evidence",
					"inference"
				],
				flowNote:
					"Confirm a lawful classroom copy of each named story or use a teacher-selected equivalent before the session. Read in short sections, collect what the character says and does, and support each trait with one exact detail."
			},
			"JoR2 Plot": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"exposition",
					"rising action",
					"climax",
					"resolution",
					"event evidence"
				],
				flowNote:
					"Confirm a lawful classroom copy of the named story or use an equivalent narrative. Retell the events first, then place them on a hand-drawn, text-only, or supplied plot diagram and explain the climax choice."
			},
			"JoR Check-In #1": {
				estimatedTime: "1–2 sessions · 30–40 minutes each",
				keyBlocks: [
					"character trait",
					"supporting action",
					"plot order",
					"climax / resolution",
					"oral or written explanation"
				],
				flowNote:
					"Use a lawful copy of Happy Halloween or an equivalent short story. Accept a labeled drawing, oral explanation, or short written response when it contains both character and plot evidence."
			},
			"JoR3 Reading Literature": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"important event",
					"sequence",
					"storyboard",
					"lesson / moral",
					"supporting evidence"
				],
				flowNote:
					"Use a lawful copy of Groceries or an equivalent narrative. Choose six moments because they change the story, not merely because they are easy to draw, and connect the lesson to a specific event."
			},
			"JoR4 Reading Informational Texts": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"who / what / when / where / why",
					"central idea",
					"key detail",
					"fact",
					"audience explanation"
				],
				flowNote:
					"Use a lawful copy of the megalodon article or an equivalent age-appropriate informational text. Separate the central idea from supporting facts before drafting the news report."
			},
			"JoR5 Figurative Language": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"literal / figurative",
					"idiom",
					"simile",
					"metaphor",
					"personification"
				],
				flowNote:
					"Draw or describe the literal image first, then infer the intended meaning from sentence context. Each label includes an explanation so vocabulary does not become a guessing exercise."
			},
			"JoR Check-In #2": {
				estimatedTime: "2–3 sessions · 30–40 minutes each",
				keyBlocks: [
					"story lesson",
					"character change",
					"figurative language",
					"main idea",
					"supporting detail"
				],
				flowNote:
					"Confirm lawful copies of the named texts or use equivalent literature and informational passages. Collect one literature response and one main-idea response, allowing oral, drawn, or written evidence."
			},
			"JoR6 Master Project": {
				estimatedTime: "3–4 sessions · 30–40 minutes each",
				keyBlocks: [
					"project choice",
					"summary / main idea",
					"text evidence",
					"audience format",
					"revision"
				],
				flowNote:
					"Complete the project-selection plan, then choose one final path. Use a lawful copy of the selected text or an equivalent, build the smallest complete response first, and revise after an evidence check."
			}
		},
		sourceActivityAnchors: {
			"JoR1 Characters": [
				{
					title: "Character Investigator Report",
					prompt: "Read The Secret Ingredient and track Moira, Sunli, and Zaira through appearance details, preparation actions, problem response, and story impact. Use the evidence to infer two character traits for each character and write a three-sentence report for each one.",
					evidence: [
						"Character notes for Moira, Sunli, and Zaira that separate appearance, actions, and response to the competition problem.",
						"Two traits for each character with one action or quotation that supports the trait.",
						"Three-sentence report for each character describing the character, explaining an important action, and predicting how the story would change without that character."
					]
				},
				{
					title: "Sweet Sixteen Character Evidence",
					prompt: "Read Sweet Sixteen and compare Leonard, Frankie, and Morgan. Build a character sketch from descriptive details and then write short descriptions that use exact text evidence instead of only personal impressions.",
					evidence: [
						"Sketch or written profile for each triplet using details from the story and one inferred detail.",
						"Three-to-five-sentence description of Leonard, Frankie, and Morgan.",
						"At least one copied or quoted story detail for each description, with a note explaining how the detail supports the character claim."
					]
				}
			],
			"JoR2 Plot": [
				{
					title: "Faithful Friend Plot Diagram",
					prompt: "Read The Faithful Friend and place the major story events on a plot diagram. The diagram identifies exposition, rising action, climax, and resolution, then explains why each event belongs in that location.",
					evidence: [
						"Completed plot diagram or text equivalent for The Faithful Friend.",
						"Plain-language definitions for exposition, rising action, climax, and resolution.",
						"Short explanation for at least two placements that connects the event to the story structure."
					]
				}
			],
			"JoR Check-In #1": [
				{
					title: "Happy Halloween Plot and Character Check",
					prompt: "Read Happy Halloween and review both plot and character evidence. Track Jenny, Stacey, and Rebecca, then use a plot diagram to show how the haunted-house problem leads to the cookie-baking resolution.",
					evidence: [
						"Plot diagram or ordered event list with exposition, rising action, climax, and resolution.",
						"Three-to-five-sentence descriptions of Jenny, Stacey, and Rebecca that include traits and actions.",
						"Short oral or written review introducing the characters and explaining how the drawings or notes connect to traits and actions."
					]
				}
			],
			"JoR3 Reading Literature": [
				{
					title: "Groceries Storyboard",
					prompt: "Read Groceries and choose the six most important moments for a storyboard. Each frame captures a meaningful event, and the final explanation names why those moments matter and what lesson the story suggests.",
					evidence: [
						"Six-frame storyboard or numbered scene list for the story.",
						"Reason for choosing each scene as important to the plot.",
						"One-sentence moral or lesson supported by a story event."
					]
				}
			],
			"JoR4 Reading Informational Texts": [
				{
					title: "Megalodon News Report",
					prompt: "Read Ancient megalodon sharks were huge! and identify the who, what, when, where, why, and central message. Convert the article into a short news report that explains the discovery clearly for an audience.",
					evidence: [
						"Answers for who, what, when, where, why, and central message.",
						"News-report script with an introduction, central message, key details, and closing.",
						"Backdrop notes, image plan, or key-detail list that supports the report without replacing the explanation."
					]
				}
			],
			"JoR5 Figurative Language": [
				{
					title: "Figurative Language Drawing Set",
					prompt: "Compare literal pictures with these complete contexts: After several failed attempts, the puzzle was a hard nut to crack. To avoid upsetting a resting sibling, Kai had to walk on eggshells. In a nutshell, the trip went well. The sunflower was as tall as a giraffe. The test was a breeze, so the class finished early. The wind whipped through my hair. Compare the last sentence with The wind whispered a secret to the leaves. Explain intended meanings and justify idiom, simile, metaphor or personification labels. A phrase may fit more than one category; strong motion alone does not establish human behavior.",
					evidence: [
						"Drawing or written literal interpretation for each figurative phrase.",
						"Definition of idiom, simile, metaphor, and personification using the phrase examples.",
						"Explanation of the difference between literal and figurative meaning and why an author might use figurative language."
					]
				}
			],
			"JoR Check-In #2": [
				{
					title: "Kevin's Crafts Story Review",
					prompt: "Read Kevin's Crafts and identify the moral, Kevin's character change, and at least three examples of figurative language. The review explains both what happened and how the language shapes the story.",
					evidence: [
						"Moral or overall lesson of Kevin's Crafts.",
						"Three figurative-language examples labeled as metaphor, simile, idiom, or another appropriate type.",
						"Story review that explains what the story is about, the moral, and whether the evidence supports the response."
					]
				},
				{
					title: "Lab-Grown Meat Main Idea Report",
					prompt: "Read Is lab-grown meat a good idea? and separate the central idea from supporting details. Use both the possible benefits and concerns to build a balanced informational report.",
					evidence: [
						"Main idea sentence for the article.",
						"Three key details copied or paraphrased from the text.",
						"Short report explaining how the key details relate to the main idea."
					]
				}
			],
			"JoR6 Master Project": [
				{
					title: "Master Project Choice and Evidence Plan",
					prompt: "Choose one story-review, figurative-art, interview or news-report path and confirm access to its selected text. Plan the summary or main idea, at least three supporting details and audience format. Complete the selected response and document one revision.",
					evidence: [
						"Selected project path and accessible text.",
						"Planning notes for summary or main idea, at least three supporting details, and the intended audience.",
						"Finished response in the selected format, with an evidence checklist and one documented revision."
					]
				},
				{
					title: "Bacon and Mittens Review or Figurative Art",
					prompt: "Read Bacon and Mittens and choose either a story review or a figurative-language art response. Both options require a summary, a moral or lesson, and evidence from the story.",
					evidence: [
						"Summary of what the story is about and the moral or lesson.",
						"At least three figurative-language examples from the story, with meanings explained.",
						"Response format selected: story review with opinion and reasons, or figurative-language art with explanation for each example."
					],
					learningPath: "choice"
				},
				{
					title: "Dinosaur Footprint Interview or News Report",
					prompt: "Read Four-year-old makes a big discovery! and choose either an interview script or a news report. The response uses article facts about Lily, the footprint, the scientists, and the protected beach site.",
					evidence: [
						"Interview questions with imagined answers grounded in article details, or a news script with introduction, main idea, key details, and closing.",
						"Key-detail list that includes the discovery, estimated age, dinosaur information, and museum/protection context.",
						"Explanation of how the selected format helps the audience understand the informational text."
					],
					learningPath: "choice"
				}
			]
		},
		modules: [
			"JoR1 Characters",
			"JoR2 Plot",
			"JoR Check-In #1",
			"JoR3 Reading Literature",
			"JoR4 Reading Informational Texts",
			"JoR5 Figurative Language",
			"JoR Check-In #2",
			"JoR6 Master Project"
		]
	}),
	pictureBook: createSourceLibraryCourse({
		name: "Early Elementary B: Write Your Own Picture Book",
		area: "writing",
		focus: "story planning, parts of speech, capitalization, commas, quotation marks, opinion writing, agreement, word choice, narrative writing, presentation skills, and book revision",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"WYB1 Book Brainstorm I": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"topic",
					"opinion",
					"audience",
					"picture-text connection",
					"book seed"
				],
				flowNote:
					"Start one book portfolio and save every usable idea in it. Students may draw, dictate, or write, and may use fictional favorites instead of sharing personal places or routines."
			},
			"WYB2 Parts of Speech": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"noun / proper noun",
					"adjective",
					"verb",
					"adverb",
					"sentence label"
				],
				flowNote:
					"Build the definition map with short examples, then revise one sentence from the book portfolio by choosing a precise noun, verb, adjective, or adverb."
			},
			"WYB3 Capitalization": {
				estimatedTime: "1–2 sessions · 30–40 minutes each",
				keyBlocks: [
					"sentence start",
					"proper noun",
					"title",
					"capitalization rule",
					"editing mark"
				],
				flowNote:
					"Infer rules from examples, then apply the rule list to the book title, character or place names, and one draft page. Preserve a before-and-after sentence."
			},
			"WYB4 Commas & Quotation Marks": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"comma in a list",
					"introductory phrase",
					"quotation marks",
					"dialogue",
					"punctuation revision"
				],
				flowNote:
					"Solve the punctuation cases first, then add or revise one list and one line of dialogue in the developing book so the rules immediately support the final artifact."
			},
			"WYB5 Opinion Writing": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"opinion",
					"reason",
					"linking word",
					"topic sentence",
					"closing"
				],
				flowNote:
					"Separate the opinion from its reasons, select the two strongest reasons, and turn the outline into a short opinion-book page sequence for the first checkpoint."
			},
			"WYB Check-In #1": {
				estimatedTime: "1–2 sessions · 30–40 minutes each",
				keyBlocks: [
					"opinion book",
					"two reasons",
					"page order",
					"mechanics",
					"text-picture match"
				],
				flowNote:
					"Complete the opinion mini-book checkpoint even if the final project will be narrative. Accept drawing plus dictation, typed text, or handwriting when the opinion, reasons, order, and mechanics are visible."
			},
			"WYB6 Book Brainstorm II": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"character",
					"setting",
					"conflict",
					"solution",
					"beginning / middle / end"
				],
				flowNote:
					"Use a familiar story only as a structure model, then create an original character and conflict. Add both the story map and character sketch to the same book portfolio."
			},
			"WYB7 Subject-Verb Agreement": {
				estimatedTime: "1–2 sessions · 30–40 minutes each",
				keyBlocks: [
					"subject",
					"verb",
					"singular",
					"plural",
					"agreement revision"
				],
				flowNote:
					"Sort and explain agreement examples, then revise two portfolio sentences: one with a singular subject and one with a plural subject."
			},
			"WYB8 Word Choice": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"synonym",
					"context",
					"tone",
					"precise word",
					"before / after revision"
				],
				flowNote:
					"Compare similar words in context, then replace one vague word in the book draft. Keep the original and revised sentences so the change in tone is visible."
			},
			"WYB9 Narrative Writing": {
				estimatedTime: "3 sessions · 30–40 minutes each",
				keyBlocks: [
					"narrative model",
					"time-order word",
					"dialogue / description",
					"plot outline",
					"lesson"
				],
				flowNote:
					"Use a lawful classroom copy of Gabby Tries or an equivalent narrative before the model activity. Build the original story with a hand-drawn or text-only plot outline; no missing template is required."
			},
			"WYB Check-In #2": {
				estimatedTime: "1–2 sessions · 30–40 minutes each",
				keyBlocks: [
					"narrative spread",
					"character / conflict",
					"sequence",
					"word choice",
					"agreement / punctuation"
				],
				flowNote:
					"Complete one two-page narrative spread with connected text and picture notes. Accept drawing plus dictation, typing, or handwriting when the story event and revision evidence are clear."
			},
			"WYB10 Presentation Skills": {
				estimatedTime: "2 sessions · 30–40 minutes each",
				keyBlocks: [
					"voice",
					"pacing",
					"expression",
					"visual support",
					"rehearsal reflection"
				],
				flowNote:
					"Build the criteria list, rehearse a short excerpt from a lawful copy of Gabby Tries or the original book, and revise one delivery choice after a self-check."
			},
			"WYB11 Master Project": {
				estimatedTime: "4–6 sessions · 30–40 minutes each",
				keyBlocks: [
					"opinion or narrative path",
					"page sequence",
					"text-picture connection",
					"mechanics revision",
					"presentation"
				],
				flowNote:
					"Choose the opinion-book or narrative-book path, reuse the relevant checkpoint, assemble the smallest complete book first, and then revise mechanics, page order, illustrations, and presentation."
			}
		},
		sourceActivityAnchors: {
			"WYB1 Book Brainstorm I": [
				{
					title: "Favorite Ideas Opinion Board",
					prompt: "Draw or list favorite foods, places, and after-school activities, then identify which statements are opinions. Choose one opinion that could become a picture-book topic.",
					evidence: [
						"At least three favorite-topic sketches or notes.",
						"Plain-language definition of opinion using one example and one non-example.",
						"One opinion sentence with a matching picture idea that could support it."
					]
				},
				{
					title: "Opinion Book Seed",
					prompt: "Turn one favorite-topic opinion into a first book seed. The seed names the opinion, the audience, and one picture that would help the reader understand the point.",
					evidence: [
						"Opinion sentence that can become the center of a short book.",
						"Audience note naming who would enjoy or understand the topic.",
						"Support-picture sketch or description connected to the opinion."
					]
				}
			],
			"WYB2 Parts of Speech": [
				{
					title: "Parts of Speech Definition Map",
					prompt: "Create a map for nouns, adjectives, verbs, and adverbs. Include definitions, examples, and the difference between common nouns and proper nouns.",
					evidence: [
						"Definition for noun, adjective, verb, and adverb.",
						"Examples that show the difference between a common noun and proper noun with capitalization shown correctly.",
						"One sentence labeled with at least two parts of speech."
					]
				},
				{
					title: "Heads Up Word-Sort Game",
					prompt: "Use short answer cards such as favorite food, weekend activity, ideal pet, artist, and self-description to sort real words by part of speech.",
					evidence: [
						"Card list with at least ten single-word answers.",
						"Each selected card sorted as noun, proper noun, adjective, verb, or adverb.",
						"Revision note for one word that could fit more than one category depending on sentence context."
					]
				}
			],
			"WYB3 Capitalization": [
				{
					title: "Find the Capitalization Rule",
					prompt: "Begin with any capitalization rules already known, then study example sentences out loud, underline every capital letter, and infer the rules that explain the pattern. The activity ends by writing a clear rule list and using the rules to correct a new sentence, so capitalization is treated as evidence-based editing rather than memorizing an isolated list.",
					evidence: [
						"Starting rule list showing what was already known before the examples.",
						"Annotated examples with capital letters marked.",
						"Rule list for sentence beginnings, names, titles, places, and other proper nouns.",
						"One corrected sentence showing which capitalization rule was applied and why."
					]
				}
			],
			"WYB4 Commas & Quotation Marks": [
				{
					title: "Punctuation Treasure Hunt",
					prompt: "Solve punctuation puzzles by adding missing commas and quotation marks. Use the corrected sentences to build rules for lists, introductory phrases, and spoken dialogue.",
					evidence: [
						"Corrected versions of list sentences such as markers, pens, colored pencils, and a cutting machine.",
						"Corrected versions of dialogue sentences such as the zoo sentence and the hamburger request.",
						"Rule notes explaining when to use commas and when to use quotation marks."
					]
				},
				{
					title: "Comma and Quotation Rule Card",
					prompt: "Create a compact rule card that separates comma jobs from quotation-mark jobs and includes one original example for each.",
					evidence: [
						"Comma rule with an original list or opening-phrase example.",
						"Quotation-mark rule with an original dialogue example.",
						"One sentence revised after noticing a missing punctuation mark."
					]
				}
			],
			"WYB5 Opinion Writing": [
				{
					title: "Would You Rather Opinion Reasons",
					prompt: "Choose between two options, state an opinion, and support it with at least two reasons. Then write a new would-you-rather question and prepare reasons for one side.",
					evidence: [
						"Opinion answer with two supporting reasons.",
						"Original would-you-rather question with a chosen side.",
						"Reason note explaining how reasons differ from repeating the opinion."
					]
				},
				{
					title: "Opinion Paragraph Outline",
					prompt: "Brainstorm favorite foods, subjects, places, books, shows, movies, or animals, then outline an opinion paragraph with a topic sentence, two strong reasons, linking words, and a closing sentence.",
					evidence: [
						"Brainstorm list with several possible opinion topics.",
						"Outline naming the four parts of an opinion paragraph.",
						"Two strongest reasons circled or labeled before drafting."
					]
				}
			],
			"WYB Check-In #1": [
				{
					title: "Opinion Mini-Book Checkpoint",
					prompt: "Create a short opinion mini-book with a cover, opinion statement, two reason pages, and a closing page. Each page pairs words with a drawing or illustration note and applies the capitalization and punctuation rules practiced so far.",
					evidence: [
						"Cover and ordered page plan with a clear audience.",
						"Opinion statement, two distinct reasons, linking words, and a closing.",
						"Mechanics and text-picture check with at least one visible revision."
					]
				}
			],
			"WYB6 Book Brainstorm II": [
				{
					title: "Favorite Story Structure Review",
					prompt: "Pick a familiar story and summarize what happens in the beginning, middle, and end. Identify the conflict and how the conflict is solved.",
					evidence: [
						"Beginning, middle, and end notes for the selected story.",
						"Conflict sentence and solution sentence.",
						"Character sketch or description connected to the story events."
					]
				},
				{
					title: "Original Character and Conflict Seed",
					prompt: "Create an original character for a story picture book. Draw or describe the character, then write one possible conflict the character could face.",
					evidence: [
						"Original character name and visual or descriptive details.",
						"One-sentence conflict that can drive a beginning, middle, and end.",
						"Connection note explaining how the character and conflict fit together."
					]
				}
			],
			"WYB7 Subject-Verb Agreement": [
				{
					title: "Subject-Verb Ambassador Sort",
					prompt: "Write sentences, identify subjects and verbs, and separate singular-subject examples from plural-subject examples. Use the sorted examples to explain agreement.",
					evidence: [
						"At least one sentence with the subject circled or labeled and the verb underlined or labeled.",
						"Singular-subject and plural-subject examples with matching verbs.",
						"Explanation of how the verb choice was selected for one blank."
					]
				}
			],
			"WYB8 Word Choice": [
				{
					title: "Which Word Works Context Cases",
					prompt: "Compare synonym choices in short passages and choose the word that best fits the context. Use the cat, homework, and diary examples to explain how tone changes meaning.",
					evidence: [
						"Choice between beast, creature, and animal with a reason tied to the cat passage.",
						"Choice between excuse, reason, and explanation with a reason tied to the homework passage.",
						"Choice between nosy, curious, and inquisitive with a reason tied to the diary passage."
					]
				},
				{
					title: "Word Choice Reflection",
					prompt: "Write a short reflection explaining why synonyms are not always interchangeable. Include one original sentence where two similar words would create different effects.",
					evidence: [
						"Definition of word choice using context and tone.",
						"Original sentence pair showing how changing one word changes meaning.",
						"Revision note choosing the stronger word for the intended effect."
					]
				}
			],
			"WYB9 Narrative Writing": [
				{
					title: "Gabby Tries Narrative Map",
					prompt: "Use the story Gabby Tries to identify characters, setting, conflict, time-order words, dialogue, description, beginning, middle, end, and lesson.",
					evidence: [
						"Beginning, middle, and end notes for Gabby Tries.",
						"List of time-order words from the story.",
						"Character note with one dialogue example, one description example, and one sentence explaining the lesson."
					]
				},
				{
					title: "Brainstorm Bonanza Story Plan",
					prompt: "Generate several settings, characters, and conflicts, then choose the strongest combination and plan a story with a beginning, middle, end, and lesson.",
					evidence: [
						"Setting, character, and conflict brainstorm lists.",
						"Character entry with description and a sample line of dialogue.",
						"Story plan with beginning, middle, end, conflict, solution, and lesson."
					]
				},
				{
					title: "Picture Book Plot Diagram",
					prompt: "Use the course plot-diagram resource to organize the picture-book story idea. Fill in the major story parts and explain which narrative element each part represents.",
					evidence: [
						"Plot diagram draft for the original picture-book story.",
						"Labelled narrative elements such as character, setting, conflict, solution, and lesson.",
						"Revision note naming one missing or weak story part."
					]
				}
			],
			"WYB Check-In #2": [
				{
					title: "Narrative Picture-Book Spread Checkpoint",
					prompt: "Draft one connected two-page spread from the original story. Show a character responding to the conflict, use a time-order word, dialogue or description, and precise word choice, then revise agreement and punctuation.",
					evidence: [
						"Two-page text and illustration plan showing one connected story event.",
						"Character action, time-order language, and dialogue or description that advances the conflict.",
						"Before-and-after revision for word choice, subject-verb agreement, or punctuation."
					]
				}
			],
			"WYB10 Presentation Skills": [
				{
					title: "Strong Presentation Criteria",
					prompt: "Build a criteria list for strong presentation delivery. Use the list to evaluate a short practice reading and identify one concrete improvement.",
					evidence: [
						"Criteria list with voice, pacing, expression, posture or presence, and visual support.",
						"Practice note naming one criterion that worked and one criterion to improve.",
						"Improvement plan for the next reading."
					]
				},
				{
					title: "Dramatic Reading with Visual Backdrop",
					prompt: "Prepare a dramatic reading of Gabby Tries or an original story excerpt. Add two or three backdrop drawings, rehearse once, and check the reading against the presentation criteria.",
					evidence: [
						"Reading excerpt or selected story section.",
						"Two or three visual-backdrop sketches or descriptions.",
						"Self-check against the presentation criteria after rehearsal."
					]
				}
			],
			"WYB11 Master Project": [
				{
					title: "Picture Book Assembly Portfolio",
					prompt: "Assemble the final picture book from the course work. The book can be an opinion book or a story book, but it needs a clear central idea, organized pages, text-picture connection, mechanics revision, and presentation plan.",
					evidence: [
						"Book plan naming opinion-book or story-book format.",
						"Draft pages with text and matching illustration notes.",
						"Revision checklist covering capitalization, punctuation, word choice, page order, and presentation readiness."
					]
				}
			]
		},
		modules: [
			"WYB1 Book Brainstorm I",
			"WYB2 Parts of Speech",
			"WYB3 Capitalization",
			"WYB4 Commas & Quotation Marks",
			"WYB5 Opinion Writing",
			"WYB Check-In #1",
			"WYB6 Book Brainstorm II",
			"WYB7 Subject-Verb Agreement",
			"WYB8 Word Choice",
			"WYB9 Narrative Writing",
			"WYB Check-In #2",
			"WYB10 Presentation Skills",
			"WYB11 Master Project"
		]
	}),
	publicSpeaking: createSourceLibraryCourse({
		name: "Make Your Point: Introduction to Public Speaking",
		area: "public speaking",
		focus: "introductions, toast structure, speechwriting, keynote organization, storytelling, radio pitches, argument defense, comedy timing, and polished talk delivery",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"MYP1 Personal Introductions": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"audience",
					"opening / main points / closing",
					"specific detail",
					"pacing",
					"revision reflection"
				],
				flowNote:
					"Students may introduce themselves, a fictional persona, or another real or fictional person and never need to disclose sensitive personal information. Live, private recorded, or audio-only delivery is valid."
			},
			"MYP2 Toastmaker": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"honoree",
					"occasion / audience",
					"meaningful detail",
					"conversational tone",
					"closing sentiment"
				],
				flowNote:
					"Choose a real, fictional, or group honoree, build from notes rather than memorization, and revise one tone or pacing choice after a private rehearsal."
			},
			"MYP3 Speechwriter": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"purpose",
					"audience",
					"central claim",
					"organized main points",
					"evidence / closing"
				],
				flowNote:
					"Use the audience-centered speech as the bridge from short ceremonial speaking to longer performances. Draft the smallest complete speech, test the order aloud, and revise for clarity before delivery polish."
			},
			"MYP4 Keynote Speaker": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"through-line",
					"annotated outline",
					"emphasis",
					"gesture / posture",
					"visual support"
				],
				flowNote:
					"Keep one central through-line, annotate only meaningful delivery moments, and rehearse first without visuals so slides or backdrops support rather than replace the speaker."
			},
			"MYP5 Storyteller": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"hook",
					"scene sequence",
					"turning point",
					"lesson / point",
					"conversational delivery"
				],
				flowNote:
					"Students may use a true, adapted, or fictionalized story and do not need to disclose private experiences. Build one clear scene and turning point before adding detail. Live, private recorded, or audio-only delivery is valid."
			},
			"MYP6 Radio Pitch": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"target audience",
					"claim",
					"strongest reasons",
					"time limit",
					"feedback revision"
				],
				flowNote:
					"Plan for a specific audience, lead with the recommendation, and keep only details that support it. Compare the first and second delivery after one focused feedback pass."
			},
			"MYP7 Defense Attorney": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"claim",
					"evidence",
					"counterargument",
					"response",
					"closing statement"
				],
				flowNote:
					"Treat the courtroom format as structured argument practice, distinguish examples from verified evidence, and represent the counterargument fairly before responding."
			},
			"MYP8 Stand-up Comedian": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"setup / payoff",
					"sequence",
					"transition",
					"timing",
					"audience-safe revision"
				],
				flowNote:
					"Keep comedy classroom-safe: no targeting classmates, protected traits, private information, trauma, or humiliation. A humorous story, observational routine, or fictional character routine is equally valid, and private delivery is acceptable."
			},
			"MYP9 Master Project: Your TED-Ed Talk": {
				estimatedTime: "4–6 sessions · 40–50 minutes each",
				keyBlocks: [
					"idea / through-line",
					"supporting story or argument",
					"visual aid",
					"rehearsal cycle",
					"copyright-safe portfolio"
				],
				flowNote:
					"Create a TED-style classroom talk with no claim of TED or TED-Ed affiliation. Public posting is optional; live, private recorded, or audio-supported delivery is valid."
			}
		},
		sourceActivityAnchors: {
			"MYP1 Personal Introductions": [
				{
					title: "Two-Minute Self Introduction",
					prompt: "Prepare and deliver a two-minute introduction that includes basic identity details, background, and a few specific interests or experiences. Treat the introduction as a mini-speech with an opening, main points, and a closing summary.",
					evidence: [
						"Outline that separates opening, main points, and closing summary.",
						"Delivery notes for confidence, pacing, and reduced filler words such as like and um.",
						"Reflection comparing the first version with a revised version."
					]
				},
				{
					title: "Introduce Another Person",
					prompt: "Create a short introduction for another real or fictional person. Include a visual support plan, the details that define who the person is, and the tone that fits the audience.",
					evidence: [
						"Profile notes naming the person's background, interests, and one memorable detail.",
						"Visual support sketch or description that reinforces the introduction without replacing the speaker.",
						"Delivery checklist for confident voice, clear structure, and controlled filler words."
					]
				}
			],
			"MYP2 Toastmaker": [
				{
					title: "Toast Outline and Delivery Notes",
					prompt: "Turn a toast outline into a short performance plan. The speech honors a person or group, keeps a conversational tone, and uses notes rather than a word-for-word script.",
					evidence: [
						"Toast outline with opening, meaningful details, and closing sentiment.",
						"Eye-contact cues placed at important moments in the outline.",
						"Revision note explaining how tone, pacing, or eye contact changed after rehearsal."
					]
				}
			],
			"MYP3 Speechwriter": [
				{
					title: "Audience-Centered Three-Part Speech",
					prompt: "Choose a low-stakes topic and a specific audience, then draft a speech with an opening hook, two or three organized main points, supporting examples or evidence, transitions, and a closing that returns to the central claim.",
					evidence: [
						"Purpose and audience statement plus one clear central claim.",
						"Three-part outline with transitions and support for each main point.",
						"Read-aloud revision note identifying one order, clarity, or timing change."
					]
				}
			],
			"MYP4 Keynote Speaker": [
				{
					title: "Annotated Keynote Performance",
					prompt: "Prepare a keynote speech from an annotated outline. Mark places for emphasis, gestures, enacted phrases, pacing, enunciation, and open posture.",
					evidence: [
						"Annotated outline with two emphasis cues and one enacted-gesture cue.",
						"Visual theme or slide/backdrop plan connected to the speech topic.",
						"Rehearsal note naming one pacing change, one clarity change, and one body-language change."
					]
				}
			],
			"MYP5 Storyteller": [
				{
					title: "Personal Narrative Performance",
					prompt: "Build a true, adapted, or fictionalized story performance from a narrative outline. The performance uses a hook, a clear sequence of events, a lesson or point, and conversational delivery from notes.",
					evidence: [
						"Narrative outline with hook, key scene, conflict or turning point, and ending lesson.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Delivery reflection on whether the story sounded conversational rather than read aloud."
					]
				}
			],
			"MYP6 Radio Pitch": [
				{
					title: "Five-Minute Media Pitch",
					prompt: "Pitch a TV show or movie as the best choice for a specific audience. Limit the pitch to five minutes, organize the main details quickly, and revise the delivery after one feedback pass.",
					evidence: [
						"Three-minute planning outline with the title, audience, main claim, and strongest details.",
						"Pitch structure with opening hook, reasons, examples, and closing recommendation.",
						"Before-and-after note explaining what changed in the second delivery."
					]
				}
			],
			"MYP7 Defense Attorney": [
				{
					title: "Happiness v. Money Case Argument",
					prompt: "Use the case question 'Can money buy happiness?' to prepare a courtroom-style argument. Build a claim, supporting evidence, counterargument, and closing statement for one side of the case.",
					evidence: [
						"Three pieces of evidence that support the chosen side.",
						"Counterargument with a concise response supported by two reasons.",
						"Closing statement that summarizes the argument and includes delivery notes for eye contact, pacing, enunciation, gestures, and posture."
					]
				}
			],
			"MYP8 Stand-up Comedian": [
				{
					title: "Stand-Up Routine Performance",
					prompt: "Draft and perform a four-to-five-minute stand-up routine from an outline. Keep the tone conversational, mark gesture and eye-contact cues, and rehearse enough to speak from memory rather than reading line by line.",
					evidence: [
						"Routine outline with setup, joke sequence, transitions, and closing beat.",
						"Two eye-contact cues and two gesture or emphasis cues.",
						"Rehearsal note describing timing, filler-word control, and whether the routine landed clearly."
					]
				}
			],
			"MYP9 Master Project: Your TED-Ed Talk": [
				{
					title: "Ideas Worth Spreading Analysis",
					prompt: "Analyze TED-Ed-style talks for through-line, body language, visual aids, emotional effect, and the qualities that make an idea worth spreading.",
					evidence: [
						"Notes from several talks naming through-line, gestures, visual aids, and audience effect.",
						"Pattern list of qualities shared by strong ideas worth spreading.",
						"Draft criteria for choosing a personal talk topic."
					]
				},
				{
					title: "TED-Style Talk Portfolio",
					prompt: "Prepare a polished talk with a central idea, supporting stories or arguments, visual aids, rehearsal plan, delivery notes, and production-quality checklist.",
					evidence: [
						"Talk script or outline with through-line, supporting sections, and closing idea.",
						"Visual-aid plan that highlights points without carrying the whole message.",
						"Production checklist covering landscape framing, clear lighting, audible sound, clean edits, file format, and copyright-safe materials."
					]
				}
			]
		},
		modules: [
			"MYP1 Personal Introductions",
			"MYP2 Toastmaker",
			"MYP3 Speechwriter",
			"MYP4 Keynote Speaker",
			"MYP5 Storyteller",
			"MYP6 Radio Pitch",
			"MYP7 Defense Attorney",
			"MYP8 Stand-up Comedian",
			"MYP9 Master Project: Your TED-Ed Talk"
		]
	}),
	middleSchoolLiterature: createSourceLibraryCourse({
		name: "Middle School A: Reading and Analyzing Literature",
		area: "literary analysis",
		focus: "main ideas, supporting evidence, inference, showing versus telling, theme, point of view, word choice, rhyme, alliteration, figurative language, and final analysis writing",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"MSA1 Main Ideas & Supporting Evidence I": {
				estimatedTime: "3 sessions · 40–50 minutes each",
				keyBlocks: [
					"topic / main idea",
					"supporting detail",
					"too broad / too narrow",
					"quotation / paraphrase",
					"evidence link"
				],
				flowNote:
					"Use the prank only as a fictional planning model and never carry it out. Read the supplied original Kyra's Fear practice passage, then distinguish the main idea from details that support it."
			},
			"MSA2 Main Ideas & Supporting Evidence II": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"just-right main idea",
					"impactful evidence",
					"detailed evidence",
					"concise evidence",
					"evidence comparison"
				],
				flowNote:
					"Use the supplied original Soccer Summer practice passage. Select evidence by comparing it with weaker alternatives and explain why each chosen detail is the better support."
			},
			"MSA3 Making Inferences": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"text clue",
					"background knowledge",
					"inference",
					"reasoning link",
					"alternate inference"
				],
				flowNote:
					"Use the supplied original Car Ride practice passage. Separate what the text states from what is inferred, cite at least two clues, and test one plausible alternative interpretation."
			},
			"MSA4 Show; Don't Tell": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"action",
					"dialogue",
					"sensory detail",
					"inference",
					"before / after revision"
				],
				flowNote:
					"Begin with a direct telling sentence, revise it through observable details, and annotate which details allow the reader to infer the intended feeling or situation."
			},
			"MSA Check-In #1": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"main idea",
					"supporting evidence",
					"inference",
					"show / tell",
					"self-assessment"
				],
				flowNote:
					"Use The Missing Page to collect separate evidence for all four skills. Assign review only for a missing or unsupported skill."
			},
			"MSA5 Identifying Themes": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"topic",
					"main idea",
					"theme statement",
					"character change",
					"plot evidence"
				],
				flowNote:
					"Sort summary statements from larger messages, write theme as a complete transferable idea, and support it with character change or conflict evidence."
			},
			"MSA6 Analyzing & Developing Themes": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"character quality",
					"choice / consequence",
					"theme development",
					"plot evidence",
					"analysis link"
				],
				flowNote:
					"Use The Lantern Workshop. Trace one character choice through its consequence and explain how that pattern develops the theme."
			},
			"MSA7 Analyzing Point of View": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"narrator",
					"pronoun",
					"knowledge access",
					"point-of-view type",
					"reader effect"
				],
				flowNote:
					"Label point of view from narrator access rather than pronouns alone, then compare the supplied library-key scenes to explain how a rewrite changes sympathy, suspense, humor, theme, or tone."
			},
			"MSA8 Analyzing Words & Phrases": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"denotation",
					"connotation",
					"positive / neutral / negative",
					"tone",
					"word-choice revision"
				],
				flowNote:
					"Compare words with similar dictionary meanings, locate the emotional association in context, and preserve a before-and-after sentence showing the change in tone."
			},
			"MSA9 Analyzing Rhyme & Alliteration": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"rhyme",
					"alliteration",
					"sound pattern",
					"emphasis",
					"meaning / mood"
				],
				flowNote:
					"Use the supplied original After the Storm poem, mark only clear sound patterns, and explain what the repeated sounds emphasize rather than stopping at identification."
			},
			"MSA10 Analyzing Figurative Language": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"simile / metaphor",
					"literal / figurative",
					"word choice",
					"sound",
					"meaning / tone paragraph"
				],
				flowNote:
					"Annotate one short accessible passage for word, sound, and figurative choices, then combine the observations into one claim-driven paragraph about meaning or tone."
			},
			"MSA Check-In #2": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"theme",
					"point of view",
					"connotation",
					"sound / figurative language",
					"integrated analysis"
				],
				flowNote:
					"Use The Shared Repair for an integrated analysis. The paragraph must connect at least two craft choices to one interpretation."
			},
			"MSA11 Master Project": {
				estimatedTime: "3–4 sessions · 40–50 minutes each",
				keyBlocks: [
					"copyright-safe image",
					"point of view",
					"theme / character action",
					"intentional craft",
					"analysis reflection"
				],
				flowNote:
					"Use The Last Platform image and its text description, or choose another original, public-domain or classroom-provided image. Create a fictional piece, then analyze how its craft choices guide interpretation."
			}
		},
		sourceActivityAnchors: {
			"MSA1 Main Ideas & Supporting Evidence I": [
				{
					title: "Lead Prankster Main Idea Model",
					prompt: "Plan a fictional harmless class-prank scenario as a source model without carrying it out: list three or four specific details, then convert those details into a one- or two-sentence general plan. The general plan functions as the main idea, while the specific details function as supporting evidence.",
					evidence: [
						"A detail list naming the actors, setting, materials, sequence, or intended result.",
						"A short general plan that is broader than any one detail but still specific enough to summarize the scenario.",
						"A one-sentence explanation of how the details support the general plan."
					]
				},
				{
					title: "Kyra's Fear Main Idea and Evidence",
					prompt: "Read the supplied original Kyra's Fear practice passage and choose a just-right main idea that is neither too broad nor too narrow. Separate the strongest main-idea sentence from evidence about the spider, the reaction to the hair movement, and Kyra's fear.",
					evidence: [
						"One main-idea sentence about the passage as a whole.",
						"Two or more quoted or paraphrased details connected to the main idea.",
						"A short note explaining why a detail is evidence rather than another main idea."
					]
				}
			],
			"MSA2 Main Ideas & Supporting Evidence II": [
				{
					title: "Soccer Summer Best Evidence Sort",
					prompt: "Read the supplied original Soccer Summer practice passage, write a one- or two-sentence main idea, then choose the two most impactful, detailed, and concise pieces of evidence. Compare the chosen evidence against less useful details so the final support is deliberate rather than random.",
					evidence: [
						"A concise main idea for the Soccer Summer passage.",
						"Two selected quotes or paraphrases from the passage.",
						"A comparison note explaining why each selected detail is stronger than an unused alternative."
					]
				}
			],
			"MSA3 Making Inferences": [
				{
					title: "Car Ride Inference Record",
					prompt: "Use the supplied smoke-and-grill example to define inference, then read the original Car Ride practice passage and infer Kazim's mood from textual clues such as counting Mississippi seconds, sighing, losing phone access, repeating questions, and ignoring the atlas.",
					evidence: [
						"An inference about Kazim's mood or attitude during the trip.",
						"At least two textual clues that make the inference reasonable.",
						"A reasoning sentence that connects each clue to the conclusion."
					]
				}
			],
			"MSA4 Show; Don't Tell": [
				{
					title: "Show-Don't-Tell Paragraph Draft",
					prompt: "Write or revise a paragraph that hints at a feeling, setting, relationship, or conflict through concrete actions, dialogue, sensory details, and description instead of naming the idea directly.",
					evidence: [
						"A before-and-after pair or a revised paragraph with the direct label removed.",
						"Concrete details that reveal the intended feeling or idea through inference.",
						"A short annotation naming what the paragraph reveals without directly stating it."
					]
				}
			],
			"MSA Check-In #1": [
				{
					title: "Reading Literature Check-In Record",
					prompt: "Use the supplied original The Missing Page passage to demonstrate main idea, supporting evidence, inference, and showing-versus-telling. Keep the skill evidence separate from any self-assessment notes.",
					evidence: [
						"A main idea supported by at least two specific details.",
						"An inference supported by textual or descriptive clues.",
						"A show-versus-tell revision or explanation."
					]
				}
			],
			"MSA5 Identifying Themes": [
				{
					title: "Theme Versus Main Idea Sort",
					prompt: "Compare main idea and theme by sorting statements into plot summaries and larger messages. Then infer one theme from a passage by using character change, conflict, and plot evidence.",
					evidence: [
						"Sorted examples that distinguish a passage summary from a broader theme.",
						"One theme written as a complete idea rather than a single topic word.",
						"Evidence showing how the plot or character choices develop that theme."
					]
				}
			],
			"MSA6 Analyzing & Developing Themes": [
				{
					title: "Characters and Themes Analysis",
					prompt: "Analyze how character actions and qualities develop a theme in the supplied original The Lantern Workshop scene. Compare Neri's and Sela's choices and their consequences. A classroom edition of Cinderella may be an additional comparison when its version and evidence are identified.",
					evidence: [
						"A character trait or action connected to a theme.",
						"Evidence from the plot showing the consequence of that trait or action.",
						"A short explanation of how the character evidence develops the larger message."
					]
				}
			],
			"MSA7 Analyzing Point of View": [
				{
					title: "Point of View Effects Lab",
					prompt: "Identify first person, second person, third person objective, third person limited, and third person omniscient narration in the five supplied library-key scenes. Compare two versions, then retell the moment from Mina's first-person perspective to observe changes in theme, suspense, humor, sympathy, or tone.",
					evidence: [
						"Point-of-view labels with evidence from pronouns, narrator access, or knowledge limits.",
						"A rewritten or compared passage that changes the narrator's perspective.",
						"A note describing how the new perspective changes reader interpretation."
					]
				}
			],
			"MSA8 Analyzing Words & Phrases": [
				{
					title: "Connotation Nation Word Choice Record",
					prompt: "Distinguish denotation from connotation by comparing words with similar dictionary meanings but different emotional force. Use the comparison to explain how word choice changes tone and reader response.",
					evidence: [
						"Pairs or groups of related words with neutral, positive, or negative connotations.",
						"One sentence revised with a different connotation.",
						"An explanation of how the revised word changes tone or reader response."
					]
				}
			],
			"MSA9 Analyzing Rhyme & Alliteration": [
				{
					title: "Sound Pattern Annotation",
					prompt: "Read the supplied original After the Storm poem aloud and listen for conspicuous rhyme and alliteration. Mark each sound pattern and explain why the author may have drawn attention to those specific words.",
					evidence: [
						"Marked rhyming words and alliterative word groups.",
						"A sentence explaining what the repeated sounds emphasize.",
						"A note connecting the sound pattern to mood, meaning, humor, or rhythm."
					]
				}
			],
			"MSA10 Analyzing Figurative Language": [
				{
					title: "Analysis Toolbox Paragraph",
					prompt: "Use After the Storm and its supplied simile revision to identify similes, metaphors, and other figurative language, then combine word choice, sound-pattern, and figurative-language observations into a paragraph about meaning and tone.",
					evidence: [
						"At least one simile, metaphor, or figurative phrase identified accurately.",
						"Notes on word choice, sound, and figurative meaning.",
						"A short analysis paragraph explaining how those choices shape meaning or tone."
					]
				}
			],
			"MSA Check-In #2": [
				{
					title: "Analyzing Literature Check-In Record",
					prompt: "Use the supplied original The Shared Repair poem to demonstrate theme, character-theme relationship, point of view, connotation, rhyme, alliteration, figurative language, and a final analysis paragraph about meaning and tone.",
					evidence: [
						"Annotations for theme, character evidence, point of view, word choice, sound, and figurative language.",
						"A paragraph that combines multiple craft observations instead of listing them separately.",
						"A self-check naming the strongest evidence and one area needing more support."
					]
				}
			],
			"MSA11 Master Project": [
				{
					title: "Writing from an Image Literature Showcase",
					prompt: "Use the supplied original The Last Platform image or its text description, or choose another original, public-domain, or otherwise copyright-safe image. Write a fictional literary piece that intentionally uses point of view, theme, character action, word choice, sound, and figurative language. Do not infer facts about real people shown in an image. Add a brief analysis explaining how the craft choices shape interpretation.",
					evidence: [
						"An original short piece inspired by an image.",
						"Visible use of point of view, theme development, word choice, sound, or figurative language.",
						"A short reflection connecting craft choices to reader interpretation."
					]
				}
			]
		},
		modules: [
			"MSA1 Main Ideas & Supporting Evidence I",
			"MSA2 Main Ideas & Supporting Evidence II",
			"MSA3 Making Inferences",
			"MSA4 Show; Don't Tell",
			"MSA Check-In #1",
			"MSA5 Identifying Themes",
			"MSA6 Analyzing & Developing Themes",
			"MSA7 Analyzing Point of View",
			"MSA8 Analyzing Words & Phrases",
			"MSA9 Analyzing Rhyme & Alliteration",
			"MSA10 Analyzing Figurative Language",
			"MSA Check-In #2",
			"MSA11 Master Project"
		]
	}),
	middleSchoolWriting: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing",
		area: "writing",
		focus: "arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"MSB1 Arguments & Evidence": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"debatable claim",
					"reasoning",
					"evidence",
					"claim-evidence link",
					"audience"
				],
				flowNote:
					"Use the supplied debate topics only as writing prompts; no social-platform account or posting is required. Distinguish a claim, reasons, and evidence before drafting the paragraph."
			},
			"MSB2 Counterclaims": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"claim",
					"counterclaim",
					"conditional language",
					"contrast transition",
					"fair representation"
				],
				flowNote:
					"Build the strongest reasonable opposing position, mark it with clear transition language, and explain why addressing it improves rather than weakens the original argument."
			},
			"MSB3 Integrating Evidence": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"source context",
					"introductory phrase",
					"colon",
					"comma",
					"quotation integration"
				],
				flowNote:
					"Use the supplied original excerpts to practice both quotation-integration patterns, then check that the surrounding sentence remains grammatical and understandable."
			},
			"MSB4 Analyzing Evidence": {
				estimatedTime: "3 sessions · 45–55 minutes each",
				keyBlocks: [
					"inference claim",
					"integrated evidence",
					"how / why analysis",
					"opposing interpretation",
					"paragraph revision"
				],
				flowNote:
					"Use the supplied original Car Ride practice passage or another identified text. Draft the main interpretation, test a credible opposing interpretation, then revise the analysis."
			},
			"MSB5 Concluding Statements & Transitional Devices": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"concluding statement",
					"fresh restatement",
					"extension",
					"transition relationship",
					"flow revision"
				],
				flowNote:
					"Revise one existing argument so transitions name the relationship between ideas and the conclusion restates without copying, then extends the argument."
			},
			"MSB6 Color Coding & Revision": {
				estimatedTime: "2–3 sessions · 45–55 minutes each",
				keyBlocks: [
					"claim / reason",
					"evidence / analysis",
					"counterclaim",
					"transition / conclusion",
					"revision diagnosis"
				],
				flowNote:
					"Use colors, labels, symbols, underlines, or tags so the activity never depends on color vision. Diagnose a missing, repeated, unsupported, or misplaced part before revising."
			},
			"MSB Check-In #1": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"claim / reasoning",
					"evidence integration",
					"analysis",
					"counterclaim",
					"revision record"
				],
				flowNote:
					"Produce one complete analytical paragraph or plan with visible evidence and a revision record. Use missing evidence to choose targeted review before starting fiction."
			},
			"MSB7 Character Development": {
				estimatedTime: "3 sessions · 45–55 minutes each",
				keyBlocks: [
					"objective",
					"choice",
					"action / speech",
					"character quality",
					"cause-and-effect flow"
				],
				flowNote:
					"Use the supplied text-only character chain or a specified familiar story, then create an original objective. Trace it through choices, actions, speech, and supported qualities."
			},
			"MSB8 Character Portraits": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"objective",
					"backstory",
					"motivation",
					"contradiction",
					"scene-ready detail"
				],
				flowNote:
					"Build more character knowledge than the story will state, then select only details that can shape a scene. Keep one visible detail and one below-the-surface motivation."
			},
			"MSB9 Generating Conflict & Structuring Plot": {
				estimatedTime: "3 sessions · 45–55 minutes each",
				keyBlocks: [
					"objective",
					"obstacle / conflict",
					"beginning / middle / end",
					"tension",
					"plot revision"
				],
				flowNote:
					"Generate conflict from the character objective, then use the supplied stage table or a hand-drawn plot curve. Verify that each major event changes the objective, obstacle, or stakes."
			},
			"MSB10 Manipulating Point of View": {
				estimatedTime: "2–3 sessions · 45–55 minutes each",
				keyBlocks: [
					"narrator",
					"knowledge access",
					"point-of-view type",
					"scene rewrite",
					"reader effect"
				],
				flowNote:
					"Use the supplied original Jonah and Caleb examples or an original scene. Identify narrator access and rewrite from another point of view to compare sympathy, suspense, humor, or tone."
			},
			"MSB11 Writing an Original Short Story": {
				estimatedTime: "4–6 sessions · 45–55 minutes each",
				keyBlocks: [
					"protagonist / objective",
					"conflict / plot",
					"point of view",
					"theme / figurative language",
					"revision evidence"
				],
				flowNote:
					"Draft the smallest complete story first, then revise one craft layer at a time. Fictionalized material is valid, and no one needs to disclose private experiences."
			},
			"MSB Check-In #2": {
				estimatedTime: "2 sessions · 45–55 minutes each",
				keyBlocks: [
					"character objective",
					"conflict / plot",
					"point of view",
					"story craft",
					"before / after revision"
				],
				flowNote:
					"Submit one scene or excerpt plus its planning and before-and-after revision evidence. Use the missing craft evidence to select review before the master project."
			},
			"MSB12 Master Project": {
				estimatedTime: "3–4 sessions · 45–55 minutes each",
				keyBlocks: [
					"project path",
					"course artifacts",
					"audience structure",
					"presentation support",
					"rehearsal / revision"
				],
				flowNote:
					"Complete the path-and-evidence plan, then choose one presentation. Live, private recorded, audio-supported, or one-to-one delivery is valid; public posting is not required."
			}
		},
		sourceActivityAnchors: middleSchoolBWritingSourceAnchors,
		modules: [
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project"
		]
	}),
	middleSchoolWritingRetake: createSourceLibraryCourse({
		name: "Middle School B: Analytical and Creative Writing Retake",
		area: "writing reinforcement",
		focus: "targeted review of arguments, evidence, counterclaims, evidence analysis, transitions, revision, character development, conflict, plot, point of view, and short-story drafting",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"MSB Retake Entry Diagnostic": {
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"independent baseline",
					"argument sample",
					"fiction sample",
					"skill evidence",
					"ready / review / rebuild map"
				],
				flowNote:
					"Complete the baseline before opening review modules. Mark a skill ready only when the sample contains visible evidence; use review or rebuild to select the smallest useful retake path."
			},
			"MSB1 Arguments & Evidence": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"debatable claim",
					"reason",
					"evidence",
					"claim-evidence link",
					"fresh example"
				],
				flowNote:
					"Choose this review only when the diagnostic lacks a debatable claim, distinct reasoning, or connected evidence. Use a fresh topic and compare the result with the entry sample."
			},
			"MSB2 Counterclaims": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"claim",
					"credible counterclaim",
					"contrast transition",
					"response",
					"fair representation"
				],
				flowNote:
					"Choose this review when the opposition is missing or weak. Build the strongest reasonable counterclaim, respond with evidence, and compare it with the entry version."
			},
			"MSB3 Integrating Evidence": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"context",
					"introductory phrase",
					"colon / comma",
					"quotation",
					"sentence flow"
				],
				flowNote:
					"Choose this review when quotations are dropped into the paragraph or punctuated incorrectly. Use a fresh lawful excerpt and preserve a before-and-after integration."
			},
			"MSB4 Analyzing Evidence": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"inference claim",
					"evidence",
					"how / why analysis",
					"alternative reading",
					"revision"
				],
				flowNote:
					"Choose this review when the entry sample quotes evidence without explaining it. Use a fresh lawful passage and add analysis that connects the detail to the claim."
			},
			"MSB5 Concluding Statements & Transitional Devices": {
				conceptLearningPath: "choice",
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"transition relationship",
					"paragraph flow",
					"fresh restatement",
					"extension",
					"revision trace"
				],
				flowNote:
					"Choose this review when ideas feel disconnected or the conclusion simply repeats the claim. Revise one paragraph and annotate what each transition and conclusion sentence contributes."
			},
			"MSB6 Color Coding & Revision": {
				conceptLearningPath: "choice",
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"argument-part labels",
					"missing / repeated part",
					"unsupported part",
					"order",
					"revision diagnosis"
				],
				flowNote:
					"Choose this review when the argument structure is difficult to diagnose. Use colors, labels, symbols, underlines, or tags, then revise the specific pattern the markup reveals."
			},
			"MSB Check-In #1": {
				conceptLearningPath: "choice",
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"claim / evidence",
					"analysis",
					"counterclaim",
					"transitions / conclusion",
					"before / after comparison"
				],
				flowNote:
					"This checkpoint follows any argument modules selected by the diagnostic. Compare the revised argument directly with the entry sample before marking argument skills ready."
			},
			"MSB7 Character Development": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"objective",
					"choice",
					"action / speech",
					"character quality",
					"fresh character"
				],
				flowNote:
					"Choose this review when the entry character lacks a clear objective or supported qualities. Create a fresh character and trace objective through choices, actions, and speech."
			},
			"MSB8 Character Portraits": {
				conceptLearningPath: "choice",
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"objective",
					"backstory",
					"motivation",
					"contradiction",
					"scene-ready detail"
				],
				flowNote:
					"Choose this review when the character feels flat or overexplained. Build a fresh portrait, then select only the details that can shape an actual scene."
			},
			"MSB9 Generating Conflict & Structuring Plot": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"objective / obstacle",
					"conflict",
					"event sequence",
					"tension",
					"plot revision"
				],
				flowNote:
					"Choose this review when events do not grow from the objective and conflict. Use a hand-drawn or text-only plot curve and compare the revised structure with the entry sample."
			},
			"MSB10 Manipulating Point of View": {
				conceptLearningPath: "choice",
				estimatedTime: "1–2 sessions · 45–55 minutes each",
				keyBlocks: [
					"narrator",
					"knowledge access",
					"point-of-view type",
					"rewrite",
					"reader effect"
				],
				flowNote:
					"Choose this review when narrator access is inconsistent or its effect is unexplained. Rewrite a fresh scene from another point of view and compare reader impact."
			},
			"MSB11 Writing an Original Short Story": {
				conceptLearningPath: "choice",
				estimatedTime: "2–3 sessions · 45–55 minutes each",
				keyBlocks: [
					"complete story arc",
					"objective / conflict",
					"point of view",
					"intentional craft",
					"revision evidence"
				],
				flowNote:
					"Choose this review when several fiction skills must be integrated. Draft a new compact story rather than polishing the entry sample beyond recognition, then compare the two."
			},
			"MSB Check-In #2": {
				conceptLearningPath: "choice",
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"character",
					"conflict / plot",
					"point of view",
					"craft",
					"before / after comparison"
				],
				flowNote:
					"This checkpoint follows the fiction modules selected by the diagnostic. Compare the revised scene with the entry sample before marking fiction skills ready."
			},
			"MSB12 Master Project": {
				conceptLearningPath: "choice",
				estimatedTime: "2–3 sessions · 45–55 minutes each",
				keyBlocks: [
					"presentation path",
					"recovered skills",
					"course artifacts",
					"audience",
					"rehearsal / revision"
				],
				flowNote:
					"Use the master project only when a presentation is useful evidence for the remaining gap. Choose one path; private, recorded, audio-supported, or one-to-one delivery is valid."
			},
			"MSB Retake Exit Evidence": {
				estimatedTime: "1 session · 45–55 minutes",
				keyBlocks: [
					"entry / exit comparison",
					"targeted revisions",
					"recovered skill evidence",
					"remaining gap",
					"next step"
				],
				flowNote:
					"Compare only the skills marked review or rebuild at entry. Cite before-and-after evidence, mark each target ready only when the revision demonstrates it, and record a precise next step for any remaining gap."
			}
		},
		sourceActivityAnchors: middleSchoolBWritingRetakeSourceAnchors,
		modules: [
			"MSB Retake Entry Diagnostic",
			"MSB1 Arguments & Evidence",
			"MSB2 Counterclaims",
			"MSB3 Integrating Evidence",
			"MSB4 Analyzing Evidence",
			"MSB5 Concluding Statements & Transitional Devices",
			"MSB6 Color Coding & Revision",
			"MSB Check-In #1",
			"MSB7 Character Development",
			"MSB8 Character Portraits",
			"MSB9 Generating Conflict & Structuring Plot",
			"MSB10 Manipulating Point of View",
			"MSB11 Writing an Original Short Story",
			"MSB Check-In #2",
			"MSB12 Master Project",
			"MSB Retake Exit Evidence"
		]
	}),
	grammarMechanics: createSourceLibraryCourse({
		name: "Middle School C: Grammar and Mechanics",
		area: "grammar",
		focus: "parts of speech, capitalization, punctuation, phrases, clauses, subjects, predicates, objects, sentence types, and mechanics revision",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"MSC1 Nouns, Pronouns & Adjectives": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"noun / proper noun",
					"pronoun / antecedent",
					"adjective",
					"agreement",
					"sentence annotation"
				],
				flowNote:
					"Begin a cumulative edit log with definitions, labeled examples, and one pronoun-agreement repair. Use supplied or original sentences and keep the before-and-after version."
			},
			"MSC2 Verbs, Adverbs & Verbals": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"verb",
					"adverb",
					"gerund",
					"participle",
					"infinitive"
				],
				flowNote:
					"Identify the action or state first, then explain how adverbs modify it and how each verbal functions in its sentence. Add one corrected or revised example to the edit log."
			},
			"MSC3 Prepositions & Interjections": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"preposition",
					"object of preposition",
					"prepositional phrase",
					"interjection",
					"punctuation effect"
				],
				flowNote:
					"Separate relationship words and their phrase objects from words expressing sudden feeling, then add one original combined example to the cumulative log."
			},
			"MSC4 Coordinating & Subordinating Conjunctions": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"FANBOYS",
					"subordinating conjunction",
					"independent / dependent",
					"compound / complex",
					"comma rule"
				],
				flowNote:
					"Join equal ideas and dependent ideas in separate examples, label clause roles, and connect each comma decision to the sentence structure rather than to a pause."
			},
			"MSC Check-In #1": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"parts of speech",
					"agreement",
					"verbals",
					"phrases",
					"conjunction structure"
				],
				flowNote:
					"Complete the concept record and one application passage. Use missing or mislabeled evidence to select review before beginning mechanics."
			},
			"MSC5 Capitalization": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"sentence start",
					"proper noun",
					"title / heading",
					"pronoun I",
					"rule label"
				],
				flowNote:
					"Name the capitalization rule before correcting each example and add one before-and-after passage sentence to the cumulative edit log."
			},
			"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks":
				{
					estimatedTime: "2 sessions · 40–50 minutes each",
					keyBlocks: [
						"sentence purpose",
						"end mark",
						"quotation marks",
						"dialogue punctuation",
						"speaker words"
					],
					flowNote:
						"Choose end marks from sentence purpose, keep quoted words and dialogue punctuation together, and preserve one corrected dialogue example in the edit log."
				},
			"MSC7 Phrases & Clauses I": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"subject-verb pair",
					"phrase",
					"independent clause",
					"dependent clause",
					"fragment repair"
				],
				flowNote:
					"Run the subject-verb and complete-thought tests before labeling, then repair one fragment by connecting it to an independent clause."
			},
			"MSC8 Commas": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"list",
					"introductory element",
					"direct address / interrupter",
					"joined clauses",
					"necessary / extra information"
				],
				flowNote:
					"Name the comma rule before adding punctuation. Complete the diagnosis set as core work and use the mixed extra-practice set only when more comma fluency is needed."
			},
			"MSC9 Semicolons": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"independent clause",
					"closely related ideas",
					"semicolon",
					"sentence boundary",
					"repair"
				],
				flowNote:
					"Test both sides for independence before using a semicolon, compare it with a period or conjunction, and log one corrected misuse."
			},
			"MSC10 Colons": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"complete starter",
					"list",
					"explanation",
					"example / quotation",
					"colon repair"
				],
				flowNote:
					"Confirm that the words before the colon form a complete sentence, then compare list, explanation, and example uses in the edit log."
			},
			"MSC11 Common Punctuation Errors": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"comma splice",
					"run-on",
					"sentence-boundary repair",
					"coordinate / cumulative adjective",
					"error log"
				],
				flowNote:
					"Diagnose each error category before repairing it, compare valid sentence-boundary choices, and finish with a passage edit organized by rule rather than isolated marks."
			},
			"MSC12 Pauses & Breaks": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"dash",
					"parentheses",
					"ellipsis",
					"emphasis / side information",
					"meaning effect"
				],
				flowNote:
					"Compare the three punctuation choices on purpose and explain whether the sentence needs emphasis, side information, or omission/trailing thought."
			},
			"MSC Check-In #2": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"capitalization / end marks",
					"quotation marks",
					"commas / semicolons / colons",
					"error repair",
					"meaning effect"
				],
				flowNote:
					"Complete the punctuation concept record and one application passage. Compare the corrected passage with the edit log before selecting any review."
			},
			"MSC13 Subjects & Predicates": {
				estimatedTime: "1–2 sessions · 40–50 minutes each",
				keyBlocks: [
					"complete subject",
					"simple subject",
					"complete predicate",
					"simple predicate",
					"sentence core"
				],
				flowNote:
					"Remove extra phrases to reveal the sentence core, then restore them and verify that subject and predicate labels still describe the complete sentence."
			},
			"MSC14 Direct & Indirect Objects": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"action verb",
					"direct object",
					"indirect object",
					"what / whom",
					"to / for whom"
				],
				flowNote:
					"Find the verb first, ask the object questions in order, and add one complete sentence map to the cumulative edit log."
			},
			"MSC15 Phrases & Clauses II": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"phrase",
					"independent / dependent clause",
					"sentence expansion",
					"subordination",
					"meaning relationship"
				],
				flowNote:
					"Expand one sentence with a phrase and one with a dependent clause, label the added structure, and explain how each addition changes meaning."
			},
			"MSC16 Sentence Types": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"simple",
					"compound",
					"complex",
					"compound-complex",
					"sentence variety"
				],
				flowNote:
					"Classify sentence types from clause structure, rewrite one idea in all four forms, and use the mixed extra-practice set only when more fluency is needed."
			},
			"MSC Check-In #3": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"subject / predicate",
					"objects",
					"phrases / clauses",
					"sentence type",
					"clarity / rhythm revision"
				],
				flowNote:
					"Complete the structure concept record and one passage revision. Explain how the structural change affects clarity, rhythm, or emphasis before selecting review."
			},
			"MSC17 Master Project": {
				estimatedTime: "3–4 sessions · 40–50 minutes each",
				keyBlocks: [
					"project path",
					"selected grammar concepts",
					"examples / annotations",
					"practice or revision evidence",
					"feedback check"
				],
				flowNote:
					"Complete the path-and-evidence plan, then choose one project. A fictional narrative and private or one-to-one presentation are valid; personal disclosure and public posting are not required."
			}
		},
		sourceActivityAnchors: grammarMechanicsSourceAnchors,
		modules: [
			"MSC1 Nouns, Pronouns & Adjectives",
			"MSC2 Verbs, Adverbs & Verbals",
			"MSC3 Prepositions & Interjections",
			"MSC4 Coordinating & Subordinating Conjunctions",
			"MSC Check-In #1",
			"MSC5 Capitalization",
			"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks",
			"MSC7 Phrases & Clauses I",
			"MSC8 Commas",
			"MSC9 Semicolons",
			"MSC10 Colons",
			"MSC11 Common Punctuation Errors",
			"MSC12 Pauses & Breaks",
			"MSC Check-In #2",
			"MSC13 Subjects & Predicates",
			"MSC14 Direct & Indirect Objects",
			"MSC15 Phrases & Clauses II",
			"MSC16 Sentence Types",
			"MSC Check-In #3",
			"MSC17 Master Project"
		]
	}),
	novelWriting: createSourceLibraryCourse({
		name: "Novel Writing",
		area: "long-form writing",
		focus: "goal setting, protagonist and antagonist design, drafting, conflict, setting, plot structure, character development, narration, dialogue, and revision toward a complete story arc",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"NW1 Course Overview & Goal Setting": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"project scope",
					"premise",
					"word-count target",
					"writing rhythm",
					"completion definition"
				],
				flowNote:
					"Choose the smallest sustainable story scope, define a premise and completion target, and divide the target into checkpoints. A short story, novella-length project, novel excerpt, or longer draft can complete the course."
			},
			"NW2 Developing a Protagonist and an Antagonist": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"protagonist",
					"antagonist",
					"objective",
					"motivation",
					"conflict relationship"
				],
				flowNote:
					"Build the two central forces around competing objectives, motivations, strengths, flaws, and stakes, then carry those choices into the opening scene."
			},
			"NW3 Novel Drafting: Introducing Your Characters": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"opening scene",
					"character action",
					"point of view",
					"scene goal",
					"revision"
				],
				flowNote:
					"Draft an opening that reveals character through action, voice, and choice. Revise the scene so its point of view, immediate goal, and first source of tension prepare the conflict ladder."
			},
			"NW4 Generating Conflict": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"conflict ladder",
					"stakes",
					"escalation",
					"cause and effect",
					"climax direction"
				],
				flowNote:
					"Turn the protagonist's objective into a causal ladder of external, interpersonal, and internal obstacles. Use the ladder to choose which conflict belongs in the next drafted scene."
			},
			"NW5 Novel Drafting: Setting the Scene": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"setting",
					"sensory detail",
					"atmosphere",
					"scene function",
					"character interaction"
				],
				flowNote:
					"Draft a scene whose setting changes what a character notices, chooses, or can do. Keep details that serve mood, pressure, action, or meaning, then add the scene to the living manuscript."
			},
			"NW6 Structuring Plot": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"exposition",
					"rising action",
					"climax",
					"falling action",
					"resolution"
				],
				flowNote:
					"Map concrete story events and their causal links, then use the map to identify the next needed scene. Use a hand-drawn or text-only arc."
			},
			"NW7 Character Development": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"character objective",
					"choice",
					"consequence",
					"change",
					"rising action"
				],
				flowNote:
					"Compare two manuscript moments to trace how pressure changes the protagonist's choices, relationships, or beliefs. Revise one scene where that development is not yet visible."
			},
			"NW8 Narration": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"point of view",
					"narrator access",
					"consistency",
					"narrative distance",
					"viewpoint audit"
				],
				flowNote:
					"Choose the narration rules for the manuscript, audit an excerpt for knowledge and distance, and revise any viewpoint breaks before the midpoint review."
			},
			"Check-In #1": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"midpoint evidence",
					"scope check",
					"revision priority",
					"excerpt comparison",
					"next drafting target"
				],
				flowNote:
					"Compare the current manuscript against the original scope, revise one meaningful excerpt, and set the next realistic scene or word-count checkpoint before continuing."
			},
			"NW9 Describing Setting": {
				estimatedTime: "2 sessions · 40–50 minutes each",
				keyBlocks: [
					"sensory setting",
					"selective detail",
					"atmosphere",
					"action integration",
					"revision"
				],
				flowNote:
					"Expand one existing setting with purposeful sensory evidence, cut decorative details that do not serve the scene, and return the revision to the manuscript."
			},
			"NW10 Writing Dialogue": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"dialogue formatting",
					"speaker clarity",
					"action beats",
					"subtext",
					"character voice"
				],
				flowNote:
					"Revise a dialogue scene for formatting, distinct voices, action beats, and subtext. Every retained exchange advances information, tension, relationship, or plot."
			},
			"NW11 Novel Drafting: Conflict": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"highest-tension scene",
					"stakes",
					"character choice",
					"consequence",
					"pacing"
				],
				flowNote:
					"Draft or revise the manuscript's highest-tension scene so earlier choices cause the confrontation and its outcome changes what the ending must resolve."
			},
			"NW12 Novel Drafting: Falling Action & Resolution": {
				estimatedTime: "2–3 sessions · 40–50 minutes each",
				keyBlocks: [
					"falling action",
					"resolution",
					"cause and effect",
					"character change",
					"thematic closure"
				],
				flowNote:
					"Trace consequences from the central conflict into a resolution that answers the opening objective and reveals external and internal change without rushing the final scenes."
			},
			"NW13 Final Revision Portfolio": {
				estimatedTime: "3–5 sessions · 40–50 minutes each",
				keyBlocks: [
					"chosen story scope",
					"revision pass",
					"continuity",
					"polished portfolio",
					"next-pass plan"
				],
				flowNote:
					"Complete the chosen story scope, revise for continuity and craft, and assemble a polished excerpt or full draft with a readiness reflection. A private portfolio or guided review is complete; public posting or publication is optional and not required."
			}
		},
		sourceActivityAnchors: novelWritingSourceAnchors,
		modules: [
			"NW1 Course Overview & Goal Setting",
			"NW2 Developing a Protagonist and an Antagonist",
			"NW3 Novel Drafting: Introducing Your Characters",
			"NW4 Generating Conflict",
			"NW5 Novel Drafting: Setting the Scene",
			"NW6 Structuring Plot",
			"NW7 Character Development",
			"NW8 Narration",
			"Check-In #1",
			"NW9 Describing Setting",
			"NW10 Writing Dialogue",
			"NW11 Novel Drafting: Conflict",
			"NW12 Novel Drafting: Falling Action & Resolution",
			"NW13 Final Revision Portfolio"
		]
	})
} as const;

const earlyElementaryAMathSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"EEA1 Addition and Subtraction within 20": [
		{
			title: "Ladybug Number Bond Cases",
			prompt: "Use the ladybug-box scenario to make different combinations that total 15. Move one ladybug between boxes, then create an equal-share case with one ladybug left in the net.",
			evidence: [
				"Drawing, frame, or table showing two addends that total 15.",
				"Updated equation after one ladybug moves from one box to the other.",
				"Equal-share equation with the leftover ladybug represented clearly."
			]
		}
	],
	"EEA2 Addition and Subtraction within 100": [
		{
			title: "Starfish Tank Regrouping",
			prompt: "Use the starfish-tank scenario with 22 starfish in one tank and 16 in another. Group by tens, move leftovers into smaller tanks, then compare one tank against the combined amount in the other tanks.",
			evidence: [
				"Total starfish count from the starting tanks.",
				"Regrouped representation separating tens and leftover ones.",
				"Subtraction comparison after two starfish move back into Tank A."
			]
		}
	],
	"EEA3 Representing Word Problems": [
		{
			title: "Birthday Candy Bag Model",
			prompt: "Model two birthday candy bags with fruity and chocolate candies, then update the model after sharing candy and receiving a late birthday bag.",
			evidence: [
				"Separate counts for fruity candy and chocolate candy in the first two bags.",
				"Updated drawing or equation after sharing 2 fruity candies and 4 chocolate candies.",
				"Final total after adding the late birthday bag with 10 candies and 2 fruity pieces."
			]
		}
	],
	"EEA4 Module Project: Escape the Game": [
		{
			id: "early-elementary-a-math-eea4-module-project-escape-the-game-curriculum-escape-the-game-character-budget",
			title: "Escape the Game Character Budget",
			preserveAssignment: true,
			preserveInstructions: true,
			prompt: `Design a video-game character with a 100-point budget. Choose exactly one option from each category in this classroom point table:

| Category | Option | Points |
| --- | --- | ---: |
| Hair | None | 0 |
| Hair | Short | 10 |
| Hair | Spiky | 20 |
| Suit | Plain | 0 |
| Suit | Armor | 35 |
| Suit | Rocket | 45 |
| Extra | None | 0 |
| Extra | Map | 15 |
| Extra | Shield | 25 |

Draw and name the character. Add the three chosen prices, then subtract the total from 100. Change one choice and compare the new total and remaining points with the first design.

For example, short hair and armor with no extra use 10 + 35 + 0 = 45 points. The budget has 100 - 45 = 55 points left. Check by adding 45 + 55 = 100.

[Project self-check](/course-resource?asset=%2Fcourse-assets%2Fearly-elementary-a%2Fpractice-checks-v1.md%23character-budget&label=Character%20budget%20self-check)`,
			evidence: [
				"Character name and selected specs from each category.",
				"Addition equation for total points used.",
				"Subtraction equation for points remaining from the 100-point budget."
			]
		},
		{
			id: "early-elementary-a-math-eea4-module-project-escape-the-game-curriculum-liang-escape-route-grid",
			title: "Liang Escape Route Grid",
			preserveAssignment: true,
			preserveInstructions: true,
			prompt: `Draw a rectangular grid five squares across and 25 squares up. Start at the bottom-left corner and finish at the top-right corner. Each jump moves along one grid edge; the route stays inside the rectangle or on its boundary.

The route uses at least 20 right jumps, 15 left jumps, 30 up jumps, and 5 down jumps. Keep a separate tally for each direction. A right jump followed by a left jump returns to the same point; an up jump followed by a down jump does the same.

Find a route with the fewest total jumps that meets all four minimums. Mark the route in groups of jumps, count every group, and check both the final position and each directional total.

[Project self-check](/course-resource?asset=%2Fcourse-assets%2Fearly-elementary-a%2Fpractice-checks-v1.md%23escape-route&label=Escape%20route%20self-check)`,
			evidence: [
				"Route sketch or coordinate-step list from start to exit.",
				"Jump totals for right, left, up, and down directions.",
				"Total jump count with evidence that every movement rule was met."
			]
		}
	],
	"EEA5 Measuring and Estimating Length in Standard Units": [
		{
			title: "Indiana Jones Length Expedition",
			prompt: "Use the jungle-expedition scenario to compare inches, feet, yards, centimeters, and meters. Place the fruit, bug, tree, and gem along a one-yard path and answer distance questions.",
			evidence: [
				"Path model showing 36 inches as one yard.",
				"Object lengths marked in inches, centimeters, or meters with comparisons.",
				"Report answering distance in feet and comparing one foot with one yard."
			]
		}
	],
	"EEA6 Relating Addition and Subtraction to Length": [
		{
			title: "Yarn Quilt Length Equations",
			prompt: "Use the mini-quilt yarn scenario to add 11-inch, 12-inch, 15-inch, and 7-inch pieces, then subtract 20 inches to find the last piece length.",
			evidence: [
				"Number-line or ruler model for each yarn segment.",
				"Addition equations for total yarn before the final piece.",
				"Subtraction equation for the final piece and a check of the 68-to-81-inch measurement error."
			]
		}
	],
	"EEA7 Module Project: The Longest Sandwich in California": [
		{
			title: "Akshay Sandwich Number Line",
			prompt: "Plan a 96-meter sandwich by choosing ingredients, measuring each ingredient, ordering lengths from smallest to largest, and placing the sandwich on a 0-to-96-meter number line.",
			evidence: [
				"Ingredient list with lengths and units.",
				"Ordered list from smallest ingredient length to largest ingredient length.",
				"Number line from 0 meters to 96 meters showing the sandwich plan."
			]
		},
		{
			title: "Sandwich Sharing Record",
			prompt: "Track the record-setting sandwich after donation and party sharing. Account for Monday donation, Tuesday eating totals, and Wednesday split of the remaining sandwich.",
			evidence: [
				"Equation for sandwich length left after Monday's donation.",
				"Tuesday total eaten from the five people in the scenario and length remaining.",
				"Wednesday equal split calculation for the final remaining sandwich."
			]
		}
	],
	"EEA8 Understanding Place Value": [
		{
			title: "Penguin Place Value Grouping",
			prompt: "Use the penguin counting scenario to estimate first, then group penguins by tens and hundreds. Write totals in expanded form and reason about how many tens make 1,000.",
			evidence: [
				"Estimate and exact count comparison.",
				"Groups of ten, groups of ten tens, and leftovers recorded separately.",
				"Expanded form for 216 and a written pattern for reaching 1,000."
			]
		}
	],
	"EEA9 Adding and Subtracting within 200": [
		{
			title: "Bookshelf Regrouping Record",
			prompt: "Use the classroom-bookshelf scenario to estimate book totals, regroup books by tens, reorganize reading books, and add 23 history books from storage.",
			evidence: [
				"Estimate and exact total for the starting shelves.",
				"Regrouped equation after extras move to the extra-books shelf.",
				"Updated equation after adding 23 history books and one rewritten equivalent expression."
			]
		}
	],
	"EEA10 Representing Advanced Word Problems": [
		{
			title: "Arcade Ticket Goal Tracker",
			prompt: "Track arcade tickets through the prize goal, lunch purchases, a 30-ticket gift, and five final games. Decide whether the 200-ticket mega prize is reachable.",
			evidence: [
				"Ticket total before lunch and tickets still needed for the first goal.",
				"Lunch item choices with ticket cost and remaining tickets.",
				"Final ticket total after the five games and conclusion about the 200-ticket prize."
			]
		}
	],
	"EEA11 Adding and Subtracting within 1000": [
		{
			title: "Millionaire Base-Ten Challenge",
			prompt: "Use the Who Wants To Be A Millionaire-style question set to solve addition and subtraction within 1,000 with base-ten blocks or equivalent place-value records.",
			evidence: [
				"Problem setup separating hundreds, tens, and ones.",
				"Work record showing regrouping or decomposition when needed.",
				"Final answer checked against the place-value representation."
			]
		}
	],
	"EEA12 Strategies to Add and Subtract within 1000": [
		{
			title: "Skee-Ball Team Score Ledger",
			prompt: "Use the five-round skee-ball scenario to track points gained and lost from outer-ring holes, inner-ring holes, bullseyes, misses, and balls outside the play area. Keep the running score visible after each round so additions, penalties, trades, and the final record comparison can be checked without recalculating the entire game.",
			evidence: [
				"Round-by-round score ledger with gains and penalties.",
				"Base-ten or expanded-form representation of the running score after at least two rounds.",
				"Final comparison with the 870-point record, including the exact number of points over or under the record."
			]
		}
	],
	"EEA13 Module Project: Going TikTok Famous": [
		{
			title: "TikTok Creator Follower Analysis",
			prompt: "Use Melody's creator table to order the top five TikTok creators, total their follower counts, and calculate how many followers each creator needs to reach one billion.",
			evidence: [
				"Creators ordered from most followers to fewest followers.",
				"Combined follower total for the top five creators.",
				"Difference from one billion followers for each creator."
			]
		},
		{
			title: "Melody Test Launch Data",
			prompt: "Design a video idea for Melody's test launch, then track new followers gained from Monday through Thursday and add them to the starting 673 followers.",
			evidence: [
				"Video idea with one reason it could attract viewers or followers.",
				"New-follower total from 37, 93, 334, and 158.",
				"Final follower count after adding the new followers to 673."
			]
		}
	],
	"Check-in #1": [
		{
			title: "Addition, Length, and Place Value Check",
			prompt: "Use the check-in problems to demonstrate sums and differences, length-unit addition and subtraction, place value comparison, expanded form, and operations within 1,000.",
			evidence: [
				"Backpacking, circle, rope, and ball-distance problems solved with diagrams or equations.",
				"Place value comparisons using greater-than, less-than, or equal signs.",
				"Addition and subtraction within 1,000 with the strategy named."
			]
		}
	],
	"EEA14 Working with Equal Groups": [
		{
			title: "Kickball Equal Groups",
			prompt: "Use the kickball roster scenario to divide players into equal teams, update the roster when three more players arrive, and connect five groups of four points to repeated addition.",
			evidence: [
				"Roster count before and after the three late arrivals.",
				"Team split showing whether the teams are equal at each stage.",
				"Repeated-addition equation for five players each scoring four points."
			]
		}
	],
	"EEA15 Partitioning Rectangles": [
		{
			title: "Board Game Rectangle Partitions",
			prompt: "Design a rectangular board game by partitioning a rectangle into rows and columns of equal-sized squares. Count the spaces and decide whether good and bad spaces can be split evenly.",
			evidence: [
				"Rectangle partitioned into equal rows and columns.",
				"Addition or array count for total squares.",
				"Good-space and bad-space count with an explanation of equal or unequal splitting."
			]
		}
	],
	"EEA16 Time": [
		{
			title: "Deserted Island Time Record",
			prompt: "Use the deserted-island scenario to distinguish a.m. and p.m., analog and digital clocks, half past, quarter until, elapsed time, and a 40-minute delay.",
			evidence: [
				"Examples of a.m. and p.m. based on time-of-day clues.",
				"Analog and digital clock readings for 8:30 and quarter until 10.",
				"Elapsed-time calculation from 7:30 a.m. to rescue time plus the 40-minute delay."
			]
		}
	],
	"EEA17 Money": [
		{
			title: "Grocery Coin Exchange",
			prompt: "Use the grocery-store scenario to represent item prices with dollars and coins, add up to four selected items, and exchange leftover coins for fewer coins or bills.",
			evidence: [
				"Coin combinations for selected grocery item prices.",
				"Total cost for up to four chosen items.",
				"Coin-exchange record for 3 quarters, 7 dimes, 10 nickels, and 20 pennies."
			]
		}
	],
	"EEA18 Visualizing Data": [
		{
			title: "Kitchen Utensil Data Display",
			prompt: "Collect kitchen utensil counts for spoons, knives, and forks, choose a visual display, then update the display after adding 3 forks, 2 spoons, and 4 knives.",
			evidence: [
				"Original utensil counts by category.",
				"Graph, table, or picture display showing all utensil categories.",
				"Updated counts and comparison of largest and smallest categories after the new set."
			]
		}
	],
	"EEA19 Polygons and Circles": [
		{
			title: "Bakery Dessert Shape Fractions",
			prompt: "Use the bakery dessert scenario to describe dessert shapes, then divide pies and ice cream cakes into two, three, and four equal parts for different party groups.",
			evidence: [
				"Shape observations naming sides, curves, corners, or equal parts.",
				"Partition drawings or descriptions for halves, thirds, and fourths.",
				"Explanation of how the parts stay equal for each dessert."
			]
		}
	],
	"EEA20 Module Project: The Next Hit iPhone": [
		{
			title: "Devyn iPhone Data Charts",
			prompt: "Use Devyn's iPhone table to create charts for initial price, battery life, and customer satisfaction. Use the displays to recommend price and battery-life choices for a future iPhone.",
			evidence: [
				"Chart or table for initial price by model.",
				"Chart or table for battery life and satisfaction by model.",
				"Recommendation for a future price and battery-life target with data evidence."
			]
		},
		{
			title: "Launch Party Array Cuts",
			prompt: "Use the launch-party dessert scenario to split square trays into exactly 15 brownies for the product team and 20 cake slices for the engineering team.",
			evidence: [
				"Array or partition plan for 15 equal brownie pieces.",
				"Array or partition plan for 20 equal cake pieces.",
				"Explanation connecting rows and columns to multiplication or repeated addition."
			]
		}
	],
	"Check-in #2": [
		{
			title: "Multiplication, Measurement, Data, and Shape Check",
			prompt: "Use the second check-in to demonstrate even and odd reasoning, arrays, equal groups, length, money, data displays, time, shapes, fractions, and final subtraction.",
			evidence: [
				"Even or odd, equal-sum, array, and rectangle-area responses with reasoning.",
				"Length, money, and picture-graph responses with labels and units.",
				"Time, shape, equal-parts, and 500-pound switch problems solved with visible work."
			]
		}
	]
};

const earlyElementaryBMathSourceAnchors: Record<
	string,
	SourceActivityAnchor[]
> = {
	"EEB1 Adding and Subtracting within 1000": [
		{
			title: "Millionaire Block Strategy Review",
			prompt: "Use the Who Wants To Be A Millionaire-style number-pieces activity to represent 119 and 232, then solve 119 + 232 and 232 - 119 with place-value blocks or expanded form.",
			evidence: [
				"Block or expanded-form representation for 119 and 232.",
				"Addition work for 119 + 232 with regrouping named when it occurs.",
				"Subtraction work for 232 - 119 with borrowing or decomposition visible."
			]
		}
	],
	"EEB2 Strategies to Add and Subtract within 1000": [
		{
			title: "Skee-Ball Record Challenge",
			prompt: "Track the five-round skee-ball score where outer rings are 1 point, inner rings are 10 points, bullseyes are 100 points, missed holes lose 10 points, and balls outside the play area lose 100 points.",
			evidence: [
				"Running score after each round, including gains and penalties.",
				"Place-value or number-block trade record that simplifies the score when possible.",
				"Final comparison against the 870-point record with exact difference."
			]
		}
	],
	"EEB3 Multiplying and Dividing within 100": [
		{
			title: "Recycling Game Show Score Sheet",
			prompt: "Use the recycling game show to compare box collections across rounds. Represent small, medium, and large boxes as different point values, write multiplication equations, and use division to recover a missing box count.",
			evidence: [
				"Round 1 score for 4 boxes and 5 boxes when each box is worth 2 points.",
				"Comparison between 7 small boxes plus 1 medium box and 1 large box plus 5 small boxes.",
				"Equation explaining how many 6-point boxes make a 42-point score."
			]
		}
	],
	"EEB4 Properties of Multiplication and Division": [
		{
			title: "Twenty-Seven Character Array Properties",
			prompt: "Arrange 27 characters in rows and columns, then rearrange the same total to show commutativity. Add a related group to model the distributive property, then use 15 characters in groups of 5 to connect division and multiplication.",
			evidence: [
				"Two arrays for 27 with matching multiplication equations.",
				"Three-factor expression and grouping comparison for associativity.",
				"Distributive expression and inverse division/multiplication pair for 15 and 5."
			]
		}
	],
	"EEB5 Multiplication and Division Word Problems": [
		{
			title: "Cookout Equal Groups and Missing Amounts",
			prompt: "Plan a cookout main dish for about 20 people, place two pieces of food on each plate, update the table after half the plates are gone, then solve dessert and goody-bag missing-quantity problems.",
			evidence: [
				"Box, plate, or array model showing enough food for 20 people.",
				"Repeated-addition equation for the pieces of food left after half the plates are gone.",
				"Missing-value work for ice cream sandwiches and 100 goody-bag items."
			]
		}
	],
	"EEB6 Applying the Four Operations": [
		{
			title: "Board Game Expression Tracker",
			prompt: "Use the four-operations board game to record each dice roll and space effect as one expression. Apply multiplication and division before addition and subtraction, handle whole-number division limits, and compare parentheses placements.",
			evidence: [
				"Turn-by-turn expression record tied to spaces moved on the board.",
				"At least one evaluated expression showing operation order.",
				"Parentheses comparison showing whether the score changes when grouping changes."
			]
		}
	],
	"EEB7 Multiples of 10": [
		{
			title: "Multiples of Ten Block Comparison",
			prompt: "Choose a number from 1 to 9, multiply it by single-digit factors, then compare each representation with the related factor that has a zero added. Repeat with x2, x4, and x6 to describe groups of ten.",
			evidence: [
				"Top-row number-block models for the original single-digit multiplications.",
				"Bottom-row models for the related multiples of 10.",
				"Pattern statement explaining how adding a zero changes the place-value representation."
			]
		}
	],
	"EEB8 Module Project: Using Science For Good": [
		{
			title: "Fritz Four-Week Dosage Budget",
			prompt: "Use Fritz's Duchenne Muscular Dystrophy medicine table to calculate Vitamin D, Iron, CoQ10, and steroid amounts for a four-week trip. Include pill counts, steroid milligrams from kilograms of body weight, and total estimated cost.",
			evidence: [
				"Four-week quantity calculation for each medicine.",
				"Steroid dosage using 16 kilograms and 1 milligram per kilogram.",
				"Cost total using the per-pill and per-milligram prices."
			]
		},
		{
			title: "Fritz Updated Dosage Plan",
			prompt: "Use the updated medicine table to determine how long a 96-pill Iron bottle lasts at 3 pills every 3 days, then calculate six weeks of steroids using Fritz's new 23-kilogram weight and the revised ratio.",
			evidence: [
				"Days covered by the 96-pill Iron bottle.",
				"Steroid milligrams needed per day from 1 milligram per 2 kilograms.",
				"Six-week steroid total for the new 23-kilogram weight."
			]
		}
	],
	"Check-in #1": [
		{
			title: "Operations and Multiplication Check",
			prompt: "Use the first check-in to demonstrate addition and subtraction within 1,000, multiplication and division within 100, multiplication properties, word-problem representation, four-operation expressions, and multiples of 10.",
			evidence: [
				"Place-value addition and subtraction work with regrouping when needed.",
				"Multiplication, division, and missing-value problems represented by equations or arrays.",
				"Operation-order, property, and multiples-of-10 explanations with labeled work."
			]
		}
	],
	"EEB9 Units of Measurement": [
		{
			title: "Storm Cleanup Measurement Plan",
			prompt: "Use the storm-cleanup scenario to reason about time, liters, cups, grams, kilograms, and container choice. Track the leak from 7:30 a.m. to 8:15 a.m., compare 1 liter with 4 cups, and estimate weights for paper, textbooks, and pizza.",
			evidence: [
				"Timeline for leak checks, bottle filling, and textbook distribution.",
				"Unit comparison between liters and cups, plus grams and kilograms.",
				"Measurement choices justified for paper weights, textbook stacks, and pizza weight."
			]
		}
	],
	"EEB10 Area": [
		{
			title: "House Decoration Square-Unit Designs",
			prompt: "Choose four square or rectangular house decorations, model each with square units under 100, then estimate the area of a non-rectangular gift by decomposing or enclosing it with square units.",
			evidence: [
				"Four decoration names with square-unit area models.",
				"Multiplication equation for each rectangular area.",
				"Non-rectangular estimate that combines multiplication and addition."
			]
		}
	],
	"EEB11 Module Project: Investing for the Future": [
		{
			title: "Pear Investment Allocation",
			prompt: "Use Mar Hershenson's Pear investment scenario to distribute $87 million among Xampla, Bear Flag Robotics, and Nextmind. Compare equal allocation with a reasoned recommendation for which company has the strongest growth case.",
			evidence: [
				"Equal funding amount for three companies from $87 million.",
				"Selected company and evidence-based reason for the recommendation.",
				"Clear distinction between equal allocation and preferred investment choice."
			]
		},
		{
			title: "Bear Flag Factory Area Budget",
			prompt: "Use the Bear Flag Robotics factory blueprint to calculate total square-yard area, then multiply by $10 per square yard to estimate the factory cost.",
			evidence: [
				"Factory area split into rectangles or counted square-yard sections.",
				"Total area in square yards.",
				"Factory cost calculation at $10 per square yard."
			]
		}
	],
	"EEB12 Partitioning Shapes": [
		{
			title: "Mars Fraction Expedition",
			prompt: "Use the Mars mission path to partition the planet into fourths, collect a hexagon rock, shade two tenths of a rectangular liquid sample, and describe oxygen-tank levels as fractions.",
			evidence: [
				"Planet partition showing one fourth, later explored portions, and the last section.",
				"Hexagon, rectangle, and octagon samples partitioned into equal pieces.",
				"Fraction statements for rock piece, liquid sample, plant half, and oxygen level."
			]
		}
	],
	"EEB13 Fractions as Numbers": [
		{
			title: "Foot-Long Sandwich Number Lines",
			prompt: "Draw two foot-long sandwiches with number lines from 0 to 1 foot. Cut the sandwiches into different fractions, split each part again, then compare how much of each sandwich is eaten.",
			evidence: [
				"Two number lines with halves, thirds, or fourths marked correctly.",
				"Updated tick marks after each part is cut in half.",
				"Fractions eaten and remaining after 4 pieces from each sandwich are eaten."
			]
		}
	],
	"EEB14 Represent and Interpret Data": [
		{
			title: "Zoo Anniversary Scaled Graphs",
			prompt: "Use the zoo anniversary scenario to organize two animal types across three event sections. Create scaled picture graphs for 20, 5, 15 and 16, 8, 12, then combine totals in a bar graph.",
			evidence: [
				"Section labels and scaled picture graph for the first animal.",
				"Second scaled picture graph using a different scale or sticker value.",
				"Combined bar graph identifying the highest and lowest section totals."
			]
		},
		{
			title: "Zoo Straw Measurement Line Plot",
			prompt: "Represent collected straw pieces on a measurement line: 1 inch, 1 and a half inches, 1 and 3 quarters inches, half an inch, and 2 and one quarter inches. Decide how many pieces are at least 1 and a half inches.",
			evidence: [
				"Line plot or number-line record with every straw length represented.",
				"Counts for each fractional inch length.",
				"Total number of straws kept at 1 and a half inches or longer."
			]
		}
	],
	"EEB15 Perimeter": [
		{
			title: "Camping Perimeter Layout",
			prompt: "Use the camping-trip setup to design two rectangular camp spaces with the same area and different side lengths, calculate LED light-strip perimeter for each, then add an equal-side triangular campfire barrier.",
			evidence: [
				"Two labeled rectangles with equal area and different dimensions.",
				"Perimeter calculation for each rectangular camp space.",
				"Triangular barrier dimensions and total distance around the campfire."
			]
		}
	],
	"EEB16 Quadrilaterals": [
		{
			title: "Four-Sided Object Scavenger Hunt",
			prompt: "Use a scavenger-hunt record to compare at least three four-sided objects. Identify rectangles, squares, rhombuses, trapezoids, parallel sides, shared attributes, and unique attributes.",
			evidence: [
				"Drawings or descriptions of at least three four-sided objects.",
				"Similarity and difference notes for side lengths, angles, and parallel sides.",
				"Labels for rectangle, square, rhombus, trapezoid, or other quadrilateral categories."
			]
		}
	],
	"EEB17 Module Project: 2001: A Warehouse Odyssey": [
		{
			title: "Amazon Warehouse Restock Survey",
			prompt: "Use Akshit Mehta's warehouse survey to decide which Amazon Fresh, Books, Electronics, Home & Kitchen, and Pet Supplies warehouses are below half capacity and need restocking.",
			evidence: [
				"Half-capacity comparison for each warehouse.",
				"List of warehouses that need restocking.",
				"Priority recommendation with a fraction or capacity reason."
			]
		},
		{
			title: "Warehouse Robot Area Proposal",
			prompt: "Choose between Standard Rover, Grab-a-Tron, and R.A.Z.E for warehouse use. Calculate robot area from rectangular dimensions and connect the chosen model's movement, load, or magnetic constraints to the recommendation.",
			evidence: [
				"Area calculation for the selected robot model.",
				"Reason for choosing the robot based on warehouse needs.",
				"Customization idea that improves the robot's warehouse usefulness."
			]
		}
	],
	"Check-in #2": [
		{
			title: "Measurement, Fraction, Data, and Geometry Check",
			prompt: "Use the second check-in to demonstrate measurement units, area, fractions, data displays, perimeter, quadrilateral attributes, and multi-step project reasoning.",
			evidence: [
				"Unit, area, and fraction responses with labels and diagrams.",
				"Data display or interpretation response using a scale or measurement line.",
				"Perimeter and quadrilateral responses naming side, angle, and parallel-side evidence."
			]
		}
	]
};

const lateElementaryAMathSourceAnchors: Record<string, SourceActivityAnchor[]> =
	{
		"LEA1 Place Value": [
			{
				title: "Prize Money Place-Value Exchange",
				prompt: "Use the competition prize bag with 236 one-dollar bills, 57 ten-dollar bills, and 3 hundred-dollar bills to calculate the total value, then trade the money into the smallest number of hundreds, tens, and ones possible.",
				evidence: [
					"Expanded-form or place-value record for 236 ones, 57 tens, and 3 hundreds.",
					"Total prize value written in standard form.",
					"Exchange record comparing the original bag with the simplified hundreds, tens, and ones."
				]
			}
		],
		"LEA2 Comparing and Rounding": [
			{
				title: "Party Food Rounding and Store Distance",
				prompt: "Use the party-food scenario to compare exact and rounded costs, then compare store distances of 3,218 feet and 3,253 feet to decide which option is closer and whether the price difference matters.",
				evidence: [
					"Rounded estimate for the $14.82 food purchase and comparison with about $15.",
					"Comparison of 3,218 feet and 3,253 feet using place value.",
					"Decision statement that uses both distance and cost evidence."
				]
			}
		],
		"LEA3 Addition and Subtraction": [
			{
				title: "Millionaire Addition and Subtraction Review",
				prompt: "Use the Who Wants To Be A Millionaire number-pieces review to model multi-digit addition and subtraction with hundreds, tens, and ones before writing the standard algorithm.",
				evidence: [
					"Place-value model for each addend or minuend.",
					"Addition or subtraction work showing regrouping when needed.",
					"Check step that connects the number-pieces model to the written algorithm."
				]
			}
		],
		"LEA4 Module Project: Soccer Season": [
			{
				title: "Soccer Season Team Skill Draft",
				prompt: "Use Chandan Lodha's 5v5 soccer draft to choose five players, add offensive and defensive skill points, round totals to the nearest ten, and compare teams with >, <, or =.",
				evidence: [
					"Selected five-player roster with offensive and defensive totals.",
					"Rounded team totals to the nearest ten.",
					"Comparison against another roster or Chandan's team using inequality symbols."
				]
			},
			{
				title: "Soccer Season Synergy Adjustment",
				prompt: "Use the synergy table with Oliver, Zai, Malik, Jessica, Mary, Stephany, Greg, Edgar, Samantha, and Cadence to trade players, change positions, and explain how the total score changes.",
				evidence: [
					"Original team score before any trade or position change.",
					"Updated score after applying at least one synergy adjustment.",
					"Explanation of whether the new roster is stronger, weaker, or tied."
				]
			}
		],
		"LEA5 Factors and Multiples": [
			{
				title: "Character Factor Arrangement",
				prompt: "Arrange 8, 18, and 25 characters into equal rows and columns, then use the arrangements to list factors, identify multiples, and compare factor patterns for 2, 3, 13, 50, and 90.",
				evidence: [
					"Array or rectangle arrangements for 8, 18, and 25.",
					"Factor lists for 50 and 90 with shared factors identified.",
					"Pattern statement about prime, composite, factor, or multiple relationships."
				]
			}
		],
		"LEA6 Multiplication by One-Digit Numbers": [
			{
				title: "Halloween Candy One-Digit Multiplication",
				prompt: "Use the Halloween candy scenario with six friends, Snickers, and groups of hundreds, tens, and ones to model one-digit multiplication and decide whether a 1,000-candy estimate is reasonable.",
				evidence: [
					"Multiplication model for six friends and 3 Snickers each.",
					"Comparison with a friend who has 3 times as many or 21 pieces.",
					"Place-value multiplication record and reasonableness check for 1,000 candies."
				]
			}
		],
		"LEA7 Multiplication by Two-Digit Numbers": [
			{
				title: "Birthday Treat Two-Digit Multiplication",
				prompt: "Use the birthday treat-bag scenario with 11 favorite foods and 25 classmates to compare 25 x 10 with 25 x 11, then calculate the total number of treats needed.",
				evidence: [
					"Partial-product or area model for 25 x 10.",
					"Updated calculation for 25 x 11.",
					"Sentence explaining how the extra group changes the total."
				]
			}
		],
		"LEA8 Division by One-Digit Numbers": [
			{
				title: "Farm Egg Carton Division",
				prompt: "Use the farm egg scenario to pack 40 eggs into cartons of 4, 6, and 8, then pack 122 eggs into a chosen carton size and interpret any remainder.",
				evidence: [
					"Division work for 40 eggs with 4-, 6-, and 8-egg cartons.",
					"Explanation of full cartons and leftover eggs.",
					"122-egg plan with quotient, remainder, and carton-size decision."
				]
			}
		],
		"LEA9 Module Project: Invest-a-thon": [
			{
				title: "Arielle Investment Stage Split",
				prompt: "Use Arielle Zuckerberg's Invest-a-thon scenario to split $5,134,533 evenly among Seed, Series A, and Series B companies, then decide how to handle any money left over.",
				evidence: [
					"Division calculation for three investment stages.",
					"Remainder or leftover-money statement.",
					"Stage allocation table with equal amounts clearly labeled."
				]
			},
			{
				title: "Arielle Company Portfolio Choice",
				prompt: "Choose companies such as Xampla, Bear Flag Robotics, Nextmind, Playco, CookUnity, Air Protein, Spoon, Literati, or SkyDrive, then justify the Seed, Series A, and Series B portfolio choices with arithmetic and written reasoning.",
				evidence: [
					"Selected companies grouped by funding stage.",
					"Funding amount per company in each selected stage.",
					"Reasoning that connects company choice, stage, and available budget."
				]
			},
			{
				title: "Arielle Reinvestment Growth Plan",
				prompt: "Model the 10-year prediction where Seed doubles, Series A grows 7 times, and Series B grows 19 times. Then quadruple the Series B investment and reallocate it so the Seed total is double the Series A total.",
				evidence: [
					"Growth expression for Seed, Series A, and Series B.",
					"Quadrupled Series B total.",
					"Reinvestment split that makes Seed funding double Series A funding."
				]
			}
		],
		"Check-in #1": [
			{
				title: "Multiplication and Operations Check",
				prompt: "Use the first check-in to demonstrate place value, comparison, rounding, addition, subtraction, factors, multiples, one-digit multiplication, two-digit multiplication, division, and project-based multi-step arithmetic.",
				evidence: [
					"Place-value, rounding, and comparison problems solved with labels.",
					"Addition, subtraction, multiplication, and division work with visible regrouping or remainders.",
					"Factor, multiple, and project-style reasoning written in complete math statements."
				]
			}
		],
		"LEA10 Lines": [
			{
				title: "Lines, Segments, and Rays Sort",
				prompt: "Use the GeoGebra-style drawing task to create and label a line, a line segment, and a ray, then compare what continues forever and what has endpoints.",
				evidence: [
					"One labeled line with arrows in both directions.",
					"One labeled line segment with two endpoints.",
					"One labeled ray with one endpoint and one continuing direction."
				]
			}
		],
		"LEA11 Angles": [
			{
				title: "Compass Turn Angle Route",
				prompt: "Use the hiking compass route to track north, south, east, west, right turns, left turns, 90-degree turns, 45-degree turns, 180-degree turns, and 270-degree turns.",
				evidence: [
					"Route diagram or ordered list of compass directions.",
					"Angle labels for each turn in degrees.",
					"Final direction after the full route is traced."
				]
			}
		],
		"LEA12 Triangles": [
			{
				title: "Triangle Attribute Sort",
				prompt: "Sort triangle cards into three groups twice: once by side lengths and once by angle type. Use the same triangles for both sorts so the comparison shows that one shape can be classified in multiple valid ways depending on the attribute being examined.",
				evidence: [
					"Triangle groups based on side lengths.",
					"Triangle groups based on angles.",
					"Comparison explaining how the same triangle can belong to different categories.",
					"One example triangle described with both a side-length category and an angle category."
				]
			}
		],
		"LEA13 Module Project: An Obtuse Life": [
			{
				title: "Obtuse Life Shape Photo Collection",
				prompt: "Use Bill Lee's gallery-photo scenario to identify rectangles, squares, diamonds, a star, a circle, one line of symmetry, an obtuse angle, a right triangle, no lines of symmetry, and a parallelogram.",
				evidence: [
					"Shape collection or sketch with each required geometry feature labeled.",
					"Symmetry notes for examples with one line, no lines, or multiple lines.",
					"Angle and triangle labels that distinguish right and obtuse examples."
				]
			},
			{
				title: "Gallery Light Angle Setup",
				prompt: "Use the art-gallery lighting setup to place a light perpendicular to the ceiling, then rotate it left until it is 23 degrees from the ceiling and describe the new angle relationship.",
				evidence: [
					"Diagram of the original perpendicular light position.",
					"Rotation record showing a 67-degree turn from perpendicular and a final 23-degree ceiling angle.",
					"Explanation of how the angle changed from a right angle."
				]
			}
		],
		"LEA14 Polygons and Perimeter": [
			{
				title: "Puppy Pen Perimeter and Symmetry",
				prompt: "Design a puppy pen with 4 to 8 equal sides where each side is 3 feet long, calculate the fencing needed, then design a puppy bed with line symmetry.",
				evidence: [
					"Chosen polygon with side count and side length labeled.",
					"Perimeter calculation for the full pen.",
					"Puppy-bed design with at least one line of symmetry marked."
				]
			}
		],
		"LEA15 Quadrilaterals": [
			{
				title: "Quadrilateral Attribute Sort",
				prompt: "Sort quadrilaterals by two pairs of parallel sides, four equal sides, four right angles, and rectangles with four equal sides, then explain which categories can overlap.",
				evidence: [
					"Sorted quadrilateral groups with category labels.",
					"At least one example that fits more than one category.",
					"Explanation using side lengths, right angles, and parallel sides."
				]
			}
		],
		"LEA16 Area and Volume": [
			{
				title: "Backyard Pool Area and Volume",
				prompt: "Use the backyard pool scenario with a rectangular pool perimeter of 30 feet. Choose length, width, and depth, then calculate tile area for the sides and bottom and water volume in cubic feet.",
				evidence: [
					"Length and width pair that gives a 30-foot perimeter.",
					"Tile-area calculation for the bottom and side faces.",
					"Volume calculation using length, width, and depth."
				]
			}
		],
		"LEA17 Module Project: The LA River Master Plan": [
			{
				title: "LA River Elevated Park Plan",
				prompt: "Use Dana McKinney's L.A. River master-plan scenario to design an elevated park, split amenities into rectangles, calculate each amenity area, find remaining area, and calculate the park perimeter.",
				evidence: [
					"Park diagram with rectangular amenities labeled.",
					"Area calculation for each amenity and total used area.",
					"Remaining area and perimeter calculation for the park."
				]
			},
			{
				title: "LA River Pool and Hot Tub Volume Plan",
				prompt: "Use the pool volume data where width is 260 feet, depth is 4 feet, and volume is 7,280 cubic feet to solve for length. Then design a hot tub with one-fifth the capacity and width 91 feet.",
				evidence: [
					"Pool-length calculation from 7,280 cubic feet, 260 feet, and 4 feet.",
					"Hot-tub volume as one-fifth of the pool capacity.",
					"Possible hot-tub length and depth pair using the 91-foot width."
				]
			}
		],
		"Check-in #2": [
			{
				title: "Geometry and Measurement Check",
				prompt: "Use the second check-in to demonstrate lines, rays, segments, angles, triangles, polygons, perimeter, quadrilaterals, area, volume, and multi-step geometry reasoning.",
				evidence: [
					"Line, angle, triangle, and polygon responses with labels.",
					"Perimeter, area, and volume calculations with units.",
					"Quadrilateral and project-style reasoning that names the relevant geometric attributes."
				]
			}
		]
	};

const lateElementaryBMathSourceAnchors: Record<string, SourceActivityAnchor[]> =
	{
		"LEB1 Equivalent Fractions": [
			{
				title: "Hot Dog Contest Equivalent Fractions",
				prompt: "Use the hot dog eating contest with 5 contestants and 20 hot dogs per plate to compare one half, 10 hot dogs, ten twentieths, two fourths, and three sixths. Represent each amount visually, then add three more equivalent fractions for the same amount.",
				evidence: [
					"Visual model showing 20 hot dogs for each contestant.",
					"Comparison explaining that the listed amounts are equivalent.",
					"Three additional equivalent fractions for one half of 20."
				]
			}
		],
		"LEB2 Comparing and Ordering Fractions": [
			{
				title: "Chore Ribbon Fraction Ordering",
				prompt: "Use the chore ribbon scenario to compare 3/4 meter with 1/4 meter, then order 7/8 meter, 2/3 meter, and 4/5 meter from shortest to longest so each chore assignment is justified by fraction size.",
				evidence: [
					"Comparison of 3/4 meter and 1/4 meter with a diagram or common denominator.",
					"Ordered list for 7/8, 2/3, and 4/5.",
					"Chore assignment explanation tied to shortest, middle, and longest ribbon."
				]
			}
		],
		"LEB3 Adding and Subtracting Fractions": [
			{
				title: "Relay Race Fraction Progress",
				prompt: "Use the relay race track to add completed race fractions after the first runner, an extra 1/8 of the race, a replacement runner, and a third runner who completes 3/16 before stopping.",
				evidence: [
					"Race diagram shaded after each runner's completed distance.",
					"Fraction addition and subtraction work with common denominators.",
					"Final equivalent fractions that represent the whole completed race."
				]
			}
		],
		"LEB4 Multiplying Fractions": [
			{
				title: "Fraction of a Fraction Models",
				prompt: "Draw food or area models for one half of one half, one third of one third, two thirds of one fourth, and 2/5 x 1/2. Use the models to explain why the word 'of' connects to multiplication.",
				evidence: [
					"Area or food model for each fraction-of-a-fraction case.",
					"Multiplication expression matched to each visual model.",
					"Pattern statement connecting 'of' to multiplying numerators and denominators."
				]
			}
		],
		"LEB5 Dividing Fractions": [
			{
				title: "Pie Box Fraction Division",
				prompt: "Use the six-flavor pie-box scenario to determine what fraction of a pie fits in one full box, one half box, and two thirds of a box. Record each case as a division or multiplication expression.",
				evidence: [
					"Drawing of one pie box with six different pie slices.",
					"Expression for one full box, half a box, and two thirds of a box.",
					"Pattern statement explaining how the box fraction changes the amount of pie."
				]
			}
		],
		"LEB6 Module Project: Saving the Environment One Cake at a Time": [
			{
				title: "Angela Tesla Footprint Report",
				prompt: "Use Angela Kwok's Carbon Lighthouse report for Tesla to compare 175,000 tons of carbon emissions with 130,000 tons and $9 million in costs with a $3 million savings. Reduce each fraction and place the current-year values on number lines.",
				evidence: [
					"Reduced fraction for current carbon emissions compared with last year.",
					"Reduced fraction for current operating cost compared with last year.",
					"Two number lines showing the current-year carbon and cost positions relative to 1."
				]
			},
			{
				title: "Carbon Lighthouse Chiffon Cake Ratios",
				prompt: "Use the Carbon Lighthouse celebration cake recipe with 36 cups of flour. Calculate baking powder, eggs, sugar, vegetable oil, milk, special ingredient, and salt from the listed ratios, then identify the selected flavor add-in.",
				evidence: [
					"Ingredient table scaled from 36 cups of flour.",
					"Special ingredient amount for the chosen chocolate, vanilla, strawberry, matcha, cardamom, or lemon flavor.",
					"Ratio calculation for at least three ingredients shown step by step."
				]
			}
		],
		"LEB7 Place Value with Decimals": [
			{
				title: "Phone Savings Decimal Exchange",
				prompt: "Use the phone savings scenario with 9,450 pennies and 4,561 dimes to trade coins into dollar amounts, add the total, and decide whether the amount is enough for a phone.",
				evidence: [
					"Pennies converted to dollars and cents.",
					"Dimes converted to dollars and cents.",
					"Total savings amount with a phone-purchase decision."
				]
			}
		],
		"LEB8 Comparing and Rounding Decimals": [
			{
				title: "Race Time Decimal Ranking",
				prompt: "Use the runner times 1.21, 1.28, 1.3, and 1.264 seconds to rank the runners from fastest to slowest, round each time to one decimal place, and propose two possible third-place times.",
				evidence: [
					"Fastest-to-slowest order using decimal place value.",
					"Rounded newspaper results with one digit after the decimal.",
					"Two possible times that fit a third-place finish."
				]
			}
		],
		"LEB9 Decimal Operations": [
			{
				title: "Birthday Salsa Decimal Budget",
				prompt: "Use the salsa shopping list to calculate tomato, onion, lime, jalapeno, the $10.97 register total before tax, $0.83 tax, total cost, and change from a 20-dollar bill. Keep each decimal operation aligned to the relevant units and prices.",
				evidence: [
					"Tomato, onion, lime, and jalapeno cost calculations.",
					"Decision about whether 0.35 kilograms of jalapenos were purchased.",
					"Final total after $0.83 tax and change from $20."
				]
			}
		],
		"LEB10 Module Project: From Facebook to YouTube": [
			{
				title: "Rahul YouTube Views Table",
				prompt: "Use Rahul Pandey's YouTube table to order the five videos by views, calculate total top-video views, identify which videos are below the 20,000-view monetization threshold, and compare the top-five total with about 178,000 channel views.",
				evidence: [
					"Ordered video list from most views to least views.",
					"Additional views needed for each video under 20,000 views.",
					"Fraction comparing top-five views with total channel views."
				]
			},
			{
				title: "Facebook Sharing Growth Goal",
				prompt: "Use the Facebook sharing plan where Rahul starts at 178.603k channel views and each friend adds 1.2k views. Calculate how many shares are needed to pass 200,000 total views.",
				evidence: [
					"Difference between 200,000 and 178,603 views.",
					"Division by 1,200 views per share.",
					"Whole-number share count that actually passes the goal."
				]
			},
			{
				title: "Video Demographics Fraction Analysis",
				prompt: "Use the 3,830-view demographics table with male, female, they, kids or teens, and adults to write fractions for selected audience groups and recommend a future-video strategy using the data.",
				evidence: [
					"Fractions for male viewers, other viewers, adults, and female adults.",
					"Reduced or interpreted fractions with total 3,830 as the denominator when appropriate.",
					"Recommendation connected directly to the demographic table."
				]
			}
		],
		"Check-in #1": [
			{
				title: "Fractions and Decimals Check",
				prompt: "Use the first check-in to demonstrate equivalent fractions, fraction comparison, fraction addition and subtraction, fraction multiplication and division, decimal place value, decimal comparison, rounding, and decimal operations.",
				evidence: [
					"Fraction models and operations with visible denominators.",
					"Decimal comparisons and rounded values with place names.",
					"Multi-step word problems solved with labeled units."
				]
			}
		],
		"LEB11 Customary and Metric Units": [
			{
				title: "Guinness Unit Conversion Rankings",
				prompt: "Use the Guinness record event to rank U.S. heights, U.K. heights, weightlifting amounts, and plank times after converting each group into common units.",
				evidence: [
					"U.S. height conversions for Lana, Rich, Gary, and Trey.",
					"Metric height conversions for Oliver, Kara, Jack, and Amelia.",
					"Weight and time rankings for Derek, Paul, Ethel, George, Steven, and Carl."
				]
			}
		],
		"LEB12 Module Project: From Factory Line to Test Drive": [
			{
				title: "Israel Argo AI Blueprint Conversion",
				prompt: "Use Israel Kositsky's Argo AI blueprint with a 2,900-pound, 6.25-foot-wide, 17-foot-long, 5-foot-high car to convert the design for Volkswagen production in either ounces and yards or metric kilograms and meters.",
				evidence: [
					"Weight conversion from 2,900 pounds to the selected target unit.",
					"Width, length, and height conversions from feet to the selected target unit.",
					"Short standardization note comparing imperial and metric production records."
				]
			},
			{
				title: "Autonomous Test Drive Stop Map",
				prompt: "Use the 1,000-mile autonomous test-drive goal with gas stops every 125 miles. Create a number-line or map record for the Ford route in miles and the Volkswagen route in kilometers using 1 mile = 1.61 kilometers.",
				evidence: [
					"Gas-stop markers every 125 miles through 1,000 miles.",
					"Kilometer equivalents for the route or each major stop.",
					"Final route record that distinguishes miles from kilometers."
				]
			}
		],
		"LEB13 Numerical Expressions": [
			{
				title: "Dice and Coin Score Expressions",
				prompt: "Use the two-round dice and coin game to write expressions for round 1, round 2, total score, third place, and first place. Include parentheses where the order of operations controls the result.",
				evidence: [
					"Round 1 expression using the die roll, subtraction, doubling, addition, multiplication, and division.",
					"Round 2 expression for the heads and tails cases.",
					"Top-three score expressions showing second place, third place, and first place."
				]
			}
		],
		"LEB14 Multiplying by Two and Three Digit Numbers": [
			{
				title: "Donut Shop Production Plan",
				prompt: "Use the donut shop internship to calculate weekly donuts for 326 daily customers, monthly catering donuts from 289 dozen-order requests, and sprinkles for the special frosted donuts.",
				evidence: [
					"326 customers multiplied across one week.",
					"289 dozen catering orders converted to donuts.",
					"Sprinkle total using half the catering donuts and 123 sprinkles per frosted donut."
				]
			}
		],
		"LEB15 Dividing by Two Digit Numbers": [
			{
				title: "Birthday Party Division Budget",
				prompt: "Use the birthday party setup with 378 guests, 192 cars, 7 parking spaces per row, $78 large pizzas, $95 extra-large pizzas, and a $1,570 entertainment budget split across 25 services.",
				evidence: [
					"Parking-row calculation with quotient and remainder interpreted.",
					"Large-pizza versus extra-large-pizza cost comparison for 378 guests.",
					"Equal service-payment amount from a $1,570 budget."
				]
			}
		],
		"LEB16 The Coordinate Plane": [
			{
				title: "Town Map Coordinate Routes",
				prompt: "Use the town map to describe eastbound train stops and northbound bus stops from home to the park, school, library, and town plaza at train stop 8 and bus stop 11.",
				evidence: [
					"Coordinate-style directions for the park, school, and library.",
					"Town plaza location from train stop 8 and bus stop 11.",
					"Explanation connecting horizontal movement to x-values and vertical movement to y-values."
				]
			}
		],
		"LEB17 Patterns, Figures and Shapes in the Coordinate Plane": [
			{
				title: "Zoo Animal Growth Coordinate Tables",
				prompt: "Use Charlie the emperor penguin and Kondo the giant panda to create coordinate tables and plots: Charlie starts at 1 pound and doubles monthly through month 6, while Kondo starts at 145 pounds and loses 5 pounds per week.",
				evidence: [
					"Charlie weight table and coordinate plot through month 6.",
					"Kondo weekly weight table and coordinate plot for two months.",
					"Predictions for when Charlie reaches 24 pounds and Kondo reaches 100 pounds."
				]
			}
		],
		"LEB18 Module Project: Chanh's Space Adventure": [
			{
				title: "Chanh Tesla Orbit Measurement",
				prompt: "Use Chanh Nguyen's Tesla-Retriever 9000 setup to sketch Tesla's orbit, record Tesla coordinates, calculate orbit radius and circumference in astronomical units, convert circumference using 98 million miles per AU, and calculate orbital period from speed.",
				evidence: [
					"Orbit sketch with Tesla coordinates and radius estimate.",
					"Circumference calculation in AU and miles.",
					"Period calculation using circumference, speed, and 24 hours per day."
				]
			},
			{
				title: "Tesla-Retriever Intercept Simulation",
				prompt: "Use the orbit simulator to choose a starting radius between 0.5 and 3 AU for the TR9000, compare Tesla and TR9000 speeds, adjust speed in 150 mph increments, and estimate the intercept point.",
				evidence: [
					"Chosen TR9000 starting radius with reason.",
					"Tesla and TR9000 speed comparison before adjustments.",
					"Estimated intercept coordinate, speed, and radius after the simulation."
				]
			},
			{
				title: "Orbit Speed Comparison",
				prompt: "Use the bonus orbit cases at 2 AU and 0.5 AU to compare speed and period, then apply the same reasoning to Earth at 1 AU and Mars at 1.6 AU with Mars moving at 50,000 mph.",
				evidence: [
					"Recorded speeds for the 2 AU and 0.5 AU trial orbits.",
					"Comparison explaining which orbit is faster and which has a longer period.",
					"Mars period calculation using 1.6 AU, 50,000 mph, and the period formula."
				]
			}
		],
		"Check-in #2": [
			{
				title: "Units, Expressions, and Coordinates Check",
				prompt: "Use the second check-in to demonstrate unit conversion, numerical expressions, multi-digit multiplication, two-digit division, coordinate-plane graphing, patterns, figures, and project-style coordinate reasoning.",
				evidence: [
					"Unit conversions with common target units.",
					"Expression, multiplication, and division work with visible order and remainders.",
					"Coordinate-plane and pattern responses with labeled axes or ordered pairs."
				]
			}
		]
	};

const earlyElementaryAModuleMetadata: Record<
	string,
	SourceLibraryModuleMetadata
> = {
	"EEA1 Addition and Subtraction within 20": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"number bond",
			"make ten",
			"addition / subtraction",
			"equation",
			"visual proof"
		],
		flowNote:
			"Build, draw, and write each fact family before relying on mental answers. The ladybug case is complete when the model and equation agree, including the leftover case."
	},
	"EEA2 Addition and Subtraction within 100": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"tens / ones",
			"compose / decompose",
			"within 100",
			"estimate",
			"inverse check"
		],
		flowNote:
			"Use base-ten grouping before symbolic regrouping. Compare an estimate with the exact result and check subtraction by adding back."
	},
	"EEA3 Representing Word Problems": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"known / unknown",
			"drawing",
			"equation",
			"operation choice",
			"answer statement"
		],
		flowNote:
			"Represent each story with a drawing or bar model, an equation with the unknown in the correct position, and a sentence that answers the actual question."
	},
	"EEA4 Module Project: Escape the Game": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"100-point budget",
			"constraint",
			"coordinate steps",
			"running total",
			"verification"
		],
		flowNote:
			"Treat the two activities as one constraint project: verify the character budget first, then verify every directional jump and total on the escape route."
	},
	"EEA5 Measuring and Estimating Length in Standard Units": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"inch / foot / yard",
			"centimeter / meter",
			"ruler start point",
			"estimate",
			"unit label"
		],
		flowNote:
			"Estimate before measuring, start at zero, and attach a unit to every result. Compare customary and metric examples without mixing units in one calculation."
	},
	"EEA6 Relating Addition and Subtraction to Length": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"number line",
			"length sum",
			"length difference",
			"unknown segment",
			"unit check"
		],
		flowNote:
			"Model segments on a number line before writing equations. Use the total and known pieces to solve the missing length, then check that all units match."
	},
	"EEA7 Module Project: The Longest Sandwich in California": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"0–96 number line",
			"ordered lengths",
			"multi-step subtraction",
			"equal share",
			"meter label"
		],
		flowNote:
			"Keep one 96-meter model through planning, donation, eating, and sharing. Record each change so the remaining length never has to be guessed."
	},
	"EEA8 Understanding Place Value": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"hundreds / tens / ones",
			"expanded form",
			"compare",
			"regroup",
			"1,000"
		],
		flowNote:
			"Build numbers with grouped objects or base-ten models, then connect the model to expanded and standard form. Explain how ten of one unit becomes one of the next unit."
	},
	"EEA9 Adding and Subtracting within 200": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"place-value strategy",
			"regrouping",
			"within 200",
			"estimate",
			"inverse check"
		],
		flowNote:
			"Use a place-value model and one written strategy for each calculation. Compare the exact total with an estimate and use the inverse operation to check."
	},
	"EEA10 Representing Advanced Word Problems": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"multi-step story",
			"operation plan",
			"unknown",
			"running record",
			"reasonableness"
		],
		flowNote:
			"Pause after each event in the ticket story, update one running record, and explain why the next operation matches the change before calculating."
	},
	"EEA11 Adding and Subtracting within 1000": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"hundreds / tens / ones",
			"regrouping",
			"within 1,000",
			"written strategy",
			"inverse check"
		],
		flowNote:
			"Connect base-ten or expanded-form work to a written strategy. Name every regrouping and check the result with the inverse operation."
	},
	"EEA12 Strategies to Add and Subtract within 1000": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"decomposition",
			"compensation",
			"expanded form",
			"running total",
			"strategy comparison"
		],
		flowNote:
			"Compare at least two valid strategies on the same score change. Keep a round-by-round ledger and explain which strategy is easiest to verify."
	},
	"EEA13 Module Project: Going TikTok Famous": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"read a table",
			"order numbers",
			"add totals",
			"subtract from a target",
			"interpret data"
		],
		flowNote:
			"Use the creator scenario only as a follower-count data table; no social-media account or platform use is needed. Verify ordering, totals, and differences from the stated target."
	},
	"Check-in #1": {
		estimatedTime: "1–2 sessions · 35–45 minutes each",
		keyBlocks: [
			"operation choice",
			"place value",
			"length unit",
			"visual model",
			"strategy explanation"
		],
		flowNote:
			"Collect one model, equation, unit-aware result, and strategy explanation. Use missed evidence to choose review instead of assigning every extra activity."
	},
	"EEA14 Working with Equal Groups": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal groups",
			"repeated addition",
			"array",
			"even / odd",
			"leftover"
		],
		flowNote:
			"Build equal groups with objects or drawings, connect them to repeated addition, and make any leftover visible instead of hiding it in the equation."
	},
	"EEA15 Partitioning Rectangles": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal squares",
			"rows",
			"columns",
			"array count",
			"partition"
		],
		flowNote:
			"Partition one rectangle into equal rows and columns, count the same total two ways, and explain how the array supports repeated addition."
	},
	"EEA16 Time": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"analog / digital",
			"a.m. / p.m.",
			"half past",
			"quarter until",
			"elapsed time"
		],
		flowNote:
			"Match analog and digital times before solving elapsed-time stories. Use a timeline for the rescue and delay so start, change, and end times stay visible."
	},
	"EEA17 Money": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"coin value",
			"count money",
			"dollar notation",
			"equivalent amount",
			"make change"
		],
		flowNote:
			"Build each amount with coins, record it in dollars and cents, then trade for an equivalent amount with fewer pieces and verify the value did not change."
	},
	"EEA18 Visualizing Data": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"category",
			"table",
			"picture graph",
			"compare counts",
			"update data"
		],
		flowNote:
			"Collect and label categories before choosing a display. Update the same display after new utensils arrive and use it to answer comparison questions."
	},
	"EEA19 Polygons and Circles": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"side / corner / curve",
			"polygon",
			"circle",
			"equal parts",
			"halves / thirds / fourths"
		],
		flowNote:
			"Describe shapes by visible attributes, then partition examples into equal shares. A fraction name is accepted only when the parts are equal."
	},
	"EEA20 Module Project: The Next Hit iPhone": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"read a data table",
			"chart",
			"compare measures",
			"array partition",
			"evidence-based recommendation"
		],
		flowNote:
			"Use the phone table as a neutral product-data comparison, not a purchase endorsement. Support the recommendation with charts, then verify the party arrays separately."
	},
	"Check-in #2": {
		estimatedTime: "1–2 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal groups",
			"time / money",
			"data display",
			"shape / equal parts",
			"visible reasoning"
		],
		flowNote:
			"Collect one equal-groups model, one time or money record, one data interpretation, and one shape or fraction explanation before choosing targeted review."
	}
};

const earlyElementaryBModuleMetadata: Record<
	string,
	SourceLibraryModuleMetadata
> = {
	"EEB1 Adding and Subtracting within 1000": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"hundreds / tens / ones",
			"expanded form",
			"regrouping",
			"estimate",
			"inverse check"
		],
		flowNote:
			"Build each number with place-value blocks or expanded form before calculating. Name every regrouping, compare with an estimate, and check subtraction by adding back."
	},
	"EEB2 Strategies to Add and Subtract within 1000": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"decomposition",
			"compensation",
			"place-value trade",
			"running score",
			"strategy comparison"
		],
		flowNote:
			"Keep one round-by-round score ledger, solve at least one change with two strategies, and explain which strategy makes the regrouping easiest to verify."
	},
	"EEB3 Multiplying and Dividing within 100": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal groups",
			"array",
			"multiplication",
			"division",
			"unknown factor"
		],
		flowNote:
			"Build or draw equal groups before writing equations. Connect each multiplication fact to a related division fact and make the missing quantity visible."
	},
	"EEB4 Properties of Multiplication and Division": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"commutative",
			"associative",
			"distributive",
			"inverse operations",
			"array proof"
		],
		flowNote:
			"Rearrange the same objects instead of memorizing property names alone. Label what changes in each array and what total must remain invariant."
	},
	"EEB5 Multiplication and Division Word Problems": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"known / unknown",
			"equal-groups model",
			"equation",
			"operation choice",
			"answer statement"
		],
		flowNote:
			"Identify the group size, number of groups, and total before choosing an operation. Show the unknown in a model and finish with a sentence tied to the story."
	},
	"EEB6 Applying the Four Operations": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"four operations",
			"order of operations",
			"parentheses",
			"whole-number division",
			"step trace"
		],
		flowNote:
			"Record one expression per turn, evaluate one operation at a time, and compare two parentheses placements so the effect of grouping is visible."
	},
	"EEB7 Multiples of 10": {
		estimatedTime: "1–2 sessions · 35–45 minutes each",
		keyBlocks: [
			"factor",
			"multiple of 10",
			"place-value shift",
			"block model",
			"pattern statement"
		],
		flowNote:
			"Compare each single-digit product with its related multiple-of-ten product using blocks and equations. Describe the place-value change rather than relying on an add-a-zero shortcut alone."
	},
	"EEB8 Module Project: Using Science For Good": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"read a fixed table",
			"repeated interval",
			"unit rate",
			"multi-step total",
			"reasonableness check"
		],
		flowNote:
			"Treat every medicine name and number as a closed, fictional arithmetic table. Do not infer, recommend, or apply any dosage to a real person; verify only the stated rates, intervals, units, and totals."
	},
	"Check-in #1": {
		estimatedTime: "1–2 sessions · 35–45 minutes each",
		keyBlocks: [
			"place value",
			"multiplication / division",
			"property model",
			"expression",
			"visible explanation"
		],
		flowNote:
			"Collect one place-value strategy, one multiplication or division model, one property explanation, and one evaluated expression. Assign only the review connected to missing evidence."
	},
	"EEB9 Units of Measurement": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"elapsed time",
			"capacity",
			"mass",
			"estimate",
			"unit choice"
		],
		flowNote:
			"Estimate first, then choose and label a sensible unit before calculating. Use a timeline for elapsed time and keep capacity and mass comparisons separate."
	},
	"EEB10 Area": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"square unit",
			"rows / columns",
			"multiplication",
			"decompose",
			"estimate"
		],
		flowNote:
			"Tile or draw rectangular regions before using multiplication. For an irregular region, show how enclosing or decomposing it supports a reasonable square-unit estimate."
	},
	"EEB11 Module Project: Investing for the Future": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal allocation",
			"area decomposition",
			"unit cost",
			"compare options",
			"evidence-based choice"
		],
		flowNote:
			"Use the company scenario only for classroom arithmetic and evidence comparison, not real investment advice. Separate the equal-allocation calculation from the hypothetical recommendation, then verify the factory area and cost."
	},
	"EEB12 Partitioning Shapes": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"equal parts",
			"unit fraction",
			"numerator / denominator",
			"shape partition",
			"fraction statement"
		],
		flowNote:
			"Partition each whole into equal parts before naming a fraction. Match every numerator and denominator to a visible shaded or selected region."
	},
	"EEB13 Fractions as Numbers": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"0 to 1 number line",
			"equal intervals",
			"unit fraction",
			"equivalent fractions",
			"compare fractions"
		],
		flowNote:
			"Mark 0 and 1 first, divide the distance into equal intervals, and connect each physical sandwich cut to an exact point on the number line."
	},
	"EEB14 Represent and Interpret Data": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"table",
			"scale",
			"picture graph",
			"bar graph",
			"measurement line plot"
		],
		flowNote:
			"Organize the values in a table before choosing a graph and state what one symbol or interval represents. Answer comparison questions directly from the completed display."
	},
	"EEB15 Perimeter": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"side length",
			"perimeter",
			"area contrast",
			"same area / different shape",
			"unit label"
		],
		flowNote:
			"Trace and label every outer side before adding. Compare two rectangles with equal area to show why area does not determine perimeter."
	},
	"EEB16 Quadrilaterals": {
		estimatedTime: "2 sessions · 35–45 minutes each",
		keyBlocks: [
			"four sides",
			"parallel sides",
			"right angle",
			"shape hierarchy",
			"attribute evidence"
		],
		flowNote:
			"Classify each object from visible side and angle evidence, then place it in every quadrilateral category that applies instead of forcing one exclusive label."
	},
	"EEB17 Module Project: 2001: A Warehouse Odyssey": {
		estimatedTime: "2–3 sessions · 35–45 minutes each",
		keyBlocks: [
			"capacity fraction",
			"compare to one half",
			"rectangular area",
			"design constraint",
			"validated recommendation"
		],
		flowNote:
			"Complete the capacity comparison before prioritizing restocks, then calculate robot area and test the recommendation against the stated movement and load constraints."
	},
	"Check-in #2": {
		estimatedTime: "1–2 sessions · 35–45 minutes each",
		keyBlocks: [
			"measurement unit",
			"area / perimeter",
			"fraction model",
			"data display",
			"quadrilateral evidence"
		],
		flowNote:
			"Collect one unit-aware measurement, one area or perimeter model, one fraction representation, one data interpretation, and one shape classification before choosing targeted review."
	}
};

const lateElementaryAModuleMetadata: Record<
	string,
	SourceLibraryModuleMetadata
> = {
	"LEA1 Place Value": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"ones / tens / hundreds",
			"expanded form",
			"exchange",
			"standard form",
			"equivalent value"
		],
		flowNote:
			"Represent the prize money before combining it, then exchange equivalent groups until the number uses the fewest place-value pieces. Verify that every exchange preserves total value."
	},
	"LEA2 Comparing and Rounding": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"compare digits",
			"rounding place",
			"benchmark",
			"estimate / exact",
			"decision evidence"
		],
		flowNote:
			"Mark the rounding place and benchmark values before rounding. Keep exact cost and distance separate from their estimates, then use both in the final comparison."
	},
	"LEA3 Addition and Subtraction": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"place-value model",
			"regrouping",
			"standard algorithm",
			"estimate",
			"inverse check"
		],
		flowNote:
			"Model the operation with place-value pieces first, connect each trade to the written algorithm, and use estimation or the inverse operation to check the result."
	},
	"LEA4 Module Project: Soccer Season": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"roster table",
			"multi-digit total",
			"rounding",
			"inequality",
			"synergy adjustment"
		],
		flowNote:
			"Build one auditable roster table, calculate exact and rounded totals, then change one player or position at a time so every synergy adjustment can be traced."
	},
	"LEA5 Factors and Multiples": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"array",
			"factor pair",
			"multiple",
			"prime / composite",
			"common factor"
		],
		flowNote:
			"Build arrays before listing factors and pair every factor with its partner. Use the completed lists to distinguish factors, multiples, prime numbers, and composite numbers."
	},
	"LEA6 Multiplication by One-Digit Numbers": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"place-value product",
			"partial products",
			"regrouping",
			"estimate",
			"reasonableness"
		],
		flowNote:
			"Decompose the multi-digit factor by place value, record each partial product, and compare the exact total with an estimate before accepting it."
	},
	"LEA7 Multiplication by Two-Digit Numbers": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"area model",
			"partial products",
			"distributive property",
			"two-digit factor",
			"estimate"
		],
		flowNote:
			"Start with an area model or decomposition, label every partial product, and explain how the extra group changes 25 × 10 into 25 × 11."
	},
	"LEA8 Division by One-Digit Numbers": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"equal groups",
			"quotient",
			"remainder",
			"interpretation",
			"multiplication check"
		],
		flowNote:
			"Represent equal groups before using a written division strategy. Interpret the remainder in the carton context and check the quotient with multiplication."
	},
	"LEA9 Module Project: Invest-a-thon": {
		estimatedTime: "3 sessions · 40–50 minutes each",
		keyBlocks: [
			"equal allocation",
			"remainder",
			"growth multiplier",
			"reallocation constraint",
			"scenario justification"
		],
		flowNote:
			"Treat all companies, multipliers, and projections as a fictional classroom dataset, not investment advice. Keep equal allocation, hypothetical selection, growth, and reallocation as separately verified stages."
	},
	"Check-in #1": {
		estimatedTime: "1–2 sessions · 40–50 minutes each",
		keyBlocks: [
			"place value / rounding",
			"operations",
			"factor / multiple",
			"multiplication / division",
			"visible verification"
		],
		flowNote:
			"Collect one place-value or rounding explanation, one multi-digit operation, one factor or multiple model, and one multiplication or division check. Use the evidence gaps to select review."
	},
	"LEA10 Lines": {
		estimatedTime: "1–2 sessions · 40–50 minutes each",
		keyBlocks: ["point", "line", "line segment", "ray", "endpoint / arrow"],
		flowNote:
			"Draw and label each figure with endpoints and arrows before comparing definitions. The drawing and the vocabulary explanation must agree."
	},
	"LEA11 Angles": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"vertex / rays",
			"degree",
			"right / acute / obtuse",
			"clockwise / counterclockwise",
			"final direction"
		],
		flowNote:
			"Trace each compass turn from a visible starting direction, label its degree measure and direction, and verify the final heading after the full route."
	},
	"LEA12 Triangles": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"side-length class",
			"angle class",
			"right / acute / obtuse",
			"equilateral / isosceles / scalene",
			"multiple classification"
		],
		flowNote:
			"Sort the same triangles once by side lengths and once by angles. Describe at least one triangle with both classifications to make the two attribute systems distinct."
	},
	"LEA13 Module Project: An Obtuse Life": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"shape attributes",
			"symmetry",
			"angle type",
			"perpendicular",
			"rotation"
		],
		flowNote:
			"Use classroom-provided images, object sketches, or original diagrams; no one needs to photograph people or private spaces. Label every requested feature, then trace the lighting rotation from 90 degrees."
	},
	"LEA14 Polygons and Perimeter": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"polygon",
			"equal sides",
			"perimeter",
			"line symmetry",
			"unit label"
		],
		flowNote:
			"Label each side before calculating the puppy-pen perimeter, then test the bed design by folding or reflecting it across the marked line of symmetry."
	},
	"LEA15 Quadrilaterals": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"parallel sides",
			"equal sides",
			"right angles",
			"quadrilateral hierarchy",
			"overlapping categories"
		],
		flowNote:
			"Classify each quadrilateral from visible side and angle evidence and place it in every category that applies. Explain category overlap instead of choosing only one name."
	},
	"LEA16 Area and Volume": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"perimeter constraint",
			"surface area",
			"face decomposition",
			"volume",
			"square / cubic units"
		],
		flowNote:
			"Choose dimensions that satisfy the 30-foot perimeter first, label every face used for tile area, and keep square-unit and cubic-unit calculations separate."
	},
	"LEA17 Module Project: The LA River Master Plan": {
		estimatedTime: "3 sessions · 40–50 minutes each",
		keyBlocks: [
			"scaled plan",
			"area decomposition",
			"remaining area",
			"perimeter",
			"unknown dimension / volume"
		],
		flowNote:
			"Build one labeled plan with a stated scale, verify used and remaining area, and then solve the pool and hot-tub dimensions with volume equations that preserve units."
	},
	"Check-in #2": {
		estimatedTime: "1–2 sessions · 40–50 minutes each",
		keyBlocks: [
			"line / angle",
			"triangle / polygon",
			"quadrilateral evidence",
			"perimeter / area",
			"volume with units"
		],
		flowNote:
			"Collect one labeled line or angle model, one shape classification, one perimeter or area calculation, and one volume calculation. Select review from missing evidence rather than assigning every option."
	}
};

const lateElementaryBModuleMetadata: Record<
	string,
	SourceLibraryModuleMetadata
> = {
	"LEB1 Equivalent Fractions": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"same whole",
			"equal parts",
			"equivalent fraction",
			"visual model",
			"multiply / divide by one"
		],
		flowNote:
			"Keep the whole fixed at 20, represent each fraction with equal parts, and explain why multiplying or dividing numerator and denominator by the same value preserves the amount."
	},
	"LEB2 Comparing and Ordering Fractions": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"same whole",
			"benchmark fraction",
			"common denominator",
			"number line",
			"ordered comparison"
		],
		flowNote:
			"Compare fractions only after confirming the same whole. Use a benchmark, common denominator, or number line, then connect the ordering to the ribbon assignment."
	},
	"LEB3 Adding and Subtracting Fractions": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"common denominator",
			"equivalent fraction",
			"add / subtract",
			"track model",
			"whole-distance check"
		],
		flowNote:
			"Shade the race distance after every change, rewrite fractions with a common denominator, and check that the final distance remains between zero and one whole race."
	},
	"LEB4 Multiplying Fractions": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"fraction of a fraction",
			"area model",
			"overlap",
			"numerator product",
			"denominator product"
		],
		flowNote:
			"Draw the first fraction in one direction and the second in another, identify the overlap, and connect that region to the multiplication expression."
	},
	"LEB5 Dividing Fractions": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"measurement division",
			"unit fraction",
			"groups in an amount",
			"visual model",
			"multiplication check"
		],
		flowNote:
			"Use the pie box to ask how many equal portions fit, label the size of one portion, and verify each division result with a related multiplication statement."
	},
	"LEB6 Module Project: Saving the Environment One Cake at a Time": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"ratio",
			"reduced fraction",
			"number line",
			"scale recipe",
			"unit label"
		],
		flowNote:
			"Treat all company, emissions, cost, and recipe values as a fixed classroom dataset rather than current factual claims. Reduce and plot the report ratios, then scale the recipe with units visible."
	},
	"LEB7 Place Value with Decimals": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"tenths / hundredths",
			"coin exchange",
			"decimal notation",
			"add decimals",
			"comparison"
		],
		flowNote:
			"Convert pennies and dimes into dollars with place-value exchanges before adding. Treat the phone price only as a comparison target, not a product recommendation."
	},
	"LEB8 Comparing and Rounding Decimals": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"align place values",
			"compare decimals",
			"rounding place",
			"benchmark",
			"interval reasoning"
		],
		flowNote:
			"Align decimal places before ranking, mark the rounding digit and benchmark values, and justify proposed third-place times as values inside the correct interval."
	},
	"LEB9 Decimal Operations": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"decimal addition",
			"decimal subtraction",
			"decimal multiplication",
			"unit price",
			"change check"
		],
		flowNote:
			"Record quantity, unit price, and item cost in one table, align decimal points, and check that subtotal plus tax plus change reconciles with the amount paid."
	},
	"LEB10 Module Project: From Facebook to YouTube": {
		estimatedTime: "3 sessions · 40–50 minutes each",
		keyBlocks: [
			"aggregate data table",
			"order decimals",
			"threshold difference",
			"fraction of total",
			"data-based recommendation"
		],
		flowNote:
			"Use only the supplied aggregate counts; no account, posting, sharing, platform access, or personal data collection is required. Verify the ordering, threshold, growth, and demographic calculations before making a hypothetical content recommendation."
	},
	"Check-in #1": {
		estimatedTime: "1–2 sessions · 40–50 minutes each",
		keyBlocks: [
			"equivalent / ordered fractions",
			"fraction operations",
			"decimal place value",
			"rounding",
			"decimal operations"
		],
		flowNote:
			"Collect one visual fraction model, one fraction operation, one decimal comparison or rounding explanation, and one labeled decimal calculation. Select review from the missing evidence."
	},
	"LEB11 Customary and Metric Units": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"conversion factor",
			"equivalent measure",
			"customary unit",
			"metric unit",
			"ranking"
		],
		flowNote:
			"Choose one common unit before ranking each group, write the conversion factor as an equality, and keep height, weight, and time comparisons in separate tables."
	},
	"LEB12 Module Project: From Factory Line to Test Drive": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"blueprint dimensions",
			"unit conversion",
			"number-line stops",
			"miles / kilometers",
			"assumption check"
		],
		flowNote:
			"Treat the vehicle and route as a unit-conversion model, not an autonomous-driving safety analysis. State each conversion factor, label every route unit, and verify the final distance in both systems."
	},
	"LEB13 Numerical Expressions": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"operation order",
			"parentheses",
			"expression",
			"step trace",
			"score comparison"
		],
		flowNote:
			"Translate each game rule into one expression, evaluate one operation at a time, and compare alternate parentheses placements before ranking scores."
	},
	"LEB14 Multiplying by Two and Three Digit Numbers": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"area model",
			"partial products",
			"multi-digit multiplication",
			"unit conversion",
			"estimate"
		],
		flowNote:
			"Decompose each factor, label partial products, convert dozens before combining quantities, and compare the production total with an estimate."
	},
	"LEB15 Dividing by Two Digit Numbers": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"two-digit divisor",
			"quotient",
			"remainder",
			"interpretation",
			"multiplication check"
		],
		flowNote:
			"Estimate the quotient, show each division step, interpret remainders in the parking and pizza contexts, and verify each result with multiplication."
	},
	"LEB16 The Coordinate Plane": {
		estimatedTime: "2 sessions · 40–50 minutes each",
		keyBlocks: [
			"x-axis / y-axis",
			"origin",
			"ordered pair",
			"horizontal / vertical",
			"route description"
		],
		flowNote:
			"Label the axes and origin before plotting, read horizontal movement before vertical movement, and verify every destination as an ordered pair."
	},
	"LEB17 Patterns, Figures and Shapes in the Coordinate Plane": {
		estimatedTime: "2–3 sessions · 40–50 minutes each",
		keyBlocks: [
			"input / output table",
			"coordinate pair",
			"additive pattern",
			"multiplicative pattern",
			"prediction check"
		],
		flowNote:
			"Build each animal table before plotting, name whether the pattern is additive or multiplicative, and check predictions by extending the same rule."
	},
	"LEB18 Module Project: Chanh's Space Adventure": {
		estimatedTime: "3 sessions · 40–50 minutes each",
		keyBlocks: [
			"coordinate orbit sketch",
			"radius / circumference",
			"unit conversion",
			"speed / period",
			"simulation assumption"
		],
		flowNote:
			"Treat the orbit work as a simplified toy model using only the stated radii, speeds, and conversion constants, not a real orbital prediction. Record assumptions, units, and each simulation adjustment before comparing results."
	},
	"Check-in #2": {
		estimatedTime: "1–2 sessions · 40–50 minutes each",
		keyBlocks: [
			"unit conversion",
			"numerical expression",
			"multiplication / division",
			"coordinate pair",
			"pattern explanation"
		],
		flowNote:
			"Collect one verified conversion, one evaluated expression, one multi-digit operation, one plotted coordinate, and one pattern explanation before assigning targeted review."
	}
};

const elementaryMathCourses = {
	earlyElementaryA: createSourceLibraryCourse({
		name: "Early Elementary A: Discovering Numbers, Operations, and Measurement",
		area: "early elementary math",
		focus: "addition, subtraction, word problems, length, place value, equal groups, rectangles, time, money, data, polygons, circles, and visual math explanations",
		splitSourceActivityAnchors: true,
		moduleMetadata: earlyElementaryAModuleMetadata,
		sourceActivityAnchors: earlyElementaryAMathSourceAnchors,
		modules: [
			"EEA1 Addition and Subtraction within 20",
			"EEA2 Addition and Subtraction within 100",
			"EEA3 Representing Word Problems",
			"EEA4 Module Project: Escape the Game",
			"EEA5 Measuring and Estimating Length in Standard Units",
			"EEA6 Relating Addition and Subtraction to Length",
			"EEA7 Module Project: The Longest Sandwich in California",
			"EEA8 Understanding Place Value",
			"EEA9 Adding and Subtracting within 200",
			"EEA10 Representing Advanced Word Problems",
			"EEA11 Adding and Subtracting within 1000",
			"EEA12 Strategies to Add and Subtract within 1000",
			"EEA13 Module Project: Going TikTok Famous",
			"Check-in #1",
			"EEA14 Working with Equal Groups",
			"EEA15 Partitioning Rectangles",
			"EEA16 Time",
			"EEA17 Money",
			"EEA18 Visualizing Data",
			"EEA19 Polygons and Circles",
			"EEA20 Module Project: The Next Hit iPhone",
			"Check-in #2"
		]
	}),
	earlyElementaryB: createSourceLibraryCourse({
		name: "Early Elementary B: Exploring Arithmetic, Fractions, and Geometry",
		area: "early elementary math",
		focus: "multi-digit operations, multiplication, division, word problems, measurement, area, fractions, data, perimeter, quadrilaterals, and geometric explanation",
		splitSourceActivityAnchors: true,
		moduleMetadata: earlyElementaryBModuleMetadata,
		sourceActivityAnchors: earlyElementaryBMathSourceAnchors,
		modules: [
			"EEB1 Adding and Subtracting within 1000",
			"EEB2 Strategies to Add and Subtract within 1000",
			"EEB3 Multiplying and Dividing within 100",
			"EEB4 Properties of Multiplication and Division",
			"EEB5 Multiplication and Division Word Problems",
			"EEB6 Applying the Four Operations",
			"EEB7 Multiples of 10",
			"EEB8 Module Project: Using Science For Good",
			"Check-in #1",
			"EEB9 Units of Measurement",
			"EEB10 Area",
			"EEB11 Module Project: Investing for the Future",
			"EEB12 Partitioning Shapes",
			"EEB13 Fractions as Numbers",
			"EEB14 Represent and Interpret Data",
			"EEB15 Perimeter",
			"EEB16 Quadrilaterals",
			"EEB17 Module Project: 2001: A Warehouse Odyssey",
			"Check-in #2"
		]
	}),
	lateElementaryA: createSourceLibraryCourse({
		name: "Late Elementary A: Investigating Multiplication, Division, and Geometry",
		area: "late elementary math",
		focus: "place value, rounding, whole-number operations, factors, multiples, multiplication, division, lines, angles, triangles, polygons, perimeter, area, and volume",
		splitSourceActivityAnchors: true,
		moduleMetadata: lateElementaryAModuleMetadata,
		sourceActivityAnchors: lateElementaryAMathSourceAnchors,
		modules: [
			"LEA1 Place Value",
			"LEA2 Comparing and Rounding",
			"LEA3 Addition and Subtraction",
			"LEA4 Module Project: Soccer Season",
			"LEA5 Factors and Multiples",
			"LEA6 Multiplication by One-Digit Numbers",
			"LEA7 Multiplication by Two-Digit Numbers",
			"LEA8 Division by One-Digit Numbers",
			"LEA9 Module Project: Invest-a-thon",
			"Check-in #1",
			"LEA10 Lines",
			"LEA11 Angles",
			"LEA12 Triangles",
			"LEA13 Module Project: An Obtuse Life",
			"LEA14 Polygons and Perimeter",
			"LEA15 Quadrilaterals",
			"LEA16 Area and Volume",
			"LEA17 Module Project: The LA River Master Plan",
			"Check-in #2"
		]
	}),
	lateElementaryB: createSourceLibraryCourse({
		name: "Late Elementary B: Mastering Fractions, Decimals, Units, and Coordinates",
		area: "late elementary math",
		focus: "fractions, decimals, unit conversion, numerical expressions, multi-digit multiplication and division, coordinate planes, patterns, figures, and geometric reasoning",
		splitSourceActivityAnchors: true,
		moduleMetadata: lateElementaryBModuleMetadata,
		sourceActivityAnchors: lateElementaryBMathSourceAnchors,
		modules: [
			"LEB1 Equivalent Fractions",
			"LEB2 Comparing and Ordering Fractions",
			"LEB3 Adding and Subtracting Fractions",
			"LEB4 Multiplying Fractions",
			"LEB5 Dividing Fractions",
			"LEB6 Module Project: Saving the Environment One Cake at a Time",
			"LEB7 Place Value with Decimals",
			"LEB8 Comparing and Rounding Decimals",
			"LEB9 Decimal Operations",
			"LEB10 Module Project: From Facebook to YouTube",
			"Check-in #1",
			"LEB11 Customary and Metric Units",
			"LEB12 Module Project: From Factory Line to Test Drive",
			"LEB13 Numerical Expressions",
			"LEB14 Multiplying by Two and Three Digit Numbers",
			"LEB15 Dividing by Two Digit Numbers",
			"LEB16 The Coordinate Plane",
			"LEB17 Patterns, Figures and Shapes in the Coordinate Plane",
			"LEB18 Module Project: Chanh's Space Adventure",
			"Check-in #2"
		]
	})
} as const;

const sourceVariantCourses = {
	scratchBootcamp: createSourceLibraryCourse({
		name: "Scratch Level 1: Game Superstar Bootcamp",
		area: "visual programming bootcamp",
		focus: "Scratch setup, sounds, motion, costumes, backdrops, event listeners, loops, conditionals, variables, and a short master project sequence",
		splitSourceActivityAnchors: true,
		moduleMetadata: {
			"GS1 Event Listeners and Movement": {
				estimatedTime: "2 sessions · 45–60 minutes each",
				keyBlocks: [
					"when green flag clicked",
					"when key pressed",
					"when this sprite clicked",
					"motion blocks",
					"sound and looks feedback"
				],
				flowNote:
					"Complete the workspace tour and Dragonfly remix first. Choose one control-focused alternate only if time permits; the goal is dependable event-to-action behavior, not six required builds."
			},
			"GS2 Loops": {
				estimatedTime: "2 sessions · 45–60 minutes each",
				keyBlocks: [
					"repeat",
					"forever",
					"wait",
					"move and turn",
					"green-flag reset"
				],
				flowNote:
					"Use Mouse Shape Loops as the required visual build. Music and effects projects are choices after repeated movement and turn patterns can be predicted before running."
			},
			"GS3 Conditionals and Variables": {
				estimatedTime: "2 sessions · 45–60 minutes each",
				keyBlocks: [
					"make a variable",
					"set variable to",
					"change variable by",
					"if then",
					"touching"
				],
				flowNote:
					"Build the Button Click Timer as the required state project. Use Zebra for extra fluency or Crab Catching as the harder collision-game path."
			},
			"GS4 Master Project": {
				estimatedTime: "3–4 sessions · 45–60 minutes each",
				keyBlocks: [
					"events",
					"loops",
					"conditionals",
					"variables",
					"broadcast or end state"
				],
				flowNote:
					"Choose one game direction, ship a minimum playable loop, test a clean restart and one edge case, then spend remaining time on feedback and polish."
			}
		},
		sourceActivityAnchors: {
			"GS1 Event Listeners and Movement": [
				{
					id: "scratch-level-1-bootcamp-gs1-event-listeners-and-movement-curriculum-source-activity-anchors-event-listeners-and-movement",
					learningPath: "core",
					title: "Scratch Account and First Project Tour",
					prompt: "Create or open a Scratch project and identify the stage, sprite list, code area, costumes, sounds, and save state. Use this setup pass to connect the project workspace to later movement, sound, and event-listener work.",
					evidence: [
						"A project workspace is open and saved with a clear title.",
						"The stage, sprites, costumes, sounds, and code blocks can be named from the interface.",
						"One note explains how Scratch projects are saved and reopened."
					]
				},
				{
					learningPath: "core",
					projectLink: "https://scratch.mit.edu/projects/592006491/",
					title: "Dragonfly Event Listener Remix",
					prompt: scratchBootcampTask("592006491"),
					evidence: [
						"The green flag starts the project and moves the sprite to a random position.",
						"The space key triggers a sound effect without needing another click.",
						"Clicking the sprite produces a visible speech bubble or equivalent feedback."
					]
				},
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/592008620/",
					title: "Beetle Keyboard Drawing Controls",
					prompt: scratchBootcampTask("592008620"),
					evidence: [
						"Arrow-key controls move the sprite in predictable directions.",
						"The reset event clears the drawing and returns the beetle to a known starting position.",
						"Each number-key event creates a different shape using repeated move and turn blocks."
					]
				},
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/287738652/",
					title: "Pencil Drawing Program Controls",
					prompt: "Use the drawing-program activity at https://scratch.mit.edu/projects/287738652/ to combine movement, turning, pen control, color changes, pen-size changes, and a reset event into one reusable drawing tool.",
					evidence: [
						"Forward, backward, left-turn, and right-turn controls are attached to key events.",
						"Pen-up, pen-down, color, and size controls change the visible drawing behavior.",
						"The green flag restores position, direction, pen size, and pen color."
					]
				},
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/287920173/",
					title: "Arrow Direction and Mouse Targeting",
					prompt: "Use https://scratch.mit.edu/projects/287920173/ as a reference for direction events. Program an arrow sprite to point in the four arrow-key directions, rotate with letter keys, and point toward the mouse when the space key is pressed.",
					evidence: [
						"The arrow keys map to up, down, left, and right headings.",
						"Letter-key rotation changes the heading by a consistent number of degrees.",
						"The mouse-targeting event visibly points the sprite toward the cursor."
					]
				},
				{
					learningPath: "challenge",
					projectLink: "https://scratch.mit.edu/projects/287924505/",
					title: "Ball Looks and Motion Event Set",
					prompt: "Use https://scratch.mit.edu/projects/287924505/ to build a small event set for a ball sprite. Combine random starting position, movement with edge bounce, backdrop changes, size changes, sound, and color effects.",
					evidence: [
						"The green flag randomizes or resets the ball state.",
						"Movement includes edge-bounce behavior instead of leaving the stage permanently.",
						"At least three visible feedback events change sound, size, color, or backdrop."
					]
				}
			],
			"GS2 Loops": [
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/592014695/",
					title: "Elephant Repeat and Forever Effects",
					prompt: scratchBootcampTask("592014695"),
					evidence: [
						"Growth and shrink actions use repeat blocks instead of duplicated manual blocks.",
						"At least one visual effect runs in a forever loop.",
						"The hide-wait-show sequence repeats with a visible timing pattern."
					]
				},
				{
					id: "scratch-level-1-bootcamp-gs2-loops-curriculum-source-activity-anchors-loops",
					learningPath: "core",
					projectLink: "https://scratch.mit.edu/projects/601699148/",
					title: "Mouse Shape Loops",
					prompt: scratchBootcampTask("601699148"),
					evidence: [
						"The reset event clears the previous drawing before a new drawing starts.",
						"Shape scripts use repeated movement and turns rather than one block per side.",
						"The extra design changes side count, turn amount, step size, or repetition count."
					]
				},
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/291117784/",
					title: "Hot Cross Buns Music Loop",
					prompt: "Use https://scratch.mit.edu/projects/291117784/ as the music-loop reference. Recreate the note pattern EDC twice, followed by CCCC, DDDD, and EDC, then use loops to reduce repetition and play the full phrase twice.",
					evidence: [
						"The Music extension is active or the project uses equivalent sound blocks.",
						"Repeated note groups are represented with loops where possible.",
						"The song plays twice from one green-flag start event."
					]
				}
			],
			"GS3 Conditionals and Variables": [
				{
					id: "scratch-level-1-bootcamp-gs3-conditionals-and-variables-curriculum-source-activity-anchors-conditionals-and-variables",
					learningPath: "core",
					projectLink: "https://scratch.mit.edu/projects/592019210/",
					title: "Button Click Timer Game",
					prompt: scratchBootcampTask("592019210"),
					evidence: [
						"A click-count variable resets at the start and increases only when the button is active.",
						"A timer variable counts down from 10 to 0.",
						"The ready-set-go sequence and game-over state are visible in the project."
					]
				},
				{
					learningPath: "challenge",
					projectLink: "https://scratch.mit.edu/projects/327610777/",
					title: "Crab Catching Game",
					prompt: "Use https://scratch.mit.edu/projects/327610777/ as the falling-object game reference. Move the crab with arrow keys, make the cheesy puffs fall from random top positions, reset missed puffs, and increase a score when the crab catches one.",
					evidence: [
						"The crab movement stays responsive during the falling-object loop.",
						"Cheesy puffs restart near the top after being caught or missed.",
						"The score variable resets at the start and increases on a collision."
					]
				},
				{
					learningPath: "choice",
					projectLink: "https://scratch.mit.edu/projects/327635693/",
					title: "Zebra Step Counter",
					prompt: "Use https://scratch.mit.edu/projects/327635693/ as the step-count reference. Create a steps variable, reset it with the green flag, move the zebra with arrow keys, switch costumes during movement, and count each step.",
					evidence: [
						"The steps variable starts at zero on a fresh run.",
						"Each movement event changes the costume or animation state.",
						"The step count increases in sync with movement events."
					]
				}
			],
			"GS4 Master Project": [
				{
					id: "scratch-level-1-bootcamp-gs4-master-project-curriculum-source-activity-anchors-master-project",
					learningPath: "core",
					title: "Bootcamp Game Selection",
					prompt: `Choose one master-project direction: [Spider Smash](https://scratch.mit.edu/projects/299272518/), [Hungry Shark](https://scratch.mit.edu/projects/608768681/) or [Save the Princess](https://scratch.mit.edu/projects/608770708/). Plan the controls, objective and ending before building.

### Spider Smash
${correctedJuniScratchInstructions("Project 2 – Spider Smash")}

### Hungry Shark
${scratchBootcampTask("608768681")}

### Save the Princess
${scratchBootcampTask("608770708")}`,
					evidence: [
						"The project plan names the selected game direction and its playable goal.",
						"The plan includes events, loops, conditionals, variables, and visible feedback.",
						"One risk note names the behavior most likely to break during implementation."
					]
				},
				{
					learningPath: "core",
					title: "Playable Scratch Game Build",
					prompt: "Build a short original Scratch game that combines motion, events, loops, conditionals, variables, costumes or backdrops, sound or visual feedback, and a clear end state.",
					evidence: [
						"The game can be started from a fresh green-flag run.",
						"Player action changes the game state in a way that can be seen or measured.",
						"The final project includes a short explanation of controls, objective, scoring or success condition, and one improvement made after testing."
					]
				}
			]
		},
		modules: [
			"GS1 Event Listeners and Movement",
			"GS2 Loops",
			"GS3 Conditionals and Variables",
			"GS4 Master Project"
		]
	}),
	usacoBronzeOnDemand: createSourceLibraryCourse({
		name: "USACO Bronze: On Demand",
		area: "self-paced competitive programming",
		focus: "USACO setup, modern standard input and output, legacy file input and output, simulation, complete search, greedy reasoning, counting, grids, strings, arrays, intervals, constructive output, and contest postmortems",
		staticAssets: [
			"UB1.png",
			"UB2.png",
			"UB3.png",
			"UB4.png",
			"UB5.png",
			"UB6.png",
			"missionTitle2.png",
			"nextStepTitle.png"
		],
		modules: [
			"UB0 Welcome to USACO Bronze!",
			"UB1 Square Pasture",
			"UB2 Your Ride Is Here",
			"UB3 Friday the Thirteenth",
			"UB4 Broken Necklace",
			"UB5 Greedy Gift Givers",
			"UB6 Milking Cows",
			"UB7 Name That Number",
			"UB8 Palindromic Squares",
			"UB9 Dual Palindromes",
			"UB10 Transformations",
			"UB11 Mixing Milk",
			"UB12 Barn Repair",
			"UB13 Combination Lock",
			"UB14 Prime Cryptarithm",
			"UB15 Ski Course Design",
			"UB16 Wormholes",
			"UB17 Block Game",
			"UB18 The Cow-Signal",
			"UB19 Don't Be Last",
			"UB20 Hoof, Paper, Scissors",
			"UB21 Cow Tipping",
			"UB22 Why Did the Cow Cross the Road",
			"UB23 Why Did the Cow Cross the Road II",
			"UB24 Why Did the Cow Cross the Road III",
			"UB25 The Lost Cow",
			"UB26 Bovine Genomics",
			"UB27 Modern Art",
			"UB28 Fence Painting",
			"UB29 Speeding Ticket",
			"UB30 Contaminated Milk",
			"UB31 Promotion Counting",
			"UB32 Angry Cows",
			"UB33 Mowing the Field",
			"UB34 Milk Pails",
			"UB35 Circular Barn",
			"UB36 Load Balancing",
			"UB37 Diamond Collector",
			"UB38 Bull in a China Shop",
			"UB39 Field Reduction",
			"UB40 Blocked Billboard",
			"UB41 The Bovine Shuffle",
			"UB42 Milk Measurement",
			"UB43 Blocked Billboard II",
			"UB44 Lifeguards",
			"UB45 Out of Place",
			"UB46 Teleportation",
			"UB47 Hoofball",
			"UB48 Taming the Herd",
			"UB49 Team Tic Tac Toe",
			"UB50 Milking Order",
			"UB51 Family Tree",
			"UB52 Additional Practice Problems"
		]
	})
} as const;

export const smartMoneyPersonalFinanceCourse = investingCourses.smartMoney;
export const moneyMindedInvestingCourse = investingCourses.moneyMinded;
export const entrepreneurship101Course = investingCourses.entrepreneurship;

export const earlyElementaryJoyOfReadingCourse = englishCourses.joyOfReading;
export const earlyElementaryPictureBookCourse = englishCourses.pictureBook;
export const introductionToPublicSpeakingCourse = englishCourses.publicSpeaking;
export const middleSchoolLiteratureCourse =
	englishCourses.middleSchoolLiterature;
export const middleSchoolWritingCourse = englishCourses.middleSchoolWriting;
export const middleSchoolWritingRetakeCourse =
	englishCourses.middleSchoolWritingRetake;
export const grammarMechanicsCourse = englishCourses.grammarMechanics;
export const novelWritingCourse = englishCourses.novelWriting;

export const earlyElementaryMathACourse =
	elementaryMathCourses.earlyElementaryA;
export const earlyElementaryMathBCourse =
	elementaryMathCourses.earlyElementaryB;
export const lateElementaryMathACourse = elementaryMathCourses.lateElementaryA;
export const lateElementaryMathBCourse = elementaryMathCourses.lateElementaryB;

export const scratchLevel1BootcampCourse = sourceVariantCourses.scratchBootcamp;

const USACO_ON_DEMAND_CONTESTS = "https://usaco.org/index.php?page=contests";
const USACO_ON_DEMAND_RULES = "https://usaco.org/index.php?page=instructions";
const USACO_ON_DEMAND_2025_BRONZE =
	"https://usaco.org/index.php?page=viewproblem2&cpid=1468";
const USACO_ON_DEMAND_2026_BRONZE =
	"https://usaco.org/index.php?page=viewproblem2&cpid=1563";
const USACO_ON_DEMAND_2026_RESULTS =
	"https://usaco.org/index.php?page=season26contest2results";
const USACO_ON_DEMAND_REPOSITORY =
	"https://github.com/instruction-material/USACO-Bronze/tree/main";
const USACO_ON_DEMAND_ANCHOR_PATHS: Record<string, string> = {
	"UB1 Square Pasture": "UB1-Square-Pasture",
	"UB6 Milking Cows": "UB6-Milking-Cows",
	"UB10 Transformations": "UB10-Transformations",
	"UB16 Wormholes": "UB16-Wormholes",
	"UB50 Milking Order": "UB50-Milking-Order",
	"UB51 Family Tree": "UB51-Family-Tree"
};

interface UsacoOnDemandStageSpec {
	sourceTitle: string;
	title: string;
	estimatedTime: string;
	keyBlocks: string[];
	flow: string;
	curriculum: RawCourseModuleItem[];
}

const usacoBronzeOnDemandSourceCourse =
	sourceVariantCourses.usacoBronzeOnDemand;
const usacoBronzeOnDemandSourceModules =
	usacoBronzeOnDemandSourceCourse.modules.filter(
		module => module.kind !== "appendix"
	);
const usacoBronzeOnDemandStaticAssets =
	usacoBronzeOnDemandSourceCourse.modules.find(
		module => module.title === "Pending Static Assets"
	);

function requireUsacoOnDemandSourceModule(title: string) {
	const module = usacoBronzeOnDemandSourceModules.find(
		candidate => candidate.title === title
	);
	if (!module) {
		throw new Error(
			`USACO Bronze: On Demand source module ${title} is missing.`
		);
	}
	return module;
}

function usacoOnDemandOptionPath(title: string): CourseItemLearningPath {
	return /extension|challenge|wormholes|cryptarithm|course design|field reduction|milking order/i.test(
		title
	)
		? "challenge"
		: "choice";
}

function buildUsacoOnDemandStage(
	spec: UsacoOnDemandStageSpec
): RawCourseModule {
	const sourceModule = requireUsacoOnDemandSourceModule(spec.sourceTitle);
	const anchorPath = USACO_ON_DEMAND_ANCHOR_PATHS[spec.sourceTitle];

	return {
		title: spec.title,
		estimatedTime: spec.estimatedTime,
		keyBlocks: spec.keyBlocks,
		curriculum: [
			{
				title: "Self-Paced Stage Map",
				content: `**Course flow:** ${spec.flow}`,
				learningPath: "core"
			},
			...spec.curriculum.map(item => ({
				...item,
				learningPath: "core" as const
			})),
			...sourceModule.curriculum.map((item, index) => ({
				...item,
				learningPath: "core" as const,
				...(index === 0 && anchorPath
					? {
							projectLink: `${USACO_ON_DEMAND_REPOSITORY}/${anchorPath}/starter`,
							solutionLink: `${USACO_ON_DEMAND_REPOSITORY}/${anchorPath}/solution`
						}
					: {})
			}))
		],
		supplementalProjects: sourceModule.supplementalProjects.map(item => ({
			...item,
			learningPath: usacoOnDemandOptionPath(item.title)
		}))
	};
}

function buildUsacoOnDemandArchive(
	title: string,
	moduleTitles: string[],
	keyBlocks: string[],
	scope: string
): RawCourseModule {
	return {
		kind: "appendix",
		title,
		estimatedTime: "Choose one problem for a diagnosed gap or spaced retry",
		keyBlocks,
		curriculum: [
			{
				title: "Archive Scope Guide",
				content: [
					`**Course flow:** ${scope}`,
					"",
					"**Selection rule:** Choose a problem because a stage gate exposed a specific weakness, because a solved pattern needs a spaced retry, or because every current core task is already independent. One careful attempt, postmortem, and later rewrite is more valuable than racing through the archive.",
					"",
					"**Help sequence:** Read and trace first, request one narrow hint only after recording the blocked step, continue independently, and open a solution only after preserving the attempt and smallest failing case. Close the solution before rewriting from an empty file on a later day."
				].join("\n"),
				learningPath: "core"
			}
		],
		supplementalProjects: moduleTitles.flatMap(moduleTitle => {
			const module = requireUsacoOnDemandSourceModule(moduleTitle);
			return [...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					title: `${module.title}: ${item.title}`,
					learningPath: usacoOnDemandOptionPath(item.title)
				})
			);
		})
	};
}

const usacoBronzeOnDemandPrimaryModules = [
	buildUsacoOnDemandStage({
		sourceTitle: "UB0 Welcome to USACO Bronze!",
		title: "UB0 On-Demand Setup, Rules, and Placement",
		estimatedTime: "2–3 sessions · 45–75 minutes each",
		keyBlocks: [
			"live contest rules",
			"modern standard input and output",
			"legacy file input and output",
			"placement evidence",
			"self-paced help ladder",
			"protected practice"
		],
		flow: "Set up one reliable language workflow, read the current rules, and complete a two-problem placement attempt before choosing an entry stage. Placement can skip familiar instruction, but it does not waive the protected mock or final readiness gate.",
		curriculum: [
			{
				title: "Current USACO Contest and I/O Contract",
				content: [
					"Current contests generally contain three or four algorithmic problems in one four-to-five-hour personal window and award partial credit by test case. Promotion thresholds, schedules, language versions, and certification details can change, so the live instructions and contest page remain authoritative.",
					"",
					"Current problems use terminal-based standard input and output. Many problems from before December 2020 use exact, case-sensitive filenames listed in the statement. Match the specified mode, print only the requested output, and classify judge results as accepted, wrong answer, time limit, runtime or memory error, compile failure, or output-format failure."
				].join("\n"),
				projectLink: USACO_ON_DEMAND_RULES
			},
			{
				title: "Placement Attempt and Entry Decision",
				content: [
					"**Attempt:** Select two unseen Bronze problems from different patterns. Use an empty file, a 75-minute limit per problem, and no hints or solutions. Record the statement facts, constraints, planned complexity, sample result, custom tests, and final judge result.",
					"",
					"**Entry decision:** Start at Stage 1 when either problem reveals setup, translation, or testing gaps. Start at the first later stage whose pattern cannot be solved and explained independently. A clean solve includes exact I/O, a constraint-safe method, boundary tests, and a brief correctness argument.",
					"",
					"**Spaced check:** Re-solve one placement problem from an empty file after at least two days. A remembered script does not count as transfer; the new record needs an independently reconstructed model and tests."
				].join("\n")
			},
			{
				title: "Help Ladder and Contest Integrity",
				content: [
					"**Course practice:** First preserve the attempt and name the blocked step. Next use one diagnostic hint, return to the problem, and compare a solution only after the attempt can no longer progress. Close all reference code before completing a later independent rewrite.",
					"",
					"**Active contests and protected mocks:** Work alone. Generative AI, Copilot-style assistance, discussion, shared code, prewritten templates, solution resources, and automated submissions are prohibited. Only basic language syntax, library, and input/output references are permitted.",
					"",
					"**Evidence:** Begin from an empty solution file, retain the submitted source and result, and write the postmortem only after the timer ends."
				].join("\n"),
				projectLink: USACO_ON_DEMAND_RULES
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB1 Square Pasture",
		title: "Stage 1: Simulation and Exact Translation",
		estimatedTime: "4 sessions · 45–75 minutes each",
		keyBlocks: [
			"state model",
			"literal translation",
			"update order",
			"tiny oracle",
			"boundary tests",
			"independent retry"
		],
		flow: "Translate each story into state, transitions, stopping conditions, and an answer update. Complete Square Pasture as the anchor, choose one targeted archive problem, then pass the stage gate from an empty file before advancing.",
		curriculum: [
			{
				title: "Simulation Attempt Protocol",
				content: [
					"**Before code:** Name the full state, one legal transition, update order, stopping condition, and answer update.",
					"**Tiny oracle:** Hand-compute a minimum case, a typical case, and a boundary or overshoot case.",
					"**After code:** Compare each state change with the oracle, then add a test where changing update order changes the result.",
					"**Complexity:** Count simulated steps and compare that count with the largest legal input."
				].join("\n")
			},
			{
				title: "Stage 1 Mastery Gate",
				content:
					"Without notes, solve a fresh direct-simulation problem, explain the invariant that remains true after every update, and repair one deliberately broken boundary case. Advance when the code, trace, and explanation agree; otherwise choose one problem from the Foundation Archive and retry the gate later."
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB10 Transformations",
		title: "Stage 2: Strings, Modular Arithmetic, and Grids",
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"string traversal",
			"modular arithmetic",
			"grid coordinates",
			"rotation and reflection",
			"case ordering",
			"visual trace"
		],
		flow: "Use Transformations as the anchor for grid representation and ordered cases, then connect the same exactness to strings and modular arithmetic. Advance only after a fresh case can be modeled without copying the anchor.",
		curriculum: [
			{
				title: "Representation and Case-Order Contract",
				content:
					"Write the representation before the algorithm: character index, row and column convention, transformation formula, and comparison rule. Keep rotation, reflection, and combinations as named operations. Test an asymmetric tiny grid so incorrect transformations cannot pass by coincidence, and preserve the required case order from the statement."
			},
			{
				title: "Stage 2 Mastery Gate",
				content:
					"Solve one unseen string or modular-arithmetic problem and one small grid transformation from an empty file. For each, provide a non-example that distinguishes the chosen rule from a tempting wrong rule. Use the Foundation Archive for targeted repair when either representation remains unclear."
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB6 Milking Cows",
		title: "Stage 3: Arrays, Intervals, Counting, and Greedy",
		estimatedTime: "5 sessions · 45–75 minutes each",
		keyBlocks: [
			"constraint budget",
			"sorted intervals",
			"frequency counts",
			"one-pass invariant",
			"greedy exchange",
			"64-bit range"
		],
		flow: "Use Milking Cows to make interval merging and one-pass invariants concrete, then choose array, count, sorting, or greedy representations from the constraints rather than from habit.",
		curriculum: [
			{
				title: "Constraint, Numeric-Range, and Greedy Contract",
				content: [
					"Record every input bound, any total bound across test cases, the proposed operation count, and the largest possible index, count, distance, sum, and product. Use 64-bit storage when a legal result can exceed 32-bit range.",
					"",
					"For interval or greedy work, state the sorted order, the information retained during one scan, and the invariant after each processed item. Name the local choice and explain why delaying or exchanging it cannot improve the final result."
				].join("\n")
			},
			{
				title: "Stage 3 Mastery Gate",
				content:
					"Complete one fresh interval or counting task with a constraint table, safe numeric types, a one-pass or sorted invariant, and tests for touching, nested, disjoint, and extreme cases. Use the Classical Search and Simulation Archive for one spaced retry before Stage 4."
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB16 Wormholes",
		title: "Stage 4: Complete Search and Structured State",
		estimatedTime: "6 sessions · 45–90 minutes each",
		keyBlocks: [
			"candidate state space",
			"complete enumeration",
			"valid-state filter",
			"termination argument",
			"structured simulation",
			"counterexample"
		],
		flow: "Use Wormholes to distinguish a provably small complete search from an unbounded brute-force attempt. Count the candidate space, generate every legal state once, and validate each state with a terminating simulation.",
		curriculum: [
			{
				title: "Complete-Search Proof Record",
				content: [
					"**Candidate space:** Define one candidate, count the worst-case number of candidates, and identify when an incomplete state can be rejected.",
					"**Coverage:** Explain why every legal candidate appears exactly once or why duplicates do not affect the answer.",
					"**Validation:** State the simulation invariant and termination condition for each candidate.",
					"**Debugging:** Preserve the smallest candidate that exposes a missing case, duplicate, or non-terminating path."
				].join("\n")
			},
			{
				title: "Stage 4 Mastery Gate",
				content:
					"Solve a fresh bounded-search problem and defend the maximum candidate count before running it. Then contrast it with a structured-state problem where enumeration is unnecessary. Advance when both complexity arguments fit the largest legal input."
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB52 Additional Practice Problems",
		title: "Stage 5: Modern Bronze Patterns and Construction",
		estimatedTime: "5 sessions · 45–90 minutes each",
		keyBlocks: [
			"maps and sets",
			"prefix counts",
			"large input",
			"constructive witness",
			"multiple test cases",
			"aggregate bound"
		],
		flow: "Add modern Bronze patterns that are underrepresented in the historical archive: sparse counting, distinct-state tracking, prefix counts, large inputs, multiple test cases, and constructive outputs that require a valid witness.",
		curriculum: [
			{
				title: "Current Counting and Large-Input Calibration",
				content:
					"Use the official 2025 Bronze problem as a current calibration. Its input reaches one million values, asks for distinct ordered patterns, uses standard input, and warns that the answer may need 64-bit storage. Compare a direct array, map, set, sorting, and prefix-count approach before choosing the representation that fits the value range and query shape.",
				projectLink: USACO_ON_DEMAND_2025_BRONZE
			},
			{
				title: "Constructive and Multi-Test Contract",
				content:
					"When a problem asks for feasibility and an example, validate the witness by replaying it against the original rules rather than checking only YES or NO. Reset every per-case data structure, use the total-input bound to justify aggregate runtime, and test one impossible case, one minimum witness, and one case with several valid witnesses.",
				projectLink: USACO_ON_DEMAND_2026_BRONZE
			},
			{
				title: "Stage 5 Mastery Gate",
				content:
					"Solve one recent official Bronze problem from an empty file, state why the chosen representation fits the full constraints, and validate every required output component. Use the Modern Bronze Patterns Archive for a diagnosed weakness, then repeat a related problem after at least two days."
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB50 Milking Order",
		title: "Stage 6: Protected Mock Contest and Postmortem",
		estimatedTime: "4–6 sessions · 60–90 minutes each",
		keyBlocks: [
			"three-problem mock",
			"attempt ordering",
			"partial-credit plan",
			"judge diagnosis",
			"smallest counterexample",
			"independent rewrite"
		],
		flow: "Complete a protected three-problem mock under active-contest restrictions, preserve every submission, and turn each unsolved or partial result into a specific diagnosis and later independent rewrite.",
		curriculum: [
			{
				title: "Protected Mock Contract",
				content: [
					"Use three unseen Bronze problems, one continuous timer, an empty file per problem, permitted syntax/library references only, and no AI, hints, discussion, templates, or solution viewing.",
					"",
					"Record first-read complexity, attempt order, submission time, and judge outcome. A partial-credit plan may target a correct subtask before the full constraints, but every submitted approach still needs an honest complexity bound."
				].join("\n"),
				projectLink: USACO_ON_DEMAND_RULES
			},
			{
				title: "Postmortem and Delayed Rewrite",
				content:
					"For every unsolved or partially solved problem, preserve the last attempt, classify the failure as statement, model, complexity, implementation, test design, or I/O, and find the smallest counterexample. Study the official explanation only after this record exists. Close all reference code, wait until a later study block, and produce a clean rewrite from an empty file.",
				projectLink: USACO_ON_DEMAND_2026_RESULTS
			}
		]
	}),
	buildUsacoOnDemandStage({
		sourceTitle: "UB51 Family Tree",
		title: "Stage 7: Bronze Exit Portfolio and Silver Readiness",
		estimatedTime: "2–4 sessions · 45–90 minutes each",
		keyBlocks: [
			"independent accuracy",
			"cross-pattern transfer",
			"postmortem repair",
			"live promotion result",
			"Silver prerequisites",
			"next-course plan"
		],
		flow: "Consolidate independent evidence across more than one mock, compare the portfolio with the live contest result, and move to Silver only when Bronze accuracy and repair habits are repeatable.",
		curriculum: [
			{
				title: "Bronze Exit Portfolio",
				content:
					"Submit two complete independent solves from each of two protected mocks, one successful delayed rewrite of a previously missed problem, a constraint and complexity record, a smallest-counterexample postmortem, and one cross-pattern explanation comparing two different solution structures."
			},
			{
				title: "Silver Readiness Gate",
				content:
					"Promotion thresholds vary by contest, so the official live result remains authoritative. For the learning transition, demonstrate repeatable statement parsing, exact I/O, a constraint-safe approach, independent implementation, boundary testing, and repair after failure. Continue targeted Bronze practice when any of those habits still depends on hints or remembered code.",
				projectLink: USACO_ON_DEMAND_CONTESTS
			}
		]
	})
];

const usacoBronzeOnDemandArchives = [
	buildUsacoOnDemandArchive(
		"Optional Foundation Problem Archive",
		[
			"UB2 Your Ride Is Here",
			"UB3 Friday the Thirteenth",
			"UB4 Broken Necklace",
			"UB5 Greedy Gift Givers",
			"UB7 Name That Number",
			"UB8 Palindromic Squares",
			"UB9 Dual Palindromes",
			"UB11 Mixing Milk"
		],
		[
			"strings and modular arithmetic",
			"calendar simulation",
			"sequences",
			"nested loops",
			"exact translation"
		],
		"Use these early historical problems to repair setup, translation, string, modular-arithmetic, and small-loop gaps from Stages 1–2."
	),
	buildUsacoOnDemandArchive(
		"Optional Classical Search and Simulation Archive",
		[
			"UB12 Barn Repair",
			"UB13 Combination Lock",
			"UB14 Prime Cryptarithm",
			"UB15 Ski Course Design",
			"UB17 Block Game",
			"UB18 The Cow-Signal",
			"UB19 Don't Be Last",
			"UB20 Hoof, Paper, Scissors",
			"UB21 Cow Tipping",
			"UB22 Why Did the Cow Cross the Road",
			"UB23 Why Did the Cow Cross the Road II",
			"UB24 Why Did the Cow Cross the Road III",
			"UB25 The Lost Cow"
		],
		[
			"bounded search",
			"grid simulation",
			"state tracking",
			"interval reasoning",
			"case analysis"
		],
		"Use this bank after Stages 3–4 to target classical interval, complete-search, grid, and state-simulation patterns."
	),
	buildUsacoOnDemandArchive(
		"Optional Modern Bronze Patterns Archive",
		[
			"UB26 Bovine Genomics",
			"UB27 Modern Art",
			"UB28 Fence Painting",
			"UB29 Speeding Ticket",
			"UB30 Contaminated Milk",
			"UB31 Promotion Counting",
			"UB32 Angry Cows",
			"UB33 Mowing the Field",
			"UB34 Milk Pails",
			"UB35 Circular Barn",
			"UB36 Load Balancing",
			"UB37 Diamond Collector",
			"UB38 Bull in a China Shop",
			"UB39 Field Reduction"
		],
		[
			"counting",
			"coordinate reasoning",
			"interval coverage",
			"complete search",
			"constraint analysis"
		],
		"Use these problems to deepen counting, coordinates, coverage, simulation, and bounded-search patterns after the corresponding core stage is secure."
	),
	buildUsacoOnDemandArchive(
		"Optional Late Bronze Practice Archive",
		[
			"UB40 Blocked Billboard",
			"UB41 The Bovine Shuffle",
			"UB42 Milk Measurement",
			"UB43 Blocked Billboard II",
			"UB44 Lifeguards",
			"UB45 Out of Place",
			"UB46 Teleportation",
			"UB47 Hoofball",
			"UB48 Taming the Herd",
			"UB49 Team Tic Tac Toe"
		],
		[
			"late Bronze transfer",
			"multi-step simulation",
			"ranking and state changes",
			"geometry",
			"mock-contest selection"
		],
		"Use this bank for mixed-pattern transfer, mock replacement problems, or a final targeted repair before the Bronze exit portfolio."
	)
];

if (!usacoBronzeOnDemandStaticAssets) {
	throw new Error(
		"USACO Bronze: On Demand static-asset appendix is missing."
	);
}

export const usacoBronzeOnDemandCourse: RawCourse = {
	...usacoBronzeOnDemandSourceCourse,
	modules: [
		...usacoBronzeOnDemandPrimaryModules,
		...usacoBronzeOnDemandArchives,
		usacoBronzeOnDemandStaticAssets
	]
};
