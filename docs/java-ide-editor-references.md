# Java IDE Editor References

The Classes Java IDE keeps Java and Karel execution browser-side. It does not add
server-side compilation, `javac`, Docker, or long-running execution services.

## Editor Implementation

- Use [`@codemirror/lang-java`](https://code.haverbeke.berlin/codemirror/lang-java)
  and the [CodeMirror Java API reference](https://codemirror.net/docs/ref/#lang-java.java)
  for Java parsing, indentation, folding, highlighting, and `//` / `/* */`
  comment language data. The old GitHub mirror is archived, so prefer the
  current CodeMirror source and reference pages when checking behavior.
- Keep the existing CodeMirror shell for shared editing behavior: search,
  history, multi-cursor state, bracket matching, bracket pair coloring,
  wrap-selection typing, Tab / Shift+Tab indentation, and command shortcuts.
- Add Java and Karel-specific completion entries and snippets in
  `front-end/src/modules/pythonCodeMirror.ts`; do not introduce backend
  language services or worker pools without explicit approval.
- Keep Java/Karel recommendations quiet inside Java line comments, block
  comments, string literals, character literals, and text blocks. This matches
  the Python editor expectation that prose/comment text should not trigger code
  completions while the student is typing.
- Surface parser-backed Java/Karel syntax diagnostics through the same
  CodeMirror lint-gutter path used by Python so missing braces and malformed
  statements are visible before the student presses Run.
- Treat Karel static receiver completions separately from robot-object
  completions. `Directions.` should suggest `North`, `East`, `South`, and
  `West`, while robot variables such as `sam.` should suggest movement and
  beeper/ball commands. `Color.` should offer common uppercase and lowercase
  `java.awt.Color` constants, plus CodeHS-style `purple` and `random()` color
  help for Karel examples that use `Color.red` / `Color.random()`.
- Keep Karel-mode import completions aligned with the starter templates:
  `import kareltherobot.UrRobot`, `import kareltherobot.World`,
  `import kareltherobot.Directions`, and `import java.awt.Color` should be
  available when students type imports by hand.
- Keep beginner collection completions aligned with the course sequence:
  array declarations, enhanced `for` loops, `Arrays.toString(...)`,
  `Arrays.deepToString(...)`, `Arrays.sort(...)`, `Arrays.copyOf(...)`, 2D
  array setup, `ArrayList` creation and core methods, and beginner `HashMap` /
  `TreeMap` creation and core `Map` methods should be available from the editor.
- Keep completions available when students use fully qualified receivers instead
  of imports. `java.util.Arrays.`, `java.util.Collections.`,
  `java.util.Comparator.`, `java.lang.Math.`, `java.lang.String.`,
  `java.lang.System.out.`, `java.awt.Color.`, `kareltherobot.World.`, and
  `kareltherobot.Directions.` should resolve to the same local completion
  families as their imported short names.
- Include `java.util.Random` type/import/snippet help and Random instance member
  completions (`nextInt`, `nextDouble`, `nextBoolean`, `setSeed`) for declared
  or clearly named random receivers. The browser preview supports the beginner
  `Random` subset used by the course: `new Random(...)`, `nextInt(...)`,
  `nextDouble()`, `nextBoolean()`, `nextFloat()`, `nextLong()`, and `setSeed(...)`.
- Keep Java Level 2 and Java Level 3 writing support broader than the browser
  preview runtime. The editor should help students type custom-class and
  collection-design work such as constructors, getters, setters, `toString`,
  `Comparable`, `Comparator`, interfaces, enums, records, `List`, `Set`,
  `HashSet`, `TreeSet`, `Queue`, `PriorityQueue`, and `Collections` helpers.
  These entries are editor scaffolding, not a promise that every advanced
  concept runs in the browser preview.
- Include editor-only control-flow and exception scaffolding for Java Level 3,
  AP CSA, and design-pattern modules that discuss switch statements, switch
  expressions, custom exceptions, `throw` / `throws`, and Optional boundaries.
  Include `Optional.ofNullable(...)` starter help and focused Optional receiver
  completions such as `isPresent`, `isEmpty`, `orElse`, `map`, `filter`, and
  `ifPresent`. These completions support writing normal Java for external IDEs
  and do not add server-side Java execution.
- Include editor-only lambda and stream scaffolding for the advanced Java
  pipeline modules: `Predicate`, `Function`, `Stream`, `Collectors`,
  `filter`, `map`, `sorted`, `collect`, `groupingBy`, and simple lambda /
  stream-pipeline snippets. These are writing aids only; stream execution still
  belongs in CodeHS, BlueJ, VS Code, IntelliJ, or another real Java runtime.
- Include editor-only file-I/O scaffolding for the Java Level 2/3 modules that
  use files: `File`, `FileReader`, `FileWriter`, `BufferedReader`,
  `PrintWriter`, `IOException`, `try` / `catch`, try-with-resources, Scanner
  over a `File`, and simple file-writing snippets. These completions help
  students write normal Java in CodeHS, BlueJ, VS Code, or IntelliJ, but they
  do not add browser filesystem access or server-side Java execution.
- When the editor can see a declared Java receiver, prefer focused member
  completions over the broad beginner fallback: `String` receivers should show
  string methods, arrays should show array members, `ArrayList` / `List`
  receivers should show list methods, `Set` receivers should show set methods,
  `Queue` / `PriorityQueue` receivers should show queue methods, `HashMap` /
  `TreeMap` / `Map` receivers should show map methods, and `Map.Entry`
  receivers should show entry methods.
- Keep beginner `String` completions aligned with Java Level 1, AP CSA, and
  sorting lessons: `length()`, `charAt()`, `substring()`, `equals()`,
  `equalsIgnoreCase()`, `compareTo()`, `indexOf()`, `toLowerCase()`,
  `toUpperCase()`, and `trim()` should appear as member completions.
- Include beginner `Scanner` member completions for token reads, line reads,
  numeric/boolean reads, and validation predicates such as `hasNextInt()`.
  Declared `Scanner` receivers such as `Scanner input = new Scanner(...)` or
  `java.util.Scanner input = ...` should receive focused Scanner-only member
  suggestions, matching the runtime rule that IDE input is consumed only
  through declared Scanner receivers.
- Include beginner formatted-output completions for `System.out.printf`,
  `System.out.format`, and `String.format`.
- Keep Java and Karel starter/outline templates executable by the same
  browser preview subset. Templates may scaffold imports, helper methods,
  collections, `Scanner`, CodeHS-style `run()` methods, and Karel conditions,
  but should not depend on server compilation or unsupported language-service
  behavior.
- The backend project APIs may persist Java and Karel source files, share links,
  and staff review copies, but they remain storage-only APIs. They should
  validate safe file names and mode-appropriate code files without importing
  the Java preview runtime or executing Java.
- In multi-file projects, prefer a detected driver over a helper with a
  conventional filename. Java projects use an active `main(...)` file, then a
  `Main.java` with `main(...)`, then another `main(...)` file. Karel projects
  similarly prefer detected `run()` or `main(...)` entry files, with
  `MyProgram.java` and `Algo.java` as fallbacks when no entry is detected. A
  Java entry is a public static `void main(String[] args)` declaration, and a
  Karel `run()` entry belongs to a class extending Karel or SuperKarel; calls
  and unrelated helper methods do not select a driver.

## Teaching and Runtime References

- [BlueJ / Greenfoot](https://github.com/k-pet-group/BlueJ-Greenfoot) remains
  the classroom reference for visual Java object inspection. It is useful for
  course sequencing, but not something this site embeds or runs server-side.
- [Monaco Editor](https://github.com/microsoft/monaco-editor) is a useful
  comparison point for browser editor UX because it is the editor from VS Code.
  Its deeper Java IntelliSense path generally implies language-server or worker
  architecture, so it remains a reference rather than the current implementation.
- [CodeHS Java Karel docs](https://codehs.com/documentation/javaKarel) inform
  Karel command vocabulary, method patterns, comments, conditions, and loops.
  The local Karel preview follows `UrRobot` commands from `main`, CodeHS-style
  commands from `main` or `run`, simple helper methods, `putBall` / `takeBall`
  aliases, `if` / `else`, Karel conditions such as `frontIsClear()` and
  `ballsPresent()`, compound `&&` / `||` / `!` Karel conditions, bounded
  `while` loops, and bounded numeric `for` loops. It is still a teaching
  preview, not a full Java compiler or VM.
- [CodeHS UltraKarel docs](https://codehs.com/documentation/new/ultrakarel)
  inform the browser-side painted-cell preview: `paint(Color.red)`,
  `paint(Color.random())`, `colorIs(color)`, and `colorIsNot(color)` should
  update or inspect the visual Karel grid without introducing server-side Java.
- [CodeHS Java docs](https://codehs.com/documentation/new/java-main) inform
  beginner Java console vocabulary such as printing, variables, methods,
  input, comparisons, math, and random numbers. The local console preview
  follows a small beginner subset: `System.out.print` / `println`, formatted
  output through `System.out.printf`, `System.out.format`, and `String.format`,
  simple variables, string concatenation with Java-style left-to-right numeric
  addition before the first string operand, string methods such as `length()`,
  `charAt()`, `substring()`, `equals()`, `equalsIgnoreCase()`, `compareTo()`,
  `indexOf()`, `toLowerCase()`, `toUpperCase()`, and `trim()`, numeric
  arithmetic, simple casts including beginner `char` / ASCII casts and
  character arithmetic, common `Math` helpers and constants such as
  `Math.PI` and `Math.E`, `Math.random()` and beginner `java.util.Random`
  calls, declared `Scanner` receivers reading from the IDE input box with
  Java-like token-versus-line behavior for `next()`,
  `nextInt()`, `nextDouble()`, `nextBoolean()`, and `nextLine()`, basic
  `hasNext...()` validation predicates, basic `if` / `else if` / `else`
  decisions, bounded `for` / `while` loops, void helper calls, and simple
  static methods with parameters, `return` values, arithmetic use, boolean
  helpers, capped recursion, one-dimensional arrays, `Arrays.toString(...)`,
  `Arrays.copyOf(...)` for one-dimensional array copies with Java-style
  truncate-or-pad behavior, `Arrays.sort(...)` for one-dimensional arrays,
  `array.length`, indexed array access and assignment, enhanced `for` loops
  over arrays and `ArrayList`s, beginner two-dimensional arrays with nested
  loops, row `.length`, chained row/column indexing, and
  `Arrays.deepToString(...)`, and beginner `ArrayList` calls such as `add`,
  indexed `add`, `get`, `set`, `remove`, `contains`, `clear`, `size`, and
  `isEmpty`, plus beginner map calls on `HashMap` and `TreeMap` such as `put`,
  `putIfAbsent`, `get`, `getOrDefault`, `containsKey`, `remove`, `keySet`,
  `values`, `entrySet`, `Map.Entry.getKey()`, `Map.Entry.getValue()`, `clear`,
  `size`, and `isEmpty`. It remains a browser teaching preview rather than a
  compiler.
- [Java SE 21 `java.util` API docs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/package-summary.html)
  inform the editor-only advanced collection vocabulary. `HashSet`, `Set`,
  `Queue`, `PriorityQueue`, `Comparator`, `Collections`, `List`, and related
  methods appear as writing assistance because the Java Level 2/3 courses ask
  students to read and write that code even when the local browser preview does
  not execute the full Java Collections Framework.
- [Java SE 21 `Record` docs](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Record.html)
  inform the record snippet and keyword completion used by the advanced Java
  course's immutable-data-carrier module. Records are supported as editor
  scaffolding only; they still require a real Java compiler outside the browser
  preview for execution.
- [Java Formatter syntax](https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/Formatter.html)
  is the reference point for formatted output. The browser preview implements a
  small teaching subset: `%s`, `%d`, `%f` with optional width/precision, `%%`,
  and `%n`.

## Online Editor Boundary

- CodeHS and BlueJ/Greenfoot are course-sequencing references for Karel,
  visual state, and novice Java object inspection.
- CodeMirror is the implementation choice for the Classes browser editor
  because it provides Java parsing and editing features without requiring
  server compilation.
- Online Java compilers and full IDEs that execute arbitrary Java generally
  require server-side compilation or hosted sandboxes. Do not connect those to
  the Classes backend unless a future task explicitly approves a bounded
  execution service with resource limits.
- Open-source browser IDE platforms such as [Eclipse Theia](https://theia-ide.org/),
  [Eclipse Che](https://www.eclipse.org/che/), and
  [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server) are useful
  references for larger editor/workspace designs, but their Java story typically
  implies remote workspaces, extensions, language servers, containers, or server
  processes. They remain architecture references, not dependencies.
- Open-source online execution systems such as
  [Judge0](https://github.com/judge0/judge0) are a future option only if the
  project intentionally adds a bounded sandbox service. They do not fit the
  current browser-only Java/Karel preview boundary.
