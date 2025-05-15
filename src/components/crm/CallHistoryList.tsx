
import React from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, PhoneCall, PhoneIncoming, PhoneMissed, PhoneForwarded, MessageSquare, Calendar, Clock, BarChart } from "lucide-react";
import { formatDate, formatDuration, getInitials } from "./callUtils";
import { ScrollArea } from '@/components/ui/scroll-area';

export type CallRecordSimple = {
  id: string;
  contactName: string;
  type: string;
  status: string;
  duration: number;
  timestamp: string;
  notes?: string;
  aiSummary?: string;
  aiSentiment?: string;
  onAnalyze?: () => void;
};

interface CallHistoryListProps {
  calls: CallRecordSimple[];
  language: string;
  onAnalyze?: (id: string) => void;
}

const getCallIcon = (call: CallRecordSimple) => {
  if (call.status === 'missed') {
    return <PhoneMissed className="h-4 w-4 text-red-500" />;
  } else if (call.type === 'incoming') {
    return <PhoneIncoming className="h-4 w-4 text-green-500" />;
  } else {
    return <PhoneForwarded className="h-4 w-4 text-blue-500" />;
  }
};

const getSentimentColor = (sentiment?: string): string => {
  switch (sentiment) {
    case 'positive': return 'bg-green-500 text-white';
    case 'negative': return 'bg-red-500 text-white';
    case 'neutral': 
    default: return 'bg-blue-500 text-white';
  }
};

const CallHistoryList: React.FC<CallHistoryListProps> = ({ calls, language, onAnalyze }) => (
  <ScrollArea className="flex-grow">
    <div className="divide-y">
      {calls.map((call) => (
        <div key={call.id} className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary/10 text-primary">{getInitials(call.contactName)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center">
                  <span className="font-medium">{call.contactName}</span>
                  <span className="ml-2">{getCallIcon(call)}</span>
                </div>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {formatDate(call.timestamp, language)}
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
              {call.status === 'completed' && !call.aiSummary && onAnalyze && (
                <Button variant="outline" size="sm" onClick={() => onAnalyze(call.id)}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  {language === 'de' ? 'Analysieren' : 'Analyze'}
                </Button>
              )}
              {call.aiSummary && (
                <Badge variant="outline" className={getSentimentColor(call.aiSentiment)}>
                  {language === 'de' ? 'Analysiert' : 'Analyzed'}
                </Badge>
              )}
            </div>
          </div>
          {call.notes && (
            <div className="ml-12 mt-1 text-sm text-muted-foreground">{call.notes}</div>
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
          <h3 className="mt-2 text-lg font-medium">{language === 'de' ? 'Keine Anrufe' : 'No calls'}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{language === 'de' ? 'Sie haben noch keine Anrufe getätigt' : 'You have not made any calls yet'}</p>
        </div>
      )}
    </div>
  </ScrollArea>
);

export default CallHistoryList;
