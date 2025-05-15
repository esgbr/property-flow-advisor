import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTasks, Task, TaskPriority, TaskStatus } from '@/hooks/use-crm-data';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, CheckCircle2, Clock, Plus, CalendarClock, User, Building, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TaskManagerProps {
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
  const { tasks, loading, addTask, updateTask } = useTasks();
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'pending' as TaskStatus,
    due_date: format(new Date(), 'yyyy-MM-dd'),
    contact_id: contactId,
    company_id: companyId
  });

  const handleAddTask = async () => {
    if (!newTask.title) {
      toast({
        variant: 'destructive',
        title: language === 'de' ? 'Titel erforderlich' : 'Title required',
        description: language === 'de' 
          ? 'Bitte geben Sie einen Titel für die Aufgabe ein' 
          : 'Please enter a title for the task'
      });
      return;
    }

    const result = await addTask(newTask as Omit<Task, 'id'>);
    
    if (result) {
      setNewTask({
        title: '',
        description: '',
        priority: 'medium' as TaskPriority,
        status: 'pending' as TaskStatus,
        due_date: format(new Date(), 'yyyy-MM-dd'),
        contact_id: contactId,
        company_id: companyId
      });
      setShowAddTask(false);

      toast({
        title: language === 'de' ? 'Aufgabe erstellt' : 'Task created',
        description: language === 'de'
          ? 'Die Aufgabe wurde erfolgreich erstellt'
          : 'The task has been successfully created'
      });
    }
  };

  const handleUpdateTaskStatus = async (taskId: string, status: TaskStatus) => {
    const result = await updateTask(taskId, { status });
    
    if (result) {
      toast({
        title: language === 'de' ? 'Status aktualisiert' : 'Status updated',
        description: language === 'de'
          ? 'Der Status der Aufgabe wurde aktualisiert'
          : 'The task status has been updated'
      });
    }
  };

  const getFilteredTasks = () => {
    const filteredByRelation = tasks.filter(task => {
      // Filter by contact_id or company_id if provided
      if (contactId && task.contact_id !== contactId) return false;
      if (companyId && task.company_id !== companyId) return false;
      return true;
    });
    
    if (activeTab === 'all') {
      return filteredByRelation;
    } else if (activeTab === 'completed') {
      return filteredByRelation.filter(task => task.status === 'completed');
    } else if (activeTab === 'pending') {
      return filteredByRelation.filter(task => task.status === 'pending');
    } else {
      return filteredByRelation.filter(task => task.status === 'in-progress');
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return language === 'de'
      ? format(date, 'PPP', { locale: de })
      : format(date, 'PPP');
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">{language === 'de' ? 'Hoch' : 'High'}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">{language === 'de' ? 'Mittel' : 'Medium'}</Badge>;
      case 'low':
        return <Badge className="bg-green-500">{language === 'de' ? 'Niedrig' : 'Low'}</Badge>;
    }
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">{language === 'de' ? 'Abgeschlossen' : 'Completed'}</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">{language === 'de' ? 'In Bearbeitung' : 'In Progress'}</Badge>;
      case 'pending':
        return <Badge className="bg-amber-500">{language === 'de' ? 'Ausstehend' : 'Pending'}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {language === 'de' ? 'Aufgabenverwaltung' : 'Task Management'}
        </CardTitle>
        <CardDescription>
          {language === 'de' 
            ? 'Verwaltung von Aufgaben im Zusammenhang mit Ihren CRM-Kontakten' 
            : 'Manage tasks related to your CRM contacts'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              {language === 'de' ? 'Alle' : 'All'}
            </TabsTrigger>
            <TabsTrigger value="pending">
              {language === 'de' ? 'Ausstehend' : 'Pending'}
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              {language === 'de' ? 'In Bearbeitung' : 'In Progress'}
            </TabsTrigger>
            <TabsTrigger value="completed">
              {language === 'de' ? 'Abgeschlossen' : 'Completed'}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {showAddTask ? (
              <div className="space-y-4 border p-4 rounded-md mb-4">
                <h3 className="font-medium text-lg">
                  {language === 'de' ? 'Neue Aufgabe' : 'New Task'}
                </h3>
                
                <div className="space-y-3">
                  <Input
                    placeholder={language === 'de' ? 'Aufgabentitel' : 'Task title'}
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                  
                  <Textarea
                    placeholder={language === 'de' ? 'Beschreibung' : 'Description'}
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm mb-1 text-muted-foreground">
                        {language === 'de' ? 'Fälligkeitsdatum' : 'Due Date'}
                      </p>
                      <Input
                        type="date"
                        value={newTask.due_date as string}
                        onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm mb-1 text-muted-foreground">
                        {language === 'de' ? 'Priorität' : 'Priority'}
                      </p>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({...newTask, priority: value as TaskPriority})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={language === 'de' ? 'Priorität wählen' : 'Select priority'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">{language === 'de' ? 'Niedrig' : 'Low'}</SelectItem>
                          <SelectItem value="medium">{language === 'de' ? 'Mittel' : 'Medium'}</SelectItem>
                          <SelectItem value="high">{language === 'de' ? 'Hoch' : 'High'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" onClick={() => setShowAddTask(false)}>
                    {language === 'de' ? 'Abbrechen' : 'Cancel'}
                  </Button>
                  <Button onClick={handleAddTask}>
                    {language === 'de' ? 'Aufgabe speichern' : 'Save Task'}
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                className="mb-4" 
                onClick={() => setShowAddTask(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Neue Aufgabe' : 'New Task'}
              </Button>
            )}
            
            {loading ? (
              <div className="space-y-3">
                {Array.from({length: 3}).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-3 w-full" />
                      <div className="flex items-center gap-2 pt-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {getFilteredTasks().length > 0 ? (
                  getFilteredTasks().map((task) => (
                    <div 
                      key={task.id} 
                      className={`border p-4 rounded-md ${task.status === 'completed' ? 'bg-muted/30' : 'hover:bg-muted/20'}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex space-x-1">
                          {task.status !== 'completed' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleUpdateTaskStatus(task.id, 'completed')}
                              title={language === 'de' ? 'Als erledigt markieren' : 'Mark as completed'}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-3">
                        {getPriorityBadge(task.priority as TaskPriority)}
                        {getStatusBadge(task.status as TaskStatus)}
                        
                        {task.due_date && (
                          <Badge variant="outline">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            {formatDate(task.due_date)}
                          </Badge>
                        )}
                        
                        {(task.contact_id || task.company_id) && (
                          <Badge variant="outline">
                            {task.contact_id ? (
                              <User className="h-3 w-3 mr-1" />
                            ) : (
                              <Building className="h-3 w-3 mr-1" />
                            )}
                            {contactName || companyName || "Related entity"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md">
                    <Clock className="h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="font-medium text-lg">
                      {language === 'de' ? 'Keine Aufgaben gefunden' : 'No tasks found'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                      {language === 'de' 
                        ? 'Es sind keine Aufgaben in dieser Kategorie vorhanden. Erstellen Sie eine neue Aufgabe, um zu beginnen.' 
                        : 'There are no tasks in this category. Create a new task to get started.'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
