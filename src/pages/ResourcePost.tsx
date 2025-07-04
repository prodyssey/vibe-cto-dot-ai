import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";
import { getPostBySlug, getReactComponent, Post } from "@/lib/content";
import { toast } from "sonner";
import { EmailOptIn } from "@/components/EmailOptIn";
import "highlight.js/styles/github-dark.css";

export default function ResourcePost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [ReactComponent, setReactComponent] =
    useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Post not found");
      setLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const postData = await getPostBySlug(slug);
        if (!postData) {
          setError("Post not found");
          return;
        }

        setPost(postData);

        if (postData.metadata.type === "react") {
          const component = await getReactComponent(slug);
          setReactComponent(() => component);
        }
      } catch (err) {
        console.error("Error loading post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  const sharePost = async (platform: "twitter" | "linkedin" | "copy") => {
    const url = window.location.href;
    const text = `Check out this article: ${post?.metadata.title}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          toast.success("Link copied to clipboard!");
        } catch (err) {
          toast.error("Failed to copy link");
        }
        break;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-white text-xl">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <Navigation />
        <div className="pt-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-300 mb-8">
              {error || "The requested post could not be found."}
            </p>
            <Link to="/resources">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Resources
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navigation />

      <div className="pt-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/resources">
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Resources
              </Button>
            </Link>
          </div>

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
                    onClick={() => sharePost("twitter")}
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white bg-white/5 hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => sharePost("linkedin")}
                    title="Share on LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white bg-white/5 hover:bg-white/10 h-8 w-8 p-0"
                    onClick={() => sharePost("copy")}
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
              {post.metadata.type === "react" && ReactComponent ? (
                <ReactComponent />
              ) : (
                <div className="markdown-content">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkToc]}
                    rehypePlugins={[rehypeHighlight, rehypeSlug]}
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
                onClick={() => sharePost("twitter")}
              >
                <Twitter className="mr-2 w-4 h-4" />
                <span>Share on Twitter</span>
              </Button>
              <Button
                variant="outline"
                className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                onClick={() => sharePost("linkedin")}
              >
                <Linkedin className="mr-2 w-4 h-4" />
                <span>Share on LinkedIn</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
