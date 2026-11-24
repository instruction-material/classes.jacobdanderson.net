import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";
import { middleSchoolLiteraturePractice } from "./middleSchoolLiteraturePractice";
import { applyWritingPractice } from "./writingPractice";

const gardenPoem = `
## Original practice poem: After the Storm

1. Silver seeds sleep softly through the night.
2. At dawn, the garden lifts a cup of light.
3. I mend the gate; the stubborn hinges slow
4. My hurried hands, while patient seedlings glow.
`.trim();

const readings: Record<string, string> = {
	"MSA1 Main Ideas & Supporting Evidence I": `
A topic names the subject. A main idea states what the whole passage says about
that subject. Supporting details develop it through events, descriptions or
examples. A just-right main idea covers the important details without claiming
more than the passage supports.

## Worked planning model

In a fictional class-prank plan, a paper crown is placed on a toy dinosaur, a
small throne is folded from card, and a sign reads "Library King." The general
plan is to turn the classroom toy into a pretend ruler. "A paper crown" is too
narrow to summarize the plan; "Everyone loves jokes" is too broad and unsupported.
The crown, throne and sign each support the pretend-ruler idea. This is a paper
planning exercise, not an activity to carry out.

## Original practice passage: Kyra's Fear

1. Kyra spotted a spider beside the classroom window and moved her chair back.
2. "Can someone open the window?" she asked, watching its legs.
3. A loose strand of hair brushed her neck, and she sprang to her feet.
4. When she saw the strand, she laughed once but kept her eyes on the spider.
5. Her friend guided it outside with a cup and a card.
6. Only after the window closed did Kyra sit down again.

Worked comparison: "Kyra reacts fearfully to a nearby spider until it is removed"
covers the sequence. "A friend uses a cup" describes one detail; "All spiders are
dangerous" is a claim the passage does not establish. Lines 1 and 6 connect the
reaction to the spider's presence. Quote exact words or paraphrase accurately,
then explain the connection rather than attaching an unrelated detail.

The practice passages and scenes in these readings are original fiction.
`.trim(),
	"MSA2 Main Ideas & Supporting Evidence II": `
Strong evidence is relevant to the claim, specific enough to inspect and concise
enough to keep the connection clear. A vivid detail can still be weak evidence
for a particular main idea. Choose evidence for what it demonstrates.

## Original practice passage: Soccer Summer

1. At the first practice, Lena passed only to friends she already knew.
2. The team's shirts were green, and the field had two wooden benches.
3. After three missed chances, the coach asked everyone to practice with a new partner.
4. Lena and new teammate Noor spent the next week learning each other's signals.
5. In the final game, Lena noticed Noor near the goal and passed instead of taking a difficult shot.
6. Noor scored, and Lena ran to celebrate with her.

Worked evidence choice: for the claim that Lena learns to cooperate beyond her
existing friendships, line 1 establishes the starting behavior and line 5 shows
a changed choice. The green shirts in line 2 are specific but do not demonstrate
that change. Line 6 supports a shared success but says less about how Lena helped
create it. A concise paraphrase of line 5 keeps the choice and its context; "she
passed" alone loses the contrast with taking a difficult shot.

Write a main idea, choose two details and compare each with an unused alternative.
An explanation such as "line 5 shows Lena choosing the new teammate over a risky
individual attempt" connects evidence to the claim.
`.trim(),
	"MSA3 Making Inferences": `
An explicit fact is stated in the text. An inference combines textual clues with
reasonable background knowledge to reach a conclusion the text leaves unstated.
It is a supported interpretation, not a fact guaranteed by one clue.

## Worked inference

Smoke rises beside a house while a person carries a tray from a garden grill.
Smoke alone might suggest a fire; the grill and tray make cooking a better
explanation. An inference must account for the surrounding clues and remain open
to revision. Background knowledge helps connect evidence but cannot supply a
missing event as if it were stated.

## Original practice passage: Car Ride

1. Kazim counted "one Mississippi, two Mississippi" until the next road sign.
2. He asked how long remained, although his father had answered a minute earlier.
3. His phone battery went dark, and he pushed the phone into his bag.
4. "There is an atlas beside you," his father said.
5. Kazim left it closed and let out a long sigh.
6. At the next sign, he began counting again.

Worked distinction: a closed atlas is an explicit detail in line 5. Boredom or
impatience is an inference supported by repeated counting, repeated questions and
the sigh. He could instead be anxious about arriving; the passage does not say
where they are going. "He hates his father" is not justified by these clues.
Record a conclusion, two clues, the reasoning link and one plausible alternative.
`.trim(),
	"MSA4 Show; Don't Tell": `
Telling names a feeling or situation directly. Showing supplies actions, dialogue
or sensory details from which a reader can infer it. Both are useful: telling can
move quickly, while showing can let a reader experience an important moment.

## Worked revision

Telling: "Mara was nervous before her speech."

Showing: "Mara folded the corner of her note card twice. When her name was called,
she began, 'Good morning,' then cleared her throat and began again."

The repeated folding and restarted greeting support nervousness without naming
it. They do not prove a single emotion: the restart might also follow a sore
throat. Several consistent details make the intended reading stronger.

For the paragraph project, revise this original draft: "Dev was frustrated because
his model bridge had broken just before the exhibition. His friend wanted to
help." Preserve the broken bridge and the offer of help, but replace the feeling
label with observable details. Add a short annotation linking two details to the
intended inference. Describing every object in a room does not automatically show
the emotion; select details that do the interpretive work.
`.trim(),
	"MSA Check-In #1": `
This checkpoint uses a fresh passage to distinguish main idea, evidence, inference
and showing from telling. A summary reports what happens; an inference explains
something implied. Keep those claims separate.

## Original practice passage: The Missing Page

1. At the rehearsal, Jo opened the group's script and found the final page missing.
2. She pressed the remaining pages flat and counted them again.
3. "I remember the last conversation," Sam said, reaching for a pencil.
4. Jo slid a blank sheet toward him, then began reading the previous scene aloud.
5. Together they wrote a new ending and marked it "rehearsal version."
6. When the others arrived, Jo placed the new page on top instead of hiding the gap.

Write a just-right main idea with two supporting details. Infer Jo's attitude at
two different moments and connect each interpretation to a clue. Choose one
moment shown through action, write a direct telling version and explain the
difference in effect. The passage does not state why the page disappeared; label
any proposed cause as uncertain.

Check the work against the text: does the main idea cover the sequence, does each
detail support it, and does the inference include a reasoning link? Revisit the
corresponding reading when one of those elements is missing.
`.trim(),
	"MSA5 Identifying Themes": `
A topic is a subject such as trust. A main idea summarizes this particular text.
A theme is a complete, transferable insight developed through its events and
choices. A theme need not be a command or a universal truth, and a story can
support more than one reasonable theme.

## Original practice scene: The Seed Box

Ivo kept the club's last seeds locked in his desk so nobody could waste them.
When he was absent, planting day passed without a single seed in the ground.
The next week he brought the box back and helped the group agree how to share it.
They planted together, and he left the empty box on the common shelf.

Worked sort:

- Topic: trust.
- Main idea: Ivo changes how he handles the club's seeds after his private storage
  prevents the group from planting.
- Theme: protecting a shared resource can defeat its purpose when others cannot
  use it.

The missed planting day connects the private storage to its consequence. The
shared agreement and common shelf support a change toward cooperation. "Seeds
are always expensive" is neither supplied evidence nor a supported theme.

Sort these fresh statements: "cooperation"; "Ivo brings the seed box back";
"Shared work benefits from shared responsibility." Explain each classification,
then support a theme with both the problem and a later character choice.
`.trim(),
	"MSA6 Analyzing & Developing Themes": `
Character analysis connects a quality to an observable choice, its consequence
and a larger meaning. Naming a trait is only a starting point. Look for repeated
choices, contrasts and changes; one event rarely supports a claim about every
person or situation.

## Original practice scene: The Lantern Workshop

1. Neri stopped repairing her own lantern to show Bo how to fasten a loose handle.
2. Across the table, Sela hid the spare wire so her lantern would be the only finished one.
3. When Neri's frame snapped, Bo brought the wire he had saved and helped her rebuild it.
4. Sela's lantern stayed unfinished because she could not hold its frame and tie it alone.
5. She set the hidden wire on the table and asked whether they would work together.

Worked analysis: Neri's willingness to help in line 1 creates an opportunity for
reciprocal help in line 3. Sela's attempt to succeed alone limits her progress,
and line 5 opens a possibility of change. The contrast supports a theme that
cooperation can accomplish work competition alone prevents. It does not prove
that kindness always produces a reward, or that Sela can never change.

Build an action → consequence → theme chain with two line references. Consider
whether line 5 develops a second theme about admitting a mistake. An analysis
must explain how the pattern supports the message, rather than merely retelling
the events. A supplied classroom edition of Cinderella can be an additional
comparison, with its version and evidence identified.
`.trim(),
	"MSA7 Analyzing Point of View": `
Point of view concerns who narrates and what the narration can know. A narrator
is the voice telling the story; that voice is not automatically the author.
Pronouns help identify person, but access to thoughts distinguishes third-person
forms. A character's opinion is a perspective within the story.

## Five original versions of one moment

| Form | Passage | Narrator access |
| --- | --- | --- |
| First person | I held the library key and hoped Mina would wait for me. | The narrator's own thoughts; not Mina's unspoken thoughts. |
| Second person | You hold the library key and hope Mina will wait for you. | The narration addresses a character as "you." |
| Third-person objective | Ari held the key. Mina waited beside the library door. "Ready?" she asked. | Observable actions and speech; no direct access to thoughts. |
| Third-person limited | Ari held the key, afraid of disappointing Mina. She waited by the door. | Ari's inner experience; Mina is observed from outside. |
| Third-person omniscient | Ari feared disappointing Mina. Mina hoped he would not notice that she had forgotten her own key. | Both characters' unspoken thoughts. |

Worked effect: the limited version makes Ari's worry immediate but leaves Mina's
reason for waiting uncertain. The omniscient version supplies a reason he does
not know, creating a possible misunderstanding for the reader to notice. The
objective version lets the reader infer motives without confirming either one.

For the effects lab, compare two versions, then rewrite the same moment from
Mina's first-person perspective. Mark any newly invented motive as a choice in
the rewrite. Explain its effect on sympathy, suspense, humor or tone. A different
pronoun alone does not establish omniscience or change the theme.
`.trim(),
	"MSA8 Analyzing Words & Phrases": `
Denotation is a word's literal meaning. Connotation is an association it carries
in a particular context. Tone is the speaker's or narrator's attitude; mood is
the atmosphere experienced by a reader. Connotations can vary with context and
audience, so support a tone claim with the actual wording.

## Worked word-choice comparison

"Neri held firmly to her plan" can sound approving; "Neri stubbornly clung to her
plan" can sound critical. Both describe persistence, but firmly emphasizes
steadiness while stubbornly suggests resistance to change. The words are related,
not interchangeable in every sentence.

For the word-choice record, compare these original sentence pairs:

- "The cabin was cozy" / "The cabin was cramped."
- "Bo was curious about the note" / "Bo was nosy about the note."
- "She walked into the room" / "She stormed into the room."

Explain what meaning or association changes in each pair. Cozy and cramped also
emphasize different features of a small space; stormed adds force or anger that
walked does not state. A revision must account for those meaning changes.
Revise one sentence toward a different tone, then identify the exact word that
creates the effect and what surrounding context would make that reading plausible.
`.trim(),
	"MSA9 Analyzing Rhyme & Alliteration": `
Rhyme repeats a stressed vowel sound and the sounds after it, as in night and
light. Alliteration repeats an initial consonant sound in nearby prominent words,
as in silver seeds. Listen to sound: matching letters alone are not sufficient.
A sound pattern can emphasize a contrast or establish rhythm, but its effect
depends on the surrounding meaning.

${gardenPoem}

Worked annotation: night/light and slow/glow are end-rhyme pairs, giving the four
lines an AABB pattern. Silver/seeds/sleep/softly repeats an initial /s/ sound;
hurried/hands repeats /h/. The soft seed description contrasts with the speaker's
hurried repair. The rhyme links slow with glow, connecting the delay to attention
to the garden. These are interpretations grounded in the wording, not rules that
/s/ must always mean calm.

For the annotation project, mark the pairs and word groups, read the lines aloud
and explain one connection between sound and emphasis. Try replacing softly with
quietly: the basic description remains similar, but one repeated /s/ disappears.
Compare the effect rather than merely counting devices.
`.trim(),
	"MSA10 Analyzing Figurative Language": `
Literal language describes something directly. A simile makes a comparison using
like or as; a metaphor presents one thing as another. Personification gives a
nonhuman thing a human action or quality. An unusual phrase is not automatically
figurative: explain the comparison and its effect in context.

${gardenPoem}

## Worked analysis

"A cup of light" treats the garden's morning light as something it can hold;
"the garden lifts" personifies it. "Patient seedlings" transfers a human quality
to plants. In contrast, "I mend the gate" can describe a literal action. The
speaker's hurry and the garden's apparent patience support a reflective tone.

Model paragraph: The poem contrasts human haste with gradual growth. The speaker's
"hurried hands" meet "patient seedlings" (line 4), giving plants the quality the
speaker lacks. The slow/glow rhyme connects the repair's delay with noticing
growth. Together, the choices suggest that a delay can create room for attention.
The interpretation follows the contrast rather than assuming every garden poem
has that message.

For a simile comparison, revise "the garden lifts a cup of light" to "the garden
holds light like a cupped hand." Explain what becomes more explicit and what
image changes. Build a paragraph with a claim, exact words, an explanation of
their effect and a connection back to the claim.
`.trim(),
	"MSA Check-In #2": `
Use a fresh text to connect interpretation with craft. A device label is evidence
only after its wording and effect are explained. Not every text contains every
device; an accurate absence is better than an invented example.

## Original practice poem: The Shared Repair

1. I found our paper harbor torn in two
2. And hid the break before the others knew.
3. My shame was like a stone inside my shoe;
4. I showed the tear. "Let's mend it," said our crew.
5. Small scraps sailed softly onto seams of white.
6. Our hands became a bridge beneath the light.
7. I thought the rip would end our work that day;
8. Then joined the scraps to make a wider bay.

Identify a theme using the speaker's change and its consequence. Describe the
point of view and what can be known about other characters. Compare the
associations of hid and showed. Mark clear rhyme pairs, alliteration and a simile
or metaphor, then write an analysis paragraph connecting at least two craft
choices to the same interpretation. Cite line numbers.

Check that a sound claim uses sound, a figurative claim explains the comparison,
and the paragraph explains how evidence supports its interpretation. A narrator's
statement about another person's feelings would still need to be distinguished
from direct access to that person's thoughts.
`.trim(),
	"MSA11 Master Project": `
The showcase combines a fictional piece with an analysis of its choices. Keep
the story's invented events separate from the visible details that inspired it.

## Original image prompt: The Last Platform

![An empty station platform with a clock at 6:10, a closed suitcase on a bench, an open doorway spilling warm light, and curved tracks leading beyond the frame.](/illustrations/literature-station.svg)

The image description can serve as the prompt: an empty platform, a clock at
6:10, a closed suitcase on a bench, a warmly lit open doorway and tracks curving
out of sight. Who owns the suitcase and why it is there are fictional choices,
not facts established by the image.

## Worked planning choice

One possible plan follows a station cleaner who finds the suitcase and must
decide whether to leave before locating its owner. A limited narrator could
reveal the cleaner's uncertainty while keeping the owner's identity hidden.
This is a starting possibility, not the required plot.

Create a short fictional piece with a purposeful point of view, a character
choice and consequence that develop a theme, and intentional word, sound or
figurative choices. Annotate two exact excerpts: name the choice, explain its
effect and connect it to the intended interpretation. Compare that intention
with what the written evidence actually supports; revise one mismatch.
`.trim()
};

export function applyMiddleSchoolLiteratureReadings(
	course: RawCourse,
	source: RawCourse
) {
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
				`Missing Middle School Literature reading: ${original.title}`
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
		applyWritingPractice(module, middleSchoolLiteraturePractice);
	}
}
