# Development Notes

## Implementation Details

### Torrent Manager
- Caches torrents with 1-hour TTL using node-cache
- Automatically removes oldest torrent when limit exceeded
- Provides progress tracking and cleanup utilities
- Finds playable video files automatically

### Stream Routes
- Handles HTTP Range requests for efficient seeking
- Returns video files with appropriate MIME types
- Validates magnet links before adding torrent
- Returns file list for user selection

### Error Handling
- Comprehensive error messages for debugging
- Graceful error responses for API clients
- Proper HTTP status codes
- Error logging for troubleshooting

### Security
- Rate limiting on stream and torrent endpoints
- Magnet link format validation
- File path sanitization
- CORS protection

### Frontend Components
- **StreamInput**: Tab-based input for magnet/torrent file
- **VideoPlayer**: HTML5 video with range request support
- **TorrentInfo**: Real-time progress, file list, statistics
- **App**: Main component coordinating state and API calls

## Performance Considerations

### Memory
- Torrent cache prevents redownloading metadata
- Configurable max concurrent torrents
- Automatic cleanup of old files

### Network
- HTTP range requests enable seeking without full download
- Peer-to-peer reduces server bandwidth
- Stream directly without intermediate storage

### Frontend
- CSS Grid layout for responsive design
- Smooth animations and transitions
- Efficient state management with React hooks

## Future Enhancements

### Planned Features
- [ ] WebSocket support for real-time progress updates
- [ ] Subtitle/SRT file support
- [ ] Quality/bitrate selection
- [ ] Playlist support
- [ ] User authentication
- [ ] Download history
- [ ] Search integration
- [ ] Advanced transcoding options

### Potential Optimizations
- [ ] Service worker for offline caching
- [ ] Adaptive bitrate streaming
- [ ] HLS/DASH support
- [ ] Distributed caching
- [ ] Load balancing

## Testing

### Manual Testing
```bash
# Test magnet link
curl -X POST http://localhost:8080/api/stream/add \
  -H "Content-Type: application/json" \
  -d '{"magnet":"magnet:?xt=urn:btih:..."}'

# Test stream endpoint
curl -H "Range: bytes=0-1023" \
  http://localhost:8080/api/stream/:infoHash/:fileIndex

# Test progress
curl http://localhost:8080/api/torrent/:infoHash/progress
```

### Debug Mode
Set environment variable for verbose logging:
```bash
LOG_LEVEL=debug npm start
```

## Deployment Checklist

- [ ] Set environment variables
- [ ] Configure CORS origin
- [ ] Set temp directory with sufficient space
- [ ] Install FFmpeg if transcoding enabled
- [ ] Set up backup for temp files
- [ ] Configure rate limiting based on expected load
- [ ] Set up monitoring and logging
- [ ] Test with sample torrents
- [ ] Review security settings
- [ ] Document deployment configuration

## Troubleshooting Guide

### Common Issues

**Port already in use**
```bash
lsof -i :8080  # Find process
kill -9 <PID>  # Kill process
```

**ENOSPC error (no space)**
- Clear temp directory: `rm -rf /tmp/torrents/*`
- Reduce MAX_TORRENTS value
- Increase disk space

**Memory leak**
- Check torrent cleanup is working
- Monitor with: `node --inspect server.js`
- Profile with Chrome DevTools

**Slow streaming**
- Check peer count: `curl http://localhost:8080/api/torrent`
- Monitor bandwidth: `iftop` or system monitor
- Verify network connectivity

## Code Quality

### Linting (add ESLint)
```bash
npm install --save-dev eslint
npx eslint server.js
```

### Testing (add Jest)
```bash
npm install --save-dev jest
npm test
```

### Documentation
- All functions include JSDoc comments
- README covers main features
- SETUP.md provides development guide
- LEGAL.md covers legal aspects

## Version History

- v1.0.0 - Initial PoC release
  - Basic torrent streaming
  - HTTP range request support
  - Real-time progress tracking
  - Web-based UI

