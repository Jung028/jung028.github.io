import { useState } from "react";

const MenuBar = () => {
  const [time, setTime] = useState(new Date());

  // Update clock every minute
  useState(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  });

  const formatted = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = time.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <div className="fixed top-0 left-0 right-0 h-7 glass-dock flex items-center justify-between px-4 z-[9999] select-none">
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold gradient-text">⌘</span>
        <span className="text-xs font-semibold text-foreground">Portfolio</span>
        <span className="text-xs text-muted-foreground">File</span>
        <span className="text-xs text-muted-foreground">Edit</span>
        <span className="text-xs text-muted-foreground">View</span>
        <span className="text-xs text-muted-foreground">Help</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">{dateStr}</span>
        <span className="text-xs text-foreground font-medium">{formatted}</span>
      </div>
    </div>
  );
};

export default MenuBar;
