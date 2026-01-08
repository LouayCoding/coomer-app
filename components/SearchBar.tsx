'use client';

import { useState } from 'react';
import { SERVICES } from '@/lib/constants';

interface SearchBarProps {
  onSearch: (query: string, service: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = 'Search...' }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [service, setService] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, service);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
      <div className="flex-1 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 bg-[#1a1a1a]/50 border border-[#2a2a2a]/50 rounded-lg text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:bg-[#1a1a1a] focus:border-[#ff9000]/50 transition-all"
        />
        <svg
          className="absolute left-3 sm:left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      <select
        value={service}
        onChange={(e) => setService(e.target.value)}
        className="px-3 sm:px-4 py-2.5 sm:py-3 bg-[#1a1a1a]/50 border border-[#2a2a2a]/50 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:bg-[#1a1a1a] focus:border-[#ff9000]/50 transition-all cursor-pointer"
      >
        <option value="">All</option>
        {SERVICES.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s}
          </option>
        ))}
      </select>

      <button
        onClick={handleSubmit}
        className="px-4 sm:px-6 py-2.5 sm:py-3 bg-[#ff9000] hover:bg-[#ffa010] text-black font-semibold rounded-lg text-sm sm:text-base transition-all"
      >
        Search
      </button>
    </div>
  );
}
