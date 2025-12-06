import React from "react";
import { useNavigate } from "react-router-dom";
import { Hit } from "./../models/IPixabay";

interface ImageListProps {
  images: Hit[];
}

const ImageList: React.FC<ImageListProps> = ({ images }) => {
  const navigate = useNavigate();

  const handleImageClick = (imageId: number) => {
    navigate(`/image/${imageId}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {images.map((result) => (
        <div
          key={result.id}
          onClick={() => handleImageClick(result.id)}
          className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden shadow-lg border border-white/10 hover:scale-105 transition-all duration-300 cursor-pointer group"
        >
          <div className="relative">
            <img
              className="w-full h-48 object-cover"
              src={result.webformatURL}
              alt={result.tags}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm backdrop-blur-sm">
                View Details
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-white text-sm truncate mb-2">{result.tags}</p>
            <div className="flex justify-between text-gray-300 text-xs">
              <span>👍 {result.likes}</span>
              <span>👁️ {result.views}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageList;
