import { useState } from "react";
import { ExternalLink, Github, FolderKanban, Play, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Project assets
import ipayThumbnail from "@/assets/Projects/ipay/thumbnail.png";
import ipayVideo from "@/assets/Projects/ipay/ipay.mp4";
import iagentChatVideo from "@/assets/Projects/ipay/iagent_chat_1.mp4";
import iagentChatVideoMov from "@/assets/Projects/ipay/iagent_chat_1.mov";
import gatekeepThumbnail from "@/assets/Projects/gatekeep/thumbnail.png";
import gatekeepVideo from "@/assets/Projects/gatekeep/gatekeep.mp4";
import tracelyThumbnail from "@/assets/Projects/tracely/thumbnail.png";

type Project = {
  title: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
  category: string;
  featured: boolean;
  thumbnail: string;
  videos: string[];
  hasDetail?: boolean;
  slug: string;
};

const projects: Project[] = [
  {
    title: "AI-Powered Payment Platform",
    description: "Distributed payment platform supporting top-up, refund, and chargeback workflows with strong consistency. Features AI-driven anomaly detection for fraudulent transactions and robust retry mechanisms using DLQ.",
    tags: ["Java", "Spring Boot", "Python", "PostgreSQL", "Redis", "React", "Stripe API", "Event-driven"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "fintech",
    featured: true,
    thumbnail: ipayThumbnail,
    videos: [ipayVideo, iagentChatVideo, iagentChatVideoMov],
    slug: "ai-payment-chargeback",
  },
  {
    title: "AI-Powered Store Finder",
    description: "A web application that helps users find nearby stores based on their location and preferences. It uses AI to provide personalized recommendations and real-time inventory updates.",
    tags: ["ReactJS", "TypeScript", "Leaflet & React Leaflet", "Vercel", "Cheerio", "Claude API"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "hackathon",
    featured: true,
    thumbnail: gatekeepThumbnail,
    videos: [gatekeepVideo],
    hasDetail: false,
    slug: "ai-store-finder",
  },
  {
    title: "Tracely",
    description: "Agentic incident-response platform that auto-investigates production issues across logs, databases, and code, proposes a multi-step fix plan, and executes it only after human approval.",
    tags: ["Next.js", "Python", "FastAPI", "Claude API", "LangGraph", "PostgreSQL", "Celery", "Redis"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "platform",
    featured: true,
    thumbnail: tracelyThumbnail,
    videos: [],
    hasDetail: false,
    slug: "tracely",
  },
];

const categories = ["all", "fintech", "hackathon", "platform"];

const ProjectCard = ({
  project,
  onOpen,
}: {
  project: Project;
  onOpen: (project: Project, index: number) => void;
}) => {
  const [previewIndex, setPreviewIndex] = useState(0);

  return (
    <div
      onClick={() => onOpen(project, previewIndex)}
      className="bg-[#181818] hover:bg-[#282828] transition-all duration-300 rounded-lg p-3 md:p-4 group cursor-pointer w-full overflow-hidden"
    >
      <div className="relative aspect-video mb-2 shadow-2xl overflow-hidden rounded-md bg-gradient-to-br from-[#333] to-[#121212] flex items-center justify-center border border-white/5">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <FolderKanban className="text-white/10 group-hover:scale-110 transition-transform duration-500" size={44} />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />

        {/* Play button bottom right of image */}
        {project.videos && project.videos.length > 0 && (
          <button
            className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-primary hover:bg-[#1ed760] text-black p-2 rounded-full font-bold shadow-xl transition-all transform hover:scale-110 active:scale-95 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 z-10"
          >
             <Play className="fill-black w-3.5 h-3.5 md:w-4 md:h-4" size={16} />
             <span className="text-[10px] md:text-xs font-bold pr-1">Play Video</span>
          </button>
        )}
      </div>

      {/* Minimised row for picking which clip to view */}
      {project.videos.length > 1 && (
        <div className="flex gap-1.5 mb-3 overflow-x-auto">
          {project.videos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              title={`View clip ${idx + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setPreviewIndex(idx);
              }}
              className={`relative shrink-0 w-12 h-8 rounded overflow-hidden border transition-colors ${
                idx === previewIndex ? "border-primary ring-1 ring-primary" : "border-white/10 hover:border-white/40"
              }`}
            >
              <img src={project.thumbnail} alt="" className="w-full h-full object-cover opacity-60" />
              <Play size={10} className="absolute inset-0 m-auto fill-white text-white" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 min-w-0 flex-1 overflow-hidden">
        <h3 className="font-bold text-base md:text-lg text-white truncate group-hover:whitespace-normal transition-all">
          {project.title}
        </h3>
        <p className="text-subdued text-xs line-clamp-2 leading-relaxed break-words">
          <span className="text-white/40 font-semibold">Description: </span>
          {project.description}
        </p>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white w-fit"
        >
          <Github size={12} />
          <span className="text-white/40 font-semibold">Github:</span>
          <span className="underline">Repository</span>
        </a>
        {project.hasDetail !== false && (
          <Link
            to={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary hover:underline w-fit"
          >
            <BookOpen size={12} /> View full system analysis
          </Link>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleOpenVideo = (project: Project, index = 0) => {
    setSelectedProject(project);
    setCurrentVideoIndex(index);
  };

  const handleNextVideo = () => {
    if (selectedProject && currentVideoIndex < selectedProject.videos.length - 1) {
      setCurrentVideoIndex(prev => prev + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(prev => prev - 1);
    }
  };

  return (
    <section id="projects" className="py-8 md:py-12 bg-black">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold hover:underline cursor-pointer text-white">
            Projects
          </h2>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 md:mb-8 bg-transparent p-0 h-auto gap-2 md:gap-4 flex-wrap">
            {categories.map((cat) => (
              <TabsTrigger 
                key={cat} 
                value={cat} 
                className="capitalize rounded-full px-3 md:px-4 py-1 md:py-1.5 bg-[#2a2a2a] text-white data-[state=active]:bg-white data-[state=active]:text-black border-none text-[10px] md:text-xs"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {projects
                  .filter((p) => cat === "all" || p.category === cat)
                  .map((project) => (
                    <ProjectCard key={project.title} project={project} onOpen={handleOpenVideo} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Video Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
          <DialogContent className="sm:max-w-[90vw] md:max-w-4xl p-0 bg-black/95 border-none overflow-hidden flex flex-col items-center justify-center">
            <DialogTitle className="sr-only">Project Video</DialogTitle>
            <DialogDescription className="sr-only">Video demonstration of {selectedProject?.title}</DialogDescription>
            {selectedProject && (
              <div className="relative w-full max-h-[85vh] flex items-center justify-center group/video overflow-hidden">
                <video 
                  key={selectedProject.videos[currentVideoIndex]}
                  controls 
                  autoPlay 
                  playsInline
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                >
                  <source src={selectedProject.videos[currentVideoIndex]} type="video/quicktime" />
                  <source src={selectedProject.videos[currentVideoIndex]} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Navigation Buttons */}
                {selectedProject.videos.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevVideo();
                      }}
                      disabled={currentVideoIndex === 0}
                      className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-20 ${currentVideoIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextVideo();
                      }}
                      disabled={currentVideoIndex === selectedProject.videos.length - 1}
                      className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-20 ${currentVideoIndex === selectedProject.videos.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Video Indicator */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                      {selectedProject.videos.map((_, idx) => (
                        <div 
                          key={idx}
                          className={`h-1.5 rounded-full transition-all ${idx === currentVideoIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default Projects;
