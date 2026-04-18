import { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ChevronLeft,
  Moon,
  TrendingUp,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  User,
  FileText,
  Activity,
  Award,
  Send,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClinicianPatients } from '../../hooks/useClinicianPatients';
import { useSleepLogs } from '../../hooks/useSleepLogs';
import { useAllModulesProgress } from '../../hooks/useModuleProgress';
import { toast } from 'sonner';

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { getPatientById, addNote, getPatientNotes } = useClinicianPatients();
  const { logs: sleepLogs, stats: sleepStats, getChartData } = useSleepLogs();
  const moduleProgressStats = useAllModulesProgress();

  const [noteText, setNoteText] = useState('');
  const [noteType, setNoteType] = useState<'general' | 'concern' | 'progress' | 'follow-up'>('general');

  const patient = patientId ? getPatientById(patientId) : null;
  const patientNotes = patientId ? getPatientNotes(patientId) : [];

  // Get chart data for last 30 days
  const sleepTrendData = useMemo(() => {
    return getChartData(30).map((item, index) => ({
      ...item,
      uniqueId: `${item.fullDate}-${index}`,
    }));
  }, [getChartData]);

  // Calculate engagement metrics
  const lastLogDate = sleepLogs.length > 0 ? new Date(sleepLogs[0].date) : null;
  const daysSinceLastLog = lastLogDate
    ? Math.floor((Date.now() - lastLogDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAddNote = () => {
    if (!noteText.trim() || !patientId) {
      toast.error('Please enter a note');
      return;
    }

    addNote({
      patientId,
      clinicianId: 'clinician_1', // In real app, would be current user
      note: noteText,
      type: noteType,
    });

    toast.success('Note added successfully');
    setNoteText('');
  };

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

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
        <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
          Patient Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          The requested patient could not be found
        </p>
        <Button onClick={() => navigate('/clinician/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const patientStats = [
    {
      label: 'Sleep Logs',
      value: sleepStats.totalLogs,
      icon: Moon,
      color: 'purple',
      subtext: `${sleepStats.currentStreak} day streak`,
    },
    {
      label: 'Avg Sleep',
      value: sleepStats.averageHours > 0 ? `${sleepStats.averageHours} hrs` : 'No data',
      icon: Clock,
      color: 'teal',
      subtext: sleepStats.averageHours >= 7 ? 'Good range' : 'Below target',
    },
    {
      label: 'Sleep Quality',
      value: sleepStats.averageQuality > 0 ? `${Math.round(sleepStats.averageQuality * 20)}%` : 'No data',
      icon: TrendingUp,
      color: 'purple',
      subtext: sleepStats.averageQuality >= 4 ? 'Excellent' : 'Needs improvement',
    },
    {
      label: 'Module Progress',
      value: `${moduleProgressStats.completedModules}/${moduleProgressStats.totalModules}`,
      icon: BookOpen,
      color: 'teal',
      subtext: `${moduleProgressStats.overallProgress}% complete`,
    },
  ];

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-teal-100 text-teal-700';
    }
  };

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
              {patient.name}
            </h1>
            <p className="text-lg text-gray-600">
              Patient Details & Progress Monitoring
            </p>
          </div>
        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm ${getRiskBadgeColor(
            patient.riskLevel
          )}`}
        >
          {patient.riskLevel.toUpperCase()} RISK
        </span>
      </div>

      {/* Patient Info Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-xl p-8 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-purple-200 mb-1">Patient ID</p>
            <p className="text-lg">{patient.id}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200 mb-1">Age</p>
            <p className="text-lg">{patient.age} years old</p>
          </div>
          <div>
            <p className="text-sm text-purple-200 mb-1">Email</p>
            <p className="text-lg">{patient.email}</p>
          </div>
          <div>
            <p className="text-sm text-purple-200 mb-1">Enrolled</p>
            <p className="text-lg">
              {new Date(patient.dateEnrolled).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-purple-200 mb-1">Last Active</p>
            <p className="text-lg">
              {daysSinceLastLog !== null
                ? `${daysSinceLastLog} day${daysSinceLastLog !== 1 ? 's' : ''} ago`
                : 'Today'}
            </p>
          </div>
          <div>
            <p className="text-sm text-purple-200 mb-1">Care Partner</p>
            <p className="text-lg">{patient.carePartnerName || 'None assigned'}</p>
          </div>
        </div>
      </div>

      {/* Attention Alert */}
      {daysSinceLastLog !== null && daysSinceLastLog > 3 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
                Patient Requires Follow-up
              </h3>
              <p className="text-base text-gray-700">
                {patient.name} hasn't logged sleep in {daysSinceLastLog} days.
                Consider reaching out to assess engagement and address any barriers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {patientStats.map((stat, index) => {
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

      {/* Sleep Trend Chart */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="mb-6">
          <h2 className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
            Sleep Trend Analysis
          </h2>
          <p className="text-base text-gray-600">Last 30 days</p>
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
            <p className="text-base text-gray-600">
              Patient hasn't logged any sleep data yet
            </p>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Clinical Notes */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
          <h2 className="text-2xl mb-6" style={{ color: '#1f1f3d' }}>
            Clinical Notes
          </h2>

          {/* Add Note Form */}
          <div className="mb-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <label className="block text-sm text-gray-700 mb-2">
              Note Type
            </label>
            <select
              value={noteType}
              onChange={(e) => setNoteType(e.target.value as any)}
              className="w-full h-11 px-3 rounded-lg border border-gray-300 text-base mb-3"
            >
              <option value="general">General Note</option>
              <option value="concern">Concern</option>
              <option value="progress">Progress Update</option>
              <option value="follow-up">Follow-up Required</option>
            </select>

            <Textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a clinical note..."
              className="min-h-[100px] text-base mb-3"
            />

            <Button
              onClick={handleAddNote}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white h-11 rounded-xl"
            >
              <Send className="w-5 h-5 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {patientNotes.length > 0 ? (
              patientNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        note.type === 'concern'
                          ? 'bg-red-100 text-red-700'
                          : note.type === 'follow-up'
                          ? 'bg-amber-100 text-amber-700'
                          : note.type === 'progress'
                          ? 'bg-teal-100 text-teal-700'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {note.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{note.note}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                No clinical notes yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Module Progress */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
              Module Progress
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base text-gray-600">
                    Overall Completion
                  </span>
                  <span className="text-lg" style={{ color: '#1f1f3d' }}>
                    {moduleProgressStats.overallProgress}%
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-purple-700 rounded-full transition-all"
                    style={{ width: `${moduleProgressStats.overallProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-teal-50 rounded-xl">
                  <p className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
                    {moduleProgressStats.completedModules}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-2xl mb-1" style={{ color: '#1f1f3d' }}>
                    {moduleProgressStats.totalModules - moduleProgressStats.completedModules}
                  </p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-2xl mb-4" style={{ color: '#1f1f3d' }}>
              Clinical Recommendations
            </h2>
            <div className="space-y-3">
              {daysSinceLastLog !== null && daysSinceLastLog > 3 && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-900">
                    <strong>Action Required:</strong> Patient has not logged sleep in {daysSinceLastLog} days. Schedule follow-up call.
                  </p>
                </div>
              )}
              {sleepStats.averageHours > 0 && sleepStats.averageHours < 7 && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>Observation:</strong> Average sleep below recommended 7 hours. Review sleep hygiene practices.
                  </p>
                </div>
              )}
              {moduleProgressStats.overallProgress < 50 && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-sm text-purple-900">
                    <strong>Suggestion:</strong> Encourage module completion to maximize intervention benefits.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
