// THE MONOLITH — every feature of the bookstore in one file, one process, one deployable.
//
// Compare this with the ../gateway, ../catalog, ../orders and ../recommendations folders.
// It is the SAME application. Only the shape is different.
//
// Be fair to it. For a small app this is simpler, faster and easier to debug than four
// services. The monolith is not the villain of this workshop - it is the right answer
// surprisingly often. What it cannot do is let you scale, deploy or fail one part
// independently of the others.

const http = require('http');
const os = require('os');

const PORT = 8080;

// All the data lives together, in one process, usually in one database.
// One team's change to this file can break another team's feature.
const books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', price: 450 },
  { id: 2, title: 'Designing Data-Intensive Applications', author: 'Kleppmann', price: 720 },
  { id: 3, title: 'Clean Architecture', author: 'Martin', price: 380 },
  { id: 4, title: 'Building Microservices', author: 'Newman', price: 540 },
  { id: 5, title: 'The Phoenix Project', author: 'Kim et al.', price: 410 }
];
const orders = [];
const picks = [
  'Release It! — Michael Nygard',
  'Site Reliability Engineering — Google',
  'Accelerate — Forsgren, Humble, Kim'
];

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', c => (data += c));
    req.on('end', () => {
      try { resolve(JSON.parse(data || '{}')); } catch { resolve({}); }
    });
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

  // No network call. No service discovery. No timeout. Just a function call away.
  // This is the monolith's genuine advantage: it is simple and it is fast.
  if (req.url === '/api/books') {
    return json(200, { books, servedBy: os.hostname() });
  }

  if (req.url === '/api/recommendations') {
    return json(200, { picks, servedBy: os.hostname(), degraded: false });
  }

  if (req.url === '/api/orders' && req.method === 'POST') {
    const body = await readBody(req);
    const order = { id: orders.length + 1, bookId: body.bookId, title: body.title };
    orders.push(order);
    return json(201, { order, servedBy: os.hostname() });
  }

  const page = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>BookStore (monolith)</title>
<style>body{font-family:system-ui,sans-serif;max-width:760px;margin:2rem auto;padding:0 1rem}
.panel{border:1px solid #ddd;border-radius:10px;padding:1rem 1.25rem;margin:1rem 0}
.book{display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid #f0f0f0}
code{background:#f0f0f0;padding:1px 5px;border-radius:4px}</style></head>
<body>
  <h1>📚 BookStore <small style="color:#888">— monolith</small></h1>
  <p>One process, one deployable: <code>${os.hostname()}</code>.
     Catalog, orders and recommendations are all <strong>function calls</strong> inside this
     single program. No network, no service discovery, no timeouts.</p>
  <div class="panel"><h2>Catalog</h2>
    ${books.map(b => `<div class="book"><span><strong>${b.title}</strong><br>
      <small>${b.author} — ₹${b.price}</small></span></div>`).join('')}
  </div>
  <div class="panel"><h2>Recommended for you</h2>
    <ul>${picks.map(p => `<li>${p}</li>`).join('')}</ul>
  </div>
  <div class="panel"><h2>Think about it</h2>
    <p>To fix one typo in a book title, you redeploy <strong>everything</strong>.<br>
    If the recommendation code has a memory leak, <strong>the whole shop</strong> goes down.<br>
    If Black Friday triples catalog traffic, you scale <strong>all of it</strong>, orders included.</p>
  </div>
</body></html>`;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
});

server.listen(PORT, () => console.log(`[monolith] the whole shop is listening on ${PORT}`));
