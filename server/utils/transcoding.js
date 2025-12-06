const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

/**
 * Transcode a torrent file stream to a specific format
 * @param {Stream} inputStream - Input file stream from torrent
 * @param {string} outputFormat - Target format (mp4, webm, etc.)
 * @param {object} options - Additional ffmpeg options
 * @returns {Stream} Transcoded output stream
 */
function transcodeTorrentStream(inputStream, outputFormat = 'mp4', options = {}) {
    return new Promise((resolve, reject) => {
        try {
            const command = ffmpeg(inputStream)
                .toFormat(outputFormat)
                .on('error', (err) => {
                    console.error(`[FFmpeg Error] ${err.message}`);
                    reject(err);
                })
                .on('end', () => {
                    console.log(`[FFmpeg] Transcoding completed to ${outputFormat}`);
                    resolve();
                });

            // Apply custom options if provided
            if (options.videoCodec) {
                command.videoCodec(options.videoCodec);
            }
            if (options.audioCodec) {
                command.audioCodec(options.audioCodec);
            }
            if (options.bitrate) {
                command.videoBitrate(options.bitrate);
            }

            resolve(command);
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * Get media information using ffprobe
 * @param {string} filePath - Path to the media file
 * @returns {Promise<object>} Media metadata
 */
function getMediaInfo(filePath) {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) {
                console.error(`[FFprobe Error] ${err.message}`);
                reject(err);
            } else {
                resolve({
                    duration: metadata.format.duration,
                    bitrate: metadata.format.bit_rate,
                    size: metadata.format.size,
                    streams: metadata.streams.map(stream => ({
                        type: stream.codec_type,
                        codec: stream.codec_name,
                        width: stream.width,
                        height: stream.height,
                        fps: stream.r_frame_rate,
                        language: stream.tags?.language
                    }))
                });
            }
        });
    });
}

/**
 * Check if transcoding is needed
 * @param {object} mediaInfo - Media metadata from getMediaInfo
 * @returns {boolean} Whether transcoding is needed
 */
function isTranscodingNeeded(mediaInfo) {
    const supportedCodecs = ['h264', 'vp8', 'vp9', 'av1'];
    const videoStream = mediaInfo.streams.find(s => s.type === 'video');

    return videoStream && !supportedCodecs.includes(videoStream.codec);
}

module.exports = {
    transcodeTorrentStream,
    getMediaInfo,
    isTranscodingNeeded
};
