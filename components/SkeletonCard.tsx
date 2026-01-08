'use client';

export function PostCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl sm:rounded-2xl overflow-hidden border border-[#2a2a2a] animate-pulse">
      <div className="relative aspect-video bg-[#2a2a2a] shimmer" />
      
      <div className="p-2 sm:p-4">
        <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
          <div className="h-3 sm:h-4 w-20 sm:w-24 bg-[#2a2a2a] rounded shimmer" />
          <div className="h-2 sm:h-3 w-2 sm:w-3 bg-[#2a2a2a] rounded-full hidden sm:block" />
          <div className="h-2 sm:h-3 w-12 sm:w-16 bg-[#2a2a2a] rounded shimmer hidden sm:block" />
        </div>

        <div className="h-4 sm:h-5 w-3/4 bg-[#2a2a2a] rounded mb-1 sm:mb-2 shimmer" />
        
        <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3 hidden sm:block">
          <div className="h-3 w-full bg-[#2a2a2a] rounded shimmer" />
          <div className="h-3 w-5/6 bg-[#2a2a2a] rounded shimmer" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-2 sm:h-3 w-16 sm:w-20 bg-[#2a2a2a] rounded shimmer" />
          <div className="h-2 sm:h-3 w-12 sm:w-16 bg-[#2a2a2a] rounded shimmer hidden sm:block" />
        </div>
      </div>
    </div>
  );
}

export function CreatorCardSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a] animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#2a2a2a] shimmer" />
        <div className="flex-1">
          <div className="h-5 w-32 bg-[#2a2a2a] rounded mb-2 shimmer" />
          <div className="h-3 w-20 bg-[#2a2a2a] rounded shimmer" />
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 w-16 bg-[#2a2a2a] rounded shimmer" />
          <div className="h-3 w-12 bg-[#2a2a2a] rounded shimmer" />
        </div>
        <div className="flex justify-between">
          <div className="h-3 w-20 bg-[#2a2a2a] rounded shimmer" />
          <div className="h-3 w-16 bg-[#2a2a2a] rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-xl p-4 border border-[#2a2a2a] flex gap-4 animate-pulse">
      <div className="w-32 h-32 flex-shrink-0 rounded-lg bg-[#2a2a2a] shimmer" />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-24 bg-[#2a2a2a] rounded shimmer" />
          <div className="h-3 w-3 bg-[#2a2a2a] rounded-full" />
          <div className="h-3 w-16 bg-[#2a2a2a] rounded shimmer" />
        </div>
        <div className="h-5 w-2/3 bg-[#2a2a2a] rounded mb-2 shimmer" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-[#2a2a2a] rounded shimmer" />
          <div className="h-3 w-4/5 bg-[#2a2a2a] rounded shimmer" />
        </div>
      </div>
    </div>
  );
}

export function TagCloudSkeleton() {
  return (
    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#151515] rounded-2xl p-6 border border-[#2a2a2a] mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 bg-[#2a2a2a] rounded shimmer" />
        <div className="h-5 w-32 bg-[#2a2a2a] rounded shimmer" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i} 
            className="h-8 bg-[#2a2a2a] rounded-full shimmer" 
            style={{ width: `${60 + Math.random() * 80}px` }}
          />
        ))}
      </div>
    </div>
  );
}
