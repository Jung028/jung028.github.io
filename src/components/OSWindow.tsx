import { ReactNode, useRef, useState, useCallback, useEffect } from "react";

interface WindowProps {
  id: string;
  title: string;
  icon: string;
  children: ReactNode;
  isOpen: boolean;
  isFocused: boolean;
  isMinimized: boolean;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { w: number; h: number };
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  zIndex: number;
}

const OSWindow = ({
  title,
  icon,
  children,
  isOpen,
  isFocused,
  isMinimized,
  defaultPosition = { x: 100, y: 60 },
  defaultSize = { w: 600, h: 420 },
  onClose,
  onFocus,
  onMinimize,
  zIndex,
}: WindowProps) => {
  const [pos, setPos] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [prevState, setPrevState] = useState({ pos: defaultPosition, size: defaultSize });
  const dragRef = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) return;
      onFocus();
      dragRef.current = { startX: e.clientX, startY: e.clientY, originX: pos.x, originY: pos.y };

      const onMove = (ev: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = ev.clientX - dragRef.current.startX;
        const dy = ev.clientY - dragRef.current.startY;
        setPos({ x: dragRef.current.originX + dx, y: Math.max(28, dragRef.current.originY + dy) });
      };
      const onUp = () => {
        dragRef.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [pos, onFocus, isMaximized]
  );

  const toggleMaximize = () => {
    if (isMaximized) {
      setPos(prevState.pos);
      setSize(prevState.size);
      setIsMaximized(false);
    } else {
      setPrevState({ pos, size });
      setPos({ x: 0, y: 28 });
      setSize({ w: window.innerWidth, h: window.innerHeight - 28 - 72 });
      setIsMaximized(true);
    }
  };

  // Clamp position on mount to fit viewport
  useEffect(() => {
    const maxX = window.innerWidth - size.w;
    const maxY = window.innerHeight - size.h - 72;
    setPos((p) => ({
      x: Math.min(Math.max(0, p.x), Math.max(0, maxX)),
      y: Math.min(Math.max(28, p.y), Math.max(28, maxY)),
    }));
  }, []);

  if (!isOpen || isMinimized) return null;

  return (
    <div
      className={`absolute animate-window-open ${isFocused ? "window-shadow" : ""}`}
      style={{
        left: pos.x,
        top: pos.y,
        width: size.w,
        height: size.h,
        zIndex,
        transition: isMaximized ? "all 0.3s cubic-bezier(0.16,1,0.3,1)" : undefined,
      }}
      onMouseDown={onFocus}
    >
      <div className="flex flex-col h-full rounded-xl overflow-hidden glass">
        {/* Title bar */}
        <div
          className="flex items-center gap-3 px-4 py-2.5 bg-window-titlebar/80 select-none cursor-grab active:cursor-grabbing shrink-0"
          onMouseDown={handleMouseDown}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-1.5">
            <button onClick={onClose} className="w-3 h-3 rounded-full bg-traffic-red hover:brightness-110 transition" />
            <button onClick={onMinimize} className="w-3 h-3 rounded-full bg-traffic-yellow hover:brightness-110 transition" />
            <button onClick={toggleMaximize} className="w-3 h-3 rounded-full bg-traffic-green hover:brightness-110 transition" />
          </div>
          <div className="flex items-center gap-2 mx-auto">
            <span className="text-base">{icon}</span>
            <span className="text-xs font-medium text-muted-foreground">{title}</span>
          </div>
          <div className="w-[52px]" /> {/* spacer to center title */}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

export default OSWindow;
