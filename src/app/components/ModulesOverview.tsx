import { useNavigate } from 'react-router';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Lock,
  Moon,
  Play,
  TrendingUp,
  FileText,
  Download,
  Brain,
  Wind,
  Ban,
  BedDouble,
  Users,
  CloudLightning,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { getAllModules } from '../data/moduleContent';
import { useAllModulesProgress } from '../hooks/useModuleProgress';

// Sleep Resources data
const sleepResources = [
  {
    id: 'sleep-hygiene',
    title: 'Sleep Hygiene Fundamentals',
    description: 'Essential practices and environmental factors that promote quality sleep',
    icon: Moon,
    color: 'purple',
  },
  {
    id: 'relaxation',
    title: 'Relaxation and Wind-Down Techniques',
    description: 'Guided exercises to calm your mind and prepare for sleep',
    icon: Wind,
  },
  {
    id: 'sleep-interfere',
    title: 'Activities that Interfere with Sleep',
    description: 'Common habits and behaviors that disrupt healthy sleep patterns',
    icon: Ban,
  },
  {
    id: 'stimulus-control',
    title: 'Stimulus Control',
    description: 'Evidence-based techniques to strengthen the bed-sleep association',
    icon: BedDouble,
  },
  {
    id: 'worry-management',
    title: 'Managing Worry and Racing Thoughts',
    description: 'Strategies to quiet your mind and reduce nighttime anxiety',
    icon: CloudLightning,
  },
  {
    id: 'community-resources',
    title: 'Community Resources',
    description: 'Additional support, tools, and connections for better sleep health',
    icon: Users,
  },
];

export default function ModulesOverview() {
  const navigate = useNavigate();
  const allModules = getAllModules();
  const progressStats = useAllModulesProgress();

  return (
    <div className="nondashboard-ds min-h-screen" style={{ backgroundColor: '#F9FAFB' }}>

      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10">
        <button
          onClick={() => navigate('/patient/dashboard')}
          className="mb-7 flex items-center gap-1.5 transition-colors hover:text-[#7200CA]"
          style={{ fontSize: '13px', color: '#9333EA' }}
        >
          <ArrowLeft size={15} color="currentColor" />
          <span>Back to Dashboard</span>
        </button>

        {/* Header Section */}
        <div className="mb-7">
          <h1 className="mb-2" style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>
            Weekly Sleep Modules
          </h1>
          <p className="mb-7" style={{ fontSize: '14px', color: '#6B7280', fontWeight: 400 }}>
            Complete all 4 weeks to master healthy sleep habits and improve your cognitive health.
          </p>

          {/* Overall Progress Card */}
          <div className="bg-white rounded-[12px] px-6 py-5" style={{ border: '0.5px solid #E9D5FF' }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A2E' }}>Overall Progress</h2>
                <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
                  {progressStats.completedCount} of {progressStats.totalModules} modules completed
                </p>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#7200CA' }}>
                {progressStats.averageProgress}%
              </div>
            </div>

            <div className="h-[6px] rounded-[3px] overflow-hidden" style={{ backgroundColor: '#F3E8FF' }}>
              <div
                className="h-full rounded-[3px] transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, #6D28D9 0%, #5B21B6 100%)',
                  width: `${progressStats.averageProgress}%`,
                }}
              ></div>
            </div>

            <div className="mt-5 grid grid-cols-3">
              <div className="text-center py-2">
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>{progressStats.completedCount}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Completed</div>
              </div>
              <div className="text-center py-2" style={{ borderLeft: '0.5px solid #E9D5FF', borderRight: '0.5px solid #E9D5FF' }}>
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>{progressStats.inProgressCount}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>In Progress</div>
              </div>
              <div className="text-center py-2">
                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1A1A2E' }}>{progressStats.notStartedCount}</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Not Started</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[14px]">
          {allModules.map((module) => {
            const moduleProgress = progressStats.allModules[module.weekNumber.toString()];
            const isCompleted = moduleProgress?.completedAt !== null;
            const inProgress = moduleProgress && moduleProgress.progress > 0 && !isCompleted;
            const progress = moduleProgress?.progress || 0;

            return (
              <div
                key={module.weekNumber}
                className="bg-white rounded-[12px] transition-colors"
                style={{ border: '0.5px solid #E9D5FF' }}
              >
                <div className="p-5">
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 500,
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            letterSpacing: '0.06em',
                          }}
                        >
                          Week {module.weekNumber} of {module.totalWeeks}
                        </span>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 rounded-full" style={{ backgroundColor: '#DCFCE7', color: '#166534', fontSize: '11px', fontWeight: 500, padding: '2px 10px' }}>
                            <CheckCircle size={12} />
                            <span>Completed</span>
                          </div>
                        )}
                        {inProgress && !isCompleted && (
                          <div className="flex items-center space-x-1 rounded-full" style={{ backgroundColor: '#F3E8FF', color: '#6B21A8', fontSize: '11px', fontWeight: 500, padding: '2px 10px' }}>
                            <TrendingUp size={12} />
                            <span>In Progress</span>
                          </div>
                        )}
                      </div>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1A1A2E' }}>
                        {module.title}
                      </h3>
                      <p className="line-clamp-2" style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '2px' }}>
                        {module.subtitle}
                      </p>
                    </div>

                    <div
                      className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0 ml-4"
                      style={{ backgroundColor: '#F3E8FF' }}
                    >
                      {isCompleted ? (
                        <CheckCircle size={20} color="#7200CA" strokeWidth={1.5} />
                      ) : (
                        <BookOpen size={20} color="#7200CA" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>

                  {/* Module Info */}
                  <div className="flex items-center space-x-4 mb-4" style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    <div className="flex items-center space-x-1">
                      <Clock size={13} color="#C4B5FD" strokeWidth={1.5} />
                      <span>{module.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play size={13} color="#C4B5FD" strokeWidth={1.5} />
                      <span>Video + Exercise</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>Progress</span>
                        <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{progress}%</span>
                      </div>
                      <div className="h-[4px] rounded-[2px] overflow-hidden" style={{ backgroundColor: '#F3E8FF' }}>
                        <div
                          className="h-full rounded-[2px] transition-all duration-500"
                          style={{
                            background: 'linear-gradient(90deg, #6D28D9 0%, #5B21B6 100%)',
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/modules/${module.weekNumber}`)}
                    className={`w-full rounded-[10px] transition-all ${
                      isCompleted
                        ? 'bg-white text-[#7200CA] border border-[#7200CA] hover:bg-[#F3E8FF]'
                        : inProgress
                        ? 'text-white hover:opacity-90'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={
                      isCompleted
                        ? { padding: '10px 0', fontSize: '14px', fontWeight: 500 }
                        : {
                            padding: '10px 0',
                            fontSize: '14px',
                            fontWeight: 600,
                            border: 'none',
                            background: 'linear-gradient(90deg, #6D28D9 0%, #5B21B6 100%)',
                          }
                    }
                  >
                    {isCompleted
                      ? 'Review Module'
                      : inProgress
                      ? 'Continue Learning'
                      : 'Start Module'}
                  </Button>
                </div>

                {/* Quick Preview */}
                <div className="px-5 pb-5" style={{ borderTop: '0.5px solid #F3E8FF', marginTop: '14px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#1A1A2E', marginTop: '14px', marginBottom: '8px' }}>You&apos;ll learn:</p>
                  <ul className="space-y-1">
                    {module.introduction.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-2 inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: '#7200CA' }}></span>
                        <span className="line-clamp-1" style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.7 }}>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleep Resources Section */}
        <div className="mt-7">
          <div className="mb-7">
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A2E' }}>
              Sleep Resources
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280' }}>
              Access additional tools and information to support your sleep journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[14px]">
            {sleepResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-[12px] p-[18px] cursor-pointer"
                  style={{ border: '0.5px solid #E9D5FF', transition: 'all 150ms ease' }}
                  onClick={() => {
                    // Navigate to resource page or show modal
                    console.log('Resource clicked:', resource.id);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#C4B5FD';
                    e.currentTarget.style.backgroundColor = '#FDFBFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E9D5FF';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                >
                  <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: '#F3E8FF' }}>
                    <Icon size={20} color="#7200CA" strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1A1A2E', marginTop: '12px' }}>
                    {resource.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginTop: '4px' }}>{resource.description}</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}