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
  ghost:
    "border-line bg-transparent text-muted hover:border-safelight hover:text-safelight",
  ghostActive: "border-safelight bg-safelight/10 text-safelight",
  gold: "border-line bg-transparent text-muted hover:border-gold hover:text-gold",
  goldActive: "border-gold bg-gold/10 text-gold",
} as const;

export type ButtonSize = keyof typeof buttonSizes;
export type ButtonVariant = keyof typeof buttonVariants;

// Single entry point for building button class strings, so callers don't have
// to concatenate `buttonBase`/`buttonSizes`/`buttonVariants` by hand (which is
// easy to get wrong and duplicates the Button component's logic).
export function buttonClasses(
  variant: ButtonVariant = "default",
  size: ButtonSize = "md",
  className?: string,
): string {
  return [buttonBase, buttonSizes[size], buttonVariants[variant], className]
    .filter(Boolean)
    .join(" ");
}
