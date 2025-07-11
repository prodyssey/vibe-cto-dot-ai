import { Scene } from '../../Scene';
import { SceneNavigation } from '../../SceneNavigation';
import { useBrowserNavigation } from '../../hooks';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, Shield } from 'lucide-react';
import type { Scene as SceneType } from '../../types';

const PAYMENT_INFO_SCENE: SceneType = {
  id: 'ignitionPaymentInfo',
  type: 'detail',
  title: 'Payment Options',
  description: 'Flexible payment plans to match your needs',
  backgroundClass: 'bg-gradient-to-br from-orange-900 via-red-900 to-slate-900',
};

export const IgnitionPaymentInfoScreen = () => {
  const { pushScene } = useBrowserNavigation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-red-900 to-slate-900" />

      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Scene scene={PAYMENT_INFO_SCENE} className="max-w-3xl w-full">
          <div className="space-y-6">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-orange-500/30 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <CreditCard className="w-6 h-6 mr-2 text-orange-400" />
                Payment Plan Options
              </h3>
              
              <div className="space-y-4">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">50/50 Split</h4>
                  <p className="text-gray-300">50% upfront, 50% on delivery</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">Three Payments</h4>
                  <p className="text-gray-300">Split into 3 equal payments over project duration</p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-semibold text-white">Pay in Full</h4>
                  <p className="text-gray-300">5% discount for full payment upfront</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                <Calendar className="w-6 h-6 text-orange-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Start Immediately</h4>
                <p className="text-sm text-gray-400">Begin work as soon as first payment is received</p>
              </div>
              
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4">
                <Shield className="w-6 h-6 text-orange-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Satisfaction Guarantee</h4>
                <p className="text-sm text-gray-400">We're committed to your success</p>
              </div>
            </div>

            <div className="text-center space-y-4">
              <p className="text-gray-300">Ready to move forward?</p>
              <Button
                onClick={() => pushScene('ignitionQualification')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Continue to Qualification
              </Button>
            </div>
          </div>

          <SceneNavigation showBack showReset />
        </Scene>
      </div>
    </div>
  );
};