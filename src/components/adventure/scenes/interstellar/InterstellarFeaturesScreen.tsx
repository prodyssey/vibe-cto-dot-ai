import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { useBrowserNavigation } from '../../hooks';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Gauge, 
  GitBranch, 
  HeadphonesIcon,
  Award,
  Infinity,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const FEATURES_SCENE: SceneType = {
  id: 'interstellarFeatures',
  type: 'detail',
  title: 'Enterprise Excellence',
  description: 'Features designed for organizations that never compromise',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const ENTERPRISE_FEATURES = [
  {
    id: 'security',
    icon: <Shield className="w-8 h-8" />,
    title: 'Quantum-Grade Security',
    description: 'Post-quantum cryptography and zero-trust architecture',
    details: [
      'Quantum-resistant encryption algorithms',
      'Continuous security posture assessment',
      'Automated threat response',
      'Compliance automation (SOC2, ISO27001, GDPR)',
    ],
  },
  {
    id: 'performance',
    icon: <Gauge className="w-8 h-8" />,
    title: 'Hyperscale Performance',
    description: 'Infrastructure that grows with your ambitions',
    details: [
      'Sub-millisecond response times',
      'Automatic global load balancing',
      'Predictive capacity planning',
      'Real-time performance optimization',
    ],
  },
  {
    id: 'integration',
    icon: <GitBranch className="w-8 h-8" />,
    title: 'Seamless Integration',
    description: 'Connect everything, disrupt nothing',
    details: [
      'API-first architecture',
      'Legacy system modernization',
      'Real-time data synchronization',
      'Multi-cloud orchestration',
    ],
  },
  {
    id: 'support',
    icon: <HeadphonesIcon className="w-8 h-8" />,
    title: 'White-Glove Support',
    description: '24/7 access to senior engineers',
    details: [
      'Dedicated success team',
      'Priority incident response',
      'Proactive optimization',
      'Executive briefings',
    ],
  },
  {
    id: 'innovation',
    icon: <Award className="w-8 h-8" />,
    title: 'Innovation Guarantee',
    description: 'Stay ahead of disruption',
    details: [
      'Quarterly technology reviews',
      'Early access to breakthroughs',
      'Custom R&D projects',
      'Patent co-development',
    ],
  },
  {
    id: 'scale',
    icon: <Infinity className="w-8 h-8" />,
    title: 'Infinite Scale',
    description: 'No limits, only possibilities',
    details: [
      'Elastic infrastructure',
      'Global edge network',
      'Automated scaling policies',
      'Cost optimization AI',
    ],
  },
];

export const InterstellarFeaturesScreen = () => {
  const { pushScene } = useBrowserNavigation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Feature Network Visualization */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="dots" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="2" fill="#8b5cf6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
          
          {/* Connect the dots with animated lines */}
          {[...Array(6)].map((_, i) => {
            const angle = (i * 60) * Math.PI / 180;
            const x1 = 50 + 30 * Math.cos(angle);
            const y1 = 50 + 30 * Math.sin(angle);
            const nextAngle = ((i + 1) * 60) * Math.PI / 180;
            const x2 = 50 + 30 * Math.cos(nextAngle);
            const y2 = 50 + 30 * Math.sin(nextAngle);
            
            return (
              <line
                key={i}
                x1={`${x1}%`}
                y1={`${y1}%`}
                x2={`${x2}%`}
                y2={`${y2}%`}
                stroke="#8b5cf6"
                strokeWidth="1"
                strokeDasharray="5,5"
                className="animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            );
          })}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={FEATURES_SCENE} className="max-w-6xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Every feature is engineered for enterprises that operate at the edge of possibility. 
                Our platform provides the foundation for continuous innovation and unstoppable growth.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ENTERPRISE_FEATURES.map((feature, idx) => (
                <div
                  key={feature.id}
                  className="group relative animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="h-full bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                    {/* Icon */}
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-400 mb-4">{feature.description}</p>
                    
                    {/* Details */}
                    <ul className="space-y-2">
                      {feature.details.map((detail, detailIdx) => (
                        <li key={detailIdx} className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Partnership Benefits */}
            <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">The Interstellar Advantage</h3>
              
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">10x</div>
                  <p className="text-gray-300">Faster Innovation Cycles</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">50%</div>
                  <p className="text-gray-300">Cost Reduction</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-400 mb-2">∞</div>
                  <p className="text-gray-300">Scaling Potential</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('interstellarPartnership')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Explore Partnership Models
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