
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppLockScreen from '@/components/AppLockScreen';

const LockedPage: React.FC = () => {
  return (
    <Router>
      <AppLockScreen />
    </Router>
  );
};

export default LockedPage;
