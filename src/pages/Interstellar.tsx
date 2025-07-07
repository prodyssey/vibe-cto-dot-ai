import {
  Users,
  Cpu,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Interstellar = () => {
  const features = [
    {
      icon: Cpu,
      title: "AI Agent Integration",
      description:
        "Deploy specialized AI agents across your development workflow",
    },
    {
      icon: BarChart3,
      title: "Incredible Velocity",
      description:
        "Ship features faster while maintaining code quality and standards",
    },
    {
      icon: Shield,
      title: "Enterprise Ready",
      description:
        "Secure, scalable solutions that integrate with your existing infrastructure",
    },
    {
      icon: Users,
      title: "Team Transformation",
      description:
        "Upskill your entire team with cutting-edge AI development practices",
    },
  ];

  const benefits = [
    "Reduce development cycles from months to weeks",
    "Automate repetitive tasks and improve code reviews",
    "Infuse quality in every change",
    "Accelerate onboarding of new developers",
    "Scale your product development capacity",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Interstellar
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Take your team to light speed. Transform your product development
              with AI agents that amplify your team's capabilities and
              accelerate delivery.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                onClick={() =>
                  window.open(
                    "https://savvycal.com/craigsturgis/vibecto-30-minute-call",
                    "_blank"
                  )
                }
              >
                Schedule Strategy Call
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>

              {/* <Button 
                variant="outline" 
                size="lg"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                Download Case Studies
              </Button> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Enterprise-Grade AI Development
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Leverage battle-tested strategies to integrate AI agents into
                your existing workflows.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                        <feature.icon className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                    <CardTitle className="text-white text-lg">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Transform Your Development Process
              </h2>
              <p className="text-xl text-gray-300">
                Real results from teams that have gone Interstellar.
              </p>
            </div>

            {/* <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                    75%
                  </div>
                  <p className="text-white text-lg">Faster Feature Delivery</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 to-blue-600/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-8 text-center">
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                    3x
                  </div>
                  <p className="text-white text-lg">Developer Productivity</p>
                </CardContent>
              </Card>
            </div> */}

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                >
                  <Sparkles className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <p className="text-white text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Proven Process
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We work with your team to implement AI agents seamlessly into
                your workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <CardTitle className="text-white text-xl">
                    Discovery & Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    We analyze your current development processes and identify
                    high-impact opportunities for AI integration.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <CardTitle className="text-white text-xl">
                    Implementation & Training
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Deploy custom AI agents tailored to your tech stack while
                    training your team on best practices.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <CardTitle className="text-white text-xl">
                    Scale & Optimize
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Continuously improve and expand AI agent capabilities based
                    on real-world results and feedback.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready for light speed development?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join leading teams who've transformed their product development
                with AI agents.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                onClick={() =>
                  window.open(
                    "https://savvycal.com/craigsturgis/vibecto-30-minute-call",
                    "_blank"
                  )
                }
              >
                Schedule Your Strategy Call
                <Sparkles className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>30-minute consultation</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Custom roadmap</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>ROI analysis</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Interstellar;
