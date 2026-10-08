/* ==========================================================
   Aguardiente — comportamenti delle pagine
   Ogni pagina dichiara <body data-page="..."> e qui
   parte solo il modulo che le serve.
   ========================================================== */
(function () {
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const D = window.DATA || {};

  const ICON_CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  const ICON_PIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';


  /* Utility: gruppo di pill che filtrano una lista */
  function pills(container, labels, onChange) {
    let current = labels[0];
    container.innerHTML = labels.map((l) => `<button type="button" class="pill" aria-pressed="${l === current}">${esc(l)}</button>`).join('');
    container.addEventListener('click', (e) => {
      const b = e.target.closest('button'); if (!b) return;
      current = b.textContent;
      $$('button', container).forEach((x) => x.setAttribute('aria-pressed', x === b));
      onChange(current);
    });
    onChange(current);
  }

  /* Menu a tendina su mobile (header pubblico e Business) */
  $$('.menu-toggle').forEach((btn) => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    const header = btn.closest('.site-header');
    const set = (open) => { btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu'); header.classList.toggle('menu-open', open); };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  });

  /* Campi data: stessa misura degli altri campi e segnaposto visibile anche su iPhone
     (Safari non mostra il placeholder negli input type="date") */
  $$('input[type="date"]').forEach((input) => {
    const wrap = document.createElement('span');
    wrap.className = 'date-wrap';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    const ph = document.createElement('span');
    ph.className = 'date-ph'; ph.setAttribute('aria-hidden', 'true');
    ph.textContent = input.dataset.placeholder || 'gg/mm/aaaa';
    wrap.appendChild(ph);
    const iso = (d) => d.toISOString().slice(0, 10);
    if ('adult' in input.dataset) { const d = new Date(); d.setFullYear(d.getFullYear() - 18); input.max = iso(d); }
    if ('future' in input.dataset) input.min = iso(new Date());
    const sync = () => wrap.classList.toggle('has-value', !!input.value);
    input.addEventListener('input', sync); input.addEventListener('change', sync); sync();
  });

  /* Icone di navigazione verso sezioni della stessa pagina: piena quella della sezione in vista */
  const spyLinks = $$('.nav a.nav-icon[href^="#"]').filter((a) => a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href')));
  if (spyLinks.length && 'IntersectionObserver' in window) {
    const byId = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
      const a = byId.get(e.target.id); if (!a) return;
      if (e.isIntersecting) { spyLinks.forEach((x) => { if (x.getAttribute('aria-current') === 'location') x.removeAttribute('aria-current'); }); a.setAttribute('aria-current', 'location'); }
      else if (a.getAttribute('aria-current') === 'location') a.removeAttribute('aria-current');
    }), { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => spy.observe(document.getElementById(id)));
  }

  /* Scheda struttura su mobile: il modulo di prenotazione si apre dal basso dalla barra fissa */
  const bookForm = $('#book-form'), bookOpen = $('#book-open');
  if (bookForm && bookOpen) {
    const bd = $('#book-backdrop');
    const setBook = (open) => {
      bookForm.classList.toggle('is-open', open); bd.hidden = !open; bookOpen.setAttribute('aria-expanded', open);
      document.documentElement.classList.toggle('sheet-open', open);
      if (open) { const f = bookForm.querySelector('input, select'); if (f) setTimeout(() => f.focus({ preventScroll: true }), 250); } else bookOpen.focus();
    };
    bookOpen.addEventListener('click', () => setBook(true));
    bd.addEventListener('click', () => setBook(false));
    $('.book-close', bookForm).addEventListener('click', () => setBook(false));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bookForm.classList.contains('is-open')) setBook(false); });
    let y0 = null, dy = 0; const hd = $('.book-head', bookForm);
    hd.addEventListener('pointerdown', (e) => { if (e.target.closest('button') || !matchMedia('(max-width: 720px)').matches) return; y0 = e.clientY; dy = 0; hd.setPointerCapture(e.pointerId); bookForm.style.transition = 'none'; });
    hd.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); bookForm.style.transform = `translateY(${dy}px)`; });
    hd.addEventListener('pointerup', () => { if (y0 === null) return; bookForm.style.transition = ''; bookForm.style.transform = ''; y0 = null; if (dy > 90) setBook(false); });
  }

  /* Tooltip della barra laterale dell'area aziende: posizione calcolata accanto all'icona */
  $$('.nav-rail .nav-icon').forEach((a) => {
    const place = () => { const r = a.getBoundingClientRect(); a.style.setProperty('--tip-x', `${r.right + 10}px`); a.style.setProperty('--tip-y', `${r.top + r.height / 2}px`); };
    a.addEventListener('mouseenter', place); a.addEventListener('focus', place);
  });

  /* ---------- Intro della home: prima il titolo e il sottotitolo, poi il resto (una volta per sessione) ---------- */
  if (document.documentElement.classList.contains('intro-play')) {
    try { sessionStorage.setItem('agu.intro', '1'); } catch (e) { /* ignorato */ }
    setTimeout(() => document.documentElement.classList.add('intro-done'), 4300);
  }

  /* ---------- Animazioni allo scroll: entrata ed uscita morbide, anche sui testi ----------
     Si applicano a titoli, testi, card e voci delle griglie; i fratelli entrano con un piccolo sfasamento. */
  const ANIM_SEL = ['main h1', 'main h2', 'main .lead', 'main .eyebrow', 'main .section-head > a', 'main .card', 'main .ad', 'main .story-card', 'main .vt-tile', 'main .wc-tile', 'main .product',
    'main .place', 'main .creator-card', 'main .teaser', 'main .cat-link', 'main .online-item', 'main .event', 'main .offer', 'main .plan', 'main .stat-mini', 'main .extra',
    'main .steps-big li', 'main .cf-list li', 'main .faq-item', 'main .chips', 'main .story-body p', 'main .comment', 'main .regions a', 'main p.muted', 'footer .container'].join(',');
  const ANIM_SKIP = 'header, dialog, .gate, .drawer, .book-form, .book-bar, .search-fab, .nav, .hero, .reveal, .cf-panel, [hidden]';
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const animIO = new IntersectionObserver((entries) => entries.forEach((e) => {
      const el = e.target;
      if (e.isIntersecting) { el.classList.remove('out-up', 'out-down'); el.classList.add('is-in'); }
      else if (el.classList.contains('is-in')) { el.classList.remove('is-in'); el.classList.add(e.boundingClientRect.top < 0 ? 'out-up' : 'out-down'); }
    }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    const scanAnim = () => {
      const found = $$(ANIM_SEL).filter((el) => !el.classList.contains('anim') && !el.closest(ANIM_SKIP));
      const set = new Set(found);
      found.filter((el) => { let p = el.parentElement; while (p) { if (set.has(p) || p.classList.contains('anim')) return false; p = p.parentElement; } return true; })
        .forEach((el) => {
          const sibs = [...el.parentElement.children].filter((c) => c.matches(ANIM_SEL));
          el.style.setProperty('--d', `${Math.min(sibs.indexOf(el), 6) * 70}ms`);
          el.classList.add('anim'); animIO.observe(el);
        });
    };
    scanAnim();
    let t; new MutationObserver(() => { clearTimeout(t); t = setTimeout(scanAnim, 60); }).observe(document.body, { childList: true, subtree: true });
  }

  /* Interruttori role="switch" generici */
  $$('[role="switch"]').forEach((sw) => sw.addEventListener('click', () => {
    sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true');
    sw.dispatchEvent(new Event('change', { bubbles: true }));
  }));

  /* ---------- Annuncio: card condivisa (bacheca, home, anteprima) ----------
     La foto di lancio (a.cover / a.coverSrc) è indipendente dalla foto profilo:
     l'avatar in basso a sinistra viene sempre dal profilo dell'autore. */
  const CERT_TIP = 'I luoghi certificati da Aguardiente si impegnano a fornire tutti i dettagli e l’attendibilità del luogo.';
  const ICON_SEAL = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.4 1.8 3-.2.9 2.8 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.8-3-.2L12 21l-2.4-1.8-3 .2-.9-2.8-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.8 3 .2z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/></svg>';
  // Badge "Certificato" con tooltip; focusable=false dentro i link (niente elementi interattivi annidati)
  function certHTML(focusable = true) {
    const id = 'tip-' + Math.random().toString(36).slice(2, 8);
    return `<span class="cert"${focusable ? ` tabindex="0" aria-describedby="${id}"` : ''}>${ICON_SEAL}Certificato<span class="cert-tip" role="tooltip" id="${id}">${CERT_TIP}</span></span>`;
  }
  const VIS_LABEL = { tutti: 'Visibile a tutti', verificati: 'Solo profili verificati', sfocata: 'Sfocata fino al contatto' };
  const ICON_LOCK = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  function profileOf(nick) { return (D.profili || []).find((p) => p.nick === nick); }
  // Avatar con foto di esempio se disponibile, altrimenti iniziali
  function photoOf(nick) { const p = profileOf(nick); return (p && p.foto && p.foto.id) || (D.avatar && D.avatar[nick]) || null; }
  const userHref = (nick) => `utente.html?u=${encodeURIComponent(nick)}`;
  function av(nick, ini, cls = 'ad-avatar', size = 120) {
    const id = photoOf(nick);
    return id ? `<span class="${cls}"><img src="${D.unsplash(id, size, size)}" alt="" loading="lazy"></span>` : `<span class="${cls}">${esc(ini || '')}</span>`;
  }
  function avatarHTML(a, cls = 'ad-avatar') {
    return av(a.nick, a.ini, cls);
  }
  // "Oggi • Verificato": data di pubblicazione e, se c'è, la verifica del profilo
  function metaHTML(a) {
    return `<span class="muted">${esc(a.quando)}</span>${a.ver ? `<span class="meta-dot" aria-hidden="true"></span><span class="meta-ver">${ICON_CHECK}Verificato</span>` : ''}`;
  }
  function coverHTML(a, { compact = false } = {}) {
    const src = a.coverSrc || (a.cover && D.unsplash(a.cover.id, 800, 450));
    if (!src) return '';
    const vis = a.coverVis || 'tutti';
    return `<div class="ad-cover${vis === 'sfocata' ? ' is-blurred' : ''}">
        <img src="${src}" alt="" loading="lazy" decoding="async">
        ${compact ? '' : `<span class="ad-cover-tag">${metaHTML(a)}</span>`}
        ${vis === 'sfocata' ? `<span class="ad-cover-lock">${ICON_LOCK}Visibile dopo il contatto</span>` : ''}
        ${vis === 'verificati' ? `<span class="ad-cover-vis">${ICON_LOCK}Foto per i verificati</span>` : ''}
      </div>`;
  }
  function adCard(a, { preview = false } = {}) {
    const hasCover = !!(a.cover || a.coverSrc);
    return `<article class="card ad${hasCover ? ' has-cover' : ''}">
        ${coverHTML(a)}
        <div class="ad-body">
          <div class="ad-head">
            ${avatarHTML(a)}
            <div class="ad-who"><strong>${preview ? esc(a.nick) : `<a class="ad-link-plain" href="${userHref(a.nick)}">${esc(a.nick)}</a>`}</strong><span class="muted">${esc(a.tipo)}, ${esc(a.eta)}, ${esc(a.zona)}</span></div>
          </div>
          ${hasCover ? '' : `<span class="ad-meta">${metaHTML(a)}</span>`}
          <span class="cat-label">${esc(a.cat)}</span>
          <h3>${preview || !a.id
            ? (esc(a.titolo) || '<span class="muted">Il titolo del tuo annuncio</span>')
            : `<a class="ad-link" href="annuncio.html?id=${encodeURIComponent(a.id)}">${esc(a.titolo)}</a>`}</h3>
          <p class="muted">${esc(a.testo) || 'Qui comparirà il testo dell’annuncio.'}</p>
          <div class="ad-foot ad-foot-end">${preview ? '<span class="btn btn-ghost" aria-hidden="true">Scrivi</span>' : '<a class="btn btn-ghost" href="messaggi.html">Scrivi</a>'}</div>
        </div>
      </article>`;
  }
  function coverCredits(list) {
    const seen = new Map();
    list.forEach((a) => { const c = a.cover || a; if (c && c.user && !seen.has(c.user)) seen.set(c.user, c.autore); });
    if (!seen.size) return '';
    const links = [...seen].map(([u, n]) => `<a href="https://unsplash.com/@${u}?utm_source=aguardiente&utm_medium=referral">${esc(n)}</a>`);
    return `Foto di ${links.join(', ')} su <a href="https://unsplash.com/?utm_source=aguardiente&utm_medium=referral">Unsplash</a>`;
  }

  /* ---------- HOME: tab Annunci / Eventi e prevendita biglietti ---------- */
  function homeEvents() {
    const eur = (n) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const list = $('#latest-events'); if (!list) return;
    list.innerHTML = D.eventi.map((e) => `
      <article class="card ad has-cover event-card">
        <div class="ad-cover">
          <img src="${D.unsplash(e.cover, 800, 450)}" alt="" loading="lazy" decoding="async">
          <span class="ad-cover-tag"><span class="muted">${esc(e.quando)}</span></span>
          <span class="ad-cover-vis">−${eur(e.ingresso - e.prevendita)} in prevendita</span>
        </div>
        <div class="ad-body">
          <div class="ad-head">
            ${av(e.locale, e.ini)}
            <div class="ad-who"><strong><a class="ad-link-plain" href="${e.link}">${esc(e.locale)}</a></strong><span class="muted">${esc(e.citta)}</span></div>
          </div>
          <span class="ad-meta">${e.cert ? `<span class="meta-ver">${ICON_SEAL}Certificato</span>` : '<span class="muted">Locale</span>'}</span>
          <span class="cat-label">${esc(e.tipo)}</span>
          <h3>${esc(e.titolo)}</h3>
          <p class="muted">${esc(e.testo)}</p>
          <div class="ad-foot">
            <span class="price">${eur(e.prevendita)} <s class="muted">${eur(e.ingresso)}</s></span>
            <button class="btn btn-ghost" type="button" data-ticket="${e.id}">Partecipa</button>
          </div>
        </div>
      </article>`).join('');

    // Tab Annunci / Eventi
    const tabs = $$('.home-tabs [role="tab"]');
    const copy = { annunci: ['Ultimi annunci', 'Tutti gli annunci', 'annunci.html'], eventi: ['Prossimi eventi', 'Tutti i locali', 'luoghi.html'] };
    const select = (tab) => {
      tabs.forEach((t) => t.setAttribute('aria-selected', t === tab));
      const k = tab.dataset.tab;
      $('#latest-ads').hidden = k !== 'annunci'; $('#latest-events').hidden = k !== 'eventi';
      $('#bacheca-title').textContent = copy[k][0];
      $('#bacheca-link span').textContent = copy[k][1]; $('#bacheca-link').href = copy[k][2];
    };
    tabs.forEach((t) => t.addEventListener('click', () => select(t)));
    $('.home-tabs').addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length]; n.focus(); select(n);
    });

    // Partecipa: prevendita del biglietto
    const dlg = $('#ticket-dialog'); let ev = null;
    const total = () => { const q = +$('#tk-qty').value; $('#tk-total').textContent = eur(ev.prevendita * q); $('#tk-save').textContent = `Risparmi ${eur((ev.ingresso - ev.prevendita) * q)} rispetto all’ingresso`; };
    list.addEventListener('click', (e) => {
      const b = e.target.closest('[data-ticket]'); if (!b) return;
      ev = D.eventi.find((x) => x.id === b.dataset.ticket);
      $('#tk-locale').textContent = `${ev.locale}, ${ev.citta}`;
      $('#tk-title').textContent = ev.titolo;
      $('#tk-when').textContent = ev.quando;
      $('#tk-door').textContent = eur(ev.ingresso);
      $('#tk-pre').textContent = eur(ev.prevendita);
      $('#tk-step1').hidden = false; $('#tk-step2').hidden = true;
      total(); dlg.showModal();
    });
    $('#tk-qty').addEventListener('change', total);
    $('#tk-confirm').addEventListener('click', () => {
      const code = 'EVT-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
      $('#tk-code').textContent = code; $('#tk-qr').innerHTML = fakeQR(code);
      $('#tk-step1').hidden = true; $('#tk-step2').hidden = false;
    });
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- RICERCA DA MOBILE: barra fissa + pannello dal basso ---------- */
  function searchSheet() {
    const fab = $('.search-fab'); const dlg = $('#search-sheet'); if (!fab || !dlg) return;
    const form = $('form', dlg);
    const range = $('[data-range]', dlg);
    const [rMin, rMax] = $$('input[type="range"]', range);
    const sw = $('[data-online]', dlg); const onlineInput = $('input[name="online"]', dlg);

    const summary = () => {
      const sono = form.sono.value || 'Chiunque';
      const cerco = $$('input[name="cerco"]:checked', form).map((i) => i.value.toLowerCase());
      const regione = (form.regione.value || 'Ovunque');
      const eta = `${rMin.value}–${rMax.value >= 70 ? '70+' : rMax.value} anni`;
      const online = sw.getAttribute('aria-checked') === 'true';
      $('[data-sum="chi"]', fab).textContent = `${sono} cerca ${cerco.length ? cerco.join(', ') : 'chiunque'}`;
      $('[data-sum="dove"]', fab).textContent = [regione, eta, online ? 'online' : ''].filter(Boolean).join(', ');
      $('[data-age]', dlg).textContent = eta;
      $('button[type="submit"]', dlg).textContent = cerco.length ? 'Mostra profili' : 'Scegli chi cerchi';
      $('button[type="submit"]', dlg).disabled = !cerco.length;
    };
    const paintRange = () => {
      // i due cursori non possono incrociarsi
      if (+rMin.value > +rMax.value - 1) { if (document.activeElement === rMin) rMin.value = +rMax.value - 1; else rMax.value = +rMin.value + 1; }
      const pct = (v) => (v - rMin.min) / (rMin.max - rMin.min);
      range.style.setProperty('--a', pct(rMin.value));
      range.style.setProperty('--b', pct(rMax.value));
    };

    const open = () => { dlg.showModal(); document.documentElement.classList.add('sheet-open'); const sel = $('input[name="regione"]:checked', dlg); if (sel) sel.closest('.opt').scrollIntoView({ inline: 'center', block: 'nearest' }); };
    const close = () => {
      if (!dlg.open) return;
      dlg.classList.add('is-closing');
      setTimeout(() => { dlg.classList.remove('is-closing'); dlg.style.transform = ''; dlg.close(); }, reduceMotion ? 0 : 220);
    };
    dlg.addEventListener('close', () => { document.documentElement.classList.remove('sheet-open'); fab.focus(); });
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    fab.addEventListener('click', open);
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', close));

    // Trascina verso il basso per chiudere (dalla maniglia o dal titolo)
    const head = $('.bs-head', dlg); let y0 = null, dy = 0;
    head.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; y0 = e.clientY; dy = 0; head.setPointerCapture(e.pointerId); dlg.style.transition = 'none'; });
    head.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); dlg.style.transform = `translateY(${dy}px)`; });
    head.addEventListener('pointerup', () => { if (y0 === null) return; dlg.style.transition = ''; y0 = null; if (dy > 90) close(); else dlg.style.transform = ''; });

    sw.addEventListener('change', () => { onlineInput.value = sw.getAttribute('aria-checked') === 'true' ? '1' : ''; summary(); });
    form.addEventListener('input', () => { paintRange(); summary(); });
    form.addEventListener('reset', () => setTimeout(() => { sw.setAttribute('aria-checked', 'true'); onlineInput.value = '1'; paintRange(); summary(); }));
    paintRange(); summary();
  }

  // QR finto ma stabile: serve solo a far capire il flusso nel prototipo
  function fakeQR(seed) {
    let h = 0; for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    const n = 21, cell = 8, rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 2 ** 32);
    let r = '';
    const finder = (x, y) => `<rect x="${x * cell}" y="${y * cell}" width="${7 * cell}" height="${7 * cell}" fill="#14060A"/><rect x="${(x + 1) * cell}" y="${(y + 1) * cell}" width="${5 * cell}" height="${5 * cell}" fill="#fff"/><rect x="${(x + 2) * cell}" y="${(y + 2) * cell}" width="${3 * cell}" height="${3 * cell}" fill="#14060A"/>`;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const inFinder = (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
      if (!inFinder && rnd() > 0.5) r += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#14060A"/>`;
    }
    return `<svg viewBox="0 0 ${n * cell} ${n * cell}" width="168" height="168" role="img" aria-label="Codice QR"><rect width="100%" height="100%" fill="#fff"/>${r}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
  }

  /* Pannelli (dialog) che si chiudono con X, tocco fuori, Esc o trascinando giù la maniglia */
  function sheetClose(dlg, handle) {
    const close = () => {
      if (!dlg.open) return;
      dlg.classList.add('is-closing');
      setTimeout(() => { dlg.classList.remove('is-closing'); dlg.style.transform = ''; dlg.close(); }, reduceMotion ? 0 : 220);
    };
    dlg.addEventListener('cancel', (e) => { e.preventDefault(); close(); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
    $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', close));
    if (handle) {
      let y0 = null, dy = 0;
      handle.addEventListener('pointerdown', (e) => { if (e.target.closest('button') || matchMedia('(min-width: 721px)').matches) return; y0 = e.clientY; dy = 0; handle.setPointerCapture(e.pointerId); dlg.style.transition = 'none'; });
      handle.addEventListener('pointermove', (e) => { if (y0 === null) return; dy = Math.max(0, e.clientY - y0); dlg.style.transform = `translateY(${dy}px)`; });
      handle.addEventListener('pointerup', () => { if (y0 === null) return; dlg.style.transition = ''; y0 = null; if (dy > 90) close(); else dlg.style.transform = ''; });
    }
    return close;
  }

  /* ---------- Contatti esterni (Instagram, Facebook, WhatsApp, Telegram) ----------
     Salvati nel browser (localStorage) così il profilo e la chat del prototipo li condividono. */
  const EXT = {
    instagram: { label: 'Instagram', badge: 'IG', url: (h) => `https://instagram.com/${h.replace(/^@/, '')}` },
    facebook: { label: 'Facebook', badge: 'FB', url: (h) => /^https?:\/\//.test(h) ? h : `https://facebook.com/${h.replace(/^@/, '')}` },
    whatsapp: { label: 'WhatsApp', badge: 'WA', url: (h) => `https://wa.me/${h.replace(/[^\d]/g, '')}` },
    telegram: { label: 'Telegram', badge: 'TG', url: (h) => `https://t.me/${h.replace(/^@/, '')}` }
  };
  const EXT_KEY = 'agu.contatti';
  const extDefault = { instagram: { h: '@ombra.e.mare', pub: false }, telegram: { h: '@ombraemare', pub: false }, facebook: { h: '', pub: false }, whatsapp: { h: '', pub: false } };
  function extLoad() { try { return Object.assign({}, extDefault, JSON.parse(localStorage.getItem(EXT_KEY) || '{}')); } catch (e) { return Object.assign({}, extDefault); } }
  function extSave(v) { try { localStorage.setItem(EXT_KEY, JSON.stringify(v)); return true; } catch (e) { return false; } }
  function extCard(type, handle, mine) {
    const t = EXT[type];
    return `<div class="contact-card">
        <span class="ext-badge ext-${type}" aria-hidden="true">${t.badge}</span>
        <span class="contact-text"><span class="contact-k">${mine ? 'Hai condiviso il tuo' : 'Ti ha condiviso il suo'} ${t.label}</span><strong>${esc(handle)}</strong></span>
        <a class="btn btn-ghost contact-open" href="${esc(t.url(handle))}" target="_blank" rel="noopener noreferrer">Apri</a>
      </div>`;
  }

  /* Crediti per le webcam (salvati nel browser per il prototipo) */
  const CR_KEY = 'agu.crediti';
  const crGet = () => { try { const v = localStorage.getItem(CR_KEY); return v === null ? (D.webcam ? D.webcam.crediti : 0) : +v; } catch (e) { return D.webcam ? D.webcam.crediti : 0; } };
  const crSet = (v) => { try { localStorage.setItem(CR_KEY, String(v)); } catch (e) { /* ignorato */ } };
  const ICON_COIN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M14.5 9.5c-.5-.9-1.4-1.4-2.5-1.4-1.6 0-2.7 1-2.7 2.2 0 2.9 5.6 1.5 5.6 4.3 0 1.2-1.2 2.2-2.9 2.2-1.2 0-2.2-.6-2.6-1.5M12 6.5v1.6M12 16v1.5"/></svg>';
  const walletHTML = (v) => `${ICON_COIN}<strong>${v}</strong> crediti <button type="button" class="wallet-add" data-topup aria-label="Ricarica crediti">+</button>`;

  /* ---------- Accesso: le sezioni per adulti (Vetrina, Webcam, Storie) chiedono di entrare ----------
     Nel prototipo "essere entrati" è un flag nel browser: si attiva iscrivendosi, accedendo o con il tasto del pannello. */
  const AUTH_KEY = 'agu.entrato';
  const isIn = () => { try { return localStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; } };
  const setIn = () => { try { localStorage.setItem(AUTH_KEY, '1'); } catch (e) { /* ignorato */ } };
  $$('[data-login]').forEach((el) => el.addEventListener(el.tagName === 'FORM' ? 'submit' : 'click', setIn));
  if (document.body.hasAttribute('data-gate') && !isIn()) {
    document.body.classList.add('is-gated');
    const next = encodeURIComponent(location.pathname.split('/').pop() + location.search);
    // Titolo e testo del pannello con il nome della sezione
    const q = new URLSearchParams(location.search);
    const room = D.webcam && D.webcam.stanze.find((r) => r.id === q.get('id'));
    const story = D.storie && D.storie.find((x) => x.id === q.get('id'));
    const G = {
      vetrina: ['Entra per vedere la Vetrina', 'Foto e video dei creator sono riservati agli iscritti che hanno verificato età e identità.'],
      webcam: ['Entra per vedere le Webcam', 'Le dirette dei creator sono riservate agli iscritti che hanno verificato età e identità.'],
      live: [room ? `Entra per vedere la diretta di ${room.nick}` : 'Entra per vedere questa diretta', 'Le dirette dei creator sono riservate agli iscritti che hanno verificato età e identità.'],
      storie: ['Entra per leggere le Storie', 'I racconti della community sono riservati agli iscritti che hanno verificato età e identità.'],
      storia: [story ? `Entra per leggere “${story.titolo}”` : 'Entra per leggere questa storia', 'I racconti della community sono riservati agli iscritti che hanno verificato età e identità.']
    }[document.body.dataset.page] || ['Entra per vedere questa sezione', 'Questa sezione è riservata agli iscritti che hanno verificato età e identità.'];
    document.body.insertAdjacentHTML('beforeend', `
      <div class="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
        <div class="gate-card">
          <p class="eyebrow">Solo maggiorenni verificati</p>
          <h2 id="gate-title">${esc(G[0])}</h2>
          <p class="muted">${esc(G[1])} L’iscrizione è gratuita.</p>
          <a class="btn btn-primary btn-lg btn-block" href="iscrizione.html?next=${next}">Entra o iscriviti</a>
          <button class="btn btn-ghost btn-block" type="button" data-gate-ok>Ho già un account (prototipo)</button>
          <a class="gate-back" href="index.html">Torna alla home</a>
        </div>
      </div>`);
    const ok = $('[data-gate-ok]'); ok.focus();
    ok.addEventListener('click', () => { setIn(); document.body.classList.remove('is-gated'); $('.gate').remove(); });
  }

  /* ---------- Proposte in chat: eventi, luoghi e prodotti dello shop ---------- */
  function propItems(kind) {
    const eur = (n) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
    if (kind === 'eventi') return (D.eventi || []).map((e) => ({ kind, id: e.id, img: e.cover, titolo: e.titolo, meta: `${e.locale}, ${e.quando}`, extra: `${eur(e.prevendita)} in prevendita`, href: 'index.html#bacheca' }));
    if (kind === 'luoghi') return (D.luoghi || []).map((l, i) => ({ kind, id: 'l' + i, img: l.img, titolo: l.nome, meta: `${l.cat}, ${l.citta}`, extra: l.offerta || '', href: l.link || 'scheda.html' }));
    return ((D.shop && D.shop.prodotti) || []).map((p) => ({ kind: 'shop', id: p.id, img: p.img, titolo: p.nome, meta: `${D.shop.nome}`, extra: eur(p.prezzo), href: 'shop.html' }));
  }
  function propItem(ref) { return propItems(ref.kind).find((x) => x.id === ref.id) || { titolo: '', meta: '', href: '#' }; }
  function propCard(ref, mine) {
    const x = propItem(ref); const lab = { eventi: 'Evento', luoghi: 'Luogo', shop: 'Dallo shop' }[ref.kind];
    return `<div class="prop-card">${x.img ? `<img src="${D.unsplash(x.img, 240, 240)}" alt="">` : ''}
      <span class="contact-text"><span class="contact-k">${mine ? 'Hai proposto' : 'Ti propone'} · ${lab}</span><strong>${esc(x.titolo)}</strong><span class="muted" style="font-size:13px">${esc(x.meta)}${x.extra ? ` · ${esc(x.extra)}` : ''}</span></span>
      <a class="btn btn-ghost contact-open" href="${esc(x.href)}">Apri</a></div>`;
  }

  const pages = {

    /* ---------- HOME ---------- */
    home() {
      const online = D.profili.filter((p) => p.online);
      $('#online-strip').innerHTML = online.map((p) => `
        <a class="online-item" href="cerca.html">
          <span class="photo">${p.foto
            ? `<img src="${D.unsplash(p.foto.id)}" srcset="${D.unsplash(p.foto.id)} 1x, ${D.unsplash(p.foto.id, 800, 800)} 2x" alt="" loading="lazy" decoding="async">`
            : esc(p.ini)}<span class="online-dot" aria-label="Online"></span></span>
          <span><strong>${esc(p.nick)}</strong><br><span class="muted">${esc(p.tipo)}, ${esc(p.citta)}</span></span>
        </a>`).join('');
      homeEvents();
      $('#latest-ads').innerHTML = D.annunci.slice(0, 3).map((a) => `
        <a class="card ad latest${a.cover ? ' has-cover' : ''}" href="annunci.html" style="color:inherit;text-decoration:none">
          ${coverHTML(a, { compact: true })}
          <div class="ad-body">
            <span class="cat-label">${esc(a.cat)}, ${esc(a.zona)}</span>
            <h3>${esc(a.titolo)}</h3>
            <p class="muted">${esc(a.testo)}</p>
          </div>
        </a>`).join('');
      $('#regions').innerHTML = D.regioni.map((r) => `<a href="annunci.html">${esc(r)}</a>`).join('');
      comeFunziona();
      // Anteprime sfocate di Vetrina, Webcam e Storie (contenuti visibili solo dopo l'accesso)
      const tiles = (ids) => ids.map((id) => `<span class="teaser-tile"><img src="${D.unsplash(id, 300, 375)}" alt="" loading="lazy" decoding="async"></span>`).join('');
      if ($('#teaser-vetrina')) {
        $('#teaser-vetrina').innerHTML = tiles(D.vetrina.post.slice(0, 3).map((p) => p.img));
        $('#teaser-webcam').innerHTML = tiles(D.webcam.stanze.filter((r) => r.live).slice(0, 3).map((r) => r.img));
        $('#teaser-storie').innerHTML = tiles(D.storie.slice(0, 3).map((x) => x.img));
        $('#teaser-live-n').textContent = D.webcam.stanze.filter((r) => r.live).length;
      }
      searchSheet();
    },

    /* ---------- ISCRIZIONE: switch Utente / Azienda ---------- */
    iscrizione() {
      const tabs = $$('[role="tab"]');
      const select = (type) => {
        tabs.forEach((t) => t.setAttribute('aria-selected', t.dataset.type === type));
        $('#form-utente').hidden = type !== 'utente';
        $('#form-azienda').hidden = type !== 'azienda';
        $('#step2').textContent = type === 'utente' ? 'Verifica età e identità' : 'Documenti e verifica attività';
        $('#step3').textContent = type === 'utente' ? 'Completa il profilo' : 'Crea la scheda pubblica';
      };
      tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.type)));
      // iscrizione.html?tipo=azienda apre direttamente il form aziende
      const qs = new URLSearchParams(location.search);
      select(qs.get('tipo') === 'azienda' ? 'azienda' : 'utente');
      // Utente: dopo i dati di accesso si passa alla verifica dell'età (passo 2)
      $('#form-utente').addEventListener('submit', (e) => {
        e.preventDefault();
        const tipo = ($('#form-utente input[name="tipo"]:checked') || {}).value || 'coppia';
        const next = qs.get('next') || 'annunci.html';
        location.href = `verifica.html?tipo=${encodeURIComponent(tipo)}&next=${encodeURIComponent(next)}`;
      });
    },

    /* ---------- VERIFICA ETÀ: doppio anonimato (simulazione del fornitore) ----------
       Una verifica per ogni persona del profilo (due per le coppie). Si salva solo un codice anonimo. */
    verifica() {
      const qs = new URLSearchParams(location.search);
      const tipo = qs.get('tipo') || 'coppia';
      const next = qs.get('next') || 'annunci.html';
      const couple = tipo === 'coppia';
      const KEY = 'agu.verifica';
      const people = couple ? ['Persona 1', 'Persona 2'] : ['La tua verifica'];
      let state = { tipo, persone: people.map(() => null), badge: false };
      try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.tipo === tipo) state = s; } catch (e) { /* ignorato */ }
      const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignorato */ } };
      const METHODS = { spid: 'SPID', cie: 'Carta d’identità elettronica', doc: 'Documento e selfie' };
      const SHORT = { spid: 'SPID', cie: 'CIE', doc: 'Documento' };
      const today = () => new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });

      $('#v-kind').textContent = couple ? 'Profilo di coppia' : `Profilo ${tipo}`;
      $('#v-title').textContent = couple ? 'Verificate entrambi' : 'Verifica la tua età';
      $('#v-sub').textContent = couple
        ? 'Ogni persona del profilo fa la propria verifica, anche da due telefoni diversi.'
        : 'Ci vuole circa un minuto. Puoi usare SPID, la carta d’identità elettronica o un documento.';
      $('#v-later').href = next;

      const render = () => {
        $('#people').innerHTML = people.map((name, i) => {
          const v = state.persone[i];
          return `<li class="person${v ? ' is-ok' : ''}">
            <span class="person-ico" aria-hidden="true">${v ? ICON_SEAL : i + 1}</span>
            <span class="person-text"><strong>${esc(name)}</strong>
              <span class="muted">${v ? `Confermata: ${esc(v.data)} · ${esc(SHORT[v.metodo])}` : 'Da verificare'}</span></span>
            ${v ? '<span class="badge">Verificata</span>' : `<button type="button" class="btn btn-ghost btn-sm" data-verify="${i}">Verifica</button>`}
          </li>`;
        }).join('');
        const all = state.persone.every(Boolean);
        const btn = $('#v-continue');
        btn.disabled = !all;
        btn.textContent = all ? 'Continua e completa il profilo' : (couple ? 'Servono entrambe le verifiche' : 'Completa la verifica per continuare');
        $('#v-notice').hidden = all;
        $('#sw-badge').setAttribute('aria-checked', String(!!state.badge));
        $$('[data-verify]').forEach((b) => b.addEventListener('click', () => open(+b.dataset.verify)));
      };

      const dlg = $('#verify-dialog');
      sheetClose(dlg);
      const step = (name) => $$('[data-vstep]', dlg).forEach((s) => { s.hidden = s.dataset.vstep !== name; });
      let current = 0;
      const open = (i) => {
        current = i;
        $('[data-who]', dlg).textContent = couple ? `· ${people[i]}` : '';
        step('metodo');
        dlg.showModal();
      };
      $$('[data-method]', dlg).forEach((m) => m.addEventListener('click', () => {
        const metodo = m.dataset.method;
        $('[data-method-label]', dlg).textContent = `Metodo: ${METHODS[metodo]}`;
        step('attesa');
        setTimeout(() => {
          const token = 'age-' + Math.random().toString(36).slice(2, 8) + '-' + Math.random().toString(36).slice(2, 6);
          state.persone[current] = { metodo, data: today(), token };
          save(); render();
          $('[data-token]', dlg).textContent = `esito: maggiorenne · codice ${token}`;
          step('ok');
        }, reduceMotion ? 300 : 1600);
      }));
      dlg.addEventListener('close', render);

      $('#sw-badge').addEventListener('click', () => {
        state.badge = $('#sw-badge').getAttribute('aria-checked') === 'true';
        save();
      });
      $('#v-continue').addEventListener('click', () => {
        if (!state.persone.every(Boolean)) return;
        setIn();
        location.href = next;
      });
      render();
    },

    /* ---------- ANNUNCI ---------- */
    annunci() {
      const list = $('#ads');
      const render = (cat) => {
        const items = cat === 'Tutte' ? D.annunci : D.annunci.filter((a) => a.cat === cat);
        $('#ads-count').textContent = `${items.length} annunci`;
        list.innerHTML = items.length ? items.map((a) => adCard(a)).join('') : '<p class="empty">Nessun annuncio in questa categoria. Pubblica il primo.</p>';
      };
      // Last: contenuti di 24 ore in cima alla bacheca
      const L = D.last; const SEEN = 'agu.last.visti';
      const seen = () => { try { return JSON.parse(localStorage.getItem(SEEN) || '[]'); } catch (e) { return []; } };
      const renderLast = () => {
        const v = seen();
        $('#last-row').innerHTML = `<a class="last-item last-mine" href="pubblica.html?tipo=last"><span class="last-ring"><span class="last-av">${av('Ombra & Mare', 'OM', 'last-img')}</span><span class="last-plus" aria-hidden="true">+</span></span><span class="last-name">Il tuo last</span></a>` +
          L.map((l, i) => `<button type="button" class="last-item${v.includes(l.nick) ? ' is-seen' : ''}" data-last="${i}"><span class="last-ring"><span class="last-av">${av(l.nick, '', 'last-img')}</span></span><span class="last-name">${esc(l.nick)}</span></button>`).join('');
      };
      renderLast();
      const lv = $('#last-viewer'); let li = 0, timer = null;
      const showLast = (i) => {
        if (i < 0 || i >= L.length) { lv.close(); return; }
        li = i; const l = L[i];
        $('#lv-bars').innerHTML = L.map((_, k) => `<span class="${k < i ? 'done' : ''}${k === i ? ' now' : ''}"><i></i></span>`).join('');
        $('#lv-who').href = userHref(l.nick);
        $('#lv-who').innerHTML = `${av(l.nick, '', 'last-img')}<span><strong>${esc(l.nick)}</strong> <span class="muted">${l.ore} h fa</span></span>`;
        $('#lv-img').src = D.unsplash(l.img, 900, 1600);
        $('#lv-text').textContent = l.testo;
        $('#lv-input').placeholder = `Rispondi a ${l.nick}`;
        const v = seen(); if (!v.includes(l.nick)) { v.push(l.nick); try { localStorage.setItem(SEEN, JSON.stringify(v)); } catch (e) { /* ignorato */ } }
        clearTimeout(timer); if (!reduceMotion) timer = setTimeout(() => showLast(li + 1), 5000);
      };
      $('#last-row').addEventListener('click', (e) => { const b = e.target.closest('[data-last]'); if (!b) return; lv.showModal(); showLast(+b.dataset.last); });
      lv.addEventListener('click', (e) => { const n = e.target.closest('[data-lv]'); if (n) showLast(li + +n.dataset.lv); if (e.target.closest('[data-lv-close]')) lv.close(); });
      lv.addEventListener('close', () => { clearTimeout(timer); renderLast(); });
      $('#lv-input').addEventListener('focus', () => clearTimeout(timer));
      $('#lv-reply').addEventListener('submit', (e) => { e.preventDefault(); location.href = 'messaggi.html'; });

      // Regione arrivata dalla home (?regione=...) o scelta qui
      const regSel = $('#ads-region-select');
      const reg = new URLSearchParams(location.search).get('regione');
      if (reg && [...regSel.options].some((o) => o.value === reg)) regSel.value = reg;
      const showReg = () => { $('#ads-region').textContent = regSel.value; };
      regSel.addEventListener('change', showReg); showReg();
      pills($('#ad-filters'), ['Tutte', 'Coppia cerca coppia', 'Coppia cerca lei', 'Lei cerca lui', 'Lei cerca coppia', 'Lui cerca coppia'], render);
    },

    /* ---------- CERCA PROFILI ---------- */
    cerca() {
      const liked = new Set();
      const render = () => {
        const tipi = $$('#filter-tipi input:checked').map((i) => i.value);
        const onlyOnline = $('#sw-online').getAttribute('aria-checked') === 'true';
        const onlyVer = $('#sw-ver').getAttribute('aria-checked') === 'true';
        const items = D.profili.filter((p) => tipi.includes(p.tipo) && (!onlyOnline || p.online) && (!onlyVer || p.ver));
        $('#res-count').textContent = `${items.length} profili corrispondono ai filtri`;
        $('#results').innerHTML = items.length ? items.map((p) => `
          <article class="card profile-card">
            <div class="photo">${p.foto ? `<img src="${D.unsplash(p.foto.id, 420, 400)}" alt="" loading="lazy" decoding="async">` : esc(p.ini)}
              ${p.online ? '<span class="tag-online"><span class="online-dot"></span>Online</span>' : ''}
              ${p.ver ? `<span class="tag-ver" aria-label="Verificato" style="color:#fff">${ICON_SEAL}</span>` : ''}
            </div>
            <div class="body">
              <strong><a class="ad-link-plain" href="${userHref(p.nick)}">${esc(p.nick)}</a></strong>
              <span class="muted">${esc(p.tipo)}, ${esc(p.eta)}, ${esc(p.citta)}</span>
              <span style="color:var(--text-2)">Cerca: ${esc(p.cerca)}</span>
              <div class="row">
                <a class="btn btn-ghost" style="flex:1" href="messaggi.html">Scrivi</a>
                <button type="button" class="btn btn-ghost btn-icon like" data-nick="${esc(p.nick)}" aria-pressed="${liked.has(p.nick)}" aria-label="Mi piace">${ICON_HEART}</button>
              </div>
            </div>
          </article>`).join('') : '<p class="empty">Nessun profilo con questi filtri. Prova ad allargare la ricerca.</p>';
      };
      // Parametri arrivati dalla ricerca in home (?cerco=Coppia&cerco=Lei&online=1)
      const q = new URLSearchParams(location.search);
      if (q.getAll('cerco').length) $$('#filter-tipi input').forEach((i) => { i.checked = q.getAll('cerco').includes(i.value); });
      if (q.get('online')) $('#sw-online').setAttribute('aria-checked', 'true');
      $('#filters').addEventListener('change', render);
      const ft = $('.filters-toggle');
      if (ft) ft.addEventListener('click', () => {
        const open = ft.getAttribute('aria-expanded') !== 'true';
        ft.setAttribute('aria-expanded', open); $('#filters').classList.toggle('is-open', open);
        ft.textContent = open ? 'Chiudi filtri' : 'Filtri';
      });
      $('#results').addEventListener('click', (e) => {
        const b = e.target.closest('.like'); if (!b) return;
        const n = b.dataset.nick; liked.has(n) ? liked.delete(n) : liked.add(n);
        b.setAttribute('aria-pressed', liked.has(n));
      });
      render();
    },

    /* ---------- MESSAGGI ---------- */
    messaggi() {
      const convs = D.conversazioni;
      let sel = 0;
      const renderList = () => {
        $('#conv-list').innerHTML = convs.map((c, i) => {
          const last = c.msgs[c.msgs.length - 1];
          return `<button type="button" class="conv" data-i="${i}" aria-current="${i === sel}">
            ${av(c.nome, c.ini)}
            <span class="conv-text"><span style="display:flex;justify-content:space-between;gap:8px"><strong>${esc(c.nome)}</strong><span class="muted" style="font-size:13px">${esc(c.ora)}</span></span>
            <span class="preview">${last.mine ? 'Tu: ' : ''}${last.prop ? `Proposta: ${esc(propItem(last.prop).titolo)}` : last.contact ? `Contatto ${EXT[last.contact.type].label}` : esc(last.testo)}</span></span>
            ${c.nuovi && i !== sel ? `<span class="unread">${c.nuovi}</span>` : ''}
          </button>`;
        }).join('');
      };
      const renderThread = () => {
        const c = convs[sel];
        $('#thread-ini').innerHTML = photoOf(c.nome) ? `<img src="${D.unsplash(photoOf(c.nome), 120, 120)}" alt="">` : esc(c.ini);
        $('#thread-name').innerHTML = profileOf(c.nome) ? `<a class="ad-link-plain" href="${userHref(c.nome)}">${esc(c.nome)}</a>` : esc(c.nome);
        $('#thread-sub').textContent = c.sotto;
        $('#thread-link').href = c.link; $('#thread-link').textContent = c.linkLabel;
        $('#thread-msgs').innerHTML = `<p class="system-note">I messaggi sono visibili solo a voi due.</p>` + c.msgs.map((m) => m.prop
          ? `<div class="msg ${m.mine ? 'mine' : ''} msg-contact">${propCard(m.prop, m.mine)}<time>${esc(m.ora)}</time></div>`
          : m.contact
          ? `<div class="msg ${m.mine ? 'mine' : ''} msg-contact">${extCard(m.contact.type, m.contact.h, m.mine)}<time>${esc(m.ora)}</time></div>`
          : `<div class="msg ${m.mine ? 'mine' : ''}"><div class="bubble">${esc(m.testo)}</div><time>${esc(m.ora)}</time></div>`).join('');
        const body = $('#thread-msgs'); body.scrollTop = body.scrollHeight;
        // su mobile scorre la pagina, non il riquadro: porta in vista l'ultimo messaggio
        if (matchMedia('(max-width: 720px)').matches && $('.chat').classList.contains('show-thread')) body.lastElementChild.scrollIntoView({ block: 'end' });
      };
      $('#conv-list').addEventListener('click', (e) => {
        const b = e.target.closest('.conv'); if (!b) return;
        sel = +b.dataset.i; convs[sel].nuovi = 0; renderList(); renderThread();
        $('.chat').classList.add('show-thread');   // su mobile si passa dalla lista alla conversazione
      });
      $('.thread-back').addEventListener('click', () => $('.chat').classList.remove('show-thread'));
      $('#composer').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('#composer input'); const t = input.value.trim(); if (!t) return;
        const d = new Date(); const ora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        convs[sel].msgs.push({ mine: true, testo: t, ora }); convs[sel].ora = ora;
        input.value = ''; renderList(); renderThread();
      });
      // Shortcut: condividi un tuo contatto esterno nella chat
      const shareDlg = $('#share-dialog');
      if (shareDlg) {
        const openShare = () => {
          const ext = extLoad(); const c = convs[sel];
          $('#share-to').textContent = `Con ${c.nome}. Scegli quale contatto inviare:`;
          $('#share-list').innerHTML = Object.keys(EXT).map((k) => ext[k] && ext[k].h
            ? `<button type="button" class="share-item" data-share="${k}"><span class="ext-badge ext-${k}" aria-hidden="true">${EXT[k].badge}</span><span class="contact-text"><strong>${EXT[k].label}</strong><span class="muted">${esc(ext[k].h)}</span></span><span class="share-send">Invia</span></button>`
            : `<a class="share-item is-empty" href="profilo.html#contatti"><span class="ext-badge ext-${k}" aria-hidden="true">${EXT[k].badge}</span><span class="contact-text"><strong>${EXT[k].label}</strong><span class="muted">Non impostato</span></span><span class="share-send">Aggiungi</span></a>`).join('');
          shareDlg.showModal();
        };
        const closeShare = sheetClose(shareDlg, $('.drawer-head', shareDlg));
        $('#share-open').addEventListener('click', openShare);
        $('#share-list').addEventListener('click', (e) => {
          const b = e.target.closest('[data-share]'); if (!b) return;
          const ext = extLoad(); const d = new Date(); const ora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          convs[sel].msgs.push({ mine: true, contact: { type: b.dataset.share, h: ext[b.dataset.share].h }, ora }); convs[sel].ora = ora;
          renderList(); renderThread(); closeShare();
        });
      }
      // Proponi dove andare: lista a destra (desktop) o pannello dal basso (mobile)
      let propTab = 'eventi';
      const renderProps = () => {
        $$('[data-prop-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.propTab === propTab));
        $$('[data-prop-list]').forEach((el) => { el.innerHTML = propItems(propTab).map((x) => `
          <div class="prop-item">${x.img ? `<img src="${D.unsplash(x.img, 160, 160)}" alt="" loading="lazy">` : ''}
            <span class="contact-text"><strong>${esc(x.titolo)}</strong><span class="muted" style="font-size:13px">${esc(x.meta)}</span>${x.extra ? `<span class="accent" style="font-size:13px">${esc(x.extra)}</span>` : ''}</span>
            <button class="btn btn-ghost btn-sm" type="button" data-propose="${x.kind}|${x.id}">Proponi</button></div>`).join(''); });
      };
      const propDlg = $('#prop-dialog');
      const closeProp = propDlg ? sheetClose(propDlg, $('.drawer-head', propDlg)) : () => {};
      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-prop-tab]'); if (t) { propTab = t.dataset.propTab; renderProps(); }
        const pr = e.target.closest('[data-propose]');
        if (pr) {
          const [kind, id] = pr.dataset.propose.split('|'); const d = new Date(); const ora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          convs[sel].msgs.push({ mine: true, prop: { kind, id }, ora }); convs[sel].ora = ora;
          renderList(); renderThread(); if (propDlg && propDlg.open) closeProp();
          pr.textContent = 'Proposto'; setTimeout(() => { pr.textContent = 'Proponi'; }, 1500);
        }
      });
      const po = $('#prop-open'); if (po) po.addEventListener('click', () => propDlg.showModal());
      renderProps();
      renderList(); renderThread();
    },

    /* ---------- PUBBLICA ANNUNCIO: foto di lancio separata dalla foto profilo ---------- */
    pubblica() {
      const form = $('#pub-form');
      const me = { nick: 'Ombra & Mare', ini: 'OM', tipo: 'Coppia', eta: '35 / 33', ver: true, quando: 'Anteprima' };
      let uploaded = null;   // dataURL della foto caricata
      let sample = null;     // foto scelta tra gli esempi

      // Galleria esempi
      $('#cover-samples').innerHTML = D.coverEsempi.map((c, i) => `
        <label class="sample">
          <input type="radio" name="sample" value="${i}" class="sr-only">
          <img src="${D.unsplash(c.id, 240, 160)}" alt="${esc(c.alt)}" loading="lazy">
        </label>`).join('');

      const showSource = () => {
        const src = form.fonte.value;
        $('#src-upload').hidden = src !== 'carica';
        $('#src-samples').hidden = src !== 'esempi';
        $('#vis-group').hidden = src === 'nessuna';
      };

      let mode = new URLSearchParams(location.search).get('tipo') === 'last' ? 'last' : 'annuncio';
      const setMode = (m) => {
        mode = m;
        $$('#pub-mode [data-mode]').forEach((b) => b.setAttribute('aria-selected', b.dataset.mode === m));
        $('#ad-step').hidden = m === 'last'; $('#last-step').hidden = m !== 'last';
        $('#fonte-nessuna').hidden = m === 'last';
        if (m === 'last' && form.fonte.value === 'nessuna') { form.fonte.value = 'esempi'; }
        $('#pub-h1').textContent = m === 'last' ? 'Pubblica un last' : 'Pubblica un annuncio';
        $('#photo-legend').textContent = m === 'last' ? '2. La foto' : '2. Foto di lancio';
        $('#pub-submit').textContent = m === 'last' ? 'Pubblica il last' : 'Pubblica l’annuncio';
        showSource(); update();
      };
      $('#pub-mode').addEventListener('click', (e) => { const b = e.target.closest('[data-mode]'); if (b) setMode(b.dataset.mode); });
      const update = () => {
        const fd = new FormData(form);
        const fonte = fd.get('fonte');
        const a = Object.assign({}, me, {
          cat: fd.get('cat'), zona: fd.get('zona') || 'Ravenna',
          titolo: fd.get('titolo').trim(), testo: fd.get('testo').trim(),
          coverVis: fd.get('vis')
        });
        if (fonte === 'carica' && uploaded) a.coverSrc = uploaded;
        if (fonte === 'esempi' && sample) a.cover = sample;
        if (mode === 'last') {
          const src = a.coverSrc || (a.cover && D.unsplash(a.cover.id, 600, 1000)) || '';
          $('#pub-preview').innerHTML = `<div class="last-preview">${src ? `<img src="${src}" alt="">` : '<span class="muted">Scegli una foto</span>'}<span class="lp-head">${av('Ombra & Mare', 'OM', 'last-img')}<strong>Ombra &amp; Mare</strong> <span>ora</span></span><span class="lp-text">${esc(fd.get('frase') || '')}</span></div>`;
        } else $('#pub-preview').innerHTML = adCard(a, { preview: true });
        $('#title-count').textContent = `${a.titolo.length}/60`;
        $('#pub-credits').innerHTML = fonte === 'esempi' && sample ? coverCredits([sample]) : '';
      };

      $('#cover-file').addEventListener('change', (e) => {
        const f = e.target.files[0]; if (!f) return;
        if (!/^image\//.test(f.type)) { $('#upload-msg').textContent = 'Scegli un’immagine (JPG, PNG o WEBP).'; return; }
        if (f.size > 8 * 1024 * 1024) { $('#upload-msg').textContent = 'L’immagine supera 8 MB: scegline una più leggera.'; return; }
        const r = new FileReader();
        r.onload = () => { uploaded = r.result; $('#upload-msg').textContent = `${f.name} caricata. La vedi nell’anteprima.`; update(); };
        r.readAsDataURL(f);
      });
      $('#cover-samples').addEventListener('change', (e) => { sample = D.coverEsempi[+e.target.value]; update(); });
      form.addEventListener('input', () => { showSource(); update(); });
      form.addEventListener('change', () => { showSource(); update(); });
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        $('#pub-done').hidden = false;
        $('#pub-done').innerHTML = mode === 'last' ? 'Last pubblicato: resta in cima alla bacheca per 24 ore. <a href="annunci.html">Vai agli annunci</a>' : 'Annuncio inviato. Lo controlliamo e sarà online in bacheca entro poche ore. <a href="annunci.html">Vai agli annunci</a>';
        $('#pub-done').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
      showSource(); update(); if (mode === 'last') setMode('last');
    },

    /* ---------- SHOP ONLINE di un'attività ---------- */
    shop() {
      const S = D.shop; const cart = new Map();
      const eur = (n) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
      const ICONS = {
        'Protezione': '<path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/>',
        'Benessere': '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/>',
        'Giochi': '<path d="M12 3l2.2 5.2L20 9l-4.3 3.8L17 18.5 12 15.6 7 18.5l1.3-5.7L4 9l5.8-.8z"/>',
        'Kit coppia': '<rect x="3" y="8" width="18" height="13" rx="2"/><path d="M3 12h18M12 8v13M12 8s-1.5-5-4.5-5a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
        'Lingerie': '<path d="M12 4a2 2 0 0 1 2 2c0 1-1 1.5-2 2.2L3 14h18l-9-5.8"/>'
      };
      const icon = (c) => `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[c] || ''}</svg>`;
      const renderCart = () => {
        const items = [...cart].map(([id, q]) => ({ p: S.prodotti.find((x) => x.id === id), q }));
        const tot = items.reduce((t, { p, q }) => t + p.prezzo * q, 0);
        const n = items.reduce((t, { q }) => t + q, 0);
        $('#cart-count').textContent = n ? `${n} ${n === 1 ? 'articolo' : 'articoli'}` : 'Vuoto';
        $('#cart-items').innerHTML = items.length ? items.map(({ p, q }) => `
          <li class="cart-row"><span><strong>${esc(p.nome)}</strong><br><span class="muted">${q} × ${eur(p.prezzo)}</span></span>
            <span class="qty"><button type="button" class="btn btn-ghost btn-icon" data-dec="${p.id}" aria-label="Togli uno">−</button><button type="button" class="btn btn-ghost btn-icon" data-inc="${p.id}" aria-label="Aggiungi uno">+</button></span></li>`).join('')
          : '<li class="muted">Il carrello è vuoto. Aggiungi un prodotto per vederlo qui.</li>';
        $('#cart-total').textContent = eur(tot);
        $('#cart-discount').textContent = tot ? `−${eur(tot * 0.1)}` : eur(0);
        $('#cart-pay').textContent = eur(tot * 0.9);
        $('#cart-checkout').toggleAttribute('disabled', !tot);
        // Icona del carrello nella navbar: badge con il numero di articoli
        const badge = $('#cart-badge'), btn = $('#cart-open');
        if (badge) {
          badge.hidden = !n; badge.textContent = n;
          btn.setAttribute('aria-label', n ? `Carrello, ${n} ${n === 1 ? 'articolo' : 'articoli'}, ${eur(tot * 0.9)}` : 'Carrello vuoto');
          btn.classList.toggle('has-items', !!n);
        }
      };
      const renderList = (cat) => {
        const list = cat === 'Tutti' ? S.prodotti : S.prodotti.filter((p) => p.cat === cat);
        $('#products').innerHTML = list.map((p) => `
          <article class="card product">
            <div class="product-visual${p.img ? ' has-img' : ''}" data-cat="${esc(p.cat)}">${p.img
              ? `<img src="${D.unsplash(p.img, 600, 600)}" srcset="${D.unsplash(p.img, 600, 600)} 1x, ${D.unsplash(p.img, 1000, 1000)} 2x" alt="" loading="lazy" decoding="async">`
              : icon(p.cat)}</div>
            <div class="product-body">
              <span class="cat-label">${esc(p.cat)}</span>
              <h3>${esc(p.nome)}</h3>
              <p class="muted">${esc(p.det)}</p>
              <div class="ad-foot"><strong class="price">${eur(p.prezzo)}</strong><button type="button" class="btn btn-ghost" data-inc="${p.id}">Aggiungi</button></div>
            </div>
          </article>`).join('');
      };
      document.addEventListener('click', (e) => {
        const inc = e.target.closest('[data-inc]'); const dec = e.target.closest('[data-dec]');
        if (inc) {
          cart.set(inc.dataset.inc, (cart.get(inc.dataset.inc) || 0) + 1); renderCart();
          // conferma visiva: il badge "salta" e il bottone dice Aggiunto per un attimo
          const b = $('#cart-badge'); if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
          if (inc.closest('.product') && inc.textContent.trim() === 'Aggiungi') { inc.textContent = 'Aggiunto'; setTimeout(() => { inc.textContent = 'Aggiungi'; }, 1200); }
        }
        if (dec) { const q = (cart.get(dec.dataset.dec) || 0) - 1; q > 0 ? cart.set(dec.dataset.dec, q) : cart.delete(dec.dataset.dec); renderCart(); }
      });
      $('#cart-checkout').addEventListener('click', () => { $('#cart-done').hidden = false; });
      // Carrello in un pannello: da destra su desktop, dal basso su mobile
      const drawer = $('#cart');
      $('#cart-open').addEventListener('click', () => drawer.showModal());
      sheetClose(drawer, $('.drawer-head', drawer));
      pills($('#shop-filters'), ['Tutti', 'Protezione', 'Benessere', 'Giochi', 'Kit coppia', 'Lingerie'], renderList);
      renderCart();
    },

    /* ---------- PRENOTAZIONE: richiesta inviata + extra (upselling) ---------- */
    prenotazione() {
      const X = D.extraSoggiorno; const sel = new Set();
      const eur = (n) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
      $('#extras').innerHTML = X.extra.map((x) => `
        <label class="extra">
          <input type="checkbox" value="${x.id}">
          <span class="extra-text"><strong>${esc(x.nome)}</strong><span class="muted">${esc(x.det)}</span>
            <span class="extra-by">${x.tipo === 'shop' ? 'Fornito da ' : 'Dalla struttura, '}${esc(x.da)}</span></span>
          <span class="extra-price">${eur(x.prezzo)}</span>
        </label>`).join('');
      const update = () => {
        const chosen = X.extra.filter((x) => sel.has(x.id));
        const tot = chosen.reduce((t, x) => t + x.prezzo, 0);
        $('#extra-summary').innerHTML = chosen.length
          ? chosen.map((x) => `<li><span>${esc(x.nome)}</span><span>${eur(x.prezzo)}</span></li>`).join('')
          : '<li class="muted">Nessun extra aggiunto</li>';
        $('#extra-total').textContent = eur(tot);
        $('#extra-confirm').textContent = chosen.length ? `Aggiungi ${chosen.length} ${chosen.length === 1 ? 'extra' : 'extra'} al soggiorno` : 'Continua senza extra';
      };
      $('#extras').addEventListener('change', (e) => { e.target.checked ? sel.add(e.target.value) : sel.delete(e.target.value); update(); });
      update();
    },

    /* ---------- ANNUNCIO SINGOLO (annuncio.html?id=...) ---------- */
    annuncio() {
      const id = new URLSearchParams(location.search).get('id');
      const a = D.annunci.find((x) => x.id === id);
      const root = $('#ad-detail');
      if (!a) {
        root.innerHTML = `<p class="empty">Questo annuncio non c’è più: l’autore l’ha rimosso o è scaduto. <a href="annunci.html">Torna agli annunci</a></p>`;
        return;
      }
      document.title = `Aguardiente · ${a.titolo}`;
      const prof = profileOf(a.nick);
      root.innerHTML = `
        ${(a.cover) ? `<div class="detail-cover">${coverHTML(a, { compact: true })}</div>` : ''}
        <div class="two-col" style="padding-top:32px">
          <article class="main">
            <span class="ad-meta">${metaHTML(a)}</span>
            <span class="cat-label" style="font-size:15px">${esc(a.cat)}</span>
            <h1 style="font-size:clamp(36px,5vw,56px)">${esc(a.titolo)}</h1>
            <p style="color:var(--text-2);font-size:19px;line-height:1.6;max-width:62ch">${esc(a.testo)}</p>
            <div class="chips"><span class="chip">${esc(a.zona)}</span><span class="chip">${esc(a.tipo)}, ${esc(a.eta)}</span></div>
          </article>
          <aside>
            <section class="card author">
              ${avatarHTML(a, 'ad-avatar author-av')}
              <div><strong style="font-size:20px">${esc(a.nick)}</strong><br><span class="muted">${esc(a.tipo)}, ${esc(a.eta)}, ${esc(a.zona)}</span></div>
              ${prof && prof.online ? '<span class="tag-inline"><span class="online-dot"></span>Online ora</span>' : ''}
              <a class="btn btn-primary btn-lg btn-block" href="messaggi.html">Scrivi a ${esc(a.nick)}</a>
              <a class="btn btn-ghost btn-block" href="${userHref(a.nick)}">Vedi il profilo</a>
              <div class="author-actions">
                <button class="btn btn-ghost" type="button" data-save aria-pressed="false">Salva</button>
                <button class="btn btn-ghost" type="button" style="color:var(--accent)">Segnala</button>
              </div>
            </section>
          </aside>
        </div>`;
      $('[data-save]', root).addEventListener('click', (e) => {
        const on = e.currentTarget.getAttribute('aria-pressed') !== 'true';
        e.currentTarget.setAttribute('aria-pressed', on);
        e.currentTarget.textContent = on ? 'Salvato' : 'Salva';
      });
      const simili = D.annunci.filter((x) => x.id !== a.id && (x.cat === a.cat || x.zona === a.zona)).slice(0, 3);
      const others = simili.length ? simili : D.annunci.filter((x) => x.id !== a.id).slice(0, 3);
      $('#ad-similar').innerHTML = others.map((x) => adCard(x)).join('');
    },

    /* ---------- PROFILO LOCALE: serate, coupon e servizi acquistabili ---------- */
    locale() {
      const L = D.locale;
      const eur = (n) => n === 0 ? 'Gratis' : n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
      $('#loc-gallery').innerHTML = L.foto.map((id, i) => `<div class="photo"><img src="${D.unsplash(id, i ? 600 : 1200, i ? 400 : 800)}" alt="" loading="${i ? 'lazy' : 'eager'}"></div>`).join('');
      $('#loc-rules').innerHTML = L.regole.map((r) => `<li><span class="ico">${ICON_CHECK}</span>${esc(r)}</li>`).join('');
      $('#loc-events').innerHTML = L.serate.map((e) => `
        <li class="event"><span class="event-day">${esc(e.giorno)}</span><span class="event-text"><strong>${esc(e.titolo)}</strong><span class="muted">${esc(e.det)}</span></span></li>`).join('');
      $('#loc-offers').innerHTML = L.offerte.map((o) => `
        <article class="card offer">
          <span class="cat-label">${esc(o.tipo)}</span>
          <h3>${esc(o.nome)}</h3>
          <p class="muted">${esc(o.det)}</p>
          ${o.nota ? `<p class="offer-note">${esc(o.nota)}</p>` : ''}
          <div class="ad-foot">
            <span class="price">${eur(o.prezzo)}${o.listino ? ` <s class="muted">${eur(o.listino)}</s>` : ''}</span>
            <button class="btn btn-ghost" type="button" data-buy="${o.id}">${o.prezzo === 0 ? 'Riserva' : 'Acquista'}</button>
          </div>
        </article>`).join('');

      // Acquisto: finestra di conferma, poi il coupon con QR da mostrare all'ingresso
      const dlg = $('#buy-dialog');
      let current = null;
      document.addEventListener('click', (e) => {
        const b = e.target.closest('[data-buy]'); if (!b) return;
        current = L.offerte.find((o) => o.id === b.dataset.buy);
        $('#buy-title').textContent = current.nome;
        $('#buy-det').textContent = current.det;
        $('#buy-total').textContent = eur(current.prezzo);
        $('#buy-step1').hidden = false; $('#buy-step2').hidden = true;
        dlg.showModal();
      });
      $('#buy-confirm').addEventListener('click', () => {
        const code = 'AGU-' + Math.random().toString(36).slice(2, 6).toUpperCase() + '-' + Math.random().toString(36).slice(2, 6).toUpperCase();
        $('#buy-code').textContent = code;
        $('#buy-qr').innerHTML = fakeQR(code);
        $('#buy-step1').hidden = true; $('#buy-step2').hidden = false;
      });
      $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

    },

    /* ---------- STORIE: elenco con collezioni, filtri, ordinamento, autori e temi ---------- */
    storie() {
      const S = D.storie; const st = { cat: null, q: '', sort: 'nuove' };
      const ICON_HEART_S = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
      const ICON_COMMENT = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.4 3.3a.6.6 0 0 1-1-.5V17A2.5 2.5 0 0 1 4 14.5z"/></svg>';
      const count = (c) => S.filter((x) => x.cat === c).length;

      $('#st-collections').innerHTML = D.storieCategorie.map((g) => `
        <div class="collection"><p class="eyebrow">${esc(g.gruppo)}</p>
          <div class="chips">${g.voci.map((v) => `<button type="button" class="pill" data-cat="${esc(v)}" aria-pressed="false">${esc(v)}${count(v) ? ` <span class="pill-n">${count(v)}</span>` : ''}</button>`).join('')}</div>
        </div>`).join('');
      $('#st-authors').innerHTML = D.storieAutori.map((a, i) => `
        <li><span class="rank">${i + 1}</span>${av(a.nick, a.ini)}<span class="author-text"><strong>${esc(a.nick)}</strong><span class="muted">${esc(a.tipo)}, ${a.storie} storie</span></span></li>`).join('');
      $('#st-tags').innerHTML = D.storieTag.map((t) => `<button type="button" class="tag" data-q="${esc(t)}">#${esc(t)}</button>`).join('');

      const card = (x) => `
        <article class="card story-card${x.img ? ' has-img' : ''}">
          ${x.img ? `<div class="story-img"><img src="${D.unsplash(x.img, 480, 480)}" srcset="${D.unsplash(x.img, 480, 480)} 1x, ${D.unsplash(x.img, 900, 900)} 2x" alt="" loading="lazy" decoding="async"></div>` : ''}
          <div class="story-text">
          <span class="cat-label">${esc(x.cat)}</span>
          <h3><a class="ad-link" href="storia.html?id=${x.id}">${esc(x.titolo)}</a></h3>
          <p class="muted story-excerpt">${esc(x.estratto)}</p>
          <p class="story-tags">${x.tag.map((t) => `#${esc(t)}`).join(' ')}</p>
          <div class="story-meta">
            ${av(x.autore, x.ini)}
            <span class="story-by">di <strong><a class="ad-link-plain" href="${userHref(x.autore)}">${esc(x.autore)}</a></strong><br><span class="muted">${esc(x.data)} · ${x.min} min di lettura</span></span>
            <span class="story-stats"><span aria-label="${x.like} mi piace">${ICON_HEART_S}${x.like}</span><span aria-label="${x.commenti} commenti">${ICON_COMMENT}${x.commenti}</span></span>
          </div>
          </div>
        </article>`;
      const render = () => {
        const q = st.q.toLowerCase();
        let list = S.filter((x) => (!st.cat || x.cat === st.cat) && (!q || [x.titolo, x.autore, x.cat, x.estratto, ...x.tag].join(' ').toLowerCase().includes(q)));
        if (st.sort === 'lette') list = [...list].sort((a, b) => b.like - a.like);
        if (st.sort === 'commentate') list = [...list].sort((a, b) => b.commenti - a.commenti);
        $('#st-list').innerHTML = list.length ? list.map(card).join('') : `<p class="empty">Nessuna storia ${st.cat ? `in “${esc(st.cat)}”` : ''}${st.q ? ` per “${esc(st.q)}”` : ''}. <a href="#scrivi">Scrivi la prima.</a></p>`;
        $('#st-count').textContent = `${list.length} ${list.length === 1 ? 'storia' : 'storie'}`;
        const active = [st.cat && `<button type="button" class="pill" aria-pressed="true" data-clear="cat">${esc(st.cat)} ✕</button>`, st.q && `<button type="button" class="pill" aria-pressed="true" data-clear="q">“${esc(st.q)}” ✕</button>`].filter(Boolean);
        $('#st-active').innerHTML = active.join(''); $('#st-active').hidden = !active.length;
        $$('#st-collections [data-cat]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === st.cat));
      };
      document.addEventListener('click', (e) => {
        const c = e.target.closest('[data-cat]'), t = e.target.closest('[data-q]'), x = e.target.closest('[data-clear]'), so = e.target.closest('[data-sort]');
        if (c) { st.cat = st.cat === c.dataset.cat ? null : c.dataset.cat; render(); }
        if (t) { st.q = t.dataset.q; $('#st-search').value = st.q; render(); $('#st-list').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' }); }
        if (x) { st[x.dataset.clear] = x.dataset.clear === 'cat' ? null : ''; if (x.dataset.clear === 'q') $('#st-search').value = ''; render(); }
        if (so) { st.sort = so.dataset.sort; $$('[data-sort]').forEach((b) => b.setAttribute('aria-selected', b === so)); render(); }
      });
      $('#st-search').addEventListener('input', (e) => { st.q = e.target.value.trim(); render(); });
      $('#st-form').addEventListener('submit', (e) => { e.preventDefault(); $('#st-sent').hidden = false; });
      render();
    },

    /* ---------- STORIA singola (storia.html?id=...) ---------- */
    storia() {
      const id = new URLSearchParams(location.search).get('id');
      const x = D.storie.find((s) => s.id === id) || D.storie[0];
      document.title = `Aguardiente · ${x.titolo}`;
      let liked = false, saved = false;
      $('#st-story').innerHTML = `
        ${x.img ? `<div class="story-hero"><img src="${D.unsplash(x.img, 1400, 600)}" srcset="${D.unsplash(x.img, 1400, 600)} 1x, ${D.unsplash(x.img, 2400, 1030)} 2x" alt="" decoding="async"></div>` : ''}
        <header class="story-head">
          <span class="cat-label">${esc(x.cat)}</span>
          <h1>${esc(x.titolo)}</h1>
          <div class="story-meta">
            ${av(x.autore, x.ini)}
            <span class="story-by">di <strong><a class="ad-link-plain" href="${userHref(x.autore)}">${esc(x.autore)}</a></strong><br><span class="muted">${esc(x.data)} · ${x.min} min di lettura</span></span>
          </div>
        </header>
        <div class="story-body">${x.testo.map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        <p class="story-tags">${x.tag.map((t) => `<a href="storie.html">#${esc(t)}</a>`).join(' ')}</p>
        <div class="story-actions">
          <button class="btn btn-ghost" type="button" data-like aria-pressed="false">Mi piace · <span>${x.like}</span></button>
          <button class="btn btn-ghost" type="button" data-save aria-pressed="false">Salva</button>
          <a class="btn btn-ghost" href="messaggi.html">Scrivi all’autore</a>
          <button class="btn btn-ghost" type="button" style="color:var(--accent)">Segnala</button>
        </div>`;
      $('[data-like]').addEventListener('click', (e) => { liked = !liked; const b = e.currentTarget; b.setAttribute('aria-pressed', liked); $('span', b).textContent = x.like + (liked ? 1 : 0); });
      $('[data-save]').addEventListener('click', (e) => { saved = !saved; e.currentTarget.setAttribute('aria-pressed', saved); e.currentTarget.textContent = saved ? 'Salvata' : 'Salva'; });
      const comments = [
        { ini: 'NO', nick: 'Notturna', quando: '2 ore fa', testo: 'Scritta benissimo, mi hai fatto venire voglia di riprovarci.' },
        { ini: 'GE', nick: 'Giulia & Enri', quando: 'ieri', testo: 'Ci siamo ritrovati in tante cose. Aspettiamo il seguito!' }
      ];
      const renderC = () => { $('#st-comments').innerHTML = comments.map((c) => `<div class="comment">${av(c.nick, c.ini)}<div><strong>${esc(c.nick)}</strong> <span class="muted">${esc(c.quando)}</span><p>${esc(c.testo)}</p></div></div>`).join(''); };
      $('#st-comment-form').addEventListener('submit', (e) => { e.preventDefault(); const i = $('input', e.currentTarget); if (!i.value.trim()) return; comments.push({ ini: 'OM', nick: 'Ombra & Mare', quando: 'ora', testo: i.value.trim() }); i.value = ''; renderC(); });
      renderC();
      $('#st-more').innerHTML = D.storie.filter((s) => s.id !== x.id).slice(0, 3).map((s) => `
        <article class="card story-card story-mini">
          ${s.img ? `<div class="story-img"><img src="${D.unsplash(s.img, 800, 450)}" alt="" loading="lazy" decoding="async"></div>` : ''}
          <div class="story-text">
          <span class="cat-label">${esc(s.cat)}</span>
          <h3><a class="ad-link" href="storia.html?id=${s.id}">${esc(s.titolo)}</a></h3>
          <p class="muted story-excerpt">${esc(s.estratto)}</p>
          <p class="muted" style="font-size:14px;margin:0">di ${esc(s.autore)} · ${s.min} min</p>
          </div>
        </article>`).join('');
    },

    /* ---------- PROFILO: contatti esterni ---------- */
    profilo() {
      const form = $('#ext-form'); if (!form) return;
      const ext = extLoad();
      Object.keys(EXT).forEach((k) => {
        form[k].value = ext[k].h || '';
        $(`[data-public="${k}"]`).setAttribute('aria-checked', !!ext[k].pub);
      });
      // Contatti resi visibili sul profilo: compaiono sotto il nome
      const showPublic = (v) => {
        const pub = Object.keys(EXT).filter((k) => v[k] && v[k].h && v[k].pub);
        $('#ext-public').innerHTML = pub.map((k) => `<a class="ext-chip" href="${esc(EXT[k].url(v[k].h))}" target="_blank" rel="noopener noreferrer"><span class="ext-badge ext-${k}" aria-hidden="true">${EXT[k].badge}</span>${esc(v[k].h)}</a>`).join('');
        $('#ext-public').hidden = !pub.length;
      };
      showPublic(ext);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const v = {};
        Object.keys(EXT).forEach((k) => { v[k] = { h: form[k].value.trim(), pub: $(`[data-public="${k}"]`).getAttribute('aria-checked') === 'true' }; });
        if (v.whatsapp.h && v.whatsapp.h.replace(/[^\d]/g, '').length < 8) { $('#ext-saved').textContent = 'Il numero WhatsApp sembra incompleto: scrivilo con il prefisso, per esempio +39 333 1234567.'; form.whatsapp.focus(); return; }
        $('#ext-saved').textContent = extSave(v) ? 'Contatti salvati. Li trovi nella chat, nel tasto accanto al campo di scrittura.' : 'Non è stato possibile salvarli in questo browser.';
        showPublic(v);
      });
    },

    /* ---------- VETRINA: creator, contenuti gratis / a pagamento / per abbonati ---------- */
    vetrina() {
      const V = D.vetrina; const eur = (n) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
      const unlocked = new Set(); const subs = new Set();
      const cr = (id) => V.creator.find((c) => c.id === id);
      const canSee = (p) => p.accesso === 'free' || unlocked.has(p.id) || (p.accesso === 'sub' && subs.has(p.creator));
      const LOCK = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
      const PLAY = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
      const label = (p) => p.accesso === 'free' ? 'Gratis' : p.accesso === 'ppv' ? eur(p.prezzo) : 'Abbonati';

      const renderCreators = () => {
        $('#vt-creators').innerHTML = V.creator.map((c) => `
          <article class="card creator-card">
            <div class="creator-cover"><img src="${D.unsplash(c.foto, 600, 400)}" alt="" loading="lazy"></div>
            <div class="creator-body">
              <span class="creator-av"><img src="${D.unsplash(c.foto, 120, 120)}" alt="" loading="lazy"></span>
              <div><strong>${esc(c.nick)}</strong> <span class="badge">${ICON_CHECK}Creator verificato</span><br><span class="muted">${esc(c.tipo)}, ${esc(c.citta)} · ${c.nFoto} foto · ${c.nVideo} video</span></div>
              <p class="muted" style="margin:0">${esc(c.bio)}</p>
              <button class="btn btn-ghost" type="button" data-sub="${c.id}" aria-pressed="${subs.has(c.id)}">${subs.has(c.id) ? 'Abbonato' : `Abbonati · ${eur(c.abbonamento)}/mese`}</button>
            </div>
          </article>`).join('');
      };
      let filtro = 'Tutti';
      const renderGrid = () => {
        const f = { 'Tutti': () => true, 'Foto': (p) => p.tipo === 'foto', 'Video': (p) => p.tipo === 'video', 'Gratis': (p) => p.accesso === 'free', 'A pagamento': (p) => p.accesso === 'ppv', 'Per abbonati': (p) => p.accesso === 'sub' }[filtro];
        const list = V.post.filter(f);
        $('#vt-count').textContent = `${list.length} contenuti`;
        $('#vt-grid').innerHTML = list.map((p) => {
          const c = cr(p.creator), ok = canSee(p);
          return `<button type="button" class="vt-tile${ok ? '' : ' is-locked'}" data-post="${p.id}" aria-label="${esc(p.titolo)} di ${esc(c.nick)}, ${ok ? 'visibile' : label(p)}">
            <img src="${D.unsplash(p.img, 500, 625)}" alt="" loading="lazy" decoding="async">
            <span class="vt-top">${p.tipo === 'video' ? `<span class="vt-pill">${PLAY}${esc(p.durata)}</span>` : '<span class="vt-pill">Foto</span>'}<span class="vt-pill ${p.accesso === 'free' ? 'is-free' : ''}">${ok && p.accesso !== 'free' ? 'Sbloccato' : label(p)}</span></span>
            ${ok ? '' : `<span class="vt-lock">${LOCK}</span>`}
            <span class="vt-foot"><span class="vt-av"><img src="${D.unsplash(c.foto, 80, 80)}" alt=""></span><span><strong>${esc(p.titolo)}</strong><br>${esc(c.nick)}</span></span>
          </button>`;
        }).join('');
      };
      pills($('#vt-filters'), ['Tutti', 'Foto', 'Video', 'Gratis', 'A pagamento', 'Per abbonati'], (k) => { filtro = k; renderGrid(); });
      renderCreators();

      const dlg = $('#vt-dialog'); let cur = null;
      const openPost = (p) => {
        cur = p; const c = cr(p.creator), ok = canSee(p);
        $('#vt-d-media').className = 'vt-d-media' + (ok ? '' : ' is-locked');
        $('#vt-d-media').innerHTML = `<img src="${D.unsplash(p.img, 900, 1125)}" alt="">${ok ? '' : `<span class="vt-lock">${LOCK}</span>`}`;
        $('#vt-d-creator').innerHTML = `<span class="vt-av"><img src="${D.unsplash(c.foto, 80, 80)}" alt=""></span><span><strong>${esc(c.nick)}</strong><br><span class="muted">${esc(c.tipo)}, ${esc(c.citta)}</span></span>`;
        $('#vt-d-title').textContent = p.titolo;
        $('#vt-d-info').textContent = `${p.tipo === 'video' ? `Video, ${p.durata}` : 'Foto'} · ${p.like} mi piace`;
        $('#vt-d-actions').innerHTML = ok
          ? `<button class="btn btn-ghost" type="button" data-close>Chiudi</button><button class="btn btn-primary" type="button" data-like>Mi piace</button>`
          : p.accesso === 'ppv'
            ? `<button class="btn btn-ghost" type="button" data-sub="${c.id}">Abbonati · ${eur(c.abbonamento)}/mese</button><button class="btn btn-primary btn-cta" type="button" data-buy="${p.id}">Sblocca · ${eur(p.prezzo)}</button>`
            : `<button class="btn btn-ghost" type="button" data-close>Chiudi</button><button class="btn btn-primary btn-cta" type="button" data-sub="${c.id}">Abbonati · ${eur(c.abbonamento)}/mese</button>`;
        if (!dlg.open) dlg.showModal();
      };
      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-post]'), b = e.target.closest('[data-buy]'), sb = e.target.closest('[data-sub]'), lk = e.target.closest('[data-like]'), cl = e.target.closest('#vt-dialog [data-close]');
        if (t) openPost(V.post.find((p) => p.id === t.dataset.post));
        if (b) { unlocked.add(b.dataset.buy); renderGrid(); openPost(cur); }
        if (sb) { const id = sb.dataset.sub; subs.has(id) ? subs.delete(id) : subs.add(id); renderCreators(); renderGrid(); if (dlg.open && cur) openPost(cur); }
        if (lk) { lk.textContent = 'Ti piace'; lk.disabled = true; }
        if (cl) dlg.close();
      });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

      // Form "Nuovo contenuto"
      const form = $('#vt-form');
      form.addEventListener('change', () => { $('#vt-price').hidden = form.accesso.value !== 'ppv'; });
      $('#vt-file').addEventListener('change', (e) => { const n = e.target.files.length; $('#vt-file-msg').textContent = n ? `${n} ${n === 1 ? 'file selezionato' : 'file selezionati'}` : 'JPG, PNG, WEBP, MP4 o MOV. Puoi selezionarne più di uno.'; });
      form.addEventListener('submit', (e) => {
        e.preventDefault(); const m = $('#vt-sent'); m.hidden = false;
        if (!form.c1.checked || !form.c2.checked) { m.textContent = 'Per pubblicare devi confermare le due dichiarazioni sul consenso e sulla moderazione.'; return; }
        const acc = { free: 'gratis per gli iscritti verificati', ppv: `a pagamento (${eur(+form.prezzo.value || 0)})`, sub: 'solo per gli abbonati' }[form.accesso.value];
        m.textContent = `Inviato alla moderazione: sarà ${acc}. Ti avvisiamo appena è online.`;
      });
    },

    /* ---------- WEBCAM: elenco dirette, prossime dirette, prova cam ---------- */
    webcam() {
      const W = D.webcam;
      const paintWallet = () => { $('#wc-wallet').innerHTML = walletHTML(crGet()); };
      paintWallet();
      document.addEventListener('click', (e) => { if (e.target.closest('[data-topup]')) { crSet(crGet() + 100); paintWallet(); } });
      let f = 'Tutte';
      const render = () => {
        const live = W.stanze.filter((r) => r.live && (f === 'Tutte' || r.tipo === f || (f === 'Coppie' && r.tipo === 'Coppia')));
        $('#wc-count').textContent = `${live.length} in diretta`;
        $('#wc-grid').innerHTML = live.map((r) => `
          <a class="wc-tile" href="live.html?id=${r.id}">
            <img src="${D.unsplash(r.img, 640, 480)}" alt="" loading="lazy" decoding="async">
            <span class="stage-top"><span class="live-badge"><span class="live-dot" aria-hidden="true"></span>LIVE</span><span class="vt-pill">${r.spettatori} spettatori</span></span>
            <span class="wc-foot"><strong>${esc(r.nick)}</strong> <span class="muted-light">${esc(r.tipo)}, ${esc(r.citta)}</span><br><span class="wc-title">${esc(r.titolo)}</span></span>
          </a>`).join('') || '<p class="empty">Nessuna diretta in questa categoria adesso.</p>';
      };
      pills($('#wc-filters'), ['Tutte', 'Lei', 'Lui', 'Coppie', 'Trans'], (k) => { f = k; render(); });
      $('#wc-next').innerHTML = W.stanze.filter((r) => !r.live).map((r) => `
        <div class="card wc-next-item"><span class="vt-av" style="width:48px;height:48px"><img src="${D.unsplash(r.img, 96, 96)}" alt=""></span>
          <span style="flex:1"><strong>${esc(r.nick)}</strong><br><span class="muted">${esc(r.prossima)} · ${esc(r.titolo)}</span></span>
          <button class="btn btn-ghost" type="button" data-remind aria-pressed="false">Avvisami</button></div>`).join('');
      $('#wc-next').addEventListener('click', (e) => { const b = e.target.closest('[data-remind]'); if (!b) return; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', on); b.textContent = on ? 'Ti avviseremo' : 'Avvisami'; });

      // Prova la webcam: anteprima locale, nessun invio
      let stream = null;
      $('#cam-start').addEventListener('click', async () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { $('#cam-msg').textContent = 'Questo browser non permette di usare la webcam.'; return; }
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
          const v = $('#cam-video'); v.srcObject = stream; await v.play();
          $('#cam-preview').classList.add('is-on'); $('#cam-stop').disabled = false; $('#cam-start').disabled = true;
          $('#cam-msg').textContent = 'La webcam funziona. Quando andrai in diretta potrai scegliere chi ti vede.';
        } catch (err) { $('#cam-msg').textContent = 'Non è stato possibile accedere alla webcam: controlla i permessi del browser.'; }
      });
      $('#cam-stop').addEventListener('click', () => { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; $('#cam-preview').classList.remove('is-on'); $('#cam-stop').disabled = true; $('#cam-start').disabled = false; $('#cam-msg').textContent = ''; });
      render();
    },

    /* ---------- STANZA LIVE (live.html?id=...) ---------- */
    live() {
      const W = D.webcam;
      const r = W.stanze.find((x) => x.id === new URLSearchParams(location.search).get('id') && x.live) || W.stanze.find((x) => x.live);
      document.title = `Aguardiente · ${r.nick} in diretta`;
      $('#rm-img').src = D.unsplash(r.img, 1280, 720);
      $('#rm-av').src = D.unsplash(r.img, 96, 96);
      $('#rm-nick').textContent = r.nick; $('#rm-title').textContent = r.titolo;
      let viewers = r.spettatori, goal = r.goal.ora;
      const paint = () => {
        $('#rm-viewers').textContent = `${viewers} spettatori`;
        $('#rm-goal-label').textContent = r.goal.label;
        $('#rm-goal-num').textContent = `${Math.min(goal, r.goal.target)} / ${r.goal.target} crediti`;
        $('#rm-goal-bar').style.width = `${Math.min(100, (goal / r.goal.target) * 100)}%`;
        $('#rm-wallet').innerHTML = walletHTML(crGet());
      };
      $('#rm-tips').innerHTML = [5, 10, 25, 50].map((n) => `<button class="btn btn-ghost" type="button" data-tip="${n}">${ICON_COIN}${n}</button>`).join('');
      $('#rm-private').textContent = `Show privato · ${r.privato} crediti/min`;
      const msgs = $('#rm-msgs');
      const add = (nick, text, kind = '') => {
        const el = document.createElement('p'); el.className = `rm-msg ${kind}`;
        el.innerHTML = `<strong>${esc(nick)}</strong> ${esc(text)}`; msgs.appendChild(el);
        while (msgs.children.length > 60) msgs.firstChild.remove();
        msgs.scrollTop = msgs.scrollHeight;
      };
      add('Aguardiente', 'Benvenuto nella diretta. Rispetta il creator: niente richieste insistenti, niente dati personali.', 'is-system');
      const hearts = (n) => { if (reduceMotion) return; for (let i = 0; i < Math.min(n / 5, 8); i++) { const h = document.createElement('span'); h.className = 'heart'; h.style.left = `${20 + Math.random() * 60}%`; h.style.animationDelay = `${i * 120}ms`; $('#rm-hearts').appendChild(h); setTimeout(() => h.remove(), 2200); } };
      const tip = (n) => {
        if (crGet() < n) { openDlg('Crediti insufficienti', `Ti servono ${n} crediti, ne hai ${crGet()}.`, `<button class="btn btn-ghost" type="button" data-close>Annulla</button><button class="btn btn-primary btn-cta" type="button" data-topup>Ricarica 100 crediti</button>`); return; }
        crSet(crGet() - n); goal += n; add('Tu', `hai mandato ${n} crediti`, 'is-tip'); hearts(n); paint();
        if (goal >= r.goal.target && goal - n < r.goal.target) add('Aguardiente', `Obiettivo raggiunto: ${r.goal.label}!`, 'is-system');
      };
      const dlg = $('#rm-dialog');
      const openDlg = (t, txt, actions) => { $('#rm-d-title').textContent = t; $('#rm-d-text').textContent = txt; $('#rm-d-actions').innerHTML = actions; if (!dlg.open) dlg.showModal(); };
      document.addEventListener('click', (e) => {
        const t = e.target.closest('[data-tip]'), tp = e.target.closest('[data-topup]'), cl = e.target.closest('#rm-dialog [data-close]'), pv = e.target.closest('#rm-private'), ok = e.target.closest('[data-private-ok]');
        if (t) tip(+t.dataset.tip);
        if (tp) { crSet(crGet() + 100); paint(); if (dlg.open) dlg.close(); add('Aguardiente', 'Ricarica di 100 crediti completata (simulata).', 'is-system'); }
        if (cl) dlg.close();
        if (pv) openDlg(`Show privato con ${r.nick}`, `${r.privato} crediti al minuto, scalati mentre lo show è attivo. ${r.nick} può accettare o rifiutare la richiesta. Hai ${crGet()} crediti.`, `<button class="btn btn-ghost" type="button" data-close>Annulla</button><button class="btn btn-primary btn-cta" type="button" data-private-ok>Invia richiesta</button>`);
        if (ok) { dlg.close(); add('Tu', 'hai chiesto uno show privato', 'is-tip'); setTimeout(() => add(r.nick, 'Ricevuto! Finisco il goal e ti scrivo 😉'), 1500); }
      });
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
      $('#rm-form').addEventListener('submit', (e) => { e.preventDefault(); const i = $('#rm-input'); const v = i.value.trim(); if (!v) return; add('Tu', v); i.value = ''; });
      // chat e spettatori simulati
      const nicks = ['Marco_bo', 'Sara.rn', 'Ale&Robi', 'Viaggiatore_72', 'Notturna', 'Pietro84'];
      setInterval(() => { add(nicks[Math.floor(Math.random() * nicks.length)], W.chat[Math.floor(Math.random() * W.chat.length)]); viewers = Math.max(5, viewers + Math.round(Math.random() * 6 - 3)); paint(); }, 3500);
      setInterval(() => { if (Math.random() < .5) { const n = [5, 10, 25][Math.floor(Math.random() * 3)]; goal += n; add(nicks[Math.floor(Math.random() * nicks.length)], `ha mandato ${n} crediti`, 'is-tip'); hearts(n); paint(); } }, 6000);
      paint();
    },

    /* ---------- PROFILO PUBBLICO (utente.html?u=nickname) ---------- */
    utente() {
      const nick = new URLSearchParams(location.search).get('u') || 'Luna & Matteo';
      const base = profileOf(nick) || { nick, tipo: '', eta: '', citta: '', ver: false, online: false };
      const ex = (D.utenti || {})[nick] || {};
      const photo = photoOf(nick);
      const fotos = ex.foto || [photo, ...D.storie.slice(0, 3).map((x) => x.img)].filter(Boolean);
      const videos = ex.video || [];
      const ads = D.annunci.filter((a) => a.nick === nick);
      const RV_KEY = 'agu.recensioni', MEET_KEY = 'agu.incontri';
      const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || d); } catch (e) { return JSON.parse(d); } };
      const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignorato */ } };
      const reviews = () => [...(ex.recensioni || []), ...(load(RV_KEY, '{}')[nick] || [])];
      const stars = (n) => `<span class="stars" aria-label="${n} stelle su 5">${[1, 2, 3, 4, 5].map((i) => `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" class="${i <= Math.round(n) ? 'on' : ''}"><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z"/></svg>`).join('')}</span>`;
      let following = load('agu.seguiti', '[]').includes(nick);
      document.title = `Aguardiente · ${nick}`;

      const renderHero = () => {
        const r = reviews(); const avg = r.length ? r.reduce((t, x) => t + x.stelle, 0) / r.length : 0;
        const seguaci = (ex.seguaci || 48) + (following ? 1 : 0);
        $('#u-hero').innerHTML = `
          <div class="profile-cover">${fotos[1] || photo ? `<img src="${D.unsplash(fotos[1] || photo, 1600, 500)}" alt="">` : ''}</div>
          <div class="profile-info">
            <div class="profile-avatar">${photo ? `<img src="${D.unsplash(photo, 300, 300)}" alt="">` : esc(base.ini || '')}</div>
            <div style="flex-grow:1;display:flex;flex-direction:column;gap:6px;padding-bottom:6px;min-width:0">
              <div class="chips chips-wrap" style="align-items:center">
                <h1 style="font-size:clamp(32px,5vw,44px)">${esc(nick)}</h1>
                ${base.ver ? `<span class="badge">${ICON_SEAL}Verificato</span>` : ''}
                ${base.online ? '<span class="badge"><span class="online-dot" style="width:8px;height:8px"></span>Online</span>' : ''}
              </div>
              <span class="muted" style="font-size:17px">${[base.tipo, base.eta, base.citta].filter(Boolean).map(esc).join(', ')}</span>
              <div class="u-stats">
                <span><strong>${seguaci}</strong> seguaci</span><span><strong>${ex.seguiti || 31}</strong> seguiti</span>
                <span><strong>${r.length ? avg.toFixed(1) : '—'}</strong> ${r.length ? stars(avg) : ''} ${r.length} ${r.length === 1 ? 'recensione' : 'recensioni'}</span>
              </div>
            </div>
            <div class="actions" style="padding-bottom:6px">
              <button class="btn btn-ghost" type="button" data-follow aria-pressed="${following}">${following ? 'Segui già' : 'Segui'}</button>
              <a class="btn btn-primary" href="messaggi.html">Scrivi</a>
              <button class="btn btn-ghost btn-icon" type="button" aria-label="Segnala o blocca" title="Segnala o blocca"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg></button>
            </div>
          </div>
          ${ex.bio ? `<p class="u-bio">${esc(ex.bio)}</p>` : ''}`;
      };
      $('#u-foto').innerHTML = `<div class="u-grid">${fotos.map((id, i) => `<div class="u-tile${i >= fotos.length - 2 && fotos.length > 3 ? ' is-private' : ''}"><img src="${D.unsplash(id, 500, 500)}" alt="" loading="lazy">${i >= fotos.length - 2 && fotos.length > 3 ? '<span class="photo-tag">Solo contatti</span>' : ''}</div>`).join('')}</div>`;
      $('#u-video').innerHTML = videos.length ? `<div class="u-grid">${videos.map((v) => `<div class="u-tile"><img src="${D.unsplash(v.img, 500, 500)}" alt="" loading="lazy"><span class="vt-pill u-dur"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg>${esc(v.durata)}</span></div>`).join('')}</div>` : '<p class="empty">Nessun video pubblicato.</p>';
      $('#u-annunci').innerHTML = ads.length ? `<div class="grid grid-3">${ads.map((a) => adCard(a)).join('')}</div>` : '<p class="empty">Nessun annuncio attivo.</p>';

      const renderReviews = () => {
        const r = reviews(); const avg = r.length ? r.reduce((t, x) => t + x.stelle, 0) / r.length : 0;
        $('#u-rev-summary').innerHTML = r.length ? `<strong class="rev-avg">${avg.toFixed(1)}</strong>${stars(avg)}<span class="muted">${r.length} ${r.length === 1 ? 'recensione' : 'recensioni'} da incontri confermati</span>` : '<p class="muted">Ancora nessuna recensione.</p>';
        $('#u-rev-list').innerHTML = r.map((x) => `<article class="review">${av(x.da, x.da.slice(0, 2).toUpperCase())}<div><div class="review-head"><a class="ad-link-plain" href="utente.html?u=${encodeURIComponent(x.da)}"><strong>${esc(x.da)}</strong></a>${stars(x.stelle)}</div><p>${esc(x.testo)}</p><span class="muted" style="font-size:13px">${esc(x.data)} · <span class="meta-ver">${ICON_CHECK}Incontro confermato</span></span></div></article>`).join('');
        const met = load(MEET_KEY, '[]').includes(nick);
        $('#u-rev-box').innerHTML = met ? `
          <h2 style="font-size:22px">Lascia una recensione</h2>
          <form id="u-rev-form" class="rev-form">
            <fieldset class="star-input"><legend>Il tuo voto</legend>${[5, 4, 3, 2, 1].map((n) => `<input type="radio" name="stelle" id="st${n}" value="${n}"${n === 5 ? ' checked' : ''}><label for="st${n}" aria-label="${n} stelle"><svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9l-5.3 2.7 1-5.8-4.2-4.1 5.9-.9z"/></svg></label>`).join('')}</fieldset>
            <label class="field">Com’è andata<textarea name="testo" rows="4" maxlength="500" placeholder="Racconta in poche righe: puntualità, rispetto, sintonia."></textarea></label>
            <button class="btn btn-ghost btn-block" type="submit">Pubblica recensione</button>
          </form>`
          : `<h2 style="font-size:22px">Recensioni solo dopo un incontro</h2>
          <p class="muted" style="margin:0">Per evitare recensioni false, puoi scriverne una solo se ${esc(nick)} conferma che vi siete incontrati.</p>
          <button class="btn btn-ghost btn-block" type="button" data-meet>Abbiamo avuto un incontro</button>
          <p class="muted" id="u-meet-msg" aria-live="polite" style="font-size:14px;margin:0"></p>`;
      };
      document.addEventListener('click', (e) => {
        if (e.target.closest('[data-follow]')) { following = !following; const l = load('agu.seguiti', '[]').filter((x) => x !== nick); if (following) l.push(nick); save('agu.seguiti', l); renderHero(); }
        if (e.target.closest('[data-meet]')) {
          const b = e.target.closest('[data-meet]'); b.disabled = true; $('#u-meet-msg').textContent = `Richiesta inviata a ${nick}…`;
          setTimeout(() => { const l = load(MEET_KEY, '[]'); l.push(nick); save(MEET_KEY, l); renderReviews(); }, 1600);
        }
        const t = e.target.closest('#u-tabs [data-tab]');
        if (t) { $$('#u-tabs [data-tab]').forEach((x) => x.setAttribute('aria-selected', x === t)); ['foto', 'video', 'annunci', 'recensioni'].forEach((k) => { $(`#u-${k}`).hidden = k !== t.dataset.tab; }); }
      });
      document.addEventListener('submit', (e) => {
        if (e.target.id !== 'u-rev-form') return; e.preventDefault();
        const f = e.target; const testo = f.testo.value.trim(); if (!testo) { f.testo.focus(); return; }
        const all = load(RV_KEY, '{}'); (all[nick] = all[nick] || []).push({ da: 'Ombra & Mare', stelle: +f.stelle.value, testo, data: 'ora' }); save(RV_KEY, all);
        renderReviews(); renderHero();
      });
      if (location.hash === '#recensioni') $('#u-tabs [data-tab="recensioni"]').click();
      renderHero(); renderReviews();
    },

    /* ---------- LUOGHI ---------- */
    luoghi() {
      const render = (cat) => {
        const items = cat === 'Tutti' ? D.luoghi : D.luoghi.filter((p) => p.cat === cat);
        $('#places').innerHTML = items.map((p) => `
          <a class="card place" href="${p.link || 'scheda.html'}">
            <div class="photo">${p.img ? `<img src="${D.unsplash(p.img, 640, 360)}" alt="" loading="lazy" decoding="async">` : ''}${p.offerta ? `<span class="badge badge-grad">${esc(p.offerta)}</span>` : ''}</div>
            <div class="body">
              <div style="display:flex;justify-content:space-between;gap:12px"><span class="muted" style="font-size:14px">${esc(p.cat)}</span>${p.shop ? `<span class="badge">${ICON_CHECK}Shop online</span>` : certHTML(false)}</div>
              <h3>${esc(p.nome)}</h3>
              <p class="muted">${esc(p.descr)}</p>
              <span class="muted" style="display:inline-flex;gap:6px;align-items:center;font-size:14px">${ICON_PIN}${esc(p.citta)}</span>
            </div>
          </a>`).join('');
      };
      pills($('#place-filters'), ['Tutti', 'Struttura friendly', 'Boutique', 'Club', 'Spazio privato'], render);
    },

    /* ---------- DASHBOARD AZIENDA: checklist verifica ---------- */
    dashboard() {
      const tasks = $$('.task button');
      const update = () => {
        const done = tasks.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
        $('#progress-bar').style.width = `${(done / tasks.length) * 100}%`;
        $('#progress-label').textContent = `${done} di ${tasks.length} completati`;
      };
      tasks.forEach((b) => b.addEventListener('click', () => { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true'); update(); }));
      update();
    }
  };

  /* ---------- COME FUNZIONA (home) ---------- */
  function comeFunziona() {
    const root = $('#come-funziona'); if (!root) return;
    const sw = $('.cf-switch', root);

    // Rivelazione dei blocchi quando entrano nello schermo
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-visible');
      const demo = $('[data-demo]', e.target);
      if (demo) playDemo(demo);
      io.unobserve(e.target);
    }), { threshold: 0.2 });
    const observe = (scope) => $$('.reveal:not(.is-visible)', scope).forEach((el) => io.observe(el));

    // Demo: i messaggi compaiono uno alla volta; i puntini "sta scrivendo" spariscono quando arriva la risposta
    const timers = new WeakMap();
    function playDemo(demo) {
      (timers.get(demo) || []).forEach(clearTimeout);
      const steps = $$('[data-step]', demo);
      steps.forEach((s) => s.classList.remove('is-shown', 'is-done'));
      if (reduceMotion) { steps.forEach((s) => s.classList.add(s.hasAttribute('data-typing') ? 'is-done' : 'is-shown')); return; }
      const list = []; let t = 300;
      steps.forEach((s, i) => {
        list.push(setTimeout(() => s.classList.add('is-shown'), t));
        if (s.hasAttribute('data-typing')) { t += 1400; list.push(setTimeout(() => s.classList.add('is-done'), t)); }
        else t += 900;
      });
      timers.set(demo, list);
    }
    $$('[data-replay]', root).forEach((b) => b.addEventListener('click', () => playDemo($('[data-demo]', b.closest('.cf-demo-wrap')))));

    // Dettagli: ogni chip accende o spegne una parte della frase
    $$('[data-detail]', root).forEach((box) => {
      const hint = $('[data-hint]', box);
      const full = hint.textContent;
      const hints = $('template[data-hints]', box).innerHTML.split('|');
      const chipsEl = $$('.detail-chip', box);
      box.addEventListener('click', (e) => {
        const chip = e.target.closest('.detail-chip'); if (!chip) return;
        const on = chip.getAttribute('aria-pressed') !== 'true';
        chip.setAttribute('aria-pressed', on);
        $$(`mark[data-part="${chip.dataset.part}"]`, box).forEach((m) => m.classList.toggle('is-off', !on));
        const off = chipsEl.findIndex((c) => c.getAttribute('aria-pressed') === 'false');
        hint.innerHTML = off === -1 ? full : hints[off];
      });
    });

    // Switch Privati / Business
    $$('[role="tab"]', sw).forEach((tab) => tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      sw.dataset.active = mode;
      $$('[role="tab"]', sw).forEach((t) => t.setAttribute('aria-selected', t === tab));
      $$('.cf-panel', root).forEach((p) => {
        const show = p.id === `cf-${mode}`;
        p.hidden = !show;
        if (show) {
          p.classList.remove('is-entering'); void p.offsetWidth; p.classList.add('is-entering');
          // i blocchi già sullo schermo compaiono subito, gli altri allo scroll
          $$('.reveal', p).forEach((el) => {
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight && r.bottom > 0) { el.classList.add('is-visible'); const d = $('[data-demo]', el); if (d) playDemo(d); }
          });
          observe(p);
        }
      });
    }));

    observe(root);
  }

  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
})();
