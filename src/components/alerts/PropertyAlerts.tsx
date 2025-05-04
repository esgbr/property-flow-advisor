
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, Bell, AlertTriangle, Clock, Calendar, DollarSign, Info, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AlertItem {
  id: string;
  type: 'warning' | 'info' | 'success';
  title: string;
  description: string;
  date: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
}

const PropertyAlerts: React.FC = () => {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alert-1',
      type: 'warning',
      title: t('Mortgage Payment Due'),
      description: t('Your mortgage payment for 123 Main St is due in 3 days.'),
      date: '2025-05-07',
      read: false,
      actionUrl: '/properties/123',
      actionText: t('View Property')
    },
    {
      id: 'alert-2',
      type: 'info',
      title: t('Property Tax Assessment'),
      description: t('New property tax assessment for 456 Elm St has been released.'),
      date: '2025-05-03',
      read: true,
      actionUrl: '/properties/456',
      actionText: t('Review Assessment')
    },
    {
      id: 'alert-3',
      type: 'success',
      title: t('Rent Payment Received'),
      description: t('Rent payment for 789 Oak Ave has been received on time.'),
      date: '2025-05-02',
      read: false,
      actionUrl: '/properties/789',
      actionText: t('View Details')
    }
  ]);

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const dismissAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(alert => ({ ...alert, read: true })));
  };

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const getAlertIcon = (type: string) => {
    switch(type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-primary mr-2" />
          <div>
            <CardTitle>{t('Property Alerts')}</CardTitle>
            <CardDescription>
              {t('Important notifications for your properties')}
            </CardDescription>
          </div>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
            {t('Mark All as Read')}
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-10 w-10 mx-auto mb-2 opacity-20" />
            <p>{t('No alerts at this time')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map(alert => (
              <Alert 
                key={alert.id} 
                variant="default" 
                className={`transition-all ${alert.read ? 'opacity-70' : 'border-l-4'} ${
                  alert.type === 'warning' ? 'border-l-amber-500' : 
                  alert.type === 'success' ? 'border-l-green-500' : 
                  'border-l-blue-500'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-2">
                    {getAlertIcon(alert.type)}
                    <div>
                      <AlertTitle>{alert.title}</AlertTitle>
                      <AlertDescription>{alert.description}</AlertDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={() => dismissAlert(alert.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{alert.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs px-2" 
                        onClick={() => markAsRead(alert.id)}
                      >
                        {t('Mark as Read')}
                      </Button>
                    )}
                    {alert.actionUrl && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs" 
                        onClick={() => window.location.href = alert.actionUrl!}
                      >
                        {alert.actionText}
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertyAlerts;
