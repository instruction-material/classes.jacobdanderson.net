import type { RawCourse } from "./types";
import {
	formatAuthoredAssignment,
	formatAuthoredReading
} from "./authoredReading";

export const smartMoneyReadings: Record<string, string> = {
	"PF1 Building Wealth Through Personal Finance": `
Income is money received over a period; an asset is something owned that has
value; a liability is an amount owed. Net worth is assets minus liabilities
at one date. Cash flow compares money arriving and leaving during a period.
A positive monthly cash flow can coexist with negative net worth.

## Worked Graduate Profile

Use this fictional graduate in a fictional city throughout the examples.
Opening savings are $10,000 and the old scooter is valued at $500. Student debt
is $30,000. The example adds a $300 credit-card balance and a $700 personal loan.
Opening assets are $10,500; liabilities are $31,000; net worth is −$20,500.
Opening checking is zero. None of these amounts describe an actual person.

Monthly gross pay is $4,000. Assume $1,000 of payroll deductions, making net pay
$3,000. These are supplied simulation inputs, not a tax-rate estimate.

| Monthly allocation | Amount |
| --- | ---: |
| Rent | $1,000 |
| Utilities | $150 |
| Groceries | $300 |
| Transport | $100 |
| Health costs | $150 |
| Meals out | $100 |
| Entertainment | $60 |
| Hobbies | $40 |
| Travel fund | $50 |
| Gifts | $50 |
| Student-loan payment | $200 |
| Card payment | $25 |
| Personal-loan payment | $50 |
| Transfer to savings | $600 |
| Unallocated checking buffer | $125 |

The five necessities total $1,700, the five wants total $300 and debt payments
total $275. Thus 3,000 − 1,700 − 300 − 275 − 600 = $125. A savings transfer moves
money between owned accounts; it reduces spendable checking without being a
purchase or increasing total assets by itself. A debt payment contains principal
and possibly interest; only principal reduces the liability.

Choose a goal with an amount and date. At zero interest, adding $600 monthly
for six months increases savings by $3,600. An income interruption can change
that plan, so retain the assumptions and compare actual amounts with the plan.

## Check the distinction

Receiving $200 and keeping it increases cash and net worth by $200. Moving
$200 from checking to savings changes neither total assets nor net worth.
Borrowing $200 adds $200 cash and $200 liability, leaving net worth unchanged
at that instant. Explain each change with both sides of the balance sheet.

The original research and spending activities can use this profile as their
local case. The [CFPB toolkit](https://www.consumerfinance.gov/consumer-tools/educator-tools/your-money-your-goals/toolkit/)
provides optional spending, debt and cash-flow worksheets.
`.trim(),
	"PF2 How to Grow My Income": `
Earned income comes from work; business revenue is the amount customers pay
before business costs. Profit is revenue minus costs. Investment returns can
vary and include losses. Compare options using the same period, required time,
startup cost, recurring cost and uncertainty.

## Worked income comparison

The fictional profile keeps its $3,000 monthly take-home job income.
Option A is four tutoring sessions monthly at $30 each, with $20 monthly
travel/material costs and eight hours including preparation. Its modeled net
cash is 4 × 30 − 20 = $100 monthly, or $12.50 per hour before any additional
taxes. A supplied $50 setup cost makes the first month only $50 better.

Option B is a content project taking eight hours monthly, with $30 costs
and revenue scenarios of $0, $40 or $150. Net results are −$30, $10 or $120.
The high result alone does not establish that it is the more reliable option.
State which revenue assumption would change the decision.

For the running annual example, use a separate established tutoring arrangement:
$120 revenue and $20 costs each month, with no new setup cost. The $100 net
addition increases the $125 buffer to $225 before other changes. Revenue is
recorded once; the $20 cost is deducted once.

## Events have both an amount and a duration

A scooter repair of $240 in month four reduces that month's buffer from $225
to −$15. A hypothetical take-home raise of $75 in months five and six adds
$150 across those two months. It does not add $75 to all twelve months.

Across a year, tutoring adds $1,200, the temporary raise adds $150 and the repair
costs $240: net change is +$1,110. Keep a row for each event with its starting
month, ending month and category. Available savings can cover a negative month,
but record the withdrawal and any later replenishment.

For the optional negotiation role-play, use a proposed $150 monthly gross
raise supported by three completed responsibilities and one measured result.
Compare full approval, half approval and refusal. A gross raise and a take-home
raise are different inputs; do not silently add the gross amount to net pay.
`.trim(),
	"PF3 How to Manage My Spending": `
Gross income is pay before deductions; net income is what remains after them.
A budget assigns planned amounts to a period. An expense tracker records what
actually happened. A cash-flow calendar also records when payments arrive
and bills fall due.

## Work the monthly plan

The supplied profile has $4,000 gross and $3,000 net monthly pay. Annual figures
are $48,000 gross, $12,000 assumed deductions and $36,000 net. Divide annual
amounts by twelve only when modeling equal months; real pay schedules differ.

The five necessities in PF1 total $1,700 and the five wants total $300.
The three debts have balances of $30,000, $300 and $700, with monthly payments
of $200, $25 and $50. Record balances and payments in different columns.
The $600 savings transfer leaves $125 unallocated. Check that every planned
dollar appears exactly once.

A 50/30/20 rule would assign $1,500, $900 and $600 of $3,000 to its three groups.
It is a starting comparison rather than a requirement. This profile's necessities
already exceed $1,500, so copying that rule without changing costs would hide a
$200 shortfall. Define where debt payments belong before comparing percentages.
Use a custom plan when the facts require it.

## Worked revision and timing check

If groceries rise from $300 to $360, the buffer falls from $125 to $65.
Reducing meals out from $100 to $70 restores $30, leaving $95. Explain the
tradeoff instead of labeling every want a mistake.

For a timing case, assume $1,500 arrives on days one and fifteen. The first
paycheck covers $1,000 rent, $150 utilities and $150 groceries, leaving $200.
If a $275 debt payment is also due before day fifteen, checking needs an
additional $75 even though the monthly plan balances. Moving a due date,
retaining an opening buffer or revising the plan are different solutions.

An external calculator can help research a different profile. The supplied
deductions remain fictional; a real tax estimate needs the relevant year,
jurisdiction, filing facts and deduction assumptions. Keep those inputs with
the result so another reader can reproduce it.
`.trim(),
	"PF4 How to Build Credit: Making Your Small Purchases Count": `
Credit permits borrowing under an agreement. A credit limit is the maximum
allowed balance; the unpaid balance is the amount still owed. APR states an
annual interest rate. A minimum payment is a required payment for a statement
period, not a promise of quick payoff. Fees and introductory-rate expiration
can change the total cost.

## Work a repayment trace

For a deliberately simplified monthly model, use
interest = opening balance × APR / 12, then
closing balance = opening balance + interest + fees − payment.
Round interest to cents each month. The model assumes no new purchases.

The profile's $300 card balance at a fictional 24% APR incurs $6 in the first
month. After a $25 payment, $281 remains. Next month's interest is $5.62,
leaving $261.62 after another $25 payment. The $50 paid reduced principal by
$38.38; the remaining $11.62 was interest.

The $30,000 student-loan example uses 6% APR and a $200 payment: modeled
first-month interest is $150 and principal falls by $50 to $29,950.
The $700 personal-loan example has 0% interest and a $50 payment, leaving $650.
Those rates are scenario inputs, not current loan offers.

Actual cards can use daily balances and distinct rates for purchases and other
transactions. The [CFPB interest explanation](https://www.consumerfinance.gov/ask-cfpb/how-does-my-credit-card-company-calculate-the-amount-of-interest-i-owe-en-51/)
describes that distinction and grace periods. Use the statement's actual terms
for an actual agreement; the monthly classroom model does not reproduce all of them.

## Compare offers and explain risk

Fictional Card A has 0% rewards, 12% APR and no annual fee. Card B has 2% rewards,
24% APR and a $60 annual fee. On $1,000 eligible purchases paid under qualifying
interest-free terms, B's $20 rewards do not cover its $60 fee. If balances are
carried, compare interest as well. A reward percentage alone is insufficient.

Credit utilization is balance divided by limit: $300 / $1,000 = 30%.
It measures use of available credit, rather than the cost or affordability of
that balance. Payment history and other information can affect credit outcomes;
this calculation does not predict a particular score. Keep each comparison tied
to payment behavior, total cost and the existing budget.
`.trim(),
	"PF5 How to Make Smart Purchase Decisions": `
Purchase price is one part of total ownership cost. Include replacements,
maintenance, consumables, financing and disposal costs over a common period.
Opportunity cost is the best alternative use given up by choosing an option.

## Worked three-year comparison

Bottle A costs $6 and needs replacement every three months. Over 36 months,
twelve bottles cost $72. Bottle B costs $18 and lasts the full 36 months in the
scenario. Its purchase-cost advantage is $54. Cleaning effort, repairability,
convenience and whether it is actually used can change the preference.

The result depends on lifetime. If B lasts only six months, six replacements
cost $108 over three years; A then costs $36 less. Record that changed assumption
instead of treating the first calculation as a universal product recommendation.
The $54 difference could remain in the profile's savings or fund another goal.

## Worked vehicle case

Use a fictional $3,000 vehicle, a $1,000 down payment and a $2,000 loan at 8%
nominal annual interest for 24 monthly payments. With r = 0.08 / 12 and n = 24,
payment = 2,000 × r / (1 − (1 + r)^−n), approximately $90.45 monthly.
Rounding can require an adjusted final payment. Compare the total installments
with the $2,000 borrowed, and keep the $1,000 down payment separate.

Assume annual insurance $600, maintenance $240, fuel $360 and registration $120.
Recurring costs add to $1,320 annually, or $110 monthly. Loan plus recurring
cost is about $200.45 monthly, before parking or unexpected repairs.

The unchanged profile has a $125 buffer, so it falls short by about $75.45
monthly before accounting for the down payment. Increasing the assumed income,
reducing another allocation or postponing the vehicle are separate proposals.
A cost outside the current budget remains visible until a specific revision
balances it. Use these supplied terms for the local exercise; date any researched
vehicle or financing figures and compare identical periods.
`.trim(),
	"PF6 How To Find Your Perfect Bank": `
Checking supports frequent payments; savings separates money for later needs.
Liquidity means how readily money can be accessed. APY expresses a year's
interest yield including compounding under the stated terms. Fees, withdrawal
conditions, minimums and changing rates also affect the outcome.

## Worked fictional account offers

| Offer | APY | Required balance | Fee |
| --- | ---: | ---: | --- |
| A | 1% | $0 | None |
| B | 4% | $3,000 | $5 each month below the minimum |

For a constant $4,000 opening savings balance with no transactions or fees
and an unchanged rate, A ends one year at $4,040 and B at $4,160.
For $1,000, A earns $10. B earns at most $40 before its twelve $5 fees:
$60 in fees exceeds that interest. Monthly fees also reduce money available
to earn later interest. The advertised APY alone cannot select the better offer.

For the source activity's $5,000 prize, one modeled allocation is $1,000 checking
and $4,000 savings. This is an added scenario, not a second copy of the profile's
existing $10,000 savings. Specify which expenses checking must cover and whether
the minimum balance remains available after a withdrawal.

## Protection and access

At an FDIC-insured bank, qualifying deposits receive protection subject to the
per-depositor, per-bank and ownership-category rules. The standard limit is
$250,000 for each applicable ownership category; opening several accounts in
one category at one bank does not multiply that coverage. Stocks and mutual
funds are not insured deposits. Check the current
[FDIC coverage guidance](https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance)
when comparing actual arrangements. Verify a credit union's separate protection
with its regulator.

A proposed account comparison records purpose, access, fees, minimum balance,
APY, protection and the date of its terms. A bonus requiring a balance the
profile cannot maintain may be outweighed by fees. Show that cash-flow check
before choosing the account, and keep a fee-free fallback in the decision record.
`.trim(),
	"PF7 How to Plan for and Invest in Your Future": `
A time horizon is the time before money is needed. Investment risk includes
possible loss and uncertainty about future returns. Savings for a near-term
expense and an investment for a distant goal can therefore need different
liquidity and risk choices. Diversifying spreads exposure, but does not eliminate
market loss.

## Work compound growth

With one initial amount P, constant annual rate r, annual compounding and no
additional deposits, A = P × (1 + r)^n after n years.
For fictional P = $1,000, r = 6% and n = 3, A is $1,191.02 after rounding.
At 0% it remains $1,000; a single 20% loss leaves $800. These are scenarios,
not forecasts. Fees, taxes and inflation can reduce what the balance buys.
[Investor.gov](https://www.investor.gov/introduction-investing/investing-basics/save-and-invest/small-savings-add-big-money)
explains why interest earned can itself earn interest.

The profile can allocate its $600 monthly transfer as $400 accessible savings
and $200 hypothetical IRA savings. With zero growth for a transparent one-year check,
that adds $4,800 and $2,400 respectively: combined contributions still equal
$7,200. Do not add $7,200 again as a third allocation.

## Accounts and their contents are different

An IRA is a retirement account structure; a stock or fund held inside it is an
investment. Traditional IRA contributions may be deductible if requirements
are met; Roth IRA contributions are not deductible. Qualifying Roth IRA
distributions can be tax-free. Eligibility, contribution ceilings and withdrawal
conditions depend on applicable rules, including timing requirements.

A 401(k) is an employer retirement plan that can offer pre-tax or Roth
contributions and matching terms. The employer plan determines the available
features and vesting rules. Consult the
[IRS IRA comparison](https://www.irs.gov/retirement-plans/traditional-and-roth-iras),
[IRA distribution rules](https://www.irs.gov/publications/p590b) and
[401(k) overview](https://www.irs.gov/retirement-plans/plan-sponsor/401k-plan-overview).
Record the relevant year when checking limits; no historical dollar ceiling
is used as a current rule in this model.

For a fictional match of 50% of employee contributions up to 4% of $4,000 monthly
gross pay, a $160 contribution earns an $80 match. A $200 contribution still
earns only $80 under those assumed terms. The match enters the retirement
account, not spendable take-home pay. This separate match comparison enters the running budget only after payroll
deductions and cash allocations are recalculated. Compare access, taxes, fees,
risk and the existing budget before changing the allocation.
`.trim(),
	"PF8 Making Your Money Count": `
Values identify desired outcomes; evidence supports claims about whether an
action produces them. Distinguish a measured result, an assumption and a future
promise. A financial decision can support a cause while still requiring an
affordable budget and a check of its actual effects.

## Work an evidence comparison

Use two fictional bottle proposals. Proposal A costs $18 and says it is
plastic-free, but its supplied parts list includes a 20-gram plastic cap.
Proposal B costs $20 and says its cardboard package contains 80% recycled
material by weight; a supplied packaging record supports that narrow claim.
Neither record proves an overall environmental advantage.

An accurate comparison rejects A's absolute claim, records B's supported
packaging fact and marks lifespan, transport and end-of-use evidence unknown.
A lower sticker price does not answer those questions. Record the missing
evidence that could reverse the choice rather than inventing it.

For a hypothetical charity case, Group C reports $100 program spending out of
$125 total spending: 80%. Group D reports $90 out of $100: 90%. The percentages
describe spending allocation, not the quality or effectiveness of outcomes.
Compare the same period and look for outcome evidence before ranking impact.

## Return the choice to the profile

The profile's gifts allocation is $50 monthly. Reassigning $20 to donations
leaves $30 gifts and does not change total planned spending. Adding a $20 donation
without reducing another item lowers the $125 buffer to $105.
A volunteer plan requiring $5 monthly travel reduces that to $100 if both
are new costs; time is a separate constraint to record.

An optional cause-aligned campaign can propose one bounded action, its cost,
the evidence required and an outcome measure. It can use these fictional records
instead of contacting an organization. For independent research, keep source
dates and distinguish an organization's own claim from an independently checked
result. The completed recommendation states a choice, its budget effect, the
supporting evidence and what remains uncertain.
`.trim(),
	"PF9 Smart Money Master Project": `
The final portfolio reconciles one profile across income, spending, debts,
savings, purchases and values. A balance sheet measures one date; a cash-flow
table measures a period. Keep transfers, principal payments and interest separate
so the same dollars do not enter the totals twice.

## Worked one-year reconciliation

Start from PF1: $10,000 savings, $500 scooter, zero checking and $31,000 total
debt. Opening net worth is −$20,500. Use the unchanged monthly $3,000 net pay,
$1,700 necessities, $300 wants, $275 debt payments and $600 savings transfer.
The base buffer is $125 × 12 = $1,500.

For this particular scenario, keep all savings at zero interest, retain the
scooter at its assumed $500 value and decline the optional vehicle purchase.
Add the established $100 monthly tutoring net, the two $75 take-home increases
and the $240 repair from PF2. Additional annual cash is $1,110, so closing
checking is $2,610. Closing savings are 10,000 + 12 × 600 = $17,200.

Apply PF4's monthly debt model for twelve months, with no new borrowing.
Interest is added before payment and rounded to cents each month.
The student loan ends at $29,383.21, the card at $45.16 and the personal loan
at $100: total $29,528.37. Payments total $3,300; principal reduction is
31,000 − 29,528.37 = $1,471.63, leaving $1,828.37 modeled interest.

Closing assets are 17,200 + 2,610 + 500 = $20,310. Closing net worth is
20,310 − 29,528.37 = −$9,218.37. Improvement is $11,281.63: asset growth
of $9,810 plus principal reduction of $1,471.63. The profile still has debt;
the improvement and the remaining obligation are both visible.

## Stress and revise

An additional $900 emergency lowers closing checking to $1,710 and net worth
to −$10,118.37 if everything else is unchanged. It does not erase the prior
debt payments. Model one lost-income month separately: losing $3,000 net pay
would exceed the $2,610 year-end checking buffer by $390, requiring an explicit
change or a savings withdrawal.

Include assumptions, source dates, monthly calculations, rejected options and
one revision in the portfolio. A different chosen profile can produce a
different recommendation, provided each amount is traceable and the same
accounting relationships reconcile. Compare the base case with the stress case
before making the next-year recommendation.
`.trim()
};

export const smartMoneyActivities: Record<
	string,
	{ practice: string; extension: string }
> = {
	"PF1 Building Wealth Through Personal Finance": {
		practice: `Using the supplied opening profile, add $200 cash earned and kept. Then move $150 from checking to savings. Calculate total assets, liabilities and net worth after each event. Check: earnings raise assets to $10,700 and net worth to −$20,300; the transfer changes the account split only. Explain why borrowing $150 instead would not produce that same net-worth increase.`,
		extension: `Revise the zero-interest six-month savings goal from $3,600 to $4,200. Keep the $3,000 income and every other monthly allocation unchanged. Find the extra monthly transfer and remaining buffer. Check: $700 monthly savings needs $100 more, leaving $25 buffer. Explain which assumption makes that plan fragile.`
	},
	"PF2 How to Grow My Income": {
		practice: `Compare tutoring at four $30 sessions, $20 costs and eight total hours with the content project's three supplied revenue outcomes. Calculate all net results and net per hour. Check: tutoring $100 and $12.50/hour; content −$30, $10, $120 and −$3.75, $1.25, $15/hour. State a reliability assumption that could change the choice.`,
		extension: `Move the $240 repair to month one and include the tutoring option's one-time $50 setup cost that month. Keep $100 monthly tutoring net and the $125 base buffer. Check: month one is −$65; the setup cost lowers the annual result by $50 regardless of its month. Distinguish a timing problem from a change in annual total.`
	},
	"PF3 How to Manage My Spending": {
		practice: `Copy the five necessities, five wants and three debt-payment rows from PF 1. Increase groceries by $60 and lower meals out by $30. Reconcile the monthly total and its yearly equivalent. Check: buffer $95 monthly, $1,140 yearly if all months match. Explain why an annual total does not establish that every bill can be paid on its due date.`,
		extension: `Use the two-paycheck timing case. Move the $275 debt payment from day ten to day twenty. Recalculate cash available before the second paycheck. Check: the first-period $75 shortfall becomes a $200 balance before the second deposit; monthly spending is unchanged. Compare this with retaining an opening $75 buffer.`
	},
	"PF4 How to Build Credit: Making Your Small Purchases Count": {
		practice: `Run the $300 card model for two months at 24% APR with $25 payments and no fees or purchases. Show opening balance, interest, payment and closing balance. Check: $6 then $5.62 interest, $281 then $261.62 balances. Repeat with a $50 first payment: the second opening balance is $256 and second interest $5.12.`,
		extension: `Compare Card A and Card B on $1,000 annual eligible purchases with no interest under the assumed qualifying terms. Check: A's reward-minus-fee result is $0; B's is −$40. Change purchases to $4,000: B becomes +$20 before other costs. Explain why carrying a balance can reverse that comparison.`
	},
	"PF5 How to Make Smart Purchase Decisions": {
		practice: `Compare 36-month bottle costs when the $18 bottle lasts 36, 12 or 6 months. Keep Bottle A's $72 cost fixed. Check: B totals $18, $54 or $108, so its advantage is $54, $18 or−$36. Name one non-price fact needed before choosing.`,
		extension: `Use the vehicle's $90.45 approximate loan payment and $110 monthly recurring costs. Compare the $200.45 obligation with the $125 base buffer and the $225 buffer after tutoring. Check: shortfall about $75.45 in the base case; about $24.55 remains after tutoring. Account separately for the $1,000 down payment and a proposed $300 repair reserve.`
	},
	"PF6 How To Find Your Perfect Bank": {
		practice: `Compare the two fictional offers for unchanged $4,000 savings over one year. Check: A earns $40; B earns $160 with its minimum maintained. Then withdraw $2,000 before the first month starts and explain which fee condition changes. State what additional timing calculation is needed for an exact balance.`,
		extension: `Allocate the separate $5,000 prize between $1,000 checking/$4,000 savings and $3,000 checking/$2,000 savings. Explain access and minimum-balance consequences for Offer B. Check: only the first allocation meets B's $3,000 savings minimum. Distinguish account selection from the deposit-insurance ownership-category question.`
	},
	"PF7 How to Plan for and Invest in Your Future": {
		practice: `Calculate the $1,000 balance after three years at constant annual rates of 0%, 3% and 6%, with no deposits. Check: $1,000, $1,092.73 and $1,191.02. Add one−20% single-year case giving $800. Explain why the larger modeled ending balance is not a guaranteed result.`,
		extension: `Apply the fictional 50%-up-to 4% match to $4,000 monthly gross pay for employee contributions of $100, $160 and $200. Check: matches are $50, $80 and $80. Record total retirement deposits of $150, $240 and $280, and explain why employer match is not checking-account income.`
	},
	"PF8 Making Your Money Count": {
		practice: `Create a claim/evidence/unknown table for the two bottle proposals. Check: A's plastic-free claim conflicts with its cap record; B's 80% recycled-cardboard fact says nothing about the whole product. Propose one measurable follow-up and one budget consequence before recommending either.`,
		extension: `Compare adding a $20 monthly donation with reallocating $20 from the existing $50 gifts budget. Then add $5 volunteer travel to each option. Check: buffers become $100 and $120 respectively. Keep the two-hours-per-month volunteer time separate from dollar calculations and state one unresolved impact question.`
	},
	"PF9 Smart Money Master Project": {
		practice: `Reproduce the supplied one-year balance sheet and explain the $3,300 debt payments as principal plus interest. Check: assets $20,310, debt $29,528.37, net worth−$9,218.37, principal $1,471.63 andinterest $1,828.37. Show the transfer between cash accounts and explain why it creates no new income or expense.`,
		extension: `Apply both the $900 emergency and a separate $3,000 lost-income month to the final base case. Check: checking would be−$1,290 before a corrective action, and net worth−$13,118.37. Transfer $1,290 from savings to checking: checking becomes 0, savings $15,910, and net worth stays unchanged by that transfer. Propose a next-year revision with a visible tradeoff.`
	}
};

export function applySmartMoneyReadings(course: RawCourse, source: RawCourse) {
	for (const original of source.modules) {
		const content = smartMoneyReadings[original.title];
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
			throw new Error(`Missing Smart Money reading: ${original.title}`);
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
					const activities = smartMoneyActivities[original.title];
					if (!activities) {
						throw new Error(
							`Missing Smart Money practice: ${original.title}`
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
