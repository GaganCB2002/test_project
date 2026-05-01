import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Clock, User, MessageSquare, Send, Calendar,
  AlertTriangle, CheckCircle, XCircle
} from 'lucide-react';
import { fetchTicketById, updateTicket, addComment, clearCurrentTicket } from '../redux/slices/ticketSlice';
import { toast } from '../components/ui/Toast';

const TicketDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTicket: ticket, isLoading } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [newComment, setNewComment] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');

  useEffect(() => {
    dispatch(fetchTicketById(id));
    return () => dispatch(clearCurrentTicket());
  }, [dispatch, id]);

  useEffect(() => {
    if (ticket) setStatusUpdate(ticket.status);
  }, [ticket]);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    dispatch(addComment({ id: ticket._id, text: newComment })).then((res) => {
      if (!res.error) {
        toast.success('Comment added');
        setNewComment('');
      }
    });
  };

  const handleStatusUpdate = () => {
    if (statusUpdate === ticket.status) return;
    dispatch(updateTicket({ id: ticket._id, status: statusUpdate })).then((res) => {
      if (!res.error) toast.success('Status updated');
    });
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const priorityStyles = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
    low: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
  };

  const statusStyles = {
    open: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
    closed: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };

  if (isLoading || !ticket) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/tickets')} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft className="w-5 h-5 text-slate-500" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ticket.title}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">{ticket._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Description</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{ticket.description}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Comments ({ticket.comments?.length || 0})
            </h3>

            <div className="space-y-4 mb-4">
              {ticket.comments?.map((comment, index) => (
                <div key={comment._id || index} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                    {getInitials(comment.author?.name)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{comment.author?.name}</span>
                      <span className="text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium shrink-0">
                {getInitials(user?.name)}
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-sm"
                />
                <button onClick={handleAddComment} className="p-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600 transition-colors">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</label>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${statusStyles[ticket.status]}`}>{ticket.status.replace('_', ' ')}</span>
                </div>
              </div>

              {user?.role !== 'employee' && (
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Update Status</label>
                  <select
                    value={statusUpdate}
                    onChange={(e) => setStatusUpdate(e.target.value)}
                    className="mt-1.5 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-sm"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  {statusUpdate !== ticket.status && (
                    <button onClick={handleStatusUpdate} className="mt-2 w-full py-2 rounded-xl bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors">
                      Update Status
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</label>
                <span className={`inline-block mt-1.5 px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${priorityStyles[ticket.priority]}`}>{ticket.priority}</span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Category</label>
                <p className="mt-1 text-sm text-slate-900 dark:text-white capitalize">{ticket.category}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created By</label>
                <div className="mt-1 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-medium">
                    {getInitials(ticket.createdBy?.name)}
                  </div>
                  <span className="text-sm text-slate-900 dark:text-white">{ticket.createdBy?.name}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</label>
                {ticket.assignedTo ? (
                  <div className="mt-1 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-medium">
                      {getInitials(ticket.assignedTo.name)}
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white">{ticket.assignedTo.name}</span>
                  </div>
                ) : (
                  <p className="mt-1 text-sm text-slate-400">Unassigned</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</label>
                <p className="mt-1 text-sm text-slate-900 dark:text-white">{formatDate(ticket.createdAt)}</p>
              </div>

              {ticket.slaDeadline && (
                <div>
                  <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">SLA Deadline</label>
                  <p className="mt-1 text-sm text-slate-900 dark:text-white">{formatDate(ticket.slaDeadline)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
