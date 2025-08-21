// ConvertKit helper functions for client-side usage

export interface SubscribeOptions {
  email: string;
  firstName?: string;
  source?: string;
  tags?: string[];
  customFields?: Record<string, string>;
}

export interface SubscribeResponse {
  success: boolean;
  message?: string;
  error?: string;
  subscription?: any;
}

/**
 * Subscribe an email to ConvertKit via our API route
 */
export async function subscribeToConvertKit(options: SubscribeOptions): Promise<SubscribeResponse> {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: data.message || 'Successfully subscribed',
        subscription: data.subscription,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Failed to subscribe',
      };
    }
  } catch (error) {
    console.error('ConvertKit subscription error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

/**
 * Get contextual tags based on the source/context
 */
export function getContextualTags(context: string): string[] {
  const tagMapping: Record<string, string[]> = {
    // Adventure game contexts
    'adventure-ignition': ['adventure-game', 'ignition-interested'],
    'adventure-launch-control': ['adventure-game', 'launch-control-interested'],
    'adventure-transformation': ['adventure-game', 'transformation-interested'],
    
    // Qualification forms
    'ignition-qualification': ['ignition-qualified', 'high-intent'],
    'launch-control-qualification': ['launch-control-qualified', 'high-intent'],
    
    // Waitlists
    'ignition-waitlist': ['ignition-waitlist', 'high-intent'],
    'launch-control-waitlist': ['launch-control-waitlist', 'high-intent'],
    
    // General website
    'website-signup': ['website-visitor'],
    'blog-post': ['blog-reader'],
    'resource-download': ['resource-interested'],
    
    // Budget levels
    'high-budget': ['high-budget', 'qualified-lead'],
    'mid-budget': ['mid-budget'],
    'low-budget': ['low-budget'],
    'exploring': ['exploring'],
  };

  return tagMapping[context] || [];
}

/**
 * Get custom fields based on context and additional data
 */
export function getCustomFields(context: string, data: Record<string, any> = {}): Record<string, string> {
  const fields: Record<string, string> = {
    source: context,
    signup_date: new Date().toISOString(),
  };

  // Add context-specific fields
  if (data.budget !== undefined) {
    fields.budget = String(data.budget);
    
    // Add budget category
    if (data.budget >= 15000) {
      fields.budget_category = 'high';
    } else if (data.budget >= 5000) {
      fields.budget_category = 'mid';
    } else if (data.budget > 0) {
      fields.budget_category = 'low';
    } else {
      fields.budget_category = 'exploring';
    }
  }

  if (data.contactMethod) {
    fields.preferred_contact = data.contactMethod;
  }

  if (data.program) {
    fields.interested_program = data.program;
  }

  if (data.company) {
    fields.company = data.company;
  }

  if (data.currentScale) {
    fields.current_scale = data.currentScale;
  }

  return fields;
}