// Single source of truth for route paths, so navigation links, <Route> paths
// and navigate() calls never drift out of sync.
export const PATHS = {
  home: "/",
  search: "/search",
  posts: "/posts",
  location: "/location",
  profile: "/profile",
  postsComments: "/posts#comments",
  image: (id: string | number) => `/image/${id}`,
} as const;
