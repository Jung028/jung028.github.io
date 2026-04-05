import { useState } from "react";

interface DockItem {
  id: string;
  icon: string;
  label: string;
  isOpen: boolean;
}

interface DockProps {
  items: DockItem[];
  onOpen: (id: string) => void;
}

const Dock = ({ items, onOpen }: DockProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[9998]">
      <div className="glass-dock rounded-2xl px-3 py-2 flex items-end gap-1">
        {items.map((item) => {
          const isHovered = hoveredId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onOpen(item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative flex flex-col items-center group transition-all duration-200"
              style={{
                transform: isHovered ? "translateY(-8px) scale(1.3)" : "translateY(0) scale(1)",
                transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              {/* Tooltip */}
              {isHovered && (
                <div className="absolute -top-8 px-2 py-0.5 rounded-md bg-secondary text-xs text-foreground font-medium whitespace-nowrap">
                  {item.label}
                </div>
              )}
              <div className="w-11 h-11 rounded-xl bg-secondary/80 flex items-center justify-center text-xl hover:bg-secondary transition-colors">
                {item.icon}
              </div>
              {/* Open indicator */}
              {item.isOpen && (
                <div className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Dock;
