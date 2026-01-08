'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { Post } from '@/types/api';

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        const parsedTags = data.data
          .map((tag: any) => {
            let tagText = '';
            if (typeof tag === 'string') {
              tagText = tag;
            } else if (tag && typeof tag === 'object') {
              tagText = tag.name || tag.tag || tag.value || String(tag);
            } else {
              tagText = String(tag);
            }
            
            tagText = tagText
              .replace(/<[^>]*>/gi, '')
              .replace(/&nbsp;/gi, ' ')
              .replace(/&[a-z]+;/gi, '')
              .replace(/\s+/g, ' ')
              .trim();
            
            return tagText;
          })
          .filter((tag: string) => tag && tag.length > 0 && tag !== '#' && tag !== '##' && tag !== '###');
        
        setTags(parsedTags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTagClick = async (tag: string) => {
    setSelectedTag(tag);
    setLoadingPosts(true);
    
    try {
      const response = await fetch(`/api/posts?q=${encodeURIComponent(tag)}`);
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        setPosts(data.data);
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error('Error fetching posts for tag:', error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  const filteredTags = searchQuery
    ? tags.filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    : tags;

  const tagsByLetter = filteredTags.reduce((acc, tag) => {
    const firstLetter = tag[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(tag);
    return acc;
  }, {} as Record<string, string[]>);

  const sortedLetters = Object.keys(tagsByLetter).sort();

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
            Browse by <span className="gradient-text">Tags</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-400">Explore {tags.length.toLocaleString()} tags and discover content</p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-4 py-3.5 pl-12 bg-[#1a1a1a] border-2 border-[#2a2a2a] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ff9000] transition-all"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a] sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4">All Tags</h2>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {sortedLetters.map((letter) => (
                    <div key={letter}>
                      <h3 className="text-[#ff9000] font-bold text-lg mb-2">{letter}</h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tagsByLetter[letter].map((tag, index) => (
                          <button
                            key={`${tag}-${index}`}
                            onClick={() => handleTagClick(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              tag === selectedTag
                                ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff9000] text-black shadow-lg shadow-[#ff9000]/30'
                                : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
                            }`}
                          >
                            #{tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {!selectedTag ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="text-gray-400 text-lg">Select a tag to view posts</p>
                </div>
              ) : loadingPosts ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Posts tagged with <span className="gradient-text">#{selectedTag}</span>
                    </h2>
                    <p className="text-gray-400">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
                  </div>

                  {posts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No posts found for this tag</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {posts.map((post) => (
                        <PostCard 
                          key={post.id} 
                          post={post} 
                          onClick={() => setSelectedPost(post)}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>

      {selectedPost && (
        <PostModal 
          post={selectedPost} 
          onClose={() => setSelectedPost(null)} 
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff9000;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #ffa31a;
        }
      `}</style>
    </div>
  );
}
