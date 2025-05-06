import React, { useEffect } from 'react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

const InvestorDashboard: React.FC = () => {
  const { preferences, updatePreferences } = useUserPreferences();

  // Track first visit to investor dashboard
  useEffect(() => {
    // Only show welcome message on first visit
    if (!preferences.visitedInvestorDashboard) {
      // Show welcome toast or modal here
      
      // Update preferences to mark as visited
      updatePreferences({ 
        visitedInvestorDashboard: true,
        lastActive: new Date().toISOString()
      });
    }
  }, [preferences.visitedInvestorDashboard, updatePreferences]);

  return (
    <div>
      {/* Dashboard content here */}
    </div>
  );
};

export default InvestorDashboard;
