import { Sparkles, Zap, Rocket } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Service {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  description: string;
  shortDescription: string;
  subtitle: string;
  longDescription: string;
  features: string[];
  cta: string;
  link: string;
  isExternal?: boolean;
  color: string;
  glowColor: string;
  adventureSceneId: string;
  adventureNextScene: string;
  pathWeight: {
    ignition: number;
    launch_control: number;
    transformation: number;
  };
  order: number;
  // ProblemPromise component specific styling
  problemPromise: {
    heading: string;
    description: string;
    features: string[];
    borderColor: string;
    shadowColor: string;
    iconBgColor: string;
    iconColor: string;
    dotColor: string;
    buttonColor: string;
  };
}

export const SERVICES: Service[] = [
  {
    id: "ai-product-lifecycle-sprint",
    path: "/ai-product-lifecycle-sprint",
    label: "AI Product Lifecycle Sprint",
    icon: Sparkles,
    description: "4-week focused process to start or accelerate your AI journey",
    shortDescription:
      "✨ A structured 4-week engagement to transform your product development",
    subtitle: "For companies ready to build effectively with AI",
    longDescription:
      "A focused 4-week process to start or focus your AI product lifecycle journey, see quick results with a pilot project, and align on opportunities and measurement of success.",
    features: [
      "4 weeks of live and async work with Craig",
      "Custom AI Agent Configuration Blueprint",
      "Pilot Project Coaching + Execution",
      "Performance Monitoring Setup",
      "Access to best practices database",
    ],
    cta: "Reserve Your Sprint",
    link: "/ai-product-lifecycle-sprint",
    color: "from-blue-600 to-purple-600",
    glowColor: "shadow-blue-500/50",
    adventureSceneId: "transformation-path",
    adventureNextScene: "transformationDetail",
    pathWeight: {
      ignition: 0,
      launch_control: 0,
      transformation: 3,
    },
    order: 1,
    problemPromise: {
      heading: "Ready to build effectively with AI?",
      description:
        "Get focused guidance to adopt the right AI workflows and see quick results through a structured 4-week engagement.",
      features: [
        "Custom AI agent configuration",
        "Pilot project execution",
        "Performance monitoring setup",
      ],
      borderColor: "border-blue-500/30 hover:border-blue-400/50",
      shadowColor: "hover:shadow-blue-500/20",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      dotColor: "bg-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  },
  {
    id: "ignition",
    path: "/ignition",
    label: "Ignition",
    icon: Zap,
    description: "Jump start your vibe coded prototype",
    shortDescription:
      "🔥 I have an idea I believe in - but need help getting started",
    subtitle: "For builders with vibe code ready ideas who are having trouble getting to something testable",
    longDescription:
      "Compress months of wandering into weeks of clarity. Get a working MVP + validation framework from an expert 0 to 1 builder in just 2-4 weeks.",
    features: [
      "2-4 hour intensive discovery",
      "Rapid MVP development",
      "Tech stack selection",
      "Assumption testing & iteration",
    ],
    cta: "Build My Idea",
    link: "/ignition",
    isExternal: false,
    color: "from-yellow-600 to-orange-600",
    glowColor: "shadow-orange-500/50",
    adventureSceneId: "ignition-path",
    adventureNextScene: "ignitionDetail",
    pathWeight: {
      ignition: 3,
      launch_control: 0,
      transformation: 0,
    },
    order: 2,
    problemPromise: {
      heading: "Trouble getting off the ground?",
      description:
        "I'll work with you to get your idea to a working vibe coded prototype fast. Benefit from years of experience going from 0 to 1. Test and iterate from a good foundation.",
      features: [
        "Discovery workshops",
        "A rapid prototype you can build on",
        "Assumption testing guidance",
      ],
      borderColor: "border-green-500/30 hover:border-green-400/50",
      shadowColor: "hover:shadow-green-500/20",
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-400",
      dotColor: "bg-green-400",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
  },
  {
    id: "launch-control",
    path: "/launch-control",
    label: "Launch Control",
    icon: Rocket,
    description: "Vibe code to production product",
    shortDescription:
      "🚀 I've got a real vibe coded prototype with traction - ready to gear up for scale",
    subtitle: "For vibe coding builders who need support to scale with confidence",
    longDescription:
      "Your vibe coded product has achieved liftoff. Get the technical infrastructure and strategic guidance to scale into a market-capturing product.",
    features: [
      "6-12+ week transformation",
      "Performance optimization",
      "Team augmentation",
      "Fractional CTO/CPO support",
    ],
    cta: "Get me ready to scale",
    link: "/launch-control",
    color: "from-blue-600 to-cyan-600",
    glowColor: "shadow-blue-500/50",
    adventureSceneId: "launch-control-path",
    adventureNextScene: "launchControlDetail",
    pathWeight: {
      ignition: 0,
      launch_control: 3,
      transformation: 0,
    },
    order: 3,
    problemPromise: {
      heading: "Vibe code hitting its limits?",
      description:
        "Scale your vibe-coded application into a production-ready system. Get experienced guidance to handle security, performance, and team growth.",
      features: [
        "Architecture & scaling strategy",
        "Security & compliance",
        "Team & process optimization",
      ],
      borderColor: "border-blue-500/30 hover:border-blue-400/50",
      shadowColor: "hover:shadow-blue-500/20",
      iconBgColor: "bg-blue-500/20",
      iconColor: "text-blue-400",
      dotColor: "bg-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
  },
];

export const getOrderedServices = () => {
  return [...SERVICES].sort((a, b) => a.order - b.order);
};

export const getServiceById = (id: string) => {
  return SERVICES.find((service) => service.id === id);
};

export const getServiceByPath = (path: string) => {
  return SERVICES.find((service) => service.path === path);
};
