import { Zap, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addSavvyCalTracking } from "@/lib/analytics";

export const Paths = () => {
  const ignitionLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (ignitionLinkRef.current) {
      addSavvyCalTracking(
        ignitionLinkRef.current,
        "paths_section",
        "clarity_call",
        {
          path: "ignition",
        }
      );
    }
  }, []);
  const paths = [
    {
      icon: Sparkles,
      title: "Transformation",
      subtitle:
        "For established teams that want to build quality products much faster",
      description:
        "Transform your team's development velocity with enterprise-grade AI agent integration.",
      features: [
        "Team transformation",
        "AI agent deployment",
        "Sophisticated measurement",
        "Enterprise support",
      ],
      cta: "Schedule Team Call",
      link: "/transformation",
      color: "from-purple-600 to-blue-600",
    },
    {
      icon: Zap,
      title: "Ignition",
      subtitle:
        "For founders with ideas who want to test them quickly and intelligently",
      description:
        "Compress months of wandering into weeks of clarity. Get a working MVP + validation framework from an expert 0 to 1 builder in just 2-4 weeks.",
      features: [
        "2-4 hour intensive discovery",
        "Rapid MVP development",
        "Tech stack selection",
        "Assumption testing & iteration",
      ],
      cta: "Build My Idea",
      link: "https://savvycal.com/craigsturgis/vibecto-clarity-call",
      isExternal: true,
      color: "from-yellow-600 to-orange-600",
    },
    {
      icon: Rocket,
      title: "Launch Control",
      subtitle:
        "Mission Command - where successful prototypes achieve escape velocity",
      description:
        "Your vibe coded product has achieved liftoff. Get the technical infrastructure and strategic guidance to scale into a market-capturing product.",
      features: [
        "6-12+ week transformation",
        "Performance optimization",
        "Team augmentation",
        "Fractional CTO/CPO support",
      ],
      cta: "Explore Mission Parameters",
      link: "/launch-control",
      color: "from-blue-600 to-cyan-600",
    },
  ];

  return (
    <section id="journey" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Journey
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you&apos;re leading a team, just starting out, or ready to
            launch, there&apos;s a path designed for your success.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {paths.map((path, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 relative overflow-hidden group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${path.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>

              <CardHeader className="relative">
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${path.color} rounded-xl flex items-center justify-center mb-4`}
                >
                  <path.icon className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-white mb-2">
                  {path.title}
                </CardTitle>
                <p className="text-sm text-gray-400 font-medium">
                  {path.subtitle}
                </p>
              </CardHeader>

              <CardContent className="relative space-y-4">
                <p className="text-gray-300 leading-relaxed">
                  {path.description}
                </p>

                <ul className="space-y-2">
                  {path.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span
                        className={`text-transparent bg-clip-text bg-gradient-to-r ${path.color} mt-0.5`}
                      >
                        ✓
                      </span>
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {path.isExternal ? (
                  <a
                    ref={
                      path.title === "Ignition" ? ignitionLinkRef : undefined
                    }
                    href={path.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block pt-4"
                  >
                    <Button
                      className={`w-full bg-gradient-to-r ${path.color} hover:opacity-90 text-white font-semibold`}
                    >
                      {path.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </a>
                ) : (
                  <Link to={path.link} className="block pt-4">
                    <Button
                      className={`w-full bg-gradient-to-r ${path.color} hover:opacity-90 text-white font-semibold`}
                    >
                      {path.cta}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* <div className="text-center mt-12">
          <p className="text-gray-400">
            Not sure which path is right for you?
            <Button
              variant="link"
              className="text-blue-400 hover:text-blue-300 px-1"
            >
              Take a quick quiz
            </Button>
          </p>
        </div> */}
      </div>
    </section>
  );
};
