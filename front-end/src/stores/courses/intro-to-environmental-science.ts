import type { RawCourse, RawCourseModuleItem } from "./types";
import { staticMediaUrl } from "./staticMedia";

const NASA_BIOMES = "https://earthobservatory.nasa.gov/biome";
const NASA_GRASSLAND =
	"https://earthobservatory.nasa.gov/biome/biograssland.php";
const NASA_WATER_CYCLE = "https://gpm.nasa.gov/education/water-cycle";
const PHOTOSYNTHESIS_DIAGRAM =
	"/course-assets/environmental-science/photosynthesis.svg";
const ORIGINAL_PHOTOSYNTHESIS_DIAGRAM =
	"c009b919-101b-4a4d-8f19-74885e8f62c0_Photosynthesis-01_577acc78_670x451.png";

const ENVIRONMENTAL_REFERENCES = {
	eiaEnergyEnvironment:
		"https://www.eia.gov/energyexplained/energy-and-the-environment/",
	epaEnviroAtlas: "https://www.epa.gov/enviroatlas",
	epaTri: "https://www.epa.gov/toxics-release-inventory-tri-program/what-toxics-release-inventory",
	nasaClimateEvidence: "https://science.nasa.gov/climate-change/evidence/",
	ngssEarthHumanActivity:
		"https://www.nextgenscience.org/dci-arrangement/hs-ess3-earth-and-human-activity",
	noaaOceanAcidification:
		"https://oceanacidification.noaa.gov/ocean-acidification-education-outreach/",
	usgsStreamflow:
		"https://www.usgs.gov/water-science-school/science/streamflow-and-water-cycle",
	usgsWaterCycle: "https://www.usgs.gov/faqs/what-earths-water-cycle"
} as const;

const ENVIRONMENTAL_MATERIALS = {
	answerKey:
		"/course-assets/environmental-science/environmental-science-rubrics-answer-key.md",
	pack: "/course-assets/environmental-science/environmental-science-materials-pack.md"
} as const;

function environmentalMaterial(section: string) {
	return `${ENVIRONMENTAL_MATERIALS.pack}#${section}`;
}

function environmentalAnswerKey(section: string) {
	return `${ENVIRONMENTAL_MATERIALS.answerKey}#${section}`;
}

function concept({
	check,
	evidence,
	model,
	vocabulary
}: {
	check: string;
	evidence: string;
	model: string;
	vocabulary: string[];
}) {
	return [
		`**Concept path:** ${model}`,
		`**Vocabulary:** ${vocabulary.join(", ")}.`,
		`**Evidence work:** ${evidence}`,
		`**Review check:** ${check}`
	].join("\n\n");
}

function project({
	artifact,
	check,
	evidence,
	goal
}: {
	artifact: string;
	check: string;
	evidence: string;
	goal: string;
}) {
	return [
		`**Project goal:** ${goal}`,
		`**Artifact:** ${artifact}`,
		`**Evidence target:** ${evidence}`,
		`**Completion check:** ${check}`
	].join("\n\n");
}

function terminology(terms: Array<[string, string]>) {
	return [
		"Use this vocabulary as a working reference while building models and reports. Each term is strongest when it is paired with an example from the selected biome, a diagram label, or a real environmental event.",
		...terms.map(([term, definition]) => `- **${term}:** ${definition}`)
	].join("\n\n");
}

const introToEnvironmentalScienceSourceCourse: RawCourse = {
	name: "Intro to Environmental Science",
	modules: [
		{
			title: "ES1 Ecosystems",
			curriculum: [
				{
					title: "Biome and Ecosystem Framework",
					content: concept({
						model: "Environmental science studies interactions among living organisms, physical conditions, and human decisions. A biome is a large region with a recognizable climate and community of organisms, while an ecosystem is the interacting system inside a place. The same biome can contain many smaller ecosystems.",
						vocabulary: [
							"biome",
							"ecosystem",
							"flora",
							"fauna",
							"climate",
							"habitat"
						],
						evidence:
							"Select one core biome from the NASA biome reference and collect evidence about temperature, precipitation, landforms, plants, animals, and seasonal patterns. Keep notes in a comparison table so later projects can return to the same biome without restarting the research.",
						check: "Explain why a desert, tundra, grassland, forest, or aquatic biome is not defined by one species alone. The explanation needs both living and nonliving factors."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Disturbance and Succession",
					content: concept({
						model: "Ecosystems change after droughts, floods, fires, storms, insect outbreaks, volcanic events, invasive species, or human land-use decisions. A disturbance is not automatically permanent; succession describes the sequence of recovery or replacement over time.",
						vocabulary: [
							"ecological disturbance",
							"primary succession",
							"secondary succession",
							"anthropogenic disturbance",
							"recovery"
						],
						evidence:
							"Build a before-during-after timeline for one disturbance that could affect the core biome. The timeline needs a cause, visible ecosystem changes, short-term consequences, and a recovery path. Long events can be summarized by major phases instead of every detail.",
						check: "Distinguish the trigger of a disturbance from the ecosystem response. For example, a wildfire, flood, or invasive species introduction is not the same thing as the recovery sequence that follows."
					})
				},
				{
					title: "Core Biome Research Log",
					content: concept({
						model: "The course uses one core biome as a recurring case study. A useful research log separates facts, source notes, model sketches, and open questions. Each later unit adds a new layer: food webs, consumers, weather, water, soil, energy use, human impact, past change, and future change.",
						vocabulary: [
							"case study",
							"observation",
							"inference",
							"source reliability",
							"model limitation"
						],
						evidence:
							"Record three or more evidence-based facts about the biome and one or more uncertainties. Facts can come from NASA pages, maps, photographs, climate summaries, species references, or other vetted sources. Uncertainties are kept visible so future evidence can revise them.",
						check: "Mark which notes are direct observations from a source and which notes are inferences about how the ecosystem works."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Terminology: Ecosystems",
					content: terminology([
						[
							"Biome",
							"A large naturally occurring community shaped by climate, landforms, and characteristic plant and animal life."
						],
						[
							"Ecosystem",
							"A community of living organisms interacting with each other and with nonliving parts of the environment."
						],
						[
							"Ecological disturbance",
							"A temporary or lasting change in conditions that disrupts an ecosystem's structure or function."
						],
						[
							"Ecological succession",
							"The sequence of community changes that occurs as an ecosystem develops, recovers, or reorganizes."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Biome Travel Guide",
					content: project({
						goal: "Create a travel guide for the selected core biome that uses environmental evidence rather than generic tourism claims.",
						artifact:
							"A slide, document, poster, or notebook page recommending what to see, what climate to prepare for, and which plants or animals are characteristic of the biome.",
						evidence:
							"Include three or more organism examples, two nonliving environmental factors, and one explanation of how those factors shape life in the biome.",
						check: "The guide explains why this biome is distinct from another biome and names the evidence source used for the comparison."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Project: Ecological Disturbance Timeline",
					content: project({
						goal: "Model how one disturbance affects the core biome and how recovery or succession could unfold.",
						artifact:
							"A timeline with labeled stages before, during, and after the disturbance. The timeline may be drawn, written, or built as slides.",
						evidence:
							"Name the disturbance cause, the organisms or resources most affected, and the recovery process that reconnects the ecosystem over time.",
						check: "The model separates short-term disruption from long-term succession and names one uncertainty that would need stronger data."
					})
				},
				{
					title: "Project: Ecosystem Reporter",
					content: project({
						goal: "Report on a recent real-world event that disrupted one or more ecosystems.",
						artifact:
							"A written report, short presentation, or video script describing the event, conditions, consequences, and ecosystem recovery questions.",
						evidence:
							"Use one or more credible sources and connect the event to vocabulary from the module: biome, ecosystem, disturbance, and succession.",
						check: "The report explains what changed in the ecosystem and why the audience can trust the evidence."
					})
				}
			]
		},
		{
			title: "ES2 Flora and Decomposers",
			curriculum: [
				{
					title: "Primary Production",
					content: concept({
						model: "Most food webs begin with primary producers that use light or chemical energy to build organic matter from inorganic materials. In many ecosystems, plants and algae use light energy to make sugars from carbon dioxide and water, releasing oxygen through photosynthesis. This producer layer supports consumers above it.",
						vocabulary: [
							"primary producer",
							"photosynthesis",
							"chlorophyll",
							"organic matter",
							"foundation species"
						],
						evidence:
							"Choose a temporary biome different from the core biome. Pick one species, identify what it eats, and keep tracing food sources downward until the chain reaches producers or another energy source. Add a note when the chain is uncertain.",
						check: "Explain why a food chain cannot be complete if it stops at an herbivore or predator without identifying the original energy source."
					})
				},
				{
					title: "Photosynthesis Diagram Reference",
					content: [
						"In this photosynthesis model, light energy is captured by chlorophyll, carbon dioxide enters from the air, water moves through the plant, glucose stores usable chemical energy, and oxygen is released. Producers transform light energy into stored chemical energy that supports consumers and decomposers. The material inputs are carbon dioxide and water; light supplies energy rather than matter.",
						`![Carbon dioxide and water enter photosynthesis. Light supplies energy to build sugars, and oxygen is released.](${PHOTOSYNTHESIS_DIAGRAM})`,
						"[Photosynthesis overview](https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis)"
					].join("\n\n"),
					mediaLink: PHOTOSYNTHESIS_DIAGRAM,
					sourceMedia: {
						original: staticMediaUrl(
							ORIGINAL_PHOTOSYNTHESIS_DIAGRAM
						),
						replacement: PHOTOSYNTHESIS_DIAGRAM
					}
				},
				{
					title: "Food Webs and Decomposers",
					content: concept({
						model: "Food webs extend in many directions rather than forming one straight line. Consumers eat producers or other consumers, and decomposers return nutrients from dead organisms and waste back into the ecosystem. Decomposers connect every level, including the top predators.",
						vocabulary: [
							"food web",
							"consumer",
							"decomposer",
							"nutrient recycling",
							"trophic level"
						],
						evidence:
							"The producer chain from the previous concept extends upward into likely consumers and sideways into decomposers that process remains or waste. Uncertain links are marked as hypotheses.",
						check: "Explain why the phrase 'top of the food chain' is incomplete unless decomposers and nutrient cycling are included."
					})
				},
				{
					title: "Terminology: Producers and Decomposers",
					content: terminology([
						[
							"Primary producer",
							"An organism, such as a plant or photosynthetic microorganism, that uses light or chemical energy to build organic matter from inorganic carbon."
						],
						[
							"Photosynthesis",
							"The process by which plants and some other organisms use light energy, carbon dioxide, and water to make sugars and oxygen."
						],
						[
							"Decomposer",
							"An organism that breaks down dead organisms or waste, returning materials to the ecosystem."
						],
						[
							"Food web",
							"A network diagram showing feeding relationships among organisms in an ecosystem."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Foundation of the Food Web",
					content: project({
						goal: "Trace one ecosystem food chain down to its producer foundation.",
						artifact:
							"A labeled chain or web with arrows showing energy movement from producers through consumers.",
						evidence:
							"Include four or more organisms or organism groups when possible, plus a note explaining the original source of energy.",
						check: "The model can explain what changes if the producer layer becomes weaker or disappears."
					})
				},
				{
					title: "Project: Top Dog and Decomposer Web",
					content: project({
						goal: "Extend a food chain upward to predators and sideways to decomposers.",
						artifact:
							"A food web that includes producers, herbivores, carnivores or omnivores, and decomposers.",
						evidence:
							"The web uses arrows consistently and includes one or more decomposer links for dead organisms or waste.",
						check: "The explanation identifies which organisms depend indirectly on producers even when they do not eat plants directly."
					})
				},
				{
					title: "Project: Ecosystem Reporter Part 2",
					content: project({
						goal: "Analyze how a disturbance changes a food web rather than only naming damaged land or weather conditions.",
						artifact:
							"A report or diagram showing the original food web, the disrupted food web, and one possible recovery path.",
						evidence:
							"Name the food-web level most affected and explain how that effect spreads to other organisms.",
						check: "The report uses producer, consumer, decomposer, and food web vocabulary correctly."
					})
				}
			]
		},
		{
			title: "ES3 Fauna",
			curriculum: [
				{
					title: "Consumers and Energy Flow",
					content: concept({
						model: "Consumers obtain energy by eating organisms or organic matter. Energy moves through ecosystems from producers to consumers and is gradually lost as heat, so high-level consumers usually require large amounts of producer-supported biomass beneath them.",
						vocabulary: [
							"consumer",
							"herbivore",
							"carnivore",
							"omnivore",
							"energy flow",
							"biomass"
						],
						evidence:
							"Use the supplied fictional food-system table to trace producer bases, processing steps, and trophic relationships. Compare one environmental indicator at a time, and identify which lifecycle stages or measurements are missing.",
						check: "Compare a human diet with the diet of a wolf or lion by naming the producer base required to support each consumer."
					}),
					datasetLink: environmentalMaterial(
						"fictional-food-system-energy-table"
					)
				},
				{
					title: "Animal Rarity and Habitat Fit",
					content: concept({
						model: "Fauna are not spread evenly across a biome. An animal's rarity depends on habitat needs, food availability, reproduction, competition, predation, and human disturbance. A safari-style guide is stronger when it explains likelihood instead of listing animals randomly.",
						vocabulary: [
							"fauna",
							"habitat",
							"rarity",
							"adaptation",
							"population",
							"carrying capacity"
						],
						evidence:
							"Return to the core biome and choose several animals that could live there. For each animal, note diet, habitat, likely abundance, and one reason the animal is common, rare, seasonal, or hard to observe.",
						check: "Explain why a large predator often has a smaller population than the plants or herbivores beneath it in the food web."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Environmental Cost of Diet Choices",
					content: concept({
						model: "Food systems connect production, land, water, energy, processing, transportation, storage, waste, access, and culture. Environmental analysis does not reduce a fictional meal to one 'good' or 'bad' label; it compares a shared indicator and identifies which lifecycle evidence is missing.",
						vocabulary: [
							"resource use",
							"energy efficiency",
							"tradeoff",
							"functional unit",
							"system boundary",
							"sustainability"
						],
						evidence:
							"Compare two supplied fictional meal scenarios using the same functional unit and one selected indicator. Mark production, processing, transport, storage, and waste assumptions, then write a bounded claim-evidence-reasoning paragraph.",
						check: "Separate the supported environmental comparison from nutrition, health, affordability, cultural-fit, or universal-superiority claims that the supplied data cannot establish."
					}),
					datasetLink: environmentalMaterial(
						"fictional-food-system-energy-table"
					)
				}
			],
			supplementalProjects: [
				{
					title: "Project: Food Journal",
					content: project({
						goal: "Use the legacy Food Journal format to connect supplied fictional meal components to producers, consumers, and food-system stages without recording anything a learner eats.",
						artifact:
							"A table or diagram tracing the fictional components back to plants, animals, fungi, or other source organisms and forward through selected processing or transport stages.",
						evidence:
							"Each row names the producer base, trophic relationship, lifecycle boundary, one environmental indicator, and one missing datum.",
						check: "The analysis explains food-web energy flow without collecting personal meals or converting a one-indicator comparison into nutrition advice."
					}),
					datasetLink: environmentalMaterial(
						"fictional-food-system-energy-table"
					)
				},
				{
					title: "Project: Biome Safari",
					content: project({
						goal: "Create a field guide to animals in the core biome with evidence-based rarity notes.",
						artifact:
							"A safari guide, slide deck, video outline, or illustrated page with animal names, habitats, diets, and rarity estimates.",
						evidence:
							"Five or more animals are tied to food-web position, habitat needs, and one factor affecting how often they are seen.",
						check: "The guide distinguishes common, rare, hidden, migratory, and endangered possibilities instead of treating all animals as equally visible."
					})
				},
				{
					title: "Project: Diet Plan",
					content: project({
						goal: "Use the legacy Diet Plan title to redesign one supplied fictional food-system scenario for a narrower environmental objective, without prescribing food choices.",
						artifact:
							"A before-and-after scenario chart showing the selected indicator, functional unit, changed lifecycle stage, environmental reasoning, tradeoffs, and open questions.",
						evidence:
							"The redesign explains which supplied assumptions could affect food-web energy demand, transportation, water, land, storage, or waste and which effects remain unmeasured.",
						check: "The final note records one benefit, one limitation, and why the model cannot support personal nutrition, health, affordability, or cultural recommendations."
					}),
					datasetLink: environmentalMaterial(
						"fictional-food-system-energy-table"
					)
				}
			]
		},
		{
			title: "ES4 Weather and Climate",
			curriculum: [
				{
					title: "Water Cycle in a Biome",
					content: concept({
						model: "Water moves through ecosystems by evaporation, condensation, precipitation, runoff, infiltration, groundwater flow, plant uptake, and transpiration. The same water-cycle vocabulary can look different in a rainforest, desert, tundra, grassland, or aquatic ecosystem.",
						vocabulary: [
							"water cycle",
							"evaporation",
							"precipitation",
							"runoff",
							"infiltration",
							"transpiration"
						],
						evidence:
							"Use images or descriptions of the core biome to label visible and hidden water locations. Then draw arrows showing how water enters, moves through, leaves, or cycles within the biome.",
						check: "Explain why water may be present in soil, plants, ice, air, organisms, or groundwater even when surface water is not obvious."
					}),
					datasetLink: NASA_WATER_CYCLE
				},
				{
					title: "Weather Versus Climate",
					content: concept({
						model: "Weather describes short-term conditions at a time and place. Climate describes long-term patterns across seasons and years. A cold day does not disprove warming climate trends, and a hot day alone does not prove them; climate claims depend on patterns.",
						vocabulary: [
							"weather",
							"climate",
							"seasonal pattern",
							"trend",
							"long-term average"
						],
						evidence:
							"Compare travel advice for a short visit with advice for moving to the biome for months or years. Use climate summaries, seasonal descriptions, or biome charts to support the difference.",
						check: "Classify statements as weather or climate, then explain what kind of evidence would be needed for each statement."
					}),
					datasetLink: NASA_GRASSLAND
				},
				{
					title: "Climate Change Claim Evaluation",
					content: concept({
						model: "Climate change arguments need careful separation between local weather events, regional climate patterns, global temperature trends, greenhouse gases, impacts, uncertainty, and policy responses. The strongest explanations address the evidence directly instead of arguing from one anecdote.",
						vocabulary: [
							"climate change",
							"greenhouse gas",
							"global trend",
							"regional impact",
							"evidence"
						],
						evidence:
							"Respond to the claim that snowy weather proves climate change is not real. The response needs one or more reliable sources, a definition of weather versus climate, and one example of how local weather can coexist with broader climate trends.",
						check: "Identify whether a sentence is a claim, evidence, or reasoning, then revise it if it relies only on a single local weather observation."
					})
				},
				{
					title: "Terminology: Weather and Climate",
					content: terminology([
						[
							"Weather",
							"Short-term temperature, precipitation, wind, cloudiness, and related conditions at a specific time and place."
						],
						[
							"Climate",
							"Long-term patterns of temperature, precipitation, humidity, wind, and seasons in a region."
						],
						[
							"Water cycle",
							"The movement of water among land, ocean, atmosphere, living things, and underground reservoirs."
						],
						[
							"Climate change",
							"A long-term shift in global or regional climate patterns, often discussed today in relation to rising global temperatures and human greenhouse-gas emissions."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Where Is the Water?",
					content: project({
						goal: "Map visible and hidden water in the core biome.",
						artifact:
							"A labeled diagram, image annotation, or concept map identifying water in air, soil, plants, organisms, ice, rivers, lakes, or groundwater.",
						evidence:
							"Each label includes a short note about how water moves to or from that location.",
						check: "The map uses water-cycle vocabulary and includes one or more hidden water locations."
					}),
					datasetLink: NASA_BIOMES
				},
				{
					title: "Project: Travel Guide Weather Addendum",
					content: project({
						goal: "Revise the ES1 travel guide so it distinguishes short-term weather from long-term climate.",
						artifact:
							"A travel-guide addendum with packing advice for a short trip and relocation advice for a long stay.",
						evidence:
							"Use seasonal or climate-pattern evidence to justify the long-term advice, not just the current day's weather.",
						check: "The addendum includes one sentence explaining why weather evidence and climate evidence answer different questions."
					}),
					datasetLink: NASA_GRASSLAND
				},
				{
					title: "Project: Climate Change Debate Response",
					content: project({
						goal: "Correct a misleading weather-versus-climate claim using the evidence appropriate to each claim level; this is an evidence response, not a requirement to stage false balance.",
						artifact:
							"A short evidence brief, video script, or spoken explanation that responds respectfully and separates event observation, trend detection, attribution, impact, and response preference.",
						evidence:
							"Include definitions of weather and climate, a NASA evidence source, the supplied claim ladder, and reasoning that matches each source to the exact claim it supports.",
						check: "The response avoids inference from one local event and does not present established evidence and an unsupported anecdote as equally supported positions."
					}),
					datasetLink: environmentalMaterial(
						"weather-climate-and-attribution-data"
					)
				}
			]
		},
		{
			title: "ES5 Geology and Oceanography",
			curriculum: [
				{
					title: "Soil as an Ecosystem Resource",
					content: concept({
						model: "Soil is more than loose dirt. It stores water, supports roots, holds nutrients, contains organisms, and changes how ecosystems respond to rainfall, drought, erosion, and land use. Soil texture and structure affect which plants can survive.",
						vocabulary: [
							"soil",
							"erosion",
							"sediment",
							"nutrient",
							"groundwater",
							"water retention"
						],
						evidence:
							"Use a provided image, safe observation, or drawn model of a plant and its soil. Label where water goes, where roots grow, which organisms may live in the soil, and how soil differs from sand, rock, or bare pavement.",
						check: "Predict what changes if soil is replaced by sand, large rocks, pavement, or no ground material, then connect the prediction to water and plant needs."
					})
				},
				{
					title: "Fossils and Fossil Fuels",
					content: concept({
						model: "Fossils preserve evidence of past life, while fossil fuels form from ancient organic matter under specific heat, pressure, burial, and time conditions. Both connect geology to life history, but they serve different scientific and energy roles.",
						vocabulary: [
							"fossil",
							"fossil fuel",
							"coal",
							"oil",
							"natural gas",
							"nonrenewable resource"
						],
						evidence:
							"Create two timelines for an extinct organism or ancient plant material: one showing fossil formation and one showing fossil-fuel formation. The timelines need conditions, scale, and one or more reasons the process is slow.",
						check: "Explain why fossil fuels are considered nonrenewable on human time scales even though they come from once-living material."
					})
				},
				{
					title: "Renewable Energy Comparison",
					content: concept({
						model: "Renewable energy sources such as solar, wind, hydroelectric, geothermal, and some bioenergy options are replenished faster than fossil fuels. Environmental analysis still compares benefits, drawbacks, location limits, infrastructure, storage, wildlife impact, cost, and reliability.",
						vocabulary: [
							"renewable energy",
							"nonrenewable energy",
							"tradeoff",
							"infrastructure",
							"reliability"
						],
						evidence:
							"Compare one fossil fuel with one renewable alternative. Use a benefits/drawbacks table and include one or more environmental advantages and one practical limitation for the renewable option.",
						check: "Avoid treating renewable as automatically impact-free; the comparison needs both benefits and tradeoffs."
					})
				},
				{
					title: "Terminology: Earth Materials and Energy",
					content: terminology([
						[
							"Soil erosion",
							"The movement and loss of soil by water, wind, gravity, or human activity, often reducing soil quality over time."
						],
						[
							"Fossil fuel",
							"An energy resource formed from ancient buried organic material over very long periods of time."
						],
						[
							"Renewable energy",
							"Energy from a source that is replenished on a human time scale, such as sunlight, wind, or flowing water."
						],
						[
							"Oceanography",
							"The study of oceans, including water movement, marine ecosystems, chemistry, geology, and climate interactions."
						]
					])
				}
			],
			supplementalProjects: [
				{
					title: "Project: Soil Photographer",
					content: project({
						goal: "Analyze soil as a functional part of an ecosystem.",
						artifact:
							"A labeled photo, provided image, drawing, or diagram of a plant-soil system with notes about water, roots, organisms, and erosion risk.",
						evidence:
							"Label four or more parts of the system and explain how soil supports plant growth or water movement.",
						check: "The explanation distinguishes soil from rock, sand, or pavement using ecosystem functions, not only appearance."
					})
				},
				{
					title: "Project: Fossil Timeline",
					content: project({
						goal: "Compare fossil formation and fossil-fuel formation using time and conditions.",
						artifact:
							"Two parallel timelines for an extinct animal, ancient plant matter, or another source organism.",
						evidence:
							"Each timeline includes burial or preservation conditions, time scale, and what evidence or resource results.",
						check: "The comparison names which process matters more for scientific evidence and which process matters more for modern energy use."
					})
				},
				{
					title: "Project: Fossil Fuel Alternative",
					content: project({
						goal: "Evaluate one renewable energy source as an alternative to a fossil fuel.",
						artifact:
							"A poster, slide, or brief report comparing the alternative's benefits, drawbacks, geography, cost or infrastructure needs, and environmental impact.",
						evidence:
							"Include one or more facts from reliable sources and one tradeoff that prevents the solution from being perfect everywhere.",
						check: "The final recommendation explains where the alternative works best and where another solution may be needed."
					})
				}
			]
		},
		{
			title: "ES6 Humans and the Environment",
			curriculum: [
				{
					title: "Ecosystem Services",
					content: concept({
						model: "Earth systems provide air, water, food, climate regulation, soil formation, pollination, decomposition, materials, and cultural value. These benefits are often called ecosystem services. A Mars-colony comparison makes hidden Earth services easier to see.",
						vocabulary: [
							"ecosystem service",
							"life-support system",
							"resource",
							"dependency",
							"resilience"
						],
						evidence:
							"Design a self-sufficient Mars colony on paper or slides, then match each required system to the equivalent service provided by Earth. Include water, food, oxygen, waste processing, shelter, energy, and climate control.",
						check: "Explain which Earth services are difficult to replace artificially and why that makes ecosystem protection a practical human concern."
					})
				},
				{
					title: "Daily Environmental Impact",
					content: concept({
						model: "Daily routines connect individuals and societies to electricity, transportation, food systems, packaging, buildings, roads, water, waste, and manufacturing. Environmental impact analysis works at multiple scales: personal choices, community systems, companies, governments, and infrastructure.",
						vocabulary: [
							"environmental impact",
							"consumption",
							"waste",
							"infrastructure",
							"mitigation",
							"systemic change"
						],
						evidence:
							"Use a supplied or invented fictional day from morning to night. For each activity, name a direct environmental impact and one indirect impact. Then classify possible improvements as individual, household, community, business, or policy-level actions.",
						check: "Separate individual action from system-level action. Both can matter, but they solve different parts of an environmental problem."
					})
				},
				{
					title: "Positive Human Interventions",
					content: concept({
						model: "Human activity can damage ecosystems, but it can also restore, protect, monitor, or redesign them. Conservation, habitat restoration, pollution cleanup, species reintroduction, protected areas, better farming, and policy changes are examples of positive interventions.",
						vocabulary: [
							"restoration",
							"conservation",
							"intervention",
							"protected area",
							"habitat"
						],
						evidence:
							"Find a case where people helped protect or restore an ecosystem. Record the problem, intervention, evidence of improvement, people or organizations involved, and one limitation or tradeoff.",
						check: "Explain why a positive environmental story still needs evidence rather than only good intentions."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Life on Mars",
					content: project({
						goal: "Use a Mars-colony model to identify environmental services Earth already provides.",
						artifact:
							"A colony diagram or systems chart linking survival needs to Earth equivalents.",
						evidence:
							"Include six or more systems and explain how Earth provides or supports each one.",
						check: "The model names one service that is easy to overlook because it normally happens in the background."
					})
				},
				{
					title: "Project: Daily Schedule Impact Map",
					content: project({
						goal: "Connect ordinary daily choices and systems to environmental impact.",
						artifact:
							"A timeline or table from morning to night with activity, resource use, direct impact, indirect impact, and one possible improvement.",
						evidence:
							"Five or more supplied or invented fictional activities are analyzed, and improvements are classified by scale without disclosing a learner's household routines or purchases.",
						check: "The map includes both personal actions and larger systems such as power generation, transportation, buildings, or food supply."
					})
				},
				{
					title: "Project: Reverse Ecological Disturbance Report",
					content: project({
						goal: "Report on a case where human action protected, restored, or improved an ecosystem.",
						artifact:
							"A report, script, or presentation explaining the original problem, the intervention, evidence of improvement, and remaining limitations.",
						evidence:
							"Use one or more credible sources and connect the case to restoration, conservation, or ecosystem-service vocabulary.",
						check: "The report names who benefited, what evidence changed, and what problem remains unsolved."
					})
				}
			]
		},
		{
			title: "ES7 Earth's Past, Present, and Future",
			curriculum: [
				{
					title: "Personal Biome Comparison",
					content: concept({
						model: "A neighborhood, yard, balcony view, park, street, or nearby green space can be treated as a small environmental case study. Comparing this personal biome with the course core biome reveals how climate, landscape, water, plants, animals, and human design differ.",
						vocabulary: [
							"local environment",
							"landscape",
							"urban ecosystem",
							"comparison",
							"human interaction"
						],
						evidence:
							"Describe a fictional or supplied local-environment case using notes, a provided photo, a generalized map, or a memory-based sketch with identifying details removed. Include landscape, plant life, animal life, water, weather, and human-built features.",
						check: "Name two or more similarities and two or more differences between the local environment and the selected core biome."
					})
				},
				{
					title: "Past Environmental Change",
					content: concept({
						model: "The same place can look very different across deep time, historical time, and recent decades. Past change may come from climate, sea level, glaciers, species movement, geological processes, agriculture, roads, buildings, and other human land use.",
						vocabulary: [
							"past environment",
							"land-use change",
							"deep time",
							"historical change",
							"evidence"
						],
						evidence:
							"Construct a fictional but evidence-informed report describing the local environment two million years ago or in another past period. Mark which details are documented, inferred, or speculative.",
						check: "Explain how humans have changed the current environment and how that kind of evidence differs from deep-time evidence."
					})
				},
				{
					title: "Future Scenario Modeling",
					content: concept({
						model: "Future environmental models use current trends, constraints, and choices to imagine possible outcomes. A scenario is not a prediction with certainty; it is a structured possibility that explains what would need to happen for the future to unfold that way.",
						vocabulary: [
							"future scenario",
							"trend",
							"uncertainty",
							"adaptation",
							"sustainability"
						],
						evidence:
							"Create two future versions of the local environment: one where current problems continue and one where people make improvements. Include landscape, water, organisms, climate or weather concerns, and human infrastructure.",
						check: "Explain which changes are likely, which are uncertain, and which depend on human decisions."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Tour of Your Biome",
					content: project({
						goal: "Create an environmental tour of a local place and compare it with the course core biome.",
						artifact:
							"A written report, video script, narrated slide deck, or illustrated guide describing landscape, plants, animals, water, weather, and human interactions.",
						evidence:
							"The tour includes five or more supplied, fictionalized, or generalized observations and a comparison with the core biome; it omits exact addresses, travel routes, faces, and other identifying details.",
						check: "The tour explains how people interact with the local environment rather than only listing what is present."
					})
				},
				{
					title: "Project: Your Biome in the Past",
					content: project({
						goal: "Model how the local environment may have looked in the past.",
						artifact:
							"A fictional report, diagram, timeline, or slide set distinguishing evidence-backed details from inferred details.",
						evidence:
							"The model names climate, landforms, organisms, and human influence or lack of human influence.",
						check: "The project explains what changed, what stayed similar, and what evidence would improve the reconstruction."
					})
				},
				{
					title: "Project: Your Biome in the Future",
					content: project({
						goal: "Create a future scenario for the local environment and evaluate whether it is desirable.",
						artifact:
							"A report, diagram, or presentation showing the far-future environment, likely changes, uncertain changes, and preferred improvements.",
						evidence:
							"The scenario connects three or more current trends or choices to future outcomes.",
						check: "The project identifies one change that would make the local environment better for people and one change that would protect the natural system."
					})
				}
			]
		},
		{
			title: "ES8 Environmental Design Capstone",
			curriculum: [
				{
					title: "Capstone Problem Selection",
					content: concept({
						model: "The capstone turns the course's recurring ideas into an environmental design proposal. Strong proposals choose a specific problem, define who or what is affected, explain why the problem matters, and connect the solution to ecosystem evidence instead of only good intentions.",
						vocabulary: [
							"proposal",
							"stakeholder",
							"environmental benefit",
							"drawback",
							"long-term impact"
						],
						evidence:
							"Choose a problem from the core biome, the local environment, or one of the Ecosystem Reporter cases. Write a problem statement with location, cause, affected living and nonliving parts, and evidence that the problem is real.",
						check: "The problem statement is specific enough that a solution can be judged against it."
					})
				},
				{
					title: "Proposal Design and Tradeoffs",
					content: concept({
						model: "Environmental design requires tradeoffs. A proposal may benefit the natural environment, human society, or both, but it can also have costs, risks, unequal impacts, time constraints, or persuasion challenges. Naming tradeoffs makes the proposal stronger.",
						vocabulary: [
							"tradeoff",
							"feasibility",
							"cost",
							"risk",
							"persuasion",
							"implementation"
						],
						evidence:
							"Describe the proposed action, materials or systems needed, timeline, people involved, strategy for convincing others, expected short-term effects, and expected effects 50 years later.",
						check: "The proposal includes one or more drawbacks or harmed groups and explains how the design could reduce that problem."
					})
				},
				{
					title: "Course Synthesis",
					content: concept({
						model: "The final proposal connects ecosystems, food webs, weather and climate, water, soil, energy, human impact, past change, future scenarios, and evidence quality. A good synthesis does not repeat every module; it selects the concepts that actually explain the chosen problem.",
						vocabulary: [
							"ecosystem",
							"food web",
							"climate",
							"resource",
							"human impact",
							"sustainability"
						],
						evidence:
							"Create a one-page concept map showing which course ideas support the proposal. Each connection needs a short reason, such as how water affects plant survival or how energy choices affect greenhouse-gas emissions.",
						check: "The synthesis names three or more course modules and explains how each one changes the proposal."
					})
				}
			],
			supplementalProjects: [
				{
					title: "Project: Transform Our Environment Proposal",
					content: project({
						goal: "Design a proposal that protects, restores, or improves an environmental system over time.",
						artifact:
							"A written report, presentation, or video plan with problem statement, evidence, proposed action, resources, timeline, benefits, drawbacks, and long-term impacts.",
						evidence:
							"Use three or more course concepts and two or more credible sources or documented observations.",
						check: "The proposal explains what success would look like, who helps make it happen, and how the environment could look 50 years later."
					})
				},
				{
					title: "Project: Environmental Action Pitch",
					content: project({
						goal: "Turn the proposal into a concise decision briefing for an audience that could review, test, or support the idea; no personal political advocacy is required.",
						artifact:
							"A script, slide deck, or speaking outline that explains the baseline, evidence, alternatives, decision rule, proposed pilot, and what review role the audience could play.",
						evidence:
							"The briefing uses clear evidence, identifies uncertainty and distributional effects, and avoids relying on fear, slogans, false urgency, or vague claims.",
						check: "The briefing has a bounded next step such as reviewing evidence, comparing alternatives, authorizing a reversible pilot, collecting a missing indicator, or revising the proposal."
					})
				},
				{
					title: "Project: Final Reflection Map",
					content: project({
						goal: "Reflect on how the course changed the way environmental systems are analyzed.",
						artifact:
							"A concept map or short reflection connecting five or more course vocabulary terms to projects completed during the course.",
						evidence:
							"The reflection includes one concept that became clearer, one question that remains open, and one environmental issue worth studying next.",
						check: "The reflection separates personal interest from evidence-based explanation."
					})
				}
			]
		}
	],
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS Earth and human activity",
			"NGSS ecosystems",
			"NGSS matter and energy in organisms and ecosystems",
			"Systems and system models",
			"Claim-evidence-reasoning"
		],
		sourcePolicy:
			"Built from the ES1-ES8 sequence with neutral wording, remote-safe activities, vetted public references, and an owned photosynthesis diagram. The original legacy filename remains in the internal static-media inventory.",
		assessmentCadence: [
			"One model, map, or report per module",
			"One vocabulary-backed evidence explanation per module",
			"Recurring core-biome portfolio",
			"Capstone proposal with tradeoff analysis"
		],
		toolchain: [
			"Shared screen",
			"Notebook or digital document",
			"NASA biome references",
			"Provided images or diagrams",
			"Concept maps",
			"Written or video-script reports"
		],
		safetyPolicy: [
			"No required outdoor collection",
			"No required household experiments",
			"No food or diet change recommendation",
			"Optional observations can be replaced with provided images or references"
		],
		courseBoundaries: [
			"Introductory environmental science",
			"Evidence literacy and systems thinking over physical lab work",
			"No personal medical, nutrition, or political advocacy requirement"
		],
		capstoneExpectations: [
			"Specific environmental problem",
			"Evidence-backed proposal",
			"Benefits and drawbacks",
			"Stakeholder and timeline reasoning",
			"Long-term impact scenario"
		],
		recommendedNextWork: [
			"Add a local Environmental Science reference pack with selected NASA, NOAA, USGS, and EPA data sources by module.",
			"Add optional data tables for water, climate, energy, and land-use comparisons."
		]
	}
};

interface IntroEnvironmentalFlow {
	answerSection: string;
	boundaryCheck: string;
	estimatedTime: string;
	evidenceGate: string;
	flowNote: string;
	keyBlocks: string[];
	materialSection: string;
	referenceLink: string;
}

const INTRO_ENVIRONMENTAL_FLOW: Record<string, IntroEnvironmentalFlow> = {
	"ES1 Ecosystems": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"system boundary",
			"biotic and abiotic factors",
			"baseline",
			"disturbance",
			"succession",
			"causal limitation"
		],
		flowNote:
			"Establish one recurring core-biome case, define a system boundary and baseline, and distinguish a disturbance from the evidence needed to explain recovery, reorganization, or succession.",
		evidenceGate:
			"Every ecosystem claim names the place, time, boundary, baseline, supplied observation or source, mechanism, and one plausible alternative explanation or missing measurement.",
		boundaryCheck:
			"A biome label does not establish every local condition, a before-and-after sequence does not prove one cause, and change is not automatically damage or recovery.",
		referenceLink: NASA_BIOMES,
		materialSection: "core-biome-comparison-table",
		answerSection: "ecosystem-and-succession-key"
	},
	"ES2 Flora and Decomposers": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"primary production",
			"energy flow",
			"nutrient cycling",
			"decomposition",
			"food-web arrows",
			"biodiversity evidence"
		],
		flowNote:
			"Build the producer and decomposer foundation of the core-biome model, keep energy flow distinct from nutrient cycling, and test food-web claims against sampling and biodiversity evidence.",
		evidenceGate:
			"Use a declared arrow convention, identify the original energy source, trace matter into a nonliving reservoir, and mark uncertain species links or observations as hypotheses.",
		boundaryCheck:
			"Decomposers recycle matter rather than energy, a food web is not a complete census, and lower observation counts may reflect effort or detectability rather than abundance alone.",
		referenceLink: ENVIRONMENTAL_REFERENCES.ngssEarthHumanActivity,
		materialSection: "food-web-and-biodiversity-cases",
		answerSection: "food-web-and-biodiversity-key"
	},
	"ES3 Fauna": {
		estimatedTime: "5 sessions · 60–90 minutes each",
		keyBlocks: [
			"consumer roles",
			"population",
			"carrying capacity",
			"sampling effort",
			"functional unit",
			"food-system boundary"
		],
		flowNote:
			"Connect consumers to population evidence, normalize observations by effort, and compare fictional food-system cases with a shared functional unit and explicit lifecycle boundary.",
		evidenceGate:
			"A fauna or food-system conclusion identifies the measured indicator, denominator, system boundary, comparable case, uncertainty, and evidence that would be needed for a stronger claim.",
		boundaryCheck:
			"Carrying capacity is dynamic rather than one fixed number, sightings are not population counts, and supplied environmental data cannot establish personal nutrition, health, affordability, or cultural fit.",
		referenceLink: ENVIRONMENTAL_REFERENCES.epaEnviroAtlas,
		materialSection: "fictional-food-system-energy-table",
		answerSection: "food-system-comparison-key"
	},
	"ES4 Weather and Climate": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"weather",
			"climate baseline",
			"trend",
			"event attribution",
			"forcing",
			"response preference"
		],
		flowNote:
			"Move from water-cycle and weather observations to long-term climate evidence, then use a claim ladder to keep event detection, trend, attribution, impact, and response choices distinct.",
		evidenceGate:
			"Match every claim to the spatial scale, time span, baseline, quality-controlled series, physical mechanism, uncertainty, and source needed for that level of inference.",
		boundaryCheck:
			"One event cannot establish or refute a climate trend, a trend alone does not identify its cause, and a supported physical claim does not automatically select one policy response.",
		referenceLink: ENVIRONMENTAL_REFERENCES.nasaClimateEvidence,
		materialSection: "weather-climate-and-attribution-data",
		answerSection: "weather-climate-and-attribution-key"
	},
	"ES5 Geology and Oceanography": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"watershed",
			"soil and sediment",
			"ocean carbon chemistry",
			"reservoir and flux",
			"functional unit",
			"energy lifecycle"
		],
		flowNote:
			"Connect soil, watersheds, oceans, carbon reservoirs, and energy systems across spatial and temporal scales before comparing fossil and renewable options over a shared lifecycle boundary.",
		evidenceGate:
			"Trace material or water from source to reservoir and outlet, state the time scale and functional unit, and include upstream, operational, infrastructure, reliability, and end-of-life evidence.",
		boundaryCheck:
			"Downstream association does not identify one source, ocean acidification does not require pH below seven, and renewable or low-carbon does not mean impact-free.",
		referenceLink: ENVIRONMENTAL_REFERENCES.usgsStreamflow,
		materialSection: "soil-ocean-and-carbon-system-table",
		answerSection: "water-and-ocean-systems-key"
	},
	"ES6 Humans and the Environment": {
		estimatedTime: "6 sessions · 60–100 minutes each",
		keyBlocks: [
			"ecosystem service",
			"release and exposure",
			"risk boundary",
			"distributional effect",
			"intervention",
			"monitoring indicator"
		],
		flowNote:
			"Analyze human dependencies and interventions with pollution and distribution evidence, separating facility releases from exposure or health claims and testing whether benefits and burdens are shared.",
		evidenceGate:
			"Identify the reported measure, pathway, represented population or habitat, data coverage, competing sources, beneficiaries, burden bearers, and indicator that would show whether an intervention works.",
		boundaryCheck:
			"A reported release is not exposure, dose, risk, or observed health outcome. Mapped overlap alone does not establish causation. Analyses use supplied aggregate cases and exclude personal health and demographic data.",
		referenceLink: ENVIRONMENTAL_REFERENCES.epaTri,
		materialSection: "pollution-and-distribution-case",
		answerSection: "pollution-and-distribution-key"
	},
	"ES7 Earth's Past, Present, and Future": {
		estimatedTime: "5 sessions · 60–100 minutes each",
		keyBlocks: [
			"deep-time evidence",
			"historical record",
			"present baseline",
			"trend",
			"scenario",
			"preference and values"
		],
		flowNote:
			"Compare past, present, and possible futures against one baseline while keeping reconstruction, observation, trend, projection, and preferred-future claims tied to different evidence.",
		evidenceGate:
			"Label every detail as documented, measured, inferred, assumed, projected, or preferred; compare at least two scenarios against the same baseline and identify the decisions and physical assumptions that differ.",
		boundaryCheck:
			"A scenario is conditional rather than certain, a preferred future is partly a values judgment, and local examples never require exact addresses, routes, faces, or private household data.",
		referenceLink: ENVIRONMENTAL_REFERENCES.epaEnviroAtlas,
		materialSection: "past-present-future-scenario-table",
		answerSection: "scenario-modeling-key"
	},
	"ES8 Environmental Design Capstone": {
		estimatedTime: "8–10 sessions · 60–120 minutes each",
		keyBlocks: [
			"baseline",
			"no-action alternative",
			"decision criteria",
			"distribution and tradeoffs",
			"implementation owner",
			"monitoring and rollback"
		],
		flowNote:
			"Turn the recurring portfolio into a defensible environmental decision: define the baseline, compare multiple alternatives, make the decision rule visible, and design monitoring, adaptation, and rollback before presenting a recommendation.",
		evidenceGate:
			"The final packet traces every criterion to a source or supplied dataset, compares no action and at least two alternatives, identifies uncertainty and distributional effects, and states what evidence would change the recommendation.",
		boundaryCheck:
			"A polished pitch cannot replace the evidence packet, one total score cannot hide value choices, and the assignment permits neutral analysis or a reversible pilot instead of personal advocacy.",
		referenceLink: ENVIRONMENTAL_REFERENCES.ngssEarthHumanActivity,
		materialSection: "environmental-design-decision-matrix",
		answerSection: "capstone-decision-and-monitoring-rubric"
	}
};

const INTRO_ENVIRONMENTAL_ADDITIONS: Record<string, RawCourseModuleItem[]> = {
	"ES1 Ecosystems": [
		{
			title: "Ecosystem Boundary, Baseline, and Comparison Gate",
			content: [
				"**System boundary:** Define the core-biome case by place, time span, living components, physical components, and interactions included. A biome reference supplies a broad pattern; the learner's ecosystem model is a smaller analytical boundary and must say what lies outside it.",
				"**Baseline:** Record the comparison condition before interpreting change. A baseline may be an earlier period, an undisturbed supplied case, or another biome measured with the same variables. Natural variability, seasonal differences, and changed methods remain visible rather than being treated as noise to erase.",
				"**Evidence chain:** Separate sourced observation, model-based inference, mechanism, causal claim, and value judgment. Organism presence can support a habitat claim, but it does not by itself identify climate, ecosystem health, or why abundance changed.",
				"**Mastery check:** Complete the supplied core-biome table, name one excluded process, compare one variable using the same unit and time span, and revise one statement that overreaches beyond the evidence."
			].join("\n\n"),
			datasetLink: environmentalMaterial("core-biome-comparison-table"),
			solutionLink: environmentalAnswerKey(
				"ecosystem-and-succession-key"
			),
			learningPath: "core"
		},
		{
			title: "Disturbance, Succession, and Causal Evidence Gate",
			content: [
				"**Process distinctions:** A disturbance is an event or sustained pressure. Resistance describes limited change during the disturbance; recovery describes movement after it; succession describes community change through time; reorganization or regime shift may produce a different state rather than a return to the exact baseline.",
				"**Causal routine:** Build a timeline with candidate cause, timing, affected variable, mechanism, response, and alternative explanation. Temporal order is necessary for many causal claims but is not sufficient; rainfall, season, measurement effort, prior land use, and interacting disturbances can confound a simple story.",
				"**Value boundary:** Fire, flooding, predation, and species turnover are not automatically unnatural or harmful. The judgment depends on baseline, frequency, intensity, affected organisms and people, historical context, and the question being asked.",
				"**Mastery check:** Compare two recovery pathways, identify evidence that distinguishes them, and state what observation would weaken the preferred explanation."
			].join("\n\n"),
			datasetLink: environmentalMaterial("core-biome-comparison-table"),
			solutionLink: environmentalAnswerKey(
				"ecosystem-and-succession-key"
			),
			learningPath: "core"
		}
	],
	"ES2 Flora and Decomposers": [
		{
			title: "Energy Flow, Nutrient Cycling, and Decomposition Gate",
			content: [
				"**Energy pathway:** Producers transform incoming light or chemical energy into organic matter, consumers obtain chemical energy through feeding, and organisms transfer some energy while much disperses as heat. Energy therefore flows through the modeled system rather than cycling back unchanged.",
				"**Matter pathway:** Carbon, nitrogen, water, and mineral nutrients move among organisms, soil, water, air, and sediments. Decomposers transform dead material and waste, returning matter to reservoirs where producers and other processes can use it again; decomposers do not recycle heat into food-web energy.",
				"**Arrow contract:** State whether each arrow means energy transfer, matter transfer, feeding, or influence. Use labels, line styles, and a text equivalent so color is never the only distinction. Mark unsupported species links as hypotheses.",
				"**Mastery check:** Build one food web with six organisms, one detrital path, one nonliving reservoir, and separate energy and nutrient annotations, then correct the claim that decomposers return energy to producers."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"food-web-and-biodiversity-cases"
			),
			solutionLink: environmentalAnswerKey(
				"food-web-and-biodiversity-key"
			),
			learningPath: "core"
		},
		{
			title: "Biodiversity, Sampling, and Population Evidence Gate",
			content: [
				"**Measurement distinction:** Species richness, evenness, abundance, occupancy, biomass, and observation count answer different questions. A field guide or food web can show plausible membership, but it cannot establish a complete biodiversity inventory without a defined sampling method.",
				"**Effort and detectability:** Compare observations only after recording survey hours, area, season, method, and visibility. Nocturnal, cryptic, migratory, or rare organisms can be undercounted, and a lower raw count can reflect reduced effort rather than a smaller population.",
				"**Population boundary:** A population trend needs repeated comparable observations and uncertainty. Carrying capacity changes with resources, competition, predation, disturbance, climate, and scale; it is a model, not one permanent number assigned to a species.",
				"**Mastery check:** Normalize the supplied predator observations by survey hour, compare the raw and adjusted trend, and name two additional measurements needed before claiming a biodiversity decline."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"food-web-and-biodiversity-cases"
			),
			solutionLink: environmentalAnswerKey(
				"food-web-and-biodiversity-key"
			),
			learningPath: "core"
		}
	],
	"ES3 Fauna": [
		{
			title: "Population, Carrying Capacity, and Detectability Gate",
			content: [
				"**Population model:** Define species, place, time span, and measure before interpreting common or rare. Population size, density, occupancy, encounter rate, and perceived rarity are related but not interchangeable, and each requires a denominator or sampling frame.",
				"**Mechanism:** Food, water, shelter, space, reproduction, predation, competition, disease, disturbance, movement, and human activity can alter a population. Carrying capacity represents a changing system relation, not a fixed maximum that can be read from one sighting table.",
				"**Observation boundary:** A safari guide can estimate observation likelihood only when method, season, effort, habitat access, and detectability are considered. Endangered, rare, hidden, and hard to sample are different claims.",
				"**Mastery check:** Convert the supplied observation counts to rates, propose two competing explanations for one change, and identify a survey design that could distinguish them."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"food-web-and-biodiversity-cases"
			),
			solutionLink: environmentalAnswerKey(
				"food-web-and-biodiversity-key"
			),
			learningPath: "core"
		},
		{
			title: "Fictional Food-System Lifecycle and Privacy Gate",
			content: [
				"**Supplied-case rule:** Every Food Journal or Diet Plan artifact uses only the fictional food-system table. Learners do not disclose meals, allergies, medical conditions, household purchases, cultural practices, food access, body data, or goals.",
				"**Fair comparison:** Select one functional unit and indicator, then include production, processing, transport, storage, preparation, and waste only when evidence is available. Hold the boundary consistent across cases and label qualitative assumptions separately from measured values.",
				"**Claim boundary:** A lower value for land, water, transport, or one energy indicator does not establish total environmental superiority. It also cannot establish nutrition, health, affordability, cultural suitability, access, or a recommendation for an individual.",
				"**Mastery check:** Compare two supplied scenarios, identify one lifecycle tradeoff and two missing data fields, then rewrite one universal claim as a conditional environmental statement."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"fictional-food-system-energy-table"
			),
			solutionLink: environmentalAnswerKey("food-system-comparison-key"),
			learningPath: "core"
		}
	],
	"ES4 Weather and Climate": [
		{
			title: "Weather, Climate, Trend, and Attribution Ladder",
			content: [
				"**Claim ladder:** First establish that an event occurred. Evaluate whether its frequency or intensity differs from a historical baseline, whether a broader climate trend changes its likelihood, which forcing contributes to that trend, what impacts follow, and which response is preferred. Each rung needs different evidence.",
				"**Scale discipline:** Weather describes conditions over short times and specific places; climate describes distributions and patterns over longer periods and regions. A station series needs consistent units, a declared baseline, quality control, coverage notes, and attention to station or method changes.",
				"**Attribution discipline:** Trend detection does not identify cause. Attribution combines physical mechanisms, observations, models, and comparison of possible causes. A supported attribution claim still does not determine one policy because feasibility, tradeoffs, values, and distribution require additional analysis.",
				"**Mastery check:** Place six supplied statements on the claim ladder, match each to the evidence it requires, and reject one inference that skips a rung."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"weather-climate-and-attribution-data"
			),
			solutionLink: environmentalAnswerKey(
				"weather-climate-and-attribution-key"
			),
			learningPath: "core"
		},
		{
			title: "Climate Evidence, Uncertainty, and False-Balance Gate",
			content: [
				"**Evidence synthesis:** Use the supplied station series for data practice and NASA's evidence page for the broader evidence base. Distinguish measurement uncertainty, incomplete coverage, natural variability, model uncertainty, scenario uncertainty, and disagreement about values or responses.",
				"**Communication standard:** A respectful response does not imply that every claim has two equally evidence-supported sides. Represent credible uncertainty and live scientific questions accurately while rejecting anecdotal claims that ignore scale, baseline, or established physical evidence.",
				"**Precision:** Use increases in this supplied series, is consistent with, contributes to, changes likelihood, or remains uncertain instead of proves everything, causes every event, or scientists are completely certain. Cite the exact source used for the exact claim.",
				"**Mastery check:** Revise a weather anecdote, an overconfident attribution claim, and a false-balance prompt; then state what evidence would justify each stronger version."
			].join("\n\n"),
			datasetLink: ENVIRONMENTAL_REFERENCES.nasaClimateEvidence,
			solutionLink: environmentalAnswerKey(
				"weather-climate-and-attribution-key"
			),
			learningPath: "core"
		}
	],
	"ES5 Geology and Oceanography": [
		{
			title: "Watershed, Soil, Ocean, and Carbon Systems Gate",
			content: [
				"**Connected system:** Watersheds move water and material from atmosphere, land, soil, groundwater, organisms, and infrastructure toward an outlet. Soil stores water, carbon, nutrients, and organisms; sediment can move downstream; oceans exchange heat and carbon with the atmosphere.",
				"**Reservoir and flux:** Label where matter is stored, how it moves, the direction, unit, and time scale. Concentration, stock, and rate are different quantities. A downstream sample integrates many upstream processes, so proximity or map overlap does not identify one source.",
				"**Ocean chemistry:** Carbon-dioxide uptake changes carbonate chemistry and can lower ocean pH. More acidic means a decrease in pH and does not require the water to fall below pH seven. Runoff, respiration, mixing, temperature, and season can also affect coastal measurements.",
				"**Mastery check:** Trace one water-and-carbon pathway from land to ocean, identify two confounders in the supplied watershed case, and correct one pH or reservoir misconception."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"soil-ocean-and-carbon-system-table"
			),
			projectLink: ENVIRONMENTAL_REFERENCES.noaaOceanAcidification,
			solutionLink: environmentalAnswerKey("water-and-ocean-systems-key"),
			learningPath: "core"
		},
		{
			title: "Energy Lifecycle and Functional-Unit Gate",
			content: [
				"**Comparison contract:** Define a service such as one megawatt-hour delivered to a specified region, then compare alternatives over consistent construction, fuel or resource supply, operation, transmission, storage or balancing, maintenance, land, material, and end-of-life boundaries.",
				"**Impact categories:** Greenhouse-gas emissions, air pollution, water use, habitat change, materials, waste, reliability, timing, cost, and distribution are separate criteria. One option may perform better on one criterion and worse on another; a qualitative table cannot support a universal ranking.",
				"**Terminology:** Electricity is an energy carrier. Renewable describes replenishment rate, low-carbon describes one emissions dimension, and neither word means impact-free. Fossil and renewable projects are both location- and infrastructure-dependent.",
				"**Mastery check:** Compare two options with the same functional unit, identify three lifecycle stages and one balancing assumption, and write a conditional recommendation with a missing-data list."
			].join("\n\n"),
			datasetLink: environmentalMaterial("energy-lifecycle-comparison"),
			projectLink: ENVIRONMENTAL_REFERENCES.eiaEnergyEnvironment,
			solutionLink: environmentalAnswerKey("energy-lifecycle-key"),
			learningPath: "core"
		}
	],
	"ES6 Humans and the Environment": [
		{
			title: "Pollution Release, Exposure, Dose, and Risk Gate",
			content: [
				"**Claim sequence:** A reported release describes material reported by a covered facility. Environmental concentration concerns what is measured or modeled in air, water, or soil. Exposure concerns contact, dose concerns amount reaching a receptor, risk combines hazard and exposure, and an observed health outcome needs still different evidence.",
				"**Data limitations:** Reporting thresholds, covered sectors, chemical lists, boundary changes, transport, transformation, traffic, background sources, monitoring locations, and weather can alter interpretation. TRI data are valuable for questions and comparisons but do not provide an automatic neighborhood health score.",
				"**Causal boundary:** A map can reveal overlap and guide investigation. It cannot prove a facility caused an individual's condition, and a lower reported release cannot guarantee a lower exposure indicator.",
				"**Mastery check:** Classify ten supplied statements by claim type, explain why Zones A and B answer different questions, and list the measurements needed before making a risk claim."
			].join("\n\n"),
			datasetLink: ENVIRONMENTAL_REFERENCES.epaTri,
			solutionLink: environmentalAnswerKey(
				"pollution-and-distribution-key"
			),
			learningPath: "core"
		},
		{
			title: "Distribution, Environmental Justice, and Intervention Monitoring Gate",
			content: [
				"**Distributional review:** Compare who receives environmental benefits, who bears pollution or infrastructure burdens, whose conditions are represented, and whose data or priorities are missing. Population counts, green-space indices, facility reports, and modeled indicators remain separate fields.",
				"**Privacy and fairness:** Use only supplied aggregated cases or authoritative public layers. Do not collect learner addresses, identities, health information, household income, race or ethnicity, immigration status, or political beliefs. Avoid inferring individual characteristics from a neighborhood average.",
				"**Intervention test:** Define the mechanism, implementation owner, timeline, leading indicator, environmental outcome indicator, adverse-effect indicator, and distributional indicator. Include displacement, rebound, access, and maintenance as possible unintended effects.",
				"**Mastery check:** Compare two interventions for the fictional corridor, identify different beneficiaries and burdens, and specify a review date plus one condition that would trigger adaptation or rollback."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"pollution-and-distribution-case"
			),
			projectLink: ENVIRONMENTAL_REFERENCES.epaEnviroAtlas,
			solutionLink: environmentalAnswerKey(
				"pollution-and-distribution-key"
			),
			learningPath: "core"
		}
	],
	"ES7 Earth's Past, Present, and Future": [
		{
			title: "Past, Present, Future Evidence and Scenario Gate",
			content: [
				"**Evidence types:** Deep-time reconstruction can use fossils, sediments, rocks, and proxy records; historical change can use maps, imagery, records, and oral histories; present condition needs dated methods; trends need comparable repeated observations; projections need models and assumptions.",
				"**Scenario rule:** Build at least two plausible futures from the same baseline. Record which differences come from physical drivers, human decisions, model assumptions, and values. A scenario is conditional and explores consequences; it is not one certain forecast.",
				"**Preference boundary:** A preferred future combines evidence with priorities and distributional judgments. State those criteria openly instead of presenting a preference as a measured fact. Keep no-action and status-quo trajectories available for comparison.",
				"**Mastery check:** Label every statement in one timeline by evidence type, create two futures with shared indicators, and identify one observation that would update each scenario."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"past-present-future-scenario-table"
			),
			solutionLink: environmentalAnswerKey("scenario-modeling-key"),
			learningPath: "core"
		},
		{
			title: "Local Observation Privacy and Accessible Alternatives Gate",
			content: [
				"**Choice of case:** A learner may use the supplied fictional local environment, a generalized public place, an identifying-detail-free memory sketch, or a supplied image. Outdoor travel, photography, geolocation, and disclosure of a home or school area are never required.",
				"**Privacy:** Exclude exact addresses, routes, schedules, faces, license plates, private property details, household routines, and embedded location metadata. A generalized land-cover or ecosystem description is enough for every comparison and assessment.",
				"**Accessibility:** Every visual has a text-equivalent route using the scenario table, labeled descriptions, or a structured list. Color, audio, movement, outdoor access, camera access, and map interaction are never the only way to identify evidence.",
				"**Mastery check:** Audit one tour artifact for identifying details and inaccessible cues, replace them with generalized evidence, and verify that another learner could interpret the comparison from text alone."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"past-present-future-scenario-table"
			),
			solutionLink: environmentalAnswerKey("scenario-modeling-key"),
			learningPath: "core"
		}
	],
	"ES8 Environmental Design Capstone": [
		{
			title: "Baseline, Alternatives, and Decision-Matrix Gate",
			content: [
				"**Problem definition:** State the place or supplied case, time horizon, system boundary, baseline condition, affected organisms or groups, measured indicator, and evidence that establishes the problem. Avoid solving a vague label such as pollution or climate change without a tractable decision.",
				"**Alternatives:** Compare no action and at least two materially different responses. Use the same ecological, emissions or pollution, water, land, materials, cost, feasibility, distribution, uncertainty, and reversibility criteria across every alternative.",
				"**Decision rule:** Make weights, thresholds, vetoes, and value judgments visible. Do not hide incomparable evidence inside one unexplained total. Identify missing evidence and test whether a different reasonable weighting changes the recommendation.",
				"**Mastery check:** Complete the supplied matrix, perform one sensitivity check, name a harmed or underrepresented group or habitat, and state what evidence would reverse the choice."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"environmental-design-decision-matrix"
			),
			solutionLink: environmentalAnswerKey(
				"capstone-decision-and-monitoring-rubric"
			),
			learningPath: "core"
		},
		{
			title: "Implementation, Monitoring, Adaptation, and Rollback Gate",
			content: [
				"**Implementation plan:** Assign an owner, resources, sequence, permissions, timeline, maintenance responsibility, and communication method. A proposal that names only a desired outcome is not yet an implementable design.",
				"**Monitoring plan:** Define a leading indicator for implementation, an outcome indicator for the environmental objective, an adverse-effect indicator, and a distributional indicator. Give each a baseline, unit, measurement method, review date, and responsible reviewer.",
				"**Adaptive decision:** State what result triggers continuation, modification, expansion, pause, or rollback. Include rebound effects, burden shifting, delayed outcomes, missing participation, and changing external conditions as reasons the first design may need revision.",
				"**Mastery check:** Run a pre-mortem, test one failure scenario, revise the proposal, and preserve a before-and-after record showing how evidence and feedback changed the implementation plan."
			].join("\n\n"),
			datasetLink: environmentalMaterial(
				"environmental-design-decision-matrix"
			),
			solutionLink: environmentalAnswerKey(
				"capstone-decision-and-monitoring-rubric"
			),
			learningPath: "core"
		}
	]
};

const INTRO_ENVIRONMENTAL_PROJECT_COMPLETION: Record<string, string> = {
	"Project: Biome Travel Guide":
		"Add the system boundary, source date, climate baseline, two biotic and two abiotic factors, and a text equivalent for every visual. Compare the core biome with one alternative using the same variables, then identify one local condition that the broad biome reference cannot establish.",
	"Project: Ecological Disturbance Timeline":
		"Separate event, pressure, ecosystem response, recovery, succession, and possible reorganization. Include a comparison baseline, time scale, competing explanation, and one observation that would weaken the proposed causal pathway.",
	"Project: Ecosystem Reporter":
		"Build a source log with date, scale, observed change, proposed mechanism, affected organisms or resources, uncertainty, and follow-up evidence. Distinguish the occurrence of an event from claims about cause, damage, recovery, and future risk.",
	"Project: Foundation of the Food Web":
		"Declare the arrow convention, trace the original energy source, and add a nonliving nutrient reservoir plus one decomposer path. Mark uncertain species links and explain why energy dispersal and nutrient cycling cannot share one unlabeled arrow.",
	"Project: Top Dog and Decomposer Web":
		"Include at least two feeding alternatives, detrital links from more than one trophic level, and a changed-producer prediction. Add a text route through the web and correct any statement that decomposers recycle energy.",
	"Project: Ecosystem Reporter Part 2":
		"Compare the same web before and after the disturbance, preserve the sampling method, and show direct and indirect effects separately. Include one alternative pathway and one measurement needed before claiming a population or biodiversity decline.",
	"Project: Food Journal":
		"Use only the supplied fictional components. Define a functional unit, trace producer and consumer relationships, label included lifecycle stages, compare one environmental indicator, and identify missing production, transport, storage, waste, or access evidence.",
	"Project: Biome Safari":
		"Give every observation estimate a season, habitat, survey method, effort denominator, and detectability note. Distinguish abundance, encounter rate, rarity, migration, and conservation status, then explain what evidence a real population estimate would require.",
	"Project: Diet Plan":
		"Treat the legacy title as a fictional scenario redesign, not a recommendation. Hold the functional unit and system boundary constant, report one environmental benefit and tradeoff, preserve missing data, and explicitly exclude nutrition, health, affordability, and cultural-fit conclusions.",
	"Project: Where Is the Water?":
		"Define the watershed or biome boundary and trace water through atmosphere, surface water, soil, groundwater, organisms, and infrastructure. Add direction, storage, time scale, one human alteration, and a text equivalent for the diagram.",
	"Project: Travel Guide Weather Addendum":
		"Use a dated weather observation only for the short visit and a multi-year or seasonal climate source for the long stay. State the baseline, spatial scale, uncertainty, and why neither one event nor one average describes every condition.",
	"Project: Climate Change Debate Response":
		"Use the title only as an evidence-correction task. Place each statement on the event-trend-attribution-impact-response ladder, cite NASA evidence for the exact claim, represent uncertainty precisely, and reject false balance between supported evidence and an anecdote.",
	"Project: Soil Photographer":
		"Use the supplied soil-carbon table or an identifying-detail-free image. Label water storage, roots, organisms, erosion or sediment movement, carbon or nutrient role, and one omitted subsurface process; provide a complete text description.",
	"Project: Fossil Timeline":
		"Use separate time scales and conditions for fossil preservation, fossil-fuel formation, and modern extraction or combustion. Track matter rather than implying that time creates energy, and identify which evidence supports reconstruction versus resource use.",
	"Project: Fossil Fuel Alternative":
		"Compare one service with a shared functional unit and lifecycle boundary. Include construction, operation, fuel or resource supply, transmission, storage or balancing, land, materials, waste, reliability, distribution, and a location-specific missing-data list.",
	"Project: Life on Mars":
		"Define the colony boundary and trace matter, energy, information, waste, and maintenance through at least six systems. Match each to an Earth ecosystem service, identify failure dependencies, and state which services the simplified model leaves out.",
	"Project: Daily Schedule Impact Map":
		"Use a supplied or invented routine only. Separate direct and upstream impacts, individual and infrastructure decisions, evidence and assumptions, and avoid household disclosure; add one system-level alternative plus a measurable outcome and adverse-effect indicator.",
	"Project: Reverse Ecological Disturbance Report":
		"Establish the problem baseline and comparison before claiming improvement. Name the intervention mechanism, implementation owner, represented and missing groups, evidence of change, competing explanation, maintenance need, and one adaptation or rollback trigger.",
	"Project: Tour of Your Biome":
		"Use a supplied, fictionalized, or generalized place with no exact address, route, face, or embedded location data. Compare it with the core biome using the same variables, label observations and inferences, and include a text-only route through every visual.",
	"Project: Your Biome in the Past":
		"Label every detail as documented, inferred, assumed, or speculative. Use evidence appropriate to deep time or historical time, identify preservation or record gaps, compare with the present baseline, and state what finding would revise the reconstruction.",
	"Project: Your Biome in the Future":
		"Build at least two conditional futures from the same present baseline. Separate physical drivers, human decisions, values, and model assumptions; use shared indicators and identify which observation would update each scenario.",
	"Project: Transform Our Environment Proposal":
		"Define a narrow baseline problem, then compare no action and two alternatives in the supplied decision matrix. Make weights visible, examine distribution and uncertainty, perform a sensitivity check, and include owner, timeline, monitoring, adaptation, and rollback.",
	"Project: Environmental Action Pitch":
		"Present a neutral evidence briefing rather than requiring personal advocacy. Show the baseline, alternatives, decision rule, uncertainty, benefits and burdens, and propose a bounded next step such as review, missing-data collection, or a reversible pilot.",
	"Project: Final Reflection Map":
		"Trace five concrete revisions from early artifacts to the final model, cite the evidence that prompted each change, and distinguish scientific findings from preferences. Add one unresolved question, one model boundary, and one next-course pathway."
};

function introEnvironmentalProjectPath(title: string) {
	return /reporter|debate|fossil fuel|reverse|in the past|in the future|proposal|pitch|reflection/i.test(
		title
	)
		? ("challenge" as const)
		: ("choice" as const);
}

function preserveEnvironmentalTeaching(
	item: RawCourseModuleItem,
	contentKind: "reading" | "assignment",
	flow: IntroEnvironmentalFlow
): RawCourseModuleItem {
	const input = item.datasetLink?.startsWith("/course-assets/")
		? item.datasetLink
		: environmentalMaterial(flow.materialSection);
	const response =
		item.solutionLink ?? environmentalAnswerKey(flow.answerSection);
	const content = item.content
		.replace(/\*\*Project goal:\*\*/g, "**Project:**")
		.replace(/\*\*Completion check:\*\*/g, "**Review:**")
		.replace(/\*\*Mastery check:\*\*/g, "**Check:**")
		.replace(
			/\*\*Vocabulary:\*\*/g,
			contentKind === "assignment"
				? "**Working terms:**"
				: "**Vocabulary:**"
		);
	const resource = (asset: string) =>
		`/course-resource?asset=${encodeURIComponent(asset)}`;
	return {
		...item,
		contentKind,
		preserveInstructions: true,
		preserveAssignment: true,
		content: `${content}\n\n[Case inputs](${resource(input)})\n\n[Project self-check](${resource(response)})`
	};
}

export const introToEnvironmentalScienceCourse: RawCourse = {
	...introToEnvironmentalScienceSourceCourse,
	modules: introToEnvironmentalScienceSourceCourse.modules.map(module => {
		const flow = INTRO_ENVIRONMENTAL_FLOW[module.title];
		const curriculum = module.curriculum.map((item, index) => {
			return {
				...item,
				content: [
					index === 0 ? `**Course flow:** ${flow.flowNote}` : "",
					item.content,
					`**Module evidence gate:** ${flow.evidenceGate}`,
					`**System and claim boundary:** ${flow.boundaryCheck}`,
					`**Authoritative reference:** [Open the module reference](${flow.referenceLink}).`
				]
					.filter(Boolean)
					.join("\n\n"),
				datasetLink:
					item.datasetLink ??
					(index === 0
						? flow.referenceLink
						: environmentalMaterial(flow.materialSection)),
				learningPath: "core" as const
			};
		});
		const additions = INTRO_ENVIRONMENTAL_ADDITIONS[module.title].map(
			item => ({
				...item,
				projectLink: item.projectLink ?? flow.referenceLink
			})
		);
		const supplementalProjects = module.supplementalProjects.map(item => ({
			...item,
			content: [
				item.content,
				`**Completion and extension gate:** ${INTRO_ENVIRONMENTAL_PROJECT_COMPLETION[item.title]}`,
				`**Evidence and privacy boundary:** ${flow.boundaryCheck}`
			].join("\n\n"),
			datasetLink:
				item.datasetLink ?? environmentalMaterial(flow.materialSection),
			solutionLink:
				item.solutionLink ?? environmentalAnswerKey(flow.answerSection),
			learningPath: introEnvironmentalProjectPath(item.title)
		}));

		return {
			...module,
			estimatedTime: flow.estimatedTime,
			keyBlocks: flow.keyBlocks,
			curriculum: [
				...curriculum.map(item =>
					preserveEnvironmentalTeaching(
						item,
						item.title === "Core Biome Research Log"
							? "assignment"
							: "reading",
						flow
					)
				),
				...additions.map(item =>
					preserveEnvironmentalTeaching(item, "assignment", flow)
				)
			],
			supplementalProjects: supplementalProjects.map(item =>
				preserveEnvironmentalTeaching(item, "assignment", flow)
			)
		};
	}),
	developmentMetadata: {
		...introToEnvironmentalScienceSourceCourse.developmentMetadata!,
		standards: [
			"NGSS HS-ESS3 Earth and human activity",
			"NGSS ecosystems, matter, energy, and biodiversity",
			"Earth systems, watersheds, oceans, and carbon cycling",
			"Weather, climate, trend, and attribution evidence",
			"Systems, lifecycle, and distributional analysis",
			"Claim-evidence-reasoning with uncertainty and alternatives"
		],
		sourcePolicy:
			"Preserves the ES1-ES8 recurring core-biome sequence and all 24 distinctive projects while adding authoritative NASA, NOAA, USGS, EPA, EIA, and NGSS references; supplied equipment-free datasets and answer rubrics; accessible alternatives; and explicit causal, climate, food-data, location-privacy, health-claim, and advocacy boundaries.",
		assessmentCadence: [
			"One bounded system model or comparable-data analysis per module",
			"One causal, trend, attribution, lifecycle, or distributional claim check per module",
			"One changed-condition prediction, alternative explanation, and uncertainty note per module",
			"Recurring core-biome portfolio with traceable revisions",
			"Capstone decision matrix, implementation plan, monitoring indicators, and defense"
		],
		toolchain: [
			"Notebook or digital document",
			"Supplied environmental-science materials pack and answer rubric",
			"Accessible diagrams, tables, maps, and text alternatives",
			"Authoritative NASA, NOAA, USGS, EPA, EIA, and NGSS references",
			"Optional public map layers with supplied noninteractive alternatives"
		],
		safetyPolicy: [
			"No required outdoor collection, travel, photography, household experiment, or purchase",
			"No personal diet, health, body, demographic, political-belief, address, route, or household-routine disclosure",
			"No nutrition, medical, individual-risk, or personal political-advocacy requirement",
			"Fictional cases and supplied evidence remain sufficient for every assessment",
			"Visual, map, color, audio, and interactive tasks always have text or table alternatives"
		],
		courseBoundaries: [
			"Introductory environmental systems and evidence literacy rather than professional impact assessment",
			"Release, concentration, exposure, dose, risk, and health outcome remain distinct",
			"Weather, trend, attribution, impact, and response preference remain distinct",
			"Food-system comparisons never become personal diet or health recommendations",
			"Scenarios and proposals preserve uncertainty, distributional effects, and value judgments"
		],
		capstoneExpectations: [
			"Narrow problem, system boundary, baseline, and no-action comparison",
			"At least two materially different alternatives and visible decision criteria",
			"Traceable evidence, causal mechanism, uncertainty, and distributional review",
			"Implementation owner, timeline, maintenance, and communication plan",
			"Leading, outcome, adverse-effect, and distributional indicators",
			"Adaptation or rollback trigger plus before-and-after revision defense"
		],
		recommendedNextWork: [
			"Add anonymized exemplar biome portfolios and capstone decisions at multiple proficiency levels using the common evidence rubric.",
			"Cross-link Intro to Biology, Earth Science, chemistry, data-science, and energy pathways when those transitions have dedicated readiness maps."
		]
	}
};
