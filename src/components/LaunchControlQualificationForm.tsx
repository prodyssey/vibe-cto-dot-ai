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

type FormStep = "budget" | "contact" | "success";

interface LaunchControlQualificationFormProps {
  onSuccess?: () => void;
  className?: string;
}

interface FormData {
  budget: number;
  name: string;
  email: string;
  preferredContact: "email" | "phone" | "text" | "either";
  phone?: string;
}

const BUDGET_RANGES = [
  {
    min: 0,
    max: 999,
    label: "Just exploring",
    description: "I'd like to learn more about scaling vibe code",
    color: "from-gray-600 to-gray-700",
  },
  {
    min: 1000,
    max: 14999,
    label: "Starter budget",
    description: "Let's explore alternative options",
    color: "from-orange-600 to-amber-600",
  },
  {
    min: 15000,
    max: 39999,
    label: "Growth budget",
    description: "Limited budget but serious about growth",
    color: "from-blue-600 to-cyan-600",
  },
  {
    min: 40000,
    max: 75000,
    label: "Ready to scale",
    description: "I understand the investment needed for scaling success",
    color: "from-green-600 to-emerald-600",
  },
  {
    min: 75001,
    max: 150000,
    label: "Enterprise ready",
    description: "Ready for comprehensive production transformation",
    color: "from-purple-600 to-indigo-600",
  },
];

export const LaunchControlQualificationForm = ({
  onSuccess,
  className,
}: LaunchControlQualificationFormProps) => {
  const [currentStep, setCurrentStep] = useState<FormStep>("budget");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBackupButton, setShowBackupButton] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    budget: 0,
    name: "",
    email: "",
    preferredContact: "email",
  });
  const { toast } = useToast();

  const handleBudgetChange = (value: number) => {
    setFormData({ ...formData, budget: value });
  };

  const handleBudgetContinue = () => {
    // Allow all budgets including $0 to continue
    setCurrentStep("contact");
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
      // Try to save qualification data to Supabase
      const { error } = await supabase
        .from("launch_control_qualifications")
        .insert({
          budget: String(formData.budget),
          needs_rate_reduction: false,
          rate_reduction_reason: null,
          name: formData.name,
          email: formData.email,
          preferred_contact: formData.preferredContact,
          phone: formData.phone,
        });

      if (error) {
        throw error;
      }

      setCurrentStep("success");

      // Budget $40K+ gets immediate SavvyCal redirect
      if (formData.budget >= 40000) {
        const savvycalUrl = `https://savvycal.com/craigsturgis/vibecto-launch-control-alignment?email=${encodeURIComponent(
          formData.email
        )}&display_name=${encodeURIComponent(formData.name)}`;

        setTimeout(() => {
          trackSavvyCalClick(
            "launch_control_qualification_form",
            "launch_control_alignment",
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
    if (currentStep === "contact") {
      setCurrentStep("budget");
    }
  };

  if (currentStep === "success") {
    const savvycalUrl =
      formData.budget === "ready-high"
        ? `https://savvycal.com/craigsturgis/vibecto-launch-control-alignment?email=${encodeURIComponent(
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
                {formData.budget >= 10000
                  ? showBackupButton
                    ? "Your information has been saved. Click below to schedule your mission assessment call."
                    : "Redirecting you to schedule your mission assessment call..."
                  : formData.budget === 0
                  ? "Thanks for your interest! We'll send you scaling best practices and add you to our growth-focused updates."
                  : "We've received your information and will be in touch soon."}
              </p>
            </div>

            {/* SavvyCal button for high budget */}
            {formData.budget >= 10000 && showBackupButton && (
              <Button
                onClick={() => {
                  trackSavvyCalClick(
                    "launch_control_qualification_form_backup",
                    "launch_control_alignment",
                    {
                      budget: formData.budget,
                      email: formData.email,
                    }
                  );
                  window.open(savvycalUrl, "_blank");
                }}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                Schedule Your Call Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )}

            {/* Alternative resources based on budget */}
            {formData.budget < 40000 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-white mb-3">
                  While you wait, here are some resources:
                </h4>
                {formData.budget > 0 ? (
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Review our{" "}
                        <a
                          href="/resources"
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          scaling best practices
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Check out case studies of successful scaling journeys
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Prepare your team with our production readiness
                        checklist
                      </span>
                    </li>
                    {formData.budget >= 15000 && formData.budget < 40000 && (
                      <li className="flex items-start">
                        <span className="text-cyan-400 mr-2">•</span>
                        <span>
                          We'll discuss options that might work for your budget
                        </span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <ul className="space-y-2 text-gray-300 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Start with our{" "}
                        <a
                          href="/resources"
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          free scaling guides
                        </a>
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Learn about production best practices through our
                        resources
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        Consider starting with{" "}
                        <a
                          href="/ignition"
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          Ignition
                        </a>{" "}
                        to build your MVP first
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>
                        We'll notify you about future cohort programs or group
                        workshops
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
          {currentStep === "budget" && "Scaling Investment"}
          {currentStep === "contact" && "Contact Information"}
        </CardTitle>
        {currentStep === "contact" && (
          <CardDescription className="text-gray-400">
            How can mission control reach you?
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        {currentStep === "budget" && (
          <div className="space-y-6">
            <BudgetSlider
              min={0}
              max={150000}
              step={1000}
              value={formData.budget}
              onChange={handleBudgetChange}
              ranges={BUDGET_RANGES}
              label=""
              description="From bootstrap to enterprise - select your investment level"
              showRecommendations={true}
            />

            <div className="flex justify-end">
              <Button
                onClick={handleBudgetContinue}
                disabled={false}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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
                    <p className="text-xs text-cyan-400 mt-1">
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
                      className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
                    />
                    <span className="flex items-center gap-2 text-gray-300">
                      <Mail className="w-4 h-4 text-cyan-400" />
                      Email
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                    <RadioGroupItem
                      value="phone"
                      id="phone-pref"
                      className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
                    />
                    <span className="flex items-center gap-2 text-gray-300">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      Phone
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                    <RadioGroupItem
                      value="text"
                      id="text-pref"
                      className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
                    />
                    <span className="flex items-center gap-2 text-gray-300">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      Text/SMS
                    </span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
                    <RadioGroupItem
                      value="either"
                      id="either-pref"
                      className="border-gray-400 text-cyan-500 data-[state=checked]:border-cyan-500 data-[state=checked]:bg-cyan-500"
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
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Information
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
