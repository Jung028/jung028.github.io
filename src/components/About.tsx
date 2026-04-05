const skills = [
  { category: "Frontend", items: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
  { category: "Backend", items: ["Node.js", "Python", "PostgreSQL", "GraphQL"] },
  { category: "DevOps", items: ["Docker", "AWS", "CI/CD", "Kubernetes"] },
  { category: "Tools", items: ["Git", "Figma", "VS Code", "Linux"] },
];

const About = () => {
  return (
    <section id="about" className="py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          About <span className="gradient-text">Me</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-12" />

        <div className="grid md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed text-lg">
              I'm a software engineer with a passion for building products that make a difference. 
              With experience across the full stack, I specialize in creating performant, 
              accessible, and beautifully designed web applications.
            </p>
            <p className="text-muted-foreground leading-relaxed text-lg">
              When I'm not coding, you'll find me exploring new technologies, contributing to open source,
              or sharing knowledge through writing and mentoring.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {skills.map((group) => (
              <div key={group.category} className="glass rounded-xl p-5 hover:box-glow transition-shadow duration-300">
                <h3 className="font-mono text-primary text-sm mb-3 font-semibold">{group.category}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
