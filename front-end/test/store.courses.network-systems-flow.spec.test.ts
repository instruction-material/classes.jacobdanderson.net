import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { loadRawCourse } from "@/stores/courses/index";
import { networkSystemsCourse } from "@/stores/courses/network-systems";

const EXPECTED_CORE_SEQUENCE = [
	"NS0 Setup and Tooling",
	"Unit 1: The Network Stack in Plain English",
	"Unit 2: Addresses and Naming",
	"Unit 3: Switches, Routers, NAT, and the Internet Edge",
	"Unit 4: Ports and Listening Services",
	"Unit 5: DNS and Name Resolution",
	"Unit 6: Core Diagnostics",
	"Unit 7: Linux Interface and Route Management",
	"Unit 8: IPv6 in Practice",
	"Unit 9: Firewalls and Host Policy",
	"Unit 10: Packet Capture and Deep Inspection",
	"Unit 11: Common Application Protocols",
	"Unit 12: Secure Exposure of Services",
	"Network Systems Lab 17: Operations Capstone Studio"
];

const PRACTICE_SECTIONS = [
	"lab-boundary-and-readiness-case",
	"request-path-and-transport-case",
	"address-name-and-scope-case",
	"subnet-route-and-nat-case",
	"listener-and-reachability-case",
	"dns-resolution-and-cache-case",
	"diagnostic-evidence-ladder-case",
	"interface-route-and-neighbor-case",
	"ipv6-dual-stack-case",
	"firewall-policy-and-rollback-case",
	"bounded-packet-capture-case",
	"protocol-and-tls-visibility-case",
	"least-exposure-service-case",
	"routed-operations-capstone-case"
];

const ANSWER_SECTIONS = PRACTICE_SECTIONS.map(section =>
	section.replace(/-case$/u, "-key")
);

async function requireNetworkSystemsCourse() {
	const course = await loadRawCourse("network-systems");
	expect(course).not.toBeNull();
	return course!;
}

function courseItems(module: (typeof networkSystemsCourse.modules)[number]) {
	return [...module.curriculum, ...module.supplementalProjects];
}

function markdownHeadingSlugs(markdown: string) {
	return new Set(
		[...markdown.matchAll(/^#{1,6}\s+(.+)$/gmu)].map(([, heading]) =>
			heading
				.toLowerCase()
				.replace(/[`*_]/gu, "")
				.replace(/[^\p{L}\p{N}\s-]/gu, "")
				.trim()
				.replace(/\s+/gu, "-")
				.replace(/-+/gu, "-")
		)
	);
}

function assetText(filename: string) {
	return fs.readFileSync(
		path.resolve(__dirname, `../public/course-assets/network/${filename}`),
		"utf8"
	);
}

describe("Network Systems learner flow", () => {
	it("keeps one coherent foundation-to-routed-operations-capstone core", async () => {
		const loaded = await requireNetworkSystemsCourse();
		const loadedCore = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		expect(
			networkSystemsCourse.modules
				.slice(0, 14)
				.map(module => module.title)
		).toEqual(EXPECTED_CORE_SEQUENCE);
		expect(loadedCore.map(module => module.title)).toEqual(
			EXPECTED_CORE_SEQUENCE
		);
		expect(loadedCore).toHaveLength(14);
		expect(loadedCore.every(module => module.kind === "module")).toBe(true);
	});

	it("moves expansion topics and two repetitive studios into one optional archive", () => {
		const archive = networkSystemsCourse.modules.at(-1);
		const text = JSON.stringify(archive);

		expect(archive?.title).toBe(
			"Optional Network Expansion and Integration Studio Archive"
		);
		expect(archive?.kind).toBe("appendix");
		expect(archive?.curriculum).toHaveLength(1);
		expect(archive?.supplementalProjects).toHaveLength(22);
		expect(
			courseItems(archive!).every(item => item.learningPath !== "core")
		).toBe(true);
		expect(text).toContain("NS13 Expansion Ideas and Next Steps");
		expect(text).toContain(
			"Network Systems Lab 15: Diagnostic Workflow Studio"
		);
		expect(text).toContain(
			"Network Systems Lab 16: Service Exposure Studio"
		);
		expect(text).toContain("completing all three is not required");
	});

	it("adds a bounded schedule and six-part evidence map to every core module", () => {
		for (const module of networkSystemsCourse.modules.slice(0, 14)) {
			expect(module.estimatedTime, module.title).toMatch(/session/u);
			expect(module.keyBlocks, module.title).toHaveLength(6);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Course flow:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Safe practice route:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Evidence gate:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Local continuity:**"
			);
			expect(module.curriculum[0].content, module.title).toContain(
				"**Primary reference:**"
			);
		}
	});

	it("keeps existing source projects traceable while distinguishing starter and solution", () => {
		const projectItems = networkSystemsCourse.modules
			.flatMap(courseItems)
			.filter(item => item.projectLink);

		expect(projectItems.length).toBeGreaterThanOrEqual(65);
		for (const item of projectItems) {
			expect(item.projectLink, item.title).toContain(
				"github.com/instruction-material/Network-Systems"
			);
			expect(item.projectLink, item.title).toContain("/starter");
			expect(item.solutionLink, item.title).toContain("/solution");
			expect(item.solutionLink, item.title).not.toBe(item.projectLink);
			expect(item.datasetLink, item.title).toMatch(
				/^\/course-assets\/network\/network-systems-practice-pack\.md#/u
			);
			expect(item.mediaLink, item.title).toMatch(/^https:\/\//u);
		}
	});

	it("keeps every supplied case and verification anchor valid", () => {
		const practiceSlugs = markdownHeadingSlugs(
			assetText("network-systems-practice-pack.md")
		);
		const answerSlugs = markdownHeadingSlugs(
			assetText("network-systems-verification-guide.md")
		);

		for (const section of PRACTICE_SECTIONS) {
			expect(practiceSlugs, section).toContain(section);
		}
		for (const section of ANSWER_SECTIONS) {
			expect(answerSlugs, section).toContain(section);
		}

		for (const module of networkSystemsCourse.modules.slice(0, 14)) {
			const content = module.curriculum[0].content;
			const practiceMatch = content.match(
				/\/course-assets\/network\/network-systems-practice-pack\.md#([a-z0-9-]+)/u
			);
			const answerMatch = content.match(
				/\/course-assets\/network\/network-systems-verification-guide\.md#([a-z0-9-]+)/u
			);

			expect(practiceMatch, module.title).not.toBeNull();
			expect(answerMatch, module.title).not.toBeNull();
			expect(practiceSlugs, module.title).toContain(practiceMatch?.[1]);
			expect(answerSlugs, module.title).toContain(answerMatch?.[1]);
		}
	});

	it("uses current named Linux baselines and explicit network boundaries", async () => {
		const text = JSON.stringify(await requireNetworkSystemsCourse());

		expect(text).toContain("Ubuntu Server 26.04 LTS");
		expect(text).toContain("Debian 13");
		expect(text).toContain(
			"Network namespaces, host-only segments, or user-mode NAT"
		);
		expect(text).toContain(
			"bridged, public-cloud, school, employer, and production networks remain outside scope"
		);
		expect(text).toContain(
			"distribution, command version, address family, interface, and lab boundary"
		);
	});

	it("makes privileged, capture, and exposure work bounded and recoverable", async () => {
		const text = JSON.stringify(await requireNetworkSystemsCourse());

		expect(text).toContain(
			"Never flush, down, rename, or replace a host interface or default route"
		);
		expect(text).toContain("Never enable a generated policy blindly");
		expect(text).toContain(
			"Live capture is limited to traffic generated entirely inside the owned lab"
		);
		expect(text).toContain(
			"Public DNS, public certificates, router port forwarding"
		);
		expect(text).toContain(
			"Every change records the question, expected signature"
		);
		expect(assetText("network-systems-practice-pack.md")).toContain(
			"numbered-delete, reset, and snapshot rollback steps"
		);
	});

	it("provides a complete no-VM and no-capture route", async () => {
		const loaded = await requireNetworkSystemsCourse();
		const core = loaded.modules.filter(
			module => module.kind !== "appendix"
		);

		for (const module of core) {
			const text = JSON.stringify(module).replace(
				/\/course-resource\?asset=([^)"\s]+)/g,
				(_, asset: string) => decodeURIComponent(asset)
			);
			expect(text, module.title).toContain(
				"/course-assets/network/network-systems-practice-pack.md#"
			);
			expect(text, module.title).toContain(
				"/course-assets/network/network-systems-verification-guide.md#"
			);
		}

		expect(assetText("network-systems-practice-pack.md")).toContain(
			"All names, addresses, packet excerpts, DNS data, and service records are fictional"
		);
	});

	it("retains network-specific language and the six operational anchor labs", async () => {
		const text = JSON.stringify(await requireNetworkSystemsCourse());

		expect(text).toContain(
			"Interfaces attach a host to a network, frames move across the local link"
		);
		expect(text).toContain(
			"UFW provides a safe, readable host-policy layer"
		);
		expect(text).toContain(
			"The required course pass stays inside its owned isolated topology"
		);
		for (const folder of [
			"NS1-Listening-Services-Map",
			"NS2-Local-vs-Remote-Reachability-Diagnosis",
			"NS3-UFW-Web-Server-Policy",
			"NS4-IPv4-vs-IPv6-Resolution-Comparison",
			"NS5-Tcpdump-HTTP-Capture",
			"NS6-Router-NAT-Topology-Lab"
		]) {
			expect(text, folder).toContain(folder);
		}
	});

	it("publishes an honest source, safety, and capstone contract", async () => {
		const metadata = (await requireNetworkSystemsCourse())
			.developmentMetadata;

		expect(metadata).toBeDefined();
		expect(metadata?.standards.length).toBeGreaterThanOrEqual(5);
		expect(metadata?.toolchain).toHaveLength(5);
		expect(metadata?.safetyPolicy).toHaveLength(6);
		expect(metadata?.courseBoundaries).toHaveLength(4);
		expect(metadata?.capstoneExpectations).toHaveLength(6);
		expect(metadata?.sourcePolicy).toContain(
			"NS1–NS6 are the primary operational shell labs"
		);
		expect(metadata?.sourcePolicy).toContain(
			"numbered NS-* packs provide subject-specific Python instrumentation"
		);
	});
});
