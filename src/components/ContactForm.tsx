"use client";

import {
  ArrowRight,
  Phone,
  Mail,
  CheckCircle,
  Loader2,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { sendSlackNotification } from "@/lib/slack";

interface ContactFormProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  inquiryType: string;
  preferredContact: "email" | "phone" | "text" | "either";
  message: string;
  sessionId: string;
}

const INQUIRY_TYPES = [
  { value: "ignition", label: "Ignition Program (Individual Coaching)" },
  { value: "launch-control", label: "Launch Control (Consulting Services)" },
  { value: "transformation", label: "Transformation (Enterprise Solutions)" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "media", label: "Media & Speaking Inquiries" },
  { value: "general", label: "General Questions" },
  { value: "other", label: "Other" },
];

export const ContactForm = ({ className }: ContactFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    company: "",
    inquiryType: "",
    preferredContact: "email",
    message: "",
    sessionId: "",
  });

  // Generate session ID only on client side to prevent hydration mismatch
  useEffect(() => {
    if (!formData.sessionId && typeof crypto !== 'undefined') {
      setFormData(prev => ({ ...prev, sessionId: crypto.randomUUID() }));
    }
  }, [formData.sessionId]);

  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes('@')) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.inquiryType) {
      toast({
        title: "Validation Error",
        description: "Please select the type of inquiry",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.message.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return false;
    }

    if ((formData.preferredContact === "phone" || formData.preferredContact === "text") && !formData.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required for your selected contact method",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase using the dedicated contacts table
      const { data, error } = await supabase
        .from("contacts")
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          company: formData.company || null,
          inquiry_type: formData.inquiryType,
          preferred_contact: formData.preferredContact,
          message: formData.message,
          source: 'contact_form',
          status: 'pending',
          session_id: formData.sessionId,
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        // Continue with Slack notification even if Supabase fails
      }

      // Send Slack notification
      try {
        await sendSlackNotification({
          formType: 'contact_form',
          email: formData.email,
          name: formData.name,
          phone: formData.phone || undefined,
          contactMethod: formData.preferredContact,
          source: 'contact_form',
          sessionId: formData.sessionId,
          additionalData: {
            company: formData.company,
            inquiry_type: formData.inquiryType,
            inquiry_label: INQUIRY_TYPES.find(t => t.value === formData.inquiryType)?.label || formData.inquiryType,
            message: formData.message,
            form_type: 'contact_form',
          },
        });
      } catch (error) {
        console.warn('Failed to send Slack notification:', error);
        // Don't fail the form submission if Slack notification fails
      }

      setIsSubmitted(true);
      
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll get back to you soon.",
      });

    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast({
        title: "Error",
        description: "Failed to send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
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
                We've received your message and will get back to you as soon as we can.
              </p>
            </div>

            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 text-left">
              <h4 className="font-semibold text-white mb-3">
                What happens next?
              </h4>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>We'll review your inquiry and match you with the right team member</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>You'll hear back from us via your preferred contact method</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  <span>If relevant, we'll schedule a call to discuss your needs in detail</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gray-900/50 border-gray-700", className)}>
      <CardHeader>
        <CardTitle className="text-white">
          Send Us a Message
        </CardTitle>
        <CardDescription className="text-gray-400">
          Fill out the form below and we'll get back to you as soon as possible
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="name" className="text-white">
              Name *
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
              Email *
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
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="phone" className="text-white">
              Phone Number{" "}
              {formData.preferredContact === "phone" ||
              formData.preferredContact === "text"
                ? "*"
                : "(Optional)"}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            {(formData.preferredContact === "phone" ||
              formData.preferredContact === "text") &&
              !formData.phone && (
                <p className="text-xs text-purple-400 mt-1">
                  Required for your selected contact method
                </p>
              )}
          </div>

          <div>
            <Label htmlFor="company" className="text-white">
              Company (Optional)
            </Label>
            <Input
              id="company"
              placeholder="Your company"
              className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <Label className="text-white">
            Type of Inquiry *
          </Label>
          <Select
            value={formData.inquiryType}
            onValueChange={(value) =>
              setFormData({ ...formData, inquiryType: value })
            }
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent>
              {INQUIRY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
              />
              <span className="flex items-center gap-2 text-gray-300">
                <Mail className="w-4 h-4 text-purple-400" />
                Email
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
              <RadioGroupItem
                value="phone"
                id="phone-pref"
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
              />
              <span className="flex items-center gap-2 text-gray-300">
                <Phone className="w-4 h-4 text-purple-400" />
                Phone
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
              <RadioGroupItem
                value="text"
                id="text-pref"
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
              />
              <span className="flex items-center gap-2 text-gray-300">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                Text/SMS
              </span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-700/30 transition-colors">
              <RadioGroupItem
                value="either"
                id="either-pref"
                className="border-gray-400 text-purple-500 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-500"
              />
              <span className="text-gray-300">Either is fine</span>
            </label>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="message" className="text-white">
            Message *
          </Label>
          <Textarea
            id="message"
            placeholder="Tell us about your project, question, or how we can help you..."
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 min-h-[120px]"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};