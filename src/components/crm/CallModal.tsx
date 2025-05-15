
import React from "react";
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
          <Button onClick={onConfirm} disabled={loading} className="w-full">
            {loading ? "Calling..." : "Call"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CallModal;
