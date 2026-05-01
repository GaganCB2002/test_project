import { useEffect } from 'react';
import axios from 'axios';
import type { User } from '../types';

const API_BASE = '/api/location';

export const useTracking = (user: User | null, token: string | null) => {
    useEffect(() => {
        if (!user || !token) return;

        console.log(`[GPS] Starting tracking for ${user.name}...`);

        const sendLocation = async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            
            try {
                // Determine device type
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                const deviceType = isMobile ? 'Mobile' : 'Laptop/Desktop';

                await axios.post(`${API_BASE}/update`, {
                    userId: user.id,
                    employeeId: user.employeeId || 'N/A',
                    name: user.name,
                    latitude,
                    longitude,
                    deviceType
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log(`[GPS] Location Sent: ${latitude}, ${longitude}`);
            } catch (err) {
                console.error('[GPS] Error sending location:', err);
            }
        };

        const handleError = (error: GeolocationPositionError) => {
            console.warn(`[GPS] Geolocation Error (${error.code}): ${error.message}`);
        };

        // Real-time tracking every 3 seconds
        const watcherId = navigator.geolocation.watchPosition(
            (position) => {
                // Throttling to 3 seconds is handled by the browser's watchPosition typically, 
                // but we can also use a simple timestamp check if needed.
                sendLocation(position);
            },
            handleError,
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        // Backup interval for guaranteed 3s updates if watchPosition is lazy
        const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(sendLocation, handleError, {
                enableHighAccuracy: true,
                timeout: 2000,
                maximumAge: 0
            });
        }, 3000); 

        return () => {
            console.log(`[GPS] Stopping tracking for ${user.name}.`);
            navigator.geolocation.clearWatch(watcherId);
            clearInterval(intervalId);
        };
    }, [user, token]);
};
