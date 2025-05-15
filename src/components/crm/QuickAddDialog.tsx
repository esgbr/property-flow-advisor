
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// Unified label map with optional phone/due
const labelMap = {
  contact: { main: "Add New Contact", name: "Name", phone: "Phone" },
  company: { main: "Add New Company", name: "Company Name", phone: "Phone" },
  task: { main: "Add Task", name: "Title", due: "Due Date" },
} as const;

// Props for the QuickAdd dialog
type QuickAddDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "contact" | "company" | "task";
  prefill?: { name?: string; phone?: string };
  onCreated?: (data: any) => void;
};

export const QuickAddDialog: React.FC<QuickAddDialogProps> = ({
  open,
  onOpenChange,
  type,
  prefill,
  onCreated,
}) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [form, setForm] = useState<{ [key: string]: string }>({
    name: prefill?.name || "",
    phone: prefill?.phone || "",
    due: "",
    title: "",
  });
  const [loading, setLoading] = useState(false);

  const onField = (field: string, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  // Dynamic current labels based on dialog type
  const curLabels =
    type === "contact"
      ? labelMap.contact
      : type === "company"
      ? labelMap.company
      : labelMap.task;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast({
        title: language === "de" ? "Angelegt!" : "Created!",
        description:
          type === "contact"
            ? language === "de"
              ? "Neuer Kontakt gespeichert"
              : "Contact saved"
            : type === "company"
            ? language === "de"
              ? "Neue Firma gespeichert"
              : "Company saved"
            : language === "de"
            ? "Task gespeichert"
            : "Task saved",
      });
      setLoading(false);
      if (onCreated) onCreated(form);
      onOpenChange(false);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label={curLabels.main}
        >
          <DialogHeader>
            <DialogTitle>
              {language === "de"
                ? type === "contact"
                  ? "Neuen Kontakt anlegen"
                  : type === "company"
                  ? "Neue Firma anlegen"
                  : "Neue Aufgabe anlegen"
                : curLabels.main}
            </DialogTitle>
            <DialogDescription>
              {language === "de"
                ? "Füllen Sie das Formular aus und klicken Sie auf Anlegen"
                : "Fill out the form and click Create"}
            </DialogDescription>
          </DialogHeader>
          {/* Always show name/title field */}
          <div>
            <label
              htmlFor="quickadd-name"
              className="block text-sm font-medium"
            >
              {language === "de" && type === "company"
                ? "Firmenname"
                : language === "de" && type === "task"
                ? "Titel"
                : language === "de"
                ? "Name"
                : curLabels.name}
            </label>
            <Input
              id="quickadd-name"
              required
              value={form.name}
              onChange={(e) => onField("name", e.target.value)}
              aria-label={curLabels.name}
              aria-required="true"
              className="mb-1"
              autoFocus
            />
          </div>
          {/* Only show phone for contact/company */}
          {(type === "contact" || type === "company") && (
            <div>
              <label
                htmlFor="quickadd-phone"
                className="block text-sm font-medium"
              >
                {language === "de" ? "Telefonnummer" : labelMap.contact.phone}
              </label>
              <Input
                id="quickadd-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => onField("phone", e.target.value)}
                aria-label={
                  type === "contact"
                    ? labelMap.contact.phone
                    : labelMap.company.phone
                }
                className="mb-1"
                minLength={5}
                maxLength={20}
              />
            </div>
          )}
          {/* Only show due date for task */}
          {type === "task" && (
            <div>
              <label
                htmlFor="quickadd-due"
                className="block text-sm font-medium"
              >
                {language === "de" ? "Fälligkeitsdatum" : labelMap.task.due}
              </label>
              <Input
                id="quickadd-due"
                type="date"
                value={form.due}
                onChange={(e) => onField("due", e.target.value)}
                aria-label={labelMap.task.due}
                className="mb-1"
              />
            </div>
          )}
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full">
              {loading
                ? language === "de"
                  ? "Speichern ..."
                  : "Saving ..."
                : language === "de"
                ? "Anlegen"
                : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
