# 🚀 Quick Reference Guide

## Project Overview

Complete torrent streaming PoC with:
- 📡 P2P BitTorrent support
- 🎬 Browser-based video player
- 📊 Real-time progress tracking
- 🔐 Security & rate limiting
- 🐳 Docker ready

## File Structure at a Glance

```
torrent-stream-poc/
├── 📄 Documentation
│   ├── README.md          ← Start here!
│   ├── SETUP.md           ← Development guide
│   ├── DEVELOPMENT.md     ← Technical notes
│   ├── LEGAL.md           ← Important legal info
│   ├── COMPLETED.md       ← What was created
│   └── LICENSE            ← MIT License
│
├── 🖥️ Backend (Node.js)
│   └── server/
│       ├── server.js              ← Main server
│       ├── package.json           ← Dependencies
│       ├── Dockerfile             ← Docker image
│       ├── .env.example           ← Config template
│       ├── routes/
│       │   ├── stream.js          ← Streaming API
│       │   └── info.js            ← Torrent info API
│       └── utils/
│           ├── torrentManager.js  ← Torrent mgmt
│           ├── errorHandler.js    ← Error handling
│           ├── transcoding.js     ← FFmpeg support
│           ├── cleanup.js         ← Auto cleanup
│           └── security.js        ← Rate limit & validation
│
├── 💻 Frontend (React)
│   └── client/
│       ├── package.json           ← Dependencies
│       ├── Dockerfile             ← Docker image
│       ├── .env.example           ← Config template
│       ├── public/
│       │   └── index.html         ← HTML template
│       └── src/
│           ├── App.js             ← Main component
│           ├── index.js           ← Entry point
│           ├── App.css            ← Styles
│           ├── index.css          ← Global styles
│           └── components/
│               ├── StreamInput.js    ← Magnet/torrent input
│               ├── VideoPlayer.js    ← Video player
│               ├── TorrentInfo.js    ← Progress display
│               ├── StreamInput.css   ← Input styles
│               ├── VideoPlayer.css   ← Player styles
│               └── TorrentInfo.css   ← Info styles
│
├── 🐳 Deployment
│   ├── docker-compose.yml  ← Full stack
│   └── .gitignore          ← Git ignore rules
```

## Quick Commands

### 💻 Local Development
```bash
# Install & start backend
cd server && npm install && npm start

# In another terminal, start frontend
cd client && npm install && npm start

# Opens http://localhost:3000
```

### 🐳 Docker Deployment
```bash
docker-compose up --build
# Visit http://localhost:3000
```

### 🔍 Check Services
```bash
# Backend health check
curl http://localhost:8080/health

# List active torrents
curl http://localhost:8080/api/torrent

# Get torrent progress
curl http://localhost:8080/api/torrent/:infoHash/progress
```

## API Endpoints

### Streaming
- `POST /api/stream/add` - Add torrent by magnet link
- `GET /api/stream/:infoHash/:fileIndex` - Stream video file (supports HTTP Range)

### Torrent Info
- `GET /api/torrent` - List all active torrents
- `GET /api/torrent/:infoHash` - Get torrent details
- `GET /api/torrent/:infoHash/progress` - Get download progress
- `DELETE /api/torrent/:infoHash` - Remove torrent

## Environment Variables

### Server (.env in server/)
```env
PORT=8080
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
TORRENT_TEMP_DIR=/tmp/torrents
MAX_TORRENTS=5
ENABLE_TRANSCODING=false
```

### Client (.env in client/)
```env
REACT_APP_API_URL=http://localhost:8080
```

## Key Files & What They Do

| File | Purpose |
|------|---------|
| `server.js` | Main Express server, starts P2P client |
| `torrentManager.js` | Manages torrent lifecycle, caching, cleanup |
| `stream.js` | Handles HTTP streaming with range requests |
| `info.js` | Returns torrent info and progress |
| `errorHandler.js` | Centralized error handling |
| `security.js` | Rate limiting and input validation |
| `transcoding.js` | FFmpeg codec handling (optional) |
| `App.js` | Main React component, API integration |
| `StreamInput.js` | Magnet/torrent file input UI |
| `VideoPlayer.js` | HTML5 video player component |
| `TorrentInfo.js` | Progress and file list display |

## How It Works

```
1. User enters magnet link in StreamInput
        ↓
2. Frontend sends POST /api/stream/add
        ↓
3. Backend adds torrent via WebTorrent
        ↓
4. Backend finds video files, returns list
        ↓
5. User selects file, frontend generates stream URL
        ↓
6. VideoPlayer makes GET /api/stream/:hash/:fileIndex
        ↓
7. Backend serves video stream (supports HTTP Range for seeking)
        ↓
8. Real-time progress updates via polling GET /api/torrent/:hash/progress
        ↓
9. UI updates with download speed, peers, progress %
```

## Features Checklist

- ✅ Add torrents via magnet link
- ✅ Select & stream multiple files
- ✅ HTTP range requests (seek without full download)
- ✅ Real-time progress tracking
- ✅ Peer statistics display
- ✅ Download speed monitoring
- ✅ Auto-cleanup of old torrents
- ✅ Rate limiting for security
- ✅ Input validation
- ✅ Error handling
- ✅ Responsive UI
- ✅ Docker containerization
- ✅ CORS protection
- ✅ FFmpeg support (optional)

## Deployment Steps

1. **Set environment variables**
   ```bash
   cd server && cp .env.example .env
   cd ../client && cp .env.example .env
   ```

2. **Install dependencies**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Or run locally**
   ```bash
   # Terminal 1
   cd server && npm start
   
   # Terminal 2
   cd client && npm start
   ```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot find video" | Torrent has unsupported codec. Use MP4, MKV, AVI, MOV, WebM, M3U8, TS |
| "Too many requests" | Rate limit hit (10/min). Wait 1 minute |
| "CORS error" | Check `CORS_ORIGIN` env var matches client URL |
| "Port in use" | `lsof -i :8080` and `kill -9 <PID>` |
| "No disk space" | `rm -rf /tmp/torrents/*` |
| Server crashes | Reduce `MAX_TORRENTS` or increase memory |

## Key Technologies

**Backend:**
- Node.js, Express.js
- WebTorrent (P2P)
- node-cache
- FFmpeg (optional)

**Frontend:**
- React 18
- Axios
- HTML5 Video
- CSS Grid

**DevOps:**
- Docker
- Docker Compose

## Documentation Map

| Document | Read for... |
|----------|------------|
| **README.md** | Project overview, features, quick start |
| **SETUP.md** | Complete setup guide, API docs, architecture |
| **DEVELOPMENT.md** | Technical details, implementation notes |
| **LEGAL.md** | Legal disclaimer (IMPORTANT!) |
| **COMPLETED.md** | What was created, features list |
| **LICENSE** | MIT License with disclaimer |

## Security Features

✅ Rate limiting (10 req/min)
✅ Magnet link validation
✅ Path sanitization
✅ CORS protection
✅ Error handling
✅ Input validation

## Performance Features

✅ Torrent caching (1-hour TTL)
✅ Auto cleanup of old files
✅ Configurable concurrency
✅ HTTP range requests
✅ Stream without buffering
✅ Memory efficient

## Next Steps

1. Read `README.md` for overview
2. Follow `SETUP.md` for local setup
3. Start backend: `cd server && npm start`
4. Start frontend: `cd client && npm start`
5. Visit `http://localhost:3000`
6. Try with public domain or test torrent
7. Review `LEGAL.md` before using with real content

---

**Everything you need for a production-ready torrent streaming PoC! 🚀**
