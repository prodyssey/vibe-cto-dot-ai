import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL("https://vibecto.ai"),
  title: "VibeCTO.ai - Human help to build better with AI",
  description: "Elite AI augmented engineering and vibe coding guidance",
  keywords: [
    "AI development",
    "vibe coding",
    "augmented engineering",
    "CTO",
    "product development",
  ],
  openGraph: {
    title: "VibeCTO.ai - Human help to build better with AI",
    description: "Elite AI augmented engineering and vibe coding guidance",
    url: "https://vibecto.ai",
    siteName: "VibeCTO.ai",
    images: [
      {
        url: "/vibe-cto-og.png",
        width: 1200,
        height: 630,
        alt: "VibeCTO.ai - Human help to build better with AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VibeCTO.ai - Human help to build better with AI",
    description: "Elite AI augmented engineering and vibe coding guidance",
    images: ["/vibe-cto-og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <GoogleAnalytics />
        <SpeedInsights />
        <Providers>
          <div id="root">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
