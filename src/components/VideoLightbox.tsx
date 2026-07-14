import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type VideoLightboxProps = {
  open: boolean;
  videos: string[];
  index: number;
  title: string;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
};

export const VideoLightbox = ({ open, videos, index, title, onIndexChange, onOpenChange }: VideoLightboxProps) => {
  const hasMultiple = videos.length > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-4xl p-0 bg-black/95 border-none overflow-hidden flex flex-col items-center justify-center">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">Video demonstration of {title}</DialogDescription>
        {open && videos[index] && (
          <div className="relative w-full max-h-[85vh] flex items-center justify-center group/video overflow-hidden">
            <video
              key={videos[index]}
              controls
              autoPlay
              playsInline
              className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
            >
              <source src={videos[index]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {hasMultiple && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index > 0) onIndexChange(index - 1);
                  }}
                  disabled={index === 0}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-20 ${index === 0 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (index < videos.length - 1) onIndexChange(index + 1);
                  }}
                  disabled={index === videos.length - 1}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-all z-20 ${index === videos.length - 1 ? "opacity-0 pointer-events-none" : "opacity-100"}`}
                >
                  <ChevronRight size={24} />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                  {videos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${idx === index ? "w-6 bg-primary" : "w-1.5 bg-white/30"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
