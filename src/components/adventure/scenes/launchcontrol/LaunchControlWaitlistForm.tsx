import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { trackFormSubmission } from '@/lib/analytics';
import { launchControlWaitlistSchema, validateForm } from '@/lib/validation';
import { subscribeToConvertKit, getContextualTags, getCustomFields } from '@/lib/convertkit';

import { useGameStore } from '../../gameStore';

// Extend the base schema with additional fields
const extendedWaitlistSchema = launchControlWaitlistSchema.extend({
  phone: z.string().optional(),
  preferredContact: z.enum(['email', 'phone', 'text', 'any']).default('email'),
  companyName: z.string().optional(),
  currentScale: z.string().optional(),
});

type WaitlistData = z.infer<typeof extendedWaitlistSchema>;

interface LaunchControlWaitlistFormProps {
  onSuccess: () => void;
  isWaitlist?: boolean;
}

export const LaunchControlWaitlistForm = ({ onSuccess, isWaitlist = false }: LaunchControlWaitlistFormProps) => {
  const { sessionId } = useGameStore();
  const [formData, setFormData] = useState<WaitlistData>({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    notificationPreference: 'email',
    companyName: '',
    currentScale: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof WaitlistData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = extendedWaitlistSchema.parse(formData);

      // Save to database
      const { error } = await supabase.from('launch_control_waitlist').insert({
        session_id: sessionId,
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        preferred_contact: validatedData.preferredContact,
        company_name: validatedData.companyName || null,
        current_scale: validatedData.currentScale || null,
        is_waitlist: isWaitlist,
      });

      if (error) {
        throw error;
      }

      // Also update the adventure_sessions record with the contact info
      if (sessionId) {
        const { error: sessionUpdateError } = await supabase
          .from("adventure_sessions")
          .update({ email: validatedData.email })
          .eq("id", sessionId);

        if (sessionUpdateError) {
          console.warn("Failed to update session with contact info:", sessionUpdateError);
          // Don't throw here - the contact info is saved in launch_control_waitlist
        }
      }

      // Subscribe to ConvertKit mailing list
      try {
        const convertKitTags = getContextualTags('adventure-launch-control');
        if (isWaitlist) {
          convertKitTags.push(...getContextualTags('launch-control-waitlist'));
        }

        const customFields = getCustomFields('launch-control-scene-waitlist', {
          contactMethod: validatedData.preferredContact,
          program: 'launch-control',
          is_waitlist: isWaitlist,
          company: validatedData.companyName,
          currentScale: validatedData.currentScale,
        });

        const subscribeResult = await subscribeToConvertKit({
          email: validatedData.email,
          firstName: validatedData.name,
          source: 'launch-control-scene-waitlist',
          tags: convertKitTags,
          customFields,
        });

        if (!subscribeResult.success) {
          console.warn('ConvertKit subscription failed:', subscribeResult.error);
          // Don't fail the whole form submission if ConvertKit fails
        }
      } catch (error) {
        console.warn('ConvertKit subscription error:', error);
        // Don't fail the whole form submission if ConvertKit fails
      }

      // Track form submission
      trackFormSubmission('launch_control_waitlist_form', {
        source: 'adventure_game',
        preferred_contact: validatedData.preferredContact,
        has_company: !!validatedData.companyName,
        has_scale_info: !!validatedData.currentScale,
        is_waitlist: isWaitlist
      });

      onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof WaitlistData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as keyof WaitlistData] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Error submitting waitlist form:', error);
        setErrors({ email: 'Failed to submit. Please try again.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneOrTextDisabled = !formData.phone || formData.phone.trim() === '';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-white">
          Name *
        </Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="email" className="text-white">
          Email *
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="your@email.com"
        />
        {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <Label htmlFor="companyName" className="text-white">
          Company Name
        </Label>
        <Input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="Your company (optional)"
        />
      </div>

      <div>
        <Label htmlFor="currentScale" className="text-white">
          Current Scale
        </Label>
        <Input
          id="currentScale"
          type="text"
          value={formData.currentScale}
          onChange={(e) => setFormData({ ...formData, currentScale: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="e.g., 10K users, 1M requests/day (optional)"
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-white">
          Phone Number (optional)
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="bg-white/5 border-white/20 text-white"
          placeholder="+1 (555) 123-4567"
        />
        <p className="text-gray-400 text-sm mt-1">
          Required if you prefer phone or text contact
        </p>
      </div>

      <div>
        <Label className="text-white mb-3 block">Preferred Contact Method *</Label>
        <RadioGroup
          value={formData.preferredContact}
          onValueChange={(value) =>
            setFormData({ ...formData, preferredContact: value as WaitlistData['preferredContact'] })
          }
          className="space-y-3"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="email" 
              id="contact-email" 
              className="border-cyan-400 text-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-gray-900"
            />
            <Label htmlFor="contact-email" className="text-white cursor-pointer font-medium">
              Email
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="phone"
              id="contact-phone"
              disabled={phoneOrTextDisabled}
              className="border-cyan-400 text-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-gray-900 disabled:border-gray-600 disabled:text-gray-600"
            />
            <Label
              htmlFor="contact-phone"
              className={`cursor-pointer font-medium ${phoneOrTextDisabled ? 'text-gray-500' : 'text-white'}`}
            >
              Phone
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="text"
              id="contact-text"
              disabled={phoneOrTextDisabled}
              className="border-cyan-400 text-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-gray-900 disabled:border-gray-600 disabled:text-gray-600"
            />
            <Label
              htmlFor="contact-text"
              className={`cursor-pointer font-medium ${phoneOrTextDisabled ? 'text-gray-500' : 'text-white'}`}
            >
              Text/SMS
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem 
              value="any" 
              id="contact-any" 
              className="border-cyan-400 text-cyan-400 data-[state=checked]:bg-cyan-400 data-[state=checked]:text-gray-900"
            />
            <Label htmlFor="contact-any" className="text-white cursor-pointer font-medium">
              Anything works
            </Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        size="lg"
      >
        {isSubmitting ? 'Submitting...' : isWaitlist ? 'Join Waitlist' : 'Submit for Review'}
      </Button>

      <p className="text-center text-sm text-gray-400">
        {isWaitlist
          ? "We'll reach out within 2 business days when a spot opens up."
          : "We'll reach out within 2 business days to discuss your scaling needs."}
      </p>
    </form>
  );
};