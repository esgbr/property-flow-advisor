
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Pagination component for navigating through multiple pages
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  maxVisiblePages = 5,
  className = '',
  size = 'default'
}) => {
  // Handle page changes
  const goToPage = (page: number) => {
    // Ensure page is within valid range
    const validPage = Math.max(1, Math.min(page, totalPages));
    onPageChange(validPage);
  };
  
  // Generate visible page numbers
  const getVisiblePageNumbers = (): number[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate range to show based on current page
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    
    // Adjust if end page exceeds total pages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  const visiblePages = getVisiblePageNumbers();
  
  // Size classes for buttons
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    default: 'h-10 w-10',
    lg: 'h-12 w-12 text-lg'
  };
  
  const pageButtonSize = size === 'default' ? 'sm' : size;
  
  if (totalPages <= 1) return null;
  
  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={cn('flex items-center justify-center space-x-1', className)}
    >
      {/* First page button */}
      {showFirstLast && (
        <Button
          variant="outline"
          size={pageButtonSize}
          className={cn(sizeClasses[size])}
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* Previous page button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size={pageButtonSize}
          className={cn(sizeClasses[size])}
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {/* Page number buttons */}
      {visiblePages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? 'default' : 'outline'}
          size={pageButtonSize}
          className={cn(sizeClasses[size])}
          onClick={() => goToPage(page)}
          aria-label={`Page ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </Button>
      ))}
      
      {/* Next page button */}
      {showPrevNext && (
        <Button
          variant="outline"
          size={pageButtonSize}
          className={cn(sizeClasses[size])}
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
      
      {/* Last page button */}
      {showFirstLast && (
        <Button
          variant="outline"
          size={pageButtonSize}
          className={cn(sizeClasses[size])}
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      )}
    </nav>
  );
};

export default Pagination;
