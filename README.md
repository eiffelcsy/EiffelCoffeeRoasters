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

Vite + React 18. Lot data lives in `src/data.js`; the cart persists to
`localStorage`. Feedback and orders are stored in Supabase (see below).

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

## Backend (Supabase)

Feedback and orders are stored in a linked Supabase project (see `supabase/schema.sql`
for the exact tables/policies applied). The client reads its connection info from
Vite env vars — copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` (Project Settings → API in the Supabase dashboard). The
anon key is safe to ship to the browser: every table it touches has row-level
security enabled and only grants `INSERT` — nothing can be read, updated, or
deleted with it. Read/manage data from the Supabase dashboard's table editor.

Tables:
- `feedback` — one row per submission from the form below
- `orders` / `order_items` — one row per checkout, in cart-not-payment form (see
  the "Orders / checkout" section)

## Feedback form

A short feedback form lives at `#feedback` (linked in the footer, and meant to
be the target of a QR code on the drip-bag packaging). It collects an optional
email, a required 1–5 rating (1 bad, 5 good), and optional comments, and inserts
directly into the `feedback` table.

For the QR code, point it at `https://your-domain/#feedback` — the app reads the
URL hash on load and opens the form directly.

### Per-origin QR codes

To know *which bag* a rating came from, give each origin its own QR code using
its `slug` (defined in `src/data.js`):

- Guji Bule Hora → `https://your-domain/#feedback/guji-bule-hora`
- Excelso → `https://your-domain/#feedback/excelso`

The origin is captured in every submission as `origin` (the slug) and
`origin_name` (the readable name); a plain `#feedback` scan records
`origin: "unspecified"`. The form also shows the coffee's name in its header so
the customer can confirm they're rating the right bag. New origins get their own
URL automatically — just give the lot a `slug` in `src/data.js`.

## Orders / checkout

Clicking "checkout" in the cart drawer opens a form (name, email, shipping
address) and, on submit, writes an `orders` row plus one `order_items` row per
cart line to Supabase with `status: 'pending'`, then clears the cart. **No
payment is collected yet** — this only records what the customer wants to buy
so you have a queue to work from; wire up a real payment/checkout API later and
have it flip `status` to `'paid'` (or add new statuses as needed).

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
- `src/pages.jsx` — home, shop, lot detail, 4-step subscribe flow, about, feedback
- `src/App.jsx` — routing, cart drawer, checkout form, toast
- `src/supabaseClient.js` — Supabase client, reads `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`
- `src/styles.css` — the design system (Newsreader + JetBrains Mono, paper palette)
- `supabase/schema.sql` — the tables + RLS policies applied to the linked project
