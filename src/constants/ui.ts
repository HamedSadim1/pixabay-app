// UI constants

import {
  COLORS,
  IMAGE_TYPES,
  ORIENTATIONS,
  type Color,
  type ImageType,
  type Orientation,
} from "./filters";

// Labels are keyed by the full union type, so TypeScript enforces that every
// filter value (in filters.ts) has a label here.
const IMAGE_TYPE_LABELS: Record<ImageType, string> = {
  all: "All",
  photo: "Photo",
  illustration: "Illustration",
  vector: "Vector",
};

const ORIENTATION_LABELS: Record<Orientation, string> = {
  all: "All",
  horizontal: "Horizontal",
  vertical: "Vertical",
};

const COLOR_LABELS: Record<Color, string> = {
  all: "All",
  grayscale: "Grayscale",
  transparent: "Transparent",
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  turquoise: "Turquoise",
  blue: "Blue",
  lilac: "Lilac",
  pink: "Pink",
  white: "White",
  gray: "Gray",
  black: "Black",
  brown: "Brown",
};

export const FILTER_OPTIONS = {
  imageTypes: IMAGE_TYPES.map((value) => ({
    value,
    label: IMAGE_TYPE_LABELS[value],
  })),
  orientations: ORIENTATIONS.map((value) => ({
    value,
    label: ORIENTATION_LABELS[value],
  })),
  colors: COLORS.map((value) => ({
    value,
    label: COLOR_LABELS[value],
  })),
};
