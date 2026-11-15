# My Favorite Businesses II

Build a searchable business directory using arrays of objects, Materialize
autocomplete and D3 card rendering. This optional project extends My Favorite
Businesses. Its starter and reference are separate saved projects.

Open index.html directly in a browser without a server. The project includes
its libraries and example images; it works offline. Edit script.js.

## Required work

1. Copy at least three business objects from the earlier project. Keep each name,
   location, CEO and products array. Add logo_image and display_image to each.
   The included SVG files can be reused or replaced with local images.
2. Build autocomplete choices from the same array. The shared setup calls
   renderBusiness when a suggestion is chosen or Show business is submitted.
3. Complete renderBusiness. Trim surrounding spaces, find the exact name and
   render one Materialize card using the selected object's fields.
4. For blank/unknown names hide the previous card and show "No business found."
   Render values as text. Show a text fallback when the display image fails.

Materialize's onAutocomplete callback receives the chosen name. Its data option
maps names to logo URLs. D3 .text(value) writes text; .attr(name, null) removes an
attribute. Clear the old image container before inserting a new image so old
load/error events cannot change the new card.

The reference uses fictional Cedar Trail Outfitters, Sunrise Bakery and Harbor
Books. Reference matches are case sensitive; surrounding spaces are ignored.
Selecting a suggestion renders the card immediately. The Show business button
also accepts a typed exact name.

Read CASES.md for concrete inputs and expected results. Complete when all
businesses, autocomplete selection, repeated changes, unknown/blank names and
a broken image pass those checks. Save the project and export its ZIP.

The starter leaves the business array and rendering work unfinished. The
reference demonstrates one complete implementation.
