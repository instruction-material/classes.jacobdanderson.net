const STATIC_INSTRUCTION_HOSTS = new Set([
	"static.junilearning.com",
	"static.classes.jacobdanderson.net"
]);
const YOUTUBE_HOSTS = new Set([
	"youtube.com",
	"www.youtube.com",
	"m.youtube.com"
]);
const YOUTUBE_PATH_PREFIXES = new Set(["embed", "live", "shorts"]);
const SCIENCE_RESOURCE_DOMAINS = [
	"biointeractive.org",
	"nasa.gov",
	"noaa.gov",
	"usgs.gov"
] as const;
const NIST_SI_PATHS = new Set([
	"/pml/owm/metric-si/si-units",
	"/pml/weights-and-measures/si-units"
]);
const PRIMARY_NIST_HOSTS = new Set(["nist.gov", "www.nist.gov"]);
const SCRATCH_PROJECT_ID_RE = /^\d+$/;
const SCRATCH_PROJECT_PATH_RE = /^\/projects\/(\d+)\/?$/;

function parsePublicHttpsUrl(value: string) {
	try {
		const parsed = new URL(value);
		if (
			parsed.protocol !== "https:" ||
			parsed.username ||
			parsed.password ||
			parsed.port
		) {
			return null;
		}
		return parsed;
	} catch {
		return null;
	}
}

function pathSegments(url: URL) {
	return url.pathname.split("/").filter(Boolean);
}

function hostnameIsDomain(hostname: string, domain: string) {
	return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function isGitHubUrl(value: string) {
	return parsePublicHttpsUrl(value)?.hostname === "github.com";
}

export function isGitHubRepositoryUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	return (
		parsed?.hostname === "github.com" && pathSegments(parsed).length >= 2
	);
}

export function isScratchProjectUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (parsed?.hostname !== "scratch.mit.edu") return false;

	const segments = pathSegments(parsed);
	return (
		segments[0] === "projects" &&
		SCRATCH_PROJECT_ID_RE.test(segments[1] ?? "")
	);
}

export function scratchProjectEmbedUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (
		parsed?.hostname !== "scratch.mit.edu" ||
		parsed.search ||
		parsed.hash
	) {
		return null;
	}

	const projectId = parsed.pathname.match(SCRATCH_PROJECT_PATH_RE)?.[1];
	return projectId
		? `https://scratch.mit.edu/projects/${projectId}/embed`
		: null;
}

export function isPhetResourceUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	return parsed?.hostname === "phet.colorado.edu" && parsed.pathname !== "/";
}

export function isInstructionMaterialResourceUrl(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return false;

	const segments = pathSegments(parsed);
	if (parsed.hostname === "github.com") {
		return (
			segments[0]?.toLowerCase() === "instruction-material" &&
			Boolean(segments[1])
		);
	}

	if (parsed.hostname === "scratch.mit.edu") {
		return (
			segments[0] === "projects" &&
			SCRATCH_PROJECT_ID_RE.test(segments[1] ?? "")
		);
	}

	return STATIC_INSTRUCTION_HOSTS.has(parsed.hostname) && segments.length > 0;
}

export function externalDatasetResourceLabel(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return null;

	const pathname = parsed.pathname.toLowerCase().replace(/\/+$/u, "") || "/";
	if (hostnameIsDomain(parsed.hostname, "acs.org")) {
		if (pathname === "/education/whatischemistry/periodictable.html") {
			return "ACS periodic table";
		}
		if (
			pathname ===
			"/education/policies/middle-and-high-school-chemistry.html"
		) {
			return "ACS chemistry guidelines";
		}
		return "ACS chemistry reference";
	}
	if (hostnameIsDomain(parsed.hostname, "nist.gov") && pathname !== "/") {
		if (
			PRIMARY_NIST_HOSTS.has(parsed.hostname) &&
			NIST_SI_PATHS.has(pathname)
		) {
			return "NIST SI units";
		}
		return "NIST reference";
	}
	if (hostnameIsDomain(parsed.hostname, "nextgenscience.org")) {
		if (pathname === "/resources/ngss-appendices") {
			return "NGSS appendices";
		}
		if (pathname !== "/") return "NGSS reference";
	}
	if (hostnameIsDomain(parsed.hostname, "openstax.org") && pathname !== "/") {
		return "OpenStax reference";
	}
	if (
		parsed.hostname === "pubchem.ncbi.nlm.nih.gov" &&
		(pathname === "/" || pathname.startsWith("/periodic-table"))
	) {
		return "Chemistry database";
	}
	if (
		SCIENCE_RESOURCE_DOMAINS.some(domain =>
			hostnameIsDomain(parsed.hostname, domain)
		) &&
		pathname !== "/"
	) {
		return "Science resource";
	}

	return null;
}

export function externalMediaResourceLabel(value: string) {
	const parsed = parsePublicHttpsUrl(value);
	if (!parsed) return null;

	const segments = pathSegments(parsed);
	const pathname = parsed.pathname.replace(/\/+$/u, "") || "/";
	if (parsed.hostname === "phet.colorado.edu") {
		if (pathname === "/en/simulations/filter") {
			return "Simulation collection";
		}
		if (
			segments[0] === "en" &&
			segments[1] === "simulations" &&
			Boolean(segments[2])
		) {
			return "PhET simulation";
		}
		if (
			segments[0] === "files" &&
			segments[1] === "guides" &&
			Boolean(segments[2])
		) {
			return "PhET guide";
		}
		if (pathname !== "/") return "PhET resource";
		return null;
	}

	if (parsed.hostname === "youtu.be" && Boolean(segments[0])) {
		return "Demo video";
	}
	if (YOUTUBE_HOSTS.has(parsed.hostname)) {
		if (segments[0] === "watch" && parsed.searchParams.get("v")) {
			return "Demo video";
		}
		if (
			YOUTUBE_PATH_PREFIXES.has(segments[0] ?? "") &&
			Boolean(segments[1])
		) {
			return "Demo video";
		}
	}
	if (
		hostnameIsDomain(parsed.hostname, "javalab.org") &&
		segments.length > 0
	) {
		return "Interactive simulation";
	}

	return null;
}
