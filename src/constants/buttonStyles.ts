export const buttonBase =
  "inline-flex items-center justify-center gap-2 border px-5 py-2.5 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonVariants = {
  default:
    "border-line bg-transparent text-paper hover:border-safelight hover:text-safelight",
  primary:
    "border-safelight bg-safelight text-dark hover:border-gold hover:bg-gold",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
