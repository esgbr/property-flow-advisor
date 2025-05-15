import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Calculator, PieChart, TrendingUp, LineChart, ArrowRight, DollarSign, BarChart3, Search, Receipt } from 'lucide-react';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useIsMobile } from '@/hooks/use-mobile';
import PortfolioDashboard from './PortfolioDashboard';
import EnhancedPortfolioDashboard from './EnhancedPortfolioDashboard';
import { toast } from 'sonner';
import InvestmentShortcutsBar from "./InvestmentShortcutsBar";
import MarketContextCard from "./MarketContextCard";
import NextStepsCard from "./NextStepsCard";

const UnifiedPortfolioDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { preferences } = useUserPreferences();
  const isMobile = useIsMobile();

  const isAdvancedUser =
    preferences.experienceLevel === "advanced" ||
    preferences.experienceLevel === "expert";

  // Investment Shortcuts for common workflows (move to new component)
  const investmentShortcuts = [
    {
      name: language === "de" ? "ROI Berechnung" : "ROI Calculator",
      icon: <Calculator className="h-5 w-5 text-primary" />,
      description:
        language === "de"
          ? "Rentabilitätsberechnung für Immobilien"
          : "Return on investment calculator",
      path: "/calculators?tool=roi",
    },
    {
      name: language === "de" ? "Markttrendanalyse" : "Market Trend Analysis",
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
      description:
        language === "de"
          ? "Aktuelle Markttrends und Prognosen"
          : "Current market trends and forecasts",
      path: "/market-explorer",
    },
    {
      name: language === "de" ? "Kapitalflussrechnung" : "Cash Flow Analysis",
      icon: <DollarSign className="h-5 w-5 text-primary" />,
      description:
        language === "de"
          ? "Analyse der Ein- und Auszahlungen"
          : "Analysis of income and expenses",
      path: "/calculators?tool=cash-flow",
    },
  ];

  // Move quick action logic into InvestmentShortcutsBar
  const handleQuickAction = (action: string, path: string) => {
    navigate(path);
    toast.success(
      language === "de"
        ? `Tool geöffnet: ${action}`
        : `Tool opened: ${action}`
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions Bar */}
      <InvestmentShortcutsBar
        shortcuts={investmentShortcuts}
        onShortcutClick={handleQuickAction}
      />

      {/* Render appropriate dashboard based on user experience */}
      {isAdvancedUser ? <EnhancedPortfolioDashboard /> : <PortfolioDashboard />}

      {/* Market Context Card */}
      <MarketContextCard />

      {/* Next Steps Card */}
      <NextStepsCard />
    </div>
  );
};

export default UnifiedPortfolioDashboard;
