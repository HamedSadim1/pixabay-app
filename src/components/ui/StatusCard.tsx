import React from "react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/constants/icons";
import { cn } from "@/utils/cn";

type Tone = "neutral" | "warning" | "gold";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "border-line bg-panel",
  warning: "border-safelight bg-safelight/10",
  gold: "border-gold bg-gold/10",
};

const TONE_ICON_CLASSES: Record<Tone, string> = {
  neutral: "text-muted",
  warning: "text-safelight",
  gold: "text-gold",
};

interface StatusCardProps {
  tone?: Tone;
  icon?: IconName;
  title?: string;
  message?: string;
  actions?: React.ReactNode;
  className?: string;
}

// Centered card for empty/error/loading states: an optional icon, title,
// message and action row, themed by tone.
const StatusCard: React.FC<StatusCardProps> = ({
  tone = "neutral",
  icon,
  title,
  message,
  actions,
  className = "",
}) => (
  <div className={cn("border p-10 text-center", TONE_CLASSES[tone], className)}>
    {icon && (
      <div className={cn("mb-3 text-3xl", TONE_ICON_CLASSES[tone])}>
        <Icon name={icon} />
      </div>
    )}
    {title && (
      <h2 className="mb-2 font-display text-lg uppercase tracking-[0.03em] text-paper">
        {title}
      </h2>
    )}
    {message && (
      <p className={cn("font-mono text-xs text-muted", actions && "mb-5")}>
        {message}
      </p>
    )}
    {actions && (
      <div className="flex flex-wrap justify-center gap-3">{actions}</div>
    )}
  </div>
);

export default StatusCard;
