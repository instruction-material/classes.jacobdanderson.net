# Strength Tester

Build the original carnival Strength Tester. A button click chooses an integer from 0 through 500, shows that score, and selects one of five prize images and messages. The original starter is an assignment comment; the local starter adds a page heading and companion files while leaving the application unfinished. The reference retains the original five prize types and score boundaries, with locally authored SVG illustrations.

`Math.random()` returns a value from zero inclusive to one exclusive. Multiplying by 501 and applying `Math.floor()` creates the 501 possible integers 0 through 500. Multiplying by 500 never generates 500. Generate a fresh score inside the click handler, then pass that score to a separate prize-selection function. The score is a fictional game result, not a measurement of physical strength.

Use one ordered if/else-if chain: 0–100 wins a yo-yo, 101–200 a frisbee, 201–300 a football, 301–400 a basketball, and 401–500 a teddy bear. Test `score <= 100`, then `<= 200`, `<= 300`, `<= 400`, and finally the remaining valid scores. Separate independent if statements can overwrite a prize; gaps or overlapping boundaries can leave a score with the wrong message.

Select the button and result elements with D3. In `.on("click", callback)`, generate the score and update the score text, image `src`, meaningful image `alt`, and prize message together. Keep the image hidden until a real prize has been chosen. Put the changing score and message in a polite live region so the update is available without moving keyboard focus from the button. Use paths such as `images/yo-yo.svg`; these companions work without an image service.

Temporarily inject fixed random values or call the prize-selection function with 0, 100, 101, 200, 201, 300, 301, 400, 401, and 500. Confirm all five tiers, including the maximum, and repeat clicks to confirm updates replace earlier results. Restore normal randomness after testing. Check keyboard activation, complete images, readable messages, phone layout, and 200% zoom. Save a visible prize or color change, reopen the same attempt, and export every file.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original starter: https://codepen.io/junilearning/pen/afcffeca5355cf07d9882f08c90ab84c

Adaptations: Inclusive maximum score 500 in reference. Original five prize tiers retained. Authored local SVG illustrations replace remote product photographs. Unfinished starter remains unfinished.
