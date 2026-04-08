import { Clock3, GraduationCap } from "lucide-react";

const education = [
  {
    school: "UNIVERSITY OF SYDNEY",
    location: "SYDNEY, AUSTRALIA",
    degree: "Ms(Hons) Computer Science",
    period: "Aug 2026 - Present",
  },
  {
    school: "SUNWAY UNIVERSITY & LANCASTER UNIVERSITY",
    location: "MALAYSIA, UK",
    degree: "Bs(Hons) Computer Science",
    period: "Jan 2022 - Jan 2025",
  },
  {
    school: "SUNWAY COLLEGE",
    location: "KUALA LUMPUR, MY",
    degree: "Foundation in Arts",
    period: "Jan 2021 - Jan 2022",
  },
];

const Education = () => {
  return (
    <section id="education" className="py-12 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-white">Academic History</h2>

        <div className="w-full">
          {/* Header */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-white/10 text-subdued text-sm font-bold uppercase tracking-widest mb-4">
            <span className="w-8 text-center">#</span>
            <span>Institution / Degree</span>
            <span className="hidden md:block">Location</span>
            <span className="flex items-center justify-end md:pr-4">
              <Clock3 size={16} />
            </span>
          </div>

          {/* List */}
          <div className="flex flex-col gap-1">
            {education.map((edu, i) => (
              <div
                key={i}
                className="grid grid-cols-[auto_1fr_1fr_auto] gap-4 px-4 py-3 rounded-md hover:bg-white/10 transition-colors group cursor-default"
              >
                <span className="w-8 text-center text-subdued flex items-center justify-center font-mono">
                  {i + 1}
                </span>
                <div className="flex items-center gap-4 overflow-hidden">
                   <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 group-hover:bg-[#333]">
                     <GraduationCap size={20} className="text-subdued group-hover:text-white" />
                   </div>
                   <div className="flex flex-col overflow-hidden">
                     <span className="font-bold text-white group-hover:text-primary transition-colors truncate">
                       {edu.school}
                     </span>
                     <span className="text-xs text-subdued font-bold truncate">
                       {edu.degree}
                     </span>
                   </div>
                </div>
                <span className="hidden md:flex items-center text-subdued text-sm font-bold">
                  {edu.location}
                </span>
                <span className="flex items-center justify-end text-subdued text-sm font-mono md:pr-4">
                  {edu.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
