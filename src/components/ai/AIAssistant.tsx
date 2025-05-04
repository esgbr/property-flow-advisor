
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles, MessageSquarePlus, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AIAssistantProps {
  contextData?: any;
  title?: string;
  description?: string;
  variant?: 'default' | 'icon';
  size?: 'sm' | 'md' | 'lg';
}

const AIAssistant: React.FC<AIAssistantProps> = ({
  contextData,
  title,
  description,
  variant = 'default',
  size = 'md',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [insights, setInsights] = useState<string[] | null>(null);
  const { t } = useLanguage();

  const handleGenerate = () => {
    setIsGenerating(true);
    
    // Simulate AI response generation
    setTimeout(() => {
      setInsights([
        t('increasedCashflowOpportunity'),
        t('portfolioDiversificationRecommendation'),
        t('refinancingOpportunityDetected'),
        t('propertyAppreciationTrend'),
      ]);
      setIsGenerating(false);
    }, 2000);
  };

  // Size styling
  const sizeStyles = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };

  // Variant rendering
  const renderButton = () => {
    if (variant === 'icon') {
      return (
        <Button
          variant="secondary"
          size="icon"
          onClick={() => setIsOpen(true)}
          className={sizeStyles[size]}
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      );
    }

    return (
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Sparkles className="h-4 w-4" />
        {t('generateInsights')}
      </Button>
    );
  };

  return (
    <>
      {renderButton()}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Sparkles className="mr-2 h-5 w-5 text-primary" />
              {title || t('aiPortfolioInsights')}
            </DialogTitle>
            <DialogDescription>
              {description || t('aiPortfolioInsightsDescription')}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {!insights ? (
              <div className="flex flex-col items-center justify-center p-8 gap-4 text-center">
                <MessageSquarePlus className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">{t('generateAIInsightsPrompt')}</p>
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating}
                  className="mt-2"
                >
                  {isGenerating ? t('generating') : t('generateInsights')}
                  {isGenerating && (
                    <div className="ml-2 animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-md bg-primary/5">
                    <Check className="h-5 w-5 text-primary mt-0.5" />
                    <p className="text-sm">{insight}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t('close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
