import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

import { useGameStore } from "./gameStore";
import type { GameProgress, ServicePath } from "./types";

export const RETRO_NAMES = [
  "PixelMaster",
  "ByteBlade",
  "CodeCrusher",
  "DataDragon",
  "VibeViper",
  "TechTitan",
  "CyberSage",
  "QuantumQuest",
  "NeonNinja",
  "DigitalDuke",
  "ChipChampion",
  "ByteBoss",
  "PixelPilot",
  "CodeCommander",
  "DataDiver",
  "VibeViking",
  "TechTiger",
  "CyberCaptain",
  "QuantumKnight",
  "NeonNomad",
];

export const generateRandomName = (): string => {
  return RETRO_NAMES[Math.floor(Math.random() * RETRO_NAMES.length)];
};

// Helper function to set session context for RLS policies
const setSessionContext = async (sessionId: string): Promise<void> => {
  try {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_session_id',
      setting_value: sessionId,
      is_local: false
    });
  } catch (error) {
    console.warn("Failed to set session context:", error);
  }
};

export const saveGameProgress = async (
  progress: GameProgress
): Promise<void> => {
  try {
    // Skip database operations if Supabase is not properly configured
    if (!supabase) {
      logger.log("Supabase client not available, skipping game progress save");
      return;
    }

    console.log("Attempting to save game progress for session:", progress.sessionId);
    
    // Set session context for RLS policies
    await setSessionContext(progress.sessionId);
    
    const gameState = useGameStore.getState();
    
    // Use minimal data that should work with any schema version, with timeout
    const dbOperation = Promise.race([
      supabase.from("adventure_sessions").upsert({
        id: progress.sessionId,
        player_name: progress.playerName,
        // Only include fields that are likely to exist in the database
        ...(progress.currentSceneId && { current_scene_id: progress.currentSceneId }),
        ...(progress.visitedScenes && { visited_scenes: progress.visitedScenes }),
        ...(progress.choices && { choices: progress.choices }),
        ...(progress.finalPath && { final_path: progress.finalPath }),
        ...(progress.completedAt && { completed_at: progress.completedAt }),
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);

    const { error } = await dbOperation;

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error saving game progress:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      status: (error as any)?.status,
      statusText: (error as any)?.statusText,
      hint: (error as any)?.hint,
      details: (error as any)?.details,
      full_error: error
    });
  }
};

export const saveSceneVisit = async (
  sessionId: string,
  sceneId: string,
  visitCount: number
): Promise<void> => {
  try {
    if (!supabase) {
      logger.log("Supabase client not available, skipping scene visit save");
      return;
    }

    // Set session context for RLS policies
    await setSessionContext(sessionId);

    // First ensure the session record exists by checking if it's in the database
    console.log("Checking if session exists:", sessionId);
    const { data: sessionExists, error: checkError } = await supabase
      .from("adventure_sessions")
      .select("id")
      .eq("id", sessionId)
      .maybeSingle();

    console.log("Session check result:", { sessionExists, checkError });

    if (!sessionExists) {
      console.log("Session doesn't exist, creating it first");
      // If session doesn't exist, create it first
      const gameState = useGameStore.getState();
      const sessionProgress = {
        sessionId: sessionId,
        playerName: gameState.playerName,
        currentSceneId: gameState.currentSceneId,
        visitedScenes: gameState.visitedScenes,
        choices: gameState.choices,
        finalPath: gameState.finalPath || undefined,
        completedAt: undefined,
        discoveredPaths: Array.from(gameState.discoveredPaths),
        unlockedContent: gameState.unlockedContent,
        preferences: gameState.preferences,
      };
      
      // Create session first
      await saveGameProgress(sessionProgress);
      console.log("Session created, now proceeding with scene visit");
    } else {
      console.log("Session exists, proceeding with scene visit");
    }

    // Now save the scene visit with timeout
    console.log("Attempting to save scene visit:", { sessionId, sceneId, visitCount });
    const dbOperation = Promise.race([
      supabase.from("adventure_scene_visits").upsert({
        session_id: sessionId,
        scene_id: sceneId,
        visit_count: visitCount,
        last_visited_at: new Date().toISOString(),
      }),
      new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Database timeout')), 5000)
      )
    ]);
    
    const { data, error } = await dbOperation;

    console.log("Scene visit save result:", { data, error });
    
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error saving scene visit:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      status: (error as any)?.status,
      hint: (error as any)?.hint,
      details: (error as any)?.details,
      full_error: error
    });
  }
};

export const saveChoice = async (
  sessionId: string,
  sceneId: string,
  choiceId: string,
  choiceText: string
): Promise<void> => {
  try {
    if (!supabase) {
      logger.log("Supabase client not available, skipping choice save");
      return;
    }

    // Set session context for RLS policies
    await setSessionContext(sessionId);

    const { error } = await supabase.from("adventure_choices").insert({
      session_id: sessionId,
      // New schema fields
      scene_id: sceneId,
      choice_id: choiceId,
      made_at: new Date().toISOString(),
      // Old schema fields (required NOT NULL columns)
      question_number: 1, // Default value for backward compatibility
      question_text: `Choice made in scene: ${sceneId}`,
      choice_text: choiceText,
      choice_value: choiceId,
      answered_at: new Date().toISOString(),
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error saving choice:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      hint: (error as any)?.hint,
      details: (error as any)?.details,
      full_error: error
    });
  }
};

export const getPathInfo = (path: ServicePath) => {
  switch (path) {
    case "ignition":
      return {
        title: "Ignition Path",
        description:
          "Perfect for getting your idea to a working prototype fast. Benefit from years of experience going from 0 to 1.",
        features: [
          "Discovery workshops",
          "Rapid prototype development",
          "Assumption testing guidance",
        ],
        color: "from-orange-600 to-red-600",
      };
    case "launch_control":
      return {
        title: "Launch Control Path",
        description:
          "Scale your prototype into a production-ready system with fractional CTO guidance.",
        features: [
          "Architecture & scaling strategy",
          "Security & compliance",
          "Team & process optimization",
        ],
        color: "from-blue-600 to-cyan-600",
      };
    case "transformation":
      return {
        title: "Transformation Path",
        description:
          "Transform your team's velocity with AI agents. Ship features faster while maintaining quality.",
        features: [
          "AI agent integration",
          "Team transformation",
          "Enterprise support",
        ],
        color: "from-purple-600 to-indigo-600",
      };
  }
};

export const loadGameProgress = async (
  sessionId: string
): Promise<GameProgress | null> => {
  try {
    if (!supabase) {
      logger.log("Supabase client not available, skipping game progress load");
      return null;
    }

    // Set session context for RLS policies
    await setSessionContext(sessionId);

    const { data, error } = await supabase
      .from("adventure_sessions")
      .select(`
        id,
        player_name,
        is_generated_name,
        current_scene_id,
        visited_scenes,
        choices,
        path_scores,
        final_path,
        discovered_paths,
        unlocked_content,
        preferences,
        completion_status,
        created_at,
        updated_at
      `)
      .eq("id", sessionId)
      .single();

    if (error) {
      throw error;
    }
    if (!data) {
      return null;
    }

    return {
      sessionId: (data as any).id,
      playerName: (data as any).player_name,
      currentSceneId: (data as any).current_scene_id || "entry",
      visitedScenes: (data as any).visited_scenes || {},
      choices: (data as any).choices || [],
      finalPath: (data as any).final_path,
      completedAt: (data as any).completed_at,
      discoveredPaths: (data as any).discovered_paths || [],
      unlockedContent: (data as any).unlocked_content || [],
      preferences: (data as any).preferences,
    };
  } catch (error) {
    logger.error("Error loading game progress:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      hint: (error as any)?.hint,
    });
    return null;
  }
};

export const clearGameProgress = async (sessionId: string): Promise<void> => {
  try {
    if (!supabase) {
      logger.log("Supabase client not available, skipping game progress clear");
      return;
    }

    // Set session context for RLS policies
    await setSessionContext(sessionId);

    const { error } = await supabase
      .from("adventure_sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      throw error;
    }
  } catch (error) {
    logger.error("Error clearing game progress:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      hint: (error as any)?.hint,
    });
  }
};
