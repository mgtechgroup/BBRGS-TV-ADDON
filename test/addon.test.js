'use strict';

const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../addon');

let server;
let baseUrl;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      baseUrl = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => server.close());

test('GET /health returns ok', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.status, 'ok');
});

test('GET /addon returns addon info', async () => {
  const res = await fetch(`${baseUrl}/addon`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.id, 'tv.bbrgs.addon');
  assert.equal(body.adult, true);
});

test('GET /manifest.json returns a valid Stremio manifest', async () => {
  const res = await fetch(`${baseUrl}/manifest.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.id, 'tv.bbrgs.addon');
  assert.ok(body.resources.includes('catalog'));
  assert.ok(body.resources.includes('meta'));
  assert.ok(body.resources.includes('stream'));
  assert.equal(body.behaviorHints.adult, true);
});

test('GET /catalog/movie/bbrgs-movies.json returns metas', async () => {
  const res = await fetch(`${baseUrl}/catalog/movie/bbrgs-movies.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.metas));
  assert.ok(body.metas.length > 0);
  assert.equal(body.metas[0].type, 'movie');
});

test('catalog search filter works', async () => {
  const res = await fetch(`${baseUrl}/catalog/movie/bbrgs-movies/search=neon.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.metas.length, 1);
  assert.equal(body.metas[0].name, 'City of Neon');
});

test('catalog genre filter works', async () => {
  const res = await fetch(`${baseUrl}/catalog/series/bbrgs-series/genre=Thriller.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.metas.every((m) => m.genres.includes('Thriller')));
});

test('GET /meta/movie/:id returns metadata', async () => {
  const res = await fetch(`${baseUrl}/meta/movie/bbrgs-movie-1.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.meta.id, 'bbrgs-movie-1');
  assert.equal(body.meta.name, 'Midnight Lounge');
});

test('GET /meta/series/:id returns videos for episode navigation', async () => {
  const res = await fetch(`${baseUrl}/meta/series/bbrgs-series-1.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(Array.isArray(body.meta.videos));
  assert.ok(body.meta.videos.length >= 2);
  assert.equal(body.meta.videos[0].season, 1);
});

test('GET /stream/movie/:id returns multiple sources', async () => {
  const res = await fetch(`${baseUrl}/stream/movie/bbrgs-movie-1.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.streams.length >= 3);
  assert.ok(body.streams.some((s) => s.url));
  assert.ok(body.streams.some((s) => s.externalUrl));
});

test('GET /stream/series/:episodeId resolves episode streams', async () => {
  const res = await fetch(`${baseUrl}/stream/series/bbrgs-series-1:1:1.json`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.ok(body.streams.length >= 3);
});

test('unknown ids return 404', async () => {
  const res = await fetch(`${baseUrl}/meta/movie/does-not-exist.json`);
  assert.equal(res.status, 404);
});

test('unknown routes return 404', async () => {
  const res = await fetch(`${baseUrl}/nope`);
  assert.equal(res.status, 404);
});
