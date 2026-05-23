import { useRef, useEffect } from "react";
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
import first_house_hackathon from "@/assets/LittleAboutMe/first_house_hackathon.jpeg";

const facts = [
  {
    title: "Ant International",
    description: "Working at Ant International was an incredible experience that allowed me to grow both professionally and personally.",
    image: antPhoto1,
    gradient: "from-blue-600 to-blue-900",
  },
  {
    title: "Colleagues @ Ant",
    description: "I had the privilege of working with some of the brightest minds in the industry.",
    image: antPhoto2,
    gradient: "from-red-600 to-red-900",
  },
  {
    title: "Triathlon — Asia Cup",
    description: "Competed in the Asia Cup Triathlon in Malaysia.",
    image: triPhoto2,
    gradient: "from-yellow-500 to-orange-700",
  },
  {
    title: "Team Time Triathlon",
    description: "Back in Malaysia, I trained with Team Time triathlon.",
    image: triPhoto1,
    gradient: "from-purple-600 to-purple-900",
  },
  {
    title: "Sunsets",
    description: "Enjoying the sunset after a long day at work.",
    image: sunsets,
    gradient: "from-emerald-500 to-teal-800",
  },
  {
    title: "Foodie",
    description: "I enjoy the occasional buffets with friends and colleagues.",
    image: food,
    gradient: "from-orange-500 to-red-700",
  },
  {
    title: "USYD Sunset",
    description: "Sunsets at Fisher Library — a favourite study break.",
    image: usydSunset,
    gradient: "from-amber-500 to-orange-800",
  },
  {
    title: "Night Class",
    description: "Late-night classes with that iconic USYD view.",
    image: usydNightView,
    gradient: "from-indigo-600 to-indigo-900",
  },
  {
    title: "Moore Park",
    description: "A little sunset view before training.",
    image: mooreParkSunset,
    gradient: "from-cyan-500 to-blue-800",
  },
  {
    title: "First Track Meet 2026",
    description: "First 5K race at Sydney Olympic Stadium.",
    image: firstMeet,
    gradient: "from-pink-500 to-rose-800",
  },
  {
    title: "House Hackathon",
    description: "17 hours through the night with teammates. Built Gatekeep — a smarter way to find clothing.",
    image: first_house_hackathon,
    gradient: "from-violet-500 to-purple-900",
  },
];

const LittleAboutMe = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -340 : 340,
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
      handleScroll();
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section id="little-about" className="py-12 md:py-24 bg-black overflow-hidden w-full max-w-full">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-white">Little about me</h2>
        <p className="text-subdued text-xs md:text-sm mb-6 md:mb-10">Hover a card to learn more.</p>

        <div className="relative group/scroll">
          {/* Blur fades */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

          {/* Nav buttons */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-2 top-[40%] z-20 w-9 h-9 md:w-11 md:h-11 bg-black/70 hover:bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all shadow-xl"
            >
              <ChevronLeft size={22} />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-2 top-[40%] z-20 w-9 h-9 md:w-11 md:h-11 bg-black/70 hover:bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all shadow-xl"
            >
              <ChevronRight size={22} />
            </button>
          )}

          {/* Scroll track */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 md:gap-5 pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth px-8 md:px-12"
          >
            {facts.map((fact, i) => (
              <div
                key={i}
                className="group/card flex-shrink-0 snap-start relative overflow-hidden rounded-xl w-52 md:w-64 h-72 md:h-80 cursor-pointer"
              >
                <img
                  src={fact.image}
                  alt={fact.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/card:scale-105"
                  draggable={false}
                />
                {/* Always-visible title bar */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 translate-y-0 group-hover/card:translate-y-full transition-transform duration-300 ease-in-out">
                  <p className="text-white font-semibold text-xs md:text-sm leading-snug drop-shadow">
                    {fact.title}
                  </p>
                </div>
                {/* Hover overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${fact.gradient} flex flex-col justify-end p-5 md:p-6 translate-y-full group-hover/card:translate-y-0 transition-transform duration-300 ease-in-out`}>
                  <h3 className="text-white font-bold text-sm md:text-base mb-2 leading-snug">
                    {fact.title}
                  </h3>
                  <p className="text-white/85 text-xs md:text-sm leading-relaxed">
                    {fact.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LittleAboutMe;
