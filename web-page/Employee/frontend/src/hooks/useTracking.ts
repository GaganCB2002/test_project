import { useEffect } from 'react';
import axios from 'axios';

const API_BASE = '/api/location';

export const useTracking = (user: any, token: string | null) => {
    useEffect(() => {
        if (!user || !token) return;

        console.log(`[GPS] Starting tracking for ${user.name}...`);

        const sendLocation = async (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            
            try {
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

        const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(sendLocation, handleError, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }, 30000); 

        navigator.geolocation.getCurrentPosition(sendLocation, handleError, {
            enableHighAccuracy: true
        });

        return () => {
            console.log(`[GPS] Stopping tracking for ${user.name}.`);
            clearInterval(intervalId);
        };
    }, [user, token]);
};
