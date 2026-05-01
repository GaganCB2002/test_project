import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';
import { useLocationTracker } from '../hooks/useLocationTracker';
import io from 'socket.io-client';
import axios from 'axios';
import { Search, Users, Map as MapIcon, History, Bell, LogOut, Shield, Laptop, Smartphone, Globe } from 'lucide-react';

// Fix Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const currentCoords = useLocationTracker();
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        // Fetch initial live locations
        const fetchLiveLocations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/location/live');
                setUsers(res.data);
            } catch (err) {
                console.error('Error fetching live locations', err);
            }
        };

        fetchLiveLocations();

        // Socket.io integration
        const socket = io('http://localhost:5000');
        
        socket.on('locationUpdate', (data) => {
            setUsers(prev => {
                const index = prev.findIndex(u => u.userId === data.userId);
                if (index !== -1) {
                    const newUsers = [...prev];
                    newUsers[index] = { ...newUsers[index], ...data };
                    return newUsers;
                }
                return [...prev, data];
            });

            if (data.anomaly) {
                setAlerts(prev => [{ ...data.anomaly, userName: data.employeeId, id: Date.now() }, ...prev].slice(0, 5));
            }
        });

        return () => socket.disconnect();
    }, []);

    const filteredUsers = users.filter(u => 
        (u.userName || u.employeeId).toLowerCase().includes(search.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(search.toLowerCase())
    );

    const getDeviceIcon = (type) => {
        switch(type) {
            case 'Mobile': return <Smartphone size={16} />;
            case 'Laptop': return <Laptop size={16} />;
            default: return <Globe size={16} />;
        }
    };

    const [view, setView] = useState('map'); // 'map' or 'analytics'

    const getAnalyticsData = () => {
        const totalUsers = users.length;
        const anomalies = alerts.length;
        return { totalUsers, anomalies };
    };

    const analytics = getAnalyticsData();

    return (
        <div className="grid-cols-dashboard">
            {/* Sidebar */}
            <div className="glass-card" style={{ borderRadius: '0', borderLeft: 'none', borderTop: 'none', borderBottom: 'none', display: 'flex', flexDirection: 'column', zIndex: 1000 }}>
                <div style={{ marginBottom: '2rem' }}>
                    <div className="flex-center" style={{ justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div className="flex-center" style={{ gap: '10px' }}>
                            <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '12px' }}>
                                <Shield size={24} color="white" />
                            </div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Admin Console</h2>
                        </div>
                        <div className="flex-center" style={{ gap: '10px' }}>
                            <button 
                                onClick={() => setView(view === 'map' ? 'analytics' : 'map')} 
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'white', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                                {view === 'map' ? 'Analytics' : 'Map View'}
                            </button>
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            className="input-field" 
                            style={{ paddingLeft: '40px', marginBottom: '0' }} 
                            placeholder="Search employees..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1rem', letterSpacing: '0.05em' }}>Active Trackers ({filteredUsers.length})</h3>
                    {filteredUsers.map(u => (
                        <div 
                            key={u.userId} 
                            onClick={() => {
                                setSelectedUser(u);
                                setView('map');
                            }}
                            className="glass-card" 
                            style={{ 
                                padding: '12px', 
                                marginBottom: '10px', 
                                cursor: 'pointer', 
                                border: selectedUser?.userId === u.userId ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: selectedUser?.userId === u.userId ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{u.userName || 'Unknown User'}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ID: {u.employeeId}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    {getDeviceIcon(u.deviceType)}
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', marginTop: '4px' }}></div>
                                </div>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapIcon size={12} /> {u.latitude.toFixed(4)}, {u.longitude.toFixed(4)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alerts Section */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Bell size={16} /> Recent Alerts
                    </h3>
                    {alerts.length === 0 ? (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No anomalies detected</p>
                    ) : (
                        alerts.map(alert => (
                            <div key={alert.id} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', padding: '8px', fontSize: '0.75rem', marginBottom: '8px' }}>
                                <strong style={{ color: 'var(--danger)' }}>{alert.type}:</strong> {alert.userName} - {alert.message}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div style={{ position: 'relative' }}>
                {view === 'map' ? (
                    <MapContainer center={[20, 0]} zoom={3} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {users.map(u => (
                            <Marker key={u.userId} position={[u.latitude, u.longitude]}>
                                <Popup>
                                    <div style={{ color: 'black' }}>
                                        <strong>{u.userName || 'Employee'}</strong><br/>
                                        ID: {u.employeeId}<br/>
                                        Last Update: {new Date(u.timestamp).toLocaleTimeString()}
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <MapCenterUpdater coords={selectedUser ? [selectedUser.latitude, selectedUser.longitude] : null} />
                    </MapContainer>
                ) : (
                    <div style={{ padding: '40px', height: '100%', overflowY: 'auto' }}>
                        <h2 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '2rem' }}>Fleet Analytics</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                            <div className="glass-card">
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Total Active Users</h4>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800' }}>{analytics.totalUsers}</div>
                            </div>
                            <div className="glass-card">
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Anomalies Detected</h4>
                                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--danger)' }}>{analytics.anomalies}</div>
                            </div>
                            <div className="glass-card">
                                <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>System Status</h4>
                                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent)' }}>Operational</div>
                            </div>
                        </div>
                        
                        <div className="glass-card" style={{ marginTop: '20px' }}>
                            <h3 style={{ marginBottom: '1rem' }}>Device Distribution</h3>
                            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div style={{ flex: 1, height: '20px', background: 'var(--border)', borderRadius: '10px', overflow: 'hidden', display: 'flex' }}>
                                    <div style={{ width: '40%', background: 'var(--primary)' }}></div>
                                    <div style={{ width: '30%', background: 'var(--accent)' }}></div>
                                    <div style={{ width: '30%', background: 'var(--warning)' }}></div>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    <span style={{ color: 'var(--primary)' }}>●</span> Web (40%) 
                                    <span style={{ color: 'var(--accent)', marginLeft: '10px' }}>●</span> Mobile (30%) 
                                    <span style={{ color: 'var(--warning)', marginLeft: '10px' }}>●</span> Laptop (30%)
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Overlays */}
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
                    <div className="glass-card" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                        <strong>Active Nodes:</strong> {users.length}
                    </div>
                    {currentCoords && (
                        <div className="glass-card" style={{ padding: '10px 20px', fontSize: '0.85rem', borderLeft: '4px solid var(--primary)' }}>
                            <strong>Your Location:</strong> {currentCoords.latitude.toFixed(4)}, {currentCoords.longitude.toFixed(4)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const MapCenterUpdater = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        if (coords) {
            map.setView(coords, 15, { animate: true });
        }
    }, [coords, map]);
    return null;
};

export default Dashboard;
