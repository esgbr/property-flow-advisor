import React from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PhoneCall, User, History, Settings, FileText, Briefcase, List, Phone, Info } from 'lucide-react'
import ContactManager from '@/components/crm/ContactManager'
import CompanyManager from "@/components/crm/CompanyManager"
import TaskManager from "@/components/crm/TaskManager"
import { Button } from '@/components/ui/button'
import DialPadInput from "@/components/crm/DialPadInput"
import CallHistoryList from '@/components/crm/CallHistoryList'
import ActiveCallPanel from '@/components/crm/ActiveCallPanel'
import CallAnalyticsPanel from '@/components/crm/CallAnalyticsPanel'
import CallModal from '@/components/crm/CallModal'
import { formatDate } from '@/components/crm/callUtils'
import { toast } from "@/hooks/use-toast"
import { QuickAddDialog } from "@/components/crm/QuickAddDialog";

const CRMPage: React.FC = () => {
  const { language } = useLanguage()
  const [callModalOpen, setCallModalOpen] = React.useState(false)
  const [selectedContact, setSelectedContact] = React.useState<{ name: string, phone: string } | null>(null)
  const [callHistory, setCallHistory] = React.useState<{ name: string, phone: string, timestamp: string }[]>([])
  const [callInProgress, setCallInProgress] = React.useState(false)
  const [callError, setCallError] = React.useState<string | undefined>()
  const [customPhone, setCustomPhone] = React.useState<string>('')

  // New: After-call actions
  const [showAfterCallModal, setShowAfterCallModal] = React.useState(false)
  const [lastCallContact, setLastCallContact] = React.useState<{ name: string, phone: string } | null>(null)

  // QuickAdd dialog state for after-call or missed call creation
  const [quickAdd, setQuickAdd] = React.useState<{ open: boolean; type: "contact" | "company" | "task"; prefill?: any } | null>(null);

  // Handler: open modal from ContactManager
  const handleInitiateCall = (name: string, phone: string) => {
    setSelectedContact({ name, phone })
    setCallError(undefined)
    setCallModalOpen(true)
  }

  // Handler: manual/custom call (with feedback/error)
  const handleInitiateCustomCall = () => {
    if (!customPhone) {
      toast({
        variant: "destructive",
        title: language === "de" ? "Fehler" : "Error",
        description: language === "de" ? "Bitte Telefonnummer eingeben." : "Please enter a phone number."
      })
      return
    }
    setSelectedContact({ name: 'Custom', phone: customPhone })
    setCallError(undefined)
    setCallModalOpen(true)
  }

  // Handler: actually perform the call
  const handleConfirmCall = async () => {
    if (!selectedContact) return;
    setCallInProgress(true)
    setCallError(undefined)
    try {
      const res = await fetch(
        "https://vibylylkqsdouaeebpye.functions.supabase.co/call-contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toPhone: selectedContact.phone }),
        }
      )
      const data = await res.json()
      // Log for debugging edge function
      // eslint-disable-next-line no-console
      console.log("Call function response:", data)

      if (!res.ok) {
        setCallError(data.error || "Unknown error")
        toast({
          variant: "destructive",
          title: language === "de" ? "Anruffehler" : "Call error",
          description: data.error || (language === "de" ? "Unbekannter Fehler" : "Unknown error")
        })
      } else {
        // Show after-call workflow with action options
        setCallModalOpen(false)
        setShowAfterCallModal(true)
        setLastCallContact(selectedContact)
        setCallHistory([
          { name: selectedContact.name, phone: selectedContact.phone, timestamp: new Date().toISOString() },
          ...callHistory
        ])
        toast({
          title: language === "de" ? "Anruf gestartet" : "Call started",
          description: `${selectedContact.name} (${selectedContact.phone})`
        })
      }
    } catch (err: any) {
      setCallError("Call failed: " + (err?.message || "Unknown error"))
      toast({
        variant: "destructive",
        title: language === "de" ? "Netzwerkfehler" : "Network error",
        description: err?.message || "Call failed. Please try again."
      })
    } finally {
      setCallInProgress(false)
      setCustomPhone('') // Clear after attempt for usability
    }
  }

  // After-call workflow: moving to task or note manager
  const handleAfterCallAction = (action: "task" | "note", contact?: { name: string, phone: string }) => {
    toast({
      title: action === "task"
        ? language === "de" ? "Task erstellen" : "Create follow-up task"
        : language === "de" ? "Notiz erstellen" : "Create note",
      description: contact?.name
        ? (language === "de"
          ? `Für ${contact.name}`
          : `For ${contact.name}`)
        : ""
    })
    // Simple routing simulation: scroll to Tasks tab and prefill is out-of-scope for now
    setShowAfterCallModal(false)
    // (Could deep-link or set state to prefill contact info in TaskManager/NoteManager)
  }

  // Add logic to trigger QuickAdd after missed call. Example below is for after call modal close, can be reused elsewhere (e.g., missed call row or action):
  const handleMissedCall = (contactName: string, contactPhone: string) => {
    toast({
      title: language === "de" ? "Anruf verpasst" : "Missed call",
      description: language === "de"
        ? "Neuen Kontakt, Firma oder Task anlegen?"
        : "Add a contact, company, or task?",
    });
    setQuickAdd({ open: true, type: "contact", prefill: { name: contactName, phone: contactPhone } });
  };

  // Listen for a custom event from CallHistoryList's "add" button
  React.useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail?.type && (e as CustomEvent).detail.type === "quickadd") {
        setQuickAdd({
          open: true,
          type: (e as CustomEvent).detail.entity,
          prefill: (e as CustomEvent).detail.prefill,
        });
      }
    };
    window.addEventListener("crmQuickAdd", handler);
    return () => window.removeEventListener("crmQuickAdd", handler);
  }, []);

  return (
    <div className="container mx-auto py-6 max-w-5xl">
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
      {/* DialPadInput with contextual help and better accessibility */}
      <div className="mb-6 max-w-xl">
        <DialPadInput
          phone={customPhone}
          setPhone={setCustomPhone}
          onCall={handleInitiateCustomCall}
          disabled={callInProgress}
          label={
            <span>
              {language === "de" ? "Manuelle Telefonnummer wählen" : "Manual Dial"}
              <span
                className="ml-2 text-sm text-muted-foreground inline-flex items-center"
                aria-label={language === "de"
                  ? "Geben Sie die vollständige Nummer ein und klicken Sie zum Wählen"
                  : "Enter full phone number and click to dial"}
              >
                <Info className="h-4 w-4 mr-1" aria-hidden />
                {language === "de"
                  ? "Nummer mit Landesvorwahl eingeben (z.B. +49...)"
                  : "Include country code (e.g. +1, +49...)"}
              </span>
            </span>
          }
          placeholder={language === "de" ? "Telefonnummer eingeben" : "Enter phone number"}
        />
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
          {/* Improved call list with margin/padding */}
          <div className="mb-3">
            <h4 className="font-medium mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {language === "de" ? "Letzte Anrufe (Echtzeit)" : "Recent Calls (Realtime)"}
            </h4>
            {callHistory.length > 0 ? (
              <ul className="pl-2 space-y-1">
                {callHistory.map((entry, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm">
                    <Phone className="h-3 w-3 text-primary" aria-label="Recent call" />
                    <span>{entry.name} ({entry.phone})</span>
                    <span className="ml-2 text-muted-foreground text-xs">
                      {formatDate(entry.timestamp, language)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-muted-foreground text-xs">
                {language === "de" ? "Keine letzten Anrufe" : "No recent calls"}
              </span>
            )}
          </div>
          <CallHistoryList
            calls={callHistory.map((c, i) => ({
              ...c,
              id: `history-${i}`,
              contactName: c.name,
              type: "outgoing",
              status: "completed",
              duration: 0,
              timestamp: c.timestamp,
            }))}
            language={language}
          />
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
      {/* Call pop-up/modal */}
      <CallModal
        open={callModalOpen}
        onOpenChange={setCallModalOpen}
        contactName={selectedContact?.name || ""}
        contactPhone={selectedContact?.phone || ""}
        onConfirm={handleConfirmCall}
        loading={callInProgress}
        error={callError}
      />
      {/* After call workflow modal */}
      {/* Could be refactored to a separate component for maintainability */}
      {showAfterCallModal && lastCallContact && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-xs w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xl font-bold">
                {language === "de" ? "Nächste Schritte" : "Next Steps"}
              </div>
              <div className="text-muted-foreground text-sm">
                {language === "de"
                  ? "Was möchten Sie als nächstes tun?"
                  : "What would you like to do next?"}
              </div>
              <div className="font-semibold mt-1">{lastCallContact.name}</div>
            </div>
            <Button
              variant="outline"
              onClick={() => handleAfterCallAction("task", lastCallContact)}
            >
              + {language === "de" ? "Task erstellen" : "Add Follow-up Task"}
            </Button>
            <Button
              variant="outline"
              onClick={() => handleAfterCallAction("note", lastCallContact)}
            >
              + {language === "de" ? "Notiz erstellen" : "Add Note"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowAfterCallModal(false)}
            >
              {language === "de" ? "Schließen" : "Close"}
            </Button>
          </div>
        </div>
      )}
      {/* Place QuickAddDialog at root so it overlays page as needed */}
      {quickAdd && (
        <QuickAddDialog
          open={quickAdd.open}
          onOpenChange={(v) => setQuickAdd(q => q ? { ...q, open: v } : null)}
          type={quickAdd.type}
          prefill={quickAdd.prefill}
          onCreated={() => {
            toast({
              title: language === "de" ? "Gespeichert" : "Saved",
              description: language === "de"
                ? "Neuer Eintrag wurde erstellt"
                : "New record created",
            });
            setQuickAdd(null);
          }}
        />
      )}
    </div>
  )
}

export default CRMPage
