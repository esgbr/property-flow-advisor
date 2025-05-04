
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, Settings, Bell, Shield, Building } from 'lucide-react';

const UserProfile = () => {
  const { t } = useLanguage();
  
  // Demo user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Investor",
    joinDate: "June 2023",
    profilePicture: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    properties: 5,
    totalInvestment: 1250000,
    preferences: {
      investmentTypes: ["Residential", "Commercial"],
      preferredLocations: ["Urban", "Suburban"],
      minROI: 6.5,
      maxBudget: 500000
    },
    activity: [
      { type: "Property Viewed", target: "Downtown Loft", date: "2 days ago" },
      { type: "ROI Analysis", target: "Suburban House", date: "5 days ago" },
      { type: "Mortgage Calculator", target: "Investment Property", date: "1 week ago" },
      { type: "Property Comparison", target: "Multiple Properties", date: "2 weeks ago" }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        <Card className="w-full md:w-80">
          <CardContent className="pt-6 flex flex-col items-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.profilePicture} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold mt-4">{user.name}</h2>
            <p className="text-muted-foreground">{user.role}</p>
            
            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('email')}</span>
                <span>{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('memberSince')}</span>
                <span>{user.joinDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('properties')}</span>
                <span>{user.properties}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('totalInvestment')}</span>
                <span>€{user.totalInvestment.toLocaleString()}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6">
              <User className="mr-2 h-4 w-4" />
              {t('editProfile')}
            </Button>
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <Tabs defaultValue="preferences">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preferences">
                <Settings className="mr-2 h-4 w-4" />
                {t('preferences')}
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Bell className="mr-2 h-4 w-4" />
                {t('recentActivity')}
              </TabsTrigger>
              <TabsTrigger value="portfolio">
                <Building className="mr-2 h-4 w-4" />
                {t('portfolioSummary')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preferences" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('investmentPreferences')}</CardTitle>
                  <CardDescription>{t('yourPreferredInvestmentCriteria')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">{t('investmentTypes')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.investmentTypes.map((type) => (
                        <div key={type} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {type}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">{t('preferredLocations')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.preferences.preferredLocations.map((location) => (
                        <div key={location} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                          {location}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">{t('minimumROI')}</h3>
                      <p>{user.preferences.minROI}%</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{t('maximumBudget')}</h3>
                      <p>€{user.preferences.maxBudget.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('accountSecurity')}</CardTitle>
                  <CardDescription>{t('manageYourAccountSecurity')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-green-500" />
                      <div>
                        <h3 className="font-medium">{t('twoFactorAuthentication')}</h3>
                        <p className="text-sm text-muted-foreground">{t('enhanceYourAccountSecurity')}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">{t('enable')}</Button>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-yellow-500" />
                      <div>
                        <h3 className="font-medium">{t('changePassword')}</h3>
                        <p className="text-sm text-muted-foreground">{t('updateYourPassword')}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">{t('change')}</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('recentActivity')}</CardTitle>
                  <CardDescription>{t('yourRecentActionsOnThePlatform')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {user.activity.map((activity, index) => (
                      <div key={index} className="flex justify-between items-start border-b last:border-0 pb-3 last:pb-0">
                        <div>
                          <h3 className="font-medium">{activity.type}</h3>
                          <p className="text-sm text-muted-foreground">{activity.target}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">{activity.date}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="portfolio" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t('portfolioSummary')}</CardTitle>
                  <CardDescription>{t('overviewOfYourRealEstatePortfolio')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">{t('totalInvestment')}</div>
                          <div className="text-2xl font-bold">€{user.totalInvestment.toLocaleString()}</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">{t('averageROI')}</div>
                          <div className="text-2xl font-bold">7.2%</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">{t('monthlyCashFlow')}</div>
                          <div className="text-2xl font-bold">€3,750</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="text-sm text-muted-foreground">{t('portfolioEquity')}</div>
                          <div className="text-2xl font-bold">€325,000</div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Button className="w-full">
                      <Building className="mr-2 h-4 w-4" />
                      {t('viewFullPortfolio')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
