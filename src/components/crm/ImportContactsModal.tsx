
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Import, AlertCircle, Check, Smartphone, File, FileCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { importIPhoneContacts, ImportedContact, filterDuplicateContacts } from '@/utils/contactImport';

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactsImported: (contacts: any[]) => void;
  existingContacts?: any[];
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({ 
  open, 
  onOpenChange,
  onContactsImported,
  existingContacts = []
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [importStage, setImportStage] = useState<'initial' | 'importing' | 'success' | 'error'>('initial');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'iphone' | 'file'>('iphone');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importedContacts, setImportedContacts] = useState<ImportedContact[]>([]);

  const startIPhoneImport = async () => {
    setImportStage('importing');
    setProgress(0);

    try {
      // Simulate progressive loading
      for (let i = 0; i <= 50; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Import contacts using our utility function
      const contacts = await importIPhoneContacts();
      
      // Filter out duplicates
      const uniqueContacts = await filterDuplicateContacts(contacts, existingContacts);
      setImportedContacts(uniqueContacts);

      // Complete the progress bar
      for (let i = 51; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Show success state
      setImportStage('success');
      
      // Notify parent component about the imported contacts
      onContactsImported(uniqueContacts);
      
      // Show success toast
      toast({
        title: language === 'de' ? 'Kontakte erfolgreich importiert' : 'Contacts imported successfully',
        description: language === 'de' 
          ? `${uniqueContacts.length} Kontakte wurden importiert` 
          : `${uniqueContacts.length} contacts have been imported`,
      });

      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false);
        setImportStage('initial');
      }, 2000);
      
    } catch (error) {
      // Handle error
      setImportStage('error');
      setErrorMessage(error instanceof Error ? error.message : 
        language === 'de' ? 'Unbekannter Fehler' : 'Unknown error');
      
      toast({
        title: language === 'de' ? 'Import fehlgeschlagen' : 'Import failed',
        description: error instanceof Error ? error.message : 
          language === 'de' ? 'Unbekannter Fehler ist aufgetreten' : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCsvFile(e.target.files[0]);
    }
  };

  const startFileImport = async () => {
    if (!csvFile) {
      toast({
        title: language === 'de' ? 'Keine Datei ausgewählt' : 'No file selected',
        description: language === 'de'
          ? 'Bitte wählen Sie eine CSV-Datei aus'
          : 'Please select a CSV file',
        variant: 'destructive'
      });
      return;
    }

    setImportStage('importing');
    setProgress(0);

    try {
      // Simulate file reading and parsing
      for (let i = 0; i <= 60; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Mock CSV parsing - in a real implementation, we would parse the CSV file
      const mockImportedContacts: ImportedContact[] = [
        {
          id: `csv-${Date.now()}-1`,
          name: 'Michael Weber',
          phone: '+49 151 87654321',
          email: 'michael@example.com',
          source: 'csv',
          importDate: new Date().toISOString()
        },
        {
          id: `csv-${Date.now()}-2`,
          name: 'Sandra Fischer',
          phone: '+49 152 12345678',
          email: 'sandra@example.com',
          source: 'csv',
          importDate: new Date().toISOString()
        }
      ];

      // Filter out duplicates
      const uniqueContacts = await filterDuplicateContacts(mockImportedContacts, existingContacts);
      setImportedContacts(uniqueContacts);

      // Complete the progress bar
      for (let i = 61; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }

      // Show success state
      setImportStage('success');
      
      // Notify parent component about the imported contacts
      onContactsImported(uniqueContacts);
      
      // Show success toast
      toast({
        title: language === 'de' ? 'Kontakte erfolgreich importiert' : 'Contacts imported successfully',
        description: language === 'de' 
          ? `${uniqueContacts.length} Kontakte wurden importiert` 
          : `${uniqueContacts.length} contacts have been imported`,
      });

      // Auto-close after success
      setTimeout(() => {
        onOpenChange(false);
        setImportStage('initial');
        setCsvFile(null);
      }, 2000);

    } catch (error) {
      // Handle error
      setImportStage('error');
      setErrorMessage(error instanceof Error ? error.message : 
        language === 'de' ? 'Unbekannter Fehler' : 'Unknown error');
      
      toast({
        title: language === 'de' ? 'Import fehlgeschlagen' : 'Import failed',
        description: error instanceof Error ? error.message : 
          language === 'de' ? 'Unbekannter Fehler ist aufgetreten' : 'An unknown error occurred',
        variant: 'destructive'
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'de' ? 'Kontakte importieren' : 'Import Contacts'}
          </DialogTitle>
          <DialogDescription>
            {language === 'de' 
              ? 'Importieren Sie Kontakte aus verschiedenen Quellen' 
              : 'Import contacts from various sources'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {importStage === 'initial' && (
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'iphone' | 'file')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="iphone">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'iPhone' : 'iPhone'}
                </TabsTrigger>
                <TabsTrigger value="file">
                  <File className="h-4 w-4 mr-2" />
                  {language === 'de' ? 'CSV-Datei' : 'CSV File'}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="iphone" className="mt-4">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Smartphone className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {language === 'de' ? 'iPhone Kontakte' : 'iPhone Contacts'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'de' 
                        ? 'Wir werden Sie bitten, den Zugriff auf Ihre Kontakte zu autorisieren' 
                        : 'We will ask you to authorize access to your contacts'}
                    </p>
                  </div>
                  <Button onClick={startIPhoneImport}>
                    <Import className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Import starten' : 'Start Import'}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-4">
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <File className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">
                      {language === 'de' ? 'CSV-Datei' : 'CSV File'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === 'de' 
                        ? 'Wählen Sie eine CSV-Datei mit Kontaktdaten aus' 
                        : 'Select a CSV file containing contact data'}
                    </p>
                  </div>
                  <div className="w-full">
                    <Input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'de' 
                        ? 'Format: Name, E-Mail, Telefon (CSV)' 
                        : 'Format: Name, Email, Phone (CSV)'}
                    </p>
                  </div>
                  <Button 
                    onClick={startFileImport}
                    disabled={!csvFile}
                  >
                    <Import className="h-4 w-4 mr-2" />
                    {language === 'de' ? 'Import starten' : 'Start Import'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          {importStage === 'importing' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {language === 'de' ? 'Importiere...' : 'Importing...'}
                </span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                {language === 'de' 
                  ? 'Bitte warten Sie, während wir Ihre Kontakte importieren' 
                  : 'Please wait while we import your contacts'}
              </p>
            </div>
          )}

          {importStage === 'success' && (
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Check className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="font-medium text-lg">
                {language === 'de' ? 'Import abgeschlossen' : 'Import complete'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {language === 'de'
                  ? `${importedContacts.length} Kontakte erfolgreich importiert`
                  : `${importedContacts.length} contacts successfully imported`}
              </p>
            </div>
          )}

          {importStage === 'error' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {language === 'de' ? 'Fehler' : 'Error'}
              </AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex sm:justify-between">
          {importStage === 'initial' && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Button>
          )}
          
          {importStage === 'error' && (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {language === 'de' ? 'Schließen' : 'Close'}
              </Button>
              <Button onClick={() => setImportStage('initial')}>
                {language === 'de' ? 'Erneut versuchen' : 'Try Again'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportContactsModal;
