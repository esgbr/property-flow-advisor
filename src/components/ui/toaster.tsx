
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { EnhancedToast } from '@/components/ui/enhanced-toast';
import { useAccessibility } from '@/hooks/use-accessibility';

export function Toaster() {
  const { highContrast, largeText } = useAccessibility();
  
  return <EnhancedToast highContrast={highContrast} largeText={largeText} />;
}
