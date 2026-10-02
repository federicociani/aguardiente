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
| `--grad` | `#7B2FF7 → #D61E52` | Bottoni primari, stati attivi |
| `--grad-deep` | `#4E1A9E → #9E1238` | Card in evidenza |

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

## Accessibilità

- Target touch di almeno 44px
- Focus visibile (`:focus-visible`)
- Interruttori con `role="switch"` e `aria-checked`; filtri con `aria-pressed`
- Animazione del logo disattivata con `prefers-reduced-motion`
