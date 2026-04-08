import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import LittleAboutMe from "@/components/LittleAboutMe";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import { FileDown, Github, Linkedin } from "lucide-react";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-x-hidden">
        <AppSidebar />
        <SidebarInset className="min-w-0">
          <div className="flex flex-col flex-1 min-w-0">
            <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-2 bg-black/80 backdrop-blur-md px-4 md:px-6 border-none">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-white hover:bg-white/14" />
                <div className="md:hidden text-white">
                  <a href="#" className="text-lg font-bold font-mono">
                    Adam Lim
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-5">
                <a 
                  href="/resume.pdf" 
                  download 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
                  title="Download Resume"
                >
                  <FileDown size={16} />
                  <span className="hidden sm:inline">Resume</span>
                </a>
                <div className="h-4 w-[1px] bg-white/20 hidden sm:block"></div>
                <a 
                  href="https://github.com/Jung028" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-subdued hover:text-white transition-colors"
                  title="GitHub"
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/adam-lim-4247481a5/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-subdued hover:text-white transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </header>
            
            <main className="flex-1 w-full max-w-full overflow-x-hidden">
              <Hero />
              <About />
              <Experience />
              <Projects />
              <LittleAboutMe />
              
              <footer className="py-20 px-6 border-t border-white/5 bg-black">
                <div className="container mx-auto">
                   <p className="text-subdued text-sm font-medium">
                     Contact me here: <a href="mailto:aedamjung@gmail.com" className="text-white hover:underline transition-all">aedamjung@gmail.com</a>
                   </p>
                </div>
              </footer>
              <Footer />
            </main>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Index;
