import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ChevronLeft,
  BookOpen,
  Brain,
  Heart,
  Moon,
  Users,
  FileText,
  Video,
  ExternalLink,
  Download,
  ChevronRight,
  Lightbulb,
  Shield,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export default function CareResources() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about-mci');

  const resourceCategories = [
    {
      id: 'about-mci',
      label: 'About MCI',
      icon: Brain,
      color: 'purple',
    },
    {
      id: 'sleep-health',
      label: 'Sleep & Health',
      icon: Moon,
      color: 'teal',
    },
    {
      id: 'caregiving-tips',
      label: 'Caregiving Tips',
      icon: Heart,
      color: 'purple',
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: FileText,
      color: 'teal',
    },
  ];

  const mciResources = [
    {
      title: 'Understanding Mild Cognitive Impairment (MCI)',
      description:
        'MCI is a condition where someone has more memory or thinking problems than normal for their age, but these problems don\'t interfere significantly with daily life. It\'s important to understand that MCI is not dementia, though it can increase the risk.',
      icon: Brain,
      type: 'article',
    },
    {
      title: 'Common Signs and Symptoms',
      description:
        'Recognizing MCI symptoms can help you provide better support. Common signs include forgetting recent events, difficulty following conversations, trouble making decisions, and challenges with complex tasks.',
      icon: Lightbulb,
      type: 'guide',
    },
    {
      title: 'How Sleep Affects Cognitive Health',
      description:
        'Quality sleep is crucial for brain health and memory consolidation. Poor sleep can worsen MCI symptoms, while improved sleep patterns may help slow cognitive decline and improve daily function.',
      icon: Moon,
      type: 'article',
    },
  ];

  const sleepHealthResources = [
    {
      title: 'Sleep Hygiene Basics',
      description:
        'Learn about creating an optimal sleep environment: maintaining consistent sleep schedules, reducing screen time before bed, keeping the bedroom cool and dark, and avoiding caffeine in the evening.',
      icon: Moon,
      type: 'guide',
      tips: [
        'Maintain consistent sleep and wake times',
        'Create a relaxing bedtime routine',
        'Keep the bedroom cool (60-67°F)',
        'Limit exposure to bright lights in the evening',
      ],
    },
    {
      title: 'Understanding Sleep Cycles',
      description:
        'Adults need 7-9 hours of sleep per night. Sleep occurs in cycles, including light sleep, deep sleep, and REM sleep. Each stage plays a crucial role in physical restoration and memory consolidation.',
      icon: Clock,
      type: 'article',
    },
    {
      title: 'Common Sleep Challenges with MCI',
      description:
        'People with MCI may experience insomnia, frequent night wakings, or irregular sleep patterns. Understanding these challenges can help you provide better support and know when to consult healthcare providers.',
      icon: Brain,
      type: 'guide',
    },
  ];

  const caregivingResources = [
    {
      title: 'Effective Communication Strategies',
      description:
        'Use clear, simple language. Speak slowly and allow time for responses. Be patient and avoid correcting or arguing. Focus on feelings rather than facts when memory issues arise.',
      icon: Users,
      type: 'guide',
      tips: [
        'Maintain eye contact and minimize distractions',
        'Ask one question at a time',
        'Use visual cues and gestures',
        'Break complex tasks into simple steps',
      ],
    },
    {
      title: 'Encouraging Participation Without Pressure',
      description:
        'Motivation is key to program success. Celebrate small wins, offer gentle reminders without nagging, and focus on the positive aspects of their progress. Your support makes a difference.',
      icon: Heart,
      type: 'guide',
      tips: [
        'Celebrate every sleep log and module completion',
        'Send encouraging messages regularly',
        'Focus on effort, not just outcomes',
        'Respect their autonomy and choices',
      ],
    },
    {
      title: 'Taking Care of Yourself',
      description:
        'Caregiver burnout is real. Remember to: maintain your own health routines, seek support from others, take breaks when needed, and don\'t hesitate to ask for help. You can\'t pour from an empty cup.',
      icon: Shield,
      type: 'article',
      tips: [
        'Schedule regular self-care time',
        'Join a caregiver support group',
        'Stay connected with friends and family',
        'Know your limits and ask for help',
      ],
    },
  ];

  const externalResources = [
    {
      title: 'Alzheimer\'s Association',
      description: 'Support and resources for caregivers of people with memory issues',
      url: 'https://www.alz.org',
      type: 'website',
      icon: ExternalLink,
    },
    {
      title: 'National Sleep Foundation',
      description: 'Evidence-based information about sleep health and hygiene',
      url: 'https://www.sleepfoundation.org',
      type: 'website',
      icon: ExternalLink,
    },
    {
      title: 'Family Caregiver Alliance',
      description: 'Resources, education, and support for family caregivers',
      url: 'https://www.caregiver.org',
      type: 'website',
      icon: ExternalLink,
    },
    {
      title: 'Caregiver Support Groups',
      description: 'Find local or online support groups in your area',
      url: '#',
      type: 'resource',
      icon: Users,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/care-partner/dashboard')}
          className="p-2 hover:bg-gray-100 rounded-xl"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <div>
          <h1 className="text-3xl mb-1" style={{ color: '#1f1f3d' }}>
            Care Partner Resources
          </h1>
          <p className="text-lg text-gray-600">
            Information and tools to support your caregiving role
          </p>
        </div>
      </div>

      {/* Resource Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto bg-gray-100 p-2 rounded-xl">
          {resourceCategories.map((category) => {
            const Icon = category.icon;
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex flex-col items-center space-y-2 py-4 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg"
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{category.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* About MCI Tab */}
        <TabsContent value="about-mci" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-200 flex items-center justify-center flex-shrink-0">
                <Brain className="w-7 h-7 text-purple-700" />
              </div>
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Supporting Someone with MCI
                </h2>
                <p className="text-base text-gray-700">
                  Your role as a care partner is vital in helping your loved one maintain their
                  cognitive health and quality of life. Understanding MCI and its impact on sleep
                  is the first step in providing effective support.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {mciResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl" style={{ color: '#1f1f3d' }}>
                          {resource.title}
                        </h3>
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Sleep & Health Tab */}
        <TabsContent value="sleep-health" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 border-2 border-teal-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-teal-200 flex items-center justify-center flex-shrink-0">
                <Moon className="w-7 h-7 text-teal-700" />
              </div>
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Sleep and Cognitive Health
                </h2>
                <p className="text-base text-gray-700">
                  Quality sleep is essential for brain health, memory consolidation, and overall
                  well-being. Learn how to help your loved one achieve better sleep.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {sleepHealthResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-teal-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl" style={{ color: '#1f1f3d' }}>
                          {resource.title}
                        </h3>
                        <span className="text-xs px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 leading-relaxed mb-4">
                        {resource.description}
                      </p>
                      {resource.tips && (
                        <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                          <p className="text-sm text-teal-900 mb-2">Key Tips:</p>
                          <ul className="space-y-2">
                            {resource.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start space-x-2">
                                <ChevronRight className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Caregiving Tips Tab */}
        <TabsContent value="caregiving-tips" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-purple-200 flex items-center justify-center flex-shrink-0">
                <Heart className="w-7 h-7 text-purple-700" />
              </div>
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Effective Caregiving Strategies
                </h2>
                <p className="text-base text-gray-700">
                  Practical tips for supporting your loved one while taking care of yourself.
                  Remember, you're doing an amazing job!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {caregivingResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-purple-700" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl" style={{ color: '#1f1f3d' }}>
                          {resource.title}
                        </h3>
                        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                          {resource.type}
                        </span>
                      </div>
                      <p className="text-base text-gray-700 leading-relaxed mb-4">
                        {resource.description}
                      </p>
                      {resource.tips && (
                        <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                          <p className="text-sm text-purple-900 mb-2">Practical Tips:</p>
                          <ul className="space-y-2">
                            {resource.tips.map((tip, tipIndex) => (
                              <li key={tipIndex} className="flex items-start space-x-2">
                                <ChevronRight className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* External Resources Tab */}
        <TabsContent value="resources" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-8">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-teal-200 flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-teal-700" />
              </div>
              <div>
                <h2 className="text-2xl mb-2" style={{ color: '#1f1f3d' }}>
                  Additional Resources
                </h2>
                <p className="text-base text-gray-700">
                  Trusted organizations and resources for continued learning and support
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {externalResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-lg hover:border-teal-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-teal-700" />
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-teal-100 text-teal-700">
                      {resource.type}
                    </span>
                  </div>
                  <h3 className="text-lg mb-2" style={{ color: '#1f1f3d' }}>
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </a>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
