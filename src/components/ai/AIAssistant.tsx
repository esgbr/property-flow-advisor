
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIAssistantProps {
  variant?: 'icon' | 'button';
  contextData?: Record<string, any>;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  description?: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  variant = 'button',
  contextData = {},
  size = 'md',
  title,
  description,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { preferences } = useUserPreferences();
  
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // For a production app, you would connect to an actual AI service
  const mockAIResponse = async (question: string): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (question.toLowerCase().includes('market')) {
      return `Based on current trends, the real estate market is showing signs of stabilization after the recent fluctuations. 
      For your experience level (${preferences.experienceLevel}), I would recommend focusing on residential properties in growing suburban areas with good infrastructure development plans.`;
    }
    
    if (question.toLowerCase().includes('invest') || question.toLowerCase().includes('property')) {
      return `For ${preferences.experienceLevel} investors, I recommend starting with properties that align with your goals (${preferences.investmentGoals.join(', ')}).
      Based on your preferences, you might want to look at ${preferences.preferredPropertyTypes.join(', ')} properties.`;
    }
    
    return `Thank you for your question. As your AI investment advisor, I'd recommend reviewing our educational materials in the ${preferences.experienceLevel} section that match your goals. Would you like me to recommend specific resources?`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      // In a real implementation, this would call an actual AI API with contextData
      const aiResponse = await mockAIResponse(input);
      const assistantMessage: Message = { role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: t('errorOccurred'),
        description: t('couldNotGetResponse'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button variant="ghost" size="icon" className="rounded-full">
            <Sparkles className={`h-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} w-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'}`} />
          </Button>
        ) : (
          <Button variant="outline" size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}>
            <Sparkles className="mr-2 h-4 w-4" />
            {t('aiAssistant')}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title || t('aiInvestmentAssistant')}</DialogTitle>
          <DialogDescription>{description || t('askMeAnythingAboutRealEstateInvestments')}</DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 max-h-[50vh] overflow-y-auto p-2">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {t('startConversation')}
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground ml-8'
                    : 'bg-muted text-foreground mr-8'
                }`}
              >
                {message.content}
              </div>
            ))
          )}
        </div>
        
        <div className="flex items-end space-x-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('typeYourQuestion')}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            size="icon"
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <p className="text-xs text-muted-foreground">{t('aiAssistantDisclaimer')}</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIAssistant;
