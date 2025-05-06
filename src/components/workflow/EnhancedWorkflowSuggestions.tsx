
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkflowType, useWorkflow } from '@/hooks/use-workflow';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight, Building, Calculator, CheckCircle, Clock, Map, Star, Euro, PiggyBank, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useToast } from '@/components/ui/use-toast';
import { useAccessibility } from '@/hooks/use-accessibility';

interface EnhancedWorkflowSuggestionsProps {
  className?: string;
  currentTool?: string;
  maxSuggestions?: number;
  showPersonalized?: boolean;
}

const EnhancedWorkflowSuggestions: React.FC<EnhancedWorkflowSuggestionsProps> = ({
  className = '',
  currentTool = '',
  maxSuggestions = 3,
  showPersonalized = true
}) => {
  const { language } = useLanguage();
  const { preferences } = useUserPreferences();
  const { toast } = useToast();
  const { announce } = useAccessibility();
  const [activeTab, setActiveTab] = useState<WorkflowType>('steuer');
  const [allSuggestions, setAllSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Initialize all workflow hooks
  const steuerWorkflow = useWorkflow('steuer');
  const immobilienWorkflow = useWorkflow('immobilien');
  const finanzierungWorkflow = useWorkflow('finanzierung');
  const analyseWorkflow = useWorkflow('analyse');

  // Get icon based on workflow type
  const getWorkflowIcon = (type: WorkflowType) => {
    switch(type) {
      case 'steuer':
        return <Euro className="h-5 w-5" />;
      case 'immobilien':
        return <Building className="h-5 w-5" />;
      case 'finanzierung':
        return <Calculator className="h-5 w-5" />;
      case 'analyse':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };
  
  // Get next steps for each workflow
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      // Get all next steps for each workflow
      const steuerNextSteps = steuerWorkflow.getNextSteps(currentTool || 'grunderwerbsteuer');
      const immobilienNextSteps = immobilienWorkflow.getNextSteps(currentTool || 'marktanalyse');
      const finanzierungNextSteps = finanzierungWorkflow.getNextSteps(currentTool || 'calculator');
      const analyseNextSteps = analyseWorkflow.getNextSteps(currentTool || 'market');
      
      // Combine all suggestions
      const combinedSuggestions = [
        ...steuerNextSteps.map(step => ({ ...step, workflowType: 'steuer' as WorkflowType })),
        ...immobilienNextSteps.map(step => ({ ...step, workflowType: 'immobilien' as WorkflowType })),
        ...finanzierungNextSteps.map(step => ({ ...step, workflowType: 'finanzierung' as WorkflowType })),
        ...analyseNextSteps.map(step => ({ ...step, workflowType: 'analyse' as WorkflowType })),
      ];
      
      // Sort by relevance (in a real app, this would use machine learning or user preferences)
      const sortedSuggestions = combinedSuggestions.sort((a, b) => {
        // Prioritize suggestions that match user preferences
        const userMarket = preferences.market || 'global';
        const aMarketScore = a.markets?.includes(userMarket) ? 3 : 0;
        const bMarketScore = b.markets?.includes(userMarket) ? 3 : 0;
        
        // Prioritize incomplete steps
        const aIncompleteScore = !a.isComplete ? 2 : 0;
        const bIncompleteScore = !b.isComplete ? 2 : 0;
        
        // Add randomness for variety
        const randomFactor = Math.random() * 0.5;
        
        return (bMarketScore + bIncompleteScore + randomFactor) - (aMarketScore + aIncompleteScore);
      });
      
      setAllSuggestions(sortedSuggestions);
      setLoading(false);
    }, 300);
  }, [currentTool, preferences.market]);
  
  // Get suggestions for current tab
  const getCurrentSuggestions = () => {
    return allSuggestions
      .filter(step => step.workflowType === activeTab)
      .slice(0, maxSuggestions);
  };
  
  // Navigate to a workflow step
  const goToWorkflowStep = (workflowType: WorkflowType, stepId: string) => {
    switch (workflowType) {
      case 'steuer':
        steuerWorkflow.goToStep(stepId);
        break;
      case 'immobilien':
        immobilienWorkflow.goToStep(stepId);
        break;
      case 'finanzierung':
        finanzierungWorkflow.goToStep(stepId);
        break;
      case 'analyse':
        analyseWorkflow.goToStep(stepId);
        break;
    }
    
    // Announce action for accessibility
    announce(language === 'de'
      ? `Navigiere zu ${language === 'de' ? 
          getWorkflowTitle(workflowType) + ' - ' +
          allSuggestions.find(s => s.id === stepId)?.label.de :
          getWorkflowTitle(workflowType) + ' - ' +
          allSuggestions.find(s => s.id === stepId)?.label.en
        }`
      : `Navigating to ${getWorkflowTitle(workflowType)} - ${
          allSuggestions.find(s => s.id === stepId)?.label.en
        }`
    );
  };
  
  // Get workflow title based on type and language
  const getWorkflowTitle = (type: WorkflowType) => {
    switch(type) {
      case 'steuer':
        return language === 'de' ? 'Steueroptimierung' : 'Tax Optimization';
      case 'immobilien':
        return language === 'de' ? 'Immobilienverwaltung' : 'Property Management';
      case 'finanzierung':
        return language === 'de' ? 'Finanzierungsanalyse' : 'Financing Analysis';
      case 'analyse':
        return language === 'de' ? 'Investitionsanalyse' : 'Investment Analysis';
      default:
        return '';
    }
  };
  
  // Get personalized suggestions across all workflows
  const getPersonalizedSuggestions = () => {
    // In a real app, this would use more sophisticated algorithms
    // to select the most relevant next steps based on user behavior
    const personalizedSuggestions = allSuggestions
      .filter(step => !step.isComplete)
      .slice(0, maxSuggestions);
      
    return personalizedSuggestions;
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Workflow-Vorschläge' : 'Workflow Suggestions'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Fortsetzen Sie Ihre Arbeit mit diesen empfohlenen Schritten'
            : 'Continue your work with these recommended steps'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={showPersonalized ? "personalized" : activeTab} onValueChange={(value) => {
          if (value !== 'personalized') {
            setActiveTab(value as WorkflowType);
          }
        }}>
          <TabsList className="mb-4">
            {showPersonalized && (
              <TabsTrigger value="personalized">
                <Star className="mr-2 h-4 w-4" />
                {language === 'de' ? 'Personalisiert' : 'Personalized'}
              </TabsTrigger>
            )}
            <TabsTrigger value="steuer">
              <Euro className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Steuer' : 'Tax'}
            </TabsTrigger>
            <TabsTrigger value="immobilien">
              <Building className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Immobilien' : 'Property'}
            </TabsTrigger>
            <TabsTrigger value="finanzierung">
              <Calculator className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Finanzierung' : 'Financing'}
            </TabsTrigger>
            <TabsTrigger value="analyse">
              <CheckCircle className="mr-2 h-4 w-4" />
              {language === 'de' ? 'Analyse' : 'Analysis'}
            </TabsTrigger>
          </TabsList>
          
          {showPersonalized && (
            <TabsContent value="personalized" className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 w-48 bg-muted rounded"></div>
                    <div className="h-16 w-full bg-muted rounded"></div>
                    <div className="h-16 w-full bg-muted rounded"></div>
                  </div>
                </div>
              ) : getPersonalizedSuggestions().length > 0 ? (
                getPersonalizedSuggestions().map((suggestion) => (
                  <Card key={`${suggestion.workflowType}-${suggestion.id}`} className="hover:shadow-md transition-shadow">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-primary/10 p-1.5 rounded mr-2">
                            {getWorkflowIcon(suggestion.workflowType)}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {language === 'de' ? suggestion.label.de : suggestion.label.en}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {getWorkflowTitle(suggestion.workflowType)}
                            </p>
                          </div>
                        </div>
                        {suggestion.estimatedTime && (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            {suggestion.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground mb-3">
                        {suggestion.description ? (language === 'de' ? suggestion.description.de : suggestion.description.en) : ''}
                      </p>
                      <Button 
                        size="sm"
                        onClick={() => goToWorkflowStep(suggestion.workflowType, suggestion.id)}
                        className="w-full"
                      >
                        {language === 'de' ? 'Starten' : 'Start'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    {language === 'de' 
                      ? 'Keine personalisierten Vorschläge verfügbar.'
                      : 'No personalized suggestions available.'}
                  </p>
                </div>
              )}
            </TabsContent>
          )}
          
          <TabsContent value="steuer" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 w-48 bg-muted rounded"></div>
                  <div className="h-16 w-full bg-muted rounded"></div>
                </div>
              </div>
            ) : getCurrentSuggestions().length > 0 ? (
              getCurrentSuggestions().map((suggestion) => (
                <Card key={`${suggestion.workflowType}-${suggestion.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {language === 'de' ? suggestion.label.de : suggestion.label.en}
                      </p>
                      {suggestion.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description ? (language === 'de' ? suggestion.description.de : suggestion.description.en) : ''}
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => goToWorkflowStep(suggestion.workflowType, suggestion.id)}
                    >
                      {language === 'de' ? 'Starten' : 'Start'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Keine Vorschläge verfügbar für diesen Workflow.'
                    : 'No suggestions available for this workflow.'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="immobilien" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 w-48 bg-muted rounded"></div>
                  <div className="h-16 w-full bg-muted rounded"></div>
                </div>
              </div>
            ) : getCurrentSuggestions().length > 0 ? (
              getCurrentSuggestions().map((suggestion) => (
                <Card key={`${suggestion.workflowType}-${suggestion.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {language === 'de' ? suggestion.label.de : suggestion.label.en}
                      </p>
                      {suggestion.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description ? (language === 'de' ? suggestion.description.de : suggestion.description.en) : ''}
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => goToWorkflowStep(suggestion.workflowType, suggestion.id)}
                    >
                      {language === 'de' ? 'Starten' : 'Start'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Keine Vorschläge verfügbar für diesen Workflow.'
                    : 'No suggestions available for this workflow.'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="finanzierung" className="space-y-4">
            {/* Similar to other tabs */}
            {getCurrentSuggestions().length > 0 ? (
              getCurrentSuggestions().map((suggestion) => (
                <Card key={`${suggestion.workflowType}-${suggestion.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {language === 'de' ? suggestion.label.de : suggestion.label.en}
                      </p>
                      {suggestion.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description ? (language === 'de' ? suggestion.description.de : suggestion.description.en) : ''}
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => goToWorkflowStep(suggestion.workflowType, suggestion.id)}
                    >
                      {language === 'de' ? 'Starten' : 'Start'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Keine Vorschläge verfügbar für diesen Workflow.'
                    : 'No suggestions available for this workflow.'}
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="analyse" className="space-y-4">
            {/* Similar to other tabs */}
            {getCurrentSuggestions().length > 0 ? (
              getCurrentSuggestions().map((suggestion) => (
                <Card key={`${suggestion.workflowType}-${suggestion.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">
                        {language === 'de' ? suggestion.label.de : suggestion.label.en}
                      </p>
                      {suggestion.estimatedTime && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {suggestion.estimatedTime} {language === 'de' ? 'Min.' : 'min'}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <p className="text-sm text-muted-foreground mb-3">
                      {suggestion.description ? (language === 'de' ? suggestion.description.de : suggestion.description.en) : ''}
                    </p>
                    <Button 
                      size="sm"
                      onClick={() => goToWorkflowStep(suggestion.workflowType, suggestion.id)}
                    >
                      {language === 'de' ? 'Starten' : 'Start'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {language === 'de' 
                    ? 'Keine Vorschläge verfügbar für diesen Workflow.'
                    : 'No suggestions available for this workflow.'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={() => {
          toast({
            title: language === 'de' ? 'Vorschläge aktualisiert' : 'Suggestions refreshed',
            description: language === 'de' 
              ? 'Die Workflow-Vorschläge wurden aktualisiert.'
              : 'Workflow suggestions have been refreshed.'
          });
          
          // Re-trigger loading effect
          setLoading(true);
          setTimeout(() => setLoading(false), 500);
        }}>
          {language === 'de' ? 'Aktualisieren' : 'Refresh'}
        </Button>
        <Button size="sm" variant="secondary" onClick={() => {
          toast({
            title: language === 'de' ? 'Alle Workflows anzeigen' : 'View All Workflows',
            description: language === 'de' 
              ? 'Navigation zum Workflow-Dashboard...'
              : 'Navigating to the workflow dashboard...'
          });
        }}>
          {language === 'de' ? 'Alle Workflows anzeigen' : 'View All Workflows'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EnhancedWorkflowSuggestions;
