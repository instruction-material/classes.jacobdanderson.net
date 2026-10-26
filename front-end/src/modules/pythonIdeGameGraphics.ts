import defaultGameFontUrl from "@/assets/fonts/pygame/freesansbold.ttf?url&no-inline";

const defaultGameFontFamily = "Classes Pygame Default";
let defaultGameFontPromise: Promise<void> | null = null;

function roundPythonPixel(value: number) {
	const lower = Math.floor(value);
	if (value - lower !== 0.5) return Math.round(value);
	return lower % 2 === 0 ? lower : lower + 1;
}

export function preparePythonIdeGameFont(): Promise<void> {
	if (defaultGameFontPromise) return defaultGameFontPromise;
	defaultGameFontPromise = (async () => {
		const font = new FontFace(
			defaultGameFontFamily,
			`url(${JSON.stringify(defaultGameFontUrl)})`
		);
		let timer: ReturnType<typeof setTimeout> | undefined;
		try {
			const loaded = await Promise.race([
				font.load(),
				new Promise<never>((_resolve, reject) => {
					timer = setTimeout(
						() => reject(new Error("Game font loading timed out.")),
						10000
					);
				})
			]);
			document.fonts.add(loaded);
		} catch (error) {
			throw new Error(
				"The game text font is unavailable. Run the project to retry.",
				{ cause: error }
			);
		} finally {
			clearTimeout(timer);
		}
	})().catch(error => {
		defaultGameFontPromise = null;
		throw error;
	});
	return defaultGameFontPromise;
}

export function drawPythonIdeGameText(
	context: CanvasRenderingContext2D,
	text: string,
	x: number,
	y: number,
	color: string,
	fontSize: number,
	anchorX = 0,
	anchorY = 0,
	align = anchorX,
	lineHeight = 1,
	shadowX = 0,
	shadowY = 0,
	shadowColor = "black"
) {
	// pygame.font.Font(None, size) scales the bundled default font by 11/16.
	const nominalSize = roundPythonPixel(fontSize);
	const size = Math.max(1, Math.trunc(nominalSize * 0.6875));
	context.save();
	try {
		context.font = `${size}px "${defaultGameFontFamily}"`;
		context.textAlign = "left";
		context.textBaseline = "alphabetic";
		const lines = text.split("\n").map(line => line.trimEnd());
		const widths = lines.map(line => context.measureText(line).width);
		const width = widths.reduce(
			(maximum, value) => Math.max(maximum, value),
			0
		);
		// FreeSans: 800 ascent, -200 descent and 90 line gap per 1000 units.
		const spacing = Math.ceil(size * 1.09) * lineHeight;
		const height = size + roundPythonPixel((lines.length - 1) * spacing);
		const shadowDx = Math.ceil((shadowX * nominalSize) / 18);
		const shadowDy = Math.ceil((shadowY * nominalSize) / 18);
		const left =
			x - (width + Math.abs(shadowDx)) * anchorX - Math.min(0, shadowDx);
		const top =
			y - (height + Math.abs(shadowDy)) * anchorY - Math.min(0, shadowDy);
		const paint = (paintColor: string, dx: number, dy: number) => {
			context.fillStyle = paintColor;
			for (const [index, line] of lines.entries()) {
				context.fillText(
					line,
					left + (width - widths[index]) * align + dx,
					top +
						roundPythonPixel(index * spacing) +
						Math.ceil(size * 0.8) +
						dy
				);
			}
		};
		if (shadowX || shadowY) paint(shadowColor, shadowDx, shadowDy);
		paint(color, 0, 0);
	} finally {
		context.restore();
	}
}

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
