import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Github, ExternalLink, FileText, ChevronLeft, ChevronRight, Video, Play } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoLightbox } from "@/components/VideoLightbox";

import iagentChatVideo from "@/assets/Projects/ipay/iagent_chat_1.mp4";
import qrTransactionsVideo1 from "@/assets/Projects/ipay/qr_transactions_1.mp4";

type SubPage = {
  id: string;
  title: string;
  notionUrl: string;
  section?: "center" | "feature";
  videos?: string[];
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

const SA_NOTION =
  "https://glorious-flock-7cf.notion.site/ebd//236d911b2cdb80a78310d3ddfb92f965";

const PROJECT_EMBEDS: Record<string, ProjectEmbedData> = {
  "ai-payment-chargeback": {
    title: "AI-Powered Payment Platform",
    description:
      "Distributed payment platform with AI-driven anomaly detection, DLQ retries, and event-driven workflows.",
    github: "https://github.com/Jung028",
    pages: [
      { id: "overview", title: "Account Center [SA]", section: "center", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//2acd911b2cdb80e2bd73f12ce45a7b74" },
      { id: "system-architecture", title: "Business Center [SA]", section: "center", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//2acd911b2cdb80829ef7fcc6debde616" },
      { id: "payment-service", title: "Amount Over Limit OTP Verification [SA]", section: "feature", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//2fad911b2cdb805488dcd938173d3f06" },
      { id: "chargeback-engine", title: "Top Up [SA]", section: "feature", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//32bd911b2cdb80c98103fa9a051de7a6" },
      { id: "anomaly-detection", title: "Agent Center [SA]", section: "center", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//33fd911b2cdb80da88f5fc3e332c51ba", videos: [iagentChatVideo] },
      { id: "admin-dashboard", title: "Real-Time Fraud Detection and Risk Scoring Engine [SA]", section: "feature", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//366d911b2cdb80619045fe2009990ef9" },
      { id: "qr-transactions", title: "QR Transactions for P2P, P2M, R2P, group transfer and imerchant development [SA]", section: "feature", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//342d911b2cdb8067bbefcf0b45db1d18", videos: [qrTransactionsVideo1] },
      { id: "user-center", title: "User Center [SA]", section: "center", notionUrl: "https://glorious-flock-7cf.notion.site/ebd//236d911b2cdb80a78310d3ddfb92f965" },
    ],
  },
  "ai-store-finder": {
    title: "AI-Powered Store Finder",
    description:
      "Hackathon project pairing geo-search with LLM recommendations and live inventory scraping.",
    github: "https://github.com/Jung028",
    pages: [
      { id: "overview", title: "Overview", notionUrl: DEFAULT_NOTION },
      { id: "system-architecture", title: "System Architecture", notionUrl: SA_NOTION },
      { id: "geo-search", title: "Map & Geo Search", notionUrl: DEFAULT_NOTION },
      { id: "inventory-scraper", title: "Inventory Scraper", notionUrl: DEFAULT_NOTION },
      { id: "recommendations", title: "AI Recommendations", notionUrl: DEFAULT_NOTION },
    ],
  },
};

const PageNavGroup = ({
  label,
  pages,
  activeId,
  onSelect,
}: {
  label: string;
  pages: SubPage[];
  activeId?: string;
  onSelect: (id: string) => void;
}) => {
  if (pages.length === 0) return null;
  return (
    <div className="mb-2">
      <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-white/40">{label}</div>
      {pages.map((page) => {
        const active = page.id === activeId;
        return (
          <button
            key={page.id}
            onClick={() => onSelect(page.id)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${
              active ? "bg-white/10 text-white" : "text-white/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <FileText size={14} className="shrink-0 opacity-70" />
            <span className="truncate">{page.title}</span>
          </button>
        );
      })}
    </div>
  );
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = PROJECT_EMBEDS[slug];
  const [activeId, setActiveId] = useState<string>(project?.pages[0]?.id ?? "");
  const [loaded, setLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);

  const activePage = useMemo(
    () => project?.pages.find((p) => p.id === activeId) ?? project?.pages[0],
    [project, activeId],
  );

  const hasSections = useMemo(() => project?.pages.some((p) => p.section) ?? false, [project]);
  const centerPages = useMemo(() => project?.pages.filter((p) => p.section === "center") ?? [], [project]);
  const featurePages = useMemo(() => project?.pages.filter((p) => p.section === "feature") ?? [], [project]);

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

  const selectPage = (id: string) => {
    setActiveId(id);
    setLoaded(false);
    setVideoOpen(false);
  };

  return (
    <div className="h-screen flex bg-background text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } shrink-0 transition-all duration-200 bg-card border-r border-white/5 overflow-hidden`}
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
            {hasSections ? (
              <>
                <PageNavGroup label="Center SA" pages={centerPages} activeId={activePage?.id} onSelect={selectPage} />
                <PageNavGroup label="Feature SA" pages={featurePages} activeId={activePage?.id} onSelect={selectPage} />
              </>
            ) : (
              <PageNavGroup label="Pages" pages={project.pages} activeId={activePage?.id} onSelect={selectPage} />
            )}
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
        <header className="shrink-0 flex items-center gap-3 px-4 py-2 bg-card border-b border-white/5">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
          <h1 className="text-sm font-medium truncate">{activePage?.title}</h1>
        </header>
        <main className="flex-1 flex flex-col min-h-0 bg-background">
          <div className="flex-1 relative min-h-0">
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
          </div>

          {activePage?.videos && activePage.videos.length > 0 && (
            <div className="shrink-0 border-t border-white/5 bg-card px-4 max-h-60 overflow-y-auto">
              <Accordion type="single" collapsible>
                <AccordionItem value="integration-tests" className="border-none">
                  <AccordionTrigger className="text-sm text-white/80 hover:no-underline py-3">
                    <span className="flex items-center gap-2">
                      <Video size={14} className="opacity-70" />
                      Integration Tests ({activePage.videos.length})
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-wrap gap-2 pb-2">
                      {activePage.videos.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setVideoIndex(idx);
                            setVideoOpen(true);
                          }}
                          className="flex items-center gap-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-md px-3 py-2 text-white/80 hover:text-white transition-colors"
                        >
                          <Play size={12} className="fill-current" /> Test Case {idx + 1}
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </main>
      </div>

      <VideoLightbox
        open={videoOpen}
        videos={activePage?.videos ?? []}
        index={videoIndex}
        title={activePage?.title ?? ""}
        onIndexChange={setVideoIndex}
        onOpenChange={setVideoOpen}
      />
    </div>
  );
};

export default ProjectDetail;
