import type { IconName } from "./icons";
import { PATHS } from "./routes";

export interface NavLink {
  to: string;
  label: string;
  icon: IconName;
}

export const NAV_LINKS: NavLink[] = [
  { to: PATHS.home, label: "Home", icon: "home" },
  { to: PATHS.search, label: "Search", icon: "search" },
  { to: PATHS.posts, label: "Posts", icon: "pen" },
  { to: PATHS.location, label: "Location", icon: "location" },
  { to: PATHS.profile, label: "Profile", icon: "user" },
];

export const TRENDING_SEARCHES = [
  "nature",
  "city",
  "animals",
  "food",
  "travel",
  "technology",
];
