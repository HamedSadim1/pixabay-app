import { type FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "./Avatar";
import Icon from "./Icon";
import { sharePage } from "../utils/share";

interface BlockProps {
  name: string;
  image: string;
  text: string;
  frame?: string;
}

const BlogPost: FC<BlockProps> = ({ name, image, text, frame }) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [shared, setShared] = useState(false);

  const formattedTime = useMemo(
    () =>
      new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    [],
  );

  const handleShare = async () => {
    if (await sharePage(name)) {
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    }
  };

  return (
    <article className="relative flex gap-4 border border-line bg-panel p-6 transition-colors hover:border-muted">
      {frame && (
        <span className="absolute right-3 top-3 font-mono text-[10px] uppercase tracking-label text-gold">
          {frame}
        </span>
      )}
      <Avatar name={name} src={image} size="md" />
      <div className="min-w-0 flex-1 pr-14">
        <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="font-display text-sm uppercase tracking-wider text-paper">
            {name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-meta text-muted">
            Today at {formattedTime}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-muted">{text}</p>
        <div className="mt-3 flex gap-5 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-meta transition-colors ${
              liked ? "text-safelight" : "text-muted hover:text-safelight"
            }`}
          >
            <Icon name="heart" /> {liked ? "Liked" : "Like"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-meta text-muted transition-colors hover:text-safelight"
          >
            <Icon name="comment" /> Reply
          </button>
          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-meta transition-colors ${
              shared ? "text-gold" : "text-muted hover:text-safelight"
            }`}
          >
            <Icon name="share" /> {shared ? "Copied" : "Share"}
          </button>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
