import { GitFork, Github, Star, Users } from "lucide-react";
import { GITHUB_USERNAME, useGithubStats } from "@/hooks/useGithubStats";

export const GithubStatsCard = () => {
  const { status, data } = useGithubStats();

  if (status !== "success" || !data) {
    return (
      <a
        href={`https://github.com/${GITHUB_USERNAME}`}
        target="_blank"
        rel="noreferrer"
        data-cursor-hover
        className="spotify-card mt-6 flex items-center gap-3 w-fit"
      >
        <Github size={18} className="text-white" />
        <span className="text-subdued text-sm font-medium">View GitHub profile</span>
      </a>
    );
  }

  return (
    <div className="spotify-card mt-6">
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <Github size={18} className="text-white" />
        <a
          href={data.user.html_url}
          target="_blank"
          rel="noreferrer"
          data-cursor-hover
          className="text-white font-semibold text-sm hover:underline"
        >
          @{GITHUB_USERNAME}
        </a>
        <span className="flex items-center gap-1 text-subdued text-xs">
          <Star size={12} /> {data.user.public_repos} repos
        </span>
        <span className="flex items-center gap-1 text-subdued text-xs">
          <Users size={12} /> {data.user.followers} followers
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.repos.map((repo) => (
          <a
            key={repo.name}
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            data-cursor-hover
            className="flex items-center gap-1.5 text-xs bg-secondary hover:bg-accent border border-white/10 rounded-md px-3 py-2 text-subdued hover:text-white transition-colors"
          >
            <GitFork size={12} /> {repo.name}
          </a>
        ))}
      </div>
    </div>
  );
};
