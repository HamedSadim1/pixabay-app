import React from "react";
import Icon from "@/components/ui/Icon";
import MetaLabel from "@/components/ui/MetaLabel";
import { getImageStatsFields } from "@/utils/format";

interface ImageStatsProps {
  likes: number;
  views: number;
  downloads: number;
  comments: number;
  collections: number;
}

// Grid of the five key image statistics.
const ImageStats: React.FC<ImageStatsProps> = ({
  likes,
  views,
  downloads,
  comments,
  collections,
}) => {
  const stats = getImageStatsFields({
    likes,
    views,
    downloads,
    comments,
    collections,
  });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {stats.map(([icon, value, label]) => (
        <div
          key={label}
          className="border border-line bg-panel-2 p-3 text-center"
        >
          <div className="text-lg text-safelight">
            <Icon name={icon} />
          </div>
          <div className="font-mono text-lg text-paper">{value}</div>
          <MetaLabel as="div">{label}</MetaLabel>
        </div>
      ))}
    </div>
  );
};

export default ImageStats;
