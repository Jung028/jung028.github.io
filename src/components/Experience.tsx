import { useState } from "react";
import { Clock3, Play, ChevronDown, ChevronUp, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

import antLogo from "@/assets/CareerTracksIcons/ant_international_logo.jpeg";
import logiflowLogo from "@/assets/CareerTracksIcons/logiflow_automation.png";
import roboconLogo from "@/assets/CareerTracksIcons/robocon.jpeg";
import srcLogo from "@/assets/CareerTracksIcons/sunway_robotics_club_logo.jpeg";
import alvaProdLogo from "@/assets/CareerTracksIcons/alva_productions_logo.jpeg";

const experiences = [
  {
    role: "Java Engineer",
    company: "ANT INTERNATIONAL",
    logo: antLogo,
    location: "Malaysia",
    type: "Full-time",
    period: "May 2025 - Feb 2026",
    description: "Integrated chargeback case-management APIs into the risk platform, improving abnormal case handling efficiency by 15%. Built automated risk reporting and alerting jobs to notify business teams when VAMP/ECP thresholds were exceeded, preventing SLA breaches. Developed backend workflows for anomaly detection across dispute materials, chargeback patterns, and reconciliation issues. Performed on-call support, identifying root causes in cross-service failures.",
  },
  {
    role: "Mechatronics Engineer (Software)",
    company: "LOGIFLOW AUTOMATION",
    logo: logiflowLogo,
    location: "Shah Alam, MY",
    type: "Full-time",
    period: "Jan 2025 - Mar 2025",
    description: "Conducted end-to-end testing, optimization, and integration of ASRS and AMR systems at ALPM (OMEGA) and MAERSK by validating workflows, calibrating equipment, ensuring sensor synchronization, verifying rack compatibility, and supporting API-based warehouse automation integration.",
  },
  {
    role: "Head of Event Management",
    company: "SUNWAY ROBOTICS CLUB",
    logo: srcLogo,
    location: "Subang Jaya, MY",
    type: "Full-time",
    period: "Jul 2024 - Jan 2025",
    description: "Led project development and event management initiatives by organizing and overseeing technical workshops and talks—including Arduino, 3D printing, robotics, and a watchmaking workshop in collaboration with Audemars Piguet Singapore and Student LIFE.",
  },
  {
    role: "Software Engineer",
    company: "SUNWAY HUMAC RC - URock Quadruped Team 23/24",
    logo: roboconLogo,
    location: "Subang Jaya, MY",
    type: "Part-time",
    period: "Sep 2023 - Nov 2024",
    description: "Designed and wired electronics to control 12 high-torque servos via ROS using OpenCR and Jetson Nano, programmed Arduino for joint and IMU data communication, and integrated LiDAR and depth camera for autonomous navigation.",
  },
  {
    role: "Software Engineer",
    company: "SUNWAY HUMAC RC - Robocon Team 2024",
    logo: roboconLogo,
    location: "Subang Jaya, MY",
    type: "Part-time",
    period: "Aug 2023 - Jun 2024",
    description: "Programmed autonomous and manual control for Robot 2 to manipulate game balls, developed a machine learning model to detect colored balls and silos, and enabled wireless control via ROS and Arduino.",
  },
  {
    role: "Mobile App Developer (Flutter)",
    company: "ALVA PRODUCTIONS",
    logo: alvaProdLogo,
    location: "Subang Jaya, MY",
    type: "Internship",
    period: "Jan 2023 - Apr 2023",
    description: "Developed a Flutter-based mobile application for film production management, leading a remote team to coordinate tasks, oversee code integration, and ensure seamless development.",
  },
];

const Experience = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="experience" className="py-8 md:py-12 bg-black w-full overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 text-white">Career Tracks</h2>

        <div className="w-full border border-white/5 rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-[25px_1.5fr_1fr_0.8fr] md:grid-cols-[40px_2fr_1.5fr_1fr_1fr] gap-2 md:gap-4 px-3 md:px-4 py-3 bg-white/5 text-subdued text-[10px] md:text-[11px] font-bold uppercase tracking-widest border-b border-white/10">
            <span className="text-center">#</span>
            <span>Title</span>
            <span className="hidden md:block">Location</span>
            <span className="hidden md:block">Job Type</span>
            <span className="flex items-center justify-end md:pr-4">
              <Clock3 size={14} className="hidden md:block" />
              <span className="md:hidden text-[9px]">Date</span>
            </span>
          </div>

          {/* List */}
          <div className="flex flex-col bg-black">
            {experiences.map((exp, i) => {
              const isExpanded = expandedIndex === i;
              return (
                <div key={i} className="border-b border-white/5 last:border-0">
                  <div
                    onClick={() => toggleExpand(i)}
                    className="grid grid-cols-[25px_1.5fr_1fr_0.8fr] md:grid-cols-[40px_2fr_1.5fr_1fr_1fr] gap-2 md:gap-4 px-3 md:px-4 py-4 hover:bg-white/5 transition-all group cursor-pointer items-center overflow-hidden min-h-[72px] md:min-h-[88px]"
                  >
                    <div className="w-8 flex items-center justify-center relative flex-shrink-0">
                      <span className={cn(
                        "text-[#B3B3B3] text-[14px] md:text-[16px] font-normal group-hover:opacity-0 transition-opacity",
                        isExpanded && "opacity-0"
                      )}>
                        {i + 1}
                      </span>
                      <Play 
                        size={14} 
                        className={cn(
                          "absolute inset-0 m-auto text-white fill-white opacity-0 group-hover:opacity-100 transition-opacity blur-[0.2px]",
                          isExpanded && "opacity-100 text-primary fill-primary"
                        )} 
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 md:gap-5 min-w-0 pr-2 h-full">
                       {/* Company Logo Box */}
                       <div className="w-10 h-10 md:w-14 md:h-14 bg-[#1e1e1e] rounded-md flex-shrink-0 flex items-center justify-center border border-white/10 overflow-hidden shadow-2xl group-hover:border-white/20 transition-colors">
                          {exp.logo ? (
                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-white/20 font-bold text-lg">{exp.company.charAt(0)}</span>
                          )}
                       </div>
                       
                       <div className="flex flex-col min-w-0 justify-center">
                         <span className={cn(
                           "font-semibold text-white group-hover:text-primary transition-colors text-[14px] md:text-[16px] leading-tight truncate",
                           isExpanded && "text-primary"
                         )}>
                           {exp.role}
                         </span>
                         <span className="text-[11px] md:text-[13px] text-[#B3B3B3] font-normal truncate mt-1">
                           {exp.company}
                         </span>
                       </div>
                    </div>

                    <span className="hidden md:flex items-center text-[#B3B3B3] text-[13px] font-normal truncate gap-2">
                      {exp.location}
                    </span>

                    <span className="hidden md:block text-[#B3B3B3] text-[13px] font-normal">
                      {exp.type}
                    </span>

                    <div className="flex items-center justify-end gap-3 text-[#B3B3B3]">
                      <span className="text-[10px] md:text-[13px] font-normal whitespace-nowrap text-right pr-2">
                        {exp.period}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="opacity-0 group-hover:opacity-100" />}
                    </div>
                    
                    {/* Mobile-only location/type line */}
                    <div className="md:hidden col-start-2 col-span-2 text-[9px] text-white/40 font-medium mt-0.5 truncate italic">
                      {exp.location} • {exp.type}
                    </div>
                  </div>

                  {/* Expanded Description */}
                  {isExpanded && (
                    <div className="px-10 md:px-20 py-6 bg-white/[0.02] border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-[#B3B3B3] text-sm md:text-base leading-relaxed max-w-4xl whitespace-pre-line">
                        {exp.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
