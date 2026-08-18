import { type FC, useState } from "react";
import Avatar from "./Avatar";
import Icon from "./Icon";

interface BlockProps {
  name: string;
  image: string;
  text: string;
  frame?: string;
}

const BlogPost: FC<BlockProps> = ({ name, image, text, frame }) => {
  const [formattedTime] = useState<string>(() => {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  return (
    <article className="relative flex gap-4 border border-line bg-panel p-4 transition-colors hover:border-muted">
      {frame && (
        <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.2em] text-gold">
          {frame}
        </span>
      )}
      <Avatar name={name} src={image} size="md" />
      <div className="min-w-0 flex-1 pr-14">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-sm uppercase tracking-wider text-paper">
            {name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
            Today at {formattedTime}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{text}</p>
        <div className="mt-3 flex gap-5 border-t border-line pt-3">
          <button className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-safelight">
            <Icon name="heart" /> Like
          </button>
          <button className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-safelight">
            <Icon name="comment" /> Reply
          </button>
          <button className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-muted transition-colors hover:text-safelight">
            <Icon name="share" /> Share
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
