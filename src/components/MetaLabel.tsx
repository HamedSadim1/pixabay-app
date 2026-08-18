import React from "react";

type MetaTone = "muted" | "gold" | "safelight" | "paper";
type MetaTag = "span" | "p" | "div";

const TONES: Record<MetaTone, string> = {
  muted: "text-muted",
  gold: "text-gold",
  safelight: "text-safelight",
  paper: "text-paper",
};

interface MetaLabelProps {
  children: React.ReactNode;
  tone?: MetaTone;
  as?: MetaTag;
  className?: string;
}

// Uppercase mono micro-label for timestamps, coordinates and metadata.
// Defaults to an inline span; pass `as` to keep block-level semantics.
const MetaLabel: React.FC<MetaLabelProps> = ({
  children,
  tone = "muted",
  as: Tag = "span",
  className = "",
}) => (
  <Tag
    className={`font-mono text-[10px] uppercase tracking-meta ${TONES[tone]} ${className}`}
  >
    {children}
  </Tag>
);

export default MetaLabel;
