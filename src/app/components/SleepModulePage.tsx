import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  BookOpen,
  PlayCircle,
  CheckCircle,
  Clock,
  FileText,
  PenTool,
  Moon,
  Lightbulb,
  Target,
  Award,
  ChevronRight,
  Download,
  Video,
  Check,
  ChevronLeft,
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Checkbox } from './ui/checkbox';
import VideoPlayer from './VideoPlayer';
import QuizSection from './QuizSection';
import ResourcesSection from './ResourcesSection';
import { useModuleProgress } from '../hooks/useModuleProgress';
import { toast } from 'sonner';
import { getModuleContent, getModuleNavigation } from '../data/moduleContent';

export default function SleepModulePage() {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const currentModuleId = moduleId || '1';

  // Get module content
  const moduleData = getModuleContent(currentModuleId);
  const navigation = getModuleNavigation(currentModuleId);

  // Use localStorage-backed module progress
  const {
    moduleProgress,
    isModuleComplete,
    markVideoComplete,
    markQuizComplete,
    markExerciseComplete,
    saveNotes,
    markModuleComplete,
    updateLastAccessed,
  } = useModuleProgress(currentModuleId);

  // Local UI state (separate from persisted state to avoid loops)
  const [notes, setNotes] = useState('');

  // Sync notes from storage only when module changes
  useEffect(() => {
    setNotes(moduleProgress.notes);
  }, [currentModuleId]); // Only when module ID changes, not when progress changes

  // Update last accessed only when module changes
  useEffect(() => {
    updateLastAccessed();
  }, [currentModuleId]); // Intentionally not including updateLastAccessed

  // Debounced save for notes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (notes !== moduleProgress.notes) {
        saveNotes(notes);
      }
    }, 1000); // Save 1 second after user stops typing

    return () => clearTimeout(timeoutId);
  }, [notes, moduleProgress.notes, saveNotes]);

  const handleCompleteLesson = () => {
    markModuleComplete();
    toast.success('🎉 Module completed!', {
      description: 'All your progress has been saved. Keep up the great work!',
      duration: 4000,
    });
    
    // Navigate to next module or dashboard
    setTimeout(() => {
      if (navigation.hasNext) {
        navigate(`/modules/${navigation.nextWeek}`);
      } else {
        navigate('/patient/dashboard');
      }
    }, 1000);
  };

  // If module not found, show error
  if (!moduleData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl mb-4" style={{ color: '#1f1f3d' }}>
            Module Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The module you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/patient/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const canComplete = moduleProgress.videoWatched && moduleProgress.exerciseCompleted;

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

            {/* Module Navigation */}
            <div className="flex items-center space-x-2">
              {navigation.hasPrevious && (
                <button
                  onClick={() => navigate(`/modules/${navigation.previousWeek}`)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                  <span className="hidden sm:inline text-base text-gray-700">Previous</span>
                </button>
              )}
              {navigation.hasNext && (
                <button
                  onClick={() => navigate(`/modules/${navigation.nextWeek}`)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="hidden sm:inline text-base text-gray-700">Next</span>
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 lg:py-12">
        {/* Module Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <Moon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-base text-purple-600">
                  Week {moduleData.weekNumber} of {moduleData.totalWeeks}
                </span>
                <span className="text-base text-gray-400">•</span>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-base">{moduleData.estimatedTime} minutes</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl" style={{ color: '#1f1f3d' }}>
                {moduleData.title}
              </h1>
              <p className="text-lg text-gray-600 mt-1">{moduleData.subtitle}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-base" style={{ color: '#1f1f3d' }}>
                Your Progress
              </span>
              <span className="text-base text-purple-600">
                {moduleProgress.progress}%
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 rounded-full transition-all duration-500"
                style={{ width: `${moduleProgress.progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sequential Content Flow */}
        <div className="space-y-6">
          {/* Step 1: Introduction/Overview */}
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-3xl border-2 border-teal-200 p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xl">
                1
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  {moduleData.introduction.title}
                </h2>
                <p className="text-base text-gray-700 leading-relaxed">
                  {moduleData.introduction.description}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-teal-200">
              <h3 className="text-lg mb-4" style={{ color: '#1f1f3d' }}>
                Learning Objectives:
              </h3>
              <ul className="space-y-3">
                {moduleData.introduction.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 text-teal-600 mt-0.5" />
                    <span className="text-base text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 2: Video Lesson - Primary Focus */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xl">
                2
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Video className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
                    Watch the Video Lesson
                  </h2>
                </div>
                <p className="text-base text-gray-600">{moduleData.video.description}</p>
              </div>
            </div>

            {/* Real Video Player */}
            <VideoPlayer
              videoUrl={moduleData.video.videoUrl}
              title={moduleData.video.title}
              duration={moduleData.video.duration}
              isCompleted={moduleProgress.videoWatched}
              onComplete={() => {
                markVideoComplete();
                toast.success('Video completed!', {
                  description: 'Your progress has been saved.',
                });
              }}
            />
          </div>

          {/* Step 3: Exercise/Activity */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-xl">
                3
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <PenTool className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl" style={{ color: '#1f1f3d' }}>
                    Complete the Exercise
                  </h2>
                </div>
                <p className="text-base text-gray-600">{moduleData.exercise.description}</p>
              </div>
            </div>

            {/* Exercise Checklist */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-6">
              <h3 className="text-lg mb-4" style={{ color: '#1f1f3d' }}>
                {moduleData.exercise.title}
              </h3>
              <div className="space-y-3">
                {moduleData.exercise.tasks.map((task, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-xl bg-white border-2 border-gray-200 hover:border-purple-300 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 flex-shrink-0 rounded border-2 border-gray-300 text-purple-600 focus:ring-2 focus:ring-purple-500 mt-0.5"
                    />
                    <span className="text-base text-gray-700">{task}</span>
                  </label>
                ))}
              </div>
            </div>

            {!moduleProgress.exerciseCompleted && (
              <Button
                onClick={() => {
                  markExerciseComplete();
                  toast.success('Exercise completed!', {
                    description: 'Great job! Your progress has been saved.',
                  });
                }}
                className="w-full h-14 rounded-xl text-lg bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white shadow-md"
              >
                Mark Exercise as Complete
                <Check className="w-5 h-5 ml-2" />
              </Button>
            )}

            {moduleProgress.exerciseCompleted && (
              <div className="flex items-center justify-center space-x-3 bg-teal-50 rounded-xl p-4 border border-teal-200">
                <CheckCircle className="w-6 h-6 text-teal-600" />
                <span className="text-base text-teal-800">Exercise completed!</span>
              </div>
            )}
          </div>

          {/* Key Takeaways Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-3xl border-2 border-amber-200 p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Key Takeaways
                </h2>
                <p className="text-base text-gray-600">
                  Remember these important points from this week's lesson
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-amber-200">
              <ul className="space-y-4">
                {moduleData.keyTakeaways.map((takeaway, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 flex-shrink-0 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 text-base">
                      {index + 1}
                    </div>
                    <span className="text-base text-gray-700 leading-relaxed pt-1">
                      {takeaway}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Reflection/Notes Section */}
          <div className="bg-white rounded-3xl shadow-md border border-gray-200 p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Your Reflections (Optional)
                </h2>
                <p className="text-base text-gray-600">
                  Take a moment to write down your thoughts, questions, or goals for the week
                </p>
              </div>
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn today? What changes do you want to make to your sleep routine?"
              className="w-full h-40 p-4 rounded-xl border-2 border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-colors text-base resize-none"
              aria-label="Reflection notes"
            />
            <p className="text-sm text-gray-500 mt-2">
              Your notes are private and will be saved to your account
            </p>
          </div>

          {/* Quiz Section */}
          {moduleData.quiz && (
            <QuizSection
              quiz={moduleData.quiz}
              isCompleted={moduleProgress.quizCompleted}
              savedScore={moduleProgress.quizScore}
              savedAnswers={moduleProgress.quizAnswers}
              onComplete={(score, answers) => {
                markQuizComplete(score, answers);
                toast.success('Quiz completed!', {
                  description: `You scored ${score}%. Great job!`,
                });
              }}
            />
          )}

          {/* Resources Section */}
          {moduleData.resources && moduleData.resources.length > 0 && (
            <ResourcesSection resources={moduleData.resources} />
          )}

          {/* Bottom Action Area */}
          <div className="sticky bottom-0 bg-white rounded-3xl shadow-xl border-2 border-gray-200 p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h3 className="text-xl mb-2" style={{ color: '#1f1f3d' }}>
                  {canComplete ? 'Great Work!' : 'Keep Going!'}
                </h3>
                <p className="text-base text-gray-600">
                  {canComplete
                    ? 'You\'ve completed all required activities. Mark this lesson as complete.'
                    : 'Complete the video and exercise above to finish this lesson.'}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="outline"
                  className="h-14 px-6 rounded-xl text-base border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 w-full sm:w-auto"
                >
                  Save & Continue Later
                </Button>
                <Button
                  onClick={handleCompleteLesson}
                  disabled={!canComplete}
                  className={`h-14 px-8 rounded-xl text-base shadow-lg w-full sm:w-auto ${
                    canComplete
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Mark as Complete
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  {moduleProgress.videoWatched ? (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span>Video</span>
                </div>
                <div className="flex items-center space-x-2">
                  {moduleProgress.exerciseCompleted ? (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span>Exercise</span>
                </div>
                <div className="flex items-center space-x-2">
                  {notes.trim() ? (
                    <CheckCircle className="w-5 h-5 text-teal-600" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                  <span>Notes (Optional)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}