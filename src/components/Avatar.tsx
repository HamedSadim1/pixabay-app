import React from "react";
import { cn } from "@/utils/cn";
import { getInitials } from "@/utils/format";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
  className?: string;
}

const SIZE_CLASSES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
};

const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  size = "md",
  isOnline = false,
  className = "",
}) => {
  return (
    <div className={cn("relative shrink-0", className)}>
      {src ? (
        <img
          src={src}
          alt={`${name} avatar`}
          className={cn(
            SIZE_CLASSES[size],
            "rounded-full border border-line object-cover",
          )}
        />
      ) : (
        <div
          className={cn(
            SIZE_CLASSES[size],
            "flex items-center justify-center rounded-full border border-line bg-panel-2 font-display tracking-wider text-muted",
          )}
        >
          {getInitials(name)}
        </div>
      )}
      {isOnline && (
        <span
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-dark bg-gold"
          role="img"
          aria-label="Online"
        />
      )}
    </div>
  );
};

export default Avatar;
