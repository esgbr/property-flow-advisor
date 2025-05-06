
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { WorkflowType } from '@/hooks/use-workflow';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Check, SortAsc, SortDesc, Filter } from 'lucide-react';

type SortBy = 'name' | 'progress' | 'recentActivity' | 'estimatedTime';
type SortOrder = 'asc' | 'desc';
type FilterBy = 'all' | 'inProgress' | 'completed' | 'notStarted';

interface WorkflowFilterSortProps {
  workflowTypes: WorkflowType[];
  onFilterChange: (filteredWorkflows: WorkflowType[]) => void;
  className?: string;
}

/**
 * Component for filtering and sorting workflows
 */
const WorkflowFilterSort: React.FC<WorkflowFilterSortProps> = ({
  workflowTypes,
  onFilterChange,
  className
}) => {
  const { language } = useLanguage();
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [showCompleted, setShowCompleted] = useState(true);
  
  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    // In a real implementation, this would filter and sort the workflows
    // based on the selected criteria
    
    // For this example, we'll just pass all workflow types for now
    onFilterChange(workflowTypes);
  };
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Filter className="h-5 w-5 mr-2" />
          {language === 'de' ? 'Filter & Sortierung' : 'Filter & Sort'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Passen Sie die Anzeige Ihrer Workflows an'
            : 'Customize the display of your workflows'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort-by">
            {language === 'de' ? 'Sortieren nach' : 'Sort by'}
          </Label>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortBy)}
          >
            <SelectTrigger id="sort-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">
                {language === 'de' ? 'Name' : 'Name'}
              </SelectItem>
              <SelectItem value="progress">
                {language === 'de' ? 'Fortschritt' : 'Progress'}
              </SelectItem>
              <SelectItem value="recentActivity">
                {language === 'de' ? 'Letzte Aktivität' : 'Recent Activity'}
              </SelectItem>
              <SelectItem value="estimatedTime">
                {language === 'de' ? 'Geschätzte Zeit' : 'Estimated Time'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Sort Order */}
        <div className="space-y-2">
          <Label>
            {language === 'de' ? 'Sortierreihenfolge' : 'Sort Order'}
          </Label>
          <div className="flex space-x-2">
            <Button
              variant={sortOrder === 'asc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('asc')}
              className="flex-1"
            >
              <SortAsc className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Aufsteigend' : 'Ascending'}
            </Button>
            <Button
              variant={sortOrder === 'desc' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortOrder('desc')}
              className="flex-1"
            >
              <SortDesc className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Absteigend' : 'Descending'}
            </Button>
          </div>
        </div>
        
        {/* Filter By */}
        <div className="space-y-2">
          <Label htmlFor="filter-by">
            {language === 'de' ? 'Filtern nach' : 'Filter by'}
          </Label>
          <Select
            value={filterBy}
            onValueChange={(value) => setFilterBy(value as FilterBy)}
          >
            <SelectTrigger id="filter-by">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === 'de' ? 'Alle' : 'All'}
              </SelectItem>
              <SelectItem value="inProgress">
                {language === 'de' ? 'In Bearbeitung' : 'In Progress'}
              </SelectItem>
              <SelectItem value="completed">
                {language === 'de' ? 'Abgeschlossen' : 'Completed'}
              </SelectItem>
              <SelectItem value="notStarted">
                {language === 'de' ? 'Nicht begonnen' : 'Not Started'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Show Completed */}
        <div className="flex items-center justify-between">
          <Label htmlFor="show-completed" className="flex-grow">
            {language === 'de' ? 'Abgeschlossene anzeigen' : 'Show completed'}
          </Label>
          <Switch
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={setShowCompleted}
          />
        </div>
        
        {/* Apply Button */}
        <Button 
          onClick={applyFiltersAndSort}
          className="w-full"
        >
          <Check className="h-4 w-4 mr-2" />
          {language === 'de' ? 'Anwenden' : 'Apply'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default WorkflowFilterSort;
