
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingFlow, { OnboardingData } from '@/components/onboarding/OnboardingFlow';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const WelcomeModal = () => {
  const { isFirstVisit, setIsFirstVisit, saveOnboardingData, preferences } = useUserPreferences();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Only show the welcome modal if it's the user's first visit
    if (isFirstVisit) {
      // Wait a moment before showing the modal for better UX
      const timer = setTimeout(() => {
        setOpen(true);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const handleComplete = (data: OnboardingData) => {
    // Sync user data across platform
    const updatedData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    
    saveOnboardingData(updatedData);
    setOpen(false);
  };

  const handleSkip = () => {
    setIsFirstVisit(false);
    localStorage.setItem('firstVisit', 'false');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-screen-md">
        <OnboardingFlow 
          onComplete={handleComplete} 
          onSkip={handleSkip}
          initialData={preferences ? {
            name: preferences.name || '',
            experienceLevel: preferences.experienceLevel,
            interests: preferences.interests || [],
            investmentGoals: preferences.investmentGoals || [],
            preferredPropertyTypes: preferences.preferredPropertyTypes || [],
            investmentMarket: preferences.investmentMarket || ''
          } : undefined}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
