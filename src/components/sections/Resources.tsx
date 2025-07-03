
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, FileText, Code, ArrowRight } from "lucide-react";
import { getAllPosts, PostMetadata } from "@/lib/content";

export const Resources = () => {
  const [resources, setResources] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResources = async () => {
      try {
        const allPosts = await getAllPosts();
        
        // Get featured posts first
        const featuredPosts = allPosts.filter(post => post.featured);
        
        // If less than 3 featured, fill with most recent non-featured
        const regularPosts = allPosts.filter(post => !post.featured);
        const postsToShow = [...featuredPosts];
        
        // Add regular posts if needed to reach 3 total
        const postsNeeded = 3 - postsToShow.length;
        if (postsNeeded > 0) {
          postsToShow.push(...regularPosts.slice(0, postsNeeded));
        }
        
        // Limit to 3 posts total
        setResources(postsToShow.slice(0, 3));
      } catch (error) {
        console.error('Error loading resources:', error);
        setResources([]);
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, []);

  const getIcon = (type: string) => {
    return type === 'react' ? Code : FileText;
  };

  const getBadge = (post: PostMetadata) => {
    if (post.featured) return 'Featured';
    if (post.type === 'react') return 'Interactive';
    
    // Check if post is recent (within last 7 days)
    const postDate = new Date(post.date);
    const daysAgo = Math.floor((Date.now() - postDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysAgo <= 7) return 'New';
    
    return 'Popular';
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Featured':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'Interactive':
        return 'bg-blue-500/20 text-blue-400';
      case 'New':
        return 'bg-green-500/20 text-green-400';
      default:
        return 'bg-purple-500/20 text-purple-400';
    }
  };

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

        {loading ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                      <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-white/10 rounded mb-3"></div>
                    <div className="h-12 bg-white/10 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="w-24 h-4 bg-white/10 rounded"></div>
                      <div className="w-16 h-4 bg-white/10 rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : resources.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {resources.map((resource) => {
              const Icon = getIcon(resource.type);
              const badge = getBadge(resource);
              const badgeColor = getBadgeColor(badge);
              
              return (
                <Link key={resource.slug} to={`/resources/${resource.slug}`}>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>{new Date(resource.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                        <span>{resource.readTime}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : null}

        <div className="text-center">
          <Link to="/resources">
            <Button variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm">
              View All Resources
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
