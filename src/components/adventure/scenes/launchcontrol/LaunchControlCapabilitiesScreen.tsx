import { 
  Code2, 
  Cloud, 
  Database, 
  Lock, 
  Gauge, 
  GitBranch,
  ArrowRight,
  Star
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const CAPABILITIES_SCENE: SceneType = {
  id: 'launchControlCapabilities',
  type: 'detail',
  title: 'Mission Specialists',
  description: 'Elite engineers ready to scale your success',
  backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
};

const CAPABILITIES = [
  {
    id: 'backend',
    title: 'Backend Architecture',
    icon: <Code2 className="w-8 h-8" />,
    skills: [
      'Microservices design',
      'API optimization',
      'Message queuing',
      'Event-driven architecture',
    ],
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'infrastructure',
    title: 'Cloud Infrastructure',
    icon: <Cloud className="w-8 h-8" />,
    skills: [
      'AWS/GCP/Azure expertise',
      'Kubernetes orchestration',
      'Auto-scaling setup',
      'CDN optimization',
    ],
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'data',
    title: 'Data Engineering',
    icon: <Database className="w-8 h-8" />,
    skills: [
      'Database optimization',
      'Data pipeline design',
      'Real-time analytics',
      'Caching strategies',
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    icon: <Lock className="w-8 h-8" />,
    skills: [
      'Security audits',
      'GDPR/SOC2 compliance',
      'Penetration testing',
      'Zero-trust architecture',
    ],
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'performance',
    title: 'Performance Engineering',
    icon: <Gauge className="w-8 h-8" />,
    skills: [
      'Load testing',
      'Bottleneck analysis',
      'Query optimization',
      'Edge computing',
    ],
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'devops',
    title: 'DevOps Excellence',
    icon: <GitBranch className="w-8 h-8" />,
    skills: [
      'CI/CD pipelines',
      'Infrastructure as Code',
      'Monitoring & alerting',
      'Disaster recovery',
    ],
    color: 'from-yellow-500 to-orange-500',
  },
];

const TEAM_STATS = [
  { value: '50+', label: 'Senior Engineers' },
  { value: '15+', label: 'Years Avg Experience' },
  { value: '200+', label: 'Scaled Products' },
  { value: '99.9%', label: 'Uptime Record' },
];

export const LaunchControlCapabilitiesScreen = () => {
  const { pushScene } = useBrowserNavigation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Hexagon Grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <pattern id="hexagons" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,0 45,15 45,37 30,52 15,37 15,15" 
                  fill="none" 
                  stroke="cyan" 
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagons)" />
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={CAPABILITIES_SCENE} className="max-w-6xl w-full">
          <div className="space-y-8">
            {/* Team Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {TEAM_STATS.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4 text-center animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-3xl font-bold text-cyan-400">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Capabilities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CAPABILITIES.map((capability, idx) => (
                <div
                  key={capability.id}
                  className="group relative overflow-hidden rounded-xl animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-50" />
                  
                  {/* Hover Effect */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300",
                    capability.color
                  )} />
                  
                  {/* Content */}
                  <div className="relative p-6 border border-gray-700/50 rounded-xl group-hover:border-cyan-500/50 transition-colors duration-300">
                    {/* Icon */}
                    <div className={cn(
                      "inline-flex p-3 rounded-lg mb-4",
                      "bg-gradient-to-br text-white",
                      capability.color
                    )}>
                      {capability.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-lg font-bold text-white mb-3">{capability.title}</h3>
                    
                    {/* Skills */}
                    <ul className="space-y-2">
                      {capability.skills.map((skill, skillIdx) => (
                        <li key={skillIdx} className="flex items-start text-sm text-gray-300">
                          <Star className="w-4 h-4 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
              <p className="text-gray-300 mb-6">
                Our team has scaled products for Fortune 500 companies, unicorn startups, and everything in between.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {['FinTech', 'HealthTech', 'E-commerce', 'SaaS', 'EdTech', 'Gaming'].map((industry) => (
                  <span key={industry} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-sm text-gray-300">
                    {industry}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('launchControlTimeline')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                View Timeline & Commitment
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