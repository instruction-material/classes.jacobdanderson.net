# Asteroids

Open index.html without a server. Edit script.js and reload the page.

The 550-by-500 canvas begins with the original triangular ship at (100,100). A and D rotate five degrees per simulation tick; W moves one pixel in the ship's forward direction. The on-screen controls provide the same actions. Space and F share one ten-tick firing cooldown. Bullets move five pixels per tick; radius-50 asteroids enter from a random edge every five seconds and move two pixels per tick. Motion uses 60 simulation ticks per second. The ship and asteroids wrap at the canvas boundary.

Complete shipTouchesCircle and stepGame in script.js. Rotate the three local triangle vertices around the ship center. A circle hits if its center lies inside the triangle or its distance from any edge is at most its radius. Bullet collision uses squared center distance and the combined radii. Remove the hit parent, add two half-radius children only when their radius exceeds ten, and score once. Keep bullets in the single game loop, removing spent or off-screen entries.

Death freezes firing, spawning and score until Restart. Focus loss releases all controls. Check CASES.md for the ten-tick cooldown, a single split and a stopped terminal state. Increasing bullet speed requires a swept collision method; this assignment's fixed speeds are the stated model. Compare the complete reference after attempting both functions.

The reference completes both functions and supplies a comparison after the starter attempt.
