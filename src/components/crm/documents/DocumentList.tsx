
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FileText, Download, Eye, Trash2, 
  FileSpreadsheet, FilePdf, FileImage, File
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatDate } from '@/utils/crmUtils';

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
}

interface DocumentListProps {
  entityId: string;
  entityType: 'company' | 'contact';
}

const DocumentList: React.FC<DocumentListProps> = ({ entityId, entityType }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  // Mock documents - in a real app, these would come from the API
  const documents: Document[] = [
    { 
      id: '1', 
      name: 'Contract.pdf', 
      type: 'pdf',
      size: 2536874, // Bytes
      uploadDate: '2025-05-10T14:32:00.000Z'
    },
    { 
      id: '2', 
      name: 'Financial_Report_2025.xlsx', 
      type: 'spreadsheet',
      size: 1245698, // Bytes
      uploadDate: '2025-05-08T09:15:00.000Z'
    },
    { 
      id: '3', 
      name: 'Office_Building.jpg', 
      type: 'image',
      size: 3567412, // Bytes
      uploadDate: '2025-05-05T11:20:00.000Z'
    },
  ];
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FilePdf className="h-5 w-5 text-red-500" />;
      case 'spreadsheet': return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case 'image': return <FileImage className="h-5 w-5 text-blue-500" />;
      default: return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const handleView = (doc: Document) => {
    toast({
      title: language === 'de' ? 'Dokument wird geöffnet' : 'Opening document',
      description: doc.name
    });
  };
  
  const handleDownload = (doc: Document) => {
    toast({
      title: language === 'de' ? 'Download gestartet' : 'Download started',
      description: doc.name
    });
  };
  
  const handleDelete = (doc: Document) => {
    toast({
      title: language === 'de' ? 'Dokument gelöscht' : 'Document deleted',
      description: doc.name
    });
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-muted-foreground opacity-30 mx-auto" />
        <h3 className="mt-2 font-medium">
          {language === 'de' ? 'Keine Dokumente gefunden' : 'No documents found'}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {language === 'de' 
            ? 'Es wurden noch keine Dokumente hochgeladen' 
            : 'No documents have been uploaded yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {documents.map(doc => (
        <div 
          key={doc.id} 
          className="flex items-center p-3 rounded-md hover:bg-muted/50 transition-colors animate-fade-in"
        >
          {getFileIcon(doc.type)}
          
          <div className="ml-3 flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{doc.name}</p>
            <div className="flex text-xs text-muted-foreground">
              <span>{formatFileSize(doc.size)}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(doc.uploadDate, language)}</span>
            </div>
          </div>
          
          <div className="ml-2 flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleView(doc)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{language === 'de' ? 'Anzeigen' : 'View'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{language === 'de' ? 'Herunterladen' : 'Download'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDelete(doc)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{language === 'de' ? 'Löschen' : 'Delete'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;
