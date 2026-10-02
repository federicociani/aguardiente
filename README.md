# Aguardiente

Prototipo navigabile di una piattaforma di annunci per adulti con due anime separate:

- **Utenti** — annunci per categoria e regione, ricerca profili, chat, profilo con controlli di privacy (sul modello di annunci69.it).
- **Aziende (Aguardiente Business)** — attività verificate (boutique, strutture ricettive, club, spazi privati) che offrono servizi e coupon agli iscritti.

Il prototipo è HTML, CSS e JavaScript puro: nessun framework, nessuna build.

> ⚠️ Servizio riservato ai maggiorenni. Prima di qualsiasi lancio pubblico leggere [`docs/note-legali.md`](docs/note-legali.md).

## Avvio in locale

```bash
git clone https://github.com/<utente>/aguardiente.git
cd aguardiente
```

Poi apri `site/index.html` nel browser. Funziona anche senza server, ma per avere URL puliti puoi usare:

```bash
npx serve site
# oppure
python3 -m http.server --directory site 8080
```

## Struttura

```
.
├─ site/                    sito statico (cartella pubblicata)
│  ├─ index.html            home utenti
│  ├─ iscrizione.html       iscrizione Utente / Azienda (?tipo=azienda)
│  ├─ annunci.html          bacheca annunci con filtri per categoria
│  ├─ cerca.html            ricerca profili
│  ├─ messaggi.html         chat
│  ├─ profilo.html          profilo utente
│  ├─ luoghi.html           locali e strutture (vista utente)
│  ├─ scheda.html           scheda azienda (vista utente)
│  ├─ business.html         home Aguardiente Business
│  ├─ dashboard.html        area azienda
│  └─ assets/
│     ├─ style.css          design token in :root + componenti
│     ├─ app.js             un modulo per pagina (body[data-page])
│     └─ data.js            dati di esempio
├─ docs/
│  ├─ mappa-pagine.md       flussi e collegamenti tra pagine
│  ├─ design.md             palette, tipografia, componenti
│  ├─ note-legali.md        punti da verificare con un legale
│  └─ roadmap.md            prossimi passi
└─ .github/                 workflow di deploy e template issue
```

## Come è fatto il codice

- **Design token**: colori, gradiente e font sono variabili CSS in cima a `site/assets/style.css`.
- **Pagine**: ogni HTML dichiara `<body data-page="...">`; `app.js` avvia solo il modulo di quella pagina.
- **Dati**: liste di annunci, profili, conversazioni e luoghi vengono da `data.js`, al posto delle future API.
- **Logo**: la fiammella animata viene inserita via JS in ogni elemento `.logo`; l'animazione rispetta `prefers-reduced-motion`.

## Branch e deploy

```
feature/...  →  develop  →  staging  →  main
 (lavoro)       (sviluppo)    (verifica)   (produzione)
```

| Branch | Ruolo | Online |
|---|---|---|
| `develop` | Sviluppo, branch predefinito | — |
| `staging` | Verifica prima del rilascio | https://federicociani.github.io/aguardiente/staging/ |
| `main` | Produzione | https://federicociani.github.io/aguardiente/ |

- Si lavora su `develop` (o su branch `feature/...` che confluiscono lì).
- `develop → staging → main` solo tramite pull request: `main` e `staging` sono protetti (niente push diretti, force push o cancellazioni).
- Il workflow [`.github/workflows/pages.yml`](.github/workflows/pages.yml) pubblica `main` alla radice e `staging` in `/staging/` (con `noindex`) a ogni push su uno dei due branch.

## Stato

Prototipo di interfaccia. Nessun backend, nessun dato reale, nessuna autenticazione. Vedi [`docs/roadmap.md`](docs/roadmap.md).

## Licenza

© Federico Ciani. Tutti i diritti riservati.
