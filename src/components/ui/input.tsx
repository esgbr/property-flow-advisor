
import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps extends React.ComponentProps<"input"> {
  usePlacesAutocomplete?: boolean;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, usePlacesAutocomplete, onPlaceSelect, ...props }, ref) => {
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
        if (place && onPlaceSelect) {
          onPlaceSelect(place);
        }
      });

      setAutocomplete(newAutocomplete);

      return () => {
        if (autocomplete) {
          // Fix: Use proper event clearListeners
          window.google.maps.event.clearInstanceListeners(autocomplete);
        }
      };
    }, [usePlacesAutocomplete, onPlaceSelect, autocomplete]);

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={usePlacesAutocomplete ? autocompleteRef : ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
