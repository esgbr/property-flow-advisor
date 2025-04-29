
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { sampleProperties } from '@/data/sampleData';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import PropertyEditForm from '@/components/property-edit/PropertyEditForm';

const PropertyEdit = () => {
  const { id } = useParams();
  const property = sampleProperties.find(p => p.id === id);

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

      <PropertyEditForm property={property} />
    </div>
  );
};

export default PropertyEdit;
