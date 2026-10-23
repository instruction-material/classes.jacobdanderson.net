import type { RawCourse, RawCourseModuleItem } from "./types";
import { contextualizePhysicsCourse } from "./physicsContentContext";

const introToPhysicsSourceCourse: RawCourse = contextualizePhysicsCourse({
	name: "Intro to Physics",
	modules: [
		{
			title: "PHY1 Measurement, Uncertainty, and Scientific Modeling",
			curriculum: [
				{
					title: "Introductions and Setup",
					content:
						"The opening workflow is intentionally lightweight and remote-friendly. Browser tools such as PhET, Desmos, spreadsheets, public videos, and provided datasets carry most of the course, while VS Code or PyCharm can be added later only when Python modeling is useful. A single physics folder for notes, exported graphs, annotated screenshots, and short simulation writeups keeps evidence organized without requiring hardware kits, physical sensors, special lab supplies, or a large software setup."
				},
				{
					title: "Measurement, Units, and Significant Figures",
					content:
						"Physics is the practice of building models from measurements, not just memorizing formulas. SI units, prefixes, unit conversions, significant figures, and the difference between precision and accuracy create the measurement foundation. Uncertainty is part of honest scientific communication: every distance, time, and mass measurement has a useful range, not a magical exact value."
				},
				{
					title: "Worked Example Set: Estimation and Uncertainty",
					content:
						"Short examples convert units, compare measured values, and round answers to appropriate precision. Include one estimate-first problem, such as predicting walking speed from a provided hallway dataset or short motion clip, so the value of a rough model is concrete without requiring a live experiment. Connect the examples to engineering habits: track assumptions, record units every line, and explain where the largest uncertainty comes from."
				},
				{
					title: "Graph and Data Exercise: Walking Trial Table",
					content:
						"Provided position-versus-time data from walking at different speeds is the default evidence source. Optional safe observations can be added if they are simple and appropriate, but the assignment works fully from the shared table. Build a data table, choose axes carefully, graph the results, and interpret the slope as speed. This is the first full data-analysis strand: table to graph, graph to meaning, and meaning back to the original motion."
				},
				{
					title: "Remote Investigation: Reaction-Time Data",
					content:
						"Use a provided ruler-drop dataset, simulation, or short demonstration video to connect measurement with uncertainty and repeated trials. Predict how reaction time is inferred from distance fallen, compute an average across several trials, and discuss why repeated measurements matter more than one lucky attempt. The key work is the reasoning chain from distance to time, not physically dropping an object. Close by identifying controllable variables, uncontrolled factors, and sources of experimental error."
				},
				{
					title: "Reflection Question: What Makes Evidence Trustworthy?",
					content:
						"Explain when a small dataset is still useful, when more trials are needed, and how a graph can strengthen or weaken an argument. Include a short reflection that distinguishes between a bad experiment, a noisy experiment, and a careful experiment with honest uncertainty."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: convert units without losing meaning, label graphs with quantities and units, and explain why the same measured value can be both precise and inaccurate. Prompt: 'If two groups got slightly different walking speeds, does that automatically mean one group is wrong?'"
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating a graph as a picture of the path rather than a relationship between variables, assuming more decimal places always mean better science, and treating uncertainty as failed experimentation."
				},
				{
					title: "Extension Project: Measurement Scavenger Hunt",
					content:
						"Choose ten everyday objects, images, diagrams, or motion scenarios and decide which quantities could be measured directly and which would need to be calculated. Record the likely tool or data source, the likely uncertainty, and one reason each measurement might be difficult. Physical measuring is optional; screenshots, public images, class diagrams, and provided data are acceptable evidence sources when they make the measurement reasoning visible."
				}
			]
		},
		{
			title: "PHY2 Motion Graphs and Kinematics",
			curriculum: [
				{
					title: "Position, Velocity, and Acceleration",
					content:
						"Treat kinematics as the language of motion and make motion graphs a full strand rather than a quick side topic. Differentiate distance from displacement, speed from velocity, and velocity from acceleration, and use multiple examples where direction changes the interpretation. Connect verbal descriptions, diagrams, graphs, and equations as four views of the same physical story."
				},
				{
					title: "Worked Example Set: Reading Motion Stories",
					content:
						"Short scenarios such as a track sprinter, a marathon runner, and a tossed ball support translation between a story and a position-time or velocity-time graph. Include objects speeding up, slowing down, stopping, reversing direction, or moving at constant velocity. Slope and area reasoning matter more than formula memorization alone."
				},
				{
					title: "Graph and Data Exercise: Motion Graph Detective",
					content:
						"Several provided graphs support reconstructing what the object was doing during each interval. Then reverse the task: use a written story to sketch a graph that matches it. Include one graph with a common trap, such as a flat line on a position graph, and explain why it means 'stopped' rather than 'at zero speed forever.' The exercise works from shared graphs, diagrams, or simulations, so no live motion capture is required."
				},
				{
					title: "Remote Investigation: Motion Analysis",
					content:
						"Use a provided video clip, simulation export, or sample frame-by-frame table to analyze a rolling cart, bouncing ball, or walking person. Optional phone-camera data can be substituted when safe and convenient, but the required work is table-building, interval velocity estimation, and comparison between the graph and the original motion. The investigation bridges intuition and mathematics by showing that graphs come from measured or modeled evidence, not just textbook drawings."
				},
				{
					title: "Simulation Challenge: Bouncy Ball Toss and Air Traffic Control",
					content:
						"Use one qualitative toss scenario and one wind-plus-plane scenario to compare one-dimensional motion with combined motion. Predict outcomes first, then test them with simulation, diagramming, or provided data, and explain which part of the motion changes because of the extra velocity contribution."
				},
				{
					title: "Reflection Question: Which Representation Helped Most?",
					content:
						"Explain whether a diagram, graph, table, or equation was most helpful for one motion problem and why. Name one place where the conclusion changed after converting the same motion into a different representation."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: move fluently between story, graph, and equation without being coached toward a specific formula. Prompt: explain the sign of velocity and acceleration in words, not just symbols."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating the steepest graph point as the object's highest physical position, interpreting a time-axis crossing as the object disappearing, and confusing negative velocity with negative speed."
				},
				{
					title: "Extension Project: Track Star vs. Marathon Runner",
					content:
						"Compare two runners with different strategies by building distance-time and velocity-time graphs for each. Defend which runner is more efficient for a sprint versus an endurance event, and use graph evidence rather than only intuition."
				}
			]
		},
		{
			title: "PHY3 Forces, Free-Body Diagrams, and Newton's Laws",
			curriculum: [
				{
					title: "Forces as Interactions",
					content:
						"Force is an interaction between objects rather than a vague push that automatically causes motion. Newton's laws depend on repeated free-body diagram practice, especially balanced versus unbalanced situations. Weight, normal force, tension, applied force, and friction remain distinct so later engineering problems stay organized."
				},
				{
					title: "Worked Example Set: Free-Body Diagram Repetition",
					content:
						"Work through a hanging object, a crate on a floor, an elevator rider, and a tug-of-war setup using diagrams or provided scenario cards. For each example, isolate one object at a time, label every external force, and connect the net force to the motion. Build repetition on purpose so the diagramming habit feels routine before the math gets harder."
				},
				{
					title: "Graph and Data Exercise: Net Force and Acceleration",
					content:
						"Use a small data table or simulation output showing how acceleration changes as net force changes for the same mass. Graph acceleration versus net force and interpret the trend in plain language. Then repeat with a larger mass so the slope comparison reveals what inertia changes."
				},
				{
					title: "Remote Investigation: Structure Force Analysis",
					content:
						"Use a provided bridge/tower diagram, photo set, simulation, or simple paper-design sketch to analyze compression, tension, and likely failure points. Physical construction is optional; the required artifact is a labeled model that explains why one design handles forces better than another. Sketches and force arrows connect structure to evidence rather than treating the challenge as trial and error. This is the module's main engineering tie-in."
				},
				{
					title: "Simulation Challenge: Runaway Train and Elevator Forces",
					content:
						"Analyze a runaway-train stopping scenario qualitatively, then revisit the elevator problem with scale readings and apparent weight. Use both scenarios to reinforce that the same Newtonian ideas explain very different systems when the forces are identified clearly."
				},
				{
					title: "Reflection Question: When Does 'No Motion' Still Mean Forces Matter?",
					content:
						"Explain why a motionless object can still be a rich force-analysis problem. Include an answer that mentions balanced forces, not the incorrect claim that 'there are no forces because nothing is moving.'"
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Use quick diagram checks that start from a single sentence prompt and produce a complete free-body diagram. Justify each force direction before any calculations happen."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include drawing a nonexistent 'force of motion,' confusing Newton's third-law pairs with forces acting on the same object, and treating mass and weight as interchangeable."
				},
				{
					title: "Extension Project: Test of Strength",
					content:
						"Analyze a static-equilibrium scenario from a diagram, photo, simulation, or safe optional observation. Identify the forces and explain why an object can feel heavy even when it is not accelerating. The project compares sensation, force, and motion carefully without requiring suspended weights or physical materials."
				}
			]
		},
		{
			title: "PHY4 Gravity, Work, and Energy",
			curriculum: [
				{
					title: "Gravity and Energy as a Unifying Theme",
					content:
						"Connect gravity to the broader idea of energy so mechanics feels like one coherent story rather than disconnected topics. Compare mass and weight, introduce gravitational potential and kinetic energy, and explain work as energy transfer. Frame energy as a bookkeeping tool for organizing many different motion situations."
				},
				{
					title: "Worked Example Set: Ball Drops, Ramps, and Pendulums",
					content:
						"Falling objects, ramp motion, and pendulum swings show energy changing form while the total stays interpretable. Use diagrams, simulation traces, provided video clips, or short datasets rather than requiring a live setup. Include at least one frictionless example and one real-world example where thermal energy matters. The central habit is describing where the energy is, not just plugging numbers into formulas."
				},
				{
					title: "Graph and Data Exercise: Height-Speed and Energy Bar Charts",
					content:
						"Use tables or simulation data showing how speed changes with height on a ramp or track. Build energy bar charts alongside numeric data so energy conservation is visible both graphically and mathematically. Compare a no-friction graph with a rough-surface graph and explain the missing mechanical energy."
				},
				{
					title: "Remote Investigation: Roller Coaster Energy Storyboard",
					content:
						"Create a storyboard for a roller coaster or skater run and label where gravitational potential, kinetic, and thermal energy are largest. Predict the speed ranking at different positions and justify their choices with energy reasoning rather than only with slope intuition."
				},
				{
					title: "Remote Investigation: Galileo's Ball Drop Revisited",
					content:
						"A provided ball-drop dataset, simulation, or video comparison revisits gravity with better measurement and cleaner reasoning than in the opening modules. The analysis separates what the evidence can actually show, what air resistance changes, and why the result supports the idea of common gravitational acceleration. Optional observations can supplement the shared evidence, but the course task remains valid without dropping objects."
				},
				{
					title: "Reflection Question: Why Is Energy Such a Useful Idea?",
					content:
						"Compare solving a motion problem with forces versus with energy. A strong response explains one case where energy makes the structure of the problem clearer and one case where force analysis is still more natural."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: distinguish energy stored in a system from energy transferred into or out of it. Prompt: narrate an energy story in words before writing any equations."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating energy as something that gets 'used up' rather than transferred or transformed, and assuming heavier objects fall faster simply because they have more weight."
				},
				{
					title: "Extension Project: Pendulum Design",
					content:
						"Plan a pendulum model using a simulation, diagram, or safe optional observation and explain why amplitude gradually decreases in the real world. Suggest practical ways to reduce energy loss and predict which changes would matter most. The final artifact can be a labeled diagram, short model writeup, or comparison table rather than a physical build."
				}
			]
		},
		{
			title: "PHY5 Electricity and Basic Circuits",
			curriculum: [
				{
					title: "Charge, Current, Voltage, and Resistance",
					content:
						"Electricity starts with practical circuits rather than abstract field theory. Charge, current, voltage, and resistance stay tied to physical meaning. Water-flow analogies are helpful for intuition, but they are never a substitute for precise reasoning."
				},
				{
					title: "Worked Example Set: Series and Parallel Circuits",
					content:
						"Work small examples that compare bulb brightness, current paths, and the effect of opening one branch. Use Ohm's law in simple numeric settings, but keep the focus on how the circuit behaves as a system. Include troubleshooting-style questions that connect symptoms back to structure."
				},
				{
					title: "Graph and Data Exercise: Current-Voltage Tables",
					content:
						"Several provided or simulated current-voltage data points for the same resistor or circuit element support the graphing task. Graph current versus voltage, interpret the slope qualitatively, and connect the pattern to resistance. Repeated measurements still matter, and imperfections can be discussed through noisy datasets or circuit-simulator variation rather than requiring physical contacts or batteries."
				},
				{
					title: "Remote Investigation: Circuit Measurement Log",
					content:
						"Use a circuit simulator, provided schematic, or provided measurement table to compare a simple series circuit with a parallel circuit. Record predicted versus observed bulb behavior, current direction, and voltage or current values from the shared evidence. Sketch the circuit before and after the modeled change. A physical circuit build is optional only when appropriate tools and safety conditions are available."
				},
				{
					title: "Simulation Challenge: Circuit Debugging",
					content:
						"Use a simulator or drawn circuit set to diagnose why a bulb will not light, why one branch is dimmer, or why a switch placement matters. Treat debugging as a scientific reasoning task: identify the intended path, compare it to the actual path, and isolate the broken assumption."
				},
				{
					title: "Reflection Question: What Does a Diagram Hide or Reveal?",
					content:
						"Compare a physical-looking circuit image, breadboard photo, or battery-and-bulb setup with its schematic diagram. A strong response explains which representation helps more with building and which helps more with reasoning."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: predict what happens when one component is removed or replaced before changing the circuit diagram or simulation. A good checkpoint explains current and voltage in the same circuit without mixing the two ideas."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating current as something that gets 'used up' by the first bulb in a series circuit, assuming a battery supplies a fixed current no matter the circuit, and confusing an open circuit with a weaker circuit rather than a broken path."
				},
				{
					title: "Extension Project: Home Device Power Survey",
					content:
						"Choose several common devices, estimate how electrical energy use differs among them, and connect those differences to power ratings and run time. This works well as a short bridge from circuits to practical energy use."
				}
			]
		},
		{
			title: "PHY6 Waves, Sound, and Light",
			curriculum: [
				{
					title: "Wave Behavior Across Media",
					content:
						"Amplitude, wavelength, frequency, and wave speed can be developed through visual and auditory examples. Mechanical waves such as sound and electromagnetic waves such as light become easier to compare once shared wave ideas are visible. The module presents physics as observable, pattern-based reasoning rather than formula memorization."
				},
				{
					title: "Worked Example Set: Pitch, Color, and Wave Speed",
					content:
						"Work examples that connect higher frequency with higher pitch, compare louder versus softer sounds through amplitude, and relate color differences to light frequency or wavelength. Use waveform screenshots, audio-tool displays, or simulations as evidence. Include a simple wave-speed relationship problem and one example involving reflection or refraction."
				},
				{
					title: "Graph and Data Exercise: Reading Waveforms",
					content:
						"Interpret snapshots of waves and wave-versus-time graphs so amplitude, period, and wavelength can be read from more than one representation. A provided sound waveform or screenshot can be compared with the sound it represents when audio is available. Use the exercise to reinforce that graphs describe measurable quantities, not artistic shapes."
				},
				{
					title: "Remote Investigation: Resonance and Sound",
					content:
						"Use a resonance simulation, digital tone generator, provided waveform, or short demonstration clip to study resonance. Identify which variable is being changed, what happens near resonance, and how energy transfer becomes easier when frequencies match. Physical objects such as tuning forks, cups, or strings are optional examples rather than required materials."
				},
				{
					title: "Simulation Challenge: Light, Reflection, and Refraction",
					content:
						"Use a light simulation, ray diagram set, or provided ripple-tank/mirror clip to compare reflection and refraction. Predict path changes first, then test the prediction and explain the result using wave ideas instead of only memorized rules."
				},
				{
					title: "Reflection Question: Why Are Waves So Good for Modeling Patterns?",
					content:
						"Explain how the same wave vocabulary helps describe music, water patterns, and light behavior. Include at least one comparison between a sound example and a light example."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: identify amplitude, frequency, and wavelength from both pictures and graphs. Prompt: explain what changes when a sound gets louder versus when it gets higher in pitch."
				},
				{
					title: "Failure Modes",
					content:
						"Common mistakes include mixing up amplitude with frequency, assuming waves always transport matter forward rather than mainly transporting energy, and thinking light needs a medium in the same way sound does."
				},
				{
					title: "Extension Project: Sound Wave or Resonance Demo",
					content:
						"Design an online-session-safe demonstration, simulation walkthrough, or evidence brief that shows standing waves, resonance, or frequency changes clearly enough to be explained from the evidence. Include a prediction, an observation from the shared source, and a short explanation of what the wave model gets right."
				}
			]
		},
		{
			title: "PHY7 Capstone Lab and Scientific Communication",
			curriculum: [
				{
					title: "Designing a Fair Physics Investigation",
					content:
						"The capstone brings the course together by revisiting scientific questions, variables, controls, uncertainty, and model limits. A strong capstone combines conceptual understanding, graphing, experimental design, and clear communication rather than just producing a flashy result."
				},
				{
					title: "Worked Example Set: Turning a Question into a Testable Plan",
					content:
						"Work through how to refine a broad idea into a focused question, how to identify independent and dependent variables, and how to choose a useful graph before collecting or selecting data. Include one weak plan and one improved plan so the contrast makes a manageable investigation easier to recognize."
				},
				{
					title: "Graph and Data Exercise: Choosing the Best Representation",
					content:
						"Give a small capstone-style dataset, then decide whether a line graph, scatterplot, bar chart, or energy storyboard communicates the result best. Justify the choice in terms of the question being answered, not just visual preference."
				},
				{
					title: "Remote Investigation: Grand Experiment Proposal",
					content:
						"Draft and revise the final experiment, simulation, dataset analysis, or modeling challenge before full execution. Accept options such as a motion study, energy audit, bridge-force analysis, simple circuit investigation, or resonance demo when the question is narrow, the evidence source is realistic, and the plan can be completed over Zoom without special materials."
				},
				{
					title: "Communication and Defense of Results",
					content:
						"Include a short report, slideshow, poster, or recorded explanation with the question, setup, graph or table, claim, and evidence. Also explain one investigation limitation and one improvement that would matter with more time."
				},
				{
					title: "Checkpoint: Capstone Evidence Review",
					content:
						"Before the final presentation, review the evidence chain from question to conclusion. Confirm that the independent variable, dependent variable, controlled variables, graph choice, and uncertainty notes are visible. A strong review identifies one claim the evidence supports, one claim the evidence does not fully prove, and one revision that would make the investigation more reliable."
				},
				{
					title: "Reflection Question: How Has Your Physics Thinking Changed?",
					content:
						"Compare how evidence, graphs, and models were handled at the start of the course versus at the end. The reflection makes scientific growth visible, not just review vocabulary."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Readiness check: propose a question that is narrow enough to test, identify uncertainty honestly, and choose a graph that matches the data type. A strong checkpoint predicts in advance what result would count as evidence for or against the hypothesis."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating a lab as successful only when the hypothesis is confirmed, using polish to hide weak evidence, and jumping to explanations before controlling variables."
				},
				{
					title: "Capstone Option: A Grand Experiment",
					content:
						"Design and carry out an original physics investigation using one of the major course themes. The default format is simulation-based, dataset-based, diagram-based, or video-observation-based; physical observations are optional only when safe, simple, and available. Begin with a focused question, justify the setup, collect repeatable evidence, and defend the conclusion with a graph or clearly labeled model."
				}
			]
		},
		{
			title: "PHY8 Momentum, Impulse, and Collisions",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Momentum treats motion as a conserved, direction-aware quantity during short interactions. Impulse connects force and time to a change in momentum, which makes collisions, recoil, and impact safety easier to analyze than force alone."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Name the system before choosing an equation: a cart pair, a ball and wall, or a person and safety device can each define different internal and external forces. Track momentum before and after the interaction, choose a positive direction, and use force-time area when the evidence is an impulse graph."
				},
				{
					title: "Worked Example Set",
					content:
						"Use collisions, recoil, impact safety, and force-time graphs as the core examples. Each problem starts with a before-and-after sketch, a prediction about which object changes momentum most, the conservation or impulse calculation, and a reasonableness check on direction and units."
				},
				{
					title: "Momentum Graph and Data Exercise",
					aliases: [
						"intro-to-physics-phy8-momentum-impulse-and-collisions-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Create a representation for Momentum, Impulse, and Collisions with at least one graph, diagram sequence, or data table. Read a force-time graph and shade the impulse area, then compare it with a before-and-after momentum table. The useful representation shows whether momentum is conserved inside the chosen system or changed by an external impulse."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a collision simulation, provided cart data, or a video case study of an impact safety design. The final explanation identifies the system, the momentum or impulse evidence, and one simplification such as friction, deformation, or measurement timing."
				},
				{
					title: "Momentum Transfer Reflection",
					aliases: [
						"intro-to-physics-phy8-momentum-impulse-and-collisions-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a different collision or safety device and explain what changes when contact time increases. A strong transfer distinguishes reduced force from reduced momentum change."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify the system boundary, the positive direction, the before-and-after momentum values, and whether external impulse is being ignored or measured. The explanation states why conservation applies or why impulse is the better model."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating momentum as a scalar, assuming kinetic energy is always conserved in collisions, forgetting direction signs, and describing airbags as reducing momentum change rather than increasing stopping time to reduce average force."
				},
				{
					title: "Extension Project: Impact Safety Brief",
					content:
						"Create a helmet, bumper, or sports-impact safety brief. Use an impulse or energy model to explain how the design changes force, time, distance, or energy transfer; include a diagram, one calculation or evidence-based comparison, and one limitation of the model."
				}
			]
		},
		{
			title: "PHY9 Rotational Motion and Torque Basics",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Rotational motion starts with pivots, lever arms, and the direction of rotation a force would cause. Torque depends on force, distance from the pivot, and angle, so the same push can have a different effect depending on where and how it is applied."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Mark the pivot first, then draw the force direction and perpendicular lever arm. Classify torques as clockwise or counterclockwise before calculating so equilibrium and rotation direction are visible in the diagram."
				},
				{
					title: "Worked Example Set",
					content:
						"Use doors, wrenches, seesaws, balance beams, and rotating tools as the main examples. For each example, compare at least two force locations or angles so the lever-arm idea is tested instead of memorized."
				},
				{
					title: "Torque Diagram and Data Exercise",
					aliases: [
						"intro-to-physics-phy9-rotational-motion-and-torque-basics-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Build a torque table with force, lever arm, torque direction, and net torque. A balance-beam diagram shows how equal forces can fail to balance when their distances from the pivot differ."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a seesaw simulation, door-handle case, or paper balance model. The final explanation shows the pivot, identifies all torques, and states which small real-world effects were ignored, such as friction at the hinge."
				},
				{
					title: "Torque Transfer Reflection",
					aliases: [
						"intro-to-physics-phy9-rotational-motion-and-torque-basics-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a new object such as a steering wheel, wrench, or crane arm. Explain why a longer handle helps and when extra length would stop being the only important design factor."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: locate the pivot, draw the applied force, identify the perpendicular lever arm, and predict clockwise or counterclockwise rotation before calculating torque."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include measuring distance along the object instead of perpendicular distance to the force line, mixing clockwise and counterclockwise signs, and assuming the largest force always creates the largest torque."
				},
				{
					title: "Extension Project: Rotation and Torque Audit",
					content:
						"Create an everyday rotation audit for a door, wrench, seesaw, balance tool, or similar object. Identify the pivot, force direction, lever arm, and torque direction; include a labeled diagram, one numeric or proportional comparison, and one assumption that affects the conclusion."
				}
			]
		},
		{
			title: "PHY10 Fluids, Pressure, and Buoyancy",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Fluids connect pressure, density, and buoyancy through contact forces spread over area and through the fluid displaced by an object. Pressure explains why the same force can feel different over different areas, while buoyancy explains floating as an upward force from the surrounding fluid."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Separate three questions before calculating: how much force is spread over what area, how much mass is packed into what volume, and how much fluid is displaced. This prevents pressure, density, and buoyant force from blending into one vague 'floating' idea."
				},
				{
					title: "Worked Example Set",
					content:
						"Use snowshoes, hydraulic lifts, boats, submarines, and sink-float data as the main examples. Compare cases where changing area changes pressure, changing volume changes density, or changing displaced fluid changes buoyant force."
				},
				{
					title: "Fluids Data Representation",
					aliases: [
						"intro-to-physics-phy10-fluids-pressure-and-buoyancy-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Create a density table or pressure comparison chart, then use it to predict floating, sinking, or surface pressure. A strong representation labels the material, volume, mass, area, and force so the conclusion is tied to measurable quantities."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a buoyancy simulation, boat-shape design case, or provided fluid-density dataset. The final explanation identifies the displaced-fluid evidence and states one limitation, such as treating the fluid as still or ignoring object deformation."
				},
				{
					title: "Fluids Transfer Reflection",
					aliases: [
						"intro-to-physics-phy10-fluids-pressure-and-buoyancy-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a new object such as a ship, balloon, submarine, or snowshoe. Explain whether pressure, density, or buoyancy is the main idea and what extra measurement would make the prediction stronger."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: distinguish pressure, density, and buoyant force in the same scenario. The answer identifies area, volume, mass, displaced fluid, and whether the object-fluid system is being simplified."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include saying heavy objects always sink, treating pressure and force as identical, ignoring area, and using density without specifying the material or the volume being compared."
				},
				{
					title: "Extension Project: Boat Shape and Buoyancy Design",
					content:
						"Design a boat-shape explanation that connects density, displaced fluid, and floating or sinking. Include a cross-section or side-view model, a mass-volume or displacement comparison, and a short note about what the simplified model ignores."
				}
			]
		},
		{
			title: "PHY11 Heat, Temperature, and Thermal Energy",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Thermal physics separates temperature from total thermal energy and uses heat transfer to explain warming, cooling, insulation, and phase changes. The same temperature change can require different energy amounts because mass, material, and phase matter."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Start by naming the system, surroundings, and direction of energy transfer. Then choose whether the situation is about temperature change, phase change, conduction, convection, radiation, or a combination of several transfer paths."
				},
				{
					title: "Worked Example Set",
					content:
						"Use insulation, cooling curves, heating curves, cooking, climate, and electronics as the main examples. Compare cases where temperature changes steadily with cases where added energy changes phase instead of temperature."
				},
				{
					title: "Thermal Graph and Data Exercise",
					aliases: [
						"intro-to-physics-phy11-heat-temperature-and-thermal-energy-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Read a heating or cooling curve and label warming segments, phase-change plateaus, and transfer direction. A data table connects mass, material, temperature change, and energy so the graph is more than a line shape."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a thermal simulation, insulation design case, or provided temperature dataset. The final explanation states the transfer path, evidence for warming or cooling, and one uncontrolled factor such as airflow, contact area, or sensor delay."
				},
				{
					title: "Thermal Design Transfer Reflection",
					aliases: [
						"intro-to-physics-phy11-heat-temperature-and-thermal-energy-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a new thermal design such as a cooler, phone heat sink, winter coat, or cooking container. Explain which transfer path dominates and what data would test that claim."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: separate temperature, heat transfer, total thermal energy, and phase change in one scenario. The explanation identifies the system, surroundings, and direction of energy flow."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating heat and temperature as the same thing, assuming all materials warm equally, ignoring mass, and describing insulation as creating heat rather than slowing energy transfer."
				},
				{
					title: "Extension Project: Thermal Design Memo",
					content:
						"Write a thermal design memo for cooling, warming, insulation, or reducing heat loss. Separate temperature from total thermal energy, identify the heat-transfer path, and include a diagram or table plus one revision that would improve the design."
				}
			]
		},
		{
			title: "PHY12 Optics, Mirrors, Lenses, and Images",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Optics uses ray models to explain reflection, refraction, focal points, and image formation. Mirrors and lenses become easier to reason about when the path of light is drawn before image properties are calculated."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Identify the optical element, incoming ray direction, normal line, focal point, and image side before using equations. Ray diagrams are the first model; formulas refine distances and magnification after the geometry is clear."
				},
				{
					title: "Worked Example Set",
					content:
						"Use mirrors, eyeglasses, cameras, projectors, telescopes, and lens simulations as the main examples. Compare real and virtual images, converging and diverging behavior, and cases where changing object distance changes the image."
				},
				{
					title: "Optics Ray-Diagram Exercise",
					aliases: [
						"intro-to-physics-phy12-optics-mirrors-lenses-and-images-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Draw ray diagrams for several object positions and record image orientation, relative size, and image type. The diagram shows reflection or refraction rules explicitly rather than only reporting an answer."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a lens simulation, mirror case study, or provided optical-device diagram. The final explanation connects the ray model to the device purpose and names one limitation such as ideal thin lenses or ignoring lens thickness."
				},
				{
					title: "Optics Transfer Reflection",
					aliases: [
						"intro-to-physics-phy12-optics-mirrors-lenses-and-images-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a new optical device and explain which ray behavior matters most. A strong response distinguishes what the ray diagram predicts from what a real device adds through materials, apertures, and alignment."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: draw at least two correct rays, identify the image as real or virtual, and explain whether the model is using reflection, refraction, or both."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include using lens formulas before deciding image type, drawing rays that bend without a normal line, treating virtual images as fake, and forgetting that ray models are simplified representations of light behavior."
				},
				{
					title: "Extension Project: Optical Device Explainer",
					content:
						"Explain an optical device such as glasses, a mirror, a camera, a telescope, or a projector. Use a ray diagram to show reflection or refraction, name the design constraint, and state which parts of the real device the simplified ray model does not capture."
				}
			]
		},
		{
			title: "PHY13 Magnetism and Electromagnetic Induction",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Magnetism connects fields, moving charge, coils, motors, generators, and induction. The module emphasizes how electric current can create magnetic effects and how changing magnetic conditions can produce electrical effects."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Begin with a field diagram, current direction, coil orientation, and energy transformation. Then decide whether the situation is about an electromagnet, a force on a current, a motor effect, a generator effect, or a changing-field induction effect."
				},
				{
					title: "Worked Example Set",
					content:
						"Use electromagnets, speakers, relays, generators, wireless charging, and field diagrams as the main examples. For each example, trace current, magnetic field, motion or changing field, and the resulting energy transfer."
				},
				{
					title: "Electromagnetic Device Diagram",
					aliases: [
						"intro-to-physics-phy13-magnetism-and-electromagnetic-induction-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Create a field-line sketch or input-output table for a magnetic device. The useful representation shows direction, relative strength, and what changes when current, coil turns, magnet motion, or distance changes."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use an electromagnet simulation, generator case study, or speaker/motor diagram. The final explanation identifies the field interaction and one simplification, such as ideal coils, uniform fields, or neglected losses."
				},
				{
					title: "Electromagnetism Transfer Reflection",
					aliases: [
						"intro-to-physics-phy13-magnetism-and-electromagnetic-induction-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model between a motor and a generator. Explain which direction the energy conversion runs, which parts stay analogous, and what evidence distinguishes mechanical-to-electrical from electrical-to-mechanical behavior."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify current direction, magnetic field direction, device purpose, and energy transformation before using vocabulary such as motor, generator, or induction."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating magnetic fields as visible material lines, describing magnets as storing unlimited energy, mixing up motors and generators, and ignoring the role of changing fields in induction."
				},
				{
					title: "Extension Project: Electromagnetic Device Brief",
					content:
						"Create an electromagnetic device brief for a speaker, generator, motor, relay, or charger. Trace the energy transformation, identify the role of current and magnetic field, and include one piece of evidence that distinguishes the model from a purely mechanical explanation."
				}
			]
		},
		{
			title: "PHY14 Simple Harmonic Motion and Resonance",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Simple harmonic motion describes repeated motion around equilibrium. Amplitude, period, frequency, damping, and resonance explain why springs, pendulums, instruments, and structures can respond strongly to repeated pushes."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Identify the equilibrium point, restoring effect, amplitude, period, and energy changes during the cycle. Then decide whether damping or driving frequency is important enough to include in the model."
				},
				{
					title: "Worked Example Set",
					content:
						"Use springs, pendulums, swings, instruments, bridges, and resonance graphs as the main examples. Compare free oscillation, damped oscillation, and driven oscillation so resonance is tied to evidence rather than treated as a dramatic word."
				},
				{
					title: "Oscillation Graph Exercise",
					aliases: [
						"intro-to-physics-phy14-simple-harmonic-motion-and-resonance-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Read position-time or amplitude-frequency graphs and identify amplitude, period, frequency, damping, and resonance peaks. A strong graph explanation connects the shape to energy transfer and restoring motion."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a pendulum simulation, spring dataset, sound resonance example, or bridge case study. The final explanation identifies the driving pattern, the response, and one factor that would add damping or shift the period."
				},
				{
					title: "Resonance Transfer Reflection",
					aliases: [
						"intro-to-physics-phy14-simple-harmonic-motion-and-resonance-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model to a different oscillating system and decide whether simple harmonic motion is a good approximation. Explain what would break the approximation, such as large angles, friction, nonlinear springs, or irregular driving."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: identify equilibrium, amplitude, period, frequency, and whether damping or driving is present. The explanation separates one full cycle from one crossing of equilibrium."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include confusing amplitude with period, assuming resonance always destroys a system, ignoring damping, and treating every repeated motion as perfectly simple harmonic."
				},
				{
					title: "Extension Project: Resonance Case Study",
					content:
						"Build a resonance case study from music, engineering, medicine, or electronics. Identify the system, natural frequency or driving pattern, what increases the response, and what damping or design choice controls the effect."
				}
			]
		},
		{
			title: "PHY15 Astronomy, Gravity, and Orbits",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Astronomy extends gravity from falling objects to planets, moons, satellites, and orbital motion. Orbits are modeled as continuous falling around a central body, not as motion without gravity."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Name the central body, orbiting object, distance scale, velocity direction, and gravitational force direction. Then decide whether the task is comparing weight, explaining an orbit, reading planetary data, or reasoning about escape and capture."
				},
				{
					title: "Worked Example Set",
					content:
						"Use planetary data, satellite orbits, weight on other worlds, and orbit simulations as the main examples. For each example, connect the diagram to gravitational force direction and the motion that follows."
				},
				{
					title: "Orbit Data and Diagram Exercise",
					aliases: [
						"intro-to-physics-phy15-astronomy-gravity-and-orbits-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Compare orbital radius, period, speed, or surface gravity using a table or scaled diagram. The representation reveals that distance and mass both matter, and that visual scale can be misleading without units."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use an orbit simulation, mission sketch, or provided planetary dataset. The final explanation shows force direction, velocity direction, and one simplification such as circular orbit assumptions or ignoring atmospheric drag."
				},
				{
					title: "Orbit Transfer Reflection",
					aliases: [
						"intro-to-physics-phy15-astronomy-gravity-and-orbits-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model from a satellite to a moon, planet, or spacecraft maneuver. Explain why orbiting is not escaping gravity and what data would be needed to compare two orbital paths."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: draw force and velocity directions for an orbiting object, then explain the difference between falling, orbiting, and escaping in terms of speed and gravitational interaction."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include saying there is no gravity in orbit, drawing orbital force forward along the path, using not-to-scale diagrams as evidence, and confusing mass with weight on different worlds."
				},
				{
					title: "Extension Project: Mission Planning Sketch",
					content:
						"Create a mission-planning sketch that uses gravity and orbit constraints. Show the central body, path, velocity direction, and force direction; explain why orbiting is not the same as escaping gravity, and identify one missing real-world complication."
				}
			]
		},
		{
			title: "PHY16 Modern Physics and Model Limits",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"Modern physics introduces places where classical models stop being enough. Spectra, photons, quantized energy, semiconductors, and timing effects show that a model can be useful in one domain while needing replacement or refinement in another."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Start by naming the classical expectation, the evidence that strains it, and the newer idea that explains the observation better. This keeps modern physics grounded in model limits rather than turning it into disconnected facts."
				},
				{
					title: "Worked Example Set",
					content:
						"Use emission spectra, absorption, solar panels, lasers, semiconductors, and GPS timing as the main examples. For each example, identify the observed evidence, the classical idea that is insufficient, and the newer model feature that improves the explanation."
				},
				{
					title: "Modern Physics Evidence Diagram",
					aliases: [
						"intro-to-physics-phy16-modern-physics-and-model-limits-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Read a spectrum, energy-level diagram, or device data table. The representation makes discrete energies, absorption/emission patterns, or model breakdown visible instead of only naming quantum vocabulary."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a spectrum simulation, semiconductor case study, photoelectric-effect visualization, or GPS timing scenario. The final explanation connects evidence to model limits and avoids claiming more precision than the introductory model supports."
				},
				{
					title: "Model-Limit Transfer Reflection",
					aliases: [
						"intro-to-physics-phy16-modern-physics-and-model-limits-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Transfer the model-limit idea to a new technology or observation. Explain which classical idea still helps, which part fails, and what evidence would justify introducing the newer model."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: name the observation, the classical model being challenged, and the modern-physics idea that handles the evidence better. The response avoids vague claims that quantum physics is simply 'weird.'"
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include treating modern physics as magic, claiming classical physics is useless, confusing photons with ordinary particles in every respect, and using device names without explaining the evidence behind the model."
				},
				{
					title: "Extension Project: Modern Physics Explainer",
					content:
						"Write a modern-physics explainer that names a classical model, the evidence that strains it, and the newer idea that handles the case better. Include a diagram, spectrum, data snippet, or device example and one caution about oversimplifying the topic."
				}
			]
		},
		{
			title: "PHY17 Engineering Design and Physics Portfolio",
			curriculum: [
				{
					title: "Concept Path",
					content:
						"The final portfolio turns physics knowledge into a defended design or investigation. A strong portfolio uses a focused question, a model, evidence, uncertainty, and at least one design tradeoff rather than collecting disconnected artifacts."
				},
				{
					title: "Model and Reasoning Toolkit",
					content:
						"Choose one physics thread, define the system, state the assumption that makes the model usable, and decide what evidence would support or weaken the claim. Calculations and graphs serve the argument rather than appear as decoration."
				},
				{
					title: "Worked Example Set",
					content:
						"Review portfolio artifacts from motion, forces, circuits, collisions, waves, thermal systems, or space. For each artifact, identify the claim, the model used, the evidence, and the limitation that would need improvement in a second revision."
				},
				{
					title: "Portfolio Evidence Representation",
					aliases: [
						"intro-to-physics-phy17-engineering-design-and-physics-portfolio-curriculum-graph-diagram-or-data-exercise"
					],
					content:
						"Select the graph, diagram, data table, or storyboard that best supports the final claim. The chosen representation makes the relationship visible and includes units, labels, and enough context for someone else to evaluate the evidence."
				},
				{
					title: "Investigation, Simulation, or Case Study",
					content:
						"Use a safe remote simulation, provided dataset, video observation, or paper design case as the final evidence source. The final explanation states the claim, evidence, model, uncertainty, and revision decision in a single coherent argument."
				},
				{
					title: "Portfolio Transfer Reflection",
					aliases: [
						"intro-to-physics-phy17-engineering-design-and-physics-portfolio-curriculum-reflection-and-transfer-practice"
					],
					content:
						"Close by transferring the portfolio model to a related design or investigation. Explain what would stay the same, what would need new evidence, and which assumption is most fragile."
				}
			],
			supplementalProjects: [
				{
					title: "Diagnostic Checkpoint",
					content:
						"Checkpoint: confirm that the portfolio has a focused question, named model, evidence source, labeled representation, limitation, and revision plan before final polish begins."
				},
				{
					title: "Failure Modes",
					content:
						"Common failure modes include making the portfolio too broad, hiding weak evidence behind visual polish, omitting units, using a graph without interpreting it, and failing to say what the model cannot explain."
				},
				{
					title: "Extension Project: Final Physics Portfolio",
					content:
						"Build a final physics design portfolio around one question, model, evidence source, and revision. Include a diagram or graph, a calculation or data-based comparison, a stated limitation, and a final paragraph explaining how the evidence changed the design."
				}
			]
		}
	]
});

interface IntroPhysicsModuleFlow {
	stage: "Core foundation" | "Guided extension" | "Final synthesis";
	estimatedTime: string;
	keyBlocks: string[];
	materialSection: string;
	answerSection: string;
	phenomenon: string;
	corePath: string;
	stretchPath: string;
	evidenceGate: string;
	boundary: string;
	referenceLink: string;
	projectCore: string;
	projectStretch: string;
}

const INTRO_PHYSICS_REFERENCES = {
	nistSI: "https://www.nist.gov/pml/owm/metric-si/si-units",
	openStax: "https://openstax.org/details/books/physics",
	phetMotion: "https://phet.colorado.edu/en/simulations/moving-man",
	phetForces:
		"https://phet.colorado.edu/en/simulations/forces-and-motion-basics",
	phetEnergy: "https://phet.colorado.edu/en/simulations/energy-skate-park",
	phetCircuits:
		"https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc",
	phetWaves: "https://phet.colorado.edu/en/simulations/wave-on-a-string",
	phetCollisions: "https://phet.colorado.edu/en/simulations/collision-lab",
	phetTorque: "https://phet.colorado.edu/en/simulations/balancing-act",
	phetDensity: "https://phet.colorado.edu/en/simulations/density",
	phetThermal:
		"https://phet.colorado.edu/en/simulations/energy-forms-and-changes",
	phetOptics: "https://phet.colorado.edu/en/simulations/geometric-optics",
	phetFaraday:
		"https://phet.colorado.edu/en/simulations/faradays-electromagnetic-lab",
	phetSprings: "https://phet.colorado.edu/en/simulations/masses-and-springs",
	nasaOrbits:
		"https://science.nasa.gov/solar-system/orbits-and-keplers-laws/",
	phetPhotoelectric: "https://phet.colorado.edu/en/simulations/photoelectric"
} as const;

function introPhysicsMaterial(section: string) {
	return `/course-assets/physics/intro-physics-materials-pack.md#${section}`;
}

function introPhysicsAnswerKey(section: string) {
	return `/course-assets/physics/intro-physics-rubrics-answer-key.md#${section}`;
}

const INTRO_PHYSICS_FLOW: Record<string, IntroPhysicsModuleFlow> = {
	"PHY1 Measurement, Uncertainty, and Scientific Modeling": {
		stage: "Core foundation",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"SI quantities and units",
			"unit conversion",
			"precision and accuracy",
			"measurement uncertainty",
			"graph construction",
			"bounded evidence claims"
		],
		materialSection: "measurement-and-uncertainty-cases",
		answerSection: "measurement-and-uncertainty-key",
		phenomenon:
			"Two groups report different walking speeds from the same route, and both measurements can still be defensible.",
		corePath:
			"Preserve raw values and units, convert quantities, graph supplied position-time data, calculate a slope, summarize repeated reaction-time trials, and report a result with an uncertainty or resolution statement.",
		stretchPath:
			"Compare random scatter with systematic bias, propagate a simple measurement range into a calculated speed, test whether an extra decimal place is justified, and revise a claim after examining the data-collection method.",
		evidenceGate:
			"A complete response includes the measured quantity, numerical value, unit, instrument or source resolution, graph labels, calculation trail, and a claim whose precision matches the evidence.",
		boundary:
			"Accuracy is closeness to an accepted or reference value, precision describes repeatability or resolution, and uncertainty is not proof that every value inside a range is equally likely. Significant figures communicate measurement limits; they do not repair weak data.",
		referenceLink: INTRO_PHYSICS_REFERENCES.nistSI,
		projectCore:
			"Classify ten supplied quantities as direct or calculated measurements, select units and likely resolution, and explain one dominant uncertainty for each.",
		projectStretch:
			"Compare two possible measurement methods, quantify the effect of one bias, and recommend a method conditionally using precision, cost, and feasibility."
	},
	"PHY2 Motion Graphs and Kinematics": {
		stage: "Core foundation",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"reference frames",
			"distance and displacement",
			"position-time slope",
			"velocity-time area",
			"acceleration",
			"representation translation"
		],
		materialSection: "motion-graphs-and-kinematics-cases",
		answerSection: "motion-graphs-and-kinematics-key",
		phenomenon:
			"An object can be at a positive position while moving in a negative direction, and a flat position graph can represent rest rather than zero position.",
		corePath:
			"Translate among a motion story, position table, position-time graph, interval velocity table, and signed coordinate diagram. Calculate slope or area only after naming the axes and interval.",
		stretchPath:
			"Use a piecewise dataset to identify changing acceleration, compare average with instantaneous quantities, combine perpendicular velocity contributions, and critique a graph that resembles the physical path but encodes different variables.",
		evidenceGate:
			"The story, table, graph, signs, units, and calculation all describe the same motion. Every slope or area statement names the graph and the physical quantity it represents.",
		boundary:
			"A graph is a relationship between quantities, not a picture of the route. Negative velocity indicates direction under a chosen convention, speed is nonnegative, and acceleration does not automatically mean speeding up.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetMotion,
		projectCore:
			"Build matching position-time and velocity-time representations for both supplied runners and support a sprint-versus-endurance comparison with exact intervals.",
		projectStretch:
			"Add a strategy change, quantify displacement and distance, compare average and peak speed, and explain how a different reference frame changes values without changing the event."
	},
	"PHY3 Forces, Free-Body Diagrams, and Newton's Laws": {
		stage: "Core foundation",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"interaction pairs",
			"object isolation",
			"free-body diagrams",
			"net force",
			"mass and acceleration",
			"Newton's three laws"
		],
		materialSection: "forces-and-newton-laws-cases",
		answerSection: "forces-and-newton-laws-key",
		phenomenon:
			"A motionless elevator rider can have several forces acting, while an object moving at constant velocity can have zero net force.",
		corePath:
			"Choose one object, list external interactions, draw and label force arrows, calculate or compare net force, and connect the net force to acceleration rather than directly to velocity.",
		stretchPath:
			"Use paired acceleration datasets to infer the force-mass relationship, distinguish third-law pairs from balanced forces on one object, and analyze apparent weight during several elevator intervals.",
		evidenceGate:
			"Each force has an interacting source, acts on the isolated object, and uses a clear direction convention. The diagram, component equation, net force, and motion prediction agree.",
		boundary:
			"Constant velocity requires zero net force, not zero individual forces. Newton's third-law forces act on different objects, and mass is not interchangeable with gravitational force or scale reading.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetForces,
		projectCore:
			"Annotate the supplied structure or equilibrium diagram with interactions, force directions, likely compression or tension, and one evidence-based failure point.",
		projectStretch:
			"Compare two designs under the same load, quantify one force ratio or safety margin, and state which geometry or material assumption limits the conclusion."
	},
	"PHY4 Gravity, Work, and Energy": {
		stage: "Core foundation",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"system boundaries",
			"work and transfer",
			"kinetic energy",
			"gravitational energy",
			"thermal transfer",
			"energy conservation"
		],
		materialSection: "gravity-work-and-energy-cases",
		answerSection: "gravity-work-and-energy-key",
		phenomenon:
			"Two carts can reach the same height with different speeds when energy leaves the selected mechanical system through friction.",
		corePath:
			"Define a system and interval, build initial and final energy accounts, calculate a supplied kinetic or gravitational energy value, and use height-speed evidence to explain a transfer.",
		stretchPath:
			"Compare force-based and energy-based solutions, estimate thermal transfer from a mechanical-energy difference, test a changed mass or height, and evaluate whether a model treats drag or friction adequately.",
		evidenceGate:
			"An energy story names the system, initial and final stores, transfers across the boundary, calculation units, and where energy appears in the surroundings when mechanical energy decreases.",
		boundary:
			"Energy is conserved in a suitably defined closed system, but mechanical energy alone can decrease. Work is a transfer associated with force through displacement; it is not a substance stored in an object.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetEnergy,
		projectCore:
			"Create a pendulum or track design from supplied evidence with labeled energy states, one calculation, and an explanation of decreasing mechanical amplitude.",
		projectStretch:
			"Compare two damping-reduction ideas using criteria, quantify one predicted improvement, and identify a tradeoff or model feature that the ideal simulation omits."
	},
	"PHY5 Electricity and Basic Circuits": {
		stage: "Core foundation",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"charge and current",
			"potential difference",
			"resistance",
			"series circuits",
			"parallel circuits",
			"electrical power"
		],
		materialSection: "circuits-cases",
		answerSection: "circuits-key",
		phenomenon:
			"Opening one branch of a parallel circuit can leave another branch operating, while one break stops current everywhere in a simple series path.",
		corePath:
			"Trace complete paths, label current direction and voltage measurements, use supplied current-voltage data to infer resistance, and compare component behavior in series and parallel diagrams.",
		stretchPath:
			"Calculate equivalent resistance or power in bounded cases, diagnose hidden short and open paths, compare ideal with noisy measurements, and redesign a circuit for reliability or independent control.",
		evidenceGate:
			"A circuit claim cites topology plus measured or supplied voltage, current, resistance, brightness, or power evidence. A schematic, value table, and written explanation remain mutually consistent.",
		boundary:
			"Current is not consumed by the first component, voltage is not the same quantity as current, and a battery does not force one fixed current through every circuit. Simulations use idealized wires and components unless stated otherwise.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetCircuits,
		projectCore:
			"Compare the energy use of supplied devices from power and run time, show calculations with units, and identify which assumption dominates the estimate.",
		projectStretch:
			"Construct a conditional recommendation that adds standby use, efficiency, uncertainty, or cost while avoiding claims about a learner's household."
	},
	"PHY6 Waves, Sound, and Light": {
		stage: "Core foundation",
		estimatedTime: "4–5 sessions",
		keyBlocks: [
			"amplitude",
			"wavelength",
			"frequency and period",
			"wave speed",
			"reflection and refraction",
			"resonance"
		],
		materialSection: "waves-sound-and-light-cases",
		answerSection: "waves-sound-and-light-key",
		phenomenon:
			"A sound can become louder without becoming higher in pitch, and a wave can carry energy while the medium's particles mainly oscillate locally.",
		corePath:
			"Read spatial and time graphs, identify amplitude, wavelength, period, and frequency, calculate one wave-speed relationship, and compare reflection, refraction, sound, and light cases.",
		stretchPath:
			"Analyze resonance-response data, distinguish medium motion from wave propagation, compare sound and electromagnetic waves, and design a signal route resilient to one supplied interference source.",
		evidenceGate:
			"Every wave quantity comes from a named axis or measurement, with units and a clear distinction between a snapshot in space and variation through time.",
		boundary:
			"Amplitude and frequency describe different features, wave speed depends on the modeled medium and conditions, and light does not require a material medium in the same way sound does.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetWaves,
		projectCore:
			"Create a supplied-evidence demonstration brief with a prediction, amplitude or frequency measurement, observation table, and resonance or propagation explanation.",
		projectStretch:
			"Compare two driving frequencies or media, graph the response, identify damping or uncertainty, and add an equivalent non-audio representation."
	},
	"PHY7 Capstone Lab and Scientific Communication": {
		stage: "Core foundation",
		estimatedTime: "5–7 sessions",
		keyBlocks: [
			"focused questions",
			"variables and controls",
			"evidence-source choice",
			"graph selection",
			"claim-evidence-reasoning",
			"revision and defense"
		],
		materialSection: "core-capstone-cases",
		answerSection: "core-capstone-key",
		phenomenon:
			"The same dataset can support a narrow relationship claim while failing to prove a broader mechanism or universal rule.",
		corePath:
			"Choose one supplied mechanics, energy, circuit, or wave case; define a testable question; select variables and a graph; analyze evidence; state uncertainty; and revise a CER response after rubric feedback.",
		stretchPath:
			"Compare two models or datasets, test sensitivity to an assumption or exclusion rule, evaluate an alternative explanation, and defend why the final representation fits the question better than another option.",
		evidenceGate:
			"The capstone preserves source values, calculation steps, graph labels, claim scope, limitations, and a substantive before-and-after revision. Presentation polish never substitutes for traceable evidence.",
		boundary:
			"A simulation or provided dataset can test a model relationship without reproducing every real-world factor. A confirmed prediction does not prove a model uniquely, and an unexpected result does not make the investigation a failure.",
		referenceLink: INTRO_PHYSICS_REFERENCES.openStax,
		projectCore:
			"Complete one focused investigation with question, variables, source record, graph or diagram, calculation, CER response, limitation, and documented revision.",
		projectStretch:
			"Compare an alternative model, quantify uncertainty or sensitivity, add a changed-condition prediction, and defend what new evidence would change the conclusion."
	},
	"PHY8 Momentum, Impulse, and Collisions": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"system boundaries",
			"vector momentum",
			"impulse",
			"force-time area",
			"collision conservation",
			"impact safety"
		],
		materialSection: "momentum-cases",
		answerSection: "momentum-key",
		phenomenon:
			"An airbag can reduce average force while producing essentially the same momentum change by increasing the stopping time.",
		corePath:
			"Choose a direction and system, build before-and-after momentum tables, calculate impulse from a force-time area, and distinguish momentum conservation from kinetic-energy conservation.",
		stretchPath:
			"Analyze an inelastic collision, include an external impulse or uncertainty interval, compare safety designs with the same momentum change, and test whether system choice changes the conservation statement.",
		evidenceGate:
			"Mass, signed velocity, momentum, impulse, system boundary, units, and before-after timing remain explicit. Conservation is invoked only after external interactions are evaluated.",
		boundary:
			"Momentum is a vector and kinetic energy is a scalar; a closed-system collision conserves momentum even when mechanical kinetic energy changes form. Longer collision time changes average force, not the required momentum change.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetCollisions,
		projectCore:
			"Create an impact-safety brief with a system diagram, same-momentum-change comparison, force-time evidence, one calculation, and a model limitation.",
		projectStretch:
			"Compare two designs over multiple impact conditions, quantify peak-versus-average force carefully, and add a tradeoff involving mass, distance, comfort, cost, or reuse."
	},
	"PHY9 Rotational Motion and Torque Basics": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"pivots",
			"lever arms",
			"torque direction",
			"net torque",
			"rotational equilibrium",
			"design tradeoffs"
		],
		materialSection: "torque-cases",
		answerSection: "torque-key",
		phenomenon:
			"A smaller force applied farther from a pivot can create the same turning effect as a larger force applied nearby.",
		corePath:
			"Mark the pivot and force line, find the perpendicular lever arm, assign clockwise and counterclockwise signs, calculate torque, and test rotational equilibrium.",
		stretchPath:
			"Compare nonperpendicular forces, infer an unknown force or location, evaluate distributed load as a simplified point, and redesign a lever system under size or force constraints.",
		evidenceGate:
			"A torque conclusion includes pivot, force vector, perpendicular distance, sign convention, units, and a diagram that matches the calculation.",
		boundary:
			"Distance along an object is not always the lever arm, sign is a chosen rotational convention, and zero net torque does not by itself guarantee zero net force.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetTorque,
		projectCore:
			"Audit a supplied door, wrench, balance, or crane diagram with pivot, forces, lever arms, torque directions, and one numeric comparison.",
		projectStretch:
			"Evaluate a changed force angle or load location, add a translational-equilibrium check, and recommend a design with one practical tradeoff."
	},
	"PHY10 Fluids, Pressure, and Buoyancy": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"pressure and area",
			"density",
			"fluid pressure",
			"displaced volume",
			"buoyant force",
			"floating equilibrium"
		],
		materialSection: "fluids-cases",
		answerSection: "fluids-key",
		phenomenon:
			"A steel ship can float while a small solid steel block sinks because the ship-fluid system depends on average density and displaced volume, not material name alone.",
		corePath:
			"Calculate pressure or density from supplied values, compare floating and sinking cases, identify displaced volume, and build a force diagram for a floating object.",
		stretchPath:
			"Use a mass-loading table to estimate a design threshold, compare shape changes at fixed mass, distinguish pressure from total force, and critique a still-fluid or rigid-object assumption.",
		evidenceGate:
			"Mass, volume, area, fluid density, displacement, force direction, and units appear in the representation used to support the claim.",
		boundary:
			"Heavy objects do not automatically sink, pressure is not identical to force, and floating depends on force balance plus displaced fluid. The introductory model treats the fluid as still and incompressible unless noted.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetDensity,
		projectCore:
			"Design a boat-shape explanation from the supplied mass-volume and loading data, including a cross-section, displacement argument, and float-or-sink prediction.",
		projectStretch:
			"Estimate a loading limit, compare two hull shapes under a shared constraint, and identify stability, deformation, waves, or fluid motion omitted by the model."
	},
	"PHY11 Heat, Temperature, and Thermal Energy": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"temperature",
			"thermal energy",
			"heat transfer",
			"specific heat",
			"phase changes",
			"thermal design"
		],
		materialSection: "thermal-cases",
		answerSection: "thermal-key",
		phenomenon:
			"Two equal-mass materials receiving the same energy can change temperature by different amounts, and added energy can occur during a phase plateau without a temperature rise.",
		corePath:
			"Read heating data, distinguish temperature from energy transfer, identify conduction, convection, and radiation pathways, and calculate one specific-heat or transfer value.",
		stretchPath:
			"Interpret a phase-change plateau, compare thermal designs using rate data, account for system boundary and surroundings, and evaluate an ideal-insulation or uniform-temperature assumption.",
		evidenceGate:
			"Temperature, mass, energy transferred, time, material, transfer pathway, and units remain separate in every graph, calculation, or design claim.",
		boundary:
			"Heat names energy transfer caused by a temperature difference, not a substance stored in an object. Temperature measures a state property and does not alone determine total thermal energy.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetThermal,
		projectCore:
			"Write a thermal-design memo comparing two supplied containers or materials with graph evidence, one calculation, and a recommendation tied to a stated use.",
		projectStretch:
			"Add uncertainty, a phase-change or rate consideration, a cost or mass tradeoff, and a test that could overturn the recommendation."
	},
	"PHY12 Optics, Mirrors, Lenses, and Images": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"reflection",
			"refraction",
			"principal rays",
			"focal length",
			"real and virtual images",
			"optical devices"
		],
		materialSection: "optics-cases",
		answerSection: "optics-key",
		phenomenon:
			"Moving an object across a converging lens's focal point can change the image from real and inverted to virtual and upright.",
		corePath:
			"Draw principal rays, locate an image, classify it as real or virtual, compare object and image properties, and connect reflection or refraction to an optical device.",
		stretchPath:
			"Use the thin-lens relationship with signed quantities, compare measured and predicted image distance, diagnose a flawed ray diagram, and evaluate an ideal thin-lens assumption.",
		evidenceGate:
			"At least two rays, optical element, principal axis, focal points, object, image, direction, distances, and image classification support the explanation.",
		boundary:
			"Ray diagrams model light paths rather than physical lines in space, virtual images are observable even when they cannot be projected on a screen, and ideal thin lenses omit thickness and aberrations.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetOptics,
		projectCore:
			"Explain a supplied camera, glasses, mirror, telescope, or projector diagram with principal rays, image properties, and one device constraint.",
		projectStretch:
			"Compare two configurations quantitatively, diagnose an alignment or focus failure, and state which real-device effect the ideal ray model omits."
	},
	"PHY13 Magnetism and Electromagnetic Induction": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"magnetic fields",
			"current and fields",
			"coils",
			"changing flux",
			"motors and generators",
			"energy conversion"
		],
		materialSection: "electromagnetism-cases",
		answerSection: "electromagnetism-key",
		phenomenon:
			"A stationary magnet near a coil can produce no sustained induced signal, while moving the same magnet changes the signal's size and direction.",
		corePath:
			"Trace current, field, relative motion, device input, device output, and energy conversion in supplied electromagnet, motor, generator, or induction cases.",
		stretchPath:
			"Graph induced signal against motion or coil turns, infer polarity reversal, compare motor and generator operation, and evaluate uniform-field, ideal-coil, or lossless-conversion assumptions.",
		evidenceGate:
			"Direction, relative change, coil geometry, current or induced signal, and energy input-output evidence remain visible rather than being replaced by device vocabulary alone.",
		boundary:
			"Magnetic field lines are a representation, magnets are not unlimited energy sources, and induction depends on changing magnetic flux rather than merely having a magnetic field nearby.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetFaraday,
		projectCore:
			"Create an electromagnetic device brief tracing current or motion, field interaction, energy conversion, evidence, and one idealization.",
		projectStretch:
			"Use supplied signal data to compare two designs, quantify one relationship, and add a tradeoff involving strength, speed, coil turns, heating, or efficiency."
	},
	"PHY14 Simple Harmonic Motion and Resonance": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"equilibrium",
			"restoring effects",
			"amplitude",
			"period and frequency",
			"damping",
			"driven resonance"
		],
		materialSection: "oscillation-and-resonance-cases",
		answerSection: "oscillation-and-resonance-key",
		phenomenon:
			"Small repeated pushes can produce a large response when their timing aligns with a system's natural frequency.",
		corePath:
			"Identify equilibrium, amplitude, period, frequency, restoring behavior, and damping from supplied motion and response graphs.",
		stretchPath:
			"Estimate a spring-model parameter or resonance width, compare free and driven motion, test a changed mass or damping condition, and determine where simple harmonic assumptions break.",
		evidenceGate:
			"A complete explanation reads quantities from axes, identifies one full cycle correctly, separates natural from driving frequency, and cites response evidence for resonance.",
		boundary:
			"Not every repeated motion is simple harmonic, equilibrium is not a place where motion must stop, and resonance describes frequency-dependent response rather than automatically destructive vibration.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetSprings,
		projectCore:
			"Build a resonance case study from the supplied graph with system, natural frequency, driver, response, damping, evidence, and one control strategy.",
		projectStretch:
			"Compare response under two damping levels, quantify a peak or bandwidth change, and evaluate whether the simple model fits the selected real system."
	},
	"PHY15 Astronomy, Gravity, and Orbits": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"scale and units",
			"central-force direction",
			"orbital velocity",
			"continuous free fall",
			"period and radius",
			"reference frames"
		],
		materialSection: "astronomy-and-orbits-cases",
		answerSection: "astronomy-and-orbits-key",
		phenomenon:
			"An orbiting spacecraft continuously accelerates toward a central body even when its speed is nearly constant.",
		corePath:
			"Label force and velocity directions, compare weight across worlds, read orbital-radius and period data, and explain orbit as continuous free fall.",
		stretchPath:
			"Test a Kepler-style period-radius relationship with scaled data, compare circular with elliptical models, evaluate a not-to-scale diagram, and identify the reference frame used for each measurement.",
		evidenceGate:
			"Central body, orbiting object, distance scale, velocity direction, acceleration or force direction, period, units, and model scale support the orbital claim.",
		boundary:
			"Orbit does not mean gravity disappears, astronauts in orbit are not beyond gravitational interaction, and a forward force is not required to maintain inertial tangential motion.",
		referenceLink: INTRO_PHYSICS_REFERENCES.nasaOrbits,
		projectCore:
			"Create a mission-planning sketch with central body, path, velocity, force direction, scale note, period evidence, and one operational constraint.",
		projectStretch:
			"Compare two candidate orbits quantitatively, apply a period-radius relationship, and identify atmospheric drag, multi-body effects, or maneuver burns omitted by the introductory model."
	},
	"PHY16 Modern Physics and Model Limits": {
		stage: "Guided extension",
		estimatedTime: "3–4 sessions",
		keyBlocks: [
			"classical expectations",
			"model-breaking evidence",
			"quantized energy",
			"spectra and photons",
			"device applications",
			"domain limits"
		],
		materialSection: "modern-physics-cases",
		answerSection: "modern-physics-key",
		phenomenon:
			"Changing light intensity and changing light frequency have different effects in photoelectric evidence, which strains a purely classical wave-energy account.",
		corePath:
			"Name a classical expectation, inspect spectrum or photoelectric evidence, identify the mismatch, and state the limited modern idea needed for the case.",
		stretchPath:
			"Compare discrete spectral lines with a continuous prediction, use a threshold dataset, connect a device to the model, and explain why classical physics remains accurate within its tested domain.",
		evidenceGate:
			"The explanation separates observation, classical prediction, mismatch, refined model feature, application, and remaining simplification.",
		boundary:
			"Quantum is not a synonym for unpredictable or magical, photons are not ordinary classical particles in every respect, and model refinement does not erase the usefulness of classical approximations at everyday scales.",
		referenceLink: INTRO_PHYSICS_REFERENCES.phetPhotoelectric,
		projectCore:
			"Create a modern-physics explainer with a supplied spectrum or threshold dataset, classical expectation, evidence mismatch, refined idea, application, and caution.",
		projectStretch:
			"Quantify one threshold or spectral relationship, compare two possible explanations, and state what the introductory model still cannot predict."
	},
	"PHY17 Engineering Design and Physics Portfolio": {
		stage: "Final synthesis",
		estimatedTime: "6–8 sessions",
		keyBlocks: [
			"focused design questions",
			"system and model choice",
			"traceable evidence",
			"criteria and constraints",
			"uncertainty and alternatives",
			"revision and defense"
		],
		materialSection: "final-portfolio-cases",
		answerSection: "final-portfolio-key",
		phenomenon:
			"Two polished designs can reach different conclusions because they optimize different criteria, use different system boundaries, or rely on evidence of unequal strength.",
		corePath:
			"Select one approved supplied case, define a focused question and system, choose a model, analyze data, compare at least two options, document a limitation, revise one substantive decision, and defend the result.",
		stretchPath:
			"Combine two physics models carefully, quantify uncertainty or sensitivity, compare an alternative explanation or design, test a changed condition, and answer what evidence would reverse the recommendation.",
		evidenceGate:
			"The portfolio includes a source record, labeled representation, calculation trail, model statement, criteria and constraints, tradeoff table, bounded claim, limitation, before-after revision, and accessible defense.",
		boundary:
			"A portfolio demonstrates a defensible model-based decision, not universal proof or professional engineering certification. Conclusions remain conditional on the supplied evidence, assumptions, and stated operating range.",
		referenceLink: INTRO_PHYSICS_REFERENCES.openStax,
		projectCore:
			"Build the complete portfolio around one question, model, evidence source, calculation, labeled representation, tradeoff, limitation, and documented revision.",
		projectStretch:
			"Integrate a second model or dataset, run a sensitivity comparison, evaluate an alternative design, and defend a conditional recommendation plus reversal criterion."
	}
};

const GENERIC_PHYSICS_TITLES: Record<string, string> = {
	"Concept Path": "Concept Map",
	"Model and Reasoning Toolkit": "Model Routine",
	"Worked Example Set": "Worked Cases",
	"Investigation, Simulation, or Case Study": "Evidence Investigation"
};

function introPhysicsTopic(moduleTitle: string) {
	return moduleTitle.replace(/^PHY\d+\s+/u, "").trim();
}

function contextualPhysicsTitle(moduleTitle: string, itemTitle: string) {
	const replacement = GENERIC_PHYSICS_TITLES[itemTitle];
	return replacement
		? `${introPhysicsTopic(moduleTitle)}: ${replacement}`
		: itemTitle;
}

function introPhysicsCurriculumPath(
	stage: IntroPhysicsModuleFlow["stage"]
): RawCourseModuleItem["learningPath"] {
	return stage === "Guided extension" ? "choice" : "core";
}

function introPhysicsProjectPath(
	title: string
): RawCourseModuleItem["learningPath"] {
	if (/Readiness Check$/i.test(title)) return "core";
	if (/Failure Modes$/i.test(title)) return "choice";
	return "challenge";
}

function introPhysicsProjectCompletion(
	title: string,
	flow: IntroPhysicsModuleFlow
) {
	if (/Readiness Check$/i.test(title)) {
		return `Core: complete the supplied readiness cases, preserve units and signs, identify the relevant system or representation, and justify each answer with one exact evidence point. Stretch: diagnose one alternate interpretation, quantify one comparison, and state which model assumption or missing measurement controls confidence.`;
	}

	if (/Failure Modes$/i.test(title)) {
		return `Core: correct at least three supplied errors and explain why each correction changes the physical meaning rather than only the wording. Stretch: connect each error to a graph, diagram, calculation, or boundary condition and create one transfer case that reveals the same misconception in a new setting.`;
	}

	return `Core: ${flow.projectCore} Stretch: ${flow.projectStretch}`;
}

export const introToPhysicsCourse: RawCourse = {
	...introToPhysicsSourceCourse,
	modules: introToPhysicsSourceCourse.modules.map(module => {
		const flow = INTRO_PHYSICS_FLOW[module.title];
		if (!flow) {
			throw new Error(
				`Missing Intro to Physics flow for ${module.title}.`
			);
		}

		const curriculum = module.curriculum.map((item, itemIndex) => ({
			...item,
			title: contextualPhysicsTitle(module.title, item.title),
			content: [
				itemIndex === 0
					? `**Teaching flow:** ${flow.stage}. No physical apparatus, personal device, home electricity, dropped-object activity, outdoor timing, camera, microphone, or learner household data is required. Begin with the supplied phenomenon, predict before calculating, inspect evidence, complete the core route, and revise one representation or claim.`
					: "",
				item.content,
				`**Guiding phenomenon:** ${flow.phenomenon}`,
				`**Core route:** ${flow.corePath}`,
				`**Stretch route:** ${flow.stretchPath}`,
				`**Evidence gate:** ${flow.evidenceGate}`,
				`**Calculation and model boundary:** ${flow.boundary}`,
				`**Reference:** [Open the authoritative module reference](${flow.referenceLink}).`
			]
				.filter(Boolean)
				.join("\n\n"),
			learningPath: introPhysicsCurriculumPath(flow.stage),
			datasetLink:
				item.datasetLink ?? introPhysicsMaterial(flow.materialSection),
			solutionLink:
				item.solutionLink ?? introPhysicsAnswerKey(flow.answerSection),
			projectLink: item.projectLink ?? flow.referenceLink
		}));

		const supplementalProjects = module.supplementalProjects.map(item => ({
			...item,
			content: [
				item.content,
				`**Course stage:** ${flow.stage}.`,
				`**Guiding phenomenon:** ${flow.phenomenon}`,
				`**Completion route:** ${introPhysicsProjectCompletion(item.title, flow)}`,
				`**Evidence gate:** ${flow.evidenceGate}`,
				`**Calculation and model boundary:** ${flow.boundary}`
			].join("\n\n"),
			learningPath: introPhysicsProjectPath(item.title),
			datasetLink:
				item.datasetLink ?? introPhysicsMaterial(flow.materialSection),
			solutionLink:
				item.solutionLink ?? introPhysicsAnswerKey(flow.answerSection),
			projectLink: item.projectLink ?? flow.referenceLink
		}));

		return {
			...module,
			estimatedTime: flow.estimatedTime,
			keyBlocks: flow.keyBlocks,
			curriculum,
			supplementalProjects
		};
	}),
	developmentMetadata: {
		priority: "soon",
		standards: [
			"NGSS high-school physical science practices and crosscutting concepts at an algebra-based introductory level",
			"SI quantity, unit, graph, uncertainty, and scientific-model communication conventions",
			"Mechanics, energy, circuits, waves, thermal physics, optics, electromagnetism, orbit, and bounded modern-physics reasoning",
			"Evidence practices across tables, graphs, free-body diagrams, energy accounts, circuit schematics, ray diagrams, and simulations",
			"Engineering criteria, constraints, fair comparison, tradeoff analysis, revision, and defense"
		],
		sourcePolicy:
			"Preserves all 17 modules and 51 named checkpoints, misconception studies, and projects while organizing the course into seven core-foundation modules, nine guided extensions, and one final synthesis. Every route works from a supplied local dataset or case, an answer and rubric link, and a verified public reference.",
		assessmentCadence: [
			"Prediction before calculation or simulation in every module",
			"One unit-aware graph, diagram, table, or model with a reasonableness check",
			"One bounded claim supported by exact evidence and one stated model limit",
			"One core route plus an optional stretch route using the same phenomenon",
			"One corrected misconception and one changed-condition transfer",
			"Substantive revision after rubric feedback in both capstone stages"
		],
		toolchain: [
			"Notebook, paper, spreadsheet, graphing tool, or digital document",
			"Supplied Intro Physics materials pack and rubrics answer key",
			"Shared tables, graphs, diagrams, simulation states, and structured case descriptions",
			"NIST SI references, OpenStax Physics, PhET physics simulations, and NASA orbit references",
			"Optional interactive simulations with a supplied noninteractive table, image description, or diagram route"
		],
		safetyPolicy: [
			"No required physical apparatus, home electrical work, dropped objects, projectiles, outdoor timing, heat sources, optical exposure, magnets, sound recording, or personal devices",
			"No required learner health, reaction-time, home-energy, location, household-resource, camera, or microphone data",
			"Supplied fictional cases and datasets remain sufficient for every assessment",
			"Graphs and diagrams include labels and text descriptions; audio has waveform or transcript alternatives; color is never the only signal",
			"Engineering, energy, impact-safety, and device conclusions remain educational models rather than professional certification"
		],
		courseBoundaries: [
			"PHY1–PHY7 form the complete introductory foundation; PHY8–PHY16 are guided extensions rather than hidden prerequisites for the first capstone",
			"PHY17 is the final synthesis and can draw from any completed foundation or extension thread",
			"Observation, measurement, calculation, inference, model, approximation, and recommendation remain distinct",
			"Every equation is tied to a named system, coordinate convention, quantity definition, units, assumptions, and operating range",
			"Classical models remain useful inside their tested domains even when later evidence motivates a refined model"
		],
		capstoneExpectations: [
			"Focused question or design problem grounded in a supplied phenomenon",
			"Traceable source and data record with units and preserved raw values",
			"Labeled graph, diagram, or model plus calculation and reasonableness check",
			"Claim or recommendation with exact evidence, mechanism, limitation, and alternative",
			"Criteria, constraints, fair comparison, and tradeoff record for design work",
			"Before-and-after revision plus an answer to what evidence would change the conclusion"
		],
		recommendedNextWork: [
			"Add anonymized exemplars at several algebra and communication levels after classroom use identifies the most valuable cases.",
			"Archive selected simulation states as locally owned screenshots and structured tables so external tools never become continuity requirements.",
			"Map the foundation and extension routes to the target district's exact course calendar and adopted standards sequence."
		]
	}
};
