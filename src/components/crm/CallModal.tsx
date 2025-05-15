
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface CallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName: string;
  contactPhone: string;
  onConfirm: () => void;
  loading: boolean;
  error?: string;
}

const CallModal: React.FC<CallModalProps> = ({
  open,
  onOpenChange,
  contactName,
  contactPhone,
  onConfirm,
  loading,
  error,
}) => {
  // Enhancement: Show a simple workflow/action bar after a successful call
  const [followUp, setFollowUp] = useState<"none" | "task" | "note">("none");
  const [showAfterCall, setShowAfterCall] = useState(false);

  React.useEffect(() => {
    if (!loading && open && !error) setShowAfterCall(false);
  }, [loading, open, error]);

  const handleConfirm = () => {
    setShowAfterCall(true);
    onConfirm();
  };

  // After the call, show options for next actions (task/note)
  if (showAfterCall && !loading && !error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                {contactName}
              </div>
            </DialogTitle>
            <DialogDescription>
              Call ended. What would you like to do next?
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Button variant="outline" onClick={() => setFollowUp("task")}>
              + Add Follow-Up Task
            </Button>
            <Button variant="outline" onClick={() => setFollowUp("note")}>
              + Add Note
            </Button>
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
          {/* Could add a simple input/modal for note/task here */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Call {contactName}
            </div>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to place a call to <b>{contactName}</b> at {contactPhone}?
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="text-red-500 text-sm mb-2">{error}</div>
        )}
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading} className="w-full">
            {loading ? "Calling..." : "Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default CallModal;
