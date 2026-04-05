const experiences = [
  {
    role: "Senior Software Engineer",
    company: "Tech Corp",
    period: "2022 – Present",
    description: "Leading frontend architecture for a platform serving 2M+ users.",
    tech: ["React", "TypeScript", "GraphQL"],
  },
  {
    role: "Software Engineer",
    company: "Startup Inc",
    period: "2020 – 2022",
    description: "Built core product features, reducing page load times by 60%.",
    tech: ["Next.js", "Node.js", "AWS"],
  },
  {
    role: "Junior Developer",
    company: "Agency Co",
    period: "2018 – 2020",
    description: "Developed responsive web apps for 20+ clients.",
    tech: ["React", "JavaScript", "CSS"],
  },
];

const skills = ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "GraphQL", "Docker", "AWS", "Kubernetes", "Git", "Figma", "Linux"];

const ResumeContent = () => (
  <div className="space-y-6">
    {/* Skills */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Skills</h3>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((s) => (
          <span key={s} className="px-2.5 py-1 rounded-md text-xs font-mono bg-secondary/70 text-primary">
            {s}
          </span>
        ))}
      </div>
    </div>

    {/* Experience */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Experience</h3>
      <div className="space-y-4">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-4 border-l-2 border-border hover:border-primary transition-colors">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h4 className="text-sm font-semibold text-foreground">{exp.role}</h4>
                <p className="text-xs text-primary font-mono">{exp.company}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{exp.period}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">{exp.description}</p>
            <div className="flex gap-1.5">
              {exp.tech.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-background/60 text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Education */}
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3">Education</h3>
      <div className="pl-4 border-l-2 border-border">
        <h4 className="text-sm font-semibold text-foreground">B.S. Computer Science</h4>
        <p className="text-xs text-primary font-mono">MIT</p>
        <p className="text-xs text-muted-foreground">2014 – 2018</p>
      </div>
    </div>
  </div>
);

export default ResumeContent;
