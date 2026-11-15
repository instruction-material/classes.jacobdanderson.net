# My Favorite Businesses

Create an array containing at least three business objects. Each object has a name and at least
three other properties, including a products array with at least three entries. Iterate over the
objects and their product arrays. Call printToScreen once or twice per business to produce a
one- or two-sentence description containing every property. The supplied four-key path uses
name,location,CEO and products. All supplied records are fictional; another valid dataset may
retain these minimums and document corresponding expected results.

## Files and execution

Open index.html in a browser without a server. The stylesheet, D3 library, script, complete inputs
and original source notices are included locally. Implement the missing project code in script.js
above the supplied helper boundary. The starter keeps the original assignment and blank entry
area; the reference completes the object and nested-loop task. No prompt, account or network
request is part of this assignment.

## Required input data

[
  {
    "name": "Cedar Trail Outfitters",
    "location": "Fairhaven",
    "CEO": "Rowan Patel",
    "products": [
      "Daypack",
      "Trail Bottle",
      "Rain Shell"
    ]
  },
  {
    "name": "Sunrise Bakery",
    "location": "Mapleton",
    "CEO": "Avery Kim",
    "products": [
      "Sourdough",
      "Blueberry Muffin",
      "Cinnamon Roll"
    ]
  },
  {
    "name": "Harbor Books",
    "location": "Lakeside",
    "CEO": "Morgan Reed",
    "products": [
      "Mystery Novel",
      "Nature Guide",
      "Sketchbook"
    ]
  }
]

Each property is a nonempty string except products, which is an array of at least three nonempty
strings. The reference prints a location/CEO sentence, then a products sentence for each business.
Read CASES.md for all six complete expected paragraphs and independent transfer checks.

## Completion evidence

Show all six paragraphs in array order and all three products in each products sentence.
Add a fourth valid business object and obtain eight paragraphs without adding another print
statement outside the loop. Change one existing property's value and one products array; the
same renderer must reflect both edits. Explain which loop visits business objects and which
visits product entries. Keep the supplied helper below its boundary.

## Source and declared adaptation

SOURCES.md records both original CodePen URLs, captured settings and source hashes.
LICENSE-original.txt retains the original starter's MIT notice and fork attribution.
The local reference uses newly authored fictional records. The printToScreen API, D3 output
and one-second colored entrance remain; wrapping paragraphs, readable colors and a reduced-motion
path replace the fixed1500pixel SVG helper. The already verified D3 7.9.0 library and its license
are bundled. The private reference export contained no separate license file.
