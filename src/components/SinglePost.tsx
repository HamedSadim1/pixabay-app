import React, { useRef, useState } from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import Icon from "./Icon";
import { sharePage } from "../utils/share";

interface Comment {
  name: string;
  time: string;
  avatar: string;
  text: string;
}

function SinglePost() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(42);
  const [shared, setShared] = useState(false);
  const [commentText, setCommentText] = useState("");
  const commentsRef = useRef<HTMLElement>(null);
  const [comments, setComments] = useState<Comment[]>([
    {
      name: "John Doe",
      time: "2 hours ago",
      avatar: "https://picsum.photos/200/200?random=3",
      text: "Welcome to the community, Sarah! Looking forward to your posts! 🚀",
    },
    {
      name: "Jane Smith",
      time: "1 hour ago",
      avatar: "https://picsum.photos/200/200?random=4",
      text: "So glad you're here! The community is amazing. 💫",
    },
    {
      name: "Mike Johnson",
      time: "30 min ago",
      avatar: "https://picsum.photos/200/200?random=5",
      text: "Welcome aboard! Don't forget to check out the guidelines. 📚",
    },
  ]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (await sharePage("Hey, I'm new here!")) {
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    }
  };

  const scrollToComments = () => {
    commentsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePostComment = () => {
    const text = commentText.trim();
    if (!text) {
      return;
    }
    setComments((prev) => [
      { name: "You", time: "Just now", avatar: "", text },
      ...prev,
    ]);
    setCommentText("");
  };

  return (
    <div className="space-y-6">
      {/* Main Post */}
      <article className="border border-line bg-panel p-6">
        <div className="mb-6 flex items-center gap-3">
          <Avatar
            name="Sarah"
            src="https://picsum.photos/200/200?random=1"
            size="md"
          />
          <div>
            <span className="font-display text-sm uppercase tracking-wider text-paper">
              Sarah
            </span>
            <p className="font-mono text-[10px] uppercase tracking-meta text-muted">
              New member • Today at 14:30
            </p>
          </div>
        </div>

        <h3 className="mb-3 font-display text-2xl uppercase tracking-[0.02em] text-paper">
          Hey, I'm new here!
        </h3>
        <p className="mb-5 text-sm leading-relaxed text-muted">
          Just joined this amazing community and I'm so excited to be part of
          it! Looking forward to connecting with everyone and sharing some
          awesome content. This is my first post, so please be gentle! 😊
        </p>
        <div className="mb-6 overflow-hidden border border-line">
          <img
            src="https://picsum.photos/800/400?random=2"
            alt="Community"
            className="h-56 w-full object-cover grayscale transition-[filter] duration-300 hover:grayscale-0 md:h-72"
          />
        </div>

        <div className="flex items-center justify-between border-t border-line pt-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={isLiked ? "ghostActive" : "ghost"}
              onClick={handleLike}
            >
              <Icon name="heart" /> {likesCount}
            </Button>
            <Button size="sm" variant="ghost" onClick={scrollToComments}>
              <Icon name="comment" /> {comments.length}
            </Button>
            <Button
              size="sm"
              variant={shared ? "goldActive" : "ghost"}
              onClick={handleShare}
            >
              <Icon name="share" /> {shared ? "Copied" : "Share"}
            </Button>
          </div>
          <Button
            size="sm"
            variant={isBookmarked ? "goldActive" : "gold"}
            onClick={handleBookmark}
            aria-label="Bookmark"
          >
            <Icon name="bookmark" />
          </Button>
        </div>
      </article>

      {/* Comments */}
      <section
        ref={commentsRef}
        id="comments"
        className="border border-line bg-panel p-6"
      >
        <h3 className="mb-5 font-display text-lg uppercase tracking-[0.03em] text-paper">
          Comments — {comments.length}
        </h3>

        <div className="space-y-3">
          {comments.map((comment, index) => (
            <div
              key={`${comment.name}-${comment.time}-${index}`}
              className="flex gap-3"
            >
              <Avatar name={comment.name} src={comment.avatar} size="sm" />
              <div className="flex-1 border border-line bg-panel-2 p-3.5">
                <div className="mb-1 flex items-baseline gap-2">
                  <span className="font-display text-xs uppercase tracking-wider text-paper">
                    {comment.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-meta text-muted">
                    {comment.time}
                  </span>
                </div>
                <p className="text-sm text-muted">{comment.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-3 border-t border-line pt-5">
          <Avatar name="You" size="sm" />
          <div className="flex-1">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              aria-label="Write a comment"
              className="w-full resize-none border border-line bg-panel-2 p-3 font-mono text-sm text-paper placeholder-muted focus:border-safelight focus:outline-none"
              rows={3}
            />
            <Button
              variant="primary"
              className="mt-2"
              onClick={handlePostComment}
              disabled={!commentText.trim()}
            >
              <Icon name="pen" /> Post Comment
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SinglePost;
