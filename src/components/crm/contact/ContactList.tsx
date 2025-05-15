
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from 'lucide-react';
import { Contact } from '@/components/crm/ContactManager';
import CRMListItem from '../shared/CRMListItem';
import EmptyState from '../shared/EmptyState';
import ListContainer from '../shared/ListContainer';

interface ContactListProps {
  contacts: Contact[];
  loading?: boolean;
  onContactClick: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
  initiateCall: (contact: Contact) => void;
  sendEmail: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  loading = false,
  onContactClick,
  onFavoriteToggle,
  initiateCall,
  sendEmail
}) => {
  const { language } = useLanguage();

  const getTypeLabel = (type: string): string => {
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

  const emptyState = (
    <EmptyState
      icon={User}
      title={language === 'de' ? 'Keine Kontakte gefunden' : 'No contacts found'}
      description={language === 'de' 
        ? 'Versuchen Sie, Ihre Filterkriterien anzupassen oder neue Kontakte hinzuzufügen' 
        : 'Try adjusting your search filters or add new contacts'}
    />
  );

  return (
    <ListContainer loading={loading} emptyState={emptyState}>
      {contacts.map((contact) => (
        <CRMListItem
          key={contact.id}
          id={contact.id}
          name={contact.name}
          secondaryText={contact.phone}
          notes={contact.notes}
          phone={contact.phone}
          email={contact.email}
          type={contact.type}
          typeLabel={getTypeLabel(contact.type)}
          favorite={contact.favorite}
          onItemClick={onContactClick}
          onFavoriteToggle={(id, e) => {
            e.stopPropagation();
            onFavoriteToggle(id);
          }}
          onCallClick={(e) => {
            e.stopPropagation();
            initiateCall(contact);
          }}
          onEmailClick={contact.email ? (e) => {
            e.stopPropagation();
            sendEmail(contact);
          } : undefined}
        />
      ))}
    </ListContainer>
  );
};

export default ContactList;
