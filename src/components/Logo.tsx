import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Logo = ({ className, size = "md" }: LogoProps) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(sizes[size], className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background circle for better favicon visibility */}
      <circle cx="50" cy="50" r="48" className="fill-slate-900" />
      
      {/* Left bracket */}
      <path
        d="M 30 30 L 20 30 L 20 50 L 20 70 L 30 70"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Wave symbol */}
      <path
        d="M 35 50 Q 42.5 40, 50 50 T 65 50"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Right bracket */}
      <path
        d="M 70 30 L 80 30 L 80 50 L 80 70 L 70 70"
        stroke="url(#gradient)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>
      </defs>
    </svg>
  );
};