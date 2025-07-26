import { cn } from '@/lib/utils';

interface LoadingAnimationProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'orbit';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingAnimation = ({
  type = 'spinner',
  size = 'md',
  className,
  text,
}: LoadingAnimationProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-8 h-8', text: 'text-sm' };
      case 'lg':
        return { container: 'w-16 h-16', text: 'text-lg' };
      default:
        return { container: 'w-12 h-12', text: 'text-base' };
    }
  };

  const sizes = getSizeClasses();

  const renderAnimation = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full bg-purple-500',
                  size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3',
                  'animate-bounce'
                )}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        );

      case 'pulse':
        return (
          <div className={cn('relative', sizes.container)}>
            <div className="absolute inset-0 bg-purple-600 rounded-full animate-ping opacity-75" />
            <div className="relative bg-purple-600 rounded-full w-full h-full" />
          </div>
        );

      case 'orbit':
        return (
          <div className={cn('relative', sizes.container)}>
            <div className="absolute inset-0 border-4 border-purple-600/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" />
            <div className="absolute inset-2 border-2 border-transparent border-t-blue-600 rounded-full animate-spin" 
                 style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
        );

      case 'spinner':
      default:
        return (
          <div className={cn('relative', sizes.container)}>
            <div className="absolute inset-0">
              <svg className="w-full h-full animate-spin" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {renderAnimation()}
      {text && (
        <p className={cn('text-purple-300 animate-pulse font-mono', sizes.text)}>
          {text}
        </p>
      )}
    </div>
  );
};