
import React, { useEffect, useRef, useState } from 'react';
import { Property } from '@/interfaces/property';
import { MapPin } from 'lucide-react';

interface PropertyMapProps {
  property: Property;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    // Load Google Maps API script with retry mechanism
    const loadGoogleMapsAPI = (retryCount = 0) => {
      if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
        const script = document.createElement('script');
        // Note: In a production app you would use an environment variable for the API key
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Define the callback function that will be called once the API is loaded
        window.initMap = () => {
          setMapLoaded(true);
          console.log('Google Maps API loaded successfully');
        };
        
        script.onerror = () => {
          // Retry loading the script up to 3 times
          if (retryCount < 3) {
            console.log(`Retrying Google Maps API load (${retryCount + 1}/3)`);
            setTimeout(() => loadGoogleMapsAPI(retryCount + 1), 1500);
          } else {
            console.error('Google Maps API failed to load after multiple attempts');
          }
        };
        
        document.head.appendChild(script);
      } else if (window.google && window.google.maps) {
        setMapLoaded(true);
      }
    };
    
    loadGoogleMapsAPI();
    
    return () => {
      // Clean up the global callback
      window.initMap = undefined;
    };
  }, []);
  
  // Function to initialize map and geocode address
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;
    
    try {
      // If we already have coordinates, use them directly
      if (property.latitude && property.longitude) {
        const location = { lat: property.latitude, lng: property.longitude };
        
        // Create the map centered on the property location
        const map = new window.google.maps.Map(mapRef.current, {
          zoom: 15,
          center: location,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        });
        
        // Add a marker for the property
        new window.google.maps.Marker({
          map,
          position: location,
          title: property.title,
          animation: window.google.maps.Animation.DROP,
        });
        
        return;
      }
      
      // If we don't have coordinates, geocode the address
      const addressString = `${property.address}, ${property.city}, ${property.zipCode}, ${property.country}`;
      
      // Create the map with a default center
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
          
          // Log the coordinates (in a real app, we might want to save these to the property)
          console.log("Geocoded coordinates:", {
            lat: location.lat(),
            lng: location.lng()
          });
        } else {
          console.warn('Geocoding was not successful for the following reason:', status);
        }
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapLoaded, property]);
  
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
