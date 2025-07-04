import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmailOptIn } from "@/components/EmailOptIn";
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
      icon: Target,
      title: "Product Discovery",
      description:
        "We'll dig deep into your idea, understand the market, and identify the core value proposition",
    },
    {
      icon: Code,
      title: "Rapid MVP Building",
      description:
        "Using vibe coding tools, I'll build you something real and testable in just a few hours",
    },
    {
      icon: Users,
      title: "Customer Development Guidance",
      description:
        "Learn how to validate your concept with real users and gather meaningful feedback",
    },
    {
      icon: Zap,
      title: "Iteration Framework",
      description:
        "Get the tools and knowledge to continue building and improving on your own",
    },
  ];

  const steps = [
    "Discovery Call: We'll explore your idea, target market, and key assumptions",
    "Rapid Prototyping: I'll build a testable MVP using cutting-edge vibe coding tools",
    "Validation Strategy: Learn how to test your concept with real potential customers",
    "Iteration Guidance: Get the framework to continue building and improving",
    "Next Steps Planning: Decide if your idea has traction worth pursuing further",
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
              Turn your idea into reality. I'll use 20 years of zero-to-one
              product experience and cutting-edge vibe coding tools to build you
              something testable in hours, not months.
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
                  Let's Build Your Idea
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
                How It Works
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                From idea to testable product in just a few hours of focused
                work.
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
                The Process
              </h2>
              <p className="text-xl text-gray-300">
                From idea to testable product in just a few focused sessions.
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

        {/* Email Opt-in Section */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <EmailOptIn
              title="Learn for yourself"
              description="Follow along with me as I build and share what I learn"
              className="max-w-2xl mx-auto"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-black/20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to test your idea?
              </h2>

              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Stop wondering if your idea could work. Let's build something
                real and find out together.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white px-12 py-6 text-xl font-semibold rounded-xl"
                onClick={() =>
                  window.open(
                    "https://savvycal.com/craigsturgis/vibecto-clarity-call",
                    "_blank"
                  )
                }
              >
                Book Discovery Call
                <Rocket className="ml-3 w-6 h-6" />
              </Button>

              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Hands-on building</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Real MVP delivered</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <span>Validation guidance included</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Ignition;
