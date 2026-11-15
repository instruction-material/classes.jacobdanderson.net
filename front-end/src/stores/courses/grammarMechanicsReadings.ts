import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";
import { grammarMechanicsActivities } from "./grammarMechanicsActivities";

const readings: Record<string, string> = {
	"MSC1 Nouns, Pronouns & Adjectives": `
A noun names a person, place, thing or idea. A proper noun names a particular
one, such as Willow Park. A pronoun refers to a noun phrase or a participant in
the conversation. An adjective describes a noun or pronoun. Classify a word by
its job in this sentence: light can name an object or describe its weight.

## Original practice passage: Snow Day

Fresh snow covered Willow Park. Quiet streets glimmered outside our school.
Mina found a red sled beside a wooden fence. She carried it to Bo, and he brushed
its seat. They chose a gentle hill. I watched them slide.

## Worked sort and agreement check

- Five nouns: snow, streets, sled, fence, hill.
- Five pronouns: she, it, he, they, them. She refers to Mina, it to the sled, he
  to Bo, and they/them to Mina and Bo. I identifies the narrator.
- Five adjectives: fresh, quiet, red, wooden, gentle.

An antecedent is the expression a pronoun refers back to. Keep that reference
clear and keep person consistent when referring to the same participants.
Singular they is valid: "A visitor said they are ready." It can refer to one
person and still uses are, not is. "The sleds lost its runners" needs their
because the intended reference is the plural sleds.

Repair these sentences, with the stated meaning: "The sleds lost its runners";
"The students revised the draft before you submitted it" (the same students did
both actions, described in third person); "A visitor said they is ready."
For "When Mina met Noor, she waved," make Mina the explicit person waving.

Check: their runners; before they submitted it; they are ready; "When Mina met
Noor, Mina waved." Write a new labeled sentence and add one repair to the edit
log with columns for original wording, revision, rule and effect on meaning.

[Singular they](https://apastyle.apa.org/style-grammar-guidelines/grammar/singular-they)
`.trim(),
	"MSC2 Verbs, Adverbs & Verbals": `
A verb expresses an action or state and can include helping verbs: "Bo is
waiting." An adverb can modify a verb, adjective or another adverb. In "Mina
moved very slowly," slowly modifies moved and very modifies slowly.

## Worked distinctions

| Sentence | Target | Function |
| --- | --- | --- |
| Bo carefully stacks the boxes. | stacks; carefully | Verb; adverb describing how he stacks. |
| Yesterday, Mina arrived. | arrived; yesterday | Verb; adverb identifying when. |
| The class waits outside. | waits; outside | Verb; adverb identifying where. |
| Swimming relaxes Bo. | swimming | Gerund used as the subject, a noun function. |
| The smiling visitor waves. | smiling | Participle describing visitor. |
| Mina wants to rest. | to rest | To-infinitive completing wants. |

A verbal is based on a verb but has a different sentence job. In this traditional
school analysis, gerunds have noun jobs, participles have adjective jobs, and
to-infinitives can have noun, adjective or adverb jobs. Do not classify every
-ing word as a gerund: in "Bo is swimming," swimming is part of the verb phrase.

Practice: identify the verb and adverb in "Bo answered calmly," "Mina will return
soon," and "The team worked here." Then classify "Drawing takes time," "The
painted sign dried," and "Bo paused to listen." Change one adverb and explain
the changed meaning.

Check: answered/calmly, will return/soon, worked/here; drawing is a gerund,
painted a participle describing sign, and to listen a to-infinitive expressing
purpose. "Bo answered angrily" changes the manner, not the person answering.

[Gerunds](https://owl.purdue.edu/owl/general_writing/mechanics/gerunds_participles_and_infinitives/index.html),
[participles](https://owl.purdue.edu/owl/general_writing/mechanics/gerunds_participles_and_infinitives/participles.html),
[infinitives](https://owl.purdue.edu/owl/general_writing/mechanics/gerunds_participles_and_infinitives/infinitives.html)
`.trim(),
	"MSC3 Prepositions & Interjections": `
A preposition expresses a relationship, often of place, time or direction.
A prepositional phrase contains the preposition, its object and any modifiers:
"under the old bench." Under is the preposition, bench the object and old a
modifier. An interjection expresses a reaction, such as Oh or Wow, and can stand
apart from the sentence's main structure.

## Worked model

"Oh, the key is under the bench." Oh signals a mild reaction; under the bench
locates the key. "Wow! The key was inside the locked box!" makes the reaction
stronger. An exclamation mark changes emphasis; it does not turn a preposition
into an interjection.

Practice: label the preposition, object and whole phrase in "Bo waited near the
gate," "Mina arrived after lunch," and "The note lay inside a blue envelope."
Choose punctuation for a quiet "Oh" of recognition and an excited "Hooray."
Then combine a reaction and a location in one original example.

Check: near/gate/near the gate; after/lunch/after lunch;
inside/envelope/inside a blue envelope. "Oh, the gate is open" and "Hooray! We
found it!" are possible choices. Compare the intended strength of each reaction.
In "to the gate," to is a preposition; in "to leave," it introduces an infinitive.
`.trim(),
	"MSC4 Coordinating & Subordinating Conjunctions": `
Coordinating conjunctions join equal grammatical units. FANBOYS recalls for, and,
nor, but, or, yet and so. A subordinating conjunction such as because, although
or when introduces a dependent clause and shows a relationship between ideas.

## Worked contrast

"Mina found the key, and Bo opened the gate" has two independent clauses.
The comma and the conjunction **and** join them. "Mina found the key and opened
the gate" shares a subject and normally needs no comma between its two verb phrases.

"Because Mina found the key, Bo opened the gate" starts with a dependent clause,
so a comma marks its boundary. "Bo opened the gate because Mina found the key"
normally needs no comma before that following reason clause.

Practice: punctuate "Bo waited but Mina left"; "Mina found the key and opened
the gate"; "When the bell rang Bo packed"; "Bo packed when the bell rang."

Check: "Bo waited, but Mina left"; no comma in the shared-subject example;
"When the bell rang, Bo packed"; no comma in the final example. These examples
use the ordinary clause patterns; punctuation can vary when meaning or a deliberate
contrast changes. Label which words can stand alone before choosing the mark.

[Clause boundaries and commas](https://owl.purdue.edu/owl/general_writing/punctuation/commas/extended_rules_for_commas.html)
`.trim(),
	"MSC Check-In #1": `
The first concept review connects word classes to sentence jobs. Use the first
four readings for definitions, then supply a new example of each: noun, pronoun,
adjective, verb, adverb, gerund, participle, to-infinitive, preposition,
interjection, coordinating conjunction and subordinating conjunction.

## Original application passage

"Wow the painted sign looks bright. Mina carried it carefully to the gate.
Because the visitors arrived Bo stopped drawing. The guides checked the route
before it led the group inside."

Assume the guides are the people who lead the group. Label examples of the word
classes present, repair the reference and punctuation, and add original sentences
for any reviewed class missing from the passage.

## Check after the attempt

One repair is: "Wow! The painted sign looks bright. Mina carried it carefully
to the gate. Because the visitors arrived, Bo stopped drawing. The guides checked
the route before they led the group inside."

Sign is a noun; it a pronoun referring to sign; bright an adjective after the
linking verb looks; carried a verb; carefully an adverb; painted a participle;
drawing a gerund completing stopped; to the gate a prepositional phrase; Wow an
interjection; because a subordinating conjunction. Add a coordinating conjunction
and a to-infinitive, for example: "Bo wanted to draw, but the visitors needed him."
Record the reason for each repair rather than just copying the corrected text.
`.trim(),
	"MSC5 Capitalization": `
Capitalize the beginning of a sentence, the pronoun I and proper names. Proper
names include specific people, places, days and months. A generic season or
ordinary job description is normally lowercase. Capitalization in headings
depends on the chosen style; sentence case and title case are different systems.

## Worked model and practice

Draft: "on monday, i met mina at willow park. our winter club had a new guide."

Revision: "On Monday, I met Mina at Willow Park. Our winter club had a new guide."
On and Our begin sentences; Monday, Mina and Willow Park are proper names; I is
always capitalized as the English first-person pronoun. Winter and guide remain
generic here.

Use sentence case for this exercise's headings: capitalize the first word and
proper names. Repair the heading "a visit to willow park" and the sentences
"in june, bo will study english. the guide and i will help."

Check: "A visit to Willow Park"; "In June, Bo will study English. The guide and
I will help." The language name English is capitalized. Title case could instead
produce "A Visit to Willow Park"; identify the convention rather than treating
one style choice as the only possible rule for all headings.
`.trim(),
	"MSC6 Periods, Question Marks, Exclamation Points & Quotation Marks": `
A period closes an ordinary statement or a calm command. A question mark closes
a direct question. An exclamation point marks strong emotion or force. Quotation
marks enclose exact spoken or written words; a paraphrase does not need them.

## Worked dialogue models

The US punctuation convention used here places ordinary commas and periods
inside closing quotation marks. Question and exclamation marks follow meaning.

- Mina said, "The gate is open."
- "The gate is open," Mina said.
- Bo asked, "Is the gate open?"
- Did Mina say, "The gate is open"?

The third sentence quotes a question; the fourth asks a question about a quoted
statement. Do not add a second period after the question mark. A speaker tag such
as Mina said is different from an independent action: "The gate is open." Mina
lifted the latch.

Practice: supply punctuation for the statement "The bus arrived"; the question
"Has the bus arrived"; the urgent warning "Look out"; and dialogue "Mina said
we found it" / "Bo asked is it safe" (the words after each tag are spoken).

Check: "The bus arrived." / "Has the bus arrived?" / "Look out!" /
Mina said, "We found it." / Bo asked, "Is it safe?"

[Quotation punctuation](https://owl.purdue.edu/owl/general_writing/punctuation/quotation_marks/more_quotation_mark_rules.html)
`.trim(),
	"MSC7 Phrases & Clauses I": `
In these sentence-structure exercises, a clause contains a subject and a finite
verb, one that carries tense or works with a helping verb. An independent clause
can form a complete sentence. A dependent clause cannot stand alone as a complete
sentence in ordinary formal prose. A phrase does not have that full subject and
finite-verb structure, even if it contains a verbal.

## Worked classification

"Near the gate" is a phrase. "The guide waited" is an independent clause.
"Because the guide waited" is dependent: because makes the reader expect a main
clause. Adding a period does not remove that dependency. "Because the guide
waited, the visitors caught up" supplies the missing main clause.

Classify these six groups: "under the stairs"; "the red box"; "carrying a map";
"Bo opened the door"; "when Mina arrived"; "the visitors followed."
Then attach "when Mina arrived" and "because the rain stopped" to suitable
independent clauses. Repair "Near the gate." without inventing a different setting.

Check: the first three are phrases; the fourth and sixth are independent clauses;
the fifth is dependent. Possible completions: "When Mina arrived, Bo opened the
door" and "The visitors left because the rain stopped." "Bo waited near the gate"
repairs the final fragment. Commands can have an understood subject: "Wait here"
means that you should wait; an unwritten you does not make it a fragment.

[Fragments](https://owl.purdue.edu/owl/general_writing/mechanics/sentence_fragments.html)
`.trim(),
	"MSC8 Commas": `
A comma's role comes from sentence structure and meaning. A pause while reading
is not, by itself, a rule. The following examples cover the diagnosis set.

## Worked rule set

- List: "Bring paper, pencils, and tape." This course uses a serial comma.
- Introductory clause: "When the rain stopped, we left."
- Direct address: "Mina, bring the map." Mina is being spoken to.
- Interrupter: "The gate, however, stayed shut."
- Joined independent clauses: "Bo waited, but Mina left."
- No subject/verb comma: "The guide near the stairs waited."

For the core diagnosis, remove the punctuation from these six examples, restore
it and label each decision. Explain why near the stairs does not require a comma
between the subject guide and its verb waited.

## Optional mixed practice

Punctuate "The guide who has the key will open the gate"; "Mina our only guide
has the key"; "Bo carried the map and checked the route."

Check: no commas around who has the key when it identifies which guide;
"Mina, our only guide, has the key" uses paired commas for supplementary information;
the shared-subject final sentence needs no comma. Removing necessary identifying
information can change which person is meant. Supplementary information adds a
separate comment about an already identified person.

[Comma rules](https://owl.purdue.edu/owl/general_writing/punctuation/commas/extended_rules_for_commas.html)
`.trim(),
	"MSC9 Semicolons": `
A semicolon can connect related independent clauses without a coordinating
conjunction. For this use, each side must be a complete clause. A semicolon does
not turn a dependent clause or phrase into an independent one.

## Worked joins and practice

"The gate was locked; Mina had the key" keeps two related statements in one
sentence. A period would also work. "The gate was locked; however, Mina had the
key" uses however as a transition, not as a coordinating conjunction that lets
a comma alone join the clauses.

Join these pairs with semicolons: "The map was wet. Bo could still read it."
"Mina checked the latch. The visitors waited."
Repair "Bo waited; because the gate was locked."

Check: "The map was wet; Bo could still read it." / "Mina checked the latch;
the visitors waited." / "Bo waited because the gate was locked." The last
because clause depends on Bo waited and cannot serve as the second independent
side of a semicolon join. Explain the contrast or sequence connecting each pair.
Semicolons can also divide complex list items containing commas; that is a
different use from joining clauses.

[Semicolons](https://owl.purdue.edu/owl/general_writing/punctuation/punctuation/index.html)
`.trim(),
	"MSC10 Colons": `
In ordinary prose, a colon can introduce a list, explanation or quotation after
a complete independent clause. What follows should develop the expectation set
up before it. Other contexts, such as time notation, have separate conventions.

## Worked models

- List: "Mina packed three tools: a map, a compass, and a torch."
- Explanation: "Bo had one concern: the bridge was closed."
- Quotation: The sign gave one instruction: "Wait here."

Do not split a verb from its required complement: "Mina packed: a map and a torch"
needs no colon. Mina packed does not prepare a complete introduction to that list
in the intended construction.

Practice: repair "We need: paper, glue, and string"; add a list to "We need three
materials"; complete "The delay had one cause" with an explanation after a colon.

Check: "We need paper, glue, and string." / "We need three materials: paper, glue,
and string." / "The delay had one cause: the path was flooded." In the style used
here, an explanatory continuation stays lowercase unless it begins a quotation
or a proper name. Other style guides may capitalize a full sentence after a colon;
apply one declared convention consistently.

[Colons](https://owl.purdue.edu/owl/general_writing/punctuation/punctuation/index.html)
`.trim(),
	"MSC11 Common Punctuation Errors": `
A comma splice joins independent clauses with only a comma. A fused sentence
joins them without a suitable boundary. Length is not the test: "Bo ran Mina
walked" is short and still fused.

## Worked boundary repair

"Bo waited, Mina left" can become "Bo waited. Mina left"; "Bo waited; Mina left";
"Bo waited, but Mina left"; or "Although Bo waited, Mina left." The last two
make a contrast explicit. Choose the relationship, not just a mark.

Repair two comma splices: "Mina drew the map, Bo labeled it" and "The rain stopped,
the path stayed wet." Repair two fused sentences: "Bo packed Mina checked the
door" and "The guide waved the visitors followed."

Check: "Mina drew the map, and Bo labeled it." / "The rain stopped, but the path
stayed wet." / "Bo packed; Mina checked the door." / "The guide waved. The visitors
followed." Other valid boundaries can preserve the same meaning.

## Adjectives and passage edit

Coordinate adjectives independently describe a noun: "a cold, windy morning" and
"a bright, cheerful room." Reversing their order or inserting and works. Cumulative
adjectives build a unit: "a small wooden box" and "three blue flags" normally take
no comma between the adjectives. Test meaning and natural order rather than
inserting a comma wherever two describing words appear.

Edit this original passage: "mina packed a small, wooden box, bo carried a cold
heavy lantern. they had one problem: The key was missing they searched again"

One repair: "Mina packed a small wooden box; Bo carried a cold, heavy lantern.
They had one problem: the key was missing. They searched again." Label the name
and sentence-start capitals, cumulative/coordinate adjective choices, comma
splice, colon style and fused boundary. For clarity, "They searched the bench
again" replaces a vague action with an explicit place.

[Adjective commas](https://owl.purdue.edu/owl/general_writing/punctuation/commas/extended_rules_for_commas.html)
`.trim(),
	"MSC12 Pauses & Breaks": `
Dashes can emphasize an interruption or an added explanation. Parentheses make
supplementary information feel more like an aside. An ellipsis can show omitted
words in a quotation or a trailing thought in dialogue. These marks are choices
with different effects, not interchangeable decorations.

## Worked comparison

"Mina found the key (the spare from last winter) in her coat" puts the spare-key
detail aside. "Mina found the key&#8212;the spare from last winter&#8212;in her coat"
emphasizes it with dashes. The main sentence must still read "Mina found the key
in her coat" when the aside is removed. A hyphen joining words is a different mark.

"I thought the key was..." Bo stopped speaking. Here the ellipsis shows an
unfinished thought. For an omission, original fictional note "Bring the map,
the spare key, and the blue folder" can be shortened to "Bring the map ... and
the blue folder." The omission must not be used to misrepresent the note as a
complete packing list.

Practice: write the parenthetical and dash versions of the key sentence, then
write one trailing line of dialogue and one honestly shortened quotation from
the note. Label aside, emphasis, trailing thought or omission. Check that the
uninterrupted sentence remains grammatical and the quotation's stated meaning
is preserved.

[Punctuation effects](https://owl.purdue.edu/owl/general_writing/academic_writing/adding_emphasis/punctuation_marks.html)
`.trim(),
	"MSC Check-In #2": `
Use the mechanics readings to build the rule record, then edit a fresh passage.
Name the sentence boundary or meaning that justifies each change. Several
punctuation choices may be valid if the resulting meaning is clear.

## Original application passage

"on friday mina asked is the gate open bo said yes the key is here. because the
rain stopped they packed three things: a map a torch and string. bo checked the
route, mina closed the box. the visitors tired but cheerful waited near the door"

## One checked revision

On Friday, Mina asked, "Is the gate open?" Bo said, "Yes, the key is here."
Because the rain stopped, they packed three things: a map, a torch, and string.
Bo checked the route; Mina closed the box. The visitors, tired but cheerful,
waited near the door.

The revision marks sentence starts and a day name, exact speech, a quoted
question, an introductory dependent clause, a list after a complete starter,
a semicolon between independent clauses and paired commas around a supplementary
description. Explain any different valid choice. Then add a parenthetical or
dash aside and a line of trailing dialogue, labeling the changed emphasis or
incompleteness. Retain the original passage beside the revision in the edit log.
`.trim(),
	"MSC13 Subjects & Predicates": `
A complete subject names who or what the clause is about, including its modifiers.
The complete predicate contains the verb and what is said about the subject.
The simple subject is its main noun or pronoun; the simple predicate is the verb
or verb phrase, including helping verbs.

## Worked map

"The patient guide near the gate will carry the spare map."

- Complete subject: The patient guide near the gate.
- Simple subject: guide.
- Complete predicate: will carry the spare map.
- Simple predicate: will carry.

Removing near the gate reveals "The patient guide will carry the spare map."
It is a temporary structure check, not a claim that the location is unimportant.

Map all four parts in "The red bus stopped at noon," "Mina and Bo were waiting,"
and "The notes in the blue folder have disappeared."

Check: The red bus / bus / stopped at noon / stopped; Mina and Bo / Mina and Bo
(compound simple subject) / were waiting / were waiting; The notes in the blue
folder / notes / have disappeared / have disappeared. Folder is inside a modifying
phrase and does not replace notes as the subject. In "Open the gate," the
subject is understood you and the predicate is open the gate.
`.trim(),
	"MSC14 Direct & Indirect Objects": `
A direct object completes a transitive verb by naming what or whom the action
concerns. An indirect object, in the pattern practiced here, names a recipient
or beneficiary before the direct object. Not every clause has either object.
A complement after a linking verb is not automatically an object.

## Worked maps

- "Mina gave Bo a map": subject Mina; verb gave; indirect object Bo; direct
  object a map. Ask gave what, then gave a map to whom.
- "Bo carried the lantern": subject Bo; verb carried; direct object the lantern;
  no indirect object.
- "The guide showed Mina the route": subject The guide; verb showed; indirect
  object Mina; direct object the route.

In "Mina gave a map to Bo," to Bo is a prepositional phrase. In this course's
traditional sentence maps, Bo is its prepositional object rather than an indirect
object in the double-object pattern. "The lantern is bright" uses a linking verb
and an adjective complement; bright is not a direct object.

Practice: map "Bo sent Mina a note," "Mina opened the gate," and "The guide lent
Bo a pencil." Repair "The visitors near the gate" as a complete sentence.

Check: Bo / sent / Mina (indirect) / a note (direct); Mina / opened / no indirect
object / the gate (direct); The guide / lent / Bo (indirect) / a pencil (direct).
"The visitors waited near the gate" supplies the missing verb without requiring
an object. Use labels or arrows; an elaborate drawing is not needed for a map.
`.trim(),
	"MSC15 Phrases & Clauses II": `
Expansion adds information while retaining a complete main clause. A phrase can
locate an action or describe a participant. A dependent clause can explain when,
why or under what condition it happens. Choose the relationship before adding words.

## Worked expansion

Base: "Mina opened the box."

Phrase: "Mina opened the box near the window." Near the window locates the action.
Dependent clause: "When the visitors arrived, Mina opened the box." When the
visitors arrived adds timing and contains its own subject and finite verb.
"Because the visitors arrived, Mina opened the box" changes that relationship
to a reason; it is not just a longer version with the same meaning.

Expand "Bo carried the map" once with a phrase identifying the map and once with
a dependent clause explaining timing. Label the additions and check the main
clause after removing them.

Possible answers: "Bo carried the map in the blue folder" identifies which map;
"Before the guide spoke, Bo carried the map to the table" adds a timing clause
and a location phrase. The surviving main clause remains complete. If the folder
phrase could instead describe how Bo carried it, rewrite as "Bo carried the map
that was inside the blue folder" to make the intended reference explicit.
`.trim(),
	"MSC16 Sentence Types": `
Count independent and dependent clauses to classify structure. Sentence length
and the presence of and alone do not determine the type.

## One event in four forms

| Type | Original example | Structure |
| --- | --- | --- |
| Simple | Mina packed and left. | One independent clause; a shared subject with two verbs. |
| Compound | Mina packed, and Bo waited. | Two independent clauses; no dependent clause. |
| Complex | When Mina packed, Bo waited. | One dependent clause and one independent clause. |
| Compound-complex | When Mina packed, Bo waited, and the guide checked the route. | One dependent clause and two independent clauses. |

Capital letters and full stops mark the written sentences, while clause structure
explains the classifications. A simple sentence can contain a long phrase or a
compound subject; neither automatically adds a dependent clause.

## Mixed practice

Classify "Bo and Mina carried the maps"; "The gate opened, so the group left";
"The group left after the gate opened"; "After the gate opened, the group left,
but Bo stayed." Repair "Because the guide waited." Then combine "The guide
waited. Mina found the key. Bo opened the gate" into a short paragraph with two
different sentence types.

Check: simple, compound, complex, compound-complex. One repair is "Because the
guide waited, the visitors caught up." One varied paragraph is "The guide waited.
When Mina found the key, Bo opened the gate." Explain why the change in structure
helps communicate timing rather than just trying to maximize complexity.

[Sentence types](https://owl.purdue.edu/owl/general_writing/academic_writing/sentence_variety/sentence_types.html)
`.trim(),
	"MSC Check-In #3": `
Use subjects, predicates, objects, phrases and clauses together to explain how
a sentence works. A correct label identifies a particular word group and its job.

## Original application passage

"The guide near the gate handed Mina a map. Bo was ready. The gate opened.
The visitors followed. Because the path was clear."

Map the first sentence's complete and simple subject, predicate, direct object
and indirect object. Identify the prepositional phrase. Revise the remaining
sentences to repair the fragment and vary the structure without changing who
performs each action.

## One checked revision

The guide near the gate handed Mina a map. Bo was ready, and when the gate opened,
the visitors followed because the path was clear.

In the first sentence, the complete subject is The guide near the gate; the simple
subject is guide; the complete predicate is handed Mina a map; the simple predicate
is handed; Mina is the indirect object and a map the direct object. Near the gate
is a prepositional phrase modifying guide. The revised second sentence has two
independent clauses and dependent clauses introduced by when and because, making
it compound-complex. Timing and reason are now explicit. Compare that effect with
the original short sentences and justify a different valid revision if preferred.
`.trim(),
	"MSC17 Master Project": `
Choose a grammar lesson or a mechanics portfolio. Both demonstrate at least three
course concepts through identifiable examples, explanations and a review of the
actual wording. The plan names the path, audience, concepts and evidence for each.

## Worked planning model

For a lesson on sentence boundaries, the three concepts could be independent
clauses, coordinating conjunctions and semicolons. Show a labeled model for each,
then create 3–5 practice questions for each concept with an answer key. Explain
the rule in speaker notes. A text handout with labels can supply the same content
as slides; delivery may be private or part of a guided walkthrough.

For a portfolio, begin with this original fictional draft or a chosen narrative:
"mina found a small, wooden box, bo carried it. because the box was locked.
the guide gave mina a key she opened the box."

One model revision: "Mina found a small wooden box, and Bo carried it. Because
the box was locked, the guide gave Mina a key. Mina opened the box." Record three
changes: name capitals, cumulative-adjective punctuation and sentence-boundary
repairs. Explain how the repairs clarify the sequence.

Use the earlier readings' checked examples to verify rules, then make fresh
examples or meaningful revisions. The finished lesson includes the question key;
the portfolio includes the original, revision and at least three explained
improvements. Test each explanation against the actual sentence and revise one
weak example before presenting or sharing the selected project.
`.trim()
};

export function applyGrammarMechanicsReadings(
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
				`Missing Grammar and Mechanics reading: ${original.title}`
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
			...module.supplementalProjects
				.filter(project => !sourceTitles.has(project.title))
				.map(project => {
					const activities =
						grammarMechanicsActivities[original.title];
					if (!activities) {
						throw new Error(
							`Missing grammar practice: ${original.title}`
						);
					}
					const content = project.title.startsWith("Practice Map:")
						? activities.practice
						: project.title.startsWith("Extension Review:")
							? activities.extension
							: undefined;
					return content
						? {
								...project,
								content: formatAuthoredAssignment(content),
								contentKind: "assignment" as const,
								preserveInstructions: true,
								preserveAssignment: true
							}
						: project;
				})
		];
	}
}
