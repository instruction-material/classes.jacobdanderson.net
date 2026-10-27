# Repeat Scaling and Benchmark Harness Cost

Use the working Unit 11 performance program. This challenge asks what changes
when the repeat count changes while the data size, code and fixture stay fixed.
It does not require a speed ratio or a universal winning variant. Keep supplied
source and contract tests unchanged and retain raw CSV plus the interpretation
in `analysis.md`. The baseline's complete setup and measurement definitions follow.

## Controlled runs

Pass the Release contracts first. From the project folder, using the completed
starter Release directory described below:

```sh
./build-starter-release/assembly_performance --benchmark 64 1 5 > repeats-1.csv
./build-starter-release/assembly_performance --benchmark 64 8 5 > repeats-8.csv
./build-starter-release/assembly_performance --benchmark 64 32 5 > repeats-32.csv
```

Every command must exit zero. Each file contains 60 data rows: three patterns,
four variants and five trials. Check every row's count=64 and its selected repeat
count, each trial 0 through 4 exactly once per pattern/variant, the recorded seed,
and checksum==expected_checksum. If a command fails, retain that failure but do
not treat its partial file as a complete run.

For each pattern, use its repeat-one expected checksum as B. At repeat R the
expected checksum is the low 64 bits of B*R, including for indexed-permuted:
the benchmark's indices form a permutation, so each input is visited once per
call. Do not apply that equivalence to arbitrary repeated-index API inputs.

## Summarize without assuming linearity

Group observations by pattern, variant and repeat count. Sort the five elapsed_ns
values; the third is the median and the smallest/largest are the range. Divide
the median by 64*repeats for the median elapsed nanoseconds per element visit.
Keep the raw integers and report the unit; this normalized value includes harness
work and is not an isolated instruction latency. Zero elapsed values are valid
when the clock cannot distinguish the two readings.

Use a table with pattern, variant, repeats, five raw times, median, range and
median/(64*repeats). Compare one pattern and one variant across all three repeat
settings before comparing variants. Record compiler/flags, CPU/OS, load and the
order in which the three complete commands were run. Repeat a round in reversed
command order with distinct output filenames to look for order-related changes;
retain both rounds separately.

Each row uses a timestamp pair. The interval covers the work between its sampling
points and some measurement overhead, rather than the full duration of both clock
calls. It also includes dispatch, repeated function calls, traversal and checksum
accumulation. Increasing
repeats can amortize some fixed cost, but cache state, contention and scheduling
can change too. Three repeat settings cannot identify each component's cost or
prove a linear model. Explain which observation supports a proposed explanation
and which changed experiment could distinguish it from a competing explanation.

Retain the full rows, checksum checks, table, both command orders, one supported
conclusion and one unresolved alternative.
