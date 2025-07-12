import { 
  Rocket, 
  Target, 
  Users, 
  Cpu, 
  Shield,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const PROCESS_SCENE: SceneType = {
  id: 'launchControlProcess',
  type: 'detail',
  title: 'Mission Phases',
  description: 'Your journey from prototype to production powerhouse',
  backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
};

const MISSION_PHASES = [
  {
    id: 'assessment',
    title: 'Mission Assessment',
    icon: <Target className="w-8 h-8" />,
    duration: 'Week 1',
    description: 'Deep dive into your current architecture, performance bottlenecks, and scaling requirements',
    activities: [
      'Infrastructure audit',
      'Performance profiling',
      'Security assessment',
      'Growth projections',
    ],
  },
  {
    id: 'planning',
    title: 'Flight Plan Development',
    icon: <Rocket className="w-8 h-8" />,
    duration: 'Week 2',
    description: 'Design the optimal architecture and deployment strategy for your growth trajectory',
    activities: [
      'Architecture design',
      'Tech stack optimization',
      'Scaling roadmap',
      'Team structure planning',
    ],
  },
  {
    id: 'execution',
    title: 'Mission Execution',
    icon: <Cpu className="w-8 h-8" />,
    duration: 'Weeks 3-8',
    description: 'Implement infrastructure upgrades, performance optimizations, and new features',
    activities: [
      'Infrastructure migration',
      'Code optimization',
      'Feature development',
      'Load testing',
    ],
  },
  {
    id: 'operations',
    title: 'Orbital Operations',
    icon: <Shield className="w-8 h-8" />,
    duration: 'Ongoing',
    description: 'Continuous monitoring, optimization, and support to maintain peak performance',
    activities: [
      '24/7 monitoring',
      'Performance tuning',
      'Security updates',
      'Scaling support',
    ],
  },
];

export const LaunchControlProcessScreen = () => {
  const { pushScene } = useBrowserNavigation();
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Trajectory Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <linearGradient id="trajectoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <path
              key={i}
              d={`M ${i * 200} 0 Q ${i * 200 + 100} ${window.innerHeight / 2} ${i * 200 + 200} ${window.innerHeight}`}
              stroke="url(#trajectoryGradient)"
              strokeWidth="2"
              fill="none"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.5}s` }}
            />
          ))}
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PROCESS_SCENE} className="max-w-5xl w-full">
          <div className="space-y-8">
            {/* Phase Timeline */}
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 -translate-y-1/2 hidden md:block" />
              
              <div className="grid md:grid-cols-4 gap-6">
                {MISSION_PHASES.map((phase, idx) => (
                  <div
                    key={phase.id}
                    className={cn(
                      "relative cursor-pointer transition-all duration-300",
                      "hover:scale-105"
                    )}
                    onClick={() => setSelectedPhase(phase.id)}
                  >
                    {/* Phase Card */}
                    <div className={cn(
                      "bg-gray-800/50 backdrop-blur-sm rounded-xl p-6",
                      "border-2 transition-all duration-300",
                      selectedPhase === phase.id
                        ? "border-cyan-400 shadow-lg shadow-cyan-400/30"
                        : "border-gray-700/50 hover:border-cyan-500/50"
                    )}>
                      {/* Phase Number */}
                      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {idx + 1}
                      </div>
                      
                      {/* Icon */}
                      <div className={cn(
                        "inline-flex p-3 rounded-lg mb-4",
                        "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
                        "text-cyan-400"
                      )}>
                        {phase.icon}
                      </div>
                      
                      {/* Content */}
                      <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
                      <p className="text-sm text-cyan-400 mb-2">{phase.duration}</p>
                      <p className="text-sm text-gray-400">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Phase Details */}
            {selectedPhase && (
              <div className="animate-fadeIn bg-gray-800/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                {(() => {
                  const phase = MISSION_PHASES.find(p => p.id === selectedPhase);
                  if (!phase) {return null;}
                  
                  return (
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-white flex items-center">
                        {phase.icon}
                        <span className="ml-3">{phase.title} Activities</span>
                      </h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {phase.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center text-gray-300">
                            <CheckCircle className="w-5 h-5 text-cyan-400 mr-2 flex-shrink-0" />
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Team Integration */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-blue-400" />
                Seamless Team Integration
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">Your Team</h4>
                  <p className="text-sm">Maintains product vision and business logic while we handle the technical scaling challenges.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-300 mb-2">Our Team</h4>
                  <p className="text-sm">Senior engineers, DevOps experts, and architects who seamlessly integrate with your workflow.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('launchControlCapabilities')}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                View Team Capabilities
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