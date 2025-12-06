import React from "react";
import { FaHistory, FaFire } from "react-icons/fa";

interface SearchHistoryProps {
  search: {
    showHistory: boolean;
    searchHistory: string[];
    trendingSearches: string[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    performSearch: () => void;
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

  if (!showHistory) return null;

  const handleHistoryClick = (query: string) => {
    setSearchQuery(query);
    performSearch();
  };

  return (
    <div className="space-y-4">
      {searchHistory.length > 0 && (
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <FaHistory className="text-gray-400" />
            <span className="text-gray-300 text-sm">Recent searches</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.slice(0, 5).map((query, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(query)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-sm rounded-full transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <FaFire className="text-gray-400" />
          <span className="text-gray-300 text-sm">Trending searches</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {trendingSearches.map((query, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(query)}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 text-sm rounded-full border border-purple-500/30 transition-colors"
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
