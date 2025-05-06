
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType } from '@/hooks/use-workflow';
import WorkflowStepsList from './WorkflowStepsList';

interface WorkflowTabsProps {
  activeTab: WorkflowType;
  onTabChange: (value: string) => void;
}

/**
 * Workflow tabs component for displaying different workflow types
 */
const WorkflowTabs: React.FC<WorkflowTabsProps> = ({ activeTab, onTabChange }) => {
  const { language } = useLanguage();
  
  return (
    <Tabs defaultValue={activeTab} onValueChange={(value) => onTabChange(value)}>
      <TabsList>
        <TabsTrigger value="steuer">
          {language === 'de' ? 'Steuer' : 'Tax'}
        </TabsTrigger>
        <TabsTrigger value="immobilien">
          {language === 'de' ? 'Immobilien' : 'Property'}
        </TabsTrigger>
        <TabsTrigger value="finanzierung">
          {language === 'de' ? 'Finanzierung' : 'Financing'}
        </TabsTrigger>
        <TabsTrigger value="analyse">
          {language === 'de' ? 'Analyse' : 'Analysis'}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="steuer" className="mt-0">
        <ScrollArea className="max-h-[500px]">
          <WorkflowStepsList workflowType="steuer" />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="immobilien" className="mt-0">
        <ScrollArea className="max-h-[500px]">
          <WorkflowStepsList workflowType="immobilien" />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="finanzierung" className="mt-0">
        <ScrollArea className="max-h-[500px]">
          <WorkflowStepsList workflowType="finanzierung" />
        </ScrollArea>
      </TabsContent>
      
      <TabsContent value="analyse" className="mt-0">
        <ScrollArea className="max-h-[500px]">
          <WorkflowStepsList workflowType="analyse" />
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
};

export default WorkflowTabs;
