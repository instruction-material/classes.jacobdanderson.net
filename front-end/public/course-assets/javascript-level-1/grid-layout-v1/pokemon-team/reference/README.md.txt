# Pokemon Team

Build a six-member Pokémon team page with a navigation landmark, a page heading, portraits, fictional nicknames, statistics, and moveset tables. Use the supplied six species, values, moves, and local image filenames from `README.md`, or make a complete consistent team of your own. The supplied values are sample team data from the original exercise, not species base-stat claims or a competitive-game guide.

Use a repeated card structure with a heading for the species and text for its nickname. Show HP, ATK, DEF, SPA, SPD, and SPE with a readable label and a matching decorative icon. Their expanded labels are hit points, attack, defense, special attack, special defense, and speed. A `dl` associates each statistic's `dt` label with its `dd` value. Keep the text labels even when an icon is present.

Put moves in a real table with a caption and row labels. Use meaningful image alternatives that name each species. Keep the local SVG image companions with the project: each contains the retained original raster, so no external image request is needed. `object-fit: contain` and a flexible width preserve the complete portrait.

Materialize's `col s12 m6 l4` makes one team card per row on small screens, two on medium screens, and three on large screens. The included reference uses an equivalent CSS grid so cards in the same row share available width without float gaps. At 600px and below use one column, from 601px use two, and from 993px use three. Long labels and moves must wrap within a card.

The starter leaves the team unfinished; the reference supplies all six fictional nicknames, the original 36 values and 24 moves. Check those counts, six loaded portraits, table captions and labels, all breakpoint transitions, keyboard navigation, and no horizontal overflow at phone widths or 200% zoom. Change one visible nickname, save, reload, and export the complete project.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/e96eae8cd85c1fe2bbaf3b5cdd046522

## Supplied sample team

- Butterfree (Nimbus): HP/ATK/DEF/SPA/SPD/SPE = 324, 170, 179, 251, 233, 215. Moves: Sleep Powder, Giga Drain, Psychic, Bug Buzz. Portrait: `images/pokemon-1.svg`.
- Tyranitar (Granite): HP/ATK/DEF/SPA/SPD/SPE = 404, 403, 350, 317, 328, 243. Moves: Stone Edge, Dragon Dance, Crunch, Earthquake. Portrait: `images/pokemon-2.svg`.
- Flygon (Dune): HP/ATK/DEF/SPA/SPD/SPE = 364, 328, 284, 284, 284, 328. Moves: Outrage, U-Turn, Earthquake, Fire Punch. Portrait: `images/pokemon-3.svg`.
- Lanturn (Beacon): HP/ATK/DEF/SPA/SPD/SPE = 454, 236, 236, 276, 276, 256. Moves: Scald, Volt Switch, Toxic, Protect. Portrait: `images/pokemon-4.svg`.
- Roserade (Briar): HP/ATK/DEF/SPA/SPD/SPE = 324, 262, 251, 383, 339, 306. Moves: Spikes, Sludge Bomb, Leaf Storm, Aromatherapy. Portrait: `images/pokemon-5.svg`.
- Machamp (Atlas): HP/ATK/DEF/SPA/SPD/SPE = 384, 394, 284, 251, 295, 229. Moves: Dynamicpunch, Stone Edge, Knock Off, Earthquake. Portrait: `images/pokemon-6.svg`.
