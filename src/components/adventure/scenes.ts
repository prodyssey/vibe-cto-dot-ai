import type { Scene } from "./types";

export const SCENES: Record<string, Scene> = {
  // Entry Screen - Space Station Arrival
  entry: {
    id: "entry",
    type: "intro",
    title: "Space Station Arrival",
    description:
      "Welcome to VibeCTO Station. Your vision is ready for phase transition. Which docking bay matches your current trajectory?",
    backgroundClass:
      "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    nextScene: "playerSetup",
  },

  // Player Name Setup
  playerSetup: {
    id: "playerSetup",
    type: "intro",
    title: "Pilot Registration",
    description:
      "Before you embark on your journey, we need to register you in the station logs.",
    backgroundClass:
      "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
    nextScene: "destinationSelection",
  },

  // Main Branch Selection - Three Paths (handled by BranchSelectionScreen component)
  destinationSelection: {
    id: "destinationSelection",
    type: "choice",
    title: "Choose Your Path",
    description:
      "Three paths lead to product success. Where are you in your journey?",
    backgroundClass:
      "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900",
  },

  // Ignition Path Detail
  ignitionDetail: {
    id: "ignitionDetail",
    type: "detail",
    title: "The Ignition Forge",
    description:
      "The Ignition Forge - where raw ideas transform into validated ventures. Here, we compress months of wandering into weeks of clarity.",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
    nextScene: "ignitionProcess",
  },

  // Launch Control Path Detail
  launchControlDetail: {
    id: "launchControlDetail",
    type: "detail",
    title: "Launch Control Center",
    description:
      "Welcome to Launch Control - where prototypes evolve into production-ready systems. Your trajectory to scale starts here.",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
    nextScene: "launchControlProcess",
  },

  // Transformation Path Detail
  transformationDetail: {
    id: "transformationDetail",
    type: "detail",
    title: "Transformation Command",
    description:
      "Transformation Command - where established ventures accelerate beyond conventional limits. Transform your velocity with AI-powered innovation.",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
    nextScene: "transformationProcess",
  },

  // Station Tour
  stationTour: {
    id: "stationTour",
    type: "choice",
    title: "Station Tour",
    description:
      "Welcome to the VibeCTO Station tour. What would you like to learn about?",
    backgroundClass:
      "bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900",
    choices: [
      {
        id: "learn-ignition",
        text: "Tell me about the Ignition Forge",
        nextScene: "ignitionDetail",
      },
      {
        id: "learn-launch",
        text: "Show me Launch Control",
        nextScene: "launchControlDetail",
      },
      {
        id: "learn-transformation",
        text: "Explore Transformation Command",
        nextScene: "transformationDetail",
      },
      {
        id: "back-to-paths",
        text: "Return to path selection",
        nextScene: "destinationSelection",
      },
    ],
  },

  // Process scenes (placeholders for now)
  ignitionProcess: {
    id: "ignitionProcess",
    type: "result",
    title: "Ignition Process",
    description:
      "Ready to transform your idea into reality with our 2-4 week intensive jumpstart.",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionBudget: {
    id: "ignitionBudget",
    type: "choice",
    title: "Investment Check",
    description: "Let's ensure we're aligned on the investment required",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionRateReduction: {
    id: "ignitionRateReduction",
    type: "choice",
    title: "Rate Reduction Opportunity",
    description:
      "You may qualify for our reduced rate program. Let's learn more about your situation.",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionQualification: {
    id: "ignitionQualification",
    type: "choice",
    title: "Qualification Check",
    description: "Let's make sure we're a great fit for each other",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionFinal: {
    id: "ignitionFinal",
    type: "result",
    title: "Welcome to the Forge!",
    description: "You're ready to transform your idea into reality",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionAlternatives: {
    id: "ignitionAlternatives",
    type: "choice",
    title: "Alternative Paths",
    description: "Let's find the right path for your current situation",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
  },

  ignitionPaymentInfo: {
    id: "ignitionPaymentInfo",
    type: "detail",
    title: "Payment Options",
    description: "Flexible payment plans to match your needs",
    backgroundClass:
      "bg-gradient-to-br from-orange-900 via-red-900 to-slate-900",
    nextScene: "ignitionQualification",
  },

  launchControlBudget: {
    id: "launchControlBudget",
    type: "choice",
    title: "Investment Readiness",
    description:
      "Let's discuss your investment capacity for scaling transformation",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlProcess: {
    id: "launchControlProcess",
    type: "detail",
    title: "Launch Control Process",
    description: "Ready to scale your prototype with fractional CTO guidance.",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
    nextScene: "launchControlBudget",
  },

  launchControlRateReduction: {
    id: "launchControlRateReduction",
    type: "choice",
    title: "Rate Reduction Opportunity",
    description: "You may qualify for our reduced rate program",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlQualification: {
    id: "launchControlQualification",
    type: "choice",
    title: "Launch Control Qualification",
    description: "Are you ready for launch?",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlAlternatives: {
    id: "launchControlAlternatives",
    type: "choice",
    title: "Alternative Paths",
    description: "Let's find the right resources for your current stage",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlWaitlist: {
    id: "launchControlWaitlist",
    type: "detail",
    title: "Join the Waitlist",
    description: "Reserve your spot for when Launch Control capacity opens up",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlTestimonials: {
    id: "launchControlTestimonials",
    type: "detail",
    title: "Mission Success Stories",
    description: "See how we've helped other startups achieve orbit",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlApplication: {
    id: "launchControlApplication",
    type: "choice",
    title: "Pre-Launch Assessment",
    description: "Let's ensure we're ready for liftoff together",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  launchControlFinal: {
    id: "launchControlFinal",
    type: "result",
    title: "Ready for Launch!",
    description: "Your scaling journey begins now",
    backgroundClass:
      "bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900",
  },

  transformationProcess: {
    id: "transformationProcess",
    type: "detail",
    title: "The Transformation Process",
    description:
      "See how we accelerate your team with AI-powered transformation.",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
    nextScene: "transformationInvestment",
  },

  transformationInvestment: {
    id: "transformationInvestment",
    type: "detail",
    title: "Investment Overview",
    description: "Understanding the investment in your team's acceleration",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
    nextScene: "transformationFinal",
  },

  transformationAlignment: {
    id: "transformationAlignment",
    type: "choice",
    title: "Schedule Alignment Call",
    description: "Let's discuss how we can accelerate your team's velocity",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
  },

  transformationAlternatives: {
    id: "transformationAlternatives",
    type: "choice",
    title: "Alternative Paths",
    description: "Let's find the right solution for your current stage",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
  },

  transformationFinal: {
    id: "transformationFinal",
    type: "result",
    title: "Welcome to Warp Speed!",
    description: "Your acceleration journey begins now",
    backgroundClass:
      "bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900",
  },
};

export const getScene = (sceneId: string): Scene | undefined => {
  return SCENES[sceneId];
};
