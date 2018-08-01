// Simple HTTP server that renders barcode images using bwip-js.
const http   = require('http');
const bwipjs = require('bwip-js');

// To use the freetype library for font rendering, you must enable it via useFreetype(),
// then load your custom font(s).  This shows how to load the Inconsolata font, supplied
// with the bwip-js distribution.  The path to your fonts will likely be different.
//bwipjs.useFreetype();
//bwipjs.loadFont('Inconsolata', 108,
//      require('fs').readFileSync('./fonts/Inconsolata.otf', 'binary'));

const server = http.createServer((req, res) => {
    // If the url does not begin /?bcid= then 404.  Otherwise, we end up
    // returning 400 on requests like favicon.ico.
    if (req.url.indexOf('/?bcid=') != 0) {
        res.writeHead(404, { 'Content-Type':'text/plain' });
        res.end('BWIPJS: Unknown request format.', 'utf8');
    } else {
        bwipjs(req, res);
    }
});

server.listen(3030, () => {
  console.log('Servidor escuchando en', server.address().port)
});
