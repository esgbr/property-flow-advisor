
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Shield, Check, X, AlertCircle, ArrowRight, FileText, Download, Search, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample insurance policy data
const insurancePolicies = [
  { 
    id: 'POL-001',
    provider: 'SafeGuard Insurance',
    property: 'Downtown Apartment 3B',
    type: 'Residential Landlord',
    premium: 850,
    coverage: 250000,
    deductible: 1000,
    renewal: '2024-08-15',
    score: 92,
    features: ['Liability Coverage', 'Water Damage', 'Loss of Rent', 'Legal Protection']
  },
  { 
    id: 'POL-002',
    provider: 'PropertyShield',
    property: 'Suburban House 42',
    type: 'Residential Landlord',
    premium: 1200,
    coverage: 450000,
    deductible: 1500,
    renewal: '2024-06-30',
    score: 88,
    features: ['Liability Coverage', 'Water Damage', 'Natural Disasters', 'Loss of Rent', 'Appliance Coverage']
  },
  { 
    id: 'POL-003',
    provider: 'CommercialCover',
    property: 'Retail Space 101',
    type: 'Commercial Property',
    premium: 2800,
    coverage: 850000,
    deductible: 5000,
    renewal: '2024-12-01',
    score: 85,
    features: ['Liability Coverage', 'Fire Protection', 'Business Interruption', 'Equipment Breakdown', 'Glass Coverage']
  },
  { 
    id: 'POL-004',
    provider: 'SafeGuard Insurance',
    property: 'Industrial Unit 7',
    type: 'Industrial Property',
    premium: 3600,
    coverage: 1250000,
    deductible: 10000,
    renewal: '2025-02-15',
    score: 79,
    features: ['Liability Coverage', 'Fire Protection', 'Flood Insurance', 'Equipment Breakdown', 'Business Interruption']
  },
];

// Sample quotes for comparison
const insuranceQuotes = [
  {
    provider: 'SafeGuard Insurance',
    premium: 1250,
    coverage: 350000,
    deductible: 1500,
    coverageDetails: {
      building: '100%',
      liability: '€2,000,000',
      contents: '€50,000',
      lossOfRent: '12 months',
      legalProtection: '€50,000',
      floodCoverage: 'Optional',
      earthquakeCoverage: 'Not included'
    },
    rating: 4.7,
    reviewCount: 532,
    processingTime: '2-3 days',
    logo: '/placeholder.svg'
  },
  {
    provider: 'PropertyShield',
    premium: 1100,
    coverage: 350000,
    deductible: 2000,
    coverageDetails: {
      building: '100%',
      liability: '€1,500,000',
      contents: '€40,000',
      lossOfRent: '12 months',
      legalProtection: '€25,000',
      floodCoverage: 'Included',
      earthquakeCoverage: 'Not included'
    },
    rating: 4.5,
    reviewCount: 412,
    processingTime: '3-4 days',
    logo: '/placeholder.svg'
  },
  {
    provider: 'InvestGuard',
    premium: 1400,
    coverage: 400000,
    deductible: 1000,
    coverageDetails: {
      building: '100%',
      liability: '€2,000,000',
      contents: '€60,000',
      lossOfRent: '18 months',
      legalProtection: '€75,000',
      floodCoverage: 'Included',
      earthquakeCoverage: 'Optional'
    },
    rating: 4.8,
    reviewCount: 326,
    processingTime: '1-2 days',
    logo: '/placeholder.svg'
  },
];

const InsuranceComparison: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isComparing, setIsComparing] = useState(false);
  const [propertyType, setPropertyType] = useState('all');
  const { toast } = useToast();

  const handleGetQuotes = () => {
    setIsComparing(true);
    toast({
      title: "Quotes retrieved",
      description: "Insurance quotes for your property have been gathered for comparison.",
    });
  };

  const handleSaveQuote = (provider: string) => {
    toast({
      title: "Quote saved",
      description: `The insurance quote from ${provider} has been saved to your account.`,
    });
  };

  const handleApplyOnline = (provider: string) => {
    toast({
      title: "Application started",
      description: `You're being redirected to ${provider}'s application form.`,
    });
  };

  const filteredPolicies = insurancePolicies.filter(policy => 
    (policy.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.property.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (propertyType === 'all' || policy.type.toLowerCase().includes(propertyType.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Shield className="mr-2 h-6 w-6" />
          Property Insurance Comparison
        </h2>
        <p className="text-muted-foreground">Compare insurance policies and coverage options for your properties</p>
      </div>
      
      {isComparing ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Insurance Quotes</CardTitle>
                  <CardDescription>Compare quotes for Downtown Apartment 3B</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsComparing(false)}>
                  Back to Policies
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Deductible</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Features</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insuranceQuotes.map((quote) => (
                      <TableRow key={quote.provider}>
                        <TableCell className="font-medium">{quote.provider}</TableCell>
                        <TableCell>€{quote.premium}/year</TableCell>
                        <TableCell>€{quote.coverage.toLocaleString()}</TableCell>
                        <TableCell>€{quote.deductible}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{quote.rating}</span>
                            <span className="text-xs text-muted-foreground">({quote.reviewCount})</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {quote.processingTime} processing
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="link" className="p-0 h-auto text-xs" onClick={() => {
                            toast({
                              title: "Coverage Details",
                              description: "Showing detailed coverage information",
                            });
                          }}>
                            View Details
                          </Button>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSaveQuote(quote.provider)}>
                              Save
                            </Button>
                            <Button size="sm" onClick={() => handleApplyOnline(quote.provider)}>
                              Apply
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 space-y-6">
                <h3 className="text-lg font-medium">Detailed Comparison</h3>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Coverage</TableHead>
                        {insuranceQuotes.map(quote => (
                          <TableHead key={quote.provider}>{quote.provider}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Building Coverage</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-building`}>{quote.coverageDetails.building}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Liability Coverage</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-liability`}>{quote.coverageDetails.liability}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Contents Coverage</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-contents`}>{quote.coverageDetails.contents}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Loss of Rent</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-rent`}>{quote.coverageDetails.lossOfRent}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Legal Protection</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-legal`}>{quote.coverageDetails.legalProtection}</TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Flood Coverage</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-flood`}>
                            {quote.coverageDetails.floodCoverage === 'Included' ? (
                              <Badge className="bg-green-500">Included</Badge>
                            ) : quote.coverageDetails.floodCoverage === 'Optional' ? (
                              <Badge variant="outline">Optional</Badge>
                            ) : (
                              <Badge variant="secondary">Not included</Badge>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Earthquake Coverage</TableCell>
                        {insuranceQuotes.map(quote => (
                          <TableCell key={`${quote.provider}-earthquake`}>
                            {quote.coverageDetails.earthquakeCoverage === 'Included' ? (
                              <Badge className="bg-green-500">Included</Badge>
                            ) : quote.coverageDetails.earthquakeCoverage === 'Optional' ? (
                              <Badge variant="outline">Optional</Badge>
                            ) : (
                              <Badge variant="secondary">Not included</Badge>
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-muted rounded-md">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-sm">
                      Remember to check the policy details carefully before making a decision.
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Comparison
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0">
                <div>
                  <CardTitle>Your Insurance Policies</CardTitle>
                  <CardDescription>Manage and compare your existing property insurance</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search policies..."
                      className="pl-8 w-full md:w-[200px]"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Policy #</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Premium</TableHead>
                      <TableHead>Coverage</TableHead>
                      <TableHead>Renewal Due</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPolicies.map((policy) => {
                      const renewalDate = new Date(policy.renewal);
                      const today = new Date();
                      const daysUntilRenewal = Math.round((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                      const isRenewalSoon = daysUntilRenewal <= 30;
                      
                      return (
                        <TableRow key={policy.id}>
                          <TableCell className="font-medium">{policy.id}</TableCell>
                          <TableCell>{policy.property}</TableCell>
                          <TableCell>{policy.provider}</TableCell>
                          <TableCell>{policy.type}</TableCell>
                          <TableCell>€{policy.premium}/year</TableCell>
                          <TableCell>€{policy.coverage.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span className={isRenewalSoon ? 'text-red-500 font-medium' : ''}>
                                {new Date(policy.renewal).toLocaleDateString()}
                              </span>
                              {isRenewalSoon && (
                                <Badge className="ml-2 bg-red-500">Renewal Soon</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={policy.score} className="h-2 w-16" />
                              <span className="text-sm font-medium">{policy.score}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4" />
                                <span className="sr-only">View</span>
                              </Button>
                              <Button size="sm" variant="outline">
                                <ArrowRight className="h-4 w-4" />
                                <span className="sr-only">Renew</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              
              {filteredPolicies.length === 0 && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No policies found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Export Started",
                  description: "Your insurance policy summary is being exported to PDF.",
                });
              }}>
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Adding new policy",
                  description: "Opening the policy creation form.",
                });
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Policy
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Get Insurance Quotes</CardTitle>
              <CardDescription>Compare coverage options and prices from multiple providers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Property</label>
                    <Select defaultValue="downtown">
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="downtown">Downtown Apartment 3B</SelectItem>
                        <SelectItem value="suburban">Suburban House 42</SelectItem>
                        <SelectItem value="retail">Retail Space 101</SelectItem>
                        <SelectItem value="industrial">Industrial Unit 7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Coverage Amount</label>
                    <Select defaultValue="350000">
                      <SelectTrigger>
                        <SelectValue placeholder="Select coverage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="250000">€250,000</SelectItem>
                        <SelectItem value="350000">€350,000</SelectItem>
                        <SelectItem value="500000">€500,000</SelectItem>
                        <SelectItem value="750000">€750,000</SelectItem>
                        <SelectItem value="1000000">€1,000,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Deductible</label>
                    <Select defaultValue="1000">
                      <SelectTrigger>
                        <SelectValue placeholder="Select deductible" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">€500</SelectItem>
                        <SelectItem value="1000">€1,000</SelectItem>
                        <SelectItem value="2000">€2,000</SelectItem>
                        <SelectItem value="5000">€5,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="p-4 border border-dashed rounded-md space-y-3">
                  <h3 className="text-sm font-medium">Coverage Options</h3>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="water-damage"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="water-damage" className="text-sm">
                        Water Damage Coverage
                        <p className="text-xs text-muted-foreground">Protection against leaks, floods, and water-related incidents</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="loss-rent"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="loss-rent" className="text-sm">
                        Loss of Rental Income
                        <p className="text-xs text-muted-foreground">Covers lost rent during repairs after covered incidents</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="liability"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="liability" className="text-sm">
                        Liability Protection
                        <p className="text-xs text-muted-foreground">Covers legal expenses if someone is injured on your property</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="natural-disasters"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                      />
                      <label htmlFor="natural-disasters" className="text-sm">
                        Natural Disaster Coverage
                        <p className="text-xs text-muted-foreground">Protection against earthquakes, floods, and other disasters</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="legal-protection"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                        defaultChecked
                      />
                      <label htmlFor="legal-protection" className="text-sm">
                        Legal Protection
                        <p className="text-xs text-muted-foreground">Coverage for legal disputes related to your property</p>
                      </label>
                    </div>
                    
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="appliances"
                        className="rounded border-gray-300 text-primary focus:ring-primary mr-2 mt-1"
                      />
                      <label htmlFor="appliances" className="text-sm">
                        Appliance Coverage
                        <p className="text-xs text-muted-foreground">Protects major appliances from breakdown and damage</p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button onClick={handleGetQuotes}>Get Quotes</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Insurance Insights</CardTitle>
              <CardDescription>Insurance coverage analysis for your property portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-yellow-800">Coverage Gap Detected</h3>
                      <p className="text-sm text-yellow-700">
                        Your Retail Space 101 property may have insufficient liability coverage. Industry standards recommend at least €2M in liability coverage for commercial properties.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Review Coverage
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-medium text-green-800">Bundling Opportunity</h3>
                      <p className="text-sm text-green-700">
                        You could save approximately €420 annually by bundling your Downtown Apartment and Suburban House policies with the same provider.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Explore Options
                      </Button>
                    </div>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium mt-6">Portfolio Coverage Analysis</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Coverage to Value Ratio</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry recommendation: 90-100%
                    </p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Liability Coverage</span>
                      <span className="text-sm font-medium">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry recommendation: 85-100%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Schedule Insurance Review
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default InsuranceComparison;
