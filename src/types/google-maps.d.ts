
/// <reference types="google.maps" />

declare namespace google {
  namespace maps {
    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          options?: google.maps.places.AutocompleteOptions
        );
        addListener(
          eventName: string,
          handler: Function
        ): google.maps.MapsEventListener;
        getPlace(): google.maps.places.PlaceResult;
      }
      interface AutocompleteOptions {
        bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }
      interface PlaceResult {
        address_components?: google.maps.GeocoderAddressComponent[];
        formatted_address?: string;
        geometry?: {
          location: google.maps.LatLng;
          viewport: google.maps.LatLngBounds;
        };
        name?: string;
        place_id?: string;
        types?: string[];
        url?: string;
        utc_offset_minutes?: number;
        vicinity?: string;
      }
    }
    
    interface MapsEventListener {
      remove(): void;
    }
    
    namespace event {
      function clearInstanceListeners(instance: object): void;
    }
  }
}
