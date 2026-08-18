import React from "react";
import { cn } from "@/utils/cn";

interface SprocketStripProps {
  label?: string;
  className?: string;
}

const SprocketStrip: React.FC<SprocketStripProps> = ({
  label,
  className = "",
}) => {
  return (
    <div
      className={cn("flex items-center gap-4", className)}
      aria-hidden={!label}
    >
      <span className="sprocket flex-1" aria-hidden="true" />
      {label && (
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          {label}
        </span>
      )}
      <span className="sprocket flex-1" aria-hidden="true" />
    </div>
  );
};

export default SprocketStrip;
