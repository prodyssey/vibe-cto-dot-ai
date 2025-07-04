import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Code, ArrowRight } from 'lucide-react';
import { getAllPosts, PostMetadata } from '@/lib/content';

export default function Resources() {
  const [posts, setPosts] = useState<PostMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPosts().then(setPosts).finally(() => setLoading(false));
  }, []);

  const getIcon = (type: string) => {
    return type === 'react' ? Code : FileText;
  };

  const getBadgeColor = (featured: boolean, type: string) => {
    if (featured) return 'bg-yellow-500/20 text-yellow-400';
    if (type === 'react') return 'bg-blue-500/20 text-blue-400';
    return 'bg-green-500/20 text-green-400';
  };

  const getBadgeText = (featured: boolean, type: string) => {
    if (featured) return 'Featured';
    if (type === 'react') return 'Interactive';
    return 'Article';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="pt-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <div className="text-white text-xl">Loading resources...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />
      
      <div className="pt-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Resources
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay ahead with the latest strategies, tools, and insights for vibe coders.
            </p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
                <span className="mr-2">⭐</span>
                Featured
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {featuredPosts.map((post) => {
                  const Icon = getIcon(post.type);
                  return (
                    <Link key={post.slug} to={`/resources/${post.slug}`}>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer h-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-500/20 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-400" />
                            </div>
                            <Badge className={getBadgeColor(post.featured, post.type)}>
                              {getBadgeText(post.featured, post.type)}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                            {post.title}
                          </h3>
                          
                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {post.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <span>{post.readTime}</span>
                          </div>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-8">
              All Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {regularPosts.map((post) => {
                const Icon = getIcon(post.type);
                return (
                  <Link key={post.slug} to={`/resources/${post.slug}`}>
                    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer h-full">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Icon className="w-5 h-5 text-blue-400" />
                          </div>
                          <Badge className={getBadgeColor(post.featured, post.type)}>
                            {getBadgeText(post.featured, post.type)}
                          </Badge>
                        </div>
                        
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                          {post.title}
                        </h3>
                        
                        <p className="text-gray-300 mb-4 leading-relaxed">
                          {post.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.date).toLocaleDateString()}
                          </div>
                          <span>{post.readTime}</span>
                        </div>

                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4">
                            {post.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="border-white/20 text-white/70">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 text-lg">
                No resources available yet. Check back soon!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}