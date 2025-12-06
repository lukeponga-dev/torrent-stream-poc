import React, { useEffect, useRef } from 'react';
import './VideoPlayer.css';

function VideoPlayer({ streamUrl, fileName }) {
    const videoRef = useRef(null);

    return (
        <div className="video-player-container">
            <div className="video-header">
                <h2>🎬 Now Playing</h2>
                <p className="file-name">{fileName}</p>
            </div>

            <video
                ref={videoRef}
                className="video-player"
                controls
                autoPlay
            >
                <source src={streamUrl} type="video/mp4" />
                Your browser does not support HTML5 video.
            </video>

            <div className="video-controls">
                <button onClick={() => videoRef.current?.play()}>▶️ Play</button>
                <button onClick={() => videoRef.current?.pause()}>⏸️ Pause</button>
                <button onClick={() => videoRef.current && (videoRef.current.currentTime = 0)}>
                    ⏮️ Restart
                </button>
            </div>
        </div>
    );
}

export default VideoPlayer;
