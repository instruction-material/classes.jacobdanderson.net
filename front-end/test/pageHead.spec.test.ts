import { describe, expect, it } from "vitest";
import { pageTitleForPath } from "@/modules/pageHead";

describe("page head helpers", () => {
	it.each([
		["/", "Classes"],
		["/bluej", "IDE | Classes"],
		["/courses", "Courses | Classes"],
		["/pathways", "Pathways | Classes"],
		[
			"/course-resource?asset=/course-assets/python/reference.md",
			"Course Resource | Classes"
		],
		["/graph-sketcher", "Graph Sketcher | Classes"],
		["/ide", "IDE | Classes"],
		["/python-ide", "IDE | Classes"],
		["/signup", "Book a Class | Classes"],
		["/payment/", "Tuition | Classes"],
		["/profile", "Account | Classes"],
		["/reset-password?token=secret", "Reset Password | Classes"],
		["/admin/mdmail", "Mail Tools | Classes"],
		[
			"/admin/student-management",
			"Student Management | Classes"
		],
		["/not-a-real-page", "Page Not Found | Classes"]
	])("returns a useful title for %s", (path, title) => {
		expect(pageTitleForPath(path)).toBe(title);
	});
});
