'use client'

import { Mail, CheckCircle2 } from "lucide-react";
import React, { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { emailOptInFormSchema, validateForm } from "@/lib/validation";

interface EmailOptInProps {
  variant?: "default" | "minimal";
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string>;
  onSuccess?: () => void;
}

export const EmailOptIn: React.FC<EmailOptInProps> = ({
  variant = "default",
  title = "Stay in the Loop",
  description = "Let's ride this wave together.",
  buttonText = "Subscribe",
  className,
  source = "website-signup",
  tags = [],
  customFields = {},
  onSuccess,
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email_address') as string;

    // Validate email
    const validation = validateForm(emailOptInFormSchema, { email });
    if (!validation.success) {
      setError(validation.errors.email || 'Invalid email');
      setStatus("error");
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source,
          tags,
          customFields,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setError(data.error || 'Failed to subscribe');
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setError('Network error. Please try again.');
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (variant === "minimal") {
    return (
      <div className={cn("w-full", className)}>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full"
        >
          <Input
            type="email"
            name="email_address"
            placeholder="Enter your email address"
            disabled={status === "loading" || status === "success"}
            className="flex-1 bg-gray-900/80 border-gray-600/50 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20 focus:ring-2 h-12 px-4 rounded-xl transition-all duration-200"
            required
          />
          <Button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 font-medium h-12 px-6 rounded-xl whitespace-nowrap"
          >
            {status === "success" ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span className="hidden sm:inline">Subscribed!</span>
              </span>
            ) : status === "loading" ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="hidden sm:inline">Subscribing...</span>
              </span>
            ) : status === "error" ? (
              <span className="text-red-200">Try Again</span>
            ) : (
              buttonText
            )}
          </Button>
        </form>
        {error && status === "error" && (
          <p className="text-red-400 text-sm mt-2 text-center">{error}</p>
        )}
        {status === "success" && (
          <p className="text-green-400 text-sm mt-2 text-center font-medium">
            Success! Check your email to confirm your subscription.
          </p>
        )}
        
        {/* Trust indicators for minimal variant */}
        <div className="flex items-center justify-center gap-3 mt-3 text-xs text-gray-500">
          <span>No spam, ever</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>Unsubscribe anytime</span>
          <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
          <span>Weekly insights only</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-2xl p-8 border border-gray-700 shadow-xl",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          type="email"
          name="email_address"
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
          required
        />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-white font-medium"
          disabled={status === "loading" || status === "success"}
        >
          {status === "success" ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Successfully subscribed!
            </span>
          ) : status === "loading" ? (
            "Subscribing..."
          ) : status === "error" ? (
            "Error - Please try again"
          ) : (
            buttonText
          )}
        </Button>
        {error && status === "error" && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>
    </div>
  );
};