import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StreamInput from './components/StreamInput';
import VideoPlayer from './components/VideoPlayer';
import TorrentInfo from './components/TorrentInfo';
import './App.css';

function App() {
    const [torrentData, setTorrentData] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [streamUrl, setStreamUrl] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

    useEffect(() => {
        if (!torrentData) return;

        // Poll progress
        const interval = setInterval(async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/torrent/${torrentData.infoHash}/progress`
                );
                setProgress(response.data);
            } catch (err) {
                console.error('Failed to fetch progress:', err);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [torrentData, API_URL]);

    const handleAddTorrent = async (data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_URL}/api/stream/add`, {
                magnet: data.magnet
            });

            const torrent = response.data;
            setTorrentData({
                name: torrent.name,
                infoHash: torrent.infoHash,
                size: torrent.files.reduce((sum, f) => sum + f.size, 0),
                files: torrent.files
            });

            // Auto-select first video file
            if (torrent.files.length > 0) {
                const firstFile = torrent.files[0];
                selectFile(torrent.infoHash, firstFile.index, firstFile.name);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.error || err.message;
            setError(`Failed to load torrent: ${errorMessage}`);
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const selectFile = (infoHash, fileIndex, fileName) => {
        const url = `${API_URL}/api/stream/${infoHash}/${fileIndex}`;
        setSelectedFile({ name: fileName, index: fileIndex });
        setStreamUrl(url);
    };

    const handleRemoveTorrent = async () => {
        if (!torrentData) return;

        try {
            await axios.delete(`${API_URL}/api/torrent/${torrentData.infoHash}`);
            setTorrentData(null);
            setSelectedFile(null);
            setStreamUrl(null);
            setProgress(null);
        } catch (err) {
            setError('Failed to remove torrent');
            console.error('Error:', err);
        }
    };

    return (
        <div className="app">
            <header className="app-header">
                <h1>🎬 Torrent Stream PoC</h1>
                <p>Stream torrents directly in your browser</p>
            </header>

            <main className="app-main">
                {error && (
                    <div className="error-banner">
                        <span>❌ {error}</span>
                        <button onClick={() => setError(null)}>✕</button>
                    </div>
                )}

                <div className="container">
                    <aside className="sidebar">
                        <StreamInput
                            onSubmit={handleAddTorrent}
                            loading={loading}
                        />
                        <TorrentInfo
                            torrentData={torrentData}
                            progress={progress}
                        />
                        {torrentData && (
                            <button className="remove-button" onClick={handleRemoveTorrent}>
                                🗑️ Remove Torrent
                            </button>
                        )}
                    </aside>

                    <section className="main-content">
                        {streamUrl ? (
                            <VideoPlayer
                                streamUrl={streamUrl}
                                fileName={selectedFile?.name}
                            />
                        ) : (
                            <div className="placeholder">
                                <p>👈 Select a magnet link or torrent file to start streaming</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            <footer className="app-footer">
                <p>⚖️ Disclaimer: This is a PoC. Only stream content you have the rights to stream.</p>
            </footer>
        </div>
    );
}

export default App;
