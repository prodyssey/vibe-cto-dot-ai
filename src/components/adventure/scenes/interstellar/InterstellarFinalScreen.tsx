import { Scene } from '../../Scene';
import { useGameStore } from '../../gameStore';
import { useGameCompletion } from '../../hooks';
import { Button } from '@/components/ui/button';
import { EmailOptIn } from '@/components/EmailOptIn';
import { 
  Sparkles, 
  Calendar, 
  Briefcase, 
  ArrowRight,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const FINAL_SCENE: SceneType = {
  id: 'interstellarFinal',
  type: 'result',
  title: 'Welcome to the Observatory',
  description: 'Your journey to the stars begins now',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const NEXT_STEPS = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    title: 'Executive Review',
    description: 'C-suite alignment on transformation strategy',
    timing: 'Within 4 hours',
  },
  {
    icon: <Star className="w-5 h-5" />,
    title: 'Custom Proposal',
    description: 'Tailored transformation roadmap and investment plan',
    timing: 'Within 24 hours',
  },
  {
    icon: <Calendar className="w-5 h-5" />,
    title: 'Strategy Session',
    description: 'Deep dive with your leadership team',
    timing: 'Within 1 week',
  },
];

export const InterstellarFinalScreen = () => {
  const { playerName, completeGame } = useGameStore();
  const { handleEmailSignup, handleExploreService } = useGameCompletion();

  const handleScheduleCall = async () => {
    await completeGame('explore_service');
    // In a real implementation, this would open an executive calendar booking widget
    window.open('https://calendly.com/vibecto/executive-briefing', '_blank');
  };

  const handleEmailSignupWrapper = async () => {
    await handleEmailSignup();
  };

  const handleExploreServiceWrapper = async () => {
    await handleExploreService();
    window.location.href = '/interstellar';
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background - Constellation Celebration */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Starfield with constellation connections */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="starGlow">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
          </defs>
          
          {/* Draw constellation */}
          {[...Array(8)].map((_, i) => {
            const angle = (i * 45) * Math.PI / 180;
            const r = 150 + Math.random() * 100;
            const cx = 50 + r * Math.cos(angle) / 5;
            const cy = 50 + r * Math.sin(angle) / 5;
            
            return (
              <g key={i}>
                <circle
                  cx={`${cx}%`}
                  cy={`${cy}%`}
                  r="4"
                  fill="url(#starGlow)"
                  className="animate-twinkle"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
                {i > 0 && (
                  <line
                    x1={`${cx}%`}
                    y1={`${cy}%`}
                    x2="50%"
                    y2="50%"
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="1"
                    className="animate-fadeIn"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                )}
              </g>
            );
          })}
          
          {/* Central star */}
          <circle
            cx="50%"
            cy="50%"
            r="8"
            fill="url(#starGlow)"
            className="animate-pulse"
          />
        </svg>

        {/* Nebula particles */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 10}s`,
              }}
            >
              <Sparkles className="w-3 h-3 text-purple-400 opacity-30" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={FINAL_SCENE} className="max-w-4xl w-full">
          <div className="space-y-8">
            {/* Success Message */}
            <div className="text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-6 animate-bounce">
                <CheckCircle className="w-16 h-16 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Welcome to the Future, {playerName}
              </h2>
              
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                You've taken the first step toward transforming your enterprise with cutting-edge technology 
                and strategic innovation. Our executive team is preparing your personalized transformation strategy.
              </p>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-purple-400" />
                Your Transformation Timeline
              </h3>
              
              <div className="space-y-4 mb-8">
                {NEXT_STEPS.map((step, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start space-x-4 animate-fadeIn"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{step.title}</h4>
                      <p className="text-sm text-gray-400">{step.description}</p>
                      <p className="text-xs text-purple-400 mt-1">{step.timing}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Ready for liftoff?</h4>
                  <Button
                    onClick={handleScheduleCall}
                    size="lg"
                    className={cn(
                      "w-full",
                      "bg-gradient-to-r from-purple-600 to-indigo-600",
                      "hover:from-purple-700 hover:to-indigo-700"
                    )}
                  >
                    Schedule Executive Briefing
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    C-suite level discussion • Strategic alignment
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white">Want transformation insights?</h4>
                  <div onClick={handleEmailSignupWrapper}>
                    <EmailOptIn
                      variant="minimal"
                      buttonText="Get Enterprise Guide"
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    Executive brief • Case studies • ROI analysis
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-indigo-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-400">Fortune 500</div>
                  <div className="text-sm text-gray-400">Trusted Partners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">$10B+</div>
                  <div className="text-sm text-gray-400">Value Created</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">15x</div>
                  <div className="text-sm text-gray-400">Average ROI</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">98%</div>
                  <div className="text-sm text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="text-center space-y-4">
              <Button
                onClick={handleExploreServiceWrapper}
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                Visit Interstellar Page for More Details
              </Button>
              
              <p className="text-sm text-gray-500">
                Questions? Email our executive team at quantum@vibecto.com
              </p>
            </div>
          </div>
        </Scene>
      </div>
    </div>
  );
};