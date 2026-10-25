# Wholesome Memes

Prompt for a word or sentence. Build a new string whose even-indexed characters are lowercase and odd-indexed characters are uppercase. Indices include spaces and punctuation; index zero is lowercase.

## Checks

For `HELLO WORLD`, expect `hElLo wOrLd`. For `a b!`, expect `a b!` because the space occupies index one. The reference rejects blank input and handles Cancel before reading `.length`. The supplied character-index loop uses JavaScript string indices.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

## Source

Adapted from [Juni Learning's original reference project](https://codepen.io/junilearning/pen/bf0a3506f98d1b247c3f259986a941bd). The original D3 5.16.0 library is supplied locally with LICENSE-d3.txt.
