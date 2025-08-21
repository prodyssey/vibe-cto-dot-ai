import { Mail, Phone, UserCheck, User, MessageSquare } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { trackFormSubmission } from "@/lib/analytics";
import { waitlistFormSchema, validateForm } from "@/lib/validation";

import { AnimatedButton } from "./AnimatedButton";

interface LaunchControlWaitlistFormProps {
  sessionId: string;
  playerName: string;
  isGeneratedName: boolean;
  onSuccess: () => void;
  isWaitlistActive?: boolean;
}

export const LaunchControlWaitlistForm = ({
  sessionId,
  playerName,
  isGeneratedName,
  onSuccess,
  isWaitlistActive = false,
}: LaunchControlWaitlistFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: isGeneratedName ? "" : playerName,
    email: "",
    phone: "",
    contactMethod: "email",
  });
  const [error, setError] = useState<string | null>(null);

  // Check if phone number is valid (has any content)
  const isPhoneValid = formData.phone && formData.phone.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Validate form data
    const validationData = {
      name: formData.name || playerName,
      email: formData.email,
      preferredContact: formData.contactMethod === 'either' ? 'either' : formData.contactMethod,
      phone: formData.phone || undefined,
    };

    const validation = validateForm(waitlistFormSchema, validationData);
    if (!validation.success) {
      const firstError = Object.values(validation.errors)[0];
      setError(firstError);
      setIsSubmitting(false);
      return;
    }

    try {
      // Determine preferred contact based on method
      let preferredContact = formData.email;
      if (
        (formData.contactMethod === "phone" ||
          formData.contactMethod === "text") &&
        formData.phone
      ) {
        preferredContact = formData.phone;
      } else if (formData.contactMethod === "either") {
        preferredContact =
          formData.email + (formData.phone ? ` / ${formData.phone}` : "");
      }

      const { error: dbError } = await supabase
        .from("launch_control_waitlist")
        .insert({
          session_id: sessionId,
          name: formData.name || playerName,
          email: formData.email,
          preferred_contact: preferredContact,
          phone: formData.phone || null,
          company_name: null,
          current_scale: null,
          is_waitlist: true,
        });

      if (dbError) {
        throw dbError;
      }

      // Track form submission
      trackFormSubmission('launch_control_waitlist_form', {
        source: 'adventure_game',
        contact_method: formData.contactMethod,
        is_waitlist: isWaitlistActive
      });

      onSuccess();
    } catch (err) {
      console.error("Error submitting waitlist form:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-white mb-2 block">
            Your Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
          />
          {isGeneratedName && (
            <p className="text-xs text-gray-400 mt-1">
              Please provide your real name for contact purposes
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="text-white mb-2 block">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-white mb-2 block">
            Phone Number (Optional)
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={formData.phone}
            onChange={(e) => {
              const value = e.target.value;
              // Reset to email if phone is cleared and phone/text was selected
              const shouldResetContactMethod =
                !value &&
                (formData.contactMethod === "phone" ||
                  formData.contactMethod === "text");

              setFormData({
                ...formData,
                phone: value,
                ...(shouldResetContactMethod && { contactMethod: "email" }),
              });
            }}
            className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Include if you prefer phone contact
          </p>
        </div>

        <div>
          <Label className="text-white mb-3 block">
            Preferred Contact Method
          </Label>
          <RadioGroup
            value={formData.contactMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, contactMethod: value })
            }
            className="space-y-3"
          >
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="email"
                id="method-email"
                className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500/10"
              />
              <Label
                htmlFor="method-email"
                className="flex items-center cursor-pointer text-gray-300"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email (recommended)
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="phone"
                id="method-phone"
                className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isPhoneValid}
              />
              <Label
                htmlFor="method-phone"
                className={cn(
                  "flex items-center cursor-pointer",
                  isPhoneValid ? "text-gray-300" : "text-gray-500"
                )}
              >
                <Phone className="w-4 h-4 mr-2" />
                Phone {!isPhoneValid && "(enter number above)"}
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="text"
                id="method-text"
                className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isPhoneValid}
              />
              <Label
                htmlFor="method-text"
                className={cn(
                  "flex items-center cursor-pointer",
                  isPhoneValid ? "text-gray-300" : "text-gray-500"
                )}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Text/SMS {!isPhoneValid && "(enter number above)"}
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem
                value="either"
                id="method-either"
                className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500/10"
              />
              <Label
                htmlFor="method-either"
                className="flex items-center cursor-pointer text-gray-300"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Anything works for me
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-lg p-3">
          {error}
        </div>
      )}

      <AnimatedButton
        type="submit"
        disabled={isSubmitting || !formData.name || !formData.email}
        className={cn(
          "w-full",
          "bg-gradient-to-r from-blue-600 to-cyan-600",
          "hover:from-blue-700 hover:to-cyan-700"
        )}
        particleColors={["#0ea5e9", "#06b6d4", "#14b8a6"]}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : isWaitlistActive ? (
          "Join the Launch Control Waitlist"
        ) : (
          "Submit Contact Info"
        )}
      </AnimatedButton>

      <p className="text-xs text-gray-400 text-center">
        {isWaitlistActive
          ? "We'll reach out within 2 business days when a spot opens up"
          : "We'll reach out within 2 business days to discuss your scaling needs"}
      </p>
    </form>
  );
};