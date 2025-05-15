
import React from 'react';
import { File, Download, Trash2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface Document {
  id: string;
  name: string;
  type: string;
  dateAdded: Date;
  size: string;
}

export interface DocumentListProps {
  entityId: string;
  entityType: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ entityId, entityType }) => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // Mock documents - in a real app, these would be fetched based on entityId and entityType
  const documents: Document[] = [
    {
      id: '1',
      name: 'Contract.pdf',
      type: 'PDF',
      dateAdded: new Date(2023, 5, 15),
      size: '2.4 MB'
    },
    {
      id: '2',
      name: 'Meeting_Notes.docx',
      type: 'DOCX',
      dateAdded: new Date(2023, 6, 22),
      size: '1.1 MB'
    }
  ];
  
  const handleDownload = (documentId: string, documentName: string) => {
    toast({
      title: language === 'de' ? 'Download gestartet' : 'Download started',
      description: documentName
    });
  };
  
  const handleDelete = (documentId: string) => {
    toast({
      title: language === 'de' ? 'Datei gelöscht' : 'Document deleted',
      description: language === 'de' ? 'Die Datei wurde erfolgreich gelöscht' : 'The document was successfully deleted'
    });
  };
  
  const handleUpload = () => {
    toast({
      title: language === 'de' ? 'Dokument hochladen' : 'Upload document',
      description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
    });
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          {language === 'de' ? 'Dokumente' : 'Documents'}
        </CardTitle>
        <Button variant="outline" size="sm" onClick={handleUpload}>
          <Plus className="h-4 w-4 mr-1" />
          {language === 'de' ? 'Hochladen' : 'Upload'}
        </Button>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2 border rounded-md hover:bg-muted/50 transition-colors">
                <div className="flex items-center">
                  <File className="h-5 w-5 mr-2 text-blue-500" />
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.type} • {doc.size} • {new Date(doc.dateAdded).toLocaleDateString(
                        language === 'de' ? 'de-DE' : 'en-US', 
                        { year: 'numeric', month: 'short', day: 'numeric' }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleDownload(doc.id, doc.name)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <File className="h-10 w-10 mb-2 text-muted-foreground mx-auto opacity-50" />
            <p className="text-muted-foreground">
              {language === 'de' 
                ? 'Keine Dokumente vorhanden' 
                : 'No documents available'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentList;
