import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Bell,
  Palette,
  Puzzle,
  Camera,
  Save,
  Github,
  Slack,
  Figma,
  Container,
  Send,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'account', label: 'Account', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
];

const skillsOptions = [
  'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'Go',
  'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'REST API', 'MongoDB',
  'PostgreSQL', 'Redis', 'CI/CD', 'Agile', 'Scrum', 'Leadership',
];

const integrations = [
  { id: 'github', name: 'GitHub', icon: Github, color: 'bg-gray-900' },
  { id: 'slack', name: 'Slack', icon: Slack, color: 'bg-purple-600' },
  { id: 'figma', name: 'Figma', icon: Figma, color: 'bg-pink-600' },
  { id: 'docker', name: 'Docker', icon: Container, color: 'bg-blue-600' },
  { id: 'jira', name: 'Jira', icon: Puzzle, color: 'bg-blue-500' },
  { id: 'postman', name: 'Postman', icon: Send, color: 'bg-orange-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Sarah Chen',
    email: 'sarah.chen@techlead.io',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    bio: 'Experienced tech lead with 8+ years in full-stack development. Passionate about building scalable systems and mentoring teams.',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Account state
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordError, setPasswordError] = useState('');

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    messageAlerts: true,
    fileUploads: false,
  });

  // Theme state
  const [themeSettings, setThemeSettings] = useState({
    mode: 'system',
    accentColor: '#3b82f6',
    fontSize: 'medium',
  });

  // Integrations state
  const [connectedIntegrations, setConnectedIntegrations] = useState({
    github: { connected: true, lastSync: '2026-04-27T10:30:00Z' },
    slack: { connected: true, lastSync: '2026-04-27T09:15:00Z' },
    jira: { connected: false, lastSync: null },
    figma: { connected: false, lastSync: null },
    docker: { connected: true, lastSync: '2026-04-26T18:00:00Z' },
    postman: { connected: false, lastSync: null },
  });

  const showSaveToast = (message = 'Settings saved successfully!') => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setProfile({ ...profile, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillToggle = (skill) => {
    const newSkills = profile.skills.includes(skill)
      ? profile.skills.filter((s) => s !== skill)
      : [...profile.skills, skill];
    setProfile({ ...profile, skills: newSkills });
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (passwords.new.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    setPasswordError('');
    showSaveToast('Password changed successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleIntegrationToggle = (id) => {
    setConnectedIntegrations((prev) => ({
      ...prev,
      [id]: {
        connected: !prev[id].connected,
        lastSync: !prev[id].connected ? new Date().toISOString() : null,
      },
    }));
  };

  const formatLastSync = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white/10 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              avatarPreview={avatarPreview}
              onAvatarChange={handleAvatarChange}
              onSkillToggle={handleSkillToggle}
              onChange={(field, value) => setProfile({ ...profile, [field]: value })}
              onSave={() => showSaveToast()}
              skillsOptions={skillsOptions}
            />
          )}
          {activeTab === 'account' && (
            <AccountTab
              passwords={passwords}
              showPasswords={showPasswords}
              error={passwordError}
              onPasswordChange={handlePasswordChange}
              onShowToggle={(field) =>
                setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
              }
              onPasswordInput={(field, value) =>
                setPasswords((prev) => ({ ...prev, [field]: value }))
              }
            />
          )}
          {activeTab === 'notifications' && (
            <NotificationsTab
              settings={notificationSettings}
              onToggle={(key) =>
                setNotificationSettings((prev) => ({ ...prev, [key]: !prev[key] }))
              }
              onSave={() => showSaveToast()}
            />
          )}
          {activeTab === 'theme' && (
            <ThemeTab
              settings={themeSettings}
              onChange={setThemeSettings}
              onSave={() => showSaveToast()}
            />
          )}
          {activeTab === 'integrations' && (
            <IntegrationsTab
              integrations={integrations}
              connected={connectedIntegrations}
              onToggle={handleIntegrationToggle}
              formatLastSync={formatLastSync}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 backdrop-blur-xl bg-green-500/90 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50"
          >
            <Check className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Profile Tab Component
const ProfileTab = ({ profile, avatarPreview, onAvatarChange, onSkillToggle, onChange, onSave, skillsOptions }) => (
  <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 space-y-6">
    <div className="flex items-center gap-6">
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            profile.name.split(' ').map((n) => n[0]).join('')
          )}
        </div>
        <label className="absolute bottom-0 right-0 p-2 bg-primary-500 rounded-full cursor-pointer hover:bg-primary-600 transition-colors shadow-lg">
          <Camera className="w-4 h-4 text-white" />
          <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
        </label>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Photo</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">JPG, PNG or GIF. Max 2MB.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => onChange('email', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
        <input
          type="tel"
          value={profile.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Department</label>
        <select
          value={profile.department}
          onChange={(e) => onChange('department', e.target.value)}
          className="input-field"
        >
          <option>Engineering</option>
          <option>Product</option>
          <option>Design</option>
          <option>Operations</option>
          <option>Marketing</option>
        </select>
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
      <div className="flex flex-wrap gap-2">
        {skillsOptions.map((skill) => (
          <button
            key={skill}
            onClick={() => onSkillToggle(skill)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              profile.skills.includes(skill)
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {skill}
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio</label>
      <textarea
        value={profile.bio}
        onChange={(e) => onChange('bio', e.target.value)}
        rows={4}
        className="input-field resize-none"
      />
    </div>

    <div className="flex justify-end">
      <button onClick={onSave} className="btn-primary">
        <Save className="w-4 h-4" />
        Save Changes
      </button>
    </div>
  </div>
);

// Account Tab Component
const AccountTab = ({ passwords, showPasswords, error, onPasswordChange, onShowToggle, onPasswordInput }) => (
  <div className="space-y-6">
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h3>
      <div className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
          <div className="relative">
            <input
              type={showPasswords.current ? 'text' : 'password'}
              value={passwords.current}
              onChange={(e) => onPasswordInput('current', e.target.value)}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => onShowToggle('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
          <div className="relative">
            <input
              type={showPasswords.new ? 'text' : 'password'}
              value={passwords.new}
              onChange={(e) => onPasswordInput('new', e.target.value)}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => onShowToggle('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
          <div className="relative">
            <input
              type={showPasswords.confirm ? 'text' : 'password'}
              value={passwords.confirm}
              onChange={(e) => onPasswordInput('confirm', e.target.value)}
              className="input-field pr-10"
            />
            <button
              type="button"
              onClick={() => onShowToggle('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button onClick={onPasswordChange} className="btn-primary">
          <Lock className="w-4 h-4" />
          Update Password
        </button>
      </div>
    </div>

    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Settings</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
          </div>
          <button className="px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors">
            Enable
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Auto logout after inactivity</p>
          </div>
          <select className="input-field w-32">
            <option>15 min</option>
            <option>30 min</option>
            <option>1 hour</option>
            <option>4 hours</option>
          </select>
        </div>
      </div>
    </div>
  </div>
);

// Notifications Tab Component
const NotificationsTab = ({ settings, onToggle, onSave }) => {
  const notificationOptions = [
    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
    { key: 'pushNotifications', label: 'Push Notifications', description: 'Get push notifications on your device' },
    { key: 'taskUpdates', label: 'Task Updates', description: 'Updates on task assignments and changes' },
    { key: 'messageAlerts', label: 'Message Alerts', description: 'Notifications for new messages' },
    { key: 'fileUploads', label: 'File Uploads', description: 'Alerts when files are shared with you' },
  ];

  return (
    <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Preferences</h3>
      {notificationOptions.map((option) => (
        <div
          key={option.key}
          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{option.label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{option.description}</p>
          </div>
          <button
            onClick={() => onToggle(option.key)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              settings[option.key] ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                settings[option.key] ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <button onClick={onSave} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Preferences
        </button>
      </div>
    </div>
  );
};

// Theme Tab Component
const ThemeTab = ({ settings, onChange, onSave }) => {
  const modes = [
    { id: 'light', label: 'Light', preview: 'bg-white', textColor: 'text-gray-900' },
    { id: 'dark', label: 'Dark', preview: 'bg-gray-900', textColor: 'text-white' },
    { id: 'system', label: 'System', preview: 'gradient-to-r from-white to-gray-900', textColor: 'text-gray-900 dark:text-white' },
  ];

  const fontSizes = [
    { id: 'small', label: 'Small', size: '12px' },
    { id: 'medium', label: 'Medium', size: '14px' },
    { id: 'large', label: 'Large', size: '16px' },
    { id: 'xlarge', label: 'Extra Large', size: '18px' },
  ];

  const accentColors = [
    '#3b82f6', '#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#6366f1',
  ];

  return (
    <div className="space-y-6">
      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onChange({ ...settings, mode: mode.id })}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                settings.mode === mode.id
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
              }`}
            >
              <div className={`w-full h-20 rounded-lg ${mode.preview} border border-gray-200 dark:border-gray-700`} />
              <p className={`mt-2 font-medium ${mode.textColor}`}>{mode.label}</p>
              {settings.mode === mode.id && (
                <Check className="absolute top-2 right-2 w-5 h-5 text-primary-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Accent Color</h3>
        <div className="flex flex-wrap gap-3">
          {accentColors.map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...settings, accentColor: color })}
              className={`w-10 h-10 rounded-full transition-transform hover:scale-110 ${
                settings.accentColor === color ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Font Size</h3>
        <div className="flex flex-wrap gap-3">
          {fontSizes.map((font) => (
            <button
              key={font.id}
              onClick={() => onChange({ ...settings, fontSize: font.id })}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                settings.fontSize === font.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              style={{ fontSize: font.size }}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={onSave} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Theme
        </button>
      </div>
    </div>
  );
};

// Integrations Tab Component
const IntegrationsTab = ({ integrations, connected, onToggle, formatLastSync }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {integrations.map((integration) => (
      <motion.div
        key={integration.id}
        whileHover={{ scale: 1.02 }}
        className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 rounded-2xl border border-white/20 dark:border-gray-700/50 p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-12 h-12 ${integration.color} rounded-xl flex items-center justify-center`}>
            <integration.icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{integration.name}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {connected[integration.id].connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {connected[integration.id].connected ? `Last sync: ${formatLastSync(connected[integration.id].lastSync)}` : 'Not synced'}
          </span>
          <button
            onClick={() => onToggle(integration.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              connected[integration.id].connected
                ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-primary-500 text-white hover:bg-primary-600'
            }`}
          >
            {connected[integration.id].connected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </motion.div>
    ))}
  </div>
);

export default Settings;
