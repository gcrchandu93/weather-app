import { Clock, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchHistoryItem {
  id: string;
  city_name: string;
  search_query: string;
  lat?: number;
  lon?: number;
  searched_at: string;
}

interface RecentSearchesProps {
  searches: SearchHistoryItem[];
  onSelect: (search: SearchHistoryItem) => void;
  onClear: () => void;
  isLoading: boolean;
}

export function RecentSearches({ searches, onSelect, onClear, isLoading }: RecentSearchesProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="h-5 w-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (searches.length === 0) {
    return null;
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Recent Searches</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <button
            key={search.id}
            onClick={() => onSelect(search)}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 hover:bg-secondary border border-border/50 rounded-full text-sm text-foreground transition-colors"
          >
            <span>{search.city_name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
