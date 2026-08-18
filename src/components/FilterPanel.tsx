import React from "react";
import type { ImageType, Orientation, Color } from "@/constants/filters";
import { FILTER_OPTIONS } from "@/constants/ui";

interface FilterPanelProps {
  search: {
    showFilters: boolean;
    imageType: ImageType;
    orientation: Orientation;
    color: Color;
    minWidth: string;
    minHeight: string;
    setImageType: (type: ImageType) => void;
    setOrientation: (orientation: Orientation) => void;
    setColor: (color: Color) => void;
    setMinWidth: (width: string) => void;
    setMinHeight: (height: string) => void;
  };
}

// Static class strings so Tailwind can generate them
const COLOR_SWATCHES: Record<Color, string> = {
  all: "bg-linear-to-r from-safelight to-gold",
  grayscale: "bg-linear-to-r from-paper to-muted",
  transparent: "bg-linear-to-br from-paper/60 to-paper/20",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  turquoise: "bg-teal-400",
  blue: "bg-blue-500",
  lilac: "bg-purple-300",
  pink: "bg-pink-500",
  white: "bg-white",
  gray: "bg-gray-400",
  black: "bg-gray-950",
  brown: "bg-amber-700",
};

const fieldClasses =
  "w-full border border-line bg-panel-2 px-3 py-2.5 font-mono text-sm text-paper placeholder-muted focus:border-safelight focus:outline-none";

const labelClasses =
  "mb-2 block font-mono text-[10px] uppercase tracking-label text-muted";

const FilterPanel: React.FC<FilterPanelProps> = ({ search }) => {
  const {
    showFilters,
    imageType,
    orientation,
    color,
    minWidth,
    minHeight,
    setImageType,
    setOrientation,
    setColor,
    setMinWidth,
    setMinHeight,
  } = search;

  if (!showFilters) {
    return null;
  }

  return (
    <div className="mt-5 border border-line bg-panel-2 p-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="filter-image-type" className={labelClasses}>
            Image Type
          </label>
          <select
            id="filter-image-type"
            value={imageType}
            onChange={(e) => setImageType(e.target.value as ImageType)}
            className={fieldClasses}
          >
            {FILTER_OPTIONS.imageTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-orientation" className={labelClasses}>
            Orientation
          </label>
          <select
            id="filter-orientation"
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className={fieldClasses}
          >
            {FILTER_OPTIONS.orientations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-min-width" className={labelClasses}>
            Min Width
          </label>
          <input
            type="number"
            id="filter-min-width"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
            placeholder="e.g. 1920"
            min="0"
            className={fieldClasses}
          />
        </div>
      </div>

      {/* Color chips */}
      <div className="mt-4">
        <span id="filter-color-label" className={labelClasses}>
          Color
        </span>
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-labelledby="filter-color-label"
        >
          {FILTER_OPTIONS.colors.map((option) => {
            const isSelected = color === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setColor(option.value)}
                className={`flex items-center gap-2 border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                  isSelected
                    ? "border-gold bg-panel text-paper"
                    : "border-line bg-transparent text-muted hover:border-muted hover:text-paper"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-3 w-3 border border-line ${COLOR_SWATCHES[option.value]}`}
                />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 md:max-w-xs">
        <label htmlFor="filter-min-height" className={labelClasses}>
          Min Height
        </label>
        <input
          type="number"
          id="filter-min-height"
          value={minHeight}
          onChange={(e) => setMinHeight(e.target.value)}
          placeholder="e.g. 1080"
          min="0"
          className={fieldClasses}
        />
      </div>
    </div>
  );
};

export default FilterPanel;
