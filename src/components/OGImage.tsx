import { Logo } from "@/components/Logo";
import { OptimizedImage } from "./OptimizedImage";

export const OGImage = () => {
  return (
    <div className="w-[1200px] h-[630px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-[-300px] left-[-300px] w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-250px] right-[-100px] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[80px]" />
      <div className="absolute top-[50px] right-[200px] w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[80px]" />
      
      <div className="flex items-center justify-between w-full max-w-[1000px] px-20 z-10">
        {/* Left content */}
        <div className="flex-1">
          <div className="flex items-center gap-5 mb-10">
            <div className="w-20 h-20">
              <Logo size="lg" className="w-20 h-20" />
            </div>
            <div className="text-7xl font-black text-white">
              VibeCTO<span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">.ai</span>
            </div>
          </div>
          
          <h2 className="text-5xl font-bold text-white mb-5 leading-tight">
            Human help to build<br />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              with AI
            </span>
          </h2>
          
          <p className="text-2xl text-white/80 leading-relaxed">
            Elite AI augmented engineering and vibe coding guidance.<br />
            I work with builders to adopt AI and accelerate<br />
            roadmaps, operations, and prototypes.
          </p>
        </div>
        
        {/* Avatar */}
        <div className="relative w-[400px] h-[400px] flex items-center justify-center">
          <div className="absolute inset-[-40px] bg-gradient-radial from-purple-500/30 to-transparent blur-[40px]" />
          <OptimizedImage
            src="/lovable-uploads/8dee8e22-c18f-4fb2-b2ea-7fbe8d2fe25a.png"
            alt="VibeCTO Avatar"
            width={380}
            height={380}
            priority
            className="w-[380px] h-[380px] object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]"
            sizes="380px"
          />
        </div>
      </div>
    </div>
  );
};