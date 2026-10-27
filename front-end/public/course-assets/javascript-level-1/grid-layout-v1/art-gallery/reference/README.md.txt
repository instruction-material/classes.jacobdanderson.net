# Art Gallery

Build a gallery containing all 12 supplied artworks, artists, local images, visual descriptions, and links from `README.md`. Put each artwork in a horizontal card with an image frame and a text area. Use a heading for the work, name its artist, and describe something visible in the image rather than repeating the title. Preserve each image's aspect ratio and use a meaningful alternative.

Use CSS Grid to arrange four cards per row on desktop, three on tablets, and one on phones. Apply `grid-template-columns: repeat(4, minmax(0, 1fr))` at large widths, three tracks from 601px, and one below that. Within a card, use two flexible tracks for image and text; stack them when the available width is too small. `minmax(0, 1fr)` lets long content shrink and wrap instead of forcing page overflow.

Give each image a visible frame, use `object-fit: contain`, and let the card grow to fit the complete description. Keep links underlined and provide a visible `:focus-visible` outline.

The starter leaves the artwork cards unfinished. Check all 12 headings and artist names, all 12 loaded images and complete descriptions, four/three/one-column reflow, correct destinations, keyboard focus, readable contrast, and no horizontal overflow at phone widths or 200% zoom. The gallery renders offline; following an external source link needs a connection. Save one visible framing change and export every companion file.

Open index.html in a browser without a server. Keep every companion file when exporting.

Original source: https://codepen.io/junilearning/pen/45dabf41b44570f312ef9334db333f97

## Supplied artworks

- [Mona Lisa](https://en.wikipedia.org/wiki/Mona_Lisa) by Leonardo Da Vinci. A seated woman folds her hands before a distant landscape. Image: `images/art-1.svg`.
- [The Starry Night](https://en.wikipedia.org/wiki/The_Starry_Night) by Vincent van Gogh. A swirling night sky hangs above a village and dark cypress. Image: `images/art-2.svg`.
- [The Water Lily Pond](https://en.wikipedia.org/wiki/Water_Lilies_(Monet_series)) by Claude Monet. A curved bridge crosses a pond filled with water lilies. Image: `images/art-3.svg`.
- [The Persistence of Memory](https://en.wikipedia.org/wiki/The_Persistence_of_Memory) by Salvador Dalí. Soft watches drape across objects in an open landscape. Image: `images/art-4.svg`.
- [The Flower Picker](https://en.wikipedia.org/wiki/Diego_Rivera) by Diego Rivera. A flower carrier bends beneath a basket of pink blossoms. Image: `images/art-5.svg`.
- [The Scream](https://en.wikipedia.org/wiki/The_Scream) by Edvard Munch. A figure holds its face beneath bands of red and orange sky. Image: `images/art-6.svg`.
- [Girl with a Pearl Earring](https://en.wikipedia.org/wiki/Girl_with_a_Pearl_Earring) by Johannes Vermeer. A young woman turns toward the viewer in a blue and pale-yellow head covering. Image: `images/art-7.svg`.
- [Campbell's Soup Cans](https://en.wikipedia.org/wiki/Campbell%27s_Soup_Cans) by Andy Warhol. Thirty-two soup-can panels repeat a familiar product design. Image: `images/art-8.svg`.
- [Untitled](https://en.wikipedia.org/wiki/Mark_Rothko) by Mark Rothko. Orange, brown and blue fields form stacked soft-edged rectangles. Image: `images/art-9.svg`.
- [Bust of a Woman](https://en.wikipedia.org/wiki/Pablo_Picasso) by Pablo Picasso. Angular facial features and a wide hat rise above a green blouse. Image: `images/art-10.svg`.
- [Transverse Line](https://en.wikipedia.org/wiki/Wassily_Kandinsky) by Wassily Kandinsky. Overlapping circles, lines and geometric shapes cross a pale ground. Image: `images/art-11.svg`.
- [American Gothic](https://en.wikipedia.org/wiki/American_Gothic) by Grant Wood. Two figures stand before a house; one holds a pitchfork. Image: `images/art-12.svg`.
