import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const isCoarsePointer = () => window.matchMedia("(pointer: coarse)").matches;

export const CustomCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const ringY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  useEffect(() => {
    if (isCoarsePointer()) return;
    setEnabled(true);

    const handleMove = (event: PointerEvent) => {
      cursorX.set(event.clientX);
      cursorY.set(event.clientY);
      const target = event.target as HTMLElement;
      setHovering(!!target.closest("[data-cursor-hover]"));
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursorX, cursorY]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-2 w-2 rounded-full bg-primary"
        style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] rounded-full border border-primary"
        animate={{ width: hovering ? 48 : 28, height: hovering ? 48 : 28 }}
        transition={{ duration: 0.2 }}
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
};
