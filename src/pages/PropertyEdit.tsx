
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sampleProperties } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PropertyEditForm from '@/components/property-edit/PropertyEditForm';
import { toast } from '@/components/ui/use-toast';
import { Property } from '@/interfaces/property';

const PropertyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(() => {
    const foundProperty = sampleProperties.find(p => p.id === id);
    return foundProperty || sampleProperties[0];
  });

  if (!property) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Property Not Found</h1>
        </div>
        <p>The property you are looking for does not exist.</p>
      </div>
    );
  }

  const handleSave = (updatedProperty: Partial<Property>) => {
    // In a real app, this would update the database
    // For now, we'll create a new property object with the updates
    const updatedPropertyFull = {
      ...property,
      ...updatedProperty
    };
    
    // Set the updated property in state (for real apps, this would be reflected in the global state/database)
    setProperty(updatedPropertyFull);
    
    // Update the property in the sample data array (simulating database update)
    const propertyIndex = sampleProperties.findIndex(p => p.id === id);
    if (propertyIndex !== -1) {
      sampleProperties[propertyIndex] = updatedPropertyFull;
    }
    
    // Show success message
    toast({
      title: "Property Updated",
      description: "Property information and location analysis have been successfully updated.",
    });
    
    // Navigate back to the property detail page
    navigate(`/property/${id}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link to={`/property/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Edit {property.title}</h1>
      </div>

      <PropertyEditForm property={property} onSave={handleSave} />
    </div>
  );
};

export default PropertyEdit;
