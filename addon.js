'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const manifest = require('./lib/manifest');
const { getCatalog } = require('./lib/catalog');
const { getMeta } = require('./lib/meta');
const { getStreams } = require('./lib/streams');
const logger = require('./utils/logger');
const { cacheMiddleware } = require('./utils/cache');

const PORT = Number.parseInt(process.env.PORT, 10) || 8080;

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

// Simple request log (no sensitive data)
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.originalUrl}`);
  next();
});

/**
 * Parse Stremio "extra" string, e.g. 'search=foo&genre=Romance&skip=100'.
 */
function parseExtra(raw) {
  const extra = {};
  if (!raw) return extra;
  for (const pair of raw.split('&')) {
    const idx = pair.indexOf('=');
    if (idx === -1) continue;
    const key = decodeURIComponent(pair.slice(0, idx));
    const value = decodeURIComponent(pair.slice(idx + 1));
    extra[key] = value;
  }
  return extra;
}

function handle(fn) {
  return (req, res) => {
    try {
      res.json(fn(req));
    } catch (err) {
      const status = err.status || 500;
      if (status >= 500) logger.error(err);
      res.status(status).json({ error: err.message });
    }
  };
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    version: manifest.version,
    timestamp: new Date().toISOString()
  });
});

// Addon info
app.get('/addon', (req, res) => {
  res.json({
    name: manifest.name,
    id: manifest.id,
    version: manifest.version,
    description: manifest.description,
    adult: true,
    endpoints: {
      manifest: '/manifest.json',
      catalog: '/catalog/{type}/{id}.json',
      meta: '/meta/{type}/{id}.json',
      stream: '/stream/{type}/{id}.json',
      health: '/health'
    }
  });
});

// Stremio manifest
app.get('/manifest.json', (req, res) => {
  res.json(manifest);
});

// Catalog: /catalog/{type}/{id}.json and /catalog/{type}/{id}/{extra}.json
const catalogHandler = handle((req) =>
  getCatalog(req.params.type, req.params.id, parseExtra(req.params.extra))
);
app.get('/catalog/:type/:id.json', cacheMiddleware, catalogHandler);
app.get('/catalog/:type/:id/:extra.json', cacheMiddleware, catalogHandler);

// Metadata
app.get(
  '/meta/:type/:id.json',
  cacheMiddleware,
  handle((req) => getMeta(req.params.type, req.params.id))
);

// Streams
app.get(
  '/stream/:type/:id.json',
  cacheMiddleware,
  handle((req) => getStreams(req.params.type, req.params.id))
);

// Landing page with "Install in Stremio"
app.get('/', (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  const manifestUrl = `${baseUrl}/manifest.json`;
  const installUrl = manifestUrl.replace(/^https?:/, 'stremio:');
  res.type('html').send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${manifest.name} - Stremio Addon</title>
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #10002b; color: #fff;
           display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { max-width: 480px; padding: 2.5rem; background: #240046; border-radius: 16px;
            text-align: center; box-shadow: 0 20px 60px rgba(0,0,0,.5); }
    h1 { margin: 0 0 .5rem; }
    .badge { display: inline-block; background: #e63946; border-radius: 6px;
             padding: .15rem .6rem; font-weight: 700; margin-bottom: 1rem; }
    p { color: #c8b6ff; }
    a.btn { display: inline-block; margin-top: 1rem; padding: .8rem 1.6rem; border-radius: 8px;
            background: #7b2cbf; color: #fff; text-decoration: none; font-weight: 600; }
    code { display: block; margin-top: 1.25rem; padding: .6rem; background: #10002b;
           border-radius: 6px; word-break: break-all; font-size: .85rem; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">+18</span>
    <h1>${manifest.name}</h1>
    <p>${manifest.description}</p>
    <a class="btn" href="${installUrl}">Install in Stremio</a>
    <code>${manifestUrl}</code>
  </div>
</body>
</html>`);
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`${manifest.name} v${manifest.version} listening on http://localhost:${PORT}`);
    logger.info(`Manifest: http://localhost:${PORT}/manifest.json`);
  });
}

module.exports = app;
