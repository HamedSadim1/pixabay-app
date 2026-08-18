import { useState, useEffect, useCallback, useEffectEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios, { type AxiosError } from "axios";
import type { Hit } from "./../models/IPixabay";
import type { ImageType, Orientation, Color } from "../constants/types";

interface ApiError {
  message: string;
}

export interface SearchState {
  search: string;
  results: Hit[];
  error: string;
  loading: boolean;
  searchHistory: string[];
  showFilters: boolean;
  currentPage: number;
  totalHits: number;
  hasSearched: boolean;
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
  searchFromHistory: (query: string) => void;
}

export const useSearch = (): SearchState & SearchActions => {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState<string>("");
  const [results, setResults] = useState<Hit[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const history = localStorage.getItem("searchHistory");
    return history ? (JSON.parse(history) as string[]) : [];
  });
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalHits, setTotalHits] = useState<number>(0);
  const [hasSearched, setHasSearched] = useState<boolean>(false);

  // Filter states
  const [imageType, setImageType] = useState<ImageType>("photo");
  const [orientation, setOrientation] = useState<Orientation>("all");
  const [color, setColor] = useState<Color>("all");
  const [minWidth, setMinWidth] = useState<string>("");
  const [minHeight, setMinHeight] = useState<string>("");

  // Save search history to localStorage
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
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));
    },
    [searchHistory],
  );

  // Update URL with current search parameters
  const updateURL = useCallback(
    (query: string, page: number = 1) => {
      const params = new URLSearchParams();
      if (query.trim()) {
        params.set("q", query);
      }
      if (imageType !== "photo") {
        params.set("type", imageType);
      }
      if (orientation !== "all") {
        params.set("orientation", orientation);
      }
      if (color !== "all") {
        params.set("color", color);
      }
      if (minWidth) {
        params.set("minWidth", minWidth);
      }
      if (minHeight) {
        params.set("minHeight", minHeight);
      }
      if (page > 1) {
        params.set("page", page.toString());
      }

      const newURL = params.toString()
        ? `/search?${params.toString()}`
        : "/search";
      navigate(newURL, { replace: true });
    },
    [imageType, orientation, color, minWidth, minHeight, navigate],
  );

  const performSearch = useCallback(
    async (page: number = 1, append: boolean = false, query?: string) => {
      const q = (query ?? search).trim();
      if (!q && page === 1) {
        setResults([]);
        setTotalHits(0);
        setHasSearched(false);
        return;
      }

      try {
        setLoading(true);
        if (!append) {
          setError("");
        }

        const apiKey = import.meta.env.VITE_PIXABAY_API_KEY;
        const baseUrl = import.meta.env.VITE_PIXABAY_BASE_URL;

        if (!apiKey || !baseUrl) {
          throw new Error("API configuration missing");
        }

        let queryString = `${baseUrl}?key=${apiKey}&q=${q}&page=${page}&per_page=20`;

        // Add filters
        if (imageType !== "all") {
          queryString += `&image_type=${imageType}`;
        }
        if (orientation !== "all") {
          queryString += `&orientation=${orientation}`;
        }
        if (color !== "all") {
          queryString += `&colors=${color}`;
        }
        if (minWidth) {
          queryString += `&min_width=${minWidth}`;
        }
        if (minHeight) {
          queryString += `&min_height=${minHeight}`;
        }

        const response = await axios.get(queryString);

        if (response.data && Array.isArray(response.data.hits)) {
          const newResults = append
            ? [...results, ...response.data.hits]
            : response.data.hits;
          setResults(newResults);
          setTotalHits(response.data.totalHits || 0);
          setHasSearched(true);

          if (page === 1 && q) {
            saveToHistory(q);
            updateURL(q, page);
          }
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        const error = err as AxiosError<ApiError>;
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An error occurred while fetching images";
        setError(errorMessage);
        if (!append) {
          setResults([]);
          setTotalHits(0);
        }
      } finally {
        setLoading(false);
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
      updateURL,
    ],
  );

  // Parse URL parameters on component mount and URL changes. The URL is the
  // source of truth; the effect event always reads the latest state, so the
  // effect only needs to re-run when the URL changes.
  const syncStateFromURL = useEffectEvent(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("q") || "";
    const type = (urlParams.get("type") as ImageType) || "photo";
    const orient = (urlParams.get("orientation") as Orientation) || "all";
    const col = (urlParams.get("color") as Color) || "all";
    const width = urlParams.get("minWidth") || "";
    const height = urlParams.get("minHeight") || "";
    const page = parseInt(urlParams.get("page") || "1");

    // Only update state if URL params are different from current state
    let stateChanged = false;
    if (query !== search) {
      setSearch(query);
      stateChanged = true;
    }
    if (type !== imageType) {
      setImageType(type);
      stateChanged = true;
    }
    if (orient !== orientation) {
      setOrientation(orient);
      stateChanged = true;
    }
    if (col !== color) {
      setColor(col);
      stateChanged = true;
    }
    if (width !== minWidth) {
      setMinWidth(width);
      stateChanged = true;
    }
    if (height !== minHeight) {
      setMinHeight(height);
      stateChanged = true;
    }
    if (page !== currentPage) {
      setCurrentPage(page);
      stateChanged = true;
    }

    // If there's a query in URL and state changed, perform search
    if (query.trim() && stateChanged) {
      performSearch(page, false, query);
    } else if (!query.trim()) {
      setResults([]);
      setTotalHits(0);
      setHasSearched(false);
    }
  });

  useEffect(() => {
    syncStateFromURL();
  }, [location.search]);

  // Trigger search when URL parameters change (but not from user input).
  // Same pattern: the effect event keeps the comparison against the latest
  // search/page state without forcing the effect to re-run while typing.
  const triggerSearchFromURL = useEffectEvent(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get("q") || "";
    const page = parseInt(urlParams.get("page") || "1");

    // Only search if there's a query and we're not already on the right page
    if (query.trim() && (query !== search || page !== currentPage)) {
      performSearch(page, false, query);
    }
  });

  useEffect(() => {
    triggerSearchFromURL();
  }, [location.search]);

  const clearSearch = () => {
    setSearch("");
    setResults([]);
    setTotalHits(0);
    setHasSearched(false);
    setCurrentPage(1);
    navigate("/search", { replace: true });
  };

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    updateURL(search, nextPage);
    performSearch(nextPage, true);
  };

  const searchFromHistory = (query: string) => {
    setSearch(query);
    updateURL(query, 1);
    performSearch(1, false, query);
  };

  return {
    // State
    search,
    results,
    error,
    loading,
    searchHistory,
    showFilters,
    currentPage,
    totalHits,
    hasSearched,
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
    searchFromHistory,
  };
};
