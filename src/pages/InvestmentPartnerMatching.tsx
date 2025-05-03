
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, Filter, ArrowRight, Building, User, Users, Calendar, FileText } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

// Types
interface InvestorProfile {
  id: string;
  name: string;
  photoUrl?: string;
  location: string;
  investmentPreferences: {
    propertyTypes: string[];
    minInvestment: number;
    maxInvestment: number;
    regions: string[];
    roi: number;
    timeline: string;
  };
  experience: string;
  bio: string;
  contactInfo: {
    email: string;
    phone?: string;
  };
  ratings: {
    overall: number;
    communication: number;
    reliability: number;
    expertise: number;
  };
  pastInvestments: number;
  successfulExits: number;
  availability: string;
}

interface PropertyListing {
  id: string;
  title: string;
  address: string;
  description: string;
  propertyType: string;
  investmentNeeded: number;
  expectedRoi: number;
  timeline: string;
  images: string[];
  ownerName: string;
  ownerPhoto?: string;
  ownerRating: number;
  datePosted: string;
  interestedInvestors: string[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Sample data
const sampleInvestors: InvestorProfile[] = [
  {
    id: "inv-1",
    name: "Thomas Schmidt",
    location: "Berlin, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Wohnimmobilien", "Gewerbeimmobilien"],
      minInvestment: 100000,
      maxInvestment: 500000,
      regions: ["Berlin", "München", "Hamburg"],
      roi: 8,
      timeline: "3-5 Jahre"
    },
    experience: "Fortgeschritten",
    bio: "Immobilieninvestor mit 10 Jahren Erfahrung, spezialisiert auf Wohnungsprojekte in Großstädten.",
    contactInfo: {
      email: "thomas.schmidt@example.com",
      phone: "+49 123 4567890"
    },
    ratings: {
      overall: 4.8,
      communication: 4.7,
      reliability: 4.9,
      expertise: 4.8
    },
    pastInvestments: 14,
    successfulExits: 9,
    availability: "Sofort"
  },
  {
    id: "inv-2",
    name: "Anna Müller",
    location: "München, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Wohnimmobilien", "Ferienwohnungen"],
      minInvestment: 50000,
      maxInvestment: 300000,
      regions: ["Bayern", "Baden-Württemberg"],
      roi: 7,
      timeline: "5-10 Jahre"
    },
    experience: "Experte",
    bio: "Beschäftige mich mit langfristigen Immobilieninvestitionen mit Schwerpunkt auf nachhaltigen Gebäuden.",
    contactInfo: {
      email: "anna.mueller@example.com"
    },
    ratings: {
      overall: 4.6,
      communication: 4.8,
      reliability: 4.5,
      expertise: 4.7
    },
    pastInvestments: 23,
    successfulExits: 17,
    availability: "Nach Vereinbarung"
  },
  {
    id: "inv-3",
    name: "Michael Weber",
    location: "Hamburg, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Gewerbeimmobilien", "Industrieimmobilien"],
      minInvestment: 250000,
      maxInvestment: 1000000,
      regions: ["Hamburg", "Niedersachsen", "Schleswig-Holstein"],
      roi: 9,
      timeline: "2-4 Jahre"
    },
    experience: "Experte",
    bio: "Fokussiere mich auf Gewerbeimmobilien mit hohem Entwicklungspotenzial in Norddeutschland.",
    contactInfo: {
      email: "michael.weber@example.com",
      phone: "+49 987 6543210"
    },
    ratings: {
      overall: 4.9,
      communication: 4.8,
      reliability: 5.0,
      expertise: 4.9
    },
    pastInvestments: 31,
    successfulExits: 24,
    availability: "Sofort"
  },
  {
    id: "inv-4",
    name: "Laura Fischer",
    location: "Frankfurt, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Wohnimmobilien"],
      minInvestment: 75000,
      maxInvestment: 250000,
      regions: ["Hessen", "Rheinland-Pfalz"],
      roi: 6.5,
      timeline: "7-15 Jahre"
    },
    experience: "Anfänger",
    bio: "Neue Investorin mit Schwerpunkt auf sicheren, langfristigen Immobilieninvestitionen.",
    contactInfo: {
      email: "laura.fischer@example.com"
    },
    ratings: {
      overall: 4.2,
      communication: 4.5,
      reliability: 4.1,
      expertise: 3.9
    },
    pastInvestments: 3,
    successfulExits: 1,
    availability: "Nach Vereinbarung"
  },
  {
    id: "inv-5",
    name: "Markus Hoffmann",
    location: "Köln, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Wohnimmobilien", "Gewerbeimmobilien", "Ferienwohnungen"],
      minInvestment: 150000,
      maxInvestment: 800000,
      regions: ["Nordrhein-Westfalen", "Rheinland-Pfalz"],
      roi: 8.5,
      timeline: "3-7 Jahre"
    },
    experience: "Fortgeschritten",
    bio: "Diversifiziere mein Portfolio über verschiedene Immobilientypen mit mittelfristigem Anlagehorizont.",
    contactInfo: {
      email: "markus.hoffmann@example.com",
      phone: "+49 555 1234567"
    },
    ratings: {
      overall: 4.5,
      communication: 4.3,
      reliability: 4.6,
      expertise: 4.6
    },
    pastInvestments: 12,
    successfulExits: 8,
    availability: "Sofort"
  }
];

const sampleProperties: PropertyListing[] = [
  {
    id: "prop-1",
    title: "Mehrfamilienhaus in Prenzlauer Berg",
    address: "Stargarder Str. 78, 10437 Berlin",
    description: "Renovierungsbedürftiges Mehrfamilienhaus mit 6 Wohneinheiten in begehrter Lage. Hohes Mietsteigerungspotenzial nach Renovierung.",
    propertyType: "Wohnimmobilien",
    investmentNeeded: 450000,
    expectedRoi: 7.8,
    timeline: "4-6 Jahre",
    images: ["/placeholder.svg"],
    ownerName: "Daniel Krause",
    ownerRating: 4.7,
    datePosted: "2025-04-15",
    interestedInvestors: ["inv-1", "inv-3"]
  },
  {
    id: "prop-2",
    title: "Bürofläche in Frankfurt Innenstadt",
    address: "Mainzer Landstr. 145, 60327 Frankfurt",
    description: "Modern ausgestattete Bürofläche (350qm) in zentraler Lage. Langfristiger Mietvertrag mit bonitätsstarkem Unternehmen bereits vorhanden.",
    propertyType: "Gewerbeimmobilien",
    investmentNeeded: 850000,
    expectedRoi: 9.2,
    timeline: "5-8 Jahre",
    images: ["/placeholder.svg"],
    ownerName: "Sandra Meyer",
    ownerRating: 4.9,
    datePosted: "2025-04-28",
    interestedInvestors: ["inv-3", "inv-5"]
  },
  {
    id: "prop-3",
    title: "Ferienapartments an der Ostsee",
    address: "Strandweg 12, 23769 Fehmarn",
    description: "Drei vollständig eingerichtete Ferienapartments mit Meerblick. Stabile Auslastung und etabliertes Vermietungsmanagement.",
    propertyType: "Ferienwohnungen",
    investmentNeeded: 320000,
    expectedRoi: 8.5,
    timeline: "7-10 Jahre",
    images: ["/placeholder.svg"],
    ownerName: "Martin Schulz",
    ownerRating: 4.4,
    datePosted: "2025-05-01",
    interestedInvestors: ["inv-2", "inv-5"]
  },
  {
    id: "prop-4",
    title: "Lagerhalle mit Entwicklungspotenzial",
    address: "Industriestr. 78, 22525 Hamburg",
    description: "Gut erhaltene Lagerhalle (1200qm) in Gewerbegebiet mit Option zur Umwidmung für gemischte Nutzung.",
    propertyType: "Industrieimmobilien",
    investmentNeeded: 680000,
    expectedRoi: 10.5,
    timeline: "3-5 Jahre",
    images: ["/placeholder.svg"],
    ownerName: "Christian Winter",
    ownerRating: 4.8,
    datePosted: "2025-04-10",
    interestedInvestors: ["inv-3"]
  },
  {
    id: "prop-5",
    title: "Sanierungsobjekt in München",
    address: "Leopoldstr. 187, 80804 München",
    description: "Historisches Gebäude im Jugendstil mit 8 Wohneinheiten. Umfassende Sanierung erforderlich, hohes Wertsteigerungspotenzial.",
    propertyType: "Wohnimmobilien",
    investmentNeeded: 750000,
    expectedRoi: 11.2,
    timeline: "4-7 Jahre",
    images: ["/placeholder.svg"],
    ownerName: "Julia Becker",
    ownerRating: 4.6,
    datePosted: "2025-04-22",
    interestedInvestors: ["inv-1", "inv-2", "inv-5"]
  }
];

// Utility functions
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateMatchPercentage = (investor: InvestorProfile, property: PropertyListing): number => {
  let score = 0;
  
  // Match property type
  if (investor.investmentPreferences.propertyTypes.includes(property.propertyType)) {
    score += 30;
  }
  
  // Match investment range
  if (property.investmentNeeded >= investor.investmentPreferences.minInvestment && 
      property.investmentNeeded <= investor.investmentPreferences.maxInvestment) {
    score += 30;
  } else if (Math.abs(property.investmentNeeded - investor.investmentPreferences.minInvestment) < 50000 ||
             Math.abs(property.investmentNeeded - investor.investmentPreferences.maxInvestment) < 50000) {
    score += 15;
  }
  
  // Match ROI expectations
  if (property.expectedRoi >= investor.investmentPreferences.roi) {
    score += 20;
  } else if (property.expectedRoi >= investor.investmentPreferences.roi * 0.8) {
    score += 10;
  }
  
  // Match timeline
  const propertyYears = property.timeline.match(/\d+/g)?.map(Number);
  const investorYears = investor.investmentPreferences.timeline.match(/\d+/g)?.map(Number);
  
  if (propertyYears && investorYears) {
    const propMin = propertyYears[0];
    const propMax = propertyYears[1] || propMin;
    const invMin = investorYears[0];
    const invMax = investorYears[1] || invMin;
    
    if ((propMin <= invMax && propMax >= invMin)) {
      score += 20;
    }
  }
  
  return score;
};

// Main component
const InvestmentPartnerMatching: React.FC = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('find-investors');
  const [investors, setInvestors] = useState(sampleInvestors);
  const [properties, setProperties] = useState(sampleProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPropertyType, setSelectedPropertyType] = useState<string>('');
  const [minInvestment, setMinInvestment] = useState<number[]>([0]);
  const [maxInvestment, setMaxInvestment] = useState<number[]>([1000000]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [minRoi, setMinRoi] = useState<number[]>([0]);
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedInvestor, setSelectedInvestor] = useState<InvestorProfile | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [userProfile, setUserProfile] = useState<InvestorProfile>({
    id: "user",
    name: "Mein Profil",
    location: "Berlin, Deutschland",
    investmentPreferences: {
      propertyTypes: ["Wohnimmobilien"],
      minInvestment: 100000,
      maxInvestment: 500000,
      regions: ["Berlin", "Hamburg"],
      roi: 7,
      timeline: "5-10 Jahre"
    },
    experience: "Fortgeschritten",
    bio: "Ich suche nach Partnern für gemeinsame Immobilieninvestitionen in Norddeutschland.",
    contactInfo: {
      email: "meine.email@example.com",
      phone: "+49 123 4567890"
    },
    ratings: {
      overall: 4.5,
      communication: 4.6,
      reliability: 4.4,
      expertise: 4.5
    },
    pastInvestments: 8,
    successfulExits: 5,
    availability: "Nach Vereinbarung"
  });

  // Filter investors based on search criteria
  const filteredInvestors = investors.filter(investor => {
    // Text search
    const matchesSearch = searchTerm.trim() === '' ||
      investor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.bio.toLowerCase().includes(searchTerm.toLowerCase());

    // Property type filter
    const matchesPropertyType = selectedPropertyType === '' ||
      investor.investmentPreferences.propertyTypes.includes(selectedPropertyType);

    // Investment range filter
    const matchesInvestmentRange = 
      investor.investmentPreferences.maxInvestment >= minInvestment[0] &&
      investor.investmentPreferences.minInvestment <= maxInvestment[0];

    // Region filter
    const matchesRegion = selectedRegions.length === 0 ||
      investor.investmentPreferences.regions.some(region => selectedRegions.includes(region));

    // ROI filter
    const matchesRoi = investor.investmentPreferences.roi >= minRoi[0];

    // Experience filter
    const matchesExperience = selectedExperience === '' || investor.experience === selectedExperience;

    return matchesSearch && matchesPropertyType && matchesInvestmentRange && matchesRegion && matchesRoi && matchesExperience;
  });

  // Filter properties based on user preferences
  const filteredProperties = properties.filter(property => {
    // Investment range
    const withinRange = property.investmentNeeded >= userProfile.investmentPreferences.minInvestment &&
                       property.investmentNeeded <= userProfile.investmentPreferences.maxInvestment;
    
    // Property type
    const matchesType = userProfile.investmentPreferences.propertyTypes.includes(property.propertyType);
    
    // ROI expectation
    const meetRoi = property.expectedRoi >= userProfile.investmentPreferences.roi;
    
    return withinRange && matchesType && meetRoi;
  });

  // Express interest in a property
  const expressInterest = (propertyId: string) => {
    setProperties(properties.map(prop => {
      if (prop.id === propertyId) {
        if (prop.interestedInvestors.includes("user")) {
          // Remove interest
          return {
            ...prop,
            interestedInvestors: prop.interestedInvestors.filter(id => id !== "user")
          };
        } else {
          // Add interest
          return {
            ...prop,
            interestedInvestors: [...prop.interestedInvestors, "user"]
          };
        }
      }
      return prop;
    }));
    
    toast.success("Interesse wurde aktualisiert");
  };

  // Send message to investor
  const sendMessage = (recipientId: string, message: string) => {
    // In a real app, this would store the message in a database
    toast.success(`Nachricht an ${investors.find(inv => inv.id === recipientId)?.name} gesendet`);
  };

  return (
    <div className="container mx-auto py-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Partnersuche für Immobilieninvestitionen</h1>
        <p className="text-muted-foreground">Finden Sie die perfekten Partner für Ihre Immobilieninvestitionen oder entdecken Sie neue Investment-Möglichkeiten.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="find-investors">Partner finden</TabsTrigger>
          <TabsTrigger value="investment-opportunities">Investment-Möglichkeiten</TabsTrigger>
          <TabsTrigger value="my-profile">Mein Profil</TabsTrigger>
        </TabsList>

        {/* Find Investors Tab */}
        <TabsContent value="find-investors" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Investorensuche</CardTitle>
              <CardDescription>Finden Sie passende Investitionspartner für Ihre Projekte</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Suche nach Name, Ort oder Erfahrung..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Filter Optionen</DialogTitle>
                      <DialogDescription>
                        Filtern Sie die Investoren nach Ihren Präferenzen
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="property-type">Immobilientyp</Label>
                        <Select
                          value={selectedPropertyType}
                          onValueChange={setSelectedPropertyType}
                        >
                          <SelectTrigger id="property-type">
                            <SelectValue placeholder="Alle Typen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Alle Typen</SelectItem>
                            <SelectItem value="Wohnimmobilien">Wohnimmobilien</SelectItem>
                            <SelectItem value="Gewerbeimmobilien">Gewerbeimmobilien</SelectItem>
                            <SelectItem value="Ferienwohnungen">Ferienwohnungen</SelectItem>
                            <SelectItem value="Industrieimmobilien">Industrieimmobilien</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Investitionsbereich</Label>
                        <div className="flex justify-between text-sm">
                          <span>{formatCurrency(minInvestment[0])}</span>
                          <span>{formatCurrency(maxInvestment[0])}</span>
                        </div>
                        <div className="px-1">
                          <Slider
                            min={0}
                            max={1000000}
                            step={50000}
                            value={minInvestment}
                            onValueChange={setMinInvestment}
                            className="mb-4"
                          />
                          <Slider
                            min={0}
                            max={1000000}
                            step={50000}
                            value={maxInvestment}
                            onValueChange={setMaxInvestment}
                          />
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Mindest-ROI</Label>
                        <div className="flex justify-between text-sm">
                          <span>{minRoi[0]}%</span>
                        </div>
                        <Slider
                          min={0}
                          max={15}
                          step={0.5}
                          value={minRoi}
                          onValueChange={setMinRoi}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label>Bevorzugte Regionen</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Berlin", "München", "Hamburg", "Frankfurt", "Köln", "Stuttgart", "Dresden", "Düsseldorf"].map((region) => (
                            <div key={region} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`region-${region}`} 
                                checked={selectedRegions.includes(region)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedRegions([...selectedRegions, region]);
                                  } else {
                                    setSelectedRegions(selectedRegions.filter(r => r !== region));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`region-${region}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {region}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="experience-level">Erfahrungslevel</Label>
                        <Select
                          value={selectedExperience}
                          onValueChange={setSelectedExperience}
                        >
                          <SelectTrigger id="experience-level">
                            <SelectValue placeholder="Alle Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Alle Level</SelectItem>
                            <SelectItem value="Anfänger">Anfänger</SelectItem>
                            <SelectItem value="Fortgeschritten">Fortgeschritten</SelectItem>
                            <SelectItem value="Experte">Experte</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSelectedPropertyType('');
                          setMinInvestment([0]);
                          setMaxInvestment([1000000]);
                          setSelectedRegions([]);
                          setMinRoi([0]);
                          setSelectedExperience('');
                        }}
                      >
                        Zurücksetzen
                      </Button>
                      <Button type="submit">Filter anwenden</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredInvestors.length > 0 ? filteredInvestors.map(investor => (
                  <Card key={investor.id} className="overflow-hidden">
                    <div className="p-6 flex flex-col items-center text-center">
                      <Avatar className="h-20 w-20 mb-4">
                        <AvatarImage src={investor.photoUrl} />
                        <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <h3 className="font-semibold text-lg">{investor.name}</h3>
                      <div className="text-sm text-muted-foreground mb-2">{investor.location}</div>
                      <div className="flex items-center gap-1 mb-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(investor.ratings.overall)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.585l-7.07 3.715 1.35-7.865L.34 7.23l7.88-1.145L10 0l2.78 6.085 7.88 1.145-5.94 5.805 1.35 7.865L10 15.585z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm font-medium">{investor.ratings.overall}</span>
                      </div>
                      <Badge className="mb-3" variant="outline">
                        {investor.experience}
                      </Badge>
                      <p className="text-sm line-clamp-3 mb-4">{investor.bio}</p>
                    </div>
                    <Separator />
                    <div className="p-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div className="text-muted-foreground">Investment:</div>
                      <div>
                        {formatCurrency(investor.investmentPreferences.minInvestment)} - {formatCurrency(investor.investmentPreferences.maxInvestment)}
                      </div>
                      <div className="text-muted-foreground">Immobilientypen:</div>
                      <div>{investor.investmentPreferences.propertyTypes.join(", ")}</div>
                      <div className="text-muted-foreground">Ziel-ROI:</div>
                      <div>{investor.investmentPreferences.roi}%+</div>
                      <div className="text-muted-foreground">Zeitrahmen:</div>
                      <div>{investor.investmentPreferences.timeline}</div>
                      <div className="text-muted-foreground">Erfolgreiche Exits:</div>
                      <div>{investor.successfulExits}/{investor.pastInvestments}</div>
                    </div>
                    <div className="bg-muted/50 px-6 py-4">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setSelectedInvestor(investor);
                          toast.success(`Profil von ${investor.name} geöffnet`);
                        }}
                      >
                        Profil anzeigen
                      </Button>
                    </div>
                  </Card>
                )) : (
                  <div className="col-span-3 py-12 text-center">
                    <p className="text-muted-foreground">Keine Investoren gefunden, die Ihren Filterkriterien entsprechen.</p>
                    <Button 
                      variant="link" 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedPropertyType('');
                        setMinInvestment([0]);
                        setMaxInvestment([1000000]);
                        setSelectedRegions([]);
                        setMinRoi([0]);
                        setSelectedExperience('');
                      }}
                    >
                      Filter zurücksetzen
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Investor Profile Dialog */}
          {selectedInvestor && (
            <Dialog open={!!selectedInvestor} onOpenChange={(open) => !open && setSelectedInvestor(null)}>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Investorenprofil</DialogTitle>
                  <DialogDescription>
                    Detaillierte Informationen über diesen Investor
                  </DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-20 w-20 mb-4">
                      <AvatarFallback>{selectedInvestor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold">{selectedInvestor.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedInvestor.location}</p>
                    <div className="flex items-center gap-1 my-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.round(selectedInvestor.ratings.overall)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-7.07 3.715 1.35-7.865L.34 7.23l7.88-1.145L10 0l2.78 6.085 7.88 1.145-5.94 5.805 1.35 7.865L10 15.585z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-medium">{selectedInvestor.ratings.overall}</span>
                    </div>
                    <Badge className="mb-3" variant="outline">
                      {selectedInvestor.experience}
                    </Badge>
                    <div className="mt-4 space-y-3">
                      <Button size="sm" className="w-full">
                        Nachricht senden
                      </Button>
                      <Button size="sm" variant="outline" className="w-full">
                        Zum Favoriten
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Über</h4>
                      <p className="text-sm">{selectedInvestor.bio}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Präferenzen</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Investitionsbereich:</div>
                        <div>{formatCurrency(selectedInvestor.investmentPreferences.minInvestment)} - {formatCurrency(selectedInvestor.investmentPreferences.maxInvestment)}</div>
                        
                        <div className="text-muted-foreground">Immobilientypen:</div>
                        <div>{selectedInvestor.investmentPreferences.propertyTypes.join(", ")}</div>
                        
                        <div className="text-muted-foreground">Regionen:</div>
                        <div>{selectedInvestor.investmentPreferences.regions.join(", ")}</div>
                        
                        <div className="text-muted-foreground">Mindest-ROI:</div>
                        <div>{selectedInvestor.investmentPreferences.roi}%</div>
                        
                        <div className="text-muted-foreground">Zeitrahmen:</div>
                        <div>{selectedInvestor.investmentPreferences.timeline}</div>
                        
                        <div className="text-muted-foreground">Verfügbarkeit:</div>
                        <div>{selectedInvestor.availability}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Bewertungen</h4>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="text-muted-foreground">Kommunikation:</div>
                        <div className="flex items-center">
                          <div className="w-24">
                            <Progress value={selectedInvestor.ratings.communication * 20} className="h-2" />
                          </div>
                          <span className="ml-2">{selectedInvestor.ratings.communication}</span>
                        </div>
                        
                        <div className="text-muted-foreground">Zuverlässigkeit:</div>
                        <div className="flex items-center">
                          <div className="w-24">
                            <Progress value={selectedInvestor.ratings.reliability * 20} className="h-2" />
                          </div>
                          <span className="ml-2">{selectedInvestor.ratings.reliability}</span>
                        </div>
                        
                        <div className="text-muted-foreground">Fachwissen:</div>
                        <div className="flex items-center">
                          <div className="w-24">
                            <Progress value={selectedInvestor.ratings.expertise * 20} className="h-2" />
                          </div>
                          <span className="ml-2">{selectedInvestor.ratings.expertise}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Erfolgsbilanz</h4>
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-semibold">{selectedInvestor.pastInvestments}</div>
                          <div className="text-xs text-muted-foreground">Investitionen</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-semibold">{selectedInvestor.successfulExits}</div>
                          <div className="text-xs text-muted-foreground">Erfolgreiche Exits</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-semibold">
                            {selectedInvestor.pastInvestments > 0 ? 
                              `${Math.round((selectedInvestor.successfulExits / selectedInvestor.pastInvestments) * 100)}%` : 
                              '0%'}
                          </div>
                          <div className="text-xs text-muted-foreground">Erfolgsquote</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>

        {/* Investment Opportunities Tab */}
        <TabsContent value="investment-opportunities" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Investment-Möglichkeiten</CardTitle>
              <CardDescription>Entdecken Sie Immobilien, die Partner für Investments suchen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.length > 0 ? filteredProperties.map(property => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="bg-muted h-48 relative">
                      <img 
                        src={property.images[0]} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary">
                          {calculateMatchPercentage(userProfile, property)}% Match
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{property.address}</p>
                      <p className="text-sm line-clamp-2 mb-4">{property.description}</p>
                      
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mb-4">
                        <div className="text-muted-foreground">Immobilientyp:</div>
                        <div>{property.propertyType}</div>
                        
                        <div className="text-muted-foreground">Benötigtes Investment:</div>
                        <div className="font-medium">{formatCurrency(property.investmentNeeded)}</div>
                        
                        <div className="text-muted-foreground">Erwarteter ROI:</div>
                        <div className="text-green-600 font-medium">{property.expectedRoi}%</div>
                        
                        <div className="text-muted-foreground">Zeitrahmen:</div>
                        <div>{property.timeline}</div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{property.ownerName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{property.ownerName}</div>
                            <div className="flex items-center">
                              <svg className="h-3 w-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                              <span className="text-xs ml-1">{property.ownerRating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          variant={property.interestedInvestors.includes("user") ? "default" : "outline"} 
                          onClick={() => expressInterest(property.id)}
                          size="sm"
                        >
                          {property.interestedInvestors.includes("user") ? "Interessiert" : "Interesse zeigen"}
                        </Button>
                      </div>
                    </div>
                    <CardFooter className="bg-muted/50 py-3 flex justify-between">
                      <div className="text-xs text-muted-foreground">
                        Gepostet am {new Date(property.datePosted).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-xs flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {property.interestedInvestors.length} Interessenten
                      </div>
                    </CardFooter>
                  </Card>
                )) : (
                  <div className="col-span-2 py-12 text-center">
                    <p className="text-muted-foreground">Keine passenden Investment-Möglichkeiten gefunden.</p>
                    <p className="text-sm text-muted-foreground mt-2">Passen Sie Ihre Präferenzen im Profil-Tab an, um mehr Optionen zu sehen.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* My Profile Tab */}
        <TabsContent value="my-profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Mein Investorenprofil</CardTitle>
              <CardDescription>Verwalten Sie Ihre Präferenzen und persönliche Informationen</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-12 gap-8">
                <div className="md:col-span-4 flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mb-6">
                    Bild ändern
                  </Button>
                  
                  <h3 className="font-semibold text-lg">{userProfile.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{userProfile.location}</p>
                  <Badge className="mb-6" variant="outline">
                    {userProfile.experience}
                  </Badge>
                  
                  <div className="w-full text-sm space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Kontaktinformationen</h4>
                      <div className="flex items-center mb-2">
                        <div className="w-6 text-muted-foreground">@</div>
                        <div>{userProfile.contactInfo.email}</div>
                      </div>
                      {userProfile.contactInfo.phone && (
                        <div className="flex items-center">
                          <div className="w-6 text-muted-foreground">☎</div>
                          <div>{userProfile.contactInfo.phone}</div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Erfolgsbilanz</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-3 bg-muted/50 rounded-md">
                          <div className="text-xl font-semibold">{userProfile.pastInvestments}</div>
                          <div className="text-xs text-muted-foreground">Investitionen</div>
                        </div>
                        <div className="text-center p-3 bg-muted/50 rounded-md">
                          <div className="text-xl font-semibold">{userProfile.successfulExits}</div>
                          <div className="text-xs text-muted-foreground">Erfolge</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-8 space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Über mich</h3>
                    <Input
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})}
                      className="mb-2"
                    />
                    <p className="text-xs text-muted-foreground">Kurzer Überblick über Ihre Investitionsphilosophie und Erfahrung</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium mb-3">Investitionspräferenzen</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="min-investment">Mindestinvestition</Label>
                        <Input
                          id="min-investment"
                          type="number"
                          value={userProfile.investmentPreferences.minInvestment}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            investmentPreferences: {
                              ...userProfile.investmentPreferences,
                              minInvestment: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="max-investment">Maximale Investition</Label>
                        <Input
                          id="max-investment"
                          type="number"
                          value={userProfile.investmentPreferences.maxInvestment}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            investmentPreferences: {
                              ...userProfile.investmentPreferences,
                              maxInvestment: parseInt(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor="property-types">Bevorzugte Immobilientypen</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["Wohnimmobilien", "Gewerbeimmobilien", "Ferienwohnungen", "Industrieimmobilien"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`type-${type}`}
                              checked={userProfile.investmentPreferences.propertyTypes.includes(type)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setUserProfile({
                                    ...userProfile,
                                    investmentPreferences: {
                                      ...userProfile.investmentPreferences,
                                      propertyTypes: [...userProfile.investmentPreferences.propertyTypes, type]
                                    }
                                  });
                                } else {
                                  setUserProfile({
                                    ...userProfile,
                                    investmentPreferences: {
                                      ...userProfile.investmentPreferences,
                                      propertyTypes: userProfile.investmentPreferences.propertyTypes.filter(t => t !== type)
                                    }
                                  });
                                }
                              }}
                            />
                            <label 
                              htmlFor={`type-${type}`}
                              className="text-sm font-medium leading-none"
                            >
                              {type}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="roi">Mindest-ROI (%)</Label>
                        <Input
                          id="roi"
                          type="number"
                          value={userProfile.investmentPreferences.roi}
                          onChange={(e) => setUserProfile({
                            ...userProfile,
                            investmentPreferences: {
                              ...userProfile.investmentPreferences,
                              roi: parseFloat(e.target.value) || 0
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="timeline">Zeitrahmen</Label>
                        <Select
                          value={userProfile.investmentPreferences.timeline}
                          onValueChange={(value) => setUserProfile({
                            ...userProfile,
                            investmentPreferences: {
                              ...userProfile.investmentPreferences,
                              timeline: value
                            }
                          })}
                        >
                          <SelectTrigger id="timeline">
                            <SelectValue placeholder="Wählen Sie einen Zeitrahmen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-3 Jahre">1-3 Jahre</SelectItem>
                            <SelectItem value="3-5 Jahre">3-5 Jahre</SelectItem>
                            <SelectItem value="5-10 Jahre">5-10 Jahre</SelectItem>
                            <SelectItem value="10+ Jahre">10+ Jahre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label>Bevorzugte Regionen</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                        {["Berlin", "Hamburg", "München", "Frankfurt", "Köln", "Dresden", "Stuttgart", "Düsseldorf"].map((region) => (
                          <div key={region} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`region-${region}`}
                              checked={userProfile.investmentPreferences.regions.includes(region)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setUserProfile({
                                    ...userProfile,
                                    investmentPreferences: {
                                      ...userProfile.investmentPreferences,
                                      regions: [...userProfile.investmentPreferences.regions, region]
                                    }
                                  });
                                } else {
                                  setUserProfile({
                                    ...userProfile,
                                    investmentPreferences: {
                                      ...userProfile.investmentPreferences,
                                      regions: userProfile.investmentPreferences.regions.filter(r => r !== region)
                                    }
                                  });
                                }
                              }}
                            />
                            <label 
                              htmlFor={`region-${region}`}
                              className="text-sm font-medium leading-none"
                            >
                              {region}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <Button onClick={() => toast.success("Profil wurde aktualisiert!")}>
                      Änderungen speichern
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestmentPartnerMatching;
