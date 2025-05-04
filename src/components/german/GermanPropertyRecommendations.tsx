
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building, Map, Landmark, PiggyBank, Euro } from 'lucide-react';

interface GermanPropertyRecommendation {
  id: string;
  titleDe: string;
  titleEn: string;
  descriptionDe: string;
  descriptionEn: string;
  typeDe: string;
  typeEn: string;
  location: string;
  price: number;
  yield: number;
  potentialDe: string;
  potentialEn: string;
}

const sampleRecommendations: GermanPropertyRecommendation[] = [
  {
    id: 'prop1',
    titleDe: 'Mehrfamilienhaus in Berlin-Neukölln',
    titleEn: 'Multi-family house in Berlin-Neukölln',
    descriptionDe: 'Solides Mehrfamilienhaus mit 8 Einheiten in aufstrebendem Bezirk',
    descriptionEn: 'Solid multi-family house with 8 units in an up-and-coming district',
    typeDe: 'Mehrfamilienhaus',
    typeEn: 'Multi-family house',
    location: 'Berlin',
    price: 1750000,
    yield: 4.2,
    potentialDe: 'Mieterhöhungspotential durch Modernisierung',
    potentialEn: 'Rent increase potential through modernization'
  },
  {
    id: 'prop2',
    titleDe: 'Sanierungsobjekt in Leipzig',
    titleEn: 'Renovation property in Leipzig',
    descriptionDe: 'Altbau mit Entwicklungspotenzial im Zentrum von Leipzig',
    descriptionEn: 'Old building with development potential in the center of Leipzig',
    typeDe: 'Sanierungsobjekt',
    typeEn: 'Renovation project',
    location: 'Leipzig',
    price: 520000,
    yield: 6.8,
    potentialDe: 'Hohe AfA-Abschreibung möglich',
    potentialEn: 'High depreciation possible'
  },
  {
    id: 'prop3',
    titleDe: 'Neubauwohnung in München',
    titleEn: 'New apartment in Munich',
    descriptionDe: 'Exklusive 2-Zimmer-Wohnung in München-Schwabing',
    descriptionEn: 'Exclusive 2-room apartment in Munich-Schwabing',
    typeDe: 'Eigentumswohnung',
    typeEn: 'Condominium',
    location: 'München',
    price: 650000,
    yield: 3.5,
    potentialDe: 'Wertsteigerungspotential durch hohe Nachfrage',
    potentialEn: 'Value appreciation potential due to high demand'
  }
];

export const GermanPropertyRecommendations: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {language === 'de' ? 'Deutsche Immobilienempfehlungen' : 'German Property Recommendations'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleRecommendations.map(property => (
          <Card key={property.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                {language === 'de' ? property.titleDe : property.titleEn}
              </CardTitle>
              <CardDescription>
                {language === 'de' ? property.typeDe : property.typeEn} • {property.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <p className="text-sm">
                  {language === 'de' ? property.descriptionDe : property.descriptionEn}
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Euro className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">
                      {property.price.toLocaleString(language === 'de' ? 'de-DE' : 'en-US')} €
                    </span>
                  </div>
                  <div className="flex items-center">
                    <PiggyBank className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="font-medium">{property.yield.toFixed(1)}% {language === 'de' ? 'Rendite' : 'Yield'}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm mt-2">
                  <Landmark className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {language === 'de' ? property.potentialDe : property.potentialEn}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full text-sm">
                {language === 'de' ? 'Details anzeigen' : 'View details'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
