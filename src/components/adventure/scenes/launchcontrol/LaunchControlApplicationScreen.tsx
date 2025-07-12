import { 
  FileText, 
  MessageSquare, 
  Shield, 
  Rocket,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';
import { saveChoice } from '../../utils';


const APPLICATION_SCENE: SceneType = {
  id: 'launchControlApplication',
  type: 'detail',
  title: 'Mission Application',
  description: 'Your journey to scaling excellence starts here',
  backgroundClass: 'bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900',
};

const APPLICATION_STEPS = [
  {
    id: 'technical',
    question: 'Tell us about your current technical stack and architecture',
    type: 'technical',
    options: [
      'Modern cloud-native (AWS/GCP/Azure)',
      'Traditional monolith needing migration',
      'Microservices architecture',
      'Hybrid on-premise and cloud',
    ],
  },
  {
    id: 'scale',
    question: 'What are your scaling challenges?',
    type: 'challenges',
    options: [
      'Performance bottlenecks',
      'Infrastructure costs',
      'Team bandwidth',
      'Technical debt',
    ],
  },
  {
    id: 'timeline',
    question: 'When do you need to achieve your scaling goals?',
    type: 'timeline',
    options: [
      'ASAP - Critical business need',
      '1-3 months - Planning ahead',
      '3-6 months - Strategic initiative',
      '6+ months - Long-term planning',
    ],
  },
  {
    id: 'team',
    question: 'What is your current team structure?',
    type: 'team',
    options: [
      '1-5 engineers',
      '5-15 engineers',
      '15-50 engineers',
      '50+ engineers',
    ],
  },
];

export const LaunchControlApplicationScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    
    if (currentStep < APPLICATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const isComplete = Object.keys(answers).length === APPLICATION_STEPS.length;

  const handleSubmit = async () => {
    // Save application
    makeChoice(APPLICATION_SCENE.id, 'application-complete');
    await saveChoice(
      sessionId,
      APPLICATION_SCENE.id,
      'application-complete',
      JSON.stringify(answers)
    );

    // Navigate to final screen
    pushScene('launchControlFinal');
  };

  const currentQuestion = APPLICATION_STEPS[currentStep];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-cyan-900 to-slate-900">
        {/* Application Progress Visualization */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="relative">
            {APPLICATION_STEPS.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "absolute w-32 h-32 rounded-full border-2",
                  idx <= currentStep ? "border-cyan-400" : "border-gray-600"
                )}
                style={{
                  transform: `rotate(${idx * 90}deg) translateX(150px) rotate(-${idx * 90}deg)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={APPLICATION_SCENE} className="max-w-3xl w-full">
          <div className="space-y-8">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between mb-8">
              {APPLICATION_STEPS.map((step, idx) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                    idx < currentStep 
                      ? "bg-cyan-500 text-white"
                      : idx === currentStep
                      ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white animate-pulse"
                      : "bg-gray-700 text-gray-400"
                  )}>
                    {idx < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  {idx < APPLICATION_STEPS.length - 1 && (
                    <div className={cn(
                      "w-full h-1 mx-2",
                      idx < currentStep ? "bg-cyan-500" : "bg-gray-700"
                    )} />
                  )}
                </div>
              ))}
            </div>

            {!isComplete ? (
              <>
                {/* Current Question */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 animate-fadeIn">
                  <div className="flex items-center mb-6">
                    <FileText className="w-6 h-6 text-cyan-400 mr-3" />
                    <h3 className="text-xl font-bold text-white">
                      Question {currentStep + 1} of {APPLICATION_STEPS.length}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-300 mb-6">{currentQuestion.question}</p>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg transition-all duration-300",
                          "bg-gray-900/50 border hover:border-cyan-500/50",
                          answers[currentQuestion.id] === option
                            ? "border-cyan-400 bg-cyan-900/20"
                            : "border-gray-700/50"
                        )}
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 mr-3",
                            answers[currentQuestion.id] === option
                              ? "border-cyan-400 bg-cyan-400"
                              : "border-gray-500"
                          )}>
                            {answers[currentQuestion.id] === option && (
                              <CheckCircle className="w-4 h-4 text-gray-900" />
                            )}
                          </div>
                          <span className="text-gray-300">{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                {currentStep > 0 && (
                  <div className="flex justify-between">
                    <Button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      Previous
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Application Summary */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-8 animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                      <Shield className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Application Complete!</h3>
                    <p className="text-gray-300">
                      Your mission profile has been prepared. Ready for liftoff?
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4 mb-8">
                    {APPLICATION_STEPS.map((step) => (
                      <div key={step.id} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-400 mr-3 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-400">{step.question}</p>
                          <p className="text-white font-medium">{answers[step.id]}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-white mb-3 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
                      What happens next?
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-300">
                      <li>1. Technical assessment call within 24 hours</li>
                      <li>2. Custom scaling roadmap delivered in 48 hours</li>
                      <li>3. Team matching and project kickoff</li>
                      <li>4. Weekly progress updates and milestones</li>
                    </ol>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center">
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    >
                      Submit Application
                      <Rocket className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <SceneNavigation showBack={!isComplete} showReset />
        </Scene>
      </div>
    </div>
  );
};