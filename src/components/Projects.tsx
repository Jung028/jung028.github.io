import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Project Alpha",
    description: "A full-stack SaaS platform with real-time collaboration features, built with React and Node.js.",
    tags: ["React", "Node.js", "WebSocket", "PostgreSQL"],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    title: "DevTools CLI",
    description: "An open-source command-line toolkit for automating developer workflows and boosting productivity.",
    tags: ["TypeScript", "Node.js", "CLI"],
    github: "#",
    live: "#",
    featured: true,
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with custom charts, data visualization, and export capabilities.",
    tags: ["React", "D3.js", "Python", "FastAPI"],
    github: "#",
    live: "#",
    featured: false,
  },
  {
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracking app with AI-powered workout recommendations.",
    tags: ["React Native", "TensorFlow", "Firebase"],
    github: "#",
    live: "#",
    featured: false,
  },
];

const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-12" />

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className={`glass rounded-xl p-6 md:p-8 group hover:box-glow transition-all duration-300 ${
                project.featured ? "md:col-span-1" : ""
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-3">
                  <a href={project.github} className="text-muted-foreground hover:text-primary transition-colors">
                    <Github size={18} />
                  </a>
                  <a href={project.live} className="text-muted-foreground hover:text-primary transition-colors">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-mono bg-secondary text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
