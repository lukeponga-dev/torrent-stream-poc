import React, { useState } from 'react';
import './StreamInput.css';

function StreamInput({ onSubmit, loading }) {
    const [magnetLink, setMagnetLink] = useState('');
    const [torrentFile, setTorrentFile] = useState(null);
    const [inputMethod, setInputMethod] = useState('magnet');

    const handleMagnetChange = (e) => {
        setMagnetLink(e.target.value);
    };

    const handleFileChange = (e) => {
        setTorrentFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (inputMethod === 'magnet' && !magnetLink.trim()) {
            alert('Please enter a magnet link');
            return;
        }

        if (inputMethod === 'file' && !torrentFile) {
            alert('Please select a torrent file');
            return;
        }

        const data = inputMethod === 'magnet'
            ? { magnet: magnetLink }
            : { file: torrentFile };

        onSubmit(data);

        // Reset form
        setMagnetLink('');
        setTorrentFile(null);
    };

    return (
        <div className="stream-input">
            <div className="input-tabs">
                <button
                    className={`tab ${inputMethod === 'magnet' ? 'active' : ''}`}
                    onClick={() => setInputMethod('magnet')}
                >
                    🔗 Magnet Link
                </button>
                <button
                    className={`tab ${inputMethod === 'file' ? 'active' : ''}`}
                    onClick={() => setInputMethod('file')}
                >
                    📁 Torrent File
                </button>
            </div>

            <form onSubmit={handleSubmit} className="input-form">
                {inputMethod === 'magnet' ? (
                    <input
                        type="text"
                        placeholder="Enter magnet link (magnet:?xt=urn:btih:...)"
                        value={magnetLink}
                        onChange={handleMagnetChange}
                        disabled={loading}
                        className="magnet-input"
                    />
                ) : (
                    <input
                        type="file"
                        accept=".torrent"
                        onChange={handleFileChange}
                        disabled={loading}
                        className="file-input"
                    />
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="submit-button"
                >
                    {loading ? '⏳ Loading...' : '▶️ Start Streaming'}
                </button>
            </form>
        </div>
    );
}

export default StreamInput;
