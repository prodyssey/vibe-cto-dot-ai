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
    nextScene: 'interstellarProcess',
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

  launchControlProcess: {
    id: 'launchControlProcess',
    type: 'result',
    title: 'Launch Control Process',
    description: 'Ready to scale your prototype with fractional CTO guidance.',
    backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
  },

  interstellarProcess: {
    id: 'interstellarProcess',
    type: 'result',
    title: 'Interstellar Process',
    description: 'Ready to accelerate your team with AI-powered transformation.',
    backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
  },
};

export const getScene = (sceneId: string): Scene | undefined => {
  return SCENES[sceneId];
};