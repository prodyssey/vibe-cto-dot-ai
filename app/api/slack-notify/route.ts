import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { WebClient } from '@slack/web-api';

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Request schema
const slackNotifySchema = z.object({
  formType: z.enum(['ignition_waitlist', 'launch_control_waitlist', 'community_waitlist', 'email_subscription']),
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  contactMethod: z.string().optional(),
  source: z.string().optional(),
  sessionId: z.string().optional(),
  isWaitlist: z.boolean().optional(),
  additionalData: z.record(z.string(), z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = slackNotifySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    if (!process.env.SLACK_BOT_TOKEN) {
      console.warn('SLACK_BOT_TOKEN not configured, skipping Slack notification');
      return NextResponse.json({ success: false, error: 'Slack not configured' });
    }

    if (!process.env.SLACK_CHANNEL_ID) {
      console.warn('SLACK_CHANNEL_ID not configured, skipping Slack notification');
      return NextResponse.json({ success: false, error: 'Slack channel not configured' });
    }

    const message = formatFormSubmissionMessage(data);
    
    const result = await slack.chat.postMessage({
      channel: process.env.SLACK_CHANNEL_ID,
      blocks: message.blocks,
      text: message.fallbackText,
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

function formatFormSubmissionMessage(data: any) {
  const { formType, email, name, phone, contactMethod, source, sessionId, isWaitlist, additionalData } = data;
  
  let formTitle = '';
  let color = '#36a64f'; // green
  let emoji = '📝';

  switch (formType) {
    case 'ignition_waitlist':
      formTitle = isWaitlist ? 'Ignition Program Waitlist' : 'Ignition Program Contact';
      color = '#ff6b35'; // orange
      emoji = '🚀';
      break;
    case 'launch_control_waitlist':
      formTitle = isWaitlist ? 'Launch Control Waitlist' : 'Launch Control Contact';
      color = '#0ea5e9'; // blue
      emoji = '🎯';
      break;
    case 'community_waitlist':
      formTitle = 'Community Waitlist';
      color = '#8b5cf6'; // purple
      emoji = '👥';
      break;
    case 'email_subscription':
      formTitle = 'Email Subscription';
      color = '#10b981'; // green
      emoji = '✉️';
      break;
  }

  const fallbackText = `${emoji} New ${formTitle} submission from ${name || email}`;

  const blocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `${emoji} New ${formTitle} Submission`,
        emoji: true
      }
    },
    {
      type: 'section',
      fields: [
        {
          type: 'mrkdwn',
          text: `*Email:*\n${email}`
        },
        ...(name ? [{
          type: 'mrkdwn',
          text: `*Name:*\n${name}`
        }] : []),
        ...(phone ? [{
          type: 'mrkdwn',
          text: `*Phone:*\n${phone}`
        }] : []),
        ...(contactMethod ? [{
          type: 'mrkdwn',
          text: `*Preferred Contact:*\n${contactMethod}`
        }] : []),
        ...(source ? [{
          type: 'mrkdwn',
          text: `*Source:*\n${source}`
        }] : []),
        ...(sessionId ? [{
          type: 'mrkdwn',
          text: `*Session ID:*\n${sessionId}`
        }] : [])
      ]
    },
    {
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `📅 ${new Date().toLocaleString('en-US', { 
            timeZone: 'America/New_York',
            dateStyle: 'medium',
            timeStyle: 'short'
          })} ET`
        }
      ]
    }
  ];

  // Add additional data if present
  if (additionalData && Object.keys(additionalData).length > 0) {
    const additionalFields = Object.entries(additionalData).map(([key, value]) => ({
      type: 'mrkdwn',
      text: `*${key}:*\n${value}`
    }));

    if (additionalFields.length > 0) {
      blocks.splice(-1, 0, {
        type: 'section',
        fields: additionalFields
      });
    }
  }

  return { blocks, fallbackText };
}