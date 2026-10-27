# Pokemon Master

## Files and workflow

Open the selected starter in the site IDE after confirming its source. Read the TODOs in `script.js`, save a change, reopen the same attempt and export its complete ZIP. Extract the ZIP and open `index.html` in a browser; its scripts, styles, fonts and licenses are local. Save files and reload the browser after an edit. `README.md` contains this full reading and `SOURCES.md` identifies the original role and adaptations. The reference is available for comparison after an independent attempt.

Use a two-dimensional array of Pokémon records. Each row has the fixed shape `[id, name, type]`; these columns have different meanings. This optional exercise practices nested indexing and mutations, rather than a spatial game board.

## Read the supplied records

The initial rows represent Charmander, Pidgey, Pikachu, Psyduck and Togepi. Column 0 is a numeric ID, column 1 a name, and column 2 a type string. Psyduck's type is water; see the [official Pokédex](https://www.pokemon.com/us/pokedex/psyduck). No artwork or remote game data is needed.

Complete the original six tasks in order:

1. Add Skitty as `[300, "Skitty", "normal"]` with `pokemon.push(...)`. The outer array now has six records; pushing three separate values would break its row structure.
2. Before any removal, print the name of ID 54 with nested indexing. Its row index is 3 and the name column is 1, so `pokemon[3][1]` selects Psyduck.
3. Print Togepi's ID. Its initial row index is 4 and the ID column is 0.
4. Print Charmander's type from row 0, column 2.
5. Remove the escaped Pidgey. `pokemon.splice(1, 1)` changes the outer array by removing one row at index 1. Later rows shift left; saved row positions may no longer identify the same Pokémon.
6. Visit the remaining rows with `forEach` or `for...of`. For each row, print a sentence containing its name, type and ID with a template string, such as `${row[1]} is a ${row[2]}-type Pokemon with an id of ${row[0]}.`

## Trace state and output

After adding Skitty and removing Pidgey there are five records: Charmander, Pikachu, Psyduck, Togepi and Skitty. The three indexed answers printed before removal are Psyduck, 175 and fire. Those answers plus five final sentences produce eight output lines.

The supplied `printToScreen(value)` uses local D3 to append wrapping text; it does not animate or alter the data. Refreshing reruns the original source from its initial array, so one refresh must not keep accumulating duplicate Skitty records. When calling mutation functions more than once in an extension, decide how to prevent duplicate IDs.

Before indexing, identify both row and column. `pokemon[3]` is an entire record, while `pokemon[3][1]` is one name; these are different types of result. Accessing a missing row yields `undefined`, and then trying to index inside that value throws. Check length when accepting an unknown index. For this fixed assignment, follow the stated order so the indexed questions run before rows shift.
