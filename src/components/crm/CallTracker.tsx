
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  PhoneForwarded, 
  PhoneIncoming, 
  PhoneMissed, 
  PhoneOff, 
  Clock, 
  Calendar,
  Mic,
  MicOff,
  MessageSquare,
  ArrowDownCircle,
  BarChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Demo call history data
const demoCallHistory = [
  { 
    id: '1', 
    contactName: 'Anna Weber', 
    contactType: 'realtor',
    type: 'outgoing', 
    status: 'completed', 
    duration: 342, 
    timestamp: '2023-05-10T14:30:00', 
    notes: 'Discussed property pricing in Berlin Mitte',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Discussion about property pricing trends in central Berlin. Anna mentioned expected 5% increase in Q3.',
    aiSentiment: 'positive',
  },
  { 
    id: '2', 
    contactName: 'Michael Becker', 
    contactType: 'handyman',
    type: 'incoming', 
    status: 'completed', 
    duration: 185, 
    timestamp: '2023-05-09T11:15:00', 
    notes: 'Quote for bathroom renovation',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Michael provided a quote of €4,200 for the bathroom renovation. Materials will arrive next Tuesday.',
    aiSentiment: 'neutral',
  },
  { 
    id: '3', 
    contactName: 'Christina Müller', 
    contactType: 'property_manager',
    type: 'outgoing', 
    status: 'missed', 
    duration: 0, 
    timestamp: '2023-05-08T16:45:00', 
    notes: 'Tried to reach about apartment 3B maintenance',
    recordingUrl: '',
  },
  { 
    id: '4', 
    contactName: 'Thomas Schmidt', 
    contactType: 'inspector',
    type: 'outgoing', 
    status: 'completed', 
    duration: 78, 
    timestamp: '2023-05-07T09:20:00', 
    notes: 'Scheduled property inspection',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Scheduled an inspection for next Thursday at 2pm. Thomas requested access to the basement area.',
    aiSentiment: 'positive',
  },
];

type CallType = 'incoming' | 'outgoing' | 'missed';
type CallStatus = 'in-progress' | 'completed' | 'missed' | 'scheduled';
type ContactType = 'realtor' | 'handyman' | 'property_manager' | 'inspector' | 'tenant' | 'other';
type AiSentiment = 'positive' | 'neutral' | 'negative';

interface CallRecord {
  id: string;
  contactName: string;
  contactType: ContactType;
  type: CallType;
  status: CallStatus;
  duration: number;
  timestamp: string;
  notes?: string;
  recordingUrl?: string;
  transcription?: string;
  aiSummary?: string;
  aiSentiment?: AiSentiment;
}

const CallTracker: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [calls, setCalls] = useState<CallRecord[]>(demoCallHistory);
  const [activeTab, setActiveTab] = useState('history');
  const [isRecording, setIsRecording] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  
  // Demo function to simulate starting a call
  const startCall = (contactName: string, contactType: ContactType) => {
    const newCallId = Date.now().toString();
    const newCall: CallRecord = {
      id: newCallId,
      contactName,
      contactType,
      type: 'outgoing',
      status: 'in-progress',
      duration: 0,
      timestamp: new Date().toISOString(),
    };
    
    setCalls([newCall, ...calls]);
    setActiveCallId(newCallId);
    setCallTime(0);
    setActiveTab('active-call');
    
    // In a real implementation, this would integrate with Twilio or similar
    toast({
      title: language === 'de' ? 'Anruf gestartet' : 'Call started',
      description: contactName,
    });
  };
  
  // Demo function to end a call
  const endCall = () => {
    if (!activeCallId) return;
    
    setCalls(calls.map(call => 
      call.id === activeCallId 
        ? { ...call, status: 'completed', duration: callTime }
        : call
    ));
    
    setActiveCallId(null);
    setIsRecording(false);
    setActiveTab('history');
    
    toast({
      title: language === 'de' ? 'Anruf beendet' : 'Call ended',
      description: language === 'de' 
        ? `Dauer: ${formatDuration(callTime)}` 
        : `Duration: ${formatDuration(callTime)}`,
    });
  };
  
  // Format call duration from seconds to MM:SS
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Format a date string to a readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-US', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(date);
  };
  
  // Get time since call in a friendly format
  const getTimeSince = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffDays > 0) {
      return language === 'de'
        ? `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`
        : `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    } else if (diffHours > 0) {
      return language === 'de'
        ? `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`
        : `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffMinutes > 0) {
      return language === 'de'
        ? `vor ${diffMinutes} ${diffMinutes === 1 ? 'Minute' : 'Minuten'}`
        : `${diffMinutes} ${diffMinutes === 1 ? 'minute' : 'minutes'} ago`;
    } else {
      return language === 'de' ? 'gerade eben' : 'just now';
    }
  };
  
  // Get appropriate icon for call type
  const getCallIcon = (call: CallRecord) => {
    if (call.status === 'missed') {
      return <PhoneMissed className="h-4 w-4 text-red-500" />;
    } else if (call.type === 'incoming') {
      return <PhoneIncoming className="h-4 w-4 text-green-500" />;
    } else {
      return <PhoneForwarded className="h-4 w-4 text-blue-500" />;
    }
  };
  
  // Get color for sentiment badge
  const getSentimentColor = (sentiment?: AiSentiment): string => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500 text-white';
      case 'negative': return 'bg-red-500 text-white';
      case 'neutral': 
      default: return 'bg-blue-500 text-white';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Demo function to simulate AI analysis of a call
  const analyzeCall = (callId: string) => {
    toast({
      title: language === 'de' ? 'Anruf wird analysiert' : 'Analyzing call',
      description: language === 'de' 
        ? 'KI-Analyse läuft, bitte warten...' 
        : 'AI analysis in progress, please wait...',
    });
    
    // In a real implementation, this would call an AI service for transcription and analysis
    setTimeout(() => {
      setCalls(calls.map(call => 
        call.id === callId 
          ? { 
              ...call, 
              transcription: 'Generated transcription would appear here...',
              aiSummary: 'AI summary of the call content would appear here, highlighting key points, action items, and important information.',
              aiSentiment: 'positive' as AiSentiment
            }
          : call
      ));
      
      toast({
        title: language === 'de' ? 'Analyse abgeschlossen' : 'Analysis complete',
        description: language === 'de'
          ? 'Die KI-Analyse des Anrufs wurde abgeschlossen'
          : 'AI analysis of the call has been completed',
      });
    }, 2000);
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">
          {language === 'de' ? 'Anrufverfolgung' : 'Call Tracker'}
        </CardTitle>
        <CardDescription>
          {language === 'de' ? 'Verwalten und analysieren Sie Ihre Anrufe' : 'Manage and analyze your calls'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Anrufverlauf' : 'Call History'}
            </TabsTrigger>
            <TabsTrigger value="active-call">
              <PhoneCall className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Aktiver Anruf' : 'Active Call'}
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Analysen' : 'Analytics'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="history" className="flex-grow overflow-hidden flex flex-col">
            <ScrollArea className="flex-grow">
              <div className="divide-y">
                {calls.map((call) => (
                  <div key={call.id} className="py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(call.contactName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{call.contactName}</span>
                            <span className="ml-2">{getCallIcon(call)}</span>
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(call.timestamp)}
                            <span className="mx-1">•</span>
                            {call.status !== 'missed' && (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDuration(call.duration)}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div>
                        {call.status === 'completed' && !call.aiSummary && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => analyzeCall(call.id)}
                          >
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {language === 'de' ? 'Analysieren' : 'Analyze'}
                          </Button>
                        )}
                        {call.aiSummary && (
                          <Badge 
                            variant="outline" 
                            className={getSentimentColor(call.aiSentiment)}
                          >
                            {language === 'de' ? 'Analysiert' : 'Analyzed'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {call.notes && (
                      <div className="ml-12 mt-1 text-sm text-muted-foreground">
                        {call.notes}
                      </div>
                    )}
                    
                    {call.aiSummary && (
                      <div className="ml-12 mt-2 p-3 bg-muted/50 rounded-md">
                        <div className="font-medium text-sm mb-1">
                          {language === 'de' ? 'KI-Zusammenfassung' : 'AI Summary'}
                        </div>
                        <p className="text-sm">{call.aiSummary}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {calls.length === 0 && (
                  <div className="py-8 text-center">
                    <Phone className="h-12 w-12 mx-auto text-muted-foreground opacity-30" />
                    <h3 className="mt-2 text-lg font-medium">
                      {language === 'de' ? 'Keine Anrufe' : 'No calls'}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {language === 'de' 
                        ? 'Sie haben noch keine Anrufe getätigt' 
                        : 'You have not made any calls yet'}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="active-call" className="flex-grow flex flex-col">
            {activeCallId ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-6">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                      {getInitials(calls.find(c => c.id === activeCallId)?.contactName || '')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-2xl font-bold">
                      {calls.find(c => c.id === activeCallId)?.contactName}
                    </h2>
                    <p className="text-muted-foreground">
                      {language === 'de' ? 'Aktiver Anruf' : 'Call in progress'}
                    </p>
                    <div className="text-3xl font-mono mt-4">
                      {formatDuration(callTime)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      {isRecording ? (
                        <MicOff className="h-6 w-6 text-red-500" />
                      ) : (
                        <Mic className="h-6 w-6 text-muted-foreground" />
                      )}
                    </Button>
                    
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-16 w-16 rounded-full"
                      onClick={endCall}
                    >
                      <PhoneOff className="h-8 w-8" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 rounded-full"
                      onClick={() => toast({
                        title: language === 'de' ? 'Kommt bald' : 'Coming soon',
                        description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
                      })}
                    >
                      <ArrowDownCircle className="h-6 w-6 text-muted-foreground" />
                    </Button>
                  </div>
                  
                  {isRecording && (
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span className="text-sm text-red-500">
                        {language === 'de' ? 'Aufnahme läuft' : 'Recording'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <PhoneCall className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {language === 'de' ? 'Kein aktiver Anruf' : 'No active call'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  {language === 'de' 
                    ? 'Starten Sie einen Anruf aus dem Kontaktverzeichnis' 
                    : 'Start a call from the contact directory'}
                </p>
                <Button onClick={() => startCall('Demo Contact', 'realtor')}>
                  <Phone className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'Demo-Anruf starten' : 'Start Demo Call'}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analytics" className="flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {language === 'de' ? 'Anrufe diese Woche' : 'Calls This Week'}
                </h3>
                <p className="text-3xl font-bold">{calls.length}</p>
                <Progress className="mt-2" value={75} />
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  {language === 'de' ? 'Durchschnittliche Anrufdauer' : 'Average Call Duration'}
                </h3>
                <p className="text-3xl font-bold">
                  {formatDuration(
                    calls.reduce((sum, call) => sum + call.duration, 0) / 
                    calls.filter(call => call.status === 'completed').length || 0
                  )}
                </p>
                <Progress className="mt-2" value={60} />
              </div>
            </div>
            
            <div className="border rounded-lg p-6">
              <h3 className="font-medium mb-4">
                {language === 'de' ? 'Anrufanalyse-Dashboard' : 'Call Analysis Dashboard'}
              </h3>
              
              <div className="flex items-center justify-center h-64 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <BarChart className="h-10 w-10 mx-auto text-primary/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {language === 'de' 
                      ? 'Detaillierte KI-Analysen werden hier angezeigt' 
                      : 'Detailed AI analytics will be displayed here'}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline"
          className="ml-auto"
          onClick={() => toast({
            title: language === 'de' ? 'Export gestartet' : 'Export started',
            description: language === 'de' 
              ? 'Ihre Anrufdaten werden exportiert' 
              : 'Your call data is being exported',
          })}
        >
          {language === 'de' ? 'Anrufdaten exportieren' : 'Export Call Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CallTracker;
