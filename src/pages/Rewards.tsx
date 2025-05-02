
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Award, Star, Sparkles, Zap, Calendar, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRewards } from '@/contexts/RewardsContext';

const Rewards = () => {
  const { t } = useLanguage();
  const { points, rewards, unlockReward, availableRewards } = useRewards();

  const availableRewardsList = availableRewards();
  const unlockedRewards = rewards.filter(reward => reward.unlocked);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            <Award className="inline-block mr-2 h-8 w-8" />
            {t('rewards')}
          </h1>
          <p className="text-muted-foreground">{t('earnPointsUnlockFeatures')}</p>
        </div>
        
        <div className="flex items-center bg-secondary p-3 rounded-lg">
          <Star className="h-6 w-6 text-amber-500 mr-2" />
          <div>
            <p className="font-bold text-2xl">{points}</p>
            <p className="text-xs text-muted-foreground">{t('points')}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('howToEarnPoints')}</CardTitle>
            <CardDescription>{t('completeActionsBelowToEarnRewardPoints')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
                <div>
                  <p className="font-medium">{t('dailyLogin')}</p>
                  <p className="text-xs text-muted-foreground">{t('loginEveryDay')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">+5</p>
                <p className="text-xs text-muted-foreground">{t('points')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
              <div className="flex items-center">
                <Zap className="h-5 w-5 mr-3 text-amber-500" />
                <div>
                  <p className="font-medium">{t('completeProfile')}</p>
                  <p className="text-xs text-muted-foreground">{t('fillOutYourProfile')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">+20</p>
                <p className="text-xs text-muted-foreground">{t('points')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-3 text-emerald-500" />
                <div>
                  <p className="font-medium">{t('provideFeedback')}</p>
                  <p className="text-xs text-muted-foreground">{t('shareYourThoughts')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">+10</p>
                <p className="text-xs text-muted-foreground">{t('points')}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-md bg-muted/50">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 mr-3 text-purple-500" />
                <div>
                  <p className="font-medium">{t('completeEducation')}</p>
                  <p className="text-xs text-muted-foreground">{t('finishEducationModules')}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">+15</p>
                <p className="text-xs text-muted-foreground">{t('perModule')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('yourBadges')}</CardTitle>
            <CardDescription>{t('collectedBadgesAndAchievements')}</CardDescription>
          </CardHeader>
          <CardContent>
            {unlockedRewards.filter(r => r.type === 'badge').length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {unlockedRewards
                  .filter(r => r.type === 'badge')
                  .map(badge => (
                    <div 
                      key={badge.id} 
                      className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <Award className="h-10 w-10 text-amber-500 mb-2" />
                      <p className="font-medium text-center">{badge.name}</p>
                      <p className="text-xs text-muted-foreground text-center">{badge.description}</p>
                    </div>
                  ))
                }
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Award className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">{t('noBadgesYet')}</p>
                <p className="text-xs text-muted-foreground mt-2">{t('unlockBadgesByEarningPoints')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('availableRewards')}</CardTitle>
          <CardDescription>{t('unlockSpecialFeaturesWithPoints')}</CardDescription>
        </CardHeader>
        <CardContent>
          {availableRewardsList.length > 0 ? (
            <div className="space-y-4">
              {availableRewardsList.map(reward => (
                <div 
                  key={reward.id} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start">
                      {reward.type === 'feature' && <Sparkles className="h-5 w-5 mr-2 text-indigo-500 mt-1" />}
                      {reward.type === 'badge' && <Award className="h-5 w-5 mr-2 text-amber-500 mt-1" />}
                      {reward.type === 'theme' && <Zap className="h-5 w-5 mr-2 text-purple-500 mt-1" />}
                      <div>
                        <h3 className="font-medium">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Progress value={(points / reward.points) * 100} className="h-2" />
                      <p className="text-xs mt-1 text-right">
                        {points}/{reward.points} {t('points')}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => unlockReward(reward.id)} 
                    disabled={points < reward.points}
                    className="w-full md:w-auto"
                  >
                    {points >= reward.points ? t('unlock') : t('needMorePoints')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Star className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">{t('allRewardsUnlocked')}</p>
              <p className="text-xs text-muted-foreground mt-2">{t('checkBackLaterForNewRewards')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
