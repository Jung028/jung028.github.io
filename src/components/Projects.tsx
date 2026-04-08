import { ExternalLink, Github, FolderKanban, Play } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = [
  {
    title: "AI-Powered Payment & Chargeback System",
    description: "Distributed payment platform supporting top-up, refund, and chargeback workflows with strong consistency. Features AI-driven anomaly detection for fraudulent transactions and robust retry mechanisms using DLQ.",
    tags: ["Java", "Spring Boot", "Python", "PostgreSQL", "Redis", "React", "Stripe API", "Event-driven"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "fintech",
    featured: true,
  },
  {
    title: "Quadruped Robotic Dog",
    description: "Final year capstone project focused on the design and autonomous navigation of a quadruped robot in dynamic environments. Integrated ROS and depth cameras for real-time navigation.",
    tags: ["Python", "ROS", "Computer Vision", "Joint Control", "Fusion 360"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "robotics",
    featured: true,
  },

  {
    title: "T-Port Predictive Maintenance",
    description: "Applied machine learning skills to industry-relevant projects, focusing on predictive maintenance and misalignment analysis.",
    tags: ["Python", "Scikit-Learn", "Data Analysis", "Machine Learning"],
    github: "https://github.com/Jung028",
    live: "#",
    category: "data-science",
    featured: false,
  },
];

const categories = ["all", "fintech", "robotics", "data-science"];

const Projects = () => {
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {projects
                  .filter((p) => cat === "all" || p.category === cat)
                  .map((project, i) => (
                    <div
                      key={project.title}
                      className="bg-[#181818] hover:bg-[#282828] transition-all duration-300 rounded-lg p-4 md:p-6 group cursor-pointer w-full overflow-hidden"
                    >
                      <div className="relative aspect-video mb-4 md:mb-6 shadow-2xl overflow-hidden rounded-md bg-gradient-to-br from-[#333] to-[#121212] flex items-center justify-center border border-white/5">
                        <FolderKanban className="text-white/10 group-hover:scale-110 transition-transform duration-500" size={60} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                        
                        {/* Play button bottom right of image */}
                        <button className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-primary hover:bg-[#1ed760] text-black p-2 md:p-3 rounded-full font-bold shadow-xl transition-all transform hover:scale-110 active:scale-95 group-hover:translate-y-0 translate-y-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 md:gap-2">
                           <Play className="fill-black w-4 h-4 md:w-5 md:h-5" size={20} />
                           <span className="text-[10px] md:text-sm font-bold pr-1">Play Video</span>
                        </button>
                      </div>

                      <div className="flex flex-col gap-2 min-w-0 flex-1 overflow-hidden">
                        <h3 className="font-bold text-lg md:text-2xl text-white truncate group-hover:whitespace-normal transition-all">
                          {project.title}
                        </h3>
                        <p className="text-subdued text-xs md:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed break-words">
                          {project.description}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
