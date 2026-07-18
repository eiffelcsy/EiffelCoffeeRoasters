# eiffel.coffee.roasters

Storefront for the Eiffel Coffee Roasters micro-roastery, implemented from the
[Claude Design project](https://claude.ai/design/p/9d19f0b7-6b6c-423d-bf2d-54af1cd1d807)
and adapted to the two launch origins:

- **Guji Bule Hora** — Ethiopia · Bule Hora · natural (lot 001)
- **Excelso** — Colombia · Valle del Cauca · fully washed (lot 002)

## Stack

Vite + React 18. No backend — lot data lives in `src/data.js`; the cart persists
to `localStorage`.

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
