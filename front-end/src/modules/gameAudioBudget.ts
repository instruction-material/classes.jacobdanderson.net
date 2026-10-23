export function createGameAudioBudget() {
	const maxVoices = 32;
	const maxStartsPerSecond = 64;
	let activeVoices = 0;
	let tokens = maxStartsPerSecond;
	let lastUpdatedAt = 0;
	const allowRestart = (now: number) => {
		if (!Number.isFinite(now)) return false;
		const elapsed = Math.max(0, now - lastUpdatedAt);
		tokens = Math.min(
			maxStartsPerSecond,
			tokens + (elapsed * maxStartsPerSecond) / 1000
		);
		lastUpdatedAt = Math.max(lastUpdatedAt, now);
		if (tokens < 1) return false;
		tokens -= 1;
		return true;
	};

	return {
		acquire(now: number): (() => void) | null {
			if (activeVoices >= maxVoices || !allowRestart(now)) return null;

			activeVoices += 1;
			let released = false;
			return () => {
				if (released) return;
				released = true;
				activeVoices -= 1;
			};
		},
		allowRestart
	};
}
