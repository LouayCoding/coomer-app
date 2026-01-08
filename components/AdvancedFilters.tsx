'use client';

import { useState } from 'react';

export interface FilterOptions {
  hasVideo: boolean | null;
  hasImage: boolean | null;
  dateFrom: string;
  dateTo: string;
  minAttachments: number;
  minDuration: number; // Video duration in seconds
  maxDuration: number; // Video duration in seconds
  sortBy: 'date' | 'attachments';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    hasVideo: null,
    hasImage: null,
    dateFrom: '',
    dateTo: '',
    minAttachments: 0,
    minDuration: 0,
    maxDuration: 3600, // 1 hour default max
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      hasVideo: null,
      hasImage: null,
      dateFrom: '',
      dateTo: '',
      minAttachments: 0,
      minDuration: 0,
      maxDuration: 3600,
      sortBy: 'date',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg text-white hover:border-[#ff9000] transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Advanced Filters
        <svg 
          className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showFilters && (
        <div className="mt-4 p-6 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Media Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Media Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasVideo === true}
                    onChange={(e) => handleFilterChange('hasVideo', e.target.checked ? true : null)}
                    className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#ff9000] focus:ring-[#ff9000]"
                  />
                  Videos only
                </label>
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.hasImage === true}
                    onChange={(e) => handleFilterChange('hasImage', e.target.checked ? true : null)}
                    className="w-4 h-4 rounded border-[#2a2a2a] bg-[#0a0a0a] text-[#ff9000] focus:ring-[#ff9000]"
                  />
                  Images only
                </label>
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-white text-sm focus:outline-none focus:border-[#ff9000]"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-white text-sm focus:outline-none focus:border-[#ff9000]"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Attachments Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Min. Attachments: {filters.minAttachments}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.minAttachments}
                onChange={(e) => handleFilterChange('minAttachments', parseInt(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#ff9000]"
              />
            </div>

            {/* Video Duration Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Min. Duration: {formatDuration(filters.minDuration)}
              </label>
              <input
                type="range"
                min="0"
                max="600"
                step="30"
                value={filters.minDuration}
                onChange={(e) => handleFilterChange('minDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#ff9000]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Max. Duration: {formatDuration(filters.maxDuration)}
              </label>
              <input
                type="range"
                min="60"
                max="3600"
                step="60"
                value={filters.maxDuration}
                onChange={(e) => handleFilterChange('maxDuration', parseInt(e.target.value))}
                className="w-full h-2 bg-[#2a2a2a] rounded-lg appearance-none cursor-pointer accent-[#ff9000]"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-white text-sm focus:outline-none focus:border-[#ff9000] cursor-pointer"
              >
                <option value="date">Date</option>
                <option value="attachments">Attachments</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Order
              </label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
                className="w-full px-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded text-white text-sm focus:outline-none focus:border-[#ff9000] cursor-pointer"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
