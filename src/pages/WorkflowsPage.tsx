
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType } from '@/hooks/use-workflow';
import { ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import WorkflowManager from '@/components/workflow/WorkflowManager';
import WorkflowAnalytics from '@/components/workflow/WorkflowAnalytics';
import WorkflowExport from '@/components/workflow/WorkflowExport';
import WorkflowFilterSort from '@/components/workflow/WorkflowFilterSort';
import WorkflowSummary from '@/components/workflow/WorkflowSummary';

/**
 * Comprehensive page for managing and analyzing workflows
 */
const WorkflowsPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('management');
  const [filteredWorkflows, setFilteredWorkflows] = useState<WorkflowType[]>([
    'steuer', 'immobilien', 'finanzierung', 'analyse'
  ]);
  
  // Handle workflow filtering
  const handleFilterChange = (filteredWorkflows: WorkflowType[]) => {
    setFilteredWorkflows(filteredWorkflows);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {language === 'de' ? 'Workflows' : 'Workflows'}
          </h1>
          <p className="text-muted-foreground">
            {language === 'de' 
              ? 'Verwalten und analysieren Sie Ihre Workflows'
              : 'Manage and analyze your workflows'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Zurück' : 'Back'}
          </Button>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            {language === 'de' ? 'Neuer Workflow' : 'New Workflow'}
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="management">
            {language === 'de' ? 'Management' : 'Management'}
          </TabsTrigger>
          <TabsTrigger value="analytics">
            {language === 'de' ? 'Analyse' : 'Analytics'}
          </TabsTrigger>
          <TabsTrigger value="settings">
            {language === 'de' ? 'Einstellungen' : 'Settings'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-6">
          {/* Workflow Manager */}
          <WorkflowManager className="w-full" />
          
          {/* Workflow Summaries */}
          <h2 className="text-xl font-semibold mt-6 mb-4">
            {language === 'de' ? 'Workflow-Übersicht' : 'Workflow Overview'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <WorkflowSummary workflowType="steuer" />
            <WorkflowSummary workflowType="immobilien" />
            <WorkflowSummary workflowType="finanzierung" />
            <WorkflowSummary workflowType="analyse" />
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <WorkflowAnalytics 
            workflowTypes={['steuer', 'immobilien', 'finanzierung', 'analyse']} 
          />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <WorkflowFilterSort 
              workflowTypes={['steuer', 'immobilien', 'finanzierung', 'analyse']}
              onFilterChange={handleFilterChange}
            />
            <WorkflowExport />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowsPage;
