import React from "react";
import { cn } from "@/utils/cn";

interface FrameProps {
  children: React.ReactNode;
  className?: string;
  /** Optional chronological label, e.g. "#001" or "FRAME/01" */
  frame?: string;
}

const Frame: React.FC<FrameProps> = ({ children, className = "", frame }) => {
  return (
    <div className={cn("relative border border-line bg-panel", className)}>
      <span className="vf-corner vf-tl" />
      <span className="vf-corner vf-tr" />
      <span className="vf-corner vf-bl" />
      <span className="vf-corner vf-br" />
      {frame && (
        <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-label text-gold">
          {frame}
        </span>
      )}
      {children}
    </div>
  );
};

export default Frame;
