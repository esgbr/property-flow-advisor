
import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onLocationSelect?: (location: google.maps.places.PlaceResult) => void;
  usePlacesAutocomplete?: boolean;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, usePlacesAutocomplete = false, onLocationSelect, ...props }, ref) => {
    const autocompleteRef = React.useRef<HTMLInputElement>(null);
    const [autocomplete, setAutocomplete] = React.useState<google.maps.places.Autocomplete | null>(null);
    
    React.useEffect(() => {
      if (!usePlacesAutocomplete || !window.google?.maps?.places) {
        return;
      }

      if (!autocompleteRef.current) return;

      const options: google.maps.places.AutocompleteOptions = {
        types: ['address'],
        fields: ['address_components', 'formatted_address', 'geometry', 'name'],
      };

      const newAutocomplete = new window.google.maps.places.Autocomplete(
        autocompleteRef.current,
        options
      );

      newAutocomplete.addListener('place_changed', () => {
        const place = newAutocomplete.getPlace();
        if (place && onLocationSelect) {
          onLocationSelect(place);
        }
      });

      setAutocomplete(newAutocomplete);

      return () => {
        if (autocomplete) {
          google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    }, [usePlacesAutocomplete, onLocationSelect, autocomplete]);

    return (
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={usePlacesAutocomplete ? autocompleteRef : ref}
          type="search"
          className={cn(
            "pl-8 pr-4 focus-visible:ring-primary",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
