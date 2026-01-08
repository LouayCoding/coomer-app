'use client';

import { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import SimpleSortFilter from '@/components/SimpleSortFilter';
import Announcements from '@/components/Announcements';
import LinkedAccounts from '@/components/LinkedAccounts';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import type { Post, Service } from '@/types/api';

const POSTS_PER_PAGE = 50;

export default function CreatorDetailPage({
  params,
}: {
  params: Promise<{ service: Service; id: string }>;
}) {
  const { service, id } = use(params);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOption, setSortOption] = useState('date-desc');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  const fetchCreatorPosts = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const creatorId = id;
      const offset = page * POSTS_PER_PAGE;
      const response = await fetch(`/api/creator/${service}/${creatorId}?offset=${offset}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setAllPosts([]);
      } else if (data.data && Array.isArray(data.data)) {
        setAllPosts(data.data);
        // Estimate total based on whether we got a full page
        if (data.data.length === POSTS_PER_PAGE) {
          setTotalPosts((page + 2) * POSTS_PER_PAGE);
        } else {
          setTotalPosts(page * POSTS_PER_PAGE + data.data.length);
        }
      } else {
        setAllPosts([]);
      }
    } catch (error) {
      console.error('Error fetching creator posts:', error);
      setError('Failed to load creator posts');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...allPosts];

    // Filter by media type
    if (sortOption === 'video') {
      filtered = filtered.filter(post => {
        const file = post.file || post.attachments?.[0];
        return file?.name && /\.(mp4|webm|mov|avi|mkv)$/i.test(file.name);
      });
    } else if (sortOption === 'image') {
      filtered = filtered.filter(post => {
        const file = post.file || post.attachments?.[0];
        return file?.name && /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(file.name);
      });
    }

    // Sort by date
    if (sortOption === 'date-desc' || sortOption === 'date-asc') {
      filtered.sort((a, b) => {
        const dateA = new Date(a.published).getTime();
        const dateB = new Date(b.published).getTime();
        return sortOption === 'date-desc' ? dateB - dateA : dateA - dateB;
      });
    }

    return filtered;
  }, [allPosts, sortOption]);

  useEffect(() => {
    fetchCreatorPosts(currentPage);
  }, [currentPage, service, id]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-white">
              <span className="gradient-text">@{id}</span>
            </h1>
            <span className="px-3 py-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full text-sm text-gray-400 capitalize">
              {service}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-gray-400">All posts from this creator</p>
            <SimpleSortFilter onSortChange={setSortOption} currentSort={sortOption} />
          </div>
        </div>

        <Announcements service={service} creatorId={id} creatorName={id} />
        
        <LinkedAccounts service={service} creatorId={id} />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-[#1a1a1a] border border-[#ff9000] rounded-lg p-8 max-w-md mx-auto">
              <h2 className="text-xl font-bold text-white mb-4">Creator Not Found</h2>
              <p className="text-gray-400 mb-6">
                This creator ID doesn't exist or the username is incorrect. 
                Please use the Creators page to find the correct creator.
              </p>
              <Link
                href="/creators"
                className="inline-block px-6 py-3 bg-[#ff9000] hover:bg-[#ffa31a] text-black font-semibold rounded-lg transition-colors"
              >
                Browse Creators
              </Link>
            </div>
          </div>
        ) : (
          <>
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No posts found</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm">
                  <span className="text-gray-400">Showing </span>
                  <span className="text-white font-medium">
                    {currentPage * POSTS_PER_PAGE + 1}-{currentPage * POSTS_PER_PAGE + filteredPosts.length}
                  </span>
                  <span className="text-gray-400"> of </span>
                  <span className="text-white font-medium">{totalPosts}</span>
                  <span className="text-gray-400"> posts</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard 
                      key={post.id} 
                      post={post}
                      onClick={() => setSelectedPost(post)}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalPosts / POSTS_PER_PAGE)}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </main>

      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}
    </div>
  );
}
