require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const WebTorrent = require('webtorrent');
const TorrentManager = require('./utils/torrentManager');
const errorHandler = require('./utils/errorHandler');
const streamRoutes = require('./routes/stream');
const infoRoutes = require('./routes/info');

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize WebTorrent client
const client = new WebTorrent();

// Initialize Torrent Manager
const torrentManager = new TorrentManager(client, process.env.MAX_TORRENTS || 5);

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
}));
app.use(express.json());

// Make torrentManager and client available to routes
app.use((req, res, next) => {
    req.torrentManager = torrentManager;
    req.client = client;
    next();
});

// Routes
app.use('/api/stream', streamRoutes);
app.use('/api/torrent', infoRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', torrents: client.torrents.length });
});

// Error handling
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    torrentManager.cleanup();
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log(`🎬 Torrent Stream Server running on http://localhost:${PORT}`);
    console.log(`📁 Temp directory: ${process.env.TORRENT_TEMP_DIR || '/tmp/torrents'}`);
    console.log(`🔄 Max concurrent torrents: ${process.env.MAX_TORRENTS || 5}`);
});

module.exports = app;
