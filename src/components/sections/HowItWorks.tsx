import { Card, CardContent } from "@/components/ui/card";
import { Search, Map, Rocket } from "lucide-react";

export const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Assess",
      description:
        "Quick diagnostic of your current setup, goals, and blockers",
      details:
        "15-minute call to understand where you are and where you want to go",
    },
    {
      icon: Map,
      title: "Plan",
      description: "Custom roadmap tailored to your path and goals",
      details:
        "Clear milestones, timelines, and success metrics for your journey",
    },
    {
      icon: Rocket,
      title: "Ship",
      description:
        "Custom delivery, fractional CTO support, or hands on coaching as you build",
      details:
        "Starter kits, check-ins, code reviews, support,and strategic guidance through launch and expansion",
    },
  ];

  return (
    <section className="py-20 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How it works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A proven 3-step process to take you from idea to production, no
            matter your starting point.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-purple-500/50 z-0"></div>
              )}

              <Card className="relative z-10 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white text-black rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-300 mb-4 text-lg">
                    {step.description}
                  </p>
                  <p className="text-sm text-gray-400">{step.details}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <p className="text-gray-400">
            Average time from first call to production deploy: <span className="text-blue-400 font-semibold">6 weeks</span>
          </p>
        </div> */}
      </div>
    </section>
  );
};
