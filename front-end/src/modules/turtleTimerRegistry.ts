export type TurtleTimerCallback = (() => void) & { destroy?: () => void };

export function releaseTurtleTimerCallback(
	callback: TurtleTimerCallback | null | undefined,
	onFailure: () => void
) {
	try {
		callback?.destroy?.();
	} catch {
		onFailure();
	}
}

export function createTurtleTimerRegistry<Handle>(options: {
	schedule: (callback: () => void, delayMs: number) => Handle;
	cancel: (handle: Handle) => void;
	onPendingChange: (count: number) => void;
	onReleaseFailure: () => void;
}) {
	const pending = new Map<Handle, TurtleTimerCallback | null>();

	return {
		schedule(
			delayMs: number,
			run: () => Promise<void>,
			ownedCallback: TurtleTimerCallback | null = null
		) {
			const handle = options.schedule(
				() => {
					pending.delete(handle);
					options.onPendingChange(pending.size);
					void run().finally(() =>
						releaseTurtleTimerCallback(
							ownedCallback,
							options.onReleaseFailure
						)
					);
				},
				Math.max(0, delayMs)
			);
			pending.set(handle, ownedCallback);
			options.onPendingChange(pending.size);
		},
		clear() {
			for (const [handle, callback] of pending) {
				options.cancel(handle);
				releaseTurtleTimerCallback(callback, options.onReleaseFailure);
			}
			pending.clear();
			options.onPendingChange(0);
		}
	};
}
