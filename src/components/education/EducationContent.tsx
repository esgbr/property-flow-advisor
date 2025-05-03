
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, FileText, Calculator, ArrowRight, Calendar, GraduationCap, BookText } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const EducationContent = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="guides">
        <TabsList className={`${isMobile ? 'flex w-max min-w-full space-x-1' : 'grid grid-cols-4 gap-1'}`}>
          <TabsTrigger value="guides">
            <BookOpen className="h-4 w-4 mr-2" />
            Getting Started Guides
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <BookText className="h-4 w-4 mr-2" />
            Advanced Topics
          </TabsTrigger>
          <TabsTrigger value="webinars">
            <Calendar className="h-4 w-4 mr-2" />
            Webinars & Events
          </TabsTrigger>
          <TabsTrigger value="calculators">
            <Calculator className="h-4 w-4 mr-2" />
            Interactive Tools
          </TabsTrigger>
        </TabsList>

        {/* Getting Started Guides */}
        <TabsContent value="guides" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Introduction to Real Estate Investment</CardTitle>
                <CardDescription>Learn the fundamentals of real estate investing</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>This comprehensive guide covers the basics of real estate investing, including property types, market analysis, and financial metrics.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Financing Your First Property</CardTitle>
                <CardDescription>Understanding mortgage options and financing strategies</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Explore different financing methods, from traditional mortgages to creative investment strategies for maximum return.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Property Analysis 101</CardTitle>
                <CardDescription>How to evaluate potential investment properties</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Learn systematic approaches to analyzing properties, determining fair market value, and calculating potential returns.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Roadmap</CardTitle>
              <CardDescription>Step-by-step process for successful real estate investing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-7 border-l-2 border-dashed border-muted-foreground/20"></div>
                <ol className="space-y-8 relative">
                  {[
                    { step: 1, title: "Set Investment Goals", description: "Define your financial objectives and investment timeline." },
                    { step: 2, title: "Research Markets", description: "Identify promising locations with growth potential and strong rental demand." },
                    { step: 3, title: "Secure Financing", description: "Compare mortgage options and get pre-approved for investment property loans." },
                    { step: 4, title: "Property Analysis", description: "Evaluate potential properties using key metrics like cap rate and cash-on-cash return." },
                    { step: 5, title: "Make an Offer", description: "Negotiate purchase terms based on market analysis and property condition." }
                  ].map((item) => (
                    <li key={item.step} className="pl-10 relative">
                      <div className="absolute left-0 flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 z-10">
                        <span className="text-primary font-semibold">{item.step}</span>
                      </div>
                      <h4 className="text-lg font-medium mb-1">{item.title}</h4>
                      <p className="text-muted-foreground">{item.description}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Topics */}
        <TabsContent value="advanced" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Tax Optimization Strategies</CardTitle>
                <CardDescription>Maximize tax benefits for real estate investors</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Learn about depreciation, 1031 exchanges, and other tax strategies to minimize liabilities and maximize returns.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>Commercial Real Estate Investment</CardTitle>
                <CardDescription>Expanding beyond residential properties</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Discover the nuances of investing in office spaces, retail properties, and multi-unit commercial buildings.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle>International Real Estate Markets</CardTitle>
                <CardDescription>Expanding your portfolio globally</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Understand the complexities, risks, and rewards of investing in properties across different countries and markets.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Investment Strategies</CardTitle>
              <CardDescription>Beyond buy-and-hold investing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border rounded-md">
                <h4 className="text-lg font-medium mb-2">BRRRR Strategy</h4>
                <p className="text-sm text-muted-foreground mb-2">Buy, Rehabilitate, Rent, Refinance, Repeat</p>
                <p className="text-sm">A powerful method for building a real estate portfolio with limited capital by recycling the same funds across multiple properties.</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-lg font-medium mb-2">Syndication</h4>
                <p className="text-sm text-muted-foreground mb-2">Pooling resources with other investors</p>
                <p className="text-sm">Learn how to participate in or organize real estate syndications to access larger deals with shared risk.</p>
              </div>
              
              <div className="p-4 border rounded-md">
                <h4 className="text-lg font-medium mb-2">Short-Term Rentals</h4>
                <p className="text-sm text-muted-foreground mb-2">Vacation properties and Airbnb strategies</p>
                <p className="text-sm">Maximize rental income through strategic short-term rental approaches in high-demand tourist locations.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webinars & Events */}
        <TabsContent value="webinars" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Webinars</CardTitle>
                <CardDescription>Register for live educational sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Market Trends 2025</h4>
                    <Badge className="ml-2">May 15</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Analysis of current market conditions and future predictions for investors.</p>
                  <Button variant="outline" size="sm">Register</Button>
                </div>
                
                <div className="flex flex-col space-y-2 border-b pb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Financing Masterclass</h4>
                    <Badge className="ml-2">May 22</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Expert strategies for securing the best financing for your investments.</p>
                  <Button variant="outline" size="sm">Register</Button>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Property Management 101</h4>
                    <Badge className="ml-2">June 5</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Learn efficient property management techniques to maximize returns.</p>
                  <Button variant="outline" size="sm">Register</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recorded Sessions</CardTitle>
                <CardDescription>Watch previous educational content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-muted rounded-md w-24 h-16 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Analyzing Investment Markets</h4>
                    <p className="text-sm text-muted-foreground">Learn how to identify high-growth real estate markets.</p>
                    <Button variant="link" size="sm" className="px-0">Watch Now</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 border-b pb-4">
                  <div className="bg-muted rounded-md w-24 h-16 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Advanced Negotiation Techniques</h4>
                    <p className="text-sm text-muted-foreground">Master the art of negotiating property purchases.</p>
                    <Button variant="link" size="sm" className="px-0">Watch Now</Button>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-muted rounded-md w-24 h-16 flex items-center justify-center">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">Building a Real Estate Portfolio</h4>
                    <p className="text-sm text-muted-foreground">Strategic approaches to growing your investment properties.</p>
                    <Button variant="link" size="sm" className="px-0">Watch Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Interactive Tools */}
        <TabsContent value="calculators" className="space-y-6 mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>ROI Calculator</CardTitle>
                <CardDescription>Analyze investment returns</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Calculate potential return on investment for properties based on purchase price, rental income, and expenses.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="/investment-calculator">Open Calculator</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Mortgage Calculator</CardTitle>
                <CardDescription>Plan your financing</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Estimate monthly payments, amortization schedules, and total interest paid over the life of your loan.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="/investment-calculator?tab=mortgage">Open Calculator</a>
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Cap Rate Analyzer</CardTitle>
                <CardDescription>Evaluate property performance</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Determine capitalization rates for various properties to compare investment opportunities.</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="/calculators">Open Analyzer</a>
                </Button>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Investment Learning Center</CardTitle>
              <CardDescription>Interactive educational resources</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-2">
                    <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium">Interactive Tutorials</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Step-by-step guides with interactive elements to enhance your understanding of key concepts.</p>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-2">
                    <Calculator className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium">Financial Modeling</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Create custom financial models to project returns on your specific investment scenarios.</p>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-2">
                    <BookText className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium">Resource Library</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Access our extensive collection of guides, templates, and checklists for investors.</p>
                </div>
                
                <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center mb-2">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <h4 className="font-medium">Market Reports</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">Download in-depth analyses of real estate markets across different regions.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EducationContent;
