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
│  ├─ annuncio.html         annuncio singolo (?id=…)
│  ├─ pubblica.html         pubblica un annuncio con foto di lancio
│  ├─ vetrina.html          vetrina dei creator (foto e video gratis o a pagamento)
│  ├─ webcam.html           dirette webcam
│  ├─ live.html             stanza in diretta (?id=…)
│  ├─ storie.html           storie della community
│  ├─ storia.html           storia singola (?id=…)
│  ├─ cerca.html            ricerca profili
│  ├─ messaggi.html         chat
│  ├─ profilo.html          profilo utente
│  ├─ luoghi.html           locali e strutture (vista utente)
│  ├─ scheda.html           scheda azienda (vista utente)
│  ├─ prenotazione.html     richiesta inviata + extra in camera (upselling)
│  ├─ shop.html             shop online di un'attività
│  ├─ locale.html           profilo locale: serate, coupon e servizi con QR
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
- **Logo**: solo testo, con un bagliore che passa ogni 6 secondi (`@keyframes logo-glow` in `style.css`); fermo con `prefers-reduced-motion`.

## Cache

I file in `site/assets/` sono richiamati con `?v=AAAAMMGGHHMM` per forzare il browser a scaricare la versione nuova dopo ogni rilascio. Quando modifichi CSS o JS aggiorna il numero in tutte le pagine:

```bash
V=$(date +%Y%m%d%H%M); sed -i -E "s#assets/(style\.css|data\.js|app\.js)(\?v=[0-9]+)?\"#assets/\1?v=$V\"#g" site/*.html
```

## Foto

Le foto dei profili in "Online ora", le foto di lancio di esempio e le foto prodotto dello shop sono di [Unsplash](https://unsplash.com/license) (uso gratuito), caricate direttamente da `images.unsplash.com` e accreditate sotto la sezione. Sono silhouette senza volti riconoscibili: le persone ritratte non sono iscritte e non devono sembrarlo. Gli ID e gli autori sono in `site/assets/data.js` (campo `foto`).

## Foto di lancio degli annunci

Ogni annuncio può avere una **foto di lancio** indipendente dalla foto profilo: l'avatar accanto al nickname resta quello del profilo, la foto in testa alla card è dell'annuncio. In `pubblica.html` l'utente può caricarla, sceglierla tra alcune atmosfere o pubblicare senza foto, e decidere chi la vede:

| Valore `coverVis` | Comportamento |
|---|---|
| `tutti` | visibile a tutti gli iscritti |
| `verificati` | visibile solo ai profili verificati (etichetta sulla foto) |
| `sfocata` | sfocata fino a quando l'autore accetta il contatto |

Nei dati (`data.js`) la foto è nel campo `cover` dell'annuncio; nel prototipo il caricamento resta nel browser (anteprima con `FileReader`), niente viene inviato.

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
