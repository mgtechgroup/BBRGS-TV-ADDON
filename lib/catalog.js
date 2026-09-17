'use strict';

const { movies, series } = require('./data');

const PAGE_SIZE = 100; // Stremio catalog page size

const COLLECTIONS = {
  movie: movies,
  series: series
};

/**
 * Convert an internal item into a Stremio MetaPreview object.
 */
function toMetaPreview(item) {
  return {
    id: item.id,
    type: item.type,
    name: item.name,
    poster: item.poster,
    background: item.background,
    description: item.description,
    year: item.year,
    genres: item.genres,
    imdbRating: item.imdbRating
  };
}

/**
 * Catalog handler.
 *
 * @param {string} type   'movie' | 'series'
 * @param {string} id     catalog id from the manifest (e.g. 'bbrgs-movies')
 * @param {object} extra  Stremio extra params: { search, genre, skip }
 * @returns {{ metas: object[] }}
 */
function getCatalog(type, id, extra = {}) {
  const collection = COLLECTIONS[type];
  if (!collection) {
    const err = new Error(`Unsupported type: ${type}`);
    err.status = 404;
    throw err;
  }

  let items = collection;

  if (extra.search) {
    const q = String(extra.search).toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.description || '').toLowerCase().includes(q)
    );
  }

  if (extra.genre) {
    const g = String(extra.genre).toLowerCase();
    items = items.filter((item) =>
      (item.genres || []).some((genre) => genre.toLowerCase() === g)
    );
  }

  const skip = Number.parseInt(extra.skip, 10) || 0;
  items = items.slice(skip, skip + PAGE_SIZE);

  return { metas: items.map(toMetaPreview) };
}

module.exports = { getCatalog, toMetaPreview };
