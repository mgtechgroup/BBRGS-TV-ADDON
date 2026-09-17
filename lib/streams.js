'use strict';

const { movies, series } = require('./data');

const STREAM_BASE_URL = process.env.STREAM_BASE_URL || 'https://streams.bbrgs.tv';

/**
 * Stream handler.
 *
 * Returns every available source for the requested id:
 *   1. Primary Stream  - direct BBRGS hosting
 *   2. Backup Stream   - redundant source
 *   3. External Source - third-party integration
 *
 * Works for movie ids, series ids and episode ids ('bbrgs-series-1:1:2').
 *
 * @param {string} type 'movie' | 'series'
 * @param {string} id   content id
 * @returns {{ streams: object[] }}
 */
function getStreams(type, id) {
  const baseId = id.includes(':') ? id.split(':')[0] : id;
  const collection = type === 'series' ? series : movies;
  const item = collection.find((entry) => entry.id === baseId);

  if (!item) {
    const err = new Error(`No streams found for ${type}/${id}`);
    err.status = 404;
    throw err;
  }

  const slug = id.replace(/:/g, '/');

  const streams = [
    {
      name: 'BBRGS Primary',
      title: `${item.name} - 1080p HD`,
      url: `${STREAM_BASE_URL}/primary/${slug}/master.m3u8`,
      quality: 'HD',
      type: 'http'
    },
    {
      name: 'BBRGS Backup',
      title: `${item.name} - 720p (backup)`,
      url: `${STREAM_BASE_URL}/backup/${slug}/master.m3u8`,
      quality: 'SD',
      type: 'http'
    },
    {
      name: 'BBRGS External',
      title: `${item.name} - external source`,
      externalUrl: `${STREAM_BASE_URL}/watch/${slug}`,
      quality: 'HD',
      type: 'external'
    }
  ];

  return { streams };
}

module.exports = { getStreams };
