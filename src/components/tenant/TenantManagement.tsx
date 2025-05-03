
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, User, Calendar, FileText, Plus, Search, Check, X, AlertCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

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

const TenantManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('tenants');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { toast } = useToast();

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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Tenant Management System</h2>
          <p className="text-muted-foreground">Track tenant information, lease agreements, and maintenance requests</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search tenants..." 
              className="pl-8 w-full" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleAddTenant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tenants">
            <Users className="h-4 w-4 mr-2" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="leases">
            <FileText className="h-4 w-4 mr-2" />
            Leases & Documents
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <AlertCircle className="h-4 w-4 mr-2" />
            Maintenance Requests
          </TabsTrigger>
          <TabsTrigger value="payments">
            <Calendar className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tenants">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenants.map((tenant) => (
              <Card key={tenant.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-2">
                        <AvatarImage src={tenant.avatar} />
                        <AvatarFallback>{tenant.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{tenant.name}</CardTitle>
                        <CardDescription>{tenant.property}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(tenant.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Lease Ends:</span>
                      <span>{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Rent Amount:</span>
                      <span>€{tenant.rentAmount}/month</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Payment Status:</span>
                      {getPaymentStatusBadge(tenant.paymentStatus)}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Contact:</span>
                      <span className="truncate max-w-[180px]">{tenant.email}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">View Details</Button>
                  {tenant.paymentStatus !== 'paid' && (
                    <Button size="sm" onClick={() => handlePaymentReminder(tenant.id)}>
                      Send Reminder
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="leases">
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
        
        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Requests</CardTitle>
              <CardDescription>Track and manage property maintenance issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {maintenanceRequests.map((request) => (
                  <div key={request.id} className="border rounded-md p-4">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {request.id}: {request.issue}
                          <div className="ml-3">
                            {getMaintenanceStatusBadge(request.status)}
                          </div>
                          <div className="ml-2">
                            {getPriorityBadge(request.priority)}
                          </div>
                        </h3>
                        <div className="text-sm text-muted-foreground">
                          {request.tenant} - {request.property}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {request.status === 'pending' && (
                          <Button size="sm">Assign</Button>
                        )}
                        {request.status === 'in-progress' && (
                          <Button size="sm">Mark Complete</Button>
                        )}
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Date Submitted</div>
                        <div>{request.dateSubmitted}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Assigned To</div>
                        <div>{request.assignedTo || 'Not assigned'}</div>
                      </div>
                      {request.status === 'in-progress' && (
                        <div>
                          <div className="text-muted-foreground">Progress</div>
                          <div className="flex items-center">
                            <Progress value={60} className="h-2 flex-1 mr-2" />
                            <span>60%</span>
                          </div>
                        </div>
                      )}
                      {request.status === 'completed' && (
                        <div>
                          <div className="text-muted-foreground">Completed Date</div>
                          <div>{request.completedDate}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Maintenance Request
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
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
                              <Bell className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
};

export default TenantManagement;
