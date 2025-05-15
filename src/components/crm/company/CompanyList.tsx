
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Building } from 'lucide-react';
import { Company, CompanyType } from '@/hooks/use-crm-data';
import CRMListItem from '../shared/CRMListItem';
import EmptyState from '../shared/EmptyState';
import ListContainer from '../shared/ListContainer';

interface CompanyListProps {
  companies: Company[];
  loading: boolean;
  onCompanyClick: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
  initiateCall: (company: Company) => void;
}

const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  loading,
  onCompanyClick,
  onFavoriteToggle,
  initiateCall
}) => {
  const { language } = useLanguage();

  const getTypeLabel = (type: CompanyType): string => {
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

  const getBadgeColor = (type: CompanyType): string => {
    switch (type) {
      case 'agency': return 'bg-blue-500 text-white';
      case 'investment_firm': return 'bg-purple-500 text-white';
      case 'property_manager': return 'bg-green-500 text-white';
      case 'construction': return 'bg-amber-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const emptyState = (
    <EmptyState
      icon={Building}
      title={language === 'de' ? 'Keine Unternehmen gefunden' : 'No companies found'}
      description={language === 'de' 
        ? 'Versuchen Sie, Ihre Filterkriterien anzupassen' 
        : 'Try adjusting your search filters'}
    />
  );

  return (
    <ListContainer loading={loading} emptyState={emptyState}>
      {companies.map((company) => (
        <CRMListItem
          key={company.id}
          id={company.id}
          name={company.name}
          secondaryText={company.phone || ''}
          address={company.address}
          notes={company.notes}
          phone={company.phone}
          type={company.type}
          typeLabel={getTypeLabel(company.type as CompanyType)}
          badgeColor={getBadgeColor(company.type as CompanyType)}
          favorite={company.favorite}
          onItemClick={onCompanyClick}
          onFavoriteToggle={(id, e) => {
            e.stopPropagation();
            onFavoriteToggle(id);
          }}
          onCallClick={company.phone ? (e) => {
            e.stopPropagation();
            initiateCall(company);
          } : undefined}
        />
      ))}
    </ListContainer>
  );
};

export default CompanyList;
