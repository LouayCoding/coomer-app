'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import { PostCardSkeleton } from '@/components/SkeletonCard';
import type { Post } from '@/types/api';

export default function PopularPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    fetchPopularPosts();
  }, []);

  const fetchPopularPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/popular');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching popular posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            <span className="gradient-text">Popular</span> Posts
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Trending content from the community</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No popular posts found</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm">
              <span className="text-gray-400">Showing </span>
              <span className="text-white font-medium">1-{posts.length}</span>
              <span className="text-gray-400"> of </span>
              <span className="text-white font-medium">{posts.length}</span>
              <span className="text-gray-400"> popular posts</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  onClick={() => setSelectedPost(post)}
                />
              ))}
            </div>
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
