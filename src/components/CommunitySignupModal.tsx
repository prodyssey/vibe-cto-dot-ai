import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CommunityWaitlistForm } from "./CommunityWaitlistForm";

interface CommunitySignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
  source?: string;
  initialData?: {
    name?: string;
    email?: string;
    phone?: string;
    contactMethod?: string;
  };
}

export const CommunitySignupModal = ({
  isOpen,
  onClose,
  sessionId,
  source = "website",
  initialData,
}: CommunitySignupModalProps) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSuccess = () => {
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900/95 backdrop-blur-lg border border-gray-700/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            {isSuccess ? "Welcome to the Community!" : "Join Our Community"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {isSuccess 
              ? "Thanks for your interest! We'll reach out when spots open up in our exclusive community."
              : "Connect with other founders, get peer support, and access exclusive resources."
            }
          </DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-6 pt-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-6 h-6 bg-green-500 rounded-full" />
              </div>
              <p className="text-gray-300 mb-6">
                You're on the waitlist! We'll notify you when spots become available.
                In the meantime, check out our free resources and join our newsletter.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => window.open('/resources', '_blank')}
                variant="outline"
                className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/20"
              >
                Browse Resources
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <CommunityWaitlistForm
            sessionId={sessionId}
            source={source}
            onSuccess={handleSuccess}
            buttonText="Join Community Waitlist"
            successMessage="We're building an exclusive community and will reach out when spots open up."
            initialData={initialData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};