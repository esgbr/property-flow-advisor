
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, StarOff, PhoneCall, Mail } from 'lucide-react';

interface CRMListItemProps {
  id: string;
  name: string;
  description?: string;
  secondaryText?: string;
  address?: string;
  notes?: string;
  phone?: string;
  email?: string;
  type: string;
  favorite: boolean;
  typeLabel: string;
  badgeColor?: string;
  onItemClick: (id: string) => void;
  onFavoriteToggle: (id: string, event: React.MouseEvent) => void;
  onCallClick?: (event: React.MouseEvent) => void;
  onEmailClick?: (event: React.MouseEvent) => void;
}

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const CRMListItem: React.FC<CRMListItemProps> = ({
  id,
  name,
  secondaryText,
  address,
  notes,
  phone,
  email,
  type,
  favorite,
  typeLabel,
  badgeColor,
  onItemClick,
  onFavoriteToggle,
  onCallClick,
  onEmailClick
}) => {
  const { language } = useLanguage();
  
  return (
    <div 
      key={id} 
      className="p-4 hover:bg-muted/50 transition-colors cursor-pointer animate-fade-in"
      onClick={() => onItemClick(id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{secondaryText}</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant="outline" 
            className={`${badgeColor ? badgeColor : ''}`}
          >
            {typeLabel}
          </Badge>
          
          <div className="flex">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={(e) => onFavoriteToggle(id, e)}
              title={language === 'de' ? 'Favorit umschalten' : 'Toggle favorite'}
              className="transition-transform hover:scale-110"
            >
              {favorite ? (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              ) : (
                <StarOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            
            {phone && onCallClick && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCallClick}
                title={language === 'de' ? 'Anrufen' : 'Call'}
                className="transition-transform hover:scale-110"
              >
                <PhoneCall className="h-4 w-4 text-primary" />
              </Button>
            )}
            
            {email && onEmailClick && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onEmailClick}
                title={language === 'de' ? 'E-Mail senden' : 'Send email'}
                className="transition-transform hover:scale-110"
              >
                <Mail className="h-4 w-4 text-primary" />
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {(address || notes) && (
        <div className="ml-12 mt-1 text-sm text-muted-foreground">
          {address && <div>{address}</div>}
          {notes && <div className="mt-1">{notes}</div>}
        </div>
      )}
    </div>
  );
};

export default CRMListItem;
