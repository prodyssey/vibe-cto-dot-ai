import { ReactNode } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface StandardLayoutProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared layout component for standard pages (non-adventure pages).
 * Provides consistent Navigation and Footer with proper flex layout.
 */
export function StandardLayout({ children, className = "" }: StandardLayoutProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col ${className}`}>
      <Navigation />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
}