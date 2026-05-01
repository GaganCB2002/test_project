import { Router } from 'express';
import { authenticate } from '../middleware/auth';

const router = Router();

// Stores latest locations in memory for simplicity (since user requested "exact" and "each and every moment", we might want a persistent store, but for integration, memory/websocket is best for live tracking)
// We'll also log them to console or a simple file for now.
const liveLocations: Record<string, any> = {};

router.post('/update', (req, res) => {
    try {
        const { userId, employeeId, name, latitude, longitude, deviceType } = req.body;
        
        const locationData = {
            userId,
            employeeId,
            name,
            latitude,
            longitude,
            deviceType,
            timestamp: new Date().toISOString()
        };

        liveLocations[userId] = locationData;

        // Broadcast to all connected clients (Admin/Manager dashboards)
        const io = req.app.get('io');
        if (io) io.emit('location_update', locationData);

        // Optional: Log to activity feed if needed
        // io.emit('new_activity', { id: Date.now(), type: 'LOCATION', content: `${name} updated location`, timestamp: new Date().toISOString() });

        res.status(200).json({ status: 'ok' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update location' });
    }
});

router.get('/live', authenticate, (_req, res) => {
    res.json(Object.values(liveLocations));
});

export default router;
