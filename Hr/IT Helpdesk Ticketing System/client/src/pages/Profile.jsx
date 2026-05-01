import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Building, Shield, Camera, Save } from 'lucide-react';
import { updateProfile } from '../redux/slices/authSlice';
import { toast } from '../components/ui/Toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    dispatch(updateProfile(formData)).then((res) => {
      if (!res.error) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update profile');
      }
    });
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const roleStyles = {
    admin: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
    it_staff: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
    employee: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your account settings</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
      >
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700/50">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold">
              {getInitials(user?.name)}
            </div>
            <button className="absolute -bottom-2 -right-2 p-2 rounded-full bg-white dark:bg-dark-100 shadow-lg border border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Camera className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{user?.name}</h2>
            <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-lg text-sm font-medium capitalize ${roleStyles[user?.role]}`}>
              {user?.role?.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setIsEditing(true); }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-dark-200 text-slate-500 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={formData.department}
                onChange={(e) => { setFormData({ ...formData, department: e.target.value }); setIsEditing(true); }}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-dark-50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                placeholder="Enter your department"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Role</label>
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={user?.role?.replace('_', ' ').charAt(0).toUpperCase() + user?.role?.replace('_', ' ').slice(1) || ''}
                disabled
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-dark-200 text-slate-500 capitalize cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Contact admin to change your role</p>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => { setIsEditing(false); setFormData({ name: user?.name, department: user?.department }); }}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-6 rounded-2xl ${mode === 'dark' ? 'bg-dark-100/80 glass glass-border' : 'bg-white shadow-sm'}`}
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Security</h3>
        <button className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
          Change Password
        </button>
      </motion.div>
    </div>
  );
};

export default Profile;
