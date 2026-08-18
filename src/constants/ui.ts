// UI constants

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
    { value: "turquoise", label: "Turquoise" },
    { value: "blue", label: "Blue" },
    { value: "lilac", label: "Lilac" },
    { value: "pink", label: "Pink" },
    { value: "white", label: "White" },
    { value: "gray", label: "Gray" },
    { value: "black", label: "Black" },
    { value: "brown", label: "Brown" },
  ] as const,
} as const;
