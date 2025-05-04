
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface AIAssistantProps {
  variant?: 'icon' | 'button';
  size?: 'sm' | 'default' | 'lg'; // Changed 'md' to 'default' to match Button component's allowed size values
  contextData?: Record<string, any>;
  title?: string;
  description?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  variant = 'button',
  size = 'default', // Using 'default' instead of 'md'
  contextData = {},
  title,
  description
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // Simulate AI analysis
  const generateInsightsAndRecommendations = () => {
    setIsLoading(true);
    
    // In a real application, you would send the contextData to an AI service
    // and get back insights and recommendations
    setTimeout(() => {
      setInsights([
        'Your portfolio shows strong annual ROI at 7.2%, above market average of 6.3%.',
        'Cash flow positive across all properties with €12,500 monthly net income.',
        'Your debt-to-equity ratio is 1.63, slightly above recommended 1.5.',
        'Portfolio is currently concentrated in residential properties (78%).'
      ]);
      
      setRecommendations([
        'Consider refinancing options for 2 properties to reduce overall loan costs.',
        'Diversify with 1-2 commercial properties to balance portfolio allocation.',
        'Set aside 3-5% of portfolio value for maintenance reserves.',
        'Review insurance coverage - current policy may be insufficient for portfolio size.'
      ]);
      
      setIsLoading(false);
    }, 2000);
  };

  // Handle dialog open
  const handleOpen = () => {
    setIsOpen(true);
    if (insights.length === 0) {
      generateInsightsAndRecommendations();
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <Button 
          onClick={handleOpen}
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 rounded-full"
        >
          <Sparkles className="h-4 w-4" />
          <span className="sr-only">AI Assistant</span>
        </Button>
      ) : (
        <Button 
          onClick={handleOpen}
          variant="outline" 
          size={size} 
          className="flex items-center"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {t('aiInsights')}
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-primary" />
              {title || t('portfolioInsights')}
            </DialogTitle>
            <DialogDescription>
              {description || t('aiGeneratedPortfolioAnalysis')}
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-pulse flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <div className="text-sm">{t('analyzingYourPortfolio')}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Badge variant="outline" className="mr-2">AI</Badge>
                  {t('portfolioInsights')}
                </h3>
                <ul className="space-y-2">
                  {insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span className="text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Badge variant="outline" className="mr-2">AI</Badge>
                  {t('recommendedActions')}
                </h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-primary">•</span>
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-xs text-muted-foreground border-t pt-2 mt-4">
                {t('aiDisclaimer')}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setIsOpen(false)}>{t('close')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AIAssistant;
