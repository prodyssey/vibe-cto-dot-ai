import {
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  Info,
  MessageSquare,
} from "lucide-react";
import { useState } from "react";

import { EmailOptIn } from "@/components/EmailOptIn";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackSavvyCalClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { qualificationFormSchema, waitlistFormSchema, validateForm } from "@/lib/validation";

type FormStep =
  | "budget"
  | "rate-reduction"
  | "contact"
  | "success"
  | "alternatives";

interface IgnitionQualificationFormProps {
  onSuccess?: () => void;
  className?: string;
}

interface FormData {
  budget: string;
  needsRateReduction: boolean;
  rateReductionReason?: string;
  name: string;
  email: string;
  preferredContact: "email" | "phone" | "text" | "either";
  phone?: string;
}

const BUDGET_OPTIONS = [
  {
    value: "ready-high",
    label: "$15K - $50K+",
    amount: "Ready to invest",
    description:
      "I understand the investment and I'm ready to transform my idea",
  },
  {
    value: "ready-mid",
    label: "$5K - $15K",
    amount: "Limited budget available",
    description: "I've got a budget, but it's limited",
  },
  {
    value: "ready-low",
    label: "$1 - $4,999",
    amount: "Not ready yet",
    description: "Let's explore alternative options",
  },
  {
    value: "not-ready",
    label: "Just my time",
    amount: "No budget available",
    description: "But I'd like to learn more about vibe coding on my own",
  },
];

export const IgnitionQualificationForm = ({
  onSuccess,
  className,
}: IgnitionQualificationFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>("budget");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackupButton, setShowBackupButton] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    budget: "",
    needsRateReduction: false,
    name: "",
    email: "",
    preferredContact: "email",
  });
  const { toast } = useToast();

  const handleBudgetSelect = (value: string) => {
    setFormData({ ...formData, budget: value });

    // Handle different budget levels
    if (value === "ready-high") {
      // $15K+ goes straight to contact info then SavvyCal
      setFormData({ ...formData, budget: value, needsRateReduction: false });
      setCurrentStep("contact");
    } else if (value === "ready-mid") {
      // $5K-$15K shows rate reduction option
      setFormData({ ...formData, budget: value, needsRateReduction: true });
      setCurrentStep("rate-reduction");
    } else {
      // Under $5K or no budget - redirect to email signup
      setCurrentStep("alternatives");
    }
  };

  const handleRateReductionSubmit = () => {
    setCurrentStep("contact");
  };

  const handleContactSubmit = async () => {
    // Validate qualification data
    const qualValidation = validateForm(qualificationFormSchema, {
      budget: formData.budget,
      needsRateReduction: formData.needsRateReduction,
      rateReductionReason: formData.rateReductionReason,
    });

    if (!qualValidation.success) {
      toast({
        title: "Validation Error",
        description: Object.values(qualValidation.errors)[0],
        variant: "destructive",
      });
      return;
    }

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
      // Try to save qualification data to Supabase
      const { error } = await supabase.from("ignition_qualifications").insert({
        budget: formData.budget,
        needs_rate_reduction: formData.needsRateReduction,
        rate_reduction_reason: formData.rateReductionReason,
        name: formData.name,
        email: formData.email,
        preferred_contact: formData.preferredContact,
        phone: formData.phone,
      });

      if (error) {
        throw error;
      }

      setCurrentStep("success");

      // Only high budget goes straight to SavvyCal
      if (formData.budget === "ready-high") {
        const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
          formData.email
        )}&display_name=${encodeURIComponent(formData.name)}`;

        setTimeout(() => {
          trackSavvyCalClick('ignition_qualification_form', 'ignition_alignment', {
            budget: formData.budget,
            email: formData.email
          });
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
      console.error("Error submitting qualification:", error);
      toast({
        title: "Error",
        description: "Failed to submit your information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStep === "contact" && formData.needsRateReduction) {
      setCurrentStep("rate-reduction");
    } else if (
      currentStep === "rate-reduction" ||
      currentStep === "contact" ||
      currentStep === "alternatives"
    ) {
      setCurrentStep("budget");
    }
  };

  if (currentStep === "success") {
    const savvycalUrl =
      formData.budget === "ready-high"
        ? `https://savvycal.com/craigsturgis/vibecto-ignition-alignment?email=${encodeURIComponent(
            formData.email
          )}&display_name=${encodeURIComponent(formData.name)}`
        : "";

    return (
      <Card className={cn("bg-gray-900/50 border-gray-700", className)}>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold text-white">
              {formData.needsRateReduction
                ? "Application Submitted!"
                : "Success!"}
            </h3>
            <p className="text-gray-300">
              {formData.needsRateReduction
                ? "We'll review your rate reduction application and contact you within 1-2 business days."
                : showBackupButton
                ? "Your information has been saved. Click the button below to schedule your call."
                : "Redirecting you to schedule your alignment call..."}
            </p>

            {showBackupButton && formData.budget === "ready-high" && (
              <Button
                onClick={() => {
                  trackSavvyCalClick('ignition_qualification_form_backup', 'ignition_alignment', {
                    budget: formData.budget,
                    email: formData.email
                  });
                  window.open(savvycalUrl, "_blank");
                }}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Schedule Your Call
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
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
          {currentStep === "budget" && "Let's Check Your Readiness"}
          {currentStep === "rate-reduction" && "Rate Reduction Application"}
          {currentStep === "contact" && "Contact Information"}
          {currentStep === "alternatives" && "Alternative Options"}
        </CardTitle>
        <CardDescription className="text-gray-400">
          {currentStep === "budget" && "What's your budget for this project?"}
          {currentStep === "rate-reduction" &&
            "Tell us why you'd be a great fit for a reduced rate"}
          {currentStep === "contact" && "How can we reach you?"}
          {currentStep === "alternatives" &&
            "Let's find the right path for you"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === "budget" && (
          <RadioGroup
            value={formData.budget}
            onValueChange={handleBudgetSelect}
            className="space-y-3"
          >
            {BUDGET_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-start space-x-3 p-4 rounded-lg border cursor-pointer transition-all",
                  formData.budget === option.value
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-700 hover:border-gray-600"
                )}
              >
                <RadioGroupItem
                  value={option.value}
                  className="mt-1 text-orange-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-white">
                      {option.label}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-300 mt-1">
                    {option.amount}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </RadioGroup>
        )}

        {currentStep === "rate-reduction" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason" className="text-white mb-2">
                What is special about your project that we should consider for a
                possible reduced rate?
              </Label>
              <Textarea
                id="reason"
                placeholder="Tell us about your situation, your idea's potential impact, or why you'd be an ideal candidate for a reduced rate..."
                className="min-h-[120px] bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                value={formData.rateReductionReason || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    rateReductionReason: e.target.value,
                  })
                }
              />
              <p className="text-xs text-gray-500 mt-2">
                We review applications based on potential impact, founder
                background, commitment, and available capacity.
              </p>
            </div>

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
                onClick={handleRateReductionSubmit}
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

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
                onClick={handleContactSubmit}
                disabled={
                  isSubmitting ||
                  !formData.name ||
                  !formData.email ||
                  ((formData.preferredContact === "phone" ||
                    formData.preferredContact === "text") &&
                    !formData.phone)
                }
                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    {formData.needsRateReduction
                      ? "Submit Application"
                      : "Continue to Scheduling"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {currentStep === "alternatives" && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-full bg-orange-500/20 mb-4">
                <Info className="w-8 h-8 text-orange-400" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                Let&apos;s Start with Learning
              </h3>

              <p className="text-gray-300">
                While Ignition requires a minimum investment, you can still
                learn about vibe coding and building products through our
                resources and community.
              </p>
            </div>

            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-6 space-y-4">
              <h4 className="font-semibold text-white">Get Started with:</h4>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Free resources and guides on vibe coding
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Community updates and case studies
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Early access to new tools and techniques
                </li>
                <li className="flex items-start">
                  <span className="text-orange-400 mr-2">•</span>
                  Special offers when you&apos;re ready to invest
                </li>
              </ul>
            </div>

            <EmailOptIn
              variant="minimal"
              title="Join the Vibe Coding Community"
              description="Get free resources and learn to build faster"
              buttonText="Sign Me Up"
              className="border-orange-500/30"
            />

            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Budget Options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
