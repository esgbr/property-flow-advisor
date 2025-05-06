
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calculator, BarChart3, Map, FileText, Search } from 'lucide-react';

const QuickActions: React.FC = () => {
  const { language } = useLanguage();
  
  const actions = [
    {
      id: 'calculate-roi',
      icon: <Calculator className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'ROI berechnen' : 'Calculate ROI',
      action: () => console.log('Calculate ROI action')
    },
    {
      id: 'market-trends',
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Markttrends' : 'Market trends',
      action: () => console.log('Market trends action')
    },
    {
      id: 'property-search',
      icon: <Search className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Immobilien suchen' : 'Search properties',
      action: () => console.log('Property search action')
    },
    {
      id: 'view-reports',
      icon: <FileText className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Berichte anzeigen' : 'View reports',
      action: () => console.log('View reports action')
    },
    {
      id: 'regional-map',
      icon: <Map className="h-4 w-4 mr-2" />,
      label: language === 'de' ? 'Regionalkarte' : 'Regional map',
      action: () => console.log('Regional map action')
    }
  ];

  return (
    <div className="space-y-2">
      {actions.map(action => (
        <Button
          key={action.id}
          variant="ghost"
          className="w-full justify-start text-left"
          onClick={action.action}
        >
          <div className="flex items-center">
            {action.icon}
            <span>{action.label}</span>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default QuickActions;
