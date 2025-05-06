// Fix password strength typing issues
import React from 'react';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';

export interface PasswordStrength {
  score: number;
  feedback: string;
  suggestions: string[];
}

// Mock password strength checker function
export const checkPasswordStrength = (password: string): PasswordStrength => {
  // In a real app, this would use a library like zxcvbn
  const length = password.length;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  // Calculate score (0-4)
  let score = 0;
  if (length > 8) score += 1;
  if (hasUppercase) score += 1;
  if (hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;
  
  // Get feedback
  let feedback = '';
  const suggestions: string[] = [];
  
  if (score < 2) {
    feedback = 'Weak password';
    if (!hasUppercase) suggestions.push('Add uppercase letters');
    if (!hasLowercase) suggestions.push('Add lowercase letters');
    if (!hasNumber) suggestions.push('Add numbers');
    if (!hasSpecial) suggestions.push('Add special characters');
    if (length < 8) suggestions.push('Make it longer');
  } else if (score < 4) {
    feedback = 'Moderate password';
    if (!hasUppercase) suggestions.push('Add uppercase letters for stronger password');
    if (!hasSpecial) suggestions.push('Add special characters for stronger password');
  } else {
    feedback = 'Strong password';
  }
  
  return { score, feedback, suggestions };
};

export const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    suggestions: []
  });
  
  React.useEffect(() => {
    if (password) {
      const result = checkPasswordStrength(password);
      setStrength({
        score: result.score,
        feedback: result.feedback,
        suggestions: result.suggestions
      });
    } else {
      setStrength({
        score: 0,
        feedback: '',
        suggestions: []
      });
    }
  }, [password]);
  
  const getStrengthColor = () => {
    switch (strength.score) {
      case 0:
      case 1:
        return 'bg-red-500';
      case 2:
      case 3:
        return 'bg-yellow-500';
      case 4:
      case 5:
        return 'bg-green-500';
      default:
        return 'bg-gray-200';
    }
  };
  
  const getStrengthPercent = () => {
    return (strength.score / 5) * 100;
  };
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{strength.feedback}</span>
        <span>{strength.score}/5</span>
      </div>
      <Progress value={getStrengthPercent()} className="h-2" />
      {strength.suggestions.length > 0 && (
        <div className="text-sm text-muted-foreground">
          <ul className="list-disc pl-5">
            {strength.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Security utility functions for the application
export const generateSecureToken = (length: number = 32): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let result = '';
  const charactersLength = characters.length;
  
  // Create a Uint8Array with the required number of random values
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  
  // Use the random values to select characters
  for (let i = 0; i < length; i++) {
    result += characters.charAt(randomValues[i] % charactersLength);
  }
  
  return result;
};

export const hashData = async (data: string): Promise<string> => {
  // In a real app, this would use a proper hashing algorithm
  // This is a simplified example using the Web Crypto API
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

export const detectSecurityRisks = (userData: any): string[] => {
  const risks: string[] = [];
  
  // Check for common security risks
  if (!userData.emailVerified) {
    risks.push('Email not verified');
  }
  
  if (!userData.twoFactorEnabled) {
    risks.push('Two-factor authentication not enabled');
  }
  
  if (userData.lastPasswordChange) {
    const lastChange = new Date(userData.lastPasswordChange);
    const now = new Date();
    const daysSinceChange = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceChange > 90) {
      risks.push('Password not changed in over 90 days');
    }
  }
  
  return risks;
};

export const formatSecurityScore = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
};

export const calculateSecurityScore = (userData: any): number => {
  let score = 100;
  const risks = detectSecurityRisks(userData);
  
  // Deduct points for each security risk
  score -= risks.length * 15;
  
  // Bonus points for security measures
  if (userData.twoFactorEnabled) score += 10;
  if (userData.strongPassword) score += 10;
  if (userData.recentLogin) score += 5;
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};
