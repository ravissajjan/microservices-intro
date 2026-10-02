// ORDERS SERVICE — owns one thing: orders placed.
// Notice it stores its OWN data and does not share a database with catalog.
// "Database per service" is one of the defining rules of microservices.

const http = require('http');
const os = require('os');

const PORT = 3002;
const orders = [];

function readBody(req) {
  return new Promise(resolve => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(data || '{}'));
      } catch {
        resolve({});
      }
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

  if (req.url === '/orders' && req.method === 'POST') {
    const body = await readBody(req);
    const order = {
      id: orders.length + 1,
      bookId: body.bookId,
      title: body.title,
      placedAt: new Date().toISOString()
    };
    orders.push(order);

    // In a real system this would go onto a message broker (Kafka, RabbitMQ, SNS).
    // Nobody waits for it, which is the whole point of an event.
    console.log(`[orders] EVENT PUBLISHED  order.placed  id=${order.id} book="${order.title}"`);

    return json(201, { order, servedBy: os.hostname() });
  }

  if (req.url === '/orders') {
    return json(200, { orders, servedBy: os.hostname() });
  }

  json(404, { error: 'not found' });
});

server.listen(PORT, () => console.log(`[orders] listening on ${PORT}`));
