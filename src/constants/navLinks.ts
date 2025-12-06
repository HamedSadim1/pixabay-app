import {
  FaHome,
  FaSearch,
  FaBlog,
  FaMapMarkerAlt,
  FaUser,
} from "react-icons/fa";

export interface NavLink {
  to: string;
  label: string;
  icon: string;
}

export const NAV_LINKS: NavLink[] = [
  {
    to: "/",
    label: "Home",
    icon: "FaHome",
  },
  {
    to: "/search",
    label: "Search",
    icon: "FaSearch",
  },
  {
    to: "/posts",
    label: "Posts",
    icon: "FaBlog",
  },
  {
    to: "/location",
    label: "Location",
    icon: "FaMapMarkerAlt",
  },
  {
    to: "/profile",
    label: "Profile",
    icon: "FaUser",
  },
];

export const TRENDING_SEARCHES = [
  "nature",
  "city",
  "animals",
  "food",
  "travel",
  "technology",
];

export const NAV_ICONS = {
  FaHome,
  FaSearch,
  FaBlog,
  FaMapMarkerAlt,
  FaUser,
};
