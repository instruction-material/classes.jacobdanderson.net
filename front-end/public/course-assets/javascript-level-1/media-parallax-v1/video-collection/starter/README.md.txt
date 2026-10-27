# Video Collection

Create a collection of nine embedded videos using Materialize's responsive video container and grid. Include a descriptive title and a short description for each selection. The starter retains the original unfinished exercise; its nine cards still need to be built. The reference is an example collection of Nintendo Switch trailers, with three columns on wide screens and a single column on a phone. Eight original video selections remain; `SOURCES.md` records the verified private original fourth video and its explicitly authored replacement.

Load `vendor/materialize.min.css` and `styles.css` in the head. A responsive video embed uses a `div.video-container` containing an iframe. Use an explicit HTTPS URL such as `https://www.youtube.com/embed/_3YNL0OWio0`, with a unique, meaningful iframe title and `allowfullscreen`. Use `referrerpolicy="strict-origin-when-cross-origin"`; embedded YouTube playback requires an HTTP Referer identifying the page. Keep videos user-started rather than autoplaying. Each card also needs a normal watch link so its selection can still be opened when embedded playback is restricted. Do not download or redistribute the videos.

Use a `row` with `col s12 m6 l4` card columns and consistent spacing. Keep each video at least 200 by 200 CSS pixels, including at large text sizes. The supplied `.video-scroll` wrapper permits local horizontal scrolling only when the available card width falls below that player minimum; the text and page still reflow. Keep navigation and the title outside the player so neither disappears if YouTube is unavailable. Videos need no Materialize JavaScript initialization; the original unused jQuery dependency is omitted.

This exported collection needs a local HTTP server and an internet connection for embedded playback. With Python 3 installed, open a terminal in the extracted folder containing index.html and run `python3 -m http.server 8000 --bind 127.0.0.1`, then visit `http://127.0.0.1:8000`. Choose another available port if necessary and use Ctrl+C to stop this exercise's server. Opening a file:// page can make YouTube report error 153 because it lacks an HTTP Referer. The watch links remain an alternative. No npm installation is required. Offline checks can verify the layout and local files, but cannot prove external video playback.

Check all nine different players, their titles, short descriptions, matching watch links, and a phone and desktop layout. Test keyboard access, 200% zoom, a refused or offline video request, and actual playback over HTTP with a connection. Save a visible title or style change, reopen the same attempt, and export every companion file. Read `SOURCES.md` before changing the example selections.

Documentation: [Materialize responsive media](https://materializecss.com/media-css.html), [YouTube embed parameters](https://developers.google.com/youtube/player_parameters), [YouTube player requirements and errors](https://developers.google.com/youtube/iframe_api_reference).

Serve the extracted folder over HTTP with an internet connection for video playback; see the command above.

Original starter: https://codepen.io/junilearning/pen/71ea495430eac148ba6c02e837de1727

Adaptations: Original unfinished starter preserved as an explicit scaffold. Eight original video IDs retained; private fourth selection replaced by explicitly authored official Nintendo trailer. Protocol-relative URLs changed to HTTPS with explicit Referer policy. Titles, short descriptions, matching watch links and responsive minimum-size players supplied. Local Materialize CSS and license included; unused jQuery omitted. HTTP origin and network requirements stated without claiming offline playback.
