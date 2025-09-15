'use client'

import Link from "next/link";
import { Logo } from "./Logo";

export const Footer = () => {
  return (
    <footer className="bg-slate-900/90 backdrop-blur-sm border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-gray-400 max-w-md">
              Human help to build effectively with AI. VibeCTO.ai is a consultancy that helps digital product companies adopt the right AI workflows to accelerate their roadmap.
            </p>
          </div>
          
          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/ai-product-lifecycle-sprint" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  AI Product Lifecycle Sprint
                </Link>
              </li>
              <li>
                <Link 
                  href="/ignition" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Ignition
                </Link>
              </li>
              <li>
                <Link 
                  href="/launch-control" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Launch Control
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Goals */}
          <div>
            <h3 className="text-white font-semibold mb-4">Goals</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/transformation" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  AI Transformation
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/fulfillment-policy" 
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  Fulfillment Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VibeCTO.ai. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm mt-2 md:mt-0">
              Human help to build effectively with AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};