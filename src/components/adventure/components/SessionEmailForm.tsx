import { Mail, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

import { AnimatedButton } from './AnimatedButton';

interface SessionEmailFormProps {
  sessionId: string;
  playerName: string;
  isGeneratedName: boolean;
  onSuccess: (email: string, name: string) => void;
  onBack?: () => void;
}

export const SessionEmailForm = ({ sessionId, playerName, isGeneratedName, onSuccess, onBack }: SessionEmailFormProps) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState(isGeneratedName ? '' : playerName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    console.log('Submitting email form for session:', sessionId);

    if (!sessionId) {
      setError('No session ID found. Please restart the game.');
      setIsSubmitting(false);
      return;
    }

    try {
      // First check if session exists
      const { data: sessionData, error: fetchError } = await supabase
        .from('adventure_sessions')
        .select('id, player_name, is_generated_name')
        .eq('id', sessionId)
        .single();

      if (fetchError) {
        console.error('Error fetching session:', fetchError);
        throw new Error(`Database error: ${fetchError.message}`);
      }

      if (!sessionData) {
        console.error('Session not found:', sessionId);
        throw new Error('Session not found. Please try restarting the game.');
      }

      console.log('Found session:', sessionData);

      // Update the session with the email (and name if it was generated)
      const updateData: any = { email };
      if (isGeneratedName && name) {
        // Update the player name if they provided their real name
        updateData.player_name = name;
        updateData.is_generated_name = false;
      }

      console.log('Updating session with:', updateData);

      const { data, error: updateError } = await supabase
        .from('adventure_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();

      if (updateError) {
        console.error('Supabase update error:', updateError);
        console.error('Update query details:', {
          table: 'adventure_sessions',
          updateData,
          condition: `id = ${sessionId}`
        });
        throw updateError;
      }

      console.log('Update successful:', data);

      // Call success callback with email and name
      onSuccess(email, name || playerName);
    } catch (err: any) {
      console.error('Error saving email:', err);
      setError(`Failed to save: ${err.message || 'Please try again.'}`);
      
      // Log more details for debugging
      console.error('Session ID:', sessionId);
      console.error('Email:', email);
      console.error('Name:', name);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
          <Mail className="w-8 h-8 text-orange-400" />
        </div>
        <h4 className="text-lg font-semibold text-white mb-2">
          One quick step before scheduling
        </h4>
        <p className="text-sm text-gray-400">
          We'll use this to send you a confirmation and prepare for your call
        </p>
      </div>

      <div className="space-y-4">
        {isGeneratedName && (
          <div>
            <Label htmlFor="name" className="text-white mb-2 block">
              Your Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isSubmitting}
              className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Please provide your real name for the booking
            </p>
          </div>
        )}

        <div>
          <Label htmlFor="email" className="text-white mb-2 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <AnimatedButton
          type="submit"
          disabled={isSubmitting || !email || (isGeneratedName && !name)}
          className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
          particleColors={['#dc2626', '#ea580c', '#f97316']}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Saving...
            </>
          ) : (
            'Continue to Booking'
          )}
        </AnimatedButton>

        {onBack && (
          <Button
            type="button"
            onClick={onBack}
            variant="ghost"
            className="w-full text-gray-400 hover:text-white"
          >
            Back
          </Button>
        )}
      </div>
    </form>
  );
};