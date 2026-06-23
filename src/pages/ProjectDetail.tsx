import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";

type ProjectEmbedData = {
  title: string;
  description: string;
  notionUrl: string;
  github?: string;
  live?: string;
};

const PROJECT_EMBEDS: Record<string, ProjectEmbedData> = {
  "ai-payment-chargeback": {
    title: "AI-Powered Payment & Chargeback System",
    description:
      "Full system analysis of a distributed payment platform with AI-driven anomaly detection, DLQ-based retries, and event-driven workflows.",
    notionUrl: "https://glorious-flock-7cf.notion.site/ebd//342d911b2cdb8067bbefcf0b45db1d18",
    github: "https://github.com/Jung028",
  },
  "ai-store-finder": {
    title: "AI-Powered Store Finder",
    description:
      "System analysis of a hackathon project that pairs geo-search with LLM-driven recommendations and live inventory scraping.",
    notionUrl: "https://glorious-flock-7cf.notion.site/ebd//342d911b2cdb8067bbefcf0b45db1d18",
    github: "https://github.com/Jung028",
  },
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = PROJECT_EMBEDS[slug];
  const [loaded, setLoaded] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
        <Link to="/" className="text-primary underline">
          Back home
        </Link>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#191919] text-white overflow-hidden">
      {/* Sticky header */}
      <header className="shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 py-3 bg-[#202020] border-b border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/#projects"
            className="shrink-0 flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </Link>
          <div className="hidden md:block h-4 w-px bg-white/10" />
          <div className="min-w-0">
            <h1 className="text-sm font-semibold truncate">{project.title}</h1>
            <p className="text-[11px] text-white/50 truncate hidden md:block">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
            >
              <Github size={14} /> GitHub
            </a>
          )}
          {project.live && project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
            >
              <ExternalLink size={14} /> Live
            </a>
          )}
        </div>
      </header>

      {/* Notion embed */}
      <main className="flex-1 relative">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            Loading system analysis…
          </div>
        )}
        <iframe
          src={project.notionUrl}
          width="100%"
          height="100%"
          frameBorder={0}
          allowFullScreen
          title={`${project.title} system analysis`}
          onLoad={() => setLoaded(true)}
          className="absolute inset-0"
        />
      </main>
    </div>
  );
};

export default ProjectDetail;