import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";

const readings: Record<string, string> = {
	"ENT1 Design Thinking Methodology": `
Design thinking investigates a user's problem before committing to a solution.
Empathize means gathering observations; define means stating the need; ideate
means considering several approaches; prototype means making a small version to
learn from; test means observing what happens. New evidence can send the work
back to an earlier stage.

## Worked example: Desk Pouch

Desk Pouch is a fictional reusable stationery organizer used throughout these
readings. Its proposed customer carries small supplies between learning spaces.
"The customer needs quicker access to supplies because loose items are hard to
find" is a problem statement. "Everyone needs our pouch" is an untested claim.
Possible solutions include a divided pouch, a clip-on tray and a packing
checklist. A folded-paper model can test compartment layout before any product
is manufactured.

A Lean Canvas is a one-page collection of connected business assumptions:

| Box | Initial Desk Pouch assumption |
| --- | --- |
| Problem | Small supplies become difficult to find during room changes. |
| Customer segments | Learners who regularly carry supplies; a purchaser may be someone else. |
| Solution | A portable organizer with visible compartments. |
| Value proposition | Find the needed supply without emptying the bag. |
| Channels | A product demonstration and a private order-page mockup. |
| Revenue streams | One payment per organizer. |
| Cost structure | Materials, labor, packaging and fixed operating costs. |
| Key metrics | Successful retrievals, paid orders and cost per unit. |
| Unfair advantage | None established; an easily copied color choice is insufficient. |

Each box needs an assumption or an evidence-backed statement. The first test is
whether the layout helps retrieval; a polished logo cannot answer that question.
Keep one portfolio containing the canvas, observations, prototype versions and
decisions, so later revisions can be traced to their causes.

[Design-thinking process](https://web.stanford.edu/class/me113/d_thinking.html)
`.trim(),
	"ENT2 Learning What It Takes To Be An Entrepreneur": `
An entrepreneur organizes resources to test and deliver an offer under
uncertainty. A strength is a useful capability; a value is a principle that guides
a choice. Neither a confident personality nor a successful-looking presentation
establishes customer demand. A founder can use a team or learn a missing skill.

## Worked example

The fictional Desk Pouch team lists sketching and careful measurement as
strengths. Its value of honesty becomes a concrete behavior: report an unsuccessful
prototype test rather than describing it as a success. The team still needs to
learn how to estimate labor costs; that gap belongs in the plan.

Use these fictional observation notes for a first empathy record:

| Observation | Interpretation to test |
| --- | --- |
| A learner empties a bag to find a ruler. | A visible compartment might shorten the search. |
| Another learner uses a homemade cardboard divider. | An existing low-cost alternative may already solve the problem. |
| A third learner leaves an organizer at home because it is bulky. | Portability may matter more than extra pockets. |

An observation describes an action. "The learner is careless" assigns a motive
without evidence. A useful persona summarizes a pattern of needs and constraints;
it is not a biography of an identifiable person. These invented notes can support
practice, but cannot establish what real customers want.

For the founder sketch, connect each chosen strength to a task and each value to
an observable decision. A fictional team profile supports the same analysis as a
personal profile.
`.trim(),
	"ENT3 Solving Problems Through Entrepreneurship": `
A problem statement names a user, a difficulty and the consequence. A solution
statement explains how an offer addresses that difficulty. A feature describes
what the offer has; a benefit explains why that feature matters to the user.
A prototype is a deliberately limited model used to answer a question.

## Worked example

Desk Pouch's problem is that supplies are difficult to retrieve during room
changes. Its proposed solution is a compact organizer with visible compartments.
"Three labeled pockets" is a feature; "find the ruler without unpacking" is the
intended benefit. Whether it delivers that benefit remains testable.

Fold paper into three compartments, label them pencil, ruler and eraser, and
sketch the closure. Walk through packing, carrying, opening and retrieving one
item. Record where an item sticks or falls out. A service prototype instead can
use a flowchart showing request, confirmation, delivery and follow-up. Either
prototype needs enough detail to expose a failure, rather than only advertise it.

A name, text mark and tagline identify the offer. They do not replace a working
customer journey. A one-page paper description is enough to present the model.

Compare survey questions:

- Leading: "How much do you love our convenient organizer?"
- Neutral: "Describe how supplies are stored now and what is difficult about it."
- Concrete follow-up: "Which step in this paper model was unclear?"
- Price question: "At what price would this be too expensive, and why?"

Ask about current behavior before reactions to a proposed solution. A favorable
answer or stated willingness to pay is evidence about an opinion, not a sale.
Select three to five possible feedback roles, such as user and purchaser, and
record what each role can assess.
`.trim(),
	"ENT4 Identifying the Ideal Customer": `
A customer segment is a group with a shared need and buying context. A persona
is a concise model of that segment's goals, constraints and habits. The user and
the person paying can differ. An early adopter has a strong enough need to try
an unfamiliar solution; that does not imply everyone in the segment will buy.

## Worked example and survey inputs

Desk Pouch's initial persona is a learner moving between rooms, carrying a small
bag and needing quick access to a few supplies. A purchaser may prioritize price
and durability. These are hypotheses, not facts inferred from an age or income
range. Ask what is used now, when retrieval is difficult, what has already been
tried, what fits in the bag, and what would justify changing the current method.

Use this fictional response set if no outside feedback is available:

| Response | Current method | Reaction to the paper model |
| --- | --- | --- |
| A | Loose bag | Labels look helpful; wants room for a long ruler. |
| B | Small pouch | Likes the compact size; wants removable dividers. |
| C | Cardboard divider | Would keep the free homemade version. |
| D | Large organizer | Wants more pockets even if the product becomes larger. |

Four invented responses let the decision process be practiced. They do not
estimate market size, demand or a population percentage. Preserve disagreements
instead of treating the persona as a reason to discard inconvenient responses.

## Optional coffee-shop case without an external game

The following days are simulated. Recipe is unchanged; visitors are potential
customers, and each sold cup is one purchase.

| Day | Weather | Visitors | Price per cup | Cups sold |
| --- | --- | ---: | ---: | ---: |
| A | Mild | 60 | $2.00 | 45 |
| B | Mild | 60 | $2.50 | 38 |
| C | Hot | 45 | $2.50 | 20 |

Revenue equals price times cups sold: $90, $95 and $50. Purchase rates are 75%,
about 63.3% and about 44.4%. Day B has fewer sales but more revenue than A.
Profit also needs costs. Separate days are not a controlled experiment, and C
changes weather and visitor count, so the table alone cannot isolate causes.

[Market research](https://www.sba.gov/counseling/plan-your-business/#market-research-and-competitive-analysis)
`.trim(),
	"ENT5 Iterating On Your Idea": `
Iteration is a deliberate revision followed by another test. An observation is
what happened; an interpretation explains it; a decision chooses what to change.
Record the response count, how respondents were selected and what the test could
actually reveal. A small convenience sample cannot establish population demand.

## Worked example

Use the four fictional Desk Pouch responses from ENT4. A requests a long-ruler
space, B requests removable dividers, C prefers a free existing alternative and
D requests a larger product. These are four distinct reactions, not unanimous
support. C is a reason to investigate whether the new offer adds enough value;
it is not a response to delete.

The current target segment carries a small bag. Keep the compact outside size,
sketch a removable divider and a ruler slot, and defer D's larger version.
This decision follows the chosen segment and can still be wrong. Preserve both
sketches and write: "Version 2 changes the divider and ruler space; the exterior
size stays fixed. The next test checks whether a ruler fits while supplies remain
accessible." A proposed change is not verified merely because feedback suggested it.

Choose an observable criterion before testing, such as retrieving the ruler
without unloading the other supplies. Use the same task on both prototypes and
record attempts, successes and failures. If the task remains simulated, label
the results as predictions. Cost, comfort and durability require their own
evidence; a paper layout test does not establish those properties.
`.trim(),
	"ENT6 Conducting Competitor Analysis": `
A direct competitor offers a similar solution to the same segment. An indirect
competitor solves the underlying need differently; doing nothing or making a
homemade alternative can also compete for the customer's decision. Compare the
same attributes on the same basis, and record a source and date for real claims.

## Worked comparison

These invented offers provide a complete practice set:

| Offer | Price | Size | Important tradeoff |
| --- | ---: | --- | --- |
| Simple bag | $8 | Compact | Few compartments. |
| Desk Pouch proposal | $18 | Compact | Removable divider; durability untested. |
| Large organizer | $20 | Bulky | More storage; occupies more bag space. |
| Homemade divider | $0 purchase price | Adjustable | Requires available materials and making time. |

Draw a matrix with price on the horizontal axis and size on the vertical axis.
Label the size categories rather than assigning unexplained quality scores.
Desk Pouch has a possible compact-organization niche, but the $8 bag and free
divider remain plausible choices. "No competitors" would miss those alternatives.

Differentiation is a specific distinction customers may value. A sustaining
innovation improves an offer for existing users; a new-market approach reaches
people previously unable or unwilling to use the category. Here, integrative
means combining existing components or practices into one solution. Disruptive
innovation describes a trajectory from an overlooked or new market toward
established competitors; being new or inexpensive alone does not establish it.

The divider proposal can be described as an incremental or integrative change.
There is no evidence yet for a disruptive trajectory. A positioning hypothesis
needs a prototype test and credible comparisons before it becomes a sales claim.

[Competitive analysis](https://www.sba.gov/counseling/plan-your-business/#market-research-and-competitive-analysis)
· [Disruptive innovation](https://www.christenseninstitute.org/theory/disruptive-innovation/)
`.trim(),
	"ENT7 Testing Financial Feasibility": `
Revenue is money earned from sales before subtracting expenses. A variable cost
changes with the number of units sold; a fixed cost is held constant within the
stated period and capacity. Unit contribution is price minus variable cost per
unit. It contributes toward fixed costs and then profit.

For a simple one-product model, let p be price, v variable cost per unit, q units
sold and F fixed costs for the same period:

- Revenue = p × q.
- Total modeled cost = F + v × q.
- Modeled profit = revenue - total modeled cost.
- Modeled profit margin = 100 × profit / revenue, when revenue is positive.
- Break-even units = F / (p - v), rounded up for indivisible units when F > 0
  and p > v.

## Worked annual forecast

Assume one Desk Pouch per customer, all produced units sold, p=$18, v=$10 and
F=$2,400 for one year. The $10 includes estimated materials, packaging and labor;
the $2,400 includes the model's fixed operating costs. These are fictional inputs.

| Case | Customers / units | Revenue | Total cost | Profit | Margin |
| --- | ---: | ---: | ---: | ---: | ---: |
| Low | 200 | $3,600 | $4,400 | -$800 | -22.2% |
| Base | 1,000 | $18,000 | $12,400 | $5,600 | 31.1% |
| High | 1,500 | $27,000 | $17,400 | $9,600 | 35.6% |

Contribution is $8 per unit, so break-even is 2,400/8=300 units. At 500 units,
revenue is $9,000 and total cost is $7,400, giving $1,600 profit and about 17.8%
margin. At zero revenue the margin is undefined. If price is at or below variable
cost and F is positive, no sales volume covers that fixed cost in this model.

The model assumes unchanged price, unit cost and capacity. One thousand customers
is a scenario, not a demand forecast supported by the four practice responses.
List additional expenses before using the model for a real venture. The figures
exclude financing and taxes, so they are not a company's net profit margin.
Compare an industry figure only after checking its period, cost coverage and
margin definition. Margin uses revenue as denominator; markup uses cost.

[Break-even calculation](https://legacy.sba.gov/business-guide/plan-your-business/calculate-your-startup-costs/break-even-point/calculate)
`.trim(),
	"ENT8 Building and Testing Marketing Strategies": `
A value proposition identifies a customer, a useful outcome and a reason to
choose the offer. A feature names a property; a benefit connects that property
to the customer's need. A channel is how the offer reaches people or how a
purchase happens. Use a channel that fits the segment and the decision being
tested, rather than assuming every business needs every platform.

## Worked example

"Desk Pouch helps learners who carry supplies between rooms find a needed item
without emptying the bag, using a compact layout with removable dividers" is a
testable value proposition. "The world's best organizer" has no defined comparison.
The promised retrieval benefit still needs observation with the prototype.

Sketch a demonstration and a private order-page mockup. Keep the same product
name, price, benefit and depiction in both. A suitable call to action for a
prototype test is "Try the layout and describe where an item is hard to reach."
That action gathers usability feedback rather than pretending to collect orders.

In a fictional channel test, 60 people view the mockup and 12 choose to give
feedback. The feedback response rate is 12/60=20%. Those 12 responses are not 12
sales, and the visitors are not necessarily representative of all customers.

For a separate hypothetical paid campaign, an additional $120 cost outside the
ENT7 baseline needs 120/8=15 additional units at $8 contribution just to cover
that campaign expense. Existing sales cannot all be credited to the campaign.
There is no evidence here that the campaign will generate those extra units.
Assess message clarity and a proposed measurement plan with private mockups;
publishing a campaign is not necessary to evaluate them.
`.trim(),
	"ENT9 Focusing on Social Impact": `
Social impact includes effects on people and communities; environmental impact
includes resource use, waste and emissions. A product can improve one measure
while worsening another. Define the measure, comparison and boundary before
making a claim. A material name or a donation promise alone does not establish
overall benefit.

## Worked tradeoff

Suppose an alternative Desk Pouch package uses 12 g of material instead of 20 g,
but raises the total variable cost from $10 to $12 per unit. At 1,000 units the
packaging difference is 8 g × 1,000=8,000 g=8 kg. This is a fictional material-mass
comparison. It does not measure manufacturing energy, shipping, recycling or
the full product lifecycle, so "8 kg less packaging material in this scenario"
is supported; "zero environmental impact" is not.

Keep price $18, annual units 1,000 and fixed costs $2,400. Revised cost is
2,400 + 12 × 1,000=$14,400; profit is $3,600; modeled margin is 20%. Contribution
falls to $6 and break-even rises to 400 units. The impact choice therefore changes
financial feasibility. Raising price to $20 would restore $5,600 modeled profit
at the same quantity, but unchanged demand at that price is another assumption.

Review labor, access, repair, packaging, delivery and end-of-use as separate
questions. Mark unknown evidence rather than inventing supplier practices.
An optional cause-aligned page can state a bounded proposed practice, the evidence
needed and its cost tradeoff. A future promise remains a promise until performed.
`.trim(),
	"ENT10 Be Your Own Boss Master Project": `
A business model explains how an offer creates value, reaches a customer and
covers its costs. A pitch communicates that model and its strongest evidence.
The final canvas connects the earlier portfolio work; its assumptions must agree
with the final prototype and financial model.

## Worked reconciliation

Desk Pouch's final practice canvas keeps the compact, removable-divider idea.
Its user segment is learners carrying supplies between rooms; its purchaser may
be another person. The demonstration is the proposed channel, retrieval is the
benefit to test, and no unfair advantage is established. If the ENT9 package is
selected, the final canvas records $18 price, $12 variable cost and $2,400 annual
fixed cost. At an assumed 1,000 annual units, modeled profit is $3,600, not the
earlier $5,600 based on a $10 unit cost.

A concise pitch can follow this order:

1. Problem and customer: what difficulty occurs, and for whom?
2. Solution: show the prototype and its proposed benefit.
3. Evidence: distinguish observations, simulated responses and untested claims.
4. Alternatives: explain a specific difference and an important competitor strength.
5. Business model: state price, period, costs, volume assumptions and downside case.
6. Next test: request a defined prototype review rather than imply a finished launch.

For self-review, check whether each claim has a matching artifact, each number
uses the final model, each competitor comparison uses consistent fields, and
each unsupported statement is labeled as an assumption. Then write one concern
about clarity, feasibility and differentiation, revise the pitch, and record why.
An opt-in reviewer can use the same questions.

The four fictional responses support practice in interpreting feedback; they
are not four real customers or proof of demand. A complete private portfolio
contains the canvas, prototype versions, research notes, scenario calculations,
marketing mockup, impact tradeoff and pitch revision. Its purpose is to demonstrate
reasoned venture design, with uncertainty still visible.
`.trim()
};

interface SupplementalExercises {
	practice: string;
	challenge: string;
}

const practiceByModule: Record<string, SupplementalExercises | undefined> = {
	ENT1: {
		practice: `
Sort these Desk Pouch notes into observation and assumption: "The ruler
took 25 seconds to find" and "More pockets will solve the problem." Write a
need statement using the observation. Sketch two ways to meet that need and
describe a fair retrieval test.

**Completion evidence:**
- Record what the 25-second trial measured and one detail that was held
  fixed, such as the ruler position.
- Label each sketch with the need it addresses. In both trials start with
  the pouch closed and stop the timer when the ruler is in hand.
`,
		challenge: `
In two trials, the divided pouch takes 12 and 14 seconds to open and
retrieve a ruler. The loose bag takes 20 and 18 seconds. Calculate each
average. If the pouch still exceeds a 10-second target, identify a change
to test and keep the same retrieval steps.

**Completion evidence:**
- Show the two arithmetic means and the six-second difference using the
  four observed times.
- Compare the pouch mean with the ten-second target. Specify a single
  prototype change and hold the ruler position and retrieval procedure
  constant when repeating the test.
`
	},
	ENT2: {
		practice: `
A fictional team can sketch and sew but has little experience estimating
labor. Assign one task to each strength and choose a person or source that
can help estimate labor. Write one action that shows how the team will
report an unsuccessful test.

**Completion evidence:**
- List each task beside the skill used to complete it. Include who will
  estimate labor, the unit of time and the pieces of work that need an
  estimate.
- Give a sample sentence that communicates a failed result and what remains
  uncertain.
`,
		challenge: `
A prototype test fails just before the team presents its idea. Write a two-
sentence update that preserves the original test result and describes the
next step. Explain which detail a buyer and a teammate would each need to
evaluate the update.

**Completion evidence:**
- Retain the date and observation from the original test so the result can
  be checked.
- Name one detail that helps a buyer judge whether the prototype is usable
  and one that helps a teammate reproduce the failure. Include a plan to
  try the next change.
`
	},
	ENT3: {
		practice: `
A learner loses time searching for a ruler during room changes. Write a
one-sentence problem, then label a prototype feature and the benefit it
aims to provide. Walk through packing, carrying and retrieving the ruler.
Mark one step the prototype can test.

**Completion evidence:**
- Use a sketch or flowchart to show the start and end of the retrieval
  step.
- Write a test observation that a second person could record, such as
  elapsed seconds from opening the pouch to holding the ruler. State which
  part of the solution the prototype leaves untested.
`,
		challenge: `
Revise the pouch for a learner who uses one hand to open it. Compare two
paper closures against the same two criteria: opening with one hand and
keeping supplies from falling out. Record one prediction, the model result
and a change to test next.

**Completion evidence:**
- Use the same set of supplies and opening steps for both closure tests.
- Keep one record per design of whether it opened with one hand and whether
  anything fell out. Use the results to explain which design to change and
  what to test again.
`
	},
	ENT4: {
		practice: `
Use the four fictional survey responses in the lesson to write one need
shared by two or more respondents and one disagreement. Draft an open
question that would help resolve the disagreement. State what the four
responses can support.

**Completion evidence:**
- Cite the response letters that support the shared need and the
  disagreement. If a need is inferred, label it as an interpretation.
- Write the follow-up question so it can collect either answer. Explain the
  limit on drawing conclusions from four fictional responses.
`,
		challenge: `
Compare the learner who carries the pouch with the purchaser who pays for
it. Give each role one decision criterion and one neutral question grounded
in that criterion. Explain how the two answers could lead to different
design revisions.

**Completion evidence:**
- Choose one criterion for assessing the pouch during use and another for
  evaluating it before making a purchase decision.
- Link each question to a possible revision. For example, a question about
  carrying space could inform size, and a question about replacement cost
  could inform durability.
`
	},
	ENT5: {
		practice: `
Organize three fictional comments: keep the pouch compact, add room for a
long ruler and add more pockets even if it grows. Group the comments into
keep, change and conflict. Choose one revision and say which comments it
addresses.

**Completion evidence:**
- Show the two comments that create a size tradeoff. Label the compact size
  as evidence to retain and note what an added pocket might cost in space.
- Choose one revision to try first and describe one observation that would
  make you reconsider it.
`,
		challenge: `
Set a test for a removable divider using the same packing list on both
prototypes. Predict an improvement, record one effect that would count
against it and state what outcome would justify keeping the original
divider.

**Completion evidence:**
- Use the same items, packing order and retrieval target for both versions.
  Record seconds to retrieve the ruler and whether any item was displaced.
- Give a rule for keeping the original, such as when the new divider makes
  retrieval harder or fails to keep supplies in place.
`
	},
	ENT6: {
		practice: `
Compare a free cardboard divider, a $6 plain pouch and an $18 organizer.
Rate each on price and how easily a long ruler can be retrieved, using one
reason per rating. Place Desk Pouch at a tentative position and state which
rating still needs a test.

**Completion evidence:**
- Share a two-axis sketch or table and label its price units. Use
  observable features such as a visible opening or slot to justify
  tentative retrieval ratings.
- Identify one rating that needs a timed trial and describe the setup that
  would make the test comparable across options.
`,
		challenge: `
Suppose the $6 pouch adds a visible ruler pocket and keeps its price.
Update your positioning matrix. Name one way Desk Pouch could still serve a
distinct need and define evidence a buyer could use to compare the two
offers.

**Completion evidence:**
- Keep the two original axes and show which point moved. Identify what
  evidence supports the changed placement.
- Distinguish a proposed advantage from a result that was measured. Specify
  a brief comparison with both pouches and the same ruler and supplies.
`
	},
	ENT7: {
		practice: `
At $18 per sale, $10 in variable cost and $2,400 in fixed costs, calculate
revenue, total cost and profit at 500 sales. Find the contribution per sale
as price minus variable cost, and divide fixed costs by that amount to
check break-even.

**Completion evidence:**
- Show 500 sales times the price, and add fixed cost once to the variable
  cost for 500 units.
- Check that expected profit is $1,600 and that 300 sales cover the
  original fixed costs. Label which figures are estimates and state the
  period they describe.
`,
		challenge: `
Repeat the 500-sale case after variable cost increases by $2. Compare the
two profits and break-even quantities. Explain how many additional sales
the new costs require to break even and which cost estimate to
check first.

**Completion evidence:**
- Show the new contribution per sale and use the same fixed costs and
  500-sales case.
- Check the revised profit of $600 and break-even at 400 sales. Connect the
  100 extra sales to the change in per-unit contribution and name a way to
  verify the labor or materials estimate.
`
	},
	ENT8: {
		practice: `
Write a value proposition that names the Desk Pouch buyer, the retrieval
problem and one supported benefit. Draft one private launch message and a
call to action. Check that the message describes a result the prototype
test can support.

**Completion evidence:**
- Underline the buyer and benefit in the value proposition. Include the
  private message and a single action it asks the audience to take.
- Pair the benefit with one observation from the prototype. Revise any
  wording that promises a result outside what that observation measures.
`,
		challenge: `
Compare a short product demonstration for a learner with a one-page order
mockup for a purchaser. Use the same offer for both. Identify one response
to measure for each audience and explain how a successful response would
inform the next revision.

**Completion evidence:**
- Keep the price, features and stated benefit the same in both versions.
- Name a measurable response for each format, such as successful retrieval
  in the demonstration or correct identification of the offer on the
  mockup. Explain what you would revise if that response were missed.
`
	},
	ENT9: {
		practice: `
Compare standard packaging with an option that adds $1 per unit and uses 15
grams less material per shipment. For 500 units, calculate the added
expense and material reduction. Identify one measurement that would help
assess the actual environmental impact.

**Completion evidence:**
- Show the arithmetic in both dollars and grams, then convert the material
  difference to kilograms.
- Check that 500 shipments add $500 and reduce packaging weight by 7.5
  kilograms. State an input, such as material source or transport distance,
  needed for a broader impact assessment.
`,
		challenge: `
Write a product-page claim supported by the package weight comparison.
State the specific comparison and units. Then revise the claim for a
supplier whose package is lighter but has an undocumented material source.
Record which evidence would support a stronger claim.

**Completion evidence:**
- Quote the limited comparison a customer could confirm, such as 15 grams
  less packaging per shipment than the standard pack.
- Identify a missing supplier record for the material source. Describe the
  specific claim that record would let you support and what would still
  require measurement.
`
	},
	ENT10: {
		practice: `
Select one portfolio decision and label its assumption, test, result and
revision. Place the supporting artifact next to the corresponding Lean
Canvas box. Draft a short pitch sentence that makes the result and its
limit clear.

**Completion evidence:**
- Label where the supporting file belongs, such as a cost calculation next
  to Cost Structure or retrieval-test results next to Key Metrics.
- Include an original assumption and a corrected statement. Give the pitch
  sentence a scale or comparison so another reader can trace it to the
  evidence.
`,
		challenge: `
Suppose the prototype meets its retrieval target but the updated forecast
needs more customers to break even. Revise the feasibility section of the
pitch. Keep the two results distinct and state the next piece of evidence
needed before launching.

**Completion evidence:**
- State the retrieval outcome and new break-even estimate in separate
  sentences and explain what each one measures.
- State an unresolved feasibility question and name a small check before
  launch, such as collecting a production quote or verifying a price
  assumption with a private offer mockup.
`
	}
};

export function applyEntrepreneurshipReadings(
	course: RawCourse,
	source: RawCourse
) {
	for (const [title, content] of Object.entries(readings)) {
		const module = course.modules.find(module => module.title === title);
		const original = source.modules.find(module => module.title === title);
		const item = module?.curriculum.find(
			item =>
				item.title.startsWith("Concepts:") ||
				item.title.endsWith("Core Concepts")
		);
		const flow = original?.curriculum[0]?.content.match(
			/\*\*Course flow:\*\* [\s\S]+$/
		)?.[0];
		const activities = practiceByModule[title.split(" ", 1)[0]!];
		if (!module || !original || !item || !flow || !activities) {
			throw new Error(`Missing Entrepreneurship material: ${title}`);
		}
		item.content = formatAuthoredReading(`${content}\n\n${flow}`);
		item.contentKind = "reading";
		item.preserveInstructions = true;
		for (const supplemental of module.supplementalProjects) {
			if (supplemental.title.startsWith("Practice Map: ")) {
				supplemental.content = formatAuthoredReading(
					activities.practice
				).trim();
			} else if (supplemental.title.startsWith("Extension Review: ")) {
				supplemental.content = formatAuthoredReading(
					activities.challenge
				).trim();
			} else {
				const project = original.supplementalProjects.find(
					project => project.title === supplemental.title
				);
				if (!project) continue;
				supplemental.content = formatAuthoredAssignment(
					project.content
				);
			}
			supplemental.contentKind = "assignment";
			supplemental.preserveAssignment = true;
			supplemental.preserveInstructions = true;
		}

		// Retain the published reading identity and independently assignable projects.
		module.curriculum = [
			item,
			...original.curriculum.slice(1).map(project => ({
				...project,
				...module.curriculum.find(
					candidate => candidate.title === project.title
				),
				content: formatAuthoredAssignment(project.content),
				learningPath: "core" as const,
				contentKind: "assignment" as const,
				preserveAssignment: true,
				preserveInstructions: true
			}))
		];
	}
}
