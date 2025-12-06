const express = require('express');
const router = express.Router();

/**
 * GET /api/torrent/:infoHash
 * Get torrent information and progress
 */
router.get('/:infoHash', (req, res, next) => {
    try {
        const { infoHash } = req.params;
        const { torrentManager, client } = req;

        // Get torrent from WebTorrent client
        const torrent = client.get(infoHash);
        if (!torrent) {
            res.status(404).json({ error: 'Torrent not found' });
            return;
        }

        // Get progress info
        const progress = torrentManager.getProgress(infoHash);

        res.json({
            name: torrent.name,
            infoHash: torrent.infoHash,
            magnetLink: torrent.magnetURI,
            size: torrent.length,
            files: torrent.files.map(f => ({
                name: f.name,
                size: f.length,
                path: f.path
            })),
            progress: progress
        });
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/torrent/:infoHash/progress
 * Get real-time progress of torrent download
 */
router.get('/:infoHash/progress', (req, res, next) => {
    try {
        const { infoHash } = req.params;
        const { torrentManager } = req;

        const progress = torrentManager.getProgress(infoHash);
        if (!progress) {
            res.status(404).json({ error: 'Torrent not found' });
            return;
        }

        res.json(progress);
    } catch (err) {
        next(err);
    }
});

/**
 * GET /api/torrent
 * Get list of all active torrents
 */
router.get('/', (req, res, next) => {
    try {
        const { torrentManager } = req;
        const torrents = torrentManager.getActiveTorrents();

        res.json({
            count: torrents.length,
            torrents
        });
    } catch (err) {
        next(err);
    }
});

/**
 * DELETE /api/torrent/:infoHash
 * Remove a torrent
 */
router.delete('/:infoHash', (req, res, next) => {
    try {
        const { infoHash } = req.params;
        const { torrentManager } = req;

        torrentManager.destroyTorrent(infoHash);

        res.json({
            success: true,
            message: `Torrent ${infoHash} removed`
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
