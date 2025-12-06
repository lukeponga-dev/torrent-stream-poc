# 🎬 Torrent Stream PoC

> A proof-of-concept P2P torrent streaming application with browser-based video playback, real-time progress tracking, and HTTP range request support.

## ✨ Features

- **🎥 Direct Streaming**: Stream torrents directly without full download
- **📡 P2P Architecture**: Leverage BitTorrent for efficient content delivery
- **⏩ Smart Seeking**: HTTP range requests enable scrubbing without download
- **📊 Real-time Stats**: Monitor download speed, peers, and progress
- **🎯 Multi-file Support**: Select and stream from multiple files in a torrent
- **🔐 Security First**: Rate limiting, validation, and path sanitization
- **📱 Responsive Design**: Works seamlessly on desktop and mobile
- **🐳 Containerized**: Docker setup for easy deployment
- **⚡ Optimized**: Automatic cleanup and memory management

## 🏗️ Architecture

```
┌──────────────────────┐
│  React Frontend      │
│  (Browser-based)     │
└──────────┬───────────┘
           │ HTTP API
           ▼
┌──────────────────────┐
│  Express Backend     │
│  + WebTorrent        │
│  + Stream Manager    │
└──────────┬───────────┘
           │ P2P Protocol
           ▼
┌──────────────────────┐
│ BitTorrent Network   │
└──────────────────────┘
```

## 📂 Project Structure

```
torrent-stream-poc/
├── server/                      # Node.js + Express backend
│   ├── package.json
│   ├── server.js               # Main server
│   ├── Dockerfile
│   ├── .env.example
│   ├── routes/
│   │   ├── stream.js           # Stream endpoints
│   │   └── info.js             # Torrent info endpoints
│   └── utils/
│       ├── torrentManager.js   # Torrent lifecycle management
│       ├── errorHandler.js     # Error handling middleware
│       ├── transcoding.js      # FFmpeg integration
│       ├── cleanup.js          # Periodic cleanup
│       └── security.js         # Rate limiting & validation
│
├── client/                      # React frontend
│   ├── package.json
│   ├── Dockerfile
│   ├── .env.example
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js              # Main app component
│       ├── App.css
│       ├── components/
│       │   ├── StreamInput.js  # Magnet/torrent input
│       │   ├── VideoPlayer.js  # HTML5 video player
│       │   └── TorrentInfo.js  # Progress & file list
│       ├── index.js
│       └── index.css
│
├── docker-compose.yml          # Docker orchestration
├── README.md                   # This file
├── SETUP.md                    # Development guide
├── LEGAL.md                    # Legal notice
└── LICENSE                     # MIT License
```

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Docker & Docker Compose (optional)
- FFmpeg (optional, for transcoding)

### Local Development

#### 1. Install & Start Backend
```bash
cd server
npm install
npm start
```
Backend runs on `http://localhost:8080`

#### 2. Install & Start Frontend (new terminal)
```bash
cd client
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### Docker Deployment

```bash
docker-compose up --build
```

Then open `http://localhost:3000` in your browser.

## 📖 Usage

1. **Add Torrent**: Enter a magnet link or upload a `.torrent` file
2. **Select File**: Choose which file to stream from the torrent
3. **Play**: Video player supports seeking, play/pause, volume control
4. **Monitor**: Watch download progress and peer statistics in real-time

## 🔗 API Documentation

### Stream Management

#### Add Torrent
```http
POST /api/stream/add
Content-Type: application/json

{
  "magnet": "magnet:?xt=urn:btih:..."
}
```

#### Stream Video
```http
GET /api/stream/:infoHash/:fileIndex
Range: bytes=0-1023  # Optional for seeking
```

### Torrent Info

#### Get Torrent Details
```http
GET /api/torrent/:infoHash
```

#### Get Real-time Progress
```http
GET /api/torrent/:infoHash/progress
```

#### List Active Torrents
```http
GET /api/torrent
```

#### Remove Torrent
```http
DELETE /api/torrent/:infoHash
```

## ⚙️ Configuration

### Server Environment Variables

```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
TORRENT_TEMP_DIR=/tmp/torrents
MAX_TORRENTS=5
ENABLE_TRANSCODING=false
LOG_LEVEL=info
```

### Client Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080
```

## 🔧 Key Technologies

### Backend
- **Express.js** - Web framework
- **WebTorrent** - BitTorrent client
- **Node Cache** - Torrent caching
- **FFmpeg** - Media transcoding (optional)
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Axios** - HTTP client
- **HTML5 Video** - Native video player

## 🛡️ Security Features

- ✅ **Rate Limiting**: 10 requests/min for streaming
- ✅ **Input Validation**: Magnet link format checking
- ✅ **Path Sanitization**: Prevents directory traversal
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **Error Handling**: Comprehensive error responses

## 📊 Performance

- **Concurrent Torrents**: Configurable (default: 5)
- **Cache TTL**: 1 hour for loaded torrents
- **Auto Cleanup**: Removes old torrents periodically
- **Range Requests**: Efficient seeking without full download
- **Memory Efficient**: Streams data without buffering entire file

## 🐛 Troubleshooting

### "No video file found"
- Torrent may contain non-standard codec
- Supported formats: MP4, MKV, AVI, MOV, WebM, M3U8, TS

### "Too many requests"
- Rate limiting active (10/min per IP)
- Wait before retrying

### CORS errors
- Ensure `CORS_ORIGIN` environment variable is set correctly
- Check backend is running on correct port

### Server crashes on large torrents
- Reduce `MAX_TORRENTS` value
- Increase system memory
- Clear `/tmp/torrents` directory

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Make changes and test
4. Submit pull request

## ⚖️ Legal Notice

**IMPORTANT**: This is a proof-of-concept for educational purposes.

- ✅ Stream only content you have legal rights to stream
- ✅ Respect copyright and intellectual property laws
- ✅ Comply with local regulations
- ✅ Use with public domain or licensed content

See `LEGAL.md` for complete legal disclaimer.

## 📝 License

MIT License - See `LICENSE` file for details

## 🙏 Acknowledgments

- [WebTorrent](https://webtorrent.io/) - Amazing P2P streaming library
- [Express.js](https://expressjs.com/) - Flexible web framework
- [React](https://react.dev/) - Powerful UI library

## 📞 Support

For issues, questions, or suggestions:
1. Check `SETUP.md` for development guide
2. Review `LEGAL.md` for legal concerns
3. Open an issue on GitHub

---

**Made with ❤️ for educational and research purposes**

*Last Updated: December 2024*