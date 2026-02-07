"use client";

import { useState, useRef, CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setOrigin({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setOrigin({ x: 50, y: 50 });
  };

  const handleClick = () => {
    setIsFullscreen(true);
  };

  return (
    <>
      {/* Zoom container */}
      <div 
        ref={containerRef}
        className="relative w-full h-full overflow-hidden cursor-zoom-in bg-muted/30 group"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          // @ts-ignore - CSS custom properties
          '--origin-x': `${origin.x}%`,
          '--origin-y': `${origin.y}%`,
        } as React.CSSProperties}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className={cn(
            "w-full h-full object-contain transition-transform duration-200 ease-out",
            isHovering && "scale-150 origin-[var(--origin-x)_var(--origin-y)]",
            className
          )}
        />

        {/* Zoom indicator */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/70 text-white px-3 py-2 rounded-lg flex items-center gap-2 text-sm">
            <ZoomIn className="w-4 h-4" />
            <span className="hidden sm:inline">Hover to zoom • Click to fullscreen</span>
            <span className="sm:hidden">Tap to fullscreen</span>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center p-4"
            style={{ zIndex: 200 }}
            onClick={() => setIsFullscreen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
            >
              <X className="w-6 h-6" />
            </Button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
