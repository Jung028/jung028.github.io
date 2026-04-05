const experiences = [
  {
    role: "Senior Software Engineer",
    company: "Tech Corp",
    period: "2022 – Present",
    description: "Leading frontend architecture for a platform serving 2M+ users. Building design systems and mentoring junior engineers.",
    tech: ["React", "TypeScript", "GraphQL"],
  },
  {
    role: "Software Engineer",
    company: "Startup Inc",
    period: "2020 – 2022",
    description: "Built core product features from scratch, reducing page load times by 60%. Implemented CI/CD pipelines.",
    tech: ["Next.js", "Node.js", "AWS"],
  },
  {
    role: "Junior Developer",
    company: "Agency Co",
    period: "2018 – 2020",
    description: "Developed responsive web applications for 20+ clients across various industries.",
    tech: ["React", "JavaScript", "CSS"],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Work <span className="gradient-text">Experience</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-12" />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-border" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <div key={i} className="relative pl-8 md:pl-20">
                {/* Dot */}
                <div className="absolute left-0 md:left-8 top-2 w-3 h-3 -translate-x-1.5 rounded-full bg-primary box-glow" />

                <div className="glass rounded-xl p-6 md:p-8 hover:box-glow transition-shadow duration-300">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{exp.role}</h3>
                      <p className="text-primary font-mono text-sm">{exp.company}</p>
                    </div>
                    <span className="text-muted-foreground text-sm font-mono mt-1 md:mt-0">{exp.period}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tech.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full text-xs font-mono bg-secondary text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
