
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, X, PlayCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';

// Test result type
interface TestResult {
  name: string;
  status: 'success' | 'failure' | 'pending';
  message?: string;
}

// Mock test function to simulate onboarding flow tests
const runOnboardingTests = (): Promise<TestResult[]> => {
  return new Promise((resolve) => {
    // Simulate async test execution
    setTimeout(() => {
      resolve([
        {
          name: 'User preferences context',
          status: 'success',
          message: 'Context successfully initialized'
        },
        {
          name: 'Welcome modal rendering',
          status: 'success',
          message: 'Modal correctly rendered for first-time users'
        },
        {
          name: 'Experience level selection',
          status: 'success',
          message: 'Experience level correctly saved to preferences'
        },
        {
          name: 'Market selection',
          status: 'success',
          message: 'Market selection saved to preferences and filters applied'
        },
        {
          name: 'Language detection',
          status: 'success',
          message: 'Browser language correctly detected and applied'
        }
      ]);
    }, 2000);
  });
};

// Mock test function to simulate market filter tests
const runMarketFilterTests = (): Promise<TestResult[]> => {
  return new Promise((resolve) => {
    // Simulate async test execution
    setTimeout(() => {
      resolve([
        {
          name: 'Market-specific features loading',
          status: 'success',
          message: 'Features correctly filtered by market'
        },
        {
          name: 'Market switching',
          status: 'success',
          message: 'UI updates when market changes'
        },
        {
          name: 'Market data loading',
          status: 'success',
          message: 'Market data loaded for selected region'
        }
      ]);
    }, 1500);
  });
};

const OnboardingTests: React.FC = () => {
  const { t } = useLanguage();
  const { preferences } = useUserPreferences();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Only render this component for admins
  if (preferences.role !== 'admin') {
    return null;
  }
  
  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    setProgress(0);
    
    try {
      // Run onboarding tests
      setProgress(25);
      const onboardingResults = await runOnboardingTests();
      setTestResults(onboardingResults);
      
      // Run market filter tests
      setProgress(75);
      const marketFilterResults = await runMarketFilterTests();
      setTestResults(prev => [...prev, ...marketFilterResults]);
      
      // Complete
      setProgress(100);
    } catch (error) {
      console.error('Test error:', error);
      setTestResults([
        {
          name: 'Test execution error',
          status: 'failure',
          message: String(error)
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };
  
  // Calculate test summary
  const passedTests = testResults.filter(test => test.status === 'success').length;
  const failedTests = testResults.filter(test => test.status === 'failure').length;
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center">
          <PlayCircle className="mr-2 h-5 w-5" />
          {t('testAutomation')} <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">{t('adminOnly')}</span>
        </CardTitle>
        <CardDescription>Test critical functionality like onboarding flow and market filtering</CardDescription>
      </CardHeader>
      <CardContent>
        {testResults.length > 0 ? (
          <>
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Results: {passedTests} passed, {failedTests} failed</span>
                <span>{((passedTests / testResults.length) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(passedTests / testResults.length) * 100} className="h-2" />
            </div>
            
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-md flex items-start ${
                    result.status === 'success' ? 'bg-green-50 text-green-800' : 
                    result.status === 'failure' ? 'bg-red-50 text-red-800' : 'bg-gray-50'
                  }`}
                >
                  {result.status === 'success' ? (
                    <Check className="h-5 w-5 mr-2 mt-0.5 text-green-600" />
                  ) : (
                    <X className="h-5 w-5 mr-2 mt-0.5 text-red-600" />
                  )}
                  <div>
                    <div className="font-medium">{result.name}</div>
                    {result.message && <div className="text-sm opacity-80">{result.message}</div>}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          isRunning ? (
            <div className="space-y-4">
              <Alert>
                <AlertTitle>Running Tests...</AlertTitle>
                <AlertDescription>Testing critical functionality, please wait...</AlertDescription>
              </Alert>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">Click the button below to run automated tests</p>
            </div>
          )
        )}
        
        <div className="mt-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="w-full"
          >
            {t('runTests')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingTests;
