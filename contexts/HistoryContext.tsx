'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { Post } from '@/types/api';

interface HistoryItem {
  post: Post;
  viewedAt: string;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (post: Post) => void;
  clearHistory: () => void;
  removeFromHistory: (postId: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const MAX_HISTORY_ITEMS = 100;

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedHistory = localStorage.getItem('viewHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('viewHistory', JSON.stringify(history));
    }
  }, [history, mounted]);

  const addToHistory = (post: Post) => {
    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item.post.id !== post.id);
      
      // Add to beginning
      const newHistory = [
        { post, viewedAt: new Date().toISOString() },
        ...filtered
      ];
      
      // Limit to MAX_HISTORY_ITEMS
      return newHistory.slice(0, MAX_HISTORY_ITEMS);
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('viewHistory');
  };

  const removeFromHistory = (postId: string) => {
    setHistory(prev => prev.filter(item => item.post.id !== postId));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
