import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#", username: "@yourname" },
  { icon: Linkedin, label: "LinkedIn", href: "#", username: "in/yourname" },
  { icon: Twitter, label: "Twitter", href: "#", username: "@yourname" },
  { icon: Mail, label: "Email", href: "mailto:hello@example.com", username: "hello@example.com" },
];

const ContactContent = () => (
  <div className="space-y-6">
    <p className="text-muted-foreground text-sm leading-relaxed">
      I'm always open to new opportunities, collaborations, or just a friendly chat. Feel free to reach out!
    </p>

    <div className="space-y-2">
      {socials.map(({ icon: Icon, label, href, username }) => (
        <a
          key={label}
          href={href}
          className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary/80 transition-colors group"
        >
          <div className="w-9 h-9 rounded-lg bg-background/60 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
            <Icon size={16} />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{label}</p>
            <p className="text-xs text-muted-foreground font-mono">{username}</p>
          </div>
        </a>
      ))}
    </div>

    <div className="rounded-lg bg-secondary/30 p-4 text-center">
      <p className="text-xs text-muted-foreground mb-2">Prefer email?</p>
      <a
        href="mailto:hello@example.com"
        className="inline-block px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Say Hello 👋
      </a>
    </div>
  </div>
);

export default ContactContent;
