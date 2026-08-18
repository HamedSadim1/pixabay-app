import React from "react";
import { Link } from "react-router-dom";
import Icon from "./Icon";
import type { Hit } from "./../models/IPixabay";
import { PATHS } from "../constants/routes";

interface ImageListProps {
  images: Hit[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((result, index) => (
        <Link
          key={result.id}
          to={PATHS.image(result.id)}
          aria-label={`View image: ${result.tags}`}
          className="group relative block overflow-hidden border border-line bg-panel text-left transition-colors hover:border-gold"
        >
          <span className="vf-corner vf-tl" />
          <span className="vf-corner vf-tr" />
          <span className="vf-corner vf-bl" />
          <span className="vf-corner vf-br" />
          <span
            aria-hidden="true"
            className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-label text-gold"
          >
            FRAME/{String(index + 1).padStart(2, "0")}
          </span>
          <div className="aspect-4/3 overflow-hidden bg-panel-2">
            <img
              className="h-full w-full object-cover grayscale transition-[filter,transform] duration-300 group-hover:scale-105 group-hover:grayscale-0"
              src={result.webformatURL}
              alt=""
              loading="lazy"
            />
          </div>
          <div className="flex items-center justify-between border-t border-line px-3 py-2.5">
            <span className="truncate font-mono text-xs text-paper">
              {result.tags}
            </span>
            <span className="ml-2 flex shrink-0 items-center gap-1 font-mono text-[10px] text-muted">
              <Icon name="heart" /> {result.likes}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ImageList;
