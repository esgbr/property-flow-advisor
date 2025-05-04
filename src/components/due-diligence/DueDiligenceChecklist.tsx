
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardCheck, SquareCheck, File, Building, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

const DueDiligenceChecklist: React.FC = () => {
  const { t } = useLanguage();
  
  // Sample checklist data
  const checklistItems = [
    { id: 1, category: 'legal', name: 'Property Title Search', completed: true, critical: true },
    { id: 2, category: 'legal', name: 'Review of Deed Restrictions', completed: true, critical: true },
    { id: 3, category: 'legal', name: 'Zoning Verification', completed: false, critical: true },
    { id: 4, category: 'legal', name: 'HOA Document Review', completed: false, critical: false },
    { id: 5, category: 'financial', name: 'Income & Expense Verification', completed: true, critical: true },
    { id: 6, category: 'financial', name: 'Tax History Review', completed: true, critical: true },
    { id: 7, category: 'financial', name: 'Insurance Quote', completed: false, critical: true },
    { id: 8, category: 'financial', name: 'Utility Bills Analysis', completed: false, critical: false },
    { id: 9, category: 'physical', name: 'Professional Home Inspection', completed: false, critical: true },
    { id: 10, category: 'physical', name: 'Roof Inspection', completed: false, critical: true },
    { id: 11, category: 'physical', name: 'HVAC System Check', completed: false, critical: false },
    { id: 12, category: 'physical', name: 'Plumbing System Check', completed: false, critical: false },
  ];
  
  const legalItems = checklistItems.filter(item => item.category === 'legal');
  const financialItems = checklistItems.filter(item => item.category === 'financial');
  const physicalItems = checklistItems.filter(item => item.category === 'physical');
  
  // Calculate progress percentages
  const legalProgress = (legalItems.filter(item => item.completed).length / legalItems.length) * 100;
  const financialProgress = (financialItems.filter(item => item.completed).length / financialItems.length) * 100;
  const physicalProgress = (physicalItems.filter(item => item.completed).length / physicalItems.length) * 100;
  const overallProgress = (checklistItems.filter(item => item.completed).length / checklistItems.length) * 100;
  
  const criticalItemsCount = checklistItems.filter(item => item.critical && !item.completed).length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ClipboardCheck className="mr-2 h-5 w-5" />
          {t('dueDiligence')}
        </CardTitle>
        <CardDescription>{t('comprehensiveDueDiligenceChecklist')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <h3 className="text-sm font-medium">{t('overallProgress')}</h3>
            <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress} />
          
          {criticalItemsCount > 0 && (
            <div className="flex items-center mt-2 text-amber-500 text-sm">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {criticalItemsCount} {t('criticalItemsRemaining')}
            </div>
          )}
        </div>
        
        <Tabs defaultValue="legal">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="legal">
              <File className="h-4 w-4 mr-2" />
              {t('legal')}
            </TabsTrigger>
            <TabsTrigger value="financial">
              <Search className="h-4 w-4 mr-2" />
              {t('financial')}
            </TabsTrigger>
            <TabsTrigger value="physical">
              <Building className="h-4 w-4 mr-2" />
              {t('physical')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="legal" className="space-y-4 mt-6">
            <div className="flex justify-between mb-2 items-center">
              <h3 className="text-sm font-medium">{t('legalDueDiligence')}</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">{Math.round(legalProgress)}%</span>
                <Button variant="outline" size="sm">{t('addItem')}</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {legalItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${item.completed ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                      {item.completed && <SquareCheck className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.critical && (
                        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                          {t('critical')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    {item.completed ? t('view') : t('complete')}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="financial" className="space-y-4 mt-6">
            <div className="flex justify-between mb-2 items-center">
              <h3 className="text-sm font-medium">{t('financialDueDiligence')}</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">{Math.round(financialProgress)}%</span>
                <Button variant="outline" size="sm">{t('addItem')}</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {financialItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${item.completed ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                      {item.completed && <SquareCheck className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.critical && (
                        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                          {t('critical')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    {item.completed ? t('view') : t('complete')}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="physical" className="space-y-4 mt-6">
            <div className="flex justify-between mb-2 items-center">
              <h3 className="text-sm font-medium">{t('physicalDueDiligence')}</h3>
              <div className="flex items-center">
                <span className="text-sm mr-2">{Math.round(physicalProgress)}%</span>
                <Button variant="outline" size="sm">{t('addItem')}</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              {physicalItems.map(item => (
                <div key={item.id} className="flex items-center justify-between border rounded-md p-3">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${item.completed ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                      {item.completed && <SquareCheck className="h-4 w-4" />}
                    </div>
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.critical && (
                        <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
                          {t('critical')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    {item.completed ? t('view') : t('complete')}
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-medium mb-2">{t('dueDiligenceTemplates')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Building className="mr-2 h-4 w-4" />
              {t('singleFamilyTemplate')}
            </Button>
            <Button variant="outline" className="justify-start">
              <Building className="mr-2 h-4 w-4" />
              {t('multiUnitTemplate')}
            </Button>
            <Button variant="outline" className="justify-start">
              <Building className="mr-2 h-4 w-4" />
              {t('commercialTemplate')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DueDiligenceChecklist;
