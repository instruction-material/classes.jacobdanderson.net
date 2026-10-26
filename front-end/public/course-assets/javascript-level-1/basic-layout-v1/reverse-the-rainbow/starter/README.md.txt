# Reverse The Rainbow

Build a row of seven different Material Icons in rainbow order. The original reference uses face, bug_report, fingerprint, autorenew, build, card_travel, and event_seat, colored red through purple. At large widths use Materialize's `large` icon size. At medium and smaller widths reverse both the order and colors and use `small` icons.

Load the included Materialize 1.0.0 CSS and `vendor/material-icons.css`. The icon CSS embeds the original Material Icons 3.0.1 font, so the page does not depend on a font service. A glyph is selected by a ligature name, for example `<i class="material-icons large red-text" aria-hidden="true">face</i>`. Keep an accessible text name for every example; icons used in real buttons or links also need a readable action label.

Use two wrappers. Give the large row `row center hide-on-med-and-down` and the compact row `row center hide-on-large-only`. In this included CSS, the large row is hidden at 992px and below; the compact row is hidden at 993px and above. `large` means 6rem and `small` means 2rem. Write the compact row's elements in reverse DOM order so reading order agrees with what is displayed. Hidden wrappers use `display: none`, so only one set is exposed at a time.

Test 992px and 993px as well as phone and wide-desktop widths. Confirm that exactly one row is visible, each row has seven loaded icon glyphs, the order reverses at the breakpoint, and icon sizes change. Let the compact row wrap at high zoom instead of clipping or hiding examples.

Open index.html in a browser; keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/ab476697ba2b3957601555751bda65fb
