export function pythonIdeGamePointerPosition(
	clientX: number,
	clientY: number,
	rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
	width: number,
	height: number
) {
	if (rect.width <= 0 || rect.height <= 0) return { x: 0, y: 0 };
	// PyGame mouse events report integer positions in the game window.
	return {
		x: Math.floor(((clientX - rect.left) / rect.width) * width),
		y: Math.floor(((clientY - rect.top) / rect.height) * height)
	};
}

export function preparePythonIdeGameCanvas(
	canvas: HTMLCanvasElement,
	width: number,
	height: number
) {
	// Keep program pixels stable while CSS fits the game into the workspace.
	const nextWidth = Math.floor(width);
	const nextHeight = Math.floor(height);
	if (
		!Number.isFinite(nextWidth) ||
		!Number.isFinite(nextHeight) ||
		nextWidth < 1 ||
		nextHeight < 1 ||
		nextWidth > 8192 ||
		nextHeight > 8192 ||
		nextWidth * nextHeight > 16777216
	) {
		throw new Error("Game canvas dimensions exceed the supported range.");
	}
	if (canvas.width !== nextWidth) canvas.width = nextWidth;
	if (canvas.height !== nextHeight) canvas.height = nextHeight;
	const context = canvas.getContext("2d");
	context?.setTransform(1, 0, 0, 1, 0, 0);
	return context;
}

export function waitForPythonIdeGameImage(
	image: HTMLImageElement,
	timeoutMs = 10000
): Promise<boolean> {
	const loaded = () => image.naturalWidth > 0 && image.naturalHeight > 0;
	if (image.complete) return Promise.resolve(loaded());
	return new Promise(resolve => {
		let timer: ReturnType<typeof setTimeout>;
		const finish = () => {
			clearTimeout(timer);
			image.removeEventListener("load", finish);
			image.removeEventListener("error", finish);
			resolve(loaded());
		};
		timer = setTimeout(finish, timeoutMs);
		image.addEventListener("load", finish);
		image.addEventListener("error", finish);
	});
}
