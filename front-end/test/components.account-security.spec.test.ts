import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AccountSecurity from "@/components/AccountSecurity.vue";

const apiMocks = vi.hoisted(() => ({
	post: vi.fn()
}));

vi.mock("@/api", () => ({
	api: {
		post: apiMocks.post
	}
}));

describe("AccountSecurity", () => {
	beforeEach(() => {
		vi.resetAllMocks();
		setActivePinia(createPinia());
	});

	function mountPasswordForm(role: "admin" | "tutor" | "user" = "user") {
		return mount(AccountSecurity, {
			props: { email: "account@example.com", entityId: "account", role }
		});
	}

	async function fillPasswords(
		wrapper: ReturnType<typeof mountPasswordForm>
	) {
		await wrapper.get('[name="current-password"]').setValue("old-password");
		await wrapper.get('[name="new-password"]').setValue("new-password");
		await wrapper.get('[name="confirm-password"]').setValue("new-password");
	}

	function expectPasswordsCleared(
		wrapper: ReturnType<typeof mountPasswordForm>
	) {
		for (const input of wrapper.findAll<HTMLInputElement>(
			'input[type="password"]'
		)) {
			expect(input.element.value).toBe("");
		}
	}

	it.each(["admin", "tutor", "user"] as const)(
		"submits a %s password form once and clears password fields immediately",
		async role => {
			let resolveRequest!: () => void;
			apiMocks.post.mockImplementationOnce(
				() =>
					new Promise<void>(resolve => {
						resolveRequest = resolve;
					})
			);
			const wrapper = mountPasswordForm(role);
			await fillPasswords(wrapper);
			await wrapper.get("form").trigger("submit");
			await wrapper.get("form").trigger("submit");

			expect(apiMocks.post).toHaveBeenCalledTimes(1);
			expect(apiMocks.post).toHaveBeenCalledWith(
				"/accounts/changePassword/account",
				{
					currentPassword: "old-password",
					newPassword: "new-password"
				},
				{ signal: expect.any(AbortSignal), timeout: 30_000 }
			);
			expectPasswordsCleared(wrapper);
			expect(wrapper.get("form").attributes("aria-busy")).toBe("true");
			expect(
				wrapper.get<HTMLButtonElement>('button[type="submit"]').element
					.disabled
			).toBe(true);
			resolveRequest();
			await flushPromises();
			expect(wrapper.text()).toContain("Password updated successfully.");
			expect(wrapper.get("form").attributes("aria-busy")).toBe("false");
			expectPasswordsCleared(wrapper);
			wrapper.unmount();
		}
	);

	it("keeps validation local until both new passwords match", async () => {
		const wrapper = mountPasswordForm();
		await wrapper.get("form").trigger("submit");
		expect(wrapper.text()).toContain("New password is required.");
		await fillPasswords(wrapper);
		await wrapper
			.get('[name="confirm-password"]')
			.setValue("different-password");
		await wrapper.get("form").trigger("submit");
		expect(wrapper.text()).toContain("New passwords do not match.");
		expect(apiMocks.post).not.toHaveBeenCalled();
		wrapper.unmount();
	});

	it("clears passwords on failure and allows a deliberate retry", async () => {
		apiMocks.post.mockRejectedValueOnce({
			response: { data: { message: "Current password is incorrect." } }
		});
		const wrapper = mountPasswordForm();
		await fillPasswords(wrapper);
		await wrapper.get("form").trigger("submit");
		await flushPromises();
		expect(wrapper.text()).toContain("Current password is incorrect.");
		expectPasswordsCleared(wrapper);
		expect(
			wrapper.get<HTMLButtonElement>('button[type="submit"]').element
				.disabled
		).toBe(false);
		apiMocks.post.mockResolvedValueOnce({});
		await fillPasswords(wrapper);
		await wrapper.get("form").trigger("submit");
		await flushPromises();
		expect(apiMocks.post).toHaveBeenCalledTimes(2);
		expect(wrapper.text()).toContain("Password updated successfully.");
		expect(wrapper.text()).not.toContain("Current password is incorrect.");
		wrapper.unmount();
	});

	it.each([{ entityId: "another-account" }, { role: "admin" as const }])(
		"cancels an obsolete request when account identity changes: %j",
		async changedProps => {
			let resolveRequest!: () => void;
			apiMocks.post.mockImplementationOnce(
				() =>
					new Promise<void>(resolve => {
						resolveRequest = resolve;
					})
			);
			const wrapper = mountPasswordForm();
			await fillPasswords(wrapper);
			await wrapper.get("form").trigger("submit");
			const signal = apiMocks.post.mock.calls[0][2].signal as AbortSignal;
			await wrapper.setProps(changedProps);
			expect(signal.aborted).toBe(true);
			expectPasswordsCleared(wrapper);
			resolveRequest();
			await flushPromises();
			expect(wrapper.text()).not.toContain(
				"Password updated successfully."
			);
			expect(wrapper.get("form").attributes("aria-busy")).toBe("false");
			wrapper.unmount();
		}
	);

	it("aborts an outstanding request when the form is removed", async () => {
		let rejectRequest!: (error: Error) => void;
		apiMocks.post.mockImplementationOnce(
			() =>
				new Promise<void>((_resolve, reject) => {
					rejectRequest = reject;
				})
		);
		const wrapper = mountPasswordForm();
		await fillPasswords(wrapper);
		await wrapper.get("form").trigger("submit");
		const signal = apiMocks.post.mock.calls[0][2].signal as AbortSignal;
		wrapper.unmount();
		expect(signal.aborted).toBe(true);
		rejectRequest(new Error("Request canceled"));
		await flushPromises();
	});

	it("uses entity-specific form control ids", () => {
		const first = mount(AccountSecurity, {
			props: {
				email: "first@example.com",
				entityId: "first-user",
				role: "user"
			}
		});
		const second = mount(AccountSecurity, {
			props: {
				email: "second@example.com",
				entityId: "second-user",
				role: "user"
			}
		});

		expect(first.find("label").attributes("for")).toBe(
			"account-security-user-first-user-email"
		);
		expect(second.find("label").attributes("for")).toBe(
			"account-security-user-second-user-email"
		);
		expect(
			first.find("#account-security-user-first-user-email").exists()
		).toBe(true);
		expect(
			second.find("#account-security-user-second-user-email").exists()
		).toBe(true);
	});

	it("signs out every session, including the current browser, under Advanced Settings", async () => {
		apiMocks.post.mockResolvedValue({
			data: { message: "All sessions have been signed out." }
		});
		const wrapper = mount(AccountSecurity, {
			props: {
				email: "student@example.com",
				entityId: "student-user",
				role: "user"
			}
		});
		const button = wrapper
			.findAll("button")
			.find(candidate => candidate.text() === "Sign out of all sessions");

		expect(button).toBeDefined();
		await button!.trigger("click");
		await flushPromises();

		expect(wrapper.get(".advanced-settings").attributes("open")).toBeUndefined();
		expect(button!.classes()).toContain("btn-danger");
		expect(apiMocks.post).toHaveBeenCalledWith("/accounts/signout-all");
		expect(wrapper.text()).toContain(
			"All sessions have been signed out."
		);
	});
});
