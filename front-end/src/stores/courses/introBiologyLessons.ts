interface IntroBiologyLesson {
	reading: string;
	tasks: string[];
	optional: string[];
}

export const introBiologyLessons: Record<string, IntroBiologyLesson> = {
	"BIO1 Human Body Systems": {
		reading: `# Body Systems and Biological Evidence

A **cell** is a basic unit of living structure and activity. A **tissue** contains cells working together; an **organ**, such as the stomach, combines tissues; an **organ system** coordinates organs. Digestion is a process, not another organ. A system boundary identifies the part of the body being considered and what crosses into or out of it.

On a body outline, place the lungs in the chest on either side of the heart. On a text map, record the same relationship in words. A point can mark one part of a distributed system: the femur in the thigh represents the skeletal system, which extends throughout the body. Organs can participate in more than one system: the pancreas releases digestive substances into a duct and hormones into blood. A map groups functions; it does not divide the body into isolated boxes.

## Worked interaction: walking in warmth

Scenario A reports faster breathing and heart rate, increased skin blood flow and sweating. These are supplied observations. A mechanism connects muscular demand to respiratory oxygen exchange and circulatory transport. Evaporation of sweat can transfer heat away from the skin. The observed changes support an interaction model, but do not reveal every signal or prove that a stable temperature was maintained.

Use different labelled arrows: oxygen moves from lungs through blood toward tissues; nerve or hormone signals carry information; heat transfers toward the surroundings. An information arrow does not mean that a whole meal or an organ travels along it. **Homeostasis** is regulation of internal conditions within a useful range, often through responses that reduce a disturbance. It does not mean that every variable stays fixed.

The three supplied scenarios have different limits. The allergy model concerns an immune interaction that can be harmful; it is not an example in which every response necessarily restores stability. The calcium case traces a material from intestine to blood and a possible use, without specifying anyone's intake needs.

## Build a checkable model

For Scenario A, a claim is that several systems participate in the response. Evidence is the breathing, circulation and sweating record. Reasoning connects those observations to transport and heat exchange. A limitation is that signal timing and hydration were not measured. A changed-condition prediction, such as reduced evaporation in humid air, remains a prediction until tested.

Required case notes can use writing, dictation, a labelled diagram or a table. Optional travel-journal projects reuse those notes in narrative form; the final core project can use the notes or the supplied worked record. No beakers, kits, dissections, food handling, or required household experiments are needed. Fictional records provide the evidence without personal medical information.`,
		tasks: [
			"Use the ten-system table to place one representative structure from each system on a body outline or text map. Give its body region and function. Choose the respiratory, circulatory and muscular systems for three labelled connections. Identify what each arrow carries and one feature the map omits. Check each placement against the worksheet.",
			"Compare the oxygen-to-muscle route with a nerve or hormone signal. Draw one material-flow arrow, one information-flow arrow and one heat-transfer arrow for Scenario A. Name the source and destination of each. Explain why a single unlabelled arrow would leave the interaction ambiguous.",
			"Choose Scenario A, B or C. Record the supplied observations separately from an inferred mechanism, then write a claim/evidence/reasoning response with one limit. For the allergy case, retain the possibility of a harmful response; for the calcium case, keep the claim about a pathway rather than an intake recommendation.",
			"Start a saved case-note page for the supplied oats, beans and oil meal. Record the ingredients, one predicted nutrient route, a molecule/organ/system legend and one uncertainty. Mark the route as an initial model so later work can revise it. This page can support the capstone without completing an optional narrative journal.",
			"Use the stomach example to distinguish cell, tissue, organ, organ system and organism. Place a digestive epithelial cell, intestinal lining, small intestine, digestive system and fictional person at the appropriate scales. Explain how a claim about one cell differs from a claim about the whole organism.",
			"Return to the warm-walking case. Identify a changed condition, the observed responses and a proposed feedback connection. State what measurement would be needed to show reduced temperature deviation. Compare this with the allergy case to explain why an immune response alone does not prove successful homeostasis."
		],
		optional: [
			"Extend the saved ten-system map with two additional labelled interactions. Use the supplied table and Scenario A to distinguish material, information and heat arrows. Give the diagram a text equivalent and change one condition, such as weaker evaporation. Predict a consequence, retain an uncertainty and identify the observation that could check it.",
			"Develop the saved scenario response into a two-version map. Preserve the original inference, add one competing explanation or omitted variable and revise the claim. Link each change to a supplied fact. The calcium and allergy cases support pathway reasoning, while individual intake, diagnosis and treatment conclusions remain outside the evidence.",
			"Turn the saved oats/beans/oil case notes into the first entry of an optional travel journal. Keep the molecule, organ and system legend, separate the predicted route from observed facts and leave a revision space. The narrative is another representation of the same evidence, rather than an additional prerequisite for the required capstone."
		]
	},
	"BIO2 Nutrients and Macromolecules": {
		reading: `# Food, Nutrients and Molecule Models

A food contains a mixture of substances. **Nutrients** include carbohydrates, proteins, lipids, vitamins, minerals and water. Biology also studies nucleic acids, such as DNA and RNA. Carbohydrates, proteins and nucleic acids commonly contain repeating smaller units; many lipids have different structures and are not polymers in that same sense. A mineral ion or water molecule is not a macromolecule.

Starch is a carbohydrate built from sugar units. Proteins contain amino-acid units; fats such as triglycerides contain glycerol and fatty-acid components. Digestion makes smaller products available for absorption. Carbohydrates and lipids can supply chemical energy; proteins provide building material and have many other roles. Vitamins and minerals participate in processes without serving as the main energy source in this model.

The ingredient table is evidence about its supplied fictional meal. Oats and beans contain several categories, while olive oil chiefly provides lipid evidence. The yogurt alternative's particular label supplies sugar, protein, lipid and calcium values; it does not establish the composition of every similar product. An unspecified vitamin amount stays unknown. Color and a food name cannot replace composition evidence.

## Worked Dinner Mystery

The separate puzzle table gives Guest A changes of 16 simple-sugar, 2 amino-acid and 1 fatty-acid relative units. Under the puzzle's stated matching rule, the starch-rich dish is the strongest match because 16 is the largest change. Guest B's largest change is amino acids; Guest C's is fatty acids; Guest D has moderate changes in all three.

To graph these records, put guests on the horizontal axis and relative change on the vertical axis, starting at zero with equal intervals. Use three labelled series rather than color alone. Relative changes are not amounts eaten, personal blood-test values or proof that one real dish always creates a particular response. The puzzle stipulates its matching rule; biological responses outside it have more variables.

## Improve a meal explanation

For the supplied oats/beans/oil meal, oats and beans support carbohydrate and protein claims and oil supports a lipid claim. Saying “this meal has no vitamins” is stronger than the supplied evidence: an unreported amount is not a measured zero. A useful revision labels the unknown and adds a source before making a quantitative claim. A recipe model describes composition and a proposed pathway, rather than recommending a diet.`,
		tasks: [
			"Graph the four guests' three supplied relative changes, then match each guest to a dish using the stated puzzle rule. For every match, cite its largest change or mixed pattern and reject one alternative. Identify one reason the same rule cannot uniquely identify a real person's meal outside this fictional dataset.",
			"Use only the supplied ingredient notes and product label to classify oats, beans, oil, yogurt alternative and greens. Show at least one ingredient in multiple nutrient categories. Distinguish a mineral or vitamin from a macromolecule and mark unreported quantities as unknown rather than zero.",
			"Add a meal profile to the saved oats/beans/oil notes. Track one starch component toward sugar units, one protein component toward amino acids and one lipid component toward its smaller products. State which composition claims are supplied and which later digestive or transport steps still need explanation.",
			"Use the molecule cards to connect starch with sugar units, protein with amino acids and a triglyceride with glycerol/fatty-acid components. Explain what the simplified cards preserve and omit. Include nucleic acids as another biological molecule family without treating vitamins, minerals or water as macromolecules.",
			"Repair two claims: a food belongs to exactly one nutrient category, and the unlisted vitamin amount on this model label is zero. Cite the oats/beans mixture and the explicitly unspecified label field. Explain why the fictional label and mystery graph cannot establish personal nutritional needs."
		],
		optional: [
			"Extend the Dinner Mystery solution with a confidence table: guest, strongest dish match, exact values, rejected alternative and limitation. Use A's 16/2/1 pattern as a worked comparison. Add a second hypothetical starch-rich dish and explain why the original matching rule would no longer identify one unique dish. Keep the hypothetical record distinct from the supplied observations.",
			"Create two fictional recipe cards from the five supplied ingredients. Label each ingredient's supported nutrient categories and identify one unknown amount. Revise one claim that equates a food with a single molecule or treats an omitted label field as zero. The cards explain composition; they do not prescribe quantities or claim a health outcome.",
			"Turn the saved meal profile into a narrative or diagram entry. Trace at least three components toward smaller molecular units, identify their supporting ingredient notes and preserve one uncertain route for later revision. Include a short text description if using a diagram. Compare the revised entry with the original prediction rather than creating a separate required project."
		]
	},
	"BIO3 Digestive Process": {
		reading: `# A Pathway, Secretions and Enzymes

**Ingestion** brings food into the digestive tract. **Mechanical digestion** changes its size and mixing. **Chemical digestion** changes molecules through reactions. **Absorption** moves substances across the intestinal lining; **elimination** removes the remaining mixture from the tract. These are processes, not interchangeable names for one event.

The supplied route is mouth → pharynx → esophagus → stomach → small intestine → large intestine → rectum → anus. Chewing breaks and mixes food. Swallowing coordinates its passage toward the esophagus. **Peristalsis** uses coordinated muscle contractions to move and mix contents, so the pathway is not explained by gravity alone.

The liver, pancreas and gallbladder support digestion without being tube segments through which the meal passes. The liver produces bile and the gallbladder stores and releases it. Bile helps disperse fat into droplets; it is not an enzyme. Pancreatic digestive secretions reach the small intestine through ducts. Their route differs from pancreatic hormones carried in blood.

## Worked enzyme evidence

An **enzyme** is a biological catalyst. Its active site interacts with suitable substrates and lowers the reaction's activation barrier. It does not create matter or energy and is not consumed as one ingredient for every reaction. Its structure and conditions affect activity.

The fictional E1 record gives activity 1, 6, 10 and 3 at pH 2, 5, 7 and 9. Among those tested conditions, pH 7 has the highest activity. This does not prove the exact optimum between measurements or describe every real digestive enzyme. In the separate substrate table, activity rises from 0 to 4, 7 and 9 as substrate increases, then stays at 9. The plateau is consistent with limited available active sites under the supplied conditions; extra substrate does not guarantee an unlimited rate.

## Follow matter without overclaiming

The model starch can begin changing in the mouth and undergo further processing in the small intestine. The esophagus mainly transports it in the supplied organ table. A storyboard labels the location, movement and supported molecular change in separate fields. Molecules can be rearranged while atoms remain accounted for; a smaller food piece and a smaller molecule are different scales.

The table and enzyme values supply all required observations. Drawings show a model of organ relationships, not a proportionally complete body or a record of a physical experiment.`,
		tasks: [
			"Storyboard mouth, pharynx and esophagus using the supplied pathway table. For each frame, name the location, the movement and any supported mechanical or chemical change. Explain the role of peristalsis and identify a feature that a simple falling-food drawing would misrepresent.",
			"Sort the supplied pathway events into ingestion, mechanical digestion, chemical digestion, absorption and elimination. Trace one starch component through at least four locations. Keep a reduction in food-piece size separate from a reaction that changes molecular form, and retain the large-intestine water movement as a distinct process.",
			"Connect a digestive epithelial cell, lining tissue, intestinal organ and digestive system in one model. Use the organ table to add pancreatic secretion and bile arrows without routing the meal through those accessory organs. Give the drawing a text route and state one scale or mechanism it leaves out.",
			"Plot the E1 pH and substrate records as two separately labelled graphs. Identify the highest tested pH activity and the substrate plateau. Use E1/E2 specificity cards to reject the claims that every enzyme works on every substrate, an enzyme is used up after each reaction, or a plateau proves a universal maximum for every condition."
		],
		optional: [
			"Create an organ gallery using the supplied location/function table. Include the full tube route and the three accessory organs, then connect them in one system map. Label at least three secretion or tissue relationships. Check that food never passes through a liver or pancreas box and explain one limitation of the diagram's position or scale.",
			"Extend the ingestion storyboard with a changed-condition panel in which peristaltic movement is absent from the fictional model. Predict the consequence without assigning a diagnosis. Preserve the original panel, distinguish observed movement from the new prediction and identify what evidence would be needed to test the revised model.",
			"Add a narrative or diagram entry for the saved meal's early digestive route. Trace one component through mouth, pharynx, esophagus and stomach, naming its location, movement and supported change. Flag a missing mechanism instead of inventing an enzyme. Connect the entry to the same saved organ map and include one revision of the first route."
		]
	},
	"BIO4 Digestion and Absorption": {
		reading: `# Crossing the Intestinal Boundary

Digestion changes a large molecule into smaller products. Absorption moves a substance across an epithelial boundary. Breaking starch into smaller sugars does not by itself show that those sugars have entered blood. The small intestine's folded lining and villi provide a large absorption surface; the model does not depict every cell or transport step.

**Concentration** compares amount with volume. In equal-volume compartments, 18 neutral model particles are more concentrated than 4. If volumes differ, counts alone are insufficient: 18 particles in 9 volume units and 4 in 1 unit give concentrations 2 and 4, reversing the comparison.

## Worked membrane cases

Case A specifies equal volumes and a membrane permeable to the neutral particles. Net simple diffusion initially goes from the 18-particle side toward the 4-particle side, while random movement occurs in both directions. At equilibrium, random crossings continue while average net transfer is zero. Case B requires a channel or carrier for movement down the stated gradient: this is facilitated diffusion. Case C explicitly couples movement against the gradient to ATP use: it models active transport. A transport protein's presence alone does not prove active transport.

**Osmosis** is net water movement across a selectively permeable membrane. Case E initially lets water, but not the solute, cross. With its other conditions held equal, water moves toward the side with the higher solute concentration. The supplied counts do not specify every later pressure or volume change.

Many absorbed simple sugars and amino acids enter intestinal blood capillaries and travel toward the liver. Many long-chain lipid products are repackaged and enter lymphatic vessels first, later reaching blood. This introductory distinction has exceptions; it does not label every lipid molecule with one universal route.

## What a clue can establish

The fictional salad model reports reduced protein processing at the stomach step while earlier locations are unaffected. That identifies a modeled process and location. It does not uniquely identify which ingredient carried an unknown cause. The text cards supply both the observations and their limits; they are not a real poisoning investigation.

Compare two supplied digestion representations: Model A shows tube order but omits cells and secretions; Model B shows an intestinal boundary with blood/lymph routes but omits the earlier organs. Use A for location order and B for a crossing question. A complete explanation can combine them while retaining what each leaves out.`,
		tasks: [
			"Use the route cards to build separate nutrient tracks through the digestive locations. Distinguish a change of molecular form from crossing the epithelial boundary. Mark the small intestine as the major absorption site in this model and trace glucose/amino-acid blood routes separately from the supplied long-chain lipid lymph route.",
			"Use the complete fictional salad clue record. State the earliest reported affected location and the process observed there, then compare the four candidate ingredient cards. Explain which conclusion the evidence supports and why it cannot identify one unique source of the unknown cause. Include an alternative explanation and the additional evidence needed to distinguish it.",
			"Compare Model A's tube-order description with Model B's intestinal-boundary description. Choose the better model for locating the stomach and for explaining a blood/lymph crossing. Name three preserved features, an omitted feature in each and one incorrect claim that would result from treating either model as a complete replica.",
			"Classify membrane Cases A, B, C and E as simple diffusion, facilitated diffusion, active transport or osmosis using the stated permeability, gradient and energy evidence. Explain why 18 versus 4 particles establishes a concentration order only with the equal-volume condition. Use the unequal-volume counterexample to test that assumption.",
			"Trace one supplied starch component from digestion to glucose, across the intestinal lining and into blood. Trace one long-chain lipid component through the different introductory lymph route. Label the scale and boundary of each step; identify what evidence would be needed before naming an exact transporter or claiming every nutrient follows the same path."
		],
		optional: [
			"Extend the saved nutrient timeline with epithelial boundaries and first blood or lymph destinations. Use text labels and distinct line styles for each nutrient route. Add a changed permeability condition using Case B, predict its effect and state the evidence required to choose an exact transporter. Retain the introductory route's exceptions.",
			"Develop the salad response into a claim/evidence/reasoning report with a rejected alternative. Preserve the distinction between locating the reported digestive effect and identifying its unknown cause. Add one proposed controlled comparison of model ingredients, clearly labelled as a plan without an invented result. The report concerns the fictional evidence rather than a health recommendation.",
			"Compare Models A and B for the same absorption question. Make a strengths/limits table with tube order, secretions, tissue boundary, blood route and lymph route. Revise one representation to add a missing feature, then explain which details remain omitted. Use the saved first version to demonstrate a model revision rather than a presentation-only change."
		]
	},
	"BIO5 Energy Use and Storage": {
		reading: `# Matter, Energy and ATP

Digestion, absorption and cellular use are different stages. A sugar molecule delivered to a cell can participate in respiration or contribute atoms to stored or newly built molecules. **Metabolism** is the set of chemical reactions in a living system. Reactions rearrange matter and transfer energy; they do not make matter disappear into an unlabelled energy arrow.

An **organelle** is a specialized structure within a cell; mitochondria are membrane-bounded organelles. The **cytosol** is the fluid portion outside those organelles.

An overall aerobic-respiration model is glucose + oxygen → carbon dioxide + water, with energy transfers. In chemical notation, C6H12O6 + 6 O2 → 6 CO2 + 6 H2O accounts for the same carbon, hydrogen and oxygen atoms on each side. Follow glucose through a human cell:

1. **Glycolysis** splits one six-carbon glucose into two three-carbon pyruvate molecules in the cytosol. Some energy is transferred to ATP and to electron carriers.
2. **Pyruvate oxidation** in the mitochondrial matrix releases carbon dioxide and forms acetyl-CoA. Its two-carbon acetyl group enters the **citric acid cycle (Krebs cycle)**. The cycle releases carbon dioxide and transfers electrons to carriers.
3. **Electron transport** takes place in the inner mitochondrial membrane. Electrons pass along a chain to oxygen, forming water. Energy released along the chain drives proton pumping. Protons flowing back through ATP synthase power most ATP production in aerobic respiration.

## Worked energy account

Some transferred chemical energy supports ATP production, and some disperses as heat. **ATP** is a molecule that couples energy-releasing processes to cellular work, such as transport and synthesis. It is continually regenerated and used; it is neither energy itself nor a long-term store that simply fills up. Liver and skeletal muscle cells can join glucose units into **glycogen**. Liver glycogen can supply glucose to the blood between meals. Muscle glycogen supplies the muscle’s own work. Adipose tissue stores much of the body’s longer-term fuel as fat.

A food **Calorie (Cal)** measures energy. One food Calorie equals one kilocalorie (kcal), or 1,000 small calories (cal). A fictional label of 2 Cal therefore represents 2 kcal or 2,000 cal.

The fictional three-hour allocation gives 100 abstract energy units: baseline organ work 45, temperature-related processes 20, movement 15, construction/repair 10 and retained chemical energy 10. The total is 100. These categories include their associated heat; adding another whole heat category would double-count this particular account. Its arbitrary units are not calories or measured human requirements.

If the model gives movement 10 additional units while total input stays 100, some other allocation must decrease or the model must state another input. Choosing to reduce the retained allocation from 10 to 0 balances the arithmetic. It does not establish how a real body would respond.

## Follow atoms and limits

Carbon from glucose can reach carbon dioxide or biological material. Oxygen has a distinct role in the aerobic pathway. A factory analogy helps label inputs and outputs, but it hides intermediate reactions and feedback. A useful diagram keeps matter arrows separate from energy transfers and states which allocation is supplied, estimated or proposed.`,
		tasks: [
			"Build the supplied three-hour allocation table and check its total. Increase movement by 10 abstract units while preserving total input, then propose one compensating change and explain another possible allocation. Keep the included heat in the total. Convert the separate fictional food label in the worksheet to kcal and small calories. Explain why its conversion factor cannot be applied to this allocation.",
			"Trace one absorbed component into immediate cellular use and another into biosynthesis or storage. Label the carbon-containing input and output and distinguish storage from ATP turnover. Name the stored form of glucose in liver and skeletal muscle and explain how each tissue uses its store. Explain why a statement that unused food turns into a tank of ATP misrepresents the model.",
			"Use the overall respiration equation to count carbon, hydrogen and oxygen atoms on both sides. Place glycolysis, pyruvate oxidation, the citric acid cycle and electron transport in order and label their locations. Mark where carbon dioxide is released and where oxygen accepts electrons. Keep ATP and energy-transfer labels distinct from the carbon dioxide and water matter outputs.",
			"Compare the meal's photosynthetic origin with its later cellular use: plant processes can build organic molecules using light energy, while cellular respiration transfers available chemical energy through reactions. Use the supplied ledger to distinguish matter storage, biosynthesis and energy transfer without claiming that plants only photosynthesize or that matter becomes energy in this course model."
		],
		optional: [
			"Extend the cell-factory diagram with carbon, oxygen, ATP coupling and heat labels. Trace glucose carbon into carbon dioxide and a second possible route into biological material. State which steps the factory analogy hides. Check the atom account and revise any arrow that confuses moving matter with transferring energy.",
			"Make two alternative three-hour allocation charts using the supplied 100-unit model. Keep at least four named categories and preserve total input. Identify the supplied baseline values and every proposed change. Compare the two models' assumptions and explain why neither predicts personal energy needs or establishes an actual storage outcome.",
			"Continue the saved meal notes with two routes: one component used in respiration and one contributing to storage or biosynthesis. Record the material form, cellular process and energy-transfer distinction. Preserve an earlier mistaken route and explain the evidence that led to its correction. The optional journal changes representation, not the evidence requirements."
		]
	},
	"BIO6 Regulation of Digestion": {
		reading: `# Signals, Feedback and Scientific Claims

A signal carries information that changes a response. A nerve pathway and a hormone carried in blood can both coordinate activity, but they differ from a digestive secretion travelling through a duct. The stomach, pancreas, liver, intestines and other systems can participate in regulation without each playing the same role.

**Negative feedback** means that a response tends to reduce the initial deviation. It does not mean an unhealthy or harmful response. In the introductory glucose model, increased glucose is associated with insulin release from pancreatic beta cells; target tissues can increase uptake or storage, contributing to a reduction of the rise. A lower-glucose model involves other signals and responses. The complete body contains more pathways than this loop.

## Worked time record

The fictional glucose index is 100, 160, 140, 110 and 100 at 0, 30, 60, 120 and 180 minutes. The peak sampled value is 160 at 30 minutes; the final value returns to the model's initial index. These are not clinical concentration units. The shape is consistent with regulation but does not, on its own, measure insulin or prove which mechanism caused the decline.

Draw stimulus → signalling source → signal → target response → reduced deviation. Label an insulin arrow as information and a glucose-transport arrow as material. The separate secretion case uses a stretch/chemical cue, a neural or hormonal pathway and a change in released digestive material; a secretion and a hormone are not interchangeable merely because both are chemicals.

## Read an abstract critically

An abstract summarizes a question, method, result and limit. The supplied fictional abstract describes 24 intestinal models. The high-X group has mean receiver sugar transfer 9 units and the low-X group 6. The difference is 3 units. Nutrient inputs differed and groups were not randomly assigned, so the association cannot isolate a causal effect of X.

The receiver compartment is a simplified analogy for transport, not a complete circulatory system. Hormone and immune activity were not measured. Notes can distinguish a reported transport result, a supported model interpretation and an unsupported hormonal or individual-health extension. A revision should identify the missing measurement or comparison rather than turn a possible mechanism into a reported fact.`,
		tasks: [
			"Use the secretion cue record and the glucose time table to distinguish signals from materials. Label pancreatic hormone-to-blood information, digestive secretion-to-intestine material flow and liver uptake/storage responses. State which arrows are supplied model mechanisms and which observations alone leave a signal uncertain.",
			"Annotate the fictional abstract with question, model population, group sizes, comparison, measured outcome and limitation. Calculate the 9-versus-6 difference. Make three notes: a direct report, a supported interpretation and an unsupported extension that must be rejected. Identify the unmeasured endocrine or immune variable rather than inventing a result.",
			"Draw the glucose model's negative-feedback loop and plot all five time points with labelled axes. Identify the peak sampled index and the later reduction in deviation. Predict a delayed-response pattern without treating that prediction as an observed record, and explain why the time graph alone does not establish one hormone's causal role.",
			"Compare the fictional abstract's association with a causal claim that X always increases sugar transport in people. Identify the unequal inputs, absent random assignment and model-to-human boundary. Propose one controlled comparison or additional measurement and explain what narrower conclusion its result could support."
		],
		optional: [
			"Extend the saved regulation flowchart with a second arrow legend for information and material. Include pancreas, liver, intestine and a nervous or circulatory connection. Preserve the original version, add a delayed-response prediction and identify an omitted pathway. A successful revision explains a mechanism rather than replacing the diagram's colors.",
			"Develop a three-column abstract evidence table: reported result, interpretation and remaining uncertainty. Include the group sizes, 3-unit difference, unequal inputs and unmeasured hormone/immune variables. Add a rejected individual-health claim and a proposed controlled follow-up. Keep the supplied fictional abstract separate from a citation to real published research.",
			"Turn the saved meal's feedback notes into an optional narrative or annotated diagram. Name a signal source, target, material response and time scale, then distinguish these from the glucose graph's direct observations. Compare the result with the earlier regulation map and preserve one revised uncertainty statement."
		]
	},
	"BIO7 Elimination and Excretion": {
		reading: `# Waste, Boundaries and Kidney Models

**Elimination** removes the remaining mixture from the digestive tract. **Excretion** removes metabolic products or excess substances across a body boundary. Carbon dioxide produced during respiration can travel in blood and leave through lungs. Nitrogen-containing waste is processed through pathways involving the liver and kidneys; urine is not food travelling from the intestine into a bladder.

Stool includes undigested material, microorganisms and shed cells. Its components need not share one origin. A classification names the material, its origin and the boundary being crossed. Heat is an energy transfer, not a material to put in a stool-versus-urine category. Absorbed nutrients entering blood are transport rather than elimination.

The kidneys' nephrons filter fluid and small substances from blood, return many needed substances and add selected substances to the tubular fluid. Blood cells and most large proteins are retained at the initial filtering boundary in this introductory model. Initial filtrate differs from final urine. Ureters carry urine to the bladder; the bladder stores it and the urethra carries it outward.

## Worked kidney ledger

For each supplied model substance, final tubular amount = filtered amount − reabsorbed amount + secreted amount. Water is 100 − 95 + 0 = 5 relative units. Model glucose is 5 − 5 + 0 = 0. The labelled waste solute is 2 − 0 + 1 = 3. This ledger traces material across boundaries; its arbitrary quantities are not a clinical test or a claim about every real substance.

## Compare an invented organism

The supplied alien has no food-tube segment in its adult model and receives already small nutrient molecules through a surface. A separate filter sends model waste solute into a storage sac and then through an outlet. A gas surface releases carbon dioxide. Those stated features support an excretion comparison without assuming that the organism produces human-like stool.

The cards do not state every tissue, water-control mechanism or earlier life stage. Keep those features unknown. Removing a digestive structure in a hypothetical follow-up does not logically remove every metabolic-waste pathway. A useful Venn diagram separates supplied shared functions, stated differences and missing evidence.`,
		tasks: [
			"Use the supplied material sort and organ cards to classify undigested material, carbon dioxide, waste solute, absorbed nutrients, reabsorbed water and heat. For each, name the source and boundary. Distinguish a bladder's storage role from kidney filtering and avoid treating all stool components as undigested food.",
			"Compare the human route description with the four alien anatomy cards. Make a Venn diagram or equivalent text table with stated shared functions, differences and unknown features. Explain why the absent adult food tube changes the elimination model without proving that carbon dioxide or filtered-waste excretion is absent.",
			"Trace a blood-to-filtrate-to-urine pathway using the kidney ledger. Calculate the final water, glucose and waste-solute amounts and identify filtering, reabsorption and secretion separately. Explain why assuming every initially filtered molecule leaves as urine contradicts the supplied values.",
			"Extend the boundary comparison with a fictional change that reduces water reabsorption from 95 to 90 relative units while other rows stay fixed. Calculate the revised final water amount and identify what remains unchanged in this ledger. State why these model values do not diagnose an individual or establish a complete osmoregulation response."
		],
		optional: [
			"Create cards for kidney, bladder, liver, lung and skin using the supplied functions. Name input, process, output and boundary on each, with separate carbon-dioxide, waste-solute and undigested-material examples. Add a text equivalent for every symbol. Check that storage, chemical processing, elimination and excretion have not been collapsed into one job.",
			"Extend the alien comparison with one explicitly hypothetical anatomy change. Preserve the original supplied features, predict which pathway would change and mark every still-unknown function. Compare with a human boundary using at least four relevant terms. The imagined design tests the model's logic; it is not an observation of a real organism.",
			"Continue the saved meal notes with one eliminated material and one excreted metabolic product. Trace each from origin to boundary crossing, adding a reabsorption step where the supplied evidence supports it. Correct an earlier route that sends whole digested food into urine, then connect the revision to nutrient transport and cellular use."
		]
	},
	"BIO8 Digestive Odyssey Capstone": {
		reading: `# Explain One Complete Biological Route

A useful synthesis follows one narrow question across scales. The body-system map, molecule table, digestive pathway, membrane cases, energy ledger, feedback record and waste sort answer different parts of that question. Evidence from one scale does not automatically measure every other scale.

## Worked route and revision

For the supplied starch component, a model route is starch processing in the digestive tract → smaller sugars → intestinal epithelial crossing → blood transport → liver or other tissues → cellular use or storage. One possible glucose-use route transfers available chemical energy through respiration and sends carbon dioxide toward blood and lungs. A complete route labels what moves, what changes molecular form and where a boundary is crossed.

An initial drawing sends the whole meal through a liver box before the small intestine. The revised model keeps the meal in the tube and sends absorbed products through the blood route toward the liver. This is a biological revision because it changes a mechanism and boundary, rather than only making the drawing neater. The supplied worked record preserves both versions.

The core capstone uses a saved case-note portfolio or that worked record. It needs one question, evidence/source log, cross-scale route, digestion or transport explanation, cellular-use or storage model, regulation loop, waste distinction, changed-condition prediction and a justified revision. Use the route and loop to explain at least two interactions between the digestive system and another body system. At least one must show regulation of digestion or energy storage. A source log records what a source actually supplies: fictional table values, an authoritative mechanism explanation or an explicitly invented proposal.

## Defend the limits

A claim identifies what the route explains. Evidence cites exact values or source statements. Reasoning connects a mechanism to those facts. The glucose time curve is consistent with regulation, while the hormone mechanism is separately supplied; the curve alone does not measure insulin. The alien model and three-hour allocation remain fictional comparison tools. Human-body case study does not establish mastery of genetics, evolution, ecology or all biological diversity.

A text description makes a visual route understandable without color. An oral or written defense can identify an alternative explanation, omitted variable and observation that would change the claim. Optional exhibit, CER and reflection projects extend or re-present the saved required artifact. They do not require a second complete capstone.`,
		tasks: [
			"Choose a representation for one saved meal-component route. Compare a tube-order map, an intestinal-boundary diagram and a labelled text sequence for the same question. State the information each preserves or omits and select a format with a complete text route rather than relying only on color or drawing scale.",
			"Connect the saved case notes across digestion, absorption, cellular use, regulation and waste handling. Identify one molecule, cell/tissue boundary, organ and system claim. Use the supplied starch route as a check and preserve one unresolved mechanism rather than implying that this human-body case covers every field of biology.",
			"Complete one required capstone from the saved core notes or supplied worked record. Include the narrow question, source log, cross-scale pathway, mechanism, energy/storage account, feedback loop, waste distinction, changed-condition prediction and limitation. Explain at least two interactions involving the digestive system and another body system, including one that regulates digestion or energy storage. Cite supplied evidence, preserve the initial model and justify the revision.",
			"Defend the saved capstone with one supported claim, two relevant source details, reasoning, an alternative explanation and a result that would change the claim. Compare the initial and revised routes, explaining the corrected boundary or mechanism. State the remaining model limit and choose a relevant next question for another biology field."
		],
		optional: [
			"Continue the saved required capstone as an exhibit. Retain its source log, route and first/revised models, then add one changed condition or another representation for the same evidence. Compare the new view with the original and state what remains uncertain. This optional extension uses the existing artifact instead of repeating the required final project.",
			"Select one narrow claim from the saved capstone for a short CER presentation or written response. Cite two source details, explain the cross-scale connection and include an alternative and limitation. Answer what observation would change the claim. Reuse the relevant saved diagram or table rather than constructing another full capstone.",
			"Compare the saved first and final system models. Cite two concrete revisions in mechanism, boundary, arrow meaning or evidence interpretation and explain what prompted each. Identify a remaining question for cell biology, genetics, evolution, ecology or microbiology. The reflection extends the same completed evidence portfolio and preserves its limits."
		]
	}
};
