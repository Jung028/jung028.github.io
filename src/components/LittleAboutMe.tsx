import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import antPhoto1 from "@/assets/LittleAboutMe/ant_intl_1.jpeg";
import antPhoto2 from "@/assets/LittleAboutMe/ant_intl2.jpeg";
import triPhoto1 from "@/assets/LittleAboutMe/triathlon_1.jpeg";
import triPhoto2 from "@/assets/LittleAboutMe/triathlon_2.jpeg";
import food from "@/assets/LittleAboutMe/food.jpg";
import sunsets from "@/assets/LittleAboutMe/sunsets.jpeg";
import firstMeet from "@/assets/LittleAboutMe/first_meet_2026.png";
import mooreParkSunset from "@/assets/LittleAboutMe/moore_park_sunset.jpg";
import usydNightView from "@/assets/LittleAboutMe/night_class_usyd_view.jpg";
import usydSunset from "@/assets/LittleAboutMe/usyd_sunset.jpg";

const facts = [
  { 
    title: "Ant International", 
    description: "Working at Ant International was an incredible experience that allowed me to grow both professionally and personally",
    image: antPhoto1,
    color: "bg-blue-500"
  },
  { 
    title: "Colleagues from Ant International",
    description: "I had the privilege of working with some of the brightest minds in the industry at Ant International.",
    image: antPhoto2,
    color: "bg-red-500"
  },
  { 
    title: "Triathlon Competitions",
    description: "Asia Cup Triathlon in Malaysia",
    image: triPhoto2,
    color: "bg-yellow-500"
  },
  { 
    title: "Triathlon",
    description: "Back in malaysia, I trained with Team Time triathlon",
    image: triPhoto1,
    color: "bg-purple-500"
  },
  { 
    title: "Sunsets",
    description: "Enjoying the sunset after a long day at work",
    image: sunsets,
    color: "bg-green-500"
  },
  {
    title: "Foodie",
    description: "I enjoy the occasional buffets with friends and colleagues",
    image: food,
    color: "bg-orange-500"
  },
  { 
    title: "USYD Sunset",
    description: "Sunsets at Fisher Library",
    image: usydSunset,
    color: "bg-amber-500"
  },
  { 
    title: "Night Class at USYD",
    description: "night classeszzz",
    image: usydNightView,
    color: "bg-indigo-500"
  },
  { 
    title: "Moore Park Sunset",
    description: "Before training, a little sunset view",
    image: mooreParkSunset,
    color: "bg-cyan-500"
  },
  { 
    title: "First Track Meet -2026",
    description: "First 5K race in Sydney Olympic Stadium",
    image: firstMeet,
    color: "bg-pink-500"
  },

];

const LittleAboutMe = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      handleScroll(); // Check initial state
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section id="little-about" className="py-12 md:py-24 bg-black overflow-hidden w-full max-w-full">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">Little about me</h2>

        {/* Scroll Container */}
        <div className="relative group/scroll">
          {/* Blur Fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none opacity-100" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none opacity-100" />

          {/* Nav Buttons */}
          {showLeftArrow && (
            <button 
              onClick={() => scroll("left")}
              className="absolute left-2 top-[35%] z-20 w-8 h-8 md:w-10 md:h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {showRightArrow && (
            <button 
              onClick={() => scroll("right")}
              className="absolute right-2 top-[35%] z-20 w-8 h-8 md:w-10 md:h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          )}

          <div 
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-6 md:pb-8 scrollbar-hide snap-x scroll-smooth whitespace-nowrap px-8 md:px-12"
          >
            {facts.map((fact, i) => (
              <div 
                key={i} 
                className="inline-block flex-shrink-0 w-36 md:w-48 snap-start group cursor-pointer whitespace-normal vertical-top"
              >
                <div className={`aspect-square rounded-lg mb-3 md:mb-4 ${fact.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center text-3xl md:text-4xl font-black text-black/20 overflow-hidden`}>
                  {fact.image ? (
                    <img src={fact.image} alt={fact.title} className="w-full h-full object-cover" />
                  ) : (
                    fact.title.charAt(0)
                  )}
                </div>
                <h3 className="text-white font-bold text-xs md:text-sm mb-1 break-words">{fact.title}</h3>
                <p className="text-subdued text-[10px] md:text-xs leading-relaxed break-words">{fact.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LittleAboutMe;
