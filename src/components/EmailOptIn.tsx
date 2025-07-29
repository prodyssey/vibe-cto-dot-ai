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
  onSuccess?: () => void;
}

export const EmailOptIn: React.FC<EmailOptInProps> = ({
  variant = "default",
  title = "Stay in the Loop",
  description = "Let's ride this wave together.",
  buttonText = "Subscribe",
  className,
  onSuccess,
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const formId = import.meta.env.VITE_CONVERTKIT_FORM_ID || "8281105";

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
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  if (variant === "minimal") {
    return (
      <form
        ref={formRef}
        action={`https://app.kit.com/forms/${formId}/subscriptions`}
        method="post"
        onSubmit={handleSubmit}
        className={cn("flex gap-2 max-w-md", className)}
      >
        <Input
          type="email"
          name="email_address"
          placeholder="Enter your email"
          disabled={status === "loading" || status === "success"}
          className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
          required
        />
        <input type="hidden" name="fields[source]" value="website-signup" />
        <Button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          {status === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : status === "loading" ? (
            "..."
          ) : status === "error" ? (
            "Error"
          ) : (
            buttonText
          )}
        </Button>
      </form>
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
        action={`https://app.kit.com/forms/${formId}/subscriptions`}
        method="post"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <ul className="formkit-alert formkit-alert-error hidden" data-element="errors" data-group="alert"></ul>
        
        <div className="formkit-fields">
          <Input
            type="email"
            name="email_address"
            placeholder="Enter your email"
            disabled={status === "loading" || status === "success"}
            className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
            required
          />
          <input type="hidden" name="fields[source]" value="website-signup" />
        </div>

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