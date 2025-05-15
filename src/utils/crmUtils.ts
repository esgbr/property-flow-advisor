
import { format, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';
import { Contact } from '@/components/crm/ContactManager';
import { Company, CompanyType, TaskPriority, TaskStatus, ContactType } from '@/hooks/use-crm-data';

/**
 * Format a date according to the user's language
 */
export const formatDate = (dateString: string, language = 'en') => {
  try {
    const date = parseISO(dateString);
    return language === 'de'
      ? format(date, 'dd.MM.yyyy', { locale: de })
      : format(date, 'MMM d, yyyy');
  } catch (error) {
    console.error('Invalid date format:', error);
    return dateString;
  }
};

/**
 * Get initials from a name
 */
export const getInitials = (name: string): string => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Get company type label based on language
 */
export const getCompanyTypeLabel = (type: CompanyType, language = 'en'): string => {
  if (language === 'de') {
    const germanLabels: Record<CompanyType, string> = {
      agency: 'Immobilienagentur',
      investment_firm: 'Investmentfirma',
      property_manager: 'Hausverwaltung',
      construction: 'Bauunternehmen',
      other: 'Sonstige'
    };
    return germanLabels[type];
  } else {
    const englishLabels: Record<CompanyType, string> = {
      agency: 'Real Estate Agency',
      investment_firm: 'Investment Firm',
      property_manager: 'Property Manager',
      construction: 'Construction',
      other: 'Other'
    };
    return englishLabels[type];
  }
};

/**
 * Get contact type label based on language
 */
export const getContactTypeLabel = (type: ContactType | string, language = 'en'): string => {
  if (language === 'de') {
    const types: Record<string, string> = {
      client: 'Kunde',
      prospect: 'Interessent',
      agent: 'Makler',
      partner: 'Partner',
      other: 'Sonstige'
    };
    return types[type] || type;
  } else {
    const types: Record<string, string> = {
      client: 'Client',
      prospect: 'Prospect',
      agent: 'Agent',
      partner: 'Partner',
      other: 'Other'
    };
    return types[type] || type;
  }
};

/**
 * Get badge color for company type
 */
export const getCompanyBadgeColor = (type: CompanyType): string => {
  switch (type) {
    case 'agency': return 'bg-blue-500 text-white';
    case 'investment_firm': return 'bg-purple-500 text-white';
    case 'property_manager': return 'bg-green-500 text-white';
    case 'construction': return 'bg-amber-500 text-white';
    default: return 'bg-gray-500 text-white';
  }
};

/**
 * Get badge color for task priority
 */
export const getPriorityColor = (priority: TaskPriority): string => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-600 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    default: return 'bg-green-100 text-green-600 border-green-200';
  }
};

/**
 * Get task priority label based on language
 */
export const getPriorityLabel = (priority: TaskPriority, language = 'en') => {
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

/**
 * Get task status label based on language
 */
export const getStatusLabel = (status: TaskStatus, language = 'en') => {
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

/**
 * Check if a task is overdue
 */
export const isTaskOverdue = (dueDate: string | null | undefined, status: TaskStatus): boolean => {
  if (!dueDate || status === 'completed') return false;
  const parsedDueDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsedDueDate < today;
};
