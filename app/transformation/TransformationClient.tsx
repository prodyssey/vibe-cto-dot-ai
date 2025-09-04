"use client";

import {
  Users,
  Cpu,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Star,
  Play,
  Volume2,
  VolumeX,
  FileText,
  Calendar,
} from "lucide-react";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/OptimizedImage";
import { addSavvyCalTracking } from "@/lib/analytics";
import { CostOfDelayCalculator } from "@/components/CostOfDelayCalculator";
import { EmailOptIn } from "@/components/EmailOptIn";
import { PostMetadata } from "@/lib/posts";
import { formatPostDate } from "@/lib/dateUtils";

interface TransformationClientProps {
  posts?: PostMetadata[];
}

export function TransformationClient({ posts = [] }: TransformationClientProps) {
  const heroLinkRef = useRef<HTMLAnchorElement>(null);
  const bottomLinkRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (heroLinkRef.current) {
      addSavvyCalTracking(
        heroLinkRef.current,
        "transformation_hero_cta",
        "transformation_alignment"
      );
    }
    if (bottomLinkRef.current) {
      addSavvyCalTracking(
        bottomLinkRef.current,
        "transformation_bottom_cta",
        "transformation_alignment"
      );
    }

    // Show loading briefly, then clear it
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Very short timeout

    return () => {
      clearTimeout(timeoutId);
    };
  }, [hasError]);

  const handleVideoEnded = () => {
    setHasEnded(true);
  };

  const handleVideoError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const clearLoadingState = () => {
    setIsLoading(false);
  };

  const handleReplay = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setHasEnded(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current && !hasError) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVolumeChange = () => {
    if (videoRef.current) {
      setIsMuted(videoRef.current.muted);
    }
  };

  // Posts are now already filtered at build time
  const transformationCaseStudies = posts;

  const features = [
    {
      icon: Users,
      title: "Team Assessment & Discovery",
      description:
        "Deep dive into your team's current velocity and bottlenecks",
    },
    {
      icon: Cpu,
      title: "AI Enhancement",
      description:
        "Augment your team with AI agents configured for your organization and stack",
    },
    {
      icon: BarChart3,
      title: "Compounded Velocity",
      description:
        "Multiply your product development throughput with targeted AI workflows",
    },
    {
      icon: Shield,
      title: "Comprehensive Measurement",
      description: "Uncover bottlenecks and optimize for impact",
    },
  ];

  const benefits = [
    "3x Feature Velocity through AI-powered development",
    "75% Less Manual Work with intelligent automation",
    "10x Faster Innovation Cycles with continuous optimization",
    "50% Cost Reduction through efficiency gains",
    "Infinite Scaling Potential with elastic infrastructure",
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />

        <div className="pt-20">
          {/* Hero Section */}
          <section className="py-20 px-6">
            <div className="max-w-7xl mx-auto">
              {/* Video and Bullets Row */}
              <div className="grid lg:grid-cols-5 gap-12 items-center mb-16">
                {/* Text Content */}
                <div className="text-center order-2 lg:order-1 lg:col-span-3">
                  <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-purple-400" />
                      <span>AI-Powered</span>
                    </div>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                      Transformation
                    </span>
                  </h1>

                  <div className="mb-8">
                    <p className="text-2xl md:text-3xl text-gray-200 mb-6 font-medium leading-tight">
                      Augment your team with field-tested AI agent workflows
                    </p>

                    {/* Key credibility points */}
                    <div className="flex flex-col gap-4 justify-center mb-8 max-w-2xl mx-auto">
                      <div className="flex items-center text-gray-300 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-4 flex-shrink-0"></div>
                        <span className="text-lg font-medium">
                          20+ years product development experience
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                        <div className="w-3 h-3 bg-blue-400 rounded-full mr-4 flex-shrink-0"></div>
                        <span className="text-lg font-medium">
                          Enthusiastic AI tooling adopter since 2022
                        </span>
                      </div>
                      <div className="flex items-center text-gray-300 bg-white/5 backdrop-blur-sm rounded-lg p-4">
                        <div className="w-3 h-3 bg-purple-400 rounded-full mr-4 flex-shrink-0"></div>
                        <span className="text-lg font-medium">
                          6+ transformations - technology and business model
                        </span>
                      </div>
                    </div>

                    <p className="text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
                      I help companies apply proven AI tools and workflows to
                      <span className="text-white font-semibold">
                        {" "}
                        accelerate roadmaps and streamline operations.
                      </span>
                    </p>
                  </div>
                </div>

                {/* Video Section */}
                <div className="relative order-1 lg:order-2 lg:col-span-2 flex flex-col items-center">
                  <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden aspect-square max-w-sm w-full">
                    {/* Loading State */}
                    {isLoading && !hasError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-300 text-sm">
                            Loading video...
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Error State */}
                    {hasError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-3 text-center p-4">
                          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                            <span className="text-red-400 text-xl">!</span>
                          </div>
                          <div>
                            <p className="text-gray-300 text-sm mb-1">
                              Video unavailable
                            </p>
                            <p className="text-gray-400 text-xs">
                              Unable to load transformation video
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      playsInline
                      onEnded={handleVideoEnded}
                      onError={handleVideoError}
                      onLoadedMetadata={clearLoadingState}
                      onCanPlay={clearLoadingState}
                      onPlay={clearLoadingState}
                      onVolumeChange={handleVolumeChange}
                      preload="metadata"
                    >
                      <source
                        src="/VibeCTO-transformation.mp4"
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>

                    {/* Video Controls Overlay */}
                    {!hasError && !isLoading && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {hasEnded && (
                          <Button
                            onClick={handleReplay}
                            size="sm"
                            className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border-0 rounded-lg shadow-lg"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          onClick={toggleMute}
                          size="sm"
                          className="bg-black/70 backdrop-blur-sm hover:bg-black/90 text-white border-0 rounded-lg shadow-lg"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Video Caption */}
                  <p className="text-gray-400 text-sm italic mt-3 text-center">
                    I've loved transforming since the '80s
                  </p>
                </div>
              </div>

              {/* CTA Section - Centered Row */}
              <div className="text-center max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  {/* Enhanced CTA with urgency */}
                  <a
                    ref={heroLinkRef}
                    href="https://savvycal.com/craigsturgis/vibecto-transformation-alignment"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Get Your Custom AI Roadmap
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center gap-4 justify-center text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>30-min strategy call</span>
                  </div>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Zero commitment</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>Custom analysis</span>
                </div>

                {/* Secondary CTA - Email Signup */}
                <div className="mt-12">
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-4 mb-3">
                      <div className="h-px bg-gray-600/50 flex-1 max-w-20"></div>
                      <span className="text-gray-300 text-sm font-medium">
                        OR
                      </span>
                      <div className="h-px bg-gray-600/50 flex-1 max-w-20"></div>
                    </div>
                    <p className="text-gray-300 text-base font-medium mb-1">
                      Not ready for a call yet?
                    </p>
                    <p className="text-gray-400 text-sm">
                      Get weekly AI transformation updates delivered to your
                      inbox
                    </p>
                  </div>

                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-md mx-auto overflow-hidden">
                    <EmailOptIn
                      variant="minimal"
                      title="Get AI Transformation Updates"
                      description="Weekly updates on AI-powered development"
                      buttonText="Get Updates"
                      mobileButtonText="Get Updates"
                      source="transformation-hero"
                      tags={["transformation", "ai-development"]}
                      className="flex flex-col gap-3 min-w-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
                Client Success Stories
              </h2>

              <div className="bg-white/5 backdrop-blur-sm border-white/10 rounded-3xl p-8 md:p-12">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <blockquote className="text-gray-300 text-xl md:text-2xl mb-8 leading-relaxed">
                  "Craig helped us build a culture around AI-assisted
                  engineering. We've dramatically increased the pace of delivery
                  even with 1/3 the capacity we had in 2024."
                </blockquote>

                <div className="text-center">
                  <div className="text-white font-semibold text-lg">
                    Jason Burchard
                  </div>
                  <div className="text-gray-400">
                    CEO,{" "}
                    <a
                      href="https://rootnote.co"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-purple-400 transition-colors"
                    >
                      Rootnote
                    </a>
                  </div>
                  <div className="mt-4">
                    <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium">
                      Transformation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Your Evolution Awaits
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Integrate field-tested approaches to applying AI agents to
                  your existing workflows.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl">
                          <feature.icon className="w-8 h-8 text-purple-400" />
                        </div>
                      </div>
                      <CardTitle className="text-white text-lg">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 text-center">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Cost of Delay Calculator Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Calculate Your Transformation Impact
                </h2>
                <p className="text-lg text-gray-300">
                  See the financial impact of accelerating your development
                  timeline
                </p>
              </div>

              <CostOfDelayCalculator
                showByDefault={true}
                defaultTimeReduction={15}
                initialInitiatives={[
                  {
                    id: "1",
                    name: "AI-Powered Feature Development",
                    monthlyValue: 100000,
                    currentTimeMonths: 9,
                  },
                  {
                    id: "2",
                    name: "New Product Line Launch",
                    monthlyValue: 300000,
                    currentTimeMonths: 6,
                  },
                  {
                    id: "3",
                    name: "Platform Modernization",
                    monthlyValue: 200000,
                    currentTimeMonths: 12,
                  },
                ]}
              />
            </div>
          </section>

          {/* Process Section */}
          <section className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  The Transformation Process
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  See how we accelerate your team with AI-powered innovation.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      Team Assessment & Discovery
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 1-2</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Deep dive into your team's current velocity and
                      bottlenecks. Current development workflow analysis and AI
                      readiness evaluation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">2</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      AI Agent Implementation
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 3-4</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Targeted initial deployment of AI agent workflows tailored
                      to your organization and stack. Custom configuration with
                      pilot project execution.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-xl">3</span>
                    </div>
                    <CardTitle className="text-white text-xl">
                      Scale & Optimize
                    </CardTitle>
                    <p className="text-sm text-purple-400 mt-1">Weeks 4-12+</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300">
                      Scale AI adoption across your entire product development
                      org. Process optimization with ongoing support &
                      refinement.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Case Studies Section */}
          {transformationCaseStudies.length > 0 && (
            <section className="py-20 px-6">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Transformation Case Studies
                  </h2>
                  <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                    Real stories from successful AI-powered transformations
                  </p>
                </div>

                <div className={`grid gap-8 ${
                  transformationCaseStudies.length === 1 
                    ? 'grid-cols-1 max-w-md mx-auto' 
                    : transformationCaseStudies.length === 2 
                      ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' 
                      : 'md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {transformationCaseStudies.map((post) => (
                    <Link key={post.slug} href={`/resources/${post.slug}`}>
                      <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 group cursor-pointer h-full overflow-hidden">
                        {post.headerImage && (
                          <div className="relative h-48 w-full">
                            <OptimizedImage
                              src={post.headerImage}
                              alt={post.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                              <FileText className="w-5 h-5 text-purple-400" />
                            </div>
                            <Badge className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-300/30">
                              Case Study
                            </Badge>
                          </div>

                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                            {post.title}
                          </h3>

                          <p className="text-gray-300 mb-4 leading-relaxed">
                            {post.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatPostDate(post.date)}
                            </div>
                            <span>{post.readTime}</span>
                          </div>

                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {post.tags
                                .filter((tag) => ["transformation", "case-study", "augmented-engineering"].includes(tag))
                                .slice(0, 3)
                                .map((tag) => (
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
                  ))}
                </div>

                {/* Call to action to view more resources */}
                <div className="text-center mt-12">
                  <Link href="/resources">
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                    >
                      View All Resources
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="py-20 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-6 sm:p-8 md:p-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to become AI-native?
                </h2>

                <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                  Join the teams who've successfully transformed their product
                  development with AI agents.
                </p>

                <a
                  ref={bottomLinkRef}
                  href="https://savvycal.com/craigsturgis/vibecto-transformation-alignment"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full max-w-md mx-auto"
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-12 py-6 text-lg sm:text-xl font-semibold rounded-xl w-full hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300"
                  >
                    <span className="sm:hidden">Book Strategy Call</span>
                    <span className="hidden sm:inline">
                      Schedule Your Strategy Call
                    </span>
                    <Sparkles className="ml-2 sm:ml-3 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  </Button>
                </a>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mt-6 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>30-minute consultation</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span>Custom roadmap</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
                  <div className="flex items-center gap-2">
                    <span>ROI analysis</span>
                  </div>
                </div>

                {/* Alternative Email Signup */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <div className="text-center mb-6">
                    <p className="text-gray-300 text-base font-medium mb-2">
                      Prefer to start with updates?
                    </p>
                    <p className="text-gray-400 text-sm max-w-md mx-auto">
                      Get weekly AI transformation strategies and case studies
                      from successful implementations
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 max-w-lg mx-auto w-full overflow-hidden">
                    <EmailOptIn
                      variant="minimal"
                      title="AI Transformation Weekly"
                      description="Practical updates from 20+ years of product development"
                      buttonText="Get Weekly Updates"
                      mobileButtonText="Get Updates"
                      source="transformation-bottom-cta"
                      tags={["transformation", "ai-development", "bottom-cta"]}
                      className="flex flex-col gap-3 min-w-0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
