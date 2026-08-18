import React, { useEffect, useRef, useState } from "react";
import AuthorHeader from "@/components/blog/AuthorHeader";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import MetaLabel from "@/components/ui/MetaLabel";
import { useShareFeedback } from "@/hooks/useShareFeedback";
import { useToggle } from "@/hooks/useToggle";
import { INITIAL_COMMENTS, type Comment } from "@/constants/mockData";

function SinglePost() {
  const [isLiked, toggleLiked] = useToggle(false);
  const [isBookmarked, toggleBookmarked] = useToggle(false);
  const [likesCount, setLikesCount] = useState(42);
  const [commentText, setCommentText] = useState("");
  const { shared, share } = useShareFeedback();
  const commentsRef = useRef<HTMLElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // When arriving via a "Reply" link (e.g. from a home-page post), move focus
  // to the comment composer so the user can start typing immediately.
  useEffect(() => {
    if (window.location.hash === "#comments") {
      commentsRef.current?.scrollIntoView({ behavior: "smooth" });
      commentInputRef.current?.focus({ preventScroll: true });
    }
  }, []);
  const [comments, setComments] = useState<Comment[]>(INITIAL_COMMENTS);

  const handleLike = () => {
    toggleLiked();
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
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
          <AuthorHeader name="Sarah" caption="New member • Today at 14:30" />
        </div>

        <h2 className="mb-3 font-display text-2xl uppercase tracking-[0.02em] text-paper">
          Hey, I'm new here!
        </h2>
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

        <div className="flex flex-wrap items-center justify-between gap-y-2 border-t border-line pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant={isLiked ? "ghostActive" : "ghost"}
              onClick={handleLike}
              aria-label={`Like (${likesCount} likes)`}
              aria-pressed={isLiked}
            >
              <Icon name="heart" /> {likesCount}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={scrollToComments}
              aria-label={`Comment (${comments.length} comments)`}
            >
              <Icon name="comment" /> {comments.length}
            </Button>
            <Button
              size="sm"
              variant={shared ? "goldActive" : "ghost"}
              onClick={() => void share("Hey, I'm new here!")}
            >
              <Icon name="share" /> {shared ? "Copied" : "Share"}
            </Button>
          </div>
          <Button
            size="sm"
            variant={isBookmarked ? "goldActive" : "gold"}
            onClick={toggleBookmarked}
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
        <h2 className="mb-5 font-display text-lg uppercase tracking-[0.03em] text-paper">
          Comments — {comments.length}
        </h2>

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
                  <MetaLabel>{comment.time}</MetaLabel>
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
              ref={commentInputRef}
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
