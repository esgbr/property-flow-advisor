import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, Suspense, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import CRMPage from './pages/CRMPage';
import { LanguageContext } from './contexts/LanguageContext';
import { AccessibilityProvider } from './components/accessibility/A11yProvider';
import { AuthGuard } from './components/auth/AuthGuard';
import LockedPage from './pages/LockedPage';
import SettingsPage from './pages/SettingsPage';
import EducationPage from './pages/EducationPage';
import InvestorDashboard from './pages/InvestorDashboard';
import PropertiesPage from './pages/PropertiesPage';
import ToolsPage from './pages/ToolsPage';
import CalculatorsPage from './pages/CalculatorsPage';
import PortfolioOptimizationPage from './pages/PortfolioOptimizationPage';
import MarketExplorerPage from './pages/MarketExplorerPage';
import TaxPlanningPage from './pages/TaxPlanningPage';
import RegionalAnalysisPage from './pages/RegionalAnalysisPage';
import MarketComparisonPage from './pages/MarketComparisonPage';
import DeutscheImmobilienTools from './pages/DeutscheImmobilienTools';

function App() {
  const [language, setLanguage] = useState<'de' | 'en'>(
    (localStorage.getItem('language') as 'de' | 'en') || 'de'
  );

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string) => {
    const translations = {
      dashboard: { en: 'Dashboard', de: 'Übersicht' },
      settings: { en: 'Settings', de: 'Einstellungen' },
      education: { en: 'Education', de: 'Bildung' },
      investorDashboard: { en: 'Investor Dashboard', de: 'Investoren-Dashboard' },
      properties: { en: 'Properties', de: 'Immobilien' },
      tools: { en: 'Tools', de: 'Werkzeuge' },
      calculators: { en: 'Calculators', de: 'Rechner' },
      portfolioOptimization: { en: 'Portfolio Optimization', de: 'Portfoliooptimierung' },
      marketExplorer: { en: 'Market Explorer', de: 'Markterkundung' },
	  taxPlanning: {en: 'Tax Planning', de: 'Steuerplanung'},
      regionalAnalysis: {en: 'Regional Analysis', de: 'Regionale Analyse'},
      marketComparison: {en: 'Market Comparison', de: 'Marktvergleich'},
      main: {en: 'Main', de: 'Haupt'},
      portfolio: {en: 'Portfolio', de: 'Portfolio'},
      account: {en: 'Account', de: 'Konto'},
      totalInvested: {en: 'Total Invested', de: 'Total investiert'},
      annualReturn: {en: 'Annual Return', de: 'Jährliche Rendite'},
      propertyCount: {en: 'Property Count', de: 'Anzahl Immobilien'},
      fromLastYear: {en: 'from last year', de: 'vom letzten Jahr'},
      portfolioPerformance: {en: 'Portfolio Performance', de: 'Portfolio Performance'},
      last12Months: {en: 'Last 12 Months', de: 'Letzte 12 Monate'},
      portfolioDistribution: {en: 'Portfolio Distribution', de: 'Portfolio Verteilung'},
      overview: {en: 'Overview', de: 'Übersicht'},
      analysis: {en: 'Analysis', de: 'Analyse'},
      opportunities: {en: 'Opportunities', de: 'Chancen'},
      optimization: {en: 'Optimization', de: 'Optimierung'},
      keyMetrics: {en: 'Key Metrics', de: 'Kennzahlen'},
      cashOnCashReturn: {en: 'Cash on Cash Return', de: 'Cash-on-Cash-Rendite'},
      capRate: {en: 'Cap Rate', de: 'Kapitalisierungsrate'},
      debtCoverageRatio: {en: 'Debt Coverage Ratio', de: 'Schulden-Deckungsgrad'},
      grossRentalYield: {en: 'Gross Rental Yield', de: 'Bruttomietrendite'},
      vacancyRate: {en: 'Vacancy Rate', de: 'Leerstandsquote'},
      roi: {en: 'ROI', de: 'Kapitalrendite'},
      exportData: {en: 'Export Data', de: 'Daten exportieren'},
      detailedAnalysis: {en: 'Detailed Analysis', de: 'Detaillierte Analyse'},
      marketInsights: {en: 'Market Insights', de: 'Markteinblicke'},
      advancedAnalysis: {en: 'Advanced Analysis', de: 'Erweiterte Analyse'},
      detailedMetricsForYourPortfolio: {en: 'Detailed Metrics for Your Portfolio', de: 'Detaillierte Metriken für Ihr Portfolio'},
      collapseSidebar: { en: 'Collapse Sidebar', de: 'Sidebar einklappen' },
      expandSidebar: { en: 'Expand Sidebar', de: 'Sidebar ausklappen' },
    };

    const translation = translations[key];
    return translation ? translation[language] || translation.en || key : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <AccessibilityProvider>
        <Router>
          <Routes>
            {/* Redirect from dashboard to crm */}
            <Route path="/" element={<Navigate to="/crm" replace />} />
            <Route path="/dashboard" element={<Navigate to="/crm" replace />} />
            
            {/* Protected routes with main layout */}
            <Route path="/" element={
              <AuthGuard>
                <MainLayout />
              </AuthGuard>
            }>
              <Route path="/crm" element={<CRMPage />} />
              <Route path="/locked" element={<LockedPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/education" element={<EducationPage />} />
              <Route path="/investor-dashboard" element={<InvestorDashboard />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/calculators" element={<CalculatorsPage />} />
              <Route path="/portfolio-optimization" element={<PortfolioOptimizationPage />} />
              <Route path="/market-explorer" element={<MarketExplorerPage />} />
			  <Route path="/tax-planning" element={<TaxPlanningPage />} />
              <Route path="/regional-analysis" element={<RegionalAnalysisPage />} />
              <Route path="/market-comparison" element={<MarketComparisonPage />} />
              <Route path="/deutsche-immobilien-tools" element={<DeutscheImmobilienTools />} />
            </Route>
          </Routes>
        </Router>
      </AccessibilityProvider>
    </LanguageContext.Provider>
  );
}

export default App;
