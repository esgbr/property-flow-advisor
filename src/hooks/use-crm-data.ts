
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Type definitions for CRM data
export type ContactType = 'client' | 'lead' | 'agent' | 'partner' | 'other';
export type CompanyType = 'agency' | 'investment_firm' | 'property_manager' | 'construction' | 'other';
export type ActivityType = 'call' | 'email' | 'meeting' | 'note' | 'task' | 'other';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  type: ContactType;
  notes?: string | null;
  favorite: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}

export interface Company {
  id: string;
  name: string;
  type: CompanyType;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  favorite: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
  contactCount?: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string | null;
  date: string;
  contact_id?: string | null;
  company_id?: string | null;
  created_at?: string | null;
  user_id?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string | null;
  contact_id?: string | null;
  company_id?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  user_id?: string | null;
}

// Hook for contacts
export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('contacts').select('*');
      
      if (error) {
        throw error;
      }
      
      // Type cast the data to ensure it matches the Contact type
      const typedContacts = (data || []).map(contact => ({
        ...contact,
        type: contact.type as ContactType,
        favorite: contact.favorite === null ? false : contact.favorite
      })) as Contact[];
      
      setContacts(typedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Kontakte' : 'Error loading contacts',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Omit<Contact, 'id'>) => {
    try {
      const { data, error } = await supabase.from('contacts').insert(contact).select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned contact
        const newContact = {
          ...data[0],
          type: data[0].type as ContactType,
          favorite: data[0].favorite === null ? false : data[0].favorite
        } as Contact;
        
        setContacts(prevContacts => [...prevContacts, newContact]);
        return newContact;
      }
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Erstellen des Kontakts' : 'Error creating contact',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned updated contact
        const updatedContact = {
          ...data[0],
          type: data[0].type as ContactType,
          favorite: data[0].favorite === null ? false : data[0].favorite
        } as Contact;
        
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === id ? updatedContact : contact
          )
        );
        return updatedContact;
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Aktualisieren des Kontakts' : 'Error updating contact',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Löschen des Kontakts' : 'Error deleting contact',
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchContacts();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('contacts-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'contacts' 
      }, () => {
        fetchContacts();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    contacts,
    loading,
    addContact,
    updateContact,
    deleteContact,
    refreshContacts: fetchContacts
  };
};

// Hook for companies
export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('companies').select('*');
      
      if (error) {
        throw error;
      }
      
      // Type cast the data to ensure it matches the Company type
      const typedCompanies = (data || []).map(company => ({
        ...company,
        type: company.type as CompanyType,
        favorite: company.favorite === null ? false : company.favorite
      })) as Company[];
      
      setCompanies(typedCompanies);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Unternehmen' : 'Error loading companies',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addCompany = async (company: Omit<Company, 'id'>) => {
    try {
      const { data, error } = await supabase.from('companies').insert(company).select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned company
        const newCompany = {
          ...data[0],
          type: data[0].type as CompanyType,
          favorite: data[0].favorite === null ? false : data[0].favorite
        } as Company;
        
        setCompanies(prevCompanies => [...prevCompanies, newCompany]);
        return newCompany;
      }
    } catch (error) {
      console.error('Error adding company:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Erstellen des Unternehmens' : 'Error creating company',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateCompany = async (id: string, updates: Partial<Company>) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned updated company
        const updatedCompany = {
          ...data[0],
          type: data[0].type as CompanyType,
          favorite: data[0].favorite === null ? false : data[0].favorite
        } as Company;
        
        setCompanies(prevCompanies => 
          prevCompanies.map(company => 
            company.id === id ? updatedCompany : company
          )
        );
        return updatedCompany;
      }
    } catch (error) {
      console.error('Error updating company:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Aktualisieren des Unternehmens' : 'Error updating company',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setCompanies(prevCompanies => prevCompanies.filter(company => company.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting company:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Löschen des Unternehmens' : 'Error deleting company',
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCompanies();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('companies-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'companies' 
      }, () => {
        fetchCompanies();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    companies,
    loading,
    addCompany,
    updateCompany,
    deleteCompany,
    refreshCompanies: fetchCompanies
  };
};

// Hook for tasks
export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('tasks').select('*');
      
      if (error) {
        throw error;
      }
      
      // Type cast the data to ensure it matches the Task type
      const typedTasks = (data || []).map(task => ({
        ...task,
        priority: task.priority as TaskPriority,
        status: task.status as TaskStatus
      })) as Task[];
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Aufgaben' : 'Error loading tasks',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      const { data, error } = await supabase.from('tasks').insert(task).select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned task
        const newTask = {
          ...data[0],
          priority: data[0].priority as TaskPriority,
          status: data[0].status as TaskStatus
        } as Task;
        
        setTasks(prevTasks => [...prevTasks, newTask]);
        return newTask;
      }
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Erstellen der Aufgabe' : 'Error creating task',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned updated task
        const updatedTask = {
          ...data[0],
          priority: data[0].priority as TaskPriority,
          status: data[0].status as TaskStatus
        } as Task;
        
        setTasks(prevTasks => 
          prevTasks.map(task => 
            task.id === id ? updatedTask : task
          )
        );
        return updatedTask;
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Aktualisieren der Aufgabe' : 'Error updating task',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Löschen der Aufgabe' : 'Error deleting task',
        description: String(error),
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchTasks();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('tasks-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, () => {
        fetchTasks();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks
  };
};

// Hook for activities
export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { language } = useLanguage();

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('activities').select('*');
      
      if (error) {
        throw error;
      }
      
      // Type cast the data to ensure it matches the Activity type
      const typedActivities = (data || []).map(activity => ({
        ...activity,
        type: activity.type as ActivityType
      })) as Activity[];
      
      setActivities(typedActivities);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Laden der Aktivitäten' : 'Error loading activities',
        description: String(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: Omit<Activity, 'id'>) => {
    try {
      const { data, error } = await supabase.from('activities').insert(activity).select();
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Type cast the returned activity
        const newActivity = {
          ...data[0],
          type: data[0].type as ActivityType
        } as Activity;
        
        setActivities(prevActivities => [...prevActivities, newActivity]);
        return newActivity;
      }
    } catch (error) {
      console.error('Error adding activity:', error);
      toast({
        title: language === 'de' ? 'Fehler beim Erstellen der Aktivität' : 'Error creating activity',
        description: String(error),
        variant: 'destructive',
      });
      return null;
    }
  };

  useEffect(() => {
    fetchActivities();
    
    // Set up a realtime subscription
    const subscription = supabase
      .channel('activities-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'activities' 
      }, () => {
        fetchActivities();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return {
    activities,
    loading,
    addActivity,
    refreshActivities: fetchActivities
  };
};
