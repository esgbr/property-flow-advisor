
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRewards } from '@/contexts/RewardsContext';
import ReCAPTCHA from "react-google-recaptcha";

interface FeedbackModalProps {
  variant?: 'icon' | 'button';
  size?: 'sm' | 'md' | 'lg';
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ 
  variant = 'button',
  size = 'md',
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { addPoints } = useRewards();
  
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [loading, setLoading] = useState(false);
  const [feedbackCount, setFeedbackCount] = useState(
    Number(localStorage.getItem('dailyFeedbackCount') || '0')
  );
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const handleSubmit = async () => {
    if (feedback.length < 30) {
      toast({
        title: t('feedbackTooShort'),
        description: t('feedbackMinCharacters'),
        variant: 'destructive',
      });
      return;
    }

    if (feedbackCount >= 3 && !captchaVerified) {
      setShowCaptcha(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would send the feedback to a server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Increase the feedback count
      const newCount = feedbackCount + 1;
      setFeedbackCount(newCount);
      localStorage.setItem('dailyFeedbackCount', newCount.toString());
      
      // Reset the form
      setFeedback('');
      setCaptchaVerified(false);
      
      // Close the modal
      setOpen(false);
      
      // Reward points for giving feedback
      addPoints(10, t('thankYouForYourFeedback'));
      
      toast({
        title: t('feedbackSubmitted'),
        description: t('thankYouForYourFeedback'),
      });
      
      // Reset feedback count at the end of the day
      const now = new Date();
      const endOfDay = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59, 999
      );
      
      const timeToEndOfDay = endOfDay.getTime() - now.getTime();
      
      setTimeout(() => {
        localStorage.setItem('dailyFeedbackCount', '0');
        setFeedbackCount(0);
      }, timeToEndOfDay);
    } catch (error) {
      toast({
        title: t('errorOccurred'),
        description: t('couldNotSubmitFeedback'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setCaptchaVerified(true);
      setShowCaptcha(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === 'icon' ? (
          <Button variant="ghost" size="icon" className="rounded-full">
            <MessageSquare className={`h-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} w-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'}`} />
          </Button>
        ) : (
          <Button variant="outline" size={size === 'sm' ? 'sm' : size === 'lg' ? 'lg' : 'default'}>
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('feedback')}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shareFeedback')}</DialogTitle>
          <DialogDescription>{t('helpUsImprove')}</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="feedback-category" className="text-sm font-medium">
              {t('category')}
            </label>
            <select
              id="feedback-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="general">{t('general')}</option>
              <option value="bug">{t('bugReport')}</option>
              <option value="feature">{t('featureRequest')}</option>
              <option value="improvement">{t('improvement')}</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="feedback-text" className="text-sm font-medium">
              {t('yourFeedback')}
            </label>
            <Textarea
              id="feedback-text"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder={t('pleaseShareYourThoughts')}
              className="min-h-32"
            />
            <p className={`text-xs ${feedback.length < 30 ? 'text-destructive' : 'text-muted-foreground'}`}>
              {feedback.length}/30 {t('minimumCharactersRequired')}
            </p>
          </div>
          
          {showCaptcha && (
            <div className="flex justify-center my-4">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key (will show test checkbox)
                onChange={handleCaptchaChange}
              />
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading || feedback.length < 30}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {t('submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
