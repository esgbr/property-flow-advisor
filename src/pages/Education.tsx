
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, BookOpen, BookText, FileText, GraduationCap, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Education = () => {
  const { t } = useLanguage();
  
  // Education categories with icons for better visual organization
  const educationCategories = [
    {
      id: "basics",
      title: "Real Estate Basics",
      icon: <Book className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookText className="h-5 w-5 mr-2 text-primary" />
                Understanding Property Types
              </CardTitle>
              <CardDescription>Learn about different real estate property classifications</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Residential Properties:</strong> Single-family homes, condos, apartments, townhouses</li>
                <li><strong>Commercial Properties:</strong> Office buildings, retail spaces, warehouses</li>
                <li><strong>Mixed-Use Properties:</strong> Buildings that combine residential and commercial spaces</li>
                <li><strong>Industrial Properties:</strong> Manufacturing facilities, research centers</li>
                <li><strong>Land:</strong> Vacant lots, agricultural land, development sites</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Key Terminology
              </CardTitle>
              <CardDescription>Essential terms every real estate investor should know</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Financing Terms</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Mortgage:</strong> A loan secured by property</li>
                    <li><strong>LTV (Loan-to-Value):</strong> The ratio of loan amount to property value</li>
                    <li><strong>Amortization:</strong> Loan payment schedule to reduce debt over time</li>
                    <li><strong>Down Payment:</strong> Initial upfront payment when purchasing property</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium">Investment Terms</h4>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li><strong>Cap Rate:</strong> Net operating income divided by property value</li>
                    <li><strong>Cash-on-Cash Return:</strong> Annual cash flow divided by total cash invested</li>
                    <li><strong>ROI:</strong> Return on investment percentage</li>
                    <li><strong>Appreciation:</strong> Increase in property value over time</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "strategies",
      title: "Investment Strategies",
      icon: <BarChart className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buy and Hold Strategy</CardTitle>
              <CardDescription>Long-term wealth building through property ownership</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">The buy and hold strategy involves purchasing properties and holding them for an extended period to benefit from:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Rental Income:</strong> Regular cash flow from tenants</li>
                <li><strong>Property Appreciation:</strong> Increase in property value over time</li>
                <li><strong>Equity Building:</strong> As you pay down the mortgage, you build equity</li>
                <li><strong>Tax Benefits:</strong> Deductions for mortgage interest, property taxes, and depreciation</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fix and Flip Strategy</CardTitle>
              <CardDescription>Short-term strategy for generating profits through property renovation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This strategy involves:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Purchasing undervalued or distressed properties</li>
                <li>Renovating to increase value substantially</li>
                <li>Selling quickly for profit</li>
                <li>Reinvesting profits into new projects</li>
              </ol>
              <p className="mt-4 text-sm text-muted-foreground">Note: This strategy requires market knowledge, renovation expertise, and proper budget management.</p>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      id: "resources",
      title: "Learning Resources",
      icon: <GraduationCap className="h-5 w-5 mr-2" />,
      content: (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Reading</CardTitle>
              <CardDescription>Books that will deepen your real estate investment knowledge</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>The Intelligent Investor in Real Estate</strong>
                    <p className="text-sm text-muted-foreground">A comprehensive guide to value investing principles applied to real estate</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>Real Estate Financial Analysis</strong>
                    <p className="text-sm text-muted-foreground">Learn how to evaluate properties using sophisticated financial metrics</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FileText className="h-4 w-4 mr-2 mt-1 text-primary" />
                  <div>
                    <strong>The Complete Guide to Property Management</strong>
                    <p className="text-sm text-muted-foreground">Essential knowledge for managing rental properties efficiently</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Online Courses</CardTitle>
              <CardDescription>Expand your knowledge with these structured learning programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Real Estate Investment Masterclass</h4>
                  <p className="text-sm text-muted-foreground">A comprehensive 8-week course covering all aspects of real estate investing</p>
                </div>
                <div>
                  <h4 className="font-medium">Property Analysis Workshop</h4>
                  <p className="text-sm text-muted-foreground">Learn to analyze potential investments like a professional</p>
                </div>
                <div>
                  <h4 className="font-medium">Real Estate Market Research</h4>
                  <p className="text-sm text-muted-foreground">Techniques for identifying emerging markets and opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Education Center</h1>
        <p className="text-muted-foreground">Learn about real estate investment strategies and market analysis</p>
      </div>

      <Tabs defaultValue="basics" className="w-full">
        <TabsList className="mb-4">
          {educationCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center">
              {category.icon}
              {category.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {educationCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-2">
            {category.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Education;
