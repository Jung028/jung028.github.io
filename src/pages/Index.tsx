import { useState, useCallback } from "react";
import heroBg from "@/assets/hero-bg.jpg";
import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";
import OSWindow from "@/components/OSWindow";
import AboutContent from "@/components/windows/AboutContent";
import ProjectsContent from "@/components/windows/ProjectsContent";
import ResumeContent from "@/components/windows/ResumeContent";
import ContactContent from "@/components/windows/ContactContent";
import TerminalContent from "@/components/windows/TerminalContent";

type WindowId = "terminal" | "about" | "projects" | "resume" | "contact";

interface WindowState {
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
}

const windowConfigs: Record<WindowId, { title: string; icon: string; defaultPos: { x: number; y: number }; defaultSize: { w: number; h: number } }> = {
  terminal: { title: "Terminal", icon: "🖥️", defaultPos: { x: 80, y: 60 }, defaultSize: { w: 560, h: 380 } },
  about: { title: "About Me", icon: "👤", defaultPos: { x: 150, y: 80 }, defaultSize: { w: 480, h: 440 } },
  projects: { title: "Projects", icon: "🚀", defaultPos: { x: 220, y: 100 }, defaultSize: { w: 520, h: 480 } },
  resume: { title: "Resume", icon: "📄", defaultPos: { x: 300, y: 70 }, defaultSize: { w: 500, h: 500 } },
  contact: { title: "Contact", icon: "💬", defaultPos: { x: 360, y: 120 }, defaultSize: { w: 400, h: 440 } },
};

const contentMap: Record<WindowId, React.ReactNode> = {
  terminal: <TerminalContent />,
  about: <AboutContent />,
  projects: <ProjectsContent />,
  resume: <ResumeContent />,
  contact: <ContactContent />,
};

const Index = () => {
  const [windows, setWindows] = useState<Record<WindowId, WindowState>>({
    terminal: { isOpen: true, isMinimized: false, zIndex: 10 },
    about: { isOpen: false, isMinimized: false, zIndex: 1 },
    projects: { isOpen: false, isMinimized: false, zIndex: 1 },
    resume: { isOpen: false, isMinimized: false, zIndex: 1 },
    contact: { isOpen: false, isMinimized: false, zIndex: 1 },
  });

  const [topZ, setTopZ] = useState(11);

  const focusWindow = useCallback((id: WindowId) => {
    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((prev) => ({ ...prev, [id]: { ...prev[id], zIndex: newZ } }));
      return newZ;
    });
  }, []);

  const openWindow = useCallback((id: string) => {
    const wid = id as WindowId;
    setTopZ((z) => {
      const newZ = z + 1;
      setWindows((prev) => ({
        ...prev,
        [wid]: { isOpen: true, isMinimized: false, zIndex: newZ },
      }));
      return newZ;
    });
  }, []);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isOpen: false, isMinimized: false } }));
  }, []);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }));
  }, []);

  const focusedId = (Object.entries(windows) as [WindowId, WindowState][])
    .filter(([, s]) => s.isOpen && !s.isMinimized)
    .sort((a, b) => b[1].zIndex - a[1].zIndex)[0]?.[0];

  const dockItems = (Object.keys(windowConfigs) as WindowId[]).map((id) => ({
    id,
    icon: windowConfigs[id].icon,
    label: windowConfigs[id].title,
    isOpen: windows[id].isOpen,
  }));

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Desktop wallpaper */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-background/50" />

      <MenuBar />

      {/* Windows */}
      {(Object.keys(windowConfigs) as WindowId[]).map((id) => (
        <OSWindow
          key={id}
          id={id}
          title={windowConfigs[id].title}
          icon={windowConfigs[id].icon}
          isOpen={windows[id].isOpen}
          isFocused={focusedId === id}
          isMinimized={windows[id].isMinimized}
          defaultPosition={windowConfigs[id].defaultPos}
          defaultSize={windowConfigs[id].defaultSize}
          zIndex={windows[id].zIndex}
          onClose={() => closeWindow(id)}
          onFocus={() => focusWindow(id)}
          onMinimize={() => minimizeWindow(id)}
        >
          {contentMap[id]}
        </OSWindow>
      ))}

      <Dock items={dockItems} onOpen={openWindow} />
    </div>
  );
};

export default Index;
