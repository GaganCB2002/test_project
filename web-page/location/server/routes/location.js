const express = require('express');
const Location = require('../models/Location');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT could be added here, but for now we'll keep it simple or assume it's handled in a separate middleware file

const AIService = require('../services/aiService');

// Update Location
router.post('/update', async (req, res) => {
    try {
        const { userId, employeeId, latitude, longitude, deviceType } = req.body;
        
        // AI Anomaly Detection
        const anomaly = await AIService.detectSuspiciousMovement(userId, latitude, longitude);
        
        const location = new Location({
            userId,
            employeeId,
            latitude,
            longitude,
            deviceType,
            timestamp: new Date()
        });
        
        await location.save();

        const io = req.app.get('io');
        
        // Emit location update
        io.emit('locationUpdate', {
            userId,
            employeeId,
            latitude,
            longitude,
            deviceType,
            timestamp: location.timestamp,
            anomaly: anomaly // Pass anomaly info to dashboard
        });

        res.status(200).json({ 
            message: 'Location updated successfully',
            anomaly: anomaly 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating location', error: error.message });
    }
});

// Get Live Locations (Latest for each user)
router.get('/live', async (req, res) => {
    try {
        // Use aggregation to find the latest location for each unique userId
        const latestLocations = await Location.aggregate([
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: '$userId',
                    latestLocation: { $first: '$$ROOT' }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            { $unwind: '$userInfo' }
        ]);

        res.json(latestLocations.map(loc => ({
            ...loc.latestLocation,
            userName: loc.userInfo.name,
            email: loc.userInfo.email,
            role: loc.userInfo.role
        })));
    } catch (error) {
        res.status(500).json({ message: 'Error fetching live locations', error: error.message });
    }
});

// Get Location History
router.get('/history/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await Location.find({ userId }).sort({ timestamp: -1 }).limit(100);
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching history', error: error.message });
    }
});

module.exports = router;
