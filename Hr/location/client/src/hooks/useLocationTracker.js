import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const useLocationTracker = () => {
    const { user } = useAuth();
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        if (!user) return;

        const sendLocation = async (position) => {
            const { latitude, longitude } = position.coords;
            setCoords({ latitude, longitude });
            
            try {
                await axios.post('http://localhost:5000/api/location/update', {
                    userId: user.id,
                    employeeId: user.employeeId,
                    latitude,
                    longitude,
                    deviceType: user.deviceType
                });
                console.log('📍 Location updated');
            } catch (err) {
                console.error('❌ Failed to update location:', err);
            }
        };

        const handleError = (error) => {
            console.error('❌ Geolocation error:', error.message);
        };

        // Initial update
        navigator.geolocation.getCurrentPosition(sendLocation, handleError);

        // Set interval for updates (every 2-3 minutes)
        const intervalId = setInterval(() => {
            navigator.geolocation.getCurrentPosition(sendLocation, handleError);
        }, 120000); // 120 seconds

        return () => clearInterval(intervalId);
    }, [user]);

    return coords;
};
