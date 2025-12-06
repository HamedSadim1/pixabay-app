import React from "react";
import { ImageType, Orientation, Color } from "../constants/types";
import { FILTER_OPTIONS } from "../constants/ui";

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

  if (!showFilters) return null;

  return (
    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Image Type
          </label>
          <select
            value={imageType}
            onChange={(e) => setImageType(e.target.value as ImageType)}
            className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          >
            {FILTER_OPTIONS.imageTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Orientation
          </label>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          >
            {FILTER_OPTIONS.orientations.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Color
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value as Color)}
            className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          >
            {FILTER_OPTIONS.colors.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Width
          </label>
          <input
            type="number"
            value={minWidth}
            onChange={(e) => setMinWidth(e.target.value)}
            placeholder="e.g. 1920"
            className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Min Height
          </label>
          <input
            type="number"
            value={minHeight}
            onChange={(e) => setMinHeight(e.target.value)}
            placeholder="e.g. 1080"
            className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
