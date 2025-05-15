
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, CheckCircle2, Clock, Plus, CalendarClock, User, Building } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  relatedTo?: {
    type: 'contact' | 'company';
    id: string;
    name: string;
  };
  createdAt: string;
}

interface TaskManagerProps {
  contactId?: string;
  contactName?: string;
  companyId?: string;
  companyName?: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ 
  contactId, 
  contactName, 
  companyId, 
  companyName 
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  // Mock data - in a real app, this would come from a database
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Follow up on property viewing',
      description: 'Call to discuss impressions after viewing the apartment on Friedrichstraße',
      dueDate: '2025-05-20',
      priority: 'high',
      status: 'pending',
      relatedTo: contactId && contactName ? {
        type: 'contact',
        id: contactId,
        name: contactName,
      } : undefined,
      createdAt: '2025-05-14',
    },
    {
      id: '2',
      title: 'Send investment proposal',
      description: 'Prepare and send the investment proposal for the Munich property',
      dueDate: '2025-05-25',
      priority: 'medium',
      status: 'in-progress',
      relatedTo: companyId && companyName ? {
        type: 'company',
        id: companyId,
        name: companyName,
      } : undefined,
      createdAt: '2025-05-10',
    },
  ]);

  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    relatedTo: contactId && contactName 
      ? { type: 'contact', id: contactId, name: contactName }
      : companyId && companyName
      ? { type: 'company', id: companyId, name: companyName }
      : undefined
  });

  const addTask = () => {
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

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'low' | 'medium' | 'high',
      status: newTask.status as 'pending' | 'in-progress' | 'completed',
      relatedTo: newTask.relatedTo,
      createdAt: new Date().toISOString(),
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      relatedTo: task.relatedTo
    });
    setShowAddTask(false);

    toast({
      title: language === 'de' ? 'Aufgabe erstellt' : 'Task created',
      description: language === 'de'
        ? 'Die Aufgabe wurde erfolgreich erstellt'
        : 'The task has been successfully created'
    });
  };

  const updateTaskStatus = (taskId: string, status: 'pending' | 'in-progress' | 'completed') => {
    setTasks(tasks.map(task => 
      task.id === taskId
        ? { ...task, status }
        : task
    ));

    toast({
      title: language === 'de' ? 'Status aktualisiert' : 'Status updated',
      description: language === 'de'
        ? 'Der Status der Aufgabe wurde aktualisiert'
        : 'The task status has been updated'
    });
  };

  const getFilteredTasks = () => {
    if (activeTab === 'all') {
      return tasks;
    } else if (activeTab === 'completed') {
      return tasks.filter(task => task.status === 'completed');
    } else if (activeTab === 'pending') {
      return tasks.filter(task => task.status === 'pending');
    } else {
      return tasks.filter(task => task.status === 'in-progress');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return language === 'de'
      ? format(date, 'PPP', { locale: de })
      : format(date, 'PPP');
  };

  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">{language === 'de' ? 'Hoch' : 'High'}</Badge>;
      case 'medium':
        return <Badge className="bg-amber-500">{language === 'de' ? 'Mittel' : 'Medium'}</Badge>;
      case 'low':
        return <Badge className="bg-green-500">{language === 'de' ? 'Niedrig' : 'Low'}</Badge>;
    }
  };

  const getStatusBadge = (status: 'pending' | 'in-progress' | 'completed') => {
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
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <p className="text-sm mb-1 text-muted-foreground">
                        {language === 'de' ? 'Priorität' : 'Priority'}
                      </p>
                      <Select
                        value={newTask.priority}
                        onValueChange={(value) => setNewTask({...newTask, priority: value as 'low' | 'medium' | 'high'})}
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
                  <Button onClick={addTask}>
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
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                            title={language === 'de' ? 'Als erledigt markieren' : 'Mark as completed'}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                      
                      {task.dueDate && (
                        <Badge variant="outline">
                          <CalendarClock className="h-3 w-3 mr-1" />
                          {formatDate(task.dueDate)}
                        </Badge>
                      )}
                      
                      {task.relatedTo && (
                        <Badge variant="outline">
                          {task.relatedTo.type === 'contact' ? (
                            <User className="h-3 w-3 mr-1" />
                          ) : (
                            <Building className="h-3 w-3 mr-1" />
                          )}
                          {task.relatedTo.name}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaskManager;
