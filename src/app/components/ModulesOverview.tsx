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
  Heart,
  Brain,
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
    icon: Heart,
    color: 'teal',
  },
  {
    id: 'sleep-interfere',
    title: 'Activities that Interfere with Sleep',
    description: 'Common habits and behaviors that disrupt healthy sleep patterns',
    icon: Brain,
    color: 'purple',
  },
  {
    id: 'stimulus-control',
    title: 'Stimulus Control',
    description: 'Evidence-based techniques to strengthen the bed-sleep association',
    icon: CheckCircle,
    color: 'teal',
  },
  {
    id: 'worry-management',
    title: 'Managing Worry and Racing Thoughts',
    description: 'Strategies to quiet your mind and reduce nighttime anxiety',
    icon: Brain,
    color: 'purple',
  },
  {
    id: 'community-resources',
    title: 'Community Resources',
    description: 'Additional support, tools, and connections for better sleep health',
    icon: FileText,
    color: 'teal',
  },
];

export default function ModulesOverview() {
  const navigate = useNavigate();
  const allModules = getAllModules();
  const progressStats = useAllModulesProgress();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Back to Dashboard */}
            <button
              onClick={() => navigate('/patient/dashboard')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-base">Back to Dashboard</span>
            </button>

            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <Moon className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg" style={{ color: '#1f1f3d' }}>
                Sleep Modules
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 lg:py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl mb-4" style={{ color: '#1f1f3d' }}>
            Weekly Sleep Modules
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Complete all 4 weeks to master healthy sleep habits and improve your cognitive health.
          </p>

          {/* Overall Progress Card */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl shadow-xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl mb-2">Overall Progress</h2>
                <p className="text-purple-100">
                  {progressStats.completedCount} of {progressStats.totalModules} modules completed
                </p>
              </div>
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl">{progressStats.averageProgress}%</div>
                </div>
              </div>
            </div>

            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${progressStats.averageProgress}%` }}
              ></div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl mb-1">{progressStats.completedCount}</div>
                <div className="text-sm text-purple-100">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl mb-1">{progressStats.inProgressCount}</div>
                <div className="text-sm text-purple-100">In Progress</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl mb-1">{progressStats.notStartedCount}</div>
                <div className="text-sm text-purple-100">Not Started</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {allModules.map((module) => {
            const moduleProgress = progressStats.allModules[module.weekNumber.toString()];
            const isCompleted = moduleProgress?.completedAt !== null;
            const inProgress = moduleProgress && moduleProgress.progress > 0 && !isCompleted;
            const progress = moduleProgress?.progress || 0;

            return (
              <div
                key={module.weekNumber}
                className={`bg-white rounded-2xl shadow-md border-2 transition-all hover:shadow-lg ${
                  isCompleted
                    ? 'border-teal-200'
                    : inProgress
                    ? 'border-purple-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  {/* Module Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-purple-600">
                          Week {module.weekNumber} of {module.totalWeeks}
                        </span>
                        {isCompleted && (
                          <div className="flex items-center space-x-1 bg-teal-50 text-teal-700 px-2 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">Completed</span>
                          </div>
                        )}
                        {inProgress && !isCompleted && (
                          <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
                            <TrendingUp className="w-4 h-4" />
                            <span className="text-xs">In Progress</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl mb-1" style={{ color: '#1f1f3d' }}>
                        {module.title}
                      </h3>
                      <p className="text-base text-gray-600 line-clamp-2">
                        {module.subtitle}
                      </p>
                    </div>

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-4 ${
                        isCompleted
                          ? 'bg-teal-100'
                          : inProgress
                          ? 'bg-purple-100'
                          : 'bg-gray-100'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-teal-600" />
                      ) : (
                        <BookOpen
                          className={`w-6 h-6 ${
                            inProgress ? 'text-purple-600' : 'text-gray-400'
                          }`}
                        />
                      )}
                    </div>
                  </div>

                  {/* Module Info */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Play className="w-4 h-4" />
                      <span>Video + Exercise</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {progress > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm text-purple-600">{progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600'
                              : 'bg-gradient-to-r from-purple-500 to-purple-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={() => navigate(`/modules/${module.weekNumber}`)}
                    className={`w-full h-12 rounded-xl text-base transition-all ${
                      isCompleted
                        ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-2 border-teal-200'
                        : inProgress
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isCompleted
                      ? 'Review Module'
                      : inProgress
                      ? 'Continue Learning'
                      : 'Start Module'}
                  </Button>
                </div>

                {/* Quick Preview */}
                <div className="border-t border-gray-100 px-6 py-4 bg-gray-50 rounded-b-2xl">
                  <p className="text-sm text-gray-600 mb-2">You'll learn:</p>
                  <ul className="space-y-1">
                    {module.introduction.objectives.slice(0, 2).map((objective, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span className="line-clamp-1">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sleep Resources Section */}
        <div className="mt-16">
          <div className="mb-8">
            <h2 className="text-3xl mb-3" style={{ color: '#1f1f3d' }}>
              Sleep Resources
            </h2>
            <p className="text-lg text-gray-600">
              Access additional tools and information to support your sleep journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sleepResources.map((resource) => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.id}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    // Navigate to resource page or show modal
                    console.log('Resource clicked:', resource.id);
                  }}
                >
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                      resource.color === 'purple'
                        ? 'bg-gradient-to-br from-purple-100 to-purple-200'
                        : 'bg-gradient-to-br from-teal-100 to-teal-200'
                    }`}
                  >
                    <Icon
                      className={`w-7 h-7 ${
                        resource.color === 'purple' ? 'text-purple-700' : 'text-teal-700'
                      }`}
                    />
                  </div>
                  <h3 className="text-lg mb-2" style={{ color: '#1f1f3d' }}>
                    {resource.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">{resource.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl border-2 border-teal-200 p-8 text-center">
          <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
            Take It One Week at a Time
          </h2>
          <p className="text-base text-gray-700 mb-6 max-w-2xl mx-auto">
            Remember, improving your sleep is a journey. Focus on completing one module at a
            time, and you'll build lasting habits for better cognitive health.
          </p>
          <Button
            onClick={() => navigate('/patient/dashboard')}
            className="h-12 px-6 rounded-xl bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}