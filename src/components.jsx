/* eiffel.coffee.roasters — shared components */

import { useState, useEffect } from 'react';
import { FEATURES } from './data.js';

// =================== LOGO ===================
// The real logo file (public/logo.svg). It has a white background baked in,
// so mix-blend-mode: multiply drops the white against the paper page.
export function Lattice({ size = 24, className = 'lattice' }) {
  return (
    <img
      className={className}
      src="/logo.svg"
      alt=""
      width={size}
      height={size}
      style={{ mixBlendMode: 'multiply', objectFit: 'contain' }}
    />
  );
}

// =================== BRAND LOCKUP ===================
export function BrandLockup({ onClick, size = 'sm' }) {
  return (
    <button className="brand-lockup" onClick={onClick} aria-label="eiffel.coffee.roasters — home">
      <Lattice size={size === 'sm' ? 28 : 36} />
      <span className="wordmark">eiffel.coffee.roasters</span>
    </button>
  );
}

// =================== TOP NAV ===================
export function TopNav({ route, navigate, cartCount, cartBumped, onCartOpen }) {
  const links = [
    { id: 'home', label: 'home' },
    { id: 'shop', label: 'shop' },
    ...(FEATURES.subscriptions ? [{ id: 'subscribe', label: 'subscribe' }] : []),
    { id: 'about', label: 'about' },
  ];
  return (
    <nav className="topnav">
      <div className="topnav-inner">
        <BrandLockup onClick={() => navigate({ page: 'home' })} />
        <div className="nav-links">
          {links.map(l => {
            const active = route.page === l.id || (l.id === 'shop' && route.page === 'lot');
            return (
              <a key={l.id}
                 className={'nav-link' + (active ? ' is-active' : '')}
                 onClick={() => navigate({ page: l.id })}>
                {l.label}
              </a>
            );
          })}
        </div>
        <div className="nav-right">
          <button className={'cart-btn' + (cartBumped ? ' bumped' : '')} onClick={onCartOpen}>
            <span>cart</span>
            <span className="count">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// =================== ORIGIN ARTWORK ===================
// Abstract AI-generated artwork per origin. Drop images into public/origins/
// (paths set per lot in data.js). Until an image exists, renders an abstract
// gradient placeholder built from the lot's flavour palette.
function placeholderBg(lot) {
  const [a, b, c] = lot.palette || ['#8a6842', '#c9ad83', '#f1ede3'];
  return [
    `radial-gradient(120% 90% at 20% 12%, ${c} 0%, transparent 60%)`,
    `radial-gradient(110% 90% at 85% 30%, ${b} 0%, transparent 65%)`,
    `radial-gradient(130% 110% at 50% 95%, ${a} 0%, ${b} 100%)`,
  ].join(', ');
}

export function OriginArt({ lot, className = '' }) {
  const [failed, setFailed] = useState(false);
  if (lot.image && !failed) {
    return (
      <img className={'origin-art ' + className}
           src={lot.image}
           alt={`${lot.name} — abstract artwork`}
           onError={() => setFailed(true)} />
    );
  }
  return (
    <div className={'origin-art ' + className}
         style={{ background: placeholderBg(lot) }}
         role="img"
         aria-label={`${lot.name} — abstract artwork`} />
  );
}

// =================== ORIGIN CAROUSEL ===================
// Minimalist borderless crossfade through the current origins.
export function OriginCarousel({ lots, navigate, interval = 5000 }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % lots.length), interval);
    return () => clearInterval(t);
  }, [lots.length, interval]);
  const lot = lots[idx];
  return (
    <div className="carousel" onClick={() => navigate({ page: 'lot', id: lot.id })}>
      <div className="carousel-frame">
        {lots.map((l, i) => (
          <div key={l.id} className={'carousel-slide' + (i === idx ? ' is-active' : '')}>
            <OriginArt lot={l} />
          </div>
        ))}
      </div>
      <div className="carousel-foot">
        <span>{lot.name.toLowerCase()} · {lot.origin.toLowerCase()}</span>
        <span className="carousel-dots">
          {lots.map((l, i) => (
            <button key={l.id}
                    className={'carousel-dot' + (i === idx ? ' is-on' : '')}
                    onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                    aria-label={`show ${l.name}`} />
          ))}
        </span>
      </div>
    </div>
  );
}

// =================== FLAVOR RADAR ===================
export function FlavorRadar({ lot }) {
  const axes = ['floral', 'acid', 'body', 'sweet', 'bitter', 'aroma'];
  const cx = 130, cy = 130, r = 90;
  const n = axes.length;
  const point = (i, mag) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * r * mag, cy + Math.sin(a) * r * mag];
  };
  const labelPos = (i) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(a) * (r + 22), cy + Math.sin(a) * (r + 22)];
  };

  const polyPoints = (mag) =>
    axes.map((_, i) => point(i, mag).join(',')).join(' ');

  const valuePoints = axes.map((ax, i) => point(i, lot.flavors[ax]).join(',')).join(' ');

  return (
    <div className="radar-wrap">
      <div className="radar-head">
        <h4>// flavor.profile</h4>
        <span className="mono" style={{fontSize:13,color:'var(--muted)'}}>score · <span style={{color:'var(--ink)'}}>{lot.score}</span></span>
      </div>
      <svg className="radar-svg" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
        {[0.33, 0.66, 1].map((m, i) => (
          <polygon key={i} points={polyPoints(m)} fill="none"
                   stroke="var(--line)" strokeWidth="0.6"
                   strokeDasharray={i < 2 ? '2 3' : 'none'} />
        ))}
        {axes.map((_, i) => {
          const [x, y] = point(i, 1);
          return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth="0.4" />;
        })}
        <polygon points={valuePoints} fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="1.4" />
        {axes.map((ax, i) => {
          const [x, y] = point(i, lot.flavors[ax]);
          return <circle key={ax} cx={x} cy={y} r="3" fill="var(--accent)" />;
        })}
        {axes.map((ax, i) => {
          const [x, y] = labelPos(i);
          return (
            <text key={ax} x={x} y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="10"
                  fill="var(--ink-2)">{ax}</text>
          );
        })}
      </svg>
    </div>
  );
}

// =================== MODAL ===================
export function Modal({ open, onClose, children, width = 440 }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: `min(${width}px, 100%)` }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// =================== QTY ROW ===================
export function QtyRow({ value, onChange, min = 1, max = 9 }) {
  return (
    <div className="qty-row">
      <button onClick={() => onChange(Math.max(min, value - 1))} aria-label="decrease">−</button>
      <span className="qty">{value}</span>
      <button onClick={() => onChange(Math.min(max, value + 1))} aria-label="increase">+</button>
    </div>
  );
}

// =================== TOAST ===================
export function Toast({ message, show }) {
  return (
    <div className={'toast' + (show ? ' is-on' : '')}>
      <span>✓</span>
      <span>{message}</span>
    </div>
  );
}

// =================== FOOTER ===================
export function Footer({ navigate }) {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-brand">
          <Lattice size={22} className="lattice" />
          <p>home roasted, for the home barista</p>
          <p className="mono" style={{fontSize:14, color:'var(--muted)'}}>// est. 2026</p>
        </div>
        <div className="foot-col">
          <h5>menu</h5>
          <ul>
            <li><a onClick={() => navigate({ page: 'shop' })}>shop</a></li>
            {FEATURES.subscriptions && <li><a onClick={() => navigate({ page: 'subscribe' })}>subscribe</a></li>}
            <li><a onClick={() => navigate({ page: 'about' })}>about</a></li>
            <li><a onClick={() => navigate({ page: 'feedback' })}>feedback</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>contact</h5>
          <ul>
            <li><a href="mailto:eiffelcoffeeroasters@gmail.com">eiffelcoffeeroasters@gmail.com</a></li>
            <li>
              <a href="https://www.instagram.com/eiffel.coffee.roasters/" target="_blank" rel="noopener noreferrer">
                @eiffel.coffee.roasters
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="foot-base">
        <span>© 2026 Eiffel Coffee Roasters</span>
      </div>
    </footer>
  );
}
