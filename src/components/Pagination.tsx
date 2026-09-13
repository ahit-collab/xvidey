import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  isLightMode: boolean;
  id?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 20,
  isLightMode,
  id = 'pagination-controls'
}) => {
  if (totalPages <= 1) return null;

  // Generate page numbers to show (e.g. 1, 2, 3, 4, 5...)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div id={id} className="mt-8 mb-6 flex flex-col items-center gap-3">
      {/* Pagination button bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
        {/* Previous Button */}
        <button
          id={`${id}-prev-btn`}
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentPage === 1
              ? 'opacity-35 cursor-not-allowed border-transparent'
              : isLightMode
              ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm active:scale-95'
              : 'bg-[#181820] hover:bg-[#252530] text-slate-200 border border-white/10 active:scale-95'
          }`}
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {getPageNumbers().map((pageItem, index) => {
            if (pageItem === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className={`w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center text-xs sm:text-sm ${
                    isLightMode ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  ...
                </span>
              );
            }

            const pageNum = pageItem as number;
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                id={`${id}-page-${pageNum}`}
                onClick={() => handlePageClick(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[32px] h-8 sm:min-w-[38px] sm:h-9 px-2 rounded-lg text-xs sm:text-sm font-semibold transition flex items-center justify-center ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30 scale-105'
                    : isLightMode
                    ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm active:scale-95'
                    : 'bg-[#181820] hover:bg-[#252530] text-slate-200 border border-white/10 active:scale-95'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          id={`${id}-next-btn`}
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition ${
            currentPage === totalPages
              ? 'opacity-35 cursor-not-allowed border-transparent'
              : isLightMode
              ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm active:scale-95'
              : 'bg-[#181820] hover:bg-[#252530] text-slate-200 border border-white/10 active:scale-95'
          }`}
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
