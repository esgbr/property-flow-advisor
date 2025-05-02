
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Building, CheckCircle2, ClipboardCheck, Clock, FileCheck, FileText, 
  Home, Info, MapPin, Ruler, Search, Upload, Users, Wrench
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';

interface ChecklistItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  isCompleted: boolean;
  isRequired: boolean;
  assignedTo?: string;
  dueDate?: string;
  documents?: {
    name: string;
    uploaded: boolean;
  }[];
}

const DueDiligenceChecklist: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  // Sample checklist data
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: '1',
      title: t('propertyInspection'),
      category: 'inspection',
      description: t('completePropertyInspectionWithLicensedInspector'),
      isCompleted: true,
      isRequired: true,
      assignedTo: 'John Doe',
      dueDate: '2025-05-15',
      documents: [
        { name: t('inspectionReport'), uploaded: true },
        { name: t('repairEstimates'), uploaded: false }
      ]
    },
    {
      id: '2',
      title: t('titleSearch'),
      category: 'legal',
      description: t('completePropertyTitleSearchAndReview'),
      isCompleted: false,
      isRequired: true,
      assignedTo: 'Legal Team',
      dueDate: '2025-05-18',
      documents: [
        { name: t('titleReport'), uploaded: false }
      ]
    },
    {
      id: '3',
      title: t('financialAnalysis'),
      category: 'financial',
      description: t('analyzeCashFlowROIAndExpenses'),
      isCompleted: true,
      isRequired: true,
      assignedTo: 'Maria Garcia',
      dueDate: '2025-05-10',
      documents: [
        { name: t('financialProjections'), uploaded: true },
        { name: t('comparableRentals'), uploaded: true }
      ]
    },
    {
      id: '4',
      title: t('environmentalAssessment'),
      category: 'inspection',
      description: t('verifyNoEnvironmentalHazards'),
      isCompleted: false,
      isRequired: true,
      assignedTo: 'Environmental Experts Inc.',
      dueDate: '2025-05-20',
      documents: [
        { name: t('phaseIAssessment'), uploaded: false }
      ]
    },
    {
      id: '5',
      title: t('insuranceQuotes'),
      category: 'financial',
      description: t('obtainInsuranceQuotesForProperty'),
      isCompleted: false,
      isRequired: true,
      dueDate: '2025-05-22',
      documents: [
        { name: t('insuranceQuotes'), uploaded: false }
      ]
    },
    {
      id: '6',
      title: t('propertyTaxVerification'),
      category: 'financial',
      description: t('verifyCurrentAndProjectedPropertyTaxes'),
      isCompleted: true,
      isRequired: true,
      dueDate: '2025-05-12',
      documents: [
        { name: t('taxRecords'), uploaded: true }
      ]
    },
    {
      id: '7',
      title: t('zoningVerification'),
      category: 'legal',
      description: t('confirmZoningAndPermittedUses'),
      isCompleted: false,
      isRequired: true,
      dueDate: '2025-05-19',
      documents: []
    },
    {
      id: '8',
      title: t('utilityCosts'),
      category: 'financial',
      description: t('reviewHistoricalUtilityCosts'),
      isCompleted: false,
      isRequired: false,
      dueDate: '2025-05-23',
      documents: [
        { name: t('utilityBills'), uploaded: false }
      ]
    },
    {
      id: '9',
      title: t('neighborhoodAnalysis'),
      category: 'market',
      description: t('evaluateNeighborhoodTrendsAndDevelopment'),
      isCompleted: true,
      isRequired: false,
      dueDate: '2025-05-11',
      documents: []
    },
    {
      id: '10',
      title: t('homeOwnersAssociation'),
      category: 'legal',
      description: t('reviewHOARulesAndFinancials'),
      isCompleted: false,
      isRequired: false,
      dueDate: '2025-05-25',
      documents: [
        { name: t('hoaDocuments'), uploaded: false },
        { name: t('hoaFinancials'), uploaded: false }
      ]
    },
    {
      id: '11',
      title: t('tenantEvaluation'),
      category: 'market',
      description: t('reviewExistingTenantHistoryAndLeases'),
      isCompleted: true,
      isRequired: true,
      dueDate: '2025-05-14',
      documents: [
        { name: t('leaseAgreements'), uploaded: true },
        { name: t('tenantPaymentHistory'), uploaded: true }
      ]
    },
    {
      id: '12',
      title: t('floodZoneVerification'),
      category: 'inspection',
      description: t('checkIfPropertyIsInFloodZone'),
      isCompleted: false,
      isRequired: true,
      dueDate: '2025-05-21',
      documents: []
    }
  ]);
  
  // State for filtered list and search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showOnlyIncomplete, setShowOnlyIncomplete] = useState(false);
  
  // Calculate completion statistics
  const requiredTotal = checklist.filter(item => item.isRequired).length;
  const requiredCompleted = checklist.filter(item => item.isRequired && item.isCompleted).length;
  const requiredCompletionPercentage = requiredTotal > 0 ? (requiredCompleted / requiredTotal) * 100 : 0;
  
  const totalItems = checklist.length;
  const totalCompleted = checklist.filter(item => item.isCompleted).length;
  const totalCompletionPercentage = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 0;
  
  // Filter logic for checklist items
  const getFilteredItems = () => {
    return checklist.filter(item => {
      const matchesSearch = searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(item.category);
      
      const matchesCompletion = !showOnlyIncomplete || !item.isCompleted;
      
      return matchesSearch && matchesCategory && matchesCompletion;
    });
  };
  
  const filteredItems = getFilteredItems();
  
  // Categories for filtering
  const categories = Array.from(new Set(checklist.map(item => item.category)));
  
  // Handle toggling item completion
  const toggleItemCompletion = (id: string) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
    
    const itemTitle = checklist.find(item => item.id === id)?.title;
    toast({
      title: t('statusUpdated'),
      description: `${itemTitle} ${t('marked')} ${!checklist.find(item => item.id === id)?.isCompleted ? t('asComplete') : t('asIncomplete')}`
    });
  };
  
  // Handle document upload
  const handleDocumentUpload = (itemId: string, documentIndex: number) => {
    setChecklist(checklist.map(item => {
      if (item.id === itemId && item.documents) {
        const updatedDocuments = [...item.documents];
        updatedDocuments[documentIndex] = { 
          ...updatedDocuments[documentIndex],
          uploaded: true 
        };
        return { ...item, documents: updatedDocuments };
      }
      return item;
    }));
    
    toast({
      title: t('documentUploaded'),
      description: t('documentUploadedSuccessfully')
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <ClipboardCheck className="inline-block mr-2 h-8 w-8" />
            {t('dueDiligenceChecklist')}
          </h1>
          <p className="text-muted-foreground">{t('trackYourPropertyEvaluationProcess')}</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>{t('completionStatus')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t('requiredItems')}</span>
                <span className="font-medium">{requiredCompleted}/{requiredTotal}</span>
              </div>
              <Progress value={requiredCompletionPercentage} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>{t('allItems')}</span>
                <span className="font-medium">{totalCompleted}/{totalItems}</span>
              </div>
              <Progress value={totalCompletionPercentage} className="h-2" />
            </div>
            
            <div className="pt-2">
              <div className="text-sm text-muted-foreground mb-2">{t('documents')}</div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <span className="text-sm">{t('uploaded')}</span>
                </div>
                <span className="font-medium">
                  {checklist.reduce((count, item) => 
                    count + (item.documents?.filter(doc => doc.uploaded)?.length || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-amber-500" />
                  <span className="text-sm">{t('pending')}</span>
                </div>
                <span className="font-medium">
                  {checklist.reduce((count, item) => 
                    count + (item.documents?.filter(doc => !doc.uploaded)?.length || 0), 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle>{t('upcomingDeadlines')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[180px] overflow-y-auto">
              {checklist
                .filter(item => !item.isCompleted && item.dueDate)
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                .slice(0, 3)
                .map(item => (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t('due')}: {new Date(item.dueDate!).toLocaleDateString()}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => toggleItemCompletion(item.id)}>
                      {t('complete')}
                    </Button>
                  </div>
                ))}
              
              {checklist.filter(item => !item.isCompleted && item.dueDate).length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
                  <CheckCircle2 className="h-8 w-8 mb-2" />
                  <div>{t('noUpcomingDeadlines')}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            {t('all')}
          </TabsTrigger>
          <TabsTrigger value="inspection">
            <Search className="h-4 w-4 mr-2" />
            {t('inspection')}
          </TabsTrigger>
          <TabsTrigger value="legal">
            <FileText className="h-4 w-4 mr-2" />
            {t('legal')}
          </TabsTrigger>
          <TabsTrigger value="financial">
            <FileCheck className="h-4 w-4 mr-2" />
            {t('financial')}
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('searchChecklist')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="incomplete-only" 
              checked={showOnlyIncomplete}
              onCheckedChange={(checked) => setShowOnlyIncomplete(checked === true)}
            />
            <label htmlFor="incomplete-only" className="text-sm cursor-pointer">
              {t('showIncompleteOnly')}
            </label>
          </div>
        </div>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  toggleItemCompletion={toggleItemCompletion}
                  handleDocumentUpload={handleDocumentUpload}
                />
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                  <Info className="h-10 w-10 text-muted-foreground mb-2" />
                  <div className="text-lg font-medium">{t('noItemsFound')}</div>
                  <p className="text-muted-foreground max-w-sm mt-1">
                    {t('tryDifferentFilters')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="inspection" className="mt-6">
          <div className="space-y-4">
            {filteredItems
              .filter(item => item.category === 'inspection')
              .map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  toggleItemCompletion={toggleItemCompletion}
                  handleDocumentUpload={handleDocumentUpload}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="legal" className="mt-6">
          <div className="space-y-4">
            {filteredItems
              .filter(item => item.category === 'legal')
              .map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  toggleItemCompletion={toggleItemCompletion}
                  handleDocumentUpload={handleDocumentUpload}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="financial" className="mt-6">
          <div className="space-y-4">
            {filteredItems
              .filter(item => item.category === 'financial')
              .map((item) => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  toggleItemCompletion={toggleItemCompletion}
                  handleDocumentUpload={handleDocumentUpload}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Component for individual checklist item cards
interface ChecklistItemCardProps {
  item: ChecklistItem;
  toggleItemCompletion: (id: string) => void;
  handleDocumentUpload: (itemId: string, documentIndex: number) => void;
}

const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({ 
  item, 
  toggleItemCompletion,
  handleDocumentUpload
}) => {
  const { t } = useLanguage();
  
  // Get icon based on category
  const getCategoryIcon = () => {
    switch (item.category) {
      case 'inspection':
        return <Search className="h-4 w-4" />;
      case 'legal':
        return <FileText className="h-4 w-4" />;
      case 'financial':
        return <FileCheck className="h-4 w-4" />;
      case 'market':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <ClipboardCheck className="h-4 w-4" />;
    }
  };
  
  return (
    <Card className={item.isCompleted ? 'bg-muted/40 border-muted' : ''}>
      <CardHeader className="pb-2 flex flex-row items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Checkbox 
              checked={item.isCompleted} 
              onCheckedChange={() => toggleItemCompletion(item.id)}
              id={`item-${item.id}`}
            />
            <label htmlFor={`item-${item.id}`} className={`font-medium ${item.isCompleted ? 'line-through text-muted-foreground' : ''} cursor-pointer`}>
              {item.title}
            </label>
            {item.isRequired && (
              <Badge variant="outline" className="ml-2 text-xs">
                {t('required')}
              </Badge>
            )}
          </div>
          {item.description && (
            <CardDescription className="mt-1 ml-6">
              {item.description}
            </CardDescription>
          )}
        </div>
        {!item.isCompleted && item.dueDate && (
          <div className="flex items-center text-xs">
            <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
            <span className="font-medium">{new Date(item.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="ml-6 space-y-4">
          {(item.assignedTo || item.category) && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {item.assignedTo && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-3 w-3" />
                  <span>{item.assignedTo}</span>
                </div>
              )}
              {item.category && (
                <div className="flex items-center gap-1 text-muted-foreground">
                  {getCategoryIcon()}
                  <span className="capitalize">{t(item.category)}</span>
                </div>
              )}
            </div>
          )}
          
          {item.documents && item.documents.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="text-xs font-medium">{t('requiredDocuments')}</div>
              <div className="space-y-2">
                {item.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    {doc.uploaded ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        {t('uploaded')}
                      </Badge>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs"
                        onClick={() => handleDocumentUpload(item.id, index)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        {t('upload')}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DueDiligenceChecklist;
