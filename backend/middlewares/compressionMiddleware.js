import compression from 'compression';

// Compression middleware for production
export const compressionMiddleware = compression({
    level: 6, // Balance between compression speed and ratio (0-9)
    threshold: 1024, // Only compress responses larger than 1KB
});
