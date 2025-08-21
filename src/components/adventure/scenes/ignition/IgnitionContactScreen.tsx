import { Mail, Phone, MessageSquare, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { waitlistFormSchema, validateForm } from "@/lib/validation";

import { useGameStore } from "../../gameStore";
import { useBrowserNavigation } from "../../hooks";
import { Scene } from "../../Scene";
import { SceneNavigation } from "../../SceneNavigation";
import { SceneTransition } from "../../animations";
import { getScene } from "../../scenes";
import { saveChoice } from "../../utils";

interface ContactData {
  name: string;
  email: string;
  preferredContact: "email" | "phone" | "text" | "either";
  phone?: string;
  sessionId: string;
  recordId?: string;
}

export const IgnitionContactScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sessionId, makeChoice } = useGameStore();
  const [contactData, setContactData] = useState<ContactData>({
    name: "",
    email: "",
    preferredContact: "email",
    sessionId: sessionId || "", // Use existing session ID from game store
  });
  const { pushScene } = useBrowserNavigation();
  const { toast } = useToast();
  const scene = getScene("ignitionContact");

  if (!scene) {
    return null;
  }

  const handleContactSubmit = async () => {
    // Validate contact data
    const contactValidation = validateForm(waitlistFormSchema, {
      name: contactData.name,
      email: contactData.email,
      preferredContact: contactData.preferredContact,
      phone: contactData.phone,
    });

    if (!contactValidation.success) {
      toast({
        title: "Validation Error",
        description: Object.values(contactValidation.errors)[0],
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save contact data to ignition_qualifications first (budget will be added in next step)
      const { data, error } = await supabase
        .from("ignition_qualifications")
        .insert({
          budget: "pending", // Will be updated when budget is selected
          needs_rate_reduction: false,
          rate_reduction_reason: null,
          name: contactData.name,
          email: contactData.email,
          preferred_contact: contactData.preferredContact,
          phone: contactData.phone,
          completed: false, // Track completion status
          session_id: contactData.sessionId, // Include session ID for RLS
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Also update the adventure_sessions record with the contact info
      const sessionUpdateData: any = { email: contactData.email };
      
      const { error: sessionUpdateError } = await supabase
        .from("adventure_sessions")
        .update(sessionUpdateData)
        .eq("id", contactData.sessionId);

      if (sessionUpdateError) {
        console.warn("Failed to update session with contact info:", sessionUpdateError);
        // Don't throw here - the contact info is saved in ignition_qualifications
      }

      // Store the record ID and contact info for use later
      makeChoice("ignitionContact", "submitted", undefined, { 
        recordId: data.id,
        sessionId: contactData.sessionId,
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        preferredContact: contactData.preferredContact
      });
      
      await saveChoice(
        sessionId,
        "ignitionContact",
        "submitted",
        `Contact info saved: ${contactData.email}`
      );

      // Move to budget screen
      pushScene("ignitionBudget");
    } catch (error) {
      console.error("Error saving contact information:", error);
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SceneTransition sceneId="ignitionContact" transitionType="slide">
      <Scene scene={scene} className="max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
              <Mail className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Let's Connect
          </h2>
          <p className="text-gray-300 text-lg">
            First, tell us how to reach you so we can start your Ignition journey
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-orange-500/30 rounded-lg p-6 space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              value={contactData.name}
              onChange={(e) =>
                setContactData({ ...contactData, name: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              value={contactData.email}
              onChange={(e) =>
                setContactData({ ...contactData, email: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number{" "}
              {contactData.preferredContact === "phone" ||
              contactData.preferredContact === "text"
                ? ""
                : "(Optional)"}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              value={contactData.phone || ""}
              onChange={(e) =>
                setContactData({ ...contactData, phone: e.target.value })
              }
            />
            {(contactData.preferredContact === "phone" ||
              contactData.preferredContact === "text") &&
              !contactData.phone && (
                <p className="text-xs text-orange-400 mt-1">
                  Required for your selected contact method
                </p>
              )}
          </div>

          <div className="space-y-3">
            <Label className="text-white text-base font-medium">
              Preferred Contact Method
            </Label>
            <RadioGroup
              value={contactData.preferredContact}
              onValueChange={(
                value: "email" | "phone" | "text" | "either"
              ) => setContactData({ ...contactData, preferredContact: value })}
              className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-gray-700"
            >
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                <RadioGroupItem
                  value="email"
                  id="email-pref"
                  className="border-gray-400 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <span className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Email
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                <RadioGroupItem
                  value="phone"
                  id="phone-pref"
                  className="border-gray-400 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <span className="flex items-center gap-2 text-gray-300">
                  <Phone className="w-4 h-4 text-orange-400" />
                  Phone
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                <RadioGroupItem
                  value="text"
                  id="text-pref"
                  className="border-gray-400 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <span className="flex items-center gap-2 text-gray-300">
                  <MessageSquare className="w-4 h-4 text-orange-400" />
                  Text/SMS
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                <RadioGroupItem
                  value="either"
                  id="either-pref"
                  className="border-gray-400 text-orange-500 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <span className="text-gray-300">Either is fine</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center mt-8">
          <Button
            onClick={handleContactSubmit}
            disabled={
              isSubmitting ||
              !contactData.name ||
              !contactData.email ||
              ((contactData.preferredContact === "phone" ||
                contactData.preferredContact === "text") &&
                !contactData.phone)
            }
            size="lg"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Continue to Investment Planning
                <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-400">
          Your information is secure and will only be used for this consultation
        </div>

        <SceneNavigation showBack showReset />
      </Scene>
    </SceneTransition>
  );
};