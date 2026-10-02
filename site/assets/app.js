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
  function avatarHTML(a, cls = 'ad-avatar') {
    const prof = profileOf(a.nick);
    return prof && prof.foto
      ? `<span class="${cls}"><img src="${D.unsplash(prof.foto.id, 120, 120)}" alt="" loading="lazy"></span>`
      : `<span class="${cls}">${esc(a.ini)}</span>`;
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
            <div class="ad-who"><strong>${esc(a.nick)}</strong><span class="muted">${esc(a.tipo)}, ${esc(a.eta)}, ${esc(a.zona)}</span></div>
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
      select(new URLSearchParams(location.search).get('tipo') === 'azienda' ? 'azienda' : 'utente');
    },

    /* ---------- ANNUNCI ---------- */
    annunci() {
      const list = $('#ads');
      const render = (cat) => {
        const items = cat === 'Tutte' ? D.annunci : D.annunci.filter((a) => a.cat === cat);
        $('#ads-count').textContent = `${items.length} annunci`;
        list.innerHTML = items.length ? items.map((a) => adCard(a)).join('') : '<p class="empty">Nessun annuncio in questa categoria. Pubblica il primo.</p>';
      };
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
            <div class="photo">${esc(p.ini)}
              ${p.online ? '<span class="tag-online"><span class="online-dot"></span>Online</span>' : ''}
              ${p.ver ? `<span class="tag-ver" aria-label="Verificato" style="color:#fff">${ICON_CHECK}</span>` : ''}
            </div>
            <div class="body">
              <strong>${esc(p.nick)}</strong>
              <span class="muted">${esc(p.tipo)}, ${esc(p.eta)}, ${esc(p.citta)}</span>
              <span style="color:var(--text-2)">Cerca: ${esc(p.cerca)}</span>
              <div class="row">
                <a class="btn btn-primary" style="flex:1" href="messaggi.html">Scrivi</a>
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
            <span class="ad-avatar">${esc(c.ini)}</span>
            <span class="conv-text"><span style="display:flex;justify-content:space-between;gap:8px"><strong>${esc(c.nome)}</strong><span class="muted" style="font-size:13px">${esc(c.ora)}</span></span>
            <span class="preview">${last.mine ? 'Tu: ' : ''}${esc(last.testo)}</span></span>
            ${c.nuovi && i !== sel ? `<span class="unread">${c.nuovi}</span>` : ''}
          </button>`;
        }).join('');
      };
      const renderThread = () => {
        const c = convs[sel];
        $('#thread-ini').textContent = c.ini;
        $('#thread-name').textContent = c.nome;
        $('#thread-sub').textContent = c.sotto;
        $('#thread-link').href = c.link; $('#thread-link').textContent = c.linkLabel;
        $('#thread-msgs').innerHTML = `<p class="system-note">I messaggi sono visibili solo a voi due.</p>` + c.msgs.map((m) => `
          <div class="msg ${m.mine ? 'mine' : ''}"><div class="bubble">${esc(m.testo)}</div><time>${esc(m.ora)}</time></div>`).join('');
        const body = $('#thread-msgs'); body.scrollTop = body.scrollHeight;
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
        $('#pub-preview').innerHTML = adCard(a, { preview: true });
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
        $('#pub-done').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      });
      showSource(); update();
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
        const bar = $('#cartbar');
        if (bar) { bar.hidden = !n; $('#cartbar-n').textContent = `Carrello, ${n} ${n === 1 ? 'articolo' : 'articoli'}`; $('#cartbar-tot').textContent = eur(tot * 0.9); }
      };
      const renderList = (cat) => {
        const list = cat === 'Tutti' ? S.prodotti : S.prodotti.filter((p) => p.cat === cat);
        $('#products').innerHTML = list.map((p) => `
          <article class="card product">
            <div class="product-visual" data-cat="${esc(p.cat)}">${icon(p.cat)}</div>
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
        if (inc) { cart.set(inc.dataset.inc, (cart.get(inc.dataset.inc) || 0) + 1); renderCart(); }
        if (dec) { const q = (cart.get(dec.dataset.dec) || 0) - 1; q > 0 ? cart.set(dec.dataset.dec, q) : cart.delete(dec.dataset.dec); renderCart(); }
      });
      $('#cart-checkout').addEventListener('click', () => { $('#cart-done').hidden = false; });
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
            <button class="btn btn-primary" type="button" data-buy="${o.id}">${o.prezzo === 0 ? 'Riserva' : 'Acquista'}</button>
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
        return `<svg viewBox="0 0 ${n * cell} ${n * cell}" width="168" height="168" role="img" aria-label="Codice QR del coupon"><rect width="100%" height="100%" fill="#fff"/>${r}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
      }
    },

    /* ---------- LUOGHI ---------- */
    luoghi() {
      const render = (cat) => {
        const items = cat === 'Tutti' ? D.luoghi : D.luoghi.filter((p) => p.cat === cat);
        $('#places').innerHTML = items.map((p) => `
          <a class="card place" href="${p.link || 'scheda.html'}">
            <div class="photo"><span class="photo-label">[FOTO]</span>${p.offerta ? `<span class="badge badge-grad">${esc(p.offerta)}</span>` : ''}</div>
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
