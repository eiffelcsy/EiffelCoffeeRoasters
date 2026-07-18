/* eiffel.coffee.roasters — shared components */

// =================== TOWER MARK ===================
// Line-drawn Eiffel tower, matching the bag-label logo.
export function Lattice({ size = 16, stroke = 1.1, className = 'lattice' }) {
  return (
    <svg
      className={className}
      width={size}
      height={(size * 34) / 24}
      viewBox="0 0 24 34"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 1 V4" />
      <path d="M11.1 4 C11 9 10.2 14 9.2 18 C8 23 5.6 28.6 2.4 33" />
      <path d="M12.9 4 C13 9 13.8 14 14.8 18 C16 23 18.4 28.6 21.6 33" />
      <path d="M5.2 33 Q12 24 18.8 33" strokeWidth={stroke * 0.8} />
      <path d="M10.2 8 H13.8" strokeWidth={stroke * 0.7} />
      <path d="M9.5 12.5 H14.5" strokeWidth={stroke * 0.7} />
      <path d="M8.6 18 H15.4" strokeWidth={stroke * 0.8} />
      <path d="M9.5 12.5 L14.5 18 M14.5 12.5 L9.5 18" strokeWidth={stroke * 0.45} />
      <path d="M8.6 18 L17.4 29.5 M15.4 18 L6.6 29.5" strokeWidth={stroke * 0.45} />
    </svg>
  );
}

// =================== BRAND LOCKUP ===================
export function BrandLockup({ onClick, size = 'sm' }) {
  return (
    <button className="brand-lockup" onClick={onClick} aria-label="eiffel.coffee.roasters — home">
      <Lattice size={size === 'sm' ? 14 : 22} />
      <span className="wordmark">eiffel.coffee.roasters</span>
    </button>
  );
}

// =================== TOP NAV ===================
export function TopNav({ route, navigate, cartCount, cartBumped, onCartOpen }) {
  const links = [
    { id: 'home', label: 'home' },
    { id: 'shop', label: 'shop' },
    { id: 'subscribe', label: 'subscribe' },
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
          <input className="nav-search" placeholder="search lots, origins, notes…" />
          <button className={'cart-btn' + (cartBumped ? ' bumped' : '')} onClick={onCartOpen}>
            <span>cart</span>
            <span className="count">{cartCount}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// =================== SEAL (stamp accent) ===================
// Red stamp with the tower mark — the wabi-sabi accent, on-brand.
export function Seal({ size = 34, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 34 34" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="33" height="33" rx="3" fill="var(--seal)" />
      <g transform="translate(8 5.5)" stroke="var(--paper)" fill="none" strokeWidth="1.2" strokeLinecap="round">
        <path d="M9 1 V3.2" transform="scale(0.75 0.68)" />
        <g transform="scale(0.75 0.68)">
          <path d="M11.1 4 C11 9 10.2 14 9.2 18 C8 23 5.6 28.6 2.4 33" />
          <path d="M12.9 4 C13 9 13.8 14 14.8 18 C16 23 18.4 28.6 21.6 33" />
          <path d="M5.2 33 Q12 24 18.8 33" strokeWidth="1" />
          <path d="M9.5 12.5 H14.5" strokeWidth="0.9" />
          <path d="M8.6 18 H15.4" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}

// =================== ENSO (brushed open circle) ===================
export function Enso({ size = 120, className = '' }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 78 26 A 40 40 0 1 0 90 42"
            stroke="var(--ink)" strokeWidth="5" strokeLinecap="round" opacity="0.82" />
    </svg>
  );
}

// =================== BAG ARTWORK ===================
// The bag front, drawn to match the real labels: tower + wordmark header,
// serif lot name, spec rows, "> tasting notes", roasted_on, 250g.
export function BagArtwork({ lot }) {
  const tones = {
    sand: { bg: '#f1ecdd', ink: '#221e1a' },
    rust: { bg: '#f4f1ea', ink: '#221e1a' },
  };
  const t = tones[lot.color] || { bg: '#f4f1ea', ink: '#221e1a' };
  const mono = 'JetBrains Mono, monospace';
  const serif = 'Newsreader, serif';
  const nameSize = lot.name.length > 9 ? 27 : 40;
  const sub = `${lot.origin.toLowerCase()} · ${lot.region.toLowerCase()} · ${lot.process}`;
  const specs = [
    ['altitude', lot.altitude],
    ['varietal', lot.varietal],
    ['process', lot.processLabel || lot.process],
  ];
  return (
    <svg viewBox="0 0 280 360" className="bag-art" style={{ width: '100%', height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id={`grain-${lot.id}`} width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="3" fill={t.bg} />
          <circle cx="1" cy="1" r="0.4" fill={t.ink} opacity="0.05" />
        </pattern>
      </defs>
      {/* bag shape with fold line */}
      <path d="M 30 28 L 250 28 L 250 332 Q 250 344 238 344 L 42 344 Q 30 344 30 332 Z"
            fill={`url(#grain-${lot.id})`} stroke={t.ink} strokeWidth="1.2" />
      <line x1="30" y1="48" x2="250" y2="48" stroke={t.ink} strokeWidth="0.6" opacity="0.5" />

      {/* header: tower mark + wordmark */}
      <g transform="translate(48 64) scale(0.62)" stroke={t.ink} fill="none" strokeWidth="1.2" strokeLinecap="round">
        <path d="M12 1 V4" />
        <path d="M11.1 4 C11 9 10.2 14 9.2 18 C8 23 5.6 28.6 2.4 33" />
        <path d="M12.9 4 C13 9 13.8 14 14.8 18 C16 23 18.4 28.6 21.6 33" />
        <path d="M5.2 33 Q12 24 18.8 33" strokeWidth="1" />
        <path d="M9.5 12.5 H14.5" strokeWidth="0.9" />
        <path d="M8.6 18 H15.4" strokeWidth="1" />
      </g>
      <text x="70" y="80" fill={t.ink} fontFamily={mono} fontSize="10" fontWeight="500" letterSpacing="0.6">eiffel.coffee.roasters</text>
      <line x1="48" y1="94" x2="232" y2="94" stroke={t.ink} strokeWidth="0.8" />

      {/* lot name + subtitle */}
      <text x="48" y={100 + nameSize} fill={t.ink} fontFamily={serif} fontSize={nameSize} fontWeight="600">{lot.name}</text>
      <text x="48" y={116 + nameSize} fill={t.ink} fontFamily={mono} fontSize="9">{sub}</text>

      {/* spec rows */}
      <line x1="48" y1={128 + nameSize} x2="232" y2={128 + nameSize} stroke={t.ink} strokeWidth="0.6" strokeDasharray="3 4" opacity="0.55" />
      {specs.map(([k, v], i) => (
        <g key={k}>
          <text x="48" y={146 + nameSize + i * 15} fill={t.ink} opacity="0.55" fontFamily={mono} fontSize="8.5">{k}</text>
          <text x="232" y={146 + nameSize + i * 15} textAnchor="end" fill={t.ink} fontFamily={mono} fontSize="8.5">{v}</text>
        </g>
      ))}
      <line x1="48" y1={182 + nameSize} x2="232" y2={182 + nameSize} stroke={t.ink} strokeWidth="0.6" strokeDasharray="3 4" opacity="0.55" />

      {/* tasting notes */}
      <text x="48" y={200 + nameSize} fill={t.ink} opacity="0.55" fontFamily={mono} fontSize="8.5">tasting_notes</text>
      {(lot.noteLines || []).map((n, i) => (
        <text key={n} x="48" y={216 + nameSize + i * 14} fill={t.ink} fontFamily={mono} fontSize="9.5">{'> ' + n}</text>
      ))}

      {/* footer: roasted_on + weight */}
      <line x1="48" y1="316" x2="232" y2="316" stroke={t.ink} strokeWidth="0.8" />
      <text x="48" y="331" fill={t.ink} opacity="0.55" fontFamily={mono} fontSize="8.5">roasted_on</text>
      <text x="120" y="331" fill={t.ink} fontFamily={mono} fontSize="8.5">{lot.roasted}</text>
      <text x="232" y="332" textAnchor="end" fill={t.ink} fontFamily={mono} fontSize="10">{lot.weight}</text>
    </svg>
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
        <span className="mono" style={{fontSize:11,color:'var(--muted)'}}>score · <span style={{color:'var(--ink)'}}>{lot.score}</span></span>
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
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  fill="var(--ink-2)">{ax}</text>
          );
        })}
      </svg>
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
          <p>A micro-roastery starting with two origins — a washed Colombia and a natural Ethiopia. We rotate lots when they're gone.</p>
          <p className="mono" style={{fontSize:12, color:'var(--muted)'}}>est. 2026 · 48.8584° N, 2.2945° E</p>
        </div>
        <div className="foot-col">
          <h5>shop</h5>
          <ul>
            <li><a onClick={() => navigate({ page: 'shop' })}>all lots</a></li>
            <li><a onClick={() => navigate({ page: 'subscribe' })}>subscribe</a></li>
            <li><a>gift cards</a></li>
            <li><a>wholesale</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>read</h5>
          <ul>
            <li><a onClick={() => navigate({ page: 'about' })}>about</a></li>
            <li><a>journal</a></li>
            <li><a>brew guides</a></li>
            <li><a>sourcing log</a></li>
          </ul>
        </div>
        <div className="foot-col">
          <h5>contact</h5>
          <ul>
            <li><a>hello@eiffel.coffee</a></li>
            <li><a>@eiffel.coffee.roasters</a></li>
          </ul>
        </div>
      </div>
      <div className="foot-base">
        <span>© 2026 eiffel coffee roasters</span>
        <span>/* hand-roasted · small-batch · paid-fair */</span>
      </div>
    </footer>
  );
}
