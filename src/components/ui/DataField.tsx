import React from "react";
import { cn } from "@/utils/cn";

interface DataFieldProps {
  label: string;
  children: React.ReactNode;
  valueClassName?: string;
  className?: string;
}

// Label + value block used for coordinates, address and location details.
const DataField: React.FC<DataFieldProps> = ({
  label,
  children,
  valueClassName = "text-sm text-paper",
  className = "",
}) => (
  <div className={cn("border border-line bg-panel-2 p-4", className)}>
    <div className="mb-2 font-mono text-[10px] uppercase tracking-label text-muted">
      {label}
    </div>
    <p className={cn("font-mono", valueClassName)}>{children}</p>
  </div>
);

export default DataField;
