import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Heart,
  Bell,
  LogOut,
  Home,
  BarChart3,
  BookOpen,
  Settings,
  Menu,
  X,
  MessageSquare,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../contexts/useAuth';
import PatientOverview from './care-partner/PatientOverview';
import PatientSleepLogs from './care-partner/PatientSleepLogs';
import CarePartnerSleepAnalytics from './care-partner/CarePartnerSleepAnalytics';
import CarePartnerProgress from './care-partner/CarePartnerProgress';
import CareResources from './care-partner/CareResources';
import CarePartnerMessagesCenter from './care-partner/CarePartnerMessagesCenter';
import CarePartnerSettingsPage from './care-partner/SettingsPage';

const ROUTES = {
  dashboard: '/care-partner/dashboard',
  sleepLogs: '/care-partner/sleep-logs',
  analytics: '/care-partner/sleep-analytics',
  progress: '/care-partner/progress',
  resources: '/care-partner/resources',
  messages: '/care-partner/messages',
  settings: '/care-partner/settings',
} as const;

const navItems = [
  { label: 'Overview',       icon: Home,         path: ROUTES.dashboard,  view: 'dashboard'  },
  { label: 'Sleep Logs',     icon: BarChart3,     path: ROUTES.sleepLogs,  view: 'sleep-logs' },
  { label: 'Analytics',      icon: TrendingUp,    path: ROUTES.analytics,  view: 'sleep-analytics' },
  { label: 'Progress',       icon: BookOpen,      path: ROUTES.progress,   view: 'progress'   },
  { label: 'Resources',      icon: BookOpen,      path: ROUTES.resources,  view: 'resources'  },
  { label: 'Messages',       icon: MessageSquare, path: ROUTES.messages,   view: 'messages'   },
];

export default function CarePartnerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signout();
    navigate('/');
  };

  const currentView = location.pathname.split('/')[2] || 'dashboard';

  const renderContent = () => {
    switch (currentView) {
      case 'sleep-logs':    return <PatientSleepLogs />;
      case 'sleep-analytics': return <CarePartnerSleepAnalytics />;
      case 'progress':      return <CarePartnerProgress />;
      case 'resources':     return <CareResources />;
      case 'messages':      return <CarePartnerMessagesCenter />;
      case 'settings':      return <CarePartnerSettingsPage />;
      default:              return <PatientOverview />;
    }
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'CP';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl" style={{ color: '#1f1f3d' }}>Sleep Intervention</h1>
                  <p className="text-sm text-gray-500">Care Partner Portal</p>
                </div>
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full" />
              </button>
              <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <span className="text-white font-medium">{initials}</span>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#1f1f3d' }}>{user?.name || 'Care Partner'}</p>
                  <p className="text-xs text-gray-500">Care Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 flex flex-col ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  title={item.label}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span className={`text-base whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-200 space-y-1">
            <button
              onClick={() => { navigate(ROUTES.settings); setSidebarOpen(false); }}
              title="Settings"
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                currentView === 'settings' ? 'bg-teal-50 text-teal-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings className="w-6 h-6 flex-shrink-0" />
              <span className={`text-base whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                Settings
              </span>
            </button>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              <LogOut className="w-6 h-6 flex-shrink-0" />
              <span className={`text-base whitespace-nowrap ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                Sign Out
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
