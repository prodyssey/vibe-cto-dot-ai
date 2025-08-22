declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

// Check if GA is properly loaded
const isGALoaded = () => {
  return typeof window !== 'undefined' && 
         typeof window.gtag === 'function' &&
         process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
};

export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (isGALoaded()) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  trackEvent('form_submit', 'engagement', formName);
  
  if (formData && isGALoaded()) {
    window.gtag('event', 'form_submit_details', {
      event_category: 'form_data',
      event_label: formName,
      ...formData
    });
  }
};

export const trackAdventureChoice = (
  sceneName: string,
  choice: string,
  additionalData?: Record<string, any>
) => {
  trackEvent('adventure_choice', 'adventure_game', `${sceneName}: ${choice}`);
  
  if (additionalData && isGALoaded()) {
    window.gtag('event', 'adventure_progress', {
      event_category: 'adventure_game',
      scene: sceneName,
      choice: choice,
      ...additionalData
    });
  }
};

export const trackPageView = (pageName: string, pageLocation?: string) => {
  if (isGALoaded()) {
    window.gtag('event', 'page_view', {
      page_title: pageName,
      page_location: pageLocation || window.location.href,
      page_path: window.location.pathname
    });
  }
};

export const trackConversion = (
  conversionType: string,
  value?: number,
  additionalData?: Record<string, any>
) => {
  if (isGALoaded()) {
    // Track as conversion event
    window.gtag('event', 'conversion', {
      event_category: 'conversions',
      event_label: conversionType,
      value: value,
      ...additionalData
    });
    
    // Also track as specific conversion type
    window.gtag('event', `conversion_${conversionType}`, {
      value: value,
      ...additionalData
    });
  }
};

export const trackSavvyCalClick = (
  source: string,
  destination: string,
  additionalData?: Record<string, any>
) => {
  trackConversion('savvycal_booking_click', undefined, {
    source: source,
    destination: destination,
    ...additionalData
  });
};

// Helper to add tracking to anchor elements
export const addSavvyCalTracking = (
  element: HTMLAnchorElement,
  source: string,
  destination: string,
  additionalData?: Record<string, any>
) => {
  element.addEventListener('click', () => {
    trackSavvyCalClick(source, destination, additionalData);
  });
};