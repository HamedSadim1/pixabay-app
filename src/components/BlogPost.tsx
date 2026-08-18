import { type FC, useState } from "react";

interface BlockProps {
  name: string;
  image: string;
  text: string;
}

const BlogPost: FC<BlockProps> = ({ name, image, text }) => {
  const [formattedTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="flex items-start space-x-4">
        <div className="shrink-0">
          <img
            alt={`${name} avatar`}
            src={image}
            className="w-12 h-12 rounded-full border-2 border-white/20 shadow-lg"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="text-lg font-semibold text-white hover:text-purple-300 transition-colors cursor-pointer">
              {name}
            </h4>
            <span className="text-sm text-gray-400">•</span>
            <span className="text-sm text-gray-400">
              Today at {formattedTime}
            </span>
          </div>
          <p className="text-gray-200 leading-relaxed">{text}</p>
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-white/10">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-red-400 transition-all duration-300 text-sm hover:scale-105 group">
              <span className="group-hover:animate-bounce-subtle">❤️</span>
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-400 transition-all duration-300 text-sm hover:scale-105 group">
              <span className="group-hover:animate-pulse-slow">💬</span>
              <span>Reply</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-all duration-300 text-sm hover:scale-105 group">
              <span className="group-hover:rotate-12 transition-transform duration-300">
                🔗
              </span>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
