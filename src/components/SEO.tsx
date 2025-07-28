import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterSite?: string;
  canonicalUrl?: string;
  jsonLd?: object;
}

const SEO = ({
  title = "VibeCTO.ai - From Vibes to Products",
  description = "Elite vibe coding guidance. Transform your ideas into real, secure, scalable products with AI-powered development.",
  keywords = "AI development, CTO services, software development, AI consulting, product development, startup technology, AI transformation",
  ogTitle,
  ogDescription,
  ogImage = "https://vibecto.ai/vibe-cto-og.png",
  ogType = "website",
  twitterCard = "summary_large_image",
  twitterSite = "@vibecto_ai",
  canonicalUrl,
  jsonLd,
}: SEOProps) => {
  const structuredData = jsonLd || {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VibeCTO.ai",
    "description": description,
    "url": "https://vibecto.ai",
    "logo": "https://vibecto.ai/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "hello@vibecto.ai",
      "contactType": "Customer Service"
    },
    "sameAs": [
      "https://twitter.com/vibecto_ai",
      "https://linkedin.com/company/vibecto-ai"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="VibeCTO.ai" />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* JSON-LD structured data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;