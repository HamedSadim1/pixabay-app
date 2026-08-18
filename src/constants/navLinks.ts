import type { IconName } from "./icons";

export interface NavLink {
  to: string;
  label: string;
  icon: IconName;
}

export const NAV_LINKS: NavLink[] = [
  { to: "/", label: "Home", icon: "home" },
  { to: "/search", label: "Search", icon: "search" },
  { to: "/posts", label: "Posts", icon: "pen" },
  { to: "/location", label: "Location", icon: "location" },
  { to: "/profile", label: "Profile", icon: "user" },
];

export const TRENDING_SEARCHES = [
  "nature",
  "city",
  "animals",
  "food",
  "travel",
  "technology",
];
