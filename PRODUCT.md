# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Recruiters and hiring managers evaluating Abhikrishna for full-stack developer roles. They arrive to quickly gauge skills, projects, and craft, then decide whether to contact him. Success = a recruiter understands his skills and projects and reaches out via email, LinkedIn, or GitHub.

## Product Purpose

Personal skill-showcase portfolio for Abhikrishna, a full-stack developer. It exists to demonstrate skills and selected projects with a level of craft that itself signals engineering depth, and to convert that read into contact.

## Positioning

The portfolio is itself the demonstration of craft. Rather than a conventional hero card, it presents the work in a deliberately distinctive visual world that proves frontend, animation, and system-thinking ability — the claim "from the database to the pixel" made visible in the experience itself.

## Operating Context

Single-page site: Home → Skills → Portfolio → About → Résumé → Contact. Résumé is scroll-only — deliberately absent from the navbar so it stays at 5 items and the scroll-spy is unchanged. Fixed bottom navbar with scroll progress. Preloader, custom cursor, smooth scroll, magnetic buttons, animated counters, marquee strips. Contact = copy-to-clipboard email plus LinkedIn/GitHub/mail links. Primarily viewed on desktop, mobile-aware.

## Capabilities and Constraints

- Stack: React 18, Vite 5, Tailwind CSS 3, Lucide icons. Three.js, React Three Fiber and postprocessing were removed on 2026-10-04 — nothing imported them and the build output was byte-identical afterwards. `darkMode: 'class'` remains set in `tailwind.config.js` but is unused: zero `dark:` variants and zero `.dark` selectors exist. Light is the only theme.
- Static build deployed on Vercel at https://abhikrishna-portfolio.vercel.app/.
- Reduced-motion support: global `prefers-reduced-motion` reduction plus a `useReducedMotion` hook.
- Projects (3), each with a dossier in place of the old Problem/Solution block:
  - EduSphere — Django monolith (server-rendered templates), PostgreSQL/SQLite, Cloudinary, WhiteNoise; live on Vercel at student-management-eight-rho.vercel.app.
  - Sprint.X — full-stack storefront: React 19 + Vite + Material UI + Tailwind over a Django REST Framework API (4 apps, 16 endpoints) with PostgreSQL, JWT auth, admin console and an analytics endpoint. 14 client routes. No live deployment, so it renders no call-to-action.
  - Skyrict — FastAPI/Python multi-tenant ERP with Next.js, PostgreSQL RLS, Redis, JWT RS256, MFA, Docker; live at skyrict.in.
- Dossier content is written from each project's source code. Where the old card copy disagreed with the code, the code won and the claims were corrected or dropped. Corrections so far: EduSphere was labelled "React + DRF" but is a Django monolith; Sprint.X claimed "40+ products" (there are 14) and a "three-step checkout" (checkout is a single-page form, not a wizard).
- Source-of-truth warning: `D:\Program Files\track\Ecommerce\TrackField` is a DIFFERENT, non-functional project — it does not boot, has no backend, and is not the repo the portfolio links to. Sprint.X is `github.com/abhikrishna-a/Ecommerce_online` (Backend/ + Frontend/). Never write Sprint.X copy from TrackField.
- Self-reported stats "20+ Projects" and "100+ Problems Solved" are confirmed. The former "10+ Hours Coding" stat is replaced by a goal-themed card (decision: not a counted number).
- README's claimed dark/light theme toggle never existed; it was removed from the README on 2026-10-04. Light is the single theme.
- `portfolio.image` is declared on all three projects and read nowhere — the grid card renders no image, only a watermark of the project's first word. Either the grid should show thumbnails or the field should be removed.
- The six project PNGs were replaced with lossless WebP on 2026-10-04 (1.80 MB → 0.92 MB, pixel-identical). The original PNGs are still in `public/` and still copied into `dist/`, referenced by nothing.

## Brand Commitments

- Name presented as "Abhikrishna"; GitHub handle abhikrishna-a, LinkedIn abhikrishna22, email abhikrishna616@gmail.com (primary contact).
- Availability claims: open to opportunities, available for freelance (per running badges).
- Palette (CSS custom properties in `src/index.css`, authoritative — the values below are the current ones): background `#f4f0e4` cream paper, foreground `#1b2333` ink navy, primary `#2b4f9b` ink blue, primary-dim `#1e3a75`, muted `#696b62`, card `rgba(255,252,242,0.7)`, border `rgba(27,35,51,0.16)`, amber `#b33a2c` brick red. This is a light theme.
- Fonts: Spectral (sans/body), Archivo (display), JetBrains Mono (mono). Requested weights: Spectral 400/500/600, Archivo 700/900, JetBrains Mono 400/500/700.
- Voice: technical, confident, field-logbook wording ("Signal Active", "SPEC 01", ruled-margin notes). The earlier space/HUD motif is gone — the current visual identity is the engineering field logbook. Name and contact facts above remain binding.

## Evidence on Hand

- Three projects with dossiers, tags, and links in /public: EduSphere (edusphere.webp cover, edusphere-1/-2.webp plates, live at student-management-eight-rho.vercel.app), Sprint.X (Sprint.X.webp cover, SprintX1/2.webp plates), Skyrict (skyrict.webp, live at skyrict.in).
- Resume PDF published at public/abhikrishna-resume.pdf, served from the Résumé section with the download attribute preserving the filename `Abhikrishna(Full Stack developer).pdf`. Source of truth: the PDF, not any LaTeX draft.
- EduSphere's landing-page marketing figures (200+ courses, 5k+ students, 98% success, 50+ instructors) are placeholders and must never appear on the site.
- No testimonials, case studies, or press in the repo — future work must not fabricate these.
- Confirmed stat claims: "20+ Projects", "100+ Problems Solved".

## Product Principles

1. Show, don't tell: the site itself is proof of craft — engineering depth should be visible in every section.
2. Hire-readiness first: recruiters must find skills, projects, and contact within one glance/scroll.
3. Performance and accessibility are part of the craft: reduced-motion support, fast loads, semantic markup.
4. Honest evidence: only real projects, links, and claims; placeholders get corrected before launch.
5. Distinct identity over template safety: the look must be memorable, not a category default.

## Accessibility & Inclusion

- prefers-reduced-motion respected globally (transitions, animations and `scroll-behavior`) and via the `useReducedMotion` hook in `src/components/effects/`.
- Focus-visible rings on interactive elements; custom cursor only mounts under `(hover:hover) and (pointer:fine)`.
- Every hover-reveal also has a `:active` and `:focus-visible` equivalent, so no effect is reachable by pointer alone.
- Nav links and all 15 interactive targets clear 44x44 from 320px to 1280px.
- Measured contrast: `--muted` on background 4.75:1, on card 5.11:1. Lighthouse mobile a11y 100, desktop 100.
- No additional specific user needs confirmed.

## Unverified

- Real-device INP. Lab runs report TBT 0ms on both presets, but INP needs field data. Not measurable without adding `web-vitals`.
- Coarse-pointer behaviour. `Emulation.setEmulatedMedia` in headless Chrome ignores the `hover` and `pointer` features, so `(hover:none)` paths could not be exercised here. Needs a real phone.
- Scrollbar-width compensation on modal open. Headless shell has no classic scrollbar (`innerWidth - clientWidth === 0`), so the `if (gap > 0)` branch correctly no-op'd but was never exercised.
