import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Goal {
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

export const GOALS: Goal[] = [
  {
    id: "transformation",
    path: "/transformation",
    label: "AI Transformation",
    icon: Sparkles,
    description: "Accelerate your roadmap with AI tool adoption",
    shortDescription:
      "✨ We're well on our way - but want help to go further, faster",
    subtitle: "For Series A, B+, and Growth Equity companies",
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
    order: 1,
    problemPromise: {
      heading: "Established company / product?",
      description:
        "Racing the competition to adopt AI more effectively? Get expert help to adopt the latest in AI tools and processes throughout your whole lifecycle.",
      features: [
        "Hands-on AI agent integration",
        "Sophisticated measurement",
        "Experienced support",
      ],
      borderColor: "border-purple-500/30 hover:border-purple-400/50",
      shadowColor: "hover:shadow-purple-500/20",
      iconBgColor: "bg-purple-500/20",
      iconColor: "text-purple-400",
      dotColor: "bg-purple-400",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  },
];

export const getOrderedGoals = () => {
  return [...GOALS].sort((a, b) => a.order - b.order);
};

export const getGoalById = (id: string) => {
  return GOALS.find((goal) => goal.id === id);
};

export const getGoalByPath = (path: string) => {
  return GOALS.find((goal) => goal.path === path);
};