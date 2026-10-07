// Source bytes and independent native oracle pinned to the published checkpoint.
export const checkpointRevision = "0d887c4c3a9be6d902db3295165c5837c6f46e01";
export const checkpointPacks = {
	"CPPI0-Build-and-Debug-Checkpoint/starter": {
		"Makefile": "abb7ce36c541d11225c89fedd8cbb6e09bb5ba3e5673e4545aa75d9d799e1f40",
		"README.md": "d921e22cd9d523221824f4b2715015454cb445c0380086db452a58e838766a17",
		"main.cpp": "b54cce7add028f58fdfabf09ded35fd1c48edc66be227e7b290589c00d9a627d",
		"score_ledger.cpp": "5509138b088232a40816b0fed23a367fa466e7ad4ace6193f3d635818e736b01",
		"score_ledger.h": "5ba03f5f7666c50b6d54afee063891073760f8b0fda1380dbfce1d0edec1eee2",
		"score_tools.cpp": "f69aa8891dc901e6c549bf9a5fc580b2a42fb29aa3302d866d856cbeb3f17db2",
		"score_tools.h": "3acf0d1e5199abd56da0a90f892b7390610cde8f92b79b390c718f49ec371775"
	},
	"CPPI0-Build-and-Debug-Checkpoint/solution": {
		"Makefile": "abb7ce36c541d11225c89fedd8cbb6e09bb5ba3e5673e4545aa75d9d799e1f40",
		"README.md": "f04fdd242b45b55f3453cf36bd3118181de02e0328dd47f0a2d9fc3157b679bd",
		"main.cpp": "b54cce7add028f58fdfabf09ded35fd1c48edc66be227e7b290589c00d9a627d",
		"score_ledger.cpp": "5509138b088232a40816b0fed23a367fa466e7ad4ace6193f3d635818e736b01",
		"score_ledger.h": "5ba03f5f7666c50b6d54afee063891073760f8b0fda1380dbfce1d0edec1eee2",
		"score_tools.cpp": "73156648169dfb0a4bef366e95bb198e216f7fcde0edb879113aa12f0975e3ef",
		"score_tools.h": "3acf0d1e5199abd56da0a90f892b7390610cde8f92b79b390c718f49ec371775"
	}
};
export const checkpointOracle = "#include \"score_ledger.h\"\n#include \"score_tools.h\"\n#include <cassert>\n#include <sstream>\n#include <stdexcept>\n#include <string>\n#include <vector>\nint main() {\n    int output = 47;\n    for (const auto* token : {\"\", \"-1\", \"+1\", \"101\", \"1x\", \" 1\", \"1 \", \"9999999999999\"}) {\n        assert(!parseScore(token, output) && output == 47);\n    }\n    assert(parseScore(\"00085\", output) && output == 85);\n    ScoreLedger ledger;\n    int expected = 0;\n    for (int i = 0; i < 20; ++i) {\n        ledger.add(i);\n        expected += i;\n        assert(ledger.total() == expected);\n        assert(ledger.scores().size() == static_cast<std::size_t>(i + 1));\n    }\n    const auto before = ledger.scores();\n    try { ledger.add(-1); assert(false); } catch (const std::invalid_argument&) {}\n    try { ledger.add(101); assert(false); } catch (const std::invalid_argument&) {}\n    try { ledger.add(50); assert(false); } catch (const std::length_error&) {}\n    assert(ledger.scores() == before && ledger.total() == 190);\n    ScoreLedger copy = ledger;\n    ScoreLedger empty;\n    copy = empty;\n    assert(copy.scores().empty() && copy.total() == 0 && ledger.scores() == before);\n    assert(sumScores({}) == 0 && sumScores({100}) == 100);\n    std::ostringstream trace;\n    assert(sumScores({85, 0, 10}, &trace) == 95);\n    assert(trace.str() == \"trace index=0 score=85 running=85\\ntrace index=1 score=0 running=85\\ntrace index=2 score=10 running=95\\n\");\n}\n";
