import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - VibeCTO.ai",
  description: "Get in touch with VibeCTO.ai - Contact us for consulting, partnerships, or general inquiries",
  openGraph: {
    title: "Contact Us - VibeCTO.ai",
    description: "Get in touch with VibeCTO.ai - Contact us for consulting, partnerships, or general inquiries",
    url: "https://vibecto.ai/contact/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - VibeCTO.ai",
    description: "Get in touch with VibeCTO.ai - Contact us for consulting, partnerships, or general inquiries",
  },
  alternates: {
    canonical: "https://vibecto.ai/contact/",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navigation />
      <div className="pt-20 pb-16 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ready to transform your ideas into reality? Have a question about our services? 
              We'd love to hear from you.
            </p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
            <ContactForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}