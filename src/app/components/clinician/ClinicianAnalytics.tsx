import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  TrendingUp,
  Users,
  Moon,
  Award,
  BarChart3,
  Activity,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/button';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useClinicianPatients } from '../../hooks/useClinicianPatients';

export default function ClinicianAnalytics() {
  const navigate = useNavigate();
  const { patients, stats } = useClinicianPatients();

  // Risk distribution data
  const riskDistribution = useMemo(() => {
    const distribution = { low: 0, medium: 0, high: 0 };
    patients.forEach((p) => {
      distribution[p.riskLevel]++;
    });

    return [
      { name: 'Low Risk', value: distribution.low, color: '#14b8a6' },
      { name: 'Medium Risk', value: distribution.medium, color: '#f59e0b' },
      { name: 'High Risk', value: distribution.high, color: '#ef4444' },
    ];
  }, [patients]);

  // Activity distribution
  const activityData = useMemo(() => {
    const now = new Date();
    const active = patients.filter((p) => {
      const lastActive = new Date(p.lastActive);
      const daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      return daysSince <= 7;
    }).length;

    const inactive = patients.length - active;

    return [
      { name: 'Active (≤7 days)', value: active, color: '#8b5cf6' },
      { name: 'Inactive (>7 days)', value: inactive, color: '#94a3b8' },
    ];
  }, [patients]);

  // Enrollment trend (mock data - weekly enrollments over 12 weeks)
  const enrollmentTrend = useMemo(() => {
    const weeks = [];
    const now = new Date();

    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - i * 7);
      
      // Count enrollments in this week
      const enrolled = patients.filter((p) => {
        const enrollDate = new Date(p.dateEnrolled);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        return enrollDate >= weekStart && enrollDate < weekEnd;
      }).length;

      weeks.push({
        week: weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        enrolled,
      });
    }

    return weeks;
  }, [patients]);

  // Age distribution
  const ageDistribution = useMemo(() => {
    const ranges = {
      '65-69': 0,
      '70-74': 0,
      '75-79': 0,
      '80+': 0,
    };

    patients.forEach((p) => {
      if (p.age >= 65 && p.age <= 69) ranges['65-69']++;
      else if (p.age >= 70 && p.age <= 74) ranges['70-74']++;
      else if (p.age >= 75 && p.age <= 79) ranges['75-79']++;
      else if (p.age >= 80) ranges['80+']++;
    });

    return [
      { range: '65-69', count: ranges['65-69'] },
      { range: '70-74', count: ranges['70-74'] },
      { range: '75-79', count: ranges['75-79'] },
      { range: '80+', count: ranges['80+'] },
    ];
  }, [patients]);

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

  const keyMetrics = [
    {
      label: 'Program Adherence',
      value: `${stats.averageAdherence}%`,
      icon: Award,
      color: 'purple',
      trend: '+5% from last month',
    },
    {
      label: 'Patient Retention',
      value: `${Math.round((stats.activePatients / stats.totalPatients) * 100)}%`,
      icon: Users,
      color: 'teal',
      trend: `${stats.activePatients}/${stats.totalPatients} active`,
    },
    {
      label: 'Avg Sleep Quality',
      value: `${stats.averageSleepQuality}%`,
      icon: Moon,
      color: 'purple',
      trend: '+3% improvement',
    },
    {
      label: 'Engagement Rate',
      value: '82%',
      icon: Activity,
      color: 'teal',
      trend: 'Weekly module completion',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/clinician/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
              Program Analytics
            </h1>
            <p className="text-lg text-gray-600">
              Aggregate insights and performance metrics
            </p>
          </div>
        </div>

        <Button
          onClick={() => window.print()}
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6 rounded-xl"
        >
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {keyMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    metric.color === 'purple'
                      ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                      : 'bg-gradient-to-br from-teal-100 to-teal-200'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      metric.color === 'purple' ? 'text-purple-700' : 'text-teal-700'
                    }`}
                  />
                </div>
                <TrendingUp className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
              <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
                {metric.value}
              </p>
              <p className="text-sm text-gray-500">{metric.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Distribution */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
            Patient Risk Distribution
          </h2>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {riskDistribution.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Status */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
            Patient Activity Status
          </h2>
          <div className="w-full" style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {activityData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enrollment Trend */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
          Enrollment Trend
        </h2>
        <p className="text-base text-gray-600 mb-6">
          Weekly patient enrollments over the past 12 weeks
        </p>
        <div className="w-full" style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={enrollmentTrend}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="week"
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
                tick={{ fill: '#6b7280' }}
                interval="preserveStartEnd"
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
                tick={{ fill: '#6b7280' }}
                label={{
                  value: 'Enrollments',
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
                dataKey="enrolled"
                stroke="#8b5cf6"
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', r: 5 }}
                activeDot={{ r: 7 }}
                name="New Enrollments"
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Age Distribution */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
          Age Distribution
        </h2>
        <p className="text-base text-gray-600 mb-6">
          Patient age ranges in the program
        </p>
        <div className="w-full" style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ageDistribution}
              margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis
                dataKey="range"
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
                tick={{ fill: '#6b7280' }}
              />
              <YAxis
                stroke="#6b7280"
                style={{ fontSize: '14px' }}
                tick={{ fill: '#6b7280' }}
                label={{
                  value: 'Patients',
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
              <Bar
                dataKey="count"
                fill="#14b8a6"
                radius={[8, 8, 0, 0]}
                name="Patients"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="bg-gradient-to-br from-purple-50 to-teal-50 rounded-2xl border-2 border-purple-200 p-8">
        <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
          Program Summary
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <p className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
              {Math.round((patients.reduce((sum, p) => {
                const enrolled = new Date(p.dateEnrolled);
                const daysSince = Math.floor((Date.now() - enrolled.getTime()) / (1000 * 60 * 60 * 24));
                return sum + daysSince;
              }, 0) / patients.length) / 7)}
            </p>
            <p className="text-sm text-gray-600">Avg Weeks Enrolled</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 text-teal-600" />
            <p className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
              {Math.round((patients.filter(p => p.carePartnerName).length / patients.length) * 100)}%
            </p>
            <p className="text-sm text-gray-600">With Care Partners</p>
          </div>
          <div className="bg-white rounded-xl p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-purple-600" />
            <p className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
              {Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length)}
            </p>
            <p className="text-sm text-gray-600">Average Age</p>
          </div>
        </div>
      </div>
    </div>
  );
}
