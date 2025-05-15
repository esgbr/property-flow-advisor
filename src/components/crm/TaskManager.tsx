
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, Circle, Clock, ListTodo, 
  Plus, Loader2, RefreshCw, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTasks, Task, TaskPriority, TaskStatus } from '@/hooks/use-crm-data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  getPriorityColor, getPriorityLabel, getStatusLabel, 
  isTaskOverdue, formatDate
} from '@/utils/crmUtils';
import EmptyState from './shared/EmptyState';

export interface TaskManagerProps {
  companyId?: string;
  contactId?: string;
  companyName?: string;
  contactName?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  companyId, 
  contactId,
  companyName,
  contactName
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { tasks, loading, updateTask, refreshTasks } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Filter tasks based on company or contact
  const filteredTasks = tasks.filter(task => {
    if (companyId && task.company_id === companyId) return true;
    if (contactId && task.contact_id === contactId) return true;
    if (!companyId && !contactId) return true; // Show all if no filter
    return false;
  });
  
  // Sort by due date and then by priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by status (pending first)
    if (a.status !== b.status) {
      if (a.status === 'pending') return -1;
      if (b.status === 'pending') return 1;
      if (a.status === 'in-progress') return -1;
      if (b.status === 'in-progress') return 1;
    }
    
    // Then sort by due date
    const aDate = a.due_date ? new Date(a.due_date) : new Date(9999, 11, 31);
    const bDate = b.due_date ? new Date(b.due_date) : new Date(9999, 11, 31);
    
    if (aDate.getTime() !== bDate.getTime()) {
      return aDate.getTime() - bDate.getTime();
    }
    
    // Finally sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority as TaskPriority] - priorityOrder[b.priority as TaskPriority];
  });

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleTaskStatus = async (task: Task) => {
    // Define the next status in the cycle: pending -> in-progress -> completed -> pending
    let nextStatus: TaskStatus;
    switch (task.status) {
      case 'pending': nextStatus = 'in-progress'; break;
      case 'in-progress': nextStatus = 'completed'; break;
      default: nextStatus = 'pending'; break;
    }
    
    await updateTask(task.id, { status: nextStatus });
    
    toast({
      title: language === 'de' ? 'Aufgabe aktualisiert' : 'Task updated',
      description: `${language === 'de' ? 'Status: ' : 'Status: '}${getStatusLabel(nextStatus, language)}`,
    });
  };

  const handleAddTask = () => {
    setIsAddingTask(true);
    
    // In a real implementation, this would open a modal or form
    setTimeout(() => {
      setIsAddingTask(false);
      toast({
        title: language === 'de' ? 'Kommt bald' : 'Coming soon',
        description: language === 'de' ? 'Diese Funktion wird bald verfügbar sein' : 'This feature will be available soon'
      });
    }, 1000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTasks();
    setIsRefreshing(false);
    
    toast({
      title: language === 'de' ? 'Aufgaben aktualisiert' : 'Tasks refreshed'
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">
            {language === 'de' ? 'Aufgaben' : 'Tasks'}
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || loading}
              className="transition-transform hover:scale-105"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {language === 'de' ? 'Aktualisieren' : 'Refresh'}
            </Button>
            <Button 
              size="sm" 
              onClick={handleAddTask}
              disabled={isAddingTask}
              className="transition-transform hover:scale-105"
            >
              {isAddingTask ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {language === 'de' ? 'Hinzufügen' : 'Add'}
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTasks.length > 0 ? (
          <div className="space-y-3">
            {sortedTasks.map(task => (
              <div 
                key={task.id} 
                className={`flex gap-3 p-3 rounded-lg transition-colors ${
                  task.status === 'completed' ? 'bg-muted/30' : 'hover:bg-muted/50'
                } animate-fade-in`}
              >
                <button 
                  onClick={() => toggleTaskStatus(task)}
                  className="mt-1"
                >
                  {getStatusIcon(task.status)}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <Badge className={getPriorityColor(task.priority as TaskPriority)}>
                      {getPriorityLabel(task.priority as TaskPriority, language)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-muted-foreground' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {task.due_date && (
                      <div className={`flex items-center ${isTaskOverdue(task.due_date, task.status) ? 'text-red-500' : ''}`}>
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(task.due_date, language)}
                      </div>
                    )}
                    
                    {/* Show related contact/company if available */}
                    {(task.contact_id && contactName) && (
                      <span className="mr-2">
                        {language === 'de' ? 'Kontakt: ' : 'Contact: '}
                        {contactName}
                      </span>
                    )}
                    {(task.company_id && companyName) && (
                      <span>
                        {language === 'de' ? 'Unternehmen: ' : 'Company: '}
                        {companyName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ListTodo}
            title={language === 'de' ? 'Keine Aufgaben gefunden' : 'No tasks found'}
            description={language === 'de' 
              ? 'Es wurden noch keine Aufgaben erstellt' 
              : 'No tasks have been created yet'}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TaskManager;
