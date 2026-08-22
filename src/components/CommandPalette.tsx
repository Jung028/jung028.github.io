import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Briefcase,
  FileDown,
  FolderKanban,
  Github,
  Home,
  Linkedin,
  Mail,
  Moon,
  Sun,
  User,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const SECTION_ITEMS = [
  { id: "hero", label: "Home", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "little-about", label: "Little about me", icon: User },
];

const PROJECT_ITEMS = [
  { slug: "ai-payment-chargeback", label: "AI-Powered Payment Platform" },
  { slug: "ai-store-finder", label: "AI-Powered Store Finder" },
  { slug: "tracely", label: "Tracely" },
  { slug: "sundog", label: "SunDog" },
];

const EXTERNAL_LINKS = [
  { label: "GitHub", url: "https://github.com/Jung028", icon: Github },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/adam-lim-4247481a5/", icon: Linkedin },
  { label: "Download Resume", url: "/resume_2.pdf", icon: FileDown },
  { label: "Email", url: "mailto:aedamjung@gmail.com", icon: Mail },
];

export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? "dark") === "dark";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const runCommand = useCallback((action: () => void) => {
    setOpen(false);
    action();
  }, []);

  const jumpToSection = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate(`/#${id}`);
      return;
    }
    if (id === "hero") {
      // The hero section has no DOM id (see src/components/Hero.tsx), so
      // "Home" means "scroll to the top of the page" rather than jumping to
      // a specific element.
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to a section, project, or action..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Sections">
          {SECTION_ITEMS.map((item) => (
            <CommandItem key={item.id} onSelect={() => runCommand(() => jumpToSection(item.id))}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Projects">
          {PROJECT_ITEMS.map((item) => (
            <CommandItem key={item.slug} onSelect={() => runCommand(() => navigate(`/projects/${item.slug}`))}>
              <FolderKanban className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Links">
          {EXTERNAL_LINKS.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => runCommand(() => window.open(item.url, "_blank", "noopener,noreferrer"))}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => setTheme(isDark ? "light" : "dark"))}>
            {isDark ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
