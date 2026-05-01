import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, LogIn } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '20px' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '1rem' }}>
                        <MapPin size={32} color="white" />
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800' }}>GeoTrack Pro</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to continue tracking</p>
                </div>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', border: '1px solid var(--danger)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                    <input 
                        className="input-field" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input 
                        className="input-field" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : <><LogIn size={20} /> Sign In</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
