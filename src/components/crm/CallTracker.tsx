import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Clock, 
  BarChart
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import ActiveCallPanel from './ActiveCallPanel';
import CallHistoryList from './CallHistoryList';
import CallAnalyticsPanel from './CallAnalyticsPanel';
import { formatDuration, getInitials } from './callUtils';

// Demo call history data
const demoCallHistory = [
  { 
    id: '1', 
    contactName: 'Anna Weber', 
    contactType: 'realtor' as const,
    type: 'outgoing' as const, 
    status: 'completed' as const, 
    duration: 342, 
    timestamp: '2023-05-10T14:30:00', 
    notes: 'Discussed property pricing in Berlin Mitte',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Discussion about property pricing trends in central Berlin. Anna mentioned expected 5% increase in Q3.',
    aiSentiment: 'positive' as const,
  },
  { 
    id: '2', 
    contactName: 'Michael Becker', 
    contactType: 'handyman' as const,
    type: 'incoming' as const, 
    status: 'completed' as const, 
    duration: 185, 
    timestamp: '2023-05-09T11:15:00', 
    notes: 'Quote for bathroom renovation',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Michael provided a quote of €4,200 for the bathroom renovation. Materials will arrive next Tuesday.',
    aiSentiment: 'neutral' as const,
  },
  { 
    id: '3', 
    contactName: 'Christina Müller', 
    contactType: 'property_manager' as const,
    type: 'outgoing' as const, 
    status: 'missed' as const, 
    duration: 0, 
    timestamp: '2023-05-08T16:45:00', 
    notes: 'Tried to reach about apartment 3B maintenance',
    recordingUrl: '',
  },
  { 
    id: '4', 
    contactName: 'Thomas Schmidt', 
    contactType: 'inspector' as const,
    type: 'outgoing' as const, 
    status: 'completed' as const, 
    duration: 78, 
    timestamp: '2023-05-07T09:20:00', 
    notes: 'Scheduled property inspection',
    recordingUrl: '',
    transcription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    aiSummary: 'Scheduled an inspection for next Thursday at 2pm. Thomas requested access to the basement area.',
    aiSentiment: 'positive' as const,
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

interface CallHistoryEntry {
  name: string;
  phone: string;
  timestamp: string;
}
interface CallTrackerProps {
  callHistory: CallHistoryEntry[];
}
const CallTracker: React.FC<CallTrackerProps> = ({ callHistory }) => {
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
            <div className="mb-3">
              <h4 className="font-medium mb-1">Recent Calls (Realtime)</h4>
              {callHistory.length > 0 ? (
                <ul className="pl-2 space-y-1">
                  {callHistory.map((entry, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <Phone className="h-3 w-3 text-primary" />
                      <span>{entry.name} ({entry.phone})</span>
                      <span className="ml-2 text-muted-foreground text-xs">{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-muted-foreground text-xs">No recent calls</span>
              )}
            </div>
            <CallHistoryList
              calls={calls}
              language={language}
              onAnalyze={analyzeCall}
            />
          </TabsContent>
          
          <TabsContent value="active-call" className="flex-grow flex flex-col">
            {activeCallId ? (
              <ActiveCallPanel
                contactName={calls.find(c => c.id === activeCallId)?.contactName || ''}
                isRecording={isRecording}
                callTime={callTime}
                onToggleRecording={() => setIsRecording(!isRecording)}
                onEndCall={endCall}
                language={language}
              />
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
            <CallAnalyticsPanel />
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
