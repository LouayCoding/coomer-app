'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import VideoPlayer from './VideoPlayer';
import { useHistory } from '@/contexts/HistoryContext';
import type { Post } from '@/types/api';

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const { addToHistory } = useHistory();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const mediaFile = post.file || post.attachments?.[0];
  const mediaUrl = mediaFile?.path ? `https://coomer.st${mediaFile.path}` : null;
  
  const isVideo = mediaFile?.name ? 
    /\.(mp4|webm|mov|avi|mkv)$/i.test(mediaFile.name) : 
    false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Backdrop click handler - only close if clicking directly on backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  // Swipe to close handler
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    const diff = Math.abs(e.targetTouches[0].clientY - touchStart);
    if (diff > 5) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = () => {
    if (!modalRef.current || isDragging) {
      setIsDragging(false);
      return;
    }
    
    const scrollTop = modalRef.current.scrollTop;
    const swipeDistance = touchStart - touchEnd;
    const minSwipeDistance = 100;
    
    // Only close on downward swipe when at top of scroll
    if (scrollTop === 0 && swipeDistance < -minSwipeDistance) {
      onClose();
    }
    setIsDragging(false);
  };

  useEffect(() => {
    // Add to history when modal opens
    addToHistory(post);
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Prevent body scroll on mobile
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';
    
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      
      // Restore body styles first
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position after a small delay to prevent jump
      setTimeout(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, 0);
    };
  }, [onClose, post, addToHistory]);

  return (
    <div 
      ref={backdropRef}
      className="fixed inset-0 z-50 bg-black sm:bg-black/95 sm:flex sm:items-center sm:justify-center sm:p-4"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full h-full sm:max-w-4xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-y-auto bg-[#1a1a1a] sm:rounded-2xl overscroll-contain animate-slide-up sm:animate-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 w-12 h-12 rounded-full bg-black/70 hover:bg-black/90 flex items-center justify-center transition-colors backdrop-blur-sm"
          aria-label="Close"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Media */}
        {mediaUrl && (
          <div className="w-full bg-black">
            {isVideo ? (
              <VideoPlayer 
                src={mediaUrl}
                title={post.title || 'Video'}
              />
            ) : (
              <div className="relative w-full min-h-[50vh] sm:min-h-0 flex items-center justify-center">
                <img
                  src={mediaUrl}
                  alt={post.title || 'Post image'}
                  className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] object-contain"
                  loading="eager"
                  decoding="async"
                />
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4 text-sm">
            <span className="text-[#ff9000] font-semibold">@{post.user}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 capitalize">{post.service}</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">{formatDate(post.published)}</span>
          </div>

          {post.title && (
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{post.title}</h2>
          )}

          {post.content && (
            <div 
              className="text-gray-300 mb-4 prose prose-invert prose-sm sm:prose-base max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          {post.attachments && post.attachments.length > 1 && (
            <div className="mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3">
                Attachments ({post.attachments.length})
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {post.attachments.map((attachment, idx) => (
                  <div key={idx} className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#ff9000] transition-all">
                    <img
                      src={`https://coomer.st${attachment.path}`}
                      alt={attachment.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
