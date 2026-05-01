import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, UserPlus } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        employeeId: '',
        password: '',
        deviceType: 'Web',
        role: 'Employee'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', padding: '40px 20px' }}>
            <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
                <div className="flex-center" style={{ marginBottom: '2rem', flexDirection: 'column' }}>
                    <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '50%', marginBottom: '1rem' }}>
                        <MapPin size={32} color="white" />
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: '800' }}>Join GeoTrack</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Create your employee account</p>
                </div>

                {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '10px', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', border: '1px solid var(--danger)' }}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
                            <input className="input-field" name="name" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Employee ID</label>
                            <input className="input-field" name="employeeId" value={formData.employeeId} onChange={handleChange} required />
                        </div>
                    </div>

                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
                    <input className="input-field" type="email" name="email" value={formData.email} onChange={handleChange} required />
                    
                    <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Password</label>
                    <input className="input-field" type="password" name="password" value={formData.password} onChange={handleChange} required />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Device Type</label>
                            <select className="input-field" name="deviceType" value={formData.deviceType} onChange={handleChange} style={{ color: 'white', background: 'var(--bg-card)' }}>
                                <option value="Web">Web</option>
                                <option value="Laptop">Laptop</option>
                                <option value="Mobile">Mobile</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>Account Role</label>
                            <select className="input-field" name="role" value={formData.role} onChange={handleChange} style={{ color: 'white', background: 'var(--bg-card)' }}>
                                <option value="Employee">Employee</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : <><UserPlus size={20} /> Create Account</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
