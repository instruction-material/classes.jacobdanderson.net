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
	}
};

export function c17SystemsBuildNotes(pack?: string) {
	return notes[pack ?? ""];
}
