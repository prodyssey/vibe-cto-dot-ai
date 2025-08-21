'use client'

import { AdventureGame } from "@/components/adventure/AdventureGame";
import { Navigation } from "@/components/Navigation";

export function AdventureClient() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-x-hidden">
      <Navigation />
      <AdventureGame />
    </div>
  );
}