import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import api from '../services/api';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', start: '', end: '', description: '' });

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const response = await api.get(`/calendar?start=${start.toISOString()}&end=${end.toISOString()}`);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events');
    }
  };

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  const firstDayOfWeek = startOfMonth(currentDate).getDay();

  const getEventsForDay = (day) => {
    return events.filter(event => isSameDay(new Date(event.start), day));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/calendar', formData);
      setShowModal(false);
      setFormData({ title: '', start: '', end: '', description: '' });
      fetchEvents();
    } catch (error) {
      console.error('Failed to create event');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 className="page-title">Calendar</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          📅 New Event
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
              ←
            </button>
            <h3 style={{ fontWeight: 600, minWidth: '200px', textAlign: 'center' }}>
              {format(currentDate, 'MMMM yyyy')}
            </h3>
            <button className="btn btn-secondary" onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
              →
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="calendar-grid">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{ padding: '8px', textAlign: 'center', fontWeight: 600, color: '#6B7280' }}>
                {day}
              </div>
            ))}
            {Array(firstDayOfWeek).fill(null).map((_, idx) => (
              <div key={`empty-${idx}`} className="calendar-day"></div>
            ))}
            {days.map(day => (
              <div key={day.toISOString()} className="calendar-day">
                <div className="calendar-day-header">{format(day, 'd')}</div>
                {getEventsForDay(day).map(event => (
                  <div
                    key={event._id}
                    className="calendar-event"
                    style={{ backgroundColor: event.color || '#3B82F6', color: 'white' }}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Create Event</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateEvent}>
              <div className="modal-body">
                <div className="input-group">
                  <label>Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="input-group">
                    <label>Start</label>
                    <input type="datetime-local" value={formData.start} onChange={e => setFormData({ ...formData, start: e.target.value })} required />
                  </div>
                  <div className="input-group">
                    <label>End</label>
                    <input type="datetime-local" value={formData.end} onChange={e => setFormData({ ...formData, end: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedEvent.title}</h3>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="modal-body">
              <p><strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(selectedEvent.end).toLocaleString()}</p>
              {selectedEvent.description && <p><strong>Description:</strong> {selectedEvent.description}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;