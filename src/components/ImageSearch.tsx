import React, { useRef } from "react";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import ImageList from "./ImageList";
import FilterPanel from "./FilterPanel";
import SearchHistory from "./SearchHistory";
import { useSearch } from "../hooks/useSearch";
import { TRENDING_SEARCHES } from "../constants/navLinks";

function ImageSearch() {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const {
    search,
    results,
    error,
    loading,
    showFilters,
    totalHits,
    hasSearched,
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
    if (search.trim()) {
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
    <div className="space-y-6">
      {/* Search Form */}
      <form
        className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg"
        onSubmit={onSubmitForm}
      >
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search for images..."
              value={search}
              onChange={onInputChange}
              onKeyDown={handleKeyDownInput}
              className="w-full pl-10 pr-10 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent backdrop-blur-sm"
            />
            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg transition-all duration-300 ${
              showFilters
                ? "bg-purple-600 text-white"
                : "bg-white/20 hover:bg-white/30 text-white"
            }`}
          >
            <FaFilter />
          </button>
          <button
            type="submit"
            disabled={loading || !search.trim()}
            className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium hover:scale-105 shadow-lg hover:shadow-purple-500/25 focus-ring"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Filter Panel */}
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

        {/* Search History */}
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
        <div className="bg-red-500/20 backdrop-blur-md border border-red-400 text-red-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <FaTimes className="text-red-400" />
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {hasSearched && (
        <div className="text-white text-lg font-medium">
          Found {totalHits.toLocaleString()} images{" "}
          {results.length > 0 && `(${results.length} loaded)`}
        </div>
      )}

      {loading && results.length === 0 && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      <ImageList images={results} />

      {/* Load More Button */}
      {results.length > 0 && results.length < totalHits && (
        <div className="flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-300 disabled:opacity-50 font-medium"
          >
            {loading
              ? "Loading..."
              : `Load More (${Math.min(20, totalHits - results.length)})`}
          </button>
        </div>
      )}
    </div>
  );
}

export default ImageSearch;
