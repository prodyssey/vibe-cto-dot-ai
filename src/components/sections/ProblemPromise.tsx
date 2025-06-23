
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, ArrowRight } from "lucide-react";

export const ProblemPromise = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where are you in your journey?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're just starting or scaling up, I've got the exact guidance you need.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Ignition Card */}
          <Card className="relative group bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/30 hover:border-green-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Sparkles className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Just getting started?</h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Turn your ideas into working prototypes with confidence. Learn to build fast, 
                ship faster, and avoid the common pitfalls that trip up new vibe coders.
              </p>
              
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Tool selection & setup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Rapid prototyping strategies</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>First deployment guidance</span>
                </li>
              </ul>
              
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3">
                Explore Ignition
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Launch Control Card */}
          <Card className="relative group bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Prototype hitting its limits?</h3>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Scale your vibe-coded prototype into a production-ready system. Get fractional CTO 
                guidance to handle security, performance, and team growth.
              </p>
              
              <ul className="space-y-2 mb-8 text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Architecture & scaling strategy</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Security & compliance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Team & process optimization</span>
                </li>
              </ul>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3">
                Explore Launch Control
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
