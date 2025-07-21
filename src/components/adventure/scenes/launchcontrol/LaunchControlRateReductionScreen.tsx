import { DollarSign, Heart, GraduationCap, Users, Lightbulb } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { SceneTransition } from '../../animations';
import { useGameStore } from '../../gameStore';
import { useBrowserNavigation } from '../../hooks';
import { getScene } from '../../scenes';
import { saveChoice } from '../../utils';

export const LaunchControlRateReductionScreen = () => {
  const { sessionId, makeChoice } = useGameStore();
  const { pushScene } = useBrowserNavigation();
  const scene = getScene('launchControlRateReduction');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');

  if (!scene) return null;

  const categories = [
    {
      id: 'student',
      label: 'Student or Recent Graduate',
      description: 'Currently enrolled or graduated within the last 2 years',
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: 'nonprofit',
      label: 'Non-Profit Organization',
      description: 'Registered 501(c)(3) or Public Benefit Corporation',
      icon: <Heart className="w-5 h-5" />,
    },
    {
      id: 'underrepresented',
      label: 'Underrepresented Founder',
      description: 'Building a more inclusive tech ecosystem',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'aligned',
      label: 'Aligned Vision',
      description: 'Building something we believe will make the world better',
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ];

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async () => {
    const applicationData = {
      categories: selectedCategories,
      additionalInfo,
      timestamp: new Date().toISOString(),
    };

    makeChoice('launchControlRateReduction', 'applied', { launchControl: 2 });
    await saveChoice(
      sessionId,
      'launchControlRateReduction',
      'applied',
      JSON.stringify(applicationData)
    );

    pushScene('launchControlQualification');
  };

  const handleSkip = async () => {
    makeChoice('launchControlRateReduction', 'skipped', { launchControl: 2 });
    await saveChoice(sessionId, 'launchControlRateReduction', 'skipped', 'Skipped rate reduction');
    pushScene('launchControlQualification');
  };

  return (
    <SceneTransition sceneId="launchControlRateReduction" transitionType="slide">
      <Scene scene={scene} className="max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
              <DollarSign className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Rate Reduction Opportunity</h2>
          <p className="text-gray-300 text-lg">
            We believe transformative technology should be accessible. You may qualify for up to 50% off
            our standard rates if you meet any of the following criteria.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`bg-white/5 backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
                selectedCategories.includes(category.id)
                  ? 'border-blue-400 shadow-lg shadow-blue-400/20'
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => handleToggleCategory(category.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleToggleCategory(category.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={category.id}
                      className="flex items-center cursor-pointer text-lg font-semibold text-white mb-1"
                    >
                      <span className="mr-2 text-blue-400">{category.icon}</span>
                      {category.label}
                    </Label>
                    <p className="text-gray-400 text-sm">{category.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCategories.length > 0 && (
          <div className="mb-8 animate-fadeIn">
            <Label htmlFor="additional-info" className="text-white mb-2 block">
              Additional Information (Optional)
            </Label>
            <Textarea
              id="additional-info"
              placeholder="Tell us more about your situation or project..."
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-500 min-h-[100px]"
            />
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSkip}
            variant="outline"
            size="lg"
            className="border-white/20 text-white bg-white/5 hover:bg-white/10"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSubmit}
            size="lg"
            disabled={selectedCategories.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white disabled:opacity-50"
          >
            Apply for Reduced Rate
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Your application will be reviewed within 1-2 business days.</p>
          <p>We'll work with you to find a rate that makes Launch Control accessible.</p>
        </div>

        <SceneNavigation showBack showReset />
      </Scene>
    </SceneTransition>
  );
};