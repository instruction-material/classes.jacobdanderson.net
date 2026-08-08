import { describe, expect, it } from "vitest";
import { pageTitleForPath } from "@/modules/pageHead";

describe("page head helpers", () => {
	it.each([
		["/", "Classes with Jacob"],
		["/bluej", "IDE | Classes with Jacob"],
		["/coding_standard", "Coding Standard | Classes with Jacob"],
		["/courses", "Courses | Classes with Jacob"],
		["/pathways", "Pathways | Classes with Jacob"],
		[
			"/course-resource?asset=/course-assets/python/reference.md",
			"Course Resource | Classes with Jacob"
		],
		["/graph-sketcher", "Graph Sketcher | Classes with Jacob"],
		["/ide", "IDE | Classes with Jacob"],
		["/python-ide", "IDE | Classes with Jacob"],
		["/signup", "Book a Class | Classes with Jacob"],
		["/payment/", "Tuition | Classes with Jacob"],
		["/profile", "Account | Classes with Jacob"],
		["/reset-password?token=secret", "Reset Password | Classes with Jacob"],
		["/admin/mdmail", "Mail Tools | Classes with Jacob"],
		[
			"/admin/student-management",
			"Student Management | Classes with Jacob"
		],
		["/not-a-real-page", "Page Not Found | Classes with Jacob"]
	])("returns a useful title for %s", (path, title) => {
		expect(pageTitleForPath(path)).toBe(title);
	});
});
