/**
 * Express error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('[Error]', {
        message: err.message,
        path: req.path,
        method: req.method,
        stack: err.stack
    });

    // Handle specific error types
    if (err.message.includes('No video file found')) {
        return res.status(404).json({
            error: 'No playable video file found in torrent',
            details: 'Supported formats: mp4, mkv, avi, mov, webm, m3u8, ts'
        });
    }

    if (err.message.includes('Range not satisfiable')) {
        return res.status(416).json({
            error: 'Invalid byte range',
            details: 'The requested range is not valid for this file'
        });
    }

    if (err.message.includes('Torrent not found')) {
        return res.status(404).json({
            error: 'Torrent not found',
            details: 'The torrent is not currently loaded'
        });
    }

    if (err.message.includes('File not found')) {
        return res.status(404).json({
            error: 'File not found in torrent',
            details: 'The requested file does not exist'
        });
    }

    if (err.code === 'ENOSPC') {
        return res.status(507).json({
            error: 'Insufficient storage space',
            details: 'Not enough space to download torrent'
        });
    }

    // Default error response
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error',
        requestId: req.id
    });
};

module.exports = errorHandler;
