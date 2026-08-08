const http = require('http');
const fs = require('fs');
const path = require('path');
const root = 'f:/Youssefcv';
const types = { html:'text/html', css:'text/css', js:'application/javascript', png:'image/png', jpg:'image/jpeg', svg:'image/svg+xml' };
http.createServer((req, res) => {
  let f = path.join(root, req.url === '/' ? 'index.html' : req.url);
  let ext = path.extname(f).slice(1);
  let ct = types[ext] || 'text/plain';
  fs.readFile(f, (e, d) => {
    if (e) { res.writeHead(404); res.end('Not found'); }
    else { res.writeHead(200, { 'Content-Type': ct }); res.end(d); }
  });
}).listen(8765, () => console.log('Server on http://localhost:8765'));
