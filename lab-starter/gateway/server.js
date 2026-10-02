// API GATEWAY — the single front door.
//
// Three patterns from Session 2 all live in this one file:
//
//   1. API GATEWAY       the browser talks only to this. It never sees the other services.
//   2. SERVICE DISCOVERY the addresses below are NAMES, not IP addresses. Docker Compose and
//                        Kubernetes both resolve those names for us.
//   3. RESILIENCE        the recommendations call has a TIMEOUT and a FALLBACK, so a failure
//                        there degrades the page instead of breaking it.

const http = require('http');
const fs = require('fs');
const os = require('os');

const PORT = 8080;

// Service discovery by NAME. Change these in docker-compose.yml or the Kubernetes manifests
// without touching a single line of code.
const CATALOG = process.env.CATALOG_URL || 'http://catalog:3001';
const ORDERS = process.env.ORDERS_URL || 'http://orders:3002';
const RECOMMENDATIONS = process.env.RECOMMENDATIONS_URL || 'http://recommendations:3003';

// How long we are willing to wait for the optional service before giving up on it.
const RECOMMENDATION_TIMEOUT_MS = 1000;

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  const json = (code, body) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  // --- ESSENTIAL: if catalog is down, there is no shop. We let the error through. ---
  if (req.url === '/api/books') {
    try {
      const r = await fetch(`${CATALOG}/books`);
      const data = await r.json();
      return json(200, { ...data, via: os.hostname() });
    } catch (err) {
      console.log(`[gateway] catalog unreachable: ${err.message}`);
      return json(503, { error: 'Catalog is unavailable. The shop cannot open.' });
    }
  }

  // --- ESSENTIAL: placing an order must either work or report honestly. ---
  if (req.url === '/api/orders' && req.method === 'POST') {
    try {
      const body = await readBody(req);
      const r = await fetch(`${ORDERS}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      return json(r.status, await r.json());
    } catch (err) {
      console.log(`[gateway] orders unreachable: ${err.message}`);
      return json(503, { error: 'Could not place the order. Please try again.' });
    }
  }

  // --- OPTIONAL: this is the resilience demo. Timeout + fallback, never an error page. ---
  if (req.url === '/api/recommendations') {
    try {
      const r = await fetch(`${RECOMMENDATIONS}/recommendations`, {
        signal: AbortSignal.timeout(RECOMMENDATION_TIMEOUT_MS)
      });
      if (!r.ok) throw new Error(`upstream returned ${r.status}`);
      return json(200, { ...(await r.json()), degraded: false });
    } catch (err) {
      // THE FALLBACK. The shop stays open; one panel is simply empty.
      console.log(`[gateway] recommendations degraded: ${err.message}`);
      return json(200, { picks: [], degraded: true, reason: err.message });
    }
  }

  const page = fs
    .readFileSync(__dirname + '/public/index.html', 'utf8')
    .replace('__GATEWAY__', os.hostname());
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
});

server.listen(PORT, () => {
  console.log(`[gateway] listening on ${PORT}`);
  console.log(`[gateway] catalog          -> ${CATALOG}`);
  console.log(`[gateway] orders           -> ${ORDERS}`);
  console.log(`[gateway] recommendations  -> ${RECOMMENDATIONS}`);
});
