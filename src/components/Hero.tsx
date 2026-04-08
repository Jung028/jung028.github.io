import heroBg from "@/assets/hero-bg.jpg";

import { BadgeCheck } from "lucide-react";
import profileImg from "@/assets/Profile/profile.jpg";

const Hero = () => {
  return (
    <section className="relative pt-10 md:pt-20 pb-10 md:pb-16 px-4 md:px-10 overflow-hidden bg-gradient-to-b from-[#45362E] to-black">
      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 animate-fade-in">
        {/* Large Circular Artist Image */}
        <div className="w-40 h-40 md:w-64 md:h-64 rounded-full shadow-2xl flex-shrink-0 flex items-center justify-center border-4 border-black/20 overflow-hidden bg-[#282828]">
            <img 
              src={profileImg} 
              alt="Adam Lim" 
              className="w-full h-full object-cover"
            />
        </div>

        <div className="flex flex-col gap-2 text-center md:text-left w-full">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="p-1 bg-blue-500 rounded-full">
              <BadgeCheck size={12} className="text-white fill-white" />
            </div>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-tight text-white">Verified Engineer</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-2 tracking-tighter text-white leading-none">
            Adam Lim
          </h1>

          <div className="flex flex-col gap-3 md:gap-4">
            <div className="text-xs sm:text-sm md:text-base text-white/80 font-bold flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-1">
              <span className="whitespace-nowrap">Java Backend Engineer</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full hidden sm:block"></span>
                <span className="whitespace-nowrap">5+ working experiences</span>
              </div>
            </div>

            <p className="text-white/60 max-w-xl text-xs sm:text-sm md:text-base leading-relaxed mx-auto md:mx-0 break-words">
              Specializing in java backend development, distributed systems, and event-driven architectures.
              Based in Chippendale, NSW, Australia.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};
export default Hero;
