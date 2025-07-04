import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmailOptInProps {
  variant?: "default" | "minimal";
  title?: string;
  description?: string;
  buttonText?: string;
  className?: string;
  buttondownUsername?: string; // Your Buttondown username
}

export const EmailOptIn: React.FC<EmailOptInProps> = ({
  variant = "default",
  title = "Stay in the Loop",
  description = "Let's ride this wave together.",
  buttonText = "Subscribe",
  className,
  buttondownUsername = import.meta.env.VITE_BUTTONDOWN_USERNAME ||
    "your-buttondown-username",
}) => {
  const [status, setStatus] = useState<"idle" | "success">("idle");
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    // Let the form submit naturally to Buttondown
    // Just show success message
    setTimeout(() => {
      setStatus("success");
      if (formRef.current) {
        formRef.current.reset();
      }
      setTimeout(() => setStatus("idle"), 5000);
    }, 100);
  };

  if (variant === "minimal") {
    return (
      <form
        ref={formRef}
        action={`https://buttondown.email/api/emails/embed-subscribe/${buttondownUsername}`}
        method="post"
        target="_blank"
        onSubmit={handleSubmit}
        className={cn("flex gap-2 max-w-md", className)}
      >
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          disabled={status === "success"}
          className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
          required
        />
        <input type="hidden" name="tag" value="website-signup" />
        <Button
          type="submit"
          disabled={status === "success"}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all"
        >
          {status === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
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
        action={`https://buttondown.email/api/emails/embed-subscribe/${buttondownUsername}`}
        method="post"
        target="_blank"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <Input
          type="email"
          name="email"
          placeholder="Enter your email"
          disabled={status === "success"}
          className="bg-gray-800/80 border-gray-600 text-white placeholder:text-gray-400 focus:border-purple-500 focus:ring-purple-500/20"
          required
        />
        <input type="hidden" name="tag" value="website-signup" />

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all text-white font-medium"
          disabled={status === "success"}
        >
          {status === "success" ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Successfully subscribed!
            </span>
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </div>
  );
};
