export const ORBIT_MODEL = {
	pi: 3.14,
	milesPerClassroomAU: 98000000,
	teslaRadius: 2,
	teslaSpeed: 60000,
	speedStep: 150,
	maxSpeed: 300000,
	maxHours: 100000000
} as const;

export interface OrbitTrial {
	hours: number;
	radius: number;
	speed: number;
	teslaTurns: number;
	retrieverTurns: number;
	interceptHours: number | null;
}

export function createOrbitTrial(radius = 2): OrbitTrial {
	if (!Number.isFinite(radius) || radius < 0.5 || radius > 3) {
		throw new RangeError(
			"Starting radius must be between 0.5 and 3 classroom AU."
		);
	}
	return {
		hours: 0,
		radius,
		speed: ORBIT_MODEL.teslaSpeed,
		teslaTurns: 0,
		retrieverTurns: 0.5,
		interceptHours: null
	};
}

export function orbitCircumference(radius: number) {
	return 2 * ORBIT_MODEL.pi * radius * ORBIT_MODEL.milesPerClassroomAU;
}

export function changeRetrieverSpeed(trial: OrbitTrial, increments: number) {
	if (!Number.isSafeInteger(increments))
		throw new RangeError("Speed changes use whole 150 mph increments.");
	if (trial.interceptHours !== null) return trial;
	return {
		...trial,
		speed: Math.max(
			0,
			Math.min(
				ORBIT_MODEL.maxSpeed,
				trial.speed + increments * ORBIT_MODEL.speedStep
			)
		)
	};
}

export function orbitPosition(radius: number, turns: number) {
	// Classroom pi sets the distance scale. A full plotted turn is 2π radians.
	const angle = (turns % 1) * 2 * Math.PI;
	return { x: radius * Math.cos(angle), y: radius * Math.sin(angle) };
}

export function advanceOrbitTrial(
	trial: OrbitTrial,
	hours: number
): OrbitTrial {
	if (!Number.isFinite(hours) || hours < 0 || hours > ORBIT_MODEL.maxHours) {
		throw new RangeError(
			"Time advances must be finite and within the trial limit."
		);
	}
	if (trial.interceptHours !== null) return trial;
	let elapsed = Math.min(hours, ORBIT_MODEL.maxHours - trial.hours);
	const teslaRate = ORBIT_MODEL.teslaSpeed / orbitCircumference(2);
	const retrieverRate = trial.speed / orbitCircumference(trial.radius);
	const relativeRate = retrieverRate - teslaRate;
	let interceptHours: number | null = null;
	if (trial.radius === 2 && relativeRate !== 0) {
		const relativeTurns = trial.retrieverTurns - trial.teslaTurns;
		const nextMeeting =
			relativeRate > 0
				? Math.floor(relativeTurns) + 1
				: Math.ceil(relativeTurns) - 1;
		const untilMeeting = (nextMeeting - relativeTurns) / relativeRate;
		if (untilMeeting >= 0 && untilMeeting <= elapsed) {
			elapsed = untilMeeting;
			interceptHours = trial.hours + elapsed;
		}
	}
	const teslaTurns = trial.teslaTurns + teslaRate * elapsed;
	return {
		...trial,
		hours: trial.hours + elapsed,
		teslaTurns,
		// Snap only the proven event to the same phase, avoiding floating-point drift.
		retrieverTurns:
			interceptHours === null
				? trial.retrieverTurns + retrieverRate * elapsed
				: teslaTurns +
					Math.round(
						trial.retrieverTurns +
							retrieverRate * elapsed -
							teslaTurns
					),
		interceptHours
	};
}
