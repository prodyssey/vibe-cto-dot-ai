"use client";

import { ArrowRight, Calendar, Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { OptimizedImage } from "@/components/OptimizedImage";

export const Hero = () => {
  const router = useRouter();

  const scrollToJourney = () => {
    if (typeof document !== "undefined") {
      const journeySection = document.getElementById("journey");
      if (journeySection) {
        journeySection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <section className="relative min-h-[50vh] lg:min-h-[60vh] flex items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-3xl"></div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-4 sm:left-10 w-3 h-3 sm:w-4 sm:h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-32 right-6 sm:right-20 w-4 h-4 sm:w-6 sm:h-6 bg-purple-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
      <div className="absolute bottom-32 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse opacity-50 delay-500"></div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Mobile-first single column layout - only for xs screens */}
        <div className="flex flex-col items-start text-left space-y-6 sm:hidden">
          {/* Main headline and subcopy - prioritized first on mobile */}
          <div className="order-1 space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
              Get human help to build
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                effectively with AI
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-lg sm:text-xl md:text-2xl text-gray-100 max-w-2xl leading-relaxed">
              VibeCTO.ai is a consultancy that helps digital product companies
              adopt the right AI workflows to
              <span className="text-blue-400 font-semibold"> accelerate </span>
              <span className="text-purple-400 font-semibold"> their </span>
              <span className="text-pink-400 font-semibold"> roadmap</span>.
            </p>
          </div>

          {/* Primary CTA Button - positioned after text content on mobile */}
          <div className="order-2 w-full max-w-md sm:max-w-lg">
            <a
              href="https://savvycal.com/craigsturgis/vibecto-dot-ai-chat"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <Calendar className="mr-2 w-5 h-5" />
                Reserve your sprint
              </Button>
            </a>
          </div>

          {/* Avatar - positioned after primary CTA on mobile */}
          <div className="relative order-3">
            {/* Gradient border container */}
            <div className="relative p-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-xl hover:scale-105 transition-all duration-300 mx-auto w-fit">
              {/* Glass morphism inner container */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-2">
                <OptimizedImage
                  src="/images/craig-avatar-pixelated.png"
                  alt="VibeCTO Avatar"
                  width={200}
                  height={200}
                  priority
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-lg"
                  sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, (max-width: 1024px) 192px, 224px"
                />
              </div>
            </div>
            {/* Glow effect behind avatar */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl -z-10 scale-125"></div>
          </div>

          {/* Secondary CTA Button - positioned after avatar on mobile */}
          <div className="order-4 w-full max-w-md sm:max-w-lg">
            <Button
              onClick={() => router.push("/resources")}
              size="lg"
              variant="outline"
              className="border-2 border-purple-500/50 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
            >
              Learn more
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Two-column layout - starting from sm screens */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-6 md:gap-8 lg:gap-12 sm:items-center sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px]">
          {/* Left column - Text content */}
          <div className="text-left pl-4 sm:pl-6 md:pl-8">
            {/* Main headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
              Get <span className="text-blue-400 font-semibold">human</span>{" "}
              help to build
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                effectively with AI
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-100 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              VibeCTO.ai is a consultancy that helps digital product companies
              adopt the right AI workflows to
              <span className="text-blue-400 font-semibold"> accelerate </span>
              <span className="text-purple-400 font-semibold"> their </span>
              <span className="text-pink-400 font-semibold"> roadmap</span>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8">
              <a
                href="https://savvycal.com/craigsturgis/vibecto-dot-ai-chat"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Calendar className="mr-2 w-5 h-5" />
                  Reserve your sprint
                </Button>
              </a>

              <Button
                onClick={() => router.push("/resources")}
                size="lg"
                variant="outline"
                className="w-full lg:w-auto border-2 border-purple-500/50 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 text-sm sm:text-base lg:text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-105"
              >
                Learn more
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Right column - Avatar and Trust Stats */}
          <div className="flex flex-col justify-center items-center pr-4 sm:pr-6 md:pr-8 space-y-6 sm:space-y-0">
            {/* Avatar */}
            <div className="relative">
              {/* Gradient border container */}
              <div className="relative p-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 rounded-xl hover:scale-105 transition-all duration-300 w-fit mx-auto">
                {/* Glass morphism inner container */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-3">
                  <OptimizedImage
                    src="/images/craig-avatar-pixelated.png"
                    alt="VibeCTO Avatar"
                    width={384}
                    height={384}
                    priority
                    className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 2xl:w-96 2xl:h-96 rounded-lg"
                    sizes="(max-width: 1536px) 320px, 384px"
                  />
                </div>
              </div>
              {/* Glow effect behind avatar */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-2xl -z-10 scale-125"></div>
            </div>

            {/* Trust-building stats */}
            <div className="text-center space-y-3 sm:space-y-2 max-w-xs sm:max-w-sm">
              {/* Attribution */}
              <p className="text-sm sm:text-base text-gray-300/80 font-medium italic mt-1 sm:mt-2">
                - Craig Sturgis, Founder
              </p>
              {/* Core credentials */}
              {/* <div className="space-y-2 sm:space-y-3">
                <p className="text-base sm:text-lg md:text-xl text-gray-100 font-medium">
                  <span className="text-blue-400 font-semibold">20+ years</span>{" "}
                  building digital products
                </p>
                <p className="text-base sm:text-lg md:text-xl text-gray-100 font-medium">
                  <span className="text-purple-400 font-semibold">
                    AI early adopter
                  </span>{" "}
                  since 2022
                </p>
              </div> */}

              {/* Trust indicators in glass morphism container */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-sm sm:text-base">
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-200">
                      20+ years building products
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                    <span className="text-gray-200">
                      AI early adopter since 2022
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
                    <span className="text-gray-200">
                      AI transformation expert
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
