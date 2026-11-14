# Message Board

Build a single-browser topic board with separate title, site URL and optional image-address fields. Complete addTopic(state, title, url, imageUrl, id) and renderTopics(state) in script.js. The supplied version-one fixture contains two topics with stable IDs and ordering values.

addTopic validates the ID, a 1–100-character title and the two addresses, then creates one post with a locally increasing order value. Reject repeated IDs and more than 30 topics. Use reviewedUrl for the explicit site/image origins in storage.js. An empty image address is valid and uses the supplied decorative illustration. A failed image load exposes a text fallback.

renderTopics sorts a copy by descending order, builds each article with DOM methods, assigns the title with textContent and links to its reviewed site URL. Assign image addresses through the img src property and handle load failure. The supplied transaction saves a validated clone before changing working state. Reset requires confirmation; read-only recovery preserves original saved bytes.

Create at least two new topics and check ordering, the three distinct fields, refresh, markup-shaped titles, disallowed URLs, image failure, record/document limits, corrupted storage and failed saving. Adding comments is a separate optional extension; this core board displays topics.

## Run and continue

Open index.html in a current browser. For stable origin-based persistence, an available Python 3 installation can serve this exported folder with: python3 -m http.server 8000 --bind 127.0.0.1 . Open http://127.0.0.1:8000 in that case. Direct file storage varies by browser;denied storage shows the read-only example. Keep the same origin and browser profile for refresh checks. IDE code exports contain the project files;localStorage is separate. Read storage.js and CASES.md before comparing the reference.

Complete addTopic, renderTopics before comparing the reference.
