import React from "react";
import Avatar from "./Avatar";
import Button from "./Button";
import Icon from "./Icon";

interface BlockProps {
  children: React.ReactNode;
  name?: string;
  avatar?: string;
  role?: string;
  isOnline?: boolean;
}

const UserCard: React.FC<BlockProps> = ({
  children,
  name = "Alex Tancredi",
  avatar,
  role,
  isOnline = false,
}) => {
  return (
    <div className="border border-line bg-panel p-6 transition-colors hover:border-muted">
      <div className="flex items-start gap-4">
        <Avatar name={name} src={avatar} size="lg" isOnline={isOnline} />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-lg uppercase tracking-[0.03em] text-paper">
              {name}
            </h3>
            {role && (
              <span className="border border-gold/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-meta text-gold">
                {role}
              </span>
            )}
          </div>
          <div className="mb-4 text-sm leading-relaxed text-muted">
            {children}
          </div>
          <Button variant="primary">
            <Icon name="userPlus" /> Add Friend
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
