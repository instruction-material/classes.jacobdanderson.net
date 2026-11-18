export interface ReadingPractice {
	title: string;
	prompt: string;
	anchor: string;
}
export interface ReadingGuidance {
	module: string;
	method: string;
	worked: string;
	practice: ReadingPractice;
	challenge: ReadingPractice;
}
export const joyOfReadingGuidance: ReadingGuidance[] = [
	{
		module: "JoR1 Characters",
		method: "A character is a person, animal or other being in a story. An appearance detail describes how a character looks, such as coat color or height; a trait describes a pattern such as patience or generosity. An inference is an idea drawn from clues rather than a direct statement. An action or spoken line can support an inference about a trait. Explain how the detail supports the inference instead of merely copying it. A single action supports a claim about that moment; it may not establish an unchanging personality.",
		worked: "Practice passage: Nia wore a green coat. When Ari dropped the seed packets, Nia gathered them and sorted each label. She stayed after the others left to finish. Green coat is an appearance detail. Helpful is supported by gathering Ari’s packets; patient is supported by staying to sort them. A three-sentence report can name Nia, explain one action and infer its effect: Nia helps Ari after the spill. Sorting the labels shows care. Without that action, the group might plant seeds in the wrong places.",
		practice: {
			title: "Character Evidence Practice",
			prompt: "Read this complete practice passage: Eli’s boots were yellow. A gust scattered the display cards. Eli pinned one corner of each card, checked the labels and tried a second pin when the first failed. Jo said, Thank you for staying. Separate one appearance detail from two action details. Infer a trait and explain its evidence in three sentences.",
			anchor: "character-evidence-practice"
		},
		challenge: {
			title: "Character Inference Challenge",
			prompt: "Read this complete practice passage: Mara ran toward the gate as the bell rang. She stopped, helped a child lift a fallen bag, then ran again. A reader calls Mara careless because she runs. Give a better-supported inference and explain one thing the passage does not establish.",
			anchor: "character-inference-challenge"
		}
	},
	{
		module: "JoR2 Plot",
		method: "Plot is the connected sequence of events around a problem. Exposition introduces the characters and setting. Rising action develops the problem through attempts or complications. The climax is the decisive turning point. Falling action shows its immediate results, and resolution shows the situation after the main problem is settled. Explain the event’s function when assigning a label. A loud event is not automatically the climax.",
		worked: "Practice story: Sam prepares a paper-boat race beside a shallow tub. The first boat tips over. Sam folds a wider base and tests it. The next launch stays upright and reaches the far edge. Sam uses that design for the race. Exposition: race preparation. Rising action: the failed launch and revised fold. Climax: the successful test resolves whether the new design works. Falling action: the boat reaches the edge. Resolution: Sam selects the tested design. The turning point matters because it changes the plan from uncertain to usable.",
		practice: {
			title: "Plot Sequence Practice",
			prompt: "Read this complete practice story: A class needs a sign for its garden. Rain washes the first letters away. Bea tries paint on a scrap and lets it dry. Water beads on the new letters without washing them away. The class paints the full sign and hangs it. Name the problem and place the events into exposition, rising action, climax, falling action and resolution. One event may serve two neighboring functions when the reason is clear.",
			anchor: "plot-sequence-practice"
		},
		challenge: {
			title: "Plot Turning Point Challenge",
			prompt: "Read this complete practice story: Ivo has to carry a tall model through a low doorway. He tries lifting it and tilting it, but both fail. A loud cart rattles past. Ivo notices the model has a removable top, takes it off and carries both parts through. Choose the climax and explain why the loud cart is not the strongest choice.",
			anchor: "plot-turning-point-challenge"
		}
	},
	{
		module: "JoR Check-In #1",
		method: "A combined reading response connects a character’s action to a plot change. Identify the problem, find the action that changes it, and distinguish an inferred trait from an explicit detail. A labeled drawing, oral explanation or short paragraph can carry the same evidence. A prediction must be labeled as an inference rather than described as an event that already happened.",
		worked: "Practice story: Asha and Ben have one dry sheet for a poster. Ben reaches for dark paint, but Asha first tests it on a small corner. The color spreads too far, so they choose a pencil outline and finish a readable poster. Asha’s test supports cautious or thoughtful. The spreading paint is a complication; choosing the outline is the turning point. A prediction that a second poster may use pencil is plausible, but the story does not say that a second poster is made.",
		practice: {
			title: "Character and Plot Practice",
			prompt: "Read this complete practice story: Tavi’s group has to move a stack of books before the room closes. Tavi tries carrying the whole stack and drops two. Lee brings a small cart, holds it steady and helps load it. They move the books safely. Describe one supported trait for Lee and identify the problem, an unsuccessful attempt, the turning point and the resolution.",
			anchor: "character-and-plot-practice"
		},
		challenge: {
			title: "Character and Plot Challenge",
			prompt: "Read this complete practice passage: Noor reaches the finish line first. She returns to guide a confused teammate along the marked path. The team finishes together. Compare the claims Noor is fast and Noor is supportive. Give evidence for each and explain which action changes the team’s outcome.",
			anchor: "character-and-plot-challenge"
		}
	},
	{
		module: "JoR3 Reading Literature",
		method: "A summary selects the events needed to understand the main problem and outcome. A storyboard arranges those events in sequence; each panel includes a caption explaining its place in the story. A theme or lesson is an idea supported by the events, not merely a topic such as friendship. Different lessons can be defensible when the evidence explains them. Keep an opinion about the story separate from what the story actually states.",
		worked: "Practice story: Rae volunteers to deliver a class display. She puts every object into one thin bag. The handle tears. Rae asks Kit for a box, sorts heavy objects underneath light ones and makes a second trip. The display arrives intact. Six useful panels show volunteering, overpacking, the tear, asking for a box, careful repacking and safe arrival. A supported lesson is that asking for help and changing a plan can solve a problem; the box and successful second trip provide evidence.",
		practice: {
			title: "Literature Storyboard Practice",
			prompt: "Read this complete practice story: Pia promises a banner for the class play. She measures the wall. She cuts paper too short. She joins two pieces with a backing strip. She tests the join before painting. The finished banner hangs safely. Make six numbered scene captions and explain a supported lesson in one sentence.",
			anchor: "literature-storyboard-practice"
		},
		challenge: {
			title: "Literature Summary Challenge",
			prompt: "Read this complete practice passage: Two friends want different places for a reading bench. One spot is sunny but blocks a path; the other is quiet but muddy. They find a dry corner clear of the path and agree to use it. Write a two-sentence summary and support a lesson that applies beyond the bench.",
			anchor: "literature-summary-challenge"
		}
	},
	{
		module: "JoR4 Reading Informational Texts",
		method: "An informational text explains a subject using stated details. The central idea tells what those details mainly explain; the topic alone is too broad. Who, what, when, where, why and how are useful questions, but a text may leave some unanswered. Mark missing information rather than inventing it. Distinguish a recorded observation from an interpretation. A news script can introduce the main idea, report selected details and finish by explaining their significance.",
		worked: "Invented practice notice: On Tuesday, the Hill School garden group placed three labeled rain gauges in its courtyard. The group will record water depth after each rain to compare the three locations. The notice’s central idea is that the group is preparing a location comparison. Who: the garden group. What: three gauges. When: Tuesday. Where: courtyard. Why: compare recorded depths. The notice does not give a calendar date or claim which location will collect the most water.",
		practice: {
			title: "Informational Main Idea Practice",
			prompt: "Read this complete invented notice: On Friday, the Brook Library team added four low shelves to its children’s room. The shelves hold picture books with covers facing outward. The team wants young readers to find books by looking at the covers. Identify the central idea and three supporting details. Write a three-sentence report. Mark one question the notice does not answer.",
			anchor: "informational-main-idea-practice"
		},
		challenge: {
			title: "Informational Evidence Challenge",
			prompt: "Read this complete invented notice: Twelve children tried a new return tray on Monday. Ten placed their books in it without asking for help; two asked where books belonged. The notice says the library will try clearer labels next week. Compare The tray worked for every child with Most children used the tray without help. Which claim is better supported, and what further information could help?",
			anchor: "informational-evidence-challenge"
		}
	},
	{
		module: "JoR5 Figurative Language",
		method: "Literal meaning uses the words in their ordinary direct sense. Figurative language makes a comparison or uses an expression whose intended meaning differs from the literal picture. A simile makes an explicit comparison, often with like or as. A metaphor describes one thing as another. An idiom has a common meaning that cannot be recovered by interpreting each word literally. Personification gives a nonhuman thing a human action or quality. Categories can overlap, and context controls the interpretation.",
		worked: "In The test was a breeze, the test is compared to an easy light wind: the intended meaning is that it was easy. This can be described as a metaphor and an idiomatic expression. In The kettle sang a cheerful song, the kettle is given a human musical action, so personification is supported. Forceful movement alone, such as wind whipping through hair, does not necessarily give the wind a human action.",
		practice: {
			title: "Figurative Meaning Practice",
			prompt: "For each complete sentence, name the intended meaning and a supported language type: The kitten was as quiet as a shadow. After two failures, the puzzle was a hard nut to crack. The old door groaned, Please close me. Describe a literal drawing and explain how it differs from the intended meaning.",
			anchor: "figurative-meaning-practice"
		},
		challenge: {
			title: "Figurative Context Challenge",
			prompt: "Compare The spoon is silver with The lake is a silver mirror. Then compare The wind moved the leaves with The wind whispered a secret to the leaves. Identify the plain descriptions and the supported figurative readings, with reasons.",
			anchor: "figurative-context-challenge"
		}
	},
	{
		module: "JoR Check-In #2",
		method: "A literature review combines a brief summary, a supported interpretation and an opinion with reasons. An informational response identifies a central idea and explains how selected details support it. When discussing figurative language, quote or identify the actual phrase, explain the intended meaning and give a reason for the label. An imagined interview answer remains an imagined answer even when it is consistent with source facts.",
		worked: "Practice story: Leon calls his bent model a lost cause. He is as quiet as a mouse until Ana brings a brace. The model stands, and Leon thanks her. A review can summarize the repair and infer that help changes Leon’s outlook. Lost cause is an idiom for something considered hopeless; as quiet as a mouse is a simile. Claiming three examples when only two are supplied would invent evidence.",
		practice: {
			title: "Literature Review Check",
			prompt: "Read this complete practice story: Mina says her first drawing is a mountain of mistakes. She is as still as a statue while Jo studies it. Jo points out one strong shape; Mina revises the rest and says the page is finally singing. Write a short review, identify three figurative examples and explain one supported change in Mina’s outlook.",
			anchor: "literature-review-check"
		},
		challenge: {
			title: "Informational Report Check",
			prompt: "Read this complete invented notice: A school tried two labels for the same art-supply box. On day 1, 8 of 12 children found the box using only the label Brushes. On day 2, 11 of 12 found it using Brushes plus a picture. Give the central idea and three details. Explain why the two-day observation does not prove that the picture will help every child in every room.",
			anchor: "informational-report-check"
		}
	},
	{
		module: "JoR6 Master Project",
		method: "Choose one complete final response: a literature review or figurative-language art response, or an informational interview or news report. A plan names the selected text, its summary or central idea, three evidence details and the audience. Completion includes the finished response and one revision supported by an evidence check. For literature, connect interpretation and opinion to events. For information, keep facts, uncertainty and imagined interview answers distinct.",
		worked: "Practice passage: Rin notices that the class map has no route labels. Rin adds arrows and asks two classmates to follow them. Both reach the garden. Rin changes one faint arrow after their feedback. A compact review can summarize the labeling and test, infer that Rin is responsive to feedback, and cite the arrows, the trial and the revised mark. An opinion such as The test makes the ending convincing is supported by the classmates actually following the route.",
		practice: {
			title: "Final Literature Response Practice",
			prompt: "Read this complete practice passage: Omi wants a display that can travel. The first stand wobbles. Omi asks two classmates to test a wider base. The base holds, and Omi redraws the instructions so another group can build it. Write a four-sentence review with a summary, a supported lesson, an opinion with a reason, and a sentence identifying one revision made to improve the review.",
			anchor: "final-literature-response-practice"
		},
		challenge: {
			title: "Final News Response Challenge",
			prompt: "Read this complete invented notice: On Wednesday, the Pine School club placed six new route signs between the gate and garden. Two groups followed the arrows to check the route. Both arrived without directions from a leader. The club plans to check the signs again after rain. Write either a short news script or a question-and-answer interview. Use three stated facts, keep the future rain check separate from observed results, and label any imagined answer.",
			anchor: "final-news-response-challenge"
		}
	}
];
