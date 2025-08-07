import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderedServices } from "@/config/services";

export const ProblemPromise = () => {
  const navigate = useNavigate();
  const services = getOrderedServices();

  const handleNavigation = (path: string) => {
    navigate(path);
    // Scroll to top after navigation
    setTimeout(() => window.scrollTo(0, 0), 0);
  };

  return (
    <section className="py-20 px-6 bg-black/40 backdrop-blur-sm" id="journey">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where are you in your journey?
          </h2>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto">
            Whether you're just starting or scaling up, I've got the exact
            guidance you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            
            // Define color schemes for each service
            const colorSchemes = {
              'transformation': {
                border: 'border-purple-500/30 hover:border-purple-400/50',
                shadow: 'hover:shadow-purple-500/20',
                iconBg: 'bg-purple-500/20',
                iconColor: 'text-purple-400',
                dot: 'bg-purple-400',
                button: 'bg-purple-600 hover:bg-purple-700',
                heading: 'Team ready to accelerate?',
                description: 'Transform your team\'s velocity with AI agents. Enterprise-grade strategies to ship faster, measure impact, and maintain quality and security.',
                features: [
                  'AI agent integration',
                  'Sophisticated measurement',
                  'Experienced support'
                ]
              },
              'ignition': {
                border: 'border-green-500/30 hover:border-green-400/50',
                shadow: 'hover:shadow-green-500/20',
                iconBg: 'bg-green-500/20',
                iconColor: 'text-green-400',
                dot: 'bg-green-400',
                button: 'bg-green-600 hover:bg-green-700',
                heading: 'Need a jump start?',
                description: 'I\'ll work with you to get your idea to a working vibe coded prototype fast. Benefit from years of experience going from 0 to 1. Test and iterate from a good foundation.',
                features: [
                  'Discovery workshops',
                  'A rapid prototype you can build on',
                  'Assumption testing guidance'
                ]
              },
              'launch-control': {
                border: 'border-blue-500/30 hover:border-blue-400/50',
                shadow: 'hover:shadow-blue-500/20',
                iconBg: 'bg-blue-500/20',
                iconColor: 'text-blue-400',
                dot: 'bg-blue-400',
                button: 'bg-blue-600 hover:bg-blue-700',
                heading: 'Prototype hitting its limits?',
                description: 'Scale your vibe-coded prototype into a production-ready system. Get fractional CTO guidance to handle security, performance, and team growth.',
                features: [
                  'Architecture & scaling strategy',
                  'Security & compliance',
                  'Team & process optimization'
                ]
              }
            };
            
            const scheme = colorSchemes[service.id];
            
            return (
              <Card 
                key={service.id}
                className={`relative group bg-gray-900/80 backdrop-blur-sm ${scheme.border} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${scheme.shadow}`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`p-3 ${scheme.iconBg} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${scheme.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {scheme.heading}
                    </h3>
                  </div>

                  <p className="text-gray-50 mb-6 leading-relaxed text-lg">
                    {scheme.description}
                  </p>

                  <ul className="space-y-3 mb-8 text-gray-50">
                    {scheme.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div className={`w-2 h-2 ${scheme.dot} rounded-full flex-shrink-0`}></div>
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleNavigation(service.path)}
                    className={`w-full ${scheme.button} text-white font-semibold py-3 text-base`}
                  >
                    Explore {service.label}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
