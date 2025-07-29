import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Adventure from "./pages/Adventure";
import Ignition from "./pages/Ignition";
import Index from "./pages/Index";
import Transformation from "./pages/Transformation";
import LaunchControl from "./pages/LaunchControl";
import NotFound from "./pages/NotFound";
import ResourcePost from "./pages/ResourcePost";
import Resources from "./pages/Resources";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Remove the initial loader after React has rendered
    // Use requestAnimationFrame to ensure the DOM has been painted
    requestAnimationFrame(() => {
      if ((window as any).removeInitialLoader) {
        (window as any).removeInitialLoader();
      }
    });
  }, []);

  return (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/adventure" element={<Adventure />} />
            <Route path="/ignition" element={<Ignition />} />
            <Route path="/launch-control" element={<LaunchControl />} />
            <Route path="/transformation" element={<Transformation />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/:slug" element={<ResourcePost />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
