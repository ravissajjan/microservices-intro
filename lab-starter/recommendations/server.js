// RECOMMENDATIONS SERVICE — the "nice to have" one.
//
// This is the service you will deliberately break in Session 2. It exists to prove a point:
// a well-designed system survives the loss of a non-essential service. The shop keeps selling
// books even when the recommendation engine is down.
//
// /slow  makes every response take 3 seconds  (the gateway times out after 1)
// /fail  makes every response return 500
// /ok    back to normal

const http = require('http');
const os = require('os');

const PORT = 3003;

let mode = 'ok';

const picks = [
  'Release It! — Michael Nygard',
  'Site Reliability Engineering — Google',
  'Accelerate — Forsgren, Humble, Kim'
];

const server = http.createServer(async (req, res) => {
  const json = (code, body) => {
    res.writeHead(code, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(body));
  };

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('OK');
  }

  if (['/slow', '/fail', '/ok'].includes(req.url)) {
    mode = req.url.slice(1);
    console.log(`[recommendations] mode is now: ${mode}`);
    return json(200, { mode });
  }

  if (req.url === '/recommendations') {
    if (mode === 'fail') {
      console.log('[recommendations] returning 500 on purpose');
      return json(500, { error: 'recommendation engine unavailable' });
    }

    if (mode === 'slow') {
      console.log('[recommendations] sleeping 3s on purpose');
      await new Promise(r => setTimeout(r, 3000));
    }

    return json(200, { picks, servedBy: os.hostname() });
  }

  json(404, { error: 'not found' });
});

server.listen(PORT, () => console.log(`[recommendations] listening on ${PORT}`));
