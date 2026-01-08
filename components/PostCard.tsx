'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Post } from '@/types/api';

interface PostCardProps {
  post: Post;
  onClick?: () => void;
}

export default function PostCard({ post, onClick }: PostCardProps) {
  // Check if file object has a path property (not empty object)
  const hasFile = post.file && Object.keys(post.file).length > 0 && post.file.path;
  const hasAttachments = post.attachments && post.attachments.length > 0;
  
  const mediaFile = hasFile ? post.file : (hasAttachments ? post.attachments?.[0] : null);
  const mediaUrl = mediaFile?.path ? `https://coomer.st${mediaFile.path}` : null;
  
  // Check if it's a video based on file extension
  const isVideo = mediaFile?.name ? 
    /\.(mp4|webm|mov|avi|mkv)$/i.test(mediaFile.name) : 
    false;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const creatorUrl = `/creator/${post.service}/${post.id}`;

  return (
    <div className="group">
      {/* Thumbnail with author overlay - always render */}
      <div 
        onClick={onClick}
        className="relative aspect-video rounded-lg overflow-hidden mb-2 cursor-pointer bg-[#1a1a1a]"
      >
        {mediaUrl ? (
          <>
            {isVideo ? (
              <div className="absolute inset-0 bg-black">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#ff9000] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <Image
                src={mediaUrl}
                alt={post.title || 'Post'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
                quality={75}
                unoptimized
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
            <div className="text-center p-4">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-gray-500">Text Post</p>
            </div>
          </div>
        )}
        
        {/* Author overlay - top left, clickable */}
        <Link
          href={creatorUrl}
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md hover:bg-[#ff9000] hover:text-black transition-colors z-10"
        >
          <span className="text-white font-semibold text-xs hover:text-black">
            @{post.user}
          </span>
        </Link>
      </div>
      
      {/* Title - 1 line max, clickable */}
      {post.title && (
        <h3 
          onClick={onClick}
          className="text-white font-medium text-sm mb-1 line-clamp-1 cursor-pointer hover:text-[#ff9000] transition-colors"
        >
          {post.title}
        </h3>
      )}

      {/* Metadata - date and service */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{formatDate(post.published)}</span>
        <span>•</span>
        <Link 
          href={creatorUrl}
          onClick={(e) => e.stopPropagation()}
          className="capitalize hover:text-[#ff9000] transition-colors"
        >
          {post.service}
        </Link>
      </div>
    </div>
  );
}
