// Mock / placeholder data used by demo components.

import type { IconName } from "./icons";
import { PATHS } from "./routes";

export interface FeaturedPost {
  name: string;
  image: string;
  text: string;
}

export interface Feature {
  icon: IconName;
  title: string;
  description: string;
  to: string;
}

export interface Comment {
  name: string;
  time: string;
  avatar: string;
  text: string;
}

export const FEATURED_POSTS: FeaturedPost[] = [
  {
    name: "Sarah",
    image: "https://picsum.photos/200/200?random=1",
    text: "Just joined this amazing community! So excited to connect with everyone and share some awesome content. Looking forward to your posts! 🚀",
  },
  {
    name: "Mike Johnson",
    image: "https://picsum.photos/200/200?random=7",
    text: "Great to see such an active community here. The discussions are always interesting and the people are so welcoming. Keep up the good work everyone!",
  },
  {
    name: "Emma Davis",
    image: "https://picsum.photos/200/200?random=8",
    text: "Love the new features! The interface is so smooth and the content quality is outstanding. This platform keeps getting better and better.",
  },
];

export const FEATURES: Feature[] = [
  {
    icon: "pen",
    title: "Blog Posts",
    description: "Read and share stories from the community.",
    to: PATHS.posts,
  },
  {
    icon: "search",
    title: "Image Search",
    description: "Query the Pixabay archive by keyword and filter.",
    to: PATHS.search,
  },
  {
    icon: "location",
    title: "Location",
    description: "Find your position with the geolocation service.",
    to: PATHS.location,
  },
];

export const INITIAL_COMMENTS: Comment[] = [
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
];
