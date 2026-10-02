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

## Bottoni e form

- Bottoni, pill di filtro e tab: Inter 600, `.875rem`, maiuscolo, `letter-spacing: .06em` (token `--btn-size`, `--btn-tracking`). `.btn-lg` cambia solo altezza e padding, non la dimensione del testo.
- Input, select e relative label: Inter.

## Componenti principali

`.btn` (`-primary`, `-ghost`, `-dark`, `-lg`, `-block`, `-icon`), `.card`, `.card-deep`, `.badge`, `.chip`, `.pill`, `.switch`, `.tabs`, `.field`, `.check`, `.photo`.

## Accessibilità

- Target touch di almeno 44px
- Focus visibile (`:focus-visible`)
- Interruttori con `role="switch"` e `aria-checked`; filtri con `aria-pressed`
- Animazione del logo disattivata con `prefers-reduced-motion`
