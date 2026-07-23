/* eiffel.coffee.roasters — page components */

import { useState, useMemo } from 'react';
import { LOTS, PROCESSES, ROASTS, SUB_FREQ, SUB_VOLUME, SUB_PREF } from './data.js';
import { OriginArt, OriginCarousel, FlavorRadar, QtyRow, Modal } from './components.jsx';

// =================== HOME ===================
export function HomePage({ navigate }) {
  return (
    <main className="page">
      <section className="home-hero">
        <div className="home-hero-text">
          <h1>There's no one way <br /> to coffee.</h1>
          <div className="home-specs">
            <div className="row"><span className="k">product</span><span className="v">drip coffee bags · box of 5</span></div>
            <div className="row"><span className="k">also_available</span><span className="v">whole beans · 200g</span></div>
            <div className="row"><span className="k">origins</span><span className="v">ethiopia · colombia</span></div>
            <div className="row"><span className="k">roasted</span><span className="v">to order</span></div>
          </div>
          <div className="home-hero-cta-row">
            <button className="btn is-accent" onClick={() => navigate({ page: 'shop' })}>
              shop coffee <span className="arrow">→</span>
            </button>
          </div>
        </div>
        <OriginCarousel lots={LOTS} navigate={navigate} />
      </section>
    </main>
  );
}

// =================== SHOP ===================
// Quick-add modal: collects the info needed for the cart (format + quantity).
function AddToCartModal({ lot, onClose, onAdd }) {
  const [formatId, setFormatId] = useState(lot.formats[0].id);
  const [qty, setQty] = useState(1);
  const format = lot.formats.find(f => f.id === formatId) || lot.formats[0];
  return (
    <Modal open onClose={onClose}>
      <div className="modal-eyebrow">// add to cart</div>
      <div className="modal-title">{lot.name}</div>
      <div className="modal-sub">{lot.origin.toLowerCase()} · {lot.region.toLowerCase()} · {lot.process}</div>
      <div className="option-group">
        <label>format</label>
        <div className="grind-row">
          {lot.formats.map(f => (
            <button key={f.id}
                    className={'grind-opt' + (formatId === f.id ? ' is-on' : '')}
                    onClick={() => setFormatId(f.id)}>{f.label} · ${f.price}</button>
          ))}
        </div>
      </div>
      <div className="option-group">
        <label>quantity</label>
        <QtyRow value={qty} onChange={setQty} />
      </div>
      <div className="modal-actions">
        <button className="btn is-ghost" onClick={onClose}>cancel</button>
        <button className="btn is-accent" onClick={() => { onAdd(lot, formatId, qty); onClose(); }}>
          add · ${(format.price * qty).toFixed(2)} <span className="arrow">→</span>
        </button>
      </div>
    </Modal>
  );
}

export function ShopPage({ navigate, onAdd }) {
  const [process, setProcess] = useState('all');
  const [roast, setRoast] = useState('all');
  const [sort, setSort] = useState('roasted-desc');
  const [modalLot, setModalLot] = useState(null);

  const filtered = useMemo(() => {
    let l = [...LOTS];
    if (process !== 'all') l = l.filter(x => x.process === process);
    if (roast !== 'all')   l = l.filter(x => x.roast === roast);
    if (sort === 'roasted-desc') l.sort((a,b) => b.roasted.localeCompare(a.roasted));
    if (sort === 'price-asc')    l.sort((a,b) => a.price - b.price);
    return l;
  }, [process, roast, sort]);

  return (
    <main className="page">
      <section className="shop-head">
        <div className="shop-title-row">
          <h1 className="shop-title">Shop</h1>
          <span className="shop-count">showing {filtered.length} items</span>
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
          <option value="price-asc">↑ price</option>
        </select>
      </section>

      <section className="lot-table">
        <div className="lot-row head">
          <span>coffee</span>
          <span>origin</span>
          <span>process</span>
          <span>notes</span>
          <span />
        </div>
        {filtered.map(l => (
          <div key={l.id}
               className={'lot-row' + (!l.inStock ? ' is-out' : '')}
               onClick={() => l.inStock && navigate({ page: 'lot', id: l.id })}>
            <span className="lot-name">{l.name}</span>
            <span className="lot-orig">{l.origin.toLowerCase()} · {l.region.toLowerCase()}</span>
            <span className="lot-process">{l.process}</span>
            <span className="lot-notes">{l.notes.slice(0,3).join(', ')}</span>
            <span className="lot-add">
              {l.inStock ? (
                <button className="btn is-ghost"
                        onClick={(e) => { e.stopPropagation(); setModalLot(l); }}>
                  add · from ${l.price}
                </button>
              ) : (
                <span className="lot-out-label">sold out</span>
              )}
            </span>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{padding:'80px 0', textAlign:'center', fontFamily:'var(--mono)', fontSize:14, color:'var(--muted)'}}>
            Nothing matches that combination. Try clearing a filter.
          </div>
        )}
      </section>

      {modalLot && (
        <AddToCartModal lot={modalLot} onClose={() => setModalLot(null)} onAdd={onAdd} />
      )}
    </main>
  );
}

// =================== LOT DETAIL ===================
export function LotPage({ id, navigate, onAdd }) {
  const lot = LOTS.find(l => l.id === id) || LOTS[0];
  const [formatId, setFormatId] = useState(lot.formats[0].id);
  const [qty, setQty] = useState(1);
  const format = lot.formats.find(f => f.id === formatId) || lot.formats[0];

  return (
    <main className="page">
      <div className="crumb">
        <a onClick={() => navigate({ page: 'shop' })} style={{cursor:'pointer'}}>← all origins</a>
      </div>

      <section className="lot-detail">
        <div className="lot-image-col">
          <OriginArt lot={lot} className="lot-art" />
        </div>

        <div className="lot-info-col">
          <h1 className="lot-title">{lot.name}</h1>
          <div className="lot-subtitle">{lot.origin.toLowerCase()} · {lot.region.toLowerCase()} · {lot.process}</div>

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
            <label>format</label>
            <div className="grind-row">
              {lot.formats.map(f => (
                <button key={f.id}
                        className={'grind-opt' + (formatId === f.id ? ' is-on' : '')}
                        onClick={() => setFormatId(f.id)}>{f.label} · ${f.price}</button>
              ))}
            </div>
          </div>

          <div className="option-group">
            <label>quantity</label>
            <QtyRow value={qty} onChange={setQty} />
          </div>

          <div className="add-row">
            <button className="btn is-accent" onClick={() => onAdd(lot, formatId, qty)}>
              add to cart · ${(format.price * qty).toFixed(2)} <span className="arrow">→</span>
            </button>
          </div>

          <div className="lot-meta">
            <span>roasted to order · ships in 1–2 days · free over $40</span>
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

// =================== FEEDBACK ===================
// Paste a form endpoint here to collect responses — e.g. a Formspree URL
// ("https://formspree.io/f/xxxxxxxx") or your own API that accepts a JSON POST.
// Until this is set, submissions are saved only to THIS browser's localStorage
// (fine for your own testing, but real customer scans need a real endpoint).
const FEEDBACK_ENDPOINT = '';

export function FeedbackPage({ navigate, origin }) {
  const [rating, setRating]   = useState(0);
  const [email, setEmail]     = useState('');
  const [comments, setComments] = useState('');
  const [status, setStatus]   = useState('idle'); // idle | sending | done | error

  // Which bag this scan came from — carried by the QR code as #feedback/<slug>.
  const originLot = origin ? LOTS.find(l => l.slug === origin) : null;

  async function submit(e) {
    e.preventDefault();
    if (!rating) return;
    setStatus('sending');
    const payload = {
      rating,
      email: email.trim(),
      comments: comments.trim(),
      // hidden: which origin the bag was, from the QR code on its label
      origin: origin || 'unspecified',
      originName: originLot ? originLot.name : '',
      at: new Date().toISOString(),
    };
    try {
      if (FEEDBACK_ENDPOINT) {
        const res = await fetch(FEEDBACK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('status ' + res.status);
      } else {
        // No endpoint configured yet — keep locally so your own testing isn't
        // lost, and warn loudly. Real customer feedback needs FEEDBACK_ENDPOINT.
        console.warn('[feedback] FEEDBACK_ENDPOINT is not set — saved to localStorage only.');
        const key = 'eiffel.feedback';
        const all = JSON.parse(localStorage.getItem(key) || '[]');
        all.push(payload);
        localStorage.setItem(key, JSON.stringify(all));
      }
      setStatus('done');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <main className="page feedback-page">
        <div className="feedback-done">
          <div className="feedback-check">✓</div>
          <h1 className="feedback-title">Thank you.</h1>
          <p className="feedback-lead">
            Every cup helps us dial in the roast. We read all of it.
          </p>
          <button className="btn is-accent" onClick={() => navigate({ page: 'home' })}>
            back to home <span className="arrow">→</span>
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page feedback-page">
      <form className="feedback-form" onSubmit={submit}>
        <div className="feedback-eyebrow">
          // feedback{originLot ? ` · ${originLot.name.toLowerCase()}` : ''}
        </div>
        <h1 className="feedback-title">How was your coffee?</h1>
        <p className="feedback-lead">
          We're just getting started, and your honest take is the most useful thing we can get. Takes ten seconds.
        </p>

        <div className="feedback-field">
          <label className="feedback-label">rating <span className="req">· required</span></label>
          <div className="likert" role="radiogroup" aria-label="rating from 1 (bad) to 5 (good)">
            {[1,2,3,4,5].map(n => (
              <button
                type="button"
                key={n}
                className={'likert-opt' + (rating === n ? ' is-on' : '')}
                aria-pressed={rating === n}
                aria-label={`${n} out of 5`}
                onClick={() => setRating(n)}>
                {n}
              </button>
            ))}
          </div>
          <div className="likert-ends">
            <span>1 · bad</span>
            <span>good · 5</span>
          </div>
        </div>

        <div className="feedback-field">
          <label className="feedback-label" htmlFor="fb-email">email <span className="opt">· optional</span></label>
          <input
            id="fb-email"
            className="feedback-input"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <div className="feedback-hint">only if you'd like us to reply.</div>
        </div>

        <div className="feedback-field">
          <label className="feedback-label" htmlFor="fb-comments">comments <span className="opt">· optional</span></label>
          <textarea
            id="fb-comments"
            className="feedback-input feedback-textarea"
            rows={4}
            placeholder="too sour? too flat? just right? tell us anything."
            value={comments}
            onChange={(e) => setComments(e.target.value)} />
        </div>

        {status === 'error' && (
          <div className="feedback-error">Something went wrong sending that — please try again.</div>
        )}

        <button className="btn is-accent feedback-submit" type="submit" disabled={!rating || status === 'sending'}>
          {status === 'sending' ? 'sending…' : 'send feedback'} <span className="arrow">→</span>
        </button>
      </form>
    </main>
  );
}

// =================== ABOUT ===================
export function AboutPage({ navigate }) {
  return (
    <main className="page">
      <section style={{padding:'80px 0 60px', maxWidth: 880}}>
        <h1 style={{fontFamily:'var(--serif)', fontWeight:600, fontSize:'clamp(40px,5vw,68px)', letterSpacing:'-0.02em', lineHeight:1.02, margin:'0 0 36px'}}>
          A small roastery that <em style={{color:'var(--accent)'}}>documents everything</em>.
        </h1>
        <p style={{fontFamily:'var(--mono)', fontSize:16, lineHeight:1.8, color:'var(--ink-2)', maxWidth:620, margin:0}}>
          One roaster, a roast profiler, a cupping sheet for every lot. Everything we know is on the label — origin, altitude, varietal, process, roast date.
        </p>
      </section>
    </main>
  );
}
