/* ==========================================================
   Aguardiente — comportamenti delle pagine
   Ogni pagina dichiara <body data-page="..."> e qui
   parte solo il modulo che le serve.
   ========================================================== */
(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const D = window.DATA || {};

  const ICON_CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  const ICON_HEART = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF6B8F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
  const ICON_PIN = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>';

  /* ---------- Logo: fiammella animata inserita in ogni .logo ---------- */
  const FLAME = `
    <svg class="flame" width="22" height="30" viewBox="0 0 24 32" aria-hidden="true">
      <defs><linearGradient id="flg" x1="0" y1="1" x2="0.3" y2="0">
        <stop offset="0" stop-color="#7B2FF7"/><stop offset="0.6" stop-color="#D61E52"/><stop offset="1" stop-color="#FF6B8F"/>
      </linearGradient></defs>
      <path d="M12 1C13.2 7 19.5 10.5 19.5 19.5a7.5 7.5 0 0 1-15 0c0-4.2 2.2-6.6 3.8-8.6 0 3 1.4 4.6 3 5.2C11 12 9.2 7 12 1z" fill="url(#flg)"/>
      <path class="flame-core" d="M12 15.5c1.6 2 3.1 3.3 3.1 5.6a3.1 3.1 0 0 1-6.2 0c0-1.9 1.3-3.2 3.1-5.6z" fill="#FFC9D6"/>
    </svg>`;
  $$('.logo').forEach((el) => el.insertAdjacentHTML('afterbegin', FLAME));

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

  /* Interruttori role="switch" generici */
  $$('[role="switch"]').forEach((sw) => sw.addEventListener('click', () => {
    sw.setAttribute('aria-checked', sw.getAttribute('aria-checked') !== 'true');
    sw.dispatchEvent(new Event('change', { bubbles: true }));
  }));

  const pages = {

    /* ---------- HOME ---------- */
    home() {
      $('#online-strip').innerHTML = D.profili.filter((p) => p.online).map((p) => `
        <a class="online-item" href="cerca.html">
          <span class="photo">${esc(p.ini)}<span class="online-dot" aria-label="Online"></span></span>
          <span><strong>${esc(p.nick)}</strong><br><span class="muted">${esc(p.tipo)}, ${esc(p.citta)}</span></span>
        </a>`).join('');
      $('#latest-ads').innerHTML = D.annunci.slice(0, 3).map((a) => `
        <a class="card ad" href="annunci.html" style="color:inherit;text-decoration:none">
          <span class="cat-label">${esc(a.cat)}, ${esc(a.zona)}</span>
          <h3>${esc(a.titolo)}</h3>
          <p class="muted">${esc(a.testo)}</p>
        </a>`).join('');
      $('#regions').innerHTML = D.regioni.map((r) => `<a href="annunci.html">${esc(r)}</a>`).join('');
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
        list.innerHTML = items.length ? items.map((a) => `
          <article class="card ad">
            <div class="ad-head">
              <div class="ad-avatar">${esc(a.ini)}</div>
              <div class="ad-who"><strong>${esc(a.nick)}</strong><span class="muted">${esc(a.tipo)}, ${esc(a.eta)}, ${esc(a.zona)}</span></div>
              ${a.ver ? `<span class="badge">${ICON_CHECK}Verificato</span>` : ''}
            </div>
            <span class="cat-label">${esc(a.cat)}</span>
            <h3>${esc(a.titolo)}</h3>
            <p class="muted">${esc(a.testo)}</p>
            <div class="ad-foot"><span class="muted">${esc(a.quando)}</span><a class="btn btn-ghost" href="messaggi.html">Scrivi</a></div>
          </article>`).join('') : '<p class="empty">Nessun annuncio in questa categoria. Pubblica il primo.</p>';
      };
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
      $('#filters').addEventListener('change', render);
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
      });
      $('#composer').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = $('#composer input'); const t = input.value.trim(); if (!t) return;
        const d = new Date(); const ora = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
        convs[sel].msgs.push({ mine: true, testo: t, ora }); convs[sel].ora = ora;
        input.value = ''; renderList(); renderThread();
      });
      renderList(); renderThread();
    },

    /* ---------- LUOGHI ---------- */
    luoghi() {
      const render = (cat) => {
        const items = cat === 'Tutti' ? D.luoghi : D.luoghi.filter((p) => p.cat === cat);
        $('#places').innerHTML = items.map((p) => `
          <a class="card place" href="scheda.html">
            <div class="photo"><span class="photo-label">[FOTO]</span>${p.offerta ? `<span class="badge badge-grad">${esc(p.offerta)}</span>` : ''}</div>
            <div class="body">
              <div style="display:flex;justify-content:space-between;gap:12px"><span class="muted" style="font-size:14px">${esc(p.cat)}</span><span class="badge">${ICON_CHECK}Verificata</span></div>
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

  const page = document.body.dataset.page;
  if (pages[page]) pages[page]();
})();
