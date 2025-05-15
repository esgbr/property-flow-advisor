
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle, Circle, AlertCircle, Clock, ListTodo, 
  Plus, ArrowUpCircle, Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTasks, Task, TaskPriority, TaskStatus, useContacts, useCompanies } from '@/hooks/use-crm-data';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/crmUtils';

export interface TaskManagerProps {
  companyId?: string;
  contactId?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ companyId, contactId }) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const { tasks, loading, updateTask } = useTasks();
  const { contacts } = useContacts();
  const { companies } = useCompanies();
  const [isAddingTask, setIsAddingTask] = useState(false);
  
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
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      default: return 'bg-green-100 text-green-600 border-green-200';
    }
  };

  const getPriorityLabel = (priority: TaskPriority) => {
    if (language === 'de') {
      switch (priority) {
        case 'high': return 'Hoch';
        case 'medium': return 'Mittel';
        default: return 'Niedrig';
      }
    } else {
      return priority.charAt(0).toUpperCase() + priority.slice(1);
    }
  };

  const getStatusLabel = (status: TaskStatus) => {
    if (language === 'de') {
      switch (status) {
        case 'completed': return 'Abgeschlossen';
        case 'in-progress': return 'In Bearbeitung';
        default: return 'Ausstehend';
      }
    } else {
      return status === 'in-progress' ? 'In Progress' : 
             (status.charAt(0).toUpperCase() + status.slice(1));
    }
  };

  const getContactName = (id: string) => {
    const contact = contacts.find(c => c.id === id);
    return contact ? contact.name : id;
  };

  const getCompanyName = (id: string) => {
    const company = companies.find(c => c.id === id);
    return company ? company.name : id;
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
      description: `${language === 'de' ? 'Status: ' : 'Status: '}${getStatusLabel(nextStatus)}`,
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

  const isTaskOverdue = (task: Task) => {
    if (!task.due_date || task.status === 'completed') return false;
    const dueDate = new Date(task.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-lg">
            {language === 'de' ? 'Aufgaben' : 'Tasks'}
          </h3>
          <Button 
            size="sm" 
            onClick={handleAddTask}
            disabled={isAddingTask}
          >
            {isAddingTask ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            {language === 'de' ? 'Hinzufügen' : 'Add'}
          </Button>
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
                }`}
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
                    <Badge className={getPriorityColor(task.priority)}>
                      {getPriorityLabel(task.priority)}
                    </Badge>
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm mt-1 ${task.status === 'completed' ? 'text-muted-foreground' : ''}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    {task.due_date && (
                      <div className={`flex items-center ${isTaskOverdue(task) ? 'text-red-500' : ''}`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(task.due_date, language)}
                      </div>
                    )}
                    
                    {/* Show related contact/company if available */}
                    {task.contact_id && (
                      <span className="mr-2">
                        {language === 'de' ? 'Kontakt: ' : 'Contact: '}
                        {getContactName(task.contact_id)}
                      </span>
                    )}
                    {task.company_id && (
                      <span>
                        {language === 'de' ? 'Unternehmen: ' : 'Company: '}
                        {getCompanyName(task.company_id)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <ListTodo className="h-12 w-12 text-muted-foreground opacity-30 mx-auto" />
            <h3 className="mt-2 font-medium">
              {language === 'de' ? 'Keine Aufgaben gefunden' : 'No tasks found'}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {language === 'de' 
                ? 'Es wurden noch keine Aufgaben erstellt' 
                : 'No tasks have been created yet'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskManager;
