'use strict';

/**
 * Stremio addon manifest.
 * Served at /manifest.json and consumed by the Stremio application.
 */
const manifest = {
  id: 'tv.bbrgs.addon',
  version: '1.0.0',
  name: 'BBRGS TV',
  description:
    'BBRGS TV - +18 adult entertainment streaming addon. Browse movies and series, search the catalog and play from multiple stream sources.',
  logo: 'https://placehold.co/256x256/7b2cbf/ffffff?text=BBRGS',
  background: 'https://placehold.co/1920x1080/10002b/ffffff?text=BBRGS+TV',
  resources: ['catalog', 'meta', 'stream'],
  types: ['movie', 'series'],
  idPrefixes: ['bbrgs'],
  catalogs: [
    {
      type: 'movie',
      id: 'bbrgs-movies',
      name: 'BBRGS Movies',
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    },
    {
      type: 'series',
      id: 'bbrgs-series',
      name: 'BBRGS Series',
      extra: [
        { name: 'search', isRequired: false },
        { name: 'genre', isRequired: false },
        { name: 'skip', isRequired: false }
      ]
    }
  ],
  behaviorHints: {
    adult: true,
    configurable: false,
    configurationRequired: false
  }
};

module.exports = manifest;
