import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const [screenSize, setScreenSize] = useState<'xs' | 'sm' | 'md' | 'lg' | 'xl'>('lg');

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      
      // Update screen size
      if (width < 640) {setScreenSize('xs');}
      else if (width < 768) {setScreenSize('sm');}
      else if (width < 1024) {setScreenSize('md');}
      else if (width < 1280) {setScreenSize('lg');}
      else {setScreenSize('xl');}

      // Check if mobile
      const isMobileDevice = width < 768;
      setIsMobile(isMobileDevice);

      // Check if touch device
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouch(isTouchDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', () => {
      setTimeout(checkMobile, 100); // Delay to get correct dimensions after orientation change
    });

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, []);

  return {
    isMobile,
    isTouch,
    screenSize,
    isSmallScreen: screenSize === 'xs' || screenSize === 'sm',
    isMediumScreen: screenSize === 'md',
    isLargeScreen: screenSize === 'lg' || screenSize === 'xl',
  };
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};