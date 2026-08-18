import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import {
  searchImages,
  getErrorMessage,
  type SearchQuery,
} from "../api/pixabay";
import type { Hit } from "./../models/IPixabay";
import type { Color, ImageType, Orientation } from "../constants/types";
import { useDebouncedValue } from "./useDebouncedValue";

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

// Debounce for the min-width/min-height inputs, so typing doesn't change the
// query key (and trigger a request) on every keystroke.
const FILTER_DEBOUNCE_MS = 300;

// URL-backed search parameters. nuqs keeps the query string in sync with these
// values, so the URL is the single source of truth. Pagination is managed by
// React Query (useInfiniteQuery), so it is intentionally not part of the URL.
const searchParams = {
  q: parseAsString.withDefault(""),
  type: parseAsStringLiteral(IMAGE_TYPES).withDefault("photo"),
  orientation: parseAsStringLiteral(ORIENTATIONS).withDefault("all"),
  color: parseAsStringLiteral(COLORS).withDefault("all"),
  minWidth: parseAsString.withDefault(""),
  minHeight: parseAsString.withDefault(""),
};

export interface SearchState {
  search: string;
  results: Hit[];
  error: string;
  loading: boolean;
  loadingMore: boolean;
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
  hasMore: boolean;
}

export interface SearchActions {
  setSearch: (search: string) => void;
  setShowFilters: (show: boolean) => void;
  setImageType: (type: ImageType) => void;
  setOrientation: (orientation: Orientation) => void;
  setColor: (color: Color) => void;
  setMinWidth: (width: string) => void;
  setMinHeight: (height: string) => void;
  performSearch: (query?: string) => void;
  clearSearch: () => void;
  loadMore: () => void;
}

export const useSearch = (): SearchState & SearchActions => {
  const [
    { q, type: imageType, orientation, color, minWidth, minHeight },
    setSearchParams,
  ] = useQueryStates(searchParams, { history: "replace" });

  // Draft value for the search input. It is only committed to the URL (q)
  // when a search is actually performed, so typing doesn't rewrite the URL.
  const [search, setSearch] = useState<string>(q);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    try {
      const history = localStorage.getItem("searchHistory");
      return history ? (JSON.parse(history) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Filter text inputs are debounced so the query key only changes once the
  // user pauses, instead of firing a request per keystroke.
  const debouncedMinWidth = useDebouncedValue(minWidth, FILTER_DEBOUNCE_MS);
  const debouncedMinHeight = useDebouncedValue(minHeight, FILTER_DEBOUNCE_MS);

  // Normalize the filter values into the shape the API actually uses, omitting
  // no-op values ("all" / empty). This object is both the query key and the
  // request payload, so the devtools key shows only the filters that apply.
  const searchQuery = useMemo(() => {
    const params: Omit<SearchQuery, "page"> = { q };
    if (imageType !== "all") {
      params.type = imageType;
    }
    if (orientation !== "all") {
      params.orientation = orientation;
    }
    if (color !== "all") {
      params.color = color;
    }
    // Only send positive whole numbers, matching the Pixabay API contract.
    const width = Math.floor(Number(debouncedMinWidth));
    if (Number.isFinite(width) && width > 0) {
      params.minWidth = width;
    }
    const height = Math.floor(Number(debouncedMinHeight));
    if (Number.isFinite(height) && height > 0) {
      params.minHeight = height;
    }
    return params;
  }, [q, imageType, orientation, color, debouncedMinWidth, debouncedMinHeight]);

  const query = useInfiniteQuery({
    queryKey: ["pixabay", "search", searchQuery],
    queryFn: ({ pageParam }) =>
      searchImages({ ...searchQuery, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((sum, page) => sum + page.hits.length, 0);
      return loaded < lastPage.totalHits ? allPages.length + 1 : undefined;
    },
    // No query to run until the user actually commits a search term.
    enabled: Boolean(q.trim()),
  });

  // Flatten all loaded pages into a single result list.
  const results = useMemo(
    () => query.data?.pages.flatMap((page) => page.hits) ?? [],
    [query.data],
  );
  const totalHits = query.data?.pages[0]?.totalHits ?? 0;

  const saveToHistory = useCallback((term: string) => {
    if (!term.trim()) {
      return;
    }
    setSearchHistory((prev) => {
      const next = [term, ...prev.filter((item) => item !== term)].slice(0, 10);
      try {
        localStorage.setItem("searchHistory", JSON.stringify(next));
      } catch {
        // Storage can fail (private browsing / quota) — the in-memory history
        // still works, so ignore.
      }
      return next;
    });
  }, []);

  // Record a successful search in history exactly once per committed term,
  // even if React Query later refetches the same key in the background.
  const lastSavedQueryRef = useRef<string>("");
  useEffect(() => {
    if (query.isSuccess && q.trim()) {
      if (lastSavedQueryRef.current !== q) {
        lastSavedQueryRef.current = q;
        saveToHistory(q);
      }
    }
  }, [query.isSuccess, q, saveToHistory]);

  // Keep the draft input in sync with the committed URL query when it changes
  // externally (e.g. browser back/forward), so the field never goes stale.
  useEffect(() => {
    setSearch(q);
  }, [q]);

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

  // Commit a search term to the URL. The fetch itself is handled by React
  // Query in response to the query-key change, so this just moves state.
  const performSearch = (queryOverride?: string) => {
    const qEffective = (queryOverride ?? search).trim();
    if (!qEffective) {
      clearSearch();
      return;
    }
    setSearch(qEffective);
    void setSearchParams({ q: qEffective });
  };

  const clearSearch = () => {
    setSearch("");
    void setSearchParams({ q: "" });
  };

  const loadMore = () => {
    if (query.hasNextPage && !query.isFetchingNextPage) {
      void query.fetchNextPage();
    }
  };

  // True when the draft query still matches the committed URL query — i.e.
  // clicking "Search" now would re-commit identical state and change nothing.
  const isSearchUnchanged = search.trim() === q;

  return {
    // State
    search,
    results,
    error: query.error ? getErrorMessage(query.error) : "",
    loading: query.isLoading,
    loadingMore: query.isFetchingNextPage,
    searchHistory,
    showFilters,
    totalHits,
    hasSearched: Boolean(query.data),
    isSearchUnchanged,
    imageType,
    orientation,
    color,
    minWidth,
    minHeight,
    hasMore: Boolean(query.hasNextPage),
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
