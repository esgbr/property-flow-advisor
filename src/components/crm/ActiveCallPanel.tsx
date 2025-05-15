
import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, ArrowDownCircle, PhoneOff, PhoneCall } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDuration, getInitials } from "./callUtils";

type ActiveCallPanelProps = {
  contactName: string;
  isRecording: boolean;
  callTime: number;
  onToggleRecording: () => void;
  onEndCall: () => void;
  language: string;
};

const ActiveCallPanel: React.FC<ActiveCallPanelProps> = ({
  contactName,
  isRecording,
  callTime,
  onToggleRecording,
  onEndCall,
  language,
}) => (
  <div className="flex flex-col items-center justify-center h-full">
    <div className="text-center space-y-6">
      <Avatar className="h-24 w-24 mx-auto">
        <AvatarFallback className="text-3xl bg-primary/10 text-primary">
          {getInitials(contactName)}
        </AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{contactName}</h2>
        <p className="text-muted-foreground">
          {language === "de" ? "Aktiver Anruf" : "Call in progress"}
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
          onClick={onToggleRecording}
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
          onClick={onEndCall}
        >
          <PhoneOff className="h-8 w-8" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={() => alert(language === "de" ? "Diese Funktion wird bald verfügbar sein" : "This feature will be available soon")}
        >
          <ArrowDownCircle className="h-6 w-6 text-muted-foreground" />
        </Button>
      </div>
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-sm text-red-500">
            {language === "de" ? "Aufnahme läuft" : "Recording"}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default ActiveCallPanel;
