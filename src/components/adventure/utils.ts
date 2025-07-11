import { supabase } from '@/integrations/supabase/client';
import type { GameProgress, ServicePath } from './types';

export const RETRO_NAMES = [
  'PixelMaster', 'ByteBlade', 'CodeCrusher', 'DataDragon', 'VibeViper',
  'TechTitan', 'CyberSage', 'QuantumQuest', 'NeonNinja', 'DigitalDuke',
  'ChipChampion', 'ByteBoss', 'PixelPilot', 'CodeCommander', 'DataDiver',
  'VibeViking', 'TechTiger', 'CyberCaptain', 'QuantumKnight', 'NeonNomad'
];

export const generateRandomName = (): string => {
  return RETRO_NAMES[Math.floor(Math.random() * RETRO_NAMES.length)];
};

export const saveGameProgress = async (progress: GameProgress): Promise<void> => {
  try {
    const { error } = await supabase
      .from('adventure_sessions')
      .upsert({
        id: progress.sessionId,
        player_name: progress.playerName,
        current_scene_id: progress.currentSceneId,
        visited_scenes: progress.visitedScenes,
        choices: progress.choices,
        final_path: progress.finalPath,
        completed_at: progress.completedAt,
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving game progress:', error);
  }
};

export const saveSceneVisit = async (
  sessionId: string,
  sceneId: string,
  visitCount: number
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('adventure_scene_visits')
      .upsert({
        session_id: sessionId,
        scene_id: sceneId,
        visit_count: visitCount,
        last_visited_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving scene visit:', error);
  }
};

export const saveChoice = async (
  sessionId: string,
  sceneId: string,
  choiceId: string,
  choiceText: string
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('adventure_choices')
      .insert({
        session_id: sessionId,
        scene_id: sceneId,
        choice_id: choiceId,
        choice_text: choiceText,
        made_at: new Date().toISOString(),
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving choice:', error);
  }
};

export const getPathInfo = (path: ServicePath) => {
  switch (path) {
    case 'ignition':
      return {
        title: 'Ignition Path',
        description: 'Perfect for getting your idea to a working prototype fast. Benefit from years of experience going from 0 to 1.',
        features: ['Discovery workshops', 'Rapid prototype development', 'Assumption testing guidance'],
        color: 'from-orange-600 to-red-600',
      };
    case 'launch_control':
      return {
        title: 'Launch Control Path',
        description: 'Scale your prototype into a production-ready system with fractional CTO guidance.',
        features: ['Architecture & scaling strategy', 'Security & compliance', 'Team & process optimization'],
        color: 'from-blue-600 to-cyan-600',
      };
    case 'interstellar':
      return {
        title: 'Interstellar Path',
        description: 'Transform your team\'s velocity with AI agents. Ship features 10x faster while maintaining quality.',
        features: ['AI agent integration', 'Team transformation', 'Enterprise support'],
        color: 'from-purple-600 to-indigo-600',
      };
  }
};