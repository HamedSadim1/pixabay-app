export const buttonBase =
  "inline-flex items-center justify-center gap-2 border font-mono uppercase tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonSizes = {
  sm: "px-3 py-1.5 text-[10px]",
  md: "px-5 py-2.5 text-xs",
} as const;

export const buttonVariants = {
  default:
    "border-line bg-transparent text-paper hover:border-safelight hover:text-safelight",
  primary:
    "border-safelight bg-safelight text-dark hover:border-gold hover:bg-gold",
  gold: "border-line bg-transparent text-muted hover:border-gold hover:text-gold",
} as const;

export type ButtonSize = keyof typeof buttonSizes;
export type ButtonVariant = keyof typeof buttonVariants;
