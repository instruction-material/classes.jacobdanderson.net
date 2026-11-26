import type { RawCourseModule, RawCourseModuleItem } from "./types";
import {
	javaHashTableModuleID,
	javaHashTableProjects,
	javaHashTableURL
} from "@/modules/javaSearchResources";

function workflow(sources: string) {
	return `Open the starter in the site IDE and confirm the import. Save the attempt before downloading the ZIP. The IDE's **Run** panel shows these Java 21 commands. Run them in the extracted project folder.

\`\`\`sh
javac --release 21 -Xlint:all -Werror ${sources}
java ContractTests
java Main
\`\`\`

The untouched starter compiles. The checker identifies an unfinished method until the implementation is ready.`;
}

function reading(
	title: string,
	content: string,
	identity?: Pick<RawCourseModuleItem, "id" | "aliases">
): RawCourseModuleItem {
	return {
		...identity,
		title,
		content,
		contentKind: "reading",
		preserveInstructions: true,
		preserveAssignment: true
	};
}

function assignment(
	title: string,
	pack: Parameters<typeof javaHashTableURL>[0],
	content: string
): RawCourseModuleItem {
	return {
		title,
		content,
		contentKind: "assignment",
		preserveInstructions: true,
		preserveAssignment: true,
		ideImport: true,
		projectLink: javaHashTableURL(pack, "starter"),
		solutionLink: javaHashTableURL(pack, "solution")
	};
}

export function buildJavaHashTableModule(): RawCourseModule {
	const [map, search, chaining, resize] = javaHashTableProjects;
	return {
		id: javaHashTableModuleID,
		title: "AJ15 Hash Tables",
		curriculum: [
			reading(
				"Hash Tables",
				`A hash table stores key-value pairs. A hash function converts a key to an integer, and a compression step turns that integer into an index in the current table. A lookup starts at that index and uses equality to identify the exact key.

Equal keys must have equal hash codes. Unequal keys may still map to the same index. If a key field used by equality or hashing changes after inserting it, a new lookup may start in the wrong place. Use immutable keys whose equality and hash codes follow the same fields.

A well-distributed hash and a controlled load factor support expected constant-time operations. A crowded bucket or probe chain can still require checking many entries. Compare a report that needs sorted keys, where a TreeMap may be useful, with a record lookup that only needs a value by key.`,
				{
					id: `${javaHashTableModuleID}-curriculum-hash-tables-core-concepts`,
					aliases: [
						"core-concepts",
						`${javaHashTableModuleID}-curriculum-core-concepts`,
						`${javaHashTableModuleID}-curriculum-core-concepts-and-learning-sequence`
					]
				}
			),
			reading(
				"Writing a Hash Function",
				`To make the order of characters matter, start a string hash at 0 and update it with h = 31 × h + code on each step. For the two-letter strings ab and ba, the character codes 97 and 98 give 31 × 97 + 98 = 3105 and 31 × 98 + 97 = 3135. A plain sum gives the same value for both. A bounded Java int may overflow during the hash calculation, which is normal for a hash code.

Reduce the code to the current table range with Math.floorMod(hash, capacity). For capacity 7 and a code of −1, the result is 6. floorMod also handles Integer.MIN_VALUE. The remainder operator alone can return a negative value. Use equality after finding a candidate because a compressed index never proves that the keys match.

Compute the bucket for ab and ba at capacity 7. Repeat at capacity 11 and explain why an entry must be reindexed whenever the capacity changes.`
			),
			reading(
				"Dealing with Collisions",
				`Separate chaining keeps a collection of entries in each bucket. To look up a key, visit its bucket and compare against the keys in the chain. An update replaces the equal key's value and preserves other entries in the same bucket.

Open addressing stores one entry per slot. Linear probing looks at consecutive slots and wraps to slot 0. In a table of capacity 7, keys 5 and 12 both start at slot 5. Insert 5 there and 12 at slot 6. Removing 5 leaves a tombstone, so the search for 12 still continues to slot 6. A never-used slot ends a failed search because an earlier insertion on that probe path would have stopped there.

When inserting, remember the first tombstone and keep looking for a live equal key. Use the tombstone only after proving the key is absent. Limit both kinds of search to one full circuit, including when every slot has been used at some point. Trace inserting a duplicate 12 after removing 5, then trace finding a missing key when no unused slots remain.`
			),
			reading(
				"Rehashing",
				`The live load factor is the number of live entries divided by capacity. The project grows just before an insertion would exceed one-half live load. It rebuilds at the next supported prime capacity at least twice as large, or the largest supported prime if that is closer to the limit. A resize allocates fresh slots and reinserts live entries using the new modulus. Deleted entries stay behind.

For a code of 12, the starting slot is 5 at capacity 7 and 1 at capacity 11. Copying the occupied slot directly would leave the key in the wrong probe chain. Rebuilding costs a pass over the old storage and new probes. Spacing growth operations apart keeps expected insertion work low across a long sequence.

Tombstones can make probes long while the live load remains low. Rebuilding at the same capacity discards tombstones and preserves live entries. Compare same-capacity compaction with a growth operation and explain which changes the modulus.`
			),
			reading(
				"Hash Tables Application Check",
				`Check that rehashing preserves every key-value pair exactly once. Record the keys and values before resizing and compare the result with a separate Java HashMap after resizing. An unchanged count alone cannot reveal a moved value or a lost key replaced by a duplicate.

For a table that has only tombstones and live entries, check that an absent lookup stops after at most one circuit. Use inputs that collide and separately use distinct objects that compare equal. Trace an update past a deleted slot, a failed duplicate insert, a negative hash code and a successful lookup after growth. State which operations can change the live count.`,
				{
					id: `${javaHashTableModuleID}-curriculum-hash-tables-application-check`,
					aliases: ["application-check"]
				}
			),
			assignment(
				"AJ15 Project 1: HashMap",
				map.pack,
				`Complete getIndex and rebuild in HashMap.java. Probe at most one full circuit. Return an active equal key when found, or select a free or deleted slot for a new key. Do not stop at a tombstone during lookup. During a rebuild, reinsert each live key using the new capacity and omit deleted entries. The supplied insert rejects a duplicate and put updates a present key. Missing get, put and remove calls report an error.

${workflow("*.java")}

**Checkpoints** The sample prints updated, false and 1 on separate lines. The keys 46 and 93 start at the same slot at capacity 47. Remove 46 and check that 93 remains accessible. Try an absent lookup after visiting 47 distinct slots through insertions and removals. Then verify collision chains across both wrapping and resizing.`
			),
			{
				...assignment(
					"AJ15 Project 2: Mini Search Engine",
					search.pack,
					`Read the supplied UTF-8 corpus.txt and build a keyword index with the provided hash map. A line containing only an HTTP or HTTPS address starts a page. Subsequent tag lines attach to that page until the next address. Split tags on whitespace, ignore empty tokens and lowercase each tag and query with Locale.ROOT. Keep distinct URLs for each keyword in corpus order. Reject a nonblank tag line before the first page address.

${workflow("*.java")}

**Checkpoints** Java matches the guide and lab, tools matches the guide and editor, and unknown has no results. Keep corpus.txt in the extracted folder. Run java Main corpus.txt JAVA tools and compare the results with the default sample. Add a blank line and a repeated single tag. The program searches local data and displays URLs as text.`
				),
				aliases: ["AJ15 Project 2: Juni Search Engine"]
			}
		],
		supplementalProjects: [
			assignment(
				"Hash Tables: Extension Challenge",
				map.pack,
				`Reopen the saved hash map workspace. Implement compact to rebuild the storage at its current capacity. Leave every live key and value in the result, remove all tombstones and keep the live count unchanged. Reuse the rebuild method so growth and compaction both reinsert keys through the same rule.

Compile the saved Java files and run java ContractTests compact and java Main compact. The sample reports Deleted slots: 0 while the remaining key still has the updated value. Check an empty map, a mostly deleted table and a table with collisions. Record both the capacity and live count before and after rebuilding.`
			),
			assignment(
				"Hash Table Collision Transfer Practice",
				chaining.pack,
				`Implement put and get using separate chaining. Pick a bucket with Math.floorMod and compare the key to entries in its chain. Update an existing entry in place within the chain, append an absent key and return OptionalInt.empty() for a miss. A stored zero is a valid result.

${workflow("Main.java ContractTests.java")}

**Checkpoints** At capacity 3, −1 and 2 both go into bucket 2. Updating −1 leaves the value of 2 intact. The sample returns 7, 9 and OptionalInt.empty. Trace the entries inspected for an absent key in that same bucket, then check the minimum int key.`
			),
			assignment(
				"Hash Table Resizing Extension Practice",
				resize.pack,
				`Allocate fresh chained buckets for a positive target capacity. Iterate through every old entry and compute its new destination with Math.floorMod. Keep the old buckets intact for comparison, and preserve each entry exactly once after every rebuild.

${workflow("Main.java ContractTests.java")}

**Checkpoints** Keys 2, 5 and −1 all occupy bucket 2 at capacity 3. Rebuilding at capacity 5 puts key 5 in bucket 0. Record the three destination indices at each capacity. Verify that a negative code, a repeated resize and an empty source preserve the expected number of entries.`
			)
		]
	};
}
