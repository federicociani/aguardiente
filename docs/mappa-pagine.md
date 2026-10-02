# Mappa delle pagine

## Lato utenti

| Pagina | Scopo | Porta a |
|---|---|---|
| `index.html` | Home pubblica: ricerca rapida, categorie, online adesso, ultimi annunci, regioni, "Come funziona" con switch Privati / Business | annunci, cerca, iscrizione, business |
| `iscrizione.html` | Registrazione con switch Utente / Azienda | annunci (utente), dashboard (azienda) |
| `annunci.html` | Bacheca filtrabile per categoria; ogni annuncio può avere una foto di lancio diversa dalla foto profilo | messaggi, luoghi (banner sponsorizzato) |
| `pubblica.html` | Pubblicazione annuncio: testo, foto di lancio (caricata, scelta tra atmosfere o nessuna), visibilità della foto, anteprima dal vivo | annunci |
| `cerca.html` | Griglia profili con filtri tipo, online, verificati | messaggi |
| `messaggi.html` | Lista conversazioni + chat + pannello sicurezza | annunci, scheda |
| `profilo.html` | Profilo personale, foto con visibilità, privacy, Premium | annunci, luoghi |

## Lato aziende

| Pagina | Scopo | Porta a |
|---|---|---|
| `business.html` | Home Aguardiente Business: categorie, come funziona, come guadagni, piani | iscrizione?tipo=azienda, dashboard, scheda |
| `dashboard.html` | Area azienda: checklist di verifica, statistiche, piani | scheda |
| `luoghi.html` | Elenco attività come lo vedono gli utenti | scheda |
| `scheda.html` | Scheda di una singola attività, offerta, richiesta disponibilità | prenotazione, messaggi |
| `prenotazione.html` | Richiesta inviata + extra da trovare in camera (upselling), anche forniti da negozi partner | messaggi |
| `shop.html` | Shop online di un'attività: catalogo per categoria, carrello, sconto iscritti, spedizione discreta | messaggi |

## Punti di contatto tra i due lati

- Footer della home utenti → `business.html`
- Banner sponsorizzato in `annunci.html` → `luoghi.html`
- Iscrizione unica con switch; `iscrizione.html?tipo=azienda` apre direttamente il form aziende
