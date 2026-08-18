import React, { useRef } from "react";
import ImageList from "./ImageList";
import FilterPanel from "./FilterPanel";
import SearchHistory from "./SearchHistory";
import StatusCard from "./StatusCard";
import Button from "./Button";
import Icon from "./Icon";
import Spinner from "./Spinner";
import { useSearch } from "@/hooks/useSearch";
import { PER_PAGE } from "@/api/pixabay";
import { TRENDING_SEARCHES } from "@/constants/navLinks";

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

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() && !isSearchUnchanged) {
      performSearch();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    searchInputRef.current?.focus();
  };

  const handleKeyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
          <Spinner />
        </div>
      )}

      {hasSearched && !loading && !error && results.length === 0 && (
        <StatusCard
          icon="search"
          title="No results found"
          message={`No images match "${search}". Try different keywords or adjust the filters.`}
        />
      )}

      <ImageList images={results} />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Spinner size="sm" />
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={loadMore} disabled={loadingMore}>
            {loadingMore
              ? "Loading…"
              : `Load More (${Math.min(PER_PAGE, totalHits - results.length)})`}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImageSearch;
