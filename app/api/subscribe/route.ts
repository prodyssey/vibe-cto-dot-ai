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
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID;

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
      // Add tags in parallel for better performance
      const tagPromises = tags.map((tag) =>
        fetch(`https://api.convertkit.com/v3/tags`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_secret: CONVERTKIT_API_SECRET,
            tag: {
              name: tag,
              email,
            },
          }),
        }).catch((error) => {
          console.warn(`Failed to add tag "${tag}" to ${email}:`, error);
          // Don't fail the whole request if tagging fails
          return null;
        })
      );

      await Promise.allSettled(tagPromises);
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
