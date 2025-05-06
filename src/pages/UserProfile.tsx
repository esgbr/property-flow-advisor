
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Building, PieChart, Clock, Save, FileText } from 'lucide-react';
import { toast } from 'sonner';

const UserProfile = () => {
  const { language } = useLanguage();
  const { preferences, updatePreferences } = useUserPreferences();
  
  const [profileData, setProfileData] = React.useState({
    name: preferences.name || '',
    email: 'user@example.com',
    phone: '',
    location: '',
    bio: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = () => {
    updatePreferences({ name: profileData.name });
    toast.success(language === 'de' ? 'Profil aktualisiert!' : 'Profile updated!');
  };

  // Calculate experience level for display
  const getExperienceBadge = () => {
    switch (preferences.experienceLevel) {
      case 'beginner':
        return { label: language === 'de' ? 'Anfänger' : 'Beginner', color: 'bg-blue-100 text-blue-800' };
      case 'intermediate':
        return { label: language === 'de' ? 'Fortgeschritten' : 'Intermediate', color: 'bg-green-100 text-green-800' };
      case 'advanced':
        return { label: language === 'de' ? 'Erfahren' : 'Advanced', color: 'bg-yellow-100 text-yellow-800' };
      case 'expert':
        return { label: language === 'de' ? 'Experte' : 'Expert', color: 'bg-purple-100 text-purple-800' };
      default:
        return { label: language === 'de' ? 'Anfänger' : 'Beginner', color: 'bg-blue-100 text-blue-800' };
    }
  };
  
  const experienceBadge = getExperienceBadge();

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <User className="h-8 w-8 mr-2" />
        {language === 'de' ? 'Benutzerprofil' : 'User Profile'}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-3xl">
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-center mt-4">{profileData.name || 'User'}</CardTitle>
              <CardDescription className="text-center">
                <Badge className={`${experienceBadge.color} mt-2`}>
                  {experienceBadge.label}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {language === 'de' ? 'Portfolio: ' : 'Portfolio: '} 3 {language === 'de' ? 'Immobilien' : 'properties'}
                </span>
              </div>
              <div className="flex items-center">
                <PieChart className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {language === 'de' ? 'Ø ROI: 6.2%' : 'Avg. ROI: 6.2%'}
                </span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  {language === 'de' ? 'Mitglied seit: Jan 2023' : 'Member since: Jan 2023'}
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => toast.info(language === 'de' ? 'Funktion kommt bald!' : 'Feature coming soon!')}>
                <FileText className="h-4 w-4 mr-2" />
                {language === 'de' ? 'Portfolio anzeigen' : 'View Portfolio'}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Persönliche Informationen' : 'Personal Information'}</CardTitle>
              <CardDescription>
                {language === 'de' ? 'Bearbeiten Sie Ihre Profilinformationen' : 'Edit your profile information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  <User className="h-4 w-4 inline mr-2" />
                  {language === 'de' ? 'Name' : 'Name'}
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={profileData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  {language === 'de' ? 'E-Mail' : 'Email'}
                </Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  value={profileData.email} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="h-4 w-4 inline mr-2" />
                    {language === 'de' ? 'Telefon' : 'Phone'}
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={profileData.phone} 
                    onChange={handleInputChange} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    {language === 'de' ? 'Standort' : 'Location'}
                  </Label>
                  <Input 
                    id="location" 
                    name="location" 
                    value={profileData.location} 
                    onChange={handleInputChange} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">
                  {language === 'de' ? 'Über mich' : 'About Me'}
                </Label>
                <textarea 
                  id="bio"
                  name="bio"
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  value={profileData.bio}
                  onChange={handleInputChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                {language === 'de' ? 'Abbrechen' : 'Cancel'}
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                {language === 'de' ? 'Speichern' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{language === 'de' ? 'Investitionspräferenzen' : 'Investment Preferences'}</CardTitle>
              <CardDescription>
                {language === 'de' ? 'Ihre aktuellen Investitionspräferenzen' : 'Your current investment preferences'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Bevorzugte Märkte' : 'Preferred Markets'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {preferences.investmentMarket === 'germany' ? 'Deutschland' : 
                     preferences.investmentMarket === 'austria' ? 'Österreich' : 
                     preferences.investmentMarket === 'usa' ? 'USA' : 'Global'}
                  </Badge>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-2">
                  {language === 'de' ? 'Investitionsziele' : 'Investment Goals'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(preferences.investmentGoals || []).map((goal, index) => (
                    <Badge key={index} variant="secondary">{goal}</Badge>
                  ))}
                  {(!preferences.investmentGoals || preferences.investmentGoals.length === 0) && (
                    <span className="text-sm text-muted-foreground">
                      {language === 'de' ? 'Keine Ziele festgelegt' : 'No goals set'}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => toast.info(language === 'de' ? 'Onboarding-Reset in den Einstellungen verfügbar!' : 'Onboarding reset available in Settings!')}>
                {language === 'de' ? 'Präferenzen aktualisieren' : 'Update Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
