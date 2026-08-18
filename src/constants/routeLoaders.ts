// Chunk loaders for the lazy routes. Defined once so they can be reused by
// `React.lazy` (in App) and by hover/focus preloading (in the navbar).
export const loadImageSearch = () => import("../components/ImageSearch");
export const loadSinglePost = () => import("../components/SinglePost");
export const loadGeolocation = () => import("../components/Geolocation");

import { PATHS } from "./routes";

// Path -> loader. The navbar calls these when a link is hovered/focused so
// the route's code is already downloading before navigation starts.
export const routePreloaders: Record<string, () => Promise<unknown>> = {
  [PATHS.search]: loadImageSearch,
  [PATHS.posts]: loadSinglePost,
  [PATHS.location]: loadGeolocation,
};
