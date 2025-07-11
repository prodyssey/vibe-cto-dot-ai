import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { useBrowserNavigation } from '../../hooks';
import { useGameStore } from '../../gameStore';
import { saveChoice } from '../../utils';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Users,
  Zap,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const TIMELINE_SCENE: SceneType = {
  id: 'launchControlTimeline',
  type: 'choice',
  title: 'Mission Timeline',
  description: 'Understanding the commitment for scaling success',
  backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
};

const TIMELINE_OPTIONS = [
  {
    id: 'standard',
    title: 'Standard Mission',
    duration: '3-4 months',
    commitment: 'Part-time team integration',
    investment: '$50,000 - $100,000',
    features: [
      'Infrastructure optimization',
      'Performance improvements',
      'Security hardening',
      'Monitoring setup',
    ],
    icon: <Calendar className="w-6 h-6" />,
    color: 'from-blue-600 to-cyan-600',
  },
  {
    id: 'accelerated',
    title: 'Accelerated Mission',
    duration: '6-8 weeks',
    commitment: 'Full-time dedicated team',
    investment: '$100,000 - $200,000',
    features: [
      'All Standard features',
      'Rapid feature development',
      'Priority support',
      'Architecture overhaul',
    ],
    icon: <Zap className="w-6 h-6" />,
    color: 'from-orange-600 to-red-600',
  },
  {
    id: 'enterprise',
    title: 'Enterprise Mission',
    duration: '6+ months',
    commitment: 'Embedded team & ongoing support',
    investment: '$200,000+',
    features: [
      'All Accelerated features',
      'Custom team building',
      'Compliance & certification',
      'Global scaling strategy',
    ],
    icon: <Users className="w-6 h-6" />,
    color: 'from-purple-600 to-pink-600',
  },
];

export const LaunchControlTimelineScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleTimelineChoice = async (option: typeof TIMELINE_OPTIONS[0]) => {
    // Save choice
    makeChoice(TIMELINE_SCENE.id, option.id);
    await saveChoice(
      sessionId,
      TIMELINE_SCENE.id,
      option.id,
      `${option.title}: ${option.duration}`
    );

    // Navigate to testimonials
    pushScene('launchControlTestimonials');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Timeline visualization */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative w-full max-w-4xl h-1 bg-cyan-500">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full"
                style={{ left: `${(i + 1) * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={TIMELINE_SCENE} className="max-w-6xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <Clock className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Choose the mission profile that matches your growth velocity and business objectives. 
                Each path is designed to deliver maximum impact within your timeline.
              </p>
            </div>

            {/* Timeline Options */}
            <div className="grid lg:grid-cols-3 gap-6">
              {TIMELINE_OPTIONS.map((option, idx) => (
                <div
                  key={option.id}
                  className="relative group animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Recommended Badge */}
                  {option.id === 'accelerated' && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="px-4 py-1 bg-gradient-to-r from-orange-600 to-red-600 text-white text-sm font-bold rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleTimelineChoice(option)}
                    className={cn(
                      "w-full h-full text-left transition-all duration-300",
                      "bg-gray-800/30 backdrop-blur-sm border-2 rounded-xl p-6",
                      "hover:scale-[1.02] hover:shadow-xl",
                      option.id === 'accelerated' 
                        ? "border-orange-500/50 shadow-lg shadow-orange-500/20" 
                        : "border-gray-700/50 hover:border-cyan-500/50"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={cn(
                        "p-3 rounded-lg bg-gradient-to-br text-white",
                        option.color
                      )}>
                        {option.icon}
                      </div>
                      <DollarSign className="w-5 h-5 text-gray-400" />
                    </div>

                    {/* Title & Details */}
                    <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                    <div className="space-y-2 mb-4">
                      <p className="text-cyan-400 font-medium">{option.duration}</p>
                      <p className="text-sm text-gray-400">{option.commitment}</p>
                      <p className="text-lg font-semibold text-white">{option.investment}</p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {option.features.map((feature, featureIdx) => (
                        <li key={featureIdx} className="flex items-start text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-6 flex items-center text-cyan-300 group-hover:text-cyan-200">
                      <span className="text-sm font-medium">Select this mission</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-center">
              <h4 className="text-lg font-semibold text-white mb-2">Flexible Engagement Models</h4>
              <p className="text-gray-300 max-w-2xl mx-auto">
                All missions include our satisfaction guarantee. We can adjust scope and timeline based on your 
                evolving needs. Monthly payments and equity partnerships available for qualified startups.
              </p>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};