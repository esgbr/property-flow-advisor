import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, UserPlus, FileText, CalendarDays, Check, X, AlertTriangle, BellIcon } from 'lucide-react';
import { toast } from 'sonner';

// Dummy tenant data
const tenants = [
  { 
    id: 1, 
    name: 'James Wilson', 
    property: 'Downtown Apartment 3B', 
    leaseEnd: '2024-12-31',
    rentAmount: 1250,
    status: 'active',
    paymentStatus: 'paid',
    joinedDate: '2022-01-15',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/placeholder.svg'
  },
  { 
    id: 2, 
    name: 'Sarah Johnson', 
    property: 'Suburban House 42', 
    leaseEnd: '2024-08-15',
    rentAmount: 1800,
    status: 'active',
    paymentStatus: 'pending',
    joinedDate: '2021-08-15',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    avatar: '/placeholder.svg'
  },
  { 
    id: 3, 
    name: 'Michael Brown', 
    property: 'Retail Space 101', 
    leaseEnd: '2025-03-01',
    rentAmount: 2500,
    status: 'active',
    paymentStatus: 'paid',
    joinedDate: '2023-03-01',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 456-7890',
    avatar: '/placeholder.svg'
  },
  { 
    id: 4, 
    name: 'Jennifer Davis', 
    property: 'Industrial Unit 7', 
    leaseEnd: '2023-12-15',
    rentAmount: 3200,
    status: 'ending',
    paymentStatus: 'late',
    joinedDate: '2020-12-15',
    email: 'jennifer.d@example.com',
    phone: '+1 (555) 789-0123',
    avatar: '/placeholder.svg'
  },
];

// Maintenance requests data
const maintenanceRequests = [
  {
    id: 'REQ-001',
    tenant: 'James Wilson',
    property: 'Downtown Apartment 3B',
    issue: 'Leaky faucet in master bathroom',
    status: 'pending',
    priority: 'medium',
    dateSubmitted: '2023-11-28',
    assignedTo: 'Plumbing Team'
  },
  {
    id: 'REQ-002',
    tenant: 'Sarah Johnson',
    property: 'Suburban House 42',
    issue: 'Heating system not working',
    status: 'in-progress',
    priority: 'high',
    dateSubmitted: '2023-11-25',
    assignedTo: 'HVAC Specialists'
  },
  {
    id: 'REQ-003',
    tenant: 'Michael Brown',
    property: 'Retail Space 101',
    issue: 'Lighting fixtures need replacement',
    status: 'completed',
    priority: 'low',
    dateSubmitted: '2023-11-20',
    assignedTo: 'Electrical Team',
    completedDate: '2023-11-22'
  },
];

const TenantManagement = () => {
  const [activeTab, setActiveTab] = useState('tenants');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTenantDialog, setShowTenantDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.property.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddTenant = () => {
    toast({
      title: "Add tenant form",
      description: "The tenant addition form would open here.",
    });
  };

  const handlePaymentReminder = (tenantId: number) => {
    toast({
      title: "Reminder sent",
      description: "Payment reminder has been sent to the tenant.",
    });
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge className="bg-green-500">Active</Badge>;
    if (status === 'ending') return <Badge className="bg-amber-500">Ending Soon</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'paid') return <Badge className="bg-green-500">Paid</Badge>;
    if (status === 'pending') return <Badge className="bg-amber-500">Pending</Badge>;
    if (status === 'late') return <Badge className="bg-red-500">Late</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const getMaintenanceStatusBadge = (status: string) => {
    if (status === 'pending') return <Badge className="bg-amber-500">Pending</Badge>;
    if (status === 'in-progress') return <Badge className="bg-blue-500">In Progress</Badge>;
    if (status === 'completed') return <Badge className="bg-green-500">Completed</Badge>;
    return <Badge>Unknown</Badge>;
  };

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') return <Badge className="bg-red-500">High</Badge>;
    if (priority === 'medium') return <Badge className="bg-amber-500">Medium</Badge>;
    if (priority === 'low') return <Badge className="bg-green-500">Low</Badge>;
    return <Badge>Unknown</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Tenant Management</h2>
          <p className="text-muted-foreground">Oversee tenant interactions and rental activities</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search tenants..."
              className="pl-8 w-full md:w-[200px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setShowTenantDialog(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tenants">
            <UserPlus className="h-4 w-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="leases">
            <FileText className="h-4 w-4 mr-2" />
            Leases
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CalendarDays className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="applications">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Tenants</CardTitle>
              <CardDescription>Manage your property tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tenant</TableHead>
                      <TableHead>Property</TableHead>
                      <TableHead>Lease End</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tenants
                      .filter(tenant => tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) || tenant.property.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((tenant) => (
                        <TableRow key={tenant.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarFallback>{tenant.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{tenant.name}</div>
                                <div className="text-sm text-muted-foreground">{tenant.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{tenant.property}</TableCell>
                          <TableCell>{tenant.leaseEnd}</TableCell>
                          <TableCell>
                            <Badge variant={tenant.status === 'Active' ? 'default' : tenant.status === 'Late Payment' ? 'destructive' : 'outline'}>
                              {tenant.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setShowNotificationDialog(true)}
                            >
                              <BellIcon className="h-4 w-4 mr-1" />
                              Notify
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <Progress className="h-2 mt-2" value={94} />
                <p className="text-xs text-muted-foreground mt-2">15 of 16 units occupied</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Renewals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-2">Within the next 30 days</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Issues</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-2">Maintenance requests pending</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="leases" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lease Documents</CardTitle>
              <CardDescription>Manage leases, contracts and legal documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="bg-muted p-2 rounded mr-3">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{tenant.name} - Lease Agreement</div>
                        <div className="text-sm text-muted-foreground">
                          Valid until {new Date(tenant.leaseEnd).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8">
                  <h3 className="font-medium mb-3">Upcoming Renewals</h3>
                  <div className="space-y-2">
                    {tenants
                      .filter(t => new Date(t.leaseEnd) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000))
                      .map((tenant) => (
                        <div key={`renewal-${tenant.id}`} className="flex items-center justify-between p-3 bg-muted rounded-md">
                          <div>
                            <div className="font-medium">{tenant.name}</div>
                            <div className="text-sm text-muted-foreground">{tenant.property}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">
                              Expires: {new Date(tenant.leaseEnd).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-red-500">
                              {Math.ceil((new Date(tenant.leaseEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                            </div>
                          </div>
                          <Button size="sm">Start Renewal</Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rent Payments</CardTitle>
              <CardDescription>Track rental payments and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-green-500">€7,550</div>
                      <p className="text-muted-foreground text-sm">Payments collected this month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-amber-500">€3,200</div>
                      <p className="text-muted-foreground text-sm">Pending payments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold text-red-500">€0</div>
                      <p className="text-muted-foreground text-sm">Overdue payments</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold">96%</div>
                      <p className="text-muted-foreground text-sm">Collection rate</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted px-4 py-2 grid grid-cols-5 font-medium text-sm">
                    <div>Tenant</div>
                    <div>Property</div>
                    <div>Amount</div>
                    <div>Due Date</div>
                    <div>Status</div>
                  </div>
                  
                  <div className="divide-y">
                    {tenants.map((tenant) => (
                      <div key={tenant.id} className="px-4 py-3 grid grid-cols-5 items-center">
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm">{tenant.property}</div>
                        <div>€{tenant.rentAmount}</div>
                        <div className="text-sm">1st of each month</div>
                        <div>
                          {getPaymentStatusBadge(tenant.paymentStatus)}
                          {tenant.paymentStatus !== 'paid' && (
                            <Button variant="ghost" size="sm" className="ml-2" onClick={() => handlePaymentReminder(tenant.id)}>
                              <BellIcon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">Automatic Payment Reminders</h3>
                    <p className="text-sm text-muted-foreground">Send automatic reminders before rent is due</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-reminders" defaultChecked />
                    <Label htmlFor="auto-reminders">Enabled</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Property Applications</CardTitle>
              <CardDescription>Manage property applications and requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Applications</CardTitle>
                      <CardDescription>View and manage property applications</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="default">Pending</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="destructive">Rejected</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline">Accepted</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Requests</CardTitle>
                      <CardDescription>View and manage property requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="default">Pending</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="destructive">Rejected</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="outline">Accepted</Badge>
                          </div>
                          <Button variant="outline" size="sm">View All</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">New Applications</h3>
                    <p className="text-sm text-muted-foreground">View and manage new property applications</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="new-applications" defaultChecked />
                    <Label htmlFor="new-applications">Enabled</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Tenant Dialog */}
      <Dialog open={showTenantDialog} onOpenChange={setShowTenantDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tenant</DialogTitle>
            <DialogDescription>Enter tenant details to add them to a property</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" placeholder="First name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" placeholder="Last name" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Email address" type="email" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="Phone number" type="tel" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="property">Property</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="property1">123 Main St, Apt 4B</SelectItem>
                  <SelectItem value="property2">456 Oak Ave, Unit 7</SelectItem>
                  <SelectItem value="property3">789 Pine Blvd, Apt 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lease-start">Lease Start Date</Label>
              <Input id="lease-start" type="date" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lease-end">Lease End Date</Label>
              <Input id="lease-end" type="date" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="background-check" />
              <Label htmlFor="background-check">Background check completed</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTenantDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("New tenant added successfully");
              setShowTenantDialog(false);
            }}>Add Tenant</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Send Notification Dialog */}
      <Dialog open={showNotificationDialog} onOpenChange={setShowNotificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Tenant Notification</DialogTitle>
            <DialogDescription>Send an announcement or reminder to your tenant</DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="Notification subject" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <textarea
                id="message"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter your message here"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="urgent" />
              <Label htmlFor="urgent">Mark as urgent</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="sms" />
              <Label htmlFor="sms">Send SMS notification</Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNotificationDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("Notification sent to tenant");
              setShowNotificationDialog(false);
            }}>Send Notification</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TenantManagement;
