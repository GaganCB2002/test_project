import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Building, 
  Bell, 
  Shield, 
  Zap, 
  Globe,
  Save
} from 'lucide-react';

const SettingsItem = ({ icon, title, description, children }) => (
  <div className="flex items-start space-x-4 p-6 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-all">
    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-sm mb-1">{title}</h4>
      <p className="text-xs text-slate-500 mb-4">{description}</p>
      {children}
    </div>
  </div>
);

const Settings = () => {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-slate-500">Manage your account and organization preferences.</p>
      </div>

      <div className="glass-card divide-y divide-slate-100 dark:divide-slate-800">
        <SettingsItem 
          icon={<User size={20} />} 
          title="Personal Profile" 
          description="Update your personal information and profile picture."
        >
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" defaultValue="Admin User" />
            <input type="email" placeholder="Email" className="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" defaultValue="admin@nexusoft.com" />
          </div>
        </SettingsItem>

        <SettingsItem 
          icon={<Building size={20} />} 
          title="Organization Details" 
          description="Manage your company name, logo, and multi-tenant settings."
        >
          <input type="text" placeholder="Company Name" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" defaultValue="Nexus Soft" />
        </SettingsItem>

        <SettingsItem 
          icon={<Zap size={20} />} 
          title="AI Configuration" 
          description="Manage OpenAI API keys and AI scoring sensitivities."
        >
          <div className="space-y-4">
            <div className="relative">
              <input type="password" placeholder="OpenAI API Key" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm" defaultValue="••••••••••••••••" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary-600 hover:underline">Reveal</button>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="ai-auto" className="rounded text-primary-600" defaultChecked />
              <label htmlFor="ai-auto" className="text-xs text-slate-600">Enable automatic lead scoring on creation</label>
            </div>
          </div>
        </SettingsItem>

        <SettingsItem 
          icon={<Bell size={20} />} 
          title="Notifications" 
          description="Configure how you receive alerts and updates."
        >
          <div className="space-y-2">
            {['Email notifications', 'Browser push notifications', 'Weekly analytics report'].map(n => (
              <div key={n} className="flex items-center space-x-2">
                <input type="checkbox" className="rounded text-primary-600" defaultChecked />
                <span className="text-xs text-slate-600">{n}</span>
              </div>
            ))}
          </div>
        </SettingsItem>
      </div>

      <div className="flex justify-end">
        <button className="btn-primary flex items-center space-x-2 px-8 py-3">
          <Save size={20} />
          <span>Save All Changes</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
