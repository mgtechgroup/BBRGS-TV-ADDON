# BBRGS-TV-ADDON

## Overview

BBRGS-TV-ADDON is a **+18 Stremio streaming addon** that provides adult entertainment content with multiple streaming sources, search capabilities, and a complete metadata system.

## Features

✅ **Browse Movies & Series** - Complete adult content catalog  
✅ **Search & Filter** - Find content by title, genre  
✅ **Multiple Stream Sources** - Primary, backup, and external sources  
✅ **Series Support** - Full season/episode navigation  
✅ **Metadata Display** - Titles, descriptions, ratings, genres  
✅ **RESTful API** - Full HTTP interface  
✅ **Docker Ready** - Container support  
✅ **Health Checks** - Built-in status monitoring  

## Installation

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn
- Stremio application (https://stremio.com)

### Setup

```bash
# Clone repository
git clone https://github.com/mgtechgroup/BBRGS-TV-ADDON.git
cd BBRGS-TV-ADDON

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start server
npm start
```

## Development

```bash
# Install with dev dependencies
npm install --include=dev

# Start with auto-reload
npm run dev

# Run tests
npm run test
```

## Docker

```bash
# Build image
npm run docker:build

# Run container
npm run docker:run

# Access at http://localhost:8080
```

## API Endpoints

### Health Check
```
GET http://localhost:8080/health
```

### Addon Info
```
GET http://localhost:8080/addon
```

### Stremio Manifest
```
GET http://localhost:8080/manifest.json
```

### Catalog
```
GET http://localhost:8080/catalog/{type}/{id}.json
```

### Streams
```
GET http://localhost:8080/stream/{type}/{id}.json
```

### Metadata
```
GET http://localhost:8080/meta/{type}/{id}.json
```

## Stremio Installation

1. Go to http://localhost:8080
2. Click "Install in Stremio"
3. Or manually add: `http://localhost:8080/manifest.json`

## Configuration

Edit `.env` file to configure:

- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment (development/production)
- `REDIS_ENABLED` - Enable caching
- `LOG_LEVEL` - Logging level

## Project Structure

```
BBRGS-TV-ADDON/
├── addon.js              # Main server entry point
├── lib/
│   ├── manifest.js       # Stremio addon manifest
│   ├── catalog.js        # Catalog handler
│   ├── streams.js        # Stream handler
│   ├── meta.js           # Metadata handler
│   └── data.js           # Sample content data
├── utils/                # Utilities (logging, caching)
├── test/                 # Test files
├── package.json          # Dependencies
├── Dockerfile            # Docker configuration
└── README.md             # This file
```

## Content Catalog

The addon comes with sample adult content. To add custom content:

1. Edit `lib/data.js`
2. Add movie/series objects with required fields:
   - `id` - Unique identifier
   - `name` - Display name
   - `poster` - Poster image URL
   - `description` - Content description
   - `year` - Release year
   - `genres` - Content genres

## Stream Sources

The addon supports multiple stream sources:

1. **Primary Stream** - Direct BBRGS hosting
2. **Backup Stream** - Redundant source
3. **External Sources** - Third-party stream integration

To add stream sources, modify `lib/streams.js`:

```javascript
streams.push({
  name: "Source Name",
  title: "Quality/Info",
  url: "https://stream-url.com/video.m3u8",
  quality: "HD",
  type: "http"
});
```

## Security

⚠️ **Content Warning**: This addon is designed for +18 adult content only.

- All streams use HTTPS encryption
- API keys stored in environment variables
- CORS configured for security
- No sensitive data in logs

## Troubleshooting

### Port Already in Use
```bash
# Use different port
PORT=8081 npm start
```

### Redis Connection Error
Disable Redis in `.env`:
```
REDIS_ENABLED=false
```

### Addon Not Appearing in Stremio
1. Ensure server is running: `http://localhost:8080/health`
2. Check manifest JSON: `http://localhost:8080/manifest.json`
3. Restart Stremio application
4. Check browser console for errors

### Streams Not Loading
1. Check stream URLs are valid
2. Verify CORS settings in addon.js
3. Check external API responses
4. Review logs for errors

## Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit pull request

## License

MIT License - See LICENSE file for details

## Support

For issues, feature requests, or questions:
- Open GitHub issue: https://github.com/mgtechgroup/BBRGS-TV-ADDON/issues
- Email: support@bbrgs.tv

## Disclaimer

This addon is provided as-is for educational purposes. Users are responsible for legal compliance in their jurisdiction regarding adult content.

---

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Last Updated**: 2026-09-17
