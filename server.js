// Server lokal ringan berbasis Node.js ES Module murni (Tanpa Python & Tanpa npm dependencies)
// Melayani bundle produksi terkompilasi (dist/) secara instan dan bebas error di desktop & Android.
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 8080;
const DIST_DIR = path.join(__dirname, 'dist');
const ROOT_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg'
};

const server = http.createServer((req, res) => {
  let decodedUrl = decodeURI(req.url.split('?')[0]);
  if (decodedUrl === '/' || decodedUrl === '') {
    decodedUrl = '/index.html';
  }

  // Cek apakah file ada di ROOT_DIR (dist)
  let safePath = path.normalize(path.join(ROOT_DIR, decodedUrl));

  // Fallback untuk folder assets atau optimized jika dicari di public/root
  if (!fs.existsSync(safePath)) {
    const publicPath = path.normalize(path.join(__dirname, 'public', decodedUrl));
    const rawPath = path.normalize(path.join(__dirname, decodedUrl));
    if (fs.existsSync(publicPath)) {
      safePath = publicPath;
    } else if (fs.existsSync(rawPath)) {
      safePath = rawPath;
    }
  }

  fs.stat(safePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback: Jika rute tidak ditemukan, kembalikan index.html
      const indexPath = path.join(ROOT_DIR, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(indexPath).pipe(res);
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found: ' + decodedUrl);
      return;
    }

    const ext = path.extname(safePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isAudio = ext === '.mp3' || ext === '.wav' || ext === '.ogg';

    // Mendukung HTTP 206 Partial Content (Streaming) untuk Audio di Mobile & Desktop
    // Mencegah browser/Android menganggap audio sebagai file unduhan paksa (force download).
    const range = req.headers.range;
    if (isAudio && range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;

      const headers = {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      };

      res.writeHead(206, headers);
      fs.createReadStream(safePath, { start, end }).pipe(res);
      return;
    }

    const headers = {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Content-Disposition': 'inline',
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*'
    };

    if (ext === '.html') {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }

    res.writeHead(200, headers);
    fs.createReadStream(safePath).pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` ⚔️  Dunia Kenangan Kita - Final Fantasy Edition`);
  console.log(` 🌐 Akses Desktop : http://localhost:${PORT}`);
  console.log(` 📱 Akses Android : http://[IP-Komputer-Anda]:${PORT}`);
  console.log(`=======================================================`);
});
