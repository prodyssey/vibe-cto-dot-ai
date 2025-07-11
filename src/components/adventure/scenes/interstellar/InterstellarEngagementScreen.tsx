import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { useBrowserNavigation } from '../../hooks';
import { useGameStore } from '../../gameStore';
import { saveChoice } from '../../utils';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Rocket, 
  Crown,
  ArrowRight,
  CheckCircle,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const ENGAGEMENT_SCENE: SceneType = {
  id: 'interstellarEngagement',
  type: 'choice',
  title: 'Engagement Models',
  description: 'Choose your path to transformation',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const ENGAGEMENT_OPTIONS = [
  {
    id: 'transformation',
    title: 'Digital Transformation',
    subtitle: 'Complete organizational change',
    duration: '12-18 months',
    team: '20-50 specialists',
    investment: '$1M - $5M',
    description: 'End-to-end digital transformation with embedded teams',
    features: [
      'Full technology stack modernization',
      'Cultural transformation program',
      'AI/ML integration across all departments',
      'Custom innovation lab setup',
      'Executive advisory and training',
    ],
    icon: <Building2 className="w-8 h-8" />,
    color: 'from-purple-600 to-pink-600',
    recommended: false,
  },
  {
    id: 'innovation',
    title: 'Innovation Partnership',
    subtitle: 'Strategic technology alliance',
    duration: '6-12 months',
    team: '10-20 specialists',
    investment: '$500K - $2M',
    description: 'Co-create breakthrough solutions for competitive advantage',
    features: [
      'Joint R&D initiatives',
      'Dedicated innovation team',
      'IP co-ownership options',
      'Market disruption strategies',
      'Venture studio collaboration',
    ],
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-indigo-600 to-blue-600',
    recommended: true,
  },
  {
    id: 'advisory',
    title: 'Strategic Advisory',
    subtitle: 'Elite guidance and oversight',
    duration: 'Ongoing',
    team: '3-5 senior advisors',
    investment: '$200K - $500K/year',
    description: 'C-suite level technology strategy and execution guidance',
    features: [
      'Monthly strategy sessions',
      'Board-level presentations',
      'Technology due diligence',
      'M&A technical advisory',
      'Crisis response team',
    ],
    icon: <Crown className="w-8 h-8" />,
    color: 'from-yellow-600 to-orange-600',
    recommended: false,
  },
  {
    id: 'taskforce',
    title: 'Quantum Task Force',
    subtitle: 'Rapid response team',
    duration: '3-6 months',
    team: '5-10 specialists',
    investment: '$250K - $1M',
    description: 'Elite team for critical missions and transformations',
    features: [
      'Rapid deployment capability',
      'Cross-functional expertise',
      'Agile methodology',
      '24/7 availability',
      'Knowledge transfer focus',
    ],
    icon: <Users className="w-8 h-8" />,
    color: 'from-cyan-600 to-teal-600',
    recommended: false,
  },
];

export const InterstellarEngagementScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleEngagementChoice = async (option: typeof ENGAGEMENT_OPTIONS[0]) => {
    // Save choice
    makeChoice(ENGAGEMENT_SCENE.id, option.id);
    await saveChoice(
      sessionId,
      ENGAGEMENT_SCENE.id,
      option.id,
      `${option.title}: ${option.investment}`
    );

    // Navigate to features screen
    pushScene('interstellarFeatures');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Orbital Paths */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="1" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(4)].map((_, i) => (
            <ellipse
              key={i}
              cx="50%"
              cy="50%"
              rx={`${30 + i * 15}%`}
              ry={`${20 + i * 10}%`}
              fill="none"
              stroke="url(#orbitGradient)"
              strokeWidth="1"
              className="animate-spin"
              style={{ 
                animationDuration: `${20 + i * 10}s`,
                transformOrigin: 'center',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={ENGAGEMENT_SCENE} className="max-w-7xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Each engagement model is tailored to your organization's unique needs and transformation velocity. 
                Choose the approach that aligns with your strategic objectives.
              </p>
            </div>

            {/* Engagement Options Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {ENGAGEMENT_OPTIONS.map((option, idx) => (
                <div
                  key={option.id}
                  className="relative animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Recommended Badge */}
                  {option.recommended && (
                    <div className="absolute -top-3 right-6 z-10">
                      <span className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-bold rounded-full flex items-center">
                        <Star className="w-4 h-4 mr-1" />
                        Recommended
                      </span>
                    </div>
                  )}

                  <button
                    onClick={() => handleEngagementChoice(option)}
                    className={cn(
                      "w-full h-full text-left transition-all duration-300",
                      "bg-gray-800/50 backdrop-blur-sm border-2 rounded-xl p-8",
                      "hover:scale-[1.02] hover:shadow-xl",
                      option.recommended 
                        ? "border-indigo-500/50 shadow-lg shadow-indigo-500/20" 
                        : "border-gray-700/50 hover:border-purple-500/50"
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className={cn(
                          "inline-flex p-3 rounded-lg bg-gradient-to-br text-white mb-4",
                          option.color
                        )}>
                          {option.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white">{option.title}</h3>
                        <p className="text-purple-400">{option.subtitle}</p>
                      </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Duration</p>
                        <p className="text-sm font-semibold text-gray-300">{option.duration}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Team Size</p>
                        <p className="text-sm font-semibold text-gray-300">{option.team}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Investment</p>
                        <p className="text-sm font-semibold text-purple-300">{option.investment}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-400 mb-6">{option.description}</p>

                    {/* Features */}
                    <div className="space-y-2">
                      {option.features.slice(0, 3).map((feature, featureIdx) => (
                        <div key={featureIdx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{feature}</span>
                        </div>
                      ))}
                      {option.features.length > 3 && (
                        <p className="text-sm text-purple-400 ml-6">
                          +{option.features.length - 3} more features
                        </p>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-6 flex items-center text-purple-300 group-hover:text-purple-200">
                      <span className="text-sm font-medium">Select this model</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                </div>
              ))}
            </div>

            {/* Comparison Note */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center">
              <p className="text-gray-300">
                All engagement models include our core promise: transformative results, transparent communication, 
                and a partnership approach to achieving your strategic objectives.
              </p>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};