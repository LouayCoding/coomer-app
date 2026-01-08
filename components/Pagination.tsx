'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage < 4) {
        for (let i = 0; i < 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      } else if (currentPage > totalPages - 5) {
        pages.push(0);
        pages.push('...');
        for (let i = totalPages - 5; i < totalPages; i++) pages.push(i);
      } else {
        pages.push(0);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages - 1);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mt-8 pb-16 lg:pb-0 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/50 border border-[#2a2a2a]/50 rounded-lg text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:border-[#ff9000]/50 transition-all"
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 py-2 text-gray-500">
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm transition-all ${
              currentPage === page
                ? 'bg-[#ff9000] text-black font-semibold'
                : 'bg-[#1a1a1a]/50 border border-[#2a2a2a]/50 text-white hover:bg-[#1a1a1a] hover:border-[#ff9000]/50'
            }`}
          >
            {(page as number) + 1}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="px-3 sm:px-4 py-2 bg-[#1a1a1a]/50 border border-[#2a2a2a]/50 rounded-lg text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a1a1a] hover:border-[#ff9000]/50 transition-all"
      >
        Next
      </button>
    </div>
  );
}
