# Connect the model result to its intended use

A model-use card states the question, source, audience, assumptions, likely misleading use and the review action that protects interpretation.

## Completed car example

**Intended use:** Compare categorical encodings and nearest-neighbor behavior on the supplied Car Evaluation fixture.

**Evidence:** The target labels come from a decision model applied to attribute combinations. The six inputs describe buying cost, maintenance, doors, capacity, luggage space and a categorical safety descriptor. Held-out metrics summarize prediction of that constructed rule.

**Main limit:** These observations contain no measured crash outcomes or evidence of a particular vehicle's physical condition. Decisions about an actual vehicle lie outside this classroom model's evidence.

**Failure mode:** An unseen buying value becomes an all-zero block under the fitted encoder's unknown-category rule. A prediction remains possible, while the identity of that new category is lost.

**Review action:** Inspect the retained vocabulary and the supplied unknown-category probe alongside class-level errors. Keep the constructed-label limitation beside the reported score.

For another project, fill the same fields using its actual source and report. The fictional-email example concerns authored message patterns; the country-year example concerns aggregate observations. Each needs its own specific interpretation boundary. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework) supplies a broader reference for describing intended use and risk.
