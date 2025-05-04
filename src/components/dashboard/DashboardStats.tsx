
import React, { memo } from 'react';
import { useComponentPerformance } from '@/utils/performanceUtils';
import StatCard from '@/components/ui/stat-card';
import { Building, Home, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DashboardStatsProps {
  loading?: boolean;
  className?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ loading = false, className = '' }) => {
  useComponentPerformance('DashboardStats');
  const { t } = useLanguage();
  
  // Example stats data - in a real app this would come from an API
  const stats = [
    {
      title: t('Total Properties'),
      value: 12,
      change: 8.5,
      icon: <Building className="h-4 w-4" />,
      description: t('From previous month')
    },
    {
      title: t('Average Yield'),
      value: '5.2',
      suffix: '%',
      change: 0.3,
      icon: <TrendingUp className="h-4 w-4" />,
      description: t('From previous month')
    },
    {
      title: t('Active Tenants'),
      value: 26,
      change: 4.0,
      icon: <Users className="h-4 w-4" />,
      description: t('From previous month')
    },
    {
      title: t('Monthly Income'),
      value: '24,500',
      prefix: '€',
      change: 7.2,
      icon: <DollarSign className="h-4 w-4" />,
      description: t('From previous month')
    },
    {
      title: t('Portfolio Value'),
      value: '2.4',
      prefix: '€',
      suffix: 'M',
      change: 3.1,
      icon: <BarChart3 className="h-4 w-4" />,
      description: t('From previous month')
    },
    {
      title: t('Market Opportunities'),
      value: 8,
      change: -2.5,
      icon: <Home className="h-4 w-4" />,
      description: t('From previous month')
    }
  ];

  if (loading) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted/30 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          change={stat.change}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default memo(DashboardStats);
