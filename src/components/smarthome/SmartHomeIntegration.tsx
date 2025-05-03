
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Home, Lightbulb, Thermometer, Lock, Shield, Check, X, Wifi, Power, Plus, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sample smart home device data
const smartDevices = [
  {
    id: 'dev-001',
    name: 'Living Room Smart Thermostat',
    type: 'thermostat',
    status: 'online',
    property: 'Downtown Apartment 3B',
    batteryLevel: 78,
    temperature: 21,
    mode: 'auto',
    lastUpdated: '5 mins ago',
    brand: 'Nest'
  },
  {
    id: 'dev-002',
    name: 'Front Door Smart Lock',
    type: 'lock',
    status: 'online',
    property: 'Downtown Apartment 3B',
    batteryLevel: 65,
    locked: true,
    lastActivity: '2 hours ago',
    lastUpdated: '10 mins ago',
    brand: 'August'
  },
  {
    id: 'dev-003',
    name: 'Kitchen Smart Lights',
    type: 'lights',
    status: 'online',
    property: 'Downtown Apartment 3B',
    on: false,
    brightness: 80,
    color: 'warm',
    lastUpdated: '2 mins ago',
    brand: 'Philips Hue'
  },
  {
    id: 'dev-004',
    name: 'Water Leak Detector',
    type: 'sensor',
    status: 'online',
    property: 'Downtown Apartment 3B',
    batteryLevel: 92,
    alert: false,
    lastUpdated: '15 mins ago',
    brand: 'Flo'
  },
  {
    id: 'dev-005',
    name: 'Security Camera',
    type: 'camera',
    status: 'offline',
    property: 'Downtown Apartment 3B',
    batteryLevel: 0,
    recording: false,
    lastUpdated: '2 days ago',
    brand: 'Ring'
  }
];

// Sample smart home platforms
const platforms = [
  { name: 'Google Home', connected: true, logo: '/placeholder.svg' },
  { name: 'Amazon Alexa', connected: true, logo: '/placeholder.svg' },
  { name: 'Apple HomeKit', connected: false, logo: '/placeholder.svg' },
  { name: 'Samsung SmartThings', connected: false, logo: '/placeholder.svg' }
];

// Sample automation rules
const automationRules = [
  {
    id: 'rule-001',
    name: 'Eco Mode',
    active: true,
    trigger: 'When no motion detected for 30 minutes',
    actions: [
      'Set thermostat to 18°C',
      'Turn off all lights',
      'Lock front door'
    ],
    schedule: 'Active always'
  },
  {
    id: 'rule-002',
    name: 'Welcome Home',
    active: true,
    trigger: 'When front door unlocks',
    actions: [
      'Turn on entryway lights at 70% brightness',
      'Set thermostat to 22°C'
    ],
    schedule: 'Active between 4PM-11PM'
  },
  {
    id: 'rule-003',
    name: 'Water Leak Alert',
    active: true,
    trigger: 'When water leak detected',
    actions: [
      'Send notification to all users',
      'Send email alert'
    ],
    schedule: 'Active always'
  }
];

const SmartHomeIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [deviceFilter, setDeviceFilter] = useState<string>('all');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const selectedDevice = selectedDeviceId 
    ? smartDevices.find(device => device.id === selectedDeviceId)
    : null;

  const filteredDevices = deviceFilter === 'all' 
    ? smartDevices 
    : smartDevices.filter(device => device.type === deviceFilter);

  const handleConnectPlatform = (platform: string) => {
    toast({
      title: "Connection initiated",
      description: `Connecting to ${platform}. Follow the authorization steps.`,
    });
  };

  const handleToggleDevice = (deviceId: string, currentState: boolean) => {
    toast({
      title: `Device ${currentState ? 'turned off' : 'turned on'}`,
      description: `The command has been sent successfully.`,
    });
  };

  const handleUpdateDeviceSettings = () => {
    toast({
      title: "Settings updated",
      description: "Device settings have been updated successfully.",
    });
  };

  const handleCreateRule = () => {
    toast({
      title: "Create automation",
      description: "Opening the automation rule creation form.",
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'thermostat':
        return <Thermometer className="h-5 w-5" />;
      case 'lock':
        return <Lock className="h-5 w-5" />;
      case 'lights':
        return <Lightbulb className="h-5 w-5" />;
      case 'sensor':
        return <AlertTriangle className="h-5 w-5" />;
      case 'camera':
        return <Shield className="h-5 w-5" />;
      default:
        return <Home className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Home className="mr-2 h-6 w-6" />
            Smart Home Integration
          </h2>
          <p className="text-muted-foreground">Connect with smart devices for remote property management</p>
        </div>
        <Button onClick={() => {
          toast({
            title: "Refreshing devices",
            description: "Updating status of all connected devices.",
          });
        }}>
          Refresh Devices
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="devices">
            <Lightbulb className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="automations">
            <Settings className="h-4 w-4 mr-2" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="platforms">
            <Wifi className="h-4 w-4 mr-2" />
            Platforms
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Smart Home Overview</CardTitle>
              <CardDescription>Status of your connected properties and devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Devices</p>
                        <h3 className="text-2xl font-bold">{smartDevices.length}</h3>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Home className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center text-sm text-green-600 mr-4">
                        <div className="h-2 w-2 rounded-full bg-green-600 mr-1"></div>
                        <span>{smartDevices.filter(d => d.status === 'online').length} Online</span>
                      </div>
                      <div className="flex items-center text-sm text-red-500">
                        <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                        <span>{smartDevices.filter(d => d.status === 'offline').length} Offline</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Properties</p>
                        <h3 className="text-2xl font-bold">1</h3>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <Badge className="bg-primary">Downtown Apartment 3B</Badge>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Active Automations</p>
                        <h3 className="text-2xl font-bold">{automationRules.filter(r => r.active).length}</h3>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Settings className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div className="flex items-center mt-4">
                      <div className="flex items-center text-sm">
                        <span>{automationRules.length} total rules</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <h3 className="text-lg font-medium mb-4">Quick Controls</h3>
              
              <div className="space-y-4">
                {smartDevices.map(device => (
                  <div key={device.id} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${device.status === 'online' ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center mr-4`}>
                          {getDeviceIcon(device.type)}
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center">
                            {device.name}
                            {device.status === 'online' ? (
                              <Badge className="ml-2 bg-green-500">Online</Badge>
                            ) : (
                              <Badge className="ml-2 bg-red-500">Offline</Badge>
                            )}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {device.brand} • Last updated {device.lastUpdated}
                          </p>
                        </div>
                      </div>
                      <div>
                        {device.type === 'thermostat' && device.status === 'online' && (
                          <div className="flex items-center">
                            <span className="text-lg font-medium mr-4">{device.temperature}°C</span>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">-</Button>
                              <Button variant="outline" size="sm">+</Button>
                            </div>
                          </div>
                        )}
                        
                        {device.type === 'lock' && device.status === 'online' && (
                          <div className="flex items-center">
                            {device.locked ? (
                              <Badge className="mr-2 bg-green-500">Locked</Badge>
                            ) : (
                              <Badge className="mr-2 bg-red-500">Unlocked</Badge>
                            )}
                            <Button variant="outline" size="sm">
                              {device.locked ? 'Unlock' : 'Lock'}
                            </Button>
                          </div>
                        )}
                        
                        {device.type === 'lights' && device.status === 'online' && (
                          <div className="flex items-center">
                            <Switch 
                              checked={device.on} 
                              onCheckedChange={() => handleToggleDevice(device.id, device.on)}
                            />
                          </div>
                        )}
                        
                        {device.type === 'sensor' && device.status === 'online' && (
                          <Badge className={device.alert ? 'bg-red-500' : 'bg-green-500'}>
                            {device.alert ? 'Alert' : 'Normal'}
                          </Badge>
                        )}
                        
                        {device.type === 'camera' && device.status === 'online' && (
                          <Button variant="outline" size="sm">
                            {device.recording ? 'Stop' : 'Record'}
                          </Button>
                        )}
                        
                        {device.status === 'offline' && (
                          <Button variant="outline" size="sm" disabled>
                            Unavailable
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Devices</CardTitle>
                  <CardDescription>Manage your connected smart devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Label>Filter by type</Label>
                    <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Devices" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Devices</SelectItem>
                        <SelectItem value="thermostat">Thermostats</SelectItem>
                        <SelectItem value="lock">Locks</SelectItem>
                        <SelectItem value="lights">Lights</SelectItem>
                        <SelectItem value="sensor">Sensors</SelectItem>
                        <SelectItem value="camera">Cameras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    {filteredDevices.map(device => (
                      <div
                        key={device.id}
                        className={`p-3 border rounded-md cursor-pointer ${selectedDeviceId === device.id ? 'border-primary bg-primary/5' : ''}`}
                        onClick={() => setSelectedDeviceId(device.id)}
                      >
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full ${device.status === 'online' ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center mr-3`}>
                            {getDeviceIcon(device.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{device.name}</div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className={`h-1.5 w-1.5 rounded-full ${device.status === 'online' ? 'bg-green-500' : 'bg-red-500'} mr-1`}></span>
                              {device.status === 'online' ? 'Online' : 'Offline'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline" onClick={() => {
                    toast({
                      title: "Add device",
                      description: "Opening device setup wizard.",
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Device
                  </Button>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-2">
              {selectedDevice ? (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className={`mb-2 ${selectedDevice.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}>
                          {selectedDevice.status === 'online' ? 'Online' : 'Offline'}
                        </Badge>
                        <CardTitle className="flex items-center">
                          {selectedDevice.name}
                        </CardTitle>
                        <CardDescription>
                          {selectedDevice.brand} • {selectedDevice.type.charAt(0).toUpperCase() + selectedDevice.type.slice(1)}
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {selectedDevice.batteryLevel !== undefined && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Battery Level</span>
                            <span className="font-medium">{selectedDevice.batteryLevel}%</span>
                          </div>
                          <Progress value={selectedDevice.batteryLevel} className="h-2" />
                        </div>
                      )}
                      
                      {selectedDevice.type === 'thermostat' && (
                        <div className="space-y-4">
                          <div>
                            <Label>Current Temperature</Label>
                            <div className="flex items-center mt-1">
                              <span className="text-3xl font-bold">{selectedDevice.temperature}°C</span>
                              <div className="ml-auto">
                                <Button variant="outline" size="sm">-</Button>
                                <Button variant="outline" size="sm" className="ml-2">+</Button>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <Label>Mode</Label>
                            <Select defaultValue={selectedDevice.mode}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select mode" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="auto">Auto</SelectItem>
                                <SelectItem value="heat">Heat</SelectItem>
                                <SelectItem value="cool">Cool</SelectItem>
                                <SelectItem value="off">Off</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Schedule</Label>
                            <Button variant="outline" size="sm" className="mt-1 w-full justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              View Heating Schedule
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedDevice.type === 'lock' && (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="text-center">
                              <div className={`h-24 w-24 rounded-full ${selectedDevice.locked ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mx-auto`}>
                                <Lock className={`h-12 w-12 ${selectedDevice.locked ? 'text-green-600' : 'text-red-600'}`} />
                              </div>
                              <h3 className="text-lg font-medium mt-2">
                                {selectedDevice.locked ? 'Locked' : 'Unlocked'}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Last activity: {selectedDevice.lastActivity}
                              </p>
                            </div>
                          </div>
                          
                          <Button className="w-full" variant={selectedDevice.locked ? 'outline' : 'default'}>
                            {selectedDevice.locked ? 'Unlock Door' : 'Lock Door'}
                          </Button>
                          
                          <div>
                            <Label>Activity Log</Label>
                            <div className="border rounded-md mt-1 max-h-40 overflow-y-auto">
                              <div className="p-3 border-b text-sm">
                                <div className="font-medium">Door Locked</div>
                                <div className="text-xs text-muted-foreground">Today, 2:34 PM • Auto-lock activated</div>
                              </div>
                              <div className="p-3 border-b text-sm">
                                <div className="font-medium">Door Unlocked</div>
                                <div className="text-xs text-muted-foreground">Today, 2:30 PM • Access code used</div>
                              </div>
                              <div className="p-3 text-sm">
                                <div className="font-medium">Door Locked</div>
                                <div className="text-xs text-muted-foreground">Today, 8:15 AM • Remote lock</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {selectedDevice.type === 'lights' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="lights-toggle">Power</Label>
                            <Switch 
                              id="lights-toggle" 
                              checked={selectedDevice.on} 
                              onCheckedChange={() => handleToggleDevice(selectedDevice.id, selectedDevice.on)}
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <Label>Brightness</Label>
                              <span className="text-sm">{selectedDevice.brightness}%</span>
                            </div>
                            <Slider
                              defaultValue={[selectedDevice.brightness]}
                              max={100}
                              step={1}
                              disabled={!selectedDevice.on}
                            />
                          </div>
                          
                          <div>
                            <Label>Color Temperature</Label>
                            <Select defaultValue={selectedDevice.color} disabled={!selectedDevice.on}>
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="warm">Warm White</SelectItem>
                                <SelectItem value="neutral">Neutral White</SelectItem>
                                <SelectItem value="cool">Cool White</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="pt-2">
                            <Button 
                              disabled={!selectedDevice.on} 
                              onClick={handleUpdateDeviceSettings}
                              className="w-full"
                            >
                              Apply Settings
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {selectedDevice.type === 'sensor' && (
                        <div className="space-y-4">
                          <div className="flex justify-center">
                            <div className="text-center">
                              <div className={`h-24 w-24 rounded-full ${selectedDevice.alert ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center mx-auto`}>
                                <AlertTriangle className={`h-12 w-12 ${selectedDevice.alert ? 'text-red-600' : 'text-green-600'}`} />
                              </div>
                              <h3 className="text-lg font-medium mt-2">
                                {selectedDevice.alert ? 'Alert Detected!' : 'No Issues Detected'}
                              </h3>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <h4 className="text-sm font-medium">Sensor Settings</h4>
                            <div className="mt-2 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Push Notifications</span>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Email Alerts</span>
                                <Switch defaultChecked />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Audible Alarm</span>
                                <Switch defaultChecked />
                              </div>
                            </div>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            Test Sensor
                          </Button>
                        </div>
                      )}
                      
                      {selectedDevice.type === 'camera' && selectedDevice.status === 'offline' && (
                        <div className="text-center p-6">
                          <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium">Camera Offline</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            This device is currently unavailable. Please check the power and Wi-Fi connection.
                          </p>
                          <Button className="mt-4">
                            Troubleshoot
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "Device removed",
                        description: `${selectedDevice.name} has been removed from your account.`,
                      });
                    }}>
                      Remove Device
                    </Button>
                    <Button variant="outline" onClick={() => {
                      toast({
                        title: "Energy report",
                        description: "Generating energy usage report for this device.",
                      });
                    }}>
                      Energy Report
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full border rounded-lg p-12 bg-muted/40">
                  <div className="text-center">
                    <Home className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium">No Device Selected</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mt-1">
                      Select a device from the list to view its details and controls
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="automations">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Smart Home Automations</CardTitle>
                  <CardDescription>Create and manage automated rules for your properties</CardDescription>
                </div>
                <Button onClick={handleCreateRule}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRules.map((rule) => (
                  <div key={rule.id} className="p-4 border rounded-md">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-full ${rule.active ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center mr-4`}>
                          <Settings className={`h-5 w-5 ${rule.active ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{rule.name}</h3>
                          <p className="text-sm text-muted-foreground">{rule.schedule}</p>
                        </div>
                      </div>
                      <Switch 
                        checked={rule.active}
                        onCheckedChange={() => {
                          toast({
                            title: rule.active ? "Rule deactivated" : "Rule activated",
                            description: `${rule.name} has been ${rule.active ? "deactivated" : "activated"}.`,
                          });
                        }}
                      />
                    </div>
                    
                    <div className="mt-4 grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Trigger</label>
                        <div className="p-3 bg-muted rounded-md mt-1">
                          <p className="text-sm">{rule.trigger}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Actions</label>
                        <div className="p-3 bg-muted rounded-md mt-1">
                          <ul className="text-sm space-y-1">
                            {rule.actions.map((action, index) => (
                              <li key={index} className="flex items-center">
                                <ArrowRight className="h-3 w-3 mr-1 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Rule duplicated",
                          description: `A copy of ${rule.name} has been created.`,
                        });
                      }}>
                        Duplicate
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => {
                        toast({
                          title: "Rule deleted",
                          description: `${rule.name} has been removed from your automations.`,
                        });
                      }}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Automation Templates</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border border-dashed rounded-md hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    <h4 className="font-medium">Energy Saving Mode</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Automatically adjusts temperature and turns off devices when no one is home.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm mt-2">
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-dashed rounded-md hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    <h4 className="font-medium">Vacation Mode</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Simulates occupancy with lights and manages energy usage while you're away.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm mt-2">
                      Use Template
                    </Button>
                  </div>
                  
                  <div className="p-4 border border-dashed rounded-md hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                    <h4 className="font-medium">Security Focus</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enhances security with automated locks, cameras, and lighting.
                    </p>
                    <Button variant="link" className="p-0 h-auto text-sm mt-2">
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="platforms">
          <Card>
            <CardHeader>
              <CardTitle>Smart Home Platforms</CardTitle>
              <CardDescription>Connect and manage your smart home platform integrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {platforms.map((platform) => (
                  <div key={platform.name} className="flex items-center justify-between p-4 border rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-muted rounded-md mr-4">
                        {/* Platform logo would go here */}
                      </div>
                      <div>
                        <h3 className="font-medium">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {platform.connected ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    {platform.connected ? (
                      <div className="flex items-center">
                        <div className="flex items-center text-sm text-green-600 mr-4">
                          <Check className="h-4 w-4 mr-1" />
                          Connected
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                      </div>
                    ) : (
                      <Button onClick={() => handleConnectPlatform(platform.name)}>
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="p-4 border border-dashed rounded-md bg-muted/20">
                  <div className="text-center">
                    <h3 className="font-medium">Add New Platform</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Connect with additional smart home systems
                    </p>
                    <Button variant="outline" className="mt-2" onClick={() => {
                      toast({
                        title: "Add platform",
                        description: "Opening platform integration wizard.",
                      });
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Platform
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 border rounded-md bg-yellow-50">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-yellow-800">Platform Access Note</h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      When connecting platforms, PropertyFlow will only request the minimum permissions needed to control your devices. You can review and revoke access at any time.
                    </p>
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

export default SmartHomeIntegration;
