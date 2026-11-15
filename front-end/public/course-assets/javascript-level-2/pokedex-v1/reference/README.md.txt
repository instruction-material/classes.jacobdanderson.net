# Pokedex

Search the original 893-entry Pokémon index by name or numeric ID. Every entry includes its real name, one or two types, six base statistics and the corresponding supplied sprite. The local dataset is derived from pinned public PokéAPI CSV files and sprite sources, so every indexed lookup works offline. The datalist contains all 893 names. Live API optionally refreshes one selected record; loading the page never launches 893 requests.

Complete loadPokemonResponse, normalizePokemon and renderPokemon in script.js. The asynchronous loader selects the saved record or one live request, waits for validation, and returns its data plus cache status. Require an ID from 1 through 893, a normalized name, one or two type records, six numeric base statistics and a valid sprite. The complete reference accepts the supplied PNG data URLs locally and the exact reviewed PokéAPI sprite path for a live response. Render one result with DOM text, a labeled sprite and a definition list of statistics; replace previous details so repeated searches do not accumulate stale fields.

The supplied request.js checks HTTP status, JSON type, a 512 KiB response cap, one active request and a four-second timeout. Successful live records enter a bounded sixty-second cache. Repeating the same lookup uses it; a failed refresh retains the previous record. Try bulbasaur, pikachu, 25 and 893, then an unknown name. Inspect CASES.md, including markup-shaped input, invalid records, sprite failure and cached reads. Open index.html without a server.

The reference completes loadPokemonResponse, normalizePokemon, renderPokemon for comparison after the starter attempt.
