'use client';

import { useState, ChangeEvent } from 'react';
import { 
  UserCircleIcon, 
  BellIcon, 
  LockClosedIcon, 
  GlobeAltIcon,
  PaintBrushIcon,
  CreditCardIcon,
  KeyIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Switch } from '@/components/ui/Switch';

interface SettingsTab {
  name: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string }>;
}

interface ProfileFormData {
  name: string;
  email: string;
  company: string;
  role: string;
  bio: string;
}

interface NotificationFormData {
  emailNotifications: boolean;
  jobAlerts: boolean;
  candidateUpdates: boolean;
  weeklyDigest: boolean;
}

interface AppearanceFormData {
  theme: 'light' | 'dark' | 'system';
  density: 'comfortable' | 'compact';
}

interface LocalizationFormData {
  language: string;
  timezone: string;
  dateFormat: string;
}

interface SettingsFormData extends ProfileFormData, NotificationFormData, AppearanceFormData, LocalizationFormData {}

const tabs: SettingsTab[] = [
  { name: 'Profile', icon: UserCircleIcon },
  { name: 'Notifications', icon: BellIcon },
  { name: 'Security', icon: LockClosedIcon },
  { name: 'Appearance', icon: PaintBrushIcon },
  { name: 'Billing', icon: CreditCardIcon },
  { name: 'API Keys', icon: KeyIcon },
  { name: 'Privacy', icon: DocumentTextIcon },
  { name: 'Localization', icon: GlobeAltIcon },
];

export default function SettingsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>('Profile');
  const [formData, setFormData] = useState<SettingsFormData>({
    // Profile
    name: 'John Doe',
    email: 'john.doe@example.com',
    company: 'Tech Innovations Inc.',
    role: 'Recruiter',
    bio: 'Experienced recruiter with a focus on tech talent acquisition.',
    
    // Notifications
    emailNotifications: true,
    jobAlerts: true,
    candidateUpdates: true,
    weeklyDigest: false,
    
    // Appearance
    theme: 'system',
    density: 'comfortable',
    
    // Localization
    language: 'en',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (name: string, checked: boolean): void => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Sidebar */}
          <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
            <nav className="flex flex-col sm:h-full py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => setActiveTab(tab.name)}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    activeTab === tab.name
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600 dark:bg-gray-700 dark:text-primary-400'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-3" aria-hidden="true" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {activeTab === 'Profile' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Profile Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      id="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Role
                    </label>
                    <select
                      name="role"
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="Recruiter">Recruiter</option>
                      <option value="Hiring Manager">Hiring Manager</option>
                      <option value="HR Manager">HR Manager</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      id="bio"
                      rows={4}
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Notifications</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive email notifications for important updates
                      </p>
                    </div>
                    <Switch
                      checked={formData.emailNotifications}
                      onChange={(checked) => handleSwitchChange('emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Job Alerts</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive notifications when new jobs match your criteria
                      </p>
                    </div>
                    <Switch
                      checked={formData.jobAlerts}
                      onChange={(checked) => handleSwitchChange('jobAlerts', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Candidate Updates</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get notified about candidate status changes
                      </p>
                    </div>
                    <Switch
                      checked={formData.candidateUpdates}
                      onChange={(checked) => handleSwitchChange('candidateUpdates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Digest</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive a weekly summary of activities
                      </p>
                    </div>
                    <Switch
                      checked={formData.weeklyDigest}
                      onChange={(checked) => handleSwitchChange('weeklyDigest', checked)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Appearance' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Appearance Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Theme
                    </label>
                    <select
                      name="theme"
                      id="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="density" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Density
                    </label>
                    <select
                      name="density"
                      id="density"
                      value={formData.density}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Localization' && (
              <div className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Localization Settings</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Language
                    </label>
                    <select
                      name="language"
                      id="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                      <option value="zh">Chinese</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      id="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">Greenwich Mean Time (GMT)</option>
                      <option value="Europe/Paris">Central European Time (CET)</option>
                      <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Format
                    </label>
                    <select
                      name="dateFormat"
                      id="dateFormat"
                      value={formData.dateFormat}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {(activeTab === 'Security' || activeTab === 'Billing' || activeTab === 'API Keys' || activeTab === 'Privacy') && (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {activeTab} Settings
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  This section is under development. Check back soon for {activeTab.toLowerCase()} settings and configuration options.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
