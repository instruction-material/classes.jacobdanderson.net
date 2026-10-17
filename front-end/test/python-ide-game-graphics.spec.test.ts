import { afterEach, expect, it, vi } from "vitest";
import {
	preparePythonIdeGameCanvas,
	pythonIdeGamePointerPosition,
	waitForPythonIdeGameImage
} from "@/modules/pythonIdeGameGraphics";

afterEach(() => vi.useRealTimers());

it("maps scaled mouse input to native integer game pixels", () => {
	expect(
		pythonIdeGamePointerPosition(
			166.5,
			287.5,
			{ left: 24, top: 180.625, width: 285, height: 213.75 },
			640,
			480
		)
	).toEqual({ x: 320, y: 240 });
	expect(
		pythonIdeGamePointerPosition(
			166,
			287,
			{ left: 24, top: 180.625, width: 285, height: 213.75 },
			640,
			480
		)
	).toEqual({ x: 318, y: 238 });
});

it("preserves outside release coordinates without fractional pixels", () => {
	expect(
		pythonIdeGamePointerPosition(
			23.9,
			179,
			{ left: 24, top: 180.625, width: 285, height: 213.75 },
			640,
			480
		)
	).toEqual({ x: -1, y: -4 });
});

it("handles a hidden canvas without dividing by zero", () => {
	expect(
		pythonIdeGamePointerPosition(
			5,
			5,
			{ left: 0, top: 0, width: 0, height: 0 },
			640,
			480
		)
	).toEqual({ x: 0, y: 0 });
});

it("keeps program pixels and painted content across responsive layout changes", () => {
	const canvas = document.createElement("canvas");
	const setTransform = vi.fn();
	vi.spyOn(canvas, "getContext").mockReturnValue({
		setTransform
	} as unknown as CanvasRenderingContext2D);
	preparePythonIdeGameCanvas(canvas, 640, 480);
	const width = vi.spyOn(canvas, "width", "set");
	const height = vi.spyOn(canvas, "height", "set");
	canvas.style.width = "250px";
	canvas.style.height = "187.5px";
	preparePythonIdeGameCanvas(canvas, 640, 480);
	expect([canvas.width, canvas.height]).toEqual([640, 480]);
	expect(width).not.toHaveBeenCalled();
	expect(height).not.toHaveBeenCalled();
	expect(setTransform).toHaveBeenLastCalledWith(1, 0, 0, 1, 0, 0);
	preparePythonIdeGameCanvas(canvas, 320, 240);
	expect([canvas.width, canvas.height]).toEqual([320, 240]);
});

function imageState(complete = false, width = 0, height = 0) {
	const image = document.createElement("img");
	Object.defineProperties(image, {
		complete: { configurable: true, value: complete },
		naturalWidth: { configurable: true, value: width },
		naturalHeight: { configurable: true, value: height }
	});
	return image;
}

it.each([
	[0, 480],
	[640, NaN],
	[Infinity, 480],
	[8193, 1],
	[8192, 8192]
])("refuses unusable or excessive game dimensions %s x %s", (width, height) => {
	const canvas = document.createElement("canvas");
	expect(() => preparePythonIdeGameCanvas(canvas, width, height)).toThrow(
		"Game canvas dimensions"
	);
});

it("waits for original image dimensions before actors are created", async () => {
	vi.useFakeTimers();
	const image = imageState();
	const waiting = waitForPythonIdeGameImage(image);
	let finished = false;
	void waiting.then(() => {
		finished = true;
	});
	await Promise.resolve();
	expect(finished).toBe(false);
	Object.defineProperties(image, {
		naturalWidth: { value: 66 },
		naturalHeight: { value: 92 }
	});
	image.dispatchEvent(new Event("load"));
	expect(await waiting).toBe(true);
	expect(vi.getTimerCount()).toBe(0);
});

it("accepts an already decoded image without waiting", async () => {
	expect(await waitForPythonIdeGameImage(imageState(true, 66, 92))).toBe(
		true
	);
});

it("settles a failed image and clears its deadline", async () => {
	vi.useFakeTimers();
	const image = imageState();
	const waiting = waitForPythonIdeGameImage(image);
	image.dispatchEvent(new Event("error"));
	expect(await waiting).toBe(false);
	expect(vi.getTimerCount()).toBe(0);
});

it("bounds a stalled decode and removes its event handlers", async () => {
	vi.useFakeTimers();
	const image = imageState();
	const remove = vi.spyOn(image, "removeEventListener");
	const waiting = waitForPythonIdeGameImage(image, 50);
	await vi.advanceTimersByTimeAsync(50);
	expect(await waiting).toBe(false);
	expect(vi.getTimerCount()).toBe(0);
	expect(remove).toHaveBeenCalledWith("load", expect.any(Function));
	expect(remove).toHaveBeenCalledWith("error", expect.any(Function));
});

it("refuses a completed image with no usable pixels", async () => {
	expect(await waitForPythonIdeGameImage(imageState(true))).toBe(false);
});
