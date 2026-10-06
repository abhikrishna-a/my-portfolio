#!/usr/bin/env node
// Regression guard for the SEO surface. Run automatically after `vite build`.
//
// Why this exists: robots.txt and sitemap.xml declared https://abhikrishna.com/
// while the site was deployed on Vercel — a silent domain drift that left the
// sitemap unreachable at its own declared URL. Nothing failed, nothing warned.
// This fails loudly instead.
//
// Zero dependencies: node scripts/seo-check.mjs
//
// Modes:
//   node scripts/seo-check.mjs                    assert against ./dist (runs on every build)
//   node scripts/seo-check.mjs --url https://…     assert against the deployed page
//   npm run seo:live                              same, against production
//
// --url proves what Google actually fetches, not what the build produced —
// it catches things dist/ cannot, like a stale deploy or a redirect that drops
// the path.

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const CANONICAL = 'https://abhikrishna-portfolio.vercel.app/';

const urlFlag = process.argv.indexOf('--url');
const LIVE =
  urlFlag !== -1
    ? (process.argv[urlFlag + 1] || CANONICAL).replace(/\/+$/, '')
    : null;
const SOURCE = LIVE ?? DIST;

const errors = [];
const warnings = [];
const pass = [];

const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const ok = (m) => pass.push(m);

// Live mode fetches, local mode reads from dist/. Same call sites either way.
async function load(target, localFile) {
  if (LIVE) {
    try {
      const res = await fetch(target, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      console.error(`seo-check: cannot fetch ${target} — ${e.message}`);
      process.exit(1);
    }
  }
  if (!existsSync(localFile)) {
    console.error(`seo-check: missing ${localFile}`);
    process.exit(1);
  }
  return readFileSync(localFile);
}

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const stripHost = (u) => (u ?? '').trim().replace(/\/+$/, '');

// Attribute order varies (name before content, or after), so match the tag
// first and pull `content` out of whatever tag carries the identifier.
function metaTag(html, attr, value) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  const tag = tags.find((t) =>
    new RegExp(`${attr}=["']${escapeRe(value)}["']`, 'i').test(t),
  );
  if (!tag) return null;
  const m = tag.match(/content\s*=\s*["']([^"']*)["']/i);
  return m ? m[1] : null;
}

function requireMeta(html, attr, value, label) {
  const v = metaTag(html, attr, value);
  if (v === null) err(`${label}: <meta ${attr}="${value}"> missing`);
  else ok(`${label}: ${v}`);
  return v;
}

// ---------------------------------------------------------------- index.html
const html = (await load(`${LIVE ?? ''}/`, join(DIST, 'index.html'))).toString('utf8');

// 1. Canonical
const canonTag = (html.match(/<link\b[^>]*rel\s*=\s*["']canonical["'][^>]*>/i) || [])[0];
const canonical = canonTag
  ? (canonTag.match(/href\s*=\s*["']([^"']*)["']/i) || [])[1]
  : null;
if (!canonical) err('canonical: <link rel="canonical"> missing');
else if (stripHost(canonical) !== stripHost(CANONICAL))
  err(`canonical: expected ${CANONICAL}, got ${canonical}`);
else ok(`canonical: ${canonical}`);

// 2. Indexability
const robotsMeta = requireMeta(html, 'name', 'robots', 'meta robots');
if (robotsMeta) {
  if (!/index/i.test(robotsMeta)) err(`meta robots: "${robotsMeta}" blocks indexing`);
  if (!/follow/i.test(robotsMeta)) warn(`meta robots: "${robotsMeta}" does not declare follow`);
}

// 3. Title + description length budgets (50-60 / 120-160)
const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1]?.trim();
if (!title) err('title: <title> missing');
else if (title.length < 45 || title.length > 62) warn(`title: ${title.length} chars (target 50-60) — "${title}"`);
else ok(`title (${title.length}): ${title}`);

const desc = requireMeta(html, 'name', 'description', 'meta description');
if (desc && (desc.length < 120 || desc.length > 165))
  warn(`description: ${desc.length} chars (target 120-160)`);

// 4. Open Graph
requireMeta(html, 'property', 'og:url', 'og:url');
requireMeta(html, 'property', 'og:title', 'og:title');
requireMeta(html, 'property', 'og:description', 'og:description');
requireMeta(html, 'property', 'og:site_name', 'og:site_name');

const ogUrl = metaTag(html, 'property', 'og:url');
if (ogUrl && stripHost(ogUrl) !== stripHost(CANONICAL))
  err(`og:url: expected ${CANONICAL}, got ${ogUrl}`);

const ogImage = requireMeta(html, 'property', 'og:image', 'og:image');
if (ogImage) {
  if (!/^https?:\/\//i.test(ogImage)) {
    err(`og:image: must be an absolute URL, got "${ogImage}"`);
  } else {
    if (!ogImage.startsWith(CANONICAL))
      err(`og:image: host differs from canonical — ${ogImage}`);

    // Dimensions must come from the real bytes, not the declared values —
    // live mode downloads the actual image Google will be served.
    const localPath = join(DIST, decodeURIComponent(new URL(ogImage).pathname));
    const b = await load(ogImage, localPath);
    if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50) {
      const w = b.readUInt32BE(16);
      const h = b.readUInt32BE(20);
      if (w !== 1200 || h !== 630) err(`og:image: file is ${w}x${h}, expected 1200x630`);
      else ok(`og:image: ${w}x${h} PNG reachable`);
    } else {
      ok('og:image: reachable (non-PNG, dimensions not checked)');
    }
  }
  const w = requireMeta(html, 'property', 'og:image:width', 'og:image:width');
  const h = requireMeta(html, 'property', 'og:image:height', 'og:image:height');
  if (w && w !== '1200') err(`og:image:width: declared ${w}, expected 1200`);
  if (h && h !== '630') err(`og:image:height: declared ${h}, expected 630`);
}

// 5. Twitter
const card = requireMeta(html, 'name', 'twitter:card', 'twitter:card');
if (card && card === 'summary_large_image' && !metaTag(html, 'name', 'twitter:image'))
  err('twitter:image: card is summary_large_image but no twitter:image is set');
requireMeta(html, 'name', 'twitter:image', 'twitter:image');

// 6. JSON-LD: the Person @id -> WebSite.publisher link must survive
const ldBlocks = [...html.matchAll(/<script[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => m[1]);

if (ldBlocks.length === 0) err('json-ld: no application/ld+json block found');
else {
  let graph = [];
  for (const raw of ldBlocks) {
    try {
      const parsed = JSON.parse(raw);
      graph = graph.concat(parsed['@graph'] || [parsed]);
    } catch (e) {
      err(`json-ld: invalid JSON — ${e.message}`);
    }
  }

  const person = graph.find((n) => n['@type'] === 'Person');
  const site = graph.find((n) => n['@type'] === 'WebSite');

  if (!person) err('json-ld: Person node missing');
  else {
    if (!person['@id']) err('json-ld: Person has no @id (publisher cannot reference it)');
    else ok(`json-ld: Person @id ${person['@id']}`);

    const sameAs = person.sameAs || [];
    for (const [label, needle] of [
      ['LinkedIn', 'linkedin.com/in/abhikrishna22'],
      ['GitHub', 'github.com/abhikrishna-a'],
      ['Instagram', 'instagram.com/_ab.krishx_/'],
    ]) {
      if (!sameAs.some((u) => u.includes(needle)))
        err(`json-ld: sameAs is missing ${label} (${needle})`);
      else ok(`json-ld: sameAs has ${label}`);
    }
  }

  if (!site) err('json-ld: WebSite node missing');
  else if (!site.publisher || !site.publisher['@id'])
    err('json-ld: WebSite.publisher has no @id — entity link is untyped');
  else if (!person || site.publisher['@id'] !== person['@id'])
    err(`json-ld: WebSite.publisher/@id "${site.publisher?.['@id']}" does not match Person/@id "${person?.['@id']}"`);
  else ok('json-ld: WebSite.publisher -> Person @id resolved');
}

// ---------------------------------------------------------------- robots.txt
const robotsRaw = (await load(`${LIVE ?? ''}/robots.txt`, join(DIST, 'robots.txt'))).toString('utf8');
if (!/^User-agent:/im.test(robotsRaw)) err('robots.txt: no User-agent directive');
if (!/^Allow:\s*\/\s*$/im.test(robotsRaw)) err('robots.txt: site is not Allow:/');

const sitemapLine = (robotsRaw.match(/^Sitemap:\s*(\S+)/im) || [])[1];
if (!sitemapLine) err('robots.txt: no Sitemap: directive');
else if (stripHost(sitemapLine) !== `${stripHost(CANONICAL)}/sitemap.xml`)
  err(`robots.txt: Sitemap points off-canonical — ${sitemapLine}`);
else ok(`robots.txt: Sitemap ${sitemapLine}`);

// ---------------------------------------------------------------- sitemap.xml
const sitemapRaw = (await load(`${LIVE ?? ''}/sitemap.xml`, join(DIST, 'sitemap.xml'))).toString('utf8');
const locs = [...sitemapRaw.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => m[1]);
if (locs.length === 0) {
  err('sitemap.xml: no <loc> entries');
} else {
  const offCanonical = locs.filter((l) => stripHost(l) !== stripHost(CANONICAL));
  if (offCanonical.length) offCanonical.forEach((l) => err(`sitemap.xml: <loc> off-canonical — ${l}`));
  else ok(`sitemap.xml: ${locs.length} <loc> all on ${CANONICAL}`);
}

if (!/<lastmod>/.test(sitemapRaw)) warn('sitemap.xml: no <lastmod>');

// ---------------------------------------------------------------- report
const line = (tag, msg) => `  [${tag}] ${msg}`;
const mode = LIVE ? `live ${LIVE}` : 'local dist/';

console.log(`\nseo-check — ${mode} — canonical ${CANONICAL}\n`);
if (LIVE) {
  if (stripHost(LIVE) !== stripHost(CANONICAL))
    warn(`source host differs from canonical — you are checking ${LIVE}`);
}
if (pass.length) console.log(`${pass.length} passed:\n${pass.map((m) => line(' OK ', m)).join('\n')}\n`);
if (warnings.length) console.log(`${warnings.length} warning(s):\n${warnings.map((m) => line('WARN', m)).join('\n')}\n`);
if (errors.length) console.log(`${errors.length} FAILED:\n${errors.map((m) => line('FAIL', m)).join('\n')}\n`);

if (errors.length) {
  console.error(`seo-check FAILED — ${errors.length} error(s) against ${SOURCE}.`);
  process.exit(1);
}
console.log(`seo-check passed — ${pass.length} checks${warnings.length ? `, ${warnings.length} warning(s)` : ''}.`);
