
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Video, ArrowRight } from "lucide-react";

export const Resources = () => {
  const resources = [
    {
      type: "Article",
      icon: FileText,
      title: "Security Checklist for Vibe Coders",
      description: "10 essential security steps before your first production deploy",
      date: "Dec 15, 2024",
      readTime: "5 min read",
      badge: "New"
    },
    {
      type: "Template",
      icon: Calendar,
      title: "Production Deployment Checklist",
      description: "Copy-paste checklist to bulletproof your Lovable/Bolt projects",
      date: "Dec 10, 2024", 
      readTime: "Template",
      badge: "Popular"
    },
    {
      type: "Talk",
      icon: Video,
      title: "From Prototype to $10k MRR in 8 Weeks",
      description: "Live case study walkthrough from recent Launch Control client",
      date: "Dec 5, 2024",
      readTime: "25 min watch",
      badge: "Featured"
    }
  ];

  return (
    <section className="py-20 px-6 bg-black/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Fresh resources
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay ahead with the latest strategies, tools, and insights for vibe coders.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {resources.map((resource, index) => (
            <Card key={index} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <resource.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    resource.badge === 'New' ? 'bg-green-500/20 text-green-400' :
                    resource.badge === 'Popular' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {resource.badge}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {resource.title}
                </h3>
                
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{resource.date}</span>
                  <span>{resource.readTime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm">
            View All Resources
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
