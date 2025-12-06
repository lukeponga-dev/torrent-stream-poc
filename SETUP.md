# Torrent Stream PoC - Development Guide

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- FFmpeg (for transcoding support)
- Git

### Installation & Running Locally

#### 1. Start the Backend Server
```bash
cd server
npm install
npm start
```
Server runs on `http://localhost:8080`

#### 2. Start the React Frontend (in another terminal)
```bash
cd client
npm install
npm start
```
Client runs on `http://localhost:3000`

### Environment Setup

Create `.env` files for configuration:

**server/.env:**
```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
TORRENT_TEMP_DIR=/tmp/torrents
MAX_TORRENTS=5
ENABLE_TRANSCODING=false
```

**client/.env:**
```env
REACT_APP_API_URL=http://localhost:8080
```

## Docker Deployment

Build and run with Docker Compose:
```bash
docker-compose up --build
```

Access the app at `http://localhost:3000`

## API Documentation

### Stream Endpoints

#### Add Torrent
```
POST /api/stream/add
Content-Type: application/json

{
  "magnet": "magnet:?xt=urn:btih:..."
}

Response:
{
  "success": true,
  "infoHash": "...",
  "name": "Torrent Name",
  "files": [
    { "index": 0, "name": "file.mp4", "size": 1024000 }
  ]
}
```

#### Stream Video File
```
GET /api/stream/:infoHash/:fileIndex
Accept-Ranges: bytes
Range: bytes=0-1023 (optional)

Returns: Video file stream
```

### Torrent Info Endpoints

#### Get Torrent Info
```
GET /api/torrent/:infoHash

Response:
{
  "name": "Torrent Name",
  "infoHash": "...",
  "size": 1024000,
  "files": [...],
  "progress": { ... }
}
```

#### Get Progress
```
GET /api/torrent/:infoHash/progress

Response:
{
  "downloaded": 512000,
  "uploaded": 1000,
  "total": 1024000,
  "progress": 0.5,
  "numPeers": 10,
  "downloadSpeed": 1024000,
  "uploadSpeed": 1000
}
```

#### List Active Torrents
```
GET /api/torrent

Response:
{
  "count": 2,
  "torrents": [
    {
      "name": "...",
      "infoHash": "...",
      "size": 1024000,
      "progress": 0.5,
      "numPeers": 10
    }
  ]
}
```

#### Remove Torrent
```
DELETE /api/torrent/:infoHash
```

## Architecture

```
┌─────────────────────────────────────────────┐
│         React Frontend (Port 3000)          │
│  - Stream Input (Magnet/Torrent File)       │
│  - Video Player (HTML5)                     │
│  - Torrent Info & Progress Display          │
└──────────────────┬──────────────────────────┘
                   │ HTTP/API Calls
                   ▼
┌─────────────────────────────────────────────┐
│      Express Backend (Port 8080)            │
│  - WebTorrent Client                        │
│  - Torrent Manager (Cache, Cleanup)         │
│  - HTTP Range Request Handler               │
│  - Error Handling & Security                │
└──────────────────┬──────────────────────────┘
                   │ P2P Protocol
                   ▼
        ┌─────────────────────────┐
        │    BitTorrent Network   │
        │  (Download from Peers)  │
        └─────────────────────────┘
```

## Key Features

✅ **BitTorrent Streaming**: Stream directly from torrent without full download
✅ **HTTP Range Requests**: Seek in video without downloading entire file
✅ **Multiple Video Support**: Select from multiple files in torrent
✅ **Real-time Progress**: Monitor download speed, peers, progress
✅ **Memory Efficient**: Automatic cleanup of old torrents
✅ **Security**: Rate limiting, magnet validation, path sanitization
✅ **Responsive UI**: Works on desktop and mobile

## Development Notes

### Adding New Routes
1. Create route file in `server/routes/`
2. Import in `server.js`
3. Use `req.torrentManager` to access torrent management

### Extending Functionality
- **Transcoding**: Use `server/utils/transcoding.js` for codec handling
- **Cleanup**: Scheduled cleanup runs via `server/utils/cleanup.js`
- **Security**: Rate limiting and validation in `server/utils/security.js`

### Debugging

Enable verbose logging:
```javascript
process.env.LOG_LEVEL = 'debug';
```

Check WebTorrent client:
```javascript
console.log(req.app._client.torrents); // List all active torrents
```

## Performance Optimization

### Memory Management
- Torrent cache with 1-hour TTL
- Automatic cleanup of torrents
- Configurable max concurrent torrents

### Network Optimization
- HTTP range requests for efficient seeking
- Stream directly without intermediate storage
- Peer-to-peer download

## Troubleshooting

### "Cannot find video file"
- Torrent may not contain playable video format
- Supported: MP4, MKV, AVI, MOV, WebM, M3U8, TS

### "Too many streaming requests"
- Rate limiting active (10 req/min per IP)
- Wait 1 minute before retrying

### Server crashes on large torrents
- Increase `MAX_TORRENTS` env variable
- Clear `/tmp/torrents` directory
- Restart server

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Submit pull request with description

## License

MIT License - See LICENSE file

## Disclaimer

⚠️ This is a proof-of-concept. Only stream content you have the legal rights to stream.
Respect copyright laws in your jurisdiction.
