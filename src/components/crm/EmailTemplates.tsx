
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Copy, CheckCircle2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  tags: string[];
  createdAt: string;
}

// Mock data - in a real app, this would be fetched from an API
const mockTemplates: EmailTemplate[] = [
  {
    id: 't1',
    name: 'Initial Contact',
    subject: 'Property Inquiry Follow-Up',
    body: `Dear {{name}},\n\nThank you for your interest in our real estate services. Based on our conversation, I've put together some property options that match your criteria.\n\nI would be happy to schedule viewings at your convenience.\n\nBest regards,\n{{agent_name}}`,
    tags: ['inquiry', 'follow-up'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() // 1 week ago
  },
  {
    id: 't2',
    name: 'Viewing Confirmation',
    subject: 'Confirmation: Property Viewing on {{date}}',
    body: `Dear {{name}},\n\nI'm writing to confirm our appointment to view the property at {{address}} on {{date}} at {{time}}.\n\nPlease let me know if you need any additional information before our meeting.\n\nLooking forward to seeing you!\n\nBest regards,\n{{agent_name}}`,
    tags: ['viewing', 'appointment'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() // 2 weeks ago
  },
  {
    id: 't3',
    name: 'Thank You After Viewing',
    subject: 'Thank You for Viewing {{property_name}}',
    body: `Dear {{name}},\n\nThank you for taking the time to view {{property_name}} today. I hope you found the property interesting and that it met your expectations.\n\nIf you have any questions or would like to schedule another viewing, please don't hesitate to contact me.\n\nBest regards,\n{{agent_name}}`,
    tags: ['thank-you', 'viewing'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
  }
];

const EmailTemplates: React.FC = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState<Record<string, boolean>>({});

  // New template state
  const [newTemplate, setNewTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    body: '',
    tags: []
  });
  
  // Filter templates based on search query
  const filteredTemplates = templates.filter(template => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    return (
      template.name.toLowerCase().includes(query) ||
      template.subject.toLowerCase().includes(query) ||
      template.body.toLowerCase().includes(query) ||
      template.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });
  
  const handleCopyTemplate = (template: EmailTemplate) => {
    // Copy to clipboard
    navigator.clipboard.writeText(template.body);
    
    // Show success state
    setCopySuccess({ ...copySuccess, [template.id]: true });
    
    // Reset after 2 seconds
    setTimeout(() => {
      setCopySuccess({ ...copySuccess, [template.id]: false });
    }, 2000);
    
    toast({
      title: language === 'de' ? 'Vorlage kopiert' : 'Template copied',
      description: language === 'de' ? 'Die E-Mail-Vorlage wurde in die Zwischenablage kopiert' : 'The email template has been copied to clipboard'
    });
  };
  
  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setNewTemplate({
      name: template.name,
      subject: template.subject,
      body: template.body,
      tags: template.tags
    });
    setEditDialogOpen(true);
  };
  
  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.body) {
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' ? 'Bitte füllen Sie alle Pflichtfelder aus' : 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    if (selectedTemplate) {
      // Update existing template
      const updatedTemplates = templates.map(t => 
        t.id === selectedTemplate.id 
          ? { 
              ...t, 
              name: newTemplate.name || '', 
              subject: newTemplate.subject || '', 
              body: newTemplate.body || '',
              tags: newTemplate.tags || []
            } 
          : t
      );
      setTemplates(updatedTemplates);
      toast({
        title: language === 'de' ? 'Vorlage aktualisiert' : 'Template updated',
        description: language === 'de' ? 'Die E-Mail-Vorlage wurde erfolgreich aktualisiert' : 'The email template has been updated successfully'
      });
    } else {
      // Create new template
      const newTemplateObj: EmailTemplate = {
        id: `t${templates.length + 1}`,
        name: newTemplate.name || '',
        subject: newTemplate.subject || '',
        body: newTemplate.body || '',
        tags: newTemplate.tags || [],
        createdAt: new Date().toISOString()
      };
      setTemplates([newTemplateObj, ...templates]);
      toast({
        title: language === 'de' ? 'Vorlage erstellt' : 'Template created',
        description: language === 'de' ? 'Die E-Mail-Vorlage wurde erfolgreich erstellt' : 'The email template has been created successfully'
      });
    }
    
    // Reset form and close dialog
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      tags: []
    });
    setSelectedTemplate(null);
    setEditDialogOpen(false);
  };
  
  const handleDeleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    
    toast({
      title: language === 'de' ? 'Vorlage gelöscht' : 'Template deleted',
      description: language === 'de' ? 'Die E-Mail-Vorlage wurde gelöscht' : 'The email template has been deleted'
    });
  };
  
  const handleAddNewTemplate = () => {
    setSelectedTemplate(null);
    setNewTemplate({
      name: '',
      subject: '',
      body: '',
      tags: []
    });
    setEditDialogOpen(true);
  };
  
  const handleTagChange = (value: string) => {
    if (!value) {
      setNewTemplate({ ...newTemplate, tags: [] });
      return;
    }
    
    const tagArray = value.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
      
    setNewTemplate({ ...newTemplate, tags: tagArray });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle>
              {language === 'de' ? 'E-Mail-Vorlagen' : 'Email Templates'}
            </CardTitle>
            <CardDescription>
              {language === 'de' ? 'Verwalten Sie Ihre E-Mail-Vorlagen für die Kommunikation mit Kunden' : 'Manage your email templates for client communications'}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-[220px]">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder={language === 'de' ? 'Vorlagen durchsuchen...' : 'Search templates...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddNewTemplate} size="icon" variant="outline">
              <Plus className="h-4 w-4" />
              <span className="sr-only">
                {language === 'de' ? 'Neue Vorlage' : 'New Template'}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">
              {searchQuery 
                ? (language === 'de' ? 'Keine Vorlagen gefunden' : 'No templates found') 
                : (language === 'de' ? 'Keine Vorlagen vorhanden' : 'No templates available')}
            </p>
            <Button onClick={handleAddNewTemplate} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Neue Vorlage erstellen' : 'Create new template'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="mt-1">{template.subject}</CardDescription>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditTemplate(template)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{language === 'de' ? 'Bearbeiten' : 'Edit'}</span>
                      </Button>
                      <Button 
                        variant={copySuccess[template.id] ? "default" : "ghost"} 
                        size="icon" 
                        onClick={() => handleCopyTemplate(template)}
                      >
                        {copySuccess[template.id] ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        <span className="sr-only">{language === 'de' ? 'Kopieren' : 'Copy'}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{language === 'de' ? 'Löschen' : 'Delete'}</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="border rounded-md p-3 bg-muted/20">
                    <pre className="text-sm whitespace-pre-wrap font-sans">
                      {template.body.length > 200 
                        ? template.body.substring(0, 200) + '...' 
                        : template.body}
                    </pre>
                  </div>
                  
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate 
                ? (language === 'de' ? 'Vorlage bearbeiten' : 'Edit Template')
                : (language === 'de' ? 'Neue Vorlage erstellen' : 'Create New Template')}
            </DialogTitle>
            <DialogDescription>
              {language === 'de' 
                ? 'Verwenden Sie Platzhalter wie {{name}} oder {{property_name}} für personalisierte Inhalte'
                : 'Use placeholders like {{name}} or {{property_name}} for personalized content'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-2">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="template-name">
                {language === 'de' ? 'Vorlagenname' : 'Template Name'} *
              </label>
              <Input
                id="template-name"
                value={newTemplate.name || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder={language === 'de' ? 'z.B. Willkommens-E-Mail' : 'e.g. Welcome Email'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="template-subject">
                {language === 'de' ? 'Betreff' : 'Subject'} *
              </label>
              <Input
                id="template-subject"
                value={newTemplate.subject || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder={language === 'de' ? 'E-Mail-Betreff' : 'Email subject'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="template-body">
                {language === 'de' ? 'Inhalt' : 'Content'} *
              </label>
              <Textarea
                id="template-body"
                value={newTemplate.body || ''}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder={language === 'de' ? 'Schreiben Sie hier den E-Mail-Inhalt...' : 'Write your email content here...'}
                className="min-h-[200px]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="template-tags">
                {language === 'de' ? 'Tags (kommagetrennt)' : 'Tags (comma separated)'}
              </label>
              <Input
                id="template-tags"
                value={newTemplate.tags?.join(', ') || ''}
                onChange={(e) => handleTagChange(e.target.value)}
                placeholder={language === 'de' ? 'z.B. willkommen, anfrage, besichtigung' : 'e.g. welcome, inquiry, viewing'}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </Button>
            <Button onClick={handleSaveTemplate}>
              {language === 'de' ? 'Speichern' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EmailTemplates;
