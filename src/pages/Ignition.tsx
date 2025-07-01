import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Zap,
  Code,
  Rocket,
  CheckCircle,
  ArrowRight,
  Clock,
  Users,
  Target,
} from "lucide-react";

const Ignition = () => {
  const features = [
    {
      icon: Code,
      title: "Rapid Prototyping",
      description: "Turn ideas into working prototypes in hours, not weeks",
    },
    {
      icon: Zap,
      title: "AI-Powered Development",
      description:
        "Leverage the latest AI vibe coding tools to accelerate your coding workflow",
    },
    {
      icon: Target,
      title: "Market Validation",
      description:
        "Get your MVP in front of users quickly to validate your ideas",
    },
    // {
    //   icon: Users,
    //   title: "Community Support",
    //   description: "Join a community of like-minded vibe coders building the future"
    // }
    {
      icon: Users,
      title: "Office hours",
      description:
        "Get 1-on-1 coaching from Craig to help you build, measure and learn",
    },
  ];

  const steps = [
    "Learn the fundamentals of vibe coding",
    "Master AI-assisted development tools",
    "Build your first prototype in 24 hours",
    "Get feedback from real users",
    "Iterate and improve rapidly",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Ignition
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Spark your vibe coding journey. Learn to build and ship faster
              than ever before with AI-powered development tools and proven
              methodologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://savvycal.com/craigsturgis/vibecto-clarity-call"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-8 py-6 text-lg font-semibold rounded-xl"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </a>

              {/* <Button
                variant="outline"
                size="lg"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg"
              >
                Learn More
              </Button> */}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Ignition?
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Get the foundation you need to build and ship products at the
                speed of thought.
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
                      <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl">
                        <feature.icon className="w-8 h-8 text-yellow-400" />
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

        {/* Process Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Your Learning Path
              </h2>
              <p className="text-xl text-gray-300">
                Follow my 5-step process to become a vibe coding expert.
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-lg font-medium">{step}</p>
                  </div>
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to ignite your potential?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of dreamers who've made something real with vibe
                coding.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
              >
                Get Started Today
                <Rocket className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Self-paced learning</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Lifetime access</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Community included</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Ignition;
