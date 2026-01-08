'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type ViewMode = 'grid' | 'list';

interface ViewContextType {
  viewMode: ViewMode;
  toggleViewMode: () => void;
  setViewMode: (mode: ViewMode) => void;
}

const ViewContext = createContext<ViewContextType | undefined>(undefined);

export function ViewProvider({ children }: { children: React.ReactNode }) {
  const [viewMode, setViewModeState] = useState<ViewMode>('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedView = localStorage.getItem('viewMode') as ViewMode;
    if (savedView) {
      setViewModeState(savedView);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('viewMode', viewMode);
    }
  }, [viewMode, mounted]);

  const toggleViewMode = () => {
    setViewModeState(prev => prev === 'grid' ? 'list' : 'grid');
  };

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  return (
    <ViewContext.Provider value={{ viewMode, toggleViewMode, setViewMode }}>
      {children}
    </ViewContext.Provider>
  );
}

export function useView() {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error('useView must be used within a ViewProvider');
  }
  return context;
}
