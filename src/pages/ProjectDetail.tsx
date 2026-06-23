import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Github, ExternalLink } from "lucide-react";

type SubProject = {
  id: string;
  title: string;
  summary: string;
  body: string[];
  tech?: string[];
};

type ProjectDetailData = {
  slug: string;
  title: string;
  description: string;
  github?: string;
  live?: string;
  subProjects: SubProject[];
};

const PROJECT_DETAILS: Record<string, ProjectDetailData> = {
  "ai-payment-chargeback": {
    slug: "ai-payment-chargeback",
    title: "AI-Powered Payment & Chargeback System",
    description:
      "Full system analysis of a distributed payment platform with AI-driven anomaly detection, DLQ-based retries, and event-driven workflows.",
    github: "https://github.com/Jung028",
    subProjects: [
      {
        id: "overview",
        title: "Overview",
        summary: "High-level architecture and goals.",
        body: [
          "The platform is a distributed payment system supporting top-up, refund, and chargeback workflows with strong consistency.",
          "It is composed of independent services communicating over an event bus, with PostgreSQL for transactional state and Redis for hot caches.",
        ],
        tech: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Kafka"],
      },
      {
        id: "payment-service",
        title: "Payment Service",
        summary: "Core ledger, idempotency, and Stripe integration.",
        body: [
          "Handles authorization, capture, and refund flows.",
          "All operations are idempotent via a request-key table to safely retry on network failures.",
          "Stripe is used as the upstream PSP; webhook events drive state transitions.",
        ],
        tech: ["Spring Boot", "Stripe API", "PostgreSQL"],
      },
      {
        id: "chargeback-engine",
        title: "Chargeback Engine",
        summary: "Dispute lifecycle with DLQ-backed retries.",
        body: [
          "Listens to dispute events and orchestrates evidence collection, response packaging, and submission.",
          "Failed steps are pushed to a Dead Letter Queue and retried with exponential backoff.",
        ],
        tech: ["Kafka", "DLQ", "Spring Boot"],
      },
      {
        id: "ai-anomaly",
        title: "AI Anomaly Detection",
        summary: "ML pipeline scoring transactions in near real-time.",
        body: [
          "A Python service consumes transaction events and computes a fraud score using a gradient-boosted model.",
          "Scores above a threshold trigger a hold and notify the review queue.",
        ],
        tech: ["Python", "scikit-learn", "Kafka"],
      },
      {
        id: "frontend",
        title: "Admin Dashboard",
        summary: "React dashboard for ops and dispute reviewers.",
        body: [
          "React + TypeScript SPA for monitoring transactions, managing disputes, and reviewing flagged events.",
          "Uses server-sent events for live updates.",
        ],
        tech: ["React", "TypeScript", "Tailwind"],
      },
    ],
  },
  "ai-store-finder": {
    slug: "ai-store-finder",
    title: "AI-Powered Store Finder",
    description:
      "System analysis of a hackathon project that pairs geo-search with LLM-driven recommendations and live inventory scraping.",
    github: "https://github.com/Jung028",
    subProjects: [
      {
        id: "overview",
        title: "Overview",
        summary: "What the app does and how it is composed.",
        body: [
          "A web app that finds nearby stores by location and preference, and uses an LLM to personalize recommendations.",
          "Built in a weekend hackathon; deployed on Vercel.",
        ],
        tech: ["ReactJS", "TypeScript", "Vercel"],
      },
      {
        id: "map",
        title: "Map & Geo Search",
        summary: "Leaflet-based map with custom clustering.",
        body: [
          "Uses Leaflet and React Leaflet to render the map.",
          "Stores are indexed by geohash for fast bounding-box queries.",
        ],
        tech: ["Leaflet", "React Leaflet"],
      },
      {
        id: "scraper",
        title: "Inventory Scraper",
        summary: "Cheerio-based scraper for real-time inventory.",
        body: [
          "Cheerio scrapes partner store pages on a schedule and normalizes inventory into a shared schema.",
        ],
        tech: ["Cheerio", "Node.js"],
      },
      {
        id: "ai",
        title: "AI Recommendations",
        summary: "Claude-powered personalization layer.",
        body: [
          "Claude API takes the user's preferences and the candidate store list and returns a ranked recommendation with rationale.",
        ],
        tech: ["Claude API"],
      },
    ],
  },
};

const ProjectDetail = () => {
  const { slug = "" } = useParams();
  const project = PROJECT_DETAILS[slug];
  const [activeId, setActiveId] = useState<string>(
    project?.subProjects[0]?.id ?? ""
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

  const active =
    project.subProjects.find((s) => s.id === activeId) ?? project.subProjects[0];

  return (
    <div className="min-h-screen bg-[#191919] text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 md:min-h-screen bg-[#202020] border-b md:border-b-0 md:border-r border-white/5 p-4 md:p-5">
        <Link
          to="/#projects"
          className="flex items-center gap-2 text-xs text-white/60 hover:text-white mb-6"
        >
          <ArrowLeft size={14} /> Back to projects
        </Link>

        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
            System Analysis
          </div>
          <h2 className="font-semibold text-sm leading-snug">{project.title}</h2>
        </div>

        <nav className="flex flex-col gap-0.5">
          {project.subProjects.map((sp) => {
            const isActive = sp.id === active.id;
            return (
              <button
                key={sp.id}
                onClick={() => setActiveId(sp.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded text-left text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <FileText size={14} className="shrink-0 opacity-70" />
                <span className="truncate">{sp.title}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 px-5 md:px-16 py-10 md:py-16 max-w-4xl">
        <div className="text-xs text-white/40 mb-3">
          {project.title} / {active.title}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{active.title}</h1>
        <p className="text-white/60 mb-8">{active.summary}</p>

        <div className="prose prose-invert max-w-none space-y-4 text-white/80 leading-relaxed">
          {active.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {active.tech && active.tech.length > 0 && (
          <div className="mt-8">
            <div className="text-[11px] uppercase tracking-wider text-white/40 mb-2">
              Tech
            </div>
            <div className="flex flex-wrap gap-2">
              {active.tech.map((t) => (
                <span
                  key={t}
                  className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-white/80"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3 border-t border-white/5 pt-6">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <Github size={16} /> GitHub
            </a>
          )}
          {project.live && project.live !== "#" && (
            <a
              href={project.live}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white"
            >
              <ExternalLink size={16} /> Live
            </a>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetail;