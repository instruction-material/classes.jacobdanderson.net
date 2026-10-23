import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const swiftSourceRevision = "d632ceb25abfac35ec4604babc9ea385a6afbcc2";
export const swiftWelcomePack = "SAD1-Welcome-Profile-App";
export const swiftWelcomeRoot = `https://github.com/instruction-material/Swift/tree/${swiftSourceRevision}/${swiftWelcomePack}`;
export const swiftWelcomeRoleFiles = [
	"ContentView.swift",
	"WelcomeProfileApp.swift"
] as const;

export function swiftCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "swift" ||
		resource.mode !== "tree" ||
		!["main", swiftSourceRevision].includes(resource.ref) ||
		![
			`${swiftWelcomePack}/starter`,
			`${swiftWelcomePack}/solution`
		].includes(resource.path)
	) {
		return null;
	}
	return {
		resource: { ...resource, ref: swiftSourceRevision },
		pack: swiftWelcomePack,
		role: resource.path.endsWith("/starter")
			? ("starter" as const)
			: ("solution" as const)
	};
}

export function swiftCourseResourceUrl(url: string) {
	const selected = swiftCourseResource(url);
	return selected ? `${swiftWelcomeRoot}/${selected.role}` : null;
}

export function swiftCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	return courseID === "intro-to-swift-app-development" &&
		swiftCourseResource(url)
		? `${courseID}:welcome-profile:${role}:native-swift-v1`
		: `${courseID}:${itemID}:${role}`;
}

export function swiftImportFiles(url: string) {
	const selected = swiftCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	return [
		...swiftWelcomeRoleFiles.map(name => ({
			name: `${role}/${name}`,
			path: `${pack}/${role}/${name}`
		})),
		{ name: "README.md", path: `${pack}/README.md` }
	].map(({ name, path }) => ({
		name,
		file: {
			path,
			htmlUrl: `https://github.com/${resource.owner}/${resource.repo}/blob/${resource.ref}/${path}`,
			rawUrl: githubRawUrl(resource, path),
			label: name,
			size: null
		}
	}));
}
