import React from "react";

interface SearchHistoryProps {
  search: {
    showHistory: boolean;
    searchHistory: string[];
    trendingSearches: string[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    performSearch: (page?: number, append?: boolean, query?: string) => void;
  };
}

const SearchHistory: React.FC<SearchHistoryProps> = ({ search }) => {
  const {
    showHistory,
    searchHistory,
    trendingSearches,
    setSearchQuery,
    performSearch,
  } = search;

  if (!showHistory) {
    return null;
  }

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    performSearch(1, false, query);
  };

  return (
    <div className="mt-5 space-y-5">
      {searchHistory.length > 0 && (
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
            Recent Searches
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="border border-line px-3 py-1.5 font-mono text-xs text-muted transition-colors hover:border-safelight hover:text-paper"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
          Trending
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((query, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(query)}
              className="border border-safelight/40 px-3 py-1.5 font-mono text-xs text-safelight transition-colors hover:border-safelight hover:bg-safelight hover:text-dark"
            >
              {query}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchHistory;
