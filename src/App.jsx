/* eiffel.coffee.roasters — root app */

import { useState, useEffect } from 'react';
import { LOTS, FEATURES } from './data.js';
import { TopNav, Footer, Toast, BagArtwork, QtyRow, Modal } from './components.jsx';
import { HomePage, ShopPage, LotPage, SubscribePage, AboutPage } from './pages.jsx';

const formatOf = (i) => i.lot.formats.find(f => f.id === i.formatId) || i.lot.formats[0];

function CartDrawer({ open, onClose, items, onUpdateQty, onRemove, navigate }) {
  const [pendingRemove, setPendingRemove] = useState(null);
  const subtotal = items.reduce((s, i) => s + formatOf(i).price * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 40 ? 0 : 6;
  const total = subtotal + shipping;
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
              <span style={{fontFamily:'var(--mono)', fontStyle:'normal', fontSize:11, display:'block', marginTop:14}}>
                <a onClick={() => { onClose(); navigate({ page: 'shop' }); }} style={{textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer', color:'var(--ink)'}}>
                  browse origins →
                </a>
              </span>
            </div>
          ) : items.map((i, idx) => (
            <div key={idx} className="cart-item">
              <div className="thumb">
                <BagArtwork lot={i.lot} />
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
            <button className="btn is-accent">
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
  const [route, setRoute] = useState({ page: 'home' });
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [bumped, setBumped] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '' });

  useEffect(() => { saveCart(cart); }, [cart]);

  // scroll top on navigation
  useEffect(() => {
    try { window.scrollTo({ top: 0, behavior: 'instant' }); } catch { /* older browsers */ }
  }, [route]);

  const navigate = (r) => setRoute(r);

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

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  let pageEl;
  if (route.page === 'home')      pageEl = <HomePage navigate={navigate} />;
  else if (route.page === 'shop') pageEl = <ShopPage navigate={navigate} onAdd={addToCart} />;
  else if (route.page === 'lot')  pageEl = <LotPage id={route.id} navigate={navigate} onAdd={addToCart} />;
  else if (route.page === 'subscribe' && FEATURES.subscriptions) pageEl = <SubscribePage navigate={navigate} onSubscribe={() => {}} />;
  else if (route.page === 'about') pageEl = <AboutPage navigate={navigate} />;
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
        navigate={navigate} />

      <Toast show={toast.show} message={toast.msg} />
    </>
  );
}
