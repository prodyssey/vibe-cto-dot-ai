import { Mail, Phone, UserCheck, MessageSquare } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { subscribeToConvertKit, getContextualTags, getCustomFields } from "@/lib/convertkit";
import { sendSlackNotification } from "@/lib/slack";
import { OptInCheckbox } from "@/components/ui/opt-in-checkbox";

interface CommunityWaitlistFormProps {
  sessionId?: string;
  source?: string;
  onSuccess: () => void;
  className?: string;
  buttonText?: string;
  successMessage?: string;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    contactMethod?: string;
  };
}

export const CommunityWaitlistForm = ({
  sessionId,
  source = "website",
  onSuccess,
  className,
  buttonText = "Join Community Waitlist",
  successMessage = "Thanks for your interest! We'll reach out when spots open up.",
  initialData
}: CommunityWaitlistFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    contactMethod: initialData?.contactMethod || "email",
    optInToMarketing: true,
  });
  const [error, setError] = useState<string | null>(null);

  // Check if phone number is valid (has any content)
  const isPhoneValid = formData.phone && formData.phone.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name.trim()) {
      setError("Name is required");
      setIsSubmitting(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsSubmitting(false);
      return;
    }

    // Phone validation for phone/text methods
    if ((formData.contactMethod === "phone" || formData.contactMethod === "text") && !isPhoneValid) {
      setError("Phone number is required for phone/text contact methods");
      setIsSubmitting(false);
      return;
    }

    try {
      // Save to community_waitlist table
      const { error: dbError } = await supabase
        .from("community_waitlist")
        .insert({
          session_id: sessionId || null,
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone || null,
          preferred_contact: formData.contactMethod,
          contact_method: formData.contactMethod,
          source: source,
          status: 'pending',
          opt_in_to_marketing: formData.optInToMarketing,
          notes: formData.phone && 
                 formData.contactMethod !== "phone" && 
                 formData.contactMethod !== "text"
            ? `Phone: ${formData.phone}`
            : null,
        });

      if (dbError) {
        // Handle unique constraint violation (duplicate email)
        if (dbError.code === '23505') {
          setError("This email is already on the waitlist. Thanks for your interest!");
          setIsSubmitting(false);
          return;
        }
        throw dbError;
      }

      // Subscribe to ConvertKit mailing list
      try {
        const convertKitTags = getContextualTags('community-waitlist');
        convertKitTags.push(...getContextualTags(source === 'website' ? 'community-website' : 'community-signup'));

        const customFields = getCustomFields('community-waitlist', {
          contactMethod: formData.contactMethod,
          source: source,
        });

        const subscribeResult = await subscribeToConvertKit({
          email: formData.email.trim().toLowerCase(),
          firstName: formData.name.trim(),
          source: 'community-waitlist',
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

      // Send Slack notification
      try {
        await sendSlackNotification({
          formType: 'community_waitlist',
          email: formData.email.trim().toLowerCase(),
          name: formData.name.trim(),
          phone: formData.phone || undefined,
          contactMethod: formData.contactMethod,
          source: source,
          sessionId: sessionId,
          isWaitlist: true,
        });
      } catch (error) {
        console.warn('Failed to send Slack notification:', error);
        // Don't fail the form submission if Slack notification fails
      }

      onSuccess();
    } catch (err) {
      console.error("Error submitting community waitlist form:", err);
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
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
          <div className="mt-3">
            <OptInCheckbox
              id="community-opt-in"
              checked={formData.optInToMarketing}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, optInToMarketing: checked })
              }
            />
          </div>
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
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/10"
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
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500/10"
              />
              <Label
                htmlFor="method-either"
                className="flex items-center cursor-pointer text-gray-300"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Either works for me
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

      <Button
        type="submit"
        disabled={isSubmitting || !formData.name.trim() || !formData.email.trim()}
        className={cn(
          "w-full",
          "bg-gradient-to-r from-purple-600 to-blue-600",
          "hover:from-purple-700 hover:to-blue-700",
          "disabled:opacity-50"
        )}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            Submitting...
          </>
        ) : (
          buttonText
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        {successMessage}
      </p>
    </form>
  );
};