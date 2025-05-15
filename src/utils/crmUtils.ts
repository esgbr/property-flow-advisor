
import { CompanyType, ContactType } from "@/hooks/use-crm-data";

/**
 * Gets the display label for a company type in the selected language
 */
export function getCompanyTypeLabel(type: CompanyType, language: string): string {
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
}

/**
 * Gets the badge color for a company type
 */
export function getCompanyBadgeColor(type: CompanyType): string {
  switch (type) {
    case 'agency': return 'bg-blue-500';
    case 'investment_firm': return 'bg-purple-500';
    case 'property_manager': return 'bg-green-500';
    case 'construction': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
}

/**
 * Gets the display label for a contact type in the selected language
 */
export function getContactTypeLabel(type: ContactType, language: string): string {
  if (language === 'de') {
    const germanLabels: Record<ContactType, string> = {
      client: 'Kunde',
      lead: 'Interessent',
      agent: 'Makler',
      partner: 'Partner',
      other: 'Sonstige'
    };
    return germanLabels[type];
  } else {
    const englishLabels: Record<ContactType, string> = {
      client: 'Client',
      lead: 'Lead',
      agent: 'Agent',
      partner: 'Partner',
      other: 'Other'
    };
    return englishLabels[type];
  }
}

/**
 * Gets initials from a name (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Formats a date according to the user's language preference
 */
export function formatDate(dateString: string, language: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    language === 'de' ? 'de-DE' : 'en-US',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );
}
