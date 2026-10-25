# Debugging Bugging Friends

Debug the starter’s compound conditions using this fictional exercise’s message-rate rules: acquaintance 10, friend 25, good friend 50, and best friend 200 messages per hour. A warning requires both the matching level and a rate strictly above its threshold.

## Checks

The starter intentionally uses incorrect compound conditions. Trace each level at its exact threshold and one message above it, then fix the `&&`/`||` choice. Equal rates do not warn. The reference accepts a recognized level, a nonnegative safe whole message count, and finite elapsed hours greater than zero. It handles Cancel at each prompt and reports invalid input before computing the rate.

## Run

Open index.html in a browser with the exported files together. The project runs offline.

## Source

Adapted from [Juni Learning’s original reference project](https://codepen.io/junilearning/pen/67b0c29a104afde9cce553de6cacf882). The original D3 5.16.0 library is included locally with LICENSE-d3.txt.
