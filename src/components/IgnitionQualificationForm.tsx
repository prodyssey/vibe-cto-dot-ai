import {
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { BudgetSlider } from "@/components/BudgetSlider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackSavvyCalClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { waitlistFormSchema, validateForm } from "@/lib/validation";

type FormStep = "contact" | "budget" | "success";

interface IgnitionQualificationFormProps {
  onSuccess?: () => void;
  className?: string;
}

interface FormData {
  budget: number;
  name: string;
  email: string;
  preferredContact: "email" | "phone" | "text" | "either";
  phone?: string;
  recordId?: string;
  sessionId?: string;
}

const BUDGET_RANGES = [
  {
    min: 0,
    max: 100,
    label: "Just exploring",
    description: "I'd like to learn more about vibe coding on my own",
    color: "from-gray-600 to-gray-700",
  },
  {
    min: 100,
    max: 4999,
    label: "Starter budget",
    description: "Let's explore options that might work",
    color: "from-orange-600 to-amber-600",
  },
  {
    min: 5000,
    max: 14999,
    label: "Low-Mid budget",
    description: "I've got a budget, but it's limited",
    color: "from-blue-600 to-cyan-600",
  },
  {
    min: 15000,
    max: 50000,
    label: "Ready to invest",
    description:
      "I understand the investment and I'm ready to transform my idea",
    color: "from-green-600 to-emerald-600",
  },
  {
    min: 50001,
    max: 100000,
    label: "Premium investment",
    description: "Ready for comprehensive transformation",
    color: "from-purple-600 to-indigo-600",
  },
];

export const IgnitionQualificationForm = ({
  onSuccess,
  className,
}: IgnitionQualificationFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>("contact");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackupButton, setShowBackupButton] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    budget: 0,
    name: "",
    email: "",
    preferredContact: "email",
    sessionId: crypto.randomUUID(), // Generate unique session ID for this form instance
  });
  const { toast } = useToast();

  const handleBudgetChange = (value: number) => {
    setFormData({ ...formData, budget: value });
  };

  const handleBudgetSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (!formData.recordId) {
        throw new Error('No record ID found. Please restart the process.');
      }
      if (!formData.sessionId) {
        throw new Error('No session ID found. Please restart the process.');
      }

      // Update the existing record with budget information and mark as completed
      const { error } = await supabase
        .from("ignition_qualifications")
        .update({
          budget: String(formData.budget),
          completed: true, // Mark as fully completed
        })
        .eq("id", formData.recordId)
        .eq("session_id", formData.sessionId); // Use session ID for secure update

      if (error) {
        throw error;
      }

      setCurrentStep("success");

      // Budget $15K+ gets immediate SavvyCal redirect
      if (formData.budget >= 15000) {
        const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
          formData.email
        )}&display_name=${encodeURIComponent(formData.name)}`;

        setTimeout(() => {
          trackSavvyCalClick(
            "ignition_qualification_form",
            "ignition_alignment",
            {
              budget: formData.budget,
              email: formData.email,
            }
          );
          const newWindow = window.open(savvycalUrl, "_blank");

          // Check if popup was blocked
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            setShowBackupButton(true);
          }
        }, 1500);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error updating budget:", error);
      toast({
        title: "Error",
        description: "Failed to save your budget. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactSubmit = async () => {
    // Validate contact data
    const contactValidation = validateForm(waitlistFormSchema, {
      name: formData.name,
      email: formData.email,
      preferredContact: formData.preferredContact,
      phone: formData.phone,
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
      // Save contact data first (budget will be added in next step)
      const { data, error } = await supabase
        .from("ignition_qualifications")
        .insert({
          budget: "pending", // Will be updated when budget is selected
          needs_rate_reduction: false,
          rate_reduction_reason: null,
          name: formData.name,
          email: formData.email,
          preferred_contact: formData.preferredContact,
          phone: formData.phone,
          completed: false, // Track completion status
          session_id: formData.sessionId, // Include session ID for RLS
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Store the record ID for updating with budget later
      setFormData({ ...formData, recordId: data.id });
      setCurrentStep("budget");
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

  const handleBack = () => {
    if (currentStep === "budget") {
      setCurrentStep("contact");
    }
  };

  if (currentStep === "success") {
    const savvycalUrl =
      formData.budget >= 15000
        ? `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
            formData.email
          )}&display_name=${encodeURIComponent(formData.name)}`
        : "";

    return (
      <Card className={cn("bg-gray-900/50 border-gray-700", className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Thank You, {formData.name}!
              </h3>
              <p className="text-gray-300">
                {formData.budget >= 15000
                  ? showBackupButton
                    ? "Your information has been saved. Click below to schedule your alignment call."
                    : "Redirecting you to schedule your alignment call..."
                  : formData.budget === 0
                  ? "Thanks for your interest! We'll send you vibe coding resources and add you to our community updates."
                  : "We've received your information and will be in touch soon."}
              </p>
            </div>

            {/* SavvyCal button for high budget */}
            {formData.budget >= 15000 && showBackupButton && (
              <Button
                onClick={() => {
                  trackSavvyCalClick(
                    "ignition_qualification_form_backup",
                    "ignition_alignment",
                    {
                      budget: formData.budget,
                      email: formData.email,
                    }
                  );
                  window.open(savvycalUrl, "_blank");
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Schedule Your Call Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}

            {/* Alternative resources based on budget */}
            {formData.budget < 15000 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-white mb-3">
                  While you wait, here are some resources:
                </h4>
                {formData.budget > 0 ? (
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        Check out our{" "}
                        <a
                          href="/resources"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          free resources
                        </a>{" "}
                        on vibe coding
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>Join our newsletter for tips and case studies</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        Explore DIY options with our recommended AI tools
                      </span>
                    </li>
                    {formData.budget >= 1000 && formData.budget < 15000 && (
                      <li className="flex items-start">
                        <span className="text-orange-400 mr-2">•</span>
                        <span>
                          We'll discuss options that might work for your budget
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        Start with our{" "}
                        <a
                          href="/resources"
                          className="text-orange-400 hover:text-orange-300 underline"
                        >
                          free vibe coding guides
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        Learn the fundamentals through our blog and resources
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        Apply to join our community to connect with other
                        builders
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-400 mr-2">•</span>
                      <span>
                        We'll notify you about future cohort programs or group
                        options
                      </span>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gray-900/50 border-gray-700", className)}>
      <CardHeader>
        <CardTitle className="text-white">
          {currentStep === "contact" && "Let's Get Started"}
          {currentStep === "budget" && "Investment Planning"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {currentStep === "contact" && "First, tell us how to reach you"}
          {currentStep === "budget" && "Now, let's discuss your investment level"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === "contact" && (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-white">
                  Phone Number{" "}
                  {formData.preferredContact === "phone" ||
                  formData.preferredContact === "text"
                    ? ""
                    : "(Optional)"}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {(formData.preferredContact === "phone" ||
                  formData.preferredContact === "text") &&
                  !formData.phone && (
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
                  value={formData.preferredContact}
                  onValueChange={(
                    value: "email" | "phone" | "text" | "either"
                  ) => setFormData({ ...formData, preferredContact: value })}
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

            <div className="flex justify-end">
              <Button
                onClick={handleContactSubmit}
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.email ||
                  ((formData.preferredContact === "phone" ||
                    formData.preferredContact === "text") &&
                    !formData.phone)
                }
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "budget" && (
          <div className="space-y-6">
            <BudgetSlider
              min={0}
              max={100000}
              step={500}
              value={formData.budget}
              onChange={handleBudgetChange}
              ranges={BUDGET_RANGES}
              label=""
              description="Select your budget range or enter a specific amount"
              showRecommendations={true}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleBudgetSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
