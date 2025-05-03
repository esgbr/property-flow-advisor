
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Smartphone, Download, ArrowRight, Bell, Check, QrCode, Shield, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const MobileIntegration: React.FC = () => {
  const [email, setEmail] = useState('');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();

  const handleSendInvite = () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the download link.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Download link sent",
      description: `The app download link has been sent to ${email}.`,
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center">
          <Smartphone className="mr-2 h-6 w-6" />
          Mobile App Integration
        </h2>
        <p className="text-muted-foreground">Access PropertyFlow on your mobile devices and configure notifications</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Download the Mobile App</CardTitle>
            <CardDescription>Get PropertyFlow on your smartphone or tablet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-[240px] h-[480px] border-8 border-gray-800 rounded-3xl overflow-hidden bg-white shadow-lg mb-4">
                <div className="absolute top-0 left-0 right-0 h-8 bg-gray-800"></div>
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800"></div>
                <div className="h-full w-full">
                  <img 
                    src="https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&q=80&ixlib=rb-4.0.3"
                    alt="Mobile App Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 w-full max-w-xs">
                <div className="flex gap-2 mb-4">
                  <Button className="flex-1 flex items-center justify-center">
                    <Download className="h-5 w-5 mr-2" />
                    App Store
                  </Button>
                  <Button className="flex-1 flex items-center justify-center">
                    <Download className="h-5 w-5 mr-2" />
                    Google Play
                  </Button>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  Available for iOS and Android devices
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-muted rounded-md">
                <QrCode className="h-8 w-8 mr-3 text-primary" />
                <div>
                  <h3 className="text-sm font-medium">Scan QR Code</h3>
                  <p className="text-xs text-muted-foreground">Scan this code with your phone's camera to download</p>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Label htmlFor="email">Email Download Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    placeholder="your-email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button onClick={handleSendInvite}>
                    Send
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">We'll send you a direct download link</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Mobile Features</CardTitle>
            <CardDescription>Key features available in the mobile app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Property Dashboard</h3>
                  <p className="text-sm text-muted-foreground">View your entire property portfolio at a glance</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-muted-foreground">Get alerts for rent payments, maintenance issues, and more</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Document Access</h3>
                  <p className="text-sm text-muted-foreground">View and share property documents on the go</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Financial Tracking</h3>
                  <p className="text-sm text-muted-foreground">Monitor cash flow, expenses, and ROI from anywhere</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Maintenance Requests</h3>
                  <p className="text-sm text-muted-foreground">Submit and track maintenance tickets with photos</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 border border-dashed rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Badge>NEW</Badge>
                  <span className="ml-2 font-medium">Offline Mode</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                View your property data even without an internet connection. Changes will sync once you're back online.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>Configure how you want to receive updates and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="push">
            <TabsList>
              <TabsTrigger value="push">
                <Bell className="h-4 w-4 mr-2" />
                Push Notifications
              </TabsTrigger>
              <TabsTrigger value="email">
                <Mail className="h-4 w-4 mr-2" />
                Email Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="push" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-all">Enable Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications on your mobile device</p>
                  </div>
                  <Switch
                    id="push-all"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notify me about:</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Rent Payment Confirmations</div>
                    <Switch id="push-payments" defaultChecked disabled={!pushNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Late Payment Reminders</div>
                    <Switch id="push-late-payments" defaultChecked disabled={!pushNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Maintenance Requests</div>
                    <Switch id="push-maintenance" defaultChecked disabled={!pushNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Tenant Communications</div>
                    <Switch id="push-tenant" defaultChecked disabled={!pushNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Market Updates</div>
                    <Switch id="push-market" disabled={!pushNotifications} />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="email" className="pt-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-all">Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch
                    id="email-all"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Notify me about:</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Monthly Financial Reports</div>
                    <Switch id="email-reports" defaultChecked disabled={!emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Rent Payment Receipts</div>
                    <Switch id="email-receipts" defaultChecked disabled={!emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Lease Renewals and Expirations</div>
                    <Switch id="email-leases" defaultChecked disabled={!emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Maintenance Updates</div>
                    <Switch id="email-maintenance" defaultChecked disabled={!emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Market Analysis Reports</div>
                    <Switch id="email-market" disabled={!emailNotifications} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm">New Investment Opportunities</div>
                    <Switch id="email-investments" defaultChecked disabled={!emailNotifications} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => {
            setPushNotifications(true);
            setEmailNotifications(true);
          }}>
            Reset to Default
          </Button>
          <Button onClick={handleSavePreferences}>
            Save Preferences
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Mobile Security</CardTitle>
          <CardDescription>Configure security settings for mobile access</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="biometric">Biometric Authentication</Label>
                <p className="text-sm text-muted-foreground">Use fingerprint or face recognition to unlock the app</p>
              </div>
              <Switch id="biometric" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pin">PIN Lock</Label>
                <p className="text-sm text-muted-foreground">Require a PIN code to access the app</p>
              </div>
              <Switch id="pin" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sessions">Active Sessions</Label>
                <p className="text-sm text-muted-foreground">Currently logged in on 2 devices</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
            
            <div className="p-4 border border-amber-200 bg-amber-50 rounded-md">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-amber-800">Security Recommendation</h3>
                  <p className="text-sm text-amber-700">
                    Enable two-factor authentication for an additional layer of security when accessing your property information on mobile devices.
                  </p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileIntegration;
