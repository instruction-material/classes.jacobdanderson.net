import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";
import { applyWritingPractice, novelWritingPractice } from "./writingPractice";

const readings: Record<string, string> = {
	"NW1 Course Overview & Goal Setting": `
A premise joins a character, a desire and an obstacle. A scope defines which part
of that story this draft will complete. Word count measures length; a completion
definition also names the story movement and revision work the draft needs.

## Worked plan: The Last Bell

The original fictional examples in these readings follow Mina, who wants to save
her neighborhood's closing bell tower. Its caretaker, Bo, wants to keep people
away from its damaged stairs. Both care about the tower but disagree about what
protecting it requires.

Choose a 6,000-word short story with an opening, an escalating conflict and an
ending that answers Mina's immediate objective. With eight writing sessions,
6,000 / 8 = 750 new words per session. Reserve two additional sessions for revision.
If 2,400 words are drafted after four sessions, 3,600 remain. Four remaining
drafting sessions would require 900 words each. Revise the schedule or scope if
that pace is unrealistic; a word-count target does not guarantee a finished arc.

"Write a great novel" supplies neither a manageable scope nor a finish line.
"Draft the tower story through Mina's decision and revise its ending" does both.
An excerpt can instead finish a local scene arc while naming the larger conflict
left open. Use your own premise and available writing time for the project.
`.trim(),
	"NW2 Developing a Protagonist and an Antagonist": `
The protagonist drives the central action. An antagonist is a person or force
that opposes the protagonist's objective; opposition does not require wickedness.
Motivation explains why an objective matters. A flaw is a habit or limitation that
complicates choices, rather than a list of negative adjectives.

## Worked character pair

Mina wants one final public ringing before the tower closes. The sound connects
her to neighbors who have moved away. She notices mechanical details and persists,
but treats asking for help as failure. She fears being dismissed as a child.
Her first action is to measure the locked courtyard gate.

Bo wants the unsafe stairs left unused until repairs are funded. He knows the
building and will take responsibility for it, but answers questions with abrupt
refusals. He fears another injury. His first action is to remove the stair key.

Their objectives collide if Mina's plan requires climbing now. Neither must
abandon caring about the tower for a different solution to become possible.
"Mina is brave; Bo is mean" hides the motives that can generate scenes. Give each
portrait an observable choice, and distinguish what the narrator knows from what
one character merely assumes about the other.
`.trim(),
	"NW3 Novel Drafting: Introducing Your Characters": `
An opening scene gives a character an immediate goal, a situation and something
that resists the goal. Exposition supplies background. A scene can include both
action and exposition, but background should help the reader understand what is
happening now.

## Original opening and annotation

> Mina laid her measuring tape across the locked gate. Above her, the tower clock pointed to noon without making a sound. Bo stopped beside the gate with a key in his fist. "The stairs are closed," he said. Mina folded the tape behind her back. "I was measuring the courtyard."

Measuring reveals a plan before the narration explains it. The silent clock
connects the place to a problem. Hiding the tape suggests that Mina expects
opposition; her answer leaves room for interpretation. Bo's key makes his control
concrete without proving that he is cruel.

A flat alternative, "Mina was determined and Bo was strict," names traits without
letting the reader observe them. Revise a trait statement into an action, a line
of speech or a choice, then check that the reader still has enough context to
understand the scene. The project uses an opening from your own manuscript.
`.trim(),
	"NW4 Generating Conflict": `
Conflict appears when a desire meets resistance. Stakes are what can be lost or
changed. Escalation makes a later choice more difficult because of what happened
earlier; simply adding accidents can make a story busy without making it causal.

## Worked conflict ladder

1. Mina asks to ring the bell. Bo refuses because the stair supports are damaged.
2. Mina secretly tries a ground-level service rope. It jams, so she must explain
   what she did before anyone can safely inspect it.
3. Her concealment makes Bo distrust her next proposal. To get his help, she must
   admit her mistake and let him change the plan.
4. Together they discover a repairable ground mechanism, but the inspection will
   take the time Mina had promised neighbors for the ringing.

The damaged access is external resistance; distrust is interpersonal resistance;
Mina's reluctance to ask for help is internal resistance. Each affects her options.
An unrelated storm might add danger, but it does not replace these causal links.
For each rung in your ladder, name the preceding choice, its consequence and the
new decision.
`.trim(),
	"NW5 Novel Drafting: Setting the Scene": `
Setting includes place, time and the conditions governing action. Atmosphere is
the feeling created by selected details. A useful setting detail can establish
location, direct attention or change what a character can do.

## Original scene detail

> Noon heat softened the chalk marks on the courtyard paving. Mina knelt in the tower's narrow strip of shade, where a service hatch sat below the sealed stair door. Through the hatch she heard a loose metal tap each time the wind moved.

Heat explains where Mina kneels. The hatch distinguishes a possible ground-level
route from the forbidden stairs. The tapping directs her attention toward a
mechanical problem. These details belong to this invented tower; they are not
claims about how real bell mechanisms work.

"It was a nice place on a sunny day" establishes little that can affect the
scene. Replace one general description with a specific detail, then show its
effect on a character's action. Three sensory details need not come from three
different senses, and using every sense is not a requirement for strong writing.
`.trim(),
	"NW6 Structuring Plot": `
Exposition establishes the situation. Rising action develops pressure through
choices and consequences. A climax is a decisive confrontation or turning point
in the central conflict. Falling action explores consequences; resolution shows
the state left by the story's main change. These are useful planning terms, not
a compulsory shape for every story.

## Text-only narrative arc

| Part | Event in The Last Bell |
| --- | --- |
| Exposition | Mina promises a final ringing; Bo closes the unsafe stairs. |
| Rising action | Mina's secret rope attempt jams the mechanism and damages trust. |
| Climax | Mina admits her mistake and chooses a delayed, inspected plan with Bo. |
| Falling action | They explain the delay to the waiting neighbors. |
| Resolution | A later gathering hears the repaired bell from the courtyard. |

The climax resolves Mina's struggle over acting alone; the later ringing shows
the practical consequence. If she simply finds a spare key and everything works,
the ending avoids the conflict established by her choices. Draw causal arrows
between events or write "because" sentences to find missing bridges. A text-only
map supplies the same planning information as an arc drawing.
`.trim(),
	"NW7 Character Development": `
A character arc traces a meaningful pattern of change, resistance or revelation.
A new emotion alone is not an arc. Compare how a character acts under related
pressures and what the choices cost.

## Before-and-after model

Early Mina hides her tape and attempts the rope alone. She believes help will make
the project stop belonging to her. Later she tells Bo, "I jammed it. Can we inspect
it together?" She risks losing his trust permanently but gives him information
needed to help. The later choice revises her method while keeping her desire to
hear the bell.

"Mina learned teamwork" summarizes an interpretation. Hiding the tape, admitting
the jam and waiting for an inspection make that interpretation visible. Add an
intermediate scene in which she considers asking for help and retreats; it can
make the final change feel earned rather than sudden.

For your two-scene comparison, record the shared pressure, the earlier response,
the later response and the evidence for change. An unchanged character can still
belong in a strong story; explain the deliberate effect rather than requiring
every character to become more agreeable.
`.trim(),
	"NW8 Narration": `
Point of view controls who tells the story and what information the narration
can present. First person uses a participating narrator's I. Third-person limited
stays close to one character's available perceptions and thoughts. An omniscient
narrator can know more than any one character, within the story's chosen rules.
First-person narration is not automatically truthful or all-knowing.

## Same moment, different access

- First person: "Bo pocketed the key. I thought he wanted me to leave."
- Third-person limited with Mina: "Bo pocketed the key. Mina wondered whether he
  wanted her to leave."
- Omniscient: "Mina read his silence as anger. Bo was searching for words that
  would keep her from trying the stairs alone."

In a Mina-limited scene, "Bo secretly feared another injury" gives direct access
to an unspoken thought Mina cannot know. Revise it to an observation, "Bo's hand
shook as he locked the stair door," followed by Mina's tentative interpretation,
or establish another viewpoint deliberately. A narrator can report something
learned later if the telling situation makes that knowledge clear. Audit access
and consistency, rather than banning every sentence outside present sensation.
`.trim(),
	"Check-In #1": `
A revision priority identifies a reader problem and an action that could solve
it. Revision changes meaning, organization or effect. Proofreading checks surface
errors after the larger choices are stable.

## Worked midpoint review

At 2,400 words, Mina's draft clearly shows her wish to hear the bell, but Bo's
refusal has no visible reason. A reader may interpret the conflict as arbitrary.
Priority: add the damaged-stair notice and Bo's inspection record before Mina
tries the rope. Preserve her secret attempt so its consequences remain hers.

Before: "Bo refused. Mina waited until he left and pulled the rope."

After: "Bo tapped the inspection notice beside the sealed stairs. 'The support
has split.' Mina read the date twice. When he left, she told herself the courtyard
rope would be different."

The revision supplies a reason, lets Mina encounter it and makes her choice more
specific. It does not excuse that choice. Compare your excerpt against your own
scope, character objective, causal conflict and narration rules. Name one
strength with evidence and one change to test; then keep both versions so the
effect can be compared. Recalculate the remaining drafting schedule as in NW1.
`.trim(),
	"NW9 Describing Setting": `
Selective description shows what matters to a viewpoint character at a particular
moment. Sensory language can support mood and action; an inventory of decorative
adjectives can interrupt both.

## Worked expansion and cut

Draft: "The courtyard was old and beautiful. Mina stood there."

Revision: "Grit pressed through Mina's thin soles. The service hatch clicked in
the warm wind. Rust stained its lower hinge, and the air beside it smelled of wet
iron. She moved her notebook into the shade to read Bo's inspection sketch."

Touch, sound, sight and smell make the courtyard specific. The notebook action
connects those details to a task. The wet-iron smell is Mina's impression, not a
technical diagnosis. A sentence about the distant bakery's elaborate window might
be vivid but expendable if it does not affect this scene.

Expand one paragraph from your draft. Underline the details that locate action,
reveal attention or change mood. Cut or relocate a detail whose only role is to
show how much description you can write. A fast scene may need fewer details
than a reflective one; four details in this exercise are a practice constraint.
`.trim(),
	"NW10 Writing Dialogue": `
Dialogue presents speech. A tag identifies the speaker with a speaking verb; an
action beat is a separate action that can also identify the speaker. Subtext is
meaning suggested beneath the literal words. In the US punctuation convention
used here, start a new paragraph when the speaker changes.

## Original dialogue model

> "Did you touch the rope?" Bo asked.
>
> Mina flattened the corner of her notebook. "Only from the courtyard."
>
> "That wasn't my question," he said.
>
> "I thought I could fix it before anyone noticed."

The question mark belongs to the spoken question. Bo stays capitalized because
it is a name. Mina's action is a separate sentence before her speech. Her
first answer avoids admitting the jam, so the exchange carries subtext without
the narrator saying "she was evasive." The final line changes what Bo knows.

A facial action does not act as a speaking tag. Compare these versions:

- Tag error: "I touched it," she smiled.
- Separate action: "I touched it." She smiled.

Choose beats that matter; adding one to every line can slow the exchange. Check
your own scene for speaker clarity, useful changes and speech that fits each voice.
`.trim(),
	"NW11 Novel Drafting: Conflict": `
A high-tension scene joins an immediate objective, resistance, stakes and a choice
whose consequence changes what can happen next. A loud argument is not necessarily
the climax if it leaves the central problem untouched.

## Worked decisive scene plan

Mina wants Bo to open the service hatch before the promised gathering. Bo needs
to know why the rope is jammed before he can arrange an inspection. She can repeat
her denial and protect her pride, or admit the attempt and risk cancellation.

> Mina took the folded sketch from her pocket. "The knot is mine," she said. She put the sketch where Bo could see it. "I can tell you where it caught." Bo set the key beside the sketch. "Then we start with what happened. Not with what time you promised."

Her admission supplies useful information and gives up control of the deadline.
The sketch and jam were established earlier, so the decision grows from the
existing conflict. If Bo suddenly repaired everything with an unexplained device,
the scene would remove Mina's problem without testing her choice. Trace the
cause, choice and consequence in your own draft; raise meaningful stakes before
adding more physical danger or shouting.
`.trim(),
	"NW12 Novel Drafting: Falling Action & Resolution": `
Falling action follows the consequences of the decisive event. Resolution gives
the reader enough evidence to understand the central outcome. An open ending can
leave a future uncertain while still answering the immediate story question.

## Worked consequence chain

Mina admits the jam, so Bo can request the right inspection. The inspection means
the original ringing cannot happen, so Mina tells the neighbors herself. Bo later
confirms a ground-level repair, so they arrange another gathering. Mina shares
the announcement with his name beside hers.

> At the next gathering, Mina held the timetable while Bo checked the courtyard. When he nodded, she invited the smallest children to stand beside her. The bell sounded once. This time she had not promised when it would sound again.

The bell answers her immediate objective, while the shared timetable suggests a
change in how she plans. Long-term tower funding can remain unresolved. "Everyone
was happy forever" erases complexity without showing consequences. Check whether
your ending follows from the conflict, addresses its cost and gives the final
moment enough space. A tragic or mixed outcome can also provide resolution.
`.trim(),
	"NW13 Final Revision Portfolio": `
A portfolio selects work that makes progress and present decisions visible.
Developmental revision addresses the story's structure and meaning; line editing
improves sentence expression; proofreading checks remaining surface errors.
Publication readiness is a reasoned assessment for an intended use, not proof
that a draft must be released publicly.

## Worked portfolio selection

For The Last Bell, include the original premise and scope, the revised opening,
the conflict ladder, one midpoint before-and-after excerpt and the ending.
Explain how the admission scene now connects Mina's private mistake to her public
responsibility. Point to the changed lines rather than saying only "it improved."

Use a revision pass for cause and effect: does the jam cause the need for honesty?
Then check viewpoint: does a Mina-limited scene claim Bo's unspoken thoughts?
Next check continuity of the key, sketch and promised gathering. Finally check
dialogue paragraphs, punctuation and repeated words.

A concrete next-pass note is "Introduce the inspection sketch before Mina uses
it in the conflict scene." "Make it better" does not identify an editing action.
Select a complete short-story draft or the chosen excerpt scope from NW1 and
state what remains open. A private portfolio or guided review can be the
finished product; sharing beyond that is a separate choice.
`.trim()
};

export function applyNovelWritingReadings(
	course: RawCourse,
	source: RawCourse
) {
	for (const original of source.modules) {
		const content = readings[original.title];
		const module = course.modules.find(
			item => item.title === original.title
		);
		const item = module?.curriculum.find(
			item =>
				item.title.startsWith("Concepts:") ||
				item.title.endsWith("Core Concepts")
		);
		const flow = original.curriculum[0]?.content.match(
			/\*\*Course flow:\*\* [\s\S]+$/
		)?.[0];
		if (!content || !module || !item || !flow)
			throw new Error(`Missing Novel Writing reading: ${original.title}`);
		item.content = formatAuthoredReading(`${content}\n\n${flow}`);
		item.contentKind = "reading";
		item.preserveInstructions = true;
		for (const project of original.curriculum.slice(1)) {
			const current = module.curriculum.find(
				item => item.title === project.title
			);
			if (!current) {
				throw new Error(
					`Missing Novel Writing project: ${project.title}`
				);
			}
			current.content = formatAuthoredAssignment(project.content);
			current.contentKind = "assignment";
			current.preserveInstructions = true;
			current.preserveAssignment = true;
		}
		for (const optional of module.supplementalProjects) {
			optional.contentKind = "assignment";
			optional.content = formatAuthoredAssignment(optional.content);
		}
		applyWritingPractice(module, novelWritingPractice);
	}
}
