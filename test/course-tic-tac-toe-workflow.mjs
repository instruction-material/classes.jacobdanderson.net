import assert from "node:assert/strict";
import { downloadProjectZip, openProjectSidebar } from "./ide-workspace-controls.mjs";
import { strFromU8, unzipSync } from "fflate";

export async function exerciseTicTacToe(page, pack, learnerFiles) {
	// Valid-path edits exercise actual incomplete imports, never downloaded answers.
	// Independent source tests verify full domains and game-tree guarantees.
	const experiment = pack.folder.endsWith("AI-Test");
	const advanced = pack.folder.endsWith("with-Forks");
	const randomOnly = pack.folder.endsWith("-UI");
	const edits = {
		make_board: ["return [[' '] * 3 for _ in range(3)]"],
		duplicate_board: ["return [row[:] for row in board]"],
		win: [
			"cells = [cell for row in board for cell in row]",
			"bits = sum(1 << i for i, cell in enumerate(cells) if cell == player)",
			"return any(bits & mask == mask for mask in (7,56,448,73,146,292,273,84))"
		],
		finished: ["return all(cell != ' ' for row in board for cell in row)"],
		game_status: [
			"return 'X_won' if win(board, 'X') else 'O_won' if win(board, 'O') else 'draw' if finished(board) else 'ongoing'"
		],
		legal_moves: [
			"return [[r,c] for r in range(3) for c in range(3) if board[r][c] == ' '] if game_status(board) == 'ongoing' else []"
		],
		apply_move: [
			"result = duplicate_board(board)",
			"assert [row,col] in legal_moves(board)",
			"result[row][col] = player",
			"return result"
		]
	};
	if (!experiment) {
		Object.assign(edits, {
			render_board: [
				"return '\\n---+---+---\\n'.join('|'.join(f' {cell} ' for cell in row) for row in board) + '\\n'"
			],
			print_board: [
				"(print if output_fn is None else output_fn)(render_board(board))"
			],
			parse_coordinate: [
				"return None if text.strip().casefold() == 'quit' else int(text.strip())"
			],
			play: [
				"input_fn = input if input_fn is None else input_fn",
				"output_fn = print if output_fn is None else output_fn",
				"board, player, moves = make_board(), start_player, []",
				"print_board(board, output_fn)",
				"while game_status(board) == 'ongoing':",
				"    if player == 'X':",
				"        row = parse_coordinate(input_fn('Row (0..2): '))",
				"        col = parse_coordinate(input_fn('Column (0..2): '))",
				"    else:",
				randomOnly
					? "        row, col = random_player_move(board, rng)"
					: "        row, col = ai_player_move(board, rng)",
				"    board = apply_move(board, player, row, col)",
				"    moves.append((player,row,col))",
				"    print_board(board, output_fn)",
				"    player = 'O' if player == 'X' else 'X'",
				"status = game_status(board)",
				"return {'status':status, 'winner':status[0] if status.endswith('_won') else None,",
				"        'board':duplicate_board(board), 'moves':moves[:], 'start_player':start_player}"
			],
			main: [
				"result = play(start_player, input_fn, output_fn, rng)",
				"print('TTT_WORKFLOW_GAME', result['status'], len(result['moves']))",
				"return result"
			]
		});
	}
	if (randomOnly || experiment) {
		edits.random_player_move = [
			"available = legal_moves(board)",
			"return (random if rng is None else rng).choice(available) if available else None"
		];
	}
	if (!randomOnly) {
		Object.assign(edits, {
			test_win: [
				"return [i,j] in legal_moves(board) and win(apply_move(board,player,i,j),player)"
			],
			winning_moves: [
				"return [move for move in legal_moves(board) if test_win(board,*move,player)]"
			],
			ai_player_move: [
				"available = legal_moves(board)",
				"if not available: return None",
				"opponent = 'X' if player == 'O' else 'O'",
				"for mark in (player,opponent):",
				"    threats = winning_moves(board,mark)",
				"    if threats: return threats[0]",
				...(advanced
					? [
							"own = fork_moves(board,player)",
							"if own: return own[0]",
							"opposing = fork_moves(board,opponent)",
							"if len(opposing) == 1: return opposing[0]",
							"if len(opposing) > 1:",
							"    edges = [[0,1],[1,0],[1,2],[2,1]]",
							"    ordered = [m for m in edges if m in available] + [m for m in available if m not in edges]",
							"    for move in ordered:",
							"        trial = apply_move(board,player,*move)",
							"        threats = winning_moves(trial,player)",
							"        if len(threats) == 1 and not test_win(trial,*threats[0],opponent) and not test_fork(trial,*threats[0],opponent):",
							"            return move",
							"    for move in ordered:",
							"        if not fork_moves(apply_move(board,player,*move),opponent): return move"
						]
					: []),
				"for move in ([1,1],[0,0],[0,2],[2,0],[2,2]):",
				"    if move in available: return move[:]",
				"return (random if rng is None else rng).choice(available)"
			]
		});
	}
	if (advanced) {
		Object.assign(edits, {
			test_fork: [
				"if [i,j] not in legal_moves(board): return False",
				"trial = apply_move(board,player,i,j)",
				"return not win(trial,player) and len(winning_moves(trial,player)) >= 2"
			],
			fork_moves: [
				"return [move for move in legal_moves(board) if test_fork(board,*move,player)]"
			]
		});
	}
	if (experiment) {
		Object.assign(edits, {
			play_game: [
				"board, player, moves = make_board(), start_player, []",
				"x_move_fn = random_player_move if x_move_fn is None else x_move_fn",
				"o_move_fn = ai_player_move if o_move_fn is None else o_move_fn",
				"while game_status(board) == 'ongoing':",
				"    strategy = x_move_fn if player == 'X' else o_move_fn",
				"    row, col = strategy(duplicate_board(board),rng)",
				"    board = apply_move(board,player,row,col)",
				"    moves.append((player,row,col))",
				"    player = 'O' if player == 'X' else 'X'",
				"status = game_status(board)",
				"return {'status':status, 'winner':status[0] if status.endswith('_won') else None,",
				"        'board':duplicate_board(board), 'moves':moves[:], 'start_player':start_player}"
			],
			evaluate: [
				"rng, counts, first_x_win = random.Random(seed), {'x_wins':0,'o_wins':0,'draws':0}, None",
				"for _ in range(games):",
				"    result = play_game(start_player,rng,x_move_fn,o_move_fn)",
				"    key = {'X_won':'x_wins','O_won':'o_wins','draw':'draws'}[result['status']]",
				"    counts[key] += 1",
				"    if result['status'] == 'X_won' and first_x_win is None: first_x_win = result",
				"return {'games':games, 'seed':seed, 'start_player':start_player, **counts,",
				"        'rates':{k:v/games if games else 0.0 for k,v in counts.items()}, 'first_x_win':first_x_win}"
			],
			main: [
				"report = evaluate(games,seed,start_player)",
				"assert sum(report[k] for k in ('x_wins','o_wins','draws')) == games",
				"print('TTT_WORKFLOW_EVALUATION', report['x_wins'], report['o_wins'], report['draws'])",
				"return report"
			]
		});
	}
	let edited = learnerFiles["main.py"];
	for (const [name, lines] of Object.entries(edits)) {
		const placeholder = `raise NotImplementedError("Implement ${name} after predicting its self-checks.")`;
		assert.equal(
			edited.split(placeholder).length,
			2,
			`One exercise for ${name}`
		);
		edited = edited.replace(placeholder, lines.join("\n    "));
	}
	const reminder =
		'print("Read README.md, implement the learner functions, then change this guard to call main().")';
	assert.equal(edited.split(reminder).length, 2);
	if (experiment) {
		edited = edited.replace(
			reminder,
			'main(games=3, seed=0, start_player="X")'
		);
	} else {
		edited = edited.replace(
			'\n\nif __name__ == "__main__":',
			'\n\nclass WorkflowChoice:\n    def choice(self, choices):\n        return choices[0]\n\nif __name__ == "__main__":'
		);
		const probe = advanced
			? "assert ai_player_move([['X',' ',' '],[' ','O',' '],[' ',' ','X']], WorkflowChoice()) == [0,1]\n    "
			: "";
		edited = edited.replace(
			reminder,
			`${probe}main(start_player="X", rng=WorkflowChoice())`
		);
	}
	const modifier = await page.evaluate(() =>
		/Mac/.test(navigator.platform) ? "Meta" : "Control"
	);
	await page.click(".cm-content");
	await page.keyboard.down(modifier);
	await page.keyboard.press("a");
	await page.keyboard.up(modifier);
	await page.keyboard.sendCharacter(edited);
	const stdin = randomOnly
		? "1\n0\n1\n1\n1\n2\n"
		: advanced
			? "0\n0\n0\n1\n2\n0\n1\n2\n2\n1\n"
			: "0\n0\n2\n1\n2\n0\n2\n2\n";
	if (!experiment) {
		await page.$eval(
			".stdin-panel textarea",
			(element, text) => {
				element.value = text;
				element.dispatchEvent(new Event("input", { bubbles: true }));
			},
			stdin
		);
	}
	const key = `browser:${pack.folder}:starter`;
	await page.waitForFunction(
		(key, source) =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous") ??
					"[]"
			).some(
				project =>
					project.courseProjectKey === key &&
					project.files.some(
						file =>
							file.name === "main.py" && file.content === source
					)
			),
		{},
		key,
		edited
	);
	await page.click("button.run-control");
	const marker = experiment
		? "TTT_WORKFLOW_EVALUATION 0 3 0"
		: advanced
			? "TTT_WORKFLOW_GAME draw 9"
			: randomOnly
				? "TTT_WORKFLOW_GAME X_won 5"
				: "TTT_WORKFLOW_GAME X_won 7";
	await page.waitForFunction(
		marker =>
			document
				.querySelector(".output-panel")
				?.textContent.includes(marker) &&
			document
				.querySelector("[data-testid='ide-run-status']")
				?.textContent.includes("Run complete"),
		{ timeout: 90000 },
		marker
	);
	assert.doesNotMatch(
		await page.$eval(".output-panel", element => element.textContent),
		/Traceback|EOFError|NotImplementedError/
	);
	await page.evaluate(() => {
		const original = HTMLAnchorElement.prototype.click;
		HTMLAnchorElement.prototype.click = function () {
			if (
				this.download.endsWith(".zip") &&
				this.href.startsWith("blob:")
			) {
				void fetch(this.href)
					.then(response => response.arrayBuffer())
					.then(bytes => {
						window.__tttDownloadedZip = Array.from(
							new Uint8Array(bytes)
						);
					});
				return;
			}
			return original.call(this);
		};
	});
	await downloadProjectZip(page);
	await page.waitForFunction(() => Array.isArray(window.__tttDownloadedZip));
	const zip = unzipSync(
		Uint8Array.from(await page.evaluate(() => window.__tttDownloadedZip))
	);
	assert.equal(
		Object.keys(zip).filter(path => !path.endsWith("/")).length,
		Object.keys(learnerFiles).length,
		"Export contains exactly the learner project files"
	);
	for (const [name, text] of Object.entries(learnerFiles)) {
		const keys = Object.keys(zip).filter(path => path.endsWith(`/${name}`));
		assert.equal(keys.length, 1);
		assert.equal(
			strFromU8(zip[keys[0]]),
			name === "main.py" ? edited : text
		);
	}
	await page.reload({ waitUntil: "domcontentloaded" });
	await openProjectSidebar(page);
	await page.waitForSelector(".file-button");
	const files = await page.evaluate(
		key =>
			JSON.parse(
				localStorage.getItem("classes-python-ide-projects:anonymous") ??
					"[]"
			).find(project => project.courseProjectKey === key)?.files,
		key
	);
	assert.equal(files.length, Object.keys(learnerFiles).length);
	for (const [name, text] of Object.entries(learnerFiles))
		assert.equal(
			files.find(file => file.name === name)?.content,
			name === "main.py" ? edited : text
		);
	console.log(
		`Tic Tac Toe confirmed source imported, full console game or seeded evaluation executed, exact ZIP exported and saved work reopened: ${pack.folder}`
	);
}
