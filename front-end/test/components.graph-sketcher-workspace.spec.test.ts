import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import GraphSketcherWorkspace from "@/components/GraphSketcherWorkspace.vue";
import {
	createBlankGraphDocument,
	GRAPH_SKETCHER_STORAGE_KEY,
	graphDocumentToJson,
	MAX_GRAPH_DOCUMENT_BYTES,
	MAX_GRAPH_EXPRESSION_LENGTH
} from "@/modules/graphSketcher";

function installLocalStorageStub() {
	const values = new Map<string, string>();
	Object.defineProperty(window, "localStorage", {
		configurable: true,
		value: {
			clear: () => values.clear(),
			getItem: (key: string) => values.get(key) ?? null,
			removeItem: (key: string) => values.delete(key),
			setItem: (key: string, value: string) => values.set(key, value)
		}
	});
}

function buttonWithText(wrapper: ReturnType<typeof mount>, label: string) {
	const button = wrapper
		.findAll("button")
		.find(candidate => candidate.text().trim() === label);
	expect(button, `Expected a "${label}" button`).toBeDefined();
	return button!;
}

function setCanvasBounds(canvas: Element) {
	Object.defineProperty(canvas, "getBoundingClientRect", {
		configurable: true,
		value: () => ({
			bottom: 600,
			height: 600,
			left: 0,
			right: 900,
			top: 0,
			width: 900,
			x: 0,
			y: 0,
			toJSON: () => ({})
		})
	});
}

describe("GraphSketcherWorkspace.vue", () => {
	beforeEach(() => {
		installLocalStorageStub();
		window.localStorage.clear();
	});

	it("renders a complete client-side graphing workspace", async () => {
		const wrapper = mount(GraphSketcherWorkspace);

		expect(wrapper.get("h1").text()).toBe("Graphing");
		expect(wrapper.get("svg[role='img']").attributes("tabindex")).toBe("0");
		expect(wrapper.text()).toContain("Open / import");
		expect(wrapper.text()).toContain("Download project");
		expect(wrapper.text()).toContain("Plot a function");
		expect(
			wrapper
				.get("[aria-label='Graph project actions']")
				.attributes("role")
		).toBe("group");

		await wrapper.get('[aria-label="Graph settings"]').trigger("click");
		await wrapper.findAll(".graph-inspector__tabs button").find(button => button.text() === "Style")!.trigger("click");
		expect(wrapper.text()).toContain("Add linear best fit");

		await wrapper
			.findAll(".graph-inspector__tabs button")
			.find(button => button.text() === "Graph")!
			.trigger("click");
		expect(wrapper.text()).toContain("Original source");
		expect(wrapper.text()).toContain("Linux desktop port");
	});

	it("keeps file import inert until the workspace is mounted", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		const openButton = buttonWithText(wrapper, "Open / import");

		expect(input.attributes("disabled")).toBeDefined();
		expect(openButton.attributes("disabled")).toBeDefined();

		await wrapper.vm.$nextTick();

		expect(input.attributes("disabled")).toBeUndefined();
		expect(openButton.attributes("disabled")).toBeUndefined();
	});

	it("plots equations and keeps keyboard scrolling inside the canvas", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const equation = wrapper
			.findAll("input")
			.find(input => input.attributes("placeholder") === "sin(x) + 0.5x");
		expect(equation).toBeDefined();
		expect(equation!.attributes("maxlength")).toBe(
			String(MAX_GRAPH_EXPRESSION_LENGTH)
		);
		await equation.setValue("x^2 - 4");
		await buttonWithText(wrapper, "Plot function").trigger("click");

		expect(wrapper.text()).toContain("y = x^2 - 4");
		expect(wrapper.text()).toContain("Plotted y = x^2 - 4");

		const canvas = wrapper.get("svg[role='img']");
		const event = new KeyboardEvent("keydown", {
			key: "ArrowDown",
			cancelable: true
		});
		canvas.element.dispatchEvent(event);
		expect(event.defaultPrevented).toBe(true);
	});

	it("keeps wheel zoom and drag gestures inside the canvas surface", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		const canvas = wrapper.get("svg[role='img']");
		setCanvasBounds(canvas.element);

		const parentWheel = vi.fn();
		const parentPointerDown = vi.fn();
		const parentPointerMove = vi.fn();
		wrapper.element.addEventListener("wheel", parentWheel);
		wrapper.element.addEventListener("pointerdown", parentPointerDown);
		wrapper.element.addEventListener("pointermove", parentPointerMove);

		const wheel = new WheelEvent("wheel", {
			bubbles: true,
			cancelable: true,
			clientX: 450,
			clientY: 300,
			deltaY: -100
		});
		canvas.element.dispatchEvent(wheel);
		await wrapper.vm.$nextTick();

		expect(wheel.defaultPrevented).toBe(true);
		expect(parentWheel).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain("Zoomed in.");

		const shellWheel = new WheelEvent("wheel", {
			bubbles: true,
			cancelable: true,
			clientX: 5,
			clientY: 5,
			deltaY: 100
		});
		wrapper.get(".graph-canvas-shell").element.dispatchEvent(shellWheel);
		expect(shellWheel.defaultPrevented).toBe(true);
		expect(parentWheel).not.toHaveBeenCalled();

		const panButton = wrapper
			.findAll("button")
			.find(candidate => candidate.text().includes("Pan"));
		expect(panButton).toBeDefined();
		await panButton!.trigger("click");
		Object.defineProperties(canvas.element, {
			hasPointerCapture: {
				configurable: true,
				value: () => false
			},
			setPointerCapture: {
				configurable: true,
				value: vi.fn()
			}
		});
		const pointerDown = new MouseEvent("pointerdown", {
			bubbles: true,
			cancelable: true,
			clientX: 450,
			clientY: 300
		});
		canvas.element.dispatchEvent(pointerDown);

		expect(pointerDown.defaultPrevented).toBe(true);
		expect(parentPointerDown).not.toHaveBeenCalled();

		const pointerMove = new MouseEvent("pointermove", {
			bubbles: true,
			cancelable: true,
			clientX: 500,
			clientY: 325
		});
		canvas.element.dispatchEvent(pointerMove);

		expect(pointerMove.defaultPrevented).toBe(true);
		expect(parentPointerMove).not.toHaveBeenCalled();
	});

	it("creates an editable point series when a generated curve is active", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		const pointButton = wrapper
			.findAll("button")
			.find(candidate => candidate.text().includes("Point"));
		expect(pointButton).toBeDefined();
		await pointButton!.trigger("click");

		const canvas = wrapper.get("svg[role='img']");
		setCanvasBounds(canvas.element);
		canvas.element.dispatchEvent(
			new MouseEvent("pointerdown", {
				bubbles: true,
				clientX: 450,
				clientY: 300
			})
		);
		await wrapper.vm.$nextTick();

		expect(canvas.attributes("aria-label")).toContain(
			"4 series and 654 points"
		);
		expect(wrapper.text()).toContain("Added a point to Points 4.");
		expect(wrapper.text()).toContain("Editable points for Points 4");
	});

	it("keeps generated curves read-only and duplicates editable snapshots", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await buttonWithText(wrapper, "Plot function").trigger("click");
		await buttonWithText(wrapper, "Data").trigger("click");

		expect(wrapper.text()).toContain("Generated points are read-only.");
		expect(wrapper.find(".graph-data-table").exists()).toBe(false);

		await buttonWithText(wrapper, "Duplicate").trigger("click");

		expect(wrapper.find(".graph-data-table").exists()).toBe(true);
		expect(wrapper.text()).toContain("Editable points for y = sin(x) copy");
	});

	it("restores locally autosaved graph projects", async () => {
		window.localStorage.setItem(
			GRAPH_SKETCHER_STORAGE_KEY,
			JSON.stringify({
				schemaVersion: 1,
				title: "My saved graph",
				series: [],
				annotations: []
			})
		);

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).toContain("My saved graph");
		expect(wrapper.text()).not.toContain(
			"Restored the graph saved in this browser."
		);
	});

	it("rejects oversized files before reading their contents", async () => {
		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();
		const text = vi.fn();
		const arrayBuffer = vi.fn();
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		Object.defineProperty(input.element, "files", {
			configurable: true,
			value: [
				{
					arrayBuffer,
					name: "too-large.csv",
					size: MAX_GRAPH_DOCUMENT_BYTES + 1,
					text
				}
			]
		});

		await input.trigger("change");

		expect(text).not.toHaveBeenCalled();
		expect(arrayBuffer).not.toHaveBeenCalled();
		expect(wrapper.text()).toContain(
			"The graph file is larger than the 8 MB browser limit."
		);
	});

	it("renders every marker while sampling only large-graph editing handles", async () => {
		const document = createBlankGraphDocument();
		document.title = "Large marker-only graph";
		document.series[0].lineStyle = "none";
		document.series[0].markerShape = "circle";
		document.series[0].points = Array.from(
			{ length: 5_001 },
			(_, index) => ({
				x: (index % 100) / 5 - 10,
				y: (Math.floor(index / 100) % 100) / 5 - 10
			})
		);
		window.localStorage.setItem(
			GRAPH_SKETCHER_STORAGE_KEY,
			graphDocumentToJson(document)
		);

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();

		expect(wrapper.findAll(".graph-point")).toHaveLength(5_000);
		const markerPath = wrapper.get(".graph-series__markers");
		expect(markerPath.attributes("d").match(/\bM /g)).toHaveLength(5_001);
		expect(wrapper.text()).toContain(
			"Lines, markers, and error bars still use all 5,001 points"
		);
	});

	it("does not apply a stale file import after loading the sample", async () => {
		let resolveText: ((value: string) => void) | undefined;
		const delayedText = new Promise<string>(resolve => {
			resolveText = resolve;
		});
		const importedDocument = createBlankGraphDocument();
		importedDocument.title = "Stale imported graph";

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		Object.defineProperty(input.element, "files", {
			configurable: true,
			value: [
				{
					arrayBuffer: vi.fn(),
					name: "stale.graphsketch",
					size: 100,
					text: () => delayedText
				}
			]
		});

		await input.trigger("change");
		await buttonWithText(wrapper, "Sample").trigger("click");
		resolveText?.(graphDocumentToJson(importedDocument));
		await delayedText;
		await new Promise(resolve => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).not.toContain("Stale imported graph");
		expect(wrapper.text()).toContain(
			"Loaded the editable cooling experiment sample."
		);
	});

	it("does not let a delayed file import overwrite newer graph edits", async () => {
		let resolveText: ((value: string) => void) | undefined;
		const delayedText = new Promise<string>(resolve => {
			resolveText = resolve;
		});
		const importedDocument = createBlankGraphDocument();
		importedDocument.title = "Stale imported graph";

		const wrapper = mount(GraphSketcherWorkspace);
		await wrapper.vm.$nextTick();
		const input = wrapper.get(
			"input[aria-label='Open or import a graph project']"
		);
		Object.defineProperty(input.element, "files", {
			configurable: true,
			value: [
				{
					arrayBuffer: vi.fn(),
					name: "stale.graphsketch",
					size: 100,
					text: () => delayedText
				}
			]
		});

		await input.trigger("change");
		await buttonWithText(wrapper, "Add").trigger("click");
		resolveText?.(graphDocumentToJson(importedDocument));
		await delayedText;
		await new Promise(resolve => setTimeout(resolve, 0));
		await wrapper.vm.$nextTick();

		expect(wrapper.text()).not.toContain("Stale imported graph");
		expect(
			wrapper.get("svg[role='img']").attributes("aria-label")
		).toContain("3 series");
		expect(wrapper.text()).toContain(
			"The graph changed while the file was opening, so the import was not applied."
		);
	});
	it("reports blocked device storage without claiming the graph was saved", async () => {
		vi.useFakeTimers();
		vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
			throw new Error("Storage blocked");
		});
		const wrapper = mount(GraphSketcherWorkspace);
		try {
			await buttonWithText(wrapper, "Sample").trigger("click");
			await vi.advanceTimersByTimeAsync(300);
			expect(wrapper.text()).toContain(
				"Download required: local save unavailable"
			);
			expect(wrapper.text()).not.toContain("Autosaved locally");
		} finally {
			wrapper.unmount();
			vi.useRealTimers();
		}
	});
});
