import { Mail, Github, Linkedin, Twitter } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@example.com" },
];

const Contact = () => {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <div className="w-16 h-1 bg-primary rounded-full mb-8 mx-auto" />

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          I'm always open to new opportunities, collaborations, or just a friendly chat. 
          Feel free to reach out!
        </p>

        <a
          href="mailto:hello@example.com"
          className="inline-block px-10 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all box-glow mb-12"
        >
          Say Hello
        </a>

        <div className="flex justify-center gap-6">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-12 h-12 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:box-glow transition-all duration-300"
            >
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Contact;
