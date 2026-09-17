'use strict';

/**
 * Sample content catalog (+18).
 *
 * Replace / extend these entries with your own catalog. Required fields:
 *   id, name, poster, description, year, genres
 * Optional fields:
 *   background, logo, runtime, director, cast, imdbRating
 *
 * Series additionally carry a `videos` array (season/episode navigation).
 */

const poster = (text) =>
  `https://placehold.co/300x450/3c096c/ffffff?text=${encodeURIComponent(text)}`;

const movies = [
  {
    id: 'bbrgs-movie-1',
    type: 'movie',
    name: 'Midnight Lounge',
    poster: poster('Midnight Lounge'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=Midnight+Lounge',
    description: 'Sample feature presentation from the BBRGS library. For adults only (+18).',
    year: 2024,
    genres: ['Romance', 'Drama'],
    runtime: '92 min',
    imdbRating: '7.1'
  },
  {
    id: 'bbrgs-movie-2',
    type: 'movie',
    name: 'After Hours',
    poster: poster('After Hours'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=After+Hours',
    description: 'Sample feature presentation from the BBRGS library. For adults only (+18).',
    year: 2023,
    genres: ['Drama', 'Thriller'],
    runtime: '104 min',
    imdbRating: '6.8'
  },
  {
    id: 'bbrgs-movie-3',
    type: 'movie',
    name: 'Velvet Nights',
    poster: poster('Velvet Nights'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=Velvet+Nights',
    description: 'Sample feature presentation from the BBRGS library. For adults only (+18).',
    year: 2025,
    genres: ['Romance'],
    runtime: '88 min',
    imdbRating: '7.4'
  },
  {
    id: 'bbrgs-movie-4',
    type: 'movie',
    name: 'City of Neon',
    poster: poster('City of Neon'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=City+of+Neon',
    description: 'Sample feature presentation from the BBRGS library. For adults only (+18).',
    year: 2022,
    genres: ['Thriller'],
    runtime: '110 min',
    imdbRating: '6.5'
  }
];

const series = [
  {
    id: 'bbrgs-series-1',
    type: 'series',
    name: 'The Penthouse',
    poster: poster('The Penthouse'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=The+Penthouse',
    description: 'Sample series from the BBRGS library. For adults only (+18).',
    year: 2024,
    genres: ['Drama', 'Romance'],
    imdbRating: '7.6',
    videos: [
      {
        id: 'bbrgs-series-1:1:1',
        title: 'Episode 1 - Check-In',
        season: 1,
        episode: 1,
        released: '2024-01-05T00:00:00.000Z',
        overview: 'Series premiere.',
        thumbnail: poster('S01E01')
      },
      {
        id: 'bbrgs-series-1:1:2',
        title: 'Episode 2 - Room Service',
        season: 1,
        episode: 2,
        released: '2024-01-12T00:00:00.000Z',
        overview: 'The story continues.',
        thumbnail: poster('S01E02')
      },
      {
        id: 'bbrgs-series-1:2:1',
        title: 'Episode 1 - New Floor',
        season: 2,
        episode: 1,
        released: '2025-02-07T00:00:00.000Z',
        overview: 'Season two premiere.',
        thumbnail: poster('S02E01')
      }
    ]
  },
  {
    id: 'bbrgs-series-2',
    type: 'series',
    name: 'Night Shift',
    poster: poster('Night Shift'),
    background: 'https://placehold.co/1920x1080/240046/ffffff?text=Night+Shift',
    description: 'Sample series from the BBRGS library. For adults only (+18).',
    year: 2023,
    genres: ['Thriller'],
    imdbRating: '7.0',
    videos: [
      {
        id: 'bbrgs-series-2:1:1',
        title: 'Episode 1 - Clock In',
        season: 1,
        episode: 1,
        released: '2023-06-02T00:00:00.000Z',
        overview: 'Series premiere.',
        thumbnail: poster('S01E01')
      },
      {
        id: 'bbrgs-series-2:1:2',
        title: 'Episode 2 - Overtime',
        season: 1,
        episode: 2,
        released: '2023-06-09T00:00:00.000Z',
        overview: 'The night gets longer.',
        thumbnail: poster('S01E02')
      }
    ]
  }
];

/** All catalog genres, used for the genre filter. */
const genres = [...new Set([...movies, ...series].flatMap((item) => item.genres || []))].sort();

module.exports = { movies, series, genres };
