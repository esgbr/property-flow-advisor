
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/interfaces/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  property: Property;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Load Google Maps API script
    if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      // Define the callback function that will be called once the API is loaded
      window.initMap = () => {
        setMapLoaded(true);
      };
      
      document.head.appendChild(script);
    } else {
      // If script already exists, check if maps API is loaded
      if (window.google && window.google.maps) {
        setMapLoaded(true);
      }
    }
    
    return () => {
      // Clean up the global callback
      window.initMap = undefined;
    };
  }, []);
  
  // Function to initialize map and geocode address
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    const addressString = `${property.address}, ${property.city}, ${property.zipCode}, ${property.country}`;
    
    try {
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: { lat: 52.52, lng: 13.405 }, // Default to Berlin
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });
      
      // Create a geocoder to convert the address to coordinates
      const geocoder = new window.google.maps.Geocoder();
      
      geocoder.geocode({ address: addressString }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          
          // Center map on the geocoded location
          map.setCenter(location);
          
          // Add a marker
          new window.google.maps.Marker({
            map,
            position: location,
            title: property.title,
            animation: window.google.maps.Animation.DROP,
          });
        } else {
          console.warn('Geocoding was not successful for the following reason:', status);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapLoaded, property.address, property.city, property.zipCode, property.country, property]);
  
  return (
    <div className="h-[400px] relative rounded-lg overflow-hidden border">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="flex flex-col items-center gap-2">
            <MapPin className="h-8 w-8 animate-pulse text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="absolute inset-0" 
        style={{ visibility: mapLoaded ? 'visible' : 'hidden' }}
      />
    </div>
  );
};

// Add type definition for the global initMap function
declare global {
  interface Window {
    initMap: () => void;
    google: any;
  }
}

export default PropertyMap;
