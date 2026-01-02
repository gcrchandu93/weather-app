import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 text-lg bg-secondary/50 border-glass-border rounded-xl backdrop-blur-sm focus:border-primary focus:ring-primary/20 transition-all"
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !query.trim()}
          className="h-14 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all hover:shadow-lg hover:shadow-primary/25"
        >
          {isLoading ? (
            <div className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </div>
    </form>
  );
}
