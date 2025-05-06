
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home, Building, Calendar, Map } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useLanguage();

  // Mock data for the property detail
  const property = {
    id: id || '1',
    name: 'Musterstraße 123',
    type: language === 'de' ? 'Mehrfamilienhaus' : 'Apartment Building',
    address: 'Musterstraße 123, 10115 Berlin',
    purchase_date: '2022-04-15',
    purchase_price: 450000,
    current_value: 520000,
    monthly_rent: 2800,
    yearly_return: 7.4,
    size: 120,
    year_built: 2015,
    last_renovation: 2020,
    bedrooms: 3,
    bathrooms: 2,
    parking_spaces: 1,
    description: language === 'de' 
      ? 'Eine moderne Immobilie in einer begehrten Lage mit ausgezeichneter Verkehrsanbindung.'
      : 'A modern property in a sought-after location with excellent transport links.',
    features: [
      language === 'de' ? 'Balkon' : 'Balcony',
      language === 'de' ? 'Aufzug' : 'Elevator',
      language === 'de' ? 'Fußbodenheizung' : 'Underfloor heating',
      language === 'de' ? 'Tiefgarage' : 'Underground parking'
    ],
    images: ['/placeholder-property.jpg', '/placeholder-property-2.jpg']
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link to="/properties">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToProperties')}
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">{property.name}</h1>
          <p className="text-muted-foreground">{property.address}</p>
        </div>
        <div className="hidden md:flex space-x-2">
          <Button variant="outline">
            {language === 'de' ? 'Bearbeiten' : 'Edit'}
          </Button>
          <Button variant="default">
            {language === 'de' ? 'Verwalten' : 'Manage'}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <div className="bg-muted rounded-lg h-[300px] md:h-[400px] flex items-center justify-center mb-4">
            <Building className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {property.images.map((_, index) => (
              <div key={index} className="bg-muted rounded-lg h-24 flex items-center justify-center">
                <Building className="h-6 w-6 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Übersicht' : 'Overview'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Kaufpreis' : 'Purchase Price'}</span>
                <span className="font-medium">{property.purchase_price.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Aktueller Wert' : 'Current Value'}</span>
                <span className="font-medium">{property.current_value.toLocaleString()} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Monatliche Miete' : 'Monthly Rent'}</span>
                <span className="font-medium">{property.monthly_rent} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Jährliche Rendite' : 'Yearly Return'}</span>
                <span className="font-medium">{property.yearly_return}%</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Größe' : 'Size'}</span>
                <span className="font-medium">{property.size} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Baujahr' : 'Year Built'}</span>
                <span className="font-medium">{property.year_built}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Letzte Renovierung' : 'Last Renovation'}</span>
                <span className="font-medium">{property.last_renovation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Schlafzimmer' : 'Bedrooms'}</span>
                <span className="font-medium">{property.bedrooms}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{language === 'de' ? 'Badezimmer' : 'Bathrooms'}</span>
                <span className="font-medium">{property.bathrooms}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                {language === 'de' ? 'Finanzen anzeigen' : 'View Financials'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="details" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="details">{language === 'de' ? 'Details' : 'Details'}</TabsTrigger>
          <TabsTrigger value="documents">{language === 'de' ? 'Dokumente' : 'Documents'}</TabsTrigger>
          <TabsTrigger value="history">{language === 'de' ? 'Verlauf' : 'History'}</TabsTrigger>
          <TabsTrigger value="analysis">{language === 'de' ? 'Analyse' : 'Analysis'}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Beschreibung' : 'Description'}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{property.description}</p>
              
              <h3 className="font-semibold mt-6 mb-2">{language === 'de' ? 'Ausstattungsmerkmale' : 'Features'}</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Dokumente' : 'Documents'}</CardTitle>
              <CardDescription>{language === 'de' ? 'Alle mit dieser Immobilie verbundenen Dokumente' : 'All documents associated with this property'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>{language === 'de' ? 'Keine Dokumente vorhanden' : 'No documents available'}</p>
                <Button className="mt-4" variant="outline">
                  {language === 'de' ? 'Dokument hochladen' : 'Upload Document'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Verlauf' : 'History'}</CardTitle>
              <CardDescription>{language === 'de' ? 'Verlauf und Ereignisse' : 'History and events'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'de' ? 'Immobilie erworben' : 'Property Acquired'}</p>
                    <p className="text-sm text-muted-foreground">15.04.2022</p>
                    <p className="text-sm mt-1">{language === 'de' ? 'Kaufpreis:' : 'Purchase price:'} 450.000 €</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'de' ? 'Renovierung abgeschlossen' : 'Renovation Completed'}</p>
                    <p className="text-sm text-muted-foreground">20.06.2022</p>
                    <p className="text-sm mt-1">{language === 'de' ? 'Kosten:' : 'Cost:'} 15.000 €</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Map className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{language === 'de' ? 'Neubewertung' : 'Revaluation'}</p>
                    <p className="text-sm text-muted-foreground">10.01.2023</p>
                    <p className="text-sm mt-1">{language === 'de' ? 'Neuer Wert:' : 'New value:'} 520.000 €</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Immobilienanalyse' : 'Property Analysis'}</CardTitle>
              <CardDescription>{language === 'de' ? 'Performance und Vergleichsanalyse' : 'Performance and comparative analysis'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <p>{language === 'de' ? 'Analysetools werden geladen' : 'Analysis tools are loading'}</p>
                <Button className="mt-4" variant="outline">
                  {language === 'de' ? 'Analyse erstellen' : 'Generate Analysis'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="md:hidden flex flex-col gap-3 mt-6">
        <Button variant="outline">
          {language === 'de' ? 'Bearbeiten' : 'Edit'}
        </Button>
        <Button variant="default">
          {language === 'de' ? 'Verwalten' : 'Manage'}
        </Button>
      </div>
    </div>
  );
};

export default PropertyDetail;
