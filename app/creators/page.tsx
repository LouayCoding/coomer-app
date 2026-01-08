'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CreatorCard from '@/components/CreatorCard';
import { CreatorCardSkeleton } from '@/components/SkeletonCard';
import type { Creator } from '@/types/api';

const ITEMS_PER_PAGE = 50;

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [displayedCreators, setDisplayedCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [loadingRandom, setLoadingRandom] = useState(false);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        // Only fetch first page initially
        const response = await fetch(`/api/creators?limit=${ITEMS_PER_PAGE}&offset=0`);
        const data = await response.json();
        
        if (data.data && Array.isArray(data.data)) {
          setCreators(data.data);
          setFilteredCreators(data.data);
          setDisplayedCreators(data.data);
        }
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      const offset = displayedCreators.length;
      const response = await fetch(`/api/creators?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        setCreators(prev => [...prev, ...data.data]);
        setFilteredCreators(prev => [...prev, ...data.data]);
        setDisplayedCreators(prev => [...prev, ...data.data]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more creators:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, displayedCreators.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedCreators.length < filteredCreators.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, displayedCreators.length, filteredCreators.length]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setLoading(true);
    
    try {
      // Search with API - let backend handle filtering
      const searchParam = query.trim() ? `&q=${encodeURIComponent(query)}` : '';
      const response = await fetch(`/api/creators?limit=${ITEMS_PER_PAGE}&offset=0${searchParam}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setCreators(data.data);
        setFilteredCreators(data.data);
        setDisplayedCreators(data.data);
        setPage(1);
      }
    } catch (error) {
      console.error('Error searching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomCreators = async () => {
    setLoadingRandom(true);
    try {
      const response = await fetch('/api/random-creators');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setCreators(data.data);
        setFilteredCreators(data.data);
        setDisplayedCreators(data.data.slice(0, ITEMS_PER_PAGE));
        setPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error fetching random creators:', error);
    } finally {
      setLoadingRandom(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            All <span className="gradient-text">Creators</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            Browse {creators.length.toLocaleString()} creators across all platforms
            {filteredCreators.length !== creators.length && (
              <span> • Showing {filteredCreators.length.toLocaleString()} filtered</span>
            )}
          </p>
        </div>

        <div className="mb-8">
          <SearchBar onSearch={handleSearch} placeholder="Search creators..." />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CreatorCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredCreators.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No creators found</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4 md:gap-4">
                  {displayedCreators.map((creator) => (
                    <CreatorCard key={`${creator.service}-${creator.id}`} creator={creator} />
                  ))}
                </div>

                {displayedCreators.length < filteredCreators.length && (
                  <div ref={observerTarget} className="flex justify-center py-8">
                    {loadingMore && (
                      <div className="text-gray-400">
                        Loading more creators...
                      </div>
                    )}
                  </div>
                )}

                {displayedCreators.length >= filteredCreators.length && filteredCreators.length > ITEMS_PER_PAGE && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      All {filteredCreators.length.toLocaleString()} creators loaded
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
