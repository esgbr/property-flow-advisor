
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileUp, Loader2, File, X, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface DocumentUploaderProps {
  entityId: string;
  entityType: 'company' | 'contact';
  onDocumentUploaded?: () => void;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  entityId, 
  entityType,
  onDocumentUploaded
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      processSelectedFiles(Array.from(selectedFiles));
    }
    
    // Reset input value to allow selecting the same file again
    event.target.value = '';
  };
  
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    
    if (event.dataTransfer.files) {
      processSelectedFiles(Array.from(event.dataTransfer.files));
    }
  };
  
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const processSelectedFiles = (files: File[]) => {
    const newFiles = files.map(file => ({
      id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      file,
      progress: 0,
      status: 'uploading' as const
    }));
    
    setUploadingFiles(prevFiles => [...prevFiles, ...newFiles]);
    
    // Simulate file upload for each file
    newFiles.forEach(fileObj => {
      simulateFileUpload(fileObj);
    });
  };
  
  const simulateFileUpload = (fileObj: UploadingFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      
      if (progress >= 100) {
        clearInterval(interval);
        setUploadingFiles(files => 
          files.map(f => 
            f.id === fileObj.id 
              ? { ...f, progress: 100, status: 'success' } 
              : f
          )
        );
        
        toast({
          title: language === 'de' ? 'Datei hochgeladen' : 'File uploaded',
          description: fileObj.file.name,
        });
        
        if (onDocumentUploaded) {
          onDocumentUploaded();
        }
      } else {
        setUploadingFiles(files => 
          files.map(f => 
            f.id === fileObj.id 
              ? { ...f, progress } 
              : f
          )
        );
      }
    }, 300);
    
    // Simulate random error (10% chance)
    if (Math.random() < 0.1) {
      setTimeout(() => {
        clearInterval(interval);
        setUploadingFiles(files => 
          files.map(f => 
            f.id === fileObj.id 
              ? { 
                  ...f, 
                  status: 'error',
                  error: language === 'de' 
                    ? 'Fehler beim Hochladen' 
                    : 'Error uploading file'
                } 
              : f
          )
        );
        
        toast({
          title: language === 'de' ? 'Hochladen fehlgeschlagen' : 'Upload failed',
          description: fileObj.file.name,
          variant: 'destructive'
        });
      }, Math.random() * 2000 + 500);
    }
  };
  
  const removeFile = (id: string) => {
    setUploadingFiles(files => files.filter(f => f.id !== id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Dokumente' : 'Documents'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? `Laden Sie Dokumente für ${entityType === 'company' ? 'dieses Unternehmen' : 'diesen Kontakt'} hoch` 
            : `Upload documents for this ${entityType}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            isDragging ? 'border-primary bg-primary/5' : 'border-muted'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FileUp className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            {language === 'de' 
              ? 'Dateien hierher ziehen oder klicken zum Hochladen' 
              : 'Drag files here or click to upload'}
          </p>
          <Input
            type="file"
            className="hidden"
            id="file-upload"
            multiple
            onChange={handleFileSelect}
          />
          <Button 
            variant="outline" 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="mt-2"
          >
            {language === 'de' ? 'Dateien auswählen' : 'Select files'}
          </Button>
        </div>
        
        {uploadingFiles.length > 0 && (
          <div className="space-y-2">
            {uploadingFiles.map(file => (
              <div 
                key={file.id} 
                className={`flex items-center p-2 rounded-md ${
                  file.status === 'error' ? 'bg-red-50' : 'bg-muted/40'
                }`}
              >
                <File className="h-6 w-6 mr-2 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  {file.status === 'uploading' ? (
                    <Progress value={file.progress} className="h-2 mt-1" />
                  ) : file.status === 'error' ? (
                    <p className="text-xs text-red-500 mt-1">{file.error}</p>
                  ) : (
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <Check className="h-3 w-3 mr-1" /> 
                      {language === 'de' ? 'Hochgeladen' : 'Uploaded'}
                    </p>
                  )}
                </div>
                {file.status === 'uploading' ? (
                  <Loader2 className="h-4 w-4 animate-spin ml-2" />
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 p-0 w-7 h-7" 
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
