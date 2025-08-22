'use client'

import { ArrowRight, Calendar, FileText, Code } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PostMetadata } from "@/lib/posts";
import { formatPostDate } from "@/lib/dateUtils";

interface ResourcesProps {
  posts: PostMetadata[];
}

export const Resources = ({ posts }: ResourcesProps) => {
  const getIcon = (type: string) => {
    return type === "react" ? Code : FileText;
  };
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
          {posts.length > 0 ? (
            posts.map((post) => {
              const Icon = getIcon(post.type);
              return (
                <Link key={post.slug} href={`/resources/${post.slug}`}>
                  <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-400" />
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400">
                          Featured
                        </Badge>
                      </div>

                      <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {post.description}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatPostDate(post.date)}
                        </div>
                        <span>{post.readTime}</span>
                      </div>

                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-white/20 text-white/70 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          ) : (
            <>
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
            </>
          )}
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