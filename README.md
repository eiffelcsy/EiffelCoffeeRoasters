# eiffel.coffee.roasters

Storefront for the Eiffel Coffee Roasters micro-roastery, implemented from the
[Claude Design project](https://claude.ai/design/p/9d19f0b7-6b6c-423d-bf2d-54af1cd1d807)
and adapted to the two launch origins:

- **Guji Bule Hora** — Ethiopia · Bule Hora · natural
- **Excelso** — Colombia · Valle del Cauca · fully washed

These are the two permanent origins; rotating origins can be added to the same
list in `src/data.js` later. Taglines: "home roasted, for the home barista"
(home hero) and "there's no one way to coffee" (footer).

## Stack

Vite + React 18. No backend — lot data lives in `src/data.js`; the cart persists
to `localStorage`.

Typography follows the bag labels: bold serif for titles, IBM Plex Mono for
everything else. The palette is textured off-white on kraft cardboard, matching
the physical packaging.

Origin visuals are AI-generated abstract artwork — drop image files into
`public/origins/` (see the README there). Until a file exists, the site shows
a gradient placeholder built from that coffee's flavour palette (set per lot
in `src/data.js`). The home page cycles the origins in a borderless carousel.

Products are sold in two formats per lot — drip bags (box of 10, the primary
format) and whole bean 250g — defined per lot in `src/data.js`.

The subscription flow is built but disabled — flip `FEATURES.subscriptions` in
`src/data.js` to restore it (nav link, footer link, and route all come back).

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure

- `src/data.js` — the two lots (label data: altitude, varietal, process, tasting
  notes, 250g), filter lists, grind + subscription options
- `src/components.jsx` — tower mark / brand lockup, nav, bag artwork (SVG
  replica of the printed labels), flavor radar, footer
- `src/pages.jsx` — home, shop, lot detail, 4-step subscribe flow, about
- `src/App.jsx` — routing, cart drawer, toast
- `src/styles.css` — the design system (Newsreader + JetBrains Mono, paper palette)
