
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useUserPreferences } from './UserPreferencesContext';
import { detectBrowserLanguage, isLanguageSupported, getBestMatchLanguage } from '@/utils/languageDetector';

// Define the language types
export type SupportedLanguage = 'en' | 'de' | 'fr' | 'es' | 'it';

// Define the interface for language information
export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  enabled: boolean;
  nativeName: string;
}

// Available languages in the application
export const availableLanguages: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', enabled: true, nativeName: 'English' },
  { code: 'de', name: 'German', flag: '🇩🇪', enabled: true, nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', flag: '🇫🇷', enabled: true, nativeName: 'Français' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', enabled: false, nativeName: 'Español' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', enabled: false, nativeName: 'Italiano' }
];

// Interface for the LanguageContext
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string, options?: { [key: string]: any }) => string;
  availableLanguages: LanguageInfo[];
  translations: Record<SupportedLanguage, Record<string, string>>;
  updateTranslations: (newTranslations: Record<string, Record<SupportedLanguage, string>>) => void;
}

// Default context
const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
  availableLanguages,
  translations: {} as Record<SupportedLanguage, Record<string, string>>,
  updateTranslations: () => {}
});

// Interface for LanguageProvider props
interface LanguageProviderProps {
  children: ReactNode;
}

// Language translations
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // General UI
    "appName": "PropertyFlow",
    "dashboard": "Dashboard",
    "investorDashboard": "Investor Dashboard",
    "properties": "Properties",
    "settings": "Settings",
    "profile": "Profile",
    "logout": "Log Out",
    "login": "Log In",
    "register": "Register",
    "welcomeTo": "Welcome to PropertyFlow",
    "welcomeBack": "Welcome Back",
    "menu": "Menu",
    "close": "Close",
    "save": "Save",
    "cancel": "Cancel",
    "edit": "Edit",
    "delete": "Delete",
    "remove": "Remove",
    "add": "Add",
    "search": "Search",
    "filter": "Filter",
    "sort": "Sort",
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "warning": "Warning",
    "info": "Information",
    "confirm": "Confirm",
    "continue": "Continue",
    "back": "Back",
    "next": "Next",
    "finish": "Finish",
    "skip": "Skip",
    "goBack": "Go Back",
    "moreInfo": "More Information",
    "learnMore": "Learn More",
    "showMore": "Show More",
    "showLess": "Show Less",
    "viewAll": "View All",
    "viewDetails": "View Details",
    "createNew": "Create New",
    "saveChanges": "Save Changes",
    "discardChanges": "Discard Changes",
    "update": "Update",
    "apply": "Apply",
    "reset": "Reset",
    "resetAll": "Reset All",
    "clearAll": "Clear All",
    "selectAll": "Select All",
    "selectNone": "Select None",
    "yes": "Yes",
    "no": "No",
    "or": "Or",
    "and": "And",
    "none": "None",
    "notApplicable": "Not applicable",
    "notAvailable": "Not available",
    "all": "All",
    "other": "Other",
    "help": "Help",
    "feedback": "Feedback",
    "support": "Support",
    "contactUs": "Contact Us",
    "privacyPolicy": "Privacy Policy",
    "termsOfService": "Terms of Service",
    "cookiePolicy": "Cookie Policy",
    "by": "By",
    "today": "Today",
    "yesterday": "Yesterday",
    "tomorrow": "Tomorrow",
    "now": "Now",
    "never": "Never",
    "always": "Always",
    "sometimes": "Sometimes",

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
    interestRateChangesCouldImpact: 'Interest rate changes could impact your investment portfolio',
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
    displayLanguageChangedTo: "Display language changed to",
    
    // Market-specific terms
    keyMarketMetrics: "Key Market Metrics",
    averagePrice: "Average Price",
    averageRent: "Average Rent",
    yieldRange: "Yield Range",
    annualGrowth: "Annual Growth",
    keyInsights: "Key Insights",
    importantFactorsToConsider: "Important factors to consider",
    propertiesInMarket: "Properties in {{market}} market",
    expectedYield: "Expected Yield",
    findProperties: "Find Properties",
    realEstateMarketTrends: "Real Estate Market Trends",
    marketTrendsVisualization: "Market Trends Visualization", 
    trendsDescription: "Track market trends and performance data",
    analyzeNeighborhoods: "Analyze neighborhoods and local trends",
    identifyInvestmentOpportunities: "Identify investment opportunities in this market",
    
    // New Features
    autoDetectLanguage: "Auto-detect language",
    languageDetected: "Language detected",
    browserLanguageDetected: "Browser language detected",
    marketSpecificFeatures: "Market-specific features",
    marketSpecificTools: "Market-specific tools",
    viewMarketSpecificTools: "View Market-specific Tools",
    showBrowserLanguage: "Use browser language",
    testAutomation: "Test Automation",
    runTests: "Run Tests",
    testSucceeded: "Test succeeded",
    testFailed: "Test failed",
    propertyAnalytics: "Property Analytics",
    dataVisualization: "Data Visualization",
    yearlyComparison: "Yearly Comparison",
    quarterlyPerformance: "Quarterly Performance",
    marketComparison: "Market Comparison",
    forecastedGrowth: "Forecasted Growth",
    investmentCalculatorEntrance: "ROI Calculator",
    investmentCalculatorMsg: "Calculate potential ROI for any property",
    propertyManagement: "Property Management",
    propertyManagementMsg: "Manage your properties efficiently",
    cashflowCalculator: "Cash Flow Analysis",
    cashflowCalculatorMsg: "Optimize property cash flow",
    portfolioTracker: "Portfolio Tracker",
    portfolioTrackerMsg: "Monitor all your investments",
    scheduleTasks: "Property Schedule",
    scheduleTasksMsg: "Manage deadlines and reminders",
    viewMore: "View More",
    visualSelection: "Visual Selection",
    dropdownSelection: "Dropdown Selection",
    selected: "Selected",
    selectYourMarket: "Select your market",
    currentlySelected: "Currently Selected",
    setAsPreferredMarket: "Set as Preferred Market",
    currentMarket: "Current Market",
    exploreMarkets: "Explore Markets",
    marketPreferenceUpdated: "Market preference updated successfully",
    selectMetric: "Select Metric",
    selectChartType: "Select Chart Type",
    lineChart: "Line Chart",
    areaChart: "Area Chart",
    barChart: "Bar Chart",
    historicalData: "Historical Data",
    projectedData: "Projected Data",
    historicalAndProjectedValues: "Historical and projected values",
    propertyValueTrend: "Property Value Trend",
    rentalIncomeTrend: "Rental Income Trend",
    netIncomeTrend: "Net Income Trend",
    chart: "Chart",
    table: "Table",
    mortgageAmortizationChart: "Mortgage Amortization Chart",
    mortgageAmortizationDescription: "Visualize your mortgage payments over time",
    balance: "Balance",
    payments: "Payments",
    distribution: "Distribution",
    interest: "Interest",
    principal: "Principal",
    remainingBalance: "Remaining Balance",
    firstPaymentBreakdown: "First Payment Breakdown",
    firstPaymentDescription: "Breakdown of your first mortgage payment",
    mortgageCalculatorDisclaimer: "This is a simulation based on the information you provide. Actual results may vary.",
    exportAmortizationSchedule: "Export Schedule",
    loanAmount: "Loan Amount",
    overview_main: "Overview"
  },
  
  de: {
    // General UI
    "appName": "PropertyFlow",
    "dashboard": "Dashboard",
    "investorDashboard": "Investoren Dashboard",
    "properties": "Immobilien",
    "settings": "Einstellungen",
    "profile": "Profil",
    "logout": "Abmelden",
    "login": "Anmelden",
    "register": "Registrieren",
    "welcomeTo": "Willkommen bei PropertyFlow",
    "welcomeBack": "Willkommen zurück",
    "menu": "Menü",
    "close": "Schließen",
    "save": "Speichern",
    "cancel": "Abbrechen",
    "edit": "Bearbeiten",
    "delete": "Löschen",
    "remove": "Entfernen",
    "add": "Hinzufügen",
    "search": "Suchen",
    "filter": "Filter",
    "sort": "Sortieren",
    "loading": "Wird geladen...",
    "error": "Fehler",
    "success": "Erfolg",
    "warning": "Warnung",
    "info": "Information",
    "confirm": "Bestätigen",
    "continue": "Fortfahren",
    "back": "Zurück",
    "next": "Weiter",
    "finish": "Fertigstellen",
    "skip": "Überspringen",
    "goBack": "Zurück gehen",
    "moreInfo": "Mehr Informationen",
    "learnMore": "Mehr erfahren",
    "showMore": "Mehr anzeigen",
    "showLess": "Weniger anzeigen",
    "viewAll": "Alle anzeigen",
    "viewDetails": "Details anzeigen",
    "createNew": "Neu erstellen",
    "saveChanges": "Änderungen speichern",
    "discardChanges": "Änderungen verwerfen",
    "update": "Aktualisieren",
    "apply": "Anwenden",
    "reset": "Zurücksetzen",
    "resetAll": "Alle zurücksetzen",
    "clearAll": "Alle löschen"
  },
  
  fr: {
    // Add a minimal set of French translations
    "dashboard": "Tableau de bord",
    "settings": "Paramètres"
  },
  
  es: {
    // Add a minimal set of Spanish translations
    "dashboard": "Panel de control",
    "settings": "Configuración"
  },
  
  it: {
    // Add a minimal set of Italian translations
    "dashboard": "Dashboard",
    "settings": "Impostazioni"
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { userPreferences } = useUserPreferences();
  const supportedLanguageCodes = availableLanguages.map(lang => lang.code);
  
  // Initialize language from user preferences or browser language
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    // First check user preferences
    if (userPreferences.language && isLanguageSupported(userPreferences.language, supportedLanguageCodes)) {
      return userPreferences.language as SupportedLanguage;
    }
    
    // Then fallback to browser language detection
    return getBestMatchLanguage(supportedLanguageCodes) as SupportedLanguage;
  });
  
  // Extend translations state
  const [translationsState, setTranslationsState] = useState(translations);
  
  // Set language with side effects
  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    // Store in localStorage for persistence
    localStorage.setItem('preferredLanguage', lang);
    // Update user preferences (if we have access to that context)
    if (userPreferences) {
      // This assumes the UserPreferencesContext has an updatePreferences method
      // If not, this should be adjusted accordingly
      // updateUserPreferences({ ...userPreferences, language: lang });
    }
  };

  // Load language from localStorage on component mount
  useEffect(() => {
    const storedLang = localStorage.getItem('preferredLanguage') as SupportedLanguage | null;
    if (storedLang && isLanguageSupported(storedLang, supportedLanguageCodes)) {
      setLanguageState(storedLang);
    }
  }, [supportedLanguageCodes]);

  // Translation function
  const t = (key: string, options?: { [key: string]: any }): string => {
    // Get translation from current language
    let translation = translationsState[language]?.[key];
    
    // Fallback to English if translation doesn't exist
    if (!translation && language !== 'en') {
      translation = translationsState.en?.[key];
    }
    
    // If still no translation, return the key itself as fallback
    if (!translation) {
      return key;
    }
    
    // Handle interpolation if options provided
    if (options) {
      return Object.keys(options).reduce(
        (acc, optionKey) => acc.replace(new RegExp(`{{${optionKey}}}`, 'g'), options[optionKey]),
        translation
      );
    }
    
    return translation;
  };

  // Function to update translations (used by LanguageSwitcher)
  const updateTranslations = (newTranslations: Record<string, Record<SupportedLanguage, string>>) => {
    const updatedTranslations = { ...translationsState };
    
    // For each key in newTranslations
    Object.keys(newTranslations).forEach(key => {
      // For each language in that key
      Object.keys(newTranslations[key]).forEach(langCode => {
        const lang = langCode as SupportedLanguage;
        
        // Create language object if it doesn't exist
        if (!updatedTranslations[lang]) {
          updatedTranslations[lang] = {};
        }
        
        // Update translation
        updatedTranslations[lang][key] = newTranslations[key][lang];
      });
    });
    
    setTranslationsState(updatedTranslations);
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t, 
      availableLanguages,
      translations: translationsState,
      updateTranslations
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
