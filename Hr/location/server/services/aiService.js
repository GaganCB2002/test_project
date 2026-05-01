const Location = require('../models/Location');

/**
 * AI Service for detecting unusual location patterns
 */
class AIService {
    /**
     * Detect if a user has stopped moving or is inactive
     * @param {string} userId 
     */
    static async detectInactivity(userId) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const lastUpdate = await Location.findOne({ userId }).sort({ timestamp: -1 });

        if (!lastUpdate || lastUpdate.timestamp < fiveMinutesAgo) {
            return {
                type: 'INACTIVE',
                message: 'User has not sent an update in over 5 minutes',
                severity: 'high'
            };
        }
        return null;
    }

    /**
     * Simple distance-based anomaly detection
     * Detects if the last movement was physically impossible (suspicious)
     */
    static async detectSuspiciousMovement(userId, newLat, newLong) {
        const lastTwo = await Location.find({ userId }).sort({ timestamp: -1 }).limit(1);
        if (lastTwo.length === 0) return null;

        const prev = lastTwo[0];
        const timeDiff = (Date.now() - new Date(prev.timestamp).getTime()) / 1000; // seconds
        
        if (timeDiff < 1) return null;

        // Haversine formula for distance
        const R = 6371e3; // metres
        const φ1 = prev.latitude * Math.PI/180;
        const φ2 = newLat * Math.PI/180;
        const Δφ = (newLat-prev.latitude) * Math.PI/180;
        const Δλ = (newLong-prev.longitude) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c; // in metres

        const speed = distance / timeDiff; // metres per second

        // If speed > 300 m/s (approx speed of sound), it's likely an anomaly or spoofing
        if (speed > 300) {
            return {
                type: 'SUSPICIOUS_MOVEMENT',
                message: `Impossible movement detected: ${Math.round(speed)} m/s`,
                severity: 'critical'
            };
        }

        return null;
    }
}

module.exports = AIService;
