
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Loader } from 'lucide-react';
import { useAnnouncement } from '@/utils/accessibilityUtils';

const WelcomeModal = () => {
  const { isFirstVisit, setIsFirstVisit, saveOnboardingData, preferences, updatePreferences } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { announce } = useAnnouncement();

  useEffect(() => {
    // Only show the welcome modal if it's the user's first visit
    if (isFirstVisit) {
      // Wait a moment before showing the modal for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        announce(t('welcomeToPropertyFlowAdvisor'), 'assertive');
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit, announce, t]);

  const handleComplete = (data: any) => {
    // Sync user data across platform
    if (saveOnboardingData) {
      saveOnboardingData({
        name: data.name || '',
        experienceLevel: data.experienceLevel || 'beginner',
        goals: data.goals || [],
        propertyTypes: data.propertyTypes || [],
        investmentPreference: data.investmentPreference || 'balanced',
        investmentMarket: data.investmentMarket || 'global',
        interests: data.interests || [],
        investmentGoals: data.investmentGoals || [],
        preferredPropertyTypes: data.preferredPropertyTypes || []
      });
    }
    
    setIsOpen(false);
    if (setIsFirstVisit) {
      setIsFirstVisit(false);
    }
    
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
    if (setIsFirstVisit) {
      setIsFirstVisit(false);
    }
    localStorage.setItem('firstVisit', 'false');
    setIsOpen(false);
    
    // If user skips, we still save what we know
    updatePreferences({
      onboardingCompleted: true
    });
    
    toast.info(t('updatePreferencesSettings'));
    navigate('/dashboard');
  };

  // When setting initial data, ensure investmentMarket is never an empty string
  const initialData = {
    name: preferences.name || '',
    experienceLevel: preferences.experienceLevel || 'beginner',
    interests: preferences.interests || [],
    investmentGoals: preferences.investmentGoals || [],
    preferredPropertyTypes: preferences.preferredPropertyTypes || [],
    investmentMarket: preferences.investmentMarket || 'global', // Default to global instead of empty string
    goals: preferences.goals || [],
    propertyTypes: preferences.propertyTypes || [],
    investmentPreference: preferences.investmentPreference || 'balanced'
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="p-0 max-w-screen-md overflow-hidden" 
        aria-labelledby="onboardingTitle"
        role="dialog"
        aria-modal="true"
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-96">
            <Loader className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">{t('loading')}</span>
          </div>
        }>
          <OnboardingFlow 
            onComplete={handleComplete} 
            onSkip={handleSkip}
            initialData={initialData}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
