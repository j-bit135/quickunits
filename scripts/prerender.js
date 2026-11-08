// Pre-renders every route to static HTML after `vite build`, so Google (and
// visitors) get the full page content, title, description and structured data
// without waiting for JavaScript. Also writes 404.html and sitemap.xml.
//
// Run via `npm run build` (vite client build → vite SSR build → this script).
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const dist = path.join(root, 'dist')
const ssrEntry = ['entry-server.js', 'entry-server.mjs']
  .map(f => path.join(root, 'dist-ssr', f))
  .find(f => fs.existsSync(f))
if (!ssrEntry) throw new Error('SSR bundle not found in dist-ssr/ — did `vite build --ssr` run?')

const { render, ROUTES, getMeta, SITE_URL } = await import(pathToFileURL(ssrEntry).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const ld = obj => JSON.stringify(obj).replace(/</g, '\\u003c')

function headTags(meta) {
  const tags = []
  if (meta.canonical) tags.push(`<link rel="canonical" href="${esc(meta.canonical)}" />`)
  if (meta.robots) tags.push(`<meta name="robots" content="${esc(meta.robots)}" />`)
  tags.push(
    `<meta property="og:site_name" content="QuickUnits" />`,
    `<meta property="og:locale" content="en_GB" />`,
    `<meta property="og:type" content="${meta.ogType || 'website'}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.desc)}" />`,
  )
  if (meta.canonical) tags.push(`<meta property="og:url" content="${esc(meta.canonical)}" />`)
  tags.push(
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.desc)}" />`,
  )
  for (const obj of meta.jsonLd || []) tags.push(`<script type="application/ld+json">${ld(obj)}</script>`)
  return tags.join('\n    ')
}

function buildPage(url) {
  const meta = getMeta(url)
  const html = render(url)
  let out = template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.desc)}" />`)
    .replace('<!--app-head-->', headTags(meta))
    .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
  if (!out.includes(`<div id="root">${html.slice(0, 40)}`)) throw new Error(`Failed to inject HTML for ${url}`)
  return { meta, out }
}

// SEO length checks — warn rather than fail the build
const problems = []
function check(url, meta) {
  if (meta.title.length > 60) problems.push(`${url}: title is ${meta.title.length} chars (max 60)`)
  if (meta.desc.length < 110 || meta.desc.length > 160) problems.push(`${url}: description is ${meta.desc.length} chars (aim 110–160)`)
}

const seenTitles = new Map()
for (const url of ROUTES) {
  const { meta, out } = buildPage(url)
  check(url, meta)
  if (seenTitles.has(meta.title)) problems.push(`${url}: duplicate title with ${seenTitles.get(meta.title)}`)
  seenTitles.set(meta.title, url)
  // cleanUrls on Vercel serves /about from about.html, /blog/x from blog/x.html
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`
  const target = path.join(dist, file)
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, out)
}

// 404 page (served by Vercel with a real 404 status for unknown URLs)
fs.writeFileSync(path.join(dist, '404.html'), buildPage('/404').out)

// Sitemap generated from the same route list, so it can never drift
const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(u => `  <url>\n    <loc>${SITE_URL}${u === '/' ? '/' : u}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
fs.writeFileSync(path.join(dist, 'sitemap.xml'), sitemap)

console.log(`Pre-rendered ${ROUTES.length} pages + 404.html, sitemap.xml written.`)
if (problems.length) console.warn('SEO warnings:\n  ' + problems.join('\n  '))
