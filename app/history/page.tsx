'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import PostModal from '@/components/PostModal';
import { useHistory } from '@/contexts/HistoryContext';
import { useView } from '@/contexts/ViewContext';
import { useToast } from '@/contexts/ToastContext';
import type { Post } from '@/types/api';

export default function HistoryPage() {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const { viewMode, toggleViewMode } = useView();
  const { showToast } = useToast();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClearHistory = () => {
    const count = history.length;
    clearHistory();
    setShowClearConfirm(false);
    showToast(`Cleared ${count} item${count !== 1 ? 's' : ''} from history`, 'success');
  };

  const handleRemoveItem = (postId: string) => {
    removeFromHistory(postId);
    showToast('Removed from history', 'info');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-16 lg:pb-0">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2">
                View <span className="gradient-text">History</span>
              </h1>
              <p className="text-sm sm:text-base text-gray-400">
                {history.length} post{history.length !== 1 ? 's' : ''} viewed
              </p>
            </div>
            
            <div className="flex items-center gap-2">
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
              
              {history.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="px-4 py-2.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all font-medium"
                >
                  Clear History
                </button>
              )}
            </div>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <p className="text-gray-400 text-lg">No viewing history yet</p>
            <p className="text-gray-500 text-sm mt-2">Posts you view will appear here</p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {history.map((item) => (
                  <div key={`${item.post.id}-${item.viewedAt}`} className="relative">
                    <PostCard 
                      post={item.post} 
                      onClick={() => setSelectedPost(item.post)}
                    />
                    <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-300">
                      {formatDate(item.viewedAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((item) => {
                  const post = item.post;
                  const mediaFile = post.file && Object.keys(post.file).length > 0 && post.file.path 
                    ? post.file 
                    : (post.attachments && post.attachments.length > 0 ? post.attachments[0] : null);
                  const mediaUrl = mediaFile?.path ? `https://coomer.st${mediaFile.path}` : null;
                  
                  return (
                    <div
                      key={`${post.id}-${item.viewedAt}`}
                      className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-4 border border-[#2a2a2a] hover:border-[#ff9000] transition-all flex gap-4 group"
                    >
                      <div 
                        onClick={() => setSelectedPost(post)}
                        className="flex gap-4 flex-1 cursor-pointer"
                      >
                        {mediaUrl && (
                          <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-black">
                            <img
                              src={mediaUrl}
                              alt={post.title || 'Post'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[#ff9000] font-semibold text-sm">@{post.user}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 text-xs capitalize">{post.service}</span>
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="text-gray-500 text-xs">{formatDate(item.viewedAt)}</span>
                          </div>
                          {post.title && (
                            <h3 className="text-white font-semibold mb-1 line-clamp-1">{post.title}</h3>
                          )}
                          {post.content && (
                            <p className="text-gray-400 text-sm line-clamp-2">{post.content.replace(/<[^>]*>/g, '')}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(post.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all"
                        aria-label="Remove from history"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
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

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 max-w-md w-full border border-[#2a2a2a]">
            <h3 className="text-xl font-bold text-white mb-2">Clear History?</h3>
            <p className="text-gray-400 mb-6">
              This will permanently delete all {history.length} viewed posts from your history. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-2.5 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-xl transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleClearHistory}
                className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
