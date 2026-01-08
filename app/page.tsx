'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import Pagination from '@/components/Pagination';
import { PostCardSkeleton, PostListSkeleton } from '@/components/SkeletonCard';
import { useView } from '@/contexts/ViewContext';
import { useToast } from '@/contexts/ToastContext';
import type { Post } from '@/types/api';

const POSTS_PER_PAGE = 25;

export default function Home() {
  const { viewMode, toggleViewMode } = useView();
  const { showToast } = useToast();
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    
    try {
      const offset = page * POSTS_PER_PAGE;
      const url = `/api/posts?offset=${offset}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.details || errorData.error || `HTTP ${response.status}`;
        showToast(`Failed to load posts: ${errorMsg}`, 'error');
        return;
      }
      
      const data = await response.json();
      
      let newPosts: Post[] = [];
      if (data.data && Array.isArray(data.data)) {
        newPosts = data.data;
      } else if (Array.isArray(data)) {
        newPosts = data;
      }
      
      setAllPosts(newPosts);
      
      // Estimate total based on whether we got a full page
      if (newPosts.length === POSTS_PER_PAGE) {
        setTotalPosts((page + 2) * POSTS_PER_PAGE);
      } else {
        setTotalPosts(page * POSTS_PER_PAGE + newPosts.length);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      showToast('Error loading posts. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchPosts(0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                Latest <span className="gradient-text">Posts</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400">Browse the latest content from creators</p>
            </div>
            <button
              onClick={toggleViewMode}
              className="p-2.5 text-gray-300 hover:text-white hover:bg-[#1a1a1a] rounded-xl transition-all"
              aria-label="Toggle view mode"
            >
              {viewMode === 'grid' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {loading ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostListSkeleton key={i} />
              ))}
            </div>
          )
        ) : (
          <>
            {allPosts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No posts found</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm">
                  <span className="text-gray-400">Showing </span>
                  <span className="text-white font-medium">
                    {currentPage * POSTS_PER_PAGE + 1}-{currentPage * POSTS_PER_PAGE + allPosts.length}
                  </span>
                  <span className="text-gray-400"> of </span>
                  <span className="text-white font-medium">{totalPosts}</span>
                  <span className="text-gray-400"> posts</span>
                </div>

                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {allPosts.map((post) => (
                      <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={() => setSelectedPost(post)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allPosts.map((post) => {
                      const mediaFile = post.file && Object.keys(post.file).length > 0 && post.file.path 
                        ? post.file 
                        : (post.attachments && post.attachments.length > 0 ? post.attachments[0] : null);
                      const mediaUrl = mediaFile?.path ? `https://coomer.st${mediaFile.path}` : null;
                      const creatorUrl = `/creator/${post.service}/${post.id}`;
                      
                      return (
                        <div
                          key={post.id}
                          className="bg-[#1a1a1a]/50 rounded-lg p-3 border border-[#2a2a2a]/50 hover:bg-[#1a1a1a] hover:border-[#ff9000]/50 transition-all flex gap-3"
                        >
                          {mediaUrl && (
                            <div 
                              onClick={() => setSelectedPost(post)}
                              className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-lg overflow-hidden bg-black cursor-pointer"
                            >
                              <Image
                                src={mediaUrl}
                                alt={post.title || 'Post'}
                                fill
                                sizes="112px"
                                className="object-cover"
                                loading="lazy"
                                unoptimized
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Link
                                href={creatorUrl}
                                onClick={(e) => e.stopPropagation()}
                                className="text-[#ff9000] font-semibold text-sm hover:text-[#ffa010] transition-colors"
                              >
                                @{post.user}
                              </Link>
                              <span className="text-gray-500 text-xs">•</span>
                              <span className="text-gray-500 text-xs capitalize">{post.service}</span>
                            </div>
                            {post.title && (
                              <h3 
                                onClick={() => setSelectedPost(post)}
                                className="text-white font-medium text-sm mb-1 line-clamp-1 cursor-pointer hover:text-[#ff9000] transition-colors"
                              >
                                {post.title}
                              </h3>
                            )}
                            {post.content && (
                              <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{post.content.replace(/<[^>]*>/g, '')}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

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
