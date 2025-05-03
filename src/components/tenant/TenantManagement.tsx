
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { 
  Users, Search, Filter, PlusCircle, FileText, Calendar, 
  Mail, Phone, ChevronRight, Banknote, Home, AlertTriangle 
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

// Sample tenant data
const tenants = [
  {
    id: 1,
    name: 'John Smith',
    unit: 'Apartment 101',
    property: 'Sunset Heights',
    leaseStart: '2023-06-01',
    leaseEnd: '2024-05-31',
    rent: 1200,
    paymentStatus: 'current',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    backgroundCheck: 'passed',
    incidents: 0,
    communications: [
      { date: '2023-12-15', type: 'email', subject: 'Maintenance Request' },
      { date: '2024-01-03', type: 'phone', subject: 'Rent Payment' }
    ]
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    unit: 'Apartment 205',
    property: 'Sunset Heights',
    leaseStart: '2023-03-15',
    leaseEnd: '2024-03-14',
    rent: 1450,
    paymentStatus: 'late',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 987-6543',
    backgroundCheck: 'passed',
    incidents: 1,
    communications: [
      { date: '2024-01-20', type: 'email', subject: 'Late Payment Notice' },
      { date: '2024-01-25', type: 'phone', subject: 'Payment Plan' }
    ]
  },
  {
    id: 3,
    name: 'Michael Brown',
    unit: 'Apartment 310',
    property: 'River View Apartments',
    leaseStart: '2023-09-01',
    leaseEnd: '2024-08-31',
    rent: 1700,
    paymentStatus: 'current',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 234-5678',
    backgroundCheck: 'passed',
    incidents: 0,
    communications: [
      { date: '2023-11-05', type: 'email', subject: 'Parking Issue' }
    ]
  }
];

// Sample properties
const properties = [
  { id: 1, name: 'Sunset Heights', units: 24, address: '123 Main St, Anytown, USA' },
  { id: 2, name: 'River View Apartments', units: 18, address: '456 Water Ln, Riverside, USA' }
];

const TenantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tenants');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const isMobile = useIsMobile();

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailRentReminder: true,
    smsRentReminder: false,
    emailMaintenance: true,
    smsMaintenance: false,
    emailLease: true,
    smsLease: false,
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Tenant Management</h2>
          <p className="text-muted-foreground">Manage your tenants and lease agreements</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tenants..." 
              className="pl-8 w-full md:w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          <Button onClick={() => setShowAddTenant(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full justify-start mb-4">
          <TabsTrigger value="tenants">
            <Users className="h-4 w-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="leases">
            <FileText className="h-4 w-4 mr-2" />
            Leases
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Banknote className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="properties">
            <Home className="h-4 w-4 mr-2" />
            Properties
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTenant(tenant)}>
                <CardHeader>
                  <div className="flex justify-between">
                    <CardTitle>{tenant.name}</CardTitle>
                    <Badge variant={tenant.paymentStatus === 'current' ? 'default' : 'destructive'}>
                      {tenant.paymentStatus === 'current' ? 'Current' : 'Late'}
                    </Badge>
                  </div>
                  <CardDescription>{tenant.unit}, {tenant.property}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">Lease: {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      <Banknote className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm">Rent: ${tenant.rent}/month</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <p className="text-sm truncate">{tenant.email}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-between">
                  <Button variant="outline" size="sm">Contact</Button>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {filteredTenants.length === 0 && (
              <div className="col-span-3 flex justify-center items-center p-8 border rounded-lg">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No tenants match your search criteria.</p>
                  <Button variant="outline" onClick={() => setSearchTerm('')}>Clear Search</Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="leases">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Leases</CardTitle>
                <CardDescription>Overview of current lease agreements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{tenant.name}</h3>
                      <p className="text-sm text-muted-foreground">{tenant.unit}, {tenant.property}</p>
                      <p className="text-sm mt-1">
                        {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="mt-2 md:mt-0 space-y-2">
                      <div className="text-right">
                        <span className="text-sm font-medium">${tenant.rent}/month</span>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm" onClick={() => toast.success(`Lease for ${tenant.name} downloaded`)}>
                          Download
                        </Button>
                        <Button size="sm" onClick={() => toast.success(`Lease for ${tenant.name} viewed`)}>
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => toast.success('Creating new lease agreement')}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Lease
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Lease Renewals</CardTitle>
                <CardDescription>Upcoming lease renewals requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-amber-200 bg-amber-50 dark:bg-amber-900/20 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sarah Johnson's lease expires in 45 days</h4>
                      <p className="text-sm text-muted-foreground">Apartment 205, Sunset Heights</p>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" onClick={() => toast.success('Renewal process started')}>Start Renewal</Button>
                        <Button variant="outline" size="sm" onClick={() => toast.success('Reminder sent')}>Send Reminder</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="payments">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Rent Collection Overview</CardTitle>
                <CardDescription>Current month's rent collection status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Collection</span>
                      <span className="font-medium">67%</span>
                    </div>
                    <Progress value={67} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
                      <div className="font-medium text-green-700 dark:text-green-400">Paid</div>
                      <div className="text-2xl font-bold">2</div>
                      <div className="text-sm text-muted-foreground">$2,900.00</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <div className="font-medium text-amber-700 dark:text-amber-400">Late</div>
                      <div className="text-2xl font-bold">1</div>
                      <div className="text-sm text-muted-foreground">$1,450.00</div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <div className="font-medium">Total</div>
                      <div className="text-2xl font-bold">3</div>
                      <div className="text-sm text-muted-foreground">$4,350.00</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {tenants.map((tenant) => (
                      <div key={tenant.id} className="flex flex-col md:flex-row justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-sm text-muted-foreground">{tenant.unit}, {tenant.property}</p>
                        </div>
                        
                        <div className="mt-2 md:mt-0 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <Badge variant={tenant.paymentStatus === 'current' ? 'outline' : 'destructive'}>
                            {tenant.paymentStatus === 'current' ? 'Paid' : 'Late'}
                          </Badge>
                          <span className="font-medium">${tenant.rent.toLocaleString()}</span>
                          <Button 
                            size="sm" 
                            variant={tenant.paymentStatus === 'current' ? 'outline' : 'default'}
                            onClick={() => toast.success(`Payment recorded for ${tenant.name}`)}
                          >
                            {tenant.paymentStatus === 'current' ? 'View Receipt' : 'Record Payment'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure rent collection preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Automatic Payment Reminders</h3>
                      <p className="text-sm text-muted-foreground">Send automatic reminders before rent is due</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-reminders" checked onChange={() => toast.success('Reminder settings updated')} />
                      <Label htmlFor="auto-reminders">Enabled</Label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Late Fee Enforcement</h3>
                      <p className="text-sm text-muted-foreground">Automatically apply late fees after grace period</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="late-fees" onChange={() => toast.success('Late fee settings updated')} />
                      <Label htmlFor="late-fees">Disabled</Label>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">Payment Methods</h3>
                      <p className="text-sm text-muted-foreground">Configure accepted payment methods</p>
                    </div>
                    <Button variant="outline" onClick={() => toast.success('Payment methods settings opened')}>
                      Configure
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="properties">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((property) => (
                <Card key={property.id}>
                  <CardHeader>
                    <CardTitle>{property.name}</CardTitle>
                    <CardDescription>{property.address}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Units</span>
                        <span className="font-medium">{property.units}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Occupied</span>
                        <span className="font-medium">
                          {property.id === 1 ? '2' : '1'} / {property.units}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Occupancy Rate</span>
                          <span className="font-medium">
                            {property.id === 1 ? '8' : '6'}%
                          </span>
                        </div>
                        <Progress value={property.id === 1 ? 8 : 6} />
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Revenue</span>
                        <span className="font-medium">
                          ${property.id === 1 ? '2,650' : '1,700'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => toast.success(`Viewing units for ${property.name}`)}>
                      View Units
                    </Button>
                    <Button onClick={() => toast.success(`Managing ${property.name}`)}>
                      Manage
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Property</CardTitle>
                <CardDescription>Register a new property to manage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="property-name">Property Name</Label>
                    <Input id="property-name" placeholder="Enter property name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-address">Address</Label>
                    <Input id="property-address" placeholder="Enter property address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-units">Number of Units</Label>
                    <Input id="property-units" type="number" placeholder="Enter number of units" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property-type">Property Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment Building</SelectItem>
                        <SelectItem value="single">Single Family Home</SelectItem>
                        <SelectItem value="duplex">Duplex</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => toast.success('New property added successfully')}
                >
                  Add Property
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Tenant Detail Dialog */}
      {selectedTenant && (
        <Dialog open={!!selectedTenant} onOpenChange={() => setSelectedTenant(null)}>
          <DialogContent className={`sm:max-w-[600px] ${isMobile ? 'p-4' : ''}`}>
            <DialogHeader>
              <DialogTitle>{selectedTenant.name}</DialogTitle>
              <DialogDescription>
                {selectedTenant.unit}, {selectedTenant.property}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Contact Information</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm">{selectedTenant.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <p className="text-sm">{selectedTenant.phone}</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Lease Details</p>
                  <p className="text-sm">Start: {new Date(selectedTenant.leaseStart).toLocaleDateString()}</p>
                  <p className="text-sm">End: {new Date(selectedTenant.leaseEnd).toLocaleDateString()}</p>
                  <p className="text-sm">Monthly Rent: ${selectedTenant.rent}</p>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium">Payment History</p>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="text-sm">May 2024</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Paid</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="text-sm">April 2024</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Paid</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                    <span className="text-sm">March 2024</span>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Paid</Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 border-t pt-4">
                <p className="text-sm font-medium">Recent Communications</p>
                <div className="space-y-2">
                  {selectedTenant.communications.map((comm: any, index: number) => (
                    <div key={index} className="flex justify-between p-2 bg-gray-100 dark:bg-gray-800 rounded">
                      <div className="flex items-center">
                        {comm.type === 'email' ? (
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        ) : (
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        )}
                        <span className="text-sm">{comm.subject}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(comm.date).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <div className="flex w-full justify-between flex-col md:flex-row gap-2">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    toast.success(`Sending message to ${selectedTenant.name}`);
                  }}>
                    Message
                  </Button>
                  <Button variant="outline" onClick={() => {
                    toast.success(`Viewing full history for ${selectedTenant.name}`);
                  }}>
                    Full History
                  </Button>
                </div>
                <Button onClick={() => {
                  toast.success(`Editing details for ${selectedTenant.name}`);
                  setSelectedTenant(null);
                }}>
                  Edit Details
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Tenant Dialog */}
      <Dialog open={showAddTenant} onOpenChange={setShowAddTenant}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Enter tenant information and assign to a property</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenant-name">Full Name</Label>
                <Input id="tenant-name" placeholder="John Smith" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-email">Email</Label>
                <Input id="tenant-email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenant-phone">Phone Number</Label>
                <Input id="tenant-phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="move-in-date">Move-in Date</Label>
                <Input id="move-in-date" type="date" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="property">Property</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map(property => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="unit">Unit/Apartment</Label>
                <Input id="unit" placeholder="Apartment 101" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="rent-amount">Monthly Rent</Label>
                <Input id="rent-amount" type="number" placeholder="1200" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lease-length">Lease Term (months)</Label>
                <Select defaultValue="12">
                  <SelectTrigger>
                    <SelectValue placeholder="Select lease term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6 Months</SelectItem>
                    <SelectItem value="12">12 Months</SelectItem>
                    <SelectItem value="18">18 Months</SelectItem>
                    <SelectItem value="24">24 Months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTenant(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("New tenant added successfully");
              setShowAddTenant(false);
            }}>
              Add Tenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantManagement;
