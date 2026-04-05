const AboutContent = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-3xl">
        👨‍💻
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Your Name</h1>
        <p className="text-primary font-mono text-sm">Software Engineer</p>
      </div>
    </div>

    <p className="text-muted-foreground leading-relaxed">
      I'm a software engineer with a passion for building products that make a difference.
      With experience across the full stack, I specialize in creating performant,
      accessible, and beautifully designed web applications.
    </p>
    <p className="text-muted-foreground leading-relaxed">
      When I'm not coding, you'll find me exploring new technologies, contributing to open source,
      or sharing knowledge through writing and mentoring.
    </p>

    <div className="border-t border-border pt-4 mt-4">
      <h3 className="text-sm font-semibold text-foreground mb-3">Quick Info</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">📍</span> San Francisco, CA
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">💼</span> Open to work
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">🎓</span> CS @ MIT
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-primary">☕</span> Coffee lover
        </div>
      </div>
    </div>
  </div>
);

export default AboutContent;
