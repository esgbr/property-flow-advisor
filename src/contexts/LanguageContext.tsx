
import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextProps {
  language: string;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  t: (key: string) => key,
  setLanguage: () => {}
});

// English translations - Default language
const englishTranslations = {
  // General
  welcome: 'Welcome',
  welcomeBack: 'Welcome back',
  loading: 'Loading...',
  save: 'Save',
  cancel: 'Cancel',
  edit: 'Edit',
  delete: 'Delete',
  view: 'View',
  add: 'Add',
  create: 'Create',
  search: 'Search',
  filter: 'Filter',
  sort: 'Sort',
  explore: 'Explore',
  details: 'Details',
  settings: 'Settings',
  profile: 'Profile',
  logout: 'Logout',
  login: 'Login',
  register: 'Register',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  submit: 'Submit',
  back: 'Back',
  next: 'Next',
  finish: 'Finish',
  continue: 'Continue',
  yes: 'Yes',
  no: 'No',
  all: 'All',
  none: 'None',
  more: 'More',
  less: 'Less',
  reset: 'Reset',
  apply: 'Apply',
  clear: 'Clear',
  close: 'Close',
  open: 'Open',
  select: 'Select',
  selected: 'Selected',
  selectAll: 'Select All',
  selectNone: 'Select None',
  uploadImage: 'Upload Image',
  removeImage: 'Remove Image',
  addImage: 'Add Image',
  chooseFile: 'Choose File',
  noFileSelected: 'No file selected',
  fileSelected: 'File selected',
  uploadingFile: 'Uploading file...',
  uploadSuccess: 'Upload successful',
  uploadFailed: 'Upload failed',
  tryAgain: 'Try again',
  done: 'Done',
  complete: 'Complete',
  incomplete: 'Incomplete',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  required: 'Required',
  optional: 'Optional',
  
  // Dashboard
  dashboard: 'Dashboard',
  dashboardTitle: 'Real Estate Dashboard',
  welcomeToDashboard: 'Track your properties and investments',
  propertyOverview: 'Property Overview',
  recentActivity: 'Recent Activity',
  upcomingTasks: 'Upcoming Tasks',
  marketInsights: 'Market Insights',
  portfolioPerformance: 'Portfolio Performance',
  totalProperties: 'Total Properties',
  totalValue: 'Total Value',
  totalIncome: 'Total Income',
  totalExpenses: 'Total Expenses',
  netCashFlow: 'Net Cash Flow',
  portfolioValue: 'Portfolio Value',
  portfolioGrowth: 'Portfolio Growth',
  portfolioValueChange: 'Portfolio Value Change',
  allProperties: 'All Properties',
  addProperty: 'Add Property',
  editProperty: 'Edit Property',
  deleteProperty: 'Delete Property',
  viewProperty: 'View Property',
  propertyDetails: 'Property Details',
  propertyStats: 'Property Stats',
  
  // Property List
  properties: 'Properties',
  propertyList: 'Property List',
  propertyListTitle: 'Property Portfolio',
  noProperties: 'No properties found',
  addFirstProperty: 'Add your first property',
  filterProperties: 'Filter properties',
  sortProperties: 'Sort properties',
  searchProperties: 'Search properties',
  totalPurchasePrice: 'Total Purchase Price',
  underAnalysis: 'Under Analysis',
  propertiesAnalyzed: 'Properties being analyzed',
  negotiations: 'Negotiations',
  propertiesNegotiation: 'Properties in negotiation',
  
  // Property Details
  address: 'Address',
  city: 'City',
  state: 'State',
  zipCode: 'Zip Code',
  country: 'Country',
  propertyType: 'Property Type',
  bedrooms: 'Bedrooms',
  bathrooms: 'Bathrooms',
  squareFeet: 'Square Feet',
  yearBuilt: 'Year Built',
  purchaseDate: 'Purchase Date',
  purchasePrice: 'Purchase Price',
  currentValue: 'Current Value',
  mortgage: 'Mortgage',
  monthlyPayment: 'Monthly Payment',
  interestRate: 'Interest Rate',
  loanTerm: 'Loan Term',
  rentAmount: 'Rent Amount',
  expenses: 'Expenses',
  cashFlow: 'Cash Flow',
  capRate: 'Cap Rate',
  roi: 'ROI',
  propertyTax: 'Property Tax',
  insurance: 'Insurance',
  maintenanceFees: 'Maintenance Fees',
  hoaFees: 'HOA Fees',
  utilities: 'Utilities',
  vacancy: 'Vacancy',
  managementFee: 'Management Fee',
  otherExpenses: 'Other Expenses',
  grossRentalYield: 'Gross Rental Yield',
  netRentalYield: 'Net Rental Yield',
  cashOnCashReturn: 'Cash on Cash Return',
  totalReturn: 'Total Return',
  appreciationRate: 'Appreciation Rate',
  years: 'Years',
  
  // Investor Dashboard
  investorDashboard: 'Investor Dashboard',
  investmentPortfolio: 'Investment Portfolio',
  trackYourRealEstateInvestments: 'Track and analyze your real estate investments',
  
  // Investment Goals
  investmentGoals: 'Investment Goals',
  cashflowGoal: 'Cashflow Goal',
  equityTarget: 'Equity Target',
  totalPropertiesGoal: 'Total Properties Goal',
  passiveIncomeGoal: 'Passive Income Goal',
  fromLastQuarter: 'from last quarter',
  nextAcquisitionEstimate: 'Next acquisition estimate',
  oneYearProjection: '1 Year Projection',
  threeYearProjection: '3 Year Projection',
  fiveYearProjection: '5 Year Projection',
  monthlyCashflow: 'Monthly Cashflow',
  portfolioEquity: 'Portfolio Equity',
  current: 'Current',
  timeline: 'Timeline',
  
  // Portfolio Alerts
  portfolioAlerts: 'Portfolio Alerts',
  refinancingOpportunity: 'Refinancing Opportunity',
  propertyEligibleRefinancing: 'Property may be eligible for refinancing to reduce interest rate.',
  marketOpportunity: 'Market Opportunity',
  newPropertyMatchingCriteria: 'New property matching your investment criteria is available.',
  viewDetails: 'View Details',
  northDistrict: 'North District',
  marketTrendAlert: 'Market Trend Alert',
  interestRateChangeImpact: 'Interest rate changes may impact your investment performance.',
  portfolioDiversificationAlert: 'Portfolio Diversification Alert',
  portfolioConcentrationRisk: 'Your portfolio may have concentration risk in one area.',
  diversificationOptions: 'diversification options',
  viewDiversificationOptions: 'View Diversification Options',
  potentialRate: 'Potential Rate',
  projectedCapRate: 'Projected Cap Rate',
  rateChange: 'Rate Change',
  analyzeImpact: 'Analyze Impact',
  residentialConcentration: 'Residential Concentration',
  
  // Property Performance
  propertyPerformance: 'Property Performance',
  compareYourInvestments: 'Compare your investment returns',
  appreciation: 'Appreciation',
  returns: 'Returns',
  projection: 'Projection',
  months: 'Months',
  year: 'Year',
  years: 'Years',
  assetAllocation: 'Asset Allocation',
  portfolioMix: 'Portfolio Mix',
  optimizePortfolio: 'Optimize Portfolio',
  
  // Marketing
  realEstateInvestmentMadeEasy: 'Real Estate Investment Made Easy',
  comprehensiveToolsForRealEstate: 'Comprehensive tools and analytics to manage your real estate investments',
  powerfulTools: 'Powerful Tools for Real Estate Investors',
  comprehensiveToolsDescription: 'Everything you need to analyze, track, and grow your property investments',
  startInvesting: 'Start Your Investment Journey Today',
  startInvestingDescription: 'Join thousands of successful investors building wealth through real estate',
  getStarted: 'Get Started',
  exploreProperties: 'Explore Properties',

  // Financial Analysis
  financialAnalysis: 'Financial Analysis',
  cashFlowAnalysis: 'Cash Flow Analysis',
  mortgageAnalysis: 'Mortgage Analysis',
  rentalIncomeAnalysis: 'Rental Income Analysis',
  expenseAnalysis: 'Expense Analysis',
  taxAnalysis: 'Tax Analysis',
  investmentAnalysis: 'Investment Analysis',
  
  // Portfolio Cards
  portfolioManagement: 'Portfolio Management',
  portfolioManagementDesc: 'Track and manage all your properties in one place',
  financialTools: 'Financial Tools',
  financialToolsDesc: 'Calculate ROI, mortgage payments, and more',
  marketAnalysis: 'Market Analysis',
  marketAnalysisDesc: 'Research markets and identify opportunities',
  
  // Education Section
  educationHeader: 'Education Center',
  educationDescription: 'Learn about real estate investment strategies',
  
  // Feature notifications
  featureNotification: 'Feature in Development',
  featureComingSoon: 'functionality coming soon!',
  toThe: 'to the',
  
  // Calculator Page
  investmentCalculators: 'Investment Calculators',
  analyticalToolsForInvestors: 'Analytical tools to evaluate real estate investment opportunities',
  investment: 'Investment',
  mortgage: 'Mortgage',
  taxPlanning: 'Tax Planning',
  marketResearch: 'Market Research',
  realEstateInvestmentCalculator: 'Real Estate Investment Calculator',
  analyzePropertyInvestments: 'Analyze potential returns and cash flow for property investments',
  downPayment: 'Down Payment',
  ofPropertyValue: 'of property value',
  loanAmount: 'Loan Amount',
  mortgagePayment: 'Mortgage Payment',
  month: 'month',
  monthlyRentalIncome: 'Monthly Rental Income',
  vacancyLoss: 'Vacancy Loss',
  netOperatingIncome: 'Net Operating Income',
  investmentReturns: 'Investment Returns',
  totalInterestPaid: 'Total Interest Paid',
  totalLoanCost: 'Total Loan Cost',
  mortgageCalculation: 'Mortgage Calculation',
  breakEvenPoint: 'Break-even Point',
  notProfitable: 'Not Profitable',
  assumptions: 'Assumptions',
  propertyAppreciation: 'Property Appreciation',
  rentalGrowth: 'Rental Growth',
  expenseInflation: 'Expense Inflation',
  sellingCosts: 'Selling Costs',
  annually: 'annually',
  totalInvestment: 'Total Investment',
  annualCashFlow: 'Annual Cash Flow',
  saveCalculationsDescription: 'Save your calculations and track different investment scenarios with a free account.',
  createAccount: 'Create Account',
  expertConsultationDescription: 'Get personalized advice from real estate investment experts.',
  bookConsultation: 'Book Consultation',
  unlockPremiumAnalysisTools: 'Unlock advanced tools for detailed investment analysis',
  savePreviousCalculations: 'Save Previous Calculations',
  trackYourScenarios: 'Compare different investment scenarios',
  needHelp: 'Need Help?',
  consultWithExperts: 'Discuss your investment strategy with experts',
  advancedAnalysisTools: 'Advanced Analysis Tools',
  sensitivityAnalysis: 'Sensitivity Analysis',
  comparativePropertyAnalysis: 'Comparative Property Analysis',
  advancedTaxStrategies: 'Advanced Tax Optimization',
  upgradeToPremium: 'Upgrade to Premium',
  comingSoon: 'Coming Soon',
  mortgageCalculatorDescription: 'Calculate mortgage payments and compare different loan options',
  mortgageCalculatorComingSoon: 'Our detailed mortgage calculator is coming soon. Stay tuned!',
  taxPlanningToolsDescription: 'Optimize tax strategies for your real estate investments',
  taxPlanningToolsComingSoon: 'Tax planning tools are under development and will be available soon.',
  marketResearchToolsDescription: 'Research markets and identify investment opportunities',
  marketResearchToolsComingSoon: 'Our market research tools are coming soon to help you find the best investment opportunities.',
  resetToDefaults: 'Reset to Defaults',
  
  // Education Content
  investmentBasics: 'Investment Basics',
  taxation: 'Taxation',
  legalBasics: 'Legal Basics',
  propertyManagement: 'Property Management',
  advancedInvestmentStrategies: 'Advanced Investment Strategies',
};

// German translations
const germanTranslations = {
  // General
  welcome: 'Willkommen',
  welcomeBack: 'Willkommen zurück',
  loading: 'Laden...',
  save: 'Speichern',
  cancel: 'Abbrechen',
  edit: 'Bearbeiten',
  delete: 'Löschen',
  view: 'Ansehen',
  add: 'Hinzufügen',
  create: 'Erstellen',
  search: 'Suchen',
  filter: 'Filtern',
  sort: 'Sortieren',
  explore: 'Erkunden',
  details: 'Details',
  settings: 'Einstellungen',
  profile: 'Profil',
  logout: 'Abmelden',
  login: 'Anmelden',
  register: 'Registrieren',
  email: 'E-Mail',
  password: 'Passwort',
  confirmPassword: 'Passwort bestätigen',
  submit: 'Absenden',
   back: 'Zurück',
  next: 'Weiter',
  finish: 'Abschließen',
  continue: 'Fortsetzen',
  yes: 'Ja',
  no: 'Nein',
  all: 'Alle',
  none: 'Keine',
  more: 'Mehr',
  less: 'Weniger',
  reset: 'Zurücksetzen',
  apply: 'Anwenden',
  clear: 'Leeren',
  close: 'Schließen',
  open: 'Öffnen',
  select: 'Auswählen',
  selected: 'Ausgewählt',
  selectAll: 'Alle auswählen',
  selectNone: 'Keine auswählen',
  uploadImage: 'Bild hochladen',
  removeImage: 'Bild entfernen',
  addImage: 'Bild hinzufügen',
  chooseFile: 'Datei auswählen',
  noFileSelected: 'Keine Datei ausgewählt',
  fileSelected: 'Datei ausgewählt',
  uploadingFile: 'Datei wird hochgeladen...',
  uploadSuccess: 'Hochladen erfolgreich',
  uploadFailed: 'Hochladen fehlgeschlagen',
  tryAgain: 'Erneut versuchen',
  done: 'Fertig',
  complete: 'Vollständig',
  incomplete: 'Unvollständig',
  success: 'Erfolg',
  error: 'Fehler',
  warning: 'Warnung',
  info: 'Info',
  required: 'Erforderlich',
  optional: 'Optional',
  
  // Dashboard
  dashboard: 'Dashboard',
  dashboardTitle: 'Immobilien-Dashboard',
  welcomeToDashboard: 'Verfolgen Sie Ihre Immobilien und Investitionen',
  propertyOverview: 'Immobilienübersicht',
  recentActivity: 'Letzte Aktivitäten',
  upcomingTasks: 'Bevorstehende Aufgaben',
  marketInsights: 'Markteinblicke',
  portfolioPerformance: 'Portfolio-Performance',
  totalProperties: 'Gesamtzahl der Immobilien',
  totalValue: 'Gesamtwert',
  totalIncome: 'Gesamteinnahmen',
  totalExpenses: 'Gesamtausgaben',
  netCashFlow: 'Netto-Cashflow',
  portfolioValue: 'Portfolio Wert',
  portfolioGrowth: 'Portfolio Wachstum',
  portfolioValueChange: 'Portfolio Wertänderung',
  allProperties: 'Alle Immobilien',
  addProperty: 'Immobilie hinzufügen',
  editProperty: 'Immobilie bearbeiten',
  deleteProperty: 'Immobilie löschen',
  viewProperty: 'Immobilie ansehen',
  propertyDetails: 'Immobiliendetails',
  propertyStats: 'Immobilienstatistik',
  
  // Property List
  properties: 'Immobilien',
  propertyList: 'Immobilienliste',
  propertyListTitle: 'Immobilienportfolio',
  noProperties: 'Keine Immobilien gefunden',
  addFirstProperty: 'Fügen Sie Ihre erste Immobilie hinzu',
  filterProperties: 'Immobilien filtern',
  sortProperties: 'Immobilien sortieren',
  searchProperties: 'Immobilien suchen',
  totalPurchasePrice: 'Gesamtkaufpreis',
  underAnalysis: 'In Analyse',
  propertiesAnalyzed: 'Immobilien in Analyse',
  negotiations: 'Verhandlungen',
  propertiesNegotiation: 'Immobilien in Verhandlung',
  
  // Property Details
  address: 'Adresse',
  city: 'Stadt',
  state: 'Bundesland',
  zipCode: 'Postleitzahl',
  country: 'Land',
  propertyType: 'Immobilientyp',
  bedrooms: 'Schlafzimmer',
  bathrooms: 'Badezimmer',
  squareFeet: 'Quadratfuß',
  yearBuilt: 'Baujahr',
  purchaseDate: 'Kaufdatum',
  purchasePrice: 'Kaufpreis',
  currentValue: 'Aktueller Wert',
  mortgage: 'Hypothek',
  monthlyPayment: 'Monatliche Zahlung',
  interestRate: 'Zinssatz',
  loanTerm: 'Kreditlaufzeit',
  rentAmount: 'Mietbetrag',
  expenses: 'Ausgaben',
  cashFlow: 'Cashflow',
  capRate: 'Kapitalisierungsrate',
  roi: 'ROI',
  propertyTax: 'Grundsteuer',
  insurance: 'Versicherung',
  maintenanceFees: 'Wartungsgebühren',
  hoaFees: 'Hausbesitzerverein Gebühren',
  utilities: 'Versorgungsleistungen',
  vacancy: 'Leerstand',
  managementFee: 'Verwaltungsgebühr',
  otherExpenses: 'Sonstige Ausgaben',
  grossRentalYield: 'Bruttomietrendite',
  netRentalYield: 'Nettomietrendite',
  cashOnCashReturn: 'Cash-on-Cash-Rendite',
  totalReturn: 'Gesamtrendite',
  appreciationRate: 'Wertsteigerungsrate',
  years: 'Jahre',
  
  // Investor Dashboard
  investorDashboard: 'Investoren-Dashboard',
  investmentPortfolio: 'Investitionsportfolio',
  trackYourRealEstateInvestments: 'Verfolgen und analysieren Sie Ihre Immobilieninvestitionen',
  
  // Investment Goals
  investmentGoals: 'Investitionsziele',
  cashflowGoal: 'Cashflow-Ziel',
  equityTarget: 'Eigenkapitalziel',
  totalPropertiesGoal: 'Gesamtzahl der Immobilien Ziel',
  passiveIncomeGoal: 'Passives Einkommensziel',
  fromLastQuarter: 'vom letzten Quartal',
  nextAcquisitionEstimate: 'Nächste Akquisitionsschätzung',
  oneYearProjection: '1-Jahres-Projektion',
  threeYearProjection: '3-Jahres-Projektion',
  fiveYearProjection: '5-Jahres-Projektion',
  monthlyCashflow: 'Monatlicher Cashflow',
  portfolioEquity: 'Portfolio Eigenkapital',
  current: 'Aktuell',
  timeline: 'Zeitachse',
  
  // Portfolio Alerts
  portfolioAlerts: 'Portfolio-Benachrichtigungen',
  refinancingOpportunity: 'Refinanzierungsmöglichkeit',
  propertyEligibleRefinancing: 'Die Immobilie kann für eine Refinanzierung zur Senkung des Zinssatzes in Frage kommen.',
  marketOpportunity: 'Marktchance',
  newPropertyMatchingCriteria: 'Eine neue Immobilie, die Ihren Anlagekriterien entspricht, ist verfügbar.',
  viewDetails: 'Details ansehen',
  northDistrict: 'Nordbezirk',
  marketTrendAlert: 'Markttrend-Benachrichtigung',
  interestRateChangeImpact: 'Zinsänderungen können sich auf Ihre Anlageperformance auswirken.',
  portfolioDiversificationAlert: 'Portfolio-Diversifikationswarnung',
  portfolioConcentrationRisk: 'Ihr Portfolio kann ein Konzentrationsrisiko in einem Bereich aufweisen.',
  diversificationOptions: 'Diversifikationsoptionen',
  viewDiversificationOptions: 'Diversifikationsoptionen anzeigen',
  potentialRate: 'Potenzieller Zinssatz',
  projectedCapRate: 'Prognostizierte Kapitalisierungsrate',
  rateChange: 'Zinsänderung',
  analyzeImpact: 'Auswirkungen analysieren',
  residentialConcentration: 'Wohnkonzentration',
  
  // Property Performance
  propertyPerformance: 'Immobilien Performance',
  compareYourInvestments: 'Vergleichen Sie Ihre Investitionsrenditen',
  appreciation: 'Wertsteigerung',
  returns: 'Renditen',
  projection: 'Projektion',
  months: 'Monate',
  year: 'Jahr',
  years: 'Jahre',
  assetAllocation: 'Vermögensaufteilung',
  portfolioMix: 'Portfolio-Mix',
  optimizePortfolio: 'Portfolio optimieren',
  
  // Marketing
  realEstateInvestmentMadeEasy: 'Immobilieninvestition leicht gemacht',
  comprehensiveToolsForRealEstate: 'Umfassende Tools und Analysen zur Verwaltung Ihrer Immobilieninvestitionen',
  powerfulTools: 'Leistungsstarke Tools für Immobilieninvestoren',
  comprehensiveToolsDescription: 'Alles, was Sie zum Analysieren, Verfolgen und Ausbauen Ihrer Immobilieninvestitionen benötigen',
  startInvesting: 'Starten Sie noch heute Ihre Investitionsreise',
  startInvestingDescription: 'Schließen Sie sich Tausenden von erfolgreichen Investoren an, die durch Immobilien Vermögen aufbauen',
  getStarted: 'Loslegen',
  exploreProperties: 'Immobilien erkunden',

  // Financial Analysis
  financialAnalysis: 'Finanzanalyse',
  cashFlowAnalysis: 'Cashflow-Analyse',
  mortgageAnalysis: 'Hypothekenanalyse',
  rentalIncomeAnalysis: 'Mieteinnahmenanalyse',
  expenseAnalysis: 'Ausgabenanalyse',
  taxAnalysis: 'Steueranalyse',
  investmentAnalysis: 'Investitionsanalyse',
  
  // Portfolio Cards
  portfolioManagement: 'Portfolioverwaltung',
  portfolioManagementDesc: 'Verfolgen und verwalten Sie alle Ihre Immobilien an einem Ort',
  financialTools: 'Finanztools',
  financialToolsDesc: 'Berechnen Sie ROI, Hypothekenzahlungen und mehr',
  marketAnalysis: 'Marktanalyse',
  marketAnalysisDesc: 'Recherchieren Sie Märkte und identifizieren Sie Möglichkeiten',
  
  // Education Section
  educationHeader: 'Bildungszentrum',
  educationDescription: 'Erfahren Sie mehr über Immobilien Anlagestrategien',
  
   // Feature notifications
  featureNotification: 'Funktion in Entwicklung',
  featureComingSoon: 'Funktionalität folgt in Kürze!',
  toThe: 'zum',
  
  // Calculator Page
  investmentCalculators: 'Investitionsrechner',
  analyticalToolsForInvestors: 'Analytische Werkzeuge zur Bewertung von Immobilieninvestitionsmöglichkeiten',
  investment: 'Investition',
  mortgage: 'Hypothek',
  taxPlanning: 'Steuerplanung',
  marketResearch: 'Marktforschung',
  realEstateInvestmentCalculator: 'Immobilien-Investitionsrechner',
  analyzePropertyInvestments: 'Analysieren Sie potenzielle Renditen und Cashflow für Immobilieninvestitionen',
  downPayment: 'Anzahlung',
  ofPropertyValue: 'des Immobilienwerts',
  loanAmount: 'Darlehensbetrag',
  mortgagePayment: 'Monatliche Hypothekenzahlung',
  month: 'Monat',
  monthlyRentalIncome: 'Monatliche Mieteinnahmen',
  vacancyLoss: 'Leerstandsverlust',
  netOperatingIncome: 'Nettobetriebseinkommen',
  investmentReturns: 'Investitionsrenditen',
  totalInterestPaid: 'Gezahlte Zinsen insgesamt',
  totalLoanCost: 'Gesamtdarlehenskosten',
  mortgageCalculation: 'Hypothekenberechnung',
  breakEvenPoint: 'Kostendeckungspunkt',
  notProfitable: 'Nicht rentabel',
  assumptions: 'Annahmen',
  propertyAppreciation: 'Immobilienaufwertung',
  rentalGrowth: 'Mietwachstum',
  expenseInflation: 'Ausgabeninflation',
  sellingCosts: 'Verkaufskosten',
  annually: 'jährlich',
  totalInvestment: 'Gesamtinvestition',
  annualCashFlow: 'Jährlicher Cashflow',
  saveCalculationsDescription: 'Speichern Sie Ihre Berechnungen und verfolgen Sie verschiedene Investitionsszenarien mit einem kostenlosen Konto.',
  createAccount: 'Konto erstellen',
  expertConsultationDescription: 'Lassen Sie sich von Experten für Immobilieninvestitionen persönlich beraten.',
  bookConsultation: 'Beratung buchen',
  unlockPremiumAnalysisTools: 'Schalten Sie erweiterte Tools für detaillierte Investitionsanalysen frei',
  savePreviousCalculations: 'Vorherige Berechnungen speichern',
  trackYourScenarios: 'Vergleichen Sie verschiedene Investitionsszenarien',
  needHelp: 'Brauchen Sie Hilfe?',
  consultWithExperts: 'Besprechen Sie Ihre Anlagestrategie mit Experten',
  advancedAnalysisTools: 'Erweiterte Analysewerkzeuge',
  sensitivityAnalysis: 'Sensitivitätsanalyse',
  comparativePropertyAnalysis: 'Vergleichende Immobilienanalyse',
  advancedTaxStrategies: 'Erweiterte Steueroptimierung',
  upgradeToPremium: 'Auf Premium upgraden',
  comingSoon: 'Demnächst',
  mortgageCalculatorDescription: 'Berechnen Sie Hypothekenzahlungen und vergleichen Sie verschiedene Kreditoptionen',
  mortgageCalculatorComingSoon: 'Unser detaillierter Hypothekenrechner ist in Kürze verfügbar. Bleiben Sie dran!',
  taxPlanningToolsDescription: 'Optimieren Sie Steuerstrategien für Ihre Immobilieninvestitionen',
  taxPlanningToolsComingSoon: 'Steuerplanungswerkzeuge sind in Entwicklung und werden bald verfügbar sein.',
  marketResearchToolsDescription: 'Recherchieren Sie Märkte und identifizieren Sie Investitionsmöglichkeiten',
  marketResearchToolsComingSoon: 'Unsere Marktforschungswerkzeuge sind in Kürze verfügbar, um Ihnen zu helfen, die besten Investitionsmöglichkeiten zu finden.',
  resetToDefaults: 'Auf Standardwerte zurücksetzen',
  
  // Education Content
  investmentBasics: 'Grundlagen der Investition',
  taxation: 'Besteuerung',
  legalBasics: 'Rechtliche Grundlagen',
  propertyManagement: 'Immobilienverwaltung',
  advancedInvestmentStrategies: 'Fortgeschrittene Anlagestrategien',
};

// French translations
const frenchTranslations = {
  // General
  welcome: 'Bienvenue',
  welcomeBack: 'Bon retour',
  loading: 'Chargement...',
  save: 'Enregistrer',
  cancel: 'Annuler',
  edit: 'Modifier',
  delete: 'Supprimer',
  view: 'Voir',
  add: 'Ajouter',
  create: 'Créer',
  search: 'Rechercher',
  filter: 'Filtrer',
  sort: 'Trier',
  explore: 'Explorer',
  details: 'Détails',
  settings: 'Paramètres',
  profile: 'Profil',
  logout: 'Déconnexion',
  login: 'Connexion',
  register: 'S\'inscrire',
  email: 'Courriel',
  password: 'Mot de passe',
  confirmPassword: 'Confirmer le mot de passe',
  submit: 'Soumettre',
  back: 'Retour',
  next: 'Suivant',
  finish: 'Terminer',
  continue: 'Continuer',
  yes: 'Oui',
  no: 'Non',
  all: 'Tous',
  none: 'Aucun',
  more: 'Plus',
  less: 'Moins',
  reset: 'Réinitialiser',
  apply: 'Appliquer',
  clear: 'Effacer',
  close: 'Fermer',
  open: 'Ouvrir',
  select: 'Sélectionner',
  selected: 'Sélectionné',
  selectAll: 'Sélectionner tout',
  selectNone: 'Ne rien sélectionner',
  uploadImage: 'Télécharger une image',
  removeImage: 'Supprimer l\'image',
  addImage: 'Ajouter une image',
  chooseFile: 'Choisir un fichier',
  noFileSelected: 'Aucun fichier sélectionné',
  fileSelected: 'Fichier sélectionné',
  uploadingFile: 'Téléchargement du fichier...',
  uploadSuccess: 'Téléchargement réussi',
  uploadFailed: 'Téléchargement échoué',
  tryAgain: 'Réessayer',
  done: 'Terminé',
  complete: 'Complet',
  incomplete: 'Incomplet',
  success: 'Succès',
  error: 'Erreur',
  warning: 'Avertissement',
  info: 'Info',
  required: 'Requis',
  optional: 'Optionnel',
  
  // Dashboard
  dashboard: 'Tableau de bord',
  dashboardTitle: 'Tableau de bord immobilier',
  welcomeToDashboard: 'Suivez vos propriétés et investissements',
  propertyOverview: 'Aperçu des propriétés',
  recentActivity: 'Activité récente',
  upcomingTasks: 'Tâches à venir',
  marketInsights: 'Aperçus du marché',
  portfolioPerformance: 'Performance du portefeuille',
  totalProperties: 'Nombre total de propriétés',
  totalValue: 'Valeur totale',
  totalIncome: 'Revenu total',
  totalExpenses: 'Dépenses totales',
  netCashFlow: 'Flux de trésorerie net',
  portfolioValue: 'Valeur du portefeuille',
  portfolioGrowth: 'Croissance du portefeuille',
  portfolioValueChange: 'Changement de la valeur du portefeuille',
  allProperties: 'Toutes les propriétés',
  addProperty: 'Ajouter une propriété',
  editProperty: 'Modifier la propriété',
  deleteProperty: 'Supprimer la propriété',
  viewProperty: 'Voir la propriété',
  propertyDetails: 'Détails de la propriété',
  propertyStats: 'Statistiques de la propriété',
  
  // Property List
  properties: 'Propriétés',
  propertyList: 'Liste des propriétés',
  propertyListTitle: 'Portefeuille immobilier',
  noProperties: 'Aucune propriété trouvée',
  addFirstProperty: 'Ajoutez votre première propriété',
  filterProperties: 'Filtrer les propriétés',
  sortProperties: 'Trier les propriétés',
  searchProperties: 'Rechercher des propriétés',
  totalPurchasePrice: 'Prix d\'achat total',
  underAnalysis: 'En analyse',
  propertiesAnalyzed: 'Propriétés en cours d\'analyse',
  negotiations: 'Négociations',
  propertiesNegotiation: 'Propriétés en négociation',
  
  // Property Details
  address: 'Adresse',
  city: 'Ville',
  state: 'État',
  zipCode: 'Code postal',
  country: 'Pays',
  propertyType: 'Type de propriété',
  bedrooms: 'Chambres',
  bathrooms: 'Salles de bain',
  squareFeet: 'Pieds carrés',
  yearBuilt: 'Année de construction',
  purchaseDate: 'Date d\'achat',
  purchasePrice: 'Prix d\'achat',
  currentValue: 'Valeur actuelle',
  mortgage: 'Hypothèque',
  monthlyPayment: 'Paiement mensuel',
  interestRate: 'Taux d\'intérêt',
  loanTerm: 'Durée du prêt',
  rentAmount: 'Montant du loyer',
  expenses: 'Dépenses',
  cashFlow: 'Flux de trésorerie',
  capRate: 'Taux de capitalisation',
  roi: 'TRI',
  propertyTax: 'Taxe foncière',
  insurance: 'Assurance',
  maintenanceFees: 'Frais d\'entretien',
  hoaFees: 'Frais d\'association de propriétaires',
  utilities: 'Services publics',
  vacancy: 'Vacance',
  managementFee: 'Frais de gestion',
  otherExpenses: 'Autres dépenses',
  grossRentalYield: 'Rendement locatif brut',
  netRentalYield: 'Rendement locatif net',
  cashOnCashReturn: 'Retour sur investissement en espèces',
  totalReturn: 'Retour total',
  appreciationRate: 'Taux d\'appréciation',
  years: 'Ans',
  
  // Investor Dashboard
  investorDashboard: 'Tableau de bord de l\'investisseur',
  investmentPortfolio: 'Portefeuille d\'investissement',
  trackYourRealEstateInvestments: 'Suivez et analysez vos investissements immobiliers',
  
  // Investment Goals
  investmentGoals: 'Objectifs d\'investissement',
  cashflowGoal: 'Objectif de flux de trésorerie',
  equityTarget: 'Objectif de capitaux propres',
  totalPropertiesGoal: 'Objectif du nombre total de propriétés',
  passiveIncomeGoal: 'Objectif de revenu passif',
  fromLastQuarter: 'du dernier trimestre',
  nextAcquisitionEstimate: 'Prochaine estimation d\'acquisition',
  oneYearProjection: 'Projection sur 1 an',
  threeYearProjection: 'Projection sur 3 ans',
  fiveYearProjection: 'Projection sur 5 ans',
  monthlyCashflow: 'Flux de trésorerie mensuel',
  portfolioEquity: 'Capitaux propres du portefeuille',
  current: 'Actuel',
  timeline: 'Chronologie',
  
  // Portfolio Alerts
  portfolioAlerts: 'Alertes de portefeuille',
  refinancingOpportunity: 'Opportunité de refinancement',
  propertyEligibleRefinancing: 'La propriété peut être admissible à un refinancement pour réduire le taux d\'intérêt.',
  marketOpportunity: 'Opportunité de marché',
  newPropertyMatchingCriteria: 'Une nouvelle propriété correspondant à vos critères d\'investissement est disponible.',
  viewDetails: 'Voir les détails',
  northDistrict: 'District Nord',
  marketTrendAlert: 'Alerte de tendance du marché',
  interestRateChangeImpact: 'Les changements de taux d\'intérêt peuvent avoir un impact sur le rendement de votre investissement.',
  portfolioDiversificationAlert: 'Alerte de diversification du portefeuille',
  portfolioConcentrationRisk: 'Votre portefeuille peut présenter un risque de concentration dans un domaine.',
  diversificationOptions: 'Options de diversification',
  viewDiversificationOptions: 'Afficher les options de diversification',
  potentialRate: 'Taux potentiel',
  projectedCapRate: 'Taux de capitalisation prévu',
  rateChange: 'Changement de taux',
  analyzeImpact: 'Analyser l\'impact',
  residentialConcentration: 'Concentration résidentielle',
  
  // Property Performance
  propertyPerformance: 'Performance de la propriété',
  compareYourInvestments: 'Comparez vos rendements d\'investissement',
  appreciation: 'Appréciation',
  returns: 'Retours',
  projection: 'Projection',
  months: 'Mois',
  year: 'An',
  years: 'Ans',
  assetAllocation: 'Répartition des actifs',
  portfolioMix: 'Composition du portefeuille',
  optimizePortfolio: 'Optimiser le portefeuille',
  
  // Marketing
  realEstateInvestmentMadeEasy: 'L\'investissement immobilier simplifié',
  comprehensiveToolsForRealEstate: 'Outils et analyses complets pour gérer vos investissements immobiliers',
  powerfulTools: 'Outils puissants pour les investisseurs immobiliers',
  comprehensiveToolsDescription: 'Tout ce dont vous avez besoin pour analyser, suivre et développer vos investissements immobiliers',
  startInvesting: 'Commencez votre parcours d\'investissement dès aujourd\'hui',
  startInvestingDescription: 'Rejoignez des milliers d\'investisseurs qui réussissent à créer de la richesse grâce à l\'immobilier',
  getStarted: 'Commencer',
  exploreProperties: 'Explorer les propriétés',

  // Financial Analysis
  financialAnalysis: 'Analyse financière',
  cashFlowAnalysis: 'Analyse des flux de trésorerie',
  mortgageAnalysis: 'Analyse hypothécaire',
  rentalIncomeAnalysis: 'Analyse des revenus locatifs',
  expenseAnalysis: 'Analyse des dépenses',
  taxAnalysis: 'Analyse fiscale',
  investmentAnalysis: 'Analyse des investissements',
  
  // Portfolio Cards
  portfolioManagement: 'Gestion de portefeuille',
  portfolioManagementDesc: 'Suivez et gérez toutes vos propriétés en un seul endroit',
  financialTools: 'Outils financiers',
  financialToolsDesc: 'Calculez le ROI, les paiements hypothécaires et plus',
  marketAnalysis: 'Analyse de marché',
  marketAnalysisDesc: 'Recherchez des marchés et identifiez des opportunités',
  
  // Education Section
  educationHeader: 'Centre d\'éducation',
  educationDescription: 'Apprenez les stratégies d\'investissement immobilier',
  
  // Feature notifications
  featureNotification: 'Fonctionnalité en développement',
  featureComingSoon: 'fonctionnalité à venir bientôt!',
  toThe: 'au',
  
  // Calculator Page
  investmentCalculators: 'Calculateurs d\'investissement',
  analyticalToolsForInvestors: 'Outils analytiques pour évaluer les opportunités d\'investissement immobilier',
  investment: 'Investissement',
  mortgage: 'Hypothèque',
  taxPlanning: 'Planification fiscale',
  marketResearch: 'Étude de marché',
  realEstateInvestmentCalculator: 'Calculateur d\'investissement immobilier',
  analyzePropertyInvestments: 'Analysez les rendements potentiels et les flux de trésorerie pour les investissements immobiliers',
  downPayment: 'Acompte',
  ofPropertyValue: 'de la valeur de la propriété',
  loanAmount: 'Montant du prêt',
  mortgagePayment: 'Paiement hypothécaire',
  month: 'mois',
  monthlyRentalIncome: 'Revenu locatif mensuel',
  vacancyLoss: 'Perte de vacance',
  netOperatingIncome: 'Revenu net d\'exploitation',
  investmentReturns: 'Rendements des investissements',
  totalInterestPaid: 'Intérêts totaux payés',
  totalLoanCost: 'Coût total du prêt',
  mortgageCalculation: 'Calcul hypothécaire',
  breakEvenPoint: 'Point d\'équilibre',
  notProfitable: 'Non rentable',
  assumptions: 'Hypothèses',
  propertyAppreciation: 'Appréciation de la propriété',
  rentalGrowth: 'Croissance des loyers',
  expenseInflation: 'Inflation des dépenses',
  sellingCosts: 'Frais de vente',
  annually: 'annuellement',
  totalInvestment: 'Investissement total',
  annualCashFlow: 'Flux de trésorerie annuel',
  saveCalculationsDescription: 'Enregistrez vos calculs et suivez différents scénarios d\'investissement avec un compte gratuit.',
  createAccount: 'Créer un compte',
  expertConsultationDescription: 'Obtenez des conseils personnalisés d\'experts en investissement immobilier.',
  bookConsultation: 'Réserver une consultation',
  unlockPremiumAnalysisTools: 'Débloquez des outils avancés pour une analyse d\'investissement détaillée',
  savePreviousCalculations: 'Enregistrer les calculs précédents',
  trackYourScenarios: 'Comparez différents scénarios d\'investissement',
  needHelp: 'Besoin d\'aide?',
  consultWithExperts: 'Discutez de votre stratégie d\'investissement avec des experts',
  advancedAnalysisTools: 'Outils d\'analyse avancés',
  sensitivityAnalysis: 'Analyse de sensibilité',
  comparativePropertyAnalysis: 'Analyse comparative de propriété',
  advancedTaxStrategies: 'Optimisation fiscale avancée',
  upgradeToPremium: 'Passer à Premium',
  comingSoon: 'À venir',
  mortgageCalculatorDescription: 'Calculez les paiements hypothécaires et comparez différentes options de prêt',
  mortgageCalculatorComingSoon: 'Notre calculateur hypothécaire détaillé arrive bientôt. Restez à l\'écoute!',
  taxPlanningToolsDescription: 'Optimisez les stratégies fiscales pour vos investissements immobiliers',
  taxPlanningToolsComingSoon: 'Les outils de planification fiscale sont en développement et seront bientôt disponibles.',
  marketResearchToolsDescription: 'Recherchez des marchés et identifiez des opportunités d\'investissement',
  marketResearchToolsComingSoon: 'Nos outils de recherche de marché arrivent bientôt pour vous aider à trouver les meilleures opportunités d\'investissement.',
  resetToDefaults: 'Réinitialiser aux valeurs par défaut',
  
  // Education Content
  investmentBasics: 'Principes de base de l\'investissement',
  taxation: 'Fiscalité',
  legalBasics: 'Bases juridiques',
  propertyManagement: 'Gestion immobilière',
  advancedInvestmentStrategies: 'Stratégies d\'investissement avancées',
};

export interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<any>({
    en: englishTranslations,
    de: germanTranslations,
    fr: frenchTranslations,
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = (key: string, vars?: { [key: string]: string | number }): string => {
    // Get the translation based on the current language
    let translation = key;
    
    try {
      const langTranslations = translations[language] || translations.en;
      
      if (langTranslations && langTranslations[key]) {
        translation = langTranslations[key];
        
        // Replace variables if they exist
        if (vars) {
          Object.keys(vars).forEach(varKey => {
            translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), String(vars[varKey]));
          });
        }
      } else if (translations.en && translations.en[key]) {
        // Fallback to English if the key exists there
        translation = translations.en[key];
        
        // Replace variables if they exist
        if (vars) {
          Object.keys(vars).forEach(varKey => {
            translation = translation.replace(new RegExp(`{${varKey}}`, 'g'), String(vars[varKey]));
          });
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    
    return translation;
  };

  const updateTranslations = (newTranslations: any) => {
    setTranslations(prevTranslations => {
      const updatedTranslations = { ...prevTranslations };
      
      // Update translations for each language
      Object.keys(newTranslations).forEach(key => {
        const translationItem = newTranslations[key];
        
        // Update each language with the new translation
        Object.keys(translationItem).forEach(lang => {
          if (!updatedTranslations[lang]) {
            updatedTranslations[lang] = {};
          }
          
          updatedTranslations[lang][key] = translationItem[lang];
        });
      });
      
      return updatedTranslations;
    });
  };
  
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, t, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps & { translations: any, updateTranslations: (newTranslations: any) => void } => {
  const context = useContext(LanguageContext);
  const { updateTranslations, translations } = useContext(LanguageContext) as any;
  
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return {
    ...context,
    translations,
    updateTranslations
  };
};

