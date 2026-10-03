# Portfolio

A single-page portfolio for a full-stack developer, built with React, Vite and
Tailwind CSS. The visual language is an engineering field logbook: cream paper,
ink navy, rubber stamps, ruled margins and punched holes.

## Features

- Scroll-triggered reveals and a collapsing hero
- Fixed bottom nav with scroll-spy and scroll progress
- Project dossier modal, keyboard accessible (Esc to close, focus trapped)
- Custom cursor, gated to fine pointers only
- Magnetic buttons, animated counters, marquee strips
- Copy-to-clipboard contact email
- Responsive from 320px up, with no horizontally scrolling at any width
- Full `prefers-reduced-motion` support

## Getting Started

Requires Node 18+.

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 18
- Vite 5
- Tailwind CSS 3
- Lucide React (icons)
- Plain CSS for the effects utilities Tailwind does not cover

Three.js, React Three Fiber and postprocessing were once listed as
dependencies. Nothing imported them and no `<canvas>` exists in the page, so
they were removed in `a350358` — the build output was byte-identical before and
after.

There is no dark-mode toggle. `darkMode: 'class'` is still set in
`tailwind.config.js`, but zero `dark:` variants and zero `.dark` selectors
exist, so it has no effect. The single theme is light. See `PRODUCT.md` for the
palette and type tokens.

## Documentation

`PRODUCT.md` is the source of truth for palette, fonts, voice and project
claims. `DESIGN.md` covers the visual system.