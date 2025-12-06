const fs = require('fs');
const path = require('path');

/**
 * Clean up temporary torrent files
 * @param {string} tempDir - Temporary directory path
 * @param {number} maxAgeMs - Maximum age of files in milliseconds (default: 24 hours)
 */
async function cleanupTempDir(tempDir, maxAgeMs = 24 * 60 * 60 * 1000) {
    try {
        if (!fs.existsSync(tempDir)) {
            console.log(`[Cleanup] Temp directory does not exist: ${tempDir}`);
            return;
        }

        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        let removedCount = 0;

        for (const file of files) {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            const age = now - stats.mtimeMs;

            if (age > maxAgeMs) {
                try {
                    if (stats.isDirectory()) {
                        fs.rmSync(filePath, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(filePath);
                    }
                    removedCount++;
                    console.log(`[Cleanup] Removed: ${file}`);
                } catch (err) {
                    console.error(`[Cleanup Error] Failed to remove ${file}: ${err.message}`);
                }
            }
        }

        console.log(`[Cleanup] Removed ${removedCount} old file(s)`);
    } catch (err) {
        console.error(`[Cleanup Error] ${err.message}`);
    }
}

/**
 * Schedule periodic cleanup
 * @param {string} tempDir - Temporary directory path
 * @param {number} intervalMs - Cleanup interval in milliseconds (default: 1 hour)
 */
function scheduleCleanup(tempDir, intervalMs = 60 * 60 * 1000) {
    console.log(`[Cleanup] Scheduling cleanup every ${intervalMs / 1000 / 60} minutes`);

    setInterval(() => {
        cleanupTempDir(tempDir);
    }, intervalMs);
}

module.exports = {
    cleanupTempDir,
    scheduleCleanup
};
