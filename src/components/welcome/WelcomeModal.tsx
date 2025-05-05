
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { OnboardingData } from '@/components/onboarding/types';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const WelcomeModal = () => {
  const { isFirstVisit, setIsFirstVisit, saveOnboardingData, preferences, updatePreferences } = useUserPreferences();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    saveOnboardingData(data);
    setOpen(false);
    
    // Navigate to appropriate dashboard based on selected market
    if (data.investmentMarket) {
      switch (data.investmentMarket) {
        case 'germany':
        case 'austria':
          toast.success(t('welcomeToGermanRealEstateTools'));
          navigate('/deutsche-immobilien-tools');
          break;
        case 'usa':
        case 'canada':
          toast.success(t('welcomeToUSRealEstateTools'));
          navigate('/us-real-estate-tools');
          break;
        default:
          toast.success(t('welcomeToYourRealEstateDashboard'));
          navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  const handleSkip = () => {
    setIsFirstVisit(false);
    localStorage.setItem('firstVisit', 'false');
    setOpen(false);
    
    // If user skips, we still save what we know
    updatePreferences({
      onboardingCompleted: true
    });
    
    toast.info(t('updatePreferencesSettings'));
    navigate('/dashboard');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 max-w-screen-md overflow-hidden">
        <OnboardingFlow 
          onComplete={handleComplete} 
          onSkip={handleSkip}
          initialData={{
            name: preferences.name || '',
            experienceLevel: preferences.experienceLevel || 'beginner',
            interests: preferences.interests || [],
            investmentGoals: preferences.investmentGoals || [],
            preferredPropertyTypes: preferences.preferredPropertyTypes || [],
            investmentMarket: preferences.investmentMarket || ''
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
