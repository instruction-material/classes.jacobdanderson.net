// Hashes are from the immutable published Git blobs for each Java role.
const revision = "ec45d3f9fff2496ba6322b9dd71888cdcc5daee2";
const repository = "instruction-material/USACO-Silver";
const anchor = "usaco-silver-optional-historical-and-applied-silver-studios";

const packs = [
	{
		"folder": "US6-DFS",
		"slug": "dfs",
		"legacy": "dfs",
		"expected": "0 1 3 4 2\n",
		"common": {
			"sample.in": "b7991e9025e284d8e67c993b0293c42ed7b3c69fbfe8f094b48cbfaedbd2cbdb",
			"sample.expected": "62ba8f866c26e1a7c3b9a72c952a2aa1c3ed1b63078ef7dc8014fb88607ba985"
		},
		"roles": {
			"starter": {
				"Main.java": "2b726a6db86775a56ee2bba7c30ee3540239f746d33891584ea0a29598acdd87",
				"README.md": "59385301c58775bc63ce5b5234d811eba184fc889b9afc896687e29beb2c1b03"
			},
			"solution": {
				"Main.java": "2a4bf146b24494b96929aeb23b0f1f0f77c7524af592d8612d741a4afc8716fc",
				"README.md": "d638ff88322b2bf76a05e1c9da6e00327b770e8c8ad9f85012674a25db70ee2c"
			}
		}
	},
	{
		"folder": "US7-BFS",
		"slug": "bfs",
		"legacy": "bfs",
		"expected": "0 1 1 2 2 -1\n",
		"common": {
			"sample.in": "b7991e9025e284d8e67c993b0293c42ed7b3c69fbfe8f094b48cbfaedbd2cbdb",
			"sample.expected": "c7f34e47488146d4809d6e6d00d22139f752aed6a88919ae4559702550df665f"
		},
		"roles": {
			"starter": {
				"Main.java": "678b4d71afc025e6b17f5cb6341edb635666ed67969c18027897aa24584b02d6",
				"README.md": "cb59cfde9c13bc6b963ee042248f527aeaf2791c769a433e265963e006507f97"
			},
			"solution": {
				"Main.java": "6989844739b5c9e544fa062d0eee3865b5a300ff7da861e37e85ea3f174ce07b",
				"README.md": "a70893aed6cecbb17f44d30e3f5f58b48df1102434c294c4a48292322a1c8857"
			}
		}
	},
	{
		"folder": "US6-Stacks",
		"slug": "stacks",
		"legacy": "usaco-silver-stacks",
		"expected": "2\n2\n1\n2\n1\nEMPTY\n",
		"common": {
			"sample.in": "241ffaccec092bb88bbd90a524bb9b479d0aaa72ff337d84c723a8cd25b01ce8",
			"sample.expected": "4f4119bc6453b98e120a1fd9be1eabecda0c79789cbe6d3c5f531f7464a2efb3"
		},
		"roles": {
			"starter": {
				"Main.java": "e6694ecfc5494875d5e56ae9dc42072c3151a61196b197e696591353f7fc67a9",
				"README.md": "c1270cd5e3bb7dab78b131113c5adf95888b6cb45e1cb4166fea8fbf4793576a"
			},
			"solution": {
				"Main.java": "28746107f24dd41f02caca9a58b3d7935080381e4dc66b0e893a26de669f2cfe",
				"README.md": "0ae48c123fc1682d487fe3e1debc3654ecc1ce20355f7fb62bc3f9c90d73c26a"
			}
		}
	},
	{
		"folder": "US7-Queues",
		"slug": "queues",
		"legacy": "queues",
		"expected": "1\n1\n1\n2\n2\nEMPTY\n",
		"common": {
			"sample.in": "0c56178a9f3b263a724cc631762e613551842ec4c12577ddae60c0aaf0afef78",
			"sample.expected": "ee90a94ca11704e41d41f47e8503271426632397b7f4649191816126515adff1"
		},
		"roles": {
			"starter": {
				"Main.java": "7fd80409f8fe01c265496646b38bdd3e102a218830ab63744370aecdf6243a69",
				"README.md": "b7eff39e06a23e2b2af9a3d1835cc6d3137e030d0a81fcf29fc944fe2a242168"
			},
			"solution": {
				"Main.java": "736b23945fc045fc746b691cc035f22ff8e479984c138131d2eeaf834e9fc36a",
				"README.md": "17d1ed04cba29de20adb0452ee80a8c6e2adf08b6f39c02dd4974678e819cc76"
			}
		}
	}
];

export const silverPracticeFixtures = packs.flatMap(pack =>
	["starter", "solution"].map(role => ({
		repository,
		revision,
		catalogRevision: revision,
		courseId: "usaco-silver",
		folder: `${pack.folder}/${role}`,
		anchor,
		itemId: `${anchor}-supplemental-${pack.legacy}`,
		mode: "java",
		input: "sample.in",
		output: "stdout",
		expected: pack.expected,
		hashes: { ...pack.common, ...pack.roles[role] },
		reference: role === "solution",
		silverJavaPack: pack.slug,
		coreVariant: "practice",
		mainFile: "Main.java",
		stdio: true,
		directoryRequests: 1,
		projectKeySuffix: "native-java",
		lessonView: 2,
		previousMode: "java",
		previousSourceUrl: `https://github.com/${repository}/tree/main/${pack.folder}/${role}`
	}))
);
