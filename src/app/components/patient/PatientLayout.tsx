import { useState, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  Moon,
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
  Home,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '../../contexts/useAuth';
import { useMessaging } from '../../hooks/useMessaging';
import { useReminders } from '../../hooks/useReminders';

interface PatientLayoutProps {
  children: ReactNode;
}

export default function PatientLayout({ children }: PatientLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signout } = useAuth();
  const { unreadCount } = useMessaging();
  const { activeCount } = useReminders();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = user?.name || 'Patient';

  const navigationItems = [
    { label: 'Dashboard', icon: Home, path: '/patient/dashboard' },
    { label: 'Weekly Sleep Modules', icon: BookOpen, path: '/modules' },
    { label: 'My Progress', icon: TrendingUp, path: '/patient/progress' },
    { label: 'Sleep Analysis', icon: BarChart3, path: '/patient/sleep-analytics' },
    { label: 'Messages', icon: MessageSquare, path: '/patient/messages', badge: unreadCount },
    { label: 'Reminders', icon: Bell, path: '/patient/reminders', badge: activeCount },
  ];

  const handleSignOut = async () => {
    await signout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {sidebarOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                  <Moon className="w-6 h-6 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl" style={{ color: '#1f1f3d' }}>
                    Sleep Intervention
                  </h1>
                  <p className="text-sm text-gray-500">Patient Portal</p>
                </div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-teal-500 rounded-full"></span>
              </button>
              <button className="hidden sm:block p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
              <div className="hidden sm:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm" style={{ color: '#1f1f3d' }}>
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-lg">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`
            fixed lg:sticky top-20 left-0 z-30 h-[calc(100vh-5rem)] 
            bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out
            w-72 lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <nav className="p-6 space-y-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={index}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="text-base">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="min-w-[24px] h-6 px-2 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                onClick={() => navigate('/patient/settings')}
              >
                <Settings className="w-6 h-6 flex-shrink-0" />
                <span
                  className={`text-base whitespace-nowrap ${
                    sidebarOpen ? 'opacity-100' : 'lg:opacity-0'
                  }`}
                >
                  Settings
                </span>
              </button>
              <button
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
                onClick={handleSignOut}
              >
                <LogOut className="w-6 h-6 flex-shrink-0" />
                <span
                  className={`text-base whitespace-nowrap ${
                    sidebarOpen ? 'opacity-100' : 'lg:opacity-0'
                  }`}
                >
                  Sign Out
                </span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
}