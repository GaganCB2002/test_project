import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

const LeaveManagement = () => {
  const { user } = useAuthStore();
  const [myRequests, setMyRequests] = useState([]);
  const [teamRequests, setTeamRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ leaveType: 'vacation', startDate: '', endDate: '', reason: '' });
  const [activeTab, setActiveTab] = useState('my');

  useEffect(() => {
    fetchMyRequests();
    if (['CEO', 'Manager', 'HR'].includes(user?.role)) {
      fetchTeamRequests();
    }
  }, []);

  const fetchMyRequests = async () => {
    try {
      const response = await api.get('/leaves/my-requests');
      setMyRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch leave requests');
    }
  };

  const fetchTeamRequests = async () => {
    try {
      const response = await api.get('/leaves/team');
      setTeamRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch team requests');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leaves', formData);
      setShowModal(false);
      setFormData({ leaveType: 'vacation', startDate: '', endDate: '', reason: '' });
      fetchMyRequests();
    } catch (error) {
      console.error('Failed to create leave request');
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/leaves/${id}/approve`, { remarks: 'Approved' });
      fetchTeamRequests();
    } catch (error) {
      console.error('Failed to approve leave');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/leaves/${id}/reject`, { remarks: 'Rejected' });
      fetchTeamRequests();
    } catch (error) {
      console.error('Failed to reject leave');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Leave Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          🏖️ Request Leave
        </button>
      </div>

      {['CEO', 'Manager', 'HR'].includes(user?.role) && (
        <div style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <button className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('my')}>
            My Requests
          </button>
          <button className={`btn ${activeTab === 'team' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setActiveTab('team')}>
            Team Requests
          </button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          {activeTab === 'my' && (
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map(request => (
                  <tr key={request._id}>
                    <td><strong>{request.leaveType}</strong></td>
                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                    <td>{request.totalDays}</td>
                    <td><span className={`badge badge-${getStatusColor(request.status)}`}>{request.status}</span></td>
                    <td>{request.reason || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeTab === 'team' && (
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamRequests.map(request => (
                  <tr key={request._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '0.75rem' }}>
                          {request.user?.firstName?.[0]}
                        </div>
                        {request.user?.firstName} {request.user?.lastName}
                      </div>
                    </td>
                    <td><strong>{request.leaveType}</strong></td>
                    <td>{new Date(request.startDate).toLocaleDateString()}</td>
                    <td>{new Date(request.endDate).toLocaleDateString()}</td>
                    <td>{request.totalDays}</td>
                    <td><span className={`badge badge-${getStatusColor(request.status)}`}>{request.status}</span></td>
                    <td>
                      {request.status === 'pending' && (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleApprove(request._id)}>
                            Approve
                          </button>
                          <button className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.75rem' }} onClick={() => handleReject(request._id)}>
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Request Leave</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Leave Type</label>
                  <select value={formData.leaveType} onChange={e => setFormData({ ...formData, leaveType: e.target.value })}>
                    <option value="vacation">Vacation</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal</option>
                    <option value="parental">Parental</option>
                    <option value="bereavement">Bereavement</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label>Start Date</label>
                    <input type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label>End Date</label>
                    <input type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Reason</label>
                  <textarea value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;