
import React from 'react';
import EducationContent from '@/components/education/EducationContent';

const Education = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Education Center</h1>
        <p className="text-muted-foreground">Learn about real estate investment strategies and market analysis</p>
      </div>

      <EducationContent />
    </div>
  );
};

export default Education;
