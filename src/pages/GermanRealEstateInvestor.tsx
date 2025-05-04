
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Building,
  Euro,
  Calculator,
  Map,
  FileText,
  BarChart,
  Shield,
  Globe,
  Briefcase,
  LineChart,
  PieChart
} from 'lucide-react';

// Feature list for German real estate investors
const featuresList = [
  {
    id: 'grunderwerbsteuer',
    titleDe: 'Grunderwerbsteuer-Rechner',
    titleEn: 'Transfer Tax Calculator',
    descriptionDe: 'Berechnung der Grunderwerbsteuer für verschiedene Bundesländer',
    descriptionEn: 'Calculate property transfer tax for different German states',
    icon: <Euro className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=grunderwerbsteuer'
  },
  {
    id: 'mietkauf',
    titleDe: 'Mietkauf-Rechner',
    titleEn: 'Rent-to-Own Calculator',
    descriptionDe: 'Analyse von Mietkauf-Modellen für Immobilien',
    descriptionEn: 'Analysis of rent-to-own models for properties',
    icon: <Building className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=mietkauf'
  },
  {
    id: 'afa',
    titleDe: 'AfA-Rechner',
    titleEn: 'Depreciation Calculator',
    descriptionDe: 'Berechnung der steuerlichen Absetzung für Immobilien',
    descriptionEn: 'Calculate tax depreciation for real estate',
    icon: <Calculator className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=afa'
  },
  {
    id: 'mietspiegel',
    titleDe: 'Mietspiegel-Analyse',
    titleEn: 'Rent Index Analysis',
    descriptionDe: 'Vergleich von Mietpreisen mit lokalen Mietspiegeln',
    descriptionEn: 'Compare rental prices with local rent indices',
    icon: <Map className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=mietspiegel'
  },
  {
    id: 'energieausweis',
    titleDe: 'Energieausweis-Analyse',
    titleEn: 'Energy Certificate Analysis',
    descriptionDe: 'Analyse und Vergleich von Energieausweisen',
    descriptionEn: 'Analysis and comparison of energy certificates',
    icon: <FileText className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=energieausweis'
  },
  {
    id: 'nebenkosten',
    titleDe: 'Nebenkosten-Rechner',
    titleEn: 'Additional Costs Calculator',
    descriptionDe: 'Berechnung von Nebenkosten für Mietobjekte',
    descriptionEn: 'Calculate additional costs for rental properties',
    icon: <Calculator className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=nebenkosten'
  },
  {
    id: 'kfw',
    titleDe: 'KfW-Förderassistent',
    titleEn: 'KfW Funding Assistant',
    descriptionDe: 'Identifizierung von KfW-Fördermöglichkeiten',
    descriptionEn: 'Identify KfW funding opportunities',
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=kfw'
  },
  {
    id: 'mietpreisbremse',
    titleDe: 'Mietpreisbremse-Prüfer',
    titleEn: 'Rent Control Compliance Tool',
    descriptionDe: 'Überprüfung der Einhaltung der Mietpreisbremse',
    descriptionEn: 'Check compliance with German rent control regulations',
    icon: <Shield className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=mietpreisbremse'
  },
  {
    id: 'steueroptimierung',
    titleDe: 'Steueroptimierung',
    titleEn: 'Tax Optimization',
    descriptionDe: 'Optimierung von Immobilieninvestitionen unter deutschem Steuerrecht',
    descriptionEn: 'Optimize real estate investments under German tax law',
    icon: <PieChart className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=steueroptimierung'
  },
  {
    id: 'renditerechner',
    titleDe: 'Renditerechner',
    titleEn: 'Yield Calculator',
    descriptionDe: 'Berechnung der Rendite für verschiedene Immobilientypen',
    descriptionEn: 'Calculate yield for different property types',
    icon: <LineChart className="h-8 w-8 text-primary" />,
    path: '/deutsche-immobilien-tools?tab=renditerechner'
  }
];

const GermanRealEstateInvestor: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {language === 'de' ? 'Deutsche Immobilieninvestor-Tools' : 'German Real Estate Investor Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Spezialisierte Tools für den deutschen Immobilienmarkt'
            : 'Specialized tools for the German real estate market'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresList.map((feature) => (
          <Card key={feature.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mb-2">{feature.icon}</div>
              <CardTitle>{language === 'de' ? feature.titleDe : feature.titleEn}</CardTitle>
              <CardDescription>
                {language === 'de' ? feature.descriptionDe : feature.descriptionEn}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(feature.path)}
              >
                {language === 'de' ? 'Öffnen' : 'Open'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GermanRealEstateInvestor;
