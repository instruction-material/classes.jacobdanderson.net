import bootcampReferences from "../../../scripts/scratch/bootcamp-references.json";

const referenceIds = new Set(Object.values(bootcampReferences));
export function bootcampReferenceSourceId(id: string) {
	return referenceIds.has(id) ? id.replace(/-reference$/, "") : undefined;
}

export function scratchBootcampReferenceHref(starterId: string) {
	const references: Record<string, string> = bootcampReferences;
	const id = references[starterId];
	if (id) {
		return `/ide?${new URLSearchParams({
			mode: "scratch",
			originalProject: id,
			course: "scratch-level-1-bootcamp",
			role: "reference"
		})}`;
	}
}
