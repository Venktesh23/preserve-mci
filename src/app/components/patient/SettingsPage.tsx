import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Bell,
  Moon,
  Clock,
  User,
  Lock,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  ChevronRight,
  Save,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { useAuth } from '../../contexts/useAuth';
import { useReminders } from '../../hooks/useReminders';
import PatientLayout from './PatientLayout';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { preferences, updatePreferences } = useReminders();

  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handleSave = () => {
    updatePreferences(localPreferences);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleToggle = (key: keyof typeof localPreferences) => {
    setLocalPreferences({
      ...localPreferences,
      [key]: !localPreferences[key],
    });
  };

  const handleTimeChange = (key: 'sleepLogTime' | 'digestTime', value: string) => {
    setLocalPreferences({
      ...localPreferences,
      [key]: value,
    });
  };

  return (
    <PatientLayout>
      <div className="space-y-8 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
            Settings & Preferences
          </h1>
          <p className="text-lg text-gray-600">
            Customize your experience and notification preferences
          </p>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Name</p>
                <p className="text-lg" style={{ color: '#1f1f3d' }}>
                  {user?.name || 'Not set'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg" style={{ color: '#1f1f3d' }}>
                  {user?.email || 'Not set'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Role</p>
                <p className="text-lg capitalize" style={{ color: '#1f1f3d' }}>
                  {user?.role?.replace('_', ' ') || 'Patient'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg" style={{ color: '#1f1f3d' }}>
                  {new Date().toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-6">
            {/* Sleep Log Reminders */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Moon className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                    Daily Sleep Log Reminders
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Get reminded to log your sleep each day
                </p>
                {localPreferences.sleepLogReminders && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <input
                      type="time"
                      value={localPreferences.sleepLogTime}
                      onChange={(e) => handleTimeChange('sleepLogTime', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    />
                  </div>
                )}
              </div>
              <Switch
                checked={localPreferences.sleepLogReminders}
                onCheckedChange={() => handleToggle('sleepLogReminders')}
              />
            </div>

            {/* Module Reminders */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                    Module Completion Reminders
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Receive reminders about incomplete learning modules
                </p>
              </div>
              <Switch
                checked={localPreferences.moduleReminders}
                onCheckedChange={() => handleToggle('moduleReminders')}
              />
            </div>

            {/* Streak Reminders */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                    Streak Maintenance
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Get notified when your logging streak is at risk
                </p>
              </div>
              <Switch
                checked={localPreferences.streakReminders}
                onCheckedChange={() => handleToggle('streakReminders')}
              />
            </div>

            {/* Appointment Reminders */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                    Appointment Reminders
                  </h3>
                </div>
                <p className="text-sm text-gray-600">
                  Receive reminders about upcoming appointments
                </p>
              </div>
              <Switch
                checked={localPreferences.appointmentReminders}
                onCheckedChange={() => handleToggle('appointmentReminders')}
              />
            </div>

            {/* Daily Digest */}
            <div className="flex items-start justify-between p-4 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                    Daily Digest
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Get a summary of your activity each day
                </p>
                {localPreferences.dailyDigest && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <input
                      type="time"
                      value={localPreferences.digestTime}
                      onChange={(e) => handleTimeChange('digestTime', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-300 text-sm"
                    />
                  </div>
                )}
              </div>
              <Switch
                checked={localPreferences.dailyDigest}
                onCheckedChange={() => handleToggle('dailyDigest')}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => navigate('/patient/dashboard')}
            variant="outline"
            className="h-12 px-6 rounded-xl border-2 border-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6 rounded-xl"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}
