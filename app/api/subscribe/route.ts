import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Request schema
const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().optional(),
  source: z.string().default("website"),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.string(), z.string()).optional(),
});

// ConvertKit API configuration function
function getConvertKitConfig() {
  const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

  console.log("ConvertKit config check:", {
    hasSecret: !!CONVERTKIT_API_SECRET,
    hasFormId: !!CONVERTKIT_FORM_ID,
    formId: CONVERTKIT_FORM_ID, // Log the actual form ID to debug
    env: process.env.NODE_ENV,
  });

  if (!CONVERTKIT_API_SECRET) {
    console.error("CONVERTKIT_API_SECRET environment variable is required");
  }

  if (!CONVERTKIT_FORM_ID) {
    console.error("CONVERTKIT_FORM_ID environment variable is required");
  }

  return { CONVERTKIT_API_SECRET, CONVERTKIT_FORM_ID };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = subscribeSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validation.error.errors,
        },
        { status: 400 }
      );
    }

    const { email, firstName, source, tags, customFields } = validation.data;

    const { CONVERTKIT_API_SECRET, CONVERTKIT_FORM_ID } = getConvertKitConfig();

    if (!CONVERTKIT_API_SECRET || !CONVERTKIT_FORM_ID) {
      console.error("ConvertKit configuration missing");
      return NextResponse.json(
        { error: "Email service configuration error" },
        { status: 500 }
      );
    }

    // Subscribe to ConvertKit form
    const convertKitResponse = await fetch(
      `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          email,
          first_name: firstName || "",
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
      console.error("ConvertKit API error:", {
        status: convertKitResponse.status,
        statusText: convertKitResponse.statusText,
        body: errorText,
      });

      // Handle known ConvertKit errors with more specific parsing
      if (convertKitResponse.status === 404) {
        console.error(
          "ConvertKit form not found. Check CONVERTKIT_FORM_ID:",
          CONVERTKIT_FORM_ID
        );
        return NextResponse.json(
          { error: "Email subscription service configuration error" },
          { status: 500 }
        );
      }

      if (convertKitResponse.status === 400) {
        try {
          const errorData = JSON.parse(errorText);
          const errorMessage =
            errorData.message ||
            errorData.error ||
            "Invalid email address or already subscribed";
          return NextResponse.json({ error: errorMessage }, { status: 400 });
        } catch {
          return NextResponse.json(
            { error: "Invalid email address or already subscribed" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to subscribe to email list" },
        { status: 500 }
      );
    }

    const convertKitData = await convertKitResponse.json();

    // If we have tags to add and the subscription was successful
    if (tags && tags.length > 0 && convertKitData.subscription) {
      // Add tags using the correct ConvertKit API endpoint
      // Use the subscriber-specific tagging endpoint for better reliability
      const subscriberId = convertKitData.subscription.id;
      
      if (subscriberId) {
        const tagPromises = tags.map(async (tag) => {
          try {
            // First, get or create the tag to get its ID
            const tagResponse = await fetch(`https://api.convertkit.com/v3/tags?api_secret=${CONVERTKIT_API_SECRET}`);
            const tagsData = await tagResponse.json();
            
            let tagId = null;
            if (tagsData.tags) {
              const existingTag = tagsData.tags.find((t: any) => t.name === tag);
              tagId = existingTag?.id;
            }
            
            // If tag doesn't exist, create it
            if (!tagId) {
              const createTagResponse = await fetch(`https://api.convertkit.com/v3/tags`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  api_secret: CONVERTKIT_API_SECRET,
                  tag: { name: tag }
                }),
              });
              
              if (createTagResponse.ok) {
                const newTagData = await createTagResponse.json();
                tagId = newTagData.tag?.id;
              }
            }
            
            // Now tag the subscriber using the tag ID
            if (tagId) {
              const tagSubscriberResponse = await fetch(
                `https://api.convertkit.com/v3/tags/${tagId}/subscribe`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    api_secret: CONVERTKIT_API_SECRET,
                    email,
                  }),
                }
              );
              
              if (!tagSubscriberResponse.ok) {
                console.warn(`Failed to tag subscriber with "${tag}":`, await tagSubscriberResponse.text());
              } else {
                console.log(`Successfully tagged subscriber with "${tag}"`);
              }
            } else {
              console.warn(`Could not create or find tag "${tag}"`);
            }
          } catch (error) {
            console.warn(`Failed to add tag "${tag}" to ${email}:`, error);
            // Don't fail the whole request if tagging fails
          }
        });

        await Promise.allSettled(tagPromises);
      } else {
        console.warn('No subscriber ID returned from ConvertKit, cannot apply tags');
      }
    }

    // Send Slack notification via internal API
    try {
      // Determine site URL using the same logic as OPTIONS method
      let siteUrl = "http://localhost:3000"; // Default fallback
      
      if (process.env.NODE_ENV === "production") {
        siteUrl = "https://vibecto.ai";
      } else if (process.env.NODE_ENV === "development") {
        siteUrl = "http://localhost:8080";
      } else if (process.env.DEPLOY_PRIME_URL) {
        // Netlify deploy preview
        siteUrl = process.env.DEPLOY_PRIME_URL;
      } else if (process.env.DEPLOY_URL) {
        // Netlify branch deploy
        siteUrl = process.env.DEPLOY_URL;
      } else if (process.env.NEXT_PUBLIC_SITE_URL) {
        // Fallback to public site URL if set
        siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
      }

      const slackResponse = await fetch(`${siteUrl}/api/slack-notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'email_subscription',
          email,
          name: firstName,
          source,
          additionalData: customFields,
        }),
      });
      
      if (!slackResponse.ok) {
        console.warn('Slack notification failed');
      }
    } catch (error) {
      console.warn('Failed to send Slack notification:', error);
      // Don't fail the subscription if Slack notification fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to email list",
      subscription: convertKitData.subscription,
    });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  // Determine allowed origin based on environment
  let allowedOrigin = "*"; // Default fallback

  if (process.env.NODE_ENV === "production") {
    allowedOrigin = "https://vibecto.ai";
  } else if (process.env.NODE_ENV === "development") {
    allowedOrigin = "http://localhost:8080";
  } else if (process.env.DEPLOY_PRIME_URL) {
    // Netlify deploy preview
    allowedOrigin = process.env.DEPLOY_PRIME_URL;
  } else if (process.env.DEPLOY_URL) {
    // Netlify branch deploy
    allowedOrigin = process.env.DEPLOY_URL;
  }

  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
