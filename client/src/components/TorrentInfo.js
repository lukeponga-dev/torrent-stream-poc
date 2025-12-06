import React, { useState, useEffect } from 'react';
import './TorrentInfo.css';

function TorrentInfo({ torrentData, progress }) {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    const formatSpeed = (bytesPerSecond) => {
        return formatBytes(bytesPerSecond) + '/s';
    };

    if (!torrentData) {
        return <div className="torrent-info empty">No torrent loaded</div>;
    }

    const progressPercent = progress ? (progress.progress * 100).toFixed(2) : 0;

    return (
        <div className="torrent-info">
            <div className="torrent-header">
                <h3>📦 {torrentData.name}</h3>
                <span className="torrent-size">{formatBytes(torrentData.size)}</span>
            </div>

            {progress && (
                <div className="progress-section">
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${progressPercent}%` }}
                        >
                            <span className="progress-text">{progressPercent}%</span>
                        </div>
                    </div>

                    <div className="progress-stats">
                        <div className="stat">
                            <span className="stat-label">⬇️ Downloaded:</span>
                            <span className="stat-value">{formatBytes(progress.downloaded)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">⬆️ Speed:</span>
                            <span className="stat-value">{formatSpeed(progress.downloadSpeed)}</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">👥 Peers:</span>
                            <span className="stat-value">{progress.numPeers}</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="files-section">
                <h4>📁 Files ({torrentData.files?.length || 0})</h4>
                <div className="files-list">
                    {torrentData.files?.map((file, idx) => (
                        <div key={idx} className="file-item">
                            <button
                                className="file-button"
                                onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                            >
                                <span className="file-icon">
                                    {expandedIndex === idx ? '▼' : '▶'}
                                </span>
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{formatBytes(file.size)}</span>
                            </button>

                            {expandedIndex === idx && (
                                <div className="file-details">
                                    <p><strong>Path:</strong> {file.path}</p>
                                    <p><strong>Size:</strong> {formatBytes(file.size)}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default TorrentInfo;
