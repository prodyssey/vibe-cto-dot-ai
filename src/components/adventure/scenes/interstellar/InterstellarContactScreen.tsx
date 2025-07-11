import { useState } from 'react';
import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { saveChoice } from '../../utils';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Globe2, 
  Users, 
  Target,
  MessageSquare,
  CheckCircle,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Scene as SceneType } from '../../types';

const CONTACT_SCENE: SceneType = {
  id: 'interstellarContact',
  type: 'detail',
  title: 'Executive Briefing Request',
  description: 'Let\'s explore the possibilities together',
  backgroundClass: 'bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900',
};

const CONSULTATION_QUESTIONS = [
  {
    id: 'company',
    question: 'Tell us about your organization',
    type: 'company',
    options: [
      'Fortune 500 Enterprise',
      'Unicorn Startup ($1B+ valuation)',
      'Scale-up ($100M-$1B valuation)',
      'Government/Public Sector',
    ],
  },
  {
    id: 'challenge',
    question: 'What\'s your primary transformation goal?',
    type: 'challenge',
    options: [
      'AI/ML adoption at scale',
      'Digital transformation acceleration',
      'Market disruption strategy',
      'Technical debt modernization',
    ],
  },
  {
    id: 'timeline',
    question: 'What\'s your transformation timeline?',
    type: 'timeline',
    options: [
      'Immediate - Critical initiative',
      '3-6 months - Strategic planning',
      '6-12 months - Roadmap development',
      '12+ months - Long-term vision',
    ],
  },
  {
    id: 'budget',
    question: 'Annual technology transformation budget?',
    type: 'budget',
    options: [
      '$10M+',
      '$5M - $10M',
      '$1M - $5M',
      'To be determined',
    ],
  },
];

export const InterstellarContactScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  const { sessionId, playerName, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
    
    if (currentStep < CONSULTATION_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handleSubmit = async () => {
    // Save consultation
    makeChoice(CONTACT_SCENE.id, 'consultation-complete');
    await saveChoice(
      sessionId,
      CONTACT_SCENE.id,
      'consultation-complete',
      JSON.stringify(answers)
    );

    // Navigate to final screen
    pushScene('interstellarFinal');
  };

  const currentQuestion = CONSULTATION_QUESTIONS[currentStep];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900">
        {/* Executive Suite Ambiance */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(45deg, transparent 48%, rgba(139, 92, 246, 0.1) 49%, rgba(139, 92, 246, 0.1) 51%, transparent 52%),
                linear-gradient(-45deg, transparent 48%, rgba(99, 102, 241, 0.1) 49%, rgba(99, 102, 241, 0.1) 51%, transparent 52%)
              `,
              backgroundSize: '30px 30px',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={CONTACT_SCENE} className="max-w-3xl w-full">
          <div className="space-y-8">
            {!showSummary ? (
              <>
                {/* Progress Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {CONSULTATION_QUESTIONS.map((_, idx) => (
                    <div key={idx} className="flex items-center flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                        idx < currentStep 
                          ? "bg-purple-500 text-white"
                          : idx === currentStep
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white animate-pulse"
                          : "bg-gray-700 text-gray-400"
                      )}>
                        {idx < currentStep ? (
                          <CheckCircle className="w-6 h-6" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </div>
                      {idx < CONSULTATION_QUESTIONS.length - 1 && (
                        <div className={cn(
                          "flex-1 h-1 mx-2",
                          idx < currentStep ? "bg-purple-500" : "bg-gray-700"
                        )} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Current Question */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 animate-fadeIn">
                  <div className="flex items-center mb-6">
                    {currentQuestion.type === 'company' && <Briefcase className="w-6 h-6 text-purple-400 mr-3" />}
                    {currentQuestion.type === 'challenge' && <Target className="w-6 h-6 text-purple-400 mr-3" />}
                    {currentQuestion.type === 'timeline' && <Globe2 className="w-6 h-6 text-purple-400 mr-3" />}
                    {currentQuestion.type === 'budget' && <Users className="w-6 h-6 text-purple-400 mr-3" />}
                    <h3 className="text-xl font-bold text-white">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(currentQuestion.id, option)}
                        className={cn(
                          "w-full text-left p-4 rounded-lg transition-all duration-300",
                          "bg-gray-900/50 border hover:border-purple-500/50",
                          "hover:bg-purple-900/20",
                          answers[currentQuestion.id] === option
                            ? "border-purple-400 bg-purple-900/20"
                            : "border-gray-700/50"
                        )}
                      >
                        <div className="flex items-center">
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center",
                            answers[currentQuestion.id] === option
                              ? "border-purple-400 bg-purple-400"
                              : "border-gray-500"
                          )}>
                            {answers[currentQuestion.id] === option && (
                              <div className="w-2 h-2 rounded-full bg-gray-900" />
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
                  <div className="flex justify-start">
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
                {/* Consultation Summary */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 animate-fadeIn">
                  <div className="text-center mb-8">
                    <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 mb-4">
                      <MessageSquare className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Executive Briefing Prepared</h3>
                    <p className="text-gray-300">
                      {playerName}, your consultation request has been prepared for our executive team.
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-900/50 rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-white mb-4">Consultation Summary</h4>
                    <div className="space-y-3">
                      {CONSULTATION_QUESTIONS.map((q) => (
                        <div key={q.id} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-purple-400 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-400">{q.question}</p>
                            <p className="text-white font-medium">{answers[q.id]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6">
                    <h4 className="font-semibold text-white mb-3">What happens next?</h4>
                    <ol className="space-y-2 text-sm text-gray-300">
                      <li>1. Executive team review within 4 hours</li>
                      <li>2. Custom transformation proposal within 24 hours</li>
                      <li>3. C-suite strategy session scheduling</li>
                      <li>4. Dedicated success team assignment</li>
                    </ol>
                  </div>

                  {/* Submit Button */}
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleSubmit}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      Submit Executive Briefing
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <SceneNavigation showBack={!showSummary} showReset />
        </Scene>
      </div>
    </div>
  );
};