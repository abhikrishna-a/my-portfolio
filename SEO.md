# SEO

Source of truth for the portfolio's search and social metadata, plus the copy
kit for the three profiles it needs to agree with. `PRODUCT.md` remains the
product source of truth; this file covers search, social previews, and entity
consistency.

## Canonical

```
https://abhikrishna-portfolio.vercel.app/
```

Everything below resolves to this host: `index.html` canonical, `og:url`,
`og:image`, `robots.txt` `Sitemap:`, `sitemap.xml` `<loc>`, JSON-LD `url`.
`node scripts/seo-check.mjs` (runs on `npm run build`) fails if they drift.

**History:** `robots.txt` and `sitemap.xml` declared `https://abhikrishna.com/`,
a domain that never resolved. The sitemap was unreachable at its own declared
URL and nothing warned. That is what the check exists to prevent.

## Verified claims

Checked against the repo and `api.github.com/users/abhikrishna-a` on 2026-10-06.

| Claim | Evidence | Verdict |
| --- | --- | --- |
| "20+ Projects" | 3 featured in `PortfolioGrid.jsx`; 15 public GitHub repos | **Unsupported — do not publish.** ~10 distinct after removing 2 forks, the profile README, and 3 portfolio duplicates |
| "100+ Problems Solved" | `leetcode` repo exists, count never taken | **Unverified** — still on the hero; keep it out of meta/SEO copy until someone counts |
| "20+ Projects" hero counter | was `Hero.jsx` L21 | **Fixed 2026-10-06** — hero now reads "3 Featured Projects" |
| 3 featured projects | Skyrict, EduSphere, Sprint.X | Safe |
| EduSphere 200+ courses / 5k students / 98% | `PRODUCT.md` L53 | Placeholders — **never publish** |
| Testimonials, press, case studies | none in repo | **Never fabricate** |

Safe phrasing: *selected projects*, *3 featured builds*, *15 public repositories*.

## Unified identity block

Copy verbatim wherever a profile asks for a title, bio, or headline. Consistency
across surfaces is what lets Google bind them to one entity.

```
Abhikrishna — Full-Stack Developer
React · Django REST · FastAPI · PostgreSQL · Next.js
Building products from the database to the pixel
Kozhikode, Kerala, India
abhikrishna616@gmail.com
https://abhikrishna-portfolio.vercel.app/
```

### Known surface drift (decide and fix manually)

| Field | Site | GitHub | LinkedIn |
| --- | --- | --- | --- |
| Display name | Abhikrishna | Abhikrishna A | ? |
| Title | Full-Stack Developer | Developer Intern at Bridgeon | ? |
| Location | *(absent)* | kozhikode, kerala | ? |
| Employer | *(absent)* | Bridgeon | ? |

Recommendation: keep **Full-Stack Developer** as the headline everywhere
(recruiter-facing), and mention Bridgeon as a current role rather than as the
identity. Add the location — it is the only real local-SEO signal available.

---

## LinkedIn — `linkedin.com/in/abhikrishna22`

**Headline** (limit 220 chars, ~128 used):

```
Full-Stack Developer — React, Django REST, FastAPI & PostgreSQL |
Building products from the database to the pixel | Portfolio ↓ abhikrishna-portfolio.vercel.app
```

**About** (first two lines are all that show before "…see more", so front-load):

```
I build full-stack products end to end — database schema through to the pixel
that bends light.

Currently: Developer Intern at Bridgeon. Based in Kozhikode, Kerala.

STACK
React · Redux Toolkit · Next.js · TypeScript · JavaScript
Django · Django REST Framework · FastAPI
PostgreSQL · Redis · Docker · Cloudinary

SELECTED WORK
• Skyrict — multi-tenant ERP: FastAPI, Next.js, PostgreSQL RLS, Redis, JWT RS256, MFA, Docker → skyrict.in
• Sprint.X — storefront: React 19 + Vite over a DRF API (4 apps, 16 endpoints), JWT auth, admin console → github.com/abhikrishna-a/Ecommerce_online
• EduSphere — Django student-management monolith, PostgreSQL, Cloudinary, WhiteNoise → student-management-eight-rho.vercel.app

15 public repositories on GitHub. The portfolio itself is the proof of craft —
React 18, Vite, Tailwind, with reduced-motion support and a 100 Lighthouse
accessibility score.

Open to full-stack and frontend opportunities. abhikrishna616@gmail.com
```

**Also do:**

- **Featured → Add link** → `https://abhikrishna-portfolio.vercel.app/` (this is the strongest LinkedIn→site backlink you get)
- **Contact info** → portfolio URL + GitHub + email
- **Custom URL**: claim `linkedin.com/in/abhikrishna22` — already good, keep it
- **Skills**: pin React, Django REST Framework, PostgreSQL, JavaScript, Python first — order matters for the recruiter-facing "Highlights"
- Never list a skill you cannot answer a screen question on

## Instagram — `instagram.com/_ab.krishx_/`

Handle deliberately diverges from the brand — that is fine, `sameAs` in the
JSON-LD is what tells Google they are the same person, and it is wired.

**Name field** (searchable, 30 chars): `Abhikrishna`
**Bio**:

```
Full-Stack Developer
React · Django · FastAPI
Building from the database to the pixel 👇
abhikrishna-portfolio.vercel.app
```

**Bio link**: single link — use the portfolio URL. If you later add a
link-in-bio page, the portfolio must still be the first destination.

**Content that earns a follow** (pick, don't force): build-in-progress screen
recordings, the logbook UI details, a shipped-project announcement. This
account is not a ranking factor — treat it as a second search result for your
name, so whatever you post should look like *you* to a recruiter who searched
your name.

## GitHub — `github.com/abhikrishna-a`

**Name:** `Abhikrishna` (drop the trailing "A" — match the site and LinkedIn)
**Bio** (160 char limit):

```
Full-Stack Developer · React, Django REST, FastAPI, PostgreSQL · Building from the database to the pixel → portfolio
```

**Profile repo `abhikrishna-a/abhikrishna-a` README:**

```markdown
### Hi, I'm Abhikrishna — Full-Stack Developer

Building products from the database to the pixel.

**Now:** Developer Intern at Bridgeon · Kozhikode, Kerala

**Stack:** React · Redux Toolkit · Next.js · TypeScript · Django REST Framework · FastAPI · PostgreSQL · Docker

**Selected work**
| | |
|---|---|
| **[Skyrict](https://skyrict.in)** | Multi-tenant ERP — FastAPI, Next.js, PostgreSQL RLS, Redis, JWT RS256, MFA |
| **[Sprint.X](https://github.com/abhikrishna-a/Ecommerce_online)** | React 19 storefront over a DRF API — 4 apps, 16 endpoints, JWT, admin console |
| **[EduSphere](https://student-management-eight-rho.vercel.app)** | Django student-management monolith, PostgreSQL, Cloudinary |

**[Portfolio](https://abhikrishna-portfolio.vercel.app/)** · **[LinkedIn](https://www.linkedin.com/in/abhikrishna22)** · **[Instagram](https://www.instagram.com/_ab.krishx_/)** · abhikrishna616@gmail.com
```

**Repo topics** (Settings → Topics — real crawlable ranking signals):

- `Ecommerce_online` — `react`, `vite`, `django-rest-framework`, `postgresql`, `jwt`, `ecommerce`, `redux`
- `student-management` — `django`, `postgresql`, `student-management`, `cloudinary`, `whitenoise`
- `skyrict` — **it is a fork** (`nkswalih/skyrict`). Do not add topics claiming authorship; it is already covered by the portfolio dossier.
- `my-portfolio` — `react`, `vite`, `tailwindcss`, `portfolio`

**Pinned repos (6):** `Ecommerce_online`, `student-management`, `my-portfolio`,
`Deadcode_Detector`, `IQRAA`, `leetcode`.

**Housekeeping worth doing:** `portfolio`, `React_Portfolio` and `my-portfolio`
are three variants of the same thing. Pin one, unpin the rest — a recruiter
scanning your profile should not see the same project three times.

---

## Cross-link matrix

| From → To | State |
| --- | --- |
| GitHub → Portfolio | ✅ profile "website" field |
| GitHub → LinkedIn | ✅ profile "LinkedIn" field |
| GitHub → Instagram | ❌ add via profile README (above) |
| Portfolio → GitHub | ✅ footer + JSON-LD `sameAs` |
| Portfolio → LinkedIn | ✅ footer + JSON-LD `sameAs` |
| Portfolio → Instagram | ✅ added to footer + `sameAs` |
| LinkedIn → Portfolio | ⬜ **add Featured + Contact link** — highest-value missing link |
| LinkedIn → GitHub | ⬜ add under Contact info |
| Instagram → Portfolio | ⬜ bio link |

## Manual steps (cannot be done from this repo)

1. **Google Search Console** — URL-prefix property
   `https://abhikrishna-portfolio.vercel.app/` (a *Domain* property would need
   DNS TXT, impossible on `*.vercel.app`). Used the **HTML file** method: the
   file Google generated is at `public/google12ef0d74b12c4142.html` and is
   served at `/google12ef0d74b12c4142.html`. **Deploy first, then click
   Verify** — it 404s until the build carrying it is live.
2. **Submit sitemap** in GSC: `https://abhikrishna-portfolio.vercel.app/sitemap.xml`
3. **Request indexing** for the root URL after the deploy that carries these changes.
4. **Bing Webmaster Tools** — "Import from Google Search Console" covers it in one click.
5. Apply the LinkedIn / Instagram / GitHub edits above.
6. Link every other profile you own → portfolio, so the `sameAs` set and the
   actual backlinks match.
7. **Post-deploy validation:** `npm run seo:live` — asserts canonical, OG/Twitter
   tags, JSON-LD, robots.txt and sitemap.xml **as actually served**, not as built.
   It fails against a stale deploy, which is what `dist/`-only checking cannot catch.

## Out of scope (deliberately)

- `meta keywords` — ignored by Google
- `hreflang` / RSS — single `lang="en"` page, no feed
- Separate `#section` URLs — no router; anchors are not indexable pages
- Long-tail ranking ("React developer in [city]") — needs a blog or case-study
  pages. This is a one-page site: it can rank for *Abhikrishna* and
  *Abhikrishna full-stack developer*, and nothing broader without content.
