import React from "react";
import MetaLabel from "@/components/ui/MetaLabel";

interface AuthorHeaderProps {
  name: string;
  caption: string;
}

// Stacked author name + meta caption, used on post and image detail headers.
const AuthorHeader: React.FC<AuthorHeaderProps> = ({ name, caption }) => (
  <div>
    <span className="font-display text-sm uppercase tracking-wider text-paper">
      {name}
    </span>
    <MetaLabel as="p">{caption}</MetaLabel>
  </div>
);

export default AuthorHeader;
