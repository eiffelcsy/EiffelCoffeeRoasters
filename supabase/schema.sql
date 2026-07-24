-- eiffel.coffee.roasters — database schema
-- Applied to the linked Supabase project via the `create_feedback_and_orders`
-- migration. Kept here for reference; this file is not run automatically.

-- feedback: one row per submission from the #feedback form / QR code scans
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  rating smallint not null check (rating between 1 and 5),
  email text,
  comments text,
  origin text not null default 'unspecified',
  origin_name text,
  created_at timestamptz not null default now()
);

alter table public.feedback enable row level security;

-- storefront visitors can submit feedback but never read anyone's submissions back
create policy "anon can insert feedback"
  on public.feedback
  for insert
  to anon
  with check (true);

-- orders: created when a customer submits the checkout form (no payment
-- processing yet — status starts at 'pending' and is updated manually /
-- by a future payment integration)
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text not null,
  address_line1 text not null,
  address_line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'fulfilled', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  lot_id integer not null,
  lot_name text not null,
  format_id text not null,
  format_label text not null,
  unit_price numeric(10,2) not null,
  qty integer not null check (qty > 0),
  line_total numeric(10,2) not null
);

create index order_items_order_id_idx on public.order_items(order_id);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- storefront visitors can create an order + its line items at checkout,
-- but cannot read, update, or delete any order (including their own) —
-- that's for the dashboard / a future authenticated account area
create policy "anon can insert orders"
  on public.orders
  for insert
  to anon
  with check (true);

create policy "anon can insert order items"
  on public.order_items
  for insert
  to anon
  with check (true);
