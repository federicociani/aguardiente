# Design

## Palette

| Token | Valore | Uso |
|---|---|---|
| `--bg` | `#14060A` | Fondo nero-sangue |
| `--surface` | `#200A11` | Card, pannelli |
| `--surface-2` | `#2C0E18` | Segnaposto foto, hover |
| `--line` | `#3F1626` | Bordi |
| `--line-2` | `#6B2A42` | Bordi bottoni secondari |
| `--text` | `#F7EDF0` | Testo principale |
| `--text-2` | `#D6BEC6` | Testo secondario |
| `--muted` | `#BC9DA8` | Didascalie |
| `--accent` | `#FF6B8F` | Link, icone, etichette |
| `--grad` | `#9E1238 → #770303` | Bottoni primari, stati attivi |
| `--grad-deep` | `#770303 → #9E1238` | Card in evidenza |

Lo sfondo ha due bagliori radiali tenui (rosso scuro in alto a destra, viola a sinistra). Le pagine Business (`body.business`) invertono la posizione dei bagliori per distinguersi.

## Tipografia

- **Bricolage Grotesque** (500, 700) per titoli e logo
- **Inter** (400, 500, 600) per il testo

## CTA (`.btn-primary`)

Fondo quasi nero, bordo sottile e due scie di luce opposte (viola `#6400c9` → lilla `#B57BFF`) che girano lungo il bordo in 3 secondi; al passaggio del mouse il giro accelera e il bagliore aumenta. È un `conic-gradient` sul bordo animato tramite la proprietà registrata `--cta-angle`. Con `prefers-reduced-motion` le scie restano ferme. Colori regolabili da `--cta-fill`, `--cta-ring`, `--cta-glow`, `--cta-tail`.

## Testo

`text-wrap: balance` su tutto il sito (impostato su `body`, che lo eredita a ogni elemento) e ripetuto su titoli, sottotitoli e paragrafi. I browser bilanciano solo blocchi di poche righe: sui testi lunghi l'effetto è nullo.

## Bottoni e form

- Bottoni, pill di filtro e tab: Inter 400, `.875rem`, maiuscolo, `letter-spacing: .06em` (token `--btn-size`, `--btn-tracking`). `.btn-lg` cambia solo altezza e padding, non la dimensione del testo.
- Input, select e relative label: Inter.

## Componenti principali

`.btn` (`-primary`, `-ghost`, `-dark`, `-lg`, `-block`, `-icon`), `.card`, `.card-deep`, `.badge`, `.chip`, `.pill`, `.switch`, `.tabs`, `.field`, `.check`, `.photo`.

## Sezione "Come funziona" (home)

Switch Privati / Business con indicatore che scorre; per ciascun profilo:
1. righe di etichette che scorrono in direzioni alterne (si fermano al passaggio del mouse) + titolo e dati chiave;
2. demo animata (chat o richiesta) che parte quando entra nello schermo, con "Rivedi l'esempio";
3. cosa puoi / non puoi fare;
4. frase interattiva: i chip accendono e spengono parti del testo e cambia il suggerimento;
5. FAQ ad accordion.

I blocchi compaiono allo scroll (`.reveal`). Con `prefers-reduced-motion` tutte le animazioni sono disattivate.

## Navigazione

Tutti i menu di navigazione usano solo icone, mai parole visibili: stesso stile (24px, tratto 1,8), contorno a riposo e **piena** quando la pagina o la sezione è quella attiva (`aria-current="page"` per le pagine, `aria-current="location"` per le sezioni della stessa pagina, aggiornato allo scroll). Ogni icona ha `aria-label`; su desktop il nome compare come tooltip al passaggio del mouse o con Tab.

- Utente: Annunci, Cerca, Pubblica, Storie, Vetrina, Webcam, Messaggi (+ avatar profilo)
- Home pubblica: Annunci, Cerca profili, Storie, Vetrina, Webcam, Come funziona (icona info), Per le aziende (+ CTA Entra)
- Business: Come funziona, Per i locali, Eventi, Come guadagni, Piani, Area aziende (+ CTA Registra l’attività su desktop)
- Area aziende: rail verticale su desktop, riga che scorre su mobile

## Foto di esempio

Ogni avatar, profilo, locale e galleria usa una foto di esempio (Unsplash, mappa `D.avatar` in `data.js` per nickname e locali; campo `foto`/`img` per profili, luoghi, annunci, storie, prodotti). Le iniziali restano solo come ripiego se manca la foto.

## Sezioni riservate

Vetrina, Webcam e Storie sono raggiungibili anche da non iscritti (icone nel menu della home e anteprime sfocate nella sezione "Vetrina e dirette"), ma la pagina si apre sfocata sotto un pannello "Entra per vedere questa sezione". Nel prototipo l'accesso è un flag nel browser (`agu.entrato`) che si attiva iscrivendosi, accedendo o con "Ho già un account (prototipo)".

## Mobile (≤ 720px)

- **Tab bar in basso, solo icone**, per utente loggato, home pubblica e Business; in alto restano logo e avatar o CTA.
- **Ricerca rapida (home)**: su mobile la card sparisce e diventa una barra fissa in basso con il riepilogo della ricerca; toccandola si apre un pannello dal basso (si chiude con la X, toccando fuori, con Esc o trascinando giù la maniglia) con scelte a pillola, regioni scorrevoli, doppio cursore per l'età e interruttore online. "Mostra profili" porta a Cerca con i filtri già impostati.
- **Pillole e chip** (filtri, categorie, servizi, interessi, chip interattivi): una sola riga che scorre in orizzontale, come le card; anche coupon e servizi di un locale scorrono come card.
- **Messaggi**: lista o conversazione, con tasto indietro; il campo di scrittura resta agganciato sopra la tab bar.
- **Cerca**: i filtri si aprono con il tasto "Filtri"; profili su due colonne.
- **Scheda struttura**: barra fissa in basso con prezzo e "Richiedi"; il modulo di prenotazione si apre dal basso (chiusura con X, tocco fuori, Esc o trascinando giù).
- **Shop**: prodotti su due colonne; il carrello è un'icona nella navbar (piena con badge quando contiene articoli) che apre un pannello dal basso, trascinabile per chiuderlo. Su desktop lo stesso pannello si apre da destra.
- **Dashboard**: il menu laterale diventa una riga che scorre sotto il logo.
- Margini di sicurezza per notch e barra home (`env(safe-area-inset-*)`, `viewport-fit=cover`).

## Accessibilità

- Target touch di almeno 44px
- Focus visibile (`:focus-visible`)
- Interruttori con `role="switch"` e `aria-checked`; filtri con `aria-pressed`
- Bagliore del logo disattivato con `prefers-reduced-motion`
