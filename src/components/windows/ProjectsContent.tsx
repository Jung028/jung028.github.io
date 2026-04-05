import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Project Alpha",
    description: "Full-stack SaaS platform with real-time collaboration.",
    tags: ["React", "Node.js", "WebSocket"],
    github: "#",
    live: "#",
  },
  {
    title: "DevTools CLI",
    description: "Open-source CLI for automating developer workflows.",
    tags: ["TypeScript", "Node.js", "CLI"],
    github: "#",
    live: "#",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time analytics with custom charts and data viz.",
    tags: ["React", "D3.js", "Python"],
    github: "#",
    live: "#",
  },
  {
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracker with AI recommendations.",
    tags: ["React Native", "TensorFlow"],
    github: "#",
    live: "#",
  },
];

const ProjectsContent = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-bold text-foreground">Projects</h2>
      <span className="text-xs text-muted-foreground font-mono">{projects.length} items</span>
    </div>
    {projects.map((p) => (
      <div
        key={p.title}
        className="rounded-lg bg-secondary/50 p-4 hover:bg-secondary/80 transition-colors group"
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
            {p.title}
          </h3>
          <div className="flex gap-2">
            <a href={p.github} className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={14} />
            </a>
            <a href={p.live} className="text-muted-foreground hover:text-primary transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{p.description}</p>
        <div className="flex gap-1.5">
          {p.tags.map((t) => (
            <span key={t} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-background/60 text-primary">
              {t}
            </span>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default ProjectsContent;
