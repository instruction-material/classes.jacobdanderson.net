import type { Tutor, User } from "@/stores/app";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { api } from "@/api";
import AdminProfile from "@/components/AdminProfile.vue";
import LearnerCourseAccess from "@/components/LearnerCourseAccess.vue";
import LearnerWorkspace from "@/components/LearnerWorkspace.vue";
import TutorProfile from "@/components/TutorProfile.vue";
import { useCourseAccessDrafts } from "@/composables/useCourseAccessDrafts";
import { useAppStore } from "@/stores/app";
import { getCourseCatalogEntry } from "@/stores/courses/index";

vi.mock("@/api", () => ({
	api: { get: vi.fn(), put: vi.fn(), post: vi.fn(), delete: vi.fn() }
}));
vi.mock("@/modules/pythonIde", () => ({
	fetchManagedPythonIdeProjects: vi.fn().mockResolvedValue([]),
	fetchManagedPythonIdeProject: vi.fn(),
	createPythonIdeProjectReview: vi.fn(),
	updatePythonIdeProjectReview: vi.fn(),
	isPythonIdeBinaryAssetFile: () => false
}));
const tutor: Tutor = {
	_id: "b".repeat(24),
	name: "Instructor",
	email: "instructor@example.invalid",
	age: 30,
	state: "GA",
	usersOfTutorLength: 2,
	coursePermissions: ["scratch-level-1", "python-level-1"],
	editTutors: false,
	saveEdit: "Save"
};
const students: User[] = ["Alex", "Sam"].map((name, index) => ({
	_id: (index ? "c" : "a").repeat(24),
	name,
	email: `${name.toLowerCase()}@example.invalid`,
	age: 12,
	state: "GA",
	tutors: [tutor],
	courseAccess: [index ? "python-level-1" : "scratch-level-1"],
	courseStatus: { [index ? "python-level-1" : "scratch-level-1"]: "current" },
	editUsers: false,
	saveEdit: "Save"
}));
const stubs = {
	RouterLink: { props: ["to"], template: "<a><slot /></a>" },
	SelfAccountSettings: {
		props: ["entity", "role"],
		template: "<section>Profile {{ entity.name }}</section>"
	},
	CourseAccessCodeManager: true,
	AccessibleDialog: {
		props: ["open"],
		template:
			'<div v-if="open" role="dialog"><slot/><slot name="footer"/></div>'
	}
};
beforeEach(() => {
	setActivePinia(createPinia());
	vi.clearAllMocks();
	vi.mocked(api.get).mockImplementation(async path => ({
		data:
			path === "/tutors"
				? [tutor]
				: path === "/admin-mail/recipients"
					? { recipients: [] }
					: String(path).endsWith("/schedule")
						? { scheduledSessions: [] }
						: String(path).endsWith("/session-notes/recent")
							? { sessionNotes: [] }
							: students
	}));
	vi.mocked(api.put).mockResolvedValue({ data: {} });
});
describe("shared learner workspace", () => {
	it("shows one student, loads tools only on demand and keys them to that student", async () => {
		const wrapper = mount(LearnerWorkspace, {
			props: {
				modelValue: students[0]._id,
				learners: students,
				"onUpdate:modelValue": value =>
					wrapper.setProps({ modelValue: value })
			},
			slots: {
				default:
					'<template #default="{learner}"><p>{{learner.name}} coursework</p></template>'
			},
			global: { stubs }
		});
		expect(wrapper.text()).toContain("Alex coursework");
		expect(wrapper.text()).not.toContain("Sam coursework");
		expect(api.get).not.toHaveBeenCalled();
		await wrapper.get('input[value="sessions"]').setValue();
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith(
			`/users/${students[0]._id}/schedule`
		);
		expect(wrapper.find(".tools-summary").exists()).toBe(false);
		expect(wrapper.findAll(".tool-editor")).toHaveLength(2);
		for (const editor of wrapper.findAll(".tool-editor")) {
			expect(
				editor
					.get(".workspace-disclosure__trigger")
					.attributes("aria-expanded")
			).toBe("false");
		}
		await wrapper.get("select").setValue(students[1]._id);
		await flushPromises();
		expect(wrapper.text()).toContain("Sam coursework");
		expect(wrapper.find(".session-tools").exists()).toBe(false);
		await wrapper.get('input[value="sessions"]').setValue();
		await flushPromises();
		expect(api.get).toHaveBeenCalledWith(
			`/users/${students[1]._id}/schedule`
		);
		wrapper.unmount();
	});
	it("keeps edits while changing views and requires confirmation to switch students", async () => {
		const wrapper = mount(LearnerWorkspace, {
			props: {
				modelValue: students[0]._id,
				learners: students,
				dirty: true,
				"onUpdate:modelValue": value =>
					wrapper.setProps({ modelValue: value })
			},
			global: { stubs }
		});
		await wrapper.get('input[value="sessions"]').setValue();
		await flushPromises();
		const note = wrapper.findAll("textarea").at(-1)!;
		await note.setValue("Unsaved note for Alex");
		await wrapper.get('input[value="courses"]').setValue();
		await wrapper.get('input[value="sessions"]').setValue();
		expect(wrapper.findAll("textarea").at(-1)!.element.value).toBe(
			"Unsaved note for Alex"
		);
		await wrapper.get("select").setValue(students[1]._id);
		expect(wrapper.find('[role="dialog"]').exists()).toBe(true);
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Keep editing")!
			.trigger("click");
		expect(wrapper.props("modelValue")).toBe(students[0]._id);
		await wrapper.get("select").setValue(students[1]._id);
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Discard and switch")!
			.trigger("click");
		await flushPromises();
		expect(wrapper.emitted("discard")?.[0]).toEqual([students[0]._id]);
		expect(wrapper.props("modelValue")).toBe(students[1]._id);
		wrapper.unmount();
	});
	it("disambiguates duplicate names by stable identity and removes revoked selections", async () => {
		const wrapper = mount(LearnerWorkspace, {
			props: {
				modelValue: students[0]._id,
				learners: students.map(user => ({ ...user, name: "Same Name" }))
			},
			global: { stubs }
		});
		expect(wrapper.findAll("option").map(option => option.text())).toEqual([
			"Same Name · aaaaaa",
			"Same Name · cccccc"
		]);
		await wrapper.setProps({ learners: [students[1]] });
		expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([
			students[1]._id
		]);
		wrapper.unmount();
	});
	it("keeps the selected student fixed while a save is in progress", async () => {
		const wrapper = mount(LearnerWorkspace, {
			props: {
				modelValue: students[0]._id,
				learners: students,
				busy: true
			},
			global: { stubs }
		});
		expect(wrapper.get("select").attributes("disabled")).toBeDefined();
		await wrapper.get("select").setValue(students[1]._id);
		expect(wrapper.emitted("update:modelValue")).toBeUndefined();
		wrapper.unmount();
	});

	it("never exposes privileged note sending to a normal instructor", () => {
		const wrapper = mount(LearnerWorkspace, {
			props: { modelValue: students[0]._id, learners: students },
			global: { stubs }
		});
		expect(wrapper.text()).not.toContain("Write session note");
		wrapper.unmount();
	});
});
describe("role-specific parents", () => {
	it("removes instructor account roster and course disclosures", () => {
		useAppStore().setCurrentTutor(tutor);
		const wrapper = mount(TutorProfile, {
			props: { mode: "account" },
			global: { stubs }
		});
		expect(wrapper.text()).toContain("Profile Instructor");
		expect(wrapper.text()).not.toMatch(
			/Courses and tutors|Learner roster|currently assigned/
		);
		expect(api.get).not.toHaveBeenCalled();
		wrapper.unmount();
	});
	it("does not display cached administrator students while an instructor roster is pending", async () => {
		const app = useAppStore();
		app.setCurrentTutor(tutor);
		app.setUsers([{ ...students[1], name: "Foreign cached learner" }]);
		let resolve!: (value: any) => void;
		vi.mocked(api.get).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const wrapper = mount(TutorProfile, {
			props: { mode: "teaching" },
			global: { stubs }
		});
		expect(wrapper.text()).not.toContain("Foreign cached learner");
		resolve({ data: students });
		await flushPromises();
		expect(wrapper.findAll(".learner-selector").length).toBe(1);
		expect(wrapper.text()).not.toMatch(
			/NAME|EMAIL|AGE|STATE|Promote to tutor|Delete learner/
		);
		wrapper.unmount();
	});
	it("ignores late roster results from a previous instructor", async () => {
		const app = useAppStore();
		app.setCurrentTutor(tutor);
		let resolve!: (value: any) => void;
		vi.mocked(api.get).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const wrapper = mount(TutorProfile, {
			props: { mode: "teaching" },
			global: { stubs }
		});
		app.setCurrentTutor({ ...tutor, _id: "d".repeat(24) });
		await flushPromises();
		resolve({
			data: [{ ...students[0], name: "Previous instructor student" }]
		});
		await flushPromises();
		expect(wrapper.text()).not.toContain("Previous instructor student");
		wrapper.unmount();
	});
	it("fails visibly on roster errors without showing stale students", async () => {
		useAppStore().setCurrentTutor(tutor);
		vi.mocked(api.get).mockRejectedValueOnce(
			new Error("private transport error")
		);
		const wrapper = mount(TutorProfile, {
			props: { mode: "teaching" },
			global: { stubs }
		});
		await flushPromises();
		expect(wrapper.text()).toContain("Unable to load your students");
		expect(wrapper.text()).not.toContain("private transport error");
		wrapper.unmount();
	});
	it("restores cancelled course drafts and saves through the tutor-scoped endpoint", async () => {
		useAppStore().setCurrentTutor(tutor);
		const wrapper = mount(TutorProfile, {
			props: { mode: "teaching" },
			global: { stubs }
		});
		await flushPromises();
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Edit course access")!
			.trigger("click");
		await wrapper.findAll('input[type="checkbox"]')[0].setValue(false);
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Cancel edits")!
			.trigger("click");
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Edit course access")!
			.trigger("click");
		expect(
			wrapper.findAll('input[type="checkbox"]')[0].element.checked
		).toBe(true);
		await wrapper
			.findAll("button")
			.find(button => button.text() === "Save courses")!
			.trigger("click");
		await flushPromises();
		expect(api.put).toHaveBeenCalledWith(
			`/users/${students[0]._id}/courses`,
			{
				courseIDs: ["scratch-level-1"],
				courseStatus: { "scratch-level-1": "current" }
			}
		);
		wrapper.unmount();
	});
	it("keeps saved permission names while offering only the listed courses", async () => {
		const legacyPermissions = [
			"intro-to-biology",
			"middle-school-c-grammar"
		];
		const defaultGet = vi.mocked(api.get).getMockImplementation()!;
		vi.mocked(api.get).mockImplementation(async (path, ...args) =>
			path === "/tutors"
				? { data: [{ ...tutor, coursePermissions: legacyPermissions }] }
				: defaultGet(path, ...args)
		);
		useAppStore().setCurrentAdmin({ _id: "admin" } as any);
		const wrapper = mount(AdminProfile, {
			props: { mode: "people" },
			global: { stubs }
		});
		try {
			await flushPromises();
			const biologyName = getCourseCatalogEntry("intro-to-biology")!.name;
			expect(
				wrapper
					.findAll(".summary-list")
					.map(list => list.text())
					.join(" ")
			).toContain(biologyName);
			await wrapper
				.get('button[aria-label="Edit courses for Instructor"]')
				.trigger("click");
			const labels = wrapper
				.findAll(".course-editor .checkbox-grid label")
				.map(label => label.text());
			expect(labels).toHaveLength(70);
			expect(labels).not.toContain(biologyName);
			for (const id of [
				"middle-school-c-grammar",
				"introduction-to-public-speaking"
			])
				expect(labels).toContain(getCourseCatalogEntry(id)!.name);
			await wrapper
				.get('button[aria-label="Save course access for Instructor"]')
				.trigger("click");
			await flushPromises();
			expect(api.put).toHaveBeenCalledWith(
				`/tutors/${tutor._id}/courses`,
				{
					courseIDs: legacyPermissions
				}
			);
		} finally {
			wrapper.unmount();
		}
	});
	it("interlocks instructor permission changes while their save is pending", async () => {
		useAppStore().setCurrentAdmin({ _id: "admin" } as any);
		const wrapper = mount(AdminProfile, {
			props: { mode: "people" },
			global: { stubs }
		});
		await flushPromises();
		await wrapper
			.get('button[aria-label="Edit courses for Instructor"]')
			.trigger("click");
		let resolve!: (value: any) => void;
		vi.mocked(api.put).mockImplementationOnce(
			() =>
				new Promise(done => {
					resolve = done;
				})
		);
		const save = wrapper.get(
			'button[aria-label="Save course access for Instructor"]'
		);
		await save.trigger("click");
		expect(
			wrapper.get(".instructor-selector select").attributes("disabled")
		).toBeDefined();
		expect(save.attributes("disabled")).toBeDefined();
		await save.trigger("click");
		expect(api.put).toHaveBeenCalledTimes(1);
		resolve({ data: {} });
		await flushPromises();
		expect(
			wrapper.get(".instructor-selector select").attributes("disabled")
		).toBeUndefined();
		wrapper.unmount();
	});

	it("uses the same one-student workspace for administrators and retains advanced controls", async () => {
		useAppStore().setCurrentAdmin({
			_id: "f".repeat(24),
			name: "Admin",
			email: "admin@example.invalid",
			editAdmins: false,
			saveEdit: "Save"
		});
		const wrapper = mount(AdminProfile, {
			props: { mode: "people" },
			global: { stubs }
		});
		await flushPromises();
		expect(wrapper.findAll(".learner-selector").length).toBe(1);
		expect(wrapper.find(".roster-search").exists()).toBe(false);
		expect(wrapper.text()).toContain("Write session note");
		expect(wrapper.text()).toContain("Promote to tutor");
		expect(wrapper.text()).toContain("Instructor permissions");
		expect(wrapper.findAll(".learner-course-access").length).toBe(1);
		wrapper.unmount();
	});
});
describe("shared course access drafts", () => {
	it("opens the chosen course with the selected student's stable identity", () => {
		const wrapper = mount(LearnerCourseAccess, {
			props: {
				courses: [{ id: "scratch-level-1", name: "Scratch Level 1" }],
				selected: ["scratch-level-1"],
				statuses: { "scratch-level-1": "current" },
				studentId: students[0]._id,
				studentName: "Alex"
			},
			global: { stubs }
		});
		expect(wrapper.findComponent(stubs.RouterLink).props("to")).toEqual({
			path: "/courses",
			query: { learner: students[0]._id },
			hash: "#scratch-level-1"
		});
		wrapper.unmount();
	});

	it("normalizes statuses, drops revoked selections and resets without mutating saved data", async () => {
		const learners = ref(students.map(user => ({ ...user })));
		const drafts = useCourseAccessDrafts(learners);
		drafts.toggle(students[0]._id, "python-level-1", true);
		drafts.setStatus(students[0]._id, "python-level-1", "past");
		expect(drafts.statuses.value[students[0]._id]["python-level-1"]).toBe(
			"past"
		);
		expect(learners.value[0].courseAccess).toEqual(["scratch-level-1"]);
		drafts.reset(students[0]._id);
		expect(drafts.selections.value[students[0]._id]).toEqual([
			"scratch-level-1"
		]);
		drafts.toggle("foreign", "python-level-1", true);
		expect(drafts.selections.value.foreign).toBeUndefined();
		learners.value = [];
		await flushPromises();
		expect(drafts.selections.value).toEqual({});
	});
	it("honors the parent permission boundary for checkboxes and status changes", () => {
		const wrapper = mount(LearnerCourseAccess, {
			props: {
				courses: [
					{ id: "allowed", name: "Allowed" },
					{ id: "foreign", name: "Foreign" }
				],
				selected: ["foreign"],
				statuses: { foreign: "current" },
				studentId: students[0]._id,
				studentName: "Alex",
				editable: true,
				allowed: new Set(["allowed"])
			},
			global: { stubs }
		});
		const foreign = wrapper
			.findAll("label")
			.find(label => label.text() === "Foreign")!;
		expect(foreign.get("input").attributes("disabled")).toBeDefined();
		expect(wrapper.get("select").attributes("disabled")).toBeDefined();
		wrapper.unmount();
	});
});
