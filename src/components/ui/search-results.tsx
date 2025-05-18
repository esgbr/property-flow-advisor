
import React from 'react';
import { CommandGroup, CommandItem, CommandList, CommandEmpty } from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SearchResult<T> {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  data: T;
}

interface SearchResultsProps<T> {
  results: SearchResult<T>[];
  onSelect: (item: SearchResult<T>) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  groupBy?: (item: SearchResult<T>) => string;
  maxHeight?: string;
  className?: string;
  compact?: boolean;
}

/**
 * Reusable search results component
 */
export function SearchResults<T>({
  results,
  onSelect,
  isLoading = false,
  emptyMessage = 'No results found.',
  groupBy,
  maxHeight = '400px',
  className,
  compact = false
}: SearchResultsProps<T>) {
  // Group results if groupBy function is provided
  const groupedResults = React.useMemo(() => {
    if (!groupBy) return { '': results };
    
    return results.reduce<Record<string, SearchResult<T>[]>>((acc, result) => {
      const group = groupBy(result);
      if (!acc[group]) acc[group] = [];
      acc[group].push(result);
      return acc;
    }, {});
  }, [results, groupBy]);
  
  // Generate loading skeletons
  const renderLoadingState = () => {
    return Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="px-2 py-1.5 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <div className="space-y-1">
          <Skeleton className="h-4 w-32" />
          {!compact && <Skeleton className="h-3 w-64" />}
        </div>
      </div>
    ));
  };
  
  if (isLoading) {
    return (
      <CommandList className={cn('overflow-auto', className)} style={{ maxHeight }}>
        <CommandGroup>{renderLoadingState()}</CommandGroup>
      </CommandList>
    );
  }
  
  if (results.length === 0) {
    return (
      <CommandList className={cn('overflow-auto', className)} style={{ maxHeight }}>
        <CommandEmpty>{emptyMessage}</CommandEmpty>
      </CommandList>
    );
  }
  
  return (
    <CommandList className={cn('overflow-auto', className)} style={{ maxHeight }}>
      {Object.entries(groupedResults).map(([group, items]) => (
        <CommandGroup key={group} heading={group || undefined}>
          {items.map((item) => (
            <CommandItem
              key={item.id}
              onSelect={() => onSelect(item)}
              className="flex items-center gap-2 cursor-pointer"
            >
              {item.icon}
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                {!compact && item.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      ))}
    </CommandList>
  );
}

export default SearchResults;
