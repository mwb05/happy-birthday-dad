# For Dad - the birthday present site

A one-page, self-contained site that opens like a present: a wrapped box, an envelope
with a birthday card inside, then the reveal of the two-day Pacific Coast Highway drive
to La Selva Beach in the DB11, with a map that draws itself as you scroll.

No build step, no frameworks, no trackers, no external requests. Every file in this
folder is the site.

## Where to edit the card

Open `js/card.js`. The whole message is one string called `message` at the top of
the file (currently Matt's text, signed "Love, Matt"). Blank lines separate paragraphs;
single line breaks are kept (that is how "Love," and "Matt" stay on two lines). The first
paragraph is set a little larger, like a greeting. `coverTitle` and `coverDate` are
printed on the front of the card.

Optional photo cover: drop a file named `card.jpg` next to `index.html` and it is used
as the cover art automatically. If there is no `card.jpg`, the DB11 silhouette cover is
used. Nothing else to change.

## Where to edit the trip

Open `js/trip.js`. `stops` is the list of cards and map pins, in order. Each stop has a
`title`, `place`, `time` and `text`. Set `minor: true` for a pin with no card. The map
positions live in `MAP_POINTS` in the same file. The headline, intro line and the
"when" line at the top of the plan are the first three fields.

The trip facts come from Jarvis's PCH road-trip plan (job `pch-road-trip-la-selva-beach`,
researched Oct 27, 2026), with one change on Oct 28: the Day 2 birthday lunch is Nepenthe in
Big Sur (about $100 for two) instead of Sierra Mar at Post Ranch Inn. Nothing on the site is a booking.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: gift scene, envelope + card scene, the car, the map, the finale |
| `css/style.css` | All styling, including the 3D box and the card |
| `js/card.js` | **The card text** (edit here) |
| `js/trip.js` | The stops, the map pins and the coastline geometry |
| `js/app.js` | Interaction, animation, synthesised sound, the scroll-driven map |
| `favicon.svg` | Icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Testing shortcuts

- `index.html?go=card` skips the gift and starts at the envelope.
- `index.html?go=trip` skips straight to the car and the map.

Sound is synthesised in the browser (no audio files). It only starts after the first
tap, as iPhones require, and the speaker button in the top-right mutes it.

## Publishing

The live copy is https://mwb05.github.io/happy-birthday-dad/ (GitHub Pages for the
`happy-birthday-dad` repo on Matt's personal GitHub account, mwb05). To update: copy these
files into the deploy clone at `websites/_deploy/happy-birthday-dad`, commit, push `main`.
Pages redeploys in about a minute.
