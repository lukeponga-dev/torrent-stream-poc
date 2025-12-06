const rateLimit = require('express-rate-limit');

/**
 * Rate limiter for streaming endpoints
 * Limits to 10 requests per minute per IP
 */
const streamLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: 'Too many streaming requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

/**
 * Rate limiter for torrent addition
 * Limits to 5 requests per minute per IP
 */
const addTorrentLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many torrent requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Validate magnet link format
 * @param {string} magnet - Potential magnet link
 * @returns {boolean} Whether the string is a valid magnet link
 */
function isValidMagnet(magnet) {
    return /^magnet:\?xt=urn:btih:[a-z0-9]{32,40}/i.test(magnet);
}

/**
 * Sanitize file path to prevent directory traversal
 * @param {string} filePath - File path to sanitize
 * @returns {string} Sanitized path
 */
function sanitizeFilePath(filePath) {
    // Remove any path traversal attempts
    return filePath.replace(/\.\./g, '').replace(/^\/+/, '');
}

module.exports = {
    streamLimiter,
    addTorrentLimiter,
    isValidMagnet,
    sanitizeFilePath
};
