import type { Metadata } from "next";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Fulfillment Policy - VibeCTO.ai",
  description: "VibeCTO.ai fulfillment policy and terms of service",
  openGraph: {
    title: "Fulfillment Policy - VibeCTO.ai",
    description: "VibeCTO.ai fulfillment policy and terms of service",
    url: "https://vibecto.ai/fulfillment-policy/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fulfillment Policy - VibeCTO.ai",
    description: "VibeCTO.ai fulfillment policy and terms of service",
  },
  alternates: {
    canonical: "https://vibecto.ai/fulfillment-policy/",
  },
};

export default function FulfillmentPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      <Navigation />
      <div className="pt-20 pb-16 px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Fulfillment Policy
            </h1>
            
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 text-lg mb-6">
                <strong>Effective Date:</strong> September 2, 2025
              </p>
              
              <div className="space-y-6 text-gray-300">
                <p className="text-lg leading-relaxed mb-4">
                  This Fulfillment Policy outlines how VibeCTO.ai delivers services and handles payments and refunds. This policy is part of our compliance with Stripe's terms of service for billing.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Service Delivery</h2>
                <p className="text-lg leading-relaxed mb-4">
                  All services provided by VibeCTO.ai are governed by individual Master Service Agreements (MSAs) and Statements of Work (SOWs) that are executed between VibeCTO.ai and each client. These agreements detail the specific services to be provided, timelines, deliverables, and payment terms.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Services are typically delivered according to the schedule outlined in the applicable SOW, with regular check-ins and progress updates provided to clients throughout the engagement.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Payment Terms</h2>
                <p className="text-lg leading-relaxed mb-4">
                  All services are paid for in US Dollars.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Payment terms are specified in each client's Master Service Agreement and applicable Statements of Work. These may include:
                </p>
                <ul className="list-disc pl-8 mb-4 space-y-2">
                  <li>Initial deposits or retainers</li>
                  <li>Milestone-based payments</li>
                  <li>Monthly recurring payments</li>
                  <li>Payment upon completion of deliverables</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4">
                  Invoices are typically issued according to the schedule outlined in the client's agreement and are payable within the timeframe specified in that agreement (usually 15-30 days from invoice date).
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Refund Policy</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Refund terms are governed by each client's Master Service Agreement. In general:
                </p>
                <ul className="list-disc pl-8 mb-4 space-y-2">
                  <li>For services that have not yet been performed, clients may be eligible for a full or partial refund as specified in their agreement.</li>
                  <li>For services that are in progress or have been completed, refunds are handled according to the terms outlined in the client's agreement.</li>
                  <li>Any disputes regarding service quality or delivery will be addressed according to the dispute resolution process outlined in the client's Master Service Agreement.</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4">
                  Specific refund requests should be directed to your VibeCTO.ai representative or by contacting us through our <a href="/contact" className="text-purple-300 hover:text-purple-100 underline">contact page</a>.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Cancellation Policy</h2>
                <p className="text-lg leading-relaxed mb-4">
                  Cancellation terms are specified in each client's Master Service Agreement and may include:
                </p>
                <ul className="list-disc pl-8 mb-4 space-y-2">
                  <li>Notice periods required for cancellation</li>
                  <li>Any fees associated with early termination</li>
                  <li>Handling of any prepaid amounts for services not yet rendered</li>
                </ul>
                <p className="text-lg leading-relaxed mb-4">
                  Clients wishing to cancel services should refer to their agreement for specific terms and procedures.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Contact Information</h2>
                <p className="text-lg leading-relaxed mb-4">
                  For questions about this Fulfillment Policy or to discuss specific payment or refund situations, please contact us through our <a href="/contact" className="text-purple-300 hover:text-purple-100 underline">contact page</a>.
                </p>

                <h2 className="text-2xl font-bold text-white mb-4 mt-8">Policy Updates</h2>
                <p className="text-lg leading-relaxed mb-4">
                  This Fulfillment Policy may be updated from time to time. The most current version will always be posted on this page.
                </p>
                <p className="text-lg leading-relaxed mb-4">
                  Last updated: September 2, 2025
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}