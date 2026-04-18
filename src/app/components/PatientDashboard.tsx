import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { 
  Moon, 
  BookOpen, 
  MessageSquare, 
  Home, 
  BarChart3, 
  TrendingUp, 
  Bell, 
  Menu, 
  X, 
  Settings, 
  LogOut, 
  CheckCircle, 
  Clock, 
  ChevronRight, 
  Calendar 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from './ui/button';
import { useSleepLogs } from '../hooks/useSleepLogs';
import { useAllModulesProgress } from '../hooks/useModuleProgress';
import { useReminders } from '../hooks/useReminders';
import { useAuth } from '../contexts/useAuth';
import { useMessaging } from '../hooks/useMessaging';
import SleepLogModal from './SleepLogModal';

interface SleepLogData {
  date: string;
  bedtime: string;
  waketime: string;
  quality: number;
  notes?: string;
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user, signout } = useAuth();
  const { unreadCount } = useMessaging();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sleepLogModalOpen, setSleepLogModalOpen] = useState(false);
  const [sleepTrendMetric, setSleepTrendMetric] = useState<'duration' | 'efficiency' | 'wakeTime'>('duration');
  
  // Use localStorage-backed sleep logs
  const { logs: sleepLogs, addSleepLog, stats: sleepStats, getChartData } = useSleepLogs();
  
  // Use localStorage-backed module progress
  const moduleProgressStats = useAllModulesProgress();

  // Reminders system
  const { activeCount, refreshAutomaticReminders } = useReminders();

  // Refresh reminders when sleep logs or module progress changes
  useEffect(() => {
    const lastLogDate = sleepLogs.length > 0
      ? sleepLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
      : null;

    const incompleteModules = (moduleProgressStats.totalModules || 8) - (moduleProgressStats.completedCount || 0);

    refreshAutomaticReminders(lastLogDate, sleepStats.currentStreak, incompleteModules);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sleepLogs.length, sleepStats.currentStreak, moduleProgressStats.completedCount]);

  const handleSleepLogSubmit = (data: SleepLogData) => {
    addSleepLog(data);
    console.log('Sleep log saved to localStorage:', data);
  };

  // User name from auth context
  const userName = user?.name || 'Patient';

  // Mock data
  const currentWeek = 3;
  const totalWeeks = 8;
  const moduleProgress = 60; // percentage
  const currentModule = {
    title: 'Sleep Hygiene Essentials',
    description: 'Learn key habits to improve your sleep environment and routine',
    lessonsCompleted: 3,
    totalLessons: 5,
    estimatedTime: '25 min remaining',
  };

  // Real sleep statistics from localStorage
  const prescribedSleepHours = 7.5; // This would come from clinician settings
  
  const sleepStatsData = [
    { 
      label: 'Avg Sleep', 
      value: sleepStats.averageHours > 0 ? `${sleepStats.averageHours} hrs` : 'No data', 
      icon: Moon, 
      trend: sleepStats.averageHours >= 7 ? '+0.5' : 'Track more',
      subLabel: 'Prescribed Sleep',
      subValue: `${prescribedSleepHours} hrs`
    },
    { 
      label: 'Sleep Quality', 
      value: sleepStats.averageQuality > 0 ? `${Math.round(sleepStats.averageQuality * 20)}%` : 'No data', 
      icon: TrendingUp, 
      trend: sleepStats.totalLogs > 3 ? '+5%' : 'Keep logging' 
    },
    { 
      label: 'Current Streak', 
      value: `${sleepStats.currentStreak} day${sleepStats.currentStreak !== 1 ? 's' : ''}`, 
      icon: CheckCircle, 
      trend: sleepStats.currentStreak > 0 ? 'Great!' : 'Start now' 
    },
  ];

  // Real chart data from localStorage (last 7 days) - memoized for stability
  const sleepTrendData = useMemo(() => {
    return getChartData(7).map((item, index) => ({
      ...item,
      // Ensure each item has a truly unique key for recharts
      uniqueId: `${item.fullDate}-${index}`,
    }));
  }, [getChartData]);

  const quickActions = [
    { label: 'Log Last Night\'s Sleep', icon: Moon, color: 'purple', action: 'log-sleep' },
    { label: 'View Sleep Tips', icon: BookOpen, color: 'teal', action: 'sleep-tips' },
    { label: 'Message Care Team', icon: MessageSquare, color: 'purple', action: 'messages' },
  ];

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'log-sleep':
        setSleepLogModalOpen(true);
        break;
      case 'sleep-tips':
        navigate('/patient/sleep-tips');
        break;
      case 'messages':
        navigate('/patient/messages');
        break;
      default:
        break;
    }
  };

  const upcomingItems = [
    {
      type: 'appointment',
      title: 'Check-in Call with Dr. Chen',
      date: 'Tomorrow, 10:00 AM',
      icon: Calendar,
    },
    {
      type: 'reminder',
      title: 'Complete Week 3 Module',
      date: 'Due in 2 days',
      icon: Bell,
    },
    {
      type: 'reminder',
      title: 'Log Sleep for Past 3 Days',
      date: 'Today',
      icon: Clock,
    },
  ];

  const navigationItems = [
    { label: 'Dashboard', icon: Home, active: true, path: '/patient/dashboard' },
    { label: 'Sleep Modules', icon: BookOpen, active: false, path: '/modules' },
    { label: 'Sleep Log', icon: Moon, active: false, path: '/patient/dashboard', action: 'log-sleep' },
    { label: 'Sleep Analytics', icon: BarChart3, active: false, path: '/patient/sleep-analytics' },
    { label: 'My Progress', icon: TrendingUp, active: false, path: '/patient/progress' },
    { label: 'Messages', icon: MessageSquare, active: false, path: '/patient/messages' },
  ];

  // Suppress recharts duplicate key warning (known library issue)
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        (args[0].includes('Encountered two children with the same key') ||
         args[0].includes('width(0) and height(0)'))
      ) {
        return;
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

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
              <button 
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => navigate('/patient/reminders')}
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {activeCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-teal-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeCount}
                  </span>
                )}
              </button>
              <div className="hidden md:flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-lg">M</span>
                </div>
                <div>
                  <p className="text-sm" style={{ color: '#1f1f3d' }}>
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500">Patient</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside
          className={`fixed lg:sticky top-20 left-0 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-20'
          } overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.action) {
                      handleQuickAction(item.action);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-6 h-6 flex-shrink-0" />
                  <span
                    className={`text-base whitespace-nowrap ${
                      sidebarOpen ? 'opacity-100' : 'lg:opacity-0'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

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
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
              Good Morning, {userName}!
            </h1>
            <p className="text-lg text-gray-600">
              You're doing great! Let's continue your sleep wellness journey.
            </p>
          </div>

          {/* Current Week's Module - Main Focus */}
          <div className="mb-8">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-xl p-8 text-white">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm">Week {currentWeek} of {totalWeeks}</span>
                  </div>
                  <h2 className="text-3xl mb-3">{currentModule.title}</h2>
                  <p className="text-lg text-purple-100 mb-4">
                    {currentModule.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-purple-100">
                    {currentModule.lessonsCompleted} of {currentModule.totalLessons} lessons
                    completed
                  </span>
                  <span className="text-sm text-purple-100">
                    {moduleProgress}%
                  </span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500"
                    style={{ width: `${moduleProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* CTA and Time */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-2 text-purple-100">
                  <Clock className="w-5 h-5" />
                  <span className="text-base">{currentModule.estimatedTime}</span>
                </div>
                <Button
                  className="bg-white text-purple-700 hover:bg-purple-50 h-14 px-8 rounded-xl text-lg shadow-lg"
                  onClick={() => navigate('/modules/1')}
                >
                  Continue Module
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {sleepStatsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-teal-700" />
                    </div>
                    <div className="flex items-center space-x-1 text-teal-600 text-sm bg-teal-50 px-3 py-1 rounded-full">
                      <TrendingUp className="w-4 h-4" />
                      <span>{stat.trend}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl" style={{ color: '#1f1f3d' }}>
                    {stat.value}
                  </p>
                  {stat.subLabel && stat.subValue && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                        <span>{stat.subLabel}: {stat.subValue}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Sleep Trend Chart */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
                  Sleep Trend
                </h2>
                <p className="text-base text-gray-600">Last 7 days</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSleepTrendMetric('duration')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    sleepTrendMetric === 'duration'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Total Sleep
                </button>
                <button
                  onClick={() => setSleepTrendMetric('efficiency')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    sleepTrendMetric === 'efficiency'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Sleep Efficiency
                </button>
                <button
                  onClick={() => setSleepTrendMetric('wakeTime')}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    sleepTrendMetric === 'wakeTime'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Total Wake Time
                </button>
              </div>
            </div>

            {sleepTrendData.length > 0 ? (
              <>
                <div className="w-full" style={{ height: '320px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={sleepTrendData}
                      margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="date"
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                        tick={{ fill: '#6b7280' }}
                        interval="preserveStartEnd"
                      />
                      <YAxis
                        stroke="#6b7280"
                        style={{ fontSize: '14px' }}
                        tick={{ fill: '#6b7280' }}
                        domain={[0, 10]}
                        ticks={[0, 2, 4, 6, 8, 10]}
                        label={{
                          value: 'Hours',
                          angle: -90,
                          position: 'insideLeft',
                          style: { fill: '#6b7280', fontSize: '14px' },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e5e7eb',
                          borderRadius: '12px',
                          padding: '12px',
                        }}
                        labelStyle={{ color: '#1f1f3d', fontWeight: 500 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="hours"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        dot={{ fill: '#8b5cf6', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Sleep Hours"
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-purple-600"></div>
                    <span>Sleep Hours</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                  <Moon className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
                  No Sleep Data Yet
                </h3>
                <p className="text-base text-gray-600 mb-6 max-w-md">
                  Start logging your sleep to see trends and insights appear here.
                </p>
                <Button
                  onClick={() => setSleepLogModalOpen(true)}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                >
                  Log Your First Night
                </Button>
              </div>
            )}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
                Quick Actions
              </h2>
              <div className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  const handleClick = () => {
                    handleQuickAction(action.action);
                  };
                  
                  return (
                    <button
                      key={index}
                      onClick={handleClick}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        action.color === 'purple'
                          ? 'border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300'
                          : 'border-teal-200 bg-teal-50 hover:bg-teal-100 hover:border-teal-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            action.color === 'purple'
                              ? 'bg-gradient-to-br from-purple-500 to-purple-700'
                              : 'bg-gradient-to-br from-teal-500 to-teal-700'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span
                          className="text-base"
                          style={{ color: '#1f1f3d' }}
                        >
                          {action.label}
                        </span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Reminders & Appointments */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
                Upcoming
              </h2>
              <div className="space-y-4">
                {upcomingItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 border border-gray-200"
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          item.type === 'appointment'
                            ? 'bg-purple-100'
                            : 'bg-teal-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            item.type === 'appointment'
                              ? 'text-purple-700'
                              : 'text-teal-700'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base mb-1" style={{ color: '#1f1f3d' }}>
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-600">{item.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sleep Log Modal */}
      <SleepLogModal
        isOpen={sleepLogModalOpen}
        onClose={() => setSleepLogModalOpen(false)}
        onSubmit={handleSleepLogSubmit}
      />
    </div>
  );
}