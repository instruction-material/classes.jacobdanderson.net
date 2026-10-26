# My JavaScript Art Part IV

Continue the Part III portfolio, add another D3 drawing, and implement a working Materialize Dropdown and ScrollSpy. Preserve its earlier drawings and right-side Sidenav. The original Part IV reference contains only Rainbow, Captain America Shield, Pac-Man, and Snowman; it omits the assignment's new drawing and dropdown and calls Materialize without loading its JavaScript. The local continuation starter already contains those four drawings and the authored Part III Constellation. It leaves the sixth drawing, dropdown, and ScrollSpy unfinished. The local reference adds an explicitly authored Ringed Planet example.

Keep Materialize CSS, Material Icons, D3 5.16.0, Materialize 1.0.0 JavaScript, and script.js in the supplied order. D3 creates the SVG geometry; Materialize controls navigation. Materialize 1.0.0 does not need the unused jQuery dependency from the original settings. Give every SVG a responsive viewBox and an accessible description. The seven rainbow arcs, shield circles and star, opposite-angle Pac-Man arcs, snowman's circles, smile and arms, and six-star Constellation all remain intact.

Build the sixth drawing in `#ringed-planet`. The reference uses a 400 by 260 viewBox, a planet centered at (200,130) with radius 70, an ellipse with radii 130 and 36, and a front half-ring. Draw the back ring first, then the planet, then the front ring so the overlap creates depth. Rotate the ring group by -18 degrees around the planet center and add three small stars. These coordinates are an example; a different complete original drawing also satisfies the assignment.

For the Dropdown, create a trigger whose `data-target` matches the ID of a `ul.dropdown-content`. Add a link for each artwork, then initialize `M.Dropdown.init(document.querySelectorAll(".dropdown-trigger"), { coverTrigger: false, constrainWidth: false })`. Each link targets an existing section ID, not a placeholder hash. The Sidenav uses the same six destinations and closes when one is selected. Keep the navigation above the content without obscuring the destination heading.

For ScrollSpy, place `class="scrollspy"` and a unique ID on every artwork section. Initialize `M.ScrollSpy.init(document.querySelectorAll(".scrollspy"), { scrollOffset: offset })`, using the navigation height for the offset. ScrollSpy updates the matching link's active class as sections enter view; it does not create sections or links. Reinitialize after resizing so the offset follows a wrapped navigation bar. Style the active link visibly and retain ordinary anchor navigation. Keep each drawing container's original ID separate from its section ID.

Check five existing drawings and an unfinished sixth area in the starter; check all six complete drawings, all six dropdown destinations, working Sidenav links, and changing ScrollSpy selection in the reference. Test pointer and keyboard navigation, Escape and focus return, the first and last sections, phone and desktop widths, 200% zoom, and reduced motion. Reduced motion displays the rainbow's final state immediately and removes navigation animation. Save a visible drawing change, reopen the same attempt, and export the HTML, CSS, JavaScript, libraries, and licenses together.

Documentation: [Dropdown](https://materializecss.com/dropdown.html), [ScrollSpy](https://materializecss.com/scrollspy.html), [Sidenav](https://materializecss.com/sidenav.html).

Open index.html in a browser without a server. Keep every companion file when exporting. External documentation and source links need a connection.

Original reference: https://codepen.io/junilearning/pen/68807d2000d19574d4c80d354eea197f

Adaptations: Explicit authored continuation starter with five completed Part III pieces. Authored Constellation and Ringed Planet distinguished from four original Juni drawings. Missing Materialize JavaScript and icon font bundled. Real six-destination Dropdown and ScrollSpy with Sidenav retained. Unused jQuery omitted. Responsive viewBoxes and reduced motion preserved.
