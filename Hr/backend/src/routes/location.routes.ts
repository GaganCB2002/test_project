import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { db } from '../services/db.service';

const router = Router();
const liveLocations: Record<string, any> = {};

const ensureTrackingCollections = (data: any) => {
    if (!Array.isArray(data.trackingLogs)) data.trackingLogs = [];
    if (!Array.isArray(data.workSessions)) data.workSessions = [];
};

const getOpenSession = (data: any, userId: string) =>
    data.workSessions.find((session: any) => session.userId === userId && !session.logoutTime);

router.post('/session/start', authenticate, async (req, res) => {
    const userId = String(req.body.userId || req.auth!.sub);
    const employeeId = String(req.body.employeeId || userId);
    const name = req.body.name || req.auth!.email;
    const deviceType = req.body.deviceType || 'Web';
    const timestamp = new Date().toISOString();
    let session: any = null;

    await db.update((data) => {
        ensureTrackingCollections(data);
        session = getOpenSession(data, userId);

        if (!session) {
            session = {
                id: `session-${Date.now()}`,
                userId,
                employeeId,
                name,
                deviceType,
                loginTime: timestamp,
                logoutTime: null,
                sessionDurationMinutes: 0,
                workedMinutes: 0,
                activeSeconds: 0,
                idleSeconds: 0,
                lastSeenAt: timestamp,
            };
            data.workSessions.unshift(session);
        } else {
            session.lastSeenAt = timestamp;
            session.deviceType = deviceType;
        }
    });

    res.status(201).json(session);
});

router.post('/session/stop', authenticate, async (req, res) => {
    const userId = String(req.body.userId || req.auth!.sub);
    const timestamp = new Date().toISOString();
    let session: any = null;

    await db.update((data) => {
        ensureTrackingCollections(data);
        session = getOpenSession(data, userId);

        if (session) {
            session.logoutTime = timestamp;
            session.lastSeenAt = timestamp;
            const durationMs = new Date(timestamp).getTime() - new Date(session.loginTime).getTime();
            session.sessionDurationMinutes = Math.max(0, Math.round(durationMs / 60000));
            session.workedMinutes = Math.max(0, Math.round((durationMs - (session.idleSeconds || 0) * 1000) / 60000));
        }
    });

    if (!session) {
        res.status(404).json({ message: 'No active session found.' });
        return;
    }

    res.json(session);
});

router.post('/update', authenticate, async (req, res) => {
    try {
        const userId = String(req.body.userId || req.auth!.sub);
        const employeeId = String(req.body.employeeId || userId);
        const name = req.body.name || req.auth!.email;
        const { latitude, longitude, deviceType } = req.body;
        
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

        await db.update((data) => {
            ensureTrackingCollections(data);
            data.trackingLogs.push(locationData);

            const session = getOpenSession(data, userId);
            if (session) {
                session.lastSeenAt = locationData.timestamp;
                session.activeSeconds = (session.activeSeconds || 0) + 5;
            }
        });

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
