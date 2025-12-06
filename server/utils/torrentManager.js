const NodeCache = require('node-cache');
const fs = require('fs');
const path = require('path');

class TorrentManager {
    constructor(client, maxTorrents = 5) {
        this.client = client;
        this.maxTorrents = maxTorrents;
        this.cache = new NodeCache({ stdTTL: 3600 }); // 1-hour TTL
        this.tempDir = process.env.TORRENT_TEMP_DIR || '/tmp/torrents';

        // Ensure temp directory exists
        if (!fs.existsSync(this.tempDir)) {
            fs.mkdirSync(this.tempDir, { recursive: true });
        }
    }

    /**
     * Add a torrent and manage cache
     * @param {string} magnet - Magnet link or torrent file
     * @returns {Promise<object>} Torrent object
     */
    async addTorrent(magnet) {
        const existing = this.cache.get(magnet);
        if (existing) {
            console.log(`[Cache Hit] Torrent already loaded`);
            return existing;
        }

        // Enforce max torrents limit
        if (this.client.torrents.length >= this.maxTorrents) {
            const oldest = this.client.torrents[0];
            console.log(`[Cleanup] Removing oldest torrent to respect max limit`);
            this.destroyTorrent(oldest.infoHash);
        }

        return new Promise((resolve, reject) => {
            try {
                this.client.add(magnet, {
                    path: this.tempDir
                }, (torrent) => {
                    console.log(`[Added] Torrent: ${torrent.name}`);
                    this.cache.set(magnet, torrent);

                    // Listen for errors
                    torrent.on('error', (err) => {
                        console.error(`[Error] Torrent error: ${err.message}`);
                    });

                    resolve(torrent);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    /**
     * Find video files in a torrent
     * @param {object} torrent - Torrent object
     * @returns {array} Array of video files
     */
    findVideoFiles(torrent) {
        const videoExtensions = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.m3u8', '.ts'];
        return torrent.files.filter(file =>
            videoExtensions.some(ext => file.name.toLowerCase().endsWith(ext))
        );
    }

    /**
     * Get torrent progress
     * @param {string} infoHash - Torrent info hash
     * @returns {object} Progress info
     */
    getProgress(infoHash) {
        const torrent = this.client.get(infoHash);
        if (!torrent) return null;

        return {
            downloaded: torrent.downloaded,
            uploaded: torrent.uploaded,
            total: torrent.length,
            progress: torrent.progress,
            numPeers: torrent.numPeers,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed
        };
    }

    /**
     * Destroy a torrent and clean up
     * @param {string} infoHash - Torrent info hash
     */
    destroyTorrent(infoHash) {
        const torrent = this.client.get(infoHash);
        if (torrent) {
            torrent.destroy({ delay: 100 }, (err) => {
                if (err) console.error(`[Error] Failed to destroy torrent: ${err.message}`);
                else console.log(`[Removed] Torrent destroyed: ${torrent.name}`);
            });
        }
    }

    /**
     * Cleanup all torrents
     */
    cleanup() {
        console.log(`[Cleanup] Destroying all torrents...`);
        this.client.torrents.forEach(t => this.destroyTorrent(t.infoHash));
        this.cache.flushAll();
    }

    /**
     * Get list of active torrents
     * @returns {array} Array of torrent info
     */
    getActiveTorrents() {
        return this.client.torrents.map(t => ({
            name: t.name,
            infoHash: t.infoHash,
            size: t.length,
            progress: t.progress,
            numPeers: t.numPeers
        }));
    }
}

module.exports = TorrentManager;
