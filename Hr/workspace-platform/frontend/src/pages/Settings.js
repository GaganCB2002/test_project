import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const Settings = () => {
  const { user, updateUser } = useAuthStore();
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profile);
      updateUser(profile);
      setMessage('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password changed successfully');
    } catch (error) {
      setError('Failed to change password');
    }
  };

  return (
    <div>
      <h1 className="page-title">Settings</h1>

      {message && (
        <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '8px', marginBottom: '16px' }}>
          {message}
        </div>
      )}
      {error && (
        <div style={{ padding: '12px', background: '#FEE2E2', color: '#991B1B', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Profile Settings</h3>
          </div>
          <form onSubmit={handleProfileUpdate}>
            <div className="card-body">
              <div className="input-group">
                <label>First Name</label>
                <input type="text" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Last Name</label>
                <input type="text" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Phone</label>
                <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" value={user?.email} disabled />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange}>
            <div className="card-body">
              <div className="input-group">
                <label>Current Password</label>
                <input type="password" value={passwords.currentPassword} onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })} />
              </div>
              <div className="input-group">
                <label>New Password</label>
                <input type="password" value={passwords.newPassword} onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Confirm Password</label>
                <input type="password" value={passwords.confirmPassword} onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">Change Password</button>
            </div>
          </form>
        </div>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">Account Information</h3>
        </div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Role</p>
              <p style={{ fontWeight: 600 }}>{user?.role}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Department</p>
              <p style={{ fontWeight: 600 }}>{user?.department}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>Organization</p>
              <p style={{ fontWeight: 600 }}>{user?.organization?.name || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;