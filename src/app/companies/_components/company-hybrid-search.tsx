'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type SearchMode = 'keyword' | 'semantic' | 'hybrid';

export function CompanyHybridSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('hybrid');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      // TODO: Implement actual search API call
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Searching for "${searchQuery}" using ${searchMode} search`);
      
      // TODO: Update UI with search results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
                placeholder="Search by hiring needs, tech stack, growth stage, or funding status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="flex items-center space-x-2 sm:w-auto w-full">
          <div className="flex items-center bg-white border border-gray-300 rounded-lg shadow-sm">
            <button
              type="button"
              onClick={() => setSearchMode('keyword')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg ${
                searchMode === 'keyword'
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300'
                  : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
              }`}
            >
              Keyword
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('semantic')}
              className={`px-3 py-2 text-sm font-medium ${
                searchMode === 'semantic'
                  ? 'bg-blue-50 text-blue-700 border-r border-gray-300'
                  : 'text-gray-700 hover:bg-gray-50 border-r border-gray-300'
              }`}
            >
              Semantic
            </button>
            <button
              type="button"
              onClick={() => setSearchMode('hybrid')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg ${
                searchMode === 'hybrid'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hybrid
            </button>
          </div>
          
          <button
            type="button"
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-1" />
            Advanced
          </button>
        </div>
      </div>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Partnership Search Tips</h3>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• <strong>Keyword search</strong>: Find companies by specific hiring needs or tech stack</li>
          <li>• <strong>Semantic search</strong>: Find companies with similar hiring challenges</li>
          <li>• <strong>Hybrid search</strong>: Best for finding ideal partnership matches</li>
          <li>• Try searching for specific roles, funding rounds, or growth stages</li>
        </ul>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-500 mr-2">Popular searches:</span>
        {['scaling engineering teams', 'Series B funding', 'technical hiring challenges', 'AI talent needs', 'no recruiting partners'].map((term) => (
          <button
            key={term}
            onClick={() => {
              setSearchQuery(term);
              document.querySelector<HTMLFormElement>('form')?.requestSubmit();
            }}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
