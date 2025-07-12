import { supabase } from '@/integrations/supabase/client';

import type { AnalyticsEvent } from './types';

interface AnalyticsService {
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  trackPageView: (pageName: string, properties?: Record<string, any>) => void;
  identifyUser: (sessionId: string, properties?: Record<string, any>) => void;
}

class GameAnalytics implements AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;

  async trackEvent(event: AnalyticsEvent): Promise<void> {
    // Add to queue
    this.queue.push(event);

    // Store in Supabase
    try {
      await supabase.from('adventure_analytics').insert({
        session_id: event.sessionId,
        event_type: event.eventType,
        event_data: event.data,
        timestamp: event.timestamp,
      });
    } catch (error) {
      console.error('Failed to track analytics event:', error);
    }

    // Process queue
    this.processQueue();
  }

  trackPageView(pageName: string, properties?: Record<string, any>): void {
    // Integrate with your analytics provider (e.g., Google Analytics, Mixpanel)
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_title: pageName,
        ...properties,
      });
    }
  }

  identifyUser(sessionId: string, properties?: Record<string, any>): void {
    // Identify user in your analytics provider
    if (typeof window !== 'undefined' && (window as any).analytics) {
      (window as any).analytics.identify(sessionId, properties);
    }
  }

  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      // Batch process events if needed
      const events = [...this.queue];
      this.queue = [];

      // Send to your analytics provider
      for (const event of events) {
        this.sendToProvider(event);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  private sendToProvider(event: AnalyticsEvent): void {
    // Send to Google Analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.eventType, {
        event_category: 'adventure_game',
        event_label: event.sessionId,
        ...event.data,
      });
    }

    // Send to other providers as needed
  }
}

// Export singleton instance
export const analytics = new GameAnalytics();

// Hook the analytics service to the game store
export const initializeAnalytics = (sessionId: string): void => {
  analytics.identifyUser(sessionId, {
    game_version: '1.0.0',
    start_time: new Date().toISOString(),
  });
};