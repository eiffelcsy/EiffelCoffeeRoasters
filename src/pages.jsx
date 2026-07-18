/* eiffel.coffee.roasters — page components */

import { useState, useMemo } from 'react';
import { LOTS, PROCESSES, ROASTS, GRINDS, SUB_FREQ, SUB_VOLUME, SUB_PREF } from './data.js';
import { BagArtwork, Enso, FlavorRadar, QtyRow, Seal } from './components.jsx';

// =================== HOME ===================
export function HomePage({ navigate }) {
  const featured = LOTS.find(l => l.featured) || LOTS[0];
  return (
    <main className="page">
      <div className="crumb">
        <span>// no.{String(featured.id).padStart(3,'0')} — {featured.name.toLowerCase()}</span>
        <span className="dot" />
        <span>roasted {featured.roasted}</span>
        <span className="dot" />
        <span>this week's lot</span>
      </div>

      <section className="home-hero">
        <Enso size={340} className="home-enso" />
        <div className="home-hero-text">
          <div className="home-eyebrow">{`> featured · lot.${String(featured.id).padStart(3,'0')}`}</div>
          <h1>
            Prunes & <em>nougat</em><br />
            in your cup.
          </h1>
          <p className="home-hero-sub">
            We're opening the roastery with a natural from Bule Hora, Guji — dark dried fruit, stone fruit, a nougat finish. 250g bags, roasted Mondays, shipped Tuesdays.
          </p>
          <div className="home-hero-cta-row">
            <button className="btn is-accent" onClick={() => navigate({ page: 'lot', id: featured.id })}>
              read the lot <span className="arrow">→</span>
            </button>
            <button className="btn is-ghost" onClick={() => navigate({ page: 'shop' })}>
              browse both origins
            </button>
          </div>
        </div>
        <div className="bag-card" onClick={() => navigate({ page: 'lot', id: featured.id })}>
          <BagArtwork lot={featured} />
        </div>
      </section>

      <section className="home-strip">
        {LOTS.map((l) => (
          <div key={l.id} className="feat-card" onClick={() => navigate({ page: 'lot', id: l.id })}>
            <div className="feat-num">{`${String(l.id).padStart(2,'0')} · ${l.origin.toLowerCase()}`}</div>
            <div className="feat-title">{l.name}</div>
            <div className="feat-sub">{l.process} · {l.notes.slice(0,2).join(', ')}</div>
          </div>
        ))}
      </section>

      <section className="home-intro">
        <div className="home-intro-label">// about</div>
        <div className="home-intro-body">
          We're starting with <em>two origins</em> — a washed Colombia and a natural Ethiopia — roasted in small batches and rotated as lots sell out. No blends. No flavored syrups. <em>No mystery.</em> Every bag ships with the altitude, the varietal, the process, and the date it left the drum.
          <div style={{marginTop: 32}}><span className="seal-stamp"><Seal size={44} /></span></div>
        </div>
      </section>
    </main>
  );
}

// =================== SHOP ===================
export function ShopPage({ navigate }) {
  const [process, setProcess] = useState('all');
  const [roast, setRoast] = useState('all');
  const [sort, setSort] = useState('roasted-desc');

  const filtered = useMemo(() => {
    let l = [...LOTS];
    if (process !== 'all') l = l.filter(x => x.process === process);
    if (roast !== 'all')   l = l.filter(x => x.roast === roast);
    if (sort === 'roasted-desc') l.sort((a,b) => b.roasted.localeCompare(a.roasted));
    if (sort === 'score-desc')   l.sort((a,b) => b.score - a.score);
    if (sort === 'price-asc')    l.sort((a,b) => a.price - b.price);
    return l;
  }, [process, roast, sort]);

  return (
    <main className="page">
      <div className="crumb">
        <span>// shop · lots</span>
        <span className="dot" />
        <span>{LOTS.length} active</span>
      </div>

      <section className="shop-head">
        <div className="shop-title-row">
          <h1 className="shop-title">Lots</h1>
          <span className="shop-count">{filtered.length} showing</span>
        </div>
        <div className="shop-query">
          <span className="sql">SELECT</span> * <span className="sql">FROM</span> lots
          {(process !== 'all' || roast !== 'all') && (
            <span> <span className="sql">WHERE</span> {[
              process !== 'all' && `process="${process}"`,
              roast !== 'all'   && `roast="${roast}"`,
            ].filter(Boolean).join(' AND ')}</span>
          )}
          <span> <span className="sql">ORDER BY</span> {sort.replace('-', ' ')}</span>
        </div>
      </section>

      <section className="filters">
        <span className="filter-label">process</span>
        {PROCESSES.map(p => (
          <button key={p}
                  className={'chip' + (process === p ? ' is-on' : '')}
                  onClick={() => setProcess(p)}>{p}</button>
        ))}
        <span className="filter-label" style={{marginLeft:18}}>roast</span>
        {ROASTS.map(r => (
          <button key={r}
                  className={'chip' + (roast === r ? ' is-on' : '')}
                  onClick={() => setRoast(r)}>{r}</button>
        ))}
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="roasted-desc">↓ recent</option>
          <option value="score-desc">↓ score</option>
          <option value="price-asc">↑ price</option>
        </select>
      </section>

      <section className="lot-table">
        <div className="lot-row head">
          <span>lot</span>
          <span>origin</span>
          <span>process</span>
          <span>notes</span>
          <span>score</span>
          <span style={{textAlign:'right'}}>price</span>
          <span />
        </div>
        {filtered.map(l => (
          <div key={l.id}
               className={'lot-row' + (!l.inStock ? ' is-out' : '')}
               onClick={() => l.inStock && navigate({ page: 'lot', id: l.id })}>
            <span className="lot-num">#{String(l.id).padStart(3,'0')}</span>
            <div className="lot-origin">
              <span className="name">{l.name}</span>
              <span className="region">{l.origin.toLowerCase()} · {l.region.toLowerCase()}</span>
            </div>
            <span className="lot-process">{l.process}</span>
            <span className="lot-notes">{l.notes.slice(0,3).join(', ')}</span>
            <span className="lot-score">{l.score}</span>
            <span className="lot-price">${l.price}</span>
            <span className="lot-arrow">→</span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{padding:'80px 0', textAlign:'center', fontFamily:'var(--serif)', fontStyle:'italic', color:'var(--muted)'}}>
            No lots match that combination. Try clearing a filter.
          </div>
        )}
      </section>
    </main>
  );
}

// =================== LOT DETAIL ===================
export function LotPage({ id, navigate, onAdd }) {
  const lot = LOTS.find(l => l.id === id) || LOTS[0];
  const [grind, setGrind] = useState('whole');
  const [qty, setQty] = useState(1);

  return (
    <main className="page">
      <div className="crumb">
        <a onClick={() => navigate({ page: 'shop' })} style={{cursor:'pointer'}}>← all lots</a>
        <span className="dot" />
        <span>/ lots / {String(lot.id).padStart(3,'0')}</span>
      </div>

      <section className="lot-detail">
        <div className="lot-image-col">
          <div className="bag-card" style={{aspectRatio:'4/5'}}>
            <BagArtwork lot={lot} />
          </div>
        </div>

        <div className="lot-info-col">
          <div className="lot-eyebrow">{`// lot.${String(lot.id).padStart(3,'0')} · ${lot.process}`}</div>
          <h1 className="lot-title">{lot.name}</h1>
          <div className="lot-subtitle">{lot.origin.toLowerCase()} · {lot.region.toLowerCase()} · {lot.producer}</div>

          <div className="lot-flavors">
            {lot.notes.map(n => <span key={n} className="flavor-pill">{n}</span>)}
          </div>

          <FlavorRadar lot={lot} />

          <div className="lot-story">{lot.story}</div>

          <div className="lot-specs">
            <div className="row"><span className="k">altitude</span><span className="v">{lot.altitude}</span></div>
            <div className="row"><span className="k">varietal</span><span className="v">{lot.varietal}</span></div>
            <div className="row"><span className="k">process</span><span className="v">{lot.processLabel || lot.process}</span></div>
            <div className="row"><span className="k">roast level</span><span className="v">{lot.roast} · {lot.roastLevel}/10</span></div>
            <div className="row"><span className="k">cupping score</span><span className="v">{lot.score} / 100</span></div>
            <div className="row"><span className="k">roasted</span><span className="v">{lot.roasted}</span></div>
            <div className="row"><span className="k">weight</span><span className="v">{lot.weight}</span></div>
          </div>

          <div className="option-group">
            <label>grind</label>
            <div className="grind-row">
              {GRINDS.map(g => (
                <button key={g.id}
                        className={'grind-opt' + (grind === g.id ? ' is-on' : '')}
                        onClick={() => setGrind(g.id)}>{g.label}</button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>quantity</label>
            <QtyRow value={qty} onChange={setQty} />
          </div>

          <div className="add-row">
            <button className="btn is-accent" onClick={() => onAdd(lot, grind, qty)}>
              add to cart · ${(lot.price * qty).toFixed(2)} <span className="arrow">→</span>
            </button>
          </div>

          <div className="lot-meta">
            <span>// ships in 1–2 days</span>
            <span>· free shipping over $40</span>
            <span>· roasted to order</span>
          </div>
        </div>
      </section>
    </main>
  );
}

// =================== SUBSCRIBE ===================
export function SubscribePage({ navigate, onSubscribe }) {
  const [step, setStep] = useState(1);
  const [freq, setFreq]   = useState('biweekly');
  const [vol,  setVol]    = useState('single');
  const [pref, setPref]   = useState('pick');
  const [done, setDone]   = useState(false);

  const freqObj = SUB_FREQ.find(f => f.id === freq);
  const volObj  = SUB_VOLUME.find(v => v.id === vol);
  const prefObj = SUB_PREF.find(p => p.id === pref);

  const pricePerShipment = volObj.price;
  const shipmentsPerMonth = freq === 'weekly' ? 4 : freq === 'biweekly' ? 2 : 1;
  const monthly = pricePerShipment * shipmentsPerMonth;

  if (done) {
    return (
      <main className="sub-page">
        <div style={{textAlign:'center', padding:'80px 0'}}>
          <div style={{fontSize:48, marginBottom:24}}>✓</div>
          <h1 className="sub-heading">You're in.</h1>
          <p className="sub-sub" style={{margin:'0 auto 36px'}}>
            First shipment arrives in 5–7 days. We'll email you the tracking and the tasting notes the morning it ships.
          </p>
          <button className="btn is-accent" onClick={() => navigate({ page: 'home' })}>back to home <span className="arrow">→</span></button>
        </div>
      </main>
    );
  }

  return (
    <main className="sub-page">
      <div className="sub-progress">
        {[1,2,3,4].map(s => (
          <div key={s} className={'sub-prog-cell' + (s < step ? ' is-done' : s === step ? ' is-active' : '')} />
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="sub-step-label">// step 1 of 4 · cadence</div>
          <h1 className="sub-heading">How often do you drink?</h1>
          <p className="sub-sub">Pick a rhythm. You can pause, skip, or change it from your account at any time.</p>
          <div className="sub-options">
            {SUB_FREQ.map(f => (
              <div key={f.id}
                   className={'sub-card' + (freq === f.id ? ' is-selected' : '')}
                   onClick={() => setFreq(f.id)}>
                <span className="corner">{freq === f.id ? '✓ selected' : `option_${f.id}`}</span>
                <div className="figure">{f.unit}</div>
                <div className="figure-unit">{f.label}</div>
                <div className="desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="sub-step-label">// step 2 of 4 · volume</div>
          <h1 className="sub-heading">How much per shipment?</h1>
          <p className="sub-sub">Bags are 250g. Most pour-over households finish one in about a week.</p>
          <div className="sub-options">
            {SUB_VOLUME.map(v => (
              <div key={v.id}
                   className={'sub-card' + (vol === v.id ? ' is-selected' : '')}
                   onClick={() => setVol(v.id)}>
                <span className="corner">{vol === v.id ? '✓ selected' : `option_${v.id}`}</span>
                <div className="figure">{v.unit}</div>
                <div className="figure-unit">{v.label}</div>
                <div className="desc">{v.desc}</div>
                <div className="price">${v.price} / shipment</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div className="sub-step-label">// step 3 of 4 · selection</div>
          <h1 className="sub-heading">Who picks the lots?</h1>
          <p className="sub-sub">We can pick for you, you can pick, or you can give us a flavor profile and we'll match.</p>
          <div className="sub-options">
            {SUB_PREF.map(p => (
              <div key={p.id}
                   className={'sub-card' + (pref === p.id ? ' is-selected' : '')}
                   onClick={() => setPref(p.id)}>
                <span className="corner">{pref === p.id ? '✓ selected' : `option_${p.id}`}</span>
                <div className="figure" style={{fontSize:42, marginTop:48, marginBottom:14}}>{p.label}</div>
                <div className="desc">{p.desc}</div>
              </div>
            ))}
          </div>
        </>
      )}

      {step === 4 && (
        <>
          <div className="sub-step-label">// step 4 of 4 · review</div>
          <h1 className="sub-heading">Confirm.subscription()</h1>
          <p className="sub-sub">First shipment goes out the next roast day.</p>

          <div className="sub-summary">
            <h3>// your.config</h3>
            <div className="sub-summary-row">
              <span className="k">cadence</span>
              <span className="v serif">{freqObj.label}</span>
            </div>
            <div className="sub-summary-row">
              <span className="k">volume</span>
              <span className="v serif">{volObj.label} · {volObj.unit}</span>
            </div>
            <div className="sub-summary-row">
              <span className="k">selection</span>
              <span className="v serif">{prefObj.label}</span>
            </div>
            <div className="sub-summary-row">
              <span className="k">per shipment</span>
              <span className="v" style={{fontFamily:'var(--mono)', fontSize:14}}>${pricePerShipment.toFixed(2)}</span>
            </div>
            <div className="sub-summary-total">
              <span>${monthly.toFixed(2)}<small> / month</small></span>
              <small style={{fontFamily:'var(--mono)'}}>cancel any time</small>
            </div>
          </div>
        </>
      )}

      <div className="sub-nav">
        <button className="btn is-ghost"
                onClick={() => step === 1 ? navigate({ page: 'home' }) : setStep(step - 1)}>
          ← {step === 1 ? 'cancel' : 'back'}
        </button>
        {step < 4 ? (
          <button className="btn is-accent" onClick={() => setStep(step + 1)}>
            continue <span className="arrow">→</span>
          </button>
        ) : (
          <button className="btn is-accent" onClick={() => { onSubscribe({freq, vol, pref}); setDone(true); }}>
            start subscription <span className="arrow">→</span>
          </button>
        )}
      </div>
    </main>
  );
}

// =================== ABOUT ===================
export function AboutPage({ navigate }) {
  return (
    <main className="page">
      <div className="crumb">
        <span>// about</span>
        <span className="dot" />
        <span>est. 2026</span>
      </div>

      <section style={{padding:'80px 0 60px', maxWidth: 880}}>
        <div className="home-eyebrow">/* who we are */</div>
        <h1 style={{fontFamily:'var(--serif)', fontWeight:300, fontSize:'clamp(40px,5vw,68px)', letterSpacing:'-0.02em', lineHeight:1.02, margin:'0 0 36px'}}>
          A small roastery that <em style={{color:'var(--accent)'}}>documents everything</em>.
        </h1>
        <p style={{fontFamily:'var(--serif)', fontSize:22, lineHeight:1.55, color:'var(--ink-2)', marginBottom:24, maxWidth:700}}>
          Eiffel is a small operation: one roaster, a laptop running a roast profiler, and a cupping sheet for every lot we've ever bought. We're starting with two origins and we'll grow the menu one lot at a time.
        </p>
        <p style={{fontFamily:'var(--serif)', fontSize:18, lineHeight:1.6, color:'var(--ink-2)', maxWidth:680}}>
          We treat every batch like a small data problem: green analysis, profile, dev-time, weight loss, cupping score. We publish all of it. If you want to know exactly what happened to the beans in your bag, the label tells you — origin, altitude, varietal, process, and the day it was roasted.
        </p>
      </section>

      <section style={{padding:'40px 0 80px', borderTop:'1px solid var(--rule)'}}>
        <div className="home-eyebrow" style={{margin:'40px 0 28px'}}>/* by the numbers */</div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'var(--gutter)'}}>
          {[
            { v: '2', k: 'origins on the menu' },
            { v: '250g', k: 'bag size' },
            { v: '2,200m', k: 'highest farm altitude' },
            { v: 'nº 001', k: 'first roast · 2026' },
          ].map(s => (
            <div key={s.k} style={{borderTop:'1px solid var(--rule)', paddingTop:18}}>
              <div style={{fontFamily:'var(--serif)', fontSize:64, fontWeight:300, letterSpacing:'-0.02em', lineHeight:1}}>{s.v}</div>
              <div style={{fontFamily:'var(--mono)', fontSize:11, color:'var(--muted)', marginTop:6}}>{s.k}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
