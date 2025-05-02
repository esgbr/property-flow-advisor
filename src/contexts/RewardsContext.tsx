
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  unlocked: boolean;
  type: 'feature' | 'badge' | 'theme';
}

interface RewardsContextType {
  points: number;
  rewards: Reward[];
  addPoints: (points: number, reason?: string) => void;
  unlockReward: (id: string) => boolean;
  hasUnlockedReward: (id: string) => boolean;
  availableRewards: () => Reward[];
}

const defaultRewards: Reward[] = [
  {
    id: 'advanced-analytics',
    name: 'Advanced Analytics',
    description: 'Access to detailed property analytics and market insights',
    points: 100,
    unlocked: false,
    type: 'feature'
  },
  {
    id: 'ai-consultant',
    name: 'AI Investment Consultant',
    description: 'Get personalized advice from our AI investment consultant',
    points: 200,
    unlocked: false,
    type: 'feature'
  },
  {
    id: 'document-scanner',
    name: 'Document Scanner',
    description: 'Scan and digitize property documents with AI processing',
    points: 300,
    unlocked: false,
    type: 'feature'
  },
  {
    id: 'dark-theme',
    name: 'Dark Theme Pro',
    description: 'Access to premium dark theme settings',
    points: 50,
    unlocked: false,
    type: 'theme'
  },
  {
    id: 'property-guru',
    name: 'Property Guru',
    description: 'Badge recognizing your property expertise',
    points: 150,
    unlocked: false,
    type: 'badge'
  }
];

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [points, setPoints] = useState<number>(0);
  const [rewards, setRewards] = useState<Reward[]>(defaultRewards);
  const { toast } = useToast();

  // Load rewards and points from localStorage on component mount
  useEffect(() => {
    const storedPoints = localStorage.getItem('rewardPoints');
    const storedRewards = localStorage.getItem('userRewards');

    if (storedPoints) {
      setPoints(JSON.parse(storedPoints));
    }

    if (storedRewards) {
      setRewards(JSON.parse(storedRewards));
    }
  }, []);

  // Save rewards and points to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('rewardPoints', JSON.stringify(points));
    localStorage.setItem('userRewards', JSON.stringify(rewards));
  }, [points, rewards]);

  const addPoints = (amount: number, reason?: string) => {
    setPoints(prev => prev + amount);
    toast({
      title: `+ ${amount} points earned!`,
      description: reason || 'Keep up the good work!',
      duration: 3000,
    });
  };

  const unlockReward = (id: string): boolean => {
    const reward = rewards.find(r => r.id === id && !r.unlocked);
    
    if (!reward) {
      return false;
    }

    if (points >= reward.points) {
      setRewards(prev => prev.map(r => r.id === id ? { ...r, unlocked: true } : r));
      setPoints(prev => prev - reward.points);
      
      toast({
        title: 'Reward Unlocked!',
        description: `You've unlocked: ${reward.name}`,
        duration: 5000,
      });
      
      return true;
    }
    
    toast({
      title: 'Not enough points',
      description: `You need ${reward.points - points} more points to unlock this reward`,
      variant: 'destructive',
      duration: 3000,
    });
    
    return false;
  };

  const hasUnlockedReward = (id: string): boolean => {
    const reward = rewards.find(r => r.id === id);
    return reward ? reward.unlocked : false;
  };

  const availableRewards = (): Reward[] => {
    return rewards.filter(r => !r.unlocked);
  };

  return (
    <RewardsContext.Provider value={{
      points,
      rewards,
      addPoints,
      unlockReward,
      hasUnlockedReward,
      availableRewards
    }}>
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = (): RewardsContextType => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
};
