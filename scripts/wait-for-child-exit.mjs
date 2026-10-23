export function waitForChildExitWithin(child, timeoutMs) {
	return new Promise(resolve => {
		if (child.exitCode !== null || child.signalCode) {
			resolve(true);
			return;
		}
		let timer;
		const onExit = () => {
			clearTimeout(timer);
			resolve(true);
		};
		timer = setTimeout(() => {
			child.off("exit", onExit);
			resolve(false);
		}, timeoutMs);
		child.once("exit", onExit);
	});
}
