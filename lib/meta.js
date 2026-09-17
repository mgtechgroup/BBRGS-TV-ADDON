'use strict';

const { movies, series } = require('./data');

/**
 * Metadata handler.
 *
 * Accepts movie ids ('bbrgs-movie-1'), series ids ('bbrgs-series-1') and
 * episode ids ('bbrgs-series-1:1:2'). For series the full `videos` array is
 * returned so Stremio can render season/episode navigation.
 *
 * @param {string} type 'movie' | 'series'
 * @param {string} id   content id
 * @returns {{ meta: object }}
 */
function getMeta(type, id) {
  // Episode id -> resolve the parent series
  const baseId = id.includes(':') ? id.split(':')[0] : id;

  const collection = type === 'series' ? series : movies;
  const item = collection.find((entry) => entry.id === baseId);

  if (!item) {
    const err = new Error(`No metadata found for ${type}/${id}`);
    err.status = 404;
    throw err;
  }

  const meta = {
    id: item.id,
    type: item.type,
    name: item.name,
    poster: item.poster,
    background: item.background,
    description: item.description,
    year: item.year,
    genres: item.genres,
    runtime: item.runtime,
    imdbRating: item.imdbRating
  };

  if (item.type === 'series') {
    meta.videos = (item.videos || []).map((video) => ({
      id: video.id,
      title: video.title,
      season: video.season,
      episode: video.episode,
      released: video.released,
      overview: video.overview,
      thumbnail: video.thumbnail
    }));
  }

  return { meta };
}

module.exports = { getMeta };
