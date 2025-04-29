
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Property } from '@/interfaces/property';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

// You need to add your Mapbox token here
// In a production app, this should be stored in an environment variable
const MAPBOX_TOKEN = ''; // Add your Mapbox token here

interface PropertyMapProps {
  property: Property;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ property }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapToken, setMapToken] = useState<string>(MAPBOX_TOKEN);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(!MAPBOX_TOKEN);
  
  const initializeMap = () => {
    if (!mapContainer.current || !mapToken) return;
    
    try {
      // Initialize Mapbox
      mapboxgl.accessToken = mapToken;
      
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [13.405, 52.52], // Default to Berlin coordinates
        zoom: 12
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add event when map loads
      map.current.on('load', () => {
        // Try to geocode the property address if we have one
        geocodeAddress();
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setShowTokenInput(true);
    }
  };
  
  const geocodeAddress = async () => {
    if (!map.current || !mapToken) return;
    
    const addressString = `${property.address}, ${property.city}, ${property.zipCode}, ${property.country}`;
    
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(addressString)}.json?access_token=${mapToken}`
      );
      
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        
        // Center the map on the geocoded location
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          essential: true
        });
        
        // Add a marker
        if (marker.current) {
          marker.current.remove();
        }
        
        marker.current = new mapboxgl.Marker({ color: '#FF0000' })
          .setLngLat([lng, lat])
          .addTo(map.current);
      } else {
        console.warn('No location found for this address');
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };
  
  useEffect(() => {
    // Initialize map when component mounts and token is available
    if (mapToken) {
      initializeMap();
    }
    
    // Cleanup on unmount
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapToken]);
  
  // Effect to handle property changes - recenter map when address changes
  useEffect(() => {
    if (map.current && mapToken) {
      geocodeAddress();
    }
  }, [property.address, property.city, property.zipCode, property.country]);
  
  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = document.getElementById('mapbox-token') as HTMLInputElement;
    if (input.value) {
      setMapToken(input.value);
      setShowTokenInput(false);
      setTimeout(initializeMap, 100);
    }
  };
  
  if (showTokenInput) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Map Setup Required</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To display the property location map, please enter your Mapbox public token.
              You can get one for free at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">mapbox.com</a>.
            </p>
            <div className="space-y-2">
              <label htmlFor="mapbox-token" className="text-sm font-medium">Mapbox Public Token:</label>
              <input 
                id="mapbox-token" 
                type="text" 
                placeholder="Enter your Mapbox public token" 
                className="w-full p-2 border rounded-md"
                required 
              />
            </div>
            <Button type="submit">Submit Token</Button>
          </form>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="h-[400px] relative rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default PropertyMap;
