import React, { createContext, useContext, useState } from 'react';

interface LanguageContextProps {
  language: string;
  t: (key: string, vars?: { [key: string]: string | number }) => string;
  setLanguage: (lang: string) => void;
  translations: Record<string, Record<string, string>>;
  updateTranslations: (newTranslations: any) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  t: (key: string) => key,
  setLanguage: () => {},
  translations: {},
  updateTranslations: () => {}
});

// English translations - Default language
const englishTranslations = {
  // Navigation
  dashboard: 'Dashboard',
  properties: 'Properties',
  investorDashboard: 'Investor Dashboard',
  calculators: 'Calculators',
  education: 'Education',
  settings: 'Settings',
  profile: 'Profile',
  main: 'Main',
  account: 'Account',
  portfolio: 'Portfolio',
  marketAnalysis: 'Market Analysis',
  financing: 'Financing',
  taxPlanning: 'Tax Planning',
  dueDiligence: 'Due Diligence',

  // Portfolio dashboard
  investmentPortfolio: 'Investment Portfolio',
  trackYourRealEstateInvestments: 'Track and analyze your real estate investments',
  propertyPerformance: 'Property Performance',
  compareYourInvestments: 'Compare the performance of your investments',
  cashFlow: 'Cash Flow',
  roi: 'ROI',
  appreciation: 'Appreciation',
  enhancedAnalytics: 'Enhanced Analytics',
  enhancedAnalyticsDescription: 'Unlock advanced analytics with detailed property performance metrics',
  marketInsights: 'Market Insights',
  marketInsightsDescription: 'Connect to market data to see how your properties compare to local trends',
  portfolioAlerts: 'Portfolio Alerts',
  investmentGoals: 'Investment Goals',
  unlockAnalytics: 'Unlock Enhanced Analytics',
  viewDetailed: 'View Detailed Analysis',
  connectMarketData: 'Connect Market Data',

  // Property metrics
  totalValue: 'Total Value',
  equity: 'Equity',
  totalProperties: 'Total Properties',
  monthlyCashFlow: 'Monthly Cash Flow',
  annualCashFlow: 'Annual Cash Flow',
  cashOnCashReturn: 'Cash on Cash Return',
  capRate: 'Cap Rate',
  portfolioEquity: 'Portfolio Equity',
  
  // Portfolio goals
  cashflowGoal: 'Cash Flow Goal',
  equityTarget: 'Equity Target',
  totalPropertiesGoal: 'Total Properties Goal',
  passiveIncomeGoal: 'Passive Income Goal',
  fromLastQuarter: 'from last quarter',
  nextAcquisitionEstimate: 'Next acquisition estimate',
  current: 'Current',
  timeline: 'Timeline',
  edit: 'Edit',
  oneYearProjection: '1 Year Projection',
  threeYearProjection: '3 Year Projection',
  fiveYearProjection: '5 Year Projection',
  editGoals: 'Edit Goals',
  
  // Alerts
  refinancingOpportunity: 'Refinancing Opportunity',
  propertyEligibleRefinancing: 'Property at 123 Main St. may be eligible for refinancing at a lower rate',
  potentialRate: 'potential rate',
  marketOpportunity: 'Market Opportunity',
  newPropertyMatchingCriteria: 'New property matching your investment criteria found',
  viewProperty: 'View Property',
  northDistrict: 'North District',
  projectedCapRate: 'projected cap rate',
  marketTrendAlert: 'Market Trend Alert',
  interestRateChangeImpact: 'Interest rate changes could impact your investment portfolio',
  rateChange: 'rate change',
  analyzeImpact: 'Analyze Impact',
  portfolioDiversificationAlert: 'Portfolio Diversification Alert',
  portfolioConcentrationRisk: 'Your portfolio may be too concentrated in residential properties',
  residentialConcentration: 'residential concentration',
  diversificationOptions: 'Diversification Options',
  viewDiversificationOptions: 'View Diversification Options',
  viewDetails: 'View Details',
  
  // Analytics
  portfolioAnalytics: 'Portfolio Analytics',
  trackYourInvestmentPerformance: 'Track your investment performance',
  performance: 'Performance',
  distribution: 'Distribution',
  cashflow: 'Cash Flow',
  averageValue: 'Average Value',
  averageROI: 'Average ROI',
  income: 'Income',
  expenses: 'Expenses',
  
  // AI Assistant
  portfolioInsights: 'Portfolio Insights',
  getAIRecommendationsBasedOnYourPortfolio: 'Get AI recommendations based on your portfolio',
  
  // Welcome notification
  welcome: 'Welcome',
  toThe: 'to the',
  welcomeBack: 'Welcome back',
  continueMakingSmartInvestments: 'Continue making smart investment decisions with our tools',
  accessComprehensiveInvestmentTools: 'Access comprehensive tools to analyze and optimize your investments',
  completeInvestmentToolsuite: 'Complete set of tools for real estate investors',
  
  // Feature notifications
  featureNotification: 'Feature Preview',
  featureComingSoon: 'feature will be available soon',
  
  // Landing page
  realEstateInvestmentMadeEasy: 'Real Estate Investment Made Easy',
  comprehensiveToolsForRealEstate: 'Comprehensive tools to analyze, track, and grow your real estate investments',
  exploreProperties: 'Explore Properties',
  powerfulTools: 'Powerful Tools for Smart Investors',
  comprehensiveToolsDescription: 'Everything you need to analyze, track, and grow your real estate investments',
  portfolioManagement: 'Portfolio Management',
  portfolioManagementDesc: 'Track performance and set goals for your investment portfolio',
  financialTools: 'Financial Tools',
  financialToolsDesc: 'Calculate ROI, cash flow, and analyze investment opportunities',
  explore: 'Explore',
  educationHeader: 'Education Center',
  educationDescription: 'Learn everything you need to know about real estate investing',
  investmentBasics: 'Investment Basics',
  realEstateBasics: 'Learn the fundamentals of real estate investing',
  propertyTypes: 'Property Types',
  financingTerms: 'Financing Terms',
  rentalIncome: 'Rental Income',
  advancedInvestmentStrategies: 'Advanced Investment Strategies',
  investmentStrategies: 'Learn proven strategies for building wealth through real estate',
  buyAndHoldStrategy: 'Buy & Hold Strategy',
  fixAndFlipStrategy: 'Fix & Flip Strategy',
  startInvesting: 'Start Investing Today',
  startInvestingDescription: 'Create your account and begin your journey to financial freedom through real estate',
  getStarted: 'Get Started',
  
  // Education Center content
  understandingPropertyTypes: 'Understanding Property Types',
  keyTerminology: 'Key Terminology',
  essentialTerms: 'Essential terms every real estate investor should know',
  beginnerInvestmentAnalysis: 'Beginner Investment Analysis',
  basicAnalysisMetrics: 'Basic metrics to evaluate potential investments',
  cashFlowCalculation: 'Cash Flow Calculation',
  cashFlowCalculationDescription: 'How to calculate the cash flow of your property',
  cashFlowFormula: 'Monthly Rent - Expenses (Mortgage, Taxes, Insurance, Maintenance, Vacancy, etc.)',
  capRateCalculation: 'Cap Rate Calculation',
  capRateCalculationDescription: 'A measure of potential return on an investment property',
  capRateFormula: 'Net Operating Income / Property Value × 100%',
  onePercentRule: 'The 1% Rule',
  onePercentRuleDescription: 'Monthly rent should be at least 1% of the purchase price for a good investment',
  tryOurCalculators: 'Try Our Calculators',
  longTermWealthBuilding: 'Long-term wealth building through property ownership',
  buyAndHoldStrategyDescription: 'The buy and hold strategy involves purchasing properties and holding them for the long term, generating ongoing rental income and benefiting from property appreciation.',
  rentalIncomeDescription: 'Steady monthly income from tenant payments',
  propertyAppreciation: 'Property Appreciation',
  propertyAppreciationDescription: 'Increase in property value over time',
  buildingEquity: 'Building Equity',
  buildingEquityDescription: 'Paying down mortgage while property value increases',
  taxBenefits: 'Tax Benefits',
  taxBenefitsDescription: 'Deductions for expenses, depreciation, and more',
  shortTermStrategy: 'Short-term strategy focusing on property renovation and resale',
  fixAndFlipStrategyDescription: 'The fix and flip strategy involves buying undervalued properties, renovating them, and selling them quickly for a profit.',
  purchaseUndervaluedProperty: 'Purchase an undervalued property',
  renovateToIncreaseValue: 'Renovate to increase property value',
  sellQuicklyForProfit: 'Sell quickly at a higher price',
  reinvestProfitsNewProjects: 'Reinvest profits in new projects',
  fixAndFlipStrategyNote: 'Note: This strategy requires careful market analysis, renovation expertise, and timing',
  brrrStrategy: 'BRRR Strategy',
  buyRenovateRentRefinanceRepeat: 'Buy, Renovate, Rent, Refinance, Repeat',
  brrrStrategyDescription: 'A powerful method to build a real estate portfolio with limited capital by recycling the same funds across multiple properties.',
  brrrSteps: 'BRRR Steps',
  brrrBuyDescription: 'Purchase an undervalued property with potential',
  brrrRenovateDescription: 'Improve the property to increase its value',
  brrrRentDescription: 'Find quality tenants and establish rental income',
  brrrRefinanceDescription: 'Pull out your initial investment through refinancing',
  brrrRepeatDescription: 'Use the recovered capital to buy the next property',
  brrrAdvantages: 'Advantages',
  brrrAdvantage1: 'Recycle your initial investment capital',
  brrrAdvantage2: 'Scale your portfolio faster with fewer resources',
  brrrAdvantage3: 'Create equity through forced appreciation',
  understandingCashFlow: 'Understanding how money flows in and out of your property',
  cashFlowAnalysisDescription: 'Cash flow is the lifeblood of real estate investing. It\'s the money left over after all expenses are paid.',
  laundryIncome: 'Laundry Income',
  parkingIncome: 'Parking Income',
  storageIncome: 'Storage Income',
  otherIncome: 'Other Income',
  mortgage: 'Mortgage',
  propertyTax: 'Property Tax',
  insurance: 'Insurance',
  maintenance: 'Maintenance',
  propertyManagement: 'Property Management',
  utilities: 'Utilities',
  vacancy: 'Vacancy',
  capitalExpenditures: 'Capital Expenditures',
  formulaForNetCashFlow: 'Formula for Net Cash Flow',
  netCashFlowFormula: 'Total Income - Total Expenses = Net Cash Flow',
  returnMetrics: 'Return Metrics',
  measuringInvestmentPerformance: 'Measuring the performance of your real estate investments',
  capRateDetailedDescription: 'A measure of the rate of return on an investment property based on its income',
  cashOnCashReturnDetailedDescription: 'The ratio of annual cash flow to the total cash invested',
  cashOnCashReturnFormula: 'Annual Cash Flow / Total Cash Invested × 100%',
  totalRoi: 'Total ROI',
  totalRoiDetailedDescription: 'The comprehensive return including cash flow, appreciation, and tax benefits',
  totalRoiFormula: '(Cash Flow + Appreciation + Principal Paydown + Tax Benefits) / Investment × 100%',
  learningResources: 'Learning Resources',
  recommendedReading: 'Recommended Reading',
  bookRecommendations: 'Books to enhance your real estate investment knowledge',
  intelligentInvestorRealEstate: 'The Intelligent Investor in Real Estate',
  intelligentInvestorDescription: 'The definitive guide to value investing in real estate',
  realEstateFinancialAnalysis: 'Real Estate Financial Analysis',
  financialAnalysisBookDescription: 'Advanced methods for analyzing potential real estate investments',
  completeGuidePropertyManagement: 'The Complete Guide to Property Management',
  propertyManagementBookDescription: 'Strategies for effective property management and tenant relations',
  taxStrategiesRealEstateInvestors: 'Tax Strategies for Real Estate Investors',
  taxStrategiesBookDescription: 'Legal methods to minimize taxes and maximize returns',
  onlineCourses: 'Online Courses',
  expandYourKnowledge: 'Expand your real estate investment knowledge',
  realEstateInvestmentMasterclass: 'Real Estate Investment Masterclass',
  masterclassDescription: 'A comprehensive course covering all aspects of real estate investing',
  propertyAnalysisWorkshop: 'Property Analysis Workshop',
  analysisWorkshopDescription: 'Learn to analyze properties like a professional investor',
  realEstateMarketResearch: 'Real Estate Market Research',
  marketResearchCourseDescription: 'How to identify promising markets and neighborhoods',
  learnMore: 'Learn More',
  
  // Calculator related
  realEstateInvestmentCalculator: 'Real Estate Investment Calculator',
  analyzePropertyInvestments: 'Analyze potential property investments',
  returns: 'Returns',
  projection: 'Projection',
  propertyValue: 'Property Value',
  downPayment: 'Down Payment',
  ofPropertyValue: 'of property value',
  interestRate: 'Interest Rate',
  loanTerm: 'Loan Term',
  years: 'years',
  month: 'month',
  monthlyRent: 'Monthly Rent',
  resetToDefaults: 'Reset to Defaults',
  mortgageCalculation: 'Mortgage Calculation',
  loanAmount: 'Loan Amount',
  totalLoanCost: 'Total Loan Cost',
  totalInterestPaid: 'Total Interest Paid',
  investmentReturns: 'Investment Returns',
  totalInvestment: 'Total Investment',
  netOperatingIncome: 'Net Operating Income',
  breakEvenPoint: 'Break-even Point',
  notProfitable: 'Not profitable',
  year: 'Year',
  assumptions: 'Assumptions',
  annually: 'annually',
  rentalGrowth: 'Rental Growth',
  expenseInflation: 'Expense Inflation',
  sellingCosts: 'Selling Costs',
  monthlyRentalIncome: 'Monthly Rental Income',
  vacancyLoss: 'Vacancy Loss',
  mortgagePayment: 'Mortgage Payment',

  // Portfolio simulator
  portfolioSimulator: "Portfolio Simulator",
  simulateInvestmentGrowth: "Simulate your investment portfolio growth",
  initialInvestment: "Initial Investment",
  annualContribution: "Annual Contribution",
  simulationPeriod: "Simulation Period",
  riskProfile: "Risk Profile",
  conservative: "Conservative",
  balanced: "Balanced",
  aggressive: "Aggressive",
  inflationRate: "Inflation Rate",
  runSimulation: "Run Simulation",
  exportResults: "Export Results",
  simulationResults: "Simulation Results",
  expectedReturnRate: "Expected Return Rate",
  perYear: "per year",
  finalValue: "Final Value",
  afterInflation: "after inflation",
  realValueToday: "real value today",
  inflationAdjusted: "Inflation Adjusted",
  realValue: "Real Value",
  portfolioPerformance: "Portfolio Performance",
  valueGrowth: "Value Growth",
  
  // New real estate specific translations
  rentalYieldCalculator: "Rental Yield Calculator",
  grossRentalYield: "Gross Rental Yield",
  netRentalYield: "Net Rental Yield",
  annualRentalIncome: "Annual Rental Income",
  operatingExpenses: "Operating Expenses",
  calculateYield: "Calculate Yield",
  proFormaAnalysis: "Pro Forma Analysis",
  debtCoverageRatio: "Debt Coverage Ratio",
  propertyTaxRate: "Property Tax Rate",
  maintenanceReserve: "Maintenance Reserve",
  propertyManagementFee: "Property Management Fee",
  annualExpenses: "Annual Expenses",
  netOperatingIncomeNOI: "Net Operating Income (NOI)",
  investmentMetrics: "Investment Metrics",
  wholesaleAnalysis: "Wholesale Analysis",
  acquisitionCosts: "Acquisition Costs",
  repairCosts: "Repair Costs",
  holdingCosts: "Holding Costs",
  sellingExpenses: "Selling Expenses",
  maxOfferPrice: "Maximum Offer Price",
  profitPotential: "Profit Potential",
  comparableProperties: "Comparable Properties",
  landlordTools: "Landlord Tools",
  leaseAgreement: "Lease Agreement",
  tenantScreening: "Tenant Screening",
  maintenanceTracker: "Maintenance Tracker",
  rentCollection: "Rent Collection",
  vacancyTracker: "Vacancy Tracker",
  propertyExpenses: "Property Expenses",
  
  // Real Estate Market Analysis
  marketTrends: "Market Trends",
  neighborhoodAnalysis: "Neighborhood Analysis",
  populationGrowth: "Population Growth",
  jobGrowth: "Job Growth",
  medianHomePrice: "Median Home Price",
  medianRent: "Median Rent",
  priceToRentRatio: "Price-to-Rent Ratio",
  
  // Real Estate Education
  residentialProperties: "Residential Properties",
  singleFamilyHomeDescription: "Houses designed for one family",
  commercialProperties: "Commercial Properties",
  commercialPropertiesDescription: "Properties used for business purposes",
  mixedUseProperties: "Mixed-Use Properties",
  mixedUsePropertiesDescription: "Properties combining residential and commercial spaces",
  industrialProperties: "Industrial Properties",
  industrialPropertiesDescription: "Properties used for manufacturing or distribution",
  land: "Land",
  landDescription: "Undeveloped property with various investment potentials",
  loanToValue: "Loan-to-Value",
  ltvDefinition: "The ratio of loan amount to property value, expressed as a percentage",
  amortization: "Amortization",
  amortizationDefinition: "The process of paying off a loan over time through regular payments",
  capRateDefinition: "Net operating income divided by property value",
  cashOnCashReturnDefinition: "Annual cash flow divided by total cash invested",
  roiDefinition: "Total return on investment including cash flow and appreciation",
  appreciationDefinition: "Increase in property value over time",
  
  // New investment strategy terms
  valueAddStrategy: "Value-Add Strategy",
  valueAddDescription: "Purchasing properties with issues to fix and increase value",
  wholesalingStrategy: "Wholesaling Strategy",
  wholesalingDescription: "Contracting to purchase properties and selling the contract to another buyer",
  syndication: "Syndication",
  syndicationDescription: "Pooling capital from multiple investors for larger properties",
  passiveInvestment: "Passive Investment",
  passiveInvestmentDescription: "Investing in real estate without active management",
  activeLandlording: "Active Landlording",
  activeLandlordingDescription: "Managing your own rental properties",
  propertyFlipping: "Property Flipping",
  propertyFlippingDescription: "Buying, renovating, and quickly reselling for profit",

  // Investment analysis tools and terms
  comparablesSalesApproach: "Comparable Sales Approach",
  incomeCashFlowApproach: "Income/Cash Flow Approach",
  replacementCostApproach: "Replacement Cost Approach",
  arv: "ARV (After Repair Value)",
  arvDescription: "The estimated value of a property after renovations are complete",
  forcedAppreciation: "Forced Appreciation",
  forcedAppreciationDescription: "Increasing property value through improvements",
  
  // Advanced calculator features
  leverageRatio: "Leverage Ratio",
  loanToValueRatio: "Loan-to-Value Ratio",
  breakEvenRatio: "Break-Even Ratio",
  netPresentValue: "Net Present Value (NPV)",
  internalRateOfReturn: "Internal Rate of Return (IRR)",
  grossRentMultiplier: "Gross Rent Multipliplier (GRM)",
  returnOnEquity: "Return on Equity (ROE)",
  returnOnInvestment: "Return on Investment (ROI)",
  
  // Tax terms
  depreciation: "Depreciation",
  depreciationDescription: "Tax deduction for the theoretical decline in property value",
  costSegregation: "Cost Segregation",
  costSegregationDescription: "Identifying personal property components for faster depreciation",
  section1031: "Section 1031 Exchange",
  section1031Description: "Tax-deferred exchange of like-kind properties",
  passiveActivity: "Passive Activity",
  passiveActivityDescription: "IRS classification for rental real estate activities",
  
  // Market analysis terms
  absorptionRate: "Absorption Rate",
  medianDaysOnMarket: "Median Days on Market",
  inventoryLevels: "Inventory Levels",
  rentToValueRatio: "Rent-to-Value Ratio",
  
  // What is gross rental yield
  whatIsGrossRentalYield: "What is Gross Rental Yield?",
  grossRentalYieldDescription: "Gross rental yield is the annual rental income divided by the property value, expressed as a percentage. It's a quick way to assess the potential profitability of a rental property.",
  
  // What is a good investment
  goodInvestmentDescription: "This property is a good investment based on the net rental yield.",
  averageInvestmentDescription: "This property is an average investment based on the net rental yield.",
  poorInvestmentDescription: "This property is a poor investment based on the net rental yield.",
  
  // Rental yield calculator
  analyzeRentalInvestmentReturns: "Analyze potential rental investment returns",
  grossYield: "Gross Yield",
  netYield: "Net Yield",
  
  // Export calculation
  exportCalculation: "Export Calculation",
  
  // Monthly cash flow - already defined above, so skipping this duplicate
  
  // Mortgage calculator
  calculateMortgagePayments: "Calculate mortgage payments",
  calculator: "Calculator",
  paymentBreakdown: "Payment Breakdown",
  amortizationSchedule: "Amortization Schedule",
  amortizationScheduleDescription: "View the amortization schedule for your mortgage",
  principal: "Principal",
  interest: "Interest",
  costBreakdown: "Cost Breakdown",
  mortgagePaymentExplained: "See how your mortgage payment is broken down",
  paymentDistribution: "Payment Distribution",
  principalPercentage: "Principal Percentage",
  interestPercentage: "Interest Percentage",
  mortgagePaymentNote: "This is an estimate only. Consult with a financial advisor for more information.",
  unlockAmortizationSchedule: "Unlock Amortization Schedule",
  
  // Tax planning
  optimizeTaxStrategyRealEstate: "Optimize your tax strategy for real estate",
  taxStrategies: "Tax Strategies",
  taxCalculator: "Tax Calculator",
  realEstateTaxCalculator: "Real Estate Tax Calculator",
  taxCalculatorDescription: "Calculate your real estate taxes",
  unlockTaxCalculator: "Unlock Tax Calculator",
  taxSavingOpportunities: "Tax Saving Opportunities",
  potentialTaxSavingsProperties: "Potential tax savings for your properties",
  depreciationOpportunity: "Depreciation Opportunity",
  potentialAnnualSavings: "Potential Annual Savings",
  reviewOpportunity: "Review Opportunity",
  section1031Opportunity: "Section 1031 Opportunity",
  potentialDeferredTax: "Potential Deferred Tax",
  
  // Due diligence
  comprehensiveDueDiligenceChecklist: "Comprehensive due diligence checklist",
  overallProgress: "Overall Progress",
  criticalItemsRemaining: "Critical Items Remaining",
  legal: "Legal",
  financial: "Financial",
  physical: "Physical",
  legalDueDiligence: "Legal Due Diligence",
  financialDueDiligence: "Financial Due Diligence",
  physicalDueDiligence: "Physical Due Diligence",
  addItem: "Add Item",
  view: "View",
  complete: "Complete",
  critical: "Critical",
  dueDiligenceTemplates: "Due Diligence Templates",
  singleFamilyTemplate: "Single Family Template",
  multiUnitTemplate: "Multi-Unit Template",
  commercialTemplate: "Commercial Template",
  
  // Property scanner
  propertyScanner: "Property Scanner",
  findUndervaluedProperties: "Find undervalued properties",
  locationOrZipCode: "Location or Zip Code",
  minCashFlow: "Min. Cash Flow",
  minCapRate: "Min. Cap Rate",
  priceRange: "Price Range",
  scanning: "Scanning",
  scanForProperties: "Scan for Properties",
  
  // Investment opportunities
  investmentOpportunities: "Investment Opportunities",
  latestDealsAndListings: "Latest deals and listings",
  hotDeal: "Hot Deal",
  price: "Price",
  viewDeal: "View Deal",
  viewMoreListings: "View More Listings",
  
  // Market analysis
  researchMarketsAndIdentifyOpportunities: "Research markets and identify opportunities",
  yearOverYear: "Year over Year",
  marketTrendsChart: "Market Trends Chart",
  propertyValuesTrendLast5Years: "Property values trend last 5 years",
  upgradeToAccessDetailedMarketData: "Upgrade to access detailed market data",
  unlockMarketData: "Unlock Market Data",
  listedProperties: "Listed Properties",
  monthsOfInventory: "Months of Inventory",
  marketActivityMetric: "Market Activity Metric",
  marketAbsorptionRate: "Market Absorption Rate", // Changed from duplicated 'absorptionRate' to 'marketAbsorptionRate'
  
  // Market analysis additional terms (no duplicates)
  accessDetailedNeighborhoodData: "Access detailed neighborhood data",
  unlockNeighborhoodData: "Unlock Neighborhood Data",
  demographicData: "Demographic Data",
  accessDemographicInsights: "Access demographic insights",
  unlockDemographicData: "Unlock Demographic Data",
  
  // AI Assistant
  aiInsights: "AI Insights",
  aiGeneratedPortfolioAnalysis: "AI-generated analysis of your portfolio",
  analyzingYourPortfolio: "Analyzing your portfolio",
  recommendedActions: "Recommended Actions",
  aiDisclaimer: "Disclaimer: AI-generated insights are for informational purposes only and should not be considered financial advice.",
  close: "Close",
  
  // Asset allocation
  assetAllocation: "Asset Allocation",
  assetAllocationDescription: "View your asset allocation",
  unlockAssetAllocation: "Unlock Asset Allocation",
  assetAllocationChart: "Asset Allocation Chart",
  breakdownByPropertyType: "Breakdown by property type",
  residential: "Residential",
  commercial: "Commercial",
  mixed: "Mixed",
  
  // Language settings translations
  languageSettings: "Language Settings",
  manageLanguagePreferences: "Manage language preferences and translation status",
  currentLanguage: "Current Language",
  activeLanguageDescription: "Currently selected language for the application",
  interfaceLanguage: "Interface Language",
  interfaceLanguageDescription: "The language used for application elements",
  interfaceLanguageInfo: "Select your preferred language for the application interface",
  switchLanguageDescription: "Switch between available languages",
  languagePreferences: "Language Preferences",
  languagePreferencesDescription: "Advanced options for language preferences",
  languageChanged: "Language Changed",
  displayLanguageChangedTo: "Display language changed to"
};

// German translations
const germanTranslations = {
  // Navigation
  dashboard: 'Dashboard',
  properties: 'Immobilien',
  investorDashboard: 'Investor Dashboard',
  calculators: 'Rechner',
  education: 'Bildung',
  settings: 'Einstellungen',
  profile: 'Profil',
  main: 'Hauptmenü',
  account: 'Konto',
  portfolio: 'Portfolio',
  marketAnalysis: 'Marktanalyse',
  financing: 'Finanzierung',
  taxPlanning: 'Steuerplanung',
  dueDiligence: 'Sorgfaltspflicht',

  // Portfolio dashboard
  investmentPortfolio: 'Anlageportfolio',
  trackYourRealEstateInvestments: 'Verfolgen und analysieren Sie Ihre Immobilieninvestitionen',
  propertyPerformance: 'Immobilienperformance',
  compareYourInvestments: 'Vergleichen Sie die Performance Ihrer Investitionen',
  cashFlow: 'Cashflow',
  roi: 'ROI',
  appreciation: 'Wertsteigerung',
  enhancedAnalytics: 'Erweiterte Analysen',
  enhancedAnalyticsDescription: 'Schalten Sie erweiterte Analysen mit detaillierten Immobilien-Performance-Metriken frei',
  marketInsights: 'Markteinblicke',
  marketInsightsDescription: 'Verbinden Sie sich mit Marktdaten, um zu sehen, wie Ihre Immobilien im Vergleich zu lokalen Trends abschneiden',
  portfolioAlerts: 'Portfolio-Benachrichtigungen',
  investmentGoals: 'Anlageziele',
  unlockAnalytics: 'Erweiterte Analysen freischalten',
  viewDetailed: 'Detaillierte Analyse anzeigen',
  connectMarketData: 'Marktdaten verbinden',

  // Property metrics
  totalValue: 'Gesamtwert',
  equity: 'Eigenkapital',
  totalProperties: 'Gesamtanzahl der Immobilien',
  monthlyCashFlow: 'Monatlicher Cashflow',
  annualCashFlow: 'Jährlicher Cashflow',
  cashOnCashReturn: 'Cash-on-Cash Rendite',
  capRate: 'Kapitalisierungsrate',
  portfolioEquity: 'Portfolio-Eigenkapital',
  
  // Onboarding and user profile
  welcomeToPropertyFlow: 'Willkommen bei PropertyFlow',
  onboardingWelcomeDescription: 'Lassen Sie uns Ihre Erfahrung personalisieren',
  welcomeToPropertyFlowAdvisor: 'Willkommen beim PropertyFlow Berater',
  yourPersonalRealEstateInvestmentCompanion: 'Ihr persönlicher Begleiter für Immobilieninvestitionen',
  yourName: 'Ihr Name',
  enterYourName: 'Namen eingeben',
  chooseLanguage: 'Sprache wählen',
  investmentMarket: 'Investmentmarkt',
  whereDoYouPlanToInvest: 'Wo planen Sie zu investieren?',
  selectAMarket: 'Markt auswählen',
  germany: 'Deutschland',
  austria: 'Österreich',
  switzerland: 'Schweiz',
  france: 'Frankreich',
  unitedStates: 'Vereinigte Staaten',
  canada: 'Kanada',
  otherMarket: 'Andere Märkte',
  yourExperienceLevel: 'Ihr Erfahrungslevel',
  tellUsAboutYourExperience: 'Teilen Sie uns Ihre Erfahrung mit Immobilieninvestitionen mit',
  beginner: 'Anfänger',
  intermediate: 'Fortgeschritten',
  advanced: 'Erfahren',
  expert: 'Experte',
  whatAreYourPrimaryInvestmentGoals: 'Was sind Ihre wichtigsten Anlageziele?',
  propertyPreferences: 'Immobilienpräferenzen',
  whatTypesOfPropertiesInterestYou: 'Welche Arten von Immobilien interessieren Sie?',
  yourInterests: 'Ihre Interessen',
  whatTopicsInterestYou: 'Welche Themen interessieren Sie?',
  allSet: 'Alles bereit',
  yourProfileIsReady: 'Ihr Profil ist fertig',
  skip: 'Überspringen',
  back: 'Zurück',
  next: 'Weiter',
  complete: 'Abschließen',
  profileCompleted: 'Profil abgeschlossen',
  weveCustomizedYourExperience: 'Wir haben Ihre Erfahrung angepasst',
  setupComplete: 'Einrichtung abgeschlossen',
  yourPreferencesHaveBeenSaved: 'Ihre Einstellungen wurden gespeichert',

  // Investment interests and goals
  'passive-income': 'Passives Einkommen',
  'capital-growth': 'Kapitalwachstum',
  'portfolio-diversification': 'Portfolio-Diversifizierung',
  'tax-benefits': 'Steuervorteile',
  'residential': 'Wohnimmobilien',
  'commercial': 'Gewerbeimmobilien',
  'industrial': 'Industrieimmobilien',
  'land': 'Grundstücke',
  'vacation-rental': 'Ferienimmobilien',
  'market-analysis': 'Marktanalyse',
  'property-management': 'Immobilienverwaltung',
  'financing': 'Finanzierung',
  'tax-strategies': 'Steuerstrategien',
  'renovation': 'Renovierung',
  'legal': 'Rechtliches',

  // Market explorer
  marketExplorer: 'Marktexplorer',
  researchMarketsAndIdentifyOpportunities: 'Märkte recherchieren und Chancen identifizieren',
  overview: 'Überblick',
  trends: 'Trends',
  neighborhoodAnalysis: 'Nachbarschaftsanalyse',
  investmentOpportunities: 'Investitionsmöglichkeiten',
  Market: 'Markt',
  Global: 'Global',

  // General UI elements
  welcome: 'Willkommen',
  welcomeBack: 'Willkommen zurück',
  toThe: 'zum',
  continueMakingSmartInvestments: 'Treffen Sie weiterhin smarte Investitionsentscheidungen mit unseren Tools',
  accessComprehensiveInvestmentTools: 'Zugang zu umfassenden Tools zur Analyse und Optimierung Ihrer Investitionen',
  completeInvestmentToolsuite: 'Komplettes Set an Tools für Immobilieninvestoren',
  languageChanged: 'Sprache geändert',
  displayLanguageChangedTo: 'Anzeigesprache geändert zu'
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<string>('en');
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({
    en: englishTranslations,
    de: germanTranslations
  });

  const updateTranslations = (newTranslations: any) => {
    setTranslations(prev => {
      const updatedTranslations = { ...prev };
      
      // For each language key in the translations
      Object.keys(newTranslations).forEach(translationKey => {
        // For each language 
        Object.keys(newTranslations[translationKey]).forEach(lang => {
          // Create language object if it doesn't exist
          if (!updatedTranslations[lang]) {
            updatedTranslations[lang] = {};
          }
          // Add translation
          updatedTranslations[lang][translationKey] = newTranslations[translationKey][lang];
        });
      });
      
      return updatedTranslations;
    });
  };

  // Translate function
  const t = (key: string, vars?: { [key: string]: string | number }): string => {
    // Get the current language translations
    const currentLangTranslations = translations[language] || {};
    const englishFallback = translations['en'] || {};
    
    // Get the translation or fall back to English or the key itself
    let translation = currentLangTranslations[key] || englishFallback[key] || key;
    
    // Replace variables if provided
    if (vars) {
      Object.entries(vars).forEach(([varKey, value]) => {
        translation = translation.replace(new RegExp(`{{${varKey}}}`, 'g'), String(value));
      });
    }
    
    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translations, updateTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
