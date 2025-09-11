'use client'

import { ArrowRight, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addSavvyCalTracking } from "@/lib/analytics";
import { getOrderedServices } from "@/config/services";

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
  
  const services = getOrderedServices();
  const paths = services
    .filter(service => service.id === 'ignition' || service.id === 'launch-control')
    .map(service => ({
      icon: service.icon,
      title: service.label,
      subtitle: service.subtitle,
      description: service.longDescription,
      features: service.features,
      cta: service.cta,
      link: service.link,
      isExternal: service.isExternal,
      color: service.color,
    }));

  return (
    <section id="journey" className="py-20 px-6 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Looking for pure vibe coding help?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Not everybody is ready for a full product team yet. Here's how Craig can help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {paths.map((path, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 relative overflow-hidden group flex flex-col h-full"
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

              <CardContent className="relative space-y-4 flex-grow flex flex-col">
                <p className="text-gray-300 leading-relaxed">
                  {path.description}
                </p>

                <ul className="space-y-2 flex-grow">
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

                <div className="mt-auto pt-4">
                  {path.isExternal ? (
                    <a
                      ref={
                        path.title === "Ignition" ? ignitionLinkRef : undefined
                      }
                      href={path.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button
                        className={`w-full bg-gradient-to-r ${path.color} hover:opacity-90 text-white font-semibold`}
                      >
                        {path.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  ) : (
                    <Link href={path.link} className="block">
                      <Button
                        className={`w-full bg-gradient-to-r ${path.color} hover:opacity-90 text-white font-semibold`}
                      >
                        {path.cta}
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Adventure Game CTA */}
        <div className="text-center mt-12">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Not sure which path is right for you?
            </h3>
            <p className="text-gray-300 mb-6">
              Take an interactive journey through the VibeCTO Station to discover the perfect path for your situation.
            </p>
            <Link href="/adventure">
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-300 hover:scale-105"
              >
                <Gamepad2 className="mr-2 w-5 h-5" />
                Enter the VibeCTO Station
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
