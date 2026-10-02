# Mappa delle pagine

## Lato utenti

| Pagina | Scopo | Porta a |
|---|---|---|
| `index.html` | Home pubblica: ricerca rapida, categorie, online ora, tab Annunci/Eventi (eventi dei locali con prevendita del biglietto), regioni, "Come funziona" con switch Privati / Business | annunci, cerca, iscrizione, business |
| `iscrizione.html` | Registrazione con switch Utente / Azienda | annunci (utente), dashboard (azienda) |
| `annunci.html` | Bacheca filtrabile per categoria; ogni annuncio può avere una foto di lancio diversa dalla foto profilo | messaggi, luoghi (banner sponsorizzato) |
| `annuncio.html?id=…` | Annuncio singolo: foto di lancio, testo, autore, Scrivi/Salva/Segnala, annunci simili | messaggi, annunci |
| `pubblica.html` | Pubblicazione annuncio: testo, foto di lancio (caricata, scelta tra atmosfere o nessuna), visibilità della foto, anteprima dal vivo | annunci |
| `cerca.html` | Griglia profili con filtri tipo, online, verificati | messaggi |
| `messaggi.html` | Lista conversazioni + chat + pannello sicurezza | annuncio ("Vedi annuncio"), scheda |
| `profilo.html` | Profilo personale, foto con visibilità, privacy, Premium | annunci, luoghi |

## Lato aziende

| Pagina | Scopo | Porta a |
|---|---|---|
| `business.html` | Home Aguardiente Business: categorie, come funziona, sezione per i locali (profilo, coupon, servizi), eventi in prevendita, come guadagni, piani | iscrizione?tipo=azienda, dashboard, scheda |
| `dashboard.html` | Area azienda: checklist di verifica, statistiche, eventi in prevendita, coupon e servizi, extra, shop, piani | scheda |
| `locale.html` | Profilo di un locale (Club Ventaglio): serate, regole, coupon e servizi acquistabili con QR da mostrare all'ingresso | messaggi |
| `luoghi.html` | Elenco attività come lo vedono gli utenti | scheda |
| `scheda.html` | Scheda di una singola attività, offerta, richiesta disponibilità | prenotazione, messaggi |
| `prenotazione.html` | Richiesta inviata + extra da trovare in camera (upselling), anche forniti da negozi partner | messaggi |
| `shop.html` | Shop online di un'attività: catalogo per categoria, carrello, sconto iscritti, spedizione discreta | messaggi |

## Punti di contatto tra i due lati

- Footer della home utenti → `business.html`
- Banner sponsorizzato in `annunci.html` → `luoghi.html`
- Iscrizione unica con switch; `iscrizione.html?tipo=azienda` apre direttamente il form aziende
