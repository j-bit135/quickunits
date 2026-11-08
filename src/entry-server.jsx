// Build-time entry used by scripts/prerender.js to render each route to static HTML.
import { renderToString } from 'react-dom/server'
import App, { ROUTES, getMeta, SITE_URL } from './App.jsx'

export function render(url) {
  return renderToString(<App url={url} />)
}

export { ROUTES, getMeta, SITE_URL }
