// Servidor local simple para probar las APIs
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: '.env.local' });

// Importar los handlers de las APIs
const songsHandler = require('./api/songs.js').default;
const loginHandler = require('./api/login.js').default;
const adminSongsHandler = require('./api/admin-songs.js').default;

const PORT = 3003;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // APIs
    if (pathname === '/api/songs') {
        const mockReq = { method: req.method, headers: req.headers };
        const mockRes = {
            status: (code) => {
                res.statusCode = code;
                return mockRes;
            },
            json: (data) => {
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
            }
        };
        await songsHandler(mockReq, mockRes);
        return;
    }

    if (pathname === '/api/login') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const mockReq = {
                method: req.method,
                headers: req.headers,
                body: JSON.parse(body)
            };
            const mockRes = {
                status: (code) => {
                    res.statusCode = code;
                    return mockRes;
                },
                json: (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                }
            };
            await loginHandler(mockReq, mockRes);
        });
        return;
    }

    if (pathname === '/api/admin-songs') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            const mockReq = {
                method: req.method,
                headers: req.headers,
                body: body ? JSON.parse(body) : null
            };
            const mockRes = {
                status: (code) => {
                    res.statusCode = code;
                    return mockRes;
                },
                json: (data) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                }
            };
            await adminSongsHandler(mockReq, mockRes);
        });
        return;
    }

    // Archivos estáticos
    let filePath = '.' + pathname;
    if (filePath === './') filePath = './index.html';

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.mp3': 'audio/mpeg'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 - Archivo no encontrado');
            } else {
                res.writeHead(500);
                res.end('500 - Error del servidor');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n🚀 Servidor local corriendo en http://localhost:${PORT}`);
    console.log(`📱 Página pública: http://localhost:${PORT}/index.html`);
    console.log(`🔒 Panel admin: http://localhost:${PORT}/admin.html`);
    console.log(`\nPresiona Ctrl+C para detener el servidor\n`);
});
