import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api/location';

export const useTracking = (user, token) => {
    useEffect(() => {
        if (!user || !token) return;

        console.log(`[GPS] Starting tracking for ${user.name}...`);
        const headers = { Authorization: `Bearer ${token}` };
        let lastSentAt = 0;

        const sendLocation = async (position) => {
            const { latitude, longitude } = position.coords;
            
            try {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                const deviceType = isMobile ? 'Mobile' : 'Laptop/Desktop';

                await axios.post(`${API_BASE}/update`, {
                    userId: user.id || user._id,
                    employeeId: user.employeeId || 'N/A',
                    name: user.name || `${user.firstName} ${user.lastName}`,
                    latitude,
                    longitude,
                    deviceType
                }, {
                    headers
                });
                console.log(`[GPS] Location Sent: ${latitude}, ${longitude}`);
            } catch (err) {
                console.error('[GPS] Error sending location:', err);
            }
        };

        const handleError = (error) => {
            console.warn(`[GPS] Geolocation Error (${error.code}): ${error.message}`);
        };

        axios.post(`${API_BASE}/session/start`, {
            userId: user.id || user._id,
            employeeId: user.employeeId || user.id || user._id || 'N/A',
            name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
            deviceType: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Laptop/Desktop',
        }, { headers }).catch((err) => {
            console.error('[GPS] Error starting session:', err);
        });

        const watchId = navigator.geolocation.watchPosition((position) => {
            const now = Date.now();
            if (now - lastSentAt < 5000) return;
            lastSentAt = now;
            void sendLocation(position);
        }, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });

        return () => {
            console.log(`[GPS] Stopping tracking for ${user.name}.`);
            navigator.geolocation.clearWatch(watchId);
        };
    }, [user, token]);
};
