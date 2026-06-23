import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, FileText, ChevronLeft, ChevronRight } from "lucide-react";

type SubPage = {
  id: string;
  title: string;
  notionUrl: string;
};

type ProjectEmbedData = {
  title: string;
  description: string;
  github?: string;
  live?: string;
  pages: SubPage[];
};

const DEFAULT_NOTION =
  "https://glorious-flock-7cf.notion.site/ebd//342d911b2cdb8067bbefcf0b45db1d18";

const PROJECT_EMBEDS: Record<string, ProjectEmbedData> = {
  "ai-payment-chargeback": {
    title: "AI-Powered Payment & Chargeback System",
    description:
      "Distributed payment platform with AI-driven anomaly detection, DLQ retries, and event-driven workflows.",
    github: "https://github.com/Jung028",
    pages: [
      { id: "overview", title: "Overview", notionUrl: DEFAULT_NOTION },
      { id: "payment-service", title: "Payment Service", notionUrl: DEFAULT_NOTION },
      { id: "chargeback-engine", title: "Chargeback Engine", notionUrl: DEFAULT_NOTION },
      { id: "anomaly-detection", title: "AI Anomaly Detection", notionUrl: DEFAULT_NOTION },
      { id: "admin-dashboard", title: "Admin Dashboard", notionUrl: DEFAULT_NOTION },
    ],
  },
  "ai-store-finder": {
    title: "AI-Powered Store Finder",
    description:
      "Hackathon project pairing geo-search with LLM recommendations and live inventory scraping.",
    github: "https://github.com/Jung028",
    pages: [
      { id: "overview", title: "Overview", notionUrl: DEFAULT_NOTION },
      { id: "geo-search", title: "Map & Geo Search", notionUrl: DEFAULT_NOTION },
      { id: "inventory-scraper", title: "Inventory Scraper", notionUrl: DEFAULT_NOTION },
      { id: "recommendations", title: "AI Recommendations", notionUrl: DEFAULT_NOTION },
    ],
  },
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = PROJECT_EMBEDS[slug];
  const [activeId, setActiveId] = useState<string>(project?.pages[0]?.id ?? "");
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const activePage = useMemo(
    () => project?.pages.find((p) => p.id === activeId) ?? project?.pages[0],
    [project, activeId],
  );

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
    <div className="h-screen flex bg-[#191919] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } shrink-0 transition-all duration-200 bg-[#202020] border-r border-white/5 overflow-hidden`}
      >
        <div className="w-64 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-white/5">
            <Link
              to="/#projects"
              className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white"
            >
              <ArrowLeft size={14} /> Back to projects
            </Link>
          </div>
          <div className="px-4 py-3">
            <h2 className="text-sm font-semibold truncate">{project.title}</h2>
            <p className="text-[11px] text-white/50 mt-1 line-clamp-2">{project.description}</p>
          </div>
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-white/40">
              Pages
            </div>
            {project.pages.map((page) => {
              const active = page.id === activePage?.id;
              return (
                <button
                  key={page.id}
                  onClick={() => {
                    setActiveId(page.id);
                    setLoaded(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${
                    active
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <FileText size={14} className="shrink-0 opacity-70" />
                  <span className="truncate">{page.title}</span>
                </button>
              );
            })}
          </nav>
          <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
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
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="shrink-0 flex items-center gap-3 px-4 py-2 bg-[#202020] border-b border-white/5">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <h1 className="text-sm font-medium truncate">{activePage?.title}</h1>
        </header>
        <main className="flex-1 relative bg-[#191919]">
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
              Loading…
            </div>
          )}
          {activePage && (
            <iframe
              key={activePage.id}
              src={activePage.notionUrl}
              width="100%"
              height="100%"
              frameBorder={0}
              allowFullScreen
              title={`${activePage.title} embed`}
              onLoad={() => setLoaded(true)}
              className="absolute inset-0"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProjectDetail;