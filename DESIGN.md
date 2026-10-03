# DESIGN.md — Abhikrishna Portfolio

Direction seed: `3fc37d6d` (stamped in `index.html` as an HTML comment — the durable, build-emitted contract).

## World

The site is an **Engineer's Field Logbook** — the artifact itself is the portfolio. Aged ledger paper with a faint engineering grid, red margin rule, punched holes. Ink-blue primary, stamp-red corrections. The point is *measurement and record*, not persona decoration: the log refuses the dark name-hero rut and the resume-as-site, proving craft from the data to the pixel.

A recruiter opens the log and reads skills, builds, and contact like signed measured entries — the ink is dry, the verdict is their own, contact is one glance away.

## Tokens

| Token | Value | Purpose |
|---|---|---|
| `--background` | `#f4f0e4` | Ledger paper (warm, not sterile) |
| `--foreground` | `#1b2333` | Ink-black text |
| `--primary` | `#2b4f9b` | Ink-blue actions/emphasis |
| `--primary-dim` | `#1e3a75` | Secondary blue accents |
| `--secondary` | `rgba(234, 227, 210, 0.5)` | Ruled-paper tint (alternate bands) |
| `--card` | `rgba(255, 252, 242, 0.7)` | Card face (near-white, translucent) |
| `--muted` | `#696b62` | Grayed annotations |
| `--amber` | `#b33a2c` | Corrections, urgency, "signed" |
| `--border` | `rgba(27, 35, 51, 0.16)` | Hairlines and rules |
| `--primary-hair` | `rgba(43, 79, 155, 0.2)` | Tinted hairlines |

Contrast measured against `--background` (WCAG 2.x relative luminance):

| Pair | Ratio | Grade |
|---|---|---|
| `--foreground` | 13.81:1 | AAA |
| `--primary-dim` | 9.61:1 | AAA |
| `--primary` | 6.84:1 | AA |
| `--amber` | 5.18:1 | AA |
| `--muted` | 4.75:1 | AA |
| `--muted` on `--card` (composited `#fcf8ee`) | 5.10:1 | AA |

`--muted` was `#6d6f66` until it failed AA at 4.05:1 and was corrected to
`#696b62`. Every value above is read from `src/index.css`, which is
authoritative; this table is a mirror of it, not a second source.

### Type

- **Body — Spectral** (serif): the "written entry" voice; journal narration for paragraphs. Weights 400/500/600.
- **Display — Archivo** (900 weight, tight tracking): heavy stamped uppercase ledger heads. Weights 700/900.
- **Data — JetBrains Mono**: measurements, labels, stamps, coordinates, timestamps. Weights 400/500/700.

Loaded from Google Fonts. The stylesheet is requested with
`rel=preload as=style` plus a `media="print"` swap rather than a
render-blocking `<link>`, and a `<noscript>` copy carries the stylesheet for
users without JS. Only five files actually load: Archivo variable, JetBrains
Mono, and Spectral at three weights. There is no italic text on the site, so no
italic face is requested.

### Corners / materials

- Cards: `3px` radius (pinned paper), 1px ink border, faint tape strip on section heads, `card-shine` sheen on the contact card.
- Rules: double-ruled `ledger-head` underlines, red margin rule on the paper, punched holes, corner marks, rubber-stamp shapes (`.stamp`, `.stamp-red`, `.stamp-filled`).

## Layout rules

- Ruled engineering grid on the page ground only — the grid is the logbook's *measurement surface* (material, not decoration).
- Massive section spacing (`py-28 md:py-36`), air around ledger heads.
- Two-column projects at `lg`, cards have a watermark number echo.
- Vertical `margin-note` on the hero pointing inward to the builds.

## Motion

- Curve: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-quint) everywhere; no bounce/elastic.
- Underlines animate with `scaleX` (transform only — no layout thrash).
- Reveal: translate + opacity + slight scale via IntersectionObserver (`Reveal`, `Stagger`).
- Preloader: stamped "OPENING THE LOG…" with a sheet shutter, ~1.1s, then entrance.
- `prefers-reduced-motion`: everything snaps to a 0.01s fade (component-level guard).
- Use of transforms only; no `width`/`height` animations.

## Components

- **Navbar** — floating mono/paper chip, links are `link-underline` (scaleX ink rule).
- **Hero** — owner header row, stamped name with an `aria-hidden` outline echo (the double-print), availability blink, ruled measurements row (20+ projects / 100+ problems / 1 goal), two stamped actions, margin note.
- **Marquee** — ruled ticker of engineering disciplines.
- **SkillsStack** — ledger table: rows with index, name, tags, proficiency rule bars (measurement, not bars).
- **PortfolioGrid** — case cards with index/tech/role stamps, watermark number, corner marks.
- **ProjectShowcase** — opening a case mounts a full log-sheet document (facts table + screens + flow), single page-level H1 preserved.
- **Footer** — contact log: CTA head, magnetic copy-email card, signed-and-dated row.

## Accessibility

- One H1; section heads are H2, card titles H3 (verified by audit).
- Every decorative echo is `aria-hidden`; images carry `alt`; buttons have accessible names.
- Copy-card is `role="button"` with `tabIndex` + Enter/Space handler.
- All interactive hit targets ≥ 40px; focus styles preserved from system default.

## Verification

- Mechanical detector (impeccable): clean — the sole remaining advisory is the ruled grid, kept by design as the logbook's material.
- Headless audit at 1440×900 and 390×844: 0 console errors, 0 horizontal overflow, 0 broken anchors, 0 duplicate IDs, heading tree H1→H2→H3 valid.
- Production build passes; direction contract survives in `dist/index.html` (HTML comment, not templating frontmatter).
