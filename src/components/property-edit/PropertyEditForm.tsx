
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Property } from '@/interfaces/property';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPinCheck, MapPin, AlertCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PropertyEditFormProps {
  property: Property;
  onSave: (updatedProperty: Partial<Property>) => void;
}

// Define form values type to avoid type errors
interface FormValues {
  title: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
  propertyType: string;
  squareMeters: number;
  rooms: number;
  purchasePrice: number;
  status: Property['status']; // Use the status type from Property interface
}

const PropertyEditForm = ({ property, onSave }: PropertyEditFormProps) => {
  const navigate = useNavigate();
  const addressInputRef = useRef<HTMLTextAreaElement>(null);
  const [addressVerified, setAddressVerified] = useState<boolean>(false);
  const [autocompleteLoaded, setAutocompleteLoaded] = useState<boolean>(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Security feature - sanitize input
  const sanitizeInput = (input: string): string => {
    // Basic sanitization to prevent XSS
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: property.title,
      address: property.address,
      city: property.city,
      zipCode: property.zipCode,
      country: property.country,
      propertyType: property.propertyType,
      squareMeters: property.squareMeters || property.size || 0,
      rooms: property.rooms || property.bedrooms || 0,
      purchasePrice: property.purchasePrice,
      status: property.status
    }
  });

  // Load Google Maps API script with error handling and retry mechanism
  useEffect(() => {
    const loadGoogleMapsAPI = (retryCount = 0) => {
      if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        const script = document.createElement('script');
        // Note: In a production app you would use an environment variable for the API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          setAutocompleteLoaded(true);
          setLoadingError(null);
          console.log('Google Maps API loaded successfully');
        };
        
        script.onerror = () => {
          // Retry loading the script up to 3 times
          if (retryCount < 3) {
            setTimeout(() => loadGoogleMapsAPI(retryCount + 1), 1500);
            console.log(`Retrying Google Maps API load (${retryCount + 1}/3)`);
          } else {
            setLoadingError('Failed to load address suggestions. Please enter your address manually.');
            console.error('Google Maps API failed to load after multiple attempts');
          }
        };
        
        document.head.appendChild(script);
      } else if (window.google && window.google.maps) {
        setAutocompleteLoaded(true);
      }
    };
    
    loadGoogleMapsAPI();
    
    return () => {
      // Clean up if needed
    };
  }, []);

  // Initialize Google Maps Autocomplete when the API is loaded
  useEffect(() => {
    if (autocompleteLoaded && addressInputRef.current) {
      try {
        const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
          types: ['address'],
          fields: ['address_components', 'formatted_address', 'geometry'],
        });
        
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          
          if (place.address_components) {
            // Get address components
            let streetNumber = '';
            let route = '';
            let city = '';
            let zipCode = '';
            let country = '';
            
            for (const component of place.address_components) {
              const componentType = component.types[0];
              
              switch (componentType) {
                case 'street_number':
                  streetNumber = component.long_name;
                  break;
                case 'route':
                  route = component.long_name;
                  break;
                case 'locality':
                  city = component.long_name;
                  break;
                case 'postal_code':
                  zipCode = component.long_name;
                  break;
                case 'country':
                  country = component.long_name;
                  break;
              }
            }
            
            // Format the full address
            const formattedAddress = place.formatted_address || `${streetNumber} ${route}`.trim();
            
            // Update form values with sanitized inputs
            form.setValue('address', sanitizeInput(formattedAddress));
            form.setValue('city', sanitizeInput(city));
            form.setValue('zipCode', sanitizeInput(zipCode));
            form.setValue('country', sanitizeInput(country));
            
            setAddressVerified(true);
            
            toast({
              title: "Address Verified",
              description: "The address has been verified and updated with Google Maps data.",
              duration: 3000,
            });
            
            // Save latitude and longitude coordinates if available
            if (place.geometry && place.geometry.location) {
              // We could update the form with these values if needed
              console.log("Latitude:", place.geometry.location.lat());
              console.log("Longitude:", place.geometry.location.lng());
            }
          }
        });
      } catch (error) {
        console.error('Error initializing Google Maps Autocomplete:', error);
        setLoadingError('Error initializing address suggestions.');
      }
    }
  }, [autocompleteLoaded, form, toast]);

  const onSubmit = (values: FormValues) => {
    // Sanitize all text inputs
    const sanitizedValues = {
      ...values,
      title: sanitizeInput(values.title),
      address: sanitizeInput(values.address),
      city: sanitizeInput(values.city),
      zipCode: sanitizeInput(values.zipCode),
      country: sanitizeInput(values.country),
      // Convert numeric values to ensure proper types
      squareMeters: Number(values.squareMeters),
      rooms: Number(values.rooms),
      purchasePrice: Number(values.purchasePrice),
      status: values.status // This will now be properly typed
    };
    
    // Pass the updated values to the onSave callback
    onSave(sanitizedValues);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Property Details</h2>
          <div className="flex items-center text-sm text-muted-foreground">
            <Shield className="h-4 w-4 mr-1" />
            Enhanced Security
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter property title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="propertyType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-1">
                  Address
                  {addressVerified && (
                    <div className="flex items-center" aria-label="Address verified">
                      <MapPinCheck className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Textarea 
                      placeholder="Start typing to get address suggestions..." 
                      {...field} 
                      ref={addressInputRef}
                      className={loadingError ? "border-red-300" : ""}
                    />
                    {!autocompleteLoaded && !loadingError && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="mr-1 h-4 w-4 animate-pulse" />
                          Loading address suggestions...
                        </p>
                      </div>
                    )}
                    {loadingError && (
                      <div className="text-xs text-red-500 mt-1 flex items-center">
                        <AlertCircle className="mr-1 h-3 w-3" />
                        {loadingError}
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  {!loadingError ? "Start typing to get address suggestions from Google Maps" : "Please enter your address manually"}
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter zip code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Enter country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="squareMeters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Area (m²)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Area in m²"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rooms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rooms</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="Number of rooms"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="purchasePrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Price (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter purchase price"
                    {...field}
                    onChange={e => field.onChange(Number(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="prospect">Prospect</SelectItem>
                    <SelectItem value="analyzing">Analyzing</SelectItem>
                    <SelectItem value="negotiating">Negotiating</SelectItem>
                    <SelectItem value="under_contract">Under Contract</SelectItem>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="off-market">Off-Market</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(`/property/${property.id}`)}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
};

// Add type definition for the global Google Maps objects
declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export default PropertyEditForm;
