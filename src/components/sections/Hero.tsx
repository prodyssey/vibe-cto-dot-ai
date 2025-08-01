import { ArrowRight, Code, Rocket, Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

export const Hero = () => {
  const navigate = useNavigate();

  const scrollToJourney = () => {
    const journeySection = document.getElementById("journey");
    if (journeySection) {
      journeySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-purple-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
      <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-pulse opacity-50 delay-500"></div>

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center lg:ml-10">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">
                Elite AI Augmented Engineering and Vibe Coding Guidance
              </span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 leading-tight">
              From vibes to
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                product
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-xl md:text-2xl text-gray-100 max-w-4xl lg:max-w-none mx-auto mb-12 leading-relaxed">
              I help builders use AI tools to ship
              <span className="text-blue-400 font-semibold">
                {" "}
                real products, internal tools, and prototypes - fast
              </span>
              .
            </p>

            {/* Primary CTA */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={() => navigate("/adventure")}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Gamepad2 className="mr-2 w-5 h-5" />
                  Pick Your Path (Fun)
                </Button>

                <Button
                  onClick={scrollToJourney}
                  size="lg"
                  variant="outline"
                  className="border-2 border-purple-500/50 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 px-8 py-6 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
                >
                  Pick Your Path (Standard)
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {/* <p className="text-sm text-gray-400 text-center lg:text-left">
                Free clarity call • No commitment required • Adventure mode
                available!
              </p> */}
            </div>

            {/* Visual indicators */}
            <div className="mt-16 flex justify-center lg:justify-start space-x-12 opacity-60">
              <div className="flex items-center space-x-2 text-gray-400">
                <Rocket className="w-5 h-5" />
                <span className="text-sm">Ship fast</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Code className="w-5 h-5" />
                <span className="text-sm">Confidence from experience</span>
              </div>
            </div>
          </div>

          {/* Right column - Avatar */}
          <div className="flex justify-center lg:justify-end lg:mr-10">
            <div className="relative text-center mx-auto lg:mx-0">
              <img
                src="/lovable-uploads/8dee8e22-c18f-4fb2-b2ea-7fbe8d2fe25a.png"
                alt="VibeCTO Avatar"
                className="w-80 h-80 lg:w-96 lg:h-96 object-contain hover:scale-105 transition-transform duration-300 mx-auto"
              />
              {/* Quote under avatar */}
              <p className="mt-6 text-lg text-gray-200 italic">
                "Hi. I'm Craig. Let's build and learn together."
              </p>
              {/* Glow effect behind avatar */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-2xl -z-10 scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
