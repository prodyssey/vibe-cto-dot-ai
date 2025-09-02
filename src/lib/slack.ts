interface FormSubmissionData {
  formType: 'ignition_waitlist' | 'launch_control_waitlist' | 'community_waitlist' | 'email_subscription' | 'contact_form';
  email: string;
  name?: string;
  phone?: string;
  contactMethod?: string;
  source?: string;
  sessionId?: string;
  isWaitlist?: boolean;
  additionalData?: Record<string, any>;
}

export async function sendSlackNotification(data: FormSubmissionData) {
  try {
    const response = await fetch('/api/slack-notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    
    if (!response.ok) {
      console.warn('Slack notification failed:', result.error);
      return { success: false, error: result.error };
    }

    return result;
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Network error' };
  }
}