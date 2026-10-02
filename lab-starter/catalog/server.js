// CATALOG SERVICE — owns one thing: the list of books.
// It has its own data and never touches orders. That is a service boundary.

const http = require('http');
const os = require('os');

const PORT = 3001;

const books = [
  { id: 1, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', price: 450 },
  { id: 2, title: 'Designing Data-Intensive Applications', author: 'Kleppmann', price: 720 },
  { id: 3, title: 'Clean Architecture', author: 'Martin', price: 380 },
  { id: 4, title: 'Building Microservices', author: 'Newman', price: 540 },
  { id: 5, title: 'The Phoenix Project', author: 'Kim et al.', price: 410 }
];

const server = http.createServer((req, res) => {
  const json = (code, body) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  if (req.url === '/books') {
    console.log(`[catalog] served ${books.length} books`);
    return json(200, { books, servedBy: os.hostname() });
  }

  json(404, { error: 'not found' });
});

server.listen(PORT, () => console.log(`[catalog] listening on ${PORT}`));
