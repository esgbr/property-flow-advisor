
import * as React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { SearchInput } from "@/components/ui/search-input";
import { Label } from "@/components/ui/label";

interface AddressAutocompleteProps {
  onAddressSelect: (addressData: AddressData) => void;
  defaultValue?: string;
  required?: boolean;
  label?: string;
  helperText?: string;
  id?: string;
}

export interface AddressData {
  fullAddress: string;
  streetNumber?: string;
  route?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  lat?: number;
  lng?: number;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onAddressSelect,
  defaultValue = "",
  required = false,
  label,
  helperText,
  id = "address-autocomplete"
}) => {
  const { t } = useLanguage();
  const [isGoogleMapsLoaded, setIsGoogleMapsLoaded] = React.useState<boolean>(false);
  const [value, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    // Check if Google Maps API is loaded
    const checkGoogleMapsLoaded = () => {
      if (window.google?.maps?.places) {
        setIsGoogleMapsLoaded(true);
      } else {
        setTimeout(checkGoogleMapsLoaded, 500);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  const handleLocationSelect = (place: google.maps.places.PlaceResult) => {
    if (!place.address_components || !place.geometry) {
      return;
    }

    const addressComponents = place.address_components;
    
    // Extract address components
    const extractComponent = (type: string) => {
      const component = addressComponents.find(comp => comp.types.includes(type));
      return component ? component.long_name : '';
    };

    const streetNumber = extractComponent('street_number');
    const route = extractComponent('route');
    const city = extractComponent('locality') || extractComponent('administrative_area_level_2');
    const state = extractComponent('administrative_area_level_1');
    const postalCode = extractComponent('postal_code');
    const country = extractComponent('country');

    // Create formatted address data
    const addressData: AddressData = {
      fullAddress: place.formatted_address || `${streetNumber} ${route}, ${city}, ${state} ${postalCode}, ${country}`,
      streetNumber,
      route,
      city,
      state,
      postalCode,
      country,
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng()
    };

    setValue(addressData.fullAddress);
    onAddressSelect(addressData);

    // Notify user
    toast.success(t('addressVerified'), {
      description: t('addressVerifiedDescription')
    });
  };

  const handleChange = (value: string) => {
    setValue(value);
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <SearchInput
        id={id}
        value={value}
        onChange={handleChange}
        placeholder={isGoogleMapsLoaded ? t('startTypingForGoogleMaps') : t('enterAddressManually')}
        usePlacesAutocomplete={isGoogleMapsLoaded}
        onLocationSelect={handleLocationSelect}
        required={required}
      />
      
      {helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
      
      {!isGoogleMapsLoaded && (
        <p className="text-sm text-amber-500">
          {t('googleMapsNotLoaded')}
        </p>
      )}
    </div>
  );
};

export default AddressAutocomplete;
