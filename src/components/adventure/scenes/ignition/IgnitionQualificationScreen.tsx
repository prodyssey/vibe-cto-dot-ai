import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import type { Scene as SceneType } from '../../types';
import { saveChoice } from '../../utils';


const QUALIFICATION_SCENE: SceneType = {
  id: 'ignitionQualification',
  type: 'detail',
  title: 'Final Qualification',
  description: 'Let\'s make sure Ignition is the perfect fit for your journey',
  backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
};

const QUALIFICATION_QUESTIONS = [
  {
    id: 'commitment',
    question: 'Can you commit 2-4 hours per week for intensive collaboration?',
    why: 'Your involvement is crucial for understanding your vision and making key decisions',
  },
  {
    id: 'timeline',
    question: 'Are you ready to launch an MVP within the next 4-6 weeks?',
    why: 'Ignition is designed for rapid execution - we move fast',
  },
  {
    id: 'feedback',
    question: 'Are you open to feedback and willing to iterate based on user data?',
    why: 'Success requires adapting based on real-world validation',
  },
  {
    id: 'investment',
    question: 'Do you have the budget allocated and ready to invest?',
    why: 'We want to ensure there are no blockers to starting immediately',
  },
];

export const IgnitionQualificationScreen = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleAnswer = (questionId: string, answer: boolean) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const allAnswered = QUALIFICATION_QUESTIONS.every(q => answers[q.id] !== undefined);
  const qualificationScore = Object.values(answers).filter(Boolean).length;
  const isQualified = qualificationScore >= 3;

  const handleCheckResults = async () => {
    setShowResults(true);
    
    // Save qualification results
    makeChoice(QUALIFICATION_SCENE.id, 'qualification-complete');
    await saveChoice(
      sessionId,
      QUALIFICATION_SCENE.id,
      'qualification-complete',
      `Score: ${qualificationScore}/4 - ${isQualified ? 'Qualified' : 'Not Qualified'}`
    );
  };

  const handleContinue = () => {
    if (isQualified) {
      pushScene('ignitionFinal');
    } else {
      pushScene('ignitionAlternatives');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 20% 80%, rgba(251, 146, 60, 0.3) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)
              `,
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={QUALIFICATION_SCENE} className="max-w-3xl w-full">
          {!showResults ? (
            <div className="space-y-6">
              {/* Questions */}
              {QUALIFICATION_QUESTIONS.map((q, idx) => (
                <div
                  key={q.id}
                  className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 animate-fadeIn"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-orange-400 mt-1">
                      {answers[q.id] !== undefined ? (
                        answers[q.id] ? (
                          <CheckCircle2 className="w-6 h-6 text-green-400" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-red-400" />
                        )
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white mb-2">
                        {q.question}
                      </h4>
                      <p className="text-sm text-gray-400 mb-4">
                        {q.why}
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleAnswer(q.id, true)}
                          variant={answers[q.id] === true ? 'default' : 'outline'}
                          size="sm"
                          className={cn(
                            answers[q.id] === true
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'border-gray-600 hover:border-gray-500'
                          )}
                        >
                          Yes, absolutely
                        </Button>
                        <Button
                          onClick={() => handleAnswer(q.id, false)}
                          variant={answers[q.id] === false ? 'default' : 'outline'}
                          size="sm"
                          className={cn(
                            answers[q.id] === false
                              ? 'bg-red-600 hover:bg-red-700'
                              : 'border-gray-600 hover:border-gray-500'
                          )}
                        >
                          Not quite
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Check Results Button */}
              {allAnswered && (
                <div className="text-center animate-fadeIn">
                  <Button
                    onClick={handleCheckResults}
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  >
                    Check My Results
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              {/* Results */}
              <div className={cn(
                "text-center p-8 rounded-xl",
                "bg-gray-800/30 backdrop-blur-sm border",
                isQualified ? "border-green-500/50" : "border-orange-500/50"
              )}>
                <div className={cn(
                  "inline-flex p-4 rounded-full mb-4",
                  isQualified ? "bg-green-500/20" : "bg-orange-500/20"
                )}>
                  {isQualified ? (
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  ) : (
                    <AlertCircle className="w-12 h-12 text-orange-400" />
                  )}
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {isQualified ? "Perfect Match!" : "Not Quite Ready"}
                </h3>

                <p className="text-lg text-gray-300 mb-4">
                  You answered yes to {qualificationScore} out of {QUALIFICATION_QUESTIONS.length} questions
                </p>

                <p className="text-gray-400 max-w-md mx-auto">
                  {isQualified
                    ? "You're an ideal candidate for the Ignition program! Let's transform your idea into reality."
                    : "It looks like Ignition might not be the perfect fit right now, but we have other ways to help you."}
                </p>
              </div>

              {/* Next Steps */}
              <div className="text-center">
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className={cn(
                    "bg-gradient-to-r",
                    isQualified
                      ? "from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      : "from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  )}
                >
                  {isQualified ? "Continue to Next Steps" : "Explore Alternatives"}
                </Button>
              </div>
            </div>
          )}

          <SceneNavigation showBack={!showResults} showReset />
        </Scene>
      </div>
    </div>
  );
};