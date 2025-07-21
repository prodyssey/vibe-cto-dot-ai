import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Scene } from '../../Scene';
import { SceneTransition } from '../../animations';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { getScene } from '../../scenes';
import { saveChoice } from '../../utils';

interface QualificationQuestion {
  id: string;
  question: string;
  subtext?: string;
  yesAnswer: string;
  noAnswer: string;
}

export const LaunchControlQualificationScreen = () => {
  const { sessionId, makeChoice, choices } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene('launchControlQualification');
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState(false);
  const [isQualified, setIsQualified] = useState(false);

  // Check if waitlist is active (TODO: Replace with actual database query)
  const isWaitlistActive = false;

  const questions: QualificationQuestion[] = [
    {
      id: 'prototype',
      question: 'Do you have a working prototype with active users?',
      subtext: 'We specialize in scaling existing products, not building from scratch',
      yesAnswer: 'Yes, with real users',
      noAnswer: 'Not yet',
    },
    {
      id: 'resources',
      question: 'Can you dedicate team resources for weekly collaboration?',
      subtext: 'Transformation requires active participation from your technical team',
      yesAnswer: 'Yes, absolutely',
      noAnswer: 'Not sure',
    },
    {
      id: 'scaling',
      question: 'Are you prepared for rapid scaling (10x growth)?',
      subtext: 'Our systems are designed to handle significant user and data growth',
      yesAnswer: 'That\'s our goal',
      noAnswer: 'Too ambitious',
    },
    {
      id: 'budget',
      question: 'Do you have budget allocated for infrastructure and team augmentation?',
      subtext: 'Beyond our fees, scaling requires investment in tools and talent',
      yesAnswer: 'Yes, ready to invest',
      noAnswer: 'Need to plan for it',
    },
  ];

  if (!scene) return null;

  const handleAnswer = (questionId: string, answer: boolean) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    // Check if all questions are answered
    if (Object.keys(newAnswers).length === questions.length) {
      const qualified = Object.values(newAnswers).every((ans) => ans === true);
      setIsQualified(qualified);
      setShowResult(true);

      // Save the qualification result
      saveChoice(
        sessionId,
        'launchControlQualification',
        qualified ? 'qualified' : 'not-qualified',
        JSON.stringify(newAnswers)
      );
    }
  };

  const handleContinue = () => {
    if (isQualified) {
      makeChoice('launchControlQualification', 'qualified', { launchControl: 3 });
      pushScene('launchControlTimeline');
    } else {
      makeChoice('launchControlQualification', 'not-qualified', { launchControl: 0 });
      pushScene('launchControlAlternatives');
    }
  };

  return (
    <SceneTransition sceneId="launchControlQualification" transitionType="slide">
      <Scene scene={scene} className="max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Readiness Assessment</h2>
          <p className="text-gray-300 text-lg">
            Launch Control is an intensive program designed for teams ready to scale.
            Let's make sure it's the right fit for where you are today.
          </p>
          {isWaitlistActive && (
            <div className="mt-4 bg-yellow-500/10 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/20">
              <p className="text-yellow-300 text-sm">
                <AlertCircle className="inline w-4 h-4 mr-1" />
                Note: We're currently at capacity. Qualified teams will join our priority waitlist.
              </p>
            </div>
          )}
        </div>

        {!showResult ? (
          <div className="space-y-6">
            {questions.map((question) => (
              <Card
                key={question.id}
                className="bg-white/5 backdrop-blur-sm border-white/10"
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {question.question}
                  </h3>
                  {question.subtext && (
                    <p className="text-gray-400 text-sm mb-4">{question.subtext}</p>
                  )}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleAnswer(question.id, true)}
                      variant={answers[question.id] === true ? 'default' : 'outline'}
                      className={
                        answers[question.id] === true
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
                      }
                    >
                      {answers[question.id] === true && (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      {question.yesAnswer}
                    </Button>
                    <Button
                      onClick={() => handleAnswer(question.id, false)}
                      variant={answers[question.id] === false ? 'default' : 'outline'}
                      className={
                        answers[question.id] === false
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'border-white/20 text-white bg-white/5 hover:bg-white/10'
                      }
                    >
                      {answers[question.id] === false && (
                        <XCircle className="w-4 h-4 mr-2" />
                      )}
                      {question.noAnswer}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className="mb-8">
              {isQualified ? (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-green-500/20 rounded-full">
                      <CheckCircle className="w-16 h-16 text-green-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Perfect Match! 🚀
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    You're exactly where Launch Control can make the biggest impact.
                    Your product is ready for the transformation that will enable massive scale.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-yellow-500/20 rounded-full">
                      <AlertCircle className="w-16 h-16 text-yellow-400" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Not Quite Ready Yet
                  </h3>
                  <p className="text-gray-300 text-lg mb-6">
                    Launch Control is designed for teams with existing products ready to scale.
                    Let's explore options that better match where you are today.
                  </p>
                </>
              )}
            </div>

            <Button
              onClick={handleContinue}
              size="lg"
              className={
                isQualified
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700'
              }
            >
              {isQualified ? 'Continue to Timeline' : 'Explore Alternatives'}
            </Button>
          </div>
        )}
      </Scene>
    </SceneTransition>
  );
};