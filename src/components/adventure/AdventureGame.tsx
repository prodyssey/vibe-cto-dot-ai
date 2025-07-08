import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailOptIn } from "@/components/EmailOptIn";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Shuffle } from "lucide-react";

interface Question {
  id: number;
  text: string;
  choices: {
    text: string;
    value: string;
    pathWeight: {
      ignition: number;
      launch_control: number;
      interstellar: number;
    };
  }[];
}

const RETRO_NAMES = [
  "PixelMaster", "ByteBlade", "CodeCrusher", "DataDragon", "VibeViper",
  "TechTitan", "CyberSage", "QuantumQuest", "NeonNinja", "DigitalDuke",
  "ChipChampion", "ByteBoss", "PixelPilot", "CodeCommander", "DataDiver",
  "VibeViking", "TechTiger", "CyberCaptain", "QuantumKnight", "NeonNomad"
];

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "You're standing at the edge of a digital frontier. What's your biggest challenge right now?",
    choices: [
      {
        text: "I have an idea but need to turn it into reality fast",
        value: "idea_to_reality",
        pathWeight: { ignition: 3, launch_control: 1, interstellar: 0 }
      },
      {
        text: "My prototype is working but hitting technical limits",
        value: "scaling_prototype",
        pathWeight: { ignition: 0, launch_control: 3, interstellar: 1 }
      },
      {
        text: "I need my team to ship features 10x faster",
        value: "team_velocity",
        pathWeight: { ignition: 0, launch_control: 1, interstellar: 3 }
      }
    ]
  },
  {
    id: 2,
    text: "What keeps you up at night?",
    choices: [
      {
        text: "Will this idea actually work in the real world?",
        value: "idea_validation",
        pathWeight: { ignition: 3, launch_control: 0, interstellar: 0 }
      },
      {
        text: "Can my current system handle growth?",
        value: "system_scaling",
        pathWeight: { ignition: 1, launch_control: 3, interstellar: 0 }
      },
      {
        text: "How do I stay competitive in this AI-driven world?",
        value: "ai_competitive",
        pathWeight: { ignition: 0, launch_control: 1, interstellar: 3 }
      }
    ]
  },
  {
    id: 3,
    text: "You discover a magical terminal that can grant one wish. What do you type?",
    choices: [
      {
        text: "./build-mvp --fast --validated",
        value: "build_mvp",
        pathWeight: { ignition: 3, launch_control: 0, interstellar: 0 }
      },
      {
        text: "./scale-system --secure --enterprise-ready",
        value: "scale_system",
        pathWeight: { ignition: 0, launch_control: 3, interstellar: 1 }
      },
      {
        text: "./summon-ai-agents --productivity-boost=1000%",
        value: "ai_boost",
        pathWeight: { ignition: 0, launch_control: 0, interstellar: 3 }
      }
    ]
  },
  {
    id: 4,
    text: "Your ideal work environment is:",
    choices: [
      {
        text: "A garage with whiteboards full of sketches and rapid prototypes",
        value: "garage_prototyping",
        pathWeight: { ignition: 3, launch_control: 0, interstellar: 0 }
      },
      {
        text: "A war room with dashboards monitoring system performance",
        value: "war_room_monitoring",
        pathWeight: { ignition: 0, launch_control: 3, interstellar: 1 }
      },
      {
        text: "A command center where AI agents handle the heavy lifting",
        value: "ai_command_center",
        pathWeight: { ignition: 0, launch_control: 1, interstellar: 3 }
      }
    ]
  },
  {
    id: 5,
    text: "The final boss appears! What's your strategy?",
    choices: [
      {
        text: "Test assumptions quickly and pivot if needed",
        value: "test_pivot",
        pathWeight: { ignition: 3, launch_control: 0, interstellar: 0 }
      },
      {
        text: "Build robust defenses and scale infrastructure",
        value: "build_defenses",
        pathWeight: { ignition: 0, launch_control: 3, interstellar: 0 }
      },
      {
        text: "Deploy AI-powered automation for maximum efficiency",
        value: "ai_automation",
        pathWeight: { ignition: 0, launch_control: 1, interstellar: 3 }
      }
    ]
  }
];

export const AdventureGame = () => {
  const [gameState, setGameState] = useState<"intro" | "name" | "playing" | "result">("intro");
  const [playerName, setPlayerName] = useState("");
  const [isGeneratedName, setIsGeneratedName] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [sessionId, setSessionId] = useState<string>("");
  const [finalPath, setFinalPath] = useState<"ignition" | "launch_control" | "interstellar" | null>(null);
  const navigate = useNavigate();

  const generateRandomName = () => {
    const randomName = RETRO_NAMES[Math.floor(Math.random() * RETRO_NAMES.length)];
    setPlayerName(randomName);
    setIsGeneratedName(true);
  };

  const startGame = async () => {
    if (!playerName.trim()) return;

    try {
      const { data, error } = await supabase
        .from("adventure_sessions")
        .insert({
          player_name: playerName,
          is_generated_name: isGeneratedName,
        })
        .select()
        .single();

      if (error) throw error;
      
      setSessionId(data.id);
      setGameState("playing");
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const answerQuestion = async (choiceValue: string, choiceText: string) => {
    const question = QUESTIONS[currentQuestion];
    
    try {
      // Store the choice
      await supabase.from("adventure_choices").insert({
        session_id: sessionId,
        question_number: question.id,
        question_text: question.text,
        choice_text: choiceText,
        choice_value: choiceValue,
      });

      const newAnswers = [...answers, choiceValue];
      setAnswers(newAnswers);

      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // Calculate final path
        const pathScores = { ignition: 0, launch_control: 0, interstellar: 0 };
        
        newAnswers.forEach((answer, index) => {
          const question = QUESTIONS[index];
          const choice = question.choices.find(c => c.value === answer);
          if (choice) {
            pathScores.ignition += choice.pathWeight.ignition;
            pathScores.launch_control += choice.pathWeight.launch_control;
            pathScores.interstellar += choice.pathWeight.interstellar;
          }
        });

        const finalPathResult = Object.entries(pathScores).reduce((a, b) =>
          pathScores[a[0] as keyof typeof pathScores] > pathScores[b[0] as keyof typeof pathScores] ? a : b
        )[0] as "ignition" | "launch_control" | "interstellar";

        setFinalPath(finalPathResult);

        // Update session with final path
        await supabase
          .from("adventure_sessions")
          .update({
            final_path: finalPathResult,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        setGameState("result");
      }
    } catch (error) {
      console.error("Error answering question:", error);
    }
  };

  const handleEmailSignup = async () => {
    try {
      await supabase
        .from("adventure_sessions")
        .update({ final_outcome: "email_signup" })
        .eq("id", sessionId);
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  const handleBookMeeting = async () => {
    try {
      await supabase
        .from("adventure_sessions")
        .update({ final_outcome: "book_meeting" })
        .eq("id", sessionId);
      
      // Navigate to appropriate path page
      if (finalPath === "ignition") navigate("/ignition");
      else if (finalPath === "launch_control") navigate("/launch-control");
      else if (finalPath === "interstellar") navigate("/interstellar");
    } catch (error) {
      console.error("Error updating outcome:", error);
    }
  };

  const getPathInfo = (path: string) => {
    switch (path) {
      case "ignition":
        return {
          title: "Ignition Path",
          description: "Perfect for getting your idea to a working prototype fast. Benefit from years of experience going from 0 to 1.",
          features: ["Discovery workshops", "Rapid prototype development", "Assumption testing guidance"]
        };
      case "launch_control":
        return {
          title: "Launch Control Path",
          description: "Scale your prototype into a production-ready system with fractional CTO guidance.",
          features: ["Architecture & scaling strategy", "Security & compliance", "Team & process optimization"]
        };
      case "interstellar":
        return {
          title: "Interstellar Path",
          description: "Transform your team's velocity with AI agents. Ship features 10x faster while maintaining quality.",
          features: ["AI agent integration", "Team transformation", "Enterprise support"]
        };
      default:
        return { title: "", description: "", features: [] };
    }
  };

  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-sm border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">
              🎮 Choose Your Path Adventure
            </CardTitle>
            <p className="text-gray-300 text-lg">
              Embark on a journey to discover which path aligns with your current needs. 
              Answer 5 questions and unlock your personalized guidance.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <Button
                onClick={() => setGameState("name")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
                size="lg"
              >
                Start Adventure
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "name") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-gray-900/80 backdrop-blur-sm border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white mb-4">
              Choose Your Player Name
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="playerName" className="text-white text-sm font-medium">
                Enter your name or generate a retro gaming alias
              </Label>
              <div className="flex gap-3 mt-2">
                <Input
                  id="playerName"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setIsGeneratedName(false);
                  }}
                  placeholder="Your name or alias"
                  className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400"
                />
                <Button
                  onClick={generateRandomName}
                  variant="outline"
                  className="border-purple-500/50 text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 whitespace-nowrap"
                >
                  <Shuffle className="w-4 h-4 mr-2" />
                  Random
                </Button>
              </div>
              {isGeneratedName && (
                <p className="text-purple-400 text-sm mt-2">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Generated retro gaming name!
                </p>
              )}
            </div>
            <Button
              onClick={startGame}
              disabled={!playerName.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
              size="lg"
            >
              Begin Quest
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "playing") {
    const question = QUESTIONS[currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-sm border-purple-500/30">
          <CardHeader>
            <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
              <span>Player: {playerName}</span>
              <span>Question {currentQuestion + 1} of {QUESTIONS.length}</span>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {question.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => answerQuestion(choice.value, choice.text)}
                  variant="outline"
                  className="w-full text-left h-auto p-4 border-gray-600 text-white bg-gray-800/50 hover:bg-gray-700/50 hover:border-purple-500/50"
                >
                  {choice.text}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameState === "result" && finalPath) {
    const pathInfo = getPathInfo(finalPath);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <Card className="w-full max-w-4xl bg-gray-900/80 backdrop-blur-sm border-purple-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-white mb-4">
              🎯 Quest Complete!
            </CardTitle>
            <p className="text-gray-300">
              {playerName}, your adventure has revealed the perfect path for your journey.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">{pathInfo.title}</h3>
              <p className="text-gray-300 text-lg mb-6">{pathInfo.description}</p>
              <ul className="space-y-2 text-gray-300 max-w-md mx-auto">
                {pathInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Ready to dive deeper?</h4>
                <Button
                  onClick={handleBookMeeting}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                  size="lg"
                >
                  Explore {pathInfo.title}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-white">Want to learn more first?</h4>
                <div onClick={handleEmailSignup}>
                  <EmailOptIn
                    variant="minimal"
                    buttonText="Get Updates"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};