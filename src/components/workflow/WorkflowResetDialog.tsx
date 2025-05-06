
import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType } from '@/hooks/use-workflow';
import { workflowDefinitions } from '@/data/workflow-definitions';

interface WorkflowResetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isResetting: boolean;
  workflowType: WorkflowType;
}

/**
 * Dialog to confirm workflow reset action
 */
const WorkflowResetDialog: React.FC<WorkflowResetDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  isResetting,
  workflowType
}) => {
  const { language } = useLanguage();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {language === 'de'
              ? `Workflow "${workflowDefinitions[workflowType].title.de}" zurücksetzen?`
              : `Reset "${workflowDefinitions[workflowType].title.en}" workflow?`
            }
          </DialogTitle>
          <DialogDescription>
            {language === 'de'
              ? 'Dies wird den Fortschritt und alle gespeicherten Daten für diesen Workflow löschen. Diese Aktion kann nicht rückgängig gemacht werden.'
              : 'This will delete all progress and saved data for this workflow. This action cannot be undone.'
            }
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isResetting}
          >
            {language === 'de' ? 'Abbrechen' : 'Cancel'}
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isResetting}
          >
            {isResetting
              ? (language === 'de' ? 'Wird zurückgesetzt...' : 'Resetting...')
              : (language === 'de' ? 'Ja, zurücksetzen' : 'Yes, reset')
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowResetDialog;
