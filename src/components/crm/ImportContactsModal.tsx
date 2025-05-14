
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Import, AlertCircle, Check, Smartphone } from 'lucide-react';

interface ImportContactsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactsImported: (contacts: any[]) => void;
}

const ImportContactsModal: React.FC<ImportContactsModalProps> = ({ 
  open, 
  onOpenChange,
  onContactsImported
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [importStage, setImportStage] = useState<'initial' | 'importing' | 'success' | 'error'>('initial');
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startImport = async () => {
    setImportStage('importing');
    setProgress(0);

    try {
      // In a real implementation, this would use the iOS Capacitor Contacts plugin
      // Since we're in a web environment, we'll simulate the import process
      
      // Simulate progressive loading
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setProgress(i);
      }

      // Mock successful import of contacts
      const mockContacts = [
        { id: 'c1', name: 'John Smith', email: 'john@example.com', phone: '+1 555-123-4567' },
        { id: 'c2', name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 555-987-6543' },
        { id: 'c3', name: 'Alex Chen', email: 'alex@example.com', phone: '+1 555-456-7890' },
        { id: 'c4', name: 'Sara Johnson', email: 'sara@example.com', phone: '+1 555-789-0123' },
      ];

      // Notify parent component about the imported contacts
      onContactsImported(mockContacts);
      
      // Show success state
      setImportStage('success');
      
      // Show success toast
      toast({
        title: language === 'de' ? 'Kontakte erfolgreich importiert' : 'Contacts imported successfully',
        description: language === 'de' 
          ? `${mockContacts.length} Kontakte wurden importiert` 
          : `${mockContacts.length} contacts have been imported`,
        variant: 'success'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {language === 'de' ? 'Kontakte importieren' : 'Import Contacts'}
          </DialogTitle>
          <DialogDescription>
            {language === 'de' 
              ? 'Importieren Sie Kontakte direkt von Ihrem iPhone Adressbuch' 
              : 'Import contacts directly from your iPhone address book'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {importStage === 'initial' && (
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
            </div>
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
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </Button>
              <Button onClick={startImport}>
                <Import className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Import starten' : 'Start Import'}
              </Button>
            </>
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
