interface ScratchFluencyDrillOptions {
	project: string;
	focus: string;
	restartCheck: string;
}

interface ScratchOpenEndedVariantOptions {
	project: string;
	coreIdea: string;
	variation: string;
	evidence: string;
}

export const scratchCostumeEditingGuide = `**Costume edits:** Select the sprite's thumbnail before opening Code or Costumes. To replace its art while keeping its scripts, add a costume to that sprite: in Costumes, hover over the costume chooser and select **Upload Costume**, or paint a new costume. The stage owns backdrops; each sprite owns its costumes and scripts.

For a bitmap costume, choose a visibly different fill color and click inside a closed outline. If the color spreads outside, undo, zoom in and close the gap before filling again. Filling with the existing color can appear to do nothing. Bitmap art uses pixels; vector art uses shapes. Use an actual transparent background for imported art, rather than a checkerboard drawn into the image.`;

export function buildScratchFluencyDrill({
	project,
	focus,
	restartCheck
}: ScratchFluencyDrillOptions) {
	return `**Fluency goal:** Rebuild the central ${project} behavior in a smaller Scratch scene so the core idea can be tested quickly.

**Practice path:** Focus on ${focus}. Keep the sprite count low, name the variables or broadcasts clearly, and make each script visibly affect the stage.

**Completion check:** Run the mini-project twice from the green flag. ${restartCheck} Record one sentence naming the Scratch block or variable most responsible for the result.`;
}

export function buildScratchOpenEndedVariant({
	project,
	coreIdea,
	variation,
	evidence
}: ScratchOpenEndedVariantOptions) {
	return `**Variant goal:** Build a new ${project} variation that changes ${variation} while preserving ${coreIdea}.

**Design path:** Start from a working version, then change one rule deliberately. Name the trigger, the state being tracked, and the feedback that proves the rule worked.

**Independent start:** For a separate original version, [open an empty Scratch project](/ide?mode=scratch&starter=blank). Download the working .sb3 file before starting a new scene. Download the new project as well; use **Open .sb3** in the IDE to continue it next time.

**Verification:** Test the normal path, one boundary case, and a fresh green-flag restart. ${evidence}`;
}
