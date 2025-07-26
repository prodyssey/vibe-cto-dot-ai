import { 
  Brain, 
  Cpu, 
  Globe, 
  Layers, 
  Shield, 
  Workflow,
  ArrowRight,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';

const CAPABILITIES_SCENE: SceneType = {
  id: 'transformationCapabilities',
  type: 'detail',
  title: 'Quantum Capabilities',
  description: 'Technologies that bend the rules of what\'s possible',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const ADVANCED_CAPABILITIES = [
  {
    id: 'ai-transformation',
    category: 'AI & Machine Learning',
    icon: <Brain className="w-10 h-10" />,
    title: 'Enterprise AI Transformation',
    description: 'Deploy cutting-edge AI across your entire organization',
    features: [
      'Custom LLM fine-tuning and deployment',
      'Intelligent process automation',
      'Predictive analytics at scale',
      'AI-powered decision support systems',
      'Computer vision and NLP solutions',
    ],
    color: 'from-purple-500 to-pink-500',
    metrics: {
      efficiency: '+75%',
      accuracy: '99.9%',
      scale: 'Infinite',
    },
  },
  {
    id: 'quantum-computing',
    category: 'Quantum Computing',
    icon: <Cpu className="w-10 h-10" />,
    title: 'Quantum-Ready Architecture',
    description: 'Prepare for the next computing revolution',
    features: [
      'Quantum algorithm development',
      'Hybrid classical-quantum systems',
      'Cryptography migration strategies',
      'Optimization problem solving',
      'Quantum simulation capabilities',
    ],
    color: 'from-indigo-500 to-blue-500',
    metrics: {
      speed: '1000x',
      complexity: 'Exponential',
      readiness: 'Future-proof',
    },
  },
  {
    id: 'global-scale',
    category: 'Global Infrastructure',
    icon: <Globe className="w-10 h-10" />,
    title: 'Planetary-Scale Systems',
    description: 'Infrastructure that spans continents seamlessly',
    features: [
      'Multi-region active-active deployments',
      'Edge computing networks',
      'Global content delivery',
      'Disaster recovery automation',
      'Regulatory compliance automation',
    ],
    color: 'from-cyan-500 to-blue-500',
    metrics: {
      latency: '<50ms',
      availability: '99.999%',
      regions: '25+',
    },
  },
];

export const TransformationCapabilitiesScreen = () => {
  const { pushScene } = useBrowserNavigation();
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Quantum Grid */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px),
                radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.2) 0%, transparent 70%)
              `,
              backgroundSize: '50px 50px, 50px 50px, cover',
            }}
          />
        </div>

        {/* Floating Tech Icons */}
        <div className="absolute inset-0">
          {[Brain, Cpu, Globe, Layers, Shield, Workflow].map((Icon, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${15 + (i % 3) * 35}%`,
                top: `${20 + Math.floor(i / 3) * 40}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${8 + i}s`,
              }}
            >
              <Icon className="w-8 h-8 text-purple-400 opacity-20" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={CAPABILITIES_SCENE} className="max-w-6xl w-full">
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center mb-8">
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Our advanced capabilities combine cutting-edge research with enterprise-grade reliability. 
                Each solution is designed to give you an unfair advantage in your market.
              </p>
            </div>

            {/* Capabilities Grid */}
            <div className="space-y-6">
              {ADVANCED_CAPABILITIES.map((capability, idx) => (
                <div
                  key={capability.id}
                  className={cn(
                    "relative overflow-hidden rounded-xl transition-all duration-500 animate-fadeIn",
                    selectedCapability === capability.id ? "scale-[1.02]" : "",
                  )}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  {/* Card Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-80" />
                  
                  {/* Hover Gradient */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 hover:opacity-10 transition-opacity duration-300",
                    capability.color
                  )} />
                  
                  {/* Content */}
                  <div className="relative p-8 border border-gray-700/50 hover:border-purple-500/50 transition-colors duration-300">
                    <div className="grid lg:grid-cols-3 gap-8">
                      {/* Header Section */}
                      <div className="lg:col-span-1">
                        <div className="flex items-start space-x-4">
                          <div className={cn(
                            "p-3 rounded-lg bg-gradient-to-br text-white",
                            capability.color
                          )}>
                            {capability.icon}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-purple-400 mb-1">{capability.category}</p>
                            <h3 className="text-xl font-bold text-white mb-2">{capability.title}</h3>
                            <p className="text-gray-400">{capability.description}</p>
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="mt-6 grid grid-cols-3 gap-4">
                          {Object.entries(capability.metrics).map(([key, value]) => (
                            <div key={key} className="text-center">
                              <div className="text-lg font-bold text-purple-300">{value}</div>
                              <div className="text-xs text-gray-500 capitalize">{key}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Features Section */}
                      <div className="lg:col-span-2">
                        <h4 className="text-sm font-semibold text-gray-400 mb-4">KEY FEATURES</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          {capability.features.map((feature, featureIdx) => (
                            <div key={featureIdx} className="flex items-start space-x-2">
                              <ChevronRight className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-300">{feature}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => setSelectedCapability(
                            selectedCapability === capability.id ? null : capability.id
                          )}
                          className="mt-4 text-sm text-purple-400 hover:text-purple-300 flex items-center"
                        >
                          {selectedCapability === capability.id ? 'Show less' : 'Learn more'}
                          <ChevronRight className={cn(
                            "w-4 h-4 ml-1 transition-transform",
                            selectedCapability === capability.id ? "rotate-90" : ""
                          )} />
                        </button>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {selectedCapability === capability.id && (
                      <div className="mt-6 pt-6 border-t border-gray-700/50 animate-fadeIn">
                        <div className="bg-gray-900/50 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Implementation Approach</h4>
                          <p className="text-gray-300 mb-4">
                            Our team of specialists works closely with your organization to design and implement 
                            solutions that leverage these advanced capabilities while ensuring seamless integration 
                            with your existing systems.
                          </p>
                          <div className="flex items-center text-sm text-purple-400">
                            <Sparkles className="w-4 h-4 mr-2" />
                            Typical implementation: 3-6 months with immediate value delivery
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Capabilities */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-white mb-3">Plus Advanced Services</h3>
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                {[
                  'Blockchain Integration',
                  'IoT Ecosystems',
                  'Digital Twin Technology',
                  'Augmented Analytics',
                  'Cybersecurity Mesh',
                  'Composable Architecture',
                ].map((service) => (
                  <span key={service} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-300">
                    {service}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <Button
                onClick={() => pushScene('transformationEngagement')}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                Explore Engagement Models
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