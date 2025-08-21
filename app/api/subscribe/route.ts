import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Request schema
const subscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  source: z.string().default('website'),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});


// ConvertKit API configuration
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

if (!CONVERTKIT_API_SECRET) {
  console.error('CONVERTKIT_API_SECRET environment variable is required');
}

if (!CONVERTKIT_FORM_ID) {
  console.error('CONVERTKIT_FORM_ID environment variable is required');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    const { email, firstName, source, tags, customFields } = validation.data;

    if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
      console.error('ConvertKit configuration missing');
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    // Subscribe to ConvertKit form
    const convertKitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          email,
          first_name: firstName || '',
          fields: {
            source,
            ...customFields,
          },
          tags: tags || [],
        }),
      }
    );

    if (!convertKitResponse.ok) {
      const errorText = await convertKitResponse.text();
      console.error('ConvertKit API error:', {
        status: convertKitResponse.status,
        statusText: convertKitResponse.statusText,
        body: errorText,
      });

      // Handle known ConvertKit errors
      if (convertKitResponse.status === 400) {
        return NextResponse.json(
          { error: 'Invalid email address or already subscribed' },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to subscribe to email list' },
        { status: 500 }
      );
    }

    const convertKitData = await convertKitResponse.json();
    
    // If we have tags to add and the subscription was successful
    if (tags && tags.length > 0 && convertKitData.subscription) {
      // Add tags to the subscriber
      for (const tag of tags) {
        try {
          await fetch(`https://api.convertkit.com/v3/tags`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_secret: CONVERTKIT_API_SECRET,
              tag: {
                name: tag,
                email,
              },
            }),
          });
        } catch (error) {
          console.warn(`Failed to add tag "${tag}" to ${email}:`, error);
          // Don't fail the whole request if tagging fails
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to email list',
      subscription: convertKitData.subscription,
    });

  } catch (error) {
    console.error('Subscribe API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}