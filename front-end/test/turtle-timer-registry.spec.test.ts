import { describe, expect, it, vi } from "vitest";
import { createTurtleTimerRegistry } from "../src/modules/turtleTimerRegistry";

function createFixture() {
	let nextHandle = 0;
	const scheduled = new Map<number, () => void>();
	const cancel = vi.fn((handle: number) => {
		scheduled.delete(handle);
	});
	const onPendingChange = vi.fn();
	const onReleaseFailure = vi.fn();
	const registry = createTurtleTimerRegistry({
		schedule(callback: () => void) {
			const handle = ++nextHandle;
			scheduled.set(handle, callback);
			return handle;
		},
		cancel,
		onPendingChange,
		onReleaseFailure
	});
	return { registry, scheduled, cancel, onPendingChange, onReleaseFailure };
}

describe("Turtle timer callback ownership", () => {
	it("destroys canceled one-shot callbacks exactly once", () => {
		const fixture = createFixture();
		const callback = Object.assign(vi.fn(), { destroy: vi.fn() });
		fixture.registry.schedule(1_000, async () => callback(), callback);

		expect(fixture.onPendingChange).toHaveBeenLastCalledWith(1);
		fixture.registry.clear();
		fixture.registry.clear();

		expect(fixture.cancel).toHaveBeenCalledOnce();
		expect(callback).not.toHaveBeenCalled();
		expect(callback.destroy).toHaveBeenCalledOnce();
		expect(fixture.scheduled.size).toBe(0);
		expect(fixture.onPendingChange).toHaveBeenLastCalledWith(0);
	});

	it("releases a fired one-shot callback after dispatch", async () => {
		const fixture = createFixture();
		const callback = Object.assign(vi.fn(), { destroy: vi.fn() });
		fixture.registry.schedule(1, async () => callback(), callback);
		fixture.scheduled.get(1)?.();
		fixture.registry.clear();
		await vi.waitFor(() => expect(callback.destroy).toHaveBeenCalledOnce());

		expect(callback).toHaveBeenCalledOnce();
		expect(fixture.cancel).not.toHaveBeenCalled();
	});

	it("does not destroy a recurring callback owned by the Python loop", async () => {
		const fixture = createFixture();
		const callback = Object.assign(vi.fn(), { destroy: vi.fn() });
		fixture.registry.schedule(8, async () => callback());
		fixture.scheduled.get(1)?.();
		await vi.waitFor(() => expect(callback).toHaveBeenCalledOnce());

		expect(callback.destroy).not.toHaveBeenCalled();
	});

	it("continues canceling other timers after one proxy release fails", () => {
		const fixture = createFixture();
		const broken = Object.assign(vi.fn(), {
			destroy: vi.fn(() => {
				throw new Error("private runtime detail");
			})
		});
		const healthy = Object.assign(vi.fn(), { destroy: vi.fn() });
		fixture.registry.schedule(1_000, async () => broken(), broken);
		fixture.registry.schedule(1_000, async () => healthy(), healthy);

		fixture.registry.clear();

		expect(fixture.cancel).toHaveBeenCalledTimes(2);
		expect(healthy.destroy).toHaveBeenCalledOnce();
		expect(fixture.onReleaseFailure).toHaveBeenCalledOnce();
		expect(fixture.scheduled.size).toBe(0);
	});
});
