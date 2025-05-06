
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertCircle, Clock, User, Download, Filter, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { de, enUS } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Define the security event interface
interface SecurityEvent {
  id: string;
  type: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'critical';
  details: Record<string, any>;
  user?: string;
  device?: string;
  ip?: string;
}

interface SecurityAuditLogProps {
  className?: string;
  maxEvents?: number;
  title?: string;
  showFilters?: boolean;
}

const SecurityAuditLog: React.FC<SecurityAuditLogProps> = ({
  className,
  maxEvents = 50,
  title,
  showFilters = true
}) => {
  const { t, language } = useLanguage();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    severity: 'all',
    type: 'all',
    search: '',
  });
  
  // Mock log fetch - in a real app, this would come from a database
  useEffect(() => {
    const fetchSecurityLogs = async () => {
      setLoading(true);
      
      try {
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Create mock data
        const mockEvents: SecurityEvent[] = [
          {
            id: '1',
            type: 'login',
            timestamp: new Date(Date.now() - 15 * 60000),
            severity: 'info',
            details: { method: 'password', browser: 'Chrome', os: 'Windows' },
            user: 'user@example.com',
            device: 'Desktop',
            ip: '192.168.1.1'
          },
          {
            id: '2',
            type: 'suspicious_activity',
            timestamp: new Date(Date.now() - 120 * 60000),
            severity: 'warning',
            details: { reason: 'Unusual location', expectedLocation: 'Berlin', actualLocation: 'Paris' },
            user: 'user@example.com',
            device: 'Mobile',
            ip: '203.0.113.1'
          },
          {
            id: '3',
            type: 'pin_change',
            timestamp: new Date(Date.now() - 24 * 60 * 60000),
            severity: 'info',
            details: { successful: true },
            user: 'user@example.com',
            device: 'Desktop',
            ip: '192.168.1.1'
          },
          {
            id: '4',
            type: 'login_failure',
            timestamp: new Date(Date.now() - 48 * 60 * 60000),
            severity: 'warning',
            details: { reason: 'Invalid password', attempts: 3 },
            user: 'user@example.com',
            device: 'Unknown',
            ip: '198.51.100.1'
          },
          {
            id: '5',
            type: 'account_locked',
            timestamp: new Date(Date.now() - 72 * 60 * 60000),
            severity: 'critical',
            details: { reason: 'Too many failed login attempts', unlockAfter: '60 minutes' },
            user: 'user@example.com',
            device: 'Unknown',
            ip: '198.51.100.1'
          }
        ];
        
        setEvents(mockEvents);
        setFilteredEvents(mockEvents);
      } catch (error) {
        console.error('Error fetching security logs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSecurityLogs();
  }, []);
  
  // Apply filters
  useEffect(() => {
    let results = [...events];
    
    // Filter by severity
    if (filter.severity !== 'all') {
      results = results.filter(event => event.severity === filter.severity);
    }
    
    // Filter by type
    if (filter.type !== 'all') {
      results = results.filter(event => event.type === filter.type);
    }
    
    // Search
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(event => 
        event.type.toLowerCase().includes(searchLower) ||
        event.user?.toLowerCase().includes(searchLower) ||
        event.ip?.includes(searchLower) ||
        JSON.stringify(event.details).toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredEvents(results);
  }, [filter, events]);
  
  // Get event types for filter
  const eventTypes = Array.from(new Set(events.map(event => event.type)));
  
  // Format relative time
  const getRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return t('justNow');
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return language === 'de' 
        ? `vor ${minutes} ${minutes === 1 ? 'Minute' : 'Minuten'}`
        : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return language === 'de'
        ? `vor ${hours} ${hours === 1 ? 'Stunde' : 'Stunden'}`
        : `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const dateLocale = language === 'de' ? de : enUS;
      return format(date, 'PPp', { locale: dateLocale });
    }
  };
  
  // Event type to human readable name
  const getEventName = (type: string) => {
    const eventNames = {
      login: t('login'),
      logout: t('logout'),
      pin_change: t('pinChange'),
      password_change: t('passwordChange'),
      suspicious_activity: t('suspiciousActivity'),
      login_failure: t('loginFailure'),
      permission_change: t('permissionChange'),
      account_locked: t('accountLocked')
    };
    
    return eventNames[type as keyof typeof eventNames] || type;
  };
  
  // Get severity badge variant
  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'info': return 'default';
      case 'warning': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };
  
  // Handle export logs
  const handleExport = () => {
    try {
      // Convert events to CSV
      const replacer = (key: string, value: any) => value === null ? '' : value;
      const header = ['Type', 'Timestamp', 'Severity', 'User', 'IP', 'Device', 'Details'];
      
      const csv = filteredEvents.map(event => [
        event.type,
        format(event.timestamp, 'yyyy-MM-dd HH:mm:ss'),
        event.severity,
        event.user || '',
        event.ip || '',
        event.device || '',
        JSON.stringify(event.details)
      ]);
      
      const csvArray = [header, ...csv];
      const csvContent = csvArray.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `security-logs-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.click();
      
    } catch (error) {
      console.error('Error exporting logs:', error);
    }
  };
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            {title || t('securityAuditLog')}
          </div>
          {!loading && filteredEvents.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-1" />
              {t('export')}
            </Button>
          )}
        </CardTitle>
        <CardDescription>{t('securityAuditLogDescription')}</CardDescription>
      </CardHeader>
      
      <CardContent>
        {showFilters && (
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('search')}
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  className="pl-8"
                />
              </div>
            </div>
            
            <Select value={filter.severity} onValueChange={(value) => setFilter({ ...filter, severity: value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('severity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                <SelectItem value="info">{t('info')}</SelectItem>
                <SelectItem value="warning">{t('warning')}</SelectItem>
                <SelectItem value="critical">{t('critical')}</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filter.type} onValueChange={(value) => setFilter({ ...filter, type: value })}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t('eventType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('all')}</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>{getEventName(type)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        
        {loading ? (
          <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
            <div className="animate-spin mb-2">
              <Clock className="h-8 w-8" />
            </div>
            <p>{t('loadingSecurityLogs')}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p>{t('noSecurityEventsFound')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.slice(0, maxEvents).map((event) => (
              <div key={event.id} className="border rounded-md p-3">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <Badge variant={getSeverityVariant(event.severity) as any}>
                      {t(event.severity)}
                    </Badge>
                    <span className="ml-2 font-medium">{getEventName(event.type)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {getRelativeTime(event.timestamp)}
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {event.user && (
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground/70" />
                      <span>{event.user}</span>
                      {event.ip && <span className="text-muted-foreground/70">({event.ip})</span>}
                    </div>
                  )}
                  
                  {event.details && (
                    <div className="mt-1 text-xs">
                      {Object.entries(event.details).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="font-medium">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredEvents.length > maxEvents && (
          <div className="mt-4 text-center">
            <Button variant="link" size="sm" onClick={() => setFilter({ ...filter })}>
              {t('showMore')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SecurityAuditLog;
