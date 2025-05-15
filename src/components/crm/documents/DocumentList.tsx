
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, 
  FileImage, 
  FileSpreadsheet, 
  FileArchive,
  Download,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'spreadsheet' | 'archive' | 'other';
  size: string;
  uploadedAt: string;
  tags?: string[];
}

interface DocumentListProps {
  documents: Document[];
  onDeleteDocument?: (id: string) => void;
  onDownloadDocument?: (id: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({ 
  documents, 
  onDeleteDocument, 
  onDownloadDocument 
}) => {
  const { language } = useLanguage();
  
  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'image':
        return <FileImage className="text-blue-500" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="text-green-500" />;
      case 'archive':
        return <FileArchive className="text-amber-500" />;
      default:
        return <FileText className="text-gray-500" />;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return language === 'de'
      ? date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
        <p>{language === 'de' ? 'Keine Dokumente gefunden' : 'No documents found'}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-md bg-background border">
              {getFileIcon(doc.type)}
            </div>
            <div>
              <p className="font-medium">{doc.name}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{doc.size}</span>
                <span>•</span>
                <span>{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {doc.tags && doc.tags.length > 0 && (
              <div className="hidden sm:flex gap-1 mr-4">
                {doc.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex gap-1">
              {onDownloadDocument && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onDownloadDocument(doc.id)}
                  className="h-8 w-8 p-0"
                >
                  <span className="sr-only">
                    {language === 'de' ? 'Herunterladen' : 'Download'}
                  </span>
                  <Download className="h-4 w-4" />
                </Button>
              )}
              
              {onDeleteDocument && (
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => onDeleteDocument(doc.id)}
                  className="h-8 w-8 p-0 hover:text-destructive"
                >
                  <span className="sr-only">
                    {language === 'de' ? 'Löschen' : 'Delete'}
                  </span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
