const express = require('express');
const router = express.Router();
const { streamLimiter, isValidMagnet, sanitizeFilePath } = require('../utils/security');

/**
 * GET /api/stream/:infoHash/:fileIndex
 * Stream a file from a torrent with HTTP range request support
 */
router.get('/:infoHash/:fileIndex', streamLimiter, (req, res, next) => {
    try {
        const { infoHash, fileIndex } = req.params;
        const { torrentManager, client } = req;

        // Get torrent from WebTorrent client
        const torrent = client.get(infoHash);
        if (!torrent) {
            const err = new Error('Torrent not found');
            err.status = 404;
            return next(err);
        }

        // Get file from torrent
        const file = torrent.files[parseInt(fileIndex)];
        if (!file) {
            const err = new Error('File not found in torrent');
            err.status = 404;
            return next(err);
        }

        // Get file size
        const fileSize = file.length;
        const range = req.headers.range;

        if (range) {
            // Handle HTTP range requests for seeking
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (start >= fileSize || end >= fileSize || start > end) {
                res.status(416).set('Content-Range', `bytes */${fileSize}`);
                return res.end();
            }

            const chunkSize = end - start + 1;

            res.status(206);
            res.set({
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4'
            });

            file.createReadStream({ start, end }).pipe(res);
        } else {
            // Send full file
            res.set({
                'Accept-Ranges': 'bytes',
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4'
            });

            file.createReadStream().pipe(res);
        }
    } catch (err) {
        next(err);
    }
});

/**
 * POST /api/stream/add
 * Add a torrent by magnet link
 */
router.post('/add', express.json(), async (req, res, next) => {
    try {
        const { magnet } = req.body;
        const { torrentManager } = req;

        if (!magnet) {
            const err = new Error('Magnet link required');
            err.status = 400;
            return next(err);
        }

        if (!isValidMagnet(magnet)) {
            const err = new Error('Invalid magnet link format');
            err.status = 400;
            return next(err);
        }

        const torrent = await torrentManager.addTorrent(magnet);

        // Find video files
        const videoFiles = torrentManager.findVideoFiles(torrent);
        if (videoFiles.length === 0) {
            const err = new Error('No video file found');
            err.status = 400;
            return next(err);
        }

        res.json({
            success: true,
            infoHash: torrent.infoHash,
            name: torrent.name,
            files: videoFiles.map((f, idx) => ({
                index: torrent.files.indexOf(f),
                name: f.name,
                size: f.length
            }))
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
