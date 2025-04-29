
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { sampleProperties } from '@/data/sampleData';
import { FileText, Calculator, Calendar, Wrench } from 'lucide-react';

const Dashboard = () => {
  const propertyCount = sampleProperties.length;
  const analyzeCount = sampleProperties.filter(p => p.status === 'analyzing').length;
  const negotiatingCount = sampleProperties.filter(p => p.status === 'negotiating').length;
  const ownedCount = sampleProperties.filter(p => p.status === 'owned').length;
  
  // Calculate total portfolio value
  const portfolioValue = sampleProperties.reduce((sum, property) => sum + property.purchasePrice, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your real estate investment dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propertyCount}</div>
            <p className="text-xs text-muted-foreground">All properties in your pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{portfolioValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total purchase price of all properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Under Analysis</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyzeCount}</div>
            <p className="text-xs text-muted-foreground">Properties being analyzed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negotiations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{negotiatingCount}</div>
            <p className="text-xs text-muted-foreground">Properties in negotiation</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Properties</CardTitle>
            <CardDescription>Your latest property prospects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sampleProperties.slice(0, 3).map((property) => (
                <div key={property.id} className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded overflow-hidden">
                    {property.imageUrl && (
                      <img 
                        src={property.imageUrl} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{property.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{property.city}</p>
                    <p className="text-sm text-muted-foreground">€{property.purchasePrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      property.status === 'analyzing' ? 'bg-blue-100 text-blue-800' :
                      property.status === 'negotiating' ? 'bg-amber-100 text-amber-800' :
                      property.status === 'owned' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {property.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Access key features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <a href="/properties/add" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Add New Property</div>
                <div className="text-sm text-muted-foreground">Track a new investment opportunity</div>
              </a>
              <a href="/calculators" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Financial Calculator</div>
                <div className="text-sm text-muted-foreground">Run investment calculations</div>
              </a>
              <a href="/schedule" className="block p-3 rounded-lg hover:bg-muted transition-colors">
                <div className="font-medium">Schedule Appointments</div>
                <div className="text-sm text-muted-foreground">Manage your property viewings</div>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
