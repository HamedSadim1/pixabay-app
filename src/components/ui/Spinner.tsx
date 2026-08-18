import React from "react";
import { cn } from "@/utils/cn";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

const Spinner: React.FC<SpinnerProps> = ({ size = "md", className = "" }) => (
  <div
    role="status"
    aria-label="Loading"
    className={cn(
      SIZES[size],
      "animate-spin rounded-full border-2 border-line border-t-safelight",
      className,
    )}
  />
);

export default Spinner;
