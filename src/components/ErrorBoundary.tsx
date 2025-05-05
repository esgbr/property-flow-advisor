
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useAccessibility } from './accessibility/A11yProvider';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ErrorBoundary needs to be a class component
class ErrorBoundaryClass extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public resetError = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/'; // Redirect to home page
  };

  public render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

// Separate component for error display to use hooks
const ErrorDisplay: React.FC<{
  error: Error | null;
  resetError: () => void;
}> = ({ error, resetError }) => {
  // We can use hooks in this functional component
  const { highContrast, largeText } = useAccessibility();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className={`
        max-w-md w-full p-6 rounded-lg shadow-lg 
        ${highContrast ? 'border-2 border-destructive bg-background' : 'bg-card border border-border'}
      `}>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          
          <h1 className={`font-bold text-destructive ${largeText ? 'text-2xl' : 'text-xl'}`}>
            Something went wrong
          </h1>
          
          <p className={`text-muted-foreground ${largeText ? 'text-base' : 'text-sm'}`}>
            We're sorry, but an error has occurred. Our team has been notified.
          </p>
          
          {error && (
            <div className={`
              w-full p-4 rounded bg-destructive/5 text-left overflow-auto
              ${highContrast ? 'border border-destructive' : ''}
            `}>
              <p className={`font-mono ${largeText ? 'text-sm' : 'text-xs'}`}>
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className={highContrast ? 'border-2' : ''}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reload page
            </Button>
            
            <Button onClick={resetError} className={highContrast ? 'border border-primary-foreground' : ''}>
              Return home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Use a wrapper to combine the class component with hooks
const ErrorBoundary: React.FC<Props> = ({ children }) => {
  return <ErrorBoundaryClass>{children}</ErrorBoundaryClass>;
};

export default ErrorBoundary;
