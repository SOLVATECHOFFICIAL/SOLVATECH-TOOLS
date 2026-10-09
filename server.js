const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Enable CORS and basic security headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    try {
        let reqPath = decodeURI(req.url.split('?')[0]);
        if (reqPath === '/' || reqPath === '') {
            reqPath = '/index.html';
        }

        const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
        let filePath = path.join(ROOT_DIR, safePath);

        // Check if path exists and is a directory
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        if (!fs.existsSync(filePath)) {
            // Check if appending .html works
            if (fs.existsSync(filePath + '.html')) {
                filePath = filePath + '.html';
            } else {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1><p><a href="/">Return to Home</a></p>');
                return;
            }
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        });
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server error: ' + e.message);
    }
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`SOLVATECH Student Tools server running on http://0.0.0.0:${PORT}`);
});
