
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
import { toast } from '@/components/ui/use-toast';
import { MapPinCheck } from 'lucide-react';

interface PropertyEditFormProps {
  property: Property;
  onSave: (updatedProperty: Partial<Property>) => void;
}

const PropertyEditForm = ({ property, onSave }: PropertyEditFormProps) => {
  const navigate = useNavigate();
  const addressInputRef = useRef<HTMLTextAreaElement>(null);
  const [addressVerified, setAddressVerified] = useState<boolean>(false);
  const [autocompleteLoaded, setAutocompleteLoaded] = useState<boolean>(false);
  
  const form = useForm({
    defaultValues: {
      title: property.title,
      address: property.address,
      city: property.city,
      zipCode: property.zipCode,
      country: property.country,
      propertyType: property.propertyType,
      squareMeters: property.squareMeters,
      rooms: property.rooms,
      purchasePrice: property.purchasePrice,
      status: property.status
    }
  });

  // Load Google Maps API script
  useEffect(() => {
    if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setAutocompleteLoaded(true);
      };
      
      document.head.appendChild(script);
    } else if (window.google && window.google.maps) {
      setAutocompleteLoaded(true);
    }
    
    return () => {
      // Clean up if needed
    };
  }, []);

  // Initialize Google Maps Autocomplete when the API is loaded
  useEffect(() => {
    if (autocompleteLoaded && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
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
          const formattedAddress = `${streetNumber} ${route}`.trim();
          
          // Update form values
          form.setValue('address', formattedAddress);
          form.setValue('city', city);
          form.setValue('zipCode', zipCode);
          form.setValue('country', country);
          
          setAddressVerified(true);
          
          toast({
            title: "Address verified",
            description: "The address has been verified and updated with Google Maps data.",
            duration: 3000,
          });
        }
      });
    }
  }, [autocompleteLoaded, form]);

  const onSubmit = (values: any) => {
    // This would normally save to a database
    console.log('Form values:', values);
    
    // Pass the updated values to the onSave callback
    onSave(values);
    
    navigate(`/property/${property.id}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    />
                    {!autocompleteLoaded && (
                      <div className="absolute inset-0 bg-background/50 flex items-center justify-center rounded-md">
                        <p className="text-sm text-muted-foreground">Loading address suggestions...</p>
                      </div>
                    )}
                  </div>
                </FormControl>
                <p className="text-xs text-muted-foreground">
                  Start typing to get address suggestions from Google Maps
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
