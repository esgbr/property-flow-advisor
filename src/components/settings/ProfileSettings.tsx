
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { t } = useLanguage();
  const [name, setName] = useState(preferences.name || '');
  const [email, setEmail] = useState(preferences.email || '');
  
  const handleSave = () => {
    updatePreferences({
      name,
      email
    });
    
    toast.success(t('profileUpdated'));
  };
  
  // Get initials for avatar
  const getInitials = () => {
    if (name) {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return 'U';
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profileSettings')}</CardTitle>
        <CardDescription>{t('manageYourProfileInformation')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={preferences.profileImage} />
            <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>{t('saveChanges')}</Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileSettings;
