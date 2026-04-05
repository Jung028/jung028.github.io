const TerminalContent = () => (
  <div className="font-mono text-sm space-y-1">
    <p className="text-muted-foreground">Last login: {new Date().toLocaleDateString()} on ttys001</p>
    <p>
      <span className="text-traffic-green">➜</span>{" "}
      <span className="text-primary">~</span> whoami
    </p>
    <p className="text-foreground">your-name</p>
    <p>
      <span className="text-traffic-green">➜</span>{" "}
      <span className="text-primary">~</span> cat welcome.txt
    </p>
    <div className="mt-2 text-muted-foreground leading-relaxed">
      <p>╔═══════════════════════════════════════╗</p>
      <p>║  Welcome to my portfolio!             ║</p>
      <p>║                                       ║</p>
      <p>║  Click the icons in the dock below    ║</p>
      <p>║  to explore my work and background.   ║</p>
      <p>║                                       ║</p>
      <p>║  ✦ About Me    — who I am             ║</p>
      <p>║  ✦ Projects    — what I've built      ║</p>
      <p>║  ✦ Resume      — my experience        ║</p>
      <p>║  ✦ Contact     — let's connect        ║</p>
      <p>╚═══════════════════════════════════════╝</p>
    </div>
    <p className="mt-2">
      <span className="text-traffic-green">➜</span>{" "}
      <span className="text-primary">~</span>{" "}
      <span className="animate-pulse">▌</span>
    </p>
  </div>
);

export default TerminalContent;
