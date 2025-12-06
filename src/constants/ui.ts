// UI Constants - Colors, spacing, and other design tokens

export const COLORS = {
  primary: {
    500: "purple-500",
    600: "purple-600",
    300: "purple-300",
  },
  secondary: {
    800: "slate-800",
    600: "slate-600",
  },
  background: {
    glass: "white/10",
    glassHover: "white/20",
    dark: "slate-800/60",
  },
  text: {
    primary: "white",
    secondary: "gray-300",
    muted: "gray-400",
  },
} as const;

export const SPACING = {
  small: "px-3 py-1",
  medium: "px-4 py-3",
  large: "px-6 py-3",
} as const;

export const BORDER_RADIUS = {
  small: "rounded-lg",
  medium: "rounded-xl",
} as const;

export const TRANSITIONS = {
  default: "transition-all duration-300",
  hover: "hover:scale-105",
} as const;

export const FILTER_OPTIONS = {
  imageTypes: [
    { value: "all", label: "All" },
    { value: "photo", label: "Photo" },
    { value: "illustration", label: "Illustration" },
    { value: "vector", label: "Vector" },
  ] as const,
  orientations: [
    { value: "all", label: "All" },
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
  ] as const,
  colors: [
    { value: "all", label: "All" },
    { value: "grayscale", label: "Grayscale" },
    { value: "transparent", label: "Transparent" },
    { value: "red", label: "Red" },
    { value: "orange", label: "Orange" },
    { value: "yellow", label: "Yellow" },
    { value: "green", label: "Green" },
    { value: "blue", label: "Blue" },
    { value: "pink", label: "Pink" },
    { value: "white", label: "White" },
    { value: "gray", label: "Gray" },
    { value: "black", label: "Black" },
    { value: "brown", label: "Brown" },
  ] as const,
} as const;
