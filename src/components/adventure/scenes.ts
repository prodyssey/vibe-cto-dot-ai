import type { Scene } from './types';

export const SCENES: Record<string, Scene> = {
  // Entry Screen - Space Station Arrival
  entry: {
    id: 'entry',
    type: 'intro',
    title: 'Space Station Arrival',
    description: 'Welcome to VibeCTO Station. Your vision is ready for phase transition. Which docking bay matches your current trajectory?',
    backgroundClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    nextScene: 'playerSetup',
  },

  // Player Name Setup
  playerSetup: {
    id: 'playerSetup',
    type: 'intro',
    title: 'Pilot Registration',
    description: 'Before you embark on your journey, we need to register you in the station logs.',
    backgroundClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    nextScene: 'destinationSelection',
  },

  // Main Branch Selection - Three Paths (handled by BranchSelectionScreen component)
  destinationSelection: {
    id: 'destinationSelection',
    type: 'choice',
    title: 'Choose Your Path',
    description: 'Three paths lead to product success. Where are you in your journey?',
    backgroundClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
  },

  // Ignition Path Detail
  ignitionDetail: {
    id: 'ignitionDetail',
    type: 'detail',
    title: 'The Ignition Forge',
    description: 'The Ignition Forge - where raw ideas transform into validated ventures. Here, we compress months of wandering into weeks of clarity.',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
    nextScene: 'ignitionProcess',
  },

  // Launch Control Path Detail
  launchControlDetail: {
    id: 'launchControlDetail',
    type: 'detail',
    title: 'Launch Control Center',
    description: 'Welcome to Launch Control - where prototypes evolve into production-ready systems. Your trajectory to scale starts here.',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
    nextScene: 'launchControlProcess',
  },

  // Interstellar Path Detail
  interstellarDetail: {
    id: 'interstellarDetail',
    type: 'detail',
    title: 'Interstellar Command',
    description: 'Interstellar Command - where established ventures accelerate beyond conventional limits. Transform your velocity with AI-powered innovation.',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
    nextScene: 'interstellarCapabilities',
  },

  // Station Tour
  stationTour: {
    id: 'stationTour',
    type: 'choice',
    title: 'Station Tour',
    description: 'Welcome to the VibeCTO Station tour. What would you like to learn about?',
    backgroundClass: 'bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900',
    choices: [
      {
        id: 'learn-ignition',
        text: 'Tell me about the Ignition Forge',
        nextScene: 'ignitionDetail',
      },
      {
        id: 'learn-launch',
        text: 'Show me Launch Control',
        nextScene: 'launchControlDetail',
      },
      {
        id: 'learn-interstellar',
        text: 'Explore Interstellar Command',
        nextScene: 'interstellarDetail',
      },
      {
        id: 'back-to-paths',
        text: 'Return to path selection',
        nextScene: 'destinationSelection',
      },
    ],
  },

  // Process scenes (placeholders for now)
  ignitionProcess: {
    id: 'ignitionProcess',
    type: 'result',
    title: 'Ignition Process',
    description: 'Ready to transform your idea into reality with our 2-4 week intensive jumpstart.',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionBudget: {
    id: 'ignitionBudget',
    type: 'choice',
    title: 'Investment Check',
    description: 'Let\'s ensure we\'re aligned on the investment required',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionRateReduction: {
    id: 'ignitionRateReduction',
    type: 'choice',
    title: 'Rate Reduction Opportunity',
    description: 'You may qualify for our reduced rate program. Let\'s learn more about your situation.',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionQualification: {
    id: 'ignitionQualification',
    type: 'choice',
    title: 'Qualification Check',
    description: 'Let\'s make sure we\'re a great fit for each other',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionFinal: {
    id: 'ignitionFinal',
    type: 'result',
    title: 'Welcome to the Forge!',
    description: 'You\'re ready to transform your idea into reality',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionAlternatives: {
    id: 'ignitionAlternatives',
    type: 'choice',
    title: 'Alternative Paths',
    description: 'Let\'s find the right path for your current situation',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
  },

  ignitionPaymentInfo: {
    id: 'ignitionPaymentInfo',
    type: 'detail',
    title: 'Payment Options',
    description: 'Flexible payment plans to match your needs',
    backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
    nextScene: 'ignitionQualification',
  },

  launchControlBudget: {
    id: 'launchControlBudget',
    type: 'choice',
    title: 'Investment Readiness',
    description: 'Let\'s discuss your investment capacity for scaling transformation',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlProcess: {
    id: 'launchControlProcess',
    type: 'detail',
    title: 'Launch Control Process',
    description: 'Ready to scale your prototype with fractional CTO guidance.',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
    nextScene: 'launchControlBudget',
  },

  launchControlRateReduction: {
    id: 'launchControlRateReduction',
    type: 'choice',
    title: 'Rate Reduction Opportunity',
    description: 'You may qualify for our reduced rate program',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlQualification: {
    id: 'launchControlQualification',
    type: 'choice',
    title: 'Readiness Assessment',
    description: 'Let\'s ensure Launch Control is the right fit for your scaling needs',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlAlternatives: {
    id: 'launchControlAlternatives',
    type: 'choice',
    title: 'Alternative Paths',
    description: 'Let\'s find the right resources for your current stage',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlWaitlist: {
    id: 'launchControlWaitlist',
    type: 'detail',
    title: 'Join the Waitlist',
    description: 'Reserve your spot for when Launch Control capacity opens up',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlTimeline: {
    id: 'launchControlTimeline',
    type: 'choice',
    title: 'Engagement Timeline',
    description: 'Choose the support level that matches your growth trajectory',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlTestimonials: {
    id: 'launchControlTestimonials',
    type: 'detail',
    title: 'Mission Success Stories',
    description: 'See how we\'ve helped other startups achieve orbit',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlApplication: {
    id: 'launchControlApplication',
    type: 'choice',
    title: 'Pre-Launch Assessment',
    description: 'Let\'s ensure we\'re ready for liftoff together',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  launchControlFinal: {
    id: 'launchControlFinal',
    type: 'result',
    title: 'Ready for Launch!',
    description: 'Your scaling journey begins now',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  interstellarProcess: {
    id: 'interstellarProcess',
    type: 'result',
    title: 'Interstellar Process',
    description: 'Ready to accelerate your team with AI-powered transformation.',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarCapabilities: {
    id: 'interstellarCapabilities',
    type: 'detail',
    title: 'Advanced Capabilities',
    description: 'Explore our enterprise-grade acceleration services',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarEngagement: {
    id: 'interstellarEngagement',
    type: 'choice',
    title: 'Engagement Model',
    description: 'Choose how we can best accelerate your journey',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarFeatures: {
    id: 'interstellarFeatures',
    type: 'detail',
    title: 'AI-Powered Features',
    description: 'See how AI transforms your development velocity',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarPartnership: {
    id: 'interstellarPartnership',
    type: 'choice',
    title: 'Partnership Options',
    description: 'Select the partnership model that aligns with your goals',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarContact: {
    id: 'interstellarContact',
    type: 'choice',
    title: 'Connect with Command',
    description: 'Ready to explore the possibilities?',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },

  interstellarFinal: {
    id: 'interstellarFinal',
    type: 'result',
    title: 'Welcome to Warp Speed!',
    description: 'Your acceleration journey begins now',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },
};

export const getScene = (sceneId: string): Scene | undefined => {
  return SCENES[sceneId];
};