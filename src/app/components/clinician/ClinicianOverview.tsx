import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  Activity,
  AlertTriangle,
  TrendingUp,
  Search,
  Filter,
  UserCheck,
  Moon,
  Calendar,
  ChevronRight,
  Clock,
  Award,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useClinicianPatients } from '../../hooks/useClinicianPatients';

export default function ClinicianOverview() {
  const navigate = useNavigate();
  const { patients, stats } = useClinicianPatients();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  // Filter patients based on search and filters
  const filteredPatients = useMemo(() => {
    let filtered = patients;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.email.toLowerCase().includes(query)
      );
    }

    // Risk filter
    if (filterRisk !== 'all') {
      filtered = filtered.filter((p) => p.riskLevel === filterRisk);
    }

    // Status filter
    if (filterStatus !== 'all') {
      const now = new Date();
      filtered = filtered.filter((p) => {
        const lastActive = new Date(p.lastActive);
        const daysSince = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
        const isActive = daysSince <= 7;
        return filterStatus === 'active' ? isActive : !isActive;
      });
    }

    // Sort by last active (most recent first)
    return filtered.sort((a, b) => 
      new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
    );
  }, [patients, searchQuery, filterRisk, filterStatus]);

  const overviewStats = [
    {
      label: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'purple',
      subtext: `${stats.activePatients} active`,
    },
    {
      label: 'Need Attention',
      value: stats.patientsNeedingAttention,
      icon: AlertTriangle,
      color: 'amber',
      subtext: 'Require follow-up',
    },
    {
      label: 'Avg Adherence',
      value: `${stats.averageAdherence}%`,
      icon: TrendingUp,
      color: 'teal',
      subtext: 'Program completion',
    },
    {
      label: 'Avg Sleep Quality',
      value: `${stats.averageSleepQuality}%`,
      icon: Moon,
      color: 'purple',
      subtext: 'Across all patients',
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

  const getActivityStatus = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const daysSince = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSince === 0) return { text: 'Active today', color: 'text-teal-600' };
    if (daysSince === 1) return { text: 'Active yesterday', color: 'text-teal-600' };
    if (daysSince <= 7) return { text: `Active ${daysSince}d ago`, color: 'text-gray-600' };
    return { text: `Inactive ${daysSince}d`, color: 'text-red-600' };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl mb-2" style={{ color: '#1f1f3d' }}>
          Patient Overview
        </h1>
        <p className="text-lg text-gray-600">
          Monitor and manage all patients in the sleep intervention program
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat, index) => {
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
                      : stat.color === 'teal'
                      ? 'bg-gradient-to-br from-teal-100 to-teal-200'
                      : 'bg-gradient-to-br from-amber-100 to-amber-200'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      stat.color === 'purple'
                        ? 'text-purple-700'
                        : stat.color === 'teal'
                        ? 'text-teal-700'
                        : 'text-amber-700'
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

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search patients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 text-base rounded-xl"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value as any)}
              className="h-12 px-4 rounded-xl border border-gray-300 text-base bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="h-12 px-4 rounded-xl border border-gray-300 text-base bg-white focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
            >
              <option value="all">All Patients</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredPatients.length} of {patients.length} patients
          </span>
          {(searchQuery || filterRisk !== 'all' || filterStatus !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterRisk('all');
                setFilterStatus('all');
              }}
              className="text-purple-600 hover:text-purple-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Patients List */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
            Patients
          </h2>
          <Button
            onClick={() => navigate('/clinician/analytics')}
            variant="ghost"
            className="text-purple-600 hover:text-purple-700"
          >
            View Analytics
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>

        {filteredPatients.length > 0 ? (
          <div className="space-y-3">
            {filteredPatients.map((patient) => {
              const activityStatus = getActivityStatus(patient.lastActive);
              const needsAttention = activityStatus.text.includes('Inactive') || patient.riskLevel === 'high';

              return (
                <button
                  key={patient.id}
                  onClick={() => navigate(`/clinician/patient/${patient.id}`)}
                  className="w-full flex items-center justify-between p-5 rounded-xl bg-gray-50 border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all text-left"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg">
                        {patient.name.charAt(0)}
                      </span>
                    </div>

                    {/* Patient Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg" style={{ color: '#1f1f3d' }}>
                          {patient.name}
                        </h3>
                        {needsAttention && (
                          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span>{patient.age} years old</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span className={activityStatus.color}>
                            {activityStatus.text}
                          </span>
                        </span>
                        {patient.carePartnerName && (
                          <span className="flex items-center space-x-1">
                            <UserCheck className="w-4 h-4" />
                            <span>Has care partner</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Risk Badge */}
                    <div className="flex flex-col items-end space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${getRiskBadgeColor(
                          patient.riskLevel
                        )}`}
                      >
                        {patient.riskLevel.toUpperCase()} RISK
                      </span>
                      <span className="text-xs text-gray-500">
                        Enrolled {new Date(patient.dateEnrolled).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
              No Patients Found
            </h3>
            <p className="text-base text-gray-600">
              {searchQuery || filterRisk !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No patients enrolled in the program yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
