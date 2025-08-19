"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getOrderedServices } from "@/config/services";

export const ProblemPromise = () => {
  const router = useRouter();
  const services = getOrderedServices();

  const handleNavigation = (path: string) => {
    router.push(path);
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
            Whether you're established or having trouble building momentum, I've
            got the exact guidance you need.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => {
            const Icon = service.icon;
            const pp = service.problemPromise;

            return (
              <Card
                key={service.id}
                className={`relative group bg-gray-900/80 backdrop-blur-sm ${pp.borderColor} transition-all duration-300 hover:scale-105 hover:shadow-2xl ${pp.shadowColor}`}
              >
                <CardContent className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className={`p-3 ${pp.iconBgColor} rounded-lg`}>
                      <Icon className={`w-6 h-6 ${pp.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {pp.heading}
                    </h3>
                  </div>

                  <p className="text-gray-50 mb-6 leading-relaxed text-lg">
                    {pp.description}
                  </p>

                  <ul className="space-y-3 mb-8 text-gray-50">
                    {pp.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <div
                          className={`w-2 h-2 ${pp.dotColor} rounded-full flex-shrink-0`}
                        ></div>
                        <span className="text-base">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleNavigation(service.path)}
                    className={`w-full ${pp.buttonColor} text-white font-semibold py-3 text-base`}
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
