
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Languages, CheckCircle, AlertTriangle } from 'lucide-react';

const LanguageStatus = () => {
  const { language, translations, t } = useLanguage();

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
  
  // Get status badge color based on coverage
  const getCoverageBadge = (coverage: number) => {
    if (coverage >= 90) return <Badge className="bg-green-500">{coverage}%</Badge>;
    if (coverage >= 70) return <Badge className="bg-yellow-500">{coverage}%</Badge>;
    return <Badge className="bg-red-500">{coverage}%</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Languages className="mr-2 h-5 w-5" />
          {t('languageSettings') || 'Translation Status'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">{t('overview_main') || 'Overview'}</TabsTrigger>
            <TabsTrigger value="details">{t('details') || 'Details'}</TabsTrigger>
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
                        <Badge variant="outline" className="ml-1 bg-primary/10">
                          {t('currentlySelected') || 'Active'}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {getCoverageBadge(lang.coverage)}
                      <span className="text-sm text-muted-foreground">
                        {lang.translatedCount}/{lang.totalCount}
                      </span>
                    </div>
                  </div>
                  <Progress value={lang.coverage} className="h-2" />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500 mr-1" />
                    {t('missingTranslations') || 'Missing Translations'}
                  </h3>
                  <div className="max-h-[300px] overflow-y-auto text-sm text-muted-foreground">
                    {language !== 'en' && 
                      allTranslationKeys.filter(key => !translations[language as keyof typeof translations][key]).map(key => (
                        <div key={key} className="py-1 border-b flex justify-between items-center">
                          <span className="font-mono">{key}</span>
                          <Badge variant="outline" className="text-xs">
                            {t('missing') || 'Missing'}
                          </Badge>
                        </div>
                      ))
                    }
                    {(language === 'en' || allTranslationKeys.filter(key => !translations[language as keyof typeof translations][key]).length === 0) && (
                      <p className="py-2 italic">{t('noMissingTranslations') || 'No missing translations for current language.'}</p>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                    {t('recentlyAdded') || 'Recently Added'}
                  </h3>
                  <div className="max-h-[300px] overflow-y-auto text-sm text-muted-foreground">
                    {allTranslationKeys.slice(-10).map(key => (
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
