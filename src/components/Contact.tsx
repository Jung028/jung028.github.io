import { Mail, Github, Linkedin, Phone, MapPin } from "lucide-react";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/Jung028" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/adam-lim-4247481a5/" },
  { icon: Mail, label: "Email", href: "mailto:aedamjung@gmail.com" },
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

        <div className="flex flex-col items-center gap-6 mb-12">
          <a
            href="mailto:aedamjung@gmail.com"
            className="inline-flex items-center gap-3 px-10 py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all box-glow"
          >
            <Mail size={20} />
            Say Hello
          </a>
          
          <div className="flex flex-col sm:flex-row gap-8 mt-4 text-muted-foreground font-mono text-sm">
            <div className="flex items-center gap-2 justify-center">
              <Phone size={16} className="text-primary" />
              <span>+61 481782129</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <MapPin size={16} className="text-primary" />
              <span>Chippendale, NSW, Australia</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-6">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
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
