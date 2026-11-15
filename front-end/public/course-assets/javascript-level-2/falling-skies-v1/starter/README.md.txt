# Falling Skies

Open index.html without a server. Edit script.js and reload the page.

The blue 30-by-60 player starts at (260,400) on a 550-by-500 canvas. Left and right move eight pixels per simulation tick and clamp the entire rectangle inside the canvas. After a three-second countdown, radius-15 circles fall eight pixels per tick, with a new circle every ten ticks. The score increases once per two seconds of survival. The simulation uses 60 ticks per second, independent of display refresh rate.

Complete circleTouchesRectangle and stepGame in script.js. Clamp the circle center to the rectangle's nearest point. Compare squared distance to radius squared; equality is contact. Check every circle before declaring the player safe. Remove all circles beyond the bottom without skipping adjacent entries. A hit changes the state to lost once and freezes play. Restart creates a fresh countdown. Hold the arrow keys or the on-screen direction controls; releasing focus clears held input.

Trace a harmless first circle followed by a circle at the player's center: the second circle must end play. A circle centered at (245,400) exactly touches the player's left top corner; (246,386) is outside its radius despite overlapping bounding boxes. Review CASES.md, then compare the complete reference only after attempting both functions.

The starter keeps the supplied renderer and input wiring; complete its two TODO functions.
