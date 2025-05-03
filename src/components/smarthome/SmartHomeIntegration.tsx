import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Lightbulb, Thermometer, Lock, Shield, Bell, 
  Video, Calendar as CalendarIcon, Home as HomeIcon, 
  Wifi, Camera, ChevronRight as ArrowRight 
} from 'lucide-react';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

const devices = [
  { id: 'light-living', name: 'Living Room Lights', type: 'light', status: 'on' },
  { id: 'thermostat', name: 'Thermostat', type: 'thermostat', temperature: 72 },
  { id: 'lock-front', name: 'Front Door Lock', type: 'lock', status: 'locked' },
  { id: 'camera-driveway', name: 'Driveway Camera', type: 'camera', status: 'online' },
];

const scenes = [
  { id: 'movie-night', name: 'Movie Night', devices: ['light-living', 'thermostat'] },
  { id: 'good-night', name: 'Good Night', devices: ['lock-front', 'thermostat'] },
];

const automations = [
  { id: 'sunrise', name: 'Sunrise', time: '6:00 AM', actions: ['light-living'] },
  { id: 'sunset', name: 'Sunset', time: '6:00 PM', actions: ['lock-front'] },
];

const SmartHomeIntegration: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lightBrightness, setLightBrightness] = useState(70);
  const [temperature, setTemperature] = useState(72);
  const [securityStatus, setSecurityStatus] = useState('disarmed');
  const [showAddDevice, setShowAddDevice] = useState(false);
  
  const handleLightToggle = (location: string, checked: boolean) => {
    toast.success(`Lights in ${location} are now ${checked ? 'on' : 'off'}`);
  };
  
  const handleDeviceAction = (deviceId: string, action: string) => {
    toast.success(`Device ${deviceId} - ${action}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold">Smart Home Integration</h2>
          <p className="text-muted-foreground">Manage your property's smart devices</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Select defaultValue="home">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="home">Main Home</SelectItem>
              <SelectItem value="rental1">Rental Property #1</SelectItem>
              <SelectItem value="rental2">Rental Property #2</SelectItem>
              <SelectItem value="vacation">Vacation Home</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => { toast.success("Devices refreshed"); }}>
            <Wifi className="h-4 w-4" />
          </Button>
          
          <Button onClick={() => setShowAddDevice(true)}>Add Device</Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">
            <HomeIcon className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="devices">
            <Lightbulb className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="scenes">
            <Video className="h-4 w-4 mr-2" />
            Scenes
          </TabsTrigger>
          <TabsTrigger value="automations">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Automations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Security Status Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Security Status</CardTitle>
                  <Shield className={`h-5 w-5 ${securityStatus === 'armed' ? 'text-green-500' : 'text-gray-400'}`} />
                </div>
                <CardDescription>Home security system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>System Status</Label>
                    <Select value={securityStatus} onValueChange={setSecurityStatus}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disarmed">Disarmed</SelectItem>
                        <SelectItem value="armed">Armed</SelectItem>
                        <SelectItem value="home">Home Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Front Door</span>
                    <span className="text-green-500 font-medium">Locked</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Back Door</span>
                    <span className="text-green-500 font-medium">Locked</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Motion Sensors</span>
                    <span className="font-medium">Clear</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => { toast.success("Security logs displayed"); }}>View Logs</Button>
              </CardFooter>
            </Card>
            
            {/* Climate Control Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Climate Control</CardTitle>
                  <Thermometer className="h-5 w-5 text-blue-500" />
                </div>
                <CardDescription>Temperature and humidity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{temperature}°F</div>
                      <div className="text-sm text-muted-foreground">Current: 73°F</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Humidity</div>
                      <div>45%</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Set Temperature</Label>
                      <span className="text-sm text-muted-foreground">{temperature}°F</span>
                    </div>
                    <Slider
                      value={[temperature]}
                      min={60}
                      max={85}
                      step={1}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>HVAC Mode</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-[100px]">
                        <SelectValue placeholder="Mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cool">Cool</SelectItem>
                        <SelectItem value="heat">Heat</SelectItem>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="off">Off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="flex w-full justify-between">
                  <Button variant="outline" size="sm" onClick={() => { setTemperature(temperature - 1); }}>-</Button>
                  <Button variant="outline" size="sm" onClick={() => { toast.success("Schedule updated"); }}>Schedule</Button>
                  <Button variant="outline" size="sm" onClick={() => { setTemperature(temperature + 1); }}>+</Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Lighting Control Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Lighting Control</CardTitle>
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                </div>
                <CardDescription>Smart lighting system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Living Room</Label>
                    <Switch id="living-room-lights" checked onCheckedChange={(checked) => handleLightToggle('living', checked)} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Kitchen</Label>
                    <Switch id="kitchen-lights" checked onCheckedChange={(checked) => handleLightToggle('kitchen', checked)} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Bedroom</Label>
                    <Switch id="bedroom-lights" onCheckedChange={(checked) => handleLightToggle('bedroom', checked)} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Brightness</Label>
                      <span className="text-sm text-muted-foreground">{lightBrightness}%</span>
                    </div>
                    <Slider
                      value={[lightBrightness]}
                      min={0}
                      max={100}
                      step={5}
                      onValueChange={(value) => setLightBrightness(value[0])}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => { setLightBrightness(0); toast.success("All lights off"); }}>All Off</Button>
                  <Button variant="outline" size="sm" onClick={() => { setLightBrightness(100); toast.success("All lights on"); }}>All On</Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Energy Usage Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Energy Usage</CardTitle>
                <CardDescription>Daily consumption patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Today's Usage</span>
                      <span className="text-sm font-medium">12.4 kWh</span>
                    </div>
                    <Progress value={62} />
                    <div className="text-xs text-muted-foreground text-right">62% of daily average</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Current Draw</span>
                    <span className="font-medium">1.2 kW</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Estimated Bill</span>
                    <span className="font-medium">$76.20</span>
                  </div>
                  
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-sm text-green-600 dark:text-green-400">↓ 8% less than last month</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => { toast.success("Energy analytics displayed"); }}>View Analytics</Button>
              </CardFooter>
            </Card>
            
            {/* Camera Monitoring Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Camera Monitoring</CardTitle>
                  <Camera className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Security cameras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="rounded-lg bg-gray-100 dark:bg-gray-800 aspect-video flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">Front Door Camera Feed</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Motion Detection</Label>
                    <Switch id="motion-detection" checked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Last Activity</span>
                    <span className="text-sm">10:23 AM</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button variant="outline" size="sm" onClick={() => { toast.success("Viewing all cameras"); }}>All Cameras</Button>
                  <Button variant="outline" size="sm" onClick={() => { toast.success("Recording started"); }}>Record</Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Notifications Card */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notifications</CardTitle>
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <CardDescription>Recent alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <div className="text-sm font-medium">Motion Detected</div>
                    <div className="text-xs text-muted-foreground">Front porch - 20 minutes ago</div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm font-medium">Temperature Alert</div>
                    <div className="text-xs text-muted-foreground">Temperature below threshold - 2 hours ago</div>
                  </div>
                  
                  <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <div className="text-sm font-medium">Device Connected</div>
                    <div className="text-xs text-muted-foreground">New smart plug - Yesterday</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => { toast.success("Notification settings opened"); }}>Settings</Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common smart home controls</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => { toast.success("Away mode activated"); }}>
                  <HomeIcon className="h-5 w-5" />
                  <span>Away Mode</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => { toast.success("Good night scene activated"); }}>
                  <Lightbulb className="h-5 w-5" />
                  <span>Good Night</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => { toast.success("Security armed"); }}>
                  <Lock className="h-5 w-5" />
                  <span>Lock All</span>
                </Button>
                
                <Button variant="outline" className="h-auto py-4 flex flex-col items-center justify-center gap-2" onClick={() => { toast.success("Energy saving mode activated"); }}>
                  <Thermometer className="h-5 w-5" />
                  <span>Eco Mode</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Devices</CardTitle>
              <CardDescription>Manage and monitor your smart devices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {devices.map((device) => (
                  <Card key={device.id}>
                    <CardHeader>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {device.type === 'light' && (
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <Switch id={device.id} checked={device.status === 'on'} onCheckedChange={(checked) => handleDeviceAction(device.id, checked ? 'Turn On' : 'Turn Off')} />
                        </div>
                      )}
                      {device.type === 'thermostat' && (
                        <div>
                          <div className="flex items-center justify-between">
                            <span>Temperature</span>
                            <span>{device.temperature}°F</span>
                          </div>
                          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => handleDeviceAction(device.id, 'Adjust Temperature')}>Adjust</Button>
                        </div>
                      )}
                      {device.type === 'lock' && (
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <span>{device.status}</span>
                        </div>
                      )}
                      {device.type === 'camera' && (
                        <div className="flex items-center justify-between">
                          <span>Status</span>
                          <span>{device.status}</span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleDeviceAction(device.id, 'View Details')}>View Details</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scenes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Scenes</CardTitle>
              <CardDescription>Automate multiple devices with one tap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scenes.map((scene) => (
                  <Card key={scene.id}>
                    <CardHeader>
                      <CardTitle>{scene.name}</CardTitle>
                      <CardDescription>Devices: {scene.devices.join(', ')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Activate this scene to control multiple devices at once.</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleDeviceAction(scene.id, 'Activate Scene')}>Activate</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Automations</CardTitle>
              <CardDescription>Set up automated actions based on time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {automations.map((automation) => (
                  <Card key={automation.id}>
                    <CardHeader>
                      <CardTitle>{automation.name}</CardTitle>
                      <CardDescription>Time: {automation.time}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Actions: {automation.actions.join(', ')}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleDeviceAction(automation.id, 'Edit Automation')}>Edit</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Device Dialog */}
      <Dialog open={showAddDevice} onOpenChange={setShowAddDevice}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Smart Device</DialogTitle>
            <DialogDescription>
              Connect a new smart device to your property.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="device-name">Device Name</Label>
              <Input id="device-name" placeholder="Living Room Light" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device-type">Device Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select device type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="thermostat">Thermostat</SelectItem>
                  <SelectItem value="camera">Camera</SelectItem>
                  <SelectItem value="lock">Smart Lock</SelectItem>
                  <SelectItem value="plug">Smart Plug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device-location">Location</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="livingroom">Living Room</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="bathroom">Bathroom</Bathroom>
                  <SelectItem value="outside">Outside</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDevice(false)}>Cancel</Button>
            <Button onClick={() => {
              toast.success("New device added successfully");
              setShowAddDevice(false);
            }}>
              Add Device
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SmartHomeIntegration;
