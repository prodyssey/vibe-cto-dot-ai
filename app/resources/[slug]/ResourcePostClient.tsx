'use client'

import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Linkedin,
  Copy,
} from "lucide-react";
import { useState, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { BlogHeaderImage, BlogImage } from "@/components/BlogImage";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { toast } from "sonner";
import dynamic from "next/dynamic";

import { EmailOptIn } from "@/components/EmailOptIn";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Post } from "@/lib/posts";

import "highlight.js/styles/github-dark.css";

interface ResourcePostClientProps {
  post: Post;
}

export function ResourcePostClient({ post }: ResourcePostClientProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `https://vibecto.ai/resources/${post.metadata.slug}`;
  const shareText = `Check out "${post.metadata.title}" by ${post.metadata.author}`;

  const handleShare = async (platform: 'linkedin' | 'copy') => {
    switch (platform) {
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
          '_blank'
        );
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          toast.success('Link copied to clipboard!');
          setTimeout(() => setCopied(false), 2000);
        } catch (error) {
          toast.error('Failed to copy link');
        }
        break;
    }
  };

  // For React components, dynamically import them
  const ReactComponent = post.metadata.type === 'react' && post.metadata.slug === 'interactive-demo' ? 
    dynamic(() => import('../../../src/content/posts/interactive-demo'), {
      loading: () => <div className="text-white">Loading interactive content...</div>
    }) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />

      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/resources">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

          {/* Header Image */}
          {post.metadata.headerImage && (
            <BlogHeaderImage
              src={post.metadata.headerImage}
              alt={post.metadata.title}
            />
          )}

          {/* Article Header */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10 mb-8">
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {post.metadata.featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-400">
                    Featured
                  </Badge>
                )}
                <Badge
                  className={
                    post.metadata.type === "react"
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-green-500/20 text-green-400"
                  }
                >
                  {post.metadata.type === "react" ? "Interactive" : "Article"}
                </Badge>
                {post.metadata.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-white/20 text-white/70"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {post.metadata.title}
              </h1>

              <p className="text-xl text-gray-300 mb-6">
                {post.metadata.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-400">
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span className="whitespace-nowrap">
                      {new Date(post.metadata.date).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="whitespace-nowrap">
                      {post.metadata.readTime}
                    </span>
                  </div>
                  <div className="whitespace-nowrap">
                    By {post.metadata.author}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs mr-2 hidden sm:inline">Share:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white bg-white/5 hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => handleShare("linkedin")}
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white bg-white/5 hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => handleShare("copy")}
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Article Content */}
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8">
              {post.metadata.type === 'react' && ReactComponent ? (
                <Suspense fallback={<div className="text-white">Loading interactive content...</div>}>
                  <ReactComponent />
                </Suspense>
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkToc]}
                    rehypePlugins={[rehypeHighlight, rehypeSlug]}
                    components={{
                      img: ({ src, alt, ...props }) => {
                        if (!src) {
                          return null
                        }
                        return (
                          <BlogImage
                            src={src}
                            alt={alt || ''}
                            className="my-6"
                          />
                        )
                      }
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Opt-in */}
          <div className="py-8">
            <EmailOptIn
              title="Get More Like This"
              description="Follow along as I build and share what I learn"
              className="mt-8"
            />
          </div>

          {/* Footer */}
          <div className="py-8 text-center">
            <Separator className="bg-white/20 mb-8" />
            <p className="text-gray-400 mb-4">
              Found this helpful? Share it with your network!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                onClick={() => handleShare("linkedin")}
              >
                <Linkedin className="mr-2 w-4 h-4" />
                <span>Share on LinkedIn</span>
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                onClick={() => handleShare("copy")}
              >
                <Copy className="mr-2 w-4 h-4" />
                <span>Copy Link</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}