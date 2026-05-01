import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  MapPin,
  Bell,
  Edit,
  Trash2,
  GripVertical,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isToday,
  setHours,
  setMinutes,
} from 'date-fns';

// Event types with colors
const eventTypes = {
  meeting: { color: 'bg-blue-500', label: 'Meeting', borderColor: 'border-l-blue-500' },
  deadline: { color: 'bg-red-500', label: 'Deadline', borderColor: 'border-l-red-500' },
  milestone: { color: 'bg-green-500', label: 'Milestone', borderColor: 'border-l-green-500' },
  birthday: { color: 'bg-yellow-500', label: 'Birthday', borderColor: 'border-l-yellow-500' },
};

// Mock team members for attendees
const mockMembers = [
  { id: '1', name: 'Alex Kim', avatar: 'AK' },
  { id: '2', name: 'Sarah Chen', avatar: 'SC' },
  { id: '3', name: 'Mike Johnson', avatar: 'MJ' },
  { id: '4', name: 'Emma Davis', avatar: 'ED' },
  { id: '5', name: 'James Wilson', avatar: 'JW' },
];

// Mock projects
const mockProjects = [
  { _id: '1', name: 'E-Commerce Platform' },
  { _id: '2', name: 'Mobile Banking App' },
  { _id: '3', name: 'Analytics Dashboard' },
  { _id: '4', name: 'API Gateway' },
];

// Mock events
const mockEvents = [
  {
    _id: '1',
    title: 'Sprint Planning Meeting',
    description: 'Review sprint backlog and assign tasks for the upcoming two-week sprint.',
    type: 'meeting',
    date: '2026-04-27',
    startTime: '10:00',
    endTime: '11:30',
    project: 'E-Commerce Platform',
    attendees: ['1', '2', '3'],
  },
  {
    _id: '2',
    title: 'API v2.0 Deadline',
    description: 'Final delivery deadline for the API Gateway v2.0 implementation.',
    type: 'deadline',
    date: '2026-04-28',
    startTime: '17:00',
    endTime: '17:00',
    project: 'API Gateway',
    attendees: ['1', '3'],
  },
  {
    _id: '3',
    title: 'Dashboard Beta Launch',
    description: 'Release the analytics dashboard beta version to production.',
    type: 'milestone',
    date: '2026-04-29',
    startTime: '09:00',
    endTime: '10:00',
    project: 'Analytics Dashboard',
    attendees: ['2', '4', '5'],
  },
  {
    _id: '4',
    title: 'Alex Kim\'s Birthday',
    description: 'Team celebration for Alex\'s birthday.',
    type: 'birthday',
    date: '2026-04-30',
    startTime: '15:00',
    endTime: '16:00',
    project: null,
    attendees: [],
  },
  {
    _id: '5',
    title: 'Code Review Session',
    description: 'Review pull requests for the payment module implementation.',
    type: 'meeting',
    date: '2026-04-27',
    startTime: '14:00',
    endTime: '15:00',
    project: 'Mobile Banking App',
    attendees: ['1', '4'],
  },
  {
    _id: '6',
    title: 'Design System Update',
    description: 'Present the new design system components to the team.',
    type: 'milestone',
    date: '2026-05-01',
    startTime: '11:00',
    endTime: '12:00',
    project: 'E-Commerce Platform',
    attendees: ['2', '5'],
  },
  {
    _id: '7',
    title: 'Security Audit Deadline',
    description: 'Complete the security audit for the banking module.',
    type: 'deadline',
    date: '2026-05-02',
    startTime: '18:00',
    endTime: '18:00',
    project: 'Mobile Banking App',
    attendees: ['1', '3', '4'],
  },
  {
    _id: '8',
    title: 'Team Sync',
    description: 'Weekly team synchronization meeting.',
    type: 'meeting',
    date: '2026-05-03',
    startTime: '09:00',
    endTime: '09:30',
    project: 'All Projects',
    attendees: ['1', '2', '3', '4', '5'],
  },
  {
    _id: '9',
    title: 'Performance Testing',
    description: 'Load testing for the new search functionality.',
    type: 'milestone',
    date: '2026-05-04',
    startTime: '13:00',
    endTime: '15:00',
    project: 'E-Commerce Platform',
    attendees: ['3', '5'],
  },
  {
    _id: '10',
    title: 'Product Demo',
    description: 'Demo the new features to the stakeholders.',
    type: 'meeting',
    date: '2026-05-05',
    startTime: '10:00',
    endTime: '11:30',
    project: 'Analytics Dashboard',
    attendees: ['2', '4'],
  },
];

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month');
  const [events, setEvents] = useState(mockEvents);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    type: 'meeting',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    project: '',
    attendees: [],
  });

  const [editingEvent, setEditingEvent] = useState(null);

  // Get calendar days for month view
  const getMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

  // Get week days
  const getWeekDays = () => {
    const weekStart = startOfWeek(currentDate);
    return eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });
  };

  // Get events for a specific date
  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return events.filter((event) => event.date === dateStr);
  };

  // Get upcoming events (next 7 days)
  const getUpcomingEvents = () => {
    const today = new Date();
    const nextWeek = addDays(today, 7);
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (viewMode === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(subWeeks(currentDate, 1));
    } else {
      setCurrentDate(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      setCurrentDate(addWeeks(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Event handlers
  const handleDayClick = (date) => {
    setSelectedDate(date);
    setNewEvent({
      ...newEvent,
      date: format(date, 'yyyy-MM-dd'),
    });
    setEditingEvent(null);
    setShowEventModal(true);
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setShowDetailModal(true);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;

    if (editingEvent) {
      // Update existing event
      setEvents(events.map((ev) => (ev._id === editingEvent._id ? { ...ev, ...newEvent } : ev)));
    } else {
      // Add new event
      const event = {
        _id: Date.now().toString(),
        ...newEvent,
      };
      setEvents([...events, event]);
    }

    setShowEventModal(false);
    setNewEvent({
      title: '',
      description: '',
      type: 'meeting',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      project: '',
      attendees: [],
    });
    setEditingEvent(null);
  };

  const handleEditEvent = () => {
    if (selectedEvent) {
      setNewEvent({
        title: selectedEvent.title,
        description: selectedEvent.description,
        type: selectedEvent.type,
        date: selectedEvent.date,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
        project: selectedEvent.project || '',
        attendees: selectedEvent.attendees || [],
      });
      setEditingEvent(selectedEvent);
      setShowDetailModal(false);
      setShowEventModal(true);
    }
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter((ev) => ev._id !== selectedEvent._id));
      setShowDetailModal(false);
      setSelectedEvent(null);
    }
  };

  const toggleAttendee = (memberId) => {
    setNewEvent((prev) => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter((id) => id !== memberId)
        : [...prev.attendees, memberId],
    }));
  };

  // Generate hours for day/week view
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Calendar</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your events and schedule</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(new Date());
            setNewEvent({
              ...newEvent,
              date: format(new Date(), 'yyyy-MM-dd'),
            });
            setEditingEvent(null);
            setShowEventModal(true);
          }}
          className="btn-primary"
        >
          <Plus size={18} />
          Add Event
        </button>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Calendar */}
        <div className="flex-1">
          {/* Calendar Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4 mb-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleToday}
                  className="px-3 py-1.5 text-sm font-medium bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Today
                </button>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white ml-4">
                  {viewMode === 'month' && format(currentDate, 'MMMM yyyy')}
                  {viewMode === 'week' && `Week of ${format(startOfWeek(currentDate), 'MMM d, yyyy')}`}
                  {viewMode === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
                </h2>
              </div>

              {/* View Toggles */}
              <div className="flex items-center gap-2">
                {['month', 'week', 'day'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm capitalize transition-all
                      ${viewMode === mode
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Calendar Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-4"
          >
            {/* Month View */}
            {viewMode === 'month' && (
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getMonthDays().map((day, index) => {
                    const dayEvents = getEventsForDate(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isTodayDate = isToday(day);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.01 }}
                        onClick={() => handleDayClick(day)}
                        className={`
                          min-h-[100px] p-2 border border-gray-100 dark:border-gray-700 rounded-lg
                          cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50
                          ${!isCurrentMonth ? 'opacity-40' : ''}
                          ${isTodayDate ? 'ring-2 ring-primary-500' : ''}
                        `}
                      >
                        <div className={`
                          w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium mb-1
                          ${isTodayDate
                            ? 'bg-primary-500 text-white'
                            : isCurrentMonth
                              ? 'text-gray-900 dark:text-white'
                              : 'text-gray-400'
                          }
                        `}>
                          {format(day, 'd')}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 3).map((event) => (
                            <div
                              key={event._id}
                              onClick={(e) => handleEventClick(event, e)}
                              className={`
                                px-2 py-1 rounded text-xs truncate cursor-pointer
                                ${eventTypes[event.type].color}/10 ${eventTypes[event.type].color}
                                hover:opacity-80 transition-opacity
                              `}
                              style={{ color: eventTypes[event.type].color.replace('/10', '') }}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 pl-2">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
              <div>
                {/* Day Headers */}
                <div className="grid grid-cols-8 border-b border-gray-200 dark:border-gray-700 pb-2 mb-2">
                  <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400">Time</div>
                  {getWeekDays().map((day) => {
                    const isTodayDate = isToday(day);
                    return (
                      <div key={day.toISOString()} className="text-center">
                        <div className="text-xs text-gray-500 dark:text-gray-400">{format(day, 'EEE')}</div>
                        <div className={`
                          w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-medium mt-1
                          ${isTodayDate ? 'bg-primary-500 text-white' : 'text-gray-900 dark:text-white'}
                        `}>
                          {format(day, 'd')}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Time Grid */}
                <div className="max-h-[600px] overflow-y-auto">
                  {hours.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-b border-gray-100 dark:border-gray-800">
                      <div className="py-2 text-xs text-gray-500 dark:text-gray-400 text-right pr-2">
                        {format(setHours(new Date(), hour), 'h a')}
                      </div>
                      {getWeekDays().map((day) => {
                        const dayEvents = getEventsForDate(day).filter(
                          (event) => parseInt(event.startTime.split(':')[0]) === hour
                        );
                        return (
                          <div
                            key={day.toISOString()}
                            onClick={() => {
                              const dateWithTime = setHours(setMinutes(day, 0), hour);
                              handleDayClick(dateWithTime);
                            }}
                            className="min-h-[48px] p-1 border-l border-gray-100 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30"
                          >
                            {dayEvents.map((event) => (
                              <div
                                key={event._id}
                                onClick={(e) => handleEventClick(event, e)}
                                className={`
                                  px-1 py-0.5 rounded text-xs truncate cursor-pointer
                                  ${eventTypes[event.type].color}/10
                                `}
                                style={{ backgroundColor: `${eventTypes[event.type].color}20` }}
                              >
                                <span style={{ color: eventTypes[event.type].color }}>{event.title}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="max-h-[600px] overflow-y-auto">
                {hours.map((hour) => {
                  const dayEvents = getEventsForDate(currentDate).filter(
                    (event) => parseInt(event.startTime.split(':')[0]) === hour
                  );
                  return (
                    <div key={hour} className="grid grid-cols-[80px_1fr] border-b border-gray-100 dark:border-gray-800">
                      <div className="py-3 text-sm text-gray-500 dark:text-gray-400 text-right pr-4">
                        {format(setHours(new Date(), hour), 'h a')}
                      </div>
                      <div
                        onClick={() => {
                          const dateWithTime = setHours(setMinutes(currentDate, 0), hour);
                          handleDayClick(dateWithTime);
                        }}
                        className="min-h-[60px] py-1 px-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/30"
                      >
                        {dayEvents.map((event) => (
                          <motion.div
                            key={event._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            onClick={(e) => handleEventClick(event, e)}
                            className={`
                              p-2 rounded-lg mb-1 cursor-pointer border-l-4
                              ${eventTypes[event.type].borderColor}
                            `}
                            style={{ backgroundColor: `${eventTypes[event.type].color}15` }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900 dark:text-white">{event.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>
                            {event.project && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{event.project}</p>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Upcoming Events Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:w-80"
        >
          <div className="card p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Events
            </h3>

            <div className="space-y-3">
              {getUpcomingEvents().length > 0 ? (
                getUpcomingEvents().map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setShowDetailModal(true);
                    }}
                    className={`
                      p-3 rounded-xl border-l-4 cursor-pointer transition-all hover:scale-[1.02]
                      ${eventTypes[event.type].borderColor}
                    `}
                    style={{ backgroundColor: `${eventTypes[event.type].color}10` }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white truncate">{event.title}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarIcon className="w-3 h-3" />
                          {format(new Date(event.date), 'MMM d')}
                          <Clock className="w-3 h-3 ml-1" />
                          {event.startTime}
                        </div>
                      </div>
                      <span
                        className={`
                          px-2 py-0.5 rounded-full text-xs font-medium
                          ${eventTypes[event.type].color}/20
                        `}
                        style={{ color: eventTypes[event.type].color }}
                      >
                        {eventTypes[event.type].label}
                      </span>
                    </div>
                    {event.project && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{event.project}</p>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No upcoming events</p>
                </div>
              )}
            </div>
          </div>

          {/* Event Type Legend */}
          <div className="card p-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(eventTypes).map(([key, { color, label }]) => (
                <div key={key} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add/Edit Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowEventModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-lg max-h-[90vh] overflow-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="input-field"
                    placeholder="Enter event title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    className="input-field min-h-[80px] resize-none"
                    placeholder="Add event description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Event Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(eventTypes).map(([key, { color, label }]) => (
                      <button
                        key={key}
                        onClick={() => setNewEvent({ ...newEvent, type: key })}
                        className={`
                          flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all
                          ${newEvent.type === key
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className={`w-3 h-3 rounded-full ${color}`} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project
                    </label>
                    <select
                      value={newEvent.project}
                      onChange={(e) => setNewEvent({ ...newEvent, project: e.target.value })}
                      className="input-field"
                    >
                      <option value="">No project</option>
                      {mockProjects.map((project) => (
                        <option key={project._id} value={project.name}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.startTime}
                      onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newEvent.endTime}
                      onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attendees
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {mockMembers.map((member) => (
                      <button
                        key={member.id}
                        onClick={() => toggleAttendee(member.id)}
                        className={`
                          px-3 py-1.5 rounded-full text-sm font-medium transition-all flex items-center gap-2
                          ${newEvent.attendees.includes(member.id)
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full flex items-center justify-center text-xs
                          ${newEvent.attendees.includes(member.id)
                            ? 'bg-white/20'
                            : 'bg-primary-500/20'
                          }
                        `}>
                          {member.avatar}
                        </div>
                        {member.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button onClick={handleAddEvent} className="btn-primary flex-1">
                    {editingEvent ? 'Update Event' : 'Add Event'}
                  </button>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                    }}
                    className="btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="card p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Event Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Event Header */}
                <div
                  className={`
                    p-4 rounded-xl border-l-4
                    ${eventTypes[selectedEvent.type].borderColor}
                  `}
                  style={{ backgroundColor: `${eventTypes[selectedEvent.type].color}10` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-xl">{selectedEvent.title}</h3>
                      <span
                        className={`
                          inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
                          ${eventTypes[selectedEvent.type].color}/20
                        `}
                        style={{ color: eventTypes[selectedEvent.type].color }}
                      >
                        {eventTypes[selectedEvent.type].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleEditEvent}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={handleDeleteEvent}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedEvent.description && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Description</p>
                    <p className="text-gray-900 dark:text-white">{selectedEvent.description}</p>
                  </div>
                )}

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {format(new Date(selectedEvent.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {selectedEvent.startTime} - {selectedEvent.endTime}
                    </p>
                  </div>
                </div>

                {/* Project */}
                {selectedEvent.project && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Project</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedEvent.project}</p>
                  </div>
                )}

                {/* Attendees */}
                {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Attendees</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.attendees.map((attendeeId) => {
                        const member = mockMembers.find((m) => m.id === attendeeId);
                        return member ? (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-700 rounded-full"
                          >
                            <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary-500">{member.avatar}</span>
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{member.name}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-full btn-ghost py-3 mt-4"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Calendar;