import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";
import {
	applyWritingPractice,
	middleSchoolWritingPractice
} from "./writingPractice";

const carRide = `
## Original practice passage: Car Ride

1. Kazim pressed his folded invitation flat against his knee as the car turned onto Willow Street.
2. "We can go home if you want," his aunt said.
3. He shook his head, then checked the address again.
4. Beyond the window, other students carried cardboard bridges toward the hall.
5. Kazim slid his own small model out from under his coat and straightened a bent support.
6. "Could we park nearer the door?" he asked.
7. When the car stopped, he stayed still until his aunt reached for the handle.
8. "Wait for me," he said, lifting the model with both hands.

This is an original fictional practice text. Cite its title and line numbers;
observations about Kazim belong to this passage.
`.trim();

const readings: Record<string, string> = {
	"MSB1 Arguments & Evidence": `
A claim is the position an argument asks a reader to accept. A reason explains
why that position is reasonable. Evidence supplies a specific observation, fact,
example or passage detail. Analysis explains how the evidence supports the claim;
repeating the claim does not supply evidence.

## Worked model

These basketball practice records are fictional, not statistics for Steph Curry
or another real athlete.

| Player | Session 1 | Session 2 |
| --- | --- | --- |
| A | 9 made of 10 attempts | 6 made of 10 attempts |
| B | 12 made of 20 attempts | 13 made of 20 attempts |

Claim: A is the stronger choice for an accuracy-focused practice award.
Reason: that award values the fraction of attempts made. Evidence: A made 15/20
shots, or 75%; B made 25/40, or 62.5%. Analysis: the higher success rate supports
the stated accuracy criterion despite B's larger total. These records do not
establish which player is best in every setting.

"A made 15 shots" reports a table entry; the award claim asks the reader to accept
a judgment about what matters. Define the criterion before judging.

For the other source prompts, use these fictional starting cases or state a
different case explicitly: a classroom permits phones for a research task but has
interruptions when they remain on desks; a dance group composes and revises an
eight-count sequence to express surprise; a household compares the two individual
shelter animals in MSB3. Separate supplied facts from assumptions.
`.trim(),
	"MSB2 Counterclaims": `
A counterclaim is a plausible competing position. A concession accepts a valid
part of it; a response explains why the main claim still holds, changes its scope
or needs revision. A straw-person argument makes an opposing position artificially
weak instead of addressing its strongest form.

## Worked model

For the MSB1 award, a reasonable counterclaim is that B deserves recognition for
making 25 shots rather than A's 15. This values total output. A response can concede
B's larger total, then explain why an accuracy award uses made shots divided by
attempts. If the criterion instead rewards total baskets, the recommendation
changes. Calling B a bad player does not answer the objection.

Hypothetical Hannah represents a reader asking what assumption an opponent might
reject. Try: "If total baskets matters most, B has the stronger case. However,
under the stated accuracy criterion, A's 75% rate exceeds B's 62.5%." Conditional
language identifies when a claim applies. However signals contrast but does not
replace its explanation.

Write the strongest objection and identify its evidence. Choose a reasoned
response or revise the original claim when the objection reveals a real weakness.

[Counterargument](https://writingcenter.fas.harvard.edu/counterargument)
`.trim(),
	"MSB3 Integrating Evidence": `
A quotation reproduces exact words. A paraphrase expresses the source's meaning
in new wording. Both need enough context to identify the evidence. The surrounding
sentence must remain grammatical; quotation marks alone do not establish truth.

## Worked quotation patterns

Original fictional shelter notes supply these practice inputs:

- Dog note: "This dog needs a fenced exercise area."
- Cat note: "This cat is comfortable in a small, quiet home."

These notes describe two invented individual animals, not all dogs or cats. For
a fictional household with a small, quiet apartment and no fenced area, the cat
note supports a better fit under those conditions.

- Complete introductory sentence plus colon: The dog note names a requirement:
  "This dog needs a fenced exercise area."
- Introductory phrase plus comma: According to the cat note, "This cat is
  comfortable in a small, quiet home."
- Words integrated into the sentence: The cat note describes a "small, quiet home."

"According to the note:" is an incomplete introductory phrase, not a complete
sentence introducing a colon. Check grammar before choosing punctuation. In the
US convention used here, commas and periods normally fall inside quotation marks.
With a parenthetical source citation, the sentence's final period follows it:
The cat fits this setting because the note describes a "small, quiet home"
(cat note). Follow the evidence with the reasoning that makes it relevant.

[Quotation punctuation](https://owl.purdue.edu/owl/general_writing/punctuation/quotation_marks/more_quotation_mark_rules.html)
`.trim(),
	"MSB4 Analyzing Evidence": `
An inference draws a conclusion from details rather than repeating a statement
the text directly supplies. Summary recounts events; analysis explains how those
events support an interpretation. More than one interpretation can be defensible.

${carRide}

## Worked paragraph model

Kazim seems hesitant about entering but still interested in taking part. Offered
a ride home, he "shook his head" (Car Ride, line 3), choosing to stay. Nearby parking
and his pause in the car suggest that entering is difficult for him. However,
lifting the model with both hands may instead show concern about protecting it.
The text supports a cautious inference about hesitation while leaving his motive
uncertain.

"This shows he is hesitant" names an interpretation without explaining it.
Connect the choice, its context and a plausible competing explanation. For the
opposition paragraph, argue that protecting the fragile model explains his behavior
better. Select evidence and explain what that reading leaves uncertain.
`.trim(),
	"MSB5 Concluding Statements & Transitional Devices": `
A transition names a relationship: addition, contrast, cause, example or conclusion.
A concluding statement returns to the claim in light of the reasoning. It can add
a bounded implication but cannot introduce unsupported new evidence.

## Worked revision

Draft: "A made 75%. B made more baskets. A deserves the award. A is better."

Revision: "A made 75% of the recorded attempts, compared with B's 62.5%. Although
B made more total baskets, the stated award recognizes accuracy. Therefore, A is
the better fit for this award in the two-session sample. A different criterion
could produce a different choice."

Although marks a concession; compared with identifies comparison; therefore marks
the conclusion under the stated criterion. The final sentence limits the judgment
instead of repeating "A is better."

Use for example before an illustration, in addition before a related point,
however before contrast and because before a reason. Choose the relationship
first. A transition cannot repair an unsupported claim or make unrelated ideas
follow logically. Rewrite an unclear connection instead of adding a transition
at random.
`.trim(),
	"MSB6 Color Coding & Revision": `
Revision changes ideas, evidence or structure; editing corrects sentence-level
errors. Labels reveal the functions a paragraph actually contains. Colors, words,
tags or underlines can represent the same functions.

## Worked diagnosis

In the MSB4 model, label the interpretation as claim, the quotation from line 3
as evidence, its explanation as analysis, concern for the model as counterclaim,
and the limited final inference as conclusion. Classify a sentence by what it does,
rather than the presence of a keyword.

Weak draft: "Kazim is worried. He asks to park near the door. This proves it."
The middle sentence gives a detail, but the last asserts certainty without a link.
Revision: "Nearby parking could shorten the approach to the hall, supporting a
hesitant reading. It could also protect the model, so that detail alone is not
decisive."

Identify a missing function before revising. Add a specific detail when a claim
lacks evidence, explain an unexplained quotation, or qualify an overbroad claim.
Apply the same standard to the opposition paragraph. Preserve a before-and-after
pair and explain the improvement it demonstrates.
`.trim(),
	"MSB Check-In #1": `
This checkpoint combines a bounded claim, distinct reasons, identifiable evidence
and analysis with a fair counterclaim and response. A self-assessment is separate
from the sentence that demonstrates a skill.

## Worked check and independent task

The award model supports an accuracy-based judgment and acknowledges B's higher
total. Changing its conclusion to "A is always the best player" exceeds the
two-session evidence. That is a claim-scope error rather than a punctuation error.

For an independent sample, argue that Kazim is primarily protecting his model.
Lines 5, 6 and 8 in Car Ride supply starting evidence. Respond fairly to the
hesitant reading. Draft a paragraph or complete plan before consulting MSB4's
worked interpretation.

Check scope, exact quotation, source context, sentence grammar, analysis,
counterclaim, response and conclusion. Revise a weak part and explain why the
new version is stronger. Use the missing evidence to select review; length alone
does not establish readiness.
`.trim(),
	"MSB7 Character Development": `
An objective is something a character wants in the story. Motivation explains
why it matters. A quality is a pattern inferred from choices, thoughts, actions
or speech. A trait list does not establish those qualities without scene evidence.

## Worked objective-to-quality chain

Kazim brings a bridge model to the hall and declines the ride home. A plausible
immediate objective is to enter with the model intact. That objective can explain
protecting it and asking for nearby parking. These actions support care or
persistence, while the pause complicates a simple description of confidence.
His deeper motivation remains open.

Text-only flowchart: objective -> obstacle -> choice -> action or speech ->
supported quality. For example: enter with an intact model -> bent support and
unfamiliar event -> straighten the support and stay -> "Wait for me" -> careful
participation despite hesitation.

Original objectives can include repairing a model before judging, returning a
borrowed item before a deadline or persuading a teammate to share a task. Choose
an observable goal rather than only "be happy." Compare a familiar character only
after identifying the specific story version and supporting details. Different
episodes can give the same character different immediate objectives.
`.trim(),
	"MSB8 Character Portraits": `
A character portrait records more than a scene needs to state. The iceberg model
distinguishes visible details from background knowledge influencing choices. It
is a planning analogy, not a fixed percentage of biography to include.

## Worked portrait

For a new story, invent these details: Kazim wants to demonstrate a repair; he
once left a group project unfinished; he values reliability but avoids asking
for help; he smooths paper when uncertain. These are new planning choices, not
facts established by Car Ride.

A visible detail is straightening an already flat invitation. A possible hidden
motivation is fear of disappointing a teammate. Wanting to be dependable while
hiding a damaged support creates a contradiction that can lead to a consequential
choice.

Record objective, motivation, backstory, habit, speech pattern and contradiction.
Select details that affect the scene. Let an action reveal a relevant part of
the backstory instead of inserting every fact into narration. Revise an unsupported
trait if actions repeatedly contradict it without a reason. An original fictional
character supports the same planning work as a personal experience.
`.trim(),
	"MSB9 Generating Conflict & Structuring Plot": `
Conflict occurs when an obstacle blocks an objective. External obstacles include
people, conditions and deadlines; internal conflict can involve competing desires.
Plot connects choices to consequences rather than listing unrelated events.

## Worked text-only plot curve

| Stage | Event and effect |
| --- | --- |
| Beginning | Kazim arrives to display a model, but its support is bent. |
| Rising action | He hides the damage; a repair attempt makes the model wobble. |
| Turning point | As judging approaches, he chooses to ask another entrant for help. |
| Falling action | They brace the support and agree how to explain the repair. |
| Resolution | He presents the model and acknowledges the shared work. |

These are original planning events extending the supplied scene. The turning
point changes the response to the obstacle. Resolving the objective does not
require winning a prize.

Draw a curve with story sequence horizontally and tension vertically, or use
the table. Tension concerns uncertainty about an outcome, not an objective score
every reader must give. For each major event, explain what changes and why the next
event follows. Remove or revise events that affect neither objective, obstacle,
stakes nor character choice.
`.trim(),
	"MSB10 Manipulating Point of View": `
Point of view concerns who narrates and what that narrator can know. Pronouns help
identify person, but a character saying "I" in dialogue does not make a whole
story first-person narration.

## Worked original Jonah and Caleb examples

- First person: "I hid the cracked model behind my bag. I hoped Caleb would not
  ask about it." Jonah narrates his own experience.
- Second person: "You enter the hall and keep the cracked model behind your bag."
  The narrative presents a character as you.
- Third-person objective: "Jonah put the model behind his bag. Caleb pointed to
  the broken support." This version supplies observable actions.
- Third-person limited: "Jonah feared that Caleb would laugh. Caleb's expression
  was unreadable to him." Jonah's thoughts are available; Caleb's are not.
- Third-person omniscient: "Jonah feared that Caleb would laugh. Caleb, who broke
  his own model yesterday, was planning how to help." Private knowledge from
  both characters is available.

These are original miniatures of the same situation. A limited narrator can report
guesses about another person, but guesses remain guesses. An omniscient narrator
need not reveal everything at once. Rewrite a version while keeping the observable
event consistent, then explain how changed access affects sympathy, uncertainty
or humor. Changing only pronouns does not complete that comparison.
`.trim(),
	"MSB11 Writing an Original Short Story": `
A short story develops a meaningful situation through character, conflict and
change. Theme is an idea explored by the story, not necessarily a lesson announced
by a narrator. Showing uses concrete detail or action; telling summarizes. Both
can serve a purpose, depending on emphasis and pace.

## Worked revision model

Draft: "Kazim was nervous, but Caleb was nice. They fixed the model."

Revision: "Kazim turned the broken side toward his coat. Caleb set a strip of
card beside the model and waited. 'It could hold the support,' he said. Kazim
looked at the card, then shifted the bridge into the space between them."

An action can imply embarrassment, while an offered material lets the other
character choose. Their changed distance can support a theme about accepting help.

A simile compares explicitly: "the paper trembled like a small sail." A metaphor
describes one thing through another: "the invitation was his ticket to a second
chance." Select an image for its effect, not merely to fill a checklist.

Draft a beginning, a consequential choice and an ending responding to the
objective. Revise character and causality before polishing sentences. Check
viewpoint, paragraphing, dialogue and selected images. Preserve an earlier excerpt
and explain a revision's effect on the reader.
`.trim(),
	"MSB Check-In #2": `
A scene needs an understandable objective, obstacle and choice, consistent point
of view and visible revision. Planning notes describe intentions; the actual
scene demonstrates what reaches a reader.

## Worked check and fresh scene input

The MSB11 revision implies accepting help by moving the bridge between characters.
If a revision suddenly states Caleb's unspoken thoughts in an otherwise
Jonah-limited scene, check whether the viewpoint changed intentionally.

Use this original new situation for independent evidence: a character wants to
return a borrowed notebook before a club meeting but finds an unfinished drawing
inside. The owner has asked for it back promptly. Decide whether to return it,
ask about the drawing or make another defensible choice. Show a consequence without
assuming the owner welcomes an intervention.

Write a complete scene or excerpt, an objective-conflict-plot plan and one
before-and-after revision. Identify narrator access, a supported quality, a detail
or image, and an emerging theme. Use the text to choose further review. More than
one interpretation can be defensible when its evidence is explained.
`.trim(),
	"MSB12 Master Project": `
The master project presents evidence of either analytical writing or fiction.
The planning step chooses a path, audience and prior artifacts. The two presentation
paths are alternatives; completing both is an extension.

## Worked path choice

An analytical presentation can decide the accuracy-focused practice award.
Show the fictional records, define the criterion, explain the argument and address
a fair counterclaim. Those records establish no facts about a real athlete.

A fiction presentation connects an original story to objective, conflict
and viewpoint. Define each concept, quote a brief scene detail and explain a
revision's effect. Car Ride is a worked reference; the portfolio includes the
writer's own scene.

For either path, use an opening question, supported points and a closing answer.
Add source labels, speaker notes and relevant visual or text support. Rehearse
through live practice, a private recording, audio-supported delivery or a written
walkthrough. Record an unclear moment and revise it. Assess evidence, reasoning,
organization and delivery choices rather than slide counts or public reactions.
`.trim(),
	"MSB Retake Entry Diagnostic": `
The retake starts with independent samples before review. Identify missing
evidence and select relevant modules rather than repeat every assignment. Preserve
the entry samples unchanged for the exit comparison.

## Original diagnostic inputs

Fictional library case: one staff member can supervise either a quiet study room
or a discussion club for 45 minutes after class. The room has 20 seats. Four
trial study-room sessions had 12, 18, 20 and 16 visits. Some students may have
attended more than once. Of ten volunteer survey respondents, six preferred
quiet study and four preferred a discussion club. The club has not been trialed.

Recommend the next trial in a short argument with evidence, analysis, a counterclaim
and a limitation of the supplied data. Explain what each selected number can support.

For fiction, start with this original situation: a learner carries a repaired
cardboard bridge to a workshop. Rain begins, the entrance is crowded and another
entrant offers to help carry it. Write a scene showing objective, obstacle,
choice and consequence. Choose a viewpoint and revise once.

Mark skills ready, review or rebuild and cite a sentence or missing element as
the reason. Ready means demonstrated; review means partially demonstrated; rebuild
means absent or unclear. Use the map to choose optional review modules.
`.trim(),
	"MSB Retake Exit Evidence": `
The exit comparison addresses skills selected at entry. Improved confidence is
self-assessment; a recovered writing skill needs visible textual evidence. Keep
an unresolved skill on the plan when its evidence remains weak.

## Worked comparison structure

An entry argument might list library attendance without explaining what it
supports. An exit revision can link visits to demand for quiet study while noting
the lack of a club trial. The improvement is the evidence connection and limitation,
not simply another sentence.

Place entry and exit excerpts beside each other, label the change and explain
its effect. Check the selected argument or fiction skills against actual text.
Copying a worked model does not independently demonstrate transfer.

Use an unused detail or fresh original scene. For example, the notebook-return
scene from Check-In #2 tests whether a viewpoint method practiced with the bridge
scene transfers. Mark a target ready when the new work demonstrates it; otherwise
name one precise next step.
`.trim()
};

export function applyMiddleSchoolWritingReadings(
	course: RawCourse,
	source: RawCourse
) {
	const retake = source.modules.some(
		module => module.title === "MSB Retake Entry Diagnostic"
	);
	for (const original of source.modules) {
		const content = readings[original.title];
		const module = course.modules.find(
			module => module.title === original.title
		);
		const item = module?.curriculum.find(
			item =>
				item.title.startsWith("Concepts:") ||
				item.title.endsWith("Core Concepts")
		);
		const flow = original.curriculum[0]?.content.match(
			/\*\*Course flow:\*\* [\s\S]+$/
		)?.[0];
		if (!content || !module || !item || !flow) {
			throw new Error(
				`Missing Middle School Writing reading: ${original.title}`
			);
		}
		item.content = formatAuthoredReading(`${content}\n\n${flow}`);
		item.contentKind = "reading";
		item.preserveInstructions = true;
		item.learningPath = original.curriculum[0].learningPath;
		module.curriculum = [
			item,
			...original.curriculum.slice(1).map(project => ({
				...project,
				...module.curriculum.find(
					candidate => candidate.title === project.title
				),
				content: formatAuthoredAssignment(project.content),
				contentKind: "assignment" as const,
				preserveInstructions: true,
				preserveAssignment: true
			}))
		];
		const sourceProjects = original.supplementalProjects.filter(project =>
			project.content.startsWith("**Project goal:**")
		);
		const sourceTitles = new Set(
			sourceProjects.map(project => project.title)
		);
		module.supplementalProjects = [
			...sourceProjects.map(project => ({
				...project,
				...module.supplementalProjects.find(
					candidate => candidate.title === project.title
				),
				content: formatAuthoredAssignment(project.content),
				contentKind: "assignment" as const,
				preserveInstructions: true,
				preserveAssignment: true
			})),
			...module.supplementalProjects.filter(
				project => !sourceTitles.has(project.title)
			)
		];
		applyWritingPractice(module, middleSchoolWritingPractice, retake);
	}
}
