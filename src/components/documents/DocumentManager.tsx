
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileLock, FileText, FileUp, FolderOpen, Search, Tag, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Document {
  id: string;
  name: string;
  type: string;
  category: string;
  uploadDate: Date;
  size: number;
  tags: string[];
  secureStorage: boolean;
}

const sampleDocuments: Document[] = [
  {
    id: 'doc1',
    name: 'Purchase Agreement - 123 Main St',
    type: 'PDF',
    category: 'contracts',
    uploadDate: new Date(2024, 2, 15),
    size: 2400000,
    tags: ['purchase', 'signed', 'legal'],
    secureStorage: true
  },
  {
    id: 'doc2',
    name: 'Property Inspection Report',
    type: 'PDF',
    category: 'inspections',
    uploadDate: new Date(2024, 2, 10),
    size: 5800000,
    tags: ['inspection', 'assessment'],
    secureStorage: true
  },
  {
    id: 'doc3',
    name: 'Mortgage Loan Agreement',
    type: 'PDF',
    category: 'financial',
    uploadDate: new Date(2024, 1, 28),
    size: 1800000,
    tags: ['mortgage', 'loan', 'signed', 'bank'],
    secureStorage: true
  },
  {
    id: 'doc4',
    name: 'Rental Income Spreadsheet 2024',
    type: 'XLSX',
    category: 'financial',
    uploadDate: new Date(2024, 3, 1),
    size: 380000,
    tags: ['spreadsheet', 'income', 'analysis'],
    secureStorage: false
  },
  {
    id: 'doc5',
    name: 'Property Insurance Policy',
    type: 'PDF',
    category: 'insurance',
    uploadDate: new Date(2024, 1, 15),
    size: 1200000,
    tags: ['insurance', 'policy', 'annual'],
    secureStorage: true
  },
  {
    id: 'doc6',
    name: 'Property Photos - 456 Oak Avenue',
    type: 'ZIP',
    category: 'media',
    uploadDate: new Date(2024, 2, 22),
    size: 25000000,
    tags: ['photos', 'property'],
    secureStorage: false
  }
];

interface DocumentManagerProps {
  className?: string;
}

const DocumentManager: React.FC<DocumentManagerProps> = ({ className }) => {
  const [documents, setDocuments] = useState<Document[]>(sampleDocuments);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('date-desc');
  const { toast } = useToast();

  const handleUploadClick = () => {
    toast({
      title: "Upload initiated",
      description: "The file upload dialog would appear here.",
    });
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast({
      title: "Document deleted",
      description: "The document has been removed from your storage.",
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
    else return (bytes / 1073741824).toFixed(1) + ' GB';
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Filter documents based on search, category, and sort
  const filteredDocuments = documents
    .filter(doc => 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(doc => selectedCategory === 'all' || doc.category === selectedCategory)
    .sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'date-asc':
          return a.uploadDate.getTime() - b.uploadDate.getTime();
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'size-desc':
          return b.size - a.size;
        case 'size-asc':
          return a.size - b.size;
        default:
          return 0;
      }
    });

  // Get unique categories for filter
  const categories = ['all', ...Array.from(new Set(documents.map(doc => doc.category)))];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            Document Management
          </h2>
          <p className="text-muted-foreground">Store and organize your important property documents</p>
        </div>
        <Button onClick={handleUploadClick}>
          <FileUp className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant={selectedCategory === 'all' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => setSelectedCategory('all')}
              >
                <FolderOpen className="mr-2 h-4 w-4" />
                All Documents
                <Badge className="ml-auto">{documents.length}</Badge>
              </Button>
              {categories
                .filter(cat => cat !== 'all')
                .map((category) => (
                  <Button 
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <FolderOpen className="mr-2 h-4 w-4" />
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                    <Badge className="ml-auto">
                      {documents.filter(doc => doc.category === category).length}
                    </Badge>
                  </Button>
                ))}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Popular Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(documents.flatMap(doc => doc.tags)))
                  .slice(0, 10)
                  .map(tag => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-muted" onClick={() => setSearchQuery(tag)}>
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:w-3/4 space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documents by name or tag..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="size-desc">Size (Largest)</SelectItem>
                <SelectItem value="size-asc">Size (Smallest)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs defaultValue="grid">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="grid">Grid</TabsTrigger>
                <TabsTrigger value="list">List</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">
                {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''}
              </div>
            </div>
            
            <TabsContent value="grid" className="pt-4">
              {filteredDocuments.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredDocuments.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">
                            {doc.name}
                          </CardTitle>
                          {doc.secureStorage && (
                            <FileLock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        <CardDescription>{doc.type.toUpperCase()} • {formatFileSize(doc.size)}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {doc.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{doc.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between border-t pt-3 text-xs text-muted-foreground">
                        <span>{formatDate(doc.uploadDate)}</span>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteDocument(doc.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mt-1">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="list" className="pt-4">
              {filteredDocuments.length > 0 ? (
                <div className="rounded-md border">
                  <div className="grid grid-cols-[1fr,auto,auto,auto] px-4 py-3 text-sm font-medium border-b">
                    <div>Name</div>
                    <div className="text-right">Category</div>
                    <div className="text-right">Size</div>
                    <div className="text-right">Date</div>
                  </div>
                  <div className="divide-y">
                    {filteredDocuments.map((doc) => (
                      <div key={doc.id} className="grid grid-cols-[1fr,auto,auto,auto] items-center px-4 py-3 hover:bg-muted/50">
                        <div className="flex items-start gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <div className="font-medium">
                              {doc.name}
                              {doc.secureStorage && <FileLock className="h-3.5 w-3.5 ml-1 inline-block text-muted-foreground" />}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {doc.tags.slice(0, 3).join(', ')}
                              {doc.tags.length > 3 ? `, +${doc.tags.length - 3} more` : ''}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-right">
                          {doc.category.charAt(0).toUpperCase() + doc.category.slice(1)}
                        </div>
                        <div className="text-sm text-right">
                          {formatFileSize(doc.size)}
                        </div>
                        <div className="text-sm text-right flex items-center justify-end gap-3">
                          <span>{formatDate(doc.uploadDate)}</span>
                          <div className="flex">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteDocument(doc.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-lg">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                  <h3 className="text-lg font-medium">No documents found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mt-1">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DocumentManager;
