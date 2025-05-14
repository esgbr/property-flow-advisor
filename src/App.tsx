
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, Suspense, useEffect } from 'react';
import MainLayout from './components/layout/MainLayout';
import CRMPage from './pages/CRMPage';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { useAccessibility } from './components/accessibility/A11yProvider';
import AuthGuard from './components/auth/AuthGuard';
import LockedPage from './pages/LockedPage';
import SettingsPage from './pages/SettingsPage';
import Education from './pages/Education';
import InvestorDashboard from './pages/InvestorDashboard';
import Properties from './pages/Properties';
import ToolsPage from './pages/ToolsPage';
import Calculators from './pages/Calculators';
import PortfolioOptimization from './pages/PortfolioOptimization';
import MarketExplorerPage from './pages/MarketExplorerPage';
import TaxPlanning from './pages/TaxPlanning';
import RegionalAnalysis from './pages/RegionalAnalysis';
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
    <LanguageProvider defaultLanguage={language}>
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
            <Route path="/education" element={<Education />} />
            <Route path="/investor-dashboard" element={<InvestorDashboard />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/calculators" element={<Calculators />} />
            <Route path="/portfolio-optimization" element={<PortfolioOptimization />} />
            <Route path="/market-explorer" element={<MarketExplorerPage />} />
			<Route path="/tax-planning" element={<TaxPlanning />} />
            <Route path="/regional-analysis" element={<RegionalAnalysis />} />
            <Route path="/market-comparison" element={<MarketComparisonPage />} />
            <Route path="/deutsche-immobilien-tools" element={<DeutscheImmobilienTools />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
