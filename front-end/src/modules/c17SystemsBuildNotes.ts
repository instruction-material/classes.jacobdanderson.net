const notes: Record<string, { input: string; learner: string }> = {
	"CSE4-Memory-Visualizer": {
		input: "Use no arguments. Measure sizeof, offsetof and alignment on the current compiler; address order and padding sizes are observations, not portable constants.",
		learner:
			"Complete analyze_layout and describe_experiment in layout.c. The untouched normal learner exits 78 and its contract test fails. Failure must preserve output."
	},
	"CSE5-Byte-Buffer-Workbench": {
		input: "Use zero arguments or one terminated label. The eight-byte text buffer reserves one byte for a terminator. Scan the raw packet only within its declared length; a prefix terminator does not determine the full binary payload size.",
		learner:
			"Complete copy_label and find_terminator in buffers.c. The untouched normal learner exits 78 and its contract test fails. Copy lengths are bytes; UTF-8 truncation may split a character."
	},
	"CSE6-Packet-Serializer-Deserializer": {
		input: "Use zero arguments or one whole decimal or 0x hexadecimal reading in 0..65535. The packet is exactly seven bytes with version 1 and explicit little-endian fields. XOR checksums provide no authentication.",
		learner:
			"Complete serialize_packet and parse_packet in packet.c. Valid untouched execution exits 78; malformed arguments exit 2. The contract test initially fails and rejected packets preserve output."
	},
	"CSE7-Dynamic-Ring-Buffer": {
		input: "Use no arguments. Preserve FIFO order through wraparound and checked growth. Failed allocation must preserve the pointer, count, capacity and logical values. Unit 9 reopens the saved Unit 7 attempt for a new invariant and operation-cost trace.",
		learner:
			"Complete ring_init, ring_push and ring_pop in ring.c. The untouched normal learner exits 78 and its contract test fails. Keep the supplied allocator, ownership helpers and failure-injection tests."
	},
	"CSE8-Fixed-Size-Log-File-Reader": {
		input: "Use no arguments for a temporary demonstration or one existing binary-log path for read-only input. --sample NEWpath explicitly creates a sample and refuses existing paths. Reject partial or corrupt eight-byte records before printing a report; empty input is valid. XOR checksums provide no authentication.",
		learner:
			"Complete log_checksum and decode_log_record in log.c. The untouched normal learner exits 78 and its contract test fails. The supplied --sample helper already works; existing input files must remain unchanged."
	},
	"CSE9-Capstone-Telemetry-Transform-CLI": {
		input: "Use no arguments for a temporary demonstration or existing-input.csv NEW-output.csv. Validate the entire input before creating a new destination; existing destinations and the same input/output path are refused. --sample NEWpath explicitly creates sample input. Four whole decimal fields are required; temperatures use milli-units and Fahrenheit conversion truncates toward zero.",
		learner:
			"Complete parse_telemetry_row and transform_telemetry_row in telemetry.c. The untouched normal learner exits 78 and its contract test fails. The supplied --sample helper already works; invalid input never creates output and existing files remain unchanged."
	},
	"CSE-01-systems-build-14": {
		input: "Use no arguments or a whole decimal/0x word in 0..65535 and an optional decimal/0x reference in 1..5000 mV. All sixteen-bit words are valid. The channel occupies the top four bits and the ADC count the bottom twelve; voltage rounds to the nearest millivolt. A valid word alone establishes no integrity.",
		learner:
			"Complete decode_sensor_frame, adc_count_to_mv and format_bits16 in sensor.c. The untouched normal learner exits 78 and its contract test fails. Failed conversion and undersized formatting preserve output."
	},
	"CSE-02-systems-build-15": {
		input: "Use no arguments. Plan relative region offsets for positive lengths and power-of-two alignments in 1..64. Padding, outside positions, insufficient space and arithmetic overflow have distinct statuses. A plan computes offsets; actual base alignment and object construction require their own preconditions.",
		learner:
			"Complete plan_regions and locate_region in regions.c. The untouched normal learner exits 78 and its contract test fails. All rejected plans and lookups preserve output."
	},
	"CSE-03-systems-build-16": {
		input: "Use no arguments for a temporary sample or one existing read-only binary file. --sample NEWpath explicitly creates a sample and refuses existing paths. Frames use A5, version 1, length 0..32, a binary payload and CRC-8/0x07. Callbacks accept individual frames; the CLI reports only a wholly valid file. A CRC establishes no sender authentication.",
		learner:
			"Complete stream_feed and stream_finish in stream.c. The untouched normal learner exits 78 and its contract test fails. The supplied --sample helper already works. Payload storage is borrowed during callbacks; existing files remain unchanged."
	},
	"CSE-04-systems-build-17": {
		input: "Use no arguments for a temporary sample, one existing CSV path, or a CSV path and positive decimal window width in milliseconds. --sample NEWpath explicitly creates a sample and refuses existing paths. Ordered timestamps and milli-Celsius values form at most 256 samples; bucket means truncate toward zero. Existing inputs remain unchanged.",
		learner:
			"Complete parse_sample_row and aggregate_samples in window.c. The untouched normal learner exits 78 and its contract test fails. The supplied --sample helper already works. Invalid input produces no report; failed aggregation preserves the previous output and used count."
	}
};

export function c17SystemsBuildNotes(pack?: string) {
	return notes[pack ?? ""];
}
