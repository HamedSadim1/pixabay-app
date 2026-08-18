import React from "react";

interface TagListProps {
  tags: string;
}

// Renders a comma-separated tag string as a row of uppercase chips.
const TagList: React.FC<TagListProps> = ({ tags }) => (
  <div className="flex flex-wrap gap-2">
    {tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag, index) => (
        <span
          key={index}
          className="border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-muted"
        >
          {tag}
        </span>
      ))}
  </div>
);

export default TagList;
