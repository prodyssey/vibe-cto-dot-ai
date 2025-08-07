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
}

export const SERVICES: Service[] = [
  {
    id: "transformation",
    path: "/transformation",
    label: "Transformation",
    icon: Sparkles,
    description: "Accelerate product velocity with AI tools",
    shortDescription:
      "✨ We're well on our way - but want help to go further, faster",
    subtitle:
      "For established teams that want to build quality products much faster",
    longDescription:
      "Transform your team's development velocity with enterprise-grade AI agent integration.",
    features: [
      "Team transformation",
      "AI agent deployment",
      "Sophisticated measurement",
      "Enterprise support",
    ],
    cta: "Schedule Team Call",
    link: "/transformation",
    color: "from-purple-600 to-blue-600",
    glowColor: "shadow-purple-500/50",
    adventureSceneId: "transformation-path",
    adventureNextScene: "transformationDetail",
    pathWeight: {
      ignition: 0,
      launch_control: 0,
      transformation: 3,
    },
    order: 3,
  },
  {
    id: "ignition",
    path: "/ignition",
    label: "Ignition",
    icon: Zap,
    description: "Jump start your vibe coded prototype",
    shortDescription:
      "🔥 I have an idea I believe in - but need help getting started",
    subtitle:
      "For founders with ideas who want to test them quickly and intelligently",
    longDescription:
      "Compress months of wandering into weeks of clarity. Get a working MVP + validation framework from an expert 0 to 1 builder in just 2-4 weeks.",
    features: [
      "2-4 hour intensive discovery",
      "Rapid MVP development",
      "Tech stack selection",
      "Assumption testing & iteration",
    ],
    cta: "Build My Idea",
    link: "https://savvycal.com/craigsturgis/vibecto-clarity-call",
    isExternal: true,
    color: "from-yellow-600 to-orange-600",
    glowColor: "shadow-orange-500/50",
    adventureSceneId: "ignition-path",
    adventureNextScene: "ignitionDetail",
    pathWeight: {
      ignition: 3,
      launch_control: 0,
      transformation: 0,
    },
    order: 1,
  },
  {
    id: "launch-control",
    path: "/launch-control",
    label: "Launch Control",
    icon: Rocket,
    description: "Vibe code to production product",
    shortDescription:
      "🚀 I've got a real vibe coded prototype with traction - ready to gear up for scale",
    subtitle:
      "Mission Command - where successful prototypes achieve escape velocity",
    longDescription:
      "Your vibe coded product has achieved liftoff. Get the technical infrastructure and strategic guidance to scale into a market-capturing product.",
    features: [
      "6-12+ week transformation",
      "Performance optimization",
      "Team augmentation",
      "Fractional CTO/CPO support",
    ],
    cta: "Explore Mission Parameters",
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
    order: 2,
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
