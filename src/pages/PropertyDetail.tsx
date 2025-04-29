
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { sampleProperties } from '@/data/sampleData';
import PropertyHeader from '@/components/property-details/PropertyHeader';
import PropertySummary from '@/components/property-details/PropertySummary';
import PropertyAnalysis from '@/components/property-details/PropertyAnalysis';
import PropertyTabs from '@/components/property-details/PropertyTabs';

const PropertyDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [property, setProperty] = useState(() => {
    return sampleProperties.find(p => p.id === id) || sampleProperties[0];
  });
  
  // Property analysis score (example)
  const analysisScore = 72;
  
  // Re-fetch property data when the component mounts or location changes
  // This ensures that after editing, we get the latest data
  useEffect(() => {
    const updatedProperty = sampleProperties.find(p => p.id === id);
    if (updatedProperty) {
      setProperty(updatedProperty);
    }
  }, [id, location.pathname]);

  return (
    <div className="space-y-6 animate-fade-in">
      <PropertyHeader property={property} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PropertySummary property={property} />
        <PropertyAnalysis analysisScore={analysisScore} />
      </div>
      
      <PropertyTabs property={property} />
    </div>
  );
};

export default PropertyDetail;
