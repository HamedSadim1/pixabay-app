import {
  useState,
  useEffect,
  useCallback,
  useEffectEvent,
  useRef,
} from "react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import axios, { type AxiosError } from "axios";
import { API_ENDPOINTS } from "../config/api";
import type { Hit } from "./../models/IPixabay";
import type { Color, ImageType, Orientation } from "../constants/types";

interface ApiError {
  message: string;
}

// Snapshot of the query + filters used by the last executed search. Used to
// detect when a new "Search" click would change nothing, so the button can
// be disabled instead of re-fetching (and causing a layout shift).
interface LastSearch {
  q: string;
  imageType: ImageType;
  orientation: Orientation;
  color: Color;
  minWidth: string;
  minHeight: string;
}

// Accepted literal values for the URL-backed filters. These mirror the unions
// in constants/types.ts so the parsers stay type-safe (a typo here is caught
// at compile time via the `satisfies` check below).
const IMAGE_TYPES = [
  "all",
  "photo",
  "illustration",
  "vector",
] as const satisfies readonly ImageType[];
const ORIENTATIONS = [
  "all",
  "horizontal",
  "vertical",
] as const satisfies readonly Orientation[];
const COLORS = [
  "all",
  "grayscale",
  "transparent",
  "red",
  "orange",
  "yellow",
  "green",
  "turquoise",
  "blue",
  "lilac",
  "pink",
  "white",
  "gray",
  "black",
  "brown",
] as const satisfies readonly Color[];

// Debounce for auto-applying filter changes, so typing in the min-width/
// min-height inputs doesn't fire a request on every keystroke.
const FILTER_DEBOUNCE_MS = 300;

// URL-backed search parameters. nuqs keeps the query string in sync with
// these values, so the URL is the single source of truth — no hand-rolled
// parsing/serialization of the query string.
const searchParams = {
  q: parseAsString.withDefault(""),
  type: parseAsStringLiteral(IMAGE_TYPES).withDefault("photo"),
  orientation: parseAsStringLiteral(ORIENTATIONS).withDefault("all"),
  color: parseAsStringLiteral(COLORS).withDefault("all"),
  minWidth: parseAsString.withDefault(""),
  minHeight: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(1),
};

export interface SearchState {
  search: string;
  results: Hit[];
  error: string;
  loading: boolean;
  searchHistory: string[];
  showFilters: boolean;
  totalHits: number;
  hasSearched: boolean;
  isSearchUnchanged: boolean;
  imageType: ImageType;
  orientation: Orientation;
  color: Color;
  minWidth: string;
  minHeight: string;
}

export interface SearchActions {
  setSearch: (search: string) => void;
  setShowFilters: (show: boolean) => void;
  setImageType: (type: ImageType) => void;
  setOrientation: (orientation: Orientation) => void;
  setColor: (color: Color) => void;
  setMinWidth: (width: string) => void;
  setMinHeight: (height: string) => void;
  performSearch: (page?: number, append?: boolean, query?: string) => void;
  clearSearch: () => void;
  loadMore: () => void;
}

export const useSearch = (): SearchState & SearchActions => {
  const [
    { q, type: imageType, orientation, color, minWidth, minHeight, page },
    setSearchParams,
  ] = useQueryStates(searchParams, { history: "replace" });

  // Draft value for the search input. It is only committed to the URL (q)
  // when a search is actually performed, so typing doesn't rewrite the URL.
  const [search, setSearch] = useState<string>(q);

  const [results, setResults] = useState<Hit[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const history = localStorage.getItem("searchHistory");
      return history ? (JSON.parse(history) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [lastSearch, setLastSearch] = useState<LastSearch | null>(null);
  // Monotonic id so only the latest in-flight request may update state; an
  // earlier (slower) response is ignored instead of overwriting newer results.
  const requestIdRef = useRef(0);

  const saveToHistory = useCallback(
    (query: string) => {
      if (!query.trim()) {
        return;
      }
      const newHistory = [
        query,
        ...searchHistory.filter((item) => item !== query),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      try {
        localStorage.setItem("searchHistory", JSON.stringify(newHistory));
      } catch {
        // Storage can fail (private browsing / quota) — the in-memory history
        // still works, so ignore.
      }
    },
    [searchHistory],
  );

  const performSearch = useCallback(
    async (p: number = 1, append: boolean = false, query?: string) => {
      const qEffective = (query ?? search).trim();

      if (!qEffective && p === 1) {
        requestIdRef.current++;
        void setSearchParams({ q: "", page: 1 });
        setResults([]);
        setTotalHits(0);
        setHasSearched(false);
        setLastSearch(null);
        return;
      }

      // Remember what this search committed so a later "Search" click with
      // unchanged query + filters can be treated as a no-op.
      if (p === 1 && !append) {
        setLastSearch({
          q: qEffective,
          imageType,
          orientation,
          color,
          minWidth,
          minHeight,
        });
      }

      // Commit the effective search to the URL (the source of truth).
      void setSearchParams({ q: qEffective, page: p });

      const requestId = ++requestIdRef.current;

      try {
        setLoading(true);
        if (!append) {
          setError("");
        }

        let queryString = `${API_ENDPOINTS.PIXABAY_SEARCH}&q=${encodeURIComponent(qEffective)}&page=${p}&per_page=20`;

        if (imageType !== "all") {
          queryString += `&image_type=${imageType}`;
        }
        if (orientation !== "all") {
          queryString += `&orientation=${orientation}`;
        }
        if (color !== "all") {
          queryString += `&colors=${color}`;
        }
        // Only send positive whole numbers, matching the Pixabay API contract.
        const width = Math.floor(Number(minWidth));
        if (Number.isFinite(width) && width > 0) {
          queryString += `&min_width=${width}`;
        }
        const height = Math.floor(Number(minHeight));
        if (Number.isFinite(height) && height > 0) {
          queryString += `&min_height=${height}`;
        }

        const response = await axios.get(queryString, { timeout: 10000 });

        // Ignore the response if a newer search has already started.
        if (requestId !== requestIdRef.current) {
          return;
        }

        if (response.data && Array.isArray(response.data.hits)) {
          const newResults = append
            ? [...results, ...response.data.hits]
            : response.data.hits;
          setResults(newResults);
          setTotalHits(response.data.totalHits || 0);
          setHasSearched(true);

          if (p === 1 && qEffective) {
            saveToHistory(qEffective);
          }
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) {
          return;
        }
        const error = err as AxiosError<ApiError>;
        const errorMessage =
          error.code === "ECONNABORTED"
            ? "The request timed out. Please try again."
            : error.response?.data?.message ||
              error.message ||
              "An error occurred while fetching images";
        setError(errorMessage);
        if (!append) {
          setResults([]);
          setTotalHits(0);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
        }
      }
    },
    [
      search,
      imageType,
      orientation,
      color,
      minWidth,
      minHeight,
      results,
      saveToHistory,
      setSearchParams,
    ],
  );

  // Restore a committed search when the component (re)mounts with a query in
  // the URL, e.g. after navigating back from an image detail page. The effect
  // event always reads the latest state, so the effect only runs on mount.
  const restoreFromURL = useEffectEvent(() => {
    if (q.trim()) {
      performSearch(page, false, q);
    }
  });

  useEffect(() => {
    restoreFromURL();
  }, []);

  // Keep the draft input in sync with the committed URL query when it changes
  // externally (e.g. browser back/forward), so the field never goes stale.
  useEffect(() => {
    setSearch(q);
  }, [q]);

  // Auto-apply filter changes: re-run the current search whenever a filter is
  // updated, debounced so typing in the min-width/min-height inputs doesn't
  // fire a request per keystroke. The effect event always reads the latest
  // state, and the ref skips the initial mount so we don't double-fetch right
  // after restoring a query from the URL.
  const applyFilterSearch = useEffectEvent(() => {
    if (lastSearch === null) {
      return;
    }
    performSearch(1, false, q);
  });

  const isFirstFilterRun = useRef(true);
  useEffect(() => {
    if (isFirstFilterRun.current) {
      isFirstFilterRun.current = false;
      return;
    }
    const timer = setTimeout(() => {
      applyFilterSearch();
    }, FILTER_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [imageType, orientation, color, minWidth, minHeight]);

  const setImageType = (value: ImageType) => {
    void setSearchParams({ type: value });
  };

  const setOrientation = (value: Orientation) => {
    void setSearchParams({ orientation: value });
  };

  const setColor = (value: Color) => {
    void setSearchParams({ color: value });
  };

  const setMinWidth = (value: string) => {
    void setSearchParams({ minWidth: value });
  };

  const setMinHeight = (value: string) => {
    void setSearchParams({ minHeight: value });
  };

  const clearSearch = () => {
    requestIdRef.current++;
    setSearch("");
    setResults([]);
    setTotalHits(0);
    setHasSearched(false);
    setLastSearch(null);
    void setSearchParams({ q: "", page: 1 });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    void setSearchParams({ page: nextPage });
    performSearch(nextPage, true, q);
  };

  // True when the draft query and all filters still match the last executed
  // search — i.e. clicking "Search" now would re-fetch identical results.
  const isSearchUnchanged =
    lastSearch !== null &&
    lastSearch.q === search.trim() &&
    lastSearch.imageType === imageType &&
    lastSearch.orientation === orientation &&
    lastSearch.color === color &&
    lastSearch.minWidth === minWidth &&
    lastSearch.minHeight === minHeight;

  return {
    // State
    search,
    results,
    error,
    loading,
    searchHistory,
    showFilters,
    totalHits,
    hasSearched,
    isSearchUnchanged,
    imageType,
    orientation,
    color,
    minWidth,
    minHeight,
    // Actions
    setSearch,
    setShowFilters,
    setImageType,
    setOrientation,
    setColor,
    setMinWidth,
    setMinHeight,
    performSearch,
    clearSearch,
    loadMore,
  };
};
