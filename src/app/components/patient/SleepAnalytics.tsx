import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Moon,
  Star,
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronRight,
  BarChart3,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useSleepLogs } from '../../hooks/useSleepLogs';
import { calculateSleepAnalytics } from '../../utils/sleepAnalytics';
import PatientLayout from './PatientLayout';

export default function SleepAnalytics() {
  const navigate = useNavigate();
  const { logs } = useSleepLogs();

  const analytics = useMemo(() => calculateSleepAnalytics(logs), [logs]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return CheckCircle;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Info;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'teal';
      case 'warning':
        return 'amber';
      case 'info':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-teal-600" />;
      case 'declining':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTrendLabel = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs Attention';
      default:
        return 'Stable';
    }
  };

  if (logs.length === 0) {
    return (
      <PatientLayout>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl mb-6" style={{ color: '#1f1f3d' }}>
            Sleep Analytics
          </h1>
          
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-12 text-center">
            <div className="w-20 h-20 rounded-2xl bg-purple-50 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
              No Data Available Yet
            </h3>
            <p className="text-base text-gray-600 mb-6">
              Start logging your sleep to see detailed analytics and insights
            </p>
            <Button
              onClick={() => navigate('/patient/dashboard')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6 rounded-xl"
            >
              Log Your First Sleep Entry
            </Button>
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="space-y-8 max-w-6xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
            Sleep Analytics & Insights
          </h1>
          <p className="text-lg text-gray-600">
            Detailed analysis of your sleep patterns and personalized recommendations
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Moon className="w-6 h-6 text-purple-700" />
              </div>
              {getTrendIcon(analytics.patterns.trend)}
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Sleep</p>
            <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
              {analytics.averageHours} hrs
            </p>
            <p className="text-sm text-gray-500">
              Target: {analytics.patterns.optimalRange.min}-{analytics.patterns.optimalRange.max} hrs
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                <Star className="w-6 h-6 text-teal-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Average Quality</p>
            <div className="flex items-center space-x-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(analytics.averageQuality)
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {analytics.averageQuality.toFixed(1)} / 5.0
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Consistency Score</p>
            <p className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
              {analytics.patterns.consistencyScore}
            </p>
            <Progress value={analytics.patterns.consistencyScore} className="h-2" />
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-teal-700" />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-1">Total Entries</p>
            <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
              {analytics.totalLogs}
            </p>
            <p className="text-sm text-gray-500">
              {analytics.currentStreak} day streak
            </p>
          </div>
        </div>

        {/* Sleep Trend Analysis */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
            Sleep Pattern Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Moon className="w-5 h-5 text-purple-700" />
                <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                  Weekday Average
                </h3>
              </div>
              <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
                {analytics.patterns.weekdayAverage > 0 
                  ? `${analytics.patterns.weekdayAverage} hrs`
                  : 'No data'
                }
              </p>
              <p className="text-sm text-gray-600">Mon-Fri sleep duration</p>
            </div>

            <div className="p-5 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200">
              <div className="flex items-center space-x-2 mb-3">
                <Moon className="w-5 h-5 text-teal-700" />
                <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                  Weekend Average
                </h3>
              </div>
              <p className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
                {analytics.patterns.weekendAverage > 0 
                  ? `${analytics.patterns.weekendAverage} hrs`
                  : 'No data'
                }
              </p>
              <p className="text-sm text-gray-600">Sat-Sun sleep duration</p>
            </div>

            <div className={`p-5 rounded-xl border ${
              analytics.patterns.trend === 'improving' 
                ? 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200'
                : analytics.patterns.trend === 'declining'
                ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
                : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 mb-3">
                {getTrendIcon(analytics.patterns.trend)}
                <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                  Overall Trend
                </h3>
              </div>
              <p className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
                {getTrendLabel(analytics.patterns.trend)}
              </p>
              <p className="text-sm text-gray-600">
                {analytics.patterns.trend === 'improving' 
                  ? 'Sleep duration is increasing'
                  : analytics.patterns.trend === 'declining'
                  ? 'Sleep duration is decreasing'
                  : 'Sleep duration is consistent'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Comparison */}
        {analytics.weeklyComparison.some(w => w.logsCount > 0) && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
              4-Week Comparison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {analytics.weeklyComparison.map((week, index) => (
                <div
                  key={index}
                  className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-teal-50 border border-purple-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                      {week.week}
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

        {/* Personalized Insights */}
        {analytics.insights.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
              Personalized Insights & Recommendations
            </h2>
            
            <div className="space-y-4">
              {analytics.insights.map((insight, index) => {
                const Icon = getInsightIcon(insight.type);
                const color = getInsightColor(insight.type);
                
                return (
                  <div
                    key={index}
                    className={`p-6 rounded-xl border-2 ${
                      color === 'teal'
                        ? 'bg-gradient-to-br from-teal-50 to-teal-100 border-teal-300'
                        : color === 'amber'
                        ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300'
                        : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          color === 'teal'
                            ? 'bg-teal-200 text-teal-700'
                            : color === 'amber'
                            ? 'bg-amber-200 text-amber-700'
                            : 'bg-blue-200 text-blue-700'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
                          {insight.title}
                        </h3>
                        <p className="text-base text-gray-700 mb-3">
                          {insight.description}
                        </p>
                        {insight.recommendation && (
                          <div className="flex items-start space-x-2 p-3 bg-white bg-opacity-70 rounded-lg">
                            <ChevronRight className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-800">
                              <strong>Recommendation:</strong> {insight.recommendation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={() => navigate('/patient/dashboard')}
            variant="outline"
            className="h-12 px-6 rounded-xl border-2 border-gray-300 hover:bg-gray-50"
          >
            Back to Dashboard
          </Button>
          <Button
            onClick={() => navigate('/patient/progress')}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-12 px-6 rounded-xl"
          >
            View Full Progress
          </Button>
        </div>
      </div>
    </PatientLayout>
  );
}
