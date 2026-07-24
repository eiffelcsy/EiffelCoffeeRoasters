/* eiffel.coffee.roasters — root app */

import { useState, useEffect } from 'react';
import { LOTS, FEATURES } from './data.js';
import { TopNav, Footer, Toast, OriginArt, QtyRow, Modal } from './components.jsx';
import { HomePage, ShopPage, LotPage, SubscribePage, AboutPage, FeedbackPage } from './pages.jsx';
import { supabase } from './supabaseClient.js';

// Top-level pages that can be deep-linked via URL hash (e.g. a QR code on the
// packaging pointing at https://your-site/#feedback lands right on the form).
const HASH_PAGES = ['shop', 'about', 'feedback'];

function routeFromHash() {
  const raw = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase();
  const [page, ...rest] = raw.split('/');
  if (!HASH_PAGES.includes(page)) return { page: 'home' };
  // #feedback/<origin-slug> — the QR code on each bag carries its own slug
  if (page === 'feedback' && rest[0]) return { page, origin: rest[0] };
  return { page };
}

const formatOf = (i) => i.lot.formats.find(f => f.id === i.formatId) || i.lot.formats[0];

function cartTotals(items) {
  const subtotal = items.reduce((s, i) => s + formatOf(i).price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 40 ? 0 : 6;
  return { subtotal, shipping, total: subtotal + shipping };
}

// Collects shipping details and records the order in Supabase (status:
// 'pending'). No payment is taken here — that's a future integration that
// will update the order's status once it's wired up.
function CheckoutModal({ open, onClose, items, onPlaced }) {
  const [form, setForm] = useState({
    name: '', email: '', address1: '', address2: '', city: '', state: '', postal: '', country: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | error
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const { subtotal, shipping, total } = cartTotals(items);

  const valid = form.name.trim() && form.email.trim() && form.address1.trim()
    && form.city.trim() && form.postal.trim() && form.country.trim();

  async function submit(e) {
    e.preventDefault();
    if (!valid || status === 'sending') return;
    setStatus('sending');

    const orderId = crypto.randomUUID();
    const { error: orderErr } = await supabase.from('orders').insert({
      id: orderId,
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      address_line1: form.address1.trim(),
      address_line2: form.address2.trim() || null,
      city: form.city.trim(),
      state: form.state.trim() || null,
      postal_code: form.postal.trim(),
      country: form.country.trim(),
      subtotal,
      shipping,
      total,
    });
    if (orderErr) { setStatus('error'); return; }

    const itemRows = items.map(i => {
      const f = formatOf(i);
      return {
        order_id: orderId,
        lot_id: i.lot.id,
        lot_name: i.lot.name,
        format_id: i.formatId,
        format_label: f.label,
        unit_price: f.price,
        qty: i.qty,
        line_total: f.price * i.qty,
      };
    });
    const { error: itemsErr } = await supabase.from('order_items').insert(itemRows);
    if (itemsErr) { setStatus('error'); return; }

    setStatus('idle');
    setForm({ name: '', email: '', address1: '', address2: '', city: '', state: '', postal: '', country: '' });
    onPlaced();
  }

  return (
    <Modal open={open} onClose={onClose} width={480}>
      <div className="modal-eyebrow">// checkout</div>
      <div className="modal-title">Shipping details</div>
      <div className="modal-sub">No payment is collected yet — we'll email you to confirm and arrange it.</div>

      <form onSubmit={submit}>
        <div className="option-group">
          <label>name</label>
          <input className="feedback-input" value={form.name} onChange={set('name')} required />
        </div>
        <div className="option-group">
          <label>email</label>
          <input className="feedback-input" type="email" inputMode="email" value={form.email} onChange={set('email')} required />
        </div>
        <div className="option-group">
          <label>address line 1</label>
          <input className="feedback-input" value={form.address1} onChange={set('address1')} required />
        </div>
        <div className="option-group">
          <label>address line 2 (optional)</label>
          <input className="feedback-input" value={form.address2} onChange={set('address2')} />
        </div>
        <div className="option-group" style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 2 }}>
            <label>city</label>
            <input className="feedback-input" value={form.city} onChange={set('city')} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>state</label>
            <input className="feedback-input" value={form.state} onChange={set('state')} />
          </div>
        </div>
        <div className="option-group" style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>postal code</label>
            <input className="feedback-input" value={form.postal} onChange={set('postal')} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>country</label>
            <input className="feedback-input" value={form.country} onChange={set('country')} required />
          </div>
        </div>

        {status === 'error' && (
          <div className="feedback-error">Something went wrong placing that order — please try again.</div>
        )}

        <div className="modal-actions">
          <button type="button" className="btn is-ghost" onClick={onClose}>cancel</button>
          <button type="submit" className="btn is-accent" disabled={!valid || status === 'sending'}>
            {status === 'sending' ? 'placing order…' : `place order · $${total.toFixed(2)}`} <span className="arrow">→</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}

function CartDrawer({ open, onClose, items, onUpdateQty, onRemove, onCheckout, navigate }) {
  const [pendingRemove, setPendingRemove] = useState(null);
  const { subtotal, shipping, total } = cartTotals(items);
  const pendingItem = pendingRemove !== null ? items[pendingRemove] : null;

  return (
    <>
      <div className={'cart-overlay' + (open ? ' is-open' : '')} onClick={onClose} />
      <aside className={'cart-drawer' + (open ? ' is-open' : '')} aria-hidden={!open}>
        <div className="cart-head">
          <h3>// cart · {items.length} item{items.length === 1 ? '' : 's'}</h3>
          <button className="cart-close" onClick={onClose} aria-label="close cart">×</button>
        </div>
        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <span className="arrow">↘</span>
              Your cart is empty.<br />
              <span style={{fontFamily:'var(--mono)', fontStyle:'normal', fontSize:13, display:'block', marginTop:14}}>
                <a onClick={() => { onClose(); navigate({ page: 'shop' }); }} style={{textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer', color:'var(--ink)'}}>
                  browse origins →
                </a>
              </span>
            </div>
          ) : items.map((i, idx) => (
            <div key={idx} className="cart-item">
              <div className="thumb">
                <OriginArt lot={i.lot} />
              </div>
              <div>
                <div className="name">{i.lot.name}</div>
                <div className="meta">{formatOf(i).label}</div>
                <QtyRow value={i.qty} onChange={(q) => onUpdateQty(idx, q)} />
              </div>
              <div>
                <div className="price">${(formatOf(i).price * i.qty).toFixed(2)}</div>
                <a className="remove" onClick={() => setPendingRemove(idx)}>remove</a>
              </div>
            </div>
          ))}
        </div>
        {items.length > 0 && (
          <div className="cart-foot">
            <div className="cart-foot-row">
              <span>subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="cart-foot-row">
              <span>shipping</span>
              <span>{shipping === 0 ? 'free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="cart-foot-total">
              <span>total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="btn is-accent" onClick={onCheckout}>
              checkout <span className="arrow">→</span>
            </button>
          </div>
        )}
      </aside>

      {pendingItem && (
        <Modal open onClose={() => setPendingRemove(null)}>
          <div className="modal-eyebrow">// remove item</div>
          <div className="modal-title">{pendingItem.lot.name}</div>
          <div className="modal-sub">{formatOf(pendingItem).label} · qty {pendingItem.qty}</div>
          <p className="modal-text">Remove this item from your cart?</p>
          <div className="modal-actions">
            <button className="btn is-ghost" onClick={() => setPendingRemove(null)}>keep it</button>
            <button className="btn is-accent" onClick={() => { onRemove(pendingRemove); setPendingRemove(null); }}>
              remove <span className="arrow">→</span>
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

const CART_KEY = 'eiffel.cart';

function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return raw
      .map(i => ({ lot: LOTS.find(l => l.id === i.lotId), formatId: i.formatId, qty: i.qty }))
      .filter(i => i.lot && i.lot.formats.some(f => f.id === i.formatId) && i.qty > 0);
  } catch {
    return [];
  }
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items.map(i => ({ lotId: i.lot.id, formatId: i.formatId, qty: i.qty }))));
}

export default function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [bumped, setBumped] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  useEffect(() => { saveCart(cart); }, [cart]);

  // keep the app in sync if the user edits the URL / uses back-forward
  useEffect(() => {
    const onHash = () => setRoute(routeFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // scroll top on navigation
  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch { /* older browsers */ }
  }, [route]);

  const navigate = (r) => {
    setRoute(r);
    // mirror simple pages into the URL hash (refresh- and share-safe) without
    // firing hashchange, so it never loops back through the listener above.
    const hash = (!r.id && HASH_PAGES.includes(r.page))
      ? '#' + r.page + (r.page === 'feedback' && r.origin ? '/' + r.origin : '')
      : '';
    try {
      history.replaceState(null, '', hash || window.location.pathname + window.location.search);
    } catch { /* non-browser env */ }
  };

  const addToCart = (lot, formatId, qty) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.lot.id === lot.id && i.formatId === formatId);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { lot, formatId, qty }];
    });
    setBumped(true);
    setTimeout(() => setBumped(false), 400);
    setToast({ show: true, msg: `added · ${lot.name} (${qty})` });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 1800);
  };
  const updateQty = (idx, qty) => {
    setCart(prev => prev.map((i, ix) => ix === idx ? { ...i, qty } : i));
  };
  const removeFromCart = (idx) => {
    setCart(prev => prev.filter((_, ix) => ix !== idx));
  };
  const onOrderPlaced = () => {
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
    setToast({ show: true, msg: 'order received · we’ll email you to confirm' });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2400);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  let pageEl;
  if (route.page === 'home')      pageEl = <HomePage navigate={navigate} />;
  else if (route.page === 'shop') pageEl = <ShopPage navigate={navigate} onAdd={addToCart} />;
  else if (route.page === 'lot')  pageEl = <LotPage id={route.id} navigate={navigate} onAdd={addToCart} />;
  else if (route.page === 'subscribe' && FEATURES.subscriptions) pageEl = <SubscribePage navigate={navigate} onSubscribe={() => {}} />;
  else if (route.page === 'about') pageEl = <AboutPage navigate={navigate} />;
  else if (route.page === 'feedback') pageEl = <FeedbackPage navigate={navigate} origin={route.origin} />;
  else pageEl = <HomePage navigate={navigate} />;

  return (
    <>
      <TopNav
        route={route}
        navigate={navigate}
        cartCount={cartCount}
        cartBumped={bumped}
        onCartOpen={() => setCartOpen(true)} />

      <div key={route.page + ':' + (route.id || '')}>
        {pageEl}
      </div>

      <Footer navigate={navigate} />

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart}
        onUpdateQty={updateQty}
        onRemove={removeFromCart}
        onCheckout={() => setCheckoutOpen(true)}
        navigate={navigate} />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cart}
        onPlaced={onOrderPlaced} />

      <Toast show={toast.show} message={toast.msg} />
    </>
  );
}
