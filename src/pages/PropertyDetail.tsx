
import React from 'react';
import { useParams } from 'react-router-dom';
import { sampleProperties } from '@/data/sampleData';
import PropertyHeader from '@/components/property-details/PropertyHeader';
import PropertySummary from '@/components/property-details/PropertySummary';
import PropertyAnalysis from '@/components/property-details/PropertyAnalysis';
import PropertyTabs from '@/components/property-details/PropertyTabs';

const PropertyDetail = () => {
  const { id } = useParams();
  const property = sampleProperties.find(p => p.id === id) || sampleProperties[0];
  
  // Property analysis score (example)
  const analysisScore = 72;

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
