
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Calculator, FileText, Info } from 'lucide-react';
import GrunderwerbsteuerRechner from '@/components/german/GrunderwerbsteuerRechner';
import GermanAfaCalculator from '@/components/german/GermanAfaCalculator';
import GermanPropertyRecommendations from '@/components/german/GermanPropertyRecommendations';
import RelatedGermanTools from '@/components/german/RelatedGermanTools';
import GermanRealEstateGlossary from '@/components/language/GermanRealEstateGlossary';

const DeutscheImmobilienTools: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          {language === 'de' ? 'Deutsche Immobilien-Tools' : 'German Real Estate Tools'}
        </h1>
        <p className="text-muted-foreground">
          {language === 'de'
            ? 'Spezialisierte Tools für den deutschen Immobilienmarkt'
            : 'Specialized tools for the German real estate market'}
        </p>
      </div>

      <Tabs defaultValue="calculators" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calculators">
            <Calculator className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Rechner' : 'Calculators'}
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Building className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Empfehlungen' : 'Recommendations'}
          </TabsTrigger>
          <TabsTrigger value="glossary">
            <FileText className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Fachbegriffe' : 'Glossary'}
          </TabsTrigger>
          <TabsTrigger value="info">
            <Info className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Info' : 'Info'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculators">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'Grunderwerbsteuer-Rechner' : 'Real Estate Transfer Tax Calculator'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Berechnen Sie die Grunderwerbsteuer für verschiedene Bundesländer'
                    : 'Calculate the real estate transfer tax for different German states'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GrunderwerbsteuerRechner />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  {language === 'de' ? 'AfA-Rechner' : 'Depreciation Calculator'}
                </CardTitle>
                <CardDescription>
                  {language === 'de'
                    ? 'Berechnen Sie die steuerliche Abschreibung für Immobilien'
                    : 'Calculate the tax depreciation for real estate properties'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GermanAfaCalculator />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Immobilienempfehlungen' : 'Property Recommendations'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Personalisierte Immobilienvorschläge für den deutschen Markt'
                  : 'Personalized property suggestions for the German market'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GermanPropertyRecommendations />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="glossary">
          <GermanRealEstateGlossary />
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>
                {language === 'de' ? 'Deutsche Immobilieninformationen' : 'German Real Estate Information'}
              </CardTitle>
              <CardDescription>
                {language === 'de'
                  ? 'Wichtige Informationen zum deutschen Immobilienmarkt'
                  : 'Important information about the German real estate market'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RelatedGermanTools />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeutscheImmobilienTools;
