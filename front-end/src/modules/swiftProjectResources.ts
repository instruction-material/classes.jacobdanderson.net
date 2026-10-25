import { githubRawUrl, parseGitHubResource } from "@/modules/codePreview";

export const swiftSourceRevision = "8e3b4fde509a52762711f901a0c1be7a69979016";
export const swiftWelcomePack = "SAD1-Welcome-Profile-App";
export const swiftWelcomeRoot = `https://github.com/instruction-material/Swift/tree/${swiftSourceRevision}/${swiftWelcomePack}`;
export const swiftWelcomeRoleFiles = [
	"ContentView.swift",
	"WelcomeProfileApp.swift"
] as const;

export const swiftNetworkingRevision =
	"d8110b0b359a7499a9de9fc3c31dfac26b411b3e";
export const swiftNetworkingPack = "SAD6-API-Reference-App";
export const swiftNetworkingRoot = `https://github.com/instruction-material/Swift/tree/${swiftNetworkingRevision}/${swiftNetworkingPack}`;

export const swiftTrackerRevision = "355afb7e8d3a9cc47e1d7ebb0ca714cf207e2dac";
const swiftTrackerEarlierRevisions = [
	"23e1cae59dd989b6f97d8d13ebb5f4718223424d",
	"73fdbeaf3f3358d4a3ce6bb8086612d52689e41a",
	"ff14c210700f7297d69ddfcab570a0315e9ac234",
	"a731a853e8f972314d060e9e291f43974949ffe7"
];
export const swiftTrackerPack = "SAD5-Simple-Tracker-App";
export const swiftTrackerRoot = `https://github.com/instruction-material/Swift/tree/${swiftTrackerRevision}/${swiftTrackerPack}`;
export const swiftDataTrackerPack = "SAD5-SwiftData-Tracker-App";
export const swiftDataTrackerRoot = `https://github.com/instruction-material/Swift/tree/${swiftTrackerRevision}/${swiftDataTrackerPack}`;

export const swiftCanonicalProjectsRevision =
	"18bb2a5055a144cf545fa416f6bde6f00e863f36";
export const swiftGalleryRevision = "507812397086107078b67dc193507e7c220f57a3";
export const swiftGalleryRoot = `https://github.com/instruction-material/Swift/tree/${swiftGalleryRevision}/SAD2-Media-Gallery-App`;
export const swiftHobbyRevision = "9c4599f12037847388a7760e82409c4481e0faf7";
export const swiftHobbyRoot = `https://github.com/instruction-material/Swift/tree/${swiftHobbyRevision}/SAD3-Multi-Tab-Hobby-App`;
export const swiftMapRoot = `https://github.com/instruction-material/Swift/tree/${swiftCanonicalProjectsRevision}/SAD4-Map-Places-App`;
export const swiftCapstoneRevision = "f562fa060de745466cfda5cb55e84c1811496ec5";
export const swiftCapstoneRoot = `https://github.com/instruction-material/Swift/tree/${swiftCapstoneRevision}/SAD7-Publish-Ready-Capstone`;

const swiftPacks = [
	{
		pack: "SAD2-Media-Gallery-App",
		revision: swiftGalleryRevision,
		projectKey: "media-gallery",
		roleFiles: ["ContentView.swift", "MediaGalleryApp.swift"],
		sharedFiles: ["README.md"]
	},
	{
		pack: "SAD3-Multi-Tab-Hobby-App",
		revision: swiftHobbyRevision,
		projectKey: "multi-tab-hobby",
		roleFiles: ["ContentView.swift", "MultiTabHobbyApp.swift"],
		sharedFiles: ["README.md"]
	},
	{
		pack: "SAD4-Map-Places-App",
		revision: swiftCanonicalProjectsRevision,
		projectKey: "map-places",
		roleFiles: ["ContentView.swift", "MapPlacesApp.swift"],
		sharedFiles: ["README.md"]
	},
	{
		pack: "SAD7-Publish-Ready-Capstone",
		revision: swiftCapstoneRevision,
		projectKey: "publish-ready-capstone",
		roleFiles: ["ContentView.swift", "PublishReadyCapstoneApp.swift"],
		sharedFiles: ["README.md"]
	},
	{
		pack: swiftWelcomePack,
		revision: swiftSourceRevision,
		projectKey: "welcome-profile",
		roleFiles: swiftWelcomeRoleFiles,
		sharedFiles: ["README.md"]
	},
	{
		pack: swiftTrackerPack,
		revision: swiftTrackerRevision,
		projectKey: "simple-tracker",
		roleFiles: [
			"ContentView.swift",
			"SimpleTrackerApp.swift",
			"TrackerItem.swift",
			"TrackerStore.swift"
		],
		sharedFiles: [
			"README.md",
			"verify-tracker.py",
			"tests/TrackerContracts.swift"
		]
	},
	{
		pack: swiftDataTrackerPack,
		revision: swiftTrackerRevision,
		projectKey: "swiftdata-tracker",
		roleFiles: [
			"ContentView.swift",
			"PersistentTrackerApp.swift",
			"TrackerRecord.swift",
			"TrackerPersistence.swift"
		],
		sharedFiles: [
			"README.md",
			"verify-persistence.py",
			"tests/PersistenceContracts.swift",
			"Package.swift",
			"tests/PersistenceTests.swift"
		]
	},
	{
		pack: swiftNetworkingPack,
		revision: swiftNetworkingRevision,
		projectKey: "api-reference",
		roleFiles: [
			"ContentView.swift",
			"APIReferenceApp.swift",
			"ReferenceClient.swift",
			"ReferenceStore.swift"
		],
		sharedFiles: [
			"README.md",
			"verify-networking.py",
			"tests/ReferenceContracts.swift"
		]
	}
] as const;

export function swiftCourseResource(url: string) {
	const resource = parseGitHubResource(url);
	if (
		!resource ||
		resource.owner.toLowerCase() !== "instruction-material" ||
		resource.repo.toLowerCase() !== "swift" ||
		resource.mode !== "tree"
	) {
		return null;
	}
	const selected = swiftPacks.find(
		pack =>
			[
				"main",
				pack.revision,
				...(pack.pack === swiftWelcomePack
					? ["d632ceb25abfac35ec4604babc9ea385a6afbcc2"]
					: []),
				...(pack.projectKey === "multi-tab-hobby"
					? ["97028a411bf4752f06ce7bab228211958b3fca9b"]
					: []),
				...(pack.pack === swiftTrackerPack ||
				pack.pack === swiftDataTrackerPack
					? swiftTrackerEarlierRevisions
					: pack.projectKey === "media-gallery" ||
						  pack.projectKey === "multi-tab-hobby" ||
						  pack.projectKey === "publish-ready-capstone"
						? [
								swiftCanonicalProjectsRevision,
								"58d17abb7a09185558a74c44f0ba2e43a18f42c2"
							]
						: pack.revision === swiftCanonicalProjectsRevision
							? ["58d17abb7a09185558a74c44f0ba2e43a18f42c2"]
							: [])
			].includes(resource.ref) &&
			[`${pack.pack}/starter`, `${pack.pack}/solution`].includes(
				resource.path
			)
	);
	if (!selected) return null;
	const revision = resource.ref === "main" ? selected.revision : resource.ref;
	return {
		...selected,
		revision,
		resource: { ...resource, ref: revision },
		role: resource.path.endsWith("/starter")
			? ("starter" as const)
			: ("solution" as const)
	};
}

export function swiftCourseResourceUrl(url: string) {
	const selected = swiftCourseResource(url);
	return selected
		? `https://github.com/${selected.resource.owner}/${selected.resource.repo}/tree/${selected.revision}/${selected.pack}/${selected.role}`
		: null;
}

export function swiftCourseProjectKey(
	courseID: string,
	itemID: string,
	role: "starter" | "reference",
	url: string
) {
	const selected = swiftCourseResource(url);
	return courseID === "intro-to-swift-app-development" && selected
		? `${courseID}:${selected.projectKey}:${role}:native-swift-v1`
		: `${courseID}:${itemID}:${role}`;
}

export function swiftImportFiles(url: string) {
	const selected = swiftCourseResource(url);
	if (!selected) return null;
	const { resource, pack, role } = selected;
	return [
		...selected.roleFiles.map(name => ({
			name: `${role}/${name}`,
			path: `${pack}/${role}/${name}`
		})),
		...selected.sharedFiles.map(name => ({ name, path: `${pack}/${name}` }))
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
