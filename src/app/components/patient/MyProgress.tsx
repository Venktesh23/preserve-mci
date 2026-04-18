import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  TrendingUp,
  Moon,
  Calendar,
  Award,
  Target,
  BookOpen,
  CheckCircle,
  Clock,
  Star,
  Flame,
  Trophy,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSleepLogs } from '../../hooks/useSleepLogs';
import { useAllModulesProgress } from '../../hooks/useModuleProgress';
import PatientLayout from './PatientLayout';

export default function MyProgress() {
  const navigate = useNavigate();
  const { logs: sleepLogs, stats: sleepStats, getChartData } = useSleepLogs();
  const moduleProgressStats = useAllModulesProgress();
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(30);

  // Get chart data based on selected time range
  const sleepTrendData = useMemo(() => {
    return getChartData(timeRange).map((item, index) => ({
      ...item,
      uniqueId: `${item.fullDate}-${index}`,
    }));
  }, [getChartData, timeRange]);

  // Calculate achievements
  const achievements = useMemo(() => {
    const earned = [];

    // First log achievement
    if (sleepStats.totalLogs >= 1) {
      earned.push({
        id: 'first-log',
        name: 'First Step',
        description: 'Logged your first sleep entry',
        icon: Moon,
        color: 'purple',
        unlocked: true,
      });
    }

    // 7-day streak
    if (sleepStats.currentStreak >= 7) {
      earned.push({
        id: 'week-streak',
        name: '7-Day Streak',
        description: 'Logged sleep for 7 days in a row',
        icon: Flame,
        color: 'orange',
        unlocked: true,
      });
    }

    // 30-day streak
    if (sleepStats.currentStreak >= 30) {
      earned.push({
        id: 'month-streak',
        name: '30-Day Streak',
        description: 'Logged sleep for 30 days in a row',
        icon: Trophy,
        color: 'amber',
        unlocked: true,
      });
    }

    // First module completed
    if ((moduleProgressStats.completedCount || 0) >= 1) {
      earned.push({
        id: 'first-module',
        name: 'Learning Begun',
        description: 'Completed your first module',
        icon: BookOpen,
        color: 'teal',
        unlocked: true,
      });
    }

    // Half modules completed
    if ((moduleProgressStats.completedCount || 0) >= 4) {
      earned.push({
        id: 'halfway',
        name: 'Halfway There',
        description: 'Completed 4 modules',
        icon: Target,
        color: 'purple',
        unlocked: true,
      });
    }

    // All modules completed
    if ((moduleProgressStats.completedCount || 0) === (moduleProgressStats.totalModules || 8)) {
      earned.push({
        id: 'all-modules',
        name: 'Program Complete',
        description: 'Completed all 8 modules',
        icon: Award,
        color: 'amber',
        unlocked: true,
      });
    }

    // Quality sleep
    if (sleepStats.averageQuality >= 4) {
      earned.push({
        id: 'quality-sleep',
        name: 'Quality Rest',
        description: 'Average sleep quality of 4+',
        icon: Star,
        color: 'teal',
        unlocked: true,
      });
    }

    return earned;
  }, [sleepStats, moduleProgressStats]);

  // Calculate weekly summary for past 4 weeks
  const weeklySummary = useMemo(() => {
    const weeks = [];
    const now = new Date();

    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (i + 1) * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 7);

      const weekLogs = sleepLogs.filter((log) => {
        const logDate = new Date(log.date);
        return logDate >= weekStart && logDate < weekEnd;
      });

      const avgHours =
        weekLogs.length > 0
          ? weekLogs.reduce((sum, log) => sum + log.hoursSlept, 0) / weekLogs.length
          : 0;

      const avgQuality =
        weekLogs.length > 0
          ? weekLogs.reduce((sum, log) => sum + log.sleepQuality, 0) / weekLogs.length
          : 0;

      weeks.push({
        label: `Week ${4 - i}`,
        logsCount: weekLogs.length,
        avgHours: Number(avgHours.toFixed(1)),
        avgQuality: Number(avgQuality.toFixed(1)),
      });
    }

    return weeks;
  }, [sleepLogs]);

  // Suppress recharts warnings
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

  const progressStats = [
    {
      label: 'Total Sleep Logs',
      value: sleepStats.totalLogs,
      icon: Moon,
      color: 'purple',
      subtext: `${sleepStats.currentStreak} day streak`,
    },
    {
      label: 'Modules Completed',
      value: `${moduleProgressStats.completedCount || 0}/${moduleProgressStats.totalModules || 8}`,
      icon: BookOpen,
      color: 'teal',
      subtext: `${moduleProgressStats.averageProgress || 0}% complete`,
    },
    {
      label: 'Avg Sleep',
      value: sleepStats.averageHours > 0 ? `${sleepStats.averageHours} hrs` : 'No data',
      icon: Clock,
      color: 'purple',
      subtext: sleepStats.averageHours >= 7 ? 'Great!' : 'Keep improving',
    },
    {
      label: 'Achievements',
      value: achievements.length,
      icon: Award,
      color: 'teal',
      subtext: 'Milestones earned',
    },
  ];

  return (
    <PatientLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/patient/dashboard')}
              className="p-2 hover:bg-gray-100 rounded-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <div>
              <h1 className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
                My Progress
              </h1>
              <p className="text-lg text-gray-600">Track your journey to better sleep</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl">
            <Trophy className="w-6 h-6" />
            <span className="text-lg">
              {moduleProgressStats.averageProgress || 0}% Complete
            </span>
          </div>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {progressStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      stat.color === 'purple'
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                        : 'bg-gradient-to-br from-teal-100 to-teal-200'
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        stat.color === 'purple' ? 'text-purple-700' : 'text-teal-700'
                      }`}
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.subtext}</p>
              </div>
            );
          })}
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-700" />
              </div>
              <div>
                <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
                  Achievements Unlocked
                </h2>
                <p className="text-base text-gray-600">
                  {achievements.length} milestone{achievements.length !== 1 ? 's' : ''} earned
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div
                    key={achievement.id}
                    className="p-5 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          achievement.color === 'purple'
                            ? 'bg-purple-200 text-purple-700'
                            : achievement.color === 'teal'
                            ? 'bg-teal-200 text-teal-700'
                            : achievement.color === 'orange'
                            ? 'bg-orange-200 text-orange-700'
                            : 'bg-amber-200 text-amber-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg mb-1" style={{ color: '#1f1f3d' }}>
                          {achievement.name}
                        </h3>
                        <p className="text-sm text-gray-700">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sleep Trend Chart */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
                Sleep Trend
              </h2>
              <p className="text-base text-gray-600">
                Your sleep hours over time
              </p>
            </div>

            <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setTimeRange(7)}
                className={`px-4 py-2 rounded-lg text-base transition-colors ${
                  timeRange === 7
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange(14)}
                className={`px-4 py-2 rounded-lg text-base transition-colors ${
                  timeRange === 14
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                14 Days
              </button>
              <button
                onClick={() => setTimeRange(30)}
                className={`px-4 py-2 rounded-lg text-base transition-colors ${
                  timeRange === 30
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {sleepTrendData.some((d) => d.hasData) ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                <Moon className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
                No Sleep Data Yet
              </h3>
              <p className="text-base text-gray-600 mb-6">
                Start logging your sleep to see trends
              </p>
              <Button
                onClick={() => navigate('/patient/dashboard')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6 rounded-xl"
              >
                Log Sleep Now
              </Button>
            </div>
          )}
        </div>

        {/* Weekly Summary */}
        {weeklySummary.some((w) => w.logsCount > 0) && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
              4-Week Summary
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {weeklySummary.map((week, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                      {week.label}
                    </h3>
                    <span className="text-sm px-3 py-1 bg-white rounded-full text-gray-700 border border-gray-200">
                      {week.logsCount} logs
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Sleep</p>
                      <p className="text-2xl" style={{ color: '#1f1f3d' }}>
                        {week.avgHours > 0 ? `${week.avgHours} hrs` : 'No data'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avg Quality</p>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= week.avgQuality
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Progress */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
            Module Progress
          </h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg" style={{ color: '#1f1f3d' }}>
                  Overall Completion
                </span>
                <span className="text-2xl" style={{ color: '#1f1f3d' }}>
                  {moduleProgressStats.averageProgress || 0}%
                </span>
              </div>
              <Progress value={moduleProgressStats.averageProgress || 0} className="h-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-teal-50 border border-teal-200">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-teal-700" />
                  <h3 className="text-xl" style={{ color: '#1f1f3d' }}>
                    Completed
                  </h3>
                </div>
                <p className="text-3xl" style={{ color: '#1f1f3d' }}>
                  {moduleProgressStats.completedCount || 0}
                </p>
                <p className="text-sm text-gray-600">modules finished</p>
              </div>

              <div className="p-5 rounded-xl bg-purple-50 border border-purple-200">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-6 h-6 text-purple-700" />
                  <h3 className="text-xl" style={{ color: '#1f1f3d' }}>
                    Remaining
                  </h3>
                </div>
                <p className="text-3xl" style={{ color: '#1f1f3d' }}>
                  {(moduleProgressStats.totalModules || 8) - (moduleProgressStats.completedCount || 0)}
                </p>
                <p className="text-sm text-gray-600">modules to go</p>
              </div>
            </div>

            <Button
              onClick={() => navigate('/modules')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 rounded-xl"
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}