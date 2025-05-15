
import React, { useEffect } from 'react';
import AppLockScreen from '@/components/AppLockScreen';
import { useNavigate } from 'react-router-dom';
import { useAppLock } from '@/contexts/AppLockContext';

const LockedPage: React.FC = () => {
  const { isLocked, pin } = useAppLock();
  const navigate = useNavigate();
  
  // Redirect to dashboard if not locked or no PIN is set
  useEffect(() => {
    if (!isLocked || !pin) {
      navigate('/dashboard');
    }
  }, [isLocked, pin, navigate]);
  
  return (
    <AppLockScreen />
  );
};

export default LockedPage;
