
import React from 'react';
import { useLanguage } from '@/contexts/FixedLanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LanguageStatus = () => {
  const { language, translations } = useLanguage();

  // Get all possible translation keys from English (assumed to be complete)
  const allTranslationKeys = Object.keys(translations.en);
  
  // Calculate coverage for all languages
  const languageCoverage = Object.keys(translations).map(lang => {
    const langObj = translations[lang as keyof typeof translations];
    const translatedCount = Object.keys(langObj).length;
    const coverage = (translatedCount / allTranslationKeys.length) * 100;
    
    return {
      code: lang,
      translatedCount,
      totalCount: allTranslationKeys.length,
      coverage: Math.round(coverage)
    };
  });

  // Get language names
  const getLanguageName = (code: string) => {
    const names: Record<string, string> = {
      en: 'English',
      de: 'German (Deutsch)',
      es: 'Spanish (Español)',
      fr: 'French (Français)',
      it: 'Italian (Italiano)'
    };
    return names[code] || code;
  };

  // Get flag for each language
  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      en: '🇬🇧',
      de: '🇩🇪',
      es: '🇪🇸',
      fr: '🇫🇷',
      it: '🇮🇹'
    };
    return flags[code] || '🌐';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Translation Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              {languageCoverage.map(lang => (
                <div key={lang.code} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span>{getLanguageFlag(lang.code)}</span>
                      <span className="font-medium">{getLanguageName(lang.code)}</span>
                      {lang.code === language && (
                        <Badge variant="outline" className="ml-1 bg-primary/10">Active</Badge>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {lang.translatedCount}/{lang.totalCount} ({lang.coverage}%)
                    </span>
                  </div>
                  <Progress value={lang.coverage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Missing Translations</h3>
                  <div className="text-sm text-muted-foreground">
                    {language !== 'en' && 
                      allTranslationKeys.filter(key => !translations[language as keyof typeof translations][key]).map(key => (
                        <div key={key} className="py-1 border-b">
                          <span className="font-mono">{key}</span>
                        </div>
                      ))
                    }
                    {(language === 'en' || allTranslationKeys.filter(key => !translations[language as keyof typeof translations][key]).length === 0) && (
                      <p>No missing translations for current language.</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Recently Added</h3>
                  <div className="text-sm text-muted-foreground">
                    {allTranslationKeys.slice(-5).map(key => (
                      <div key={key} className="py-1 border-b">
                        <span className="font-mono">{key}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default LanguageStatus;
