import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PhoneCall, User, History, Settings, FileText, Briefcase, List } from 'lucide-react';
import ContactManager from '@/components/crm/ContactManager';
import CallTracker from '@/components/crm/CallTracker';
import CallModal from "@/components/crm/CallModal";
import CompanyManager from "@/components/crm/CompanyManager";
import TaskManager from "@/components/crm/TaskManager";
import { Button } from '@/components/ui/button';

const CRMPage: React.FC = () => {
  const { language } = useLanguage();
  const [callModalOpen, setCallModalOpen] = React.useState(false);
  const [selectedContact, setSelectedContact] = React.useState<{ name: string; phone: string } | null>(null);
  const [callHistory, setCallHistory] = React.useState<{ name: string; phone: string; timestamp: string }[]>([]);
  const [callInProgress, setCallInProgress] = React.useState(false);
  const [callError, setCallError] = React.useState<string | undefined>();
  const [customPhone, setCustomPhone] = React.useState<string>('');

  // Handler: open modal from ContactManager
  const handleInitiateCall = (name: string, phone: string) => {
    setSelectedContact({ name, phone });
    setCallError(undefined);
    setCallModalOpen(true);
  };

  // Handler: manual/custom call
  const handleInitiateCustomCall = () => {
    if (!customPhone) return;
    setSelectedContact({ name: 'Custom', phone: customPhone });
    setCallError(undefined);
    setCallModalOpen(true);
  };

  // Handler: actually perform the call
  const handleConfirmCall = async () => {
    if (!selectedContact) return;
    setCallInProgress(true);
    setCallError(undefined);
    try {
      const res = await fetch(
        "https://vibylylkqsdouaeebpye.functions.supabase.co/call-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toPhone: selectedContact.phone }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setCallError(data.error || "Unknown error");
      } else {
        setCallModalOpen(false);
        setCallHistory([
          { name: selectedContact.name, phone: selectedContact.phone, timestamp: new Date().toISOString() },
          ...callHistory,
        ]);
      }
    } catch (err: any) {
      setCallError("Call failed: " + (err?.message || "Unknown error"));
    } finally {
      setCallInProgress(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {language === "de" ? "Kontakt Management" : "Contact Management"}
        </h1>
        <p className="text-muted-foreground">
          {language === "de"
            ? "Verwalten Sie Ihre Immobilienkontakte und verfolgen Sie Anrufe, Aufgaben und Firmen"
            : "Manage your real estate contacts, calls, tasks, and companies"}
        </p>
      </div>
      
      {/* Custom call field for any phone number */}
      <div className="mb-4 flex gap-2 items-end">
        <div>
          <label className="block text-sm font-medium" htmlFor="custom-phone">
            {language === 'de' ? 'Direktwahl' : 'Custom Dial'}
          </label>
          <input
            id="custom-phone"
            className="input border px-3 py-2 rounded-md"
            type="tel"
            inputMode="tel"
            placeholder={language === 'de' ? 'Telefonnummer eingeben' : 'Enter phone number'}
            value={customPhone}
            onChange={e => setCustomPhone(e.target.value)}
          />
        </div>
        <Button
          type="button"
          onClick={handleInitiateCustomCall}
          disabled={!customPhone}
          className="h-[38px]"
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Anrufen' : 'Call'}
        </Button>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 max-w-2xl">
          <TabsTrigger value="contacts">
            <User className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Kontakte' : 'Contacts'}
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Briefcase className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Firmen' : 'Companies'}
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <List className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Aufgaben' : 'Tasks'}
          </TabsTrigger>
          <TabsTrigger value="calls">
            <PhoneCall className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Anrufe' : 'Calls'}
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Verlauf' : 'History'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" />
            {language === 'de' ? 'Einstellungen' : 'Settings'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="contacts">
          <ContactManager
            onInitiateCall={handleInitiateCall}
          />
        </TabsContent>
        <TabsContent value="companies">
          <CompanyManager />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskManager />
        </TabsContent>
        <TabsContent value="calls">
          <CallTracker callHistory={callHistory} />
        </TabsContent>
        <TabsContent value="history">
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/30">
            <FileText className="h-12 w-12 text-muted-foreground mb-3" />
            <h2 className="text-lg font-medium">
              {language === 'de' ? 'Anrufverlauf & Berichte' : 'Call History & Reports'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'de' 
                ? 'Diese Funktion wird in Kürze verfügbar sein' 
                : 'This feature will be available soon'}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <div className="flex flex-col items-center justify-center h-64 border rounded-lg bg-muted/30">
            <Settings className="h-12 w-12 text-muted-foreground mb-3" />
            <h2 className="text-lg font-medium">
              {language === 'de' ? 'CRM-Einstellungen' : 'CRM Settings'}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {language === 'de' 
                ? 'Konfigurationsoptionen werden in Kürze verfügbar sein' 
                : 'Configuration options will be available soon'}
            </p>
          </div>
        </TabsContent>
      </Tabs>
      {/* Call pop-up/modal (global) */}
      <CallModal
        open={callModalOpen}
        onOpenChange={setCallModalOpen}
        contactName={selectedContact?.name || ""}
        contactPhone={selectedContact?.phone || ""}
        onConfirm={handleConfirmCall}
        loading={callInProgress}
        error={callError}
      />
    </div>
  );
};

export default CRMPage;
