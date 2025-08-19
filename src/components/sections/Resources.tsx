'use client'

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Resources = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Resources & Insights
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Discover practical guides and insights for AI-augmented engineering
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Resources and guides will be available here soon.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                AI Engineering
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Learn about AI-augmented development practices.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Product Development
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Strategies for scaling your product development.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link href="/resources">
            <Button 
              variant="outline" 
              className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
            >
              View All Resources
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};