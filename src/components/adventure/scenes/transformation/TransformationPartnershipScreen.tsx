import { 
  Handshake, 
  TrendingUp, 
  Gem, 
  Building,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const PARTNERSHIP_SCENE: SceneType = {
  id: 'transformationPartnership',
  type: 'detail',
  title: 'Strategic Alliances',
  description: 'Partnership models that align with your vision',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const PARTNERSHIP_MODELS = [
  {
    id: 'equity',
    icon: <TrendingUp className="w-12 h-12" />,
    title: 'Equity Partnership',
    subtitle: 'Shared success model',
    description: 'Align our success with yours through equity participation',
    benefits: [
      'Reduced upfront investment',
      'Long-term commitment to your success',
      'Board-level strategic guidance',
      'Shared risk and reward',
    ],
    terms: [
      '2-5% equity stake',
      'Vesting over 3-4 years',
      'Performance milestones',
      'Exit participation rights',
    ],
    ideal: 'High-growth startups and scale-ups',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'venture',
    icon: <Gem className="w-12 h-12" />,
    title: 'Venture Studio',
    subtitle: 'Co-creation partnership',
    description: 'Build new ventures together leveraging our combined strengths',
    benefits: [
      'Access to our venture network',
      'Shared IP development',
      'Go-to-market acceleration',
      'Portfolio synergies',
    ],
    terms: [
      'Joint venture structure',
      '50/50 or negotiated split',
      'Dedicated innovation budget',
      'Spin-off opportunities',
    ],
    ideal: 'Enterprises seeking new revenue streams',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'strategic',
    icon: <Building className="w-12 h-12" />,
    title: 'Strategic Alliance',
    subtitle: 'Enterprise transformation',
    description: 'Deep partnership for multi-year transformation initiatives',
    benefits: [
      'Dedicated transformation office',
      'Executive alignment program',
      'Knowledge transfer guarantee',
      'Success-based pricing',
    ],
    terms: [
      'Multi-year commitment',
      'Quarterly business reviews',
      'SLA guarantees',
      'Flexible resource allocation',
    ],
    ideal: 'Fortune 500 and large enterprises',
    color: 'from-blue-500 to-indigo-500',
  },
];

const SUCCESS_METRICS = [
  { label: 'Partner Retention', value: '98%' },
  { label: 'Average ROI', value: '15x' },
  { label: 'Time to Value', value: '<90 days' },
  { label: 'NPS Score', value: '92' },
];

export const TransformationPartnershipScreen = () => {
  const { pushScene } = useBrowserNavigation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Partnership Network */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            
            {/* Network nodes and connections */}
            {[...Array(6)].map((_, i) => {
              const cx = 20 + (i % 3) * 30;
              const cy = 25 + Math.floor(i / 3) * 50;
              return (
                <g key={i}>
                  <circle
                    cx={`${cx}%`}
                    cy={`${cy}%`}
                    r="30"
                    fill="url(#networkGradient)"
                    className="animate-pulse"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                  {i < 5 && (
                    <line
                      x1={`${cx}%`}
                      y1={`${cy}%`}
                      x2={`${20 + ((i + 1) % 3) * 30}%`}
                      y2={`${25 + Math.floor((i + 1) / 3) * 50}%`}
                      stroke="url(#networkGradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                      style={{ animationDelay: `${i * 0.3}s` }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PARTNERSHIP_SCENE} className="max-w-6xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <Handshake className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our partnership models are designed for mutual success. We believe in aligning incentives, 
                sharing risks, and celebrating victories together.
              </p>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {SUCCESS_METRICS.map((metric, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4 text-center animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-2xl font-bold text-purple-400">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Partnership Models */}
            <div className="space-y-6">
              {PARTNERSHIP_MODELS.map((model, idx) => (
                <div
                  key={model.id}
                  className="relative animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 hover:border-purple-500/50 transition-all duration-300">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Model Overview */}
                      <div className="lg:col-span-1">
                        <div className={cn(
                          "inline-flex p-4 rounded-xl bg-gradient-to-br text-white mb-4",
                          model.color
                        )}>
                          {model.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{model.title}</h3>
                        <p className="text-purple-400 font-medium mb-3">{model.subtitle}</p>
                        <p className="text-gray-400 mb-4">{model.description}</p>
                        <p className="text-sm text-gray-500">
                          <Star className="w-4 h-4 inline mr-1 text-yellow-400" />
                          Ideal for: {model.ideal}
                        </p>
                      </div>

                      {/* Benefits & Terms */}
                      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Key Benefits</h4>
                          <ul className="space-y-2">
                            {model.benefits.map((benefit, benefitIdx) => (
                              <li key={benefitIdx} className="flex items-start text-sm">
                                <Award className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">Partnership Terms</h4>
                          <ul className="space-y-2">
                            {model.terms.map((term, termIdx) => (
                              <li key={termIdx} className="flex items-start text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-2 mt-1.5 flex-shrink-0" />
                                <span className="text-gray-300">{term}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Statement */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Built on Trust, Powered by Results</h3>
              <p className="text-gray-300 max-w-3xl mx-auto">
                Every partnership begins with understanding your unique challenges and opportunities. 
                Our flexible models ensure we can craft the perfect alliance for your organization's journey to the stars.
              </p>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('transformationContact')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Begin Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};