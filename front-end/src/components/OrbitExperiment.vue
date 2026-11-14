<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from "vue";
import {
	advanceOrbitTrial,
	changeRetrieverSpeed,
	createOrbitTrial,
	ORBIT_MODEL,
	orbitPosition
} from "@/modules/orbitExperiment";

defineOptions({ name: "OrbitExperiment" });
const props = defineProps<{ returnTo: string }>();
const radius = ref(2);
const trial = ref(createOrbitTrial());
const stepHours = ref(10000);
const running = ref(false);
const error = ref("");
const observations = ref<ReturnType<typeof observation>[]>([]);
let timer: ReturnType<typeof setInterval> | undefined;

const tesla = computed(() => orbitPosition(2, trial.value.teslaTurns));
const retriever = computed(() =>
	orbitPosition(trial.value.radius, trial.value.retrieverTurns)
);
const validRadius = computed(
	() =>
		Number.isFinite(Number(radius.value)) &&
		Number(radius.value) >= 0.5 &&
		Number(radius.value) <= 3
);
const stopped = computed(
	() =>
		trial.value.interceptHours !== null ||
		trial.value.hours >= ORBIT_MODEL.maxHours
);
const status = computed(() =>
	trial.value.interceptHours !== null
		? "Intercept"
		: trial.value.hours >= ORBIT_MODEL.maxHours
			? "Time limit reached"
			: running.value
				? "Running"
				: "Paused"
);

function number(value: number) {
	return (Math.abs(value) < 0.0005 ? 0 : value).toLocaleString("en-US", {
		maximumFractionDigits: 3
	});
}
function coordinate(point: { x: number; y: number }) {
	return `(${number(point.x)}, ${number(point.y)})`;
}
function plotX(value: number) {
	return 210 + 55 * value;
}
function plotY(value: number) {
	return 210 - 55 * value;
}
function observation() {
	return {
		hours: trial.value.hours,
		tesla: coordinate(tesla.value),
		retriever: coordinate(retriever.value)
	};
}
function record() {
	if (observations.value.at(-1)?.hours === trial.value.hours) return;
	observations.value = [...observations.value.slice(-7), observation()];
}
function pause() {
	if (timer !== undefined) clearInterval(timer);
	timer = undefined;
	running.value = false;
}
function reset() {
	pause();
	error.value = "";
	try {
		trial.value = createOrbitTrial(Number(radius.value));
		observations.value = [];
	} catch (caught) {
		error.value =
			caught instanceof Error
				? caught.message
				: "Invalid starting radius.";
	}
}
function advance() {
	error.value = "";
	try {
		const hours = Number(stepHours.value);
		if (!(hours > 0)) throw new RangeError("Enter a positive time step.");
		trial.value = advanceOrbitTrial(trial.value, hours);
		if (stopped.value) {
			pause();
			record();
		}
	} catch (caught) {
		pause();
		error.value =
			caught instanceof Error ? caught.message : "Invalid time step.";
	}
}
function togglePlay() {
	if (running.value) {
		pause();
		return;
	}
	advance();
	if (error.value || stopped.value) return;
	running.value = true;
	timer = setInterval(advance, 200);
}
onBeforeUnmount(pause);
</script>

<template>
	<section class="page-shell orbit-experiment">
		<header class="page-hero orbit-heading">
			<h1 class="page-title">Tesla-Retriever experiment</h1>
			<RouterLink
				:to="props.returnTo"
				class="site-button site-button--secondary"
			>
				Return to lesson
			</RouterLink>
		</header>
		<p class="model-note">
			Fictional circular tracks with constant speed and no gravity. π =
			3.14; one classroom AU = 98 million miles. Both move
			counterclockwise; Tesla starts at (2, 0), TR9000 at (−r, 0).
		</p>
		<section
			class="site-surface experiment-controls"
			aria-label="Trial controls"
		>
			<label for="orbit-radius">
				Starting radius (classroom AU)
				<input
					id="orbit-radius"
					v-model.number="radius"
					:aria-invalid="!validRadius"
					type="number"
					min="0.5"
					max="3"
					step="0.1"
					:disabled="trial.hours > 0 || running"
					@change="reset"
				/>
			</label>
			<div class="speed-controls">
				<span id="orbit-speed-label">TR9000 speed (mph)</span>
				<div class="speed-buttons" aria-labelledby="orbit-speed-label">
					<button
						type="button"
						aria-label="Decrease speed by 150 mph"
						:disabled="trial.speed === 0 || stopped"
						@click="trial = changeRetrieverSpeed(trial, -1)"
					>
						−150
					</button>
					<output id="orbit-speed">{{ number(trial.speed) }}</output>
					<button
						type="button"
						aria-label="Increase speed by 150 mph"
						:disabled="
							trial.speed === ORBIT_MODEL.maxSpeed || stopped
						"
						@click="trial = changeRetrieverSpeed(trial, 1)"
					>
						+150
					</button>
				</div>
				<span>Tesla: 60,000 mph</span>
			</div>
			<label for="orbit-step">
				Time step (hours)
				<input
					id="orbit-step"
					v-model.number="stepHours"
					type="number"
					min="1"
					:max="ORBIT_MODEL.maxHours"
					step="1"
				/>
			</label>
			<div class="trial-actions">
				<button
					class="site-button"
					type="button"
					:disabled="stopped || !validRadius"
					@click="advance"
				>
					Advance
				</button>
				<button
					class="site-button site-button--secondary"
					type="button"
					:disabled="stopped || !validRadius"
					:aria-pressed="running"
					@click="togglePlay"
				>
					{{ running ? "Pause" : "Play" }}
				</button>
				<button
					class="site-button site-button--secondary"
					type="button"
					@click="reset"
				>
					Reset trial
				</button>
			</div>
			<p v-if="error" role="alert">{{ error }}</p>
		</section>
		<section
			class="site-surface plot-card"
			aria-label="Experiment positions"
		>
			<p class="trial-status">
				<strong id="orbit-status" role="status">{{ status }}</strong> ·
				<output id="orbit-hours">{{ number(trial.hours) }}</output>
				hours
			</p>
			<svg
				class="orbit-plot"
				viewBox="0 0 420 420"
				role="img"
				aria-labelledby="orbit-plot-title orbit-plot-desc"
			>
				<title id="orbit-plot-title">
					Tesla and TR9000 on circular tracks
				</title>
				<desc id="orbit-plot-desc">
					Coordinates in classroom AU. Tesla is the filled circle at
					{{ coordinate(tesla) }}; TR9000 is the outlined square at
					{{ coordinate(retriever) }}.
				</desc>
				<path d="M 18 210 H 402 M 210 18 V 402" class="axes" />
				<g
					v-for="tick in [-3, -2, -1, 1, 2, 3]"
					:key="tick"
					class="tick"
				>
					<path
						:d="`M ${plotX(tick)} 207 v 6 M 207 ${plotY(tick)} h 6`"
					/>
					<text :x="plotX(tick)" y="229" text-anchor="middle">
						{{ tick }}
					</text>
					<text x="192" :y="plotY(tick) + 4" text-anchor="middle">
						{{ tick }}
					</text>
				</g>
				<text x="400" y="197">x</text>
				<text x="219" y="20">y</text>
				<circle cx="210" cy="210" r="110" class="tesla-track" />
				<circle
					cx="210"
					cy="210"
					:r="trial.radius * 55"
					class="retriever-track"
				/>
				<circle
					id="tesla-position"
					:cx="plotX(tesla.x)"
					:cy="plotY(tesla.y)"
					r="6"
					class="tesla-point"
				/>
				<rect
					id="retriever-position"
					:x="plotX(retriever.x) - 9"
					:y="plotY(retriever.y) - 9"
					width="18"
					height="18"
					class="retriever-point"
				/>
			</svg>
			<div class="position-readings">
				<p>
					Tesla ●
					<output id="tesla-coordinate">{{
						coordinate(tesla)
					}}</output>
				</p>
				<p>
					TR9000 □
					<output id="retriever-coordinate">{{
						coordinate(retriever)
					}}</output>
				</p>
			</div>
			<button
				class="site-button site-button--secondary"
				type="button"
				@click="record"
			>
				Record position
			</button>
			<p
				v-if="
					trial.hours >= ORBIT_MODEL.maxHours &&
					trial.interceptHours === null
				"
			>
				Trial limit: 100 million hours. Reset to start a new trial.
			</p>
		</section>
		<section
			v-if="observations.length"
			class="site-surface observation-card"
			aria-labelledby="observation-heading"
		>
			<h2 id="observation-heading">Recorded positions</h2>
			<p v-if="observations.length === 8">
				The eight most recent observations are shown.
			</p>
			<table>
				<thead>
					<tr>
						<th scope="col">Time (hours)</th>
						<th scope="col">Tesla (x, y)</th>
						<th scope="col">TR9000 (x, y)</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in observations" :key="row.hours">
						<td>{{ number(row.hours) }}</td>
						<td>{{ row.tesla }}</td>
						<td>{{ row.retriever }}</td>
					</tr>
				</tbody>
			</table>
		</section>
	</section>
</template>

<style scoped>
.orbit-experiment {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 1.25rem;
	max-width: 60rem;
}
.orbit-heading {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 1rem;
}
.model-note {
	margin: 0;
	line-height: 1.65;
}
.experiment-controls,
.plot-card,
.observation-card {
	padding: clamp(1rem, 3vw, 1.75rem);
	min-width: 0;
}
.experiment-controls {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
	gap: 1.25rem;
}
.experiment-controls label,
.speed-controls {
	display: grid;
	align-content: start;
	gap: 0.5rem;
}
.experiment-controls input {
	min-width: 0;
	width: 100%;
	color: var(--color-ink);
	background: var(--color-surface);
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
	padding: 0.65rem;
}
.trial-actions {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	grid-column: 1 / -1;
}
.speed-buttons {
	display: flex;
	align-items: center;
	gap: 0.75rem;
}
.speed-buttons button {
	min-height: 2.75rem;
	padding: 0.4rem 0.6rem;
	border: 1px solid var(--color-border);
	border-radius: 0.5rem;
}
button:disabled {
	opacity: 0.5;
	cursor: default;
}
.orbit-plot {
	width: 100%;
	max-width: 36rem;
	display: block;
	margin: auto;
}
.axes,
.tick path {
	stroke: var(--color-ink-soft);
	stroke-width: 1;
}
.tick text,
.orbit-plot > text {
	fill: var(--color-ink);
	font-size: 13px;
}
.tesla-track {
	fill: none;
	stroke: #168477;
	stroke-width: 2;
}
.retriever-track {
	fill: none;
	stroke: #a855b6;
	stroke-width: 2;
	stroke-dasharray: 6 4;
}
.tesla-point {
	fill: #168477;
	stroke: var(--color-ink);
	stroke-width: 1;
}
.retriever-point {
	fill: none;
	stroke: #a855b6;
	stroke-width: 3;
}
.position-readings {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	gap: 0.5rem;
}
.position-readings p {
	margin: 0 0 1rem;
}
output,
td {
	font-variant-numeric: tabular-nums;
}
table {
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
}
th,
td {
	text-align: left;
	padding: 0.75rem 0.25rem;
	border-bottom: 1px solid var(--color-border);
	overflow-wrap: anywhere;
}
</style>
