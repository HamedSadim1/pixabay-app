import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "./Icon";
import type { Hit } from "./../models/IPixabay";

interface ImageListProps {
  images: Hit[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  const navigate = useNavigate();

  const handleImageClick = (imageId: number) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {images.map((result, index) => (
        <button
          key={result.id}
          type="button"
          onClick={() => handleImageClick(result.id)}
          className="group relative block overflow-hidden border border-line bg-panel text-left transition-colors hover:border-gold"
        >
          <span className="vf-corner vf-tl" />
          <span className="vf-corner vf-tr" />
          <span className="vf-corner vf-bl" />
          <span className="vf-corner vf-br" />
          <span className="absolute left-3 top-3 z-10 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
            FRAME/{String(index + 1).padStart(2, "0")}
          </span>
          <div className="aspect-[4/3] overflow-hidden bg-panel-2">
            <img
              className="h-full w-full object-cover grayscale transition-[filter,transform] duration-300 group-hover:scale-105 group-hover:grayscale-0"
              src={result.webformatURL}
              alt={result.tags}
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
        </button>
      ))}
    </div>
  );
};

export default ImageList;
