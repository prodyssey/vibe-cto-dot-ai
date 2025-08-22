import { NextResponse } from "next/server";

// Simple debug endpoint to check ConvertKit configuration
// IMPORTANT: Remove this in production or protect it
export async function GET() {
  // Only allow in non-production environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 404 });
  }

  const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
  const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID;

  return NextResponse.json({
    environment: process.env.NODE_ENV,
    netlifyContext: process.env.CONTEXT,
    deployUrl: process.env.DEPLOY_URL,
    deployPrimeUrl: process.env.DEPLOY_PRIME_URL,
    config: {
      hasSecret: !!CONVERTKIT_API_SECRET,
      secretLength: CONVERTKIT_API_SECRET?.length || 0,
      formId: CONVERTKIT_FORM_ID,
      hasPublicFormId: !!process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID,
      publicFormId: process.env.NEXT_PUBLIC_CONVERTKIT_FORM_ID,
    },
    availableEnvVars: Object.keys(process.env)
      .filter(key => key.includes('CONVERTKIT'))
      .reduce((obj, key) => {
        obj[key] = key.includes('SECRET') ? '[REDACTED]' : process.env[key];
        return obj;
      }, {} as Record<string, string>)
  });
}