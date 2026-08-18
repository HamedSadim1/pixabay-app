import React, { useRef } from "react";
import ImageList from "./ImageList";
import FilterPanel from "./FilterPanel";
import SearchHistory from "./SearchHistory";
import Button from "./Button";
import Icon from "./Icon";
import { useSearch } from "../hooks/useSearch";
import { TRENDING_SEARCHES } from "../constants/navLinks";

function ImageSearch() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    search,
    results,
    error,
    loading,
    loadingMore,
    hasMore,
    showFilters,
    totalHits,
    hasSearched,
    isSearchUnchanged,
    searchHistory,
    imageType,
    orientation,
    color,
    minWidth,
    minHeight,
    setSearch,
    performSearch,
    clearSearch,
    loadMore,
    setShowFilters,
    setImageType,
    setOrientation,
    setColor,
    setMinWidth,
    setMinHeight,
  } = useSearch();

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearch(e.target.value);
  };

  const onSubmitForm: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (search.trim() && !isSearchUnchanged) {
      performSearch();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    searchInputRef.current?.focus();
  };

  const handleKeyDownInput: React.KeyboardEventHandler<HTMLInputElement> = (
    e,
  ) => {
    if (e.key === "Escape") {
      handleClearSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Form */}
      <form onSubmit={onSubmitForm}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for images..."
              aria-label="Search for images"
              value={search}
              onChange={onInputChange}
              onKeyDown={handleKeyDownInput}
              className="w-full border border-line bg-panel py-3 pl-11 pr-10 font-mono text-sm text-paper placeholder-muted focus:border-safelight focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-safelight"
              >
                <Icon name="xmark" />
              </button>
            )}
          </div>
          <Button
            type="button"
            variant={showFilters ? "primary" : "default"}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Icon name="filter" /> Filters
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !search.trim() || isSearchUnchanged}
          >
            {loading ? (
              "Searching…"
            ) : (
              <>
                <Icon name="search" /> Search
              </>
            )}
          </Button>
        </div>

        <FilterPanel
          search={{
            showFilters,
            imageType,
            orientation,
            color,
            minWidth,
            minHeight,
            setImageType,
            setOrientation,
            setColor,
            setMinWidth,
            setMinHeight,
          }}
        />

        <SearchHistory
          search={{
            showHistory: !search,
            searchHistory,
            trendingSearches: TRENDING_SEARCHES,
            searchQuery: search,
            setSearchQuery: setSearch,
            performSearch,
          }}
        />
      </form>

      {error && (
        <div className="flex items-center gap-2 border border-safelight bg-safelight/10 p-4 font-mono text-xs uppercase tracking-[0.12em] text-safelight">
          <Icon name="xmark" /> Error: {error}
        </div>
      )}

      {hasSearched && (
        <p className="font-mono text-xs uppercase tracking-meta text-muted">
          Found <span className="text-paper">{totalHits.toLocaleString()}</span>{" "}
          images
          {results.length > 0 && ` — ${results.length} loaded`}
        </p>
      )}

      {loading && results.length === 0 && (
        <div className="flex justify-center py-8">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-safelight" />
        </div>
      )}

      {hasSearched && !loading && !error && results.length === 0 && (
        <div className="border border-line bg-panel p-10 text-center">
          <div className="mb-3 text-3xl text-muted">
            <Icon name="search" />
          </div>
          <h2 className="mb-2 font-display text-lg uppercase tracking-[0.03em] text-paper">
            No results found
          </h2>
          <p className="font-mono text-xs text-muted">
            No images match "{search}". Try different keywords or adjust the
            filters.
          </p>
        </div>
      )}

      <ImageList images={results} />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-line border-t-safelight" />
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loadingMore}>
            {loadingMore
              ? "Loading…"
              : `Load More (${Math.min(20, totalHits - results.length)})`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImageSearch;
