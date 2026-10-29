# For Dad - the birthday present site

A one-page, self-contained site that opens like a present and then plays as a journey,
one stop at a time, like the travel-map scenes in the Indiana Jones films: the wrapped
box, the envelope and card, the DB11 driving in, then a map of the coast where the car
drives from each stop to the next (the camera pulls back and follows it), pauses, and shows
an animated scene and a card for that stop. "Drive on" goes to the next stop, "Back" goes
back. After La Selva Beach the map pulls out to the whole route and the finale plays. The
dots at the top show where you are in the whole journey.

No build step, no frameworks, no trackers, no external requests. Every file in this
folder is the site.

## Where to edit the card

Open `js/card.js`. The whole message is one string called `message` at the top of
the file (currently Matt's text, signed "Love, Matt"). Blank lines separate paragraphs;
single line breaks are kept (that is how "Love," and "Matt" stay on two lines). The first
paragraph is set a little larger, like a greeting. The type size is worked out on the fly
so the message always fills the card, so a longer or shorter message needs no other change. `coverTitle` and `coverDate` are
printed on the front of the card.

Optional photo cover: drop a file named `card.jpg` next to `index.html` and it is used
as the cover art automatically. If there is no `card.jpg`, the DB11 silhouette cover is
used. Nothing else to change.

## Where to edit the trip

Open `js/trip.js`. `stops` is the list of journey stops and map pins, in order. Each stop
has a `title`, `place`, `time` and `text`. Set `minor: true` for a pin the car passes
without stopping. The map positions live in `MAP_POINTS`, and `MAP_ZOOM` sets how close
the camera comes in at each stop. The headline, intro line and the "when" line (shown in
"The whole plan" list from the finale) are the first three fields.

The animated picture at each stop is in `js/scenes.js`, one SVG per stop key.

The trip facts come from Jarvis's PCH road-trip plan (job `pch-road-trip-la-selva-beach`,
researched Oct 27, 2026), with one change on Oct 28: the Day 2 birthday lunch is Nepenthe in
Big Sur (about $100 for two) instead of Sierra Mar at Post Ranch Inn. Nothing on the site is a booking.

## Files

| File | What it is |
|---|---|
| `index.html` | The page: gift, envelope + card, the car, the journey map and stop card, the finale. Also holds the DB11 drawing (`#db11`), traced from a real side-on photo of the car |
| `css/style.css` | All styling, including the 3D box and the card |
| `js/card.js` | **The card text** (edit here) |
| `js/trip.js` | The stops, the map pins and the coastline geometry |
| `js/scenes.js` | The animated scene shown at each stop |
| `js/app.js` | Interaction, animation, synthesised sound, the journey camera |
| `favicon.svg` | Icon |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is |

## Testing shortcuts

- `index.html?go=card` skips the gift and starts at the envelope.
- `index.html?go=car` starts at the car.
- `index.html?go=trip` starts at the first stop on the map.
- `index.html?go=stop&n=5` opens stop 6 (n counts from 0).
- `index.html?go=finale` plays the pull-out to the whole route and the finale.
- Arrow keys work on a computer: right drives on, left goes back.

Sound is synthesised in the browser (no audio files). It only starts after the first
tap, as iPhones require, and the speaker button in the top-right mutes it.

## Publishing

The live copy is https://mwb05.github.io/happy-birthday-dad/ (GitHub Pages for the
`happy-birthday-dad` repo on Matt's personal GitHub account, mwb05). To update: copy these
files into the deploy clone at `websites/_deploy/happy-birthday-dad`, commit, push `main`.
Pages redeploys in about a minute.
