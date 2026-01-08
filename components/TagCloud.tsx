'use client';

import { useState, useEffect } from 'react';

interface TagCloudProps {
  onTagSelect: (tag: string) => void;
  selectedTag?: string;
}

export default function TagCloud({ onTagSelect, selectedTag }: TagCloudProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (data.data && Array.isArray(data.data)) {
        // Spam/garbage keywords to filter out
        const spamKeywords = [
          'advertising', 'advertisement', 'ads', 'ad24', 'ad', 
          'announcement', 'fyp', 'pussy', 'ass', 'ai<br',
          'spam', 'promo', 'promotion'
        ];
        
        // Parse tags - they might be objects with a 'name' or 'tag' property, or just strings
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
            
            // Strip ALL HTML tags including self-closing ones
            tagText = tagText
              .replace(/<[^>]*>/gi, '') // Remove all HTML tags
              .replace(/&nbsp;/gi, ' ') // Replace &nbsp; with space
              .replace(/&[a-z]+;/gi, '') // Remove other HTML entities
              .replace(/\s+/g, ' ') // Replace multiple spaces with single space
              .trim()
              .toLowerCase();
            
            return tagText;
          })
          .filter((tag: string) => {
            // Filter out empty, short, or spam tags
            if (!tag || tag.length < 3) return false;
            if (tag === '#' || tag === '##' || tag === '###' || tag === '####') return false;
            
            // Filter out spam keywords
            const isSpam = spamKeywords.some(spam => tag.includes(spam));
            if (isSpam) return false;
            
            // Filter out tags that are just numbers or symbols
            if (/^[0-9#]+$/.test(tag)) return false;
            
            return true;
          });
        
        // Remove duplicates and limit to top 100 most common
        const uniqueTags = [...new Set(parsedTags)].slice(0, 100) as string[];
        setTags(uniqueTags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-[#2a2a2a] rounded w-24"></div>
          <div className="flex flex-wrap gap-2">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="h-8 bg-[#2a2a2a] rounded-full w-20"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (tags.length === 0) return null;

  const displayTags = showAll ? tags : tags.slice(0, 20);

  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-[#ff9000]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
          </svg>
          Popular Tags
        </h3>
        {selectedTag && (
          <button
            onClick={() => onTagSelect('')}
            className="text-sm text-[#ff9000] hover:text-[#ffa31a] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {displayTags.map((tag, index) => {
          const tagString = typeof tag === 'string' ? tag : String(tag);
          return (
            <button
              key={`tag-${tagString}-${index}`}
              onClick={() => onTagSelect(tagString === selectedTag ? '' : tagString)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                tagString === selectedTag
                  ? 'bg-gradient-to-r from-[#ff6b00] to-[#ff9000] text-black shadow-lg shadow-[#ff9000]/30'
                  : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a] hover:text-white'
              }`}
            >
              #{tagString}
            </button>
          );
        })}
      </div>

      {tags.length > 20 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-gray-400 hover:text-[#ff9000] transition-colors flex items-center gap-1"
        >
          {showAll ? 'Show Less' : `Show All (${tags.length} tags)`}
          <svg 
            className={`w-4 h-4 transition-transform ${showAll ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
}
